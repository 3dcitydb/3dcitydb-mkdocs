---
title: Metadata module
description: Tables for storing meta-information
tags:
  - 3dcitydb
  - ade
  - database srs
  - datatype
  - metadata
  - namespace
  - objectclass
  - relational schema
---

The Metadata module provides meta-information about the 3DCityDB instance and its city model data. The 3DCityDB `v5`
enforces type constraints, requiring features in the [`FEATURE`](feature-module.md#feature-table) table and properties
in the [`PROPERTY`](feature-module.md#property-table) table to have a type defined in the Metadata module.
The predefined types of the Metadata module implement the [CityGML 3.0 Conceptual Model (CM)](https://docs.ogc.org/is/20-010/20-010.html),
making the 3DCityDB `v5` a **complete implementation of CityGML 3.0**. CityGML versions 2.0 and 1.0 are supported
by mapping their elements to the predefined types.

The Metadata module is **extensible**, allowing the addition of user-defined types and properties
to store domain-specific data not covered by CityGML. As a result, the 3DCityDB `v5` fully supports the
CityGML [Application Domain Extension (ADE)](https://docs.ogc.org/is/20-010/20-010.html#toc66) mechanism.

![metadata module](assets/metadata-module.png)
/// figure-caption
Metadata module of the 3DCityDB `v5` relational schema.
///

## `NAMESPACE` table

All types and properties in the 3DCityDB `v5` must be associated with a namespace. This helps avoid name collisions and
logically categorizes the content stored in the 3DCityDB `v5` according to the CityGML 3.0 CM. Namespaces are
recorded in the `NAMESPACE` table and populated with the following values when setting up a 3DCityDB instance.

| id | alias | namespace                                        |
|----|-------|--------------------------------------------------|
| 1  | core  | http://3dcitydb.org/3dcitydb/core/5.0            |
| 2  | dyn   | http://3dcitydb.org/3dcitydb/dynamizer/5.0       |
| 3  | gen   | http://3dcitydb.org/3dcitydb/generics/5.0        |
| 4  | luse  | http://3dcitydb.org/3dcitydb/landuse/5.0         |
| 5  | pcl   | http://3dcitydb.org/3dcitydb/pointcloud/5.0      |
| 6  | dem   | http://3dcitydb.org/3dcitydb/relief/5.0          |
| 7  | tran  | http://3dcitydb.org/3dcitydb/transportation/5.0  |
| 8  | con   | http://3dcitydb.org/3dcitydb/construction/5.0    |
| 9  | tun   | http://3dcitydb.org/3dcitydb/tunnel/5.0          |
| 10 | bldg  | http://3dcitydb.org/3dcitydb/building/5.0        |
| 11 | brid  | http://3dcitydb.org/3dcitydb/bridge/5.0          |
| 12 | app   | http://3dcitydb.org/3dcitydb/appearance/5.0      |
| 13 | grp   | http://3dcitydb.org/3dcitydb/cityobjectgroup/5.0 |
| 14 | veg   | http://3dcitydb.org/3dcitydb/vegetation/5.0      |
| 15 | vers  | http://3dcitydb.org/3dcitydb/versioning/5.0      |
| 16 | wtr   | http://3dcitydb.org/3dcitydb/waterbody/5.0       |
| 17 | frn   | http://3dcitydb.org/3dcitydb/cityfurniture/5.0   |
| 18 | depr  | http://3dcitydb.org/3dcitydb/deprecated/5.0      |

The namespaces are closely aligned with the thematic modules defined in the CityGML 3.0 CM. Each namespace is
associated with an `alias`, which acts as a shortcut for the namespace and must be unique across
all entries in the `NAMESPACE` table.

The `depr` namespace serves a special purpose by identifying deprecated types and properties used to store content from
CityGML 2.0 and 1.0. Since CityGML 3.0 is not fully backward compatible, such content cannot be mapped to predefined
types and properties in other namespaces. This ensures that deprecated content can be stored, maintaining full support
for CityGML 2.0 and 1.0.

The list of namespaces in the `NAMESPACE` table is not exhaustive and can be extended with user-defined namespaces,
typically from an ADE. In this case, the `ade_id` foreign key must reference the ADE registered in the [`ADE`](#ade-table)
table that defines the namespace.

## `OBJECTCLASS` table

The `OBJECTCLASS` table serves as the registry for all feature types supported by the 3DCityDB `v5`. Every feature
stored in the [`FEATURE`](feature-module.md#feature-table) table must be associated with a feature type from this table.
When setting up a new 3DCityDB instance, the table is populated with type definitions for all feature classes defined
in the CityGML 3.0 CM, including abstract classes.

Every feature type registered in the `OBJECTCLASS` table is uniquely identified by its name and namespace, which are
stored in the `classname` and `namespace_id` columns, respectively. The `namespace_id` is a foreign key referencing a
namespace from the [`NAMESPACE`](#namespace-table) table.

The flags `is_abstract` and `is_toplevel` determine whether the feature type is abstract or a top-level feature, based
on the corresponding feature class definition in the CityGML 3.0 CM. For both flags, a value of `1` means true, and `0`
represents false.

!!! note
    Abstract feature types cannot be used as a type for features in the [`FEATURE`](feature-module.md#feature-table) table.

Type inheritance is represented by the `superclass_id` column, which serves as a foreign key linking a subtype to its
supertype. Transitive inheritance is supported, allowing feature types to form hierarchical structures.

Users can extend the `OBJECTCLASS` table with custom feature types, typically from an ADE. As mentioned earlier, the
`ade_id` foreign key must point to the ADE registered in the `ADE` table that defines the feature type. Ensure that
the correct supertype is defined for custom feature types.

### JSON-based schema mapping

In addition to the type information stored in the columns mentioned above, the `schema` column contains a JSON-based
schema mapping that provides additional details about the feature type and its mapping to the relational schema of
the 3DCityDB `v5`, including feature properties and their data types.

!!! tip
    The JSON-based schema mapping is essential for understanding how feature types and their properties are represented
    and retrieved in the 3DCityDB `v5`. Tools can automatically parse and interpret it to interact with the database.

The example below shows the JSON definitions for the `Road` feature type and the common supertype `AbstractObject`.

=== "tran:Road"

    ```json
    {
      "identifier": "tran:Road",
      "description": "A Road is a transportation space used by vehicles, bicycles and/or pedestrians.",
      "table": "feature",
      "properties": [
        {
          "name": "class",
          "namespace": "http://3dcitydb.org/3dcitydb/transportation/5.0",
          "description": "Indicates the specific type of the Road.",
          "type": "core:Code"
        },
        {
          "name": "function",
          "namespace": "http://3dcitydb.org/3dcitydb/transportation/5.0",
          "description": "Specifies the intended purposes of the Road.",
          "type": "core:Code"
        },
        {
          "name": "usage",
          "namespace": "http://3dcitydb.org/3dcitydb/transportation/5.0",
          "description": "Specifies the actual uses of the Road.",
          "type": "core:Code"
        },
        {
          "name": "section",
          "namespace": "http://3dcitydb.org/3dcitydb/transportation/5.0",
          "description": "Relates to the sections that are part of the Road.",
          "type": "core:FeatureProperty",
          "target": "tran:Section"
        },
        {
          "name": "intersection",
          "namespace": "http://3dcitydb.org/3dcitydb/transportation/5.0",
          "description": "Relates to the intersections that are part of the Road.",
          "type": "core:FeatureProperty",
          "target": "tran:Intersection"
        }
      ]
    }
    ```

=== "core:AbstractObject"

    ```json
    {
      "identifier": "core:AbstractObject",
      "description": "AbstractObject is the abstract superclass of all feature and object types.",
      "table": "feature",
      "properties": [
        {
          "name": "id",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the internal database ID of the object.",
          "value": {
            "column": "id",
            "type": "integer"
          }
        },
        {
          "name": "objectId",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the identifier of the object that is unique within the database. Using a globally unique identifier is recommended.",
          "value": {
            "column": "objectid",
            "type": "string"
          }
        },
        {
          "name": "identifier",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies an optional identifier of the object that is globally unique.",
          "value": {
            "column": "identifier",
            "type": "string"
          }
        },
        {
          "name": "codeSpace",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the code space of the identifier, typically a reference to the maintaining authority.",
          "value": {
            "column": "identifier_codespace",
            "type": "string"
          },
          "parent": 1
        },
        {
          "name": "envelope",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the minimum bounding box that encloses the entire object.",
          "value": {
            "column": "envelope",
            "type": "core:Envelope"
          }
        },
        {
          "name": "objectClassId",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the internal object class ID of the object.",
          "value": {
            "column": "objectclass_id",
            "type": "integer"
          }
        },
        {
          "name": "lastModificationDate",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Indicates the date and time at which the object was last updated in the database.",
          "value": {
            "column": "last_modification_date",
            "type": "timestamp"
          }
        },
        {
          "name": "updatingPerson",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the person who last updated the object in the database.",
          "value": {
            "column": "updating_person",
            "type": "string"
          }
        },
        {
          "name": "reasonForUpdate",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the reason for the last update of the object in the database.",
          "value": {
            "column": "reason_for_update",
            "type": "string"
          }
        },
        {
          "name": "lineage",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the lineage information of the object.",
          "value": {
            "column": "lineage",
            "type": "string"
          }
        },
        {
          "name": "description",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies a text description of the object.",
          "type": "core:StringOrRef"
        },
        {
          "name": "descriptionReference",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies a reference to a remote text description of the object.",
          "type": "core:Reference"
        },
        {
          "name": "name",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies a label or identifier of the object, commonly a descriptive name.",
          "type": "core:Code"
        }
      ]
    }
    ```

Each feature type is represented as a JSON object and includes an `"identifier"`, which combines the namespace alias and type name
for unique identification and reference. It also has a `"description"` property that defines the type, based on CityGML 3.0
definitions . The `"table"` property specifies the 3DCityDB table where the feature is stored, typically the
[`FEATURE`](feature-module.md#feature-table) table.

The `"properties"` array lists the feature type's properties as separate JSON objects. Each property has a `"name"`, matching
the name from CityGML 3.0, and a `"namespace"`, with a value from the `NAMESPACE` table. These values must be used
for the `name` and `namespace_id` columns when the property is stored in the [`PROPERTY`](feature-module.md#property-table)
table. The CityGML 3.0 definition of the property is available as `"description"`.

!!! note
    To get the list of all properties for a given feature, be sure to combine the `"properties"` of its feature
    type with the `"properties"` of all its supertypes.

There are two ways to define the data type of each property:

1. Using the `"type"` property, which references a predefined data type from the [`DATATYPE`](#datatype-table) table
   via its identifier (the default method).
2. Using the `"value"` property to define the data type inline in the JSON object.

The data type referenced through `"type"` defines all details on how to store the property values (see the
[`DATATYPE`](#datatype-table) table). When the property is stored in the [`PROPERTY`](feature-module.md#property-table)
table based on its type definition (the default), it is implicitly linked to the feature instance through the
`feature_id` column of the `PROPERTY` table.

Examples of defining a data type inline using `"value"` can be found in the JSON definition of `core:AbstractObject` shown above.
A `"value"` includes the `"column"` name where the value is stored and its database-specific data `"type"`. By default,
it is assumed that the column belongs to the table defined for the feature type.

If the referenced `"type"` is not stored in the `PROPERTY` table, or the column of the inline-defined `"value"` does not
belong to the feature table, the JSON object can include a `"join"` or `"joinTable"` property to specify the target
table storing the property and how it is linked from the feature table. The example below shows the `"join"` definition
for the `"imageURI"` property in the `core:AbstractTexture` type:

```json
{
  "name": "imageURI",
  "namespace": "http://3dcitydb.org/3dcitydb/appearance/5.0",
  "description": "Specifies the URI that points to the external texture image.",
  "value": {
    "column": "image_uri",
    "type": "string"
  },
  "join": {
    "table": "tex_image",
    "fromColumn": "tex_image_id",
    "toColumn": "id"
  }
}
```

Properties of type `core:FeatureProperty` or `core:GeometryProperty` are used to link a feature to another feature or a
geometry representation. The JSON objects for these properties must include an additional `"target"` property, which holds
the identifier of the referenced feature type or geometry type as its value. The following two properties, taken from
the `core:AbstractObject` feature type, illustrate this.

=== "Feature property"

    ```json
    {
      "name": "boundary",
      "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
      "description": "Relates to surfaces that bound the space.",
      "type": "core:FeatureProperty",
      "target": "core:AbstractSpaceBoundary"
    }
    ```

=== "Geometry property"

    ```json
    {
      "name": "lod1Solid",
      "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
      "description": "Relates to a 3D Solid geometry that represents the space in Level of Detail 1.",
      "type": "core:GeometryProperty",
      "target": "core:AbstractSolid"
    }
    ```

!!! tip
    The [3DCityDB software package](../download.md#3dcitydb-database-scripts) includes a JSON Schema specification that defines
    the allowed structure of the schema mapping for feature types. You can find this schema file, named
    `schema-mapping.schema.json`, in the `json-schema` folder of the software package.

## `DATATYPE` table

Similar to the `OBJECTCLASS` table, the `DATATYPE` table serves as a registry for all data types supported by 3DCityDB
`v5`. All feature properties stored in the [`PROPERTY`](feature-module.md#property-table) table must reference their
data type from this table. Its layout follows that of the `OBJECTCLASS` table. It is populated with type definitions
for all data types defined in the CityGML 3.0 CM, including abstract types, during the setup of the 3DCityDB `v5`.

Every data type registered in the `DATATYPE` table is uniquely identified by its name and namespace, which are
stored in the `typename` and `namespace_id` columns, respectively. The `namespace_id` is a foreign key referencing a
namespace from the [`NAMESPACE`](#namespace-table) table.

The flag `is_abstract` determines whether the data type is abstract, based on the corresponding definition in the
CityGML 3.0 CM. A value of `1` means true, and `0` represents false. Similar to feature types, abstract data
types cannot be used as a type for a feature property.

Type inheritance is represented by the `supertype_id` column, which serves as a foreign key linking a subtype to its
supertype. Transitive inheritance is supported, allowing data types to form hierarchical structures.

Users can extend the `DATATYPE` table with custom data types, typically from an ADE. As with feature types, the
`ade_id` foreign key must point to the ADE registered in the `ADE` table that defines the data type. Ensure that the
correct supertype is defined for custom data types.

### JSON-based schema mapping

Each data type defines the structure and format for storing property values in the database, including details on the
property value format and the table and column where the value is stored. This schema mapping information is available
in the `schema` column in JSON format.

!!! tip
    Similar to feature types, the JSON-based schema mapping is crucial for understanding how properties are represented
    and retrieved in the 3DCityDB `v5`. The JSON format can be easily parsed and interpreted by tools, enabling automatic
    interaction with the database.

Primitive data types for simple attributes, such as integers, doubles, strings, or timestamps, are defined as
shown below for the `core:String` type.

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

All data types have a unique `"identifier"`, which combines its namespace alias and type name, along with a `"description"`
that provides its definition from CityGML 3.0. The `"table"` property specifies the 3DCityDB table where the data type
is stored, typically the [`PROPERTY`](feature-module.md#property-table) table. For simple types, the `"value"` object
defines the target `"column"` and its database-specific data `"type"` for storing the attribute value.

In addition to simple types, the 3DCityDB supports complex types, which may include both a simple value
and nested properties of either simple or complex types.

=== "core:Code"

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

=== "core:ExternalReference"

    ```json
    {
      "identifier": "core:ExternalReference",
      "description": "ExternalReference is a reference to a corresponding object in another information system, for example in the German cadastre (ALKIS), the German topographic information system (ATKIS), or the OS UK MasterMap.",
      "table": "property",
      "properties": [
        {
          "name": "targetResource",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the URI that points to the object in the external information system.",
          "type": "core:URI"
        },
        {
          "name": "informationSystem",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies the URI that points to the external information system.",
          "value": {
            "column": "val_codespace",
            "type": "string"
          }
        },
        {
          "name": "relationType",
          "namespace": "http://3dcitydb.org/3dcitydb/core/5.0",
          "description": "Specifies a URI that additionally qualifies the ExternalReference. The URI can point to a definition from an external ontology (e.g. the sameAs relation from OWL) and allows for mapping the ExternalReference to RDF triples.",
          "value": {
            "column": "val_string",
            "type": "string"
          }
        }
      ]
    }
    ```

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

The nested properties of a complex data type are listed in the `"properties"` array
as separate JSON objects. Each nested property has a `"name"`, matching the name from CityGML 3.0, and a `"namespace"`,
with a value from the `NAMESPACE` table. The CityGML 3.0 definition of the property is available as `"description"`.

The data type of a nested property can be specified in one of two ways:

1. As a simple type defined inline using the `"value"` property, as explained above.
2. As a reference to a data type from the `DATATYPE` table via its identifier using the `"type"` property.

!!! note
    Complex data types are not required to have a `"value"` member but can consist solely of nested `"properties"` (see the
    `core:ExternalReference` example). Alternatively, they can designate one of their nested properties as `"value"`
    by using a `0`-based index into the properties array (see the `con:Height` example).

By default, the data type's value and all its nested properties are assumed to be **stored in separate columns of the same
row** in the data type's table. To deviate from this rule, `"join"` or `"joinTable"` properties can be added to nested
properties to specify their target table and how it is linked to the data type's table.

The `core:ExternalReference` type shown above is an example where all nested properties are stored in different `val_*` columns within a
single row of the `PROPERTY` table, ensuring a compact representation.

In contrast, for the `con:Height` type, storing all properties in one row is not possible due to conflicting target columns
used for the nested properties. Therefore, each nested property must be stored in a
separate row of `PROPERTY` and joined with the parent row representing the `con:Height` data type itself.
For the default case, where data types are stored in the `PROPERTY` table, this is achieved through a self-join on
the `PROPERTY` table using the `parent_id` foreign key (see the `"join`" attribute in the example). This results in a
hierarchical structure for complex data types within the `PROPERTY` table. See
[here](feature-module.md#examples) for an example of how an attribute of type `con:Height` is stored in the `PROPERTY` table.

!!! tip
    The complete JSON Schema specification for defining data types is provided in the file
    `schema-mapping.schema.json`, which can be found in the `json-schema` folder of the
    [3DCityDB software package](../download.md#3dcitydb-database-scripts).

## `DATABASE_SRS` table

The `DATABASE_SRS` table holds information about the Coordinate Reference System (CRS) of the 3DCityDB `v5` instance.
This CRS is defined during the [database setup](./../first-steps/setup.md) and applies to all geometries stored in
the 3DCityDB (with a few exceptions, such as implicit geometries). The `DATABASE_SRS` table contains only two columns
with the following meanings:

| Column     | Description                                                                                                                                                   |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `srid`     | The database-specific SRID (**S**patial **R**eference **ID**) of the CRS defined for the 3DCityDB instance. The SRID is typically identical to the EPSG code. |
| `srs_name` | The OGC-compliant name of the CRS. The `srs_name` is, for instance, written to CityGML/CityJSON files when exporting data from the database.                  |

!!! tip
    The coordinate reference system can be changed at any time after setup using the database function
    `citydb_pkg.change_schema_srid`. However, **changing the values directly in the `DATABASE_SRS` table will have no impact
    on the geometries stored in the database**. Refer to the [database functions section](../3dcitydb/db-functions.md) for more information.

## `ADE` table

The 3DCityDB `v5` relational schema fully supports the CityGML [Application Domain Extension (ADE)](https://docs.ogc.org/is/20-010/20-010.html#toc66)
mechanism, enabling the storage of domain-specific data that extends beyond the predefined feature and data types of CityGML.
The `ADE` table serves as a registry for all ADEs added to the database. Each ADE is assigned a unique `id` as the primary
key, with its name, version string, and human-readable description stored as metadata in the `name`, `version`, and
`description` columns, respectively.

In the context of 3DCityDB `v5`, an ADE is a collection of user-defined feature types, data types, and namespaces. These
extensions are linked to their corresponding ADE via the `ade_id` foreign key in the `OBJECTCLASS`, `DATATYPE`, and `NAMESPACE`
tables, referencing the `id` column of the `ADE` table.

!!! warning
    Although ADE support is implemented in the 3DCityDB `v5` relational schema, no tool is currently available to
    automatically register an ADE in the `ADE` table or generate the necessary feature types, data types, and namespaces based
    on the ADE data model. Additionally, the [`citydb-tool`](../citydb-tool/index.md) command-line utility included in
    3DCityDB `v5` does not yet support importing or exporting ADE data. **We are working on improvements, so stay tuned!**
