---
# title: CityJSON Options
description: CityJSON-Specific Export Options
# icon: material/json
status: wip
tags:
  - citydb-tool
  - CityJSON
  - export
---

# CityJSON-specific export options

The **CityJSON** exporter in the **citydb-tool** provides additional options unique to the CityJSON format. These options allow precise control over JSON formatting, geometry precision, and transformations.

---

## CityJSON-specific options

| Option                               | Description                                                                                           | Default Value |
|--------------------------------------|-------------------------------------------------------------------------------------------------------|------------|
| `-v`, `--cityjson-version=<version>` | Specify the CityJSON version to use: `2.0`, `1.1`, or `1.0`.                                          | 2.0        |
| `--[no-]json-lines`                  | Export data as **CityJSON Sequence** in JSON Lines format (each line is a separate JSON object). Requires CityJSON `1.1`+. | true       |
| `--vertex-precision=<digits>`        | Set the number of decimal places for geometry coordinates to reduce file size (e.g., `3` for 0.001). |            |
| `--template-precision=<digits>`      | Set the precision (decimal places) for template vertices, reducing file size while retaining accuracy.|            |
| `--texture-vertex-precision=<digits>`| Define the precision for texture coordinates used in geometries (e.g., `7` for high precision).       |            |
| `--[no-]transform-coordinates`       | Transform geometry coordinates into integers when using CityJSON `1.0` to optimize file size.         | true       |
| `--replace-templates`                | Replace template geometries with explicit vertex coordinates, increasing file size but simplifying output. |            |
| `--[no-]material-defaults`           | Apply default material values (e.g., colors and textures) as defined in the CityGML standard.         | true       |
| `--html-safe`                        | Escape problematic characters to ensure the JSON can be safely embedded into HTML documents.          |            |

---

## Examples for CityJSON export options

Below are practical examples demonstrating how to use **CityJSON-specific options** in the **citydb-tool**.

---

### Export with custom precision for geometry vertices

To set the **vertex precision** to 5 decimal places to reduce file size:

```bash
citydb export cityjson -o output.json --vertex-precision=5
```

### Export with CityJSON lines format

To export data as a CityJSON Sequence in JSON Lines format (requires CityJSON version 1.1+):

```bash
citydb export cityjson -o output.json --json-lines -v 1.1
```
Each line in the output file will contain a separate JSON object.

### Transform coordinates into integers

To transform geometry coordinates into integers for optimized file size (CityJSON version 1.0):

```bash
citydb export cityjson -o output.json --transform-coordinates -v 1.0
```

### Replace templates with explicit coordinates

To replace template geometries with explicit vertex coordinates for simplified output:

```bash
citydb export cityjson -o output.json --replace-templates
```

### Export with default material values

To export CityJSON with default material values (e.g., colors and textures) defined in the CityGML standard:

```bash
citydb export cityjson -o output.json --material-defaults
```

To disable default material values:

```bash
citydb export cityjson -o output.json --no-material-defaults
```

### Export CityJSON for HTML embedding

To escape problematic characters in the JSON output for safe embedding into HTML documents:

```bash
citydb export cityjson -o output.json --html-safe
```
