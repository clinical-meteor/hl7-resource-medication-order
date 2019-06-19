import React from 'react';
import PropTypes from 'prop-types';


// import { ReactMeteorData } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';

import { CardText, Checkbox } from 'material-ui';
import { Table } from 'react-bootstrap';

import moment from 'moment-es6'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'

let styles = {
  hideOnPhone: {
    visibility: 'visible',
    display: 'table'
  },
  cellHideOnPhone: {
    visibility: 'visible',
    display: 'table',
    paddingTop: '16px',
    maxWidth: '120px'
  },
  cell: {
    paddingTop: '16px'
  }
}

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

  newRow.medication = get(medicationOrder, 'medicationReference.display');
  newRow.status = get(medicationOrder, 'status');
  newRow.identifier = get(medicationOrder, 'identifier[0].value');
  newRow.patientDisplay = get(medicationOrder, 'patient.display');
  newRow.prescriberDisplay = get(medicationOrder, 'prescriber.display');
  newRow.dateWritten = moment(get(medicationOrder, 'dateWritten')).format("YYYY-MM-DD");
  newRow.dosageInstructionText = get(medicationOrder, 'dosageInstruction[0].text');
  newRow.medicationCodeableConcept = get(medicationOrder, 'medicationCodeableConcept.text');
  newRow.barcode = get(medicationOrder, '_id');

  // newRow.asserterDisplay = get(medicationOrder, 'asserter.display');
  // newRow.clinicalStatus = get(medicationOrder, 'clinicalStatus');
  // newRow.snomedCode = get(medicationOrder, 'code.coding[0].code');
  // newRow.snomedDisplay = get(medicationOrder, 'code.coding[0].display');
  // newRow.evidenceDisplay = get(medicationOrder, 'evidence[0].detail[0].display');

  return newRow;
}

