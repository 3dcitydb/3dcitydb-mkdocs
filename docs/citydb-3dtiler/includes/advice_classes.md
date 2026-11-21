# Advice Classes

This UML diagram shows the the Classes used to generate the Advice.yml file.

<!--
!include https://raw.githubusercontent.com/3dcitydb/citydb-3dtiler/main/docs/card-style.puml
-->


```puml
@startuml
title UML Class Diagram 
header
<font color=red size=10>Last Check : 29.10.2026</font>
endheader

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
  class Advice {
    CommandSet : String
    MaximumFeatures : Integer
    ObjectClasses : List
    CRSCode : Integer
    ---
    _keytransform()
  }
  Advice -up-|> TransformedDict
  Advice *- "*" Namespace : namespaces
  
  class Namespace {
    alias : String
    recommended_mft : Integer
  }
  Namespace -up-|> TransformedDict
  Namespace *- "*" ObjectClass : objectclasses

  class ObjectClass {
    name : String
    recommended_mft : Integer
    properties : Dictionary
  }
  ObjectClass -up-|> TransformedDict
  
  'class ObjectClassRecommendations {
  '  MaximumFeatures : Integer
  '}
  'ObjectClassRecommendations -up-|> TransformedDict
}
@enduml
```
