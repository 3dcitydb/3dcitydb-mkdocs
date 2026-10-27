# Test Procedures

## Test Procedures Diagram

This diagram shows the list of test procedures to be carried out in order to perform an internal quality check or to prevent function loss during developments.

```puml
@startmindmap

title Test Procedure of citydb-3dtiler application
header
<font color=indianred size=12><b>Last Check : 02.07.2026</b></font>
<font color=indianred size=12><b>Expected Release : 0.9.4</b></font>
endheader

'!include card-style.puml

skinparam padding 2

* Tests

** help <&check>

** advise
*** for single tileset <&check>
*** for separate tilesets <&check>

** (filter options)
***: filter by id(s) <&check>
"--id _20210907161723_295,_20210907161723_1"
",_20210907161723_220"
;
***: filter by TypeName(s) (ObjectClass) <&check>
"--type-name WallSurface,OuterFloorSurface,OuterCeilingSurface"
;
***: limit the total feature number <&check>
"--limit 1000"
;
***: use start-index <&check>
"--start-index 200000"
;
****: use limit and start-index together <&check>
"--limit 100000 --start-index 200000"
;
****: use type-name, limit and start-index together <&check>
"--type-name WallSurface,OuterFloorSurface,OuterCeilingSurface,RoofSurface"
"--limit 100000 --start-index 200000"
;
***: use bbox filtering with CRS code <&check>
"--bbox 564822,5932935,566924,5934737,25832"
;
****: use bbox filtering without CRS code <&check>
"--bbox 564822,5932935,566924,5934737"
;
****: use bbox filtering in intersects-precise mode <&check>
"--bbox-mode intersects-precise"
;
****: use bbox filtering with contains mode <&check>
"--bbox-mode contains"
;
****: use bbox filtering with contains-precise mode <&check>
"--bbox-mode contains-precise"
;
***: use filter argument to use CQL2 Expressions <&check>
"--filter gen_grundhoehenn > 20 AND gen_grundflaeche2d > 30"
"--attributes selected "
"--selected-attributes gen_grundhoehenn,gen_grundflaeche2d"
;
***: use sql-filter <&check>
"gen_citygrid_unitid.pro_value like '2021%'"
"AND st_dwithin(st_geomfromtext('POINT(566924 5934737)',25832), gmdt.geometry, 2000)"
"--attributes selected \"
"--selected-attributes gen_citygrid_unitid"
;

** tile

***: Single Tileset
<font color=gray><i>tile</i></font>
;
****: Custom Color Set 
<font color=gray><i>tile --custom-style tum_colors.csv</i></font>
;
****: Property-based Color Set
<font color=gray><i>tile --style-mode property-based</i></font>
;
****: Transparency Mode
<font color=gray><i>tile --transparency blend</i></font>
;
****: To a Custom Folder
<font color=gray><i>tile --output-folder</i></font>
;
****: No Style Mode
<font color=gray><i>tile --style-mode no-style</i></font>
;
***: For Separate Tilesets (objectclass)
<font color=gray><i>--separate-tilesets objectclass \ </i></font>
<font color=gray><i>tile</i></font>
;
****: Property-based Color Set
<font color=gray><i>--separate-tilesets objectclass \ </i></font>
<font color=gray><i>tile \ </i></font>
<font color=gray><i>--style-mode property-based</i></font>
;
*****: Selected Attributes in tabular format
<font color=gray><i>--separate-tilesets objectclass \ </i></font>
<font color=gray><i>tile \ </i></font>
<font color=gray><i> --style-mode property-based \ </i></font>
<font color=gray><i>--attributes selected \ </i></font>
<font color=gray><i>--selected-attributes  core_name,gen_objektart</i></font>
;
*****: Selected Attributes in nested/json format
<font color=gray><i>--separate-tilesets objectclass \ </i></font>
<font color=gray><i>tile \ </i></font>
<font color=gray><i>--style-mode property-based \ </i></font>
<font color=gray><i>--attributes selected \ </i></font>
<font color=gray><i>--attribute-structure nested \ </i></font>
<font color=gray><i>--selected-attributes core_name,gen_objektart,con_height</i></font>
;
*****: All Attributes in nested/json format
<font color=gray><i> --separate-tilesets objectclass \ </i></font>
<font color=gray><i>tile \ </i></font>
<font color=gray><i>--style-mode property-based \ </i></font>
<font color=gray><i>--attributes all \ </i></font>
<font color=gray><i>--attribute-structure nested</i></font>
;
*****: Separate Tilesets & Property-based Color Set & All Attributes in nested/json format
<font color=gray><i>--separate-tilesets objectclass tile \ </i></font>
<font color=gray><i>tile \ </i></font>
<font color=gray><i>--style-mode property-based \ </i></font>
<font color=gray><i>--attributes selected \ </i></font>
<font color=gray><i>--attribute-structure nested \ </i></font>
<font color=gray><i>--tiles-version 1.0 \ </i></font>
<font color=gray><i>--vertical-offset 3.5</i></font>
;



legend left
Recommended Datasets:
  Samplycity : https://muratkendir.github.io/samplycity/
  Hamburg LoD3 (CG2) : https://suche.transparenz.hamburg.de/dataset/3d-gebaeudemodell-lod3-0-hh-hamburg17
  Switzerland (CG2) : https://www.swisstopo.admin.ch/de/landschaftmodell-swissbuildings3d-3-0-beta#swissBUILDINGS3D-3.0-Beta---Download
endlegend

@endmindmap
```

## Previous Tests

The following list contains the links of the previous tests carried out by following the test procedures.
Test procedures are usually handled before publishing a new release.

- Before release 0.9.3
    - [Tests done with Swisstopo dataset](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#bern_full_procedure){:target="_blank"}
- Before release 0.9.2
    - [Tests done for SamplyCity Dataset](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#test_campaign_03_samplycity){:target="_blank"}
- Test with Hamburg LoD3 dataset
    - [Hamburg Buildings LoD3](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#test_campaign_02_hamburg){:target="_blank"}
- Test with Melbourne dataset
    - [Melbourne Buildings & Roads](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#tests_for_3dtiler_melbourne){:target="_blank"}

