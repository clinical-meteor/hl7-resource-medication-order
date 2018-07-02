##clinical:hl7-resource-medication-order

HL7 FHIR Resource - MedicationOrder


===============================
#### Conformance Statement  

The resource in this package implements the FHIR Patient Resource schema provided at  [https://www.hl7.org/fhir/medication-order.html](https://www.hl7.org/fhir/medication-order.html).  


===============================
#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-medication-order

# to initialize default data
INITIALIZE=true meteor
````

===============================
#### Example   

```js
var prescription = {}
MedicationOrders.insert(prescription);
```

===============================
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



===============================
#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).




===============================
#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
