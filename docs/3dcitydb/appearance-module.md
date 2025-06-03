---
title: Appearance module
description: Tables for storing appearance information
tags:
  - 3dcitydb
  - relational schema
  - appearance
  - texture
  - materials
---

The Appearance module enables the storage and assignment of textures and colors to surface geometries in the 3DCityDB
`v5`. It implements the CityGML appearance concept, where appearances act as containers for surface data, which is
mapped to the surface geometries of city objects to define their visual and observable properties.

![appearance module](assets/appearance-module.png)
/// figure-caption
Appearance module of the 3DCityDB `v5` relational schema.
///

## `APPEARANCE` table

The `APPEARANCE` table is the central component of the appearance module. Each record in the table represents a distinct
appearance. Although [Appearance](https://docs.ogc.org/is/20-010/20-010.html#Appearance-section) is a feature
type in CityGML, appearances are not stored in the [`FEATURE`](feature-module.md#feature-table) table. This is because
appearances define visual and observable properties of surfaces, which are conceptually separate from the spatial features
stored in the `FEATURE` table.

The columns `objectid`, `identifier`, and `identifier_codespace` in the `APPEARANCE` table are used to store unique identifiers
for an appearance object, serving the same purpose as in the [`FEATURE`](feature-module.md#feature-table) table.
The `objectid` is a string identifier used to uniquely reference an appearance object within the database
and datasets. It is recommended to use a globally unique value for `objectid` and ensure this column is always populated.
The `identifier` column provides an optional identifier to uniquely distinguish the appearance across different systems and
potentially multiple versions. It must be accompanied by a code space, stored in the
`identifier_codespace` column, which indicates the authority responsible for maintaining the identifier.

Each appearance is associated with a specific theme for its surface data, stored as a string identifier in the `theme`
column. A surface geometry can receive surface data from multiple themes. A `NULL` value for `theme` is
explicitly allowed.

Appearances are assigned to either features or implicit geometries in one of the following ways:

1. **Local (feature-specific) appearances:** Appearances can be stored as a property of the feature whose geometries are assigned textures
   or colors. The link between the feature stored in the [`FEATURE`](feature-module.md#feature-table) table and an
   appearance is stored as an [appearance property](feature-module.md#relationships) in the
   [`PROPERTY`](feature-module.md#property-table) table. The `APPEARANCE` table includes a `feature_id` foreign key,
   providing a back-link to the feature. This setup enables bidirectional queries between features and their appearances.

2. **Implicit geometries:** Appearances can be linked to an implicit geometry, which acts as a template geometry
   for multiple features (e.g., a 3D tree model shared by multiple tree features). In this case, the appearance
   references the template in the [`IMPLICIT_GEOMETRY`](geometry-module.md#implicit_geometry-table) table via
   the `implicit_geometry_id` foreign key.

3. **Global appearances:** Appearances can be shared across multiple surface geometries of different features,
   referred to as global appearances in CityGML. To designate an appearance as global, the `is_global` property should
   be set to `1` (true), and both `feature_id` and `implicit_geometry_id` should be set to `NULL`. Additionally,
   a global appearance shall not be referenced from individual features using an appearance property.

!!! tip
    Storing global appearances in the database should be avoided, as it increases data management overhead and
    reduces export efficiency. The `citydb-tool` that comes with 3DCityDB automatically converts global appearances to
    local ones during data imports to prevent them from being stored in the database.

## `SURFACE_DATA` table

The `SURFACE_DATA` table stores surface data such as textures and colors. These surface data elements are linked to an
appearance through the `APPEAR_TO_SURFACE_DATA` table, which establishes a many-to-many (n:m) relationship.

The following surface data types are supported:

- **X3DMaterial**: Represents a surface material, typically used for defining color or basic material properties.
- **ParameterizedTexture**: A texture that uses texture coordinates or a linear transformation to define how the
  texture is applied to the target surface.
- **GeoreferencedTexture**: A texture that uses a planimetric projection to map the texture onto the target surface
  with real-world spatial reference.

The `objectclass_id` column enforces the type of surface data, acting as a foreign key to the
[`OBJECTCLASS`](metadata-module.md#objectclass-table) metadata table.

All surface data types share the `objectid`, `identifier`, and `identifier_codespace` columns, which are
used in the same manner as in the `APPEARANCE` table, as described earlier. Additionally, the `is_front` column indicates
whether the surface data should be applied to the front (`is_front = 1`) or back face (`is_front = 0`)
of the target surface geometry.

The remaining columns of the `SURFACE_DATA` table are populated based on the specific surface data type.

### Storing material properties

The `x3d_*` columns define surface material properties according to the X3DMaterial type.

| Column                  | Description                                                                                             |
|:------------------------|---------------------------------------------------------------------------------------------------------|
| `x3d_shininess`         | Specifies the sharpness of the specular highlight (`0..1`).                                             |
| `x3d_transparency`      | Defines the transparency level of the material (`0.0` = opaque, `1.0` = fully transparent).             |
| `x3d_ambient_intensity` | Specifies the minimum percentage of diffuse color that is visible regardless of light sources (`0..1`). |
| `x3d_specular_color`    | Sets the color of the specular reflection of the material in Hex format (`#RRGGBB`).                    |
| `x3d_diffuse_color`     | Defines the color of the material's diffuse reflection in Hex format (`#RRGGBB`).                       |
| `x3d_emissive_color`    | Specifies the color of the material's emission (self-illumination) in Hex format (`#RRGGBB`).           |
| `x3d_is_smooth`         | Indicates whether the material is smooth (`1`) or faceted (`0`).                                        |

### Storing texture properties

Texture properties shared by both ParameterizedTexture and GeoreferencedTexture are represented in the
`tex_*` columns. The corresponding texture image is stored in the [`TEX_IMAGE`](#tex_image-table) table
and linked through the `tex_image_id` foreign key, enabling multiple surface data to use the same texture image.

| Column             | Description                                                                       |
|--------------------|-----------------------------------------------------------------------------------|
| `tex_texture_type` | Defines the type of texture (`specific`, `typical`, `unknown`).                   |
| `tex_wrap_mode`    | Specifies how textures are wrapped (`none`, `wrap`, `mirror`, `clamp`, `border`). |
| `tex_border_color` | Defines the border color for the texture in Hex format (`#RRGGBBAA`).             |

### Storing geo-referenced texture properties

The orientation and spatial reference specific to a `GeoreferencedTexture` are stored in the `gt_*` columns.

| Column               | Description                                                                                                                   |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `gt_orientation`     | Specifies the rotation and scaling of a georeferenced texture image as a 2x2 matrix, stored as JSON array in row-major order. |
| `gt_reference_point` | Defines the 2D point representing the center of the upper left image pixel in real-world space.                               |

## `SURFACE_DATA_MAPPING` table

The `SURFACE_DATA_MAPPING` table assigns surface data to surface geometries by linking an entry from the
`SURFACE_DATA` table to the target geometry in the [`GEOMETRY_DATA`](geometry-module.md#geometry_data-table)
table using the foreign keys `surface_data_id` and `geometry_data_id`.

Surface data is typically assigned to individual polygons. However, geometries in the `GEOMETRY_DATA` table can represent
more complex structures, such as multi-polygons or solids. These are stored using spatial data types of the database that do not support
direct referencing of individual components. To assign surface data to specific polygons within the linked geometries,
the [JSON-based metadata](geometry-module.md#json-based-metadata) stored alongside the geometry in `GEOMETRY_DATA` is used.
This metadata lists the individual components of the geometry and assigns each a unique `"objectId"` identifier,
allowing individual polygons within the geometry to be uniquely referenced.

!!! tip
    Learn more about the JSON-based metadata for geometries in `GEOMETRY_DATA` [here](geometry-module.md#json-based-metadata).

Depending on the type of surface data, a specific mapping is used to assign it to the geometry. These mappings are
defined as JSON objects and stored in the appropriate columns of the `SURFACE_DATA_MAPPING` table. The following examples
show the different types of mappings and how they are stored.

### Assigning materials

To assign an X3DMaterial, the JSON mapping lists the `"objectId"` identifiers of the target surfaces as properties. A value of
`true` indicates that the X3DMaterial should be applied to the corresponding surface. Surfaces that should not receive the material
can either be omitted or assigned a value of `false`. The material mappings are stored in the `material_mapping` column.

The example mapping shown below assigns an X3DMaterial to `surface_A` and `surface_D` of the target
geometry.

```json
{
  "surface_A": true,
  "surface_D": true
}
```

### Assigning textures through texture coordinates

A ParameterizedTexture is commonly mapped by assigning texture coordinates to all coordinates of the target surface. Each
texture coordinate `(s, t)` is a 2D position in texture space, which always spans a unit square
from `(0,0)` to `(1,1)`, regardless of the texture image's actual size or aspect ratio. The lower-left corner of the texture
image corresponds to `(0,0)`.

In the JSON mapping, each texture coordinate is stored as a double array `[s,t]`. The texture coordinates for
the exterior ring of the target surface are grouped into an array. If the surface has interior rings, separate arrays are
provided for their coordinates. All ring arrays are then combined into a single outer array.

Similar to material mapping, the JSON object lists the identifiers of the target surfaces that should receive
texture coordinates and assigns them the corresponding outer array. The mappings are stored in the
`texture_mapping` column.

The example below illustrates texture mapping for `surface_B` and `surface_C` of the linked geometry.
`surface_B` has both an exterior and an interior ring, while `surface_C` has only an exterior ring.

```javascript
{
  "surface_B": [
    [ [0.0, 0.5], [0.7, 0.3], …, [0.0, 0.5] ], // exterior ring
    [ [0.1, 0.3], [0.6, 0.4], …, [0.1, 0.3] ]  // interior ring
  ],
  "surface_C": [
    [ [0.3, 0.5], [0.1, 0.1], …, [0.3, 0.5] ]  // exterior ring
  ]
}
```

!!! warning "Rules for texture coordinates"

    - A texture coordinate must be provided for every coordinate in a surface's ring, including the last coordinate
      if it duplicates the first to close the ring.
    - Texture coordinates must be listed in the same order as the corresponding ring coordinates of the surface.
    - Every surface must have texture coordinates for its exterior ring. If the surface has interior rings, texture
      coordinates must also be provided for each interior ring, following the same order in which the rings appear
      in the surface.

### Assigning textures through linear transformations

Alternatively, a ParameterizedTexture can be assigned using a 3x4 transformation matrix, which maps real-world space
coordinates to texture coordinates. The matrix is represented as a JSON array in row-major order. Matrix-based texture
mappings are stored in the `world_to_texture_mapping` column.

An example texture mapping using a 3x4 transformation matrix is illustrated below.

```json
{
  "surface_E": [
    -0.4, 0.0, 0.0, 183550.0,
     0.0, 0.0, 0.3333, -37.3333,
     0.0, 0.0, 0.0, 1.0
  ]
}
```

### Assigning geo-referenced textures

Since the orientation and spatial reference of a GeoreferencedTexture are already stored in the `SURFACE_DATA` table,
assigning it to target surfaces only requires listing the surface identifiers and assigning a value of `true`, just as with
material mappings. Surfaces that should not receive the texture are either assigned `false` or omitted. Texture mappings
for geo-referenced textures are stored in the `georeferenced_texture_mapping` column.

```json
{
  "surface_F": true,
  "surface_G": true
}
```

!!! note

    - If a mapping lists identifiers not found in the target geometry's JSON metadata, the mapping for those
      identifiers is invalid.
    - JSON Schema specifications for each mapping are included in the [3DCityDB software package](../download.md#3dcitydb-database-scripts),
      located in the `json-schema` folder. The schema files are named after the respective column names
      (e.g., `texture-mapping.schema.json`).

## `TEX_IMAGE` table

Texture images for both ParameterizedTexture and GeoreferencedTexture can be stored as binary blobs in the `image_data`
column of the `TEX_IMAGE` table. In this case, the `image_uri` column can store the file name or original path of the
texture image. If the image should not be stored directly in the database, the `image_data` column is set to `NULL`, and the
`image_uri` should contain a URI pointing to the location of the texture image from which it can be retrieved (e.g., an
external URL).

The `mime_type` column specifies the MIME type of the texture image, ensuring that the image can be processed correctly
according to its format (e.g., `image/png` for a PNG image or `image/jpeg` for a JPEG image). Additionally, the
`mime_type_codespace` column can store an optional code space for the MIME type, providing further context or
classification.
