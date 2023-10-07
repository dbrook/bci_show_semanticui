import React from 'react';
import { Table } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm } from '../types/enums';
import { IVendorStatus } from '../types/interfaces';
import VendorActions from '../widgets/vendoractions';

interface TaskListProps {
  hideCompleted: boolean;
  alphaSort: boolean;
  showStore?: any;
};

/*
 * Contents of the Task Summary tab. This is a responsive component: in desktop mode it will show
 * a table with booth number, vendor name, visit, question, power buy, profit center, and open stock
 * form submission status for any vendor with at least one of the above actions assigned. In mobile
 * mode, the table is taken out (because Semantic UI will stack all the contents making it difficult
 * to actually understand what components are representing) and replaced with labeled versions of
 * the widgets laid out using flexbox.
 */
@inject('showStore') @observer
export default class Summary extends React.Component<TaskListProps> {
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
              <Table.HeaderCell className='BCItasksum simpleStyle'>Questions</Table.HeaderCell>
              <Table.HeaderCell className='BCItasksum simpleStyle'>Power Buy</Table.HeaderCell>
              <Table.HeaderCell className='BCItasksum simpleStyle'>Profit Center</Table.HeaderCell>
              <Table.HeaderCell className='BCItasksum simpleStyle'>Open Stock</Table.HeaderCell>
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

  private vendorCompleted = (vendor: IVendorStatus): boolean => {
    const {
      nbAnsweredQuestions,
      nbSubmittedPowerBuys,
      nbSubmittedProfitCenters,
      nbSubmittedOpenStock,
    } = this.props.showStore;
    return (
      (nbSubmittedOpenStock(vendor.boothId) === vendor.openStockForms.length) &&
      (nbAnsweredQuestions(vendor.boothId) === vendor.questions.length) &&
      (nbSubmittedPowerBuys(vendor.boothId) === vendor.powerBuys.length) &&
      (nbSubmittedProfitCenters(vendor.boothId) === vendor.profitCenters.length)
    );
  }
}
