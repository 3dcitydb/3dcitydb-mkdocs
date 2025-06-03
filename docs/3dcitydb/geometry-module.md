---
title: Geometry module
description: Tables for storing explicit and implicit geometries
tags:
  - 3dcitydb
  - relational schema
  - geometry
  - implicit geometry
---

The Geometry module contains the tables for storing feature geometries, as well as implicit geometries. These implicit
geometries can be reused as templates for multiple features, following the CityGML implicit geometry concept.

![geometry module](assets/geometry-module.png)
/// figure-caption
Geometry module of the 3DCityDB `v5` relational schema.
///

## `GEOMETRY_DATA` table

The `GEOMETRY_DATA` table serves as the central location for storing both explicit and implicit geometry data of
the features in the 3DCityDB. It supports various geometry types, including points, lines, surface-based geometries, and
volume geometries.

### Feature geometries

Explicit feature geometries, which are geometries with real-world coordinates, are stored in the `geometry` column. This
column uses a predefined spatial data type from the database system running the 3DCityDB to store the geometry data. All
geometries must be stored with 3D coordinates and must be provided in the Coordinate Reference System (CRS) defined for
the 3DCityDB instance. To enable efficient spatial queries, the `geometry` column is indexed by default.

The link between a feature stored in the [`FEATURE`](feature-module.md#feature-table) table and its geometries is
stored as a [geometry property](feature-module.md#relationships) in the [`PROPERTY`](feature-module.md#property-table)
table. Additionally, the `GEOMETRY_DATA` table contains a `feature_id` foreign key, providing a back-link to the
feature. This setup allows you to query features and follow to the geometry, or query geometries and trace back to
the feature.

### Implicit geometries

Implicit geometries are stored in the `implicit_geometry` column of the `GEOMETRY_DATA` table. Unlike feature geometries,
implicit geometries use local coordinates, which allows them to serve as templates for multiple city objects in the
database. This is also the reason why they are stored in a separate column, rather than in the `geometry` column.
Since implicit geometries are not assigned to specific features directly, the `feature_id` column is set to `NULL`.
Instead, they are referenced from the [`IMPLICIT_GEOMETRY`](#implicit_geometry-table) table.

Implicit geometries are typically not involved in spatial queries, so the `implicit_geometry` column does not
have a spatial index by default.

### JSON-based metadata

The use of predefined spatial database types for storing both explicit and implicit geometries presents two
main challenges:

1. **Geometry types:** CityGML features use a wide range of geometry types, including primitives (i.e.,
   points, lines, surfaces, and volume geometries) and composite or aggregate geometries, all based on
   the ISO 19107 spatial schema standard. However, the predefined spatial database types typically cover only a
   subset of these, limiting the ability to fully represent all CityGML geometries.

2. **Reuse and referencing:** CityGML allows geometries to be reused by reference and assigned textures or colors.
   For this, each geometry and its components requires unique identifiers. However, spatial database types
   typically store only raw coordinates, lacking the ability to assign unique identifiers, which limits effective
   referencing and reuse.

Previous versions of 3DCityDB addressed these challenges by decomposing surface geometries into individual polygons,
each stored in a separate row with a unique identifier. A hierarchical structure grouped the polygons by their original
geometry type. While this enabled efficient referencing, it required recomposing geometries on-the-fly for
spatial queries, making them slower and less efficient. Additionally, it increased storage requirements and was only
applied to surface-based geometries, not points or lines.

The 3DCityDB `v5` solution of using spatial database types to store entire geometries, without decomposition,
greatly improves spatial query performance and reduces storage requirements. To preserve the ability to reuse and
reference geometries and their parts, and to maintain the expressivity of CityGML geometry types, JSON-based metadata is
stored alongside the geometry in the `geometry_properties` column.

To illustrate the structure and use of this JSON metadata, consider storing a CityGML solid geometry in
PostgreSQL/PostGIS. The PostGIS-specific data type used is `POLYHEDRALSURFACE Z`, which stores a simple array of
polygons. The following snippet demonstrates how a unit cube is represented as a polyhedral surface
consisting of six polygons. The equivalent CityGML `Solid` geometry is shown in a second tab.

=== "POLYHEDRALSURFACE Z"

    ```
    POLYHEDRALSURFACE Z (
      ((0 0 0, 0 1 0, 1 1 0, 1 0 0, 0 0 0)),
      ((0 0 0, 0 1 0, 0 1 1, 0 0 1, 0 0 0)),
      ((0 0 0, 1 0 0, 1 0 1, 0 0 1, 0 0 0)),
      ((1 1 1, 1 0 1, 0 0 1, 0 1 1, 1 1 1)),
      ((1 1 1, 1 0 1, 1 0 0, 1 1 0, 1 1 1)),
      ((1 1 1, 1 1 0, 0 1 0, 0 1 1, 1 1 1))
    )
    ```

=== "CityGML Solid"

    ```xml
    <gml:Solid gml:id="mySolid">
      <gml:exterior>
        <gml:Shell gml:id="myOuterShell">
          <gml:surfaceMember>
            <gml:Polygon gml:id="first">
              <gml:exterior>
                <gml:LinearRing>
                  <gml:posList>0 0 0 0 1 0 1 1 0 1 0 0 0 0 0</gml:posList>
                </gml:LinearRing>
              </gml:exterior>
            </gml:Polygon>
          </gml:surfaceMember>
          <gml:surfaceMember>
            <gml:Polygon gml:id="second">
              <gml:exterior>
                <gml:LinearRing>
                  <gml:posList>0 0 0 0 1 0 0 1 1 0 0 1 0 0 0</gml:posList>
                </gml:LinearRing>
              </gml:exterior>
            </gml:Polygon>
          </gml:surfaceMember>
          <gml:surfaceMember>
            <gml:Polygon gml:id="third">
              <gml:exterior>
                <gml:LinearRing>
                  <gml:posList>0 0 0 1 0 0 1 0 1 0 0 1 0 0 0</gml:posList>
                </gml:LinearRing>
              </gml:exterior>
            </gml:Polygon>
          </gml:surfaceMember>
          <gml:surfaceMember>
            <gml:Polygon gml:id="fourth">
              <gml:exterior>
                <gml:LinearRing>
                  <gml:posList>1 1 1 1 0 1 0 0 1 0 1 1 1 1 1</gml:posList>
                </gml:LinearRing>
              </gml:exterior>
            </gml:Polygon>
          </gml:surfaceMember>
          <gml:surfaceMember>
            <gml:Polygon gml:id="fifth">
              <gml:exterior>
                <gml:LinearRing>
                  <gml:posList>1 1 1 1 0 1 1 0 0 1 1 0 1 1 1</gml:posList>
                </gml:LinearRing>
              </gml:exterior>
            </gml:Polygon>
          </gml:surfaceMember>
          <gml:surfaceMember>
            <gml:Polygon gml:id="sixth">
              <gml:exterior>
                <gml:LinearRing>
                  <gml:posList>1 1 1 1 1 0 0 1 0 0 1 1 1 1 1</gml:posList>
                </gml:LinearRing>
              </gml:exterior>
            </gml:Polygon>
          </gml:surfaceMember>
        </gml:Shell>
      </gml:exterior>
    </gml:Solid>
    ```

Unlike the PostGIS polyhedral surface, the CityGML `Solid` geometry has an additional `Shell` to represent
the outer shell formed by the polygons. Moreover, the solid, the shell, and each polygon have an
identifier (`gml:id`) that allows the reuse of the component and the assignment of textures or colors. The following JSON object
encodes this extra metadata and links it to the `POLYHEDRALSURFACE Z` representation:

```json
{
  "type": 9, // (1)!
  "objectId": "mySolid",
  "children": [
    {
      "type": 6, // (2)!
      "objectId": "myOuterShell"
    },
    {
      "type": 5, // (3)!
      "objectId": "first",
      "parent": 0,
      "geometryIndex": 0
    },
    {
      "type": 5,
      "objectId": "second",
      "parent": 0,
      "geometryIndex": 1
    },
    {
      "type": 5,
      "objectId": "third",
      "parent": 0,
      "geometryIndex": 2
    },
    {
      "type": 5,
      "objectId": "fourth",
      "parent": 0,
      "geometryIndex": 3
    },
    {
      "type": 5,
      "objectId": "fifth",
      "parent": 0,
      "geometryIndex": 4
    },
    {
      "type": 5,
      "objectId": "sixth",
      "parent": 0,
      "geometryIndex": 5
    }
  ]
}
```

1. A value of `9` means `Solid`.
2. A value of `6` means `CompositeSurface` or `Shell`.
3. A value of `5` means `Polygon`.

The metadata is interpreted as follows: The `"type"` property of the JSON object classifies the geometry as a `Solid` (`type = 9`), with a
unique `"objectId"` of `"mySolid"`. The `"children"` array lists all the components of the `Solid` and establishes a
hierarchical relationship between them. The first item in the `"children"` array represents the outer shell of the solid
(`type = 6`) and is identified as `"myOuterShell"`. As defined in ISO 19107, the outer shell acts as a container but does not
directly reference a specific geometry from the polyhedral surface.

The other six items in the `"children"` array represent the individual polygons (`type = 5`) that form the outer shell. Each
polygon has its own unique `"objectId"`. The `"parent"` field contains a `0`-based reference into the `"children"` array and
defines the parent of the component. In this example, a value of `0` indicates that the polygon belongs to the outer shell.
The `"geometryIndex"` is a `0`-based index linking the child to a specific polygon of the polyhedral surface stored
in the `geometry` column.

!!! note "Summary"
    This simple JSON structure works for mapping any CityGML geometry type onto a spatial database type. In summary, the main idea is that the
    primitives in the spatial database type (points, lines, polygons) are referenced by the `geometryIndex`, while the
    `children` and `parent` structure enables embedding the primitives into any CityGML geometry hierarchy. The `objectId`
    provides a unique identifier for each component, ensuring that each geometry and its parts can be individually
    referenced and distinguished within the database.

The following list shows all supported values for the `type` attribute in the JSON metadata, mapping them to their
corresponding CityGML geometry types:

```yaml
    1: Point
    2: MultiPoint
    3: LineString
    4: MultiLineString
    5: Polygon
    6: CompositeSurface
    7: TriangulatedSurface
    8: MultiSurface
    9: Solid
    10: CompositeSolid
    11: MultiSolid
```

In addition to `"objectId"`, `"type"`, and `"children"` mentioned above, the JSON metadata object can also include the
`"is2D"` property. When `"is2D"` is set to `true`, the geometry should be interpreted as 2D. However, it must
still be stored using 3D coordinates in the `geometry` column (e.g., with a height value of `0`). Tools processing the
geometry should ignore height values when `"is2D"` is set.

Additionally, each component in the `"children"` array can have an `"isReversed"` property. This flag indicates whether the
coordinates of the component were flipped during import to reverse its orientation. This can occur, for example, when
importing CityGML datasets that contain orientable primitives such as `gml:OrientableSurface` with their `orientation`
attribute set to `"-"`. The `"isReversed"` property enables tools to export the component as orientable primitive again.

!!! tip
    The [3DCityDB software package](../download.md#3dcitydb-database-scripts) includes a JSON Schema specification that defines
    the allowed structure of the JSON metadata object. You can find this schema file, named `geometry-properties.schema.json`,
    in the `json-schema` folder of the software package.

## `IMPLICIT_GEOMETRY` table

The `IMPLICIT_GEOMETRY` table implements the concept of implicit geometries in CityGML. An implicit geometry is a template
that is stored only once in the 3DCityDB and can be reused by multiple city objects. Examples of implicit geometries
include 3D tree models, where different tree species and heights are represented as template geometries. These tree
models can then be instantiated at various locations for specific tree features according to their species.

Each tree feature can specify a reference point where the template geometry should be placed, along with an individual
3x4 transformation matrix to apply scaling, rotation, and translation to the model. The relationship between a feature
in the [`FEATURE`](feature-module.md#feature-table) table and an implicit geometry in the `IMPLICIT_GEOMETRY` table is
established through a corresponding entry in the [`PROPERTY`](feature-module.md#property-table) table. The
feature-specific reference point and transformation matrix are stored with this relationship in the
[`PROPERTY`](feature-module.md#property-table) table (see [here](feature-module.md#relationships)).

The `IMPLICIT_GEOMETRY` table supports three methods for storing template geometries:

1. **Stored as geometries with local coordinates:** These geometries are saved in the `implicit_geometry` column of the
   `GEOMETRY_DATA` table, as explained earlier. The geometry is then referenced through the `relative_geometry_id` foreign key.
2. **Stored as binary blobs:** The 3D model is stored in a specific data format as a binary object in the `library_object`
   column.
3. **Stored as references to external 3D models:** In this case, the 3D model is referenced through a URI stored in the
   `reference_to_library` column, pointing to an external file or system.

For both methods 2 and 3, the `mime_type` column should specify the MIME type of the binary 3D model or
external file. This ensures that the 3D model can be processed correctly according to its format (e.g.,
`model/gltf+json` for a glTF model or `application/vnd.collada+xml` for a COLLADA model). Additionally,
the `mime_type_codespace` column can store an optional code space for the MIME type, providing further context or
classification.

Finally, the `objectid` column provides a unique identifier for the implicit geometry, ideally globally unique.

!!! tip
    The recommended approach for storing implicit geometries is to store them in the `GEOMETRY_DATA` table with local
    coordinates. Storing arbitrary binary 3D models carries the risk that tools may not be able to process the models
    correctly.
