import React from 'react';
import { Button, Divider, Icon, Header, Table } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { IVendorStatus } from '../types/interfaces';
import NumericalProgress from './numericalprogress';

interface VendorActionsProps {
  vendorStatus: IVendorStatus;
  condensed: boolean;
  boothButtonClick: () => void;
  showStore?: any;
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
export default class VendorActions extends React.Component<VendorActionsProps> {
  render() {
    const {
      boothNum,
      boothName,
      questions,
      powerBuys,
      profitCenters,
      vendorNotes,
      openStockForms,
    } = this.props.vendorStatus;
    const {
      nbAnsweredQuestions, nbSubmittedPowerBuys, nbSubmittedProfitCenters, nbSubmittedOpenStock
    } = this.props.showStore;
    const condensedView = this.props.condensed;
    let noteIcon = vendorNotes.length > 0 ? <Icon size="large" name="sticky note outline"/> : null;

    if (condensedView) {
      return (
        <div>
          <Header as='h3' style={{textAlign: 'left'}}>{boothName}</Header>
          <div className='BCImobilevendorgroup'>
            <div className='BCImobilevendorbuttonnote'>
              <Button primary basic onClick={this.switchToVendorTab}>{boothNum}</Button>
              {noteIcon}
            </div>
            <div className='BCImobilevendorstatus'>
              <NumericalProgress label='QU'
                                completed={nbAnsweredQuestions(boothNum)}
                                total={questions.length} />
              <NumericalProgress label='PB'
                                completed={nbSubmittedPowerBuys(boothNum)}
                                total={powerBuys.size} />
              <NumericalProgress label='PC'
                                completed={nbSubmittedProfitCenters(boothNum)}
                                total={profitCenters.size} />
              <NumericalProgress label='OS'
                                completed={nbSubmittedOpenStock(boothNum)}
                                total={openStockForms.length} />
            </div>
          </div>
          <Divider />
        </div>
      );
    } else {
      return (
        <Table.Row>
          <Table.Cell textAlign='left'>
            <Button primary basic onClick={this.switchToVendorTab}>{boothNum}</Button>
            {noteIcon}
          </Table.Cell>
          <Table.Cell>{boothName}</Table.Cell>
          <Table.Cell><NumericalProgress completed={nbAnsweredQuestions(boothNum)}
                                         total={questions.length} />
          </Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmittedPowerBuys(boothNum)}
                                         total={powerBuys.size} />
          </Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmittedProfitCenters(boothNum)}
                                         total={profitCenters.size} />
          </Table.Cell>
          <Table.Cell><NumericalProgress completed={nbSubmittedOpenStock(boothNum)}
                                         total={openStockForms.length} />
          </Table.Cell>
        </Table.Row>
      );
    }
  }

  private switchToVendorTab = () => {
    this.props.showStore.setVendorPanelBoothId(this.props.vendorStatus.boothNum);
    this.props.boothButtonClick();
  }
}
