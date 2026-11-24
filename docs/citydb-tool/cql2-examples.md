---
title: CQL2 examples
description: Examples of CQL2 filter expressions in CQL2 text and CQL2 JSON
tags:
  - citydb-tool
  - cql2
  - query
  - filter
---

# CQL2 examples

The following examples show typical filters, for example for the `export` or `delete` command. Unless noted
otherwise, they use `--type-name=bldg:Building`.

**Buildings taller than 20 meters within a bounding box**

=== "CQL2 text"

    ```text
    S_INTERSECTS(core:envelope, BBOX(350900, 5866600, 351200, 5866900)) AND con:height > 20
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "and",
      "args": [
        {
          "op": "s_intersects",
          "args": [
            {"property": "core:envelope"},
            {"bbox": [350900, 5866600, 351200, 5866900]}
          ]
        },
        {"op": ">", "args": [{"property": "con:height"}, 20]}
      ]
    }
    ```

**Buildings within 50 meters of a point given in WGS84 (`--filter-crs=4326`)**

=== "CQL2 text"

    ```text
    S_DWITHIN(core:envelope, POINT(12.78397 52.92956), 50, 'm')
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "s_dwithin",
      "args": [
        {"property": "core:envelope"},
        {"type": "Point", "coordinates": [12.78397, 52.92956]},
        50,
        "m"
      ]
    }
    ```

**Buildings with a ground surface within a polygon**

=== "CQL2 text"

    ```text
    S_WITHIN(core:boundary.con:GroundSurface.core:lod2MultiSurface, POLYGON((350900 5866600, 351200 5866600, 351200 5866900, 350900 5866900, 350900 5866600)))
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "s_within",
      "args": [
        {"property": "core:boundary.con:GroundSurface.core:lod2MultiSurface"},
        {
          "type": "Polygon",
          "coordinates": [[[350900, 5866600], [351200, 5866600], [351200, 5866900], [350900, 5866900], [350900, 5866600]]]
        }
      ]
    }
    ```

**Buildings with a roof surface at a given point**

=== "CQL2 text"

    ```text
    S_INTERSECTS(core:boundary.con:RoofSurface.core:lod2MultiSurface, POINT(351050 5866734))
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "s_intersects",
      "args": [
        {"property": "core:boundary.con:RoofSurface.core:lod2MultiSurface"},
        {"type": "Point", "coordinates": [351050, 5866734]}
      ]
    }
    ```

**Buildings with one of several roof types**

=== "CQL2 text"

    ```text
    bldg:roofType IN ('3100', '3200', '3300')
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "in",
      "args": [{"property": "bldg:roofType"}, ["3100", "3200", "3300"]]
    }
    ```

**Buildings with a measured height between 10 and 20 meters**

=== "CQL2 text"

    ```text
    con:height[con:status = 'measured'] BETWEEN 10 AND 20
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "between",
      "args": [
        {"property": "con:height[con:status = 'measured']"},
        10,
        20
      ]
    }
    ```

**Buildings whose average storey height exceeds 3.5 meters**

=== "CQL2 text"

    ```text
    con:height / bldg:storeysAboveGround > 3.5
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": ">",
      "args": [
        {
          "op": "/",
          "args": [
            {"property": "con:height"},
            {"property": "bldg:storeysAboveGround"}
          ]
        },
        3.5
      ]
    }
    ```

**Buildings with a specific municipality key stored as generic string attribute**

=== "CQL2 text"

    ```text
    gen:Gemeindeschluessel = '12071160'
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "=",
      "args": [{"property": "gen:Gemeindeschluessel"}, "12071160"]
    }
    ```

**Buildings with more than four storeys according to a generic integer attribute**

=== "CQL2 text"

    ```text
    gen:storeys::int > 4
    ```

=== "CQL2 JSON"

    ```json
    {"op": ">", "args": [{"property": "gen:storeys::int"}, 4]}
    ```

