---
title: Change colors and transparency
description: Customize the colors and materials of the 3D Tiles created by citydb-3dtiler
tags:
  - citydb-3dtiler
  - styling
  - materials
---

By default, `citydb-3dtiler` colors each feature by its object class, e.g. roofs orange and walls light blue. You can
change these colors, color features by an attribute value, and make features transparent.

## Use your own colors

1. Download the [default materials file](https://github.com/3dcitydb/citydb-3dtiler/blob/main/materials_for_features/materials_for_features.csv){target="blank"}
   and save it as `materials_for_features.csv` in your working folder.
2. Open the file in a text editor or spreadsheet program and change the color in the
   `pbr_metallic_roughness_base_color` column of the object classes you want to recolor. Colors are RGBA hex codes,
   e.g. `#ff0000ff` for opaque red.
3. Save the file as CSV with commas as separator and without quotes around the values.
4. Run the `tile` command as usual. `citydb-3dtiler` picks up the file from the working folder automatically.

```csv title="materials_for_features.csv (excerpt)"
namespace_of_classname,classname,namespace_of_property,property_name,column_name_of_property_value,property_value,emmisive_color,pbr_metallic_roughness_base_color,pbr_metallic_roughness_metallic_roughness,pbr_specular_glossiness_diffuse_color,pbr_specular_glossiness_specular_glossiness
,anything_else,,,,,,#ffff00ff,#000000,,
bldg,Building,,,,,,#0065bdff,#000000,,
con,RoofSurface,,,,,,#e37222ff,#000000,,
```

!!! tip
    To keep several color schemes, give the files different names and select one with
    `tile --custom-style my_colors.csv`. The file must be in the working folder.

The [`materials_for_features.ods`](https://github.com/3dcitydb/citydb-3dtiler/blob/main/materials_for_features/materials_for_features.ods){target="blank"}
spreadsheet is a convenient alternative for editing: it previews the colors and can be exported as CSV. See the
[materials reference](../reference/materials.md) for all columns.

## Color features by an attribute value

You can give features different colors depending on the value of an attribute, e.g. different colors for different
building types.

1. Add a row to your materials file for each value. Fill in the namespace and name of the attribute, the column that
   holds its value (`val_string` for text, `val_int` for whole numbers, `val_double` for decimals), and the value:

    ```csv
    brid,Bridge,brid,class,val_string,1000,,#00ff00ff,#000000,,
    ```

2. Run the `tile` command with property-based styling:

    ```bash
    tile --style-mode property-based
    ```

Features without a matching attribute value keep the color of their object class.

## Make features transparent

1. Set the opacity in the last two digits of the color, from `00` (invisible) to `ff` (opaque). For example,
   `#00ffff40` is a light, mostly transparent cyan.
2. Run the `tile` command with blended transparency, because transparency is ignored by default:

    ```bash
    tile --transparency blend
    ```

![Transparent materials](../assets/transparency_sample.jpg)
/// figure-caption
Traffic areas rendered with transparent materials using `--transparency blend`.
///

## Use one color for everything

To create tiles without any coloring, e.g. to style them later in the viewer, use:

```bash
tile --style-mode no-style
```

All features then get the color of the `anything_else` row in the materials file.
