---
title: Export configuration
description: Description of the JSON export configuration
tags:
  - citydb-tool
  - export
  - config
---

The configuration settings for the `export` command are divided into [`"exportOptions"`](#export-options) for general export
settings and [`"writeOptions"`](#write-options) for output file settings and format-specific options.

!!! tip
    The names and purposes of the JSON properties align closely with their counterparts in the command-line options. Where
    applicable, the description of each JSON property links to the command-line option for more details.

## Export options

The example below illustrates the JSON structure for the export options.

```json
{
  "exportOptions": {
    "numberOfThreads": 4,
    "useAbsoluteResourcePaths": false,
    "targetSrs": { // (1)!
      "srid": 4326,
      "identifier": "http://www.opengis.net/def/crs/EPSG/0/4326"
    },
    "affineTransform": [0.0,1.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0],
    "lodOptions": {
      "lods": ["2","3"],
      "mode": "minimum"
    },
    "appearanceOptions": {
      "exportAppearances": true,
      "themes": ["foo","bar"],
      "numberOfTextureBuckets": 10
    },
    "query": {...},
    "validityOptions": {...},
    "tiling": {...}
  }
}
```

1. Use either `"srid"`, `"identifier"`, or both to define the target CRS.

### General export options

| <div style="width:170px;">Property</div>                        | Description                                                                                                                                                                                                                                                                                                 | Default value |
|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"numberOfThreads"`](export.md#controlling-the-export-process) | Number of threads to use for parallel processing.                                                                                                                                                                                                                                                           |               |
| <code>"useAbsoluteResource<br/>Paths"</code>                    | Use absolute paths to reference external resources, such as texture images and library objects. Paths are OS-specific and **may break on a different OS**.                                                                                                                                                  | `false`       |
| [`"targetSrs"`](export.md#reprojecting-geometries)              | Specifies the CRS for reprojecting geometries during export. Use the `"srid"` or `"identifier"` property to define the target CRS.                                                                                                                                                                          |               |
| [`"affineTransform"`](export.md#transforming-geometries)        | Transform coordinates using a 3x4 matrix in row-major order. The matrix coefficients are represented as array.                                                                                                                                                                                              |               |
| [`"lodOptions"`](export.md#lod-filter)                          | Defines an `"lods"` array and a `"mode"` to specify whether to `"keep"` (default), `"remove"`, or keep only the `"minimum"` or `"maximum"` matching LoD representation of each feature.                                                                                                                     |               |
| [`"appearanceOptions"`](export.md#appearance-filter)            | The `"themes"` array restricts the export of appearances based on their `theme` property. To exclude all appearances, set the `"exportAppearances"` property to `false` (default: `true`).  Use the `"numberOfTextureBuckets"` property to organize exported texture images into subfolders (default: `0`). |               |

### Query options

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
    },
    "lodFilter": {
      "lods": ["2","3"],
      "mode": "or",
      "searchDepth": 1
    },
    "sorting": {
      "sortBy": [
        {
          "property": "core:objectId",
          "sortOrder": "desc"
        }
      ]
    }
  }
}
```

1. The `"name"` property is mandatory. To avoid ambiguity, use the format `"prefix:name"` with a namespace alias as prefix or
   specify the full namespace using the `"namespace"` property.
2. Use either `"srid"`, `"identifier"`, or both to define the target CRS.

| <div style="width:110px;">Property</div>              | Description                                                                                                                                                                                                                                                              | Default value |
|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"featureTypes"`](export.md#feature-type-filter)     | Array of JSON objects specifying the features to process. Each object must include the `"name"` of the feature type. To avoid ambiguity, use the format `"prefix:name"` with a namespace alias as prefix or specify the full namespace using the `"namespace"` property. |               |
| [`"filter"`](export.md#cql2-based-filtering)          | A CQL2 filter expression, encoded as [CQL2 text or JSON](cql2.md).                                                                                                                                                                                                       |               |
| [`"filterSrs"`](export.md#cql2-based-filtering)       | Specifies a CRS for filter geometries that differs from the 3DCityDB CRS. Use the `"srid"` or `"identifier"` property to define the filter CRS.                                                                                                                          |               |
| [`"countLimit"`](export.md#count-filter)              | The `"limit"` property sets the maximum number of features to export, and the `"startIndex"` property defines the `0`-based index within the result set to export from.                                                                                                  |               |
| [`"lodFilter"`](export.md#lod-filter)                 | Defines an `"lods"` array and a `"mode"` to filter features based on LoD: `"or"` (default) requires any matching LoD, while `"and"` requires all. The `"searchDepth"` sets the number of subfeature levels to search for a matching LoD (default: `0`).                  |               |
| [`"sorting"`](export.md#sorting-features-by-property) | Array of `"sortBy"` objects to sort the output by a `"property"` (specified as a JSON path) in the given `"sortOrder"`: `"asc"` (default) or `"desc"`.                                                                                                                   |               |

### Validity options

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

| Property                                                 | Description                                                                                                                                                       | Default value |
|----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"mode"`](export.md#exporting-historical-versions)      | Process features by validity: `valid`, `invalid`, `all`.                                                                                                          | `valid`       |
| [`"at"`](export.md#exporting-historical-versions)        | Check validity at a specific point in time. If provided, the time must be in `<YYYY-MM-DD>` or <code>&lt;YYYY-MM-DDThh&#58;mm:ss[(+&#124;-)hh:mm]></code> format. |               |
| [`"reference"`](export.md#exporting-historical-versions) | Validity time reference: `database`, `realWorld`.                                                                                                                 | `database`    |
| [`"lenient"`](export.md#exporting-historical-versions)   | Ignore incomplete validity intervals of features.                                                                                                                 | `false`       |

### Tiling options

The `"tiling"` property is a container object for defining tiled exports.

```json
{
  "tiling": {
    "extent": {
      "coordinates": [10.0,10.0,20.0,20.0],
      "srs": { // (1)!
        "srid": 4326,
        "identifier": "http://www.opengis.net/def/crs/EPSG/0/4326"
      }
    },
    "tileMatrixOrigin": "topLeft",
    "scheme": {...}
  }
}
```

1. Use either `"srid"`, `"identifier"`, or both to define the target CRS.

| <div style="width:140px;">Property</div>                 | Description                                                                                                                                                                                                                                          | Default value   |
|----------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| [`"extent"`](export.md#defining-the-tiling-extent)       | Defines a 2D bounding box as tiling extent using a `"coordinates"` array for the lower-left and upper-right corners. If the coordinates differ from the 3DCityDB CRS, a different `"srs"` can be specified with `"srid"` or `"identifier"` property. | `auto-computed` |
| [`"tileMatrixOrigin"`](export.md#defining-the-tile-grid) | Tile indexes origin: `topLeft`, `bottomLeft`.                                                                                                                                                                                                        | `topLeft`       |

The `"scheme"` property is an object that defines the [tiling scheme](export.md#defining-the-tile-grid), with the
`"type"` property indicating the specific scheme being used.

=== "Dimension"

    ```json
    {
      "scheme": {
        "type": "Dimension",
        "width": {
          "value": 2.0,
          "unit": "km"
        },
        "height": {
          "value": 2.0,
          "unit": "km"
        }
      }
    }
    ```

    | Property                                       | Description                                                                                                                | Default value |
    |------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|---------------|
    | `"type"`                                       | `"Dimension"` (fixed).                                                                                                     |               |
    | [`"width"`](export.md#defining-the-tile-grid)  | Specifies the width of each tile using the `"value"` property. If the `"unit"` is omitted, the database CRS unit is used.  |               |
    | [`"height"`](export.md#defining-the-tile-grid) | Specifies the height of each tile using the `"value"` property. If the `"unit"` is omitted, the database CRS unit is used. |               |

=== "Matrix"

    ```json
    {
      "scheme": {
        "type": "Matrix",
        "columns": 10,
        "rows": 20
      }
    }
    ```

    | Property                                        | Description                                               | Default value |
    |-------------------------------------------------|-----------------------------------------------------------|---------------|
    | `"type"`                                        | `"Matrix"` (fixed).                                       |               |
    | [`"columns"`](export.md#defining-the-tile-grid) | Specifies the number of `columns` for the resulting grid. | `1`           |
    | [`"rows"`](export.md#defining-the-tile-grid)    | Specifies the number of `rows` for the resulting grid.    | `1`           |

## Write options

The JSON structure for storing write options is shown below. Format-specific settings are provided within the
`"formatOptions"` container object, with the output format name used as the key for the corresponding settings.

!!! tip
    You only need to provide format-specific options for the file format that matches your output files.

```json
{
  "writeOptions": {
    "failFast": false,
    "numberOfThreads": 4,
    "tempDirectory": "/path/to/temp",
    "encoding": "UTF-8",
    "srsName": "http://www.opengis.net/def/crs/EPSG/0/25832",
    "formatOptions": {
      "CityGML": {...},
      "CityJSON": {...}
    }
  }
}
```

### General write options

| Property                                                        | Description                                       | Default value |
|-----------------------------------------------------------------|---------------------------------------------------|---------------|
| [`"failFast"`](export.md#controlling-the-export-process)        | Fail fast on errors.                              | `false`       |
| [`"numberOfThreads"`](export.md#controlling-the-export-process) | Number of threads to use for parallel processing. |               |
| [`"tempDirectory"`](export.md#controlling-the-export-process)   | Store temporary files in this directory.          |               |
| [`"encoding"`](export.md#specifying-the-output-file)            | Encoding to use for the output file.              |               |
| [`"srsName"`](export.md#reprojecting-geometries)                | Name of the CRS to use in the output file.        |               |

### CityGML options

The `"CityGML"` property is a container object for CityGML-specific format options.

```json
{
  "CityGML": {
    "version": "3.0",
    "prettyPrint": true,
    "addressMode": "columnsFirst",
    "xslTransforms": [
      "/path/to/myFirstStylesheet.xsl",
      "/path/to/mySecondStylesheet.xsl"
    ],
    "useLod4AsLod3": false,
    "mapLod0RoofEdge": false,
    "mapLod1MultiSurfaces": false
  }
}
```

| <div style="width:130px;">Property</div>                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                      | Default value  |
|-------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| [`"version"`](export-citygml.md#specifying-the-citygml-version)                           | CityGML version: `3.0`, `2.0`, `1.0`.                                                                                                                                                                                                                                                                                                                                                            | `3.0`          |
| [`"prettyPrint"`](export-citygml.md#formatting-the-output)                                | Format and indent output file.                                                                                                                                                                                                                                                                                                                                                                   | `true`         |
| `addressMode`                                                                             | Specifies how to construct addresses based on the `ADDRESS` table: <ul><li>`columnsOnly`: Use only structured address fields.</li><li>`columnsFirst`: Prefer structured columns; fall back to `content` blob.</li><li>`xalSourceOnly`: Use only the address blob stored in the `content` column.</li><li>`xalSourceFirst`: Prefer the `content` blob; fall back to structured columns.</li></ul> | `columnsFirst` |
| [`"xslTransforms"`](export-citygml.md#applying-xsl-transformations)                       | An array of XSLT stylesheets to transform the output, referenced by filename and path (absolute or relative). The stylesheets are applied in the specified order.                                                                                                                                                                                                                                |                |
| [`"useLod4AsLod3"`](export-citygml.md#upgrading-citygml-20-and-10)                        | Use LoD4 as LoD3, replacing an existing LoD3.                                                                                                                                                                                                                                                                                                                                                    | `false`        |
| [`"mapLod0RoofEdge"`](export-citygml.md#upgrading-citygml-20-and-10)                      | Map LoD0 roof edges onto roof surfaces.                                                                                                                                                                                                                                                                                                                                                          | `false`        |
| [<code>"mapLod1Multi<br/>Surfaces"</code>](export-citygml.md#upgrading-citygml-20-and-10) | Map LoD1 multi-surfaces onto generic thematic surfaces.                                                                                                                                                                                                                                                                                                                                          | `false`        |

### CityJSON options

The `"CityJSON"` property is a container object for CityJSON-specific format options.

```json
{
  "CityJSON": {
    "version": "2.0",
    "jsonLines": true,
    "prettyPrint": false,
    "htmlSafe": false,
    "vertexPrecision": 3,
    "templatePrecision": 3,
    "textureVertexPrecision": 7,
    "transformCoordinates": true,
    "replaceTemplateGeometries": false,
    "useMaterialDefaults": true,
    "fallbackTheme": "unnamed",
    "useLod4AsLod3": false,
    "writeGenericAttributeTypes": false
  }
}
```

| <div style="width:180px;">Property</div>                                                          | Description                                                                                                         | Default value |
|---------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|---------------|
| [`"version"`](export-cityjson.md#specifying-the-cityjson-version)                                 | CityJSON version: `2.0`, `1.1`, `1.0`.                                                                              | `2.0`         |
| [`"jsonLines"`](export-cityjson.md#streaming-exports)                                             | Write output as CityJSON Sequence in JSON Lines format. This option requires CityJSON 1.1 or later.                 | `true`        |
| [`"prettyPrint"`](export-cityjson.md#formatting-the-output)                                       | Format and indent output file.                                                                                      | `false`       |
| [`"htmlSafe"`](export-cityjson.md#formatting-the-output)                                          | Write JSON that is safe to embed into HTML.                                                                         | `false`       |
| [`"vertexPrecision"`](export-cityjson.md#formatting-the-output)                                   | Number of decimal places to keep for geometry vertices.                                                             | 3             |
| [`"templatePrecision"`](export-cityjson.md#formatting-the-output)                                 | Number of decimal places to keep for template vertices.                                                             | 3             |
| [`"textureVertexPrecision"`](export-cityjson.md#formatting-the-output)                            | Number of decimal places to keep for texture vertices.                                                              | 7             |
| [`"transformCoordinates"`](export-cityjson.md#transforming-coordinates)                           | Transform coordinates to integer values when exporting in CityJSON 1.0.                                             | `true`        |
| [<code>"replaceTemplate<br/>Geometries"</code>](export-cityjson.md#replacing-template-geometries) | Replace template geometries with real coordinates.                                                                  | `false`       |
| [`"useMaterialDefaults"`](export-cityjson.md#suppressing-material-defaults)                       | Name of the CRS to use in the output file.                                                                          | `true`        |
| `"fallbackTheme"`                                                                                 | Defines the fallback theme used when the `theme` property is missing from the database.                             | `unnamed`     |
| <code>"writeGenericAttribute<br/>Types"</code>                                                    | Adds an extra root property to the CityJSON output that lists generic attributes along with the CityGML data types. | `false`       |
| [`useLod4AsLod3`](export-cityjson.md#upgrading-citygml-20-and-10)                                 | Use LoD4 as LoD3, replacing an existing LoD3.                                                                       | `false`       |
