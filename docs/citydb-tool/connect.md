---
title: Connect command
description: Test connection to the database
tags:
  - citydb-tool
  - connect
---

The `connect` command can be used to quickly verify whether a connection to a 3DCityDB `v5` instance can be established
before performing tasks such as importing or exporting data.

## Synopsis

```bash
citydb connect [OPTIONS]
```

## Options

The `connect` command inherits global options from the main [`citydb`](cli.md) command. Additionally, it defines
general database connection options and the ability to output the connection status in JSON format.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### Output options

| Option                                          | Description                                        | Default value |
|-------------------------------------------------|----------------------------------------------------|---------------|
| `-o`, <code>--output=&lt;file&#124;-&gt;</code> | Write output as a JSON file. Use `-` for `stdout`. |               |

### Database connection options

--8<-- "docs/citydb-tool/includes/db-options.md"

For more details on the database connection options and usage hints, see [here](database.md#using-command-line-options).

## Usage

### Testing a connection

To test a connection to a 3DCityDB `v5` instance, run the `connect` command and provide the corresponding connection
details for the database. As described [here](database.md), the connection details can be supplied using the CLI
options listed above, or via alternative methods such as a JSON configuration file or environment variables.

The example below shows how to run the command using CLI options:

=== "Linux"

    ```bash
    ./citydb connect \
        -H localhost \
        -d citdb \
        -u citydb_user \
        -p mySecret \
        -S mySchema
    ```

=== "Windows CMD"

    ```bat
    citydb connect ^
        -H localhost ^
        -d citdb ^
        -u citydb_user ^
        -p mySecret ^
        -S mySchema
    ```

When the command is executed, log messages are printed to the console showing the progress of the connection attempt.
On success, the database details of the connected 3DCityDB instance are displayed. On error, the log shows the
corresponding error message to help identify the cause. The command also returns exit codes to allow automatic
interpretation of the connection status:

- `0`: Connection successful.
- `1`: Connection failed due to errors or issues.
- `2`: Invalid input for an option or parameter.

### JSON output

The connection status can also be output in JSON format by using the `--output` option. If a file path is provided, the
JSON output will be written to that file. If `-` is specified instead of a file path, the JSON output will be written
to `stdout`. This JSON output can be easily piped to and processed by external tools.

The following examples demonstrate the usage of the `--output` option.

=== "Linux"

    ```bash
    ./citydb connect [...] -o status.json      # write JSON to a file
    ./citydb connect [...] -o -                # write JSON to stdout
    ./citydb connect [...] -o - > status.json  # redirect stdout to a file
    ```

=== "Windows CMD"

    ```shell
    citydb connect [...] -o status.json      # write JSON to a file
    citydb connect [...] -o -                # write JSON to stdout
    citydb connect [...] -o - > status.json  # redirect stdout to a file
    ```

The JSON output contains information about whether the connection succeeded or failed, along with relevant database
details or error messages.

=== "Success example"

    ```bash
    {
      "connectionStatus": "success",
      "connection": {
        "host": "localhost",
        "port": 5432,
        "database": "citydb",
        "schema": "mySchema",
        "user": "citydb_user"
      },
      "database": {
        "name": "3D City Database",
        "version": "5.1.0",
        "dbms": {
          "name": "PostgreSQL",
          "version": "17.2",
          "properties": {
            "postgis": {
              "name": "PostGIS",
              "value": "3.5.0"
            },
            "postgis_sfcgal": {
              "name": "SFCGAL",
              "value": "1.5.2"
            }
          }
        },
        "hasChangelogEnabled": false,
        "crs": {
          "srid": 25832,
          "identifier": "urn:ogc:def:crs:EPSG::25832",
          "name": "ETRS89 / UTM zone 32N"
        }
      }
    }
    ```

=== "Error example"

    ```shell
    {
      "connectionStatus": "failure",
      "connection": {
        "host": "localhost",
        "port": 5432,
        "database": "citydb",
        "schema": "mySchema",
        "user": "citydb_user"
      },
      "error": {
        "causes": [
          {
            "message": "The requested schema 'mySchema' is not a 3DCityDB schema.",
            "exception": "org.citydb.database.DatabaseException"
          }
        ]
      }
    }
    ```

The JSON structure contains the following details:

- `"connectionStatus"`: The connection result, either `success` or `failure`.
- `"connection"`: The connection details used for the attempt.
- `"database"` (present on success): Database name, version, DBMS-specific extensions, properties, and CRS details.
- `"error"` (present on failure): One or more causes with descriptive messages and associated exceptions to help identify the
  connection issue.

!!! tip
    The structure of the JSON output is defined by the JSON Schema file `connection-status.json.schema`,
    which is located in the `json-schema` folder of the citydb-tool installation directory.