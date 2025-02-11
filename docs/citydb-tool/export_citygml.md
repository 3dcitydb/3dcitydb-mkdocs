---
# title: CityGML Options
subtitle:
description: CityGML-Specific export options
# icon: material/file-xml
status: wip
tags:
  - citydb-tool
  - CityGML
  - export
---

# CityGML-Specific export options

The **CityGML** exporter in the **citydb-tool** provides options specific to exporting data in the **CityGML format**. These options allow users to customize version compatibility, apply transformations, and manage feature mappings.

---

## CityGML-Specific options

| Option                                | Description                                                                                          | Default Value |
|---------------------------------------|------------------------------------------------------------------------------------------------------|---------------|
| `-v`, `--citygml-version=<version>`   | Specify the CityGML version for the export: `3.0`, `2.0`, or `1.0`.                                  | 3.0           |
| `-x`, `--xsl-transform=<stylesheet>`  | Apply one or more XSLT stylesheets to transform the exported CityGML file. Separate multiple stylesheets with commas. |               |
| `--use-lod4-as-lod3`                  | Replace existing **LoD3** geometries with **LoD4** geometries during the export.                     |               |
| `--map-lod0-roof-edge`                | Map **LoD0 roof edge lines** onto roof surfaces for better representation in the output.             |               |
| `--map-lod1-surface`                  | Map **LoD1 multi-surfaces** onto generic thematic surfaces to simplify LoD1 geometries.              |               |

---

## Examples for CityGML export options

Below are practical examples demonstrating how to use **CityGML-specific options** in the **citydb-tool**.

---

### 1. Export with a specific CityGML version

To export data in **CityGML version 2.0** format:

```bash
citydb export citygml -o output_v2.gml --citygml-version=2.0
```

### Apply XSLT stylesheets for transformation

To apply one or more XSLT stylesheets during the export process:

=== "Linux"
    ```bash
    citydb export citygml \
           -o transformed_output.gml \
           --xsl-transform=transform1.xsl,transform2.xsl
    ```
=== "Windows"
    ```bash
    citydb export citygml ^
           -o transformed_output.gml ^
           --xsl-transform=transform1.xsl,transform2.xsl
    ```

This applies transform1.xsl and transform2.xsl sequentially to the export.

### Replace LoD3 with LoD4 geometries

To replace existing **LoD3** geometries with **LoD4** geometries during the export:

```bash
citydb export citygml -o lod3_output.gml --use-lod4-as-lod3
```

### Map LoD0 roof edges to roof surfaces

To include LoD0 roof edge lines as part of roof surfaces in the export:

```bash
citydb export citygml -o lod0_with_roofs.gml --map-lod0-roof-edge
```

### Map LoD1 multi-surfaces to generic surfaces

To restructure LoD1 multi-surfaces into thematic surfaces for better alignment:

```bash
citydb export citygml -o lod1_mapped_output.gml --map-lod1-surface
```

This simplifies LoD1 geometries for tools that require a clearer surface structure.
