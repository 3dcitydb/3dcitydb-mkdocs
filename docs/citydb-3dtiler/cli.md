---
title: Command-line interface
description: Overview of the citydb-3dtiler command-line interface
tags:
  - citydb-3dtiler
  - CLI
  - commands
---

`citydb-3dtiler` is the main command of the tool. It defines global options for configuring the 3D Tiles generator, the
database connection and the feature filter, and provides the subcommands [`advise`](advise.md) and [`tile`](tile.md).

## Synopsis

=== "Docker"

    ```bash
    docker run [DOCKER OPTIONS] tumgis/citydb-3dtiler[:TAG] [OPTIONS] COMMAND [COMMAND OPTIONS]
    ```

=== "Python"

    ```bash
    python3 citydb-3dtiler.py [OPTIONS] COMMAND [COMMAND OPTIONS]
    ```

When using the [Docker image](docker.md), the `citydb-3dtiler` main command is invoked automatically by the container,
so you only need to provide the options and the command. When running the tool in a [Python environment](python.md),
the main script `citydb-3dtiler.py` has to be called explicitly.

## Options

The global options must be specified *before* the command. They are shared by the `advise` and `tile` commands.

### General options

| Option                                   | Description                                                                                       | Default value |
|------------------------------------------|---------------------------------------------------------------------------------------------------|---------------|
| `-h`, `--help`                           | Show a help message and exit.                                                                     |               |
| `--tiler-app=<app>`                      | 3D Tiles generator to use: `pg2b3dm`, `py3dtiles`.                                                | `pg2b3dm`     |
| `--tilers-path=<path>`                   | Absolute or relative path to the folder containing the 3D Tiles generator.                        | `tiler_app/`  |
| `--separate-tilesets=<mode>`             | Create separate tilesets per `objectclass` or `namespace`. If omitted, a single tileset is created. |               |

### Database connection options

| Option                             | Description                                                | Default value |
|------------------------------------|------------------------------------------------------------|---------------|
| `-H`, `--db-host=<host>`           | Name or IP address of the database server.                 |               |
| `-P`, `--db-port=<port>`           | Port of the database server.                               | `5432`        |
| `-d`, `--db-name=<database>`       | Name of the 3DCityDB database to connect to.               |               |
| `-S`, `--db-schema=<schema>`       | Schema to use when connecting to the 3DCityDB.             | `citydb`      |
| `-u`, `--db-username=<user>`       | Name of the user to connect to the 3DCityDB.               |               |
| `-p`, `--db-password=<password>`   | Password of the database user.                             |               |

For more details on the database connection options and usage hints, see [here](database.md).

### Filter options

| Option                                                         | Description                                                                         | Default value |
|----------------------------------------------------------------|-------------------------------------------------------------------------------------|---------------|
| `-i`, <code>--id=<id>[,<id>...]</code>                         | Identifiers (`objectid`) of the features to process.                                |               |
| `-t`, <code>--type-name=<name>[,<name>...]</code>              | Names of the object classes of the features to process.                             |               |
| `-b`, `--bbox=<x_min,y_min,x_max,y_max[,srid]>`                | Bounding box to use as spatial filter.                                              |               |
| `--bbox-mode=<mode>`                                           | Bounding box filter mode: `intersects`, `intersects-precise`, `contains`, `contains-precise`. | `intersects` |
| `-f`, `--filter=<cql2-text>`                                   | CQL2 expression to use as filter.                                                   |               |
| `--sql-filter=<sql>`                                           | SQL `WHERE` condition to use as filter.                                             |               |
| `--limit=<count>`                                              | Maximum number of features to process.                                              |               |
| `--start-index=<index>`                                        | Index within the result set from which features are processed.                      | `0`           |

For more details on the filter options and usage hints, see [here](filter.md).

## Commands

| Command               | Description                                                                                      |
|-----------------------|--------------------------------------------------------------------------------------------------|
| [`advise`](advise.md) | Analyze the database content and write a report with recommended tiling parameters.             |
| [`tile`](tile.md)     | Generate 3D Tiles from the features in the database.                                            |

Each command has its own options, which are listed with `--help` after the command name, for example
`citydb-3dtiler advise --help`.

## Usage

### Generator options

`citydb-3dtiler` delegates the generation of the 3D Tiles to an external 3D Tiles generator. Currently, only
[pg2b3dm](https://github.com/Geodan/pg2b3dm){target="blank"} is tested and supported, which is also the default for
the `--tiler-app` option. Support for further generators such as `py3dtiles` or `i3dmExport` is planned for future
releases.

The `--tilers-path` option sets the folder containing the generator executable. Use it to run `citydb-3dtiler` with a
specific pg2b3dm version by placing that version in a separate folder.

!!! warning
    The options of pg2b3dm may vary between versions. When using a pg2b3dm version other than the one bundled with
    the [Docker image](docker.md), some options of the `tile` command may not work as expected.

### Separate tilesets

By default, all features are written to a single tileset. The `--separate-tilesets` option creates one tileset per
object class instead, for example separate tilesets for `Building`, `WallSurface` and `RoofSurface` features. Each
tileset is written to its own subfolder named after the object class. Separate tilesets allow you to show, hide and
style the different object classes independently in the viewer.

!!! note
    Only the value `objectclass` is currently implemented. Creating separate tilesets per `namespace` (e.g., `bldg`,
    `tran`, `brid`) is planned for a future release.

### Splitting long commands

The examples in this documentation split long commands over multiple lines for better readability. The line
continuation character depends on your shell: Linux shells use the backslash `\`, Windows CMD uses the caret `^`, and
PowerShell uses the backtick `` ` ``. Alternatively, remove the continuation characters and line breaks to enter the
command on a single line.

```bash
python3 citydb-3dtiler.py \
  --db-host localhost --db-port 5432 \
  --db-name citydb --db-schema citydb \
  --db-username postgres --db-password changeMe \
  tile \
  --vertical-offset 0.5
```
