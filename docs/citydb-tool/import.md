---
title: Import command
description: Overview of the import command
tags:
  - citydb-tool
  - import
---

# Import command

The `import` command imports city model data into the 3DCityDB `v5` in a supported format. Each format has a dedicated
[subcommand](#commands) with format-specific options.

## Synopsis

```bash
citydb import [OPTIONS] COMMAND
```

## Options

The `import` command inherits global options from the main [`citydb`](cli.md) command. Additionally, it defines general
import, metadata, and filter options, which apply to all of its [subcommands](#commands).

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General import options

--8<-- "docs/citydb-tool/includes/import-general-options.md"

### Metadata options

--8<-- "docs/citydb-tool/includes/import-metadata-options.md"

### Filter options

--8<-- "docs/citydb-tool/includes/import-filter-options.md"

## Commands

| Command                                     | Description                                                                                |
|---------------------------------------------|--------------------------------------------------------------------------------------------|
| [`help`](cli.md#help-and-cli-documentation) | [Display help information about the specified command.](cli.md#help-and-cli-documentation) |
| [`citygml`](import-citygml.md)              | [Import data in CityGML format.](import-citygml.md)                                        |
| [`cityjson`](import-cityjson.md)            | [Import data in CityJSON format.](import-cityjson.md)                                      |

!!! note
    Additional subcommands to support more formats may be added in future versions. You can also implement your own
    [plugin](cli.md#plugins) to add support for a specific format. Contributions are welcome.

## Usage

### Specifying import files

The input for import is specified using one or more `<file>` arguments, each of which can point to either a file
or a directory. You can also use glob patterns with wildcard characters such as `*`, `?`, `[ ]`, or `{ }` to match multiple
files.

If a directory is provided, it will be scanned recursively for supported input files. The supported file formats and
extensions depend on the [subcommand](#commands). In addition to regular files, ZIP archives and GZIP-compressed files are
supported as input. Like directories, ZIP archives are also scanned recursively for supported input files.
The following example shows different ways for defining input files.

=== "Linux"

    ```bash
    ./citydb import citygml [...] \
        /path/to/my-city.gml \
        /foo/ \
        /bar/**/city*.{gml,gz,zip}
    ```

=== "Windows CMD"

    ```bat
    citydb import citygml [...] ^
        C:\path\to\my-city.gml ^
        C:\foo\ ^
        C:\bar\**\city*.{gml,gz,zip}
    ```

To enforce a specific encoding for the input files, provide the IANA-based encoding name (e.g., `UTF-8`) with the
`--input-encoding` option. This encoding will be applied to all input files.

### Import modes and duplicate features

The import mode, defined by the `--import-mode` option, determines how duplicate features are handled in the database.
The available modes are:

- `import_all`: All features from the input files are imported, even if duplicates are created. This is the default mode.
- `skip`: Features already in the database take precedence. If a duplicate is found, the feature from the input file is
  ignored and not imported.
- `delete`: Features from the input files take precedence. If a duplicate is found, the existing feature in the database
  is deleted before the new feature is imported.
- `terminate`: Similar to `delete`, but the duplicate feature in the database is terminated rather than deleted (for
  the difference, see the [`delete`](delete.md) command).

!!! note
    - Duplicates are identified by comparing the `objectid` column in the [`FEATURE`](../3dcitydb/feature-module.md#feature-table)
      table with the feature identifier from the input file (e.g., `gml:id`
      for CityGML files). No additional checks are applied for identifying duplicates.
    - Terminated features are excluded from the duplicates check.

### Previewing the import

The `--preview` option runs the import in preview mode. The input data is processed as if the import were taking place, but
no changes are made to the database. This mode helps identify potential issues, such as conflicts or errors, before they
affect the database, ensuring the actual import proceeds as expected.

### Filtering features

The `import` command provides several filtering options to control which features are imported from the input files.

#### Feature type filter

The `--type-name` option specifies one or more feature types to import. For each feature type, provide its type name as
defined in the [`OBJECTCLASS`](../3dcitydb/metadata-module.md#objectclass-table) table of the 3DCityDB `v5`. To avoid
ambiguity, you can use the namespace alias from the [`NAMESPACE`](../3dcitydb/metadata-module.md#namespace-table) table
as a prefix in the format `prefix:name`. Only features matching the specified type will be imported.

#### Feature identifier filter

The `--id` option enables filtering by one or more feature identifiers provided as a comma-separated list. Only features
with a matching identifier will be imported.

#### Bounding box filter

The `--bbox` option defines a 2D bounding box as a spatial filter using four coordinates for the lower-left and
upper-right corners. By default, the coordinates are assumed to be in the same CRS as the 3DCityDB instance. However,
you can specify the database SRID of the CRS as a fifth value (e.g., `4326` for WGS84). All values must be separated by
commas.

The filter behavior is controlled by the `--bbox-mode` option:

- `intersects`: Only features whose bounding box overlaps with the filter bounding box will be imported. This is the
  default mode.
- `contains`: Only features whose bounding box is entirely within the filter bounding box will be imported.
- `on_tile`: Only features whose bounding box center lies within the filter bounding box or on its left/bottom
  boundary will be imported. This mode ensures that when multiple filter bounding boxes are organized in a tile grid,
  each feature matches exactly one tile.

#### Count filter

The `--limit` option sets the maximum number of features to import. The `--start-index` option
defines the `0`-based index of the first feature to import. These options apply across all input files and can be used
separately or together to control the total number of features imported.

#### Filter example

The following example illustrates a CityGML import command with multiple filters:

=== "Linux"

    ```bash
    ./citydb import citygml [...] my-city.gml \
        --type-name=bldg:Building,tran:Road \
        --bbox=367123,5807268,367817,5807913,25833 \
        --bbox-mode=on_tile \
        --limit=100
    ```

=== "Windows CMD"

    ```bat
    citydb import citygml [...] my-city.gml ^
        --type-name=bldg:Building,tran:Road ^
        --bbox=367123,5807268,367817,5807913,25833 ^
        --bbox-mode=on_tile ^
        --limit=100
    ```

!!! note
    - When using multiple filters, all conditions must be satisfied for a feature to be imported.
    - [Configuration](cli.md#configuration-files) and [argument](cli.md#argument-files) files are an excellent way
      to store complex filter expressions and easily reuse them.

### Managing indexes during import

When importing data, database indexes are updated in real time, which can slow down the import process, especially 
with large datasets. The `--index-mode` option offers the following modes for handling indexes during the import
operation:

- `keep`: The indexes remain unchanged. This is the default mode.
- `drop`: The indexes are removed before the import starts, improving import performance.
- `drop_create`: Similar to `drop`, but the indexes are re-created after the import completes, ensuring they are
  available for subsequent queries.

!!! note
    Dropping and re-creating indexes can also take a significant amount of time, depending on the size of the database. This
    mode is beneficial when importing large datasets, such as during the initial loading of the database. However, as
    the database grows, the overhead of dropping and re-creating indexes may outweigh the benefits, especially when
    importing smaller datasets.

!!! tip
    The [`index`](index-command.md) command allows you to manage indexes independently of the import operation, giving you
    greater control over index handling.

### Computing extents

By default, citydb-tool reads feature bounding boxes from the input file and stores them in the `envelope` column of the
[`FEATURE`](../3dcitydb/feature-module.md#feature-table) table. A correct envelope is essential for spatial queries.
With the `--compute-extent` option, citydb-tool computes envelopes instead of using those from the input file. The
computation considers the geometries of each feature and its subfeatures across all LoDs.

!!! tip
    You can also recompute envelopes after import using database functions in the 3DCityDB `v5`, as explained [here](../3dcitydb/db-functions.md#envelope-functions).

### Transforming geometries

The `--transform` option applies an affine transformation to input geometries using a 3x4 transformation matrix
before they are imported into the database. The matrix operates on homogeneous coordinates to compute the transformed
coordinates $(x', y', z')$:

$$
\begin{pmatrix}
x' \\ y' \\ z'
\end{pmatrix}
=
\begin{pmatrix}
m_0 & m_1 & m_2 & m_3 \\ m_4 & m_5 & m_6 & m_7 \\ m_8 & m_9 & m_{10} & m_{11}
\end{pmatrix}
\cdot
\begin{pmatrix}
x \\ y \\ z \\ 1
\end{pmatrix}
$$

The `--transform` option expects a comma-separated list of 12 matrix coefficients in row-major order, from $m_0$
to $m_{11}$:

```shell
--transform=m0,m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11
```

A common use case is swapping the $x$ and $y$ coordinates while keeping $z$ unchanged. You can use `swap_xy` as
shorthand for this transformation, as shown below.

=== "Linux"

    ```bash
    ./citydb import citygml [...] my-city.gml \
        --transform=swap_xy
    ```

=== "Windows CMD"

    ```bat
    citydb import citygml [...] my-city.gml ^
        --transform=swap_xy
    ```

!!! note
    Ensure that the transformed coordinates remain consistent with the CRS defined for your 3DCityDB instance.

### Defining import metadata

The options `--creationDate`, `--lineage`, `--updating-person`, and `--reason-for-update` allow you to capture metadata
about the feature's creation time, origin, the person responsible for the import, and the reason for the import.

By default, the creation date is taken from the corresponding CityGML attribute in the input file. If the input feature
lacks a creation date, the current import time is used. With the `--creation-date` option, you can set a specific
timestamp (e.g., `2023-01-01`) or use `now` to apply the current import time, overriding any value from the input file.

!!! warning
    The creation and termination dates together define a feature's lifespan in the database (see
    [here](../3dcitydb/feature-module.md#feature-table)). Be especially careful when overwriting the `creationDate`,
    for example when importing data that may include terminated features (e.g., exports from another database). Make
    sure the `creationDate` is not later than the feature's `terminationDate`, as this would create an invalid
    lifecycle interval.

The metadata about lineage, updating person and reason for update is specific to 3DCityDB and is not
part of the CityGML standard (see also [here](../3dcitydb/feature-module.md#feature-table)). If not provided, the
username used to establish the 3DCityDB database connection will be used as the default for `--updating-person`.

The `--lineage` option supports the following placeholders, which are automatically replaced during the import process.

| <div style="width:150px;">Token</div> | Description                                                                     |
|---------------------------------------|---------------------------------------------------------------------------------|
| `@file_path@`                         | Absolute path to the input file.                                                |
| `@file_name@`                         | Name of the input file.                                                         |
| `@content_path@`                      | Full logical path to the imported content, including ZIP entries if applicable. |
| `@content_name@`                      | Name of the imported content, e.g., the file name or the name of the ZIP entry. |

The `file_*` and `content_*` placeholders produce identical results for **regular files**. For **ZIP archives**,
the `file_*` placeholders refer to the ZIP file itself, while the `content_*` placeholders refer to the specific file
inside the archive.

=== "Regular files"

    Example input file: `/path/to/my/city.gml`

    ```text
    @file_path@     → /path/to/my/city.gml
    @file_name@     → city.gml
    @content_path@  → /path/to/my/city.gml
    @content_name@  → city.gml
    ```

=== "ZIP archives"

    Example input ZIP archive: `/path/to/my/city-archive.zip` with entry `buildings.gml`

    ```text
    @file_path@     → /path/to/my/city-archive.zip
    @file_name@     → city-archive.zip
    @content_path@  → /path/to/my/city-archive.zip/buildings.gml
    @content_name@  → buildings.gml
    ```

!!! note
    The placeholders are case-insensitive and can be combined freely in the lineage string.

### Controlling the import process

The `import` command offers the following options to control the import process:

- `--fail-fast`: Terminates the process immediately upon encountering an error. By default, the import continues despite
  errors with individual features.
- `--temp-dir`: Specifies the directory for storing temporary files during import. For optimal performance, choose
  a fast storage medium not used for reading the input files.
- `--threads`: Sets the number of threads for parallel processing to improve performance. By default, it
  equals the number of processors available to the JVM, or at least two.

!!! note
    Setting the number of threads too high can lead to performance issues due to thrashing. Additionally, each thread
    requires a separate database connection, so ensure your database can handle the required number of connections.