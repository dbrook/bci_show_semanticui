import React from 'react';
import { Divider, Table } from 'semantic-ui-react';

import NumericalProgress from './numericalprogress';

import { OpenStockForm, VendorVisit } from '../types/enums';
import { IVendorStatus } from '../types/interfaces';
import VendorActions from './vendoractions';
import OpenStock from './openstock';

export default class TaskList extends React.Component {
  render() {
    const boothStyle = {
      width: '5em',
    };

    const visitStyle = {
      width: '10em',
    };

    const simpleStyle = {
      width: '8.5em',
    };

    const openStockStyle = {
      width: '16.5em',
    };

    const stickyTableHead = {
      position: 'sticky',
      top: 0,
      zIndex: 2,
    };

    const tempVendorStat = [
      {
        boothId: 196,
        vendor: 'Foo',
        visit: VendorVisit.NOT_VISITED,
        questions: [{question:'foo', answer: 'bar'}, {question:'foo', answer: undefined}],
        powerBuys: [{itemId:'121F', submitted: false}],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.DO_NOT_GET,
      },
      {
        boothId: 205,
        vendor: 'Bar',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.PICK_UP,
      },
      {
        boothId: 205,
        vendor: 'Bar',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.RETRIEVED,
      },
      {
        boothId: 205,
        vendor: 'Bar',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.FILLED_IN,
      },
      {
        boothId: 237,
        vendor: 'Bax',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
      {
        boothId: 237,
        vendor: 'Bax',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
    ];

    let vendorRows = tempVendorStat.map((x: IVendorStatus) => <VendorActions vendorStatus={x}/>);

    // Displays tabular format on wide screens, condensed view on mobiles/tablets
    return (
      <div className='tabInnerLayout'>
        <Table unstackable celled className='BCIdesktop'>
          <Table.Header style={stickyTableHead}>
            <Table.Row>
              <Table.HeaderCell style={boothStyle}>Booth</Table.HeaderCell>
              <Table.HeaderCell>Vendor</Table.HeaderCell>
              <Table.HeaderCell style={visitStyle}>Visit</Table.HeaderCell>
              <Table.HeaderCell style={simpleStyle}>Questions</Table.HeaderCell>
              <Table.HeaderCell style={simpleStyle}>Power Buy</Table.HeaderCell>
              <Table.HeaderCell style={simpleStyle}>Profit Center</Table.HeaderCell>
              <Table.HeaderCell style={openStockStyle}>Open Stock Form</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {vendorRows}
        </Table>
        <div className='ui BCImobiletablet'>
          <div>
            <div><b>196</b> - Dewartimer Industries</div>
            <div>
              <NumericalProgress label='QU' completed={0} total={0}/>
              <NumericalProgress label='PC' completed={0} total={1}/>
              <NumericalProgress label='PB' completed={10} total={15}/>
              <NumericalProgress label='VI' completed={20} total={20}/>
              <NumericalProgress label='VI' completed={20} total={20}/>
              <OpenStock formStatus={OpenStockForm.PICK_UP}/>
            </div>
          </div>
          <Divider />
          <div>FOOOOD</div>
        </div>
      </div>
    );
  }
}
