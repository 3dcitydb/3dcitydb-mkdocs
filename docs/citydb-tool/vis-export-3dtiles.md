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
query and filter, and scene options from its parent [`vis-export`](vis-export.md) command. It does not currently define
any 3D Tiles-specific CLI options beyond the shared scene options.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General export options

--8<-- "docs/citydb-tool/includes/vis-export-general-options.md"

For more details on the general export options and usage hints, see [here](vis-export.md#general-export-options).

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
