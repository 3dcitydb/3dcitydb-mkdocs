# Advisement Classes

This UML diagram shows the the Classes used to generate the Advice.yml file.

<!--
!include https://raw.githubusercontent.com/tum-gis/citydb-3dtiler/main/docs/card-style.puml
-->


```puml
@startuml
title UML Class Diagram 
header
<font color=red size=10>Last Check : 30.06.2026</font>
endheader
'footer
'<font color=blue size=9>30.06.2026</font>
'endfooter

'!include card-style.puml

namespace advs <<Advise>> {
  abstract class MutableMapping {
  }
  abstract class TransformedDict {
    store : dict
    ---
    __getitem__()
    __setitem__()
    __delitem__()
    __iter__()
    __len__()
    __repr__()
    _keytransform()
  }
  TransformedDict -up-|> MutableMapping
  class Advisement {
    CommandSet : String
    MaximumFeatures : Integer
    ObjectClasses : List
    CRSCode : Integer
    ---
    _keytransform()
  }
  Advisement -up-|> TransformedDict
  class ObjectClass {
    name : String
    objectclass_recommendations : Integer
  }
  ObjectClass -up-> TransformedDict
  class ObjectClassRecommendations {
    MaximumFeatures : Integer
  }
  ObjectClassRecommendations -up-|> TransformedDict
}
@enduml
```
