---
title: CQL2 query language
description: Filter features from the 3DCityDB v5 using the CQL2 query language
tags:
  - citydb-tool
  - cql2
  - query
  - filter
---

# CQL2 query language

citydb-tool uses the [OGC Common Query Language (CQL2)](https://docs.ogc.org/is/21-065r2/21-065r2.html){target="blank"} to
select the city objects to process from the 3DCityDB `v5`. CQL2 is a filter language for attribute-based and spatial
queries on feature data. citydb-tool implements large parts of the standard and supports the 3DCityDB extensions to CQL2,
which are needed to query the 3DCityDB `v5` data model, such as property paths to complex attributes and nested
subfeatures, conditions on path steps, type casts for generic attributes, and SQL subqueries.

This chapter explains how to write CQL2 filter expressions for the 3DCityDB `v5`. Filters are expressed on the
[3DCityDB `v5` data model](../3dcitydb/index.md). The chapter assumes basic knowledge of this data model and of query
languages. For the general CQL2 concepts, it refers to the standard where appropriate.

!!! note
    The feature types, properties, and namespaces available in filters are defined by the schema mapping of the
    3DCityDB `v5`. The 3DCityDB `v5` data model implements the CityGML 3.0 Conceptual Model but is not identical to it.

## Overview

### Where filters are used

CQL2 filter expressions are supported by all citydb-tool commands that select features from the 3DCityDB `v5`, such as
the [`export`](export.md#cql2-based-filtering) and [`delete`](delete.md#cql2-based-filtering) commands. They
are passed with the following command-line options and configuration settings:

| Usage                     | Description                                                                                                                                                                                                                                                       |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--filter=<cql2-text>`    | CQL2 filter in text encoding. Only features matching the filter are processed.                                                                                                                                                                                    |
| `--filter-crs=<crs>`      | SRID or identifier of the CRS of the geometry literals used in the filter. If omitted, the CRS of the 3DCityDB instance is assumed. See [here](cql2-predicates.md#coordinate-reference-system).                                                                    |
| `"filter"`, `"filterSrs"` | Filter and filter CRS in the query settings of the JSON configuration, for example of the [export](export-config.md) and [delete](delete-config.md) commands. The `"filter"` property accepts both CQL2 text and CQL2 JSON. See [here](#cql2-text-and-cql2-json). |

The filter is always combined with the feature types selected with the `--type-name` option. This is important for
[resolving property names](cql2-properties.md#names-and-namespace-prefixes).

!!! tip
    SQL queries can be embedded in CQL2 filters using the 3DCityDB extension [`SQL`](cql2-predicates.md#sql-predicates).
    Alternatively, the `--sql-filter` option accepts a plain SQL query outside of CQL2.

### CQL2 text and CQL2 JSON

CQL2 defines two encodings for filter expressions. CQL2 text is a compact, human-readable notation similar to the
`WHERE` clause of SQL. CQL2 JSON represents the same expression as a JSON object, which is easier to generate and
process by software. Both encodings support the same language constructs, including all 3DCityDB extensions.

The following filter is shown in both encodings:

```text
con:height > 20 AND bldg:roofType = '1000'
```

```json
{
  "op": "and",
  "args": [
    {"op": ">", "args": [{"property": "con:height"}, 20]},
    {"op": "=", "args": [{"property": "bldg:roofType"}, "1000"]}
  ]
}
```

The `--filter` option accepts CQL2 text. In the JSON configuration, the `"filter"` property accepts both encodings.
This chapter uses CQL2 text for all explanations. The [CQL2 JSON](cql2-json.md) page shows how each
language construct is written in CQL2 JSON, and the [examples](cql2-examples.md) are given in both
encodings.

### Supported parts of the CQL2 standard

The following table lists the conformance classes of the CQL2 standard and their support in citydb-tool.

| Conformance class                                        | Supported | Remarks                                                                                                                                                      |
|----------------------------------------------------------|:---------:|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Basic CQL2                                               |    Yes    | Comparisons, `AND`, `OR`, `NOT`, `IS [NOT] NULL`, string, numeric, boolean, and temporal literals.                                                           |
| Advanced Comparison Operators                            |    Yes    | `LIKE`, `BETWEEN`, and `IN`, each also negated with `NOT`. `BETWEEN` only accepts numeric values.                                                            |
| Case-insensitive Comparison                              |    Yes    | `CASEI` function.                                                                                                                                            |
| Accent-insensitive Comparison                            |    Yes    | `ACCENTI` function. Requires the PostgreSQL `unaccent` extension, see [here](cql2-predicates.md#case-and-accent-insensitive-comparisons).                    |
| Basic Spatial Functions                                  |    Yes    | `S_INTERSECTS` with point and bounding box literals.                                                                                                         |
| Basic Spatial Functions with additional Spatial Literals |    Yes    | All WKT geometry types except `GEOMETRYCOLLECTION`.                                                                                                          |
| Spatial Functions                                        |    Yes    | `S_INTERSECTS`, `S_EQUALS`, `S_DISJOINT`, `S_TOUCHES`, `S_WITHIN`, `S_OVERLAPS`, `S_CROSSES`, `S_CONTAINS`.                                                  |
| Temporal Functions                                       |    No     | Temporal operators such as `T_AFTER` and time intervals are not supported. Use comparison operators with date and timestamp literals instead.                |
| Array Functions                                          |    No     | Array operators such as `A_CONTAINS` are not supported. Multi-valued properties are handled as described [here](cql2-properties.md#multi-valued-properties). |
| Property-Property Comparisons                            |    Yes    | Both operands of a predicate may be property references.                                                                                                     |
| Custom Functions                                         |    No     | Only the built-in functions `CASEI`, `ACCENTI`, and `INDEX` are available.                                                                                   |
| Arithmetic Expressions                                   |    Yes    | `+`, `-`, `*`, `/`, `%`, `^`, and `DIV`.                                                                                                                     |
| CQL2 Text                                                |    Yes    | Used by the `--filter` option and in configuration files.                                                                                                    |
| CQL2 JSON                                                |    Yes    | Used in configuration files.                                                                                                                                 |

### 3DCityDB extensions to CQL2

The 3DCityDB adds the following features to CQL2 that are not part of the standard. Filters using them cannot be
exchanged with other CQL2 implementations.

| Extension                                                             | Description                                                                                                                     |
|-----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| [Property paths](cql2-properties.md#property-paths)                   | Dot-separated paths to nested properties, complex attributes, addresses, and subfeatures, for example `bldg:address.core:city`. |
| [Conditions on path steps](cql2-properties.md#conditions-on-path-steps) | Conditions in square brackets that restrict the values of a path step, for example `bldg:buildingPart[con:height > 40]`.      |
| [`INDEX()` function](cql2-properties.md#selecting-values-by-position) | Position of a value of a multi-valued property. `bldg:function[2]` is short for `bldg:function[INDEX() = 2]`.                   |
| [Type casts](cql2-properties.md#type-casts)                           | Data type of a generic attribute, for example `gen:storeys::int`.                                                               |
| [`S_DWITHIN` and `S_BEYOND`](cql2-predicates.md#distance-predicates)  | Distance-based spatial predicates with an optional unit of measurement.                                                         |
| [`SQL` predicate](cql2-predicates.md#sql-predicates)                  | SQL subquery returning the IDs of the matching features.                                                                        |

## Quick start

The following examples give a first impression of CQL2 filters. All commands export buildings to a CityGML file. The
connection options of the `export` command are omitted for better readability (`[...]`).

All examples in this chapter use property names with namespace prefixes, such as `con:height`, because this makes
filters unambiguous. The prefix can also be omitted, for example `height > 20`. citydb-tool then searches for the best
matching property or treats the name as generic attribute, see [here](cql2-properties.md#names-and-namespace-prefixes).

Export buildings that are taller than 20 meters:

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o buildings.gml \
        --type-name=bldg:Building \
        --filter="con:height > 20"
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o buildings.gml ^
        --type-name=bldg:Building ^
        --filter="con:height > 20"
    ```

Export buildings with a flat roof (roof type `1000`) and at least four storeys:

```bash
--filter="bldg:roofType = '1000' AND bldg:storeysAboveGround >= 4"
```

Export buildings whose name starts with `Town hall`, ignoring upper and lower case:

```bash
--filter="CASEI(core:name) LIKE CASEI('town hall%')"
```

Export buildings located in Karlsruhe according to their address:

```bash
--filter="bldg:address.core:city = 'Karlsruhe'"
```

Export buildings with a generic attribute `district` of value `Nord` or `Sued`:

```bash
--filter="gen:district IN ('Nord', 'Sued')"
```

Export all features whose envelope intersects a bounding box given in WGS84 coordinates:

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o features.gml \
        --filter="S_INTERSECTS(core:envelope, BBOX(13.369, 52.506, 13.405, 52.520))" \
        --filter-crs=4326
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o features.gml ^
        --filter="S_INTERSECTS(core:envelope, BBOX(13.369, 52.506, 13.405, 52.520))" ^
        --filter-crs=4326
    ```

The building blocks of these filters are explained in detail on the following pages:

- [Property references](cql2-properties.md): names, paths, generic attributes, and multi-valued properties.
- [Literals and predicates](cql2-predicates.md): literals, comparison, logical, arithmetic, spatial, and
  SQL predicates.
- [CQL2 JSON](cql2-json.md): the JSON encoding of filter expressions.
- [Examples](cql2-examples.md): complete filters for typical tasks.

## Using filters on the command line

On the command line, enclose the filter in double quotes so that it is passed as a single argument and string
literals can use single quotes. Some characters may additionally be interpreted by the shell:

- In Linux shells such as `bash`, the dollar sign and the backtick are special within double quotes. A backslash is
  only special in front of these characters, a double quote, or another backslash, so LIKE escapes such as `\_` are
  passed unchanged.
- In Windows CMD, `%` introduces environment variables in batch files. In batch files, write `%%` for every `%` of a
  LIKE pattern.

!!! tip
    For complex filters, consider storing the filter in the [configuration file](config.md). This
    avoids shell escaping and makes filters reusable.

## Limitations

The following parts of CQL2 are not supported by citydb-tool:

- Temporal operators (`T_AFTER`, `T_BEFORE`, `T_INTERSECTS`, ...) and time interval literals (`INTERVAL`). Compare
  dates and timestamps with the comparison operators instead.
- Array operators (`A_EQUALS`, `A_CONTAINS`, `A_CONTAINEDBY`, `A_OVERLAPS`) and array literals outside of `IN` lists.
- Custom functions other than `CASEI`, `ACCENTI`, and `INDEX`.
- `GEOMETRYCOLLECTION` and empty geometries as literals.

Filters using an unsupported part fail with an error message before the database is queried.
