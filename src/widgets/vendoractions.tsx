import React from 'react';
import { Divider, Header, Table } from 'semantic-ui-react';

import { IVendorStatus } from '../types/interfaces';
import NumericalProgress from './numericalprogress';
import Visitation from './visitation';
import OpenStock from './openstock';

import { nbAnsweredQuestions, nbSubmitted } from '../common/utils';

interface VendorActionsProps {
  vendorStatus: IVendorStatus,
  condensed: boolean,
};

export default class VendorActions extends React.Component<VendorActionsProps> {
  render() {
    const { boothId, vendor, visit, questions, powerBuys, profitCenters, openStockForm } = this.props.vendorStatus;
    const condensedView = this.props.condensed;

    if (condensedView) {
      return <div>
          <Header as='h3'>{boothId} - {vendor}</Header>
          <div className='BCImobilevendorstatus'>
            <Visitation visitStatus={visit} mobile />
            <NumericalProgress label='QU' completed={nbAnsweredQuestions(questions)} total={questions.length}/>
            <NumericalProgress label='PB' completed={nbSubmitted(powerBuys)} total={powerBuys.length}/>
            <NumericalProgress label='PC' completed={nbSubmitted(profitCenters)} total={profitCenters.length}/>
            <OpenStock formStatus={openStockForm} labeled={true}/>
          </div>
          <Divider />
        </div>;
    } else {
      return <Table.Row>
          <Table.Cell textAlign='center'><b>{boothId}</b></Table.Cell>
          <Table.Cell>{vendor}</Table.Cell>
          <Table.Cell><Visitation visitStatus={visit} mobile={false}/></Table.Cell>
          <Table.Cell><NumericalProgress completed={nbAnsweredQuestions(questions)} total={questions.length}/></Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmitted(powerBuys)} total={powerBuys.length}/></Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmitted(profitCenters)} total={profitCenters.length}/></Table.Cell>
          <Table.Cell><OpenStock formStatus={openStockForm} labeled={false}/></Table.Cell>
        </Table.Row>;
    }
  }
}
