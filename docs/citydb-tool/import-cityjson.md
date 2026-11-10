---
title: Import CityJSON command
description: Importing CityJSON data
tags:
  - citydb-tool
  - CityJSON
  - import
---

# Import CityJSON command

The `import cityjson` command imports one or more [CityJSON files](https://www.cityjson.org/) into the 3DCityDB `v5`.

## Synopsis

```bash
citydb import cityjson [OPTIONS] <file>...
```

## Options

The `import cityjson` command inherits global options from the main [`citydb`](cli.md) command and general import,
metadata, filter, and database connection options from its parent [`import`](import.md) command. Additionally, it provides CityJSON
format-specific import options.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General import options

--8<-- "docs/citydb-tool/includes/import-general-options.md"

For more details on the general import options and usage hints, see [here](import.md#general-import-options).

### CityJSON import options

| Option                                                                           | Description                                                                                  | Default value |
|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|---------------|
| `--[no-]map-unknown-objects`                                                     | Map city objects from unsupported extensions onto generic city objects.                      | `true`        |
| <code>--lod-mapping-strategy=&lt;strategy></code>                                | Strategy for mapping multiple CityJSON LoDs onto a CityGML LoD: `maximum`, `minimum`.        | `maximum`     |
| <code>--lod-mapping=&lt;lod=cityjson-lod><br/>[,&lt;lod=cityjson-lod>...]</code> | Map a CityGML LoD onto a specific CityJSON LoD. Overrides the mapping strategy for this LoD. |               |
| `-l`, <code>--lod=&lt;lod>[,&lt;lod>...]</code>                                  | Process geometries with a matching LoD.                                                      |               |
| <code>--lod-mode=&lt;mode></code>                                                | LoD filter mode: `keep`, `remove`, `minimum`, `maximum`.                                     | `keep`        |
| `--no-appearances`                                                               | Do not process appearances.                                                                  |               |
| `-a`, <code>--appearance-theme=&lt;theme><br/>[,&lt;theme>...]</code>            | Process appearances with a matching theme. Use `none` for the null theme.                    |               |

### Metadata options

--8<-- "docs/citydb-tool/includes/import-metadata-options.md"

For more details on the metadata options and usage hints, see [here](import.md#metadata-options).

### Filter options

--8<-- "docs/citydb-tool/includes/import-filter-options.md"

For more details on the filter options and usage hints, see [here](import.md#filter-options).

### Database connection options

--8<-- "docs/citydb-tool/includes/db-options.md"

For more details on the database connection options and usage hints, see [here](database.md#using-command-line-options).

## Usage

!!! tip
    For general usage hints applicable to all subcommands of the `import` command (including but not limited to
    `import cityjson`), refer to the documentation for the `import` command [here](import.md#usage).

### Supported CityJSON versions

The `import cityjson` command supports importing CityJSON files in versions 2.0, 1.1, and 1.0. In addition to regular
CityJSON files, the [CityJSON Text Sequence (CityJSONSeq)](https://www.cityjson.org/cityjsonseq/) format is also
supported. CityJSONSeq decomposes the CityJSON dataset into its 1st-level features, which are stored as separate JSON
objects on individual lines, each delimited by newlines. This format enables efficient streaming of large CityJSON data.

The following file types and extensions are recognized by citydb-tool:

| File type            | File extensions   |
|----------------------|-------------------|
| CityJSON file        | `.json`, `.jsonl` |
| GZIP compressed file | `.gz`, `.gzip`    |
| ZIP archive          | `.zip`            |

The file extensions are used when a directory or ZIP archive is provided as `<file>` input instead of a single file.
In such cases, the directory or archive is recursively scanned for input files, which are identified using the
extensions listed above and then processed for import.

### Filtering CityJSON features

The `import cityjson` command inherits [filtering options](import.md#filtering-features) from the parent `import`
command. In the context of CityJSON input files, the filters operate as follows:

| Filter                                                           | Description                                                                                                                                                                                 |
|------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Feature identifier filter](import.md#feature-identifier-filter) | <ul><li>Regular CityJSON files: Applies to the `key` in the `"CityObjects"` collection.</li><li>CityJSONSeq files: Applies to the `"id"` property of `"CityJSONFeature"` objects.</li></ul> |
| [Bounding box filter](import.md#bounding-box-filter)             | Applies to the `"geographicalExtent"` property of input features.                                                                                                                           |

!!! note
    Filters are applied to the 1st-level city objects in the input file. Matching city objects are imported, including all
    their 2nd-level city objects. Filtering 2nd-level city objects is not supported.

### Mapping CityJSON LoDs

CityJSON supports refined LoDs such as `2.0`, `2.1`, and `2.2`, which all correspond to the CityGML LoD `2`. If a city
object has geometry in several refined LoDs of the same CityGML LoD, only one of them is imported. With the default
`--lod-mapping-strategy=maximum`, the highest refined LoD is used, with `minimum` the lowest one.

The `--lod-mapping` option selects a specific refined LoD for a CityGML LoD, for example `2=2.1`. The refined LoD must
belong to the CityGML LoD, so `2=1.2` is ignored with a warning. If a city object has no geometry in the given refined LoD,
the mapping strategy is used for this city object instead.

=== "Linux"

    ```bash
    ./citydb import cityjson [...] my-city.json \
        --lod-mapping=2=2.1
    ```

=== "Windows CMD"

    ```bat
    citydb import cityjson [...] my-city.json ^
        --lod-mapping=2=2.1
    ```

### Filtering LoDs

By default, the `import cityjson` command imports geometries in all LoDs. The `--lod` option restricts the import to
geometries in one or more LoDs given as a comma-separated list of values between `0` and `4`. The LoDs refer to the
CityGML LoD after [mapping the CityJSON LoDs](#mapping-cityjson-lods), so `--lod=2` matches the CityJSON LoD that was
selected for the CityGML LoD `2`. The `--lod-mode` option defines how geometries are filtered by these LoDs:

| LoD mode            | Description                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------------------|
| `keep` (default)    | Only geometries in the given LoDs are imported.                                                                      |
| `remove`            | Geometries in the given LoDs are not imported, all other geometries are imported.                                    |
| `minimum`           | Only geometries in the lowest of the given LoDs available for a 1st-level city object and its 2nd-level city objects are imported.  |
| `maximum`           | Only geometries in the highest of the given LoDs available for a 1st-level city object and its 2nd-level city objects are imported. |

The `--lod` option is required for the `keep` and `remove` modes. For `minimum` and `maximum`, it can be omitted to consider
all LoDs.

Appearances of geometries that are not imported are removed. City objects that have geometries only in LoDs that are
not imported are skipped, while city objects without any LoD geometry are not affected. Existing bounding boxes of the
imported city objects are updated to the remaining geometries.

=== "Linux"

    ```bash
    ./citydb import cityjson [...] my-city.json \
        --lod=2,3 \
        --lod-mode=maximum
    ```

=== "Windows CMD"

    ```bat
    citydb import cityjson [...] my-city.json ^
        --lod=2,3 ^
        --lod-mode=maximum
    ```

### Filtering appearances

By default, the `import cityjson` command imports all appearance information from the input files. The
`--appearance-theme` option restricts the import of appearances based on their `"theme"` property. You can specify one
or more themes as a comma-separated list. To filter appearances that have no theme property, use `none` as the value.

Only appearances associated with the specified themes will be imported. To exclude all appearances from the import, use
the `--no-appearances` option.

### Handling unknown extensions

CityJSON provides a flexible extension mechanism similar to CityGML Application Domain Extensions (ADE). This mechanism
allows the addition of new feature attributes and feature types not covered by the CityJSON specification. If a dataset
contains extensions that are not registered in the 3DCityDB `v5`, citydb-tool handles them as follows:

- Unknown attributes are mapped to generic attributes and stored in the database.
- Unknown feature types are mapped to generic city objects in the database. This default behavior can be
  suppressed using the `--no-map-unknown-objects` option, which will prevent unknown feature types from being imported.

!!! tip
    To import CityJSON extensions as defined, the corresponding type definitions have to be registered in the
    [`OBJECTCLASS`](../3dcitydb/metadata-module.md#objectclass-table) and
    [`DATATYPE`](../3dcitydb/metadata-module.md#datatype-table) metadata tables of the 3DCityDB `v5`. Additionally, a
    corresponding extension module must be loaded for citydb-tool to correctly parse and import the extensions.