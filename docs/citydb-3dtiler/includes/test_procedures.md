# Test Procedures

## Test Procedures Diagram

This diagram shows the list of test procedures to be carried out in order to perform an internal quality check or to prevent function loss during developments.

```puml
@startmindmap
title Test Procedure of citydb-3dtiler application
header
<font color=indianred size=12><b>Last Check : 03.11.2026</b></font>
<font color=indianred size=12><b>Expected Release : 0.9.5</b></font>
<font color=indianred size=12><b>Checks made on Tokio-CityGML3 (UDX)</b></font>
endheader

'!include card-style.puml

* Tests
** help <&check>
** advise
*** advise (T001) <&check>
*** --ignore-thematic-surfaces advise (T002 & T004) <&check>
** (filter options)
***: filter by id and type-name (T005) <&check>
***: filter by limit and start-index together (T006) <&check>
***: filter by bbox filtering with CRS code (T007) <&check>
***: filter by bbox filtering with contains-precise mode (T008) <&check>
***: filter by CQL2 Expressions (--filter / T009) <&check>
***: use sql-filter (T010) <&check>
** tile
***: tile (T003) <&check>
****: Custom Color Set (T014) <&check>
****: Transparency Mode (T014) <&check>
****: To a Custom Folder (T013) <&check>
****: No Style Mode (T013) <&check>
****: All Attributes in tabular format (T016 - !Failed) <&thumb-down>
****: Selected Attributes in tabular format (T017) <&check>
****: Selected Attributes in nested/json format (T018) <&check>
****: Property-based Color Set (T015) <&check>
****: Selected Attributes in nested format (T018) <&check>
****: Vertical Offsets from CSV file (T019) <&checked>
***: Separate Tilesets (objectclass T011) <&check>
***: Separate Tilesets (namespace T012) <&check>


legend left
Recommended Datasets:
  Samplycity : https://muratkendir.github.io/samplycity/
  Tokio CityGML3 UDX : https://www.geospatial.jp/ckan/dataset/plateau-tokyo-takeshiba-cg3-sample
  Hamburg LoD3 (CG2) : https://suche.transparenz.hamburg.de/dataset/3d-gebaeudemodell-lod3-0-hh-hamburg17
  Switzerland (CG2) : https://www.swisstopo.admin.ch/de/landschaftmodell-swissbuildings3d-3-0-beta#swissBUILDINGS3D-3.0-Beta---Download
endlegend

@endmindmap
```

## Previous Tests

The following list contains the links of the previous tests carried out by following the test procedures.
Test procedures are usually handled before publishing a new release.

- Before release 0.9.5
    - [Tests done with Tokio Takeshiba dataset](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#tokio_cg3_2023){:target="_blank"}
- Before release 0.9.3
    - [Tests done with Swisstopo dataset](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#bern_full_procedure){:target="_blank"}
- Before release 0.9.2
    - [Tests done for SamplyCity Dataset](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#test_campaign_03_samplycity){:target="_blank"}
- Test with Hamburg LoD3 dataset
    - [Hamburg Buildings LoD3](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#test_campaign_02_hamburg){:target="_blank"}
- Test with Melbourne dataset
    - [Melbourne Buildings & Roads](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/#tests_for_3dtiler_melbourne){:target="_blank"}

