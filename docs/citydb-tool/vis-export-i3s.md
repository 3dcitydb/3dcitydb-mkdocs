---
title: Vis-export I3S command
description: Exporting OGC I3S data
tags:
  - citydb-tool
  - vis-export
  - I3S
  - SLPK
  - visualization
---

# Vis-export I3S command

The `vis-export i3s` command exports city model data from the 3DCityDB `v5` in
[OGC Indexed 3D Scene Layer (I3S)](https://www.ogc.org/publications/standard/i3s/){target="blank"} format. The resulting
scene layer can be consumed by clients such as ArcGIS Pro and ArcGIS Online, as well as any other I3S compliant viewer.

The export produces a streaming-ready scene layer with packed texture atlases, integrated meshes, and node pages
organized along a spatial aggregation tree. The output is written either as a folder tree (default) or packaged into
a single Scene Layer Package (`.slpk`) file via the `--slpk` option.

## Synopsis

```bash
citydb vis-export i3s [OPTIONS]
```

## Options

The `vis-export i3s` command inherits global options from the main [`citydb`](cli.md) command and general export,
query and filter, and scene options from its parent [`vis-export`](vis-export.md) command. Additionally, it provides
I3S format-specific export options.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General export options

--8<-- "docs/citydb-tool/includes/vis-export-general-options.md"

For more details on the general export options and usage hints, see [here](vis-export.md#general-export-options).

### I3S export options

| Option   | Description                                                                                                                                                                                          | Default value |
|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `--slpk` | Package the I3S output as a Scene Layer Package (`.slpk`) file, compatible with ArcGIS Pro. By default, I3S is exported as a folder structure. Recommended output file extension when set: `.slpk`. |               |

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
    `vis-export i3s`), refer to the documentation for the `vis-export` command [here](vis-export.md#usage).

### Choosing folder mode or SLPK

The `vis-export i3s` command supports two output layouts:

- **Folder mode (default):** The scene layer is written as a tree of folders and files into the folder specified by
  `--output`, mirroring the I3S REST API layout. This format is convenient when serving the scene layer from a static
  web server, since clients can request individual node pages and resources directly. Pass a folder path to `--output`,
  with no file extension required.
- **SLPK mode (`--slpk`):** The entire scene layer is packaged into a single Scene Layer Package (`.slpk`) file. This
  format is required to load the data into ArcGIS Pro and is also accepted by many other I3S clients. When `--slpk`
  is set, use the `.slpk` file extension on `--output`.

=== "Folder mode"

    ```bash
    ./citydb vis-export i3s -o my-city
    ```

=== "SLPK"

    ```bash
    ./citydb vis-export i3s -o my-city.slpk --slpk
    ```

!!! note
    When `--slpk` is set, citydb-tool automatically enables `--enable-shading`, because ArcGIS Pro and ArcGIS Online
    refuse to load a scene layer whose legacy geometry buffer omits per-vertex normals. For folder-mode I3S targeted
    at ArcGIS, pass `--enable-shading` explicitly.

### I3S example

The example below exports all buildings in a region of interest as an I3S scene layer packaged as `.slpk`, using a
200 m grid, a textured appearance theme, and a curated set of attributes for popups.

=== "Linux"

    ```bash
    ./citydb vis-export i3s -o my-city.slpk \
        --slpk \
        --type-name=bldg:Building \
        --filter="s_intersects(core:envelope, bbox(13.369,52.506,13.405,52.520))" \
        --filter-crs=4326 \
        --appearance-theme=summer \
        --grid-edge-length=200 \
        --attributes=CITY:ADDRESS/[FIRST]city,STREET:ADDRESS/[FIRST]street,HOUSE_NUMBER:ADDRESS/[FIRST]houseNumber
    ```

=== "Windows CMD"

    ```bat
    citydb vis-export i3s -o my-city.slpk ^
        --slpk ^
        --type-name=bldg:Building ^
        --filter="s_intersects(core:envelope, bbox(13.369,52.506,13.405,52.520))" ^
        --filter-crs=4326 ^
        --appearance-theme=summer ^
        --grid-edge-length=200 ^
        --attributes=CITY:ADDRESS/[FIRST]city,STREET:ADDRESS/[FIRST]street,HOUSE_NUMBER:ADDRESS/[FIRST]houseNumber
    ```

### Texture handling notes for I3S

The I3S specification limits a node to a single material. As a result, the I3S writer always uses single-atlas mode and
cannot spill overflowing textures onto multiple pages the way 3D Tiles can. When `--atlas-fallback=expand` is set
(the default), residual cells grow their single atlas page up to the 16K WebGL cap. When `--atlas-fallback=rescale` is
set, the exporter honors `--max-atlas-size` by shrinking textures uniformly instead. See
[Texture atlas handling](vis-export.md#texture-atlas-handling) for the full description.
