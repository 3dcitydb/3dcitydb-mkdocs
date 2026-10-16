---
title: Tile only part of your data
description: Filter the features that citydb-3dtiler turns into 3D Tiles
tags:
  - citydb-3dtiler
  - filter
  - CQL2
  - SQL
---

By default, the `tile` command tiles all features in the database. Filter options let you pick a subset, for example
only buildings, a certain area, or features with specific attribute values. Like the connection options, filter
options come *before* the `tile` command. You can combine several of them; a feature is tiled only if it matches all.

!!! note
    The filter options require `citydb-3dtiler` `0.9.4` or newer. Check the [install guide](install.md#option-1-use-docker-recommended)
    for which Docker images include them.

In the examples below, `<connection>` stands for your [database connection options](connect.md).

## Tile only certain object classes

List the object classes with `-t`, separated by commas without spaces. The [advice file](../reference/advice-file.md)
lists the object classes in your database.

```bash
<connection> -t RoofSurface,WallSurface tile
```

## Tile only a certain area

Give a bounding box with `-b` as `x_min,y_min,x_max,y_max,srid`. If you leave out the SRID, the coordinate reference
system of the 3DCityDB is used.

```bash
<connection> -b 564822,5932935,566924,5934737,25832 tile
```

By default, every feature whose bounding box overlaps the area is tiled. To tile only features that lie completely
inside the area, add `--bbox-mode contains`. See the [CLI reference](../reference/cli.md#filter-options) for all
modes.

!!! tip
    If the first coordinate is negative, write the option with an equals sign, e.g. `--bbox=-500,450,-300,600`.
    Otherwise, the value is mistaken for an option.

## Tile only specific features

Select features by their identifier (`objectid`, typically the `gml:id` from CityGML) with `-i`:

```bash
<connection> -i ID_B27AC6BF-787E-4AEC-A976-4B14660FEFC9,ID_A8A5F86D-B11C-4414-B671-19F7A8C854D9 tile
```

## Tile features by attribute value

Use a [CQL2](../../citydb-tool/cql2.md) expression with `-f`, enclosed in double quotes. Refer to attributes by the
names listed in the [advice file](../reference/advice-file.md), such as `brid_class` or `gen_grundhoehenn`.

```bash
<connection> -t Bridge -f "brid_class = '1000'" \
tile --attributes selected --selected-attributes brid_class
```

!!! warning "Select the attributes you filter on"
    Every attribute used in a filter must also be selected with `--attributes selected` and `--selected-attributes`
    after the `tile` command, as in the example above. Otherwise, the command fails.

## Tile features by location with CQL2

Use `~geom` to refer to the geometry of a feature. Always add the SRID as fifth value to `BBOX`:

```bash
<connection> -f "s_intersects(~geom,BBOX(564573,5933311,565095,5933739,25832))" tile
```

## Use an SQL condition

If you are familiar with SQL and PostGIS, use `--sql-filter` with a condition as you would write it in a `WHERE`
clause. Use `~geom` for the geometry and the attribute names from the advice file.

```bash
<connection> --sql-filter "st_zmax(~geom) > 110" tile
```

## Make a quick test tileset

To try out settings on a large dataset, tile only a few features with `--limit`. Add `--start-index` to skip
features:

```bash
<connection> --limit 1000 --start-index 5000 tile
```
