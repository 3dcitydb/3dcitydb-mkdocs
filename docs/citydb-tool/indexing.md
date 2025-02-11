---
title: Index
description: Managing Database Indexes in 3DCityDB
# icon: material/database-cog-outline
status: wip
---

# Index command

The **`index`** command in the **citydb-tool** allows users to manage database indexes in **3DCityDB**.
Indexes are critical for optimizing query performance, especially for large datasets.
The `index` command provides subcommands to check index statuses, create indexes, and drop indexes.

---

## Usage

```bash
citydb index [OPTIONS] SUBCOMMAND
```

## Subcommands

| Subcommand       | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `help`           | Display help information for the `index` command or subcommands.  |
| `status`         | Show the current indexes and their statuses in the database.      |
| `create`         | Create indexes on the relevant database tables.                   |
| `drop`           | Drop (remove) indexes from the relevant database tables.          |

## General options

| Option                               | Description                                                                 | Default Value |
|--------------------------------------|-----------------------------------------------------------------------------|---------------|
| `[@<filename>...]`                   | Specify one or more argument files containing options.                      |               |
| `--config-file=<file>`               | Load configuration options from the specified file.                         |               |
| `-L`, `--log-level=<level>`          | Set the logging level: `fatal`, `error`, `warn`, `info`, `debug`, `trace`.   | `info`        |
| `--log-file=<file>`                  | Write log messages to the specified file.                                   |               |
| `--pid-file=<file>`                  | Create a file containing the process ID.                                    |               |
| `--plugins=<dir>`                    | Load plugins from the specified directory.                                  |               |
| `--use-plugins=<plugin>`             | Enable or disable specific plugins using their fully qualified class names. | `true`        |
| `-h`, `--help`                       | Show help information for the command or subcommands.                       |               |
| `-V`, `--version`                    | Print version information and exit.                                         |               |

## Database connection options

The citydb-tool requires a connection to a 3DCityDB database for all operations, including the delete command.
Database connection details, such as host, port, schema, and credentials, must be provided to ensure the
tool can interact with the database successfully.

These options are shared across all commands in the citydb-tool, as a connection is essential every time data
is queried, deleted, imported, or exported.

For details on how to configure database connections, including host, port, schema, and credentials,
refer to the [Database Connection Options documentation](db-connection.md) This section provides a comprehensive explanation of
all available connection parameters.

## Check index status

The status subcommand of the index command provides an overview of the current indexes in the 3DCityDB
database and their statuses. This command is useful for verifying whether indexes are active or missing and
ensures proper database optimization.

### Example

```bash
citydb index status --log-level=debug
```

## Create indexes

The create subcommand of the index command allows users to create indexes on the relevant database tables in 3DCityDB.
Indexes are essential for improving query performance, especially when dealing with large datasets.

This command supports different indexing modes to accommodate various database configurations and use cases.

### Options

| Option                               | Description                                                                 | Default Value |
|--------------------------------------|-----------------------------------------------------------------------------|---------------|
| `-m, --index-mode=<mode>`            | Specifies the indexing mode for property value columns. Choices are: partial, full.| partial       |

### Description

- `partial`: This mode excludes null values from indexes, which can reduce the index size and optimize performance for databases where null values are common.
- `full`: Indexes all values, ensuring comprehensive indexing but potentially requiring more storage and processing time

### Example

```bash
citydb index create --index-mode=full
```

## Drop indexes

The drop subcommand of the index command allows users to remove existing indexes from the relevant database tables
in 3DCityDB. This operation can be useful for database maintenance, freeing up storage, or temporarily disabling
indexes during bulk data operations.


### Example

```bash
citydb index drop --log-level=debug
```
