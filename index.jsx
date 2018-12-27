

import MedicationOrdersPage from './client/MedicationOrdersPage';
import MedicationOrdersTable from './client/MedicationOrdersTable';
import MedicationOrderDetail from './client/MedicationOrderDetail';
import { MedicationOrder, MedicationOrders, MedicationOrderSchema } from './lib/MedicationOrders';

var DynamicRoutes = [{
  'name': 'MedicationOrdersPage',
  'path': '/medication-orders',
  'component': MedicationOrdersPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Medication Orders',
  'to': '/medication-orders',
  'href': '/medication-orders'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  MedicationOrdersPage,
  MedicationOrdersTable,
  MedicationOrderDetail
};


