---
title: Vis-export configuration
description: Description of the JSON vis-export configuration
tags:
  - citydb-tool
  - vis-export
  - config
---

The configuration settings for the `vis-export` command are divided into [`"visExportOptions"`](#vis-export-options) for
general export settings and [`"writeOptions"`](#write-options) for output file settings and format-specific options
(3D Tiles, I3S).

!!! tip
    The names and purposes of the JSON properties align closely with their counterparts in the command-line options.
    Where applicable, the description of each JSON property links to the command-line option for more details.

## Vis-export options

The example below illustrates the JSON structure for the vis-export options.

```json
{
  "visExportOptions": {
    "numberOfThreads": 4,
    "lodOptions": {
      "lods": ["2","3"],
      "mode": "maximum"
    },
    "appearanceOptions": {
      "exportAppearances": true,
      "themes": ["summer"]
    },
    "query": {...},
    "validityOptions": {...}
  }
}
```

### General vis-export options

| <div style="width:170px;">Property</div>                                  | Description                                                                                                                                                                                                                              | Default value |
|---------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"numberOfThreads"`](vis-export.md#controlling-the-export-process)       | Number of threads to use for parallel processing.                                                                                                                                                                                        |               |
| [`"lodOptions"`](vis-export.md#lod-filter)                                | Defines an `"lods"` array and a `"mode"` to specify whether to `"keep"` (default), `"remove"`, or keep only the `"minimum"` or `"maximum"` matching LoD representation of each feature.                                                   |               |
| [`"appearanceOptions"`](vis-export.md#appearance-filter)                  | The `"themes"` array restricts the export of appearances based on their `theme` property. To exclude all appearances, set the `"exportAppearances"` property to `false` (default: `true`).                                                |               |

!!! note
    Visualization formats always use WGS84 geographic coordinates (EPSG:4326). The exporter sets the target CRS
    automatically, so the `"targetSrs"` property used by the regular `exportOptions` does not apply here.

### Query options

The `"query"` property is a container object for query and filtering options. The structure is identical to the
[`exportOptions.query`](export-config.md#query-options) used by the regular `export` command, with the exception that
the `"sorting"` property is not supported.

```json
{
  "query": {
    "featureTypes": [
      { "name": "bldg:Building" }
    ],
    "filter": {
      "op": "s_intersects",
      "args": [
        { "property": "core:envelope" },
        { "bbox": [13.369,52.506,13.405,52.520] }
      ]
    },
    "filterSrs": {
      "srid": 4326
    },
    "countLimit": {
      "limit": 1000
    },
    "lodFilter": {
      "lods": ["2","3"],
      "mode": "or",
      "searchDepth": 1
    }
  }
}
```

| <div style="width:110px;">Property</div>                  | Description                                                                                                                                                                                                                                                              |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`"featureTypes"`](vis-export.md#feature-type-filter)     | Array of JSON objects specifying the features to process. Each object must include the `"name"` of the feature type. To avoid ambiguity, use the format `"prefix:name"` with a namespace alias as prefix or specify the full namespace using the `"namespace"` property. |
| [`"filter"`](vis-export.md#cql2-based-filtering)          | A CQL2 filter expression, encoded as [CQL2 text or JSON](cql2.md).                                                                                                                                                                                                       |
| [`"filterSrs"`](vis-export.md#cql2-based-filtering)       | Specifies a CRS for filter geometries that differs from the 3DCityDB CRS. Use the `"srid"` or `"identifier"` property to define the filter CRS.                                                                                                                          |
| [`"countLimit"`](vis-export.md#count-filter)              | The `"limit"` property sets the maximum number of features to export, and the `"startIndex"` property defines the `0`-based index within the result set to export from.                                                                                                  |
| [`"lodFilter"`](vis-export.md#lod-filter)                 | Defines an `"lods"` array and a `"mode"` to filter features based on LoD: `"or"` (default) requires any matching LoD, while `"and"` requires all. The `"searchDepth"` sets the number of subfeature levels to search for a matching LoD (default: `0`).                  |

### Validity options

The `"validityOptions"` property is identical to the
[`exportOptions.validityOptions`](export-config.md#validity-options) used by the regular `export` command and controls
which historical versions are exported. See [Exporting historical versions](export.md#exporting-historical-versions)
for the underlying concepts.

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
    "formatOptions": {
      "3DTiles": {...},
      "I3S": {...}
    }
  }
}
```

### General write options

| Property                                                            | Description                                       | Default value |
|---------------------------------------------------------------------|---------------------------------------------------|---------------|
| [`"failFast"`](vis-export.md#controlling-the-export-process)        | Fail fast on errors.                              | `false`       |
| [`"numberOfThreads"`](vis-export.md#controlling-the-export-process) | Number of threads to use for parallel processing. |               |
| [`"tempDirectory"`](vis-export.md#controlling-the-export-process)   | Store temporary files in this directory.          |               |

### Shared scene options

All visualization formats share the same set of scene options. These are nested under the format-specific containers
(`"3DTiles"` and `"I3S"`) since each format owns its own copy of the options, but the property names and semantics are
identical across formats.

| <div style="width:200px;">Property</div>                                                | Description                                                                                                                              | Default value |
|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"gridEdgeLength"`](vis-export.md#spatial-aggregation-and-lod)                         | Edge length in meters of one grid cell used as the leaf of the spatial aggregation tree. `0` means auto-sized to the dataset extent.     | `0`           |
| [`"screenPixelThreshold"`](vis-export.md#spatial-aggregation-and-lod)                   | Projected bounding-sphere radius (pixels) above which a tile refines to its children. `0` always refines to the leaves.                  | `56`          |
| [`"clampMode"`](vis-export.md#spatial-aggregation-and-lod)                              | Vertical clamping target: `"ellipsoid"` (lowest point on the WGS84 ellipsoid, height 0) or `"cesium-world-terrain"` (lowest point on the sampled Cesium World Terrain height, requires `"cesiumIonToken"`). Omit for no clamping. | none          |
| [`"cesiumIonToken"`](vis-export.md#spatial-aggregation-and-lod)                         | Cesium ion access token for `"clampMode": "cesium-world-terrain"`, stored in plain text like the database password. Can also be supplied via `--cesium-ion-token` or the `CESIUM_ION_TOKEN` environment variable (precedence: command line > config file > environment variable). |               |
| [`"textureScale"`](vis-export.md#texture-atlas-handling)                                | Texture resolution scale factor between `0.01` and `1.0`.                                                                                | `1.0`         |
| [`"maxAtlasSize"`](vis-export.md#texture-atlas-handling)                                | Maximum texture atlas edge length in pixels, between `1024` and `16384`.                                                                 | `1024`        |
| [`"atlasOverflowMode"`](vis-export.md#texture-atlas-handling)                           | Strategy when a cell's textures exceed `maxAtlasSize`: `HYBRID`, `SPLIT`, `FLAT`.                                                        | `HYBRID`      |
| [`"atlasFallbackStrategy"`](vis-export.md#texture-atlas-handling)                       | Fallback strategy for cells the split stage did not subdivide further, and for every overflowing cell under `FLAT`: `EXPAND`, `RESCALE`.    | `EXPAND`   |
| [`"enableShading"`](vis-export.md#styling-features-without-appearances)                 | Emit per-vertex normals so surfaces render shaded.                                                                                       | `false`       |
| [`"defaultColor"`](vis-export.md#styling-features-without-appearances)                  | Default sRGB color (`#rrggbb` or `#rrggbbaa`) applied to features without a texture or `X3DMaterial`.                                     | opaque white  |
| [`"featureTypeStyles"`](vis-export.md#styling-features-without-appearances)             | JSON object mapping a qualified feature type name (e.g. `"con:RoofSurface"`) to an sRGB hex color, overriding `"defaultColor"` per type. |               |
| [`"attributes"`](vis-export.md#selecting-attributes)                                    | Array of declarative column-mapping tokens for the per-feature attribute table. Each entry has the form `"<output_col>:<source>"`.       | export all    |

Styling and attribute selection are configured directly through the `"defaultColor"`, `"featureTypeStyles"`, and
`"attributes"` properties listed above, nested in the same format container (`"3DTiles"` or `"I3S"`) as the other scene
options. They accept the same values as their command-line counterparts
([`--default-color`](vis-export.md#styling-features-without-appearances),
[`--feature-type-style`](vis-export.md#styling-features-without-appearances), and
[`--attributes`](vis-export.md#selecting-attributes)); a command-line option, when given, overrides the matching
property from the configuration file. The keys of `"featureTypeStyles"` must be qualified feature type names with a
namespace prefix (e.g. `"bldg:Building"`); an unprefixed or unknown type is rejected. See the
[3D Tiles example](#3d-tiles-options) below for the full structure.

### 3D Tiles options

The `"3DTiles"` property is a container object for 3D Tiles-specific format options. All shared scene options listed
above can be set here. Currently, 3D Tiles defines no additional format-specific properties beyond the shared scene
options.

```json
{
  "3DTiles": {
    "gridEdgeLength": 200.0,
    "screenPixelThreshold": 56.0,
    "clampMode": "ellipsoid",
    "textureScale": 1.0,
    "maxAtlasSize": 2048,
    "atlasOverflowMode": "HYBRID",
    "atlasFallbackStrategy": "EXPAND",
    "enableShading": true,
    "defaultColor": "#cccccc",
    "featureTypeStyles": {
      "con:RoofSurface": "#ff0000",
      "bldg:Building": "#808080cc"
    },
    "attributes": [
      "COUNTRY:ADDRESS/[FIRST]country",
      "CITY:ADDRESS/[FIRST]city",
      "HEIGHT:ATTRIBUTES/con:height.con:value::double"
    ]
  }
}
```

### I3S options

The `"I3S"` property is a container object for I3S-specific format options. All shared scene options listed above can
be set here, plus the I3S-specific `"slpk"` flag.

```json
{
  "I3S": {
    "slpk": true,
    "gridEdgeLength": 200.0,
    "screenPixelThreshold": 56.0,
    "clampMode": "cesium-world-terrain",
    "cesiumIonToken": "your-cesium-ion-token",
    "textureScale": 1.0,
    "maxAtlasSize": 2048,
    "atlasOverflowMode": "HYBRID",
    "atlasFallbackStrategy": "EXPAND",
    "enableShading": true
  }
}
```

| Property                                                       | Description                                                                                                              | Default value |
|----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|---------------|
| [`"slpk"`](vis-export-i3s.md#choosing-folder-mode-or-slpk)     | Package the I3S output as a Scene Layer Package (`.slpk`) file. By default, I3S is exported as a folder structure.       | `false`       |

!!! note
    When `"slpk"` is `true`, `"enableShading"` is forced to `true` regardless of the configured value, because ArcGIS
    Pro and ArcGIS Online refuse to load a scene layer whose legacy geometry buffer omits per-vertex normals.
