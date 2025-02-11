---
title: Database connection
description: How to connect a 3DCityDB
# icon: material/emoticon-happy
status: wip
tags:
  - citydb-tool
  - database-connection
---

## Connecting to a PostgreSQL Database

The CityDB tool requires a connection to a PostgreSQL database hosting the 3DCityDB schema. You can specify the database
connection details using the database [options](#specifying-database-options-in-the-command)
(refer to the [Export](export_shared_options.md) or [Import](import_citygml.md) sections for more details) section or store them
in an external [options file](#specifying-database-options-in-an-options-file) for reuse.  
It is also possible to use a [config file](#specifying-database-options-in-a-config-file) in JSON format to
specify the database connection options. Alternatively, you can use **environment variables** for dynamic configuration.

### Specifying Database Options in the Command

You can provide the database connection options directly in the command:

| Option                  | Description                                              | Default Value |
|-------------------------|----------------------------------------------------------|---------------|
| `-H`, `--db-host=<host>` | Hostname of the 3DCityDB server.                         |               |
| `-P`, `--db-port=<port>` | Port of the 3DCityDB server (default: 5432).             | 5432          |
| `-d`, `--db-name=<database>` | Name of the 3DCityDB database to connect to.         |               |
| `-S`, `--db-schema=<schema>` | Database schema to use (default: `citydb` or `username`). | citydb or username |
| `-u`, `--db-username=<user>` | Username for the database connection.                |               |
| `-p`, `--db-password[=<password>]` | Password for the database connection. Leave empty to be prompted. |               |

#### Example

```bash
citydb export citygml -H localhost -P 5432 -d 3dcitydb -S citydb -u admin -p password -o output.gml
```

### Specifying Database Options in an options File

You can store the database connection options in a file and reference it in the command using the `@` symbol.  The file should contain the options in the format `--option=value` (one per line).

#### Example

```bash
citydb export citygml @args.txt
```

Example of a Database Connection File:

```bash
--db-host=localhost
--db-port=5432
--db-name=3dcitydb
--db-schema=citydb
--db-username=admin
--db-password=password
```

### Specifying Database Options in a config File

You can store the database connection options in a JSON file and reference it in the command using `--config-file=file.json`.

#### Example

```json
{
  "databaseOptions": {
    "connections": {
      "defaultConnectionId": {
        "description": "Default database connection",
        "user": "user",
        "password": "password",
        "host": "localhost",
        "port": 5432,
        "database": "citydb",
        "srid": 4326
      }
    }
  }
}
```

### Using Environment Variables for Database Connection

You can use **environment variables** to define database connection parameters dynamically. This approach is useful for automated scripts, CI/CD pipelines, or when credentials should not be hard-coded.

| Environment Variable        | Description                               |
|-----------------------------|-------------------------------------------|
| `CITYDB_HOST`               | Hostname of the 3DCityDB server.          |
| `CITYDB_PORT`               | Port of the 3DCityDB server.|
| `CITYDB_NAME`               | Name of the 3DCityDB database.           |
| `CITYDB_SCHEMA`             | Database schema to use.|
| `CITYDB_USER`               | Username for the database connection.    |
| `CITYDB_PASSWORD`           | Password for the database connection.    |

#### Example

```bash
export CITYDB_HOST=localhost
export CITYDB_PORT=5432
export CITYDB_NAME=3dcitydb
export CITYDB_SCHEMA=citydb
export CITYDB_USER=admin
export CITYDB_PASSWORD=password

citydb export citygml -o output.gml
```
