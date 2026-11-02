---
title: Database functions
description: Database functions installed with 3DCityDB
tags:
  - 3dcitydb
  - database functions
---

The 3DCityDB `v5` is shipped with database-side functions that are automatically installed during setup. These functions
provide database operations such as deleting or terminating city objects, computing their envelopes, and managing the
Coordinate Reference System (CRS) of the 3DCityDB instance. They also provide utility and helper functions for automating
processes and workflows and for integration with third-party tools.

!!! tip
    For PostgreSQL, the functions are written in `PL/pgSQL` and reside in a dedicated `citydb_pkg` schema. Since
    `citydb_pkg` is automatically added to the database `search_path` during setup, they can be called without explicitly
    specifying the schema as a prefix.

## Delete functions

The delete functions enable the removal of single or multiple city objects while automatically managing integrity
constraints between database tables. They provide low-level APIs for deleting data from various tables — from individual
geometries in the [`GEOMETRY_DATA`](geometry-module.md#geometry_data-table) table (`delete_geometry_data` function) to
entire features in the [`FEATURE`](feature-module.md#feature-table) table, alongside their properties, geometries, and
appearances (`delete_feature` function). These functions enable users to develop more complex delete operations without
reimplementing their core functionality.

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

Most delete functions are provided in two forms:

- **Deletion of single entries:** One variant accepts the primary key `id` of a single entry to be deleted and returns the `id`
value if the deletion is successful. If `NULL` is returned, it indicates that the entry has either already been deleted or
an error occurred during the deletion process.

- **Deletion of multiple entries:** The other variant accepts an array of `id` values, returning the `id` values of the
successfully deleted entries as a `SETOF BIGINT`, allowing multiple entries to be deleted in a single call.

All functions offer an optional `schema_name` parameter, allowing you to apply them to different database schemas within your
PostgreSQL database. The provided target schema must contain a 3DCityDB `v5` instance. For more information, see
[below](#applying-functions-to-different-schemas).

The following example demonstrates how to delete features based on a query result:

```sql
-- delete a single feature by id
SELECT delete_feature(id) FROM feature WHERE ... ;

-- delete multiple features by passing an array of ids
SELECT *
FROM delete_feature(
    ARRAY(
        SELECT id
        FROM feature
        WHERE ...
    )
);
```

You can also use `array_agg` instead of `ARRAY(SELECT ...)` to construct an `id` array from a query. Because `array_agg`
returns `NULL` when no rows match, use `COALESCE` if you want to normalize the result to an empty array.

```sql
-- delete multiple features by passing an array of ids
SELECT delete_feature(
    COALESCE(array_agg(id), ARRAY[]::bigint[])
)
FROM feature
WHERE ... ;
```

The array-based delete functions require fewer `DELETE` statements and may therefore be faster than deleting the same
number of entries by invoking the delete function for each individual `id`. However, this is not always the case and
depends on the ratio between the number of entries to be deleted and the total number of objects in the database. For
example, if the `id` array is very large and covers a significant portion of the table, it may be more efficient to use the
single-`id` version or delete entries in smaller groups.

The example below demonstrates how to create a custom function to delete all buildings from the 3DCityDB
using the single-`id` version of `delete_feature`:

```sql
-- example function for deleting all building features
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
    When deleting a feature, all its subfeatures connected through
    [`contains`](feature-module.md#relationships) relationships (`val_relation_type = 1`), which are considered a part
    of the feature, are deleted as well. However, features connected through other relationship types are not deleted.
    The distinction is determined by the `val_relation_type` column of the
    [`PROPERTY`](feature-module.md#property-table) table. A subfeature that is also contained by another feature is kept.
    If all its remaining parents are terminated, the subfeature is terminated with
    [`terminate_feature`](#terminate-functions), because every feature below a terminated feature is terminated itself.

!!! tip
    The `cleanup_schema` function serves a specific purpose: it **truncates all database tables** with a single function call.
    This is the most convenient and fastest way to delete all content from your 3DCityDB `v5`. However, be cautious when using
    this function, as it cannot be rolled back.

## Terminate functions

The delete functions physically remove city objects from the 3DCityDB instance, helping keep the database streamlined
and focused on the most recent versions of features. However, in some cases, it may be preferable to retain the feature
history and avoid deleting outdated versions. For such use cases, the 3DCityDB provides the `terminate_feature` function.
Unlike the delete functions, `terminate_feature` does not physically delete features but instead marks them as terminated
by setting their `termination_date` property to the timestamp of the operation. Alongside the `creation_date` timestamp,
the lifespan of the feature in the database can be tracked, allowing multiple historical versions of the same feature
to be stored alongside its most recent version.

| Function                                                                                                                                                             | Return type                    | Description                                                               |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|---------------------------------------------------------------------------|
| **`terminate_feature`**<br/>`(pid bigint, metadata JSONB)` or <br/>`(pid_array bigint[], metadata JSONB)` or <br/>the corresponding variants with `schema_name TEXT` | `BIGINT` or<br/>`SETOF BIGINT` | Terminates features in the `FEATURE` table based on an `id` or `id` array |

Because the `creation_date` and `termination_date` columns exist only in the
[`FEATURE`](feature-module.md#feature-table) table, only the `terminate_feature` function is available for terminating
features. Like the delete functions, it accepts either a single `id` or an array of `id` values and returns the `id`
values of successfully terminated features.

The `FEATURE` table provides additional metadata columns for features, including `last_modification_date`, `lineage`,
`reason_for_update`, and `updating_person` (see [here](feature-module.md#feature-table) for more details).
The `terminate_feature` function allows you to update these values by passing a JSON object as the `metadata` parameter,
where each property represents the column name and its corresponding value is the updated data. When omitting
individual columns in the JSON object, or omitting the JSON object entirely, the values currently stored in these columns
remain unchanged. The only exception is `last_modification_date`, which is set to the same timestamp as `termination_date`.

Subfeatures connected through [`contains`](feature-module.md#relationships) relationships (`val_relation_type = 1`) are
always terminated together with the feature, so every feature below a terminated feature is terminated itself. This
applies to top-level features and to subfeatures of an active feature alike: terminating a subfeature terminates its own
subfeatures, while its parent remains active. Other relationship types are not traversed. A subfeature is terminated only
if no active parent still references it. Features that are already terminated are left unchanged and keep their
termination date; their subfeatures are not traversed, because they are already terminated.

The following example demonstrates how to terminate a single feature based on its database `id`.

```sql
SELECT terminate_feature(
    2060316,
    '{
        "reason_for_update": "test reason",
        "updating_person": "test person",
        "lineage": "test lineage"
    }'::jsonb
);
```
!!! note
    When terminating features, make sure the tools you are using correctly evaluate the `termination_date` timestamp. This is
    essential when exporting or processing features to ensure that the tools are working with the correct version of the
    feature. The [`citydb-tool`](../citydb-tool/index.md) included in 3DCityDB `v5` fully supports feature histories based on the
    `creation_date` and `termination_date` properties.

## Envelope functions

The envelope functions calculate the 3D bounding box of features and implicit geometries, as well as provide utility
functions to support these operations.

| Function                                                                                                                                                                               | Return type | Description                                                |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|------------------------------------------------------------|
| **`get_feature_envelope`**<br/>`(fid BIGINT, compute_envelope INTEGER, set_envelope INTEGER)` or <br/>`(fid BIGINT, schema_name TEXT, compute_envelope INTEGER, set_envelope INTEGER)` | `GEOMETRY`  | Returns the envelope geometry of a given feature           |
| **`get_implicit_geometry_envelope`**<br/>`(gid BIGINT, ref_pt GEOMETRY, matrix JSONB)` or <br/>`(gid BIGINT, ref_pt GEOMETRY, matrix JSONB, schema_name TEXT)`                         | `GEOMETRY`  | Returns the envelope geometry of a given implicit geometry |
| **`get_envelope`**<br/>`(geom GEOMETRY)` or <br/>`(geom GEOMETRY, schema_name TEXT)`                                                                                                   | `GEOMETRY`  | Computes the envelope geometry for a given geometry        |

The `get_feature_envelope` function returns the envelope of a feature. The feature's primary key `id` must be
provided as input. When the `compute_envelope` parameter is set to `0` (default), the envelope currently stored in the
`FEATURE` table is returned. When set to `1`, or when the value in the `FEATURE` table is `NULL`, the envelope is
computed by evaluating the geometries of the feature and its subfeatures connected through
[`contains`](feature-module.md#relationships) relationships (`val_relation_type = 1`) across all LoDs, including implicit geometries. For an active root feature,
terminated subfeatures and their subtrees are excluded. For a terminated root feature, the complete reachable subtree is
included. The returned geometry is the minimal 3D rectangle that
encloses the feature, and it can be directly used as the value for the `envelope` column of the `FEATURE` table.

The `get_feature_envelope` function offers another optional parameter: The `set_envelope` parameter specifies whether the
computed envelopes should be used to update the `envelope` columns of traversed features (`1` for true, `0` for false; default:
`0`). When the requested root is terminated, active subfeatures are included in the calculation but their stored
envelopes are not updated.

The envelope of implicit geometries can be calculated using the `get_implicit_geometry_envelope` function. It
requires the following inputs: the primary key `id` of the template geometry from the `GEOMETRY_DATA` table, a PostGIS `POINT`
geometry specifying the real-world coordinates where the template should be placed (`ref_pt`), and a 3x4 row-major matrix
(JSON double array) defining the rotation, scaling, and translation for the template (`matrix`).

The reference point and transformation matrix follow the format used for storing them in the [`PROPERTY`](feature-module.md#property-table) table
(see [here](feature-module.md#relationships)). Therefore, the values from the `PROPERTY` table can be directly used as input parameters.

The remaining `get_envelope` function is primarily used internally by the functions mentioned above. However, it
can also be called directly to compute the envelope of a single geometry. The result is also returned in the
format required by the `envelope` column of the `FEATURE` table.

## CRS functions

The CRS functions manage the CRS of 3DCityDB schemas and geometry columns, including CRS validation and information
queries.

| Function                                                                                                                     | Return type  | Description                                                        |
|------------------------------------------------------------------------------------------------------------------------------|--------------|--------------------------------------------------------------------|
| **`change_schema_srid`**<br/>`(target_srid INTEGER, target_srs_name TEXT, schema_name TEXT, transform INTEGER)`              | `SETOF VOID` | Updates the coordinate system for a database schema                |
| **`change_column_srid`**<br/>`(table_name TEXT, column_name TEXT, target_srid INTEGER, schema_name TEXT, transform INTEGER)` | `SETOF VOID` | Updates the coordinate system for a geometry column                |
| **`check_srid`**<br/>`(srid INTEGER)`                                                                                        | `INTEGER`    | Checks whether a given `SRID` is valid                             |
| **`get_coord_ref_sys_info`**<br/>`(srid INTEGER)`                                                                            | `TABLE`      | Returns the name, type and WKT representation of the specified CRS |
| **`is_coord_ref_sys_3d`**<br/>`(srid INTEGER)`                                                                               | `INTEGER`    | Checks whether a CRS is a true 3D system                           |
| **`is_db_coord_ref_sys_3d`**<br/>`(schema_name TEXT)`                                                                        | `INTEGER`    | Checks whether the 3DCityDB uses a true 3D CRS                     |

The primary function is `change_schema_srid`, which changes the CRS for all geometry columns within a 3DCityDB schema (default: `citydb`).
It takes the database-specific `SRID` (**S**patial **R**eference **ID**) of the new CRS and its OGC-compliant name as inputs.

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
    Regardless of the selected operation mode, changing the CRS of a 3DCityDB `v5` always involves dropping and recreating
    spatial indexes on the geometry columns to maintain consistency with the new CRS. As a result, the process can be
    time-consuming, depending on the table size.

The remaining functions validate SRIDs and provide information about coordinate reference systems and the
dimensionality of the 3DCityDB CRS.

## Utility functions

The utility functions provide version and metadata information, look up sequence values and object-class hierarchies,
and manage schemas.

| Function                                                                                                                                                                        | Return type                                    | Description                                                                                                    |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **`citydb_version`**<br/>`(OUT version TEXT, OUT major_version INTEGER, OUT minor_version INTEGER, OUT minor_revision INTEGER)`                                                 | `TABLE`                                        | Returns the version of the 3DCityDB instance                                                                   |
| **`db_metadata`**<br/>`(schema_name TEXT, OUT srid INTEGER, OUT srs_name TEXT, OUT coord_ref_sys_name TEXT, OUT coord_ref_sys_kind TEXT, OUT wktext TEXT, OUT versioning TEXT)` | `TABLE`                                        | Returns metadata about the 3DCityDB instance                                                                   |
| **`db_properties`**()                                                                                                                                                           | `TABLE`<br/>`(id TEXT, name TEXT, value TEXT)` | Lists database properties such as enabled extensions or options relevant for the 3DCityDB as name-value pairs. |
| **`get_seq_values`**<br/>`(seq_name TEXT, seq_count BIGINT)`                                                                                                                    | `SETOF BIGINT`                                 | Returns `n` sequence values from the given sequence                                                            |
| **`get_child_objectclass_ids`**<br/>`(class_id INTEGER, schema_name TEXT, skip_abstract INTEGER)`                                                                               | `SETOF INTEGER`                                | Returns the `id` values of all transitive subclasses of the given object class                                 |
| **`get_current_schema`**()                                                                                                                                                      | `TEXT`                                         | Returns the name of the active 3DCityDB schema as determined by the current `search_path`                      |
| **`set_current_schema`**<br/>`(schema_name TEXT, local BOOLEAN)`                                                                                                                | `SETOF VOID`                                   | Sets the active 3DCityDB schema to the specified name by adjusting the `search_path`                           |
| **`schema_exists`**<br/>`(schema_name TEXT)`                                                                                                                                    | `INTEGER`                                      | Checks whether the specified schema is a 3DCityDB schema                                                       |

The functions `get_current_schema` and `set_current_schema` simplify managing the active 3DCityDB schema. While `get_current_schema`
returns the schema currently set in the `search_path`, `set_current_schema` updates it to the specified name. The
`local` parameter controls the scope of the change: when set to true (default), it applies the current transaction only;
when false, it applies to the entire session until explicitly changed. Additionally, `set_current_schema` automatically
includes required schemas like `citydb_pkg` and `public`.

The `schema_exists` function can be used to verify whether the specified schema is a valid 3DCityDB data schema.

## Applying functions to different schemas

The 3DCityDB supports using multiple data schemas within the same PostgreSQL database. The default schema
is named `citydb`, while additional schemas can be freely named by the user. A setup script to create additional data
schemas is included in the 3DCityDB software package and is documented [here](db-scripts.md#shell-scripts).

Most of the database functions accept an optional `schema_name` parameter to specify the
target schema. If this parameter is provided, the function temporarily sets the database `search_path` to the given
schema, making it the active schema for that operation. This change to the `search_path` applies only for the duration
of the current transaction — not the entire session. This ensures that any change to the `search_path` remains isolated
and does not affect other operations outside the transaction, helping to avoid unintended side effects.

If `schema_name` is omitted, the function uses the schema currently set in the `search_path`. This offers
flexibility, allowing users to configure the `search_path` according to their needs before calling any 3DCityDB
database functions.

!!! note
    When setting up a 3DCityDB instance, the default schema is always `citydb`. If you are not working with multiple schemas, you
    can simply omit the `schema_name` parameter when calling functions — they will automatically operate on the `citydb` schema.
    For most users, this is the default and recommended approach for invoking the database functions.

!!! tip
    The utility functions `get_current_schema` and `set_current_schema` are documented [above](#utility-functions) and are
    especially useful for users who prefer not to manage the `search_path` manually.