export class MedicationOrdersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      medicationOrders: []
    }
  }
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
  };

  renderCheckboxHeader(){
    if (!this.props.hideCheckboxes) {
      return (
        <th className="toggle" style={{width: '60px'}} >Checkbox</th>
      );
    }
  }
  renderCheckbox(){
    if (!this.props.hideCheckboxes) {
      return (
        <td className="toggle" style={{width: '60px'}}>
            <Checkbox
              defaultCheckbox={true}
            />
          </td>
      );
    }
  }
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <th className='actionIcons'>Actions</th>
      );
    }
  }
  renderActionIcons( medicationOrder ){
    if (!this.props.hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <td className='actionIcons' style={{width: '100px'}}>
          <FaTags style={iconStyle} onClick={this.showSecurityDialog.bind(this, medicationOrder)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, medicationOrder._id)} />  
        </td>
      );
    }
  } 


  // renderActionIconsHeader(){
  //   if (!this.props.hideActionIcons) {
  //     return (
  //       <th className='actionIcons' style={{width: '100px'}}>Actions</th>
  //     );
  //   }
  // }
  // renderActionIcons(actionIcons ){
  //   if (!this.props.hideActionIcons) {
  //     return (
  //       <td className='actionIcons' style={{minWidth: '120px'}}>
  //         <FaLock style={{marginLeft: '2px', marginRight: '2px'}} />
  //         <FaTags style={{marginLeft: '2px', marginRight: '2px'}} />
  //         <FaCode style={{marginLeft: '2px', marginRight: '2px'}} />
  //         <FaPuzzlePiece style={{marginLeft: '2px', marginRight: '2px'}} />          
  //       </td>
  //     );
  //   }
  // } 
  renderPatientNameHeader(){
    if (!this.props.hidePatientName) {
      return (
        <th className='patientDisplay'>Patient</th>
      );
    }
  }
  renderPatientName(patientDisplay ){
    if (!this.props.hidePatientName) {
      return (
        <td className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</td>
      );
    }
  }
  renderPrescriberNameHeader(){
    if (!this.props.hidePrescriberName) {
      return (
        <th className='prescriberDisplay'>Prescriber</th>
      );
    }
  }
  renderPrescriberName(prescriberDisplay ){
    if (!this.props.hidePrescriberName) {
      return (
        <td className='prescriberDisplay' style={{minWidth: '140px'}}>{ prescriberDisplay }</td>
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
  removeRecord(_id){
    console.log('Remove medication order ', _id)
    MedicationOrders._collection.remove({_id: _id})
  }
  showSecurityDialog(medicationOrder){
    console.log('showSecurityDialog', medicationOrder)

    Session.set('securityDialogResourceJson', MedicationOrders.findOne(get(medicationOrder, '_id')));
    Session.set('securityDialogResourceType', 'MedicationOrder');
    Session.set('securityDialogResourceId', get(medicationOrder, '_id'));
    Session.set('securityDialogOpen', true);
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.props.appWidth){
      if (this.props.appWidth < 768) {
        styles.hideOnPhone.visibility = 'hidden';
        styles.hideOnPhone.display = 'none';
        styles.cellHideOnPhone.visibility = 'hidden';
        styles.cellHideOnPhone.display = 'none';
      } else {
        styles.hideOnPhone.visibility = 'visible';
        styles.hideOnPhone.display = 'table-cell';
        styles.cellHideOnPhone.visibility = 'visible';
        styles.cellHideOnPhone.display = 'table-cell';
      }  
    }

    let medicationOrdersToRender = [];
    if(this.props.medicationOrders){
      if(this.props.medicationOrders.length > 0){              
        this.props.medicationOrders.forEach(function(medicationOrder){
          medicationOrdersToRender.push(flattenMedicationOrder(medicationOrder));
        });  
      }
    }


    if(medicationOrdersToRender.length === 0){
      console.log('No medication orders to render');
      // footer = <TableNoData noDataPadding={ this.props.noDataMessagePadding } />
    } else {
      for (var i = 0; i < medicationOrdersToRender.length; i++) {
        var newRow = medicationOrdersToRender[i];
  
        let rowStyle = {
          cursor: 'pointer'
        }
        if(get(medicationOrdersToRender[i], 'modifierExtension[0]')){
          rowStyle.color = "orange";
        }
  
        tableRows.push(
          <tr key={i} className="medicationOrderRow" onClick={ this.rowClick.bind('this', newRow._id)} >
  
            { this.renderCheckbox() }
            { this.renderActionIcons(newRow) }
            { this.renderIdentifier(newRow.identifier) }
  
            {/* <td className='identifier' style={ this.displayOnMobile()} >{ newRow.identifier }</td> */}
            <td className='medication' style={ this.displayOnMobile()}>{ newRow.medication }</td>
            <td className='status' style={ this.displayOnMobile()}>{ newRow.status }</td>
            { this.renderPatientName(newRow.patientDisplay ) } 
            { this.renderPrescriberName(newRow.prescriberDisplay ) } 
            {/* <td className='patientDisplay' style={ this.displayOnMobile('140px')} >{ newRow.patientDisplay }</td> */}
            {/* <td className='prescriberDisplay' style={{minWidth: '200px'}}>{ newRow.prescriberDisplay }</td> */}
            <td className='dateWritten'>{ newRow.dateWritten }</td>
            <td className='dosageInstructionText'>{ newRow.dosageInstructionText }</td>
            {/* <td><span className="barcode">{ newRow.barcode }</span></td> */}
          </tr>
        )
      }
    }

    return(
      <Table id='medicationOrdersTable' hover >
        <thead>
          <tr>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            { this.renderIdentifier() }

            {/* <th className='identifier' style={ this.displayOnMobile()} >Identifier</th> */}
            <th className='medication' style={ this.displayOnMobile()} >Medication</th>
            <th className='status' style={ this.displayOnMobile()} >Status</th>
            { this.renderPatientNameHeader() }
            { this.renderPrescriberNameHeader() }
            {/* <th className='patientDisplay' style={ this.displayOnMobile('140px')} >Patient</th> */}
            {/* <th className='prescriberDisplay' style={{minWidth: '200px'}}>Prescriber</th> */}
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
  medicationOrders: PropTypes.array,
  fhirVersion: PropTypes.string,
  showSendButton: PropTypes.bool,
  hideCheckboxes: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hidePatient: PropTypes.bool,
  hidePrescriber: PropTypes.bool,
  noDataMessagePadding: PropTypes.number,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string
};

export default MedicationOrdersTable;