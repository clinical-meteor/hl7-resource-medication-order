import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { get } from 'lodash';
import { moment } from 'meteor/momentjs:moment';
import PropTypes from 'prop-types';
import { Card, CardActions, CardMedia, CardText, CardTitle, Toggle } from 'material-ui';
import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';

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

  newRow.medication = get(medicationOrder, 'medicationReference.display');
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
  };

  renderToggleHeader(){
    if (!this.props.hideToggle) {
      return (
        <th className="toggle">Toggle</th>
      );
    }
  }
  renderToggle(){
    if (!this.props.hideToggle) {
      return (
        <td className="toggle" style={{width: '60px'}}>
            <Toggle
              defaultToggled={true}
            />
          </td>
      );
    }
  }
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <th className='actionIcons' style={{minWidth: '120px'}}>Actions</th>
      );
    }
  }
  renderActionIcons(actionIcons ){
    if (!this.props.hideActionIcons) {
      return (
        <td className='actionIcons' style={{minWidth: '120px'}}>
          <FaLock style={{marginLeft: '2px', marginRight: '2px'}} />
          <FaTags style={{marginLeft: '2px', marginRight: '2px'}} />
          <FaCode style={{marginLeft: '2px', marginRight: '2px'}} />
          <FaPuzzlePiece style={{marginLeft: '2px', marginRight: '2px'}} />          
        </td>
      );
    }
  } 
  renderPatientNameHeader(){
    if (!this.props.hidePatient) {
      return (
        <th className='patientDisplay'>patient</th>
      );
    }
  }
  renderPatientName(patientDisplay ){
    if (!this.props.hidePatient) {
      return (
        <td className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</td>
      );
    }
  }
  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <th className='identifier'>Identifier</th>
      );
    }
  }
  renderIdentifier(identifier ){
    if (!this.props.hideIdentifier) {
      return (
        <td className='identifier'>{ identifier }</td>
      );
    }
  } 
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.medicationOrders.length; i++) {
      var newRow = this.data.medicationOrders[i];

      tableRows.push(
        <tr key={i} className="medicationOrderRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.medicationOrders[i]._id)} >

          { this.renderToggle() }
          { this.renderActionIcons() }
          { this.renderIdentifier(newRow.identifier) }

          {/* <td className='identifier' style={ this.displayOnMobile()} >{ newRow.identifier }</td> */}
          <td className='medication' style={ this.displayOnMobile()}>{ newRow.medication }</td>
          <td className='status' style={ this.displayOnMobile()}>{ newRow.status }</td>
          { this.renderPatientName(newRow.patientDisplay ) } 
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
            { this.renderToggleHeader() }
            { this.renderActionIconsHeader() }
            { this.renderIdentifier() }

            {/* <th className='identifier' style={ this.displayOnMobile()} >Identifier</th> */}
            <th className='medication' style={ this.displayOnMobile()} >Medication</th>
            <th className='status' style={ this.displayOnMobile()} >Status</th>
            { this.renderPatientNameHeader() }
            {/* <th className='patientDisplay' style={ this.displayOnMobile('140px')} >Patient</th> */}
            <th className='prescriberDisplay' style={{minWidth: '200px'}}>Prescriber</th>
            <th className='dateWritten' style={{minWidth: '100px'}}>Date Written</th>
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
  showSendButton: PropTypes.bool,
  hideToggle: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hidePatient: PropTypes.bool,
  noDataMessagePadding: PropTypes.number
};
ReactMixin(MedicationOrdersTable.prototype, ReactMeteorData);
export default MedicationOrdersTable;