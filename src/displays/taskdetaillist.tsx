import React from 'react';
import { Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm, VendorVisit } from '../types/enums';
import { IVendorStatus } from '../types/interfaces';
import SimpleSubmittableGroup from '../widgets/simplesubmittablegroup';
import QuestionAnswerGroup from '../widgets/questionanswergroup';

import { nbSubmitted } from '../common/utils';

interface TaskDetailListProps {
  hideCompleted: boolean;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

@inject('showStore') @observer
export default class TaskDetailList extends React.Component<TaskDetailListProps> {
  render() {
    const { hideCompleted, showStore: { vendorsWithActions, nbAnsweredQuestions } } = this.props;

    const tempVendorStat = Array.from(vendorsWithActions, ([key, value]) => {
      return value;
    });

    let questionRows = tempVendorStat.map((x) => {
      if (x.questions.length) {
        if (hideCompleted && x.questions.length === nbAnsweredQuestions(x.boothId)) {
          return null;
        }
        return <QuestionAnswerGroup boothNum={x.boothNum}
                                    vendor={x.vendor}
                                    items={x.questions}
                                    hideCompleted={hideCompleted}/>
      }
      return null;
    });

//     let profitCenterRows = vendorsWithActions.map((x: IVendorStatus) => {
//       if (x.profitCenters.length) {
//         if (hideCompleted && x.profitCenters.length === nbSubmitted(x.profitCenters)) {
//           return null;
//         }
//         return <SimpleSubmittableGroup key={x.boothId}
//                                        boothNum={x.boothNum}
//                                        vendor={x.vendor}
//                                        items={x.profitCenters}
//                                        hideCompleted={hideCompleted}
//                                        prefix='PC'/>
//       }
//       return null;
//     });

//     let powerBuyRows = vendorsWithActions.map((x: IVendorStatus) => {
//       if (x.powerBuys.length) {
//         if (hideCompleted && x.powerBuys.length === nbSubmitted(x.powerBuys)) {
//           return null;
//         }
//         return <SimpleSubmittableGroup key={x.boothId}
//                                        boothNum={x.boothNum}
//                                        vendor={x.vendor}
//                                        items={x.powerBuys}
//                                        hideCompleted={hideCompleted}
//                                        prefix='PB'/>
//       }
//       return null;
//     });

    return (
      <div className='tabInnerLayout'>
        <Header as='h2' dividing textAlign='left' color='orange'>Questions</Header>
        {questionRows}
      </div>
    );
  }
}

/*
        <Header as='h2' dividing textAlign='left' color='teal'>Profit Centers</Header>
        {profitCenterRows}
        <Header as='h2' dividing textAlign='left' color='violet'>Power Buys</Header>
        {powerBuyRows}
*/
