import React from 'react';
import { Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { IVendorStatus } from '../types/interfaces';
import SimpleSubmittableGroup from '../widgets/simplesubmittablegroup';
import QuestionAnswerGroup from '../widgets/questionanswergroup';

interface TaskDetailListProps {
  hideCompleted: boolean;
  alphaSort: boolean;
  showStore?: any;
};

@inject('showStore') @observer
export default class TaskDetailList extends React.Component<TaskDetailListProps> {
  render() {
    const {
      hideCompleted,
      alphaSort,
      showStore: { vendorsWithActions, nbAnsweredQuestions, nbSubmittedPowerBuys, nbSubmittedProfitCenters },
    } = this.props;

    const tempVendorStat = Array.from(vendorsWithActions, ([key, value]) => {
      return value;
    }).sort((a: IVendorStatus, b: IVendorStatus) => {
      if (alphaSort) {
        return a.vendor < b.vendor ? -1 : (a.vendor > b.vendor ? 1 : 0);
      }
      return a.boothId < b.boothId ? -1 : (a.boothId > b.boothId ? 1 : 0);
    });

    let questionRows = tempVendorStat.map((x) => {
      if (x.questions.length) {
        if (hideCompleted && x.questions.length === nbAnsweredQuestions(x.boothId)) {
          return null;
        }
        return <QuestionAnswerGroup key={x.boothId}
                                    boothNum={x.boothNum}
                                    vendor={x.vendor}
                                    items={x.questions}
                                    hideCompleted={hideCompleted} />
      }
      return null;
    });

    let powerBuyRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.powerBuys.length) {
        if (hideCompleted && x.powerBuys.length === nbSubmittedPowerBuys(x.boothId)) {
          return null;
        }
        return <SimpleSubmittableGroup key={x.boothId}
                                       boothNum={x.boothNum}
                                       vendor={x.vendor}
                                       items={x.powerBuys}
                                       hideCompleted={hideCompleted}
                                       prefix='PB' />
      }
      return null;
    });

    let profitCenterRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.profitCenters.length) {
        if (hideCompleted && x.profitCenters.length === nbSubmittedProfitCenters(x.boothId)) {
          return null;
        }
        return <SimpleSubmittableGroup key={x.boothId}
                                       boothNum={x.boothNum}
                                       vendor={x.vendor}
                                       items={x.profitCenters}
                                       hideCompleted={hideCompleted}
                                       prefix='PC' />
      }
      return null;
    });

    return (
      <div className='tabInnerLayout'>
        <Header as='h2' dividing textAlign='left' color='orange'>Questions</Header>
        {questionRows}
        <Header as='h2' dividing textAlign='left' color='violet'>Power Buys</Header>
        {powerBuyRows}
        <Header as='h2' dividing textAlign='left' color='teal'>Profit Centers</Header>
        {profitCenterRows}
      </div>
    );
  }
}
