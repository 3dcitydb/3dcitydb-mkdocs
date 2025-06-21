---
title: Setting up a 3DCityDB
description: How to setup a 3DCityDB.
tags:
  - 3dcitydb
  - setup
  - bare metal
  - docker
  - shell scripts
  - database scripts
  - sql scripts
  - template database
---

The recommended way to set up a bare metal 3D City Database (3DCityDB) instance is by using the installation scripts
provided as separate 3DCityDB download package. These scripts are also included in each `citydb-tool` distribution.
Follow the [download instruction](../download.md) to obtain them. Alternatively, [use Docker :material-docker:](docker.md) for
a simpler setup and deployment of a 3DCityDB instance.

## 3DCityDB setup steps

### Step 1: Create an empty PostgreSQL database

The first step is to create a new, empty database on your PostgreSQL server. Use a superuser or a database user
with the `CREATEDB` permission to do so. While not required, it is recommended to select or create a dedicated user
to own the database, who will also be used to run the 3DCityDB setup scripts in later steps.

The following command demonstrates how to create a new database for the user `citydb_user`.

``` SQL
CREATE DATABASE citydb_v5 OWNER citydb_user;
```

!!! tip
    You can execute this command using PostgreSQL's command-line client `psql` or any other SQL tool, such as the
    graphical database client [`pgAdmin`](https://www.pgadmin.org/). Refer to the documentation of your preferred tool
    for more information.

### Step 2: Add the PostGIS extension

The 3D City Database requires the PostGIS extension to be added to the database. This can only be done by a superuser.
Use the following command to add the PostGIS extension:

``` SQL
CREATE EXTENSION postgis;
```

!!! info "Optional"
    To enable advanced spatial 3D operations such as extrusion, volume calculation, or union/intersection/difference of
    volume geometries, you can additionally install the `postgis_sfcgal` extension:

    ``` SQL
    CREATE EXTENSION postgis_sfcgal;
    ```

### Step 3: Edit the `connection-details` script

Now it's time to use the 3DCityDB setup scripts. Navigate to the `3dcitydb/postgresql/shell-scripts` directory
where you have unzipped the 3DCityDB software package, or locate this folder within the installation directory of
`citydb-tool`. Then, change to the subfolder `unix` or `windows`, depending on your operating system.

Once inside, locate the `connection-details.[sh|bat]` script and open it with a text editor of your choice.
Enter the database connection details along with the full path to the `psql` executable in this file. As mentioned
above, it is recommended to provide the user who owns the database as `PGUSER` in the script.

Below is an example of the required information to include in the `connection-details` file.

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

### Step 4: Execute the `create-db` script

Once the connection details have been set in the `connection-details` file, execute the `create-db.[sh|bat]` script
located in the same folder to begin the setup process. You can do this either by double-clicking the script or
by running it from within a shell environment. On UNIX/Linux machines, you may first need to set the appropriate file
permissions to make the script executable.

=== "Linux"

    ```bash
    chmod u+x create-db.sh
    ./create-db.sh
    ```

=== "Windows CMD"

    ```bat
    create-db.bat
    ```

It is also possible to use a different `connection-details` file from another folder:

=== "Linux"

    ```bash
    ./create-db.sh /path/to/connection-details.sh
    ```

=== "Windows CMD"

    ```bat
    create-db.bat C:\path\to\connection-details.bat
    ```

After executing the script, a welcome message along with usage hints will be displayed on the console. The script
will prompt the user for several essential parameters required for setting up the 3DCityDB instance.
The details of these user inputs are explained in the following steps.

### Step 5: Specify the coordinate reference system

You are prompted for the coordinate reference system (CRS) to be used for the 3DCityDB instance.
Simply enter the PostGIS-specific SRID (**S**patial **R**eference **ID**) of the CRS. In most cases, the SRID will be
identical to the EPSG code of the CRS. There are three parameters that need to be provided in this step:

- __The SRID to be used with the geometries stored in the database:__ Only one SRID can be used for the
  3DCityDB instance.
- __The EPSG code of the height system:__ This is considered metadata and does not affect the geometries in the
  database. If the above SRID already references a true 3D CRS or if the height system is unknown, enter "0"
  (meaning "not available"). This is also the default value.
- __The OGC-compliant name of the CRS:__ The CRS name is, for instance, written to CityGML/CityJSON files
  when exporting data from the database. The `create-db` script proposes a URN-encoded name based on your
  input, following OGC recommendations. Simply press ++enter++ to accept the proposed value.

      ```
      urn:ogc:def:crs,crs:EPSG::<SRID>[,crs:EPSG::<HEIGHT_EPSG>]
      ```

!!! tip
    The coordinate reference system can be changed at any time after setup using the database function
    `citydb_pkg.change_schema_srid`. Refer to the [database procedures section](../3dcitydb/db-functions.md#crs-functions) for
    more information.

### Step 6: Create changelog extension

You can choose whether to create the changelog extension for your 3DCityDB instance. The changelog
extension adds a table to the 3DCityDB schema, where insert, delete, and update operations on top-level city objects
are tracked. Each changelog entry provides metadata about the affected city object (identifier, envelope, etc.),
the database user executing the operation, a reason for the update, and the transaction type.
Database triggers are installed to automatically populate the changelog table. As a result, insert, delete,
and update operations may take longer when the changelog extension is used.

Enter `yes` or `no` to decide whether to install the changelog extension. The default value is `no`, which
can be confirmed by simply pressing ++enter++.

!!! tip
    The changelog extension can be installed and removed at any time after setup using the shell scripts
    `create-changelog` and `drop-changelog`.

### Step 7: Execute the installation

Finally, enter the password for the database user provided in the `connection-details` script. Afterward,
the setup process will begin, and log messages informing you about the progress will be printed to the console.

The setup process will terminate immediately if any errors occur. Possible reasons include:

- The user executing `create-db` is neither a superuser nor the owner of the specified database (or does
  not have the privileges to create objects in that database).
- The PostGIS extension has not been installed.
- Parts of the 3DCityDB already exist because of a previous setup attempt. To prevent this, ensure that the schemas
  `citydb` and `citydb_pkg` do not exist in the database before starting the setup process.

If no error message is displayed, the setup has been successfully completed. The figure below shows a
summary of the required user input for the `create-db` script.

![create-db script](assets/create-db.png)
/// figure-caption
Example user input for the create-db script.
///

!!! tip
    In addition to the `connection-details` and `create-db` shell scripts for setting up a 3DCityDB instance, the 3DCityDB
    package includes several other shell and SQL scripts for tasks such as removing a 3DCityDB instance, creating additional
    schemas, and granting or revoking access permissions. Complete documentation of these database scripts is
    available [here](../3dcitydb/db-scripts.md).

## Using template databases to set up a 3DCityDB

In PostgreSQL, **template databases** are pre-configured databases that serve as a base for creating new databases.
Using a
template database during database creation is a common practice. The new database is essentially created as a copy of
one of the template databases, with a few modifications (such as the database name). These template databases enable
quick database creation by copying an existing structure, schema, and even data.

You can also use a 3DCityDB instance as a template database. However, be cautious, as the `search_path` is not
automatically copied from the template database to the new 3DCityDB instance. A correct search path is crucial for
accessing data and database functions in the `citydb` and `citydb_pkg` schemas. Therefore, you must manually set the
search path in your new 3DCityDB instance:

```SQL
ALTER DATABASE new_citydb_v5 SET search_path TO citydb, citydb_pkg, public;
```

!!! info
    If your 3DCityDB template contains more schemas, ensure to add them all to the `search_path`.
    Note that the search path will be updated upon the next login, not within the same session.

## Upgrading a 3DCityDB `v5` to the latest release

If you already have a 3DCityDB `v5` installed and running, and want to update it to the latest release instead of
setting up a new instance, please follow this [guide](../3dcitydb/db-upgrade.md).