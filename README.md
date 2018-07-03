## clinical:hl7-resource-medication-order


#### Licensing  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)


#### Integration & Verification Tests  
[![CircleCI](https://circleci.com/gh/clinical-meteor/hl7-resource-medication-order/tree/master.svg?style=svg)](https://circleci.com/gh/clinical-meteor/hl7-resource-medication-order/tree/master)


#### API Reference  
The resource in this package implements Medication Order resource schema, specified at [https://www.hl7.org/fhir/DSTU2/medicationorder.html](https://www.hl7.org/fhir/DSTU2/medicationorder.html). 



#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-medication-order

# to initialize default data
INITIALIZE=true meteor
````


#### Example   

```js
var prescription = {}
MedicationOrders.insert(prescription);
```


#### Extending the Schema

```js
ExtendedMedicationOrderSchema = new SimpleSchema([
  MedicationOrderSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
MedicationOrders.attachSchema( ExtendedMedicationOrderSchema );
```



#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).



#### Acknowledgements     

Many thanks to DxRx Medical, NY Methodist Hospital, and the New Orleans Pharmacy Museum for research and studies conducted in support of this library.  