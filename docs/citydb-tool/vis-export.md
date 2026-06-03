---
title: Vis-export command
description: Overview of the vis-export command
tags:
  - citydb-tool
  - vis-export
  - 3D Tiles
  - I3S
  - visualization
---

# Vis-export command

The `vis-export` command exports city model data from the 3DCityDB `v5` in a visualization format optimized for
streaming and rendering in 3D web viewers and GIS clients. Each format has a dedicated [subcommand](#commands) with
format-specific options.

Unlike the [`export`](export.md) command, which produces semantically rich files such as CityGML or CityJSON for data
exchange and archiving, `vis-export` builds a spatially indexed scene with level-of-detail (LoD) tiling, baked
geometries, and packed texture atlases that are ready to be loaded directly into a viewer.

## Synopsis

```bash
citydb vis-export [OPTIONS] COMMAND
```

## Options

The `vis-export` command inherits global options from the main [`citydb`](cli.md) command. Additionally, it defines
general export, query and filter, and scene options, which apply to all of its [subcommands](#commands).

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General export options

--8<-- "docs/citydb-tool/includes/vis-export-general-options.md"

### Query and filter options

--8<-- "docs/citydb-tool/includes/vis-export-filter-options.md"

### Time-based feature history options

--8<-- "docs/citydb-tool/includes/export-history-options.md"

### Scene options

--8<-- "docs/citydb-tool/includes/vis-export-scene-options.md"

## Commands

| Command                                     | Description                                                                                |
|---------------------------------------------|--------------------------------------------------------------------------------------------|
| [`help`](cli.md#help-and-cli-documentation) | [Display help information about the specified command.](cli.md#help-and-cli-documentation) |
| [`3dtiles`](vis-export-3dtiles.md)          | [Export data in OGC 3D Tiles 1.1 format.](vis-export-3dtiles.md)                            |
| [`i3s`](vis-export-i3s.md)                  | [Export data in OGC I3S format.](vis-export-i3s.md)                                         |

!!! note
    Additional subcommands to support more visualization formats may be added in future versions. You can also implement
    your own [plugin](cli.md#plugins) to add support for a specific format. Contributions are welcome.

## Usage

### Specifying the output

The output for the export is specified using the `--output` option. For both 3D Tiles and I3S, the value is a folder
path into which the exporter writes the tileset or scene layer as a tree of files and folders.

The only exception is I3S exported as a Scene Layer Package. When the `--slpk` flag is set, the I3S subcommand
packages the whole scene layer into a single file, and the output path should carry the `.slpk` extension. See the
[`vis-export i3s`](vis-export-i3s.md#choosing-folder-mode-or-slpk) documentation for details.

Make sure that the parent directory is writable and has enough free space.

!!! note
    Visualization formats use WGS84 geographic coordinates (EPSG:4326). The exporter automatically reprojects geometries
    from the 3DCityDB CRS to EPSG:4326. There is no `--crs` option for `vis-export`.

### Querying and filtering

citydb-tool allows exporting all features stored in a 3DCityDB `v5` instance into a single scene. However, in most
cases only a specific subset of features is needed. The `vis-export` command supports the same querying and filtering
mechanisms as the regular `export` command.

#### Feature type filter

The `--type-name` option specifies one or more feature types to export. For each feature type, provide its type name as
defined in the [`OBJECTCLASS`](../3dcitydb/metadata-module.md#objectclass-table) table of the 3DCityDB `v5`. To avoid
ambiguity, you can use the namespace alias from the [`NAMESPACE`](../3dcitydb/metadata-module.md#namespace-table) table
as a prefix in the format `prefix:name`.

#### CQL2-based filtering

The `--filter` option accepts an [OGC CQL2](https://www.ogc.org/publications/standard/cql2/){target="blank"} expression.
When applying spatial filters, the filter geometries are assumed to be in the same CRS as the 3DCityDB instance. To
specify a different CRS, use the `--filter-crs` option and provide the SRID (e.g., `4326` for WGS84).

!!! tip
    For more details on using CQL2 with the 3DCityDB `v5`, refer to the [CQL2 documentation](cql2.md).

The example below exports all buildings taller than 15 meters as 3D Tiles.

=== "Linux"

    ```bash
    ./citydb vis-export 3dtiles -o my-city \
        --type-name=bldg:Building \
        --filter="con:height > 15"
    ```

=== "Windows CMD"

    ```bat
    citydb vis-export 3dtiles -o my-city ^
        --type-name=bldg:Building ^
        --filter="con:height > 15"
    ```

#### SQL-based filtering

The `--sql-filter` option allows the use of SQL `SELECT` statements as filter expressions. The statement must return
a list of `id` values from the [FEATURE](../3dcitydb/feature-module.md#feature-table) table. Only features included in
the returned list will be considered for export.

#### Count filter

The `--limit` option sets the maximum number of features to export. The `--start-index` option defines the `0`-based
index of the first feature within the result set to export.

#### LoD filter

The `vis-export` command allows filtering geometries by Level-of-Detail using the `--lod` option. Behavior matches the
regular [`export`](export.md#lod-filter) command, including the `--lod-mode` (`or`, `and`, `minimum`, `maximum`) and
`--lod-search-depth` options.

#### Appearance filter

The `--appearance-theme` option filters appearances by `<theme>`. Use `none` to match the null theme, or
`--no-appearances` to skip all appearances. Features without appearances, as well as features whose appearances are
skipped, fall back to the no-appearance path. The resulting surfaces can be colored via
[`--default-color`](#styling-features-without-appearances) and
[`--feature-type-style`](#styling-features-without-appearances).

### Spatial aggregation and LoD

Both 3D Tiles and I3S organize features into a spatial aggregation tree so that viewers can load only the visible parts
of a scene and progressively refine to higher detail as the camera approaches. citydb-tool builds this tree from a
uniform grid of leaf cells, where interior nodes aggregate their children and serve as coarser representations of the
same area.

- `--grid-edge-length` sets the edge length (in meters) of one leaf cell. When omitted, the leaf cell is sized so that
  the entire dataset fits in a single root cell, in which case no spatial subdivision is performed. Set a smaller value
  to produce a finer grid with shorter camera load distances.
- `--screen-pixel-threshold` defines the projected bounding-sphere radius (in pixels) above which a tile refines to its
  children. The same threshold drives the 3D Tiles `geometricError` and the I3S LOD threshold, so that both formats
  refine at the same camera distance. Lower values load more detail (heavier viewer), while
  higher values defer refinement (lighter viewer). Pass `0` to always refine to the leaves, which is useful for small
  exports or debugging but easily crashes the viewer on city-scale datasets.
- `--clamp-to-ground` places each feature on the ellipsoid surface (height 0). This is useful when the viewer has no
  terrain loaded.

### Texture atlas handling

To minimize draw calls, citydb-tool packs the textures referenced by each leaf cell into a single texture atlas. When
the textures of a cell exceed the configured atlas budget, the exporter must decide how to resolve the overflow.

- `--max-atlas-size` sets the maximum atlas edge length in pixels, between `1024` and `16384`. Higher values pack more
  textures per atlas but increase GPU memory usage and upload latency in the viewer.
- `--atlas-overflow-mode` selects the top-level strategy:
    - `hybrid` (default) spatially subdivides the offending cell (2×2 push-down) until each leaf fits one atlas page,
      while keeping a low-resolution rescaled preview on each split-cell root. The viewer shows the preview until the
      split leaves cross the LoD threshold, which produces the smoothest LoD cascade. The cell-root preview always
      uses the `rescale` strategy so that it stays within `--max-atlas-size`, regardless of `--atlas-fallback`.
    - `split` applies the same spatial subdivision as `hybrid` but without the preview. This results in one fewer
      LoD level, a faster export, and a sharper LoD transition.
    - `flat` performs no spatial split. Instead, every overflowing cell is processed in place (no tree hierarchy
      introduced), and the outcome is controlled by `--atlas-fallback`.
- `--atlas-fallback` controls how cells that the split stage could not (or did not) subdivide further are
  handled. This applies to single-feature and depth-cap residuals under `--atlas-overflow-mode=hybrid` and
  `split`, and to every overflowing cell under `--atlas-overflow-mode=flat`:
    - `expand` (default) preserves source-resolution textures. For 3D Tiles, overflow spills onto additional atlas
      pages (multi-page GLB). For I3S, the single atlas page grows up to the WebGL 16K cap.
    - `rescale` honors `--max-atlas-size` by shrinking textures uniformly. For 3D Tiles, this forces single-atlas mode.

You can also globally scale all textures with `--texture-scale=<factor>` (between `0.01` and `1.0`) to reduce file size
and viewer loading time at the cost of texture detail.

### Styling features without appearances

Features that have neither a texture nor an `X3DMaterial` follow the no-appearance path. The resulting surfaces can be
colored explicitly using the following options:

- `--default-color=<#rrggbb[aa]>` sets the default sRGB color applied to every no-appearance surface
  (default: opaque white). The optional `aa` component defines transparency.
- `--feature-type-style=<type=#rrggbb[aa]>` overrides the default color per feature type. The key is a qualified
  feature type name like `bldg:Building`. Child types take precedence over parents through the schema type hierarchy,
  so that an override on `core:AbstractCityObject` acts as a default for every CityGML feature, while a more specific
  override on `bldg:Building` wins for buildings only. Multiple entries can be provided either by repeating the option
  or as a comma-separated list, as shown below.

=== "Linux"

    ```bash
    ./citydb vis-export 3dtiles -o my-city \
        --default-color=#cccccc \
        --feature-type-style=bldg:Building=#ff0000,tran:Road=#808080cc
    ```

=== "Windows CMD"

    ```bat
    citydb vis-export 3dtiles -o my-city ^
        --default-color=#cccccc ^
        --feature-type-style=bldg:Building=#ff0000,tran:Road=#808080cc
    ```

The `--enable-shading` flag emits per-vertex normals so that plain, `X3DMaterial`-colored, and per-feature-type-styled
surfaces render PBR / Lambertian shaded and pick up 3D form. Textured surfaces also receive normals (using the local
up-direction) so that they stay equally lit within a node while still responding to time-of-day sun changes. When the
flag is omitted, every primitive renders unlit, which produces smaller files but loses depth cues.

!!! note
    `--enable-shading` is auto-enabled when I3S is exported with `--slpk`, because ArcGIS Pro and ArcGIS Online refuse
    to load a scene layer whose geometry buffer omits normals.

### Selecting attributes

By default, `vis-export` emits every top-level attribute of each feature in the per-feature attribute table that the
viewer uses for picking and popups. To control exactly which columns are emitted, use the `--attributes` option with
one or more declarative entries of the form `<output_col>:<source>`.

The `<source>` syntax is `<TABLE>/[<AGG>]<col_path>`, where:

- `TABLE` is `FEATURE`, `ATTRIBUTES`, or `ADDRESS`.
- `AGG` (optional, defaults to `FIRST`) is `FIRST`, `LAST`, `COUNT`, or `ALL`.
- For `FEATURE`, `<col_path>` is a single field name.
- For `ADDRESS`, `<col_path>` is a single field optionally followed by `[<field>=<value>]` to filter address rows.
- For `ATTRIBUTES`, `<col_path>` is a dotted chain of localName segments where any segment may carry its own
  `[<field>=<value>]` predicate that keeps only nodes whose child `<field>` equals `<value>`. Paths may end with
  `::<type>` to force the leaf value type (`int`, `double`, `string`, `timestamp`, `uri`, `array`, `code`, `uom`,
  `content`, `mimeType`).

Examples:

```text
CITY:ADDRESS/[FIRST]city
STREET:ADDRESS/[FIRST]street
HOUSE_NUMBER:ADDRESS/[FIRST]houseNumber
TARGET_RESOURCE:ATTRIBUTES/[FIRST]externalReference::uri
```

For long lists, use the picocli `@file` syntax, for example `--attributes @cols.txt`. Each non-blank line of `cols.txt`
is one entry. Comments are not supported in this mode.

!!! note
    `TABLE`, `AGG`, the `::type` cast, and `FEATURE` and `ADDRESS` field names are all case-insensitive. `ATTRIBUTES`
    path segments are case-sensitive, because they must match the XML localNames literally.

### Exporting historical versions

The bi-temporal feature history of the 3DCityDB `v5` is supported in the same way as for the regular `export` command.
The `--validity`, `--validity-reference`, and `--validity-at` options control which versions are exported. See the
[corresponding section](export.md#exporting-historical-versions) for details.

### Controlling the export process

The `vis-export` command offers the following options to control the export process:

- `--fail-fast` terminates the process immediately upon encountering an error. By default, the export continues
  despite errors with individual features.
- `--temp-dir` specifies the directory for storing temporary files during export. For optimal performance, choose a
  fast storage medium that is not used for writing the output files. The exporter creates a unique
  `.citydb-vis-tmp-*` subdirectory per run, which is removed automatically when the export completes.
- `--threads` sets the number of threads for parallel processing. By default, this equals the number of processors
  available to the JVM, or at least two.

!!! note
    Setting the number of threads too high can lead to performance issues due to thrashing. Additionally, each thread
    requires a separate database connection, so ensure your database can handle the required number of connections.
