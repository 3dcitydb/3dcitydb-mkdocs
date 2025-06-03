---
title: Export CityJSON command
description: Exporting CityJSON data
tags:
  - citydb-tool
  - CityJSON
  - export
---

# Export CityJSON command

The `export cityjson` command exports city model data from the 3DCityDB `v5` to a [CityJSON file](https://www.cityjson.org/).
Since CityJSON implements only a subset of the [CityGML Conceptual Model](https://docs.ogc.org/is/20-010/20-010.html),
some data may not be fully exportable.

## Synopsis

```bash
citydb export cityjson [OPTIONS]
```

## Options

The `export cityjson` command inherits global options from the main [`citydb`](cli.md) command and general export, query
and filter, and tiling options from its parent [`export`](export.md) command. Additionally, it provides CityJSON
format-specific export options.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General export options

--8<-- "docs/citydb-tool/includes/export-general-options.md"

For more details on the general export options and usage hints, see [here](export.md#general-export-options).

### CityJSON export options

| Option                                | Description                                                                                              | Default value |
|---------------------------------------|----------------------------------------------------------------------------------------------------------|---------------|
| `-v`, `--cityjson-version=<version>`  | CityJSON version: `2.0`, `1.1`, `1.0`.                                                                   | `2.0`         |
| `--[no-]json-lines`                   | Write output as CityJSON Text Sequence in JSON Lines format. This option requires CityJSON 1.1 or later. | `true`        |
| `--pretty-print`                      | Format and indent output file.                                                                           |               |
| `--html-safe`                         | Write JSON that is safe to embed into HTML.                                                              |               |
| `--vertex-precision=<digits>`         | Number of decimal places to keep for geometry vertices.                                                  | 3             |
| `--template-precision=<digits>`       | Number of decimal places to keep for template vertices.                                                  | 3             |
| `--texture-vertex-precision=<digits>` | Number of decimal places to keep for texture vertices.                                                   | 7             |
| `--[no-]transform-coordinates`        | Transform coordinates to integer values when exporting in CityJSON 1.0.                                  | `true`        |
| `--replace-templates`                 | Replace template geometries with real coordinates.                                                       |               |
| `--[no-]material-defaults`            | Use CityGML default values for material properties.                                                      | `true`        |

### Upgrade options for CityGML 2.0 and 1.0

| Option                 | Description                                             | Default value |
|------------------------|---------------------------------------------------------|---------------|
| `--use-lod4-as-lod3`   | Use LoD4 as LoD3, replacing an existing LoD3.           |               |

### Query and filter options

--8<-- "docs/citydb-tool/includes/export-filter-options.md"

For more details on the query and filter options and usage hints, see [here](export.md#query-and-filter-options).

### Time-based feature history options

--8<-- "docs/citydb-tool/includes/export-history-options.md"

For more details on the time-based feature history options and usage hints, see [here](export.md#time-based-feature-history-options).

### Tiling options

--8<-- "docs/citydb-tool/includes/export-tiling-options.md"

For more details on the tiling options and usage hints, see [here](export.md#tiling-options).

### Database connection options

--8<-- "docs/citydb-tool/includes/db-options.md"

For more details on the database connection options and usage hints, see [here](database.md#using-command-line-options).

## Usage

!!! tip
    For general usage hints applicable to all subcommands of the `export` command (including but not limited to
    `export cityjson`), refer to the documentation for the `export` command [here](export.md#usage).

### Specifying the CityJSON version

The `export cityjson` command supports CityJSON versions 2.0, 1.1, and 1.0 as output formats. Use the `--cityjson-version`
option to select a specific version for export (default: `2.0`).

### Streaming exports

When exporting to CityJSON 2.0 and 1.1, the default output format
is [CityJSON Text Sequence (CityJSONSeq)](https://www.cityjson.org/cityjsonseq/){target="blank"}, which efficiently
supports streaming large exports. Features are exported in chunks as individual `CityJSONFeature` objects, with each
object written to the output file on a separate line. This streaming approach improves memory efficiency, reduces storage
requirements, and allows immediate access to the data as it is streamed.

If the newline-delimited CityJSONSeq format is not preferred, streaming can be disabled using the
`--no-json-lines` option.

!!! note
    CityJSON 1.0 does not support CityJSONSeq or streaming.

!!! warning
    Without streaming, the entire export must be loaded into memory before being written to the output file, which could
    quickly exceed system memory limits for large exports. In such cases, consider
    using [filters](export.md#querying-and-filtering) or [tiled exports](export.md#tiled-exports) to reduce the export size.

### Upgrading CityGML 2.0 and 1.0

CityJSON does not support LoD4 representations of features as defined in CityGML 2.0 and 1.0. Therefore, if you have
imported CityGML 2.0 or 1.0 data containing LoD4 geometries into your 3DCityDB `v5`, these geometries will be skipped
by default when exporting to CityJSON.

To address this, you can use the `--use-lod4-as-lod3` option to map LoD4 geometries to LoD3 during export. However,
this will also overwrite any existing LoD3 representation of the features.

### Transforming coordinates

CityJSON applies quantization to the coordinates of the geometry vertices to reduce file size. The coordinates are
represented as integer values, with the scale factor and translation required to recover the original coordinates stored
as separate `"transform"` property.

Quantization is mandatory for CityJSON 2.0 and 1.1, but optional for CityJSON 1.0. By default, the `export cityjson`
command uses quantization for CityJSON 1.0 as well, though it can be disabled using the `--no-transform-coordinates`
option.

### Replacing template geometries

CityJSON supports the CityGML concept of [implicit geometries](../3dcitydb/geometry-module.md#implicit_geometry-table),
enabling template geometries to be defined and stored once in a CityJSON file and reused by multiple features. These
template geometries are stored using local coordinates. Features that reference a template must provide both a reference
point and a transformation matrix to convert the coordinates to real-world values and place the template correctly
within the city model.

If the target system consuming the CityJSON export cannot handle template geometries, the `--replace-templates` option can
be used to replace them with real-world coordinates during export.

!!! note
    Replacing templates will increase the file size and eliminate the benefits of reusing them.

### Suppressing material defaults

By default, citydb-tool includes default values for material properties such as `"diffuseColor"`, `"emissiveColor"`, and
`"ambientIntensity"` in the output file when specific values for these properties are missing in the database.
These defaults are defined in the [CityGML Appearance model](https://docs.ogc.org/is/20-010/20-010.html#toc31) and help
prevent issues with target systems that do not automatically apply them.

You can use the `--no-material-defaults` option to suppress this behavior and omit the properties with default values,
which also reduces the file size.

### Formatting the output

The `export cityjson` command provides several options to format the CityJSON output:

- `--vertex-precision`: Controls the number of decimal places retained for the coordinates of geometries. The coordinate
  values will be rounded to the specified number of decimal places (default: `3`). This option balances data accuracy
  with file size. More decimal places increase precision but may result in a larger file size.
- `--template-precision`: Similar to `--vertex-precision`, but affects the number of decimal places for the coordinates
  of implicit geometries (default: `3`).
- `--texture-vertex-precision`: Similar to `--vertex-precision`, but affects the number of decimal places for texture
  coordinates (default: `7`).
- `--pretty-print`: Enhances readability by adding line breaks and indentation to clearly represent the hierarchy and
  nesting of JSON elements, but increases file size.
- `--html-safe`: Escapes special characters in the CityJSON output for safe use in HTML contexts.

!!! note
    The `--pretty-print` option cannot be used with streaming exports that use newline-delimited JSON.