import React from 'react';
import { Table } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm, VendorVisit } from '../types/enums';
import { IVendorStatus } from '../types/interfaces';
import VendorActions from '../widgets/vendoractions';

interface TaskListProps {
  hideCompleted: boolean;
  alphaSort: boolean;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

@inject('showStore') @observer
export default class Summary extends React.Component<TaskListProps> {
  constructor(props: TaskListProps) {
    super(props);
    this.vendorCompleted = this.vendorCompleted.bind(this);
  }

  render() {
    const { alphaSort, showStore: { vendorsWithActions } } = this.props;

    const tempVendorStat = Array.from(vendorsWithActions, ([key, value]) => {
      return value;
    }).sort((a: IVendorStatus, b: IVendorStatus) => {
      if (alphaSort) {
        return a.vendor < b.vendor ? -1 : (a.vendor > b.vendor ? 1 : 0);
      }
      return a.boothId < b.boothId ? -1 : (a.boothId > b.boothId ? 1 : 0);
    });

    let vendorRows = tempVendorStat.map((x: IVendorStatus) => {
      if (!this.props.hideCompleted || !this.vendorCompleted(x)) {
        return <VendorActions key={x.boothId} vendorStatus={x} condensed={false}/>
      }
      return null;
    });

    let vendorRowsMobile = tempVendorStat.map((x: IVendorStatus) => {
      if (!this.props.hideCompleted || !this.vendorCompleted(x)) {
        return <VendorActions key={x.boothId} vendorStatus={x} condensed={true}/>
      }
      return null;
    });

    // Displays tabular format on wide screens, condensed view on mobiles/tablets
    return (
      <div className='tabInnerLayout'>
        <Table unstackable celled className='BCIdesktop'>
          <Table.Header className='BCItasksum stickyTableHead'>
            <Table.Row>
              <Table.HeaderCell className='BCItasksum boothStyle'>Booth</Table.HeaderCell>
              <Table.HeaderCell>Vendor</Table.HeaderCell>
              <Table.HeaderCell className='BCItasksum visitStyle'>Visit</Table.HeaderCell>
              <Table.HeaderCell className='BCItasksum simpleStyle'>Questions</Table.HeaderCell>
              <Table.HeaderCell className='BCItasksum simpleStyle'>Power Buy</Table.HeaderCell>
              <Table.HeaderCell className='BCItasksum simpleStyle'>Profit Center</Table.HeaderCell>
              <Table.HeaderCell className='BCItasksum openStockStyle'>Open Stock Form</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vendorRows}
          </Table.Body>
        </Table>
        <div className='BCImobiletablet'>
          {vendorRowsMobile}
        </div>
      </div>
    );
  }

  private vendorCompleted(vendor: IVendorStatus): boolean {
    return (
      (vendor.visit !== VendorVisit.NOT_VISITED && vendor.visit !== VendorVisit.NEED_REVISIT) &&
      (vendor.openStockForm !== OpenStockForm.PICK_UP &&
       vendor.openStockForm !== OpenStockForm.RETRIEVED &&
       vendor.openStockForm !== OpenStockForm.FILLED_IN) &&
      (this.props.showStore.nbAnsweredQuestions(vendor.boothId) === vendor.questions.length) &&
      (this.props.showStore.nbSubmittedPowerBuys(vendor.boothId) === vendor.powerBuys.length) &&
      (this.props.showStore.nbSubmittedProfitCenters(vendor.boothId) === vendor.profitCenters.length)
    );
  }
}
