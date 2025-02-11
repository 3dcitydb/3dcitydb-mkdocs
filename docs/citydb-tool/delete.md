---
# title: Delete
description: Deleting Features from 3DCityDB
# icon: material/delete
status: wip
tags:
  - citydb-tool
  - delete
---

# Delete command

The **citydb-tool** provides a `delete` command to remove features from the **3DCityDB** database.
The `delete` command offers flexible options for filtering, committing changes, managing indexes, and metadata logging.

---

## Usage

```bash
citydb delete [OPTIONS]
```

## General options

| Option                               | Description                                                                 | Default Value |
|--------------------------------------|-----------------------------------------------------------------------------|---------------|
| `[@<filename>...]`                   | Specify one or more argument files containing options.                      |               |
| `--temp-dir=<dir>`                   | Directory to store temporary files during the delete operation.             |               |
| `-m`, `--delete-mode=<mode>`         | Delete mode: `delete` (hard delete) or `terminate` (logical delete).         | `terminate`   |
| `--index-mode=<mode>`                | Index mode: `keep`, `drop`, or `drop_create`. Dropping indexes can improve performance for large deletes. | `keep`        |
| `--preview`                          | Run the command in **preview mode**. Features will not actually be deleted. |               |
| `-c`, `--commit=<number>`            | Commit changes after deleting this number of features.                      | None          |
| `--config-file=<file>`               | Load configuration options from the specified file.                         |               |
| `-L`, `--log-level=<level>`          | Set the logging level: `fatal`, `error`, `warn`, `info`, `debug`, `trace`.   | `info`        |
| `--log-file=<file>`                  | Write log messages to the specified file.                                   |               |
| `--pid-file=<file>`                  | Create a file containing the process ID.                                    |               |
| `--plugins=<dir>`                    | Load plugins from the specified directory.                                  |               |
| `--use-plugins=<plugin>`             | Enable/disable specific plugins using their fully qualified class names.    | `true`        |

## Metadata options

| Option                               | Description                                                                 | Default Value       |
|--------------------------------------|-----------------------------------------------------------------------------|---------------------|
| `--lineage=<lineage>`                | Specify the lineage information for the deleted features.                   | None                |
| `--updating-person=<name>`           | Name of the user responsible for the delete operation.                      | Database user       |
| `--reason-for-update=<reason>`       | Provide a reason for deleting the data.                                     | None                |


## Query and filter options

| Option                               | Description                                                                 | Default Value       |
|--------------------------------------|-----------------------------------------------------------------------------|---------------------|
| `-t`, `--type-name=<name>`           | Specify feature names to process. Example: `CityFurniture`.                 | None                |
| `-f`, `--filter=<cql2-text>`         | Apply a **CQL2 filter** to retrieve specific features.                      | None                |
| `--filter-crs=<crs>`                 | SRID or CRS identifier for the filter geometries.                           | Storage CRS         |
| `--sql-filter=<sql>`                 | Use an **SQL query** to filter features.                                    | None                |
| `--limit=<count>`                    | Limit the number of features to process. Example: `1000`.                   | None                |
| `--start-index=<index>`              | Start processing features from a specific index. Example: `10`.             | `0`                 |

## Database connection options

The citydb-tool requires a connection to a 3DCityDB database for all operations, including the delete command.
Database connection details, such as host, port, schema, and credentials, must be provided to ensure the
tool can interact with the database successfully.

These options are shared across all commands in the citydb-tool, as a connection is essential every time data
is queried, deleted, imported, or exported.

For details on how to configure database connections, including host, port, schema, and credentials,
refer to the [Database Connection Options documentation](db-connection.md) This section provides a comprehensive explanation of
all available connection parameters.

## Examples

### Basic delete

Delete features using default settings:

```bash
citydb delete
```

### Preview delete operation

Run the delete command in **preview mode** to check which features would be deleted without
performing the actual operation:

```bash
citydb delete -t Building --preview
```

### Delete specific features

Delete specific features using a **CQL2 filter**:

```bash
citydb delete -t Building -f "height > 100"
```

### Delete with metadata

Delete features and provide lineage information and a reason for the operation:

```bash
citydb delete -t Building --lineage="CityGML 2.0" --reason-for-update="Data cleanup"
```

### Delete with commit

Delete features and commit changes after deleting 1000 features:

```bash
citydb delete -t Building --commit=1000
```

### Delete with custom temporary directory

Specify a custom directory for storing temporary files during the delete operation:

```bash
citydb delete -t Building --temp-dir=/path/to/temp
```

### Delete with SQL filter

Delete features using an SQL query to filter specific records:

```bash
citydb delete -t Building --sql-filter="SELECT * FROM building WHERE height > 100"
```

### Limit the number of features to process

Delete a limited number of features, starting from index 10:

```bash
citydb delete -t Building --limit=1000 --start-index=10
```
