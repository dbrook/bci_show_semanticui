import React from 'react';
import { Table } from 'semantic-ui-react';

import { OpenStockForm, VendorVisit } from '../types/enums';
import { IVendorStatus } from '../types/interfaces';
import VendorActions from '../widgets/vendoractions';

import { nbAnsweredQuestions, nbSubmitted } from '../common/utils';

interface TaskListProps {
  hideCompleted?: boolean,
};

export default class TaskList extends React.Component<TaskListProps> {
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
      width: '15em',
    };

    const stickyTableHead = {
      position: 'sticky',
      top: 0,
      zIndex: 2,
    };

    const tempVendorStat = [
      {
        boothId: '100-0',
        boothNum: 100,
        vendor: 'Initial Added',
        visit: VendorVisit.NOT_VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.DO_NOT_GET,
      },
      {
        boothId: '196-0',
        boothNum: 196,
        vendor: 'Company Foo',
        visit: VendorVisit.NOT_VISITED,
        questions: [{question:'foo', answer: 'barquesti'}, {question:'fooonsquestions questionsquest ionsquestionsqu estions questions questions questions questions questions questions questions', answer: ''}],
        powerBuys: [{itemId:'121F', submitted: false}],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.DO_NOT_GET,
      },
      {
        boothId: '205-0',
        boothNum: 205,
        vendor: 'Bar, Inc.',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: false}],
        openStockForm: OpenStockForm.PICK_UP,
      },
      {
        boothId: '212-0',
        boothNum: 212,
        vendor: 'Another Industries',
        visit: VendorVisit.DO_NOT_VISIT,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.RETRIEVED,
      },
      {
        boothId: '222-0',
        boothNum: 222,
        vendor: 'Yet Another, Inc.',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.FILLED_IN,
      },
      {
        boothId: '222-1',
        boothNum: 222,
        vendor: 'Visited Co.',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
      {
        boothId: '239-0',
        boothNum: 239,
        vendor: 'Testing Ltd.',
        visit: VendorVisit.NOT_VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: '246-0',
        boothNum: 246,
        vendor: 'Abandoned Forms',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: '247-0',
        boothNum: 247,
        vendor: 'Vendor Revisit, Inc.',
        visit: VendorVisit.NEED_REVISIT,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: '998-0',
        boothNum: 998,
        vendor: 'Everything, Inc.',
        visit: VendorVisit.VISITED,
        questions: [{question:'This is an insanely long question and I am not sure anybody will ever actually figure out the answer to it unless they have genious mode?', answer: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '}],
        powerBuys: [{itemId:'451A', submitted: true}],
        profitCenters: [{itemId:'456G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
      {
        boothId: '999-0',
        boothNum: 999,
        vendor: 'Power Corporation',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [{itemId:'451A', submitted: true}, {itemId:'451B', submitted: false}],
        profitCenters: [{itemId:'456G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
    ];

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
      (nbAnsweredQuestions(vendor.questions) === vendor.questions.length) &&
      (nbSubmitted(vendor.powerBuys) === vendor.powerBuys.length) &&
      (nbSubmitted(vendor.profitCenters) === vendor.profitCenters.length)
    );
  }
}
