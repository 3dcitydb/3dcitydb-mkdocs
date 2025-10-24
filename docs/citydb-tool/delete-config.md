---
title: Delete configuration
description: Description of the JSON delete configuration
tags:
  - citydb-tool
  - delete
  - config
---

The configuration settings for the `delete` command are shown below.

!!! tip
    The names and purposes of the JSON properties align closely with their counterparts in the command-line options. Where
    applicable, the description of each JSON property links to the command-line option for more details.

```json
{
  "deleteOptions": {
    "mode": "terminate",
    "terminateWithSubFeatures": true,
    "indexMode": "dropCreate",
    "terminationDate": "2018-07-01T00:00:00",
    "lineage": "myLineage",
    "updatingPerson": "myUpdatingPerson",
    "reasonForUpdate": "myReasonForUpdate",
    "query": {...},
    "validityOptions": {...}
  }
}
```

## General delete options

| <div style="width:130px;">Property</div>                              | Description                                                                                                             | Default value |
|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"mode"`](delete.md#delete-mode)                                     | Delete mode: `delete`, `terminate`.                                                                                     | `terminate`   |
| [<code>"terminateWithSub<br/>Features"</code>](delete.md#delete-mode) | Also terminate sub-features.                                                                                            | `true`        |
| [`"indexMode"`](delete.md#managing-indexes-during-deletion)           | Index mode: `keep`, `drop`, `dropCreate`.                                                                               | `keep`        |
| [`"terminationDate"`](delete.md#defining-termination-metadata)        | Time in `<YYYY-MM-DD>` or <code>&lt;YYYY-MM-DDThh&#58;mm:ss[(+&#124;-)hh:mm]></code> format to use as termination date. | `now`         |
| [`"lineage"`](delete.md#defining-termination-metadata)                | Lineage to use for the features.                                                                                        |               |
| [`"updatingPerson"`](delete.md#defining-termination-metadata)         | Name of the user responsible for the delete                                                                             | database user |
| [`"reasonForUpdate"`](delete.md#defining-termination-metadata)        | Reason for importing the data.                                                                                          |               |

## Query options

The `"query"` property is a container object for the following query and filtering options.

```json
{
  "query": {
    "featureTypes": [ // (1)!
      {
        "name": "bldg:Building"
      },
      {
        "name": "Road",
        "namespace": "http://3dcitydb.org/3dcitydb/transportation/5.0"
      }
    ],
    "filter": {
      "op": "s_intersects",
      "args": [
        {
          "property": "core:envelope"
        },
        {
          "bbox": [10.0,10.0,20.0,20.0]
        }
      ]
    },
    "filterSrs": { // (2)!
      "srid": 4326,
      "identifier": "http://www.opengis.net/def/crs/EPSG/0/4326"
    },
    "countLimit": {
      "limit": 1000,
      "startIndex": 20
    }
  }
}
```

1. The `"name"` property is mandatory. To avoid ambiguity, use the format `"prefix:name"` with a namespace alias as prefix or
   specify the full namespace using the `"namespace"` property.
2. Use either `"srid"`, `"identifier"`, or both to define the target CRS.

| <div style="width:110px;">Property</div>              | Description                                                                                                                                                                                                                                                    | Default value |
|-------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"featureTypes"`](delete.md#feature-type-filter)     | Array of JSON objects specifying the features to process. Each object must include the `"name"` of the feature type. To avoid ambiguity, use the format `"prefix:name"` with a namespace alias or specify the full namespace using the `"namespace"` property. |               |
| [`"filter"`](delete.md#cql2-based-filtering)          | A CQL2 filter expression, encoded as [CQL2 text or JSON](cql2.md).                                                                                                                                                                                             |               |
| [`"filterSrs"`](delete.md#cql2-based-filtering)       | Specifies a CRS for filter geometries that differs from the 3DCityDB CRS. Use the `"srid"` or `"identifier"` property to define the filter CRS.                                                                                                                |               |
| [`"countLimit"`](delete.md#count-filter)              | The `"limit"` property sets the maximum number of features to delete, and the `"startIndex"` property defines the `0`-based index within the result set to delete from.                                                                                        |               |

## Validity options

The `"validityOptions"` property is a container object for filtering features based on their validity.

```json
{
  "validityOptions": {
    "mode": "valid",
    "reference": "database",
    "at": "2018-07-01",
    "lenient": false
  }
}
```

| Property                                                | Description                                                                                                                                                       | Default value |
|---------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"mode"`](delete.md#deleting-historical-versions)      | Process features by validity: `valid`, `invalid`, `all`.                                                                                                          | `valid`       |
| [`"at"`](delete.md#deleting-historical-versions)        | Check validity at a specific point in time. If provided, the time must be in `<YYYY-MM-DD>` or <code>&lt;YYYY-MM-DDThh&#58;mm:ss[(+&#124;-)hh:mm]></code> format. |               |
| [`"reference"`](delete.md#deleting-historical-versions) | Validity time reference: `database`, `realWorld`.                                                                                                                 | `database`    |
| [`"lenient"`](delete.md#deleting-historical-versions)   | Ignore incomplete validity intervals of features.                                                                                                                 | `false`       |
