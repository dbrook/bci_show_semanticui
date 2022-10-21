import React from 'react';
import { Header } from 'semantic-ui-react';

import { OpenStockForm, VendorVisit } from '../types/enums';
import { IVendorStatus } from '../types/interfaces';
import SimpleSubmittableGroup from './simplesubmittablegroup';
import QuestionAnswerGroup from './questionanswergroup';

import { nbSubmitted } from '../common/utils';

interface TaskDetailListProps {
  hideCompleted: boolean,
};

export default class TaskDetailList extends React.Component<TaskDetailListProps> {
  render() {
    const tempVendorStat = [
      {
        boothId: 100,
        vendor: 'Initial Added',
        visit: VendorVisit.NOT_VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.DO_NOT_GET,
      },
      {
        boothId: 196,
        vendor: 'Company Foo',
        visit: VendorVisit.NOT_VISITED,
        questions: [{question:'foo', answer: 'barquesti'}, {question:'fooonsquestions questionsquest ionsquestionsqu estions questions questions questions questions questions questions questions', answer: ''}],
        powerBuys: [{itemId:'121F', submitted: false}],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.DO_NOT_GET,
      },
      {
        boothId: 205,
        vendor: 'Bar, Inc.',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: false}],
        openStockForm: OpenStockForm.PICK_UP,
      },
      {
        boothId: 212,
        vendor: 'Another Industries',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.RETRIEVED,
      },
      {
        boothId: 222,
        vendor: 'Yet Another, Inc.',
        visit: VendorVisit.VISITED,
        questions: [{question:'foo', answer: 'bar'}],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.FILLED_IN,
      },
      {
        boothId: 237,
        vendor: 'Visited Co.',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [{itemId:'450G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
      {
        boothId: 239,
        vendor: 'Testing Ltd.',
        visit: VendorVisit.NOT_VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: 246,
        vendor: 'Abandoned Forms',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: 247,
        vendor: 'Vendor Revisit, Inc.',
        visit: VendorVisit.NEED_REVISIT,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.ABANDONED,
      },
      {
        boothId: 998,
        vendor: 'Everything, Inc.',
        visit: VendorVisit.VISITED,
        questions: [{question:'This is an insanely long question and I am not sure anybody will ever actually figure out the answer to it unless they have genious mode?', answer: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '}],
        powerBuys: [{itemId:'451A', submitted: true}],
        profitCenters: [{itemId:'456G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
      {
        boothId: 999,
        vendor: 'Power Corporation',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [{itemId:'451A', submitted: true}, {itemId:'451B', submitted: false}],
        profitCenters: [{itemId:'456G', submitted: true}],
        openStockForm: OpenStockForm.SUBMITTED,
      },
    ];

    const { hideCompleted } = this.props;

    let questionRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.questions.length) {
        if (hideCompleted && x.powerBuys.length === nbSubmitted(x.powerBuys)) {
          return null;
        }
        return <QuestionAnswerGroup key={x.boothId}
                                    boothId={x.boothId}
                                    vendor={x.vendor}
                                    items={x.questions}
                                    hideCompleted={hideCompleted}/>
      }
      return null;
    });

    let profitCenterRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.profitCenters.length) {
        if (hideCompleted && x.profitCenters.length === nbSubmitted(x.profitCenters)) {
          return null;
        }
        return <SimpleSubmittableGroup key={x.boothId}
                                       boothId={x.boothId}
                                       vendor={x.vendor}
                                       items={x.profitCenters}
                                       hideCompleted={hideCompleted}
                                       prefix='PC'/>
      }
      return null;
    });

    let powerBuyRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.powerBuys.length) {
        if (hideCompleted && x.powerBuys.length === nbSubmitted(x.powerBuys)) {
          return null;
        }
        return <SimpleSubmittableGroup key={x.boothId}
                                       boothId={x.boothId}
                                       vendor={x.vendor}
                                       items={x.powerBuys}
                                       hideCompleted={hideCompleted}
                                       prefix='PB'/>
      }
      return null;
    });

    return (
      <div className='tabInnerLayout'>
        <Header as='h2' dividing textAlign='left' color='orange'>Questions</Header>
        {questionRows}
        <Header as='h2' dividing textAlign='left' color='teal'>Profit Centers</Header>
        {profitCenterRows}
        <Header as='h2' dividing textAlign='left' color='violet'>Power Buys</Header>
        {powerBuyRows}
      </div>
    );
  }
}
