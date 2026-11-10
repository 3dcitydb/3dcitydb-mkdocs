---
title: Export CityGML command
description: Exporting CityGML data
tags:
  - citydb-tool
  - CityGML
  - export
---

# Export CityGML command

The `export citygml` command exports city model data from the 3DCityDB `v5` to a [CityGML file](https://www.ogc.org/publications/standard/citygml/).

## Synopsis

```bash
citydb export citygml [OPTIONS]
```

## Options

The `export citygml` command inherits global options from the main [`citydb`](cli.md) command and general export, query
and filter, time-based feature history, tiling, and database connection options from its parent [`export`](export.md) command. Additionally, it provides CityGML
format-specific export options.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General export options

--8<-- "docs/citydb-tool/includes/export-general-options.md"

For more details on the general export options and usage hints, see [here](export.md#general-export-options).

### CityGML export options

| Option                                                                       | Description                                 | Default value |
|------------------------------------------------------------------------------|---------------------------------------------|---------------|
| `-v`, `--citygml-version=<version>`                                          | CityGML version: `3.0`, `2.0`, `1.0`.       | `3.0`         |
| `--[no-]pretty-print`                                                        | Format and indent output file.              | `true`        |
| `-x`, <code>--xsl-transform=&lt;stylesheet><br/>[,&lt;stylesheet>...]</code> | Apply XSLT stylesheets to transform output. |               |

### Upgrade options for CityGML 2.0 and 1.0

| Option                 | Description                                             | Default value |
|------------------------|---------------------------------------------------------|---------------|
| `--use-lod4-as-lod3`   | Use LoD4 as LoD3, replacing an existing LoD3.           |               |
| `--map-lod0-roof-edge` | Map LoD0 roof edges onto roof surfaces.                 |               |
| `--map-lod1-surface`   | Map LoD1 multi-surfaces onto generic thematic surfaces. |               |

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
    `export citygml`), refer to the documentation for the `export` command [here](export.md#usage).

### Specifying the CityGML version

The `export citygml` command supports CityGML versions 3.0, 2.0, and 1.0 as output formats. Use the `--citygml-version`
option to select a specific version for export (default: `3.0`).

### Upgrading CityGML 2.0 and 1.0

CityGML data can be exported from the 3DCityDB `v5` in the same version as it was imported, without loss. However,
switching CityGML versions between import and export may result in data loss, as CityGML 3.0 is not fully backward
compatible with versions 2.0 and 1.0. While citydb-tool applies automatic conversions where possible, certain
scenarios require user input.

If either CityGML 2.0 or 1.0 is the primary format for your 3DCityDB `v5`, the following upgrade options are
available to resolve compatibility issues when exporting to CityGML 3.0:

- `--use-lod4-as-lod3`: Converts LoD4 geometries to LoD3, replacing any existing LoD3.
- `--map-lod0-roof-edge`: Converts LoD0 roof edge geometries into roof surface features.
- `--map-lod1-surface`: Converts LoD1 multi-surfaces into generic thematic surface features.

!!! note
    The upgrade options are not required if you only manage CityGML 3.0 data in your 3DCityDB `v5`. However,
    be cautious when exporting to CityGML 2.0 or 1.0 in this setup, as citydb-tool does not offer downgrade options. Any
    CityGML 3.0 content that cannot be automatically downgraded during export will be skipped. For more details, refer to
    the [compatibility and data migration](../compatibility.md) guide.

### Applying XSL transformations

XSLT stylesheets enable the on-the-fly transformation of database content before it is written to the CityGML output file.
This allows you to modify or restructure the data to meet specific needs, such as changing values, filtering attributes,
or removing and replacing entire GML/XML structures.

The `--xsl-transform` option specifies one or more XSLT stylesheets to be applied to the output file. Each stylesheet must
be referenced by its filename and path, which can be either absolute or relative to the current directory. Multiple XSLT
stylesheets can be listed, separated by commas, to facilitate a multi-step transformation process. In this case, the
stylesheets are executed in the specified order, with the output of one stylesheet serving as the input for the next.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o my-city.gml \
        --xsl-transform=my-first-stylesheet.xsl,my-second-stylesheet.xsl
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --xsl-transform=my-first-stylesheet.xsl,my-second-stylesheet.xsl
    ```

!!! note
    - To handle large output files, citydb-tool chunks the export into top-level features, which are then written
      to the output file. As a result, each XSLT stylesheet operates on individual top-level features, not the entire file.
      Keep this in mind when developing your XSLT.
    - The output of each XSLT stylesheet must be valid CityGML.

### Formatting the output

By default, the `export citygml` command uses pretty printing to format the GML/XML output. This approach enhances
readability by adding line breaks and indentation to clearly represent the hierarchy and nesting of XML elements. In
scenarios where human readability is less important, pretty printing can be disabled using the `--no-pretty-print` option.
This reduces file size and optimizes storage and transfer efficiency.