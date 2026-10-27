---
# title: Advise Command
description: Advise Command
tags:
  - YAML
  - citydb-3dtiler
  - Advice
---

# advise Command

The advise command creates a report file in YAML format by examining the existing data in the database. This report file lists the main options used by the user in the command, the feature types in the database, the attributes of the features, and the recommended number of features per tile for conversion to the 3DTiles format. Unless otherwise specified by the user, this value is used during the tiling process.

## --help (-h)

If you use the help option after the advise command, you will see the usage syntax of that command which is like below.

```bash
advise [-h] [--ignore-thematic-surfaces] [-o [Output File Name]]
```

## --ignore-thematic-surfaces

This option used to ignore the thematic surfaces (all the surfaces descend from AbstractThematicSurface) in the advice.yaml file. So, that means only the volumetric objects (and some other space boundaries) will be listed and reported. Others, like WindowSurface, RoofSurface etc., will be ignored.

- Example : `--ignore-thematic-surfaces`

## --output-file (-o)

This option can be used if the user request to use a custom name for the advice file. Both of the file name and the file extension must be written.

- Example : `--output-file paris_2024.yml`