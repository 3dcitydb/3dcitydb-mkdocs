---
title: CQL2 Query Language
subtitle: Filtering and Querying Data with CQL2
description:
# icon: material/filter
status: wip
---

# CQL2 query language

**CQL2** (Common Query Language 2) is an advanced query language used to filter and query spatial and attribute
data within the **citydb-tool**. It allows users to define precise queries for exporting or deleting features
based on attribute values, spatial properties, or logical conditions.

CQL2 is a standard maintained by the **OGC (Open Geospatial Consortium)** and serves as an evolution of the
original CQL language, providing better expressiveness and flexibility for data filtering.

Key Features of CQL2

- Expressive Syntax: Combines logical operators with a rich set of functions for building complex queries.
- Spatial Filtering: Supports geospatial functions to filter data based on spatial relationships.
- Ease of Use: Simple, human-readable expressions that are easy to construct and interpret.

---

## Using CQL2 with citydb-tool

citydb-tool allows the use of the `-f` or `--filter` option followed by a CQL2 expression to filter data when exporting or
deleting records. This enables users to select only the relevant subset of data based on attribute values,
spatial conditions, or both.

**Two Encodings for CQL2**
1. **Text-based (string) encoding**
2. **JSON-based encoding**

Both encodings are supported by citydb-tool, giving you flexibility in how you structure your filters.

## Syntax

The general syntax for using CQL2 with citydb-tool is:

```bash
citydb [command] -f "<CQL2 Expression>"
```

Where `<CQL2 Expression>` is a valid CQL2 query that defines the filtering conditions for the data export.

## Writing CQL2 expressions

A CQL2 expression consists of attribute names, operators, and values. It can also include spatial functions to handle geospatial conditions.

### Understanding literals
In CQL2, literals are direct values that appear in your filter expressions. Common types of literals include:

- Strings: Enclosed in single quotes in text-based queries (e.g., \`'Forest tree 3'\`), or as JSON strings in JSON-based queries (e.g., \`"Forest tree 3"\`).
- Numbers: Used without quotes in both text-based and JSON-based queries (e.g., \`> 10\` or \`10\` in JSON).
- Booleans: Typically represented as \`true\` or \`false\`.
- Dates/Times: Represented in ISO-8601 format (e.g., \`'2023-01-31'\` or \`"2023-01-31"\` in JSON), if your data or schema supports date/time attributes.

### Attribute references

#### Implicit vs. explicit attribute references

When writing CQL2 queries, it's important to correctly reference attributes by their full property names rather than 
relying on implicit assumptions. While some query tools allow shorthand notations for convenience, 
the proper CQL2 syntax requires explicit attribute references.

For example, in some cases, a query like:

```bash
citydb export citygml --filter="height > 1"
```

might work as expected, but it is a simplified form. The correct way is to specify the full property path. For instance, 
if the attribute height belongs to the bldg (building) namespace, the correct query should be:

```bash
citydb export citygml --filter="bldg.height > 1"
```

#### Advanced handling of namespaces and complex attributes
In 3D CityDB, attributes may be defined with namespaces or at nested (child) levels.
This advanced scenario requires careful handling:

*Namespaces & Object Classes:*
Use a colon (:) to separate namespace prefixes from attribute names. For example, the object class Building might be 
referenced as bldg:Building. citydb-tool recognizes alias names for object classes, but incorrect casing or namespace 
mismatches can lead to errors since the system is extremely case sensitive.

*Property Paths:*
Use dot (.) notation to define paths to nested attributes (e.g., bldg.details.height). While top-level attributes 
can be referenced with a simple name, lower-level or child attributes require explicit, fully qualified paths.

*Multi-occurring Values:*
For attributes that occur multiple times (arrays), reference specific occurrences using list notation (e.g., property[1] 
for the first occurrence). Note: Indexing starts at 1 rather than 0.

*Generic Attributes and Datatype Specification:*
When dealing with generic attributes (such as those in a property table) where the database does not infer the data type 
automatically, you may need to explicitly specify the expected datatype using a cast-like syntax (e.g., ::datatype similar 
to PostgreSQL conventions).

For example, using the -t option to specify the feature type along with -f for the filter:

```bash
citydb export citygml -t Building -f "bldg:height < 15"
```

Here, Building is the target object class (with its associated namespace alias), and bldg:height is the explicitly 
referenced attribute. This explicit approach minimizes ambiguity—especially important when attributes are defined on 
child levels or in complex structures.

### Attribute filtering

Filter based on attribute values using comparison operators such as =, !=, <, <=, >, and >=. Logical operators
AND, OR, and NOT can be used to combine conditions.

#### Basic example
Text-based Filter
```bash
citydb export citygml --filter="name = 'Forest tree 3'" -o filtered_tree.gml
```

Json-based filter
```json
{
  "op": "=",
  "args": [
    { "property": "name" },
    "Forest tree 3"
  ]
}
```

#### Combining with logical operators

Text-based filter
=== "Linux"
    ```bash 
    citydb export citygml \
           --filter="name = 'Forest tree 3' AND height > '1'" \
           -o filtered_tree.gml
    ```
    
=== "Windows"
    ```bash
    citydb export citygml ^
           --filter="name = 'Forest tree 3' AND height > '1'" ^
           -o filtered_tree.gml
    ```

Json-based filter
```json
{
  "op": "AND",
  "args": [
    {
      "op": "=",
      "args": [
        { "property": "name" },
        "Forest tree 3"
      ]
    },
    {
      "op": ">",
      "args": [
        { "property": "height" },
        "1"
      ]
    }
  ]
}
```

#### Filtering with lists

Text-based filter

=== "Linux"
    ```bash
    citydb export citygml \
           --filter="name IN ('Forest tree 1', 'Forest tree 2', 'Forest tree 3')" \
           -o filtered_trees.gml
    ```
    
=== "Windows"
    ```bash
    citydb export citygml ^
           --filter="name IN ('Forest tree 1', 'Forest tree 2', 'Forest tree 3')" ^
           -o filtered_trees.gml
    ```

Json-based filter
```json
{
  "op": "IN",
  "args": [
    { "property": "name" },
    ["Forest tree 1", "Forest tree 2", "Forest tree 3"]
  ]
}
```

### Spatial filtering

Use spatial functions to filter based on the spatial relationship of geometries. Commonly used functions include:

- `intersects`: Returns true if two geometries intersect.
- `contains`: Returns true if one geometry contains another.
- `within`: Returns true if one geometry is within another.

#### Example

Text-based filter

=== "Linux"
    ```bash
    citydb export citygml \
           --filter="S_INTERSECTS(Envelope, \
           BBOX(-560.8678155819734, 604.1012795512906, \
           -553.8099297783192, 627.1318523068805))" \
           @options.txt -o=output.gml
    ```
=== "Windows"
    ```bash
    citydb export citygml ^
           --filter="S_INTERSECTS(Envelope, ^
           BBOX(-560.8678155819734, 604.1012795512906, ^
           -553.8099297783192, 627.1318523068805))" ^
           @options.txt -o=output.gml
    ```


Json-based filter
```json
{
  "op": "func",
  "function": "S_INTERSECTS",
  "args": [
    { "property": "Envelope" },
    {
      "op": "func",
      "function": "BBOX",
      "args": [
        -560.8678155819734,
        604.1012795512906,
        -553.8099297783192,
        627.1318523068805
      ]
    }
  ]
}
```

