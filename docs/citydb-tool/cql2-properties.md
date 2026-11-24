---
title: CQL2 property references
description: Referencing properties, property paths, and generic attributes in CQL2 filters
tags:
  - citydb-tool
  - cql2
  - query
  - filter
---

# CQL2 property references

Property references are the most important part of a filter expression. They select the values of a feature that
are tested by a predicate, such as the `con:height` of a building in `con:height > 20`.

!!! note
    In this chapter, the term _property_ covers all kinds of properties of a feature: simple and complex attributes,
    including generic attributes, geometry and implicit geometry properties, feature properties that relate a feature to
    other features, and addresses.

## Names and namespace prefixes

A property is referenced by its name, optionally preceded by the alias of its namespace and a colon, such as
`con:height` or `core:name`. The namespace aliases are defined in the
[`NAMESPACE`](../3dcitydb/metadata-module.md#namespace-table) table of the 3DCityDB `v5`, for example `core`, `bldg`,
`con`, and `gen`. The available properties and their namespaces are defined by the JSON-based schema mapping of the
feature types in the [`OBJECTCLASS`](../3dcitydb/metadata-module.md#objectclass-table) table.

Property names are resolved against the feature types selected with the `--type-name` option. If several feature
types are selected, their closest common supertype is used. Without `--type-name`, all top-level feature types are
processed, and the filter can only use properties defined for `core:AbstractCityObject` and its supertypes, such as
`core:name` or `core:envelope`, see [here](#properties-available-for-all-city-objects). Properties of more specific
types require the corresponding `--type-name`.

```bash
# fails: con:height is not a property of core:AbstractCityObject
--filter="con:height > 20"

# works: con:height is inherited by bldg:Building
--type-name=bldg:Building --filter="con:height > 20"
```

Namespace aliases are case-sensitive. A filter using an alias that is not defined in the `NAMESPACE` table fails with
an error.

The namespace prefix can be omitted. citydb-tool then tries to find the best matching property as follows:

1. The feature type is searched for a property with a matching local name, ignoring upper and lower case. If none is
   found, its supertypes are searched one after the other, starting with the direct supertype. The first match is
   used. If the local name is defined in several namespaces, the property declared closest to the feature type is
   chosen without further notice.
2. If no property is found, the name is treated as a [generic attribute](#generic-attributes). This fallback only
   applies to properties of features and of generic attribute sets. Below other properties, such as complex attributes
   or addresses, a name that cannot be resolved causes an error.

The same rules apply to every step of a [property path](#property-paths) and to the names in
[conditions on path steps](#conditions-on-path-steps), which are resolved relative to the preceding step. For example,
`address[city = 'Karlsruhe'].street` is resolved to `bldg:address[core:city = 'Karlsruhe'].core:street` for buildings.
Feature type and data type steps can be written without prefix as well, but their local name is matched
case-sensitively.

!!! warning
    Since unresolved names fall back to generic attributes, a misspelled name without prefix is not reported as
    error. For example, `heigth > 20` is evaluated as a filter on a generic attribute `heigth` and usually selects no
    features at all. In contrast, a prefixed name such as `con:heigth` that is not defined for the feature type causes
    an error. Using prefixes is therefore recommended, since it makes filters deterministic and lets citydb-tool
    detect typos.

A generic attribute that has the same local name as a predefined property of the feature type must be referenced with
the `gen` prefix, since the name without prefix resolves to the predefined property.

Names can also be enclosed in double quotes, such as `"con:height"`, as allowed by CQL2. Quoted names follow the same
rules as unquoted names. In particular, CQL2 does not allow spaces or hyphens in names.

```sql
con:height > 20 -- (1)!
height > 20 -- (2)!
```

1. Qualified name.
2. Unqualified name, resolves to `con:height` for buildings.

## Properties available for all city objects

The following properties are available for all city objects, regardless of the feature types selected with
`--type-name`.

| Property                                                      | Data type        | Description                                                                                                         |
|---------------------------------------------------------------|------------------|---------------------------------------------------------------------------------------------------------------------|
| **Defined for `core:AbstractObject`**                         |                  |                                                                                                                     |
| `core:id`                                                     | Integer          | Database ID of the feature.                                                                                         |
| `core:objectId`                                               | String           | Object identifier, for example the `gml:id` of a CityGML feature.                                                   |
| `core:identifier`                                             | String           | Globally unique identifier.                                                                                         |
| `core:identifier.core:codeSpace`                              | String           | Code space of the identifier.                                                                                       |
| `core:objectClassId`                                          | Integer          | Database ID of the feature type.                                                                                    |
| `core:name`                                                   | Code             | Names of the feature. The code space is available as `core:name.core:codeSpace`.                                    |
| `core:description`                                            | String           | Description of the feature. A reference is available as `core:description.core:href`.                               |
| `core:descriptionReference`                                   | URI              | Reference to a remote description.                                                                                  |
| `core:envelope`                                               | Envelope         | Bounding box of the feature.                                                                                        |
| `core:lastModificationDate`                                   | Timestamp        | Time of the last modification.                                                                                      |
| `core:updatingPerson`, `core:reasonForUpdate`, `core:lineage` | String           | Metadata about the last modification.                                                                               |
| **Defined for `core:AbstractFeatureWithLifespan`**            |                  |                                                                                                                     |
| `core:creationDate`, `core:terminationDate`                   | Timestamp        | Database lifespan of the feature version.                                                                           |
| `core:validFrom`, `core:validTo`                              | Timestamp        | Real-world lifespan of the feature version.                                                                         |
| **Defined for `core:AbstractCityObject`**                     |                  |                                                                                                                     |
| `core:externalReference`                                      | Complex          | References to objects in external information systems, with `core:targetResource`, `core:informationSystem`, and `core:relationType`. |
| `core:relatedTo`                                              | Complex          | Relations to other city objects, with `core:relatedTo` (the related city object) and `core:relationType`.           |
| `core:generalizesTo`                                          | Feature relation | Generalized representations of the city object.                                                                     |
| `core:relativeToTerrain`, `core:relativeToWater`              | String           | Vertical position relative to the terrain or water surface.                                                         |
| `core:appearance`                                             | Appearance       | Appearances of the city object, for example `core:appearance.app:theme`.                                            |

In addition, [generic attributes](#generic-attributes) can be used for all features.

!!! tip
    Filters on `core:id`, `core:objectId`, `core:identifier`, `core:envelope`, and the date properties are
    particularly fast, because these properties are stored directly in the
    [`FEATURE`](../3dcitydb/feature-module.md#feature-table) table.

## Property paths

Properties can be nested. For example, the height of a building is a complex attribute of type `con:Height` that
consists of a `con:value`, a `con:status`, and further properties. Nested properties are referenced with a path,
which joins the property names with a dot (`.`).

```text
con:height.con:status = 'measured'
con:height.con:value > 20
```

!!! tip
    The dot notation of property paths and the [conditions on path steps](#conditions-on-path-steps) are inspired by
    JSONPath and XPath but follow their own evaluation rules.

The data type of a complex attribute can also be included in the path as a separate step. Such data type steps are
optional, because citydb-tool adds them automatically. However, a full path makes the structure of the data model
explicit. The following filters are therefore equivalent:

```sql
con:height.con:Height.con:value > 20 -- (1)!
con:height.con:value > 20 -- (2)!
```

1. Full path including the data type `con:Height`.
2. Data type step omitted.

Paths also lead into the addresses of a feature, and into features related through feature properties, such as the
building parts of a building or the boundary surfaces of a space:

```text
bldg:address.core:city = 'Karlsruhe'
bldg:buildingPart.con:height > 40
```

Feature types can be included in a path as well. Without a feature type step, a path continues with the target type
of the feature property and can only use the properties of this type. For example, `core:boundary` points to features
of type `core:AbstractSpaceBoundary`, so all boundary surfaces can be filtered by the properties defined for this type,
such as `core:objectId`. A feature type step after the feature property has two effects:

- Only subfeatures of the given type and its subtypes are considered.
- The properties of the given type become available in the rest of the path.

```sql
core:boundary.core:objectId = 'DEBY_1234' -- (1)!
core:boundary.con:RoofSurface IS NOT NULL -- (2)!
core:boundary.core:AbstractThematicSurface.core:area > 10 -- (3)!
core:boundary.con:RoofSurface.core:area > 10 -- (4)!
```

1. Boundary surfaces of any type.
2. Only roof surfaces.
3. Thematic surfaces of any type, which provide the property `core:area`.
4. Only roof surfaces, filtered by their area.

Without the feature type step, `core:boundary.core:area > 10` fails, since `core:area` is not defined for
`core:AbstractSpaceBoundary`.

!!! tip
    `IS NULL` and `IS NOT NULL` can be applied to complex properties, addresses, and feature relations as well.
    `bldg:buildingPart IS NULL` selects buildings without building parts.

!!! tip
    Some complex attributes define one of their nested properties as their value. When such an attribute is compared
    directly, the comparison uses this value property, so it can be omitted from the path. For example,
    `con:height > 20` is equivalent to `con:height.con:value > 20`. This shortcut is available for the following data
    types:

    | Data type               | Value property           | Example                                    |
    |-------------------------|--------------------------|--------------------------------------------|
    | `con:Height`            | `con:value`              | `con:height > 20`                          |
    | `bldg:RoomHeight`       | `bldg:value`             | `bldg:roomHeight > 2.5`                    |
    | `con:ConstructionEvent` | `con:event`              | `con:constructionEvent = 'construction'`   |
    | `core:Occupancy`        | `core:numberOfOccupants` | `con:occupancy > 100`                      |
    | `core:QualifiedArea`    | `core:area`              | `core:area > 50`                           |
    | `core:QualifiedVolume`  | `core:volume`            | `core:volume > 1000`                       |

    For all other complex attributes, such as `core:ExternalReference`, the nested property must always be given in the
    path, for example `core:externalReference.core:targetResource`.

## Conditions on path steps

A condition in square brackets after a path step restricts the values of this step. Only values satisfying the
condition are considered for the rest of the path. The condition can be any predicate and uses the same syntax as
the filter itself. Its property references are resolved relative to the value of the path step.

```text
bldg:address[core:city = 'Karlsruhe'].core:street LIKE 'Kaiser%'
```

This filter selects buildings with an address in Karlsruhe whose street name starts with `Kaiser`. Both conditions
must be satisfied by the _same_ address. In contrast, the following filter is satisfied if the building has some
address in Karlsruhe and some, possibly different, address with a matching street name:

```text
bldg:address.core:city = 'Karlsruhe' AND bldg:address.core:street LIKE 'Kaiser%'
```

A path can end with a condition. Combined with `IS NOT NULL`, this tests whether a matching value exists at all:

```text
bldg:buildingPart[con:height > 40 AND bldg:roofType = '3100'] IS NOT NULL
```

A path can also start with the name of the feature type itself, which allows a condition on the feature before
navigating into its properties:

```text
bldg:Building[bldg:roofType = '1000'].con:height > 5
```

## Selecting values by position

Properties such as `bldg:function` can have several values. The `INDEX()` function returns the position of a value
within its property and can be used in a condition on the path step. A number in square brackets is short for a
comparison with `INDEX()`.

```sql
bldg:function[2] = '2000' -- (1)!
bldg:function[INDEX() = 2] = '2000' -- (2)!
bldg:function[INDEX() > 1] IS NOT NULL -- (3)!
```

1. The second function is `2000`.
2. The same, written out.
3. The property has more than one value.

The position starts with `1` and reflects the order in which the values are stored in the database, which is usually
the order in the imported data. `INDEX()` must not have arguments and can only be used in a condition on a path step.

## Multi-valued properties

A property reference can match several values, for example if a building has more than one function or more than one
address, or if a path leads to several building parts. A predicate on such a property is satisfied if **at least one**
value satisfies it.

The negated forms test that **no** value satisfies the positive predicate. This applies to `NOT`, `NOT IN`, `NOT LIKE`,
`NOT BETWEEN`, and `IS NULL`. Except for `IS NULL`, the negated forms additionally require that the property has at
least one value and that none of its values is `NULL`. For missing values, this matches the null semantics of
[CQL2](https://docs.ogc.org/is/21-065r2/21-065r2.html){target="blank"}, where comparisons with `NULL` are neither true
nor false: apart from `IS NULL`, missing values never cause a feature to be selected, neither by the positive nor by the
negated predicate. CQL2 itself does not define predicates on multi-valued properties.

The following table illustrates the behavior for buildings with the functions shown in the first column.

| Functions        | Filter                            | Selected | Reason                       |
|------------------|-----------------------------------|:--------:|------------------------------|
| `1010`, `2000`   | `bldg:function = '2000'`          |   Yes    | One value matches.           |
| `1010`, `2000`   | `bldg:function <> '1010'`         |   Yes    | `2000` differs from `1010`.  |
| `1010`, `2000`   | `NOT bldg:function = '1010'`      |    No    | One value equals `1010`.     |
| `1010`, `2000`   | `bldg:function NOT IN ('1000')`   |   Yes    | No value equals `1000`.      |
| none             | `bldg:function <> '1010'`         |    No    | There is no value.           |
| none             | `NOT bldg:function = '1010'`      |    No    | There is no value.           |
| none             | `bldg:function IS NULL`           |   Yes    | There is no value.           |

!!! note
    `bldg:function <> '1010'` and `NOT bldg:function = '1010'` are therefore not equivalent for multi-valued
    properties. Use `NOT` to exclude features with a specific value.

## Generic attributes

Generic attributes are user-defined attributes stored in the `gen` namespace. They are referenced by their name like
any other property, optionally with the `gen` prefix. Generic attribute sets are traversed with a property path.

```sql
gen:district = 'Mitte'
district = 'Mitte' -- (1)!
gen:energy.gen:label = 'E03' -- (2)!
```

1. The same, if the feature type has no property named `district`.
2. Attribute `label` of the generic attribute set `energy`.

Generic attributes can be referenced on features and within generic attribute sets, but not below other properties
such as complex attributes or addresses.

!!! tip
    Generic attribute names containing characters that are not allowed in CQL2 names, such as spaces or hyphens,
    cannot be referenced in a filter. Use an [SQL predicate](cql2-predicates.md#sql-predicates) instead, for example
    `SQL('select feature_id from citydb.property where name = ''roof area'' and val_double > 50')`.

### Type casts

Unlike predefined properties, generic attributes have no fixed data type in the schema. The same attribute name can
hold an integer value for one feature and a string value for another. citydb-tool therefore needs to know which type of
value to compare.

!!! note
    In CityGML 3.0, the data type of a generic attribute is part of its XML element name, such as
    `gen:IntAttribute` or `gen:StringAttribute`. In the 3DCityDB `v5`, generic attributes are only identified by their
    name, so the type must be given explicitly in the filter. Most type casts correspond to a CityGML generic attribute
    type.

- Without further information, a generic attribute is treated as string attribute. This is sufficient for string and
  code attributes and for `LIKE`, `CASEI`, and `ACCENTI`.
- For all other data types, a type cast must be appended to the name with `::`. Otherwise, the filter fails with an
  error asking for an explicit type cast.

```text
gen:storeys::int > 4
gen:area::double BETWEEN 200 AND 400
gen:constructionDate::timestamp < DATE('1950-01-01')
gen:website::uri LIKE '%.org/%'
gen:energy.gen:rating::int >= 2
```

The following type casts are available. Upper and lower case are ignored.

| Type cast                                          | CityGML 3.0 generic attribute | Value used in comparisons                                                            |
|----------------------------------------------------|-------------------------------|--------------------------------------------------------------------------------------|
| `::string`                                         | `gen:StringAttribute`         | String value                                                                         |
| `::code`                                           | `gen:CodeAttribute`           | Code value (string)                                                                  |
| `::int`, `::integer`                               | `gen:IntAttribute`            | Integer value                                                                        |
| `::double`                                         | `gen:DoubleAttribute`         | Floating-point value                                                                 |
| `::measure`                                        | `gen:MeasureAttribute`        | Numeric value, without unit of measure                                               |
| `::timestamp`, `::dateTime`                        | `gen:DateAttribute`           | Date and time                                                                        |
| `::uri`                                            | `gen:UriAttribute`            | URI string                                                                           |
| `::bool`, `::boolean`                              | -                             | Boolean value                                                                        |
| `::geometry`, `::geometryProperty`                 | -                             | Geometry, for [spatial predicates](cql2-predicates.md#spatial-predicates)            |
| `::implicitGeometry`, `::implicitGeometryProperty` | -                             | Only for `IS [NOT] NULL`                                                             |
| `::feature`, `::featureProperty`                   | -                             | Subfeature, for [property paths](#property-paths)                                    |

The last four type casts have no counterpart in CityGML. They only match generic attributes of these types created by
other means, for example through the API or a plugin. Generic attribute sets (`gen:GenericAttributeSet`) need no type
cast, since they are only used as path steps.

!!! warning "Important"
    A type cast selects the data type with which the attribute value is _stored_. It does not convert values.
    An integer attribute must be accessed with `::int` and a floating-point attribute with `::double`. For example,
    `gen:area::int > 300` does not match a generic attribute `area` stored as double value. Likewise, a URI attribute is
    only found with `::uri`.

Type casts are only allowed for generic attributes. Predefined properties always have a known data type.
