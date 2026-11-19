---
title: Filtering features
description: Selecting the features to tile with citydb-3dtiler
tags:
  - citydb-3dtiler
  - filter
  - CQL2
  - SQL
---

By default, the [`tile`](tile.md) command processes all features in the 3DCityDB that have a geometry. The filter options
let you create subsets of the dataset, for example to tile only buildings, a specific area or features with certain
attribute values. Like the [database connection options](database.md), the filter options are global options and must
be specified *before* the command.

## Filter options

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

Multiple filter options can be combined. In this case, a feature must satisfy all filter criteria to be processed.

## Usage

### ID filter

The `--id` option selects features by their identifier, which is stored in the `objectid` column of the `FEATURE`
table and typically corresponds to the `gml:id` in CityGML. Multiple identifiers are separated by commas without
spaces.

```bash
--id ID_B27AC6BF-787E-4AEC-A976-4B14660FEFC9,ID_A8A5F86D-B11C-4414-B671-19F7A8C854D9
```

### Type name filter

The `--type-name` option selects features by the name of their object class, such as `Building`, `WallSurface` or
`RoofSurface`. Multiple names are separated by commas without spaces. The names are used without a namespace prefix.
The [`advise`](advise.md) command lists all object classes available in your database.

```bash
--type-name GroundSurface,WallSurface,RoofSurface
```

!!! note
    Since type names are matched without namespace, object classes with the same name in different namespaces cannot
    be distinguished. Support for namespace prefixes is planned for a future release.

### Bounding box filter

The `--bbox` option selects features based on a 2D bounding box, given as `x_min,y_min,x_max,y_max` followed by an
optional SRID. The values are separated by commas without spaces. If the SRID is omitted, the coordinates are assumed
to be in the coordinate reference system of the 3DCityDB, which is read from the `advice.yml` file created by the
[`advise`](advise.md) command.

```bash
--bbox 564822,5932935,566924,5934737,25832
```

The `--bbox-mode` option determines how the bounding box is evaluated against the feature geometries:

| Mode                 | Description                                                                                                  |
|----------------------|--------------------------------------------------------------------------------------------------------------|
| `intersects`         | The bounding box of the geometry intersects the filter box. This is the fastest mode and the default.        |
| `intersects-precise` | Like `intersects`, but additionally checks that the actual geometry (projected to 2D) intersects the filter box. |
| `contains`           | The bounding box of the geometry is completely within the filter box.                                       |
| `contains-precise`   | Like `contains`, but additionally checks the actual (2D) footprint of the geometry against the filter box.  |

The `intersects` and `contains` modes only use the spatial index of the geometries and are therefore fast. The
`-precise` modes are more accurate but take longer on large datasets.

### CQL2-based filtering

The `--filter` option takes a filter expression in [OGC CQL2](https://www.ogc.org/publications/standard/cql2/){target="blank"}
text encoding. The expression must be enclosed in double quotes on the command line. Attributes are referenced by
their names as listed in the `advice.yml` file (see [below](#attribute-names)), and `~geom` refers to the geometry of
the feature.

```bash
--filter "gen_grundhoehenn > '20' AND gen_grundflaeche2d > '30'"
```

!!! warning
    Attributes used in a CQL2 or SQL filter must currently also be selected for the tiles with the
    [`--attributes selected`](tile.md#attributes) and `--selected-attributes` options of the `tile` command, for example
    `tile --attributes selected --selected-attributes gen_grundhoehenn,gen_grundflaeche2d`. Automatic detection of the
    referenced attributes is planned for a future release.

Spatial operators can be used as well. If an operator does not work with 3D geometries, apply it to the 2D envelope of
the geometry using `st_envelope(~geom)`:

```bash
--filter "s_within(st_envelope(~geom),BBOX(564573,5933311,565095,5933739,25832))"
```

!!! info
    The general CQL2 syntax is described in the [CQL2 chapter](../citydb-tool/cql2.md) of the citydb-tool documentation.
    Note, however, that `citydb-3dtiler` uses its own attribute naming scheme, which differs from the JSON path syntax
    used by citydb-tool.

### SQL-based filtering

The `--sql-filter` option accepts a condition as you would write it in the `WHERE` clause of a standard SQL query. As
with CQL2, attributes are referenced by their names in the `advice.yml` file, and `~geom` refers to the geometry of the
feature. This allows you to use the full range of PostgreSQL and PostGIS functions.

```bash
--sql-filter "gen_citygrid_unitid.pro_value LIKE '2021%' AND st_dwithin(st_geomfromtext('POINT(566924 5934737)',25832), ~geom, 2000)"
```

!!! tip
    Attribute values are stored in the `pro_value` column of the attribute. Comparisons such as `=`, `<` or `>` are
    automatically rewritten to use this column. For other operators such as `LIKE`, reference the column explicitly as
    `<attribute>.pro_value`, as shown in the example above.

### Attribute names

The CQL2 and SQL filters, as well as the [attribute options](tile.md#attributes) of the `tile` command, reference
feature attributes by names that are derived from the namespace alias and the name of the property in the 3DCityDB:

- Top-level properties are named `<namespace>_<name>`, for example `gen_grundhoehenn` for the generic attribute
  `GrundhoeheNN` or `core_name` for the `name` property.
- Nested properties are prefixed with the name of their parent property and two underscores:
  `<parent namespace>_<parent name>__<namespace>_<name>`.

All names are in lower case. Run the [`advise`](advise.md) command to get a list of the available attribute names for
each object class in your database.

### Limit and start index

The `--limit` option restricts the number of features to process, and the `--start-index` option skips the given
number of features from the beginning of the result set. Use them together to process a large dataset in chunks or to
quickly create a small test tileset.

```bash
--limit 100000 --start-index 200000
```
