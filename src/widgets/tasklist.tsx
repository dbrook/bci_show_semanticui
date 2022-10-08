import React from 'react';
import { Divider, Table } from 'semantic-ui-react';

export default class TaskList extends React.Component {
  render() {
    const boothStyle = {
      width: '5em',
    };

    const visitStyle = {
      width: '12em',
    };

    const simpleStyle = {
      width: '8em',
    };

    const openStockStyle = {
      width: '17em',
    };

    const stickyTableHead = {
      position: 'sticky',
      top: 0,
      zIndex: 2,
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
              <Table.HeaderCell style={openStockStyle}>Open Stock</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Row>
            <Table.Cell textAlign='right'>196</Table.Cell>
            <Table.Cell>Dewartimer Industries</Table.Cell>
            <Table.Cell textAlign='center'>Not Visited</Table.Cell>
            <Table.Cell textAlign='center'>None</Table.Cell>
            <Table.Cell textAlign='center'>0 of 15</Table.Cell>
            <Table.Cell textAlign='center'>0 of 12</Table.Cell>
            <Table.Cell>Not Retrieved (ADV) (DEL)</Table.Cell>
          </Table.Row>
          </Table>
        <div className='ui BCImobiletablet'>
          <div><div><b>196</b> - Dewartimer Industries</div><div>Not Visited, None, 0 of 15, 0 of 12, Not Reitreved (ADV) (DEL)</div></div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
          <Divider />
          <div>FOOOOD</div>
        </div>
      </div>
    );
  }
}
