---
title: Adjust the output
description: Control where and how citydb-3dtiler writes the 3D Tiles
tags:
  - citydb-3dtiler
  - 3D Tiles
---

This page shows how to change where the tiles are written, how they are split up, and how they fit your viewer.

## Write the tiles to a subfolder

By default, the tiles are written directly to the working folder. To use a subfolder instead, add `--output-folder`.
The folder is created if it does not exist.

```bash
tile --output-folder tiles
```

## Create one tileset per object class

To show, hide or style object classes separately in the viewer, create a separate tileset for each class. Add
`--separate-tilesets objectclass` *before* the command, and run `advise` with the same option first:

```bash
<connection> --separate-tilesets objectclass advise
<connection> --separate-tilesets objectclass tile
```

Each tileset is written to a subfolder named after its object class, e.g. `Building` or `RoofSurface`.

!!! warning "Known issues"
    - If the `advice.yml` file in the working folder was created *without* `--separate-tilesets`, the `tile` command
      fails with `KeyError: 'objectclass_recommendations'`. Run `advise` again with the option, or delete the file.
    - If the database contains features that only have implicit geometries, e.g. trees in many datasets, `advise`
      fails with `TypeError: int() argument must be ... not 'NoneType'`. Separate tilesets cannot be created for such
      databases yet.

## Create tiles for older viewers

`citydb-3dtiler` creates 3D Tiles `1.1` by default. If your viewer only supports 3D Tiles `1.0`, use:

```bash
tile --tiles-version 1.0
```

## Fix floating or sunken features

If the features float above the terrain of your viewer or sink into it, move them up or down by a number of meters:

```bash
tile --vertical-offset=-2.5
```

!!! tip
    Height differences often come from different height references, e.g. heights above sea level in the city model
    and heights above the ellipsoid in the viewer. Try a few values to find the right offset for your data.
