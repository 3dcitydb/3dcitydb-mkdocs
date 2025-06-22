---
title: Upgrading a 3DCityDB
description: Upgrading a 3DCityDB to a new minor or patch version
tags:
  - 3dcitydb
  - upgrade
  - update
---

Each 3DCityDB `v5` release comes with upgrade scripts that allow you to update an existing 3DCityDB instance to the latest
release version. The recommended method for upgrading is to use the `upgrade-db` shell script included in the 3DCityDB
software package. General information on where to find and how to execute the 3DCityDB shell scripts is
available [here](db-scripts.md#shell-scripts).

!!! note
    - The upgrade scripts are intended **only** for minor and patch version updates within the same major version.
    - The upgrade may involve schema changes. Because these changes affect the stored city model data,
      we **strongly recommend backing up your 3DCityDB instance before upgrading**.

## 3DCityDB upgrade steps

### Step 1: Edit the `connection-details` script

Navigate to the `3dcitydb/postgresql/shell-scripts` directory where you have unzipped the 3DCityDB software package,
or locate the same folder in the installation directory of `citydb-tool`. Make sure you are using the scripts from the
latest release version you want to upgrade to. Then, change to the subfolder `unix` or `windows`, depending on your
operating system. 

In this directory, locate the `connection-details.[sh|bat]` script and open it in a text editor of your choice. Enter the
connection details for the 3DCityDB instance you wish to upgrade, along with the full path to the `psql`
executable in this file. See [here](db-scripts.md#shell-scripts) for more details.

### Step 2: Run the `upgrade-db` script

After setting the connection details, execute the `upgrade-db.[sh|bat]` script in the same folder to begin the upgrade
process. You can either double-click the script or run it from a shell environment. On UNIX/Linux machines, you may
first need to set the appropriate file permissions to make the script executable.

=== "Linux"

    ```bash
    chmod u+x upgrade-db.sh
    ./upgrade-db.sh
    ```

=== "Windows CMD"

    ```bat
    upgrade-db.bat
    ```

You can also specify an alternative `connection-details` file from a different directory:

=== "Linux"

    ```bash
    ./upgrade-db.sh /path/to/connection-details.sh
    ```

=== "Windows CMD"

    ```bat
    upgrade-db.bat C:\path\to\connection-details.bat
    ```

After launching the script, a welcome message and usage information will appear in the console. The script will then
prompt you for the database password to connect to the 3DCityDB instance.

!!! warning
    The upgrade process begins immediately after you enter the password — there is no confirmation or 'Are you sure?' prompt.

### Step 3: Upgrade process

The upgrade script first checks the version of your existing 3DCityDB instance to determine if an automatic upgrade to the
target version is supported. Minor and patch upgrades within the same major version are generally supported. For major
version upgrades, special migration steps are usually required. If an automatic upgrade is not possible, the process
will abort with an error message and will not modify your existing database.

If the version check passes, the script proceeds to apply all necessary changes to bring the database up to date. This
includes applying upgrades across multiple intermediate versions if needed. You do not need to apply each intermediate
upgrade manually.

The upgrade process updates the default `citydb` schema, all additional data schemas added by the user, and the `citydb_pkg`
schema, which contains the predefined database functions and procedures.

During the upgrade process, carefully monitor the log messages printed to the console. Look out for any errors or
warnings, and take appropriate action if any issues are reported. A successful upgrade will conclude with a
confirmation message similar to:

```bash
3DCityDB instance successfully upgraded.
```

!!! tip
    After completing the upgrade, it is highly recommended to run a `VACUUM` on the affected database tables to ensure optimal
    performance.