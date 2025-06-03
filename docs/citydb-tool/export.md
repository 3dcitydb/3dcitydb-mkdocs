---
title: Export command
description: Overview of the export command
tags:
  - citydb-tool
  - export
---

# Export command

The `export` command exports city model data from the 3DCityDB `v5` in a supported format. Each format has a dedicated
[subcommand](#commands) with format-specific options.

## Synopsis

```bash
citydb export [OPTIONS] COMMAND
```

## Options

The `export` command inherits global options from the main [`citydb`](cli.md) command. Additionally, it defines general
export, query and filter, and tiling options, which apply to all of its [subcommands](#commands).

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### General export options

--8<-- "docs/citydb-tool/includes/export-general-options.md"

### Query and filter options

--8<-- "docs/citydb-tool/includes/export-filter-options.md"

### Time-based feature history options

--8<-- "docs/citydb-tool/includes/export-history-options.md"

### Tiling options

--8<-- "docs/citydb-tool/includes/export-tiling-options.md"

## Commands

| Command                                     | Description                                                                                |
|---------------------------------------------|--------------------------------------------------------------------------------------------|
| [`help`](cli.md#help-and-cli-documentation) | [Display help information about the specified command.](cli.md#help-and-cli-documentation) |
| [`citygml`](export-citygml.md)              | [Export data in CityGML format.](export-citygml.md)                                        |
| [`cityjson`](export-cityjson.md)            | [Export data in CityJSON format.](export-cityjson.md)                                      |

!!! note
    Additional subcommands to support more formats may be added in future versions. You can also implement your own
    [plugin](cli.md#plugins) to add support for a specific format. Contributions are welcome.

## Usage

### Specifying the output file

The output file for the export is specified using the `--output` option. Ensure the file extension matches the target
format. The export command also supports GZIP compression and ZIP archiving. To enable these, use the
corresponding file extensions listed below:

| File type            | File extensions          |
|----------------------|--------------------------|
| Regular file         | depends on target format |
| GZIP compressed file | `.gz`, `.gzip`           |
| ZIP archive          | `.zip`                   |

Use the `--output-encoding` option to specify a particular encoding for the output file by providing the IANA-based
encoding name (e.g., `UTF-8`).

If the export includes texture files, a subfolder named `appearance` will be created relative to the output file, where
all textures will be stored. Likewise, a subfolder named `library-objects` will be created to store library objects
used by implicit geometries. When exporting as a ZIP archive, these folders are included within the archive.

### Querying and filtering

citydb-tool allows exporting all features stored in a 3DCityDB `v5` instance into a single file. However, in most
cases, only a specific subset of features is needed. The `export` command provides various querying and filtering
options to control which features are included in the export.

#### Feature type filter

The `--type-name` option specifies one or more feature types to export. For each feature type, provide its type name as
defined in the [`OBJECTCLASS`](../3dcitydb/metadata-module.md#objectclass-table) table of the 3DCityDB `v5`. To avoid
ambiguity, you can use the namespace alias from the [`NAMESPACE`](../3dcitydb/metadata-module.md#namespace-table) table
as a prefix in the format `prefix:name`. Only features matching the specified type will be exported.

#### CQL2-based filtering

citydb-tool supports the [OGC Common Query Language (CQL2)](https://www.ogc.org/publications/standard/cql2/){target="blank"} as the
default language for filtering features from the 3DCityDB `v5`. CQL2 enables both attribute-based and spatial
filtering, offering advanced comparison operators, spatial functions, and logical operators. Only features that meet
the specified filter criteria will be exported.

CQL2 filter expressions are passed to the `export` command using the `--filter` option. Be sure to enclose them in
quotes if needed. When applying spatial filters, the filter geometries are assumed to be in the same CRS as the 3DCityDB
instance. To specify a different CRS, use the `--filter-crs` option and provide the SRID (e.g., `4326` for WGS84).

!!! tip
    For more details on using CQL2 with the 3DCityDB `v5`, refer to the [CQL2 documentation](cql2.md).

The example below demonstrates how to export buildings based on their `height` property.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o my-city.gml \
        --type-name=bldg:Building \
        --filter="con:height > 15"
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --type-name=bldg:Building ^
        --filter="con:height > 15"
    ```

To apply a bounding box filter to the `envelope` property of features, you can use the following CQL2 filter expression.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o my-city.gml \
        --filter="s_intersects(core:envelope, bbox(13.369,52.506,13.405,52.520))" \
        --filter-crs=4326
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --filter="s_intersects(core:envelope, bbox(13.369,52.506,13.405,52.520))" ^
        --filter-crs=4326
    ```

#### SQL-based filtering

The `--sql-filter` option allows the use of SQL `SELECT` statements as filter expressions, providing access to all
details of the [relational schema](../3dcitydb/relational-schema.md). Any `SELECT` statement supported by the underlying
database system is permitted, as long as it returns only a list of `id` values from
the [FEATURE](../3dcitydb/feature-module.md#feature-table) table. Only features included in the returned list will be
considered for export.

Below is a simple example of filtering features based on their identifier in the `objectid` column of the `FEATURE`
table. The `SELECT` statement must be enclosed in quotes, and special characters may need to be escaped.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o my-city.gml \
        --sql-filter="SELECT id FROM feature WHERE objectid IN ('ABC', 'DEF')"
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --sql-filter="SELECT id FROM feature WHERE objectid IN ('ABC', 'DEF')"
    ```

#### Count filter

The `--limit` option sets the maximum number of features to export. The `--start-index` option
defines the `0`-based index of the first feature within the result set to export. These options can be used
separately or together to control the total number of features exported.

#### LoD filter

The `export` command allows filtering geometries by Level-of-Detail (LoD) using the `--lod` option. You can specify
one or more LoD values as a comma-separated list. LoD values typically range from `[0..3]` or `[0..4]`,
depending on the CityGML version, but any string value is allowed.

- If a single LoD is provided, only geometries with that LoD will be included in the export. Features without a
  spatial representation for the requested LoD are not exported.
- If multiple LoDs are specified, only geometries with a matching LoD are retained, and the filtering behavior
  is controlled by the `--lod-mode` option:
    - `or`: Features with at least one matching LoD are exported. This is the default mode.
    - `and`: Only features with a spatial representation in all requested LoDs are exported.
    - `minimum`: Similar to `or`, but only the geometry with the lowest LoD is exported.
    - `maximum`: Similar to `or`, but only the geometry with the highest LoD is exported.

!!! tip
    The `--lod-search-depth` option defines the number of subfeature levels to search for a matching LoD. With the default
    value `0`, only the feature and its space boundaries are considered. The LoD filter is satisfied if at least one
    subfeature has a matching LoD representation.

The following command exports features represented in LoD2 or LoD3, retaining only their highest LoD.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o my-city.gml \
        --lod=2,3 \
        --lod-mode=maximum
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --lod=2,3 ^
        --lod-mode=maximum
    ```

#### Appearance filter

The `--appearance-theme` option filters appearances based on their `<theme>`. You can specify
one or more themes as a comma-separated list. To filter appearances that have no theme property, use `none` as the value.
Only appearances associated with the specified themes will be exported. To exclude all appearances from the export,
use the `--no-appearances` option.

#### Sorting features by property

Along with filtering, the query options of the `export` command also allow sorting features by one or more properties,
which can be specified using the `--sort-by` option. Sorting by subfeature attributes is supported as well, by referencing
the attribute with the same JSON path notation used in CQL2 expressions (see [here](cql2.md)). Appending a `+` or `-` sign
to the property name defines the sort order: `+` for ascending (default), and `-` for descending.

The example below exports buildings, sorting them first by `height` in ascending order, and then by `objectId` in
descending order.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o my-city.gml \
        --type-name=bldg:Building \
        --sort-by=con:height,core:objectId-
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --type-name=bldg:Building ^
        --sort-by=con:height,core:objectId-
    ```

!!! note
    - When using multiple filters, all conditions must be satisfied for a feature to be exported.
    - [Configuration](cli.md#configuration-files) and [argument](cli.md#argument-files) files are an excellent way
      to store complex filter expressions and easily reuse them.
    - When the `trace` log level is enabled, the final SQL `SELECT` statement generated from your query and filter options,
      which is used to query the 3DCityDB, will be printed to the console.

### Exporting historical versions

The bi-temporal intervals `[creation_date, termination_date)` and `[valid_from, valid_to)` enable
feature histories in the 3DCityDB `v5` (see [here](../3dcitydb/feature-module.md#feature-table)). The first interval
defines the feature's lifespan in the database, indicating when it was inserted and terminated, while the second
interval represents the feature’s real-world lifespan.

A feature's validity depends on whether its time interval is bounded or unbounded:

- **Unbounded (no end point):** The feature is currently valid.
- **Bounded:** The feature was valid during the specified interval but is no longer valid.

The `--validity` option controls which features are exported based on their validity:

- `valid`: Exports only features that are currently valid. This is the default mode.
- `invalid`: Exports only historical features that are no longer valid.
- `all`: Exports all features, regardless of their validity.

The `--validity-reference` option specifies whether validity is determined based on database time (`database`,
default) or real-world time (`real_world`).

Additionally, the `--validity-at` option allows you to check the validity of features at a specific point in time in the
past. You can provide this time as either a date (`<YYYY-MM-DD>`) or a date-time with an optional UTC offset
(`<YYYY-MM-DDThh:mm:ss[(+|-)hh:mm]>`). Only features that were either `valid` or `invalid` at the specified time will be
exported.

The example below demonstrates how to export a historical version of your city model that was valid on 2018-07-01:

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o my-city.gml \
        --validity=valid \
        --validity-at=2018-07-01 \
        --validity-referene=database
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --validity=valid ^
        --validity-at=2018-07-01 ^
        --validity-referene=database
    ```

!!! note
    - Exporting historical versions requires that these versions remain in the database.
    - **Database time is managed automatically:** The `creation_date` is set during import, while the `termination_date` is
      assigned when terminating features using the [`delete`](delete.md) command.
    - Validity checks are strict by default. Use `--lenient-validity` to treat time intervals as valid, even if their start
      point is undefined.

### Reprojecting geometries

The `export` command allows geometries to be reprojected to a different Coordinate Reference System (CRS) during
export. This is useful when the 3DCityDB `v5` instance is in one CRS, but the exported data needs to be in another.
The reprojection is carried out using spatial functions of the underlying database system.

To specify a different CRS for the export, use the `--crs` option followed by either the database SRID of the target CRS
or its identifier. citydb-tool supports both OGC-compliant names, such as `http://www.opengis.net/def/crs/EPSG/0/4326`,
and simpler formats like `EPSG:4326`. 

Using the `--crs-name` option, you can specify the name or identifier of the target CRS to be included in the output
file, for example, as the value of the `srsName` attribute in CityGML files.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o my-city.gml \
        --crs=25833 \
        --crs-name=urn:ogc:def:crs,crs:EPSG::25833,crs:EPSG::7837
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --crs=25833 ^
        --crs-name=urn:ogc:def:crs,crs:EPSG::25833,crs:EPSG::7837
    ```

### Transforming geometries

The `--transform` option applies an affine transformation to geometries using a 3x4 transformation matrix
before they are exported to the output file. The matrix operates on homogeneous coordinates to compute the transformed
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
    ./citydb export citygml [...] -o my-city.gml \
        --transform=swap_xy
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o my-city.gml ^
        --transform=swap_xy
    ```

!!! note
    Ensure that the transformed coordinates remain consistent with the CRS used for the export.

### Tiled exports

Instead of exporting city model data from the 3DCityDB `v5` into a single, potentially large dataset, citydb-tool supports
exporting into multiple files or tiles based on regular spatial grids. Breaking large exports into smaller chunks makes
the data easier to process, transfer, and visualize.

#### Defining the tiling extent

To perform tiled exports, you must specify the tiling extent, which can be defined in two ways:

- **Auto-computed**: The extent is automatically calculated  as the bounding box encompassing the features to be
  exported. This is the default method.
- **Manually defined**: Use the `--tile-extent` option to specify a 2D bounding box with four coordinates for the
  lower-left and upper-right corners. By default, the coordinates are assumed to be in the same CRS as the 3DCityDB
  instance, but you can specify a database SRID (e.g., 4326 for WGS84) as a fifth value. All values should be separated
  by commas.

#### Defining the tile grid

The tiling extent is divided into a grid using one of two schemes:

- `--tile-matrix`: Specifies the number of `columns` and `rows` in the grid, evenly dividing the extent into tiles.
  A higher grid count results in smaller tiles.
- `--tile-dimension`: Defines a fixed `width` and `height` for each tile. Tiles are aligned with the database CRS grid
  and chosen to fully cover the extent, which may cause them to exceed it. You can specify units separately for `width`
  and `height`; if omitted, the database CRS unit is used.

Each tile is identified by its column and row indexes, with the column index increasing horizontally. By default, the
origin `(0,0)` is in the top-left corner, but you can change it to the bottom-left corner using the `--tile-origin`
option.

!!! note
    citydb-tool ensures that each feature is assigned to only one tile. If a feature cannot be assigned to a tile when
    the tiling extent is manually defined, it will be excluded from the export.

#### Organizing tiled exports

When exporting tiled data, you can use placeholders in the output path and filename to structure and organize the
exported files efficiently. The following tile-specific tokens are available:

| Token      | Description                                                |
|------------|------------------------------------------------------------|
| `@column@` | Column index of the tile.                                  |
| `@row@`    | Row index of the tile.                                     |
| `@x_min@`  | X-coordinate of the lower-left corner of the tile extent.  |
| `@y_min@`  | Y-coordinate of the lower-left corner of the tile extent.  |
| `@x_max@`  | X-coordinate of the upper-right corner of the tile extent. |
| `@y_max@`  | Y-coordinate of the upper-right corner of the tile extent. |

For example, setting the [output file](#specifying-the-output-file) as follows:

```shell
--output=tiles/@column@/tile_@row@.gml
```

Will generate files like:

```shell
tiles/0/tile_0.gml
tiles/0/tile_1.gml
tiles/1/tile_0.gml
...
```

!!! note
    - If you do not include tokens in your output file, citydb-tool will automatically append the suffix
    `_@column@_@row@` to your filename.
    - Ensure that your token-based pattern does not result in file overwrites.

#### Formatting tokens

In addition, you can define a format string for each token to control the formatting of values, such as limiting the
number of decimal places for the tile extent coordinates. To specify a format string, include it after the token name,
separated by a comma. For example, `@x_min,%.2f@` will format the `x_min` value with two decimal places.

The format string syntax follows [Java language conventions](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Formatter.html#syntax){target="blank"}.
Some common examples include:

- `%s`: Formats the value as a string (default format).
- `%d`: Formats the value as a decimal integer.
- `%f`: Formats the value as a decimal number.
- `%.2f`: Formats the value as a decimal number with two decimal places.
- `%4.4s`: Formats the value as a string, but only prints exactly four characters.

#### Tiled export example

The following command exports all roads from the 3DCityDB, organizing them into 2x2 km tiles. The tiling extent is
auto-computed. Tiles align with the database CRS grid and are chosen to cover the tiling extent. 
Tokens with formatting are used in the output path to control the output structure.

=== "Linux"

    ```bash
    ./citydb export citygml [...] -o tiles/tile_@x_min,%3.3s@_@y_min,%4.4s@.gml \
        --type-name=tran:Road \
        --tile-dimension=2km,2km
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] -o tiles\tile_@x_min,%3.3s@_@y_min,%4.4s@.gml ^
        --type-name=tran:Road ^
        --tile-dimension=2km,2km
    ```

In this example, the length unit `km` is explicitly provided. If omitted, the default unit of the database CRS
is used. For example, if the CRS uses meters, a 2x2 km tiling should be defined as follows:

```
--tile-dimension=2000,2000
```

!!! tip
    If unexpected tile sizes appear, check the unit of your database CRS to ensure it matches the intended scale.

### Controlling the export process

The `export` command offers the following options to control the export process:

- `--fail-fast`: Terminates the process immediately upon encountering an error. By default, the export continues despite
  errors with individual features.
- `--temp-dir`: Specifies the directory for storing temporary files during export. For optimal performance, choose
  a fast storage medium not used for writing the output files.
- `--threads`: Sets the number of threads for parallel processing to improve performance. By default, it
  equals the number of processors available to the JVM, or at least two.

!!! note
    Setting the number of threads too high can lead to performance issues due to thrashing. Additionally, each thread
    requires a separate database connection, so ensure your database can handle the required number of connections.