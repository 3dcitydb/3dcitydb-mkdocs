---
title: Add attributes to the tiles
description: Embed feature attributes in the 3D Tiles created by citydb-3dtiler
tags:
  - citydb-3dtiler
  - attributes
---

By default, the 3D Tiles only contain the ID and the object class of each feature. You can add more attributes, such
as names, heights or generic attributes. They are shown when you click on a feature in the viewer.

![Attributes in the viewer](../assets/attribute_selection.jpg)
/// figure-caption
Feature attributes shown in the 3DCityDB-Web-Map-Client after clicking on a building.
///

## Add selected attributes

1. Run the [`advise`](../reference/cli.md#advise-command) command and open the resulting `advice.yml` file. It lists
   the available attribute names for each object class, e.g. `core_name` or `bldg_function`.
2. Run the `tile` command with the attributes you want, separated by commas without spaces:

    ```bash
    tile --attributes selected --selected-attributes core_name,bldg_function
    ```

## Add all attributes

```bash
tile --attributes all
```

!!! tip
    Adding all attributes can make the tiles considerably larger. Prefer selecting the attributes you need.

## Keep complex attributes together

Some attributes have a structure, e.g. a height with value, status and reference points. By default, each part becomes
a separate attribute. To keep them together as one JSON-like value, add `--attribute-structure nested`:

```bash
tile --attributes all --attribute-structure nested
```
