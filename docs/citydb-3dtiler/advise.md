---
title: Advise command
description: Analyzing the 3DCityDB content and recommending tiling parameters
tags:
  - citydb-3dtiler
  - advise
  - YAML
---

The `advise` command analyzes the content of a 3DCityDB `v5` instance and writes a summary report in YAML format. The
report lists the object classes and attributes available in the database and recommends the maximum number of
features per tile for creating well-balanced 3D Tiles.

## Synopsis

```bash
citydb-3dtiler [OPTIONS] advise [ADVISE OPTIONS]
```

## Options

The `advise` command uses the [database connection options](database.md) and the `--separate-tilesets` option of the
main [`citydb-3dtiler`](cli.md#options) command. These global options must be specified *before* the command.
Additionally, it defines the following options.

| Option                                   | Description                                                   | Default value |
|------------------------------------------|---------------------------------------------------------------|---------------|
| `-h`, `--help`                           | Show a help message and exit.                                 |               |
| `-o`, `--output-file=<file>`             | Name of the output file.                                      | `advice.yml`  |
| `--[no-]consider-thematic-features`      | Consider thematic features in the analysis. Reserved for future use. | `false` |

## Usage

### Running the advise command

The `advise` command connects to the database and writes the report to the working directory (the `shared` folder
when using [Docker](docker.md)).

```bash
python3 citydb-3dtiler.py \
  --db-host my.host.de --db-port 5432 \
  --db-name citydb --db-schema citydb \
  --db-username postgres --db-password changeMe \
  advise
```

Running `advise` before `tile` is optional. If no `advice.yml` file exists in the working directory, the
[`tile`](tile.md) command runs the analysis automatically before generating the tiles.

!!! warning
    The `tile` command always reads the advice from the file `advice.yml`. A report written to a different file using
    `--output-file` is not considered for tiling. Use custom file names only to create additional reports for reference.

### Contents of the advice file

The advice file contains the following entries:

| Entry           | Description                                                                                                    |
|-----------------|----------------------------------------------------------------------------------------------------------------|
| `commandset`    | The options used to run the command.                                                                           |
| `max_features`  | The recommended maximum number of features per tile for the entire dataset.                                    |
| `objectclasses` | The object classes available in the database, each with the list of its attributes (`properties`).             |
| `used_crs_code` | The SRID of the coordinate reference system of the 3DCityDB.                                                  |

The attribute names listed for each object class are the names to use in [CQL2 and SQL filters](filter.md#attribute-names)
and with the [`--selected-attributes`](tile.md#attributes) option of the `tile` command.

```yaml
commandset:
    command: advise
    db_host: my.host.de
    db_name: citydb
    # ...
max_features: 415
objectclasses:
-   name: Building
    properties:
    - core_name
    - gen_grundhoehenn
    - gen_grundflaeche2d
-   name: RoofSurface
    properties:
    - null
used_crs_code: 25832
```

!!! danger "Password in the advice file"
    The `commandset` entry contains *all* options used to run the command, including the database password given with
    `--db-password`. Do not share or publish the advice file without removing the password first.

### Recommended number of features per tile

The recommended maximum number of features per tile is derived from the geometric complexity of the data. The `advise`
command determines the average number of vertices of the geometries in the database and divides a target of 10,000
vertices per tile by this average. Datasets with complex geometries therefore result in fewer features per tile than
datasets with simple geometries.

### Advice for separate tilesets

If the `--separate-tilesets objectclass` option is specified, the recommended maximum number of features per tile is
calculated for each object class individually and stored as `objectclass_recommendations` with the object class.

```bash
python3 citydb-3dtiler.py \
  --db-host my.host.de --db-port 5432 \
  --db-name citydb --db-schema citydb \
  --db-username postgres --db-password changeMe \
  --separate-tilesets objectclass \
  advise
```

!!! tip
    When creating [separate tilesets](cli.md#separate-tilesets) with the `tile` command, make sure the `advice.yml` file
    was also created with the `--separate-tilesets objectclass` option. Otherwise, delete the existing `advice.yml`
    file so that the `tile` command creates a matching one automatically.
