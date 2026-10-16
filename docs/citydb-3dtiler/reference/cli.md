---
title: CLI reference
description: All commands and options of citydb-3dtiler
tags:
  - citydb-3dtiler
  - CLI
  - reference
---

## Synopsis

=== "Docker"

    ```bash
    docker run [DOCKER OPTIONS] tumgis/citydb-3dtiler[:TAG] [OPTIONS] COMMAND [COMMAND OPTIONS]
    ```

=== "Python"

    ```bash
    python citydb-3dtiler.py [OPTIONS] COMMAND [COMMAND OPTIONS]
    ```

`OPTIONS` are global options and must be placed *before* `COMMAND`. `COMMAND OPTIONS` belong to the command and must
be placed *after* it. Use `--help` before or after a command to show the available options, e.g. `tile --help`.

## Commands

| Command                    | Description                                                                                     |
|----------------------------|-------------------------------------------------------------------------------------------------|
| [`advise`](#advise-command) | Analyze the database and write the [advice file](advice-file.md).                              |
| [`tile`](#tile-command)     | Create 3D Tiles. Runs `advise` first if no `advice.yml` exists in the working folder.          |

## Global options

### General options

| Option                       | Description                                                                      | Default value |
|------------------------------|----------------------------------------------------------------------------------|---------------|
| `-h`, `--help`               | Show a help message and exit.                                                    |               |
| `--separate-tilesets=<mode>` | Create one tileset per `objectclass`. The value `namespace` is not implemented yet. |            |
| `--tiler-app=<app>`          | 3D Tiles generator: `pg2b3dm`. The value `py3dtiles` is not implemented yet.     | `pg2b3dm`     |
| `--tilers-path=<path>`       | Folder containing the 3D Tiles generator executable.                             | `tiler_app/`  |

### Database connection options

| Option                           | Description                                    | Default value |
|----------------------------------|------------------------------------------------|---------------|
| `-H`, `--db-host=<host>`         | Name or IP address of the database server.     |               |
| `-P`, `--db-port=<port>`         | Port of the database server.                   | `5432`        |
| `-d`, `--db-name=<database>`     | Name of the database.                          |               |
| `-S`, `--db-schema=<schema>`     | Name of the 3DCityDB schema.                   | `citydb`      |
| `-u`, `--db-username=<user>`     | Name of the database user.                     |               |
| `-p`, `--db-password=<password>` | Password of the database user.                 |               |

### Filter options

Available since version `0.9.4`. All filters are combined with a logical AND.

| Option                                            | Description                                                                                       | Default value |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------|---------------|
| `-i`, <code>--id=<id>[,<id>...]</code>            | Feature identifiers (`objectid`).                                                                 |               |
| `-t`, <code>--type-name=<name>[,<name>...]</code> | Object class names, without namespace prefix.                                                     |               |
| `-b`, `--bbox=<x_min,y_min,x_max,y_max[,srid]>`   | 2D bounding box. Without SRID, the CRS of the 3DCityDB is used.                                   |               |
| `--bbox-mode=<mode>`                              | How the bounding box is applied, see [below](#bounding-box-modes).                                | `intersects`  |
| `-f`, `--filter=<cql2-text>`                      | CQL2 text expression.                                                                             |               |
| `--sql-filter=<sql>`                              | SQL `WHERE` condition.                                                                            |               |
| `--limit=<count>`                                 | Maximum number of features.                                                                       |               |
| `--start-index=<index>`                           | Number of features to skip.                                                                       | `0`           |

In CQL2 and SQL filters, `~geom` refers to the feature geometry, and attributes are referenced by their
[attribute names](../explanation.md#attribute-names). Attributes used in a filter must also be selected with the
[attribute options](#attribute-options).

#### Bounding box modes

| Mode                 | A feature is selected if ...                                                   | Speed  |
|----------------------|--------------------------------------------------------------------------------|--------|
| `intersects`         | its bounding box intersects the filter box.                                     | fast   |
| `intersects-precise` | its geometry, projected to 2D, intersects the filter box.                       | slower |
| `contains`           | its bounding box lies completely inside the filter box.                         | fast   |
| `contains-precise`   | its 2D footprint lies completely inside the filter box.                         | slower |

## `advise` command

```bash
citydb-3dtiler [OPTIONS] advise [ADVISE OPTIONS]
```

Uses the general and database connection options. Filter options are ignored.

| Option                              | Description                                       | Default value |
|-------------------------------------|---------------------------------------------------|---------------|
| `-h`, `--help`                      | Show a help message and exit.                     |               |
| `-o`, `--output-file=<file>`        | Name of the advice file in the working folder.    | `advice.yml`  |
| `--[no-]consider-thematic-features` | Reserved for future use.                          | `false`       |

!!! note
    The `tile` command only reads `advice.yml`. Files written with a different `--output-file` name are for your
    information only.

## `tile` command

```bash
citydb-3dtiler [OPTIONS] tile [TILE OPTIONS]
```

Uses all global options.

### Output options

| Option                           | Description                                                          | Default value |
|----------------------------------|----------------------------------------------------------------------|---------------|
| `-h`, `--help`                   | Show a help message and exit.                                        |               |
| `-o`, `--output-folder=<folder>` | Subfolder of the working folder to write the tiles to.               | working folder |
| `--tiles-version=<version>`      | 3D Tiles version: `1.0`, `1.1`. Version `1.1` uses implicit tiling.  | `1.1`         |
| `--vertical-offset=<meters>`     | Vertical offset added to all geometries.                             | `0.0`         |

### Styling options

| Option                                | Description                                                                                             | Default value                |
|---------------------------------------|---------------------------------------------------------------------------------------------------------|------------------------------|
| `--style-mode=<mode>`                 | `existing-appearances` (experimental), `property-based`, `objectclass-based`, `no-style`.               | `objectclass-based`          |
| `--style-absence-behavior=<behavior>` | What to do if no material matches: `fall-down`, `rise-up`. See [styling rules](../explanation.md#styling-rules). | `fall-down`        |
| `--transparency=<mode>`               | Alpha mode of the materials: `opaque` (ignore transparency), `blend`, `mask` (fully opaque or invisible). | `opaque`                   |
| `--custom-style=<file>`               | [Materials file](materials.md) in the working folder.                                                   | `materials_for_features.csv` |

### Attribute options

| Option                                                | Description                                                         | Default value |
|-------------------------------------------------------|---------------------------------------------------------------------|---------------|
| `-a`, `--attributes=<mode>`                           | Attributes to embed: `none`, `selected`, `all`.                     | `none`        |
| <code>--selected-attributes=<name>[,<name>...]</code> | [Attribute names](../explanation.md#attribute-names) for `selected`. |               |
| `--attribute-structure=<structure>`                   | `flat` (one attribute per value) or `nested` (JSON-like values).     | `flat`        |

## Working folder

| Setup  | Working folder                                                         |
|--------|------------------------------------------------------------------------|
| Docker | The folder mounted to `/home/tester/citydb-3dtiler/shared`             |
| Python | The `shared` folder in the source code                                 |

The working folder holds the input files (`materials_for_features.csv`, custom materials files, `advice.yml`) and
the generated 3D Tiles.
