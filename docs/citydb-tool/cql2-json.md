---
title: CQL2 JSON
description: The JSON encoding of CQL2 filter expressions
tags:
  - citydb-tool
  - cql2
  - query
  - filter
---

# CQL2 JSON

This page describes CQL2 JSON, the JSON encoding of CQL2 filter expressions. For an introduction to the two
encodings of CQL2, see [CQL2 text and CQL2 JSON](cql2.md#cql2-text-and-cql2-json).

In configuration files, the `"filter"` property accepts both encodings. A JSON string is parsed as CQL2 text, and a
JSON object as CQL2 JSON. The following two configurations are equivalent.

```json
{
  "exportOptions": {
    "query": {
      "featureTypes": [{"name": "bldg:Building"}],
      "filter": "con:height > 20 AND bldg:roofType = '1000'"
    }
  }
}
```

```json
{
  "exportOptions": {
    "query": {
      "featureTypes": [{"name": "bldg:Building"}],
      "filter": {
        "op": "and",
        "args": [
          {"op": ">", "args": [{"property": "con:height"}, 20]},
          {"op": "=", "args": [{"property": "bldg:roofType"}, "1000"]}
        ]
      }
    }
  }
}
```

In CQL2 JSON, every operator is an object with the operator name in `"op"` and its operands in `"args"`. Property
references are objects with a `"property"` member. All 3DCityDB extensions are available in CQL2 JSON as well. Paths,
conditions on path steps, and type casts are written as part of the property name. Operator names are case-insensitive.

The following list shows CQL2 text expressions and their CQL2 JSON counterparts. `a` and `b` stand for arbitrary
predicates. Negated forms such as `NOT LIKE`, `NOT BETWEEN`, `NOT IN`, and `IS NOT NULL` are written as `"not"` around
the positive form.

**Comparisons and logical operators**

```text
con:height > 20
```

```json
{
  "op": ">",
  "args": [{"property": "con:height"}, 20]
}
```

---

```text
a AND b
```

```json
{
  "op": "and",
  "args": [a, b]
}
```

---

```text
a OR b
```

```json
{
  "op": "or",
  "args": [a, b]
}
```

---

```text
NOT a
```

```json
{
  "op": "not",
  "args": [a]
}
```

**Comparison predicates**

```text
core:name LIKE 'Town%'
```

```json
{
  "op": "like",
  "args": [{"property": "core:name"}, "Town%"]
}
```

---

```text
con:height BETWEEN 10 AND 20
```

```json
{
  "op": "between",
  "args": [{"property": "con:height"}, 10, 20]
}
```

---

```text
bldg:roofType IN ('3100', '3200')
```

```json
{
  "op": "in",
  "args": [{"property": "bldg:roofType"}, ["3100", "3200"]]
}
```

---

```text
gen:owner IS NULL
```

```json
{
  "op": "isNull",
  "args": [{"property": "gen:owner"}]
}
```

---

```text
gen:owner IS NOT NULL
```

```json
{
  "op": "not",
  "args": [
    {"op": "isNull", "args": [{"property": "gen:owner"}]}
  ]
}
```

**Case- and accent-insensitive comparisons**

```text
CASEI(core:name) = CASEI('town hall')
```

```json
{
  "op": "=",
  "args": [
    {"op": "casei", "args": [{"property": "core:name"}]},
    {"op": "casei", "args": ["town hall"]}
  ]
}
```

---

```text
ACCENTI(gen:architect) = ACCENTI('Müller')
```

```json
{
  "op": "=",
  "args": [
    {"op": "accenti", "args": [{"property": "gen:architect"}]},
    {"op": "accenti", "args": ["Müller"]}
  ]
}
```

**Arithmetic and property paths**

```text
gen:storeys::int % 2 = 0
```

```json
{
  "op": "=",
  "args": [
    {"op": "%", "args": [{"property": "gen:storeys::int"}, 2]},
    0
  ]
}
```

---

```text
bldg:function[2] = '2000'
```

```json
{
  "op": "=",
  "args": [{"property": "bldg:function[2]"}, "2000"]
}
```

**Dates and timestamps**

```text
core:creationDate >= DATE('2025-01-01')
```

```json
{
  "op": ">=",
  "args": [
    {"property": "core:creationDate"},
    {"date": "2025-01-01"}
  ]
}
```

---

```text
core:creationDate >= TIMESTAMP('2025-01-01T00:00:00Z')
```

```json
{
  "op": ">=",
  "args": [
    {"property": "core:creationDate"},
    {"timestamp": "2025-01-01T00:00:00Z"}
  ]
}
```

**Spatial predicates**

```text
S_INTERSECTS(core:envelope, BBOX(458780, 5438330, 458832, 5438355))
```

```json
{
  "op": "s_intersects",
  "args": [
    {"property": "core:envelope"},
    {"bbox": [458780, 5438330, 458832, 5438355]}
  ]
}
```

---

```text
S_CONTAINS(core:envelope, POINT(458795 5438345))
```

```json
{
  "op": "s_contains",
  "args": [
    {"property": "core:envelope"},
    {"type": "Point", "coordinates": [458795, 5438345]}
  ]
}
```

---

```text
S_DWITHIN(core:envelope, POINT(458795 5438360), 50, 'm')
```

```json
{
  "op": "s_dwithin",
  "args": [
    {"property": "core:envelope"},
    {"type": "Point", "coordinates": [458795, 5438360]},
    50,
    "m"
  ]
}
```

**SQL predicates**

```text
SQL('select id from citydb.feature where objectid like ''BLDG%''')
```

```json
{
  "op": "sql",
  "args": [
    "select id from citydb.feature where objectid like 'BLDG%'"
  ]
}
```

!!! note
    Escaping in CQL2 JSON follows the JSON rules. A backslash in a string value is written as `\\`, so the LIKE
    pattern `%\_%` is written as `"%\\_%"`. Single quotes need no escaping.
