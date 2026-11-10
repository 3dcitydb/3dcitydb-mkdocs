---
title: Import CityGML command
description: Importing CityGML data
tags:
  - citydb-tool
  - CityGML
  - import
---

# Import CityGML command

The `import citygml` command imports one or more [CityGML files](https://www.ogc.org/publications/standard/citygml/)
into the 3DCityDB `v5`.

## Synopsis

```bash
citydb import citygml [OPTIONS] <file>...
```

## Options

The `import citygml` command inherits global options from the main [`citydb`](cli.md) command and general import,
metadata, and filter options from its parent [`import`](import.md) command. Additionally, it provides CityGML
format-specific import options.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General import options

--8<-- "docs/citydb-tool/includes/import-general-options.md"

For more details on the general import options and usage hints, see [here](import.md#general-import-options).

### CityGML import options

| Option                                                                       | Description                                                               | Default value |
|------------------------------------------------------------------------------|---------------------------------------------------------------------------|---------------|
| `--import-xal-source`                                                        | Import XML snippets of xAL address elements.                              |               |
| `-x`, <code>--xsl-transform=&lt;stylesheet><br/>[,&lt;stylesheet>...]</code> | Apply XSLT stylesheets to transform input.                                |               |
| `-l`, <code>--lod=&lt;lod>[,&lt;lod>...]</code>                              | Process geometries with a matching LoD.                                   |               |
| <code>--lod-mode=&lt;mode></code>                                            | LoD filter mode: `keep`, `remove`, `minimum`, `maximum`.                  | `keep`        |
| `--no-appearances`                                                           | Do not process appearances.                                               |               |
| `-a`, <code>--appearance-theme=&lt;theme><br/>[,&lt;theme>...]</code>        | Process appearances with a matching theme. Use `none` for the null theme. |               |

### Metadata options

--8<-- "docs/citydb-tool/includes/import-metadata-options.md"

For more details on the metadata options and usage hints, see [here](import.md#metadata-options).

### Upgrade options for CityGML 2.0 and 1.0

| Option                 | Description                                             | Default value |
|------------------------|---------------------------------------------------------|---------------|
| `--use-lod4-as-lod3`   | Use LoD4 as LoD3, replacing an existing LoD3.           |               |
| `--map-lod0-roof-edge` | Map LoD0 roof edges onto roof surfaces.                 |               |
| `--map-lod1-surface`   | Map LoD1 multi-surfaces onto generic thematic surfaces. |               |

### Filter options

--8<-- "docs/citydb-tool/includes/import-filter-options.md"

For more details on the filter options and usage hints, see [here](import.md#filter-options).

### Database connection options

--8<-- "docs/citydb-tool/includes/db-options.md"

For more details on the database connection options and usage hints, see [here](database.md#using-command-line-options).

## Usage

!!! tip
    For general usage hints applicable to all subcommands of the `import` command (including but not limited to
    `import citygml`), refer to the documentation for the `import` command [here](import.md#usage).

### Supported CityGML versions

The `import citygml` command supports importing CityGML files in versions 3.0, 2.0, and 1.0. It recognizes the following
file types and extensions:

| File type            | File extensions |
|----------------------|-----------------|
| CityGML file         | `.gml`, `.xml`  |
| GZIP compressed file | `.gz`, `.gzip`  |
| ZIP archive          | `.zip`          |

The file extensions are used when a directory or ZIP archive is provided as `<file>` input instead of a single file.
In such cases, the directory or archive is recursively scanned for input files, which are identified using the
extensions listed above and then processed for import.

### Upgrading CityGML 2.0 and 1.0

CityGML data can be exported from the 3DCityDB `v5` in the same version as it was imported, without loss. However,
switching CityGML versions between import and export may result in data loss, as CityGML 3.0 is not fully backward
compatible with versions 2.0 and 1.0. While citydb-tool applies automatic conversions where possible, certain
scenarios require user input.

If CityGML 3.0 is the primary format for your 3DCityDB `v5` instance, the following upgrade options are
available to resolve compatibility issues when importing CityGML 2.0 or 1.0 files:

- `--use-lod4-as-lod3`: Converts LoD4 geometries to LoD3, replacing any existing LoD3.
- `--map-lod0-roof-edge`: Converts LoD0 roof edge geometries into roof surface features.
- `--map-lod1-surface`: Converts LoD1 multi-surfaces into generic thematic surface features.

!!! note
    The upgrade options are not required if you only manage CityGML 2.0 and 1.0 data in your 3DCityDB `v5`.
    However, be cautious when importing CityGML 3.0 in this setup, as citydb-tool does not offer downgrade options. Any
    CityGML 3.0 content that cannot be automatically downgraded when exporting to CityGML 2.0 or 1.0 will be skipped.
    For more details, refer to the [compatibility and data migration](../compatibility.md) guide.

### Filtering CityGML features

The `import citygml` command inherits [filtering options](import.md#filtering-features) from the parent `import`
command. In the context of CityGML input files, the filters operate as follows:

| Filter                                                               | Description                                                |
|----------------------------------------------------------------------|------------------------------------------------------------|
| [Feature identifier filter](import.md#feature-identifier-filter) | Applies to the `gml:id` property of input features.        |
| [Bounding box filter](import.md#bounding-box-filter)             | Applies to the `gml:boundedBy` property of input features. |

!!! note
    Filters are applied to the top-level `<cityObjectMember>` elements in the input file. Matching features
    are imported, including all their subfeatures. Filtering subfeatures is not supported.

### Filtering LoDs

By default, the `import citygml` command imports geometries in all LoDs. The `--lod` option restricts the import to
geometries in one or more LoDs given as a comma-separated list of values between `0` and `4`. The `--lod-mode` option
defines how geometries are filtered by these LoDs:

| LoD mode            | Description                                                                                                                     |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `keep` (default)    | Only geometries in the given LoDs are imported.                                                                                 |
| `remove`            | Geometries in the given LoDs are not imported, all other geometries are imported.                                               |
| `minimum`           | Only geometries in the lowest of the given LoDs available for a top-level feature and its subfeatures are imported.             |
| `maximum`           | Only geometries in the highest of the given LoDs available for a top-level feature and its subfeatures are imported.            |

The `--lod` option is required for the `keep` and `remove` modes. For `minimum` and `maximum`, it can be omitted to consider
all LoDs.

Appearances of geometries that are not imported are removed. Features and subfeatures that have geometries only in
LoDs that are not imported are skipped, while features without any LoD geometry are not affected. Existing bounding
boxes of the imported features are updated to the remaining geometries.

=== "Linux"

    ```bash
    ./citydb import citygml [...] my-city.gml \
        --lod=2,3 \
        --lod-mode=maximum
    ```

=== "Windows CMD"

    ```bat
    citydb import citygml [...] my-city.gml ^
        --lod=2,3 ^
        --lod-mode=maximum
    ```

!!! note
    The LoD filter is applied after the [upgrade options](#upgrading-citygml-20-and-10). When using
    `--use-lod4-as-lod3`, LoD4 geometries are therefore filtered as LoD3.

### Filtering appearances

By default, the `import citygml` command imports all appearance information from the input files. The
`--appearance-theme` option restricts the import of appearances based on their `<theme>` property. You can specify one
or more themes as a comma-separated list. To filter appearances that have no theme property, use `none` as the value.

Only appearances associated with the specified themes will be imported. To exclude all appearances from the import, use
the `--no-appearances` option.

### Applying XSL transformations

XSLT stylesheets enable the on-the-fly transformation of CityGML input data before it is imported into the database.
This allows you to modify or restructure the data to meet specific needs, such as changing values, filtering attributes,
or removing and replacing entire GML/XML structures.

The `--xsl-transform` option specifies one or more XSLT stylesheets to be applied to the input files. Each stylesheet must
be referenced by its filename and path, which can be either absolute or relative to the current directory. Multiple XSLT
stylesheets can be listed, separated by commas, to facilitate a multi-step transformation process. In this case, the
stylesheets are executed in the specified order, with the output of one stylesheet serving as the input for the next.

=== "Linux"

    ```bash
    ./citydb import citygml [...] my-city.gml \
        --xsl-transform=my-first-stylesheet.xsl,my-second-stylesheet.xsl
    ```

=== "Windows CMD"

    ```bat
    citydb import citygml [...] my-city.gml ^
        --xsl-transform=my-first-stylesheet.xsl,my-second-stylesheet.xsl
    ```

!!! note
    - To handle large input files, citydb-tool chunks each CityGML file into top-level features, which are then imported
      into the database. As a result, each XSLT stylesheet operates on individual top-level features, not the entire file.
      Keep this in mind when developing your XSLT.
    - The output of each XSLT stylesheet must be valid CityGML.

### Storing xAL address elements

CityGML uses the [OASIS Extensible Address Language (xAL)](https://docs.oasis-open.org/ciq/v3.0/specs/ciq-specs-v3.html)
standard to encode address data. During import, citydb-tool parses the xAL content and maps it to the separate columns
of the [`ADDRESS`](../3dcitydb/feature-module.md#address-table) table, which provides a comprehensive and flexible
structure for storing address data. However, if the original xAL address element is too complex to be fully mapped to
the `ADDRESS` table columns, the `--import-xal-source` option allows importing and retaining the original xAL element.
For more details, see [here](../3dcitydb/feature-module.md#address-table).