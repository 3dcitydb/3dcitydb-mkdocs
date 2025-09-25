---
title: Import configuration
description: Description of the JSON import configuration
tags:
  - citydb-tool
  - import
  - config
---

The configuration settings for the `import` command are divided into [`"importOptions"`](#import-options) for general import
settings and [`"readOptions"`](#read-options) for input file settings and format-specific options.

!!! tip
    The names and purposes of the JSON properties align closely with their counterparts in the command-line options. Where
    applicable, the description of each JSON property links to the command-line option for more details.

## Import options

The example below illustrates the JSON structure for the import options. 

```json
{
  "importOptions": {
    "mode": "importAll",
    "indexMode": "keep",
    "numberOfThreads": 4,
    "batchSize": 20,
    "tempDirectory": "/my/path/to/temp",
    "affineTransform": [0.0,1.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0],
    "lineage": "myLineage",
    "updatingPerson": "myUpdatingUser",
    "reasonForUpdate": "myReasonForUpdate",
    "filterOptions": {...}
  }
}
```

### General import options

| <div style="width:130px;">Property</div>                        | Description                                                                                                                                                             | Default value |
|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"mode"`](import.md#import-modes-and-duplicate-features)       | Import mode: `importAll`, `skipExisting`, `deleteExisting`, `terminateExisting`.                                                                                        | `importAll`   |
| [`"indexMode"`](import.md#managing-indexes-during-import)       | Index mode: `keep`, `drop`, `dropCreate`.                                                                                                                               | `keep`        |
| [`"numberOfThreads"`](import.md#controlling-the-import-process) | Number of threads to use for parallel processing.                                                                                                                       |               |
| `"batchSize"`                                                   | Number of top-level features that are committed to the database in a single transaction. A higher batch size might improve import performance but requires more memory. | 20            |
| [`"tempDirectory"`](import.md#controlling-the-import-process)   | Store temporary files in this directory.                                                                                                                                |               |
| [`"affineTransform"`](import.md#transforming-geometries)        | Transform coordinates using a 3x4 matrix in row-major order. The matrix coefficients are represented as array.                                                          |               |
| [`"lineage"`](import.md#defining-import-metadata)               | Lineage to use for the features.                                                                                                                                        |               |
| [`"updatingPerson"`](import.md#defining-import-metadata)        | Name of the user responsible for the import.                                                                                                                            | database user |
| [`"reasonForUpdate"`](import.md#defining-import-metadata)       | Reason for importing the data.                                                                                                                                          |               |

### Filter options

The `"filterOptions"` property is a container object for the following filtering options.

```json
{
  "filterOptions": {
    "featureTypes": [ // (1)!
      {
        "name": "bldg:Building"
      },
      {
        "name": "Road",
        "namespace": "http://3dcitydb.org/3dcitydb/building/5.0"
      }
    ],
    "ids": ["foo","bar"],
    "bbox": {
      "coordinates": [10.0,10.0,20.0,20.0],
      "srs": { // (2)!
        "srid": 4326,
        "identifier": "http://www.opengis.net/def/crs/EPSG/0/4326"
      }
    },
    "bboxMode": "intersects",
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

| <div style="width:110px;">Property</div>          | Description                                                                                                                                                                                                                                                              | Default value |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"featureTypes"`](import.md#feature-type-filter) | Array of JSON objects specifying the features to process. Each object must include the `"name"` of the feature type. To avoid ambiguity, use the format `"prefix:name"` with a namespace alias as prefix or specify the full namespace using the `"namespace"` property. |               |
| [`"ids"`](import.md#feature-identifier-filter)    | Array of identifiers defining the features to process.                                                                                                                                                                                                                   |               |
| [`"bbox"`](import.md#bounding-box-filter)         | Defines a 2D bounding box as a spatial filter using a `"coordinates"` array for the lower-left and upper-right corners. If the coordinates differ from the 3DCityDB CRS, a different `"srs"` can be specified with `"srid"` or `"identifier"` property.                  |               |
| [`"bboxMode"`](import.md#bounding-box-filter)     | Bounding box mode: `intersects`, `contains`, `onTile`.                                                                                                                                                                                                                   | `intersects`  |
| [`"countLimit"`](import.md#count-filter)          | The `"limit"` property sets the maximum number of features to import, and the `"startIndex"` property defines the `0`-based index of the first feature to import.                                                                                                        |               |

## Read options

The JSON structure for storing read options is shown below. Format-specific settings are provided within the
`"formatOptions"` container object, with the input format name used as the key for the corresponding settings.

!!! tip
    You only need to provide format-specific options for the file formats that match your input files.

```json
{
  "readOptions": {
    "failFast": false,
    "numberOfThreads": 4,
    "encoding": "UTF-8",
    "tempDirectory": "/path/to/temp",
    "computeEnvelopes": true,
    "formatOptions": {
      "CityGML": {...},
      "CityJSON": {...}
    }
  }
}
```

### General read options

| Property                                                        | Description                                       | Default value |
|-----------------------------------------------------------------|---------------------------------------------------|---------------|
| [`"failFast"`](import.md#controlling-the-import-process)        | Fail fast on errors.                              | `false`       |
| [`"numberOfThreads"`](import.md#controlling-the-import-process) | Number of threads to use for parallel processing. |               |
| [`"encoding"`](import.md#specifying-import-files)               | Encoding of input file(s).                        |               |
| [`"tempDirectory"`](import.md#controlling-the-import-process)   | Store temporary files in this directory.          |               |
| [`"computeEnvelopes"`](import.md#computing-extents)             | Compute and overwrite extents of features.        | `false`       |

### CityGML options

The `"CityGML"` property is a container object for CityGML-specific format options.

```json
{
  "CityGML": {
    "includeXALSource": false,
    "xslTransforms": [
      "/path/to/myFirstStylesheet.xsl",
      "/path/to/mySecondStylesheet.xsl"
    ],
    "appearanceOptions": {
      "readAppearances": true,
      "themes": ["foo","bar"]
    },
    "useLod4AsLod3": false,
    "mapLod0RoofEdge": false,
    "mapLod1MultiSurfaces": false,
    "createCityObjectRelations": true,
    "resolveCrossLodReferences": true
  }
}
```

| <div style="width:210px;">Property</div>                                  | Description                                                                                                                                                                                                 | Default value |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"includeXALSource"`](import-citygml.md#storing-xal-address-elements)    | Import XML snippets of xAL address elements.                                                                                                                                                                | `false`       |
| [`"xslTransforms"`](import-citygml.md#applying-xsl-transformations)       | An array of XSLT stylesheets to transform the input, referenced by filename and path (absolute or relative). The stylesheets are applied in the specified order.                                            |               |
| [`"appearanceOptions"`](import-citygml.md#filtering-appearances)          | The `"themes"` array restricts the import of appearances based on their <code>&lt;theme&gt;</code> property. To exclude all appearances, set the `"readAppearances"` property to `false` (default: `true`). |               |
| [`"useLod4AsLod3"`](import-citygml.md#upgrading-citygml-20-and-10)        | 	Use LoD4 as LoD3, replacing an existing LoD3.                                                                                                                                                              | `false`       |
| [`"mapLod0RoofEdge"`](import-citygml.md#upgrading-citygml-20-and-10)      | Map LoD0 roof edges onto roof surfaces.                                                                                                                                                                     | `false`       |
| [`"mapLod1MultiSurfaces"`](import-citygml.md#upgrading-citygml-20-and-10) | Map LoD1 multi-surfaces onto generic thematic surfaces.                                                                                                                                                     | `false`       |
| `"createCityObjectRelations"`                                             | Create `CityObjectRelation` objects for [geometry references between top-level features](https://docs.ogc.org/is/21-006r2/21-006r2.html#linking-rules-section).                                             | `true`        |
| `"resolveCrossLodReferences"`                                             | Resolves geometry references between different LoD representations of the same feature.                                                                                                                     | `true`        |

### CityJSON options

The `"CityJSON"` property is a container object for CityJSON-specific format options.

```json
{
  "CityJSON": {
    "mapUnsupportedTypesToGenerics": true,
    "appearanceOptions": {
      "readAppearances": true,
      "themes": ["foo","bar"]
    }
  }
}
```

| <div style="width:150px;">Property</div>                                                            | Description                                                                                                                                                                                | Default value |
|-----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [<code>"mapUnsupportedTypes<br/>ToGenerics"</code>](import-cityjson.md#handling-unknown-extensions) | Map city objects from unsupported extensions onto generic city objects.                                                                                                                    | `true`        |
| [`"appearanceOptions"`](import-cityjson.md#filtering-appearances)                                   | The `"themes"` array restricts the import of appearances based on their `"theme"` property. To exclude all appearances, set the `"readAppearances"` property to `false` (default: `true`). |               |