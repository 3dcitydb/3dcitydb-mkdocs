---
# title: Filter Options
description: Filter Options
tags:
  - filter
  - citydb-3dtiler
  - cql2
  - sql
---

# Filter Options

This section lists the options that can be used to filter objects with respect to different aspects.

## --limit

It can be used to specify a limit number to reduce the selected features.

## --start-index

It can be used to specify the starting index (known as "Offset" in SQL context) of the selected features.

??? tip "What kind of order is considered while using start-index?"
    The order considered when using `--start-index` is the existing order in the `feature` table in the database. This order may not match the order of features within the file you are importing.

## --id (-i)

ID number(s) (`citydb.feature.objectid` in the database) of specific feature(s). 

Use comma as id number separator for multiple inputs and do not add space character between the id numbers.

- Example :  `--id 9876,1234,8765,2345`

??? tip "What is the objectid?"
    `objectid` in the `feature` table were also known as `gmlid` in the former versions of the 3DCityDBs, which is the same value with the `gml:id` attributes in the imported CityGML or CityJSON file.

## --type-name (-t)

Type name of the features or a set of type names (aka ObjectClass). 

Use comma as type name separator for multiple inputs and do not add space character between the type names

- Example : `--type-name WallSurface,RoofSurfaceSurface,GroundSurface`

## --bbox (-b)

A bounding box element containing the x_min, y_min, x_max, y_max, and SRID values, to be used as the filtering geometry. Use comma as separator and do not add space character between the min/max values.

- Example : `--bbox 564822,5932935,566924,5934737,25832`

??? tip "What if the SRID value is not specified?"
    If the SRID value is not specified, than the current SRID (EPSG Code Number) in the database will be assumed as the common CRS.

??? tip "SRID Values"
    If you are not sure about the CRS/SRS value of your dataset, you can search for the term `srsName` in the imported file or check the data in the `database_srs` table within the `citydb` schema in your database. The given SRID value must be a predefined CRS Code available in [EPSG.io](https://epsg.io).

## --bbox-mode

This option can be used to specify the method of the boundary box usage as the filtering geometry. There are four options to select:

- `intersects` (default value):
    - It uses spatial indexes, but not exact geometries, to query any intersection. (Fast, but less reliable results)
- `intersects-precise` :
    - It uses both spatial indexes and geometries to query any intersection. (Slower, but more reliable results)
- `contains` :
    - It uses spatial indexes, but not exact geometries, to query any containment case. (Fast, but less reliable results)
- `contains-precise` :
    - It uses both spatial indexes and geometries to query any containment case. (Slower, but more reliable results)

??? warning "must always be used with `--bbox option`"
    `--bbox-mode` option must always be used together with `--bbox`.

- Example : `--bbox 564822,5932935,566924,5934737,25832 --bbox-mode intersects-precise`

## --filter (-f)

CQL2 filter expression. 

Use the attribute names listed in the advice.yml file exactly as they are written in the file ( Common pattern : `[NAMESPACE]_[PROPERTY]` ). Use `~geom` to refer to the geometry column.

- Example : `--filter "gen_revision_jahr >= 2021"`
- Example : `s_overlaps(~geom,BBOX(9.978199, 53.541309, 10.010294, 53.557241, 4326)`

??? warning "Must be wrapped in quotes"
    Both SQL and CQL2 filters' arguments must be wrapped in quotes.
    An example: `--filter "bldg_usage ='1100'"`. You can use the single quotes to use encapsulate the internal string values.

??? tip "What if spatial operator fails against 3D geometries?"
    If the selected spatial operator does not work with the 3D geometries, try to use : `'st_envelope(~geom)'` or `st_convexhull(~geom)` (would give more reliable results)

## --sql-filter

The SQL Filter accepts WHERE conditions just as they are written in standard SQL queries. Use '~geom' to refer to the geometry column.

- Example : `bldg_usage = ‘residential’ AND bldg_height__measured_height > 12.5` 