import { CardText, CardTitle } from 'material-ui/Card';
import {Tab, Tabs} from 'material-ui/Tabs';
import { GlassCard, VerticalCanvas, Glass } from 'meteor/clinical:glass-ui';

import MedicationOrderDetail from './MedicationOrderDetail';
import MedicationOrdersTable from './MedicationOrdersTable';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

export class MedicationOrdersPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      state: {
        isLoggedIn: false
      },
      tabIndex: Session.get('medicationOrderPageTabIndex'),
      medicationOrderSearchFilter: Session.get('medicationOrderSearchFilter'),
      currentMedicationOrder: Session.get('selectedMedicationOrder')
    };

    if (Meteor.user()) {
      data.state.isLoggedIn = true;
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    Session.set('medicationOrderPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedMedicationOrder', false);
    Session.set('medicationOrderUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In MedicationOrdersPage render');
    return (
      <div id='medicationOrdersPage'>
        <VerticalCanvas>
          <GlassCard height='auto'>
            <CardTitle title='MedicationOrders' />
            <CardText>
              <Tabs id="medicationOrdersPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
               <Tab className='newMedicationOrderTab' label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                 <MedicationOrderDetail id='newMedicationOrder' />
               </Tab>
               <Tab className="medicationOrderListTab" label='MedicationOrders' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <MedicationOrdersTable />
               </Tab>
               <Tab className="medicationOrderDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                 <MedicationOrderDetail id='medicationOrderDetails' />
               </Tab>
             </Tabs>
            </CardText>
          </GlassCard>
        </VerticalCanvas>
      </div>
    );
  }
}

ReactMixin(MedicationOrdersPage.prototype, ReactMeteorData);

export default MedicationOrdersPage;