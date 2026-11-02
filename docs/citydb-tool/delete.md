---
title: Delete command
description: Deleting features from 3DCityDB
tags:
  - citydb-tool
  - delete
---

The `delete` command removes or terminates features in the 3DCityDB `v5`. It is built on top of the corresponding
[database functions](../3dcitydb/db-functions.md#delete-functions) to perform these operations.

!!! tip
    Be cautious when using the `delete` command, as it starts the delete process immediately. There is no 'Are you sure?'
    prompt. You can first run the command in [preview mode](#previewing-the-deletion), which leaves the database unchanged.

## Synopsis

```bash
citydb delete [OPTIONS]
```

## Options

The `delete` command inherits global options from the main [`citydb`](cli.md) command. Additionally, it defines general
delete, query and filter, and metadata options.

### Global options

--8<-- "docs/citydb-tool/includes/global-options.md"

For more details on the global options and usage hints, see [here](cli.md#options).

### Delete options

| Option                       | Description                                                                                              | Default value |
|------------------------------|----------------------------------------------------------------------------------------------------------|---------------|
| `--temp-dir=<dir>`           | Store temporary files in this directory.                                                                 |               |
| `-m`, `--delete-mode=<mode>` | Delete mode: `delete`, `terminate`.                                                                      | `terminate`   |
| `--index-mode=<mode>`        | Index mode: keep, drop, drop_create. Consider dropping indexes when processing large quantities of data. | `keep`        |
| `--preview`                  | Run in preview mode. Features will not be deleted.                                                       |               |
| `-c`, `--commit=<number>`    | Commit changes after deleting this number of features.                                                   |               |

### Metadata options for termination operation

| Option                         | Description                                                                                                             | Default value |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------|---------------|
| `--termination-date=<time>`    | Time in `<YYYY-MM-DD>` or <code>&lt;YYYY-MM-DDThh&#58;mm:ss[(+&#124;-)hh:mm]></code> format to use as termination date. | `now`         |
| `--lineage=<lineage>`          | Lineage to use for the features.                                                                                        |               |
| `--updating-person=<name>`     | Name of the user responsible for the delete.                                                                            | database user |
| `--reason-for-update=<reason>` | Reason for deleting the data.                                                                                           |               |

### Query and filter options

| Option                                                                                 | Description                                                                                         | Default value |
|----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|---------------|
| `-t`, <code>--type-name=<[prefix:]name><br/>[,<[prefix:]name>...]</code>               | Names of the features to process.                                                                   |               |
| `-f`, `--filter=<cql2-text>`                                                           | Filter to apply when retrieving features. Use the extended CQL2 filtering language of the 3DCityDB. |               |
| `--filter-crs=<crs>`                                                                   | SRID or identifier of the CRS to use for geometries in the filter expression.                       | 3DCityDB CRS  |
| `--sql-filter=<sql>`                                                                   | SQL query expression to use as filter.                                                              |               |
| `--limit=<count>`                                                                      | Maximum number of features to process.                                                              |               |
| `--start-index=<index>`                                                                | Index within the input set from which features are processed.                                       |               |

### Time-based feature history options

--8<-- "docs/citydb-tool/includes/export-history-options.md"

### Database connection options

--8<-- "docs/citydb-tool/includes/db-options.md"

For more details on the database connection options and usage hints, see [here](database.md#using-command-line-options).

## Usage

### Delete mode

The delete mode, defined by the `--delete-mode` option, determines how features are deleted in the database. The
available modes are:

- `delete`: Features are physically removed from the database, helping keep it streamlined and focused on the most
  recent versions of features.
- `terminate`: Features are not physically removed but are marked as terminated by setting their `termination_date`
  property to the timestamp of the operation, which allows retaining the feature history. This is the default mode.

Both modes process a feature along with its "contained" subfeatures, which are considered part of the feature. A
subfeature that is still contained by another feature is kept (in `terminate` mode, by another active feature). In
`terminate` mode, subfeatures that are already terminated keep their termination date.

!!! note
    - The `delete` command operates on non-terminated features unless specified otherwise. See
      [below](#deleting-historical-versions) for instructions on how to delete historical versions.
    - Terminated features cannot be terminated again; they can only be physically removed.
    - Unlike "contained" subfeatures, "related" subfeatures are not deleted. For the distinction between the two,
      refer to [this section](../3dcitydb/feature-module.md#relationships).

### Committing the deletion

By default, the delete operation is committed only after it completes successfully. If an error occurs or the operation
is aborted, no features are deleted, leaving the database unchanged.

Alternatively, you can use the `--commit` option to specify the number of features after which the delete operation is
committed. This breaks the operation into smaller batches, with each batch being committed individually. In this case,
the all-or-nothing strategy applies to each batch rather than the entire operation.

!!! tip
    In rare situations, deleting a very large quantity of features with a single delete operation may require more SQL
    commands than the database allows per transaction. The `--commit` option helps prevent such large deletes from
    failing. For PostgreSQL, the maximum allowed number of SQL commands per transaction is 2<sup>32</sup>.

### Previewing the deletion

The `--preview` option runs the deletion in preview mode. The `delete` command is processed as if the deletion were taking
place, but no changes are made to the database. This mode helps identify potential issues, such as conflicts or errors,
before they affect the database, ensuring the actual delete operation proceeds as expected.

### Filtering features to delete

The `delete` command offers several filtering options to control which features are deleted from the 3DCityDB `v5` instance.

#### Feature type filter

The `--type-name` option specifies one or more feature types to delete. For each feature type, provide its type name as
defined in the [`OBJECTCLASS`](../3dcitydb/metadata-module.md#objectclass-table) table of the 3DCityDB `v5`. To avoid
ambiguity, you can use the namespace alias from the [`NAMESPACE`](../3dcitydb/metadata-module.md#namespace-table) table
as a prefix in the format `prefix:name`. Only features matching the specified type will be deleted.

#### CQL2-based filtering

citydb-tool supports the [OGC Common Query Language (CQL2)](https://www.ogc.org/publications/standard/cql2/){target="blank"} as the
default language for filtering features from the 3DCityDB `v5`. CQL2 enables both attribute-based and spatial
filtering, offering advanced comparison operators, spatial functions, and logical operators. Only features that meet
the specified filter criteria will be deleted.

CQL2 filter expressions are passed to the `delete` command using the `--filter` option. Be sure to enclose them in
quotes if needed. When applying spatial filters, the filter geometries are assumed to be in the same CRS as the 3DCityDB
instance. To specify a different CRS, use the `--filter-crs` option and provide the SRID (e.g., `4326` for WGS84).

!!! tip
    For more details on using CQL2 with the 3DCityDB `v5`, refer to the [CQL2 documentation](cql2.md).

The example below demonstrates how to delete buildings based on their `height` property.

=== "Linux"

    ```bash
    ./citydb delete [...] \
        --type-name=bldg:Building \
        --filter="con:height > 15"
    ```

=== "Windows CMD"

    ```bat
    citydb delete [...] ^
        --type-name=bldg:Building ^
        --filter="con:height > 15"
    ```

To apply a bounding box filter to the `envelope` property of features, you can use the following CQL2 filter expression.

=== "Linux"

    ```bash
    ./citydb delete [...] \
        --filter="s_intersects(core:envelope, bbox(13.369,52.506,13.405,52.520))" \
        --filter-crs=4326
    ```

=== "Windows CMD"

    ```bat
    citydb delete [...] ^
        --filter="s_intersects(core:envelope, bbox(13.369,52.506,13.405,52.520))" ^
        --filter-crs=4326
    ```

#### SQL-based filtering

The `--sql-filter` option allows the use of SQL `SELECT` statements as a filter expressions, providing access to all
details of the [relational schema](../3dcitydb/relational-schema.md). Any `SELECT` statement supported by the underlying
database system is permitted, as long as it returns only a list of `id` values from
the [FEATURE](../3dcitydb/feature-module.md#feature-table) table. Only features included in the returned list will be
considered for deletion.

Below is a simple example of filtering features based on their identifier in the `objectid` column of the `FEATURE`
table. The `SELECT` statement must be enclosed in quotes, and special characters may need to be escaped.

=== "Linux"

    ```bash
    ./citydb delete [...] \
        --sql-filter="SELECT id FROM feature WHERE objectid IN ('ABC', 'DEF')"
    ```

=== "Windows CMD"

    ```bat
    citydb delete [...] ^
        --sql-filter="SELECT id FROM feature WHERE objectid IN ('ABC', 'DEF')"
    ```

#### Count filter

The `--limit` option sets the maximum number of features to delete. The `--start-index` option defines the `0`-based
index of the first feature to delete. These options can be used separately or together to control the total number of
features deleted.

!!! note
    - When using multiple filters, all conditions must be satisfied for a feature to be deleted.
    - [Configuration](cli.md#configuration-files) and [argument](cli.md#argument-files) files are an excellent way
      to store complex filter expressions and easily reuse them.

### Deleting historical versions

The bi-temporal intervals `[creation_date, termination_date)` and `[valid_from, valid_to)` enable
feature histories in the 3DCityDB `v5` (see [here](../3dcitydb/feature-module.md#feature-table)). The first interval
defines the feature's lifespan in the database, indicating when it was inserted and terminated, while the second
interval represents the feature’s real-world lifespan.

A feature's validity depends on whether its time interval is bounded or unbounded:

- **Unbounded (no end point):** The feature is currently valid.
- **Bounded:** The feature was valid during the specified interval but is no longer valid.

The `--validity` option controls which features are deleted based on their validity:

- `valid`: Deletes only features that are currently valid. This is the default mode.
- `invalid`: Deletes only historical features that are no longer valid.
- `all`: Deletes all features, regardless of their validity.

The `--validity-reference` option specifies whether validity is determined based on database time (`database`,
default) or real-world time (`real_world`).

Additionally, the `--validity-at` option allows you to check the validity of features at a specific point in time in the
past. You can provide this time as either a date (`<YYYY-MM-DD>`) or a date-time with an optional UTC offset
(`<YYYY-MM-DDThh:mm:ss[(+|-)hh:mm]>`). Only features that were either `valid` or `invalid` at the specified time will be
deleted.

The example below demonstrates how to physically remove all features that were terminated before 2018-07-01, and are
thus `invalid` at that date:

=== "Linux"

    ```bash
    ./citydb delete [...] \
        --mode=delete \
        --validity=invalid \
        --validity-at=2018-07-01 \
        --validity-referene=database
    ```

=== "Windows CMD"

    ```bat
    citydb delete [...] ^
        --mode=delete ^
        --validity=invalid ^
        --validity-at=2018-07-01 ^
        --validity-referene=database
    ```

!!! note
    Validity checks are strict by default. Use `--lenient-validity` to treat time intervals as valid, even if their start
    point is undefined.

### Managing indexes during deletion

When deleting data, database indexes are updated in real time, which can slow down the delete process, especially
with large databases. The `--index-mode` option offers the following modes for handling indexes during the delete
operation:

- `keep`: The indexes remain unchanged. This is the default mode.
- `drop`: The indexes are removed before the delete operation starts, improving delete performance.
- `drop_create`: Similar to `drop`, but the indexes are re-created after the deletion completes, ensuring they are
  available for subsequent queries.

!!! note
    Dropping and re-creating indexes can also take a significant amount of time, depending on the size of the database. This
    mode is beneficial when deleting large amounts of features. However, as the database grows, the overhead of dropping and
    re-creating indexes may outweigh the benefits, especially when deleting smaller sets of features.

!!! tip
    The [`index`](index-command.md) command allows you to manage indexes independently of the delete operation, giving you
    greater control over index handling.

### Defining termination metadata

When running in `terminate` mode, the metadata of the affected features in the database can be updated to track
information about the termination process.

The options `--lineage`, `--updating-person`, and `--reason-for-update` can be used to specify the feature’s origin, the
person responsible for the termination, and the reason for the termination. The termination timestamp can be set to a
specific point in time using `--termination-date`, provided as either a date (`<YYYY-MM-DD>`) or a date-time with an
optional UTC offset (`<YYYY-MM-DDThh:mm:ss[(+|-)hh:mm]>`).

This metadata is specific to 3DCityDB and is not
part of the CityGML standard (see also [here](../3dcitydb/feature-module.md#feature-table)). If not provided, the
termination timestamp is set to the time of the operation, and the username used to establish the 3DCityDB database
connection will be used as the default value for `--updating-person`.

!!! note
    The termination timestamp specified with `--termination-date` will apply to all features. Be careful when selecting a
    timestamp, as the [feature's validity in the database](#deleting-historical-versions) is determined by the time
    interval `[creation_date, termination_date)`. To maintain a valid feature history, these intervals
    should not overlap for the same real-world feature instance.