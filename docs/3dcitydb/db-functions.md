---
title: Database functions
description: Database functions installed with 3DCityDB
tags:
  - 3dcitydb
  - database functions
---

The 3DCityDB `v5` includes a set of database-side functions that are automatically installed during setup. These functions
perform and expose various database operations, such as deleting or terminating city objects, computing their envelopes,
and managing the Coordinate Reference System (CRS) of the 3DCityDB instance. Additionally, they include utility and
helper functions. The functions can be used to automate processes and workflows or be integrated into third-party
tools for task automation.

!!! tip
    For PostgreSQL, the functions are written in `PL/pgSQL` and reside in a dedicated `citydb_pkg` schema. Since
    `citydb_pkg` is automatically added to the database `search_path` during setup, they can be called without explicitly
    specifying the schema as a prefix.

## Delete functions

The delete functions enable the removal of single or multiple city objects while automatically managing integrity
constraints between database tables. They serve as low-level APIs, providing dedicated delete functions for various
tables — from individual geometries in the [`GEOMETRY_DATA`](geometry-module.md#geometry_data-table) table
(`delete_geometry_data` function) to entire features in the [`FEATURE`](feature-module.md#feature-table)
table, alongside their properties, geometries, and appearances (`delete_feature` function). These functions enable
users to develop more complex delete operations without reimplementing their core functionality.

The available delete functions are listed below.

| Function                                                                                                              | Return type                    | Description                                                                       |
|-----------------------------------------------------------------------------------------------------------------------|--------------------------------|-----------------------------------------------------------------------------------|
| **`cleanup_schema`** <br/>`(schema_name TEXT) `                                                                       | `void`                         | Truncates all data tables                                                         |
| **`delete_feature`**<br/>`(pid bigint, schema_name TEXT)` or <br/> `(pid_array bigint[], schema_name TEXT)`           | `BIGINT` or<br/>`SETOF BIGINT` | Deletes entries from `FEATURE` table<br/>based on an `id` or `id` array           |
| **`delete_property`**<br/>`(pid bigint, schema_name TEXT)` or <br/> `(pid_array bigint[], schema_name TEXT)`          | `BIGINT` or<br/>`SETOF BIGINT` | Deletes entries from `PROPERTY` table<br/>based on an `id` or `id` array          |
| **`delete_geometry_data`**<br/>`(pid bigint, schema_name TEXT)` or <br/> `(pid_array bigint[], schema_name TEXT)`     | `BIGINT` or<br/>`SETOF BIGINT` | Deletes entries from `GEOMETRY_DATA` table<br/>based on an `id` or `id` array     |
| **`delete_implicit_geometry`**<br/>`(pid bigint, schema_name TEXT)` or <br/> `(pid_array bigint[], schema_name TEXT)` | `BIGINT` or<br/>`SETOF BIGINT` | Deletes entries from `IMPLICIT_GEOMETRY` table<br/>based on an `id` or `id` array |
| **`delete_appearance`**<br/>`(pid bigint, schema_name TEXT)` or <br/> `(pid_array bigint[], schema_name TEXT)`        | `BIGINT` or<br/>`SETOF BIGINT` | Deletes entries from `APPEARANCE` table<br/>based on an `id` or `id` array        |
| **`delete_surface_data`**<br/>`(pid bigint, schema_name TEXT)` or <br/> `(pid_array bigint[], schema_name TEXT)`      | `BIGINT` or<br/>`SETOF BIGINT` | Deletes entries from `SURFACE_DATA` table<br/>based on an `id` or `id` array      |
| **`delete_tex_image`**<br/>`(pid bigint, schema_name TEXT)` or <br/> `(pid_array bigint[], schema_name TEXT)`         | `BIGINT` or<br/>`SETOF BIGINT` | Deletes entries from `TEX_IMAGE` table<br/>based on an `id` or `id` array         |
| **`delete_address`  **<br/>`(pid bigint, schema_name TEXT)` or <br/> `(pid_array bigint[], schema_name TEXT)`         | `BIGINT` or<br/>`SETOF BIGINT` | Deletes entries from `ADDRESS` table<br/>based on an id or id array               |                                                                      |

The delete functions are provided in two forms:

- **Deletion of single entries:** One variant accepts the primary key `id` of a single entry to be deleted and returns the `id`
value if the deletion is successful. If `NULL` is returned, it indicates that the entry has either already been deleted or
an error occurred during the deletion process.

- **Deletion of multiple entries:** The other variant accepts an array of `id` values, returning the id values of the
successfully deleted entries as a `SETOF BIGINT`, allowing multiple entries to be deleted in a single operation.

All functions offer an optional `schema_name` parameter, allowing you to apply them to different database schemas within your
PostgreSQL database. The provided target schema must contain a 3DCityDB `v5` instance. If the `schema_name` is omitted,
the default schema `citydb` will be used.

The example below demonstrates how to easily delete features based on a query result:

```sql
-- delete a single feature by id
SELECT delete_feature(id) FROM feature WHERE ... ;

-- delete multiple features by passing an array of ids
SELECT delete_feature(array_agg(id)) FROM feature WHERE ... ;
```

The `id`-array based delete functions require fewer `DELETE` statements and may therefore be faster than deleting the same
number of entries by invoking the delete function for each individual `id`. However, this is not always the case and
depends on the ratio between the number of entries to be deleted and the total number of objects in the database. For
example, if the `id` array is very large and covers a significant portion of the table, it may be more efficient to use the
single-`id` version or delete entries in smaller batches.

The following example demonstrates how to create a custom function to delete all buildings from the 3DCityDB
using the single-`id` version of `delete_feature`:

```sql
-- example procedure for deleting all building features
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT * FROM feature where objectclass_id = 901 LOOP
    -- call the delete_feature function for each id
    PERFORM delete_feature(rec.id);
  END LOOP;
END $$;
```

!!! note
    When deleting a feature, all its "contained" subfeatures, which are considered a part of the feature, are deleted as
    well. However, features that are only "related" but not considered a part of the feature are not deleted. The
    distinction between "contained" and "related" features is determined by evaluating the `val_relation_type` column of the
    `PROPERTY` table, as described [here](feature-module.md#relationships).

!!! tip
    The `cleanup_schema` function serves a specific purpose: it **truncates all database tables** with a single function call.
    This is the most convenient and fastest way to delete all content from your 3DCityDB `v5`. However, be cautious when using
    this function, as it cannot be rolled back.

## Terminate functions

The delete functions physically remove city objects from the 3DCityDB instance, helping keep the database streamlined
and focused on the most recent versions of features. However, in some cases, it may be preferable to retain the feature
history and avoid deleting outdated versions. For such use cases, the 3DCityDB provides additional terminate functions.
These functions do not physically delete features but instead mark them as terminated by setting their `terminate_date`
property to the timestamp of the operation. Alongside the `creation_date` timestamp, the lifespan of the feature in the
database can be tracked, allowing multiple historical versions of the same feature to be stored alongside its most
recent version.

| Function                                                                                                                                                                       | Return type                    | Description                                                               |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|---------------------------------------------------------------------------|
| **`terminate_feature`**<br/>`(pid bigint, schema_name TEXT, metadata JSON, cascade BOOLEAN)` or <br/> `(pid_array bigint[], schema_name TEXT, metadata JSON, cascade BOOLEAN)` | `BIGINT` or<br/>`SETOF BIGINT` | Terminates features in the `FEATURE` table based on an `id` or `id` array |

Since the `creation_date` and `termination_date` columns are exclusive to the [`FEATURE`](feature-module.md#feature-table)
table, only the `terminate_feature` function is available for terminating features. Like the delete functions, this
function accepts either a single `id` or an array of `id` values and returns the `id` values of successfully terminated
features, as described above.

The `FEATURE` table provides additional metadata columns for features, including `last_modification_date`, `lineage`,
`reason_for_update`, and `updating_person` (see [here](feature-module.md#feature-table) for more details).
The terminate functions allow you to update these values by passing a JSON object as `metadata` parameter,
where each property represents the column name and its corresponding value is the updated data. When omitting
single columns in the JSON object or the entire JSON object, the values currently stored in these columns remain
unchanged, with the only exception that `last_modification_date` will be set to the same timestamp as `termination_date`.

The last parameter, `cascade`, is used to specify whether "contained" subfeatures should also be terminated (default:
`true`). Terminating all subfeatures can take significantly longer than just terminating the feature itself, so it is
important to evaluate whether cascading termination is necessary based on your use cases and scenarios.

The following example demonstrates how to terminate a single feature based on its database `id`.

```sql
SELECT terminate_feature(
    2060316,
    '{
        "reason_for_update": "test reason",
        "updating_peron": "test person",
        "lineage": "test lineage"
    }'::json,
    FALSE
);
```
!!! note
    When terminating features, make sure the tools you are using correctly evaluate the `termination_date` timestamp. This is
    essential when exporting or processing features to ensure that the tools are working with the correct version of the
    feature. The [`citydb-tool`](../citydb-tool/index.md) included in 3DCityDB `v5` fully supports feature histories based on the
    `creation_date` and `termination_date` properties.

## Envelope functions

The `citydb_pkg` package offers functions for calculating the 3D bounding box of features and implicit geometries, as well
as additional utility functions to support these operations.

| Function                                                                                             | Return type | Description                                                |
|------------------------------------------------------------------------------------------------------|-------------|------------------------------------------------------------|
| **`get_feature_envelope`**<br/> `(fid BIGINT, set_envelope INTEGER, schema_name TEXT)`               | GEOMETRY    | Returns the envelope geometry of a given feature           |
| **`calc_implicit_geometry_envelope`** `(gid BIGINT, ref_pt GEOMETRY, matrix JSON, schema_name TEXT)` | GEOMETRY    | Returns the envelope geometry of a given implicit geometry |
| **`box2envelope`**<br/> `(box BOX3D, schema_name TEXT)`                                              | GEOMETRY    | Converts a box geometry to to envelope                     |
| **`update_bounds`**<br/> `(old_bbox GEOMETRY, new_bbox GEOMETRY, schema_name TEXT)`                  | GEOMETRY    | Returns the envelope geometry of two bounding boxes        |

The `get_feature_envelope` function computes and returns the envelope of a feature. The feature's primary key `id` must be
provided as input. The bounding volume is calculated by evaluating all the geometries of the feature and its "contained"
subfeatures across all LoDs, including implicit geometries. The returned geometry is the minimal 3D rectangle that
encloses the feature, and it can be directly used as the value for the `envelope` column of the `FEATURE` table.

The `get_feature_envelope` function offers two optional parameters: The `set_envelope` parameter specifies whether the
computed envelopes should be used to update the `envelope` columns of the feature and its subfeatures (`1` for true, `0` for
false; default: `0`). The `schema_name` parameter defines the target database schema to operate in, as explained above
(default: `citydb`).

The 3D bounding volume of implicit geometries can be calculated using the `calc_implicit_geometry_envelope` function. It
requires the following inputs: the primary key `id` of the template geometry from the `GEOMETRY_DATA` table, a PostGIS `POINT`
geometry specifying the real-world coordinates where the template should be placed (`ref_pt`), and a 3x4 row-major matrix (JSON
double array) defining the rotation, scaling, and translation for the template (`matrix`).

The reference point and transformation matrix follow the format used for storing them in the `PROPERTY` table
(see [here](feature-module.md#relationships)). Therefore, the values from the `PROPERTY` table can be
directly used as input parameters.

The `update_bounds` and `box2envelope` functions are utility functions used by the functions mentioned above. However, they
can also be used on their own to update a bounding box based on another or to convert a PostGIS `BOX3D` geometry into the
envelope representation needed for the envelope column in the FEATURE table.

## CRS functions

The `citydb_pkg` package provides functions for performing CRS operations on a 3DCityDB instance.

| Function                                                                                                                                                  | Return type  | Description                                         |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|-----------------------------------------------------|
| **`change_schema_srid`**<br/>`(schema_srid INTEGER, schema_srs_name TEXT, transform INTEGER, schema_name TEXT)`                                           | `SETOF VOID` | Updates the coordinate system for a database schema |
| **`change_column_srid`**<br/>`(table_name TEXT, column_name TEXT, dim INTEGER, schema_srid INTEGER, transform INTEGER, geom_type TEXT, schema_name TEXT)` | `SETOF VOID` | Updates the coordinate system for a geometry column |
| **`check_srid`**<br/>`(srsno INTEGER)`                                                                                                                    | `TEXT`       | Checks if a given `SRID` is valid                   |
| **`is_coord_ref_sys_3d`**<br/>`(schema_srid INTEGER)`                                                                                                     | `INTEGER`    | Checks if a a CRS is a true 3D system               |
| **`is_db_coord_ref_sys_3d`**<br/>`(schema_name TEXT)`                                                                                                     | `INTEGER`    | Checks if the CRS of the 3DCityDB is true 3D system |

The primary function is `change_schema_srid`, which changes the CRS for all geometry columns within the 3DCityDB.
It takes the database-specifc `SRID` (**S**patial **R**eference **ID**) of the new CRS and its OGC-compliant name as inputs.

The function operates in two modes, determined by the value of the `transform` parameter:

- **Update metadata only:** Changes the geometry SRID in the database metadata without transforming coordinates (`transform = 0`, default).
- **Transform coordinates:** Additionally transforms the coordinates of geometries already stored in the database to the new SRID (`transform = 1`).

Both modes serve different purposes. For example, if you accidentally set up your 3DCityDB `v5` with an incorrect SRID
that does not match the CRS of the imported geometries, updating only the metadata is sufficient since the coordinates
are already in the correct SRID. However, if the geometries are stored in the current SRID of the 3DCityDB but need to
be converted to another CRS, the second option is required to transform the coordinates accordingly.

As the final step, `change_schema_srid` automatically updates the metadata in the [`DATABASE_SRS`](metadata-module.md#database_srs-table)
table with the new values.

!!! note
    Regardless of the selected operation mode, changing the CRS of a 3DCityDB `v5` always involves dropping and re-creating
    spatial indexes on the geometry columns to maintain consistency with the new CRS. As a result, the process can be
    time-consuming depending on the table size.

## Database constraint functions

The `citydb_pkg` package provides functions to set database constraints or modify their behavior.

| Function                                                                                                                                                      | Return type  | Description                                                           |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|-----------------------------------------------------------------------|
| **`set_enabled_fkey`**<br/>`(fkey_trigger_oid OID, enable BOOLEAN)`                                                                                           | `SETOF VOID` | Enables or disables a given foreign key constraint                    |
| **`set_enabled_geom_fkeys`**<br/>`(enable BOOLEAN, schema_name TEXT)`                                                                                         | `SETOF VOID` | Enables/disables references to `GEOMETRY_DATA` table                  |
| **`set_enabled_schema_fkeys`**<br/>`(enable BOOLEAN, schema_name TEXT)`                                                                                       | `SETOF VOID` | Enables/disables all foreign keys in a given schema                   |
| **`set_fkey_delete_rule`**<br/>`(fkey_name TEXT, table_name TEXT, column_name TEXT, ref_table TEXT, ref_column TEXT, on_delete_param CHAR, schema_name TEXT)` | `SETOF VOID` | Removes a constraint to add it again with given `ON DELETE` parameter |
| **`set_schema_fkeys_delete_rule`**<br/>`(on_delete_param CHAR, schema_name TEXT)`                                                                             | `SETOF VOID` | Updates all the constraints in the specified schema                   |

Users can temporarily disable specific foreign key relationships between tables, such as those referencing
the `GEOMETRY_DATA` table. While the constraints remain in place, disabling them can significantly improve performance for bulk write
operations, such as importing large volumes of city objects. It is also possible to modify the delete rule of
foreign keys, changing it from `ON DELETE NO ACTION` (use `'a'` as input) to `ON DELETE SET NULL` (`'n'`) or
`ON DELETE CASCADE` (`'c'`). Switching the delete rule removes and recreates the foreign key constraint.

!!! warning
    Use these functions with caution. Disabling foreign key constraints may lead to data inconsistencies, and modifying
    their delete rules can introduce unintended side effects. For example, the delete functions rely on cascading deletes,
    so disabling this could cause them to malfunction. Similar issues may arise with other database operations.

## Utility functions

The `citydb_pkg` package also provides various utility functions as shown below.

| Function                                                                                                                                                                        | Return type     | Description                                                                    |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|--------------------------------------------------------------------------------|
| **`citydb_version`**<br/>`(OUT version TEXT, OUT major_version INTEGER, OUT minor_version INTEGER, OUT minor_revision INTEGER) `                                                | `RECORD`        | Returns the version of the 3DCityDB instance                                   |
| **`db_metadata`**<br/>`(schema_name TEXT, OUT srid INTEGER, OUT srs_name TEXT, OUT coord_ref_sys_name TEXT, OUT coord_ref_sys_kind TEXT, OUT wktext TEXT, OUT versioning TEXT)` | `RECORD`        | Returns meta information about the 3DCityDB instance                           |
| **`get_seq_values`**<br/>`(seq_name TEXT,seq_count BIGINT)`                                                                                                                     | `SETOF BIGINT`  | Returns `n` sequence values from the given sequence                            |
| **`get_child_objectclass_ids`**<br/>`(class_id INTEGER,skip_abstract INTEGER, schema_name TEXT)`                                                                                | `SETOF INTEGER` | Returns the `id` values of all transitive subclasses of the given object class |

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2F3dcitydb.github.io%2F3dcitydb-mkdocs%2F3dcitydb%2Fdb-functions%2F&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=Visitors&edge_flat=false)](https://hits.seeyoufarm.com/#history)

/// caption
///
