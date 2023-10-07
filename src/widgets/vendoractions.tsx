import React from 'react';
import { Button, Divider, Icon, Header, Table } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { IVendorStatus } from '../types/interfaces';
import TaskModal from '../modals/taskmodal';
import NumericalProgress from './numericalprogress';

interface VendorActionsProps {
  vendorStatus: IVendorStatus;
  condensed: boolean;
  showStore?: any;
};

interface VendorActionsState {
  addTaskModalShown: boolean;
};

/*
 * VendorActions Component:
 *
 * Displays the action statuses for a single vendor in a responsive manner. In desktop mode this
 * renders a table row with cells, in mobile mode it labels the widgets and renders them in flexbox
 * to allow wrapping and using the vendor name as a title.
 *
 * Tasks can be added to the vendor using the Add Task modal which is preset to the boothId for the
 * vendor specified.
 */
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
      questions,
      powerBuys,
      profitCenters,
      vendorNotes,
      openStockForms
    } = this.props.vendorStatus;
    const {
      nbAnsweredQuestions, nbSubmittedPowerBuys, nbSubmittedProfitCenters, nbSubmittedOpenStock
    } = this.props.showStore;
    const condensedView = this.props.condensed;
    const { addTaskModalShown } = this.state;

    let noteIcon = vendorNotes.length > 0 ? <Icon size="large" name="sticky note outline"/> : null;

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
            {noteIcon}
            <NumericalProgress label='QU'
                               completed={nbAnsweredQuestions(boothId)}
                               total={questions.length} />
            <NumericalProgress label='PB'
                               completed={nbSubmittedPowerBuys(boothId)}
                               total={powerBuys.length} />
            <NumericalProgress label='PC'
                               completed={nbSubmittedProfitCenters(boothId)}
                               total={profitCenters.length} />
            <NumericalProgress label='OS'
                               completed={nbSubmittedOpenStock(boothId)}
                               total={openStockForms.length} />
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
          <Table.Cell textAlign='left'>
            <Button primary basic onClick={() => this.showAddTaskModal(true)}>
              {boothNum}
            </Button>
            {noteIcon}
          </Table.Cell>
          <Table.Cell>{vendor}</Table.Cell>
          <Table.Cell><NumericalProgress completed={nbAnsweredQuestions(boothId)}
                                         total={questions.length} />
          </Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmittedPowerBuys(boothId)}
                                         total={powerBuys.length} />
          </Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmittedProfitCenters(boothId)}
                                         total={profitCenters.length} />
          </Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmittedOpenStock(boothId)}
                                         total={openStockForms.length} />
          </Table.Cell>
        </Table.Row>
      );
    }
  }

  private showAddTaskModal = (showIt: boolean) => {
    this.setState({ addTaskModalShown: showIt });
    return;
  }
}
