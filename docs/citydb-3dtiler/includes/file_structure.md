# Folders & Files & Classes / Functions

Following diagram shows which functions/classes are stored in which files & folder.

```puml
@startmindmap
title Folder & File Structure
right header
<font color=red size=10> Last Check : 02.11.2026</font>
endheader
*[#silver] citydb-3dtiler
**[#silver] io_tools
***[#ghostwhite] folder.py
****_ <&calculator> create_folder
****_ <&calculator> check_custom_materials
****_ <&calculator> check_file_in
***[#ghostwhite] pg_plpgsql.py
****_ <&calculator> copy_materials
****_ <&calculator> drop_cascade_if_exists
***[#ghostwhite] pg_sql.py
****_ <&calculator> read_sql_file
****_ <&calculator> append_pro_value
***[#ghostwhite] tiles.py
****_ <&calculator> selected_attributes_to_list
****_ <&calculator> generate_tiles
***[#ghostwhite] yaml.py
****_ <&calculator> read_yaml
****_ <&calculator> write_yaml
**[#silver] classes
***[#ghostwhite] advisement.py
****_ <&briefcase> AbstractTransformedDict
****_ <&briefcase> Advice
****_ <&briefcase> Namespace
****_ <&briefcase> ObjectClass
****_ <&briefcase> ObjectClassRecommendations
***[#ghostwhite] sql_blocks.py
****_ <&briefcase> QueryBlock 
****_ <&briefcase> QueryBlocks
****_ <&briefcase> CombinationElement
****_ <&briefcase> and others (see Class Diagrams)
**[#silver] database
***[#ghostwhite] pg_connection.py
****_ <&calculator> pg_show_details
****_ <&calculator> pg_establish
****_ <&calculator> pg_create_session
****_ <&calculator> pg_check_connection
****_ <&calculator> create_materialized_view
****_ <&calculator> index_materialized_view
****_ <&calculator> get_query_results
****_ <&calculator> run_sql
**[#silver] instances
***[#ghostwhite] in_advise.py
****_ <&droplet> geometry_statistics
****_ <&droplet> geometry_statistics_wo_thmtcs
****_ <&droplet> recommended_max_features_per_tile
****_ <&droplet> recommended_max_features_per_tile_wo_thematics
***[#ghostwhite] kernel.py
****_ <&droplet> krnl_query
***[#ghostwhite] material.py
****_ <&droplet> no_styling_addition
****_ <&droplet> objectclass_falldown_addition
****_ <&droplet> properties_falldown_addition
****_ <&droplet> existing_app_falldown_addition
****_ <&droplet> objectclass_riseup_addition
****_ <&droplet> properties_riseup_addition
***[#ghostwhite] nested_attributes.py
****_ <&droplet> qry_blck_pro_nstd_shll1
****_ <&droplet> qry_blck_pro_nstd_shll2
****_ <&droplet> qry_blck_pro_nstd_add
****_ <&droplet> cmb_pro_nstd
**[#ghostwhite] <&calculator> citydb-3dtiler.py
***_ <&calculator> help
***_ <&calculator> main
**[#ghostwhite] <&calculator> advise_main.py
***_ <&calculator> advise
**[#ghostwhite] <&calculator> tile_main.py
***_ <&calculator> selected_attributes_to_list
***_ <&calculator> create_tileset
***_ <&calculator> tile
**[#ghostwhite] <&calculator> default_paths.py
***_ <&calculator> get_base_path
***_ <&calculator> get_base_path
legend left
    Icons:
        Main File : <&home>
        Functions : <&calculator>
        Classes/Dictionaries : <&briefcase>
        Class Instances : <&droplet>
    Box Colors:
        Folders = Gray
        Files = White
    <font color=gray>Implicit meanings and contexts reserved for AI Tools:</font>
    <font size=8 color=gray>This diagram lists the folders, Python files, and the functions, classes, and class instances they contain, of the citydb-3dtiler app running in a CLI, using the MindMap notation of PlantUML.</font>
    <font size=8 color=gray>Boxes in ghostwhite color represent the files included in the app, named with their file extension (.py).</font>
    <font size=8 color=gray>Boxes in silver color represent the folders included in the app.</font>
    <font size=8 color=gray>All branches without a box — coded with an underscore in PlantUML mindmap notation — represent classes, functions, or class instances.</font>
    <font size=8 color=gray>All the functions are shown with a calculator icon.</font>
    <font size=8 color=gray>All the classes are shown with the briefcase icon.</font>
    <font size=8 color=gray>All class instances (classes defined within the application itself) are shown with a droplet icon.</font>
endlegend
@endmindmap
```
