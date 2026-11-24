---
title: CQL2 literals and predicates
description: Literals, predicates, and operators available in CQL2 filters
tags:
  - citydb-tool
  - cql2
  - query
  - filter
  - spatial filter
---

# CQL2 literals and predicates

This page describes the literals, predicates, and operators that can be used in CQL2 filter expressions.

## Literals

### Strings

String literals are enclosed in single quotes. A single quote within a string is written as two single quotes or
escaped with a backslash.

```text
gen:architect = 'O''Brien & Partner'
gen:architect = 'O\'Brien & Partner'
```

CQL2 defines the backslash as escape character in string literals. Besides `\'` for a single quote, the escape
sequences `\a`, `\b`, `\t`, `\n`, `\v`, `\f`, and `\r` represent control characters, for example `\t` a tab.
To use a backslash as part of the value in front of one of these characters, write `\\`. A backslash in front of any
other character is kept as it is, which is relevant for [LIKE patterns](#like).

### Numbers and booleans

Numbers are written without quotes, with a dot as decimal separator and optionally with an exponent, such as `20`,
`-1.5`, or `2.5E3`. The boolean literals are `TRUE` and `FALSE`.

When a property is compared to a literal of a different type, the literal is converted to the type of the property
if possible. For example, `con:height = '7'` compares the height with the number `7`. However, the operands of a
comparison must have compatible types after this conversion, and literals in an `IN` list must not mix strings and
numbers.

### Dates and timestamps

Dates and timestamps are written as `DATE('<date>')` and `TIMESTAMP('<timestamp>')` with values following ISO 8601.
Timestamps should include a time zone, such as `Z` for UTC.

```text
core:creationDate >= TIMESTAMP('2025-01-01T00:00:00Z')
core:lastModificationDate < DATE('2026-01-01')
```

When a date is compared with a timestamp property, the date part of the timestamp is compared.

### Geometries and bounding boxes

Geometries are written in Well-Known Text (WKT). Supported geometry types are `POINT`, `LINESTRING`, `POLYGON`,
`MULTIPOINT`, `MULTILINESTRING`, and `MULTIPOLYGON`, each with two- or three-dimensional coordinates. `Z` can be added
after the geometry type for 3D coordinates.

```text
POINT(458795 5438345)
POINT Z (458795 5438345 12.5)
LINESTRING(458780 5438360, 458860 5438360)
POLYGON((458780 5438330, 458832 5438330, 458832 5438355, 458780 5438355, 458780 5438330))
```

Bounding boxes are written as `BBOX(minx, miny, maxx, maxy)` or, in 3D, as `BBOX(minx, miny, minz, maxx, maxy, maxz)`.

```text
BBOX(458780, 5438330, 458832, 5438355)
BBOX(458780, 5438330, 0, 458832, 5438355, 50)
```

The coordinates are expected in the CRS of the 3DCityDB instance unless a different CRS is set with `--filter-crs`, see
[here](#coordinate-reference-system). `GEOMETRYCOLLECTION` and empty geometries are not supported.

## Comparison predicates

### Binary comparisons

The comparison operators are `=`, `<>`, `<`, `<=`, `>`, and `>=`. They can be applied to strings, numbers, booleans,
dates, and timestamps. Both operands can be property references or literals.

```sql
bldg:roofType = '3100'
con:height <> 7
con:height >= 21 AND con:height <= 28
core:name = gen:officialName -- (1)!
```

1. Property-property comparison.

### LIKE

The `LIKE` operator matches a string against a pattern. In the pattern, `%` matches any sequence of characters and
`_` matches exactly one character. `NOT LIKE` selects strings that do not match.

```text
core:name LIKE 'Town hall%'
core:objectId LIKE 'DEBY_LOD2_______'
core:name NOT LIKE '%(demolished)'
```

To match the characters `%` and `_` literally, precede them with a backslash. Since `\%` and `\_` are not escape
sequences of string literals, the backslash is passed on to the pattern: the string literal `'%\_%'` contains the
pattern `%\_%`, which matches all strings containing an underscore. The form `'%\\_%'` with a doubled backslash is
equivalent.

```sql
core:objectId LIKE '%\_%' -- (1)!
gen:discount LIKE '%\%' -- (2)!
```

1. Object identifiers containing an underscore.
2. Values ending with a percent sign.

!!! note
    CQL2 does not define how a backslash in front of characters other than the escape sequences is handled in
    CQL2 text. Other CQL2 implementations may therefore interpret `'%\_%'` differently. In
    [CQL2 JSON](cql2-json.md), the pattern is unambiguous.

### BETWEEN

The `BETWEEN` operator tests whether a number lies within a range. Both bounds are included. `NOT BETWEEN` selects
values outside the range. The operand and both bounds must be numeric.

```text
con:height BETWEEN 10 AND 20
gen:area::double NOT BETWEEN 200 AND 400
```

The CQL2 standard defines `BETWEEN` for numeric values only. To test whether a string, date, or timestamp lies within
a range, combine `>=` and `<=` instead.

```text
core:creationDate >= TIMESTAMP('2025-01-01T00:00:00Z') AND core:creationDate <= TIMESTAMP('2025-12-31T23:59:59Z')
```

### IN

The `IN` operator tests whether a value equals one of the values in a list. `NOT IN` selects values that are not in
the list. All values of the list must have the same type.

```text
bldg:roofType IN ('3100', '3200', '3300')
con:height IN (7, 10.5, 14)
bldg:function NOT IN ('1000')
```

### IS NULL

The `IS NULL` operator tests whether a property has no value. `IS NOT NULL` tests whether a value exists. Both can be
applied to all properties, including complex attributes, generic attribute sets, addresses, and feature relations.
For [multi-valued properties](cql2-properties.md#multi-valued-properties), `IS NULL` is only satisfied if the
property has no value at all, while `IS NOT NULL` is satisfied by a single value.

```text
gen:owner IS NULL
core:terminationDate IS NULL
bldg:address IS NOT NULL
```

### Case- and accent-insensitive comparisons

The `CASEI` function converts a string to lower case. To compare strings regardless of upper and lower case, apply
it to both operands. The `ACCENTI` function removes diacritical marks, such as umlauts and accents, in the same way.
Both functions can be nested and can be used with `=`, `<>`, and `LIKE`.

```text
CASEI(core:name) = CASEI('town hall')
CASEI(core:name) LIKE CASEI('%HALL%')
ACCENTI(gen:architect) = ACCENTI('Müller-Lüdenscheidt')
ACCENTI(CASEI(gen:street)) LIKE ACCENTI(CASEI('münchner%'))
```

!!! note
    `ACCENTI` uses the PostgreSQL function `unaccent`, which is provided by the
    [`unaccent` extension](https://www.postgresql.org/docs/current/unaccent.html){target="blank"}. The extension is not
    installed by default and must be enabled in the database of the 3DCityDB instance by a superuser with
    `CREATE EXTENSION unaccent;`. Without it, filters using `ACCENTI` fail.

## Logical operators

Predicates are combined with `AND`, `OR`, and `NOT`. `NOT` binds stronger than `AND`, and `AND` binds stronger than
`OR`. Use parentheses to change the order of evaluation. Keywords are case-insensitive.

```sql
gen:district = 'Mitte' OR gen:district = 'Nord' AND con:height > 20 -- (1)!
(gen:district = 'Mitte' OR gen:district = 'Nord') AND con:height > 20
NOT (gen:district = 'Mitte' OR con:height > 20)
```

1. `OR` is evaluated last.

The literals `TRUE` and `FALSE` can be used as predicates as well. For example, `TRUE` selects all features.

## Arithmetic expressions

Numeric values can be combined with arithmetic operators. Arithmetic expressions can be used wherever a number is
expected, and both operands can be property references.

| Operator   | Description                                                                          |
|------------|--------------------------------------------------------------------------------------|
| `+`, `-`   | Addition and subtraction.                                                            |
| `*`, `/`   | Multiplication and division. Dividing two integers returns a floating-point result. |
| `DIV`      | Integer division.                                                                    |
| `%`        | Remainder of an integer division (modulo).                                           |
| `^`        | Exponentiation.                                                                      |

`^` binds stronger than `*`, `/`, `DIV`, and `%`, which bind stronger than `+` and `-`. Parentheses change the
order of evaluation. A minus sign negates a value or property, such as `-con:height`.

```sql
con:height / bldg:storeysAboveGround > 3.5 -- (1)!
(con:height + 1) * 2 > 50
gen:storeys::int % 2 = 0 -- (2)!
```

1. Average storey height.
2. Even number of storeys.

Properties can appear on both sides of a comparison and can be combined with each other in calculations:

```sql
con:height > bldg:storeysAboveGround * 3 -- (1)!
gen:volume::measure / gen:area::double < con:height -- (2)!
gen:area::double * bldg:storeysAboveGround > gen:volume::measure + 1000 -- (3)!
con:height BETWEEN bldg:storeysAboveGround * 3 AND bldg:storeysAboveGround * 4
```

1. Property on the right side.
2. Properties on both sides.
3. Calculations on both sides.

## Spatial predicates

### Spatial operators

Spatial predicates test the spatial relationship between two geometries. One operand is usually a geometry property of
the feature, the other a [geometry literal](#geometries-and-bounding-boxes). The following operators are supported:

| Operator       | Satisfied if the geometries ...                                           |
|----------------|---------------------------------------------------------------------------|
| `S_INTERSECTS` | have at least one point in common.                                        |
| `S_DISJOINT`   | have no point in common.                                                  |
| `S_EQUALS`     | are spatially equal.                                                      |
| `S_TOUCHES`    | have at least one boundary point in common, but no interior points.       |
| `S_WITHIN`     | the first geometry lies completely inside the second.                     |
| `S_CONTAINS`   | the first geometry completely contains the second.                        |
| `S_OVERLAPS`   | intersect and have the same dimension, but neither contains the other.    |
| `S_CROSSES`    | intersect and the intersection has a lower dimension than the geometries. |

The semantics follow the Dimensionally Extended Nine-Intersection Model (DE-9IM), as described in the
[CQL2 standard](https://docs.ogc.org/is/21-065r2/21-065r2.html){target="blank"}, and are evaluated by PostGIS.

!!! note
    The predicates are evaluated in 2D, so heights are ignored and solids are compared by their 2D projection. If the
    PostGIS SFCGAL extension is installed, `S_INTERSECTS`, `S_DWITHIN`, and `S_BEYOND` are evaluated in 3D. A filter
    geometry without heights is then treated as having any height.

```text
S_INTERSECTS(core:envelope, BBOX(458780, 5438330, 458832, 5438355))
S_WITHIN(core:envelope, POLYGON((458780 5438330, 458832 5438330, 458832 5438355, 458780 5438355, 458780 5438330)))
S_CONTAINS(core:envelope, POINT(458795 5438345))
S_CROSSES(core:envelope, LINESTRING(458780 5438345, 458850 5438345))
```

### Envelope and geometry properties

Spatial predicates can be applied to two kinds of properties:

- `core:envelope` is the bounding box of the feature. It is available for all features and is the fastest way to
  filter by location. `S_INTERSECTS` and `S_DISJOINT` with a `BBOX` literal on `core:envelope` use a bounding box test
  on the spatial index. With a 3D `BBOX`, the test considers the height as well.
- Geometry properties of the feature, such as `core:lod2MultiSurface`, `core:lod2Solid`, or `core:lod1Solid`, contain
  the actual geometry. Filtering by geometry properties is more precise but also more expensive. The available geometry
  properties depend on the feature type, so `--type-name` is usually required.

```text
S_INTERSECTS(core:lod2MultiSurface, POINT(458795 5438345))
```

!!! tip
    A filter on `core:envelope` is a good first choice for spatial selections. It is fast and satisfied for every
    feature whose bounding box meets the condition.

### Distance predicates

The 3DCityDB extensions `S_DWITHIN` and `S_BEYOND` test the distance between two geometries. `S_DWITHIN` is satisfied
if the geometries are within the given distance of each other, `S_BEYOND` if they are farther apart.

```text
S_DWITHIN(<geometry>, <geometry>, <distance>[, '<unit>'])
S_BEYOND(<geometry>, <geometry>, <distance>[, '<unit>'])
```

Without unit, the distance is measured in the units of the CRS of the 3DCityDB instance. With a unit, the distance is
converted accordingly. The following units are supported:

| Unit                                     | Values                                                         |
|------------------------------------------|----------------------------------------------------------------|
| Millimeter, centimeter, meter, kilometer | `mm`, `cm`, `m`, `km` and their names, such as `meter` or `metres` |
| Inch, foot, yard, mile, nautical mile    | `in`, `ft`, `yd`, `mi`, `nmi` and their names, such as `feet` or `miles` |
| Degree, radian                           | `deg`, `rad` and their names                                   |

```text
S_DWITHIN(core:envelope, POINT(458795 5438360), 50, 'm')
S_BEYOND(core:envelope, POINT(458795 5438360), 1, 'km')
```

### Coordinate reference system

By default, geometry and bounding box literals are interpreted in the CRS of the 3DCityDB instance. To use coordinates
of a different CRS, specify the CRS with `--filter-crs`, either as SRID or as CRS identifier. citydb-tool transforms the
literals into the CRS of the 3DCityDB instance before evaluating the filter. In configuration files, the
`"filterSrs"` property serves the same purpose.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o nearby.gml \
        --type-name=bldg:Building \
        --filter="S_DWITHIN(core:envelope, POINT(12.78397 52.92956), 50, 'm')" \
        --filter-crs=4326
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o nearby.gml ^
        --type-name=bldg:Building ^
        --filter="S_DWITHIN(core:envelope, POINT(12.78397 52.92956), 50, 'm')" ^
        --filter-crs=4326
    ```

!!! note
    Coordinates in WKT and `BBOX` literals are always written in the order x, y (and z), which is longitude,
    latitude for geographic CRSs such as WGS84, regardless of the axis order defined for the CRS.

## SQL predicates

For conditions that cannot be expressed in CQL2, the 3DCityDB extension `SQL` embeds an SQL query in a filter. The
query must return a single column with the database IDs of the matching features, i.e., values of the `id` column
of the [`FEATURE`](../3dcitydb/feature-module.md#feature-table) table. The predicate is satisfied for features whose ID
is returned by the query. It can be combined with other predicates and negated with `NOT`.

```text
SQL('select feature_id from citydb.property where name = ''district'' and val_string = ''Nord''')
con:height > 20 AND SQL('select id from citydb.feature where objectid like ''%\_08''')
NOT SQL('select id from citydb.feature where objectid = ''BLDG_01''')
```

The query is passed as string literal, so single quotes within the query must be doubled, and backslashes follow the
rules for [string literals](#strings). Since citydb-tool embeds the query as subquery in the condition
`id IN (<query>)`, it must be a `SELECT` statement. For safety, queries calling 3DCityDB database functions that modify
data, such as `delete_feature` or `cleanup_schema`, are rejected.

The `--sql-filter` option provides the same functionality without the CQL2 wrapper. If both `--filter` and
`--sql-filter` are used, a feature must satisfy both.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o buildings.gml \
        --type-name=bldg:Building \
        --filter="con:height > 20" \
        --sql-filter="select feature_id from citydb.property where name = 'district' and val_string = 'Nord'"
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o buildings.gml ^
        --type-name=bldg:Building ^
        --filter="con:height > 20" ^
        --sql-filter="select feature_id from citydb.property where name = 'district' and val_string = 'Nord'"
    ```

!!! tip
    The database schema is described in the [3DCityDB `v5` chapter](../3dcitydb/index.md). Use the schema name of your
    3DCityDB instance in the SQL query, `citydb` by default.
