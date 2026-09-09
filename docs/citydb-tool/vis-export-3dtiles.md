---
title: Vis-export 3D Tiles command
description: Exporting OGC 3D Tiles 1.1 data
tags:
  - citydb-tool
  - vis-export
  - 3D Tiles
  - visualization
---

# Vis-export 3D Tiles command

The `vis-export 3dtiles` command exports city model data from the 3DCityDB `v5` in
[OGC 3D Tiles 1.1](https://www.ogc.org/publications/standard/3dtiles/){target="blank"} format. The resulting tileset can
be consumed by viewers such as [CesiumJS](https://cesium.com/platform/cesiumjs/){target="blank"} and any other
3D Tiles 1.1 compliant client.

The exporter produces a streaming-ready scene with packed texture atlases, baked geometries in `glTF` 2.0 / `glb`
chunks, and a `tileset.json` index using implicit or explicit refinement based on the configured spatial grid.

## Synopsis

```bash
citydb vis-export 3dtiles [OPTIONS]
```

## Options

The `vis-export 3dtiles` command inherits global options from the main [`citydb`](cli.md) command and general export,
query and filter, and scene options from its parent [`vis-export`](vis-export.md) command. Additionally, it provides
3D Tiles format-specific export options.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General export options

--8<-- "docs/citydb-tool/includes/vis-export-general-options.md"

For more details on the general export options and usage hints, see [here](vis-export.md#general-export-options).

### 3D Tiles export options

| Option                            | Description                                                                                                                                                                                                              | Default value |
|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `--implicit-geometry-instancing`  | Emit implicit geometries as GPU instances using the glTF extensions `EXT_mesh_gpu_instancing` and `EXT_instance_features`. When omitted, every implicit geometry is baked as a full mesh copy per occurrence.             |               |
| `--enable-outline`                | Emit polygon boundary edges as outlines using the glTF extension `CESIUM_primitive_outline`, so CesiumJS draws the original polygon edges of each surface as lines on top of the geometry. When omitted, no outlines are exported. |               |
| `--outline-merge-coplanar[=<degrees>]` | Suppress outlines on edges shared by two coplanar surfaces of the same feature and surface type. Without a value, only exactly coplanar surfaces are merged; pass a maximum dihedral angle in degrees to also merge surfaces whose planes carry angular noise. Only takes effect together with `--enable-outline`. |               |

For more details, see [Rendering implicit geometries as GPU instances](#rendering-implicit-geometries-as-gpu-instances)
and [Rendering surface outlines](#rendering-surface-outlines).

### Query and filter options

--8<-- "docs/citydb-tool/includes/vis-export-filter-options.md"

For more details on the query and filter options and usage hints, see [here](vis-export.md#query-and-filter-options).

### Time-based feature history options

--8<-- "docs/citydb-tool/includes/export-history-options.md"

For more details on the time-based feature history options and usage hints, see [here](export.md#time-based-feature-history-options).

### Scene options

--8<-- "docs/citydb-tool/includes/vis-export-scene-options.md"

For more details on the scene options and usage hints, see [here](vis-export.md#scene-options).

### Database connection options

--8<-- "docs/citydb-tool/includes/db-options.md"

For more details on the database connection options and usage hints, see [here](database.md#using-command-line-options).

## Usage

!!! tip
    For general usage hints applicable to all subcommands of the `vis-export` command (including but not limited to
    `vis-export 3dtiles`), refer to the documentation for the `vis-export` command [here](vis-export.md#usage).

### Rendering implicit geometries as GPU instances

CityGML [implicit geometries](../3dcitydb/geometry-module.md#implicit_geometry-table) store a template geometry once
(e.g. a tree or street furniture model) and reference it from many features, each with its own transformation matrix.
By default, the 3D Tiles exporter *bakes* these references: every occurrence is written as a full, transformed mesh
copy, which can inflate tile sizes considerably for datasets with many repeated objects such as vegetation.

With `--implicit-geometry-instancing`, the exporter instead uses the glTF extensions
[`EXT_mesh_gpu_instancing`](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Vendor/EXT_mesh_gpu_instancing){target="blank"}
and
[`EXT_instance_features`](https://github.com/CesiumGS/glTF/tree/3d-tiles-next/extensions/2.0/Vendor/EXT_instance_features){target="blank"}:
each template mesh is stored only once per tile, and every occurrence is placed by per-instance translation, rotation,
and scale attributes. Per-instance feature IDs are emitted via `EXT_instance_features`, so instanced features remain
individually pickable and keep their entries in the attribute table just like baked features.

Note the following behavior:

- Instances whose transformation matrix cannot be decomposed into translation, rotation, and scale (i.e. matrices
  containing shear or mirroring) automatically fall back to baked mesh copies. The rest of the tile still benefits
  from instancing.
- The option is off by default because it requires viewer support for the two glTF extensions. CesiumJS supports both;
  omit the option for consumers without such support.

```bash
./citydb vis-export 3dtiles -o my-city --implicit-geometry-instancing
```

### Rendering surface outlines

Triangulating the polygon surfaces of a city model for rendering discards the original polygon boundaries: viewers only
see the resulting triangles. With `--enable-outline`, the exporter marks the original polygon boundary edges of each
surface using the glTF extension
[`CESIUM_primitive_outline`](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Vendor/CESIUM_primitive_outline){target="blank"},
so CesiumJS renders these edges as outlines on top of the geometry. This gives buildings and other objects a clear
edge highlight.

Note the following behavior:

- The extension is Cesium-specific. It is declared as an optional glTF extension, so other 3D Tiles clients without
  support for it simply ignore the outlines and render the geometry unchanged.
- The option is off by default because each primitive gains an additional edge-index buffer, which increases tile
  sizes and viewer load time.

Source data often subdivides a single planar surface into many polygons (e.g. triangulated or panelized walls). Since
every polygon boundary is outlined, such surfaces render as a wireframe. With `--outline-merge-coplanar`, the exporter
suppresses outlines on edges shared by two coplanar surfaces of the same feature and surface type, so only the boundary
of the merged surface keeps its outline:

- Without a value, only exactly coplanar surfaces are merged, which suits CAD-authored subdivisions. Pass a maximum
  dihedral angle in degrees between `0` (inclusive) and `90` (exclusive), e.g. `--outline-merge-coplanar=5`, to also
  merge surveyed surfaces whose planes carry angular noise.
- Boundaries between different surface types (e.g. a door in its wall) and folds above the angle (e.g. roof ridges)
  keep their outline.
- The option only takes effect together with `--enable-outline`.

```bash
./citydb vis-export 3dtiles -o my-city --enable-outline --outline-merge-coplanar=5
```

### 3D Tiles example

The example below exports all buildings in a region of interest as a 3D Tiles dataset with a 200 m grid, a textured
appearance theme, shaded surfaces, and a curated set of attributes for picking and popups.

=== "Linux"

    ```bash
    ./citydb vis-export 3dtiles -o my-city \
        --type-name=bldg:Building \
        --filter="s_intersects(core:envelope, bbox(13.369,52.506,13.405,52.520))" \
        --filter-crs=4326 \
        --appearance-theme=summer \
        --grid-edge-length=200 \
        --enable-shading \
        --attributes=CITY:ADDRESS/[FIRST]city,STREET:ADDRESS/[FIRST]street,HOUSE_NUMBER:ADDRESS/[FIRST]houseNumber
    ```

=== "Windows CMD"

    ```bat
    citydb vis-export 3dtiles -o my-city ^
        --type-name=bldg:Building ^
        --filter="s_intersects(core:envelope, bbox(13.369,52.506,13.405,52.520))" ^
        --filter-crs=4326 ^
        --appearance-theme=summer ^
        --grid-edge-length=200 ^
        --enable-shading ^
        --attributes=CITY:ADDRESS/[FIRST]city,STREET:ADDRESS/[FIRST]street,HOUSE_NUMBER:ADDRESS/[FIRST]houseNumber
    ```