**Buildings constructed before 1950 according to a generic timestamp attribute**

=== "CQL2 text"

    ```text
    gen:constructionDate::timestamp < DATE('1950-01-01')
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "<",
      "args": [
        {"property": "gen:constructionDate::timestamp"},
        {"date": "1950-01-01"}
      ]
    }
    ```

**Buildings with an energy rating of at least 2 in the generic attribute set `energy`**

=== "CQL2 text"

    ```text
    gen:energy.gen:rating::int >= 2
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": ">=",
      "args": [{"property": "gen:energy.gen:rating::int"}, 2]
    }
    ```

**Buildings without a generic attribute `owner`**

=== "CQL2 text"

    ```text
    gen:owner IS NULL
    ```

=== "CQL2 JSON"

    ```json
    {"op": "isNull", "args": [{"property": "gen:owner"}]}
    ```

**Buildings with an address in Karlsruhe on a street starting with `Kaiser`**

=== "CQL2 text"

    ```text
    bldg:address[core:city = 'Karlsruhe'].core:street LIKE 'Kaiser%'
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "like",
      "args": [
        {"property": "bldg:address[core:city = 'Karlsruhe'].core:street"},
        "Kaiser%"
      ]
    }
    ```

**Buildings without an address**

=== "CQL2 text"

    ```text
    bldg:address IS NULL
    ```

=== "CQL2 JSON"

    ```json
    {"op": "isNull", "args": [{"property": "bldg:address"}]}
    ```

**Buildings with a building part taller than 40 meters**

=== "CQL2 text"

    ```text
    bldg:buildingPart[con:height > 40] IS NOT NULL
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "not",
      "args": [
        {
          "op": "isNull",
          "args": [{"property": "bldg:buildingPart[con:height > 40]"}]
        }
      ]
    }
    ```

**Buildings without building parts that are taller than 50 meters**

=== "CQL2 text"

    ```text
    bldg:buildingPart IS NULL AND con:height > 50
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "and",
      "args": [
        {
          "op": "isNull",
          "args": [{"property": "bldg:buildingPart"}]
        },
        {"op": ">", "args": [{"property": "con:height"}, 50]}
      ]
    }
    ```

**Buildings having the function `2000` as their second function**

=== "CQL2 text"

    ```text
    bldg:function[2] = '2000'
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "=",
      "args": [{"property": "bldg:function[2]"}, "2000"]
    }
    ```

**Buildings without the function `1000`**

=== "CQL2 text"

    ```text
    NOT bldg:function = '1000'
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "not",
      "args": [
        {"op": "=", "args": [{"property": "bldg:function"}, "1000"]}
      ]
    }
    ```

**Buildings whose name contains `hall`, ignoring upper and lower case**

=== "CQL2 text"

    ```text
    CASEI(core:name) LIKE '%hall%'
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "like",
      "args": [
        {"op": "casei", "args": [{"property": "core:name"}]},
        "%hall%"
      ]
    }
    ```

**Buildings with an external reference to a specific information system**

=== "CQL2 text"

    ```text
    core:externalReference.core:targetResource LIKE 'DEBBAL67%'
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "like",
      "args": [
        {"property": "core:externalReference.core:targetResource"},
        "DEBBAL67%"
      ]
    }
    ```

**Features created after a specific date (without `--type-name`)**

=== "CQL2 text"

    ```text
    core:creationDate > TIMESTAMP('2026-01-01T00:00:00Z')
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": ">",
      "args": [
        {"property": "core:creationDate"},
        {"timestamp": "2026-01-01T00:00:00Z"}
      ]
    }
    ```

**Features that are not terminated (without `--type-name`)**

=== "CQL2 text"

    ```text
    core:terminationDate IS NULL
    ```

=== "CQL2 JSON"

    ```json
    {
      "op": "isNull",
      "args": [{"property": "core:terminationDate"}]
    }
    ```
