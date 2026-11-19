---
title: Examples
description: Example commands and test datasets for citydb-3dtiler
tags:
  - citydb-3dtiler
  - examples
---

This page lists example commands that were used to test `citydb-3dtiler` with various datasets. Note that some
values, such as identifiers, coordinates or attribute names, depend on the dataset and must be adapted to your data.

## Command structure

A `citydb-3dtiler` command consists of the following parts, in this order:

1. How the tool is run: in a [Docker container](docker.md) or in a [Python environment](python.md)
2. The [database connection options](database.md)
3. Optionally, the [filter options](filter.md) and other global [options](cli.md#options)
4. The command, [`advise`](advise.md) or [`tile`](tile.md), followed by its options

=== "Docker"

    ```bash
    docker run --rm -i -t --name citydb-3dtiler \
      -v ./:/home/tester/citydb-3dtiler/shared:rw \
    tumgis/citydb-3dtiler:latest \
      --db-host my.host.de --db-port 5432 \
      --db-name citydb --db-schema citydb \
      --db-username postgres --db-password changeMe \
      --type-name Building \
      tile \
      --tiles-version 1.0
    ```

=== "Python"

    ```bash
    python3 citydb-3dtiler.py \
      --db-host my.host.de --db-port 5432 \
      --db-name citydb --db-schema citydb \
      --db-username postgres --db-password changeMe \
      --type-name Building \
      tile \
      --tiles-version 1.0
    ```

The examples below only show parts 3 and 4. Prepend the first two parts from the example above to run them.

## Advise examples

Create an advice file with a custom name:

```bash
advise --output-file muenchen3d.yml
```

Create an advice file for separate tilesets per object class:

```bash
--separate-tilesets objectclass \
advise
```

## Filter examples

Filter by feature identifiers:

```bash
--id _20210907161723_295,_20210907161723_1,_20210907161723_220 \
tile
```

Filter by object classes:

```bash
--type-name WallSurface,OuterFloorSurface,OuterCeilingSurface \
tile
```

Combine a type name filter with a limit and start index:

```bash
--type-name WallSurface,OuterFloorSurface,OuterCeilingSurface,RoofSurface \
--limit 100000 --start-index 200000 \
tile
```

Filter by bounding box, with and without SRID:

```bash
--bbox 564822,5932935,566924,5934737,25832 \
tile
```

```bash
--bbox 564822,5932935,566924,5934737 \
--bbox-mode contains-precise \
tile
```

Filter with a CQL2 expression on attribute values:

```bash
--type-name Building \
--filter "gen_grundhoehenn > '20' AND gen_grundflaeche2d > '30'" \
tile \
--attributes selected \
--selected-attributes gen_grundhoehenn,gen_grundflaeche2d
```

Filter with a spatial CQL2 expression:

```bash
--type-name Building \
--filter "s_within(st_envelope(~geom),BBOX(564573,5933311,565095,5933739,25832))" \
tile
```

Filter with an SQL expression:

```bash
--sql-filter "gen_citygrid_unitid.pro_value LIKE '2021%' AND st_dwithin(st_geomfromtext('POINT(566924 5934737)',25832), ~geom, 2000)" \
tile \
--attributes selected \
--selected-attributes gen_citygrid_unitid
```

## Tile examples

Use a custom materials file and property-based styling:

```bash
tile \
--custom-style tum_colors.csv \
--style-mode property-based
```

Render transparent materials and write the tiles to a custom folder:

```bash
tile \
--transparency blend \
--output-folder tilesets
```

Create tiles without styling:

```bash
tile --style-mode no-style
```

Create separate tilesets with property-based styling and selected attributes in a flat structure:

```bash
--separate-tilesets objectclass \
tile \
--style-mode property-based \
--attributes selected \
--selected-attributes core_name,gen_objektart
```

Create separate tilesets with all attributes in a nested structure:

```bash
--separate-tilesets objectclass \
tile \
--style-mode property-based \
--attributes all \
--attribute-structure nested
```

Create 3D Tiles `1.0` with a vertical offset:

```bash
tile \
--tiles-version 1.0 \
--vertical-offset 3.5
```

## Test datasets

The following open datasets were used to test `citydb-3dtiler`. They are good starting points for your own
experiments:

- [SamplyCity](https://muratkendir.github.io/samplycity/){target="blank"} sample dataset
- [Hamburg LoD3 buildings](https://suche.transparenz.hamburg.de/dataset/3d-gebaeudemodell-lod3-0-hh-hamburg17){target="blank"} (CityGML `2.0`)
- [swissBUILDINGS3D 3.0](https://www.swisstopo.admin.ch/de/landschaftmodell-swissbuildings3d-3-0-beta){target="blank"} (CityGML `2.0`)

Results of previous test campaigns with these and other datasets, including Melbourne and Bern, are available
[here](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/){target="blank"}.
