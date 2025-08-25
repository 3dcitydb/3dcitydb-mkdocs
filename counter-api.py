#!/usr/bin/env python3
"""
Simple Page Counter API

A lightweight, privacy-friendly counter service that can be deployed
alongside the 3DCityDB documentation.

This service:
- Doesn't use cookies
- Doesn't collect personal information
- Stores only page paths and visit counts
- Is GDPR compliant without requiring cookie notices

Dependencies:
- Flask
- SQLite (included with Python)

Usage:
    python counter-api.py

Environment Variables:
- PORT: Port to run on (default: 5000)
- DATABASE_PATH: Path to SQLite database (default: ./counter.db)
- ALLOWED_ORIGINS: Comma-separated list of allowed origins (default: *)
"""

import os
import sqlite3
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib

app = Flask(__name__)

# Configuration
PORT = int(os.environ.get('PORT', 5000))
DATABASE_PATH = os.environ.get('DATABASE_PATH', './counter.db')
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')

# Configure CORS
CORS(app, origins=ALLOWED_ORIGINS)

# Debounce settings
DEBOUNCE_MINUTES = 5  # Don't count same IP for same page within 5 minutes

def init_db():
    """Initialize the database with required tables."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Create counters table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS page_counters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site TEXT NOT NULL,
            page_path TEXT NOT NULL,
            count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(site, page_path)
        )
    ''')

    # Create visits table for debouncing
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recent_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site TEXT NOT NULL,
            page_path TEXT NOT NULL,
            ip_hash TEXT NOT NULL,
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create index for faster lookups
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_recent_visits_lookup
        ON recent_visits(site, page_path, ip_hash, visited_at)
    ''')

    conn.commit()
    conn.close()

def hash_ip(ip_address):
    """Hash IP address for privacy."""
    return hashlib.sha256(f"{ip_address}_salt_3dcitydb".encode()).hexdigest()

def cleanup_old_visits():
    """Remove old visit records to keep database size manageable."""
    cutoff_time = datetime.now() - timedelta(hours=24)
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM recent_visits WHERE visited_at < ?', (cutoff_time,))
    conn.commit()
    conn.close()

def should_count_visit(site, page_path, ip_hash):
    """Check if this visit should be counted (debouncing)."""
    cutoff_time = datetime.now() - timedelta(minutes=DEBOUNCE_MINUTES)

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        SELECT COUNT(*) FROM recent_visits
        WHERE site = ? AND page_path = ? AND ip_hash = ? AND visited_at > ?
    ''', (site, page_path, ip_hash, cutoff_time))

    recent_visits = cursor.fetchone()[0]
    conn.close()

    return recent_visits == 0

def record_visit(site, page_path, ip_hash):
    """Record a visit in the recent_visits table."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO recent_visits (site, page_path, ip_hash)
        VALUES (?, ?, ?)
    ''', (site, page_path, ip_hash))

    conn.commit()
    conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/count', methods=['POST'])
def increment_counter():
    """Increment page counter."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON'}), 400

        site = data.get('site', '')
        page_path = data.get('page', '')

        if not site or not page_path:
            return jsonify({'error': 'Missing site or page'}), 400

        # Get client IP (handle proxies)
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        if client_ip:
            client_ip = client_ip.split(',')[0].strip()
        else:
            client_ip = request.remote_addr

        ip_hash = hash_ip(client_ip)

        # Check if we should count this visit
        if not should_count_visit(site, page_path, ip_hash):
            # Return current count without incrementing
            conn = sqlite3.connect(DATABASE_PATH)
            cursor = conn.cursor()
            cursor.execute(
                'SELECT count FROM page_counters WHERE site = ? AND page_path = ?',
                (site, page_path)
            )
            result = cursor.fetchone()
            count = result[0] if result else 0
            conn.close()

            return jsonify({'count': count, 'incremented': False})

        # Record the visit for debouncing
        record_visit(site, page_path, ip_hash)

        # Increment counter
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT OR REPLACE INTO page_counters (site, page_path, count, updated_at)
            VALUES (?, ?,
                COALESCE((SELECT count FROM page_counters WHERE site = ? AND page_path = ?), 0) + 1,
                CURRENT_TIMESTAMP)
        ''', (site, page_path, site, page_path))

        # Get the new count
        cursor.execute(
            'SELECT count FROM page_counters WHERE site = ? AND page_path = ?',
            (site, page_path)
        )
        count = cursor.fetchone()[0]

        conn.commit()
        conn.close()

        # Cleanup old visits occasionally
        if count % 100 == 0:  # Every 100th visit
            cleanup_old_visits()

        return jsonify({'count': count, 'incremented': True})

    except Exception as e:
        app.logger.error(f"Error incrementing counter: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/count/<path:page_path>', methods=['GET'])
def get_counter(page_path):
    """Get current page counter value."""
    try:
        site = request.args.get('site', '')
        if not site:
            return jsonify({'error': 'Missing site parameter'}), 400

        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        cursor.execute(
            'SELECT count FROM page_counters WHERE site = ? AND page_path = ?',
            (site, page_path)
        )
        result = cursor.fetchone()
        count = result[0] if result else 0

        conn.close()

        return jsonify({'count': count})

    except Exception as e:
        app.logger.error(f"Error getting counter: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get overall statistics (optional endpoint)."""
    try:
        site = request.args.get('site', '')
        if not site:
            return jsonify({'error': 'Missing site parameter'}), 400

        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        # Get total pages and total views
        cursor.execute('''
            SELECT COUNT(*) as total_pages, SUM(count) as total_views
            FROM page_counters WHERE site = ?
        ''', (site,))

        result = cursor.fetchone()
        total_pages = result[0] if result else 0
        total_views = result[1] if result else 0

        # Get top pages
        cursor.execute('''
            SELECT page_path, count FROM page_counters
            WHERE site = ? ORDER BY count DESC LIMIT 10
        ''', (site,))

        top_pages = [{'page': row[0], 'views': row[1]} for row in cursor.fetchall()]

        conn.close()

        return jsonify({
            'site': site,
            'total_pages': total_pages,
            'total_views': total_views,
            'top_pages': top_pages
        })

    except Exception as e:
        app.logger.error(f"Error getting stats: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=PORT, debug=False)
