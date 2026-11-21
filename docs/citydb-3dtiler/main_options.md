---
# title: Docker
description: citydb-3dtiler CLI Overview
tags:
  - CLI
  - citydb-3dtiler
  - main-options
---

# Main Options

??? tip "Check all the subcommands and the options in one diagram"
    If you want to see all the subcommands and the options with possible arguments in one diagram, visit this page : [citydb-3dtiler Functionality Matrix](includes/functionality_matrix.md){:target="_blank"}

### --tiler-app

If the file name of the tiler application is different, you can use this option. 

- Default value is "pg2b3dm".

??? info "What is planned for this option?"
    We plan to enable the use of the i3dmExport and/or py3dtiles applications with this option in future developments. However, currently only the pg2b3dm application has been tested and is ready for use.

### --tilers-path

If you want to use a specific version of pg2b3dm that you have determined, you must put this specific version into another folder and then specify the folder path using this option. This way, you can make the application work with any version you want.

- Default value is "tiler_app".

??? Warning "Some (tile) options might not work in this scenario"
    Since the options of the pg2b3dm application may vary depending on the version, you may not be able to use every argument.

### --ignore-thematic-surfaces

This option used to ignore the thematic surfaces that descend from AbstractThematicSurface, such as WallSurface, WindowSurface etc.

