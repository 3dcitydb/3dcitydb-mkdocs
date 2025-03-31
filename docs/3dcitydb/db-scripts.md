---
title: Database scripts
description: Database scripts of the 3DCityDB
tags:
  - 3dcitydb
  - database scripts
---

The 3DCityDB `v5` software package comes with shell and SQL scripts for tasks such as
[setting up](../first-steps/setup.md#3dcitydb-setup-steps) or removing a 3DCityDB instance, creating
additional schemas, and granting or revoking access permissions. 

!!! tip
    Follow the [download instructions](../download.md) to obtain the database scripts. They are available as an individual
    download package but are also included in the `citydb-tool` software bundle.

## Shell scripts

The 3DCityDB `v5` shell scripts are located in the `3dcitydb/postgresql/shell-scripts` directory of the 3DCityDB
software package or within the installation directory of `citydb-tool`. They are available in two variants,
organized into the following subfolders:

1. `unix` for use on UNIX/Linux/macOS systems; and
2. `windows` for use on Windows systems.

The following table provides an overview of the available shell scripts and their purposes.

| Script [.sh\|.bat]   | Description                                                                                               |
|----------------------|-----------------------------------------------------------------------------------------------------------|
| `connection-details` | Stores the connection details for a 3DCityDB instance which are used by all other scripts                 |
| `create-db`          | Creates a new 3DCityDB instance (relational schema including all database functions)                      |
| `create-schema`      | Creates an additional data schema (analogous to the default schema `citydb`) with a user-defined name     |
| `drop-db`            | Drops a 3DCityDB instance (incl. all elements of the relational schema)                                   |
| `drop-schema`        | Drops a data schema that has been created with `create-schema`                                            |
| `grant-access`       | Grants read-only or read-write access to a 3DCityDB instance                                              |
| `revoke-access`      | Revokes read-only or read-write access to a 3DCityDB instance, which has been granted with `grant-access` |
| `create-changelog`   | Create the changelog extension for a 3DCityDB instance                                                    |
| `drop-changelog`     | Remove the changelog extension from a 3DCityDB instance                                                   |

The scripts are intended to run in an interactive shell session, prompting the user for necessary information to perform
their tasks. The `connection-details` script serves a special purpose, as it defines the connection details for your
3DCityDB `v5` instance. These details are used by all other scripts, so make sure to adjust them before executing any of
them. This includes specifying the full path to the `psql` executable on your system, which is required by all scripts.

Open the `connection-details` script with a text editor of your choice and enter the necessary information, as shown
below.

=== "Linux"

    ```bash
    #!/bin/bash
    # Provide your database details here ----------------
    export PGBIN=/var/lib/postgresql/[version]/bin
    export PGHOST=localhost
    export PGPORT=5432
    export CITYDB=citydb_v5
    export PGUSER=citydb_user
    #----------------------------------------------------
    ```

=== "Windows CMD"

    ```bat
    # Provide your database details here ----------------
    set PGBIN=C:\Program Files\PostgreSQL\[version]\bin
    set PGHOST=localhost
    set PGPORT=5432
    set CITYDB=citydb_v5
    set PGUSER=citydb_user
    #----------------------------------------------------
    ```

!!! info
    If the `psql` executable is already on your `PATH`, you can comment out or remove the line setting
    the `PGBIN` variable in the script.

After adjusting the `connection-details` script, all other scripts can be executed either by double-clicking them or by
running them from within a shell environment.

!!! note
    You may first need to set the appropriate file permissions to make the scripts executable on
    UNIX/Linux machines.

## SQL scripts

Technically, the shell scripts listed above are simply wrappers designed to collect user input in a convenient manner.
The actual actions at the database level are carried out by SQL scripts that are invoked by these shell scripts.

The SQL scripts are provided in the `3dcitydb/postgresql/sql-scripts` directory of the 3DCityDB software package
or within the installation directory of `citydb-tool`. Similar to the shell scripts, navigate to the `unix` or `windows`
subfolder, depending on your operating system. The SQL scripts are designed to be executed with `psql`.

Most of the SQL scripts require input parameters to execute the database action. These parameters should be
passed as command-line parameters to `psql`. Below is an example of how to invoke the `create-db.sql` script to set up
a 3DCityDB `v5` instance. The required input parameters for this script are discussed in the
[setup instructions](../first-steps/setup.md#3dcitydb-setup-steps). Refer to the `psql` documentation for more details
on its usage and command-line options.

=== "Linux"

    ```bash
    psql -d "citydb_v5" \
        -h localhost \
        -U "citydb_user" \
        -f "/path/to/the/reate-db.sql" \
        -v srid="25833" \
        -v srs_name="urn:ogc:def:crs:EPSG::25833" \
        -v changelog="no"
    ```

=== "Windows CMD"

    ```bat
    psql -d "citydb_v5" ^
        -h localhost ^
        -U "citydb_user" ^
        -f "C:\path\to\the\create-db.sql" ^
        -v srid="25833" ^
        -v srs_name="urn:ogc:def:crs:EPSG::25833" ^
        -v changelog="no"
    ```

!!! tip
    By using shell or environment variables instead of hardcoding values directly into your command as shown above, you make
    it easier to reuse the SQL scripts across different setups or systems. This makes automating things, integrating them
    into other software, or running them as part of a CI/CD pipeline way more flexible. This is an easy way to streamline
    workflows using the SQL scripts.