import { Card, CardActions, CardMedia, CardText, CardTitle } from 'material-ui/Card';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { get } from 'lodash';
import { moment } from 'meteor/momentjs:moment';
import PropTypes from 'prop-types';

flattenMedicationOrder = function(medicationOrder){
  // console.log('flattenMedicationOrder', medicationOrder)

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
    dosageInstructionText: '',
    medicationCodeableConcept: ''
  };

  newRow.status = get(medicationOrder, 'status');
  newRow.identifier = get(medicationOrder, 'identifier[0].value');
  newRow.patientDisplay = get(medicationOrder, 'patient.display');
  newRow.prescriberDisplay = get(medicationOrder, 'prescriber.display');
  newRow.dateWritten = moment(get(medicationOrder, 'dateWritten')).format("YYYY-MM-DD");
  newRow.dosageInstructionText = get(medicationOrder, 'dosageInstruction[0].text');
  newRow.medicationCodeableConcept = get(medicationOrder, 'medicationCodeableConcept.text');
  // newRow.asserterDisplay = get(medicationOrder, 'asserter.display');
  // newRow.clinicalStatus = get(medicationOrder, 'clinicalStatus');
  // newRow.snomedCode = get(medicationOrder, 'code.coding[0].code');
  // newRow.snomedDisplay = get(medicationOrder, 'code.coding[0].display');
  // newRow.evidenceDisplay = get(medicationOrder, 'evidence[0].detail[0].display');
  newRow.barcode = get(medicationOrder, '_id');

  return newRow;
}

export class MedicationOrdersTable extends React.Component {
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
      // console.log('this.props.data', this.props.data)
      this.props.data.forEach(function(order){
        // console.log('order', order)
        data.medicationOrders.push(flattenMedicationOrder(order));
      })
    } else {
      data.medicationOrders = MedicationOrders.find().map(flattenMedicationOrder);
    }

    if(process.env.NODE_ENV === "test") console.log("MedicationOrdersTable.data", data);
    return data;
  };
  displayOnMobile(width){
    let style = {};
    if(['iPhone'].includes(window.navigator.platform)){
      style.display = "none";
    }
    if(width){
      style.width = width;
    }
    return style;
  }

  rowClick(id){
    Session.set('medicationOrdersUpsert', false);
    Session.set('selectedMedicationOrder', id);
    Session.set('medicationOrderPageTabIndex', 2);
  }
  renderPatientHeader(){
    if (!this.props.hidePatient) {
      return (
        <th className="patient">Patient</th>
      );
    }
  }
  renderPatient(medicationOrders){
    if (!this.props.hidePatient) {
      
      return (
        <td className='patient'>{ get(medicationOrders, 'patient.display') }</td>       );
    }
  }
  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <th className="identifier">Identifier</th>
      );
    }
  }
  renderIdentifier(allergyIntolerance){
    if (!this.props.hideIdentifier) {
      
      return (
        <td className='identifier'>{ get(allergyIntolerance, 'identifier[0].value') }</td>       );
    }
  }
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.medicationOrders.length; i++) {
      var newRow = this.data.medicationOrders[i];

      tableRows.push(
        <tr key={i} className="medicationOrderRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.medicationOrders[i]._id)} >

          <td className='medicationCodeableConcept' style={ this.displayOnMobile()} >{ newRow.medicationCodeableConcept }</td>
          { this.renderIdentifier(this.data.medicationOrders[i]) }
          {/* <td className='identifier' style={ this.displayOnMobile()} >{ newRow.identifier }</td> */}
          <td className='status' style={ this.displayOnMobile()}>{ newRow.status }</td>
          { this.renderPatient(this.data.medicationOrders[i]) }
          {/* <td className='patientDisplay' style={ this.displayOnMobile('140px')} >{ newRow.patientDisplay }</td> */}

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
            <th className='medicationCodeableConcept' style={ this.displayOnMobile()} >Medication</th>
            { this.renderIdentifierHeader() }
            {/* <th className='identifier' style={ this.displayOnMobile()} >Identifier</th> */}
            <th className='status' style={ this.displayOnMobile()} >Status</th>
            {/* <th className='patientDisplay' style={ this.displayOnMobile('140px')} >Patient</th> */}
            { this.renderPatientHeader() }
            <th className='prescriberDisplay' style={{minWidth: '200px'}}>Prescriber</th>
            <th className='dateWritten'>Date Written</th>
            <th className='dosageInstructionText'>Dosage</th>
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

MedicationOrdersTable.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,

  hideToggle: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideDate: PropTypes.bool,
  hidePatient: PropTypes.bool,
 
  limit: PropTypes.number,
  query: PropTypes.object,
  patient: PropTypes.string,
  patientDisplay: PropTypes.string,
  sort: PropTypes.string
  // onPatientClick: PropTypes.func
};
ReactMixin(MedicationOrdersTable.prototype, ReactMeteorData);
export default MedicationOrdersTable;