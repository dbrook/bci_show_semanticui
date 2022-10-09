import React from 'react';
import { Divider, Table } from 'semantic-ui-react';

import NumericalProgress from './numericalprogress';

import { OpenStockForm, VendorVisit } from '../types/enums';
import Visitation from './visitation';
import OpenStock from './openstock';
import VendorActions from './vendoractions';

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
      width: '17em',
    };

    const stickyTableHead = {
      position: 'sticky',
      top: 0,
      zIndex: 2,
    };

    const tempVendorStat = {
      boothId: 196,
      vendor: 'Foo',
      visit: VendorVisit.NOT_VISITED,
      questions: [{question:'foo', answer: 'bar'}, {question:'foo', answer: undefined}],
      powerBuys: [{itemId:'121F', submitted: false}],
      profitCenters: [{itemId:'450G', submitted: true}],
      openStockForm: OpenStockForm.DO_NOT_GET,
    };

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
          <VendorActions vendorStatus={tempVendorStat}/>
        </Table>
        <div className='ui BCImobiletablet'>
          <div>
            <div><b>196</b> - Dewartimer Industries</div>
            <div>
              <Visitation visitStatus={VendorVisit.NOT_VISITED}/>
              <NumericalProgress completed={0} total={1}/>
              <NumericalProgress completed={10} total={15}/>
              <NumericalProgress completed={2} total={2}/>
            </div>
          </div>
          <Divider />
          <div>FOOOOD</div>
        </div>
      </div>
    );
  }
}
