import React from 'react';
import { Button, Divider, Header, Table } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { IVendorStatus } from '../types/interfaces';
import TaskModal from '../modals/taskmodal';
import NumericalProgress from './numericalprogress';
import Visitation from './visitation';
import OpenStock from './openstock';

interface VendorActionsProps {
  vendorStatus: IVendorStatus;
  condensed: boolean;
  showStore?: any;
};

interface VendorActionsState {
  addTaskModalShown: boolean;
};

@inject('showStore') @observer
export default class VendorActions extends React.Component<VendorActionsProps, VendorActionsState> {
  constructor(props: VendorActionsProps, state: VendorActionsState) {
    super(props, state);
    this.state = {
      addTaskModalShown: false,
    };
  }

  render() {
    const {
      boothId,
      boothNum,
      vendor,
      visit,
      questions,
      powerBuys,
      profitCenters,
      openStockForm
    } = this.props.vendorStatus;
    const { nbAnsweredQuestions, nbSubmittedPowerBuys, nbSubmittedProfitCenters } = this.props.showStore;
    const condensedView = this.props.condensed;
    const { addTaskModalShown } = this.state;

    if (condensedView) {
      return (
        <div>
          <Header as='h3' dividing>{vendor}</Header>
          <TaskModal open={addTaskModalShown}
                     closeHander={this.showAddTaskModal}
                     presetBoothId={boothId}
                     presetVendorName={vendor} />
          <div className='BCImobilevendorstatus'>
            <Button primary basic onClick={() => this.showAddTaskModal(true)}>
              {boothNum}
            </Button>
            <Visitation boothId={boothId} visitStatus={visit} mobile />
            <NumericalProgress label='QU' completed={nbAnsweredQuestions(boothId)} total={questions.length}/>
            <NumericalProgress label='PB' completed={nbSubmittedPowerBuys(boothId)} total={powerBuys.length}/>
            <NumericalProgress label='PC' completed={nbSubmittedProfitCenters(boothId)} total={profitCenters.length}/>
            <OpenStock boothId={boothId} formStatus={openStockForm} labeled={true}/>
          </div>
          <Divider />
        </div>
      );
    } else {
      return (
        <Table.Row>
          <TaskModal open={addTaskModalShown}
                     closeHander={this.showAddTaskModal}
                     presetBoothId={boothId}
                     presetVendorName={vendor} />
          <Table.Cell textAlign='center'>
            <Button primary basic onClick={() => this.showAddTaskModal(true)}>
              {boothNum}
            </Button>
          </Table.Cell>
          <Table.Cell>{vendor}</Table.Cell>
          <Table.Cell><Visitation boothId={boothId} visitStatus={visit}/></Table.Cell>
          <Table.Cell><NumericalProgress completed={nbAnsweredQuestions(boothId)} total={questions.length}/></Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmittedPowerBuys(boothId)} total={powerBuys.length}/></Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmittedProfitCenters(boothId)} total={profitCenters.length}/></Table.Cell>
          <Table.Cell><OpenStock boothId={boothId} formStatus={openStockForm} labeled={false}/></Table.Cell>
        </Table.Row>
      );
    }
  }

  private showAddTaskModal = (showIt: boolean) => {
    this.setState({ addTaskModalShown: showIt });
    return;
  }
}
