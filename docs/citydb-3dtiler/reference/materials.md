---
title: Materials file
description: Format of the citydb-3dtiler materials CSV file
tags:
  - citydb-3dtiler
  - materials
  - reference
---

The materials file defines the colors of the features. `citydb-3dtiler` uses `materials_for_features.csv` from the
working folder, a file given with `--custom-style`, or, if neither exists, its
[built-in default](https://github.com/tum-gis/citydb-3dtiler/blob/main/materials_for_features/materials_for_features.csv){target="blank"}.

## Format

- CSV with a header row, using commas as separator
- No quotes around values
- All columns must be present in the order listed below

![Sample of the materials table](../assets/sample_from_material_table.png)
/// figure-caption
Sample of the materials table in the `materials_for_features.ods` spreadsheet.
///

## Columns

| Column                                        | Description                                                                         | Example      |
|-----------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `namespace_of_classname`                      | Namespace alias of the object class.                                                | `bldg`       |
| `classname`                                   | Object class name, or `anything_else` for the default material.                     | `Building`   |
| `namespace_of_property`                       | Namespace alias of the attribute. Property-based rows only.                         | `gen`        |
| `property_name`                               | Name of the attribute. Property-based rows only.                                    | `OBJEKTART`  |
| `column_name_of_property_value`               | `PROPERTY` table column holding the value, e.g. `val_string`, `val_int`, `val_double`. Property-based rows only. | `val_string` |
| `property_value`                              | Attribute value. Property-based rows only.                                          | `Hochhaus`   |
| `emmisive_color`                              | Emissive color.                                                                     |              |
| `pbr_metallic_roughness_base_color`           | Base color as RGBA hex code.                                                        | `#0065bdff`  |
| `pbr_metallic_roughness_metallic_roughness`   | Metallic and roughness factors as hex code.                                         | `#000000`    |
| `pbr_specular_glossiness_diffuse_color`       | Diffuse color of the specular-glossiness model.                                     |              |
| `pbr_specular_glossiness_specular_glossiness` | Specular and glossiness factors of the specular-glossiness model.                  |              |

The last two digits of an RGBA hex code are the opacity, from `00` (transparent) to `ff` (opaque). Transparency is
only applied with `tile --transparency blend` or `mask`.

## Row types

| Row type         | Filled columns                                  | Used by style mode                       |
|------------------|-------------------------------------------------|------------------------------------------|
| Default material | `classname` = `anything_else`, colors           | `objectclass-based`, `no-style`          |
| Object class     | `namespace_of_classname`, `classname`, colors   | `objectclass-based`, `property-based`    |
| Attribute value  | All class and property columns, colors          | `property-based`                         |

## Example

```csv
namespace_of_classname,classname,namespace_of_property,property_name,column_name_of_property_value,property_value,emmisive_color,pbr_metallic_roughness_base_color,pbr_metallic_roughness_metallic_roughness,pbr_specular_glossiness_diffuse_color,pbr_specular_glossiness_specular_glossiness
,anything_else,,,,,,#ffff00ff,#000000,,
bldg,Building,,,,,,#0065bdff,#000000,,
bldg,Building,gen,OBJEKTART,val_string,Hochhaus,,#e37222ff,#000000,,
con,WindowSurface,,,,,,#00ffff40,#000000,,
```
