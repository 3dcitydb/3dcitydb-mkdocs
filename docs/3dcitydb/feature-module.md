---
title: Feature module
description: Tables for storing features and properties
tags:
  - 3dcitydb
  - relational schema
  - feature
  - property
  - address
---

The Feature module defines the tables for storing city objects, including their attributes and relationships
with other features, geometries, and appearances. It provides a streamlined yet powerful framework capable of
representing all city objects defined in CityGML.

![feature module](assets/feature-module.png)
/// figure-caption
Feature module of the 3DCityDB `v5` relational schema.
///

## `FEATURE` table

The `FEATURE` table is the central table in the 3DCityDB `v5` relational schema. It serves as the primary storage for
all city objects and uniquely identifiable entities such as buildings, roads, or vegetation objects within
your city model.

Each feature is assigned a unique `id` as the primary key. The `objectid` is a string identifier used to uniquely
reference a feature within the database and datasets. It is recommended to use a globally unique value for `objectid` and ensure
this column is always populated. The `identifier` column provides an optional identifier to uniquely distinguish the
feature across different systems and potentially multiple versions of the same real-world object. It must be
accompanied by a code space, stored in the `identifier_codespace` column, which indicates the authority responsible for
maintaining the `identifier`.

The `objectclass_id` enforces the type of the feature, such as building, window, city furniture, or tree. It serves as a
foreign key to the [`OBJECTCLASS`](metadata-module.md#objectclass-table) table, which lists
all feature types supported by the 3DCityDB instance.

The bi-temporal timestamp pairs `creation_date` and `termination_date`, along with `valid_from` and `valid_to`, enable
the management of feature history. The `creation_date` and `termination_date` refer to database time, indicating when
the feature was inserted or terminated in the database, while `valid_from` and `valid_to` define the feature's lifespan
in the real world. The `creation_date` shall be automatically populated when the feature is first imported into the
3DCityDB, unless the input dataset already contains a value. The `termination_date` can be used as a flag to indicate that a
feature version is no longer active, without physically deleting the feature from the database.

The columns `last_modification_date`, `updating_person`, `reason_for_update`, and `lineage` are specific to 3DCityDB and
are not defined in CityGML. These metadata fields capture details about the feature's origin, its update history, the person
responsible for changes, and the reasons behind those updates.

The spatial `envelope` column stores the minimal 3D rectangle that encloses the features. This column can be
used for efficient spatial queries of features.

## `PROPERTY` table

The `PROPERTY` table is the central place for storing feature properties in the 3DCityDB. Each property is recorded with
its name, namespace, data type, and value. This design ensures flexibility and extensibility, allowing the addition of
new properties without schema changes. Properties can represent attributes or relationships linking features,
geometries, and appearances.

!!! question "Which properties are available for a given feature?"
    As described above, each feature must be assigned a **feature type** from the
    [`OBJECTCLASS`](metadata-module.md#objectclass-table) table. This table includes a JSON-based type definition
    specifying the properties available for a feature. It also includes inheritance information, enabling you to
    look up properties inherited from superfeatures. Check out the [Metadata module](metadata-module.md#objectclass-table)
    for more information.

The property's name and namespace are stored in the `name` and `namespace_id` columns, respectively. The
`namespace_id` is a foreign key referencing a namespace from the [`NAMESPACE`](metadata-module.md#namespace-table)
table. Properties are linked to their owning feature via `feature_id`, which points to the `FEATURE` table.

The `datatype_id` column enforces the property’s data type and uses a type definition in the
[`DATATYPE`](metadata-module.md#datatype-table) table. The value of the property is stored in one or more `val_*`
columns, depending on its data type.

### Simple and complex attributes

Simple attribute values such as integers, doubles, strings, or timestamps are stored in the corresponding `val_int`,
`val_double`, `val_string`, or `val_timestamp` columns. Boolean values are stored in the `val_int` column, with `0`
representing false and `1` representing true. Array values of attributes are represented as JSON arrays in the
`val_array` column, with items that can either be simple values, JSON objects, or JSON arrays themselves.

The `val_content` column can hold arbitrary content as a character blob, while the `val_content_mime_type` column
specifies the MIME type of the content. This setup can be used to store property values in the format they appear in the original
input datasets (e.g., GML/XML or JSON).

The `PROPERTY` table also supports complex attributes, which may include both a simple value and nested attributes
of either simple or complex types. When the value and the nested attributes can be represented using multiple `val_*`
columns, the entire complex attribute can still be stored in a single row. For example, a measurement with a unit can
be stored with the value in the `val_double` column and the unit in the `val_uom` column.

When complex types cannot be captured in a single row, they are instead represented hierarchically within the
`PROPERTY` table. Nested attributes reference their parent attribute through the `parent_id` foreign key, which links
to the `id` primary key of the parent property. This structure enables the representation of hierarchies with arbitrary
depth.

### Relationships

In addition to attributes, the `PROPERTY` table stores relationships that define how a feature is connected to other
objects. These relationships are stored as separate rows and are not mixed with attribute values in the same row.

**Relationships to other features** are represented by the `feature_id` column, linking to related features in
the `FEATURE` table. The `val_relation_type` defines the type of the feature relationship as an integer:

- `0` for "relates" (a general association between features), and
- `1` for "contains" (a subfeature relationship, where the referenced feature is considered a part of the parent feature).

!!! note
    The relation type has specific implications. For example, "contained" features are deleted along with their parent
    features, while "related" features are not (see [delete functions](db-functions.md#delete-functions)).

**Geometries** are linked to features through the `val_geometry_id` column, which references the
[`GEOMETRY_DATA`](geometry-module.md#geometry_data-table) table. The optional `val_lod` indicates the Level of Detail (LoD) of the geometry.

**Implicit geometries** are referenced via the `val_implicitgeom_id` foreign key and are also stored in the
[`GEOMETRY_DATA`](geometry-module.md#geometry_data-table) table. In addition to `val_lod`, the
transformation matrix and reference point needed to define the feature's implicit representation are stored in
`val_array` and `val_implicitgeom_refpoint`.

**Appearance and address information** are linked using the `val_appearance_id` and `val_address_id` foreign keys,
referencing the [`APPEARANCE`](appearance-module.md#appearance-table) and [`ADDRESS`](#address-table) tables.

### Examples

!!! question "In which columns do you store or look up property values?"
    The `PROPERTY` table is **type-enforced**, with each data type defined in the
    [`DATATYPE`](metadata-module.md#datatype-table) table. This table includes a JSON-based type definition for all
    attributes and relationships, that clearly specifies which `val_*` column the property value should be stored in
    and whether a property has nested properties. Each nested property will have its own data type and type definition.
    Check out the [Metadata module](metadata-module.md#datatype-table) for more information.

To demonstrate how feature properties are stored in the `PROPERTY` table based on their data type, let's use the `name`
attribute of city objects as an example. The `name` attribute is of type [`core:Code`](https://docs.ogc.org/is/20-010/20-010.html#Code-section), with a value that is a
string-based term and an optional `codeSpace` attribute. The JSON type definition from the [`DATATYPE`](metadata-module.md#datatype-table)
table is as follows:

```json
{
  "identifier": "core:Code",
  "description": "Code is a basic type for a string-based term, keyword, or name that can additionally have a code space.",
  "table": "property",
  "value": {
    "column": "val_string",
    "type": "string"
  },
  "properties": [
    {
      "name": "codeSpace",
      "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
      "description": "Specifies the code space of the term, typically a dictionary, thesaurus, classification scheme, authority, or pattern for the term.",
      "value": {
        "column": "val_codespace",
        "type": "string"
      }
    }
  ]
}
```

Based on this definition, the `core:Code` value is stored as a string in the `val_string` column, while the nested
`codeSpace` attribute, also a string, is mapped to the `val_codespace` column. Since the type definition does not
require linking the `codeSpace` via `parent_id`, both values are stored within the same row, as shown below. Note that
all other `PROPERTY` columns have been omitted for brevity.

| id | name   | parent_id | val_string   | val_codespace                   | ... |
|----|--------|-----------|--------------|---------------------------------|-----|
| 1  | "name" | `NULL`    | "myBuilding" | "https://example.org/buildings" | ... |

The `height` of CityGML buildings can be represented using the [`con:Height`](https://docs.ogc.org/is/20-010/20-010.html#Height-section)
data type, which serves as example of a more complex type. The JSON type definition for this data type in the `DATATYPE`
table is shown below:

=== "con:Height"

    ```json
    {
      "identifier": "con:Height",
      "description": "Height represents a vertical distance (measured or estimated) between a low reference and a high reference.",
      "table": "property",
      "value": {
        "property": 0
      },
      "properties": [
        {
          "name": "value",
          "namespace": "http://3dcitydb.org/3dcitydb/construction/5.0",
          "description": "Specifies the value of the height above or below ground.",
          "type": "core:Measure",
          "join": {
            "table": "property",
            "fromColumn": "id",
            "toColumn": "parent_id"
          }
        },
        {
          "name": "status",
          "namespace": "http://3dcitydb.org/3dcitydb/construction/5.0",
          "description": "Indicates the way the height has been captured.",
          "type": "core:String",
          "join": {
            "table": "property",
            "fromColumn": "id",
            "toColumn": "parent_id"
          }
        },
        {
          "name": "lowReference",
          "namespace": "http://3dcitydb.org/3dcitydb/construction/5.0",
          "description": "Indicates the low point used to calculate the value of the height.",
          "type": "core:Code",
          "join": {
            "table": "property",
            "fromColumn": "id",
            "toColumn": "parent_id"
          }
        },
        {
          "name": "highReference",
          "namespace": "http://3dcitydb.org/3dcitydb/construction/5.0",
          "description": "Indicates the high point used to calculate the value of the height.",
          "type": "core:Code",
          "join": {
            "table": "property",
            "fromColumn": "id",
            "toColumn": "parent_id"
          }
        }
      ]
    }
    ```

=== "core:Measure"

    ```json
    {
      "identifier": "core:Measure",
      "description": "Measure is a basic type that represents an amount encoded as double value with a unit of measurement.",
      "table": "property",
      "value": {
        "column": "val_double",
        "type": "double"
      },
      "properties": [
        {
          "name": "uom",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the unit of measurement of the amount.",
          "value": {
            "column": "val_uom",
            "type": "string"
          }
        }
      ]
    }
    ```

=== "core:String"

    ```json
    {
      "identifier": "core:String",
      "description": "String is a basic type that represents a sequence of characters.",
      "table": "property",
      "value": {
        "column": "val_string",
        "type": "string"
      }
    }
    ```

This type definition specifies that `con:Height` has four nested attributes:

1. **`"value"` of type `core:Measure`**: Represents a measurement, with the value stored in `val_double` and the unit in
   `val_uom`.
2. **`"status"` of type `core:String`**: A simple string stored in `val_string`.
3. **`"lowReference"` of type `core:Code`**: As explained earlier, a string stored in `val_string`, with the code space stored
   in `val_codespace`.
4. **`"highReference"` of type `core:Code`**: Stored the same way as `lowReference`.

Additionally, the JSON defines a `"join"` property for each nested attribute that links back to the parent
attribute through the `parent_id` foreign key. This establishes a hierarchical relationship and means that
each nested attribute should be stored in a separate row, all referencing the same parent `id`. Since `con:Height`
does not store an own `"value"`, the parent row will have `NULL` in all `val_*` columns.

| id | name            | parent_id | val_string          | val_double | val_uom | val_codespace                    | ... |
|----|-----------------|-----------|---------------------|------------|---------|----------------------------------|-----|
| 1  | "height"        | `NULL`    | `NULL`              | `NULL`     | `NULL`  | `NULL`                           | ... |
| 2  | "value"         | 1         | `NULL`              | 11.0       | "m"     | `NULL`                           | ... |
| 3  | "status"        | 1         | "measured"          | `NULL`     | `NULL`  | `NULL`                           | ... |
| 4  | "lowReference"  | 1         | "lowestGroundPoint" | `NULL`     | `NULL`  | "https://references.org/heights" | ... |
| 5  | "highReference" | 1         | "highestRoofEdge"   | `NULL`     | `NULL`  | "https://references.org/heights" | ... |

## `ADDRESS` table

Although [`Address`](https://docs.ogc.org/is/20-010/20-010.html#Address-section) is a feature type
in CityGML, it is not stored in the `FEATURE` table. Instead, it is mapped to a dedicated `ADDRESS` table in
the 3DCityDB relational schema. Address data is valuable in its own right and serves as foundation for specialized
location services. Storing addresses in a separate table enables more efficient indexing, querying, and updates
without impacting the `FEATURE` table, which may contain a large number of city objects and spatial features.

The columns `objectid`, `identifier`, and `identifier_codespace` in the `ADDRESS` table are used to store unique identifiers for
an address object, serving the same purpose as in the `FEATURE` table, as explained above. Address information is
then mapped to the following dedicated columns:

| Column         | Description                                                                                                                          |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `street`       | Holds the name of the street or road where the address is located.                                                                   |
| `house_number` | Stores the building or house number.                                                                                                 |
| `po_box`       | Stores the post office box number associated with the address, if applicable.                                                        |
| `zip_code`     | Holds the postal or ZIP code, helping to define the location more precisely.                                                         |
| `city`         | Stores the name of the city or locality.                                                                                             |
| `state`        | Contains the name of the state, province, or region.                                                                                 |
| `country`      | Stores the name of the country in which the address resides.                                                                         |
| `free_text`    | Allows the storage of address information as unstructured text. It can be used to supplement or replace the other structured fields. |
| `multi_point`  | Stores the geolocation of an address as multi-point geometry, enabling efficient spatial queries and reverse location services.      |

Together, these columns provide a comprehensive and flexible structure for storing address data in a variety of
formats and contexts. However, if the original address information is more complex and needs to be preserved, the
`content` column can be used to store the address data in its original format as a character blob, with the
`content_mime_type` column specifying the MIME type of the content.

!!! note
    The multi-point geometry of an address must be provided in the same Coordinate Reference System (CRS) as defined
    for your entire 3DCityDB instance.
