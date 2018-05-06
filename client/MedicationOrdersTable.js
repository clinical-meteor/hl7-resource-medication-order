import { Card, CardActions, CardMedia, CardText, CardTitle } from 'material-ui/Card';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { get } from 'lodash';
import { moment } from 'meteor/momentjs:moment';

flattenMedicationOrder = function(medicationOrder){
  console.log('flattenMedicationOrder', medicationOrder)

  let newRow = {
    _id: medicationOrder._id,
    status: '',
    identifier: '',
    patientDisplay: '',
    prescriberDisplay: '',
    asserterDisplay: '',
    clinicalStatus: '',
    snomedCode: '',
    snomedDisplay: '',
    evidenceDisplay: '',
    barcode: '',
    dateWritten: '',
    dosageInstructionText: ''
  };

  newRow.status = get(medicationOrder, 'status');
  newRow.identifier = get(medicationOrder, 'identifier[0].value');
  newRow.patientDisplay = get(medicationOrder, 'patient.display');
  newRow.prescriberDisplay = get(medicationOrder, 'prescriber.display');
  newRow.dateWritten = moment(get(medicationOrder, 'dateWritten')).format("YYYY-MM-DD");
  newRow.dosageInstructionText = get(medicationOrder, 'dosageInstruction[0].text');
  // newRow.asserterDisplay = get(medicationOrder, 'asserter.display');
  // newRow.clinicalStatus = get(medicationOrder, 'clinicalStatus');
  // newRow.snomedCode = get(medicationOrder, 'code.coding[0].code');
  // newRow.snomedDisplay = get(medicationOrder, 'code.coding[0].display');
  // newRow.evidenceDisplay = get(medicationOrder, 'evidence[0].detail[0].display');
  newRow.barcode = get(medicationOrder, '_id');

  return newRow;
}

export default class MedicationOrdersTable extends React.Component {

  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      medicationOrders: []
    }
    
    if(this.props.data){
      console.log('this.props.data', this.props.data)
      this.props.data.forEach(function(order){
        console.log('order', order)
        data.medicationOrders.push(flattenMedicationOrder(order));
      })
    } else {
      data.medicationOrders = MedicationOrders.find().map(flattenMedicationOrder);
    }

    if(process.env.NODE_ENV === "test") console.log("MedicationOrdersTable.data", data);
    return data;
  };


  rowClick(id){
    Session.set('medicationOrdersUpsert', false);
    Session.set('selectedMedicationOrder', id);
    Session.set('medicationOrderPageTabIndex', 2);
  };
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.medicationOrders.length; i++) {
      var newRow = this.data.medicationOrders[i];

      tableRows.push(
        <tr key={i} className="medicationOrderRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.medicationOrders[i]._id)} >

          <td className='identifier'>{ newRow.identifier }</td>
          <td className='status'>{ newRow.status }</td>
          <td className='patientDisplay'style={{minWidth: '140px'}}>{ newRow.patientDisplay }</td>
          <td className='prescriberDisplay' style={{minWidth: '200px'}}>{ newRow.prescriberDisplay }</td>
          <td className='dateWritten'>{ newRow.dateWritten }</td>
          <td className='dosageInstructionText'>{ newRow.dosageInstructionText }</td>
          {/* <td><span className="barcode">{ newRow.barcode }</span></td> */}
        </tr>
      )
    }

    return(
      <Table id='medicationOrdersTable' hover >
        <thead>
          <tr>
            <th className='identifier'>identifier</th>
            <th className='status'>status</th>
            <th className='patientDisplay'style={{minWidth: '140px'}}>patient</th>
            <th className='prescriberDisplay' style={{minWidth: '200px'}}>prescriber</th>
            <th className='dateWritten'>date written</th>
            <th className='dosageInstructionText'>dosage</th>
            {/* <th>_id</th> */}
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>
    );
  }
}


ReactMixin(MedicationOrdersTable.prototype, ReactMeteorData);
