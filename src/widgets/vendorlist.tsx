import React from 'react';
// import { Table } from 'semantic-ui-react';

import { OpenStockForm, VendorVisit } from '../types/enums';
import { IVendorStatus } from '../types/interfaces';
import VendorListItem from './vendorlistitem';

export default class TaskList extends React.Component {
  render() {
    const tempVendorStat = [
      {
        boothId: 100,
        vendor: 'Initial Added',
        visit: VendorVisit.DO_NOT_VISIT,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.DO_NOT_GET,
      },
      {
        boothId: 196,
        vendor: 'Company Foo',
        visit: VendorVisit.NOT_VISITED,
        questions: [{question:'foo', answer: 'bar'}, {question:'foo', answer: undefined}],
        powerBuys: [{itemId:'121F', submitted: false}],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.DO_NOT_GET,
      },
      {
        boothId: 205,
        vendor: 'Bar, Inc.',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.PICK_UP,
      },
      {
        boothId: 212,
        vendor: 'Another Industries',
        visit: VendorVisit.DO_NOT_VISIT,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.RETRIEVED,
      },
      {
        boothId: 222,
        vendor: 'Yet Another, Inc.',
        visit: VendorVisit.DO_NOT_VISIT,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.FILLED_IN,
      },
      {
        boothId: 237,
        vendor: 'Visited Co.',
        visit: VendorVisit.DO_NOT_VISIT,
        questions: [],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
      {
        boothId: 239,
        vendor: 'Testing Ltd.',
        visit: VendorVisit.NOT_VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: 246,
        vendor: 'Abandoned Forms Incorporated LLC, A DEWARTIMER Industries Corporation',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: 247,
        vendor: 'Vendor Revisit, Inc.',
        visit: VendorVisit.NEED_REVISIT,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: 998,
        vendor: 'Everything, Inc.',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [{itemId:'451A', submitted: true}],
        profitCenters: [{itemId:'456G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
      {
        boothId: 999,
        vendor: 'Power Corporation',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [{itemId:'451A', submitted: true}, {itemId:'451B', submitted: false}],
        profitCenters: [{itemId:'456G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
    ];

    let vendorRows = tempVendorStat.map((x: IVendorStatus) => {
      return <VendorListItem key={x.boothId} boothId={x.boothId} vendor={x.vendor} vendorStatus={x.visit}/>
    });

    return (
      <div className='tabInnerLayout'>
        {vendorRows}
      </div>
    );
  }
}
