import React from 'react';
import { Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { IVendorStatus } from '../types/interfaces';
import SimpleSubmittableGroup from '../widgets/simplesubmittablegroup';
import QuestionAnswerGroup from '../widgets/questionanswergroup';
import OpenStockGroup from '../widgets/openstockgroup';

interface TaskDetailListProps {
  hideCompleted: boolean;
  alphaSort: boolean;
  showStore?: any;
};

/*
 * Interface to show all questions/answers, Power Buys, Profit Centers, and Open Stock Forms for
 * the show, grouped by type, then by each vendor.
 * The display can be sorted by booth number or lexicographically by vendor.
 */
@inject('showStore') @observer
export default class TaskDetailList extends React.Component<TaskDetailListProps> {
  render() {
    const {
      hideCompleted,
      alphaSort,
      showStore: {
        vendorsWithActions,
        nbAnsweredQuestions,
        nbSubmittedPowerBuys,
        nbSubmittedProfitCenters,
        nbSubmittedOpenStock,
      },
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
                                    hideVendor={false}
                                    hideCompleted={hideCompleted} />
      }
      return null;
    });

    let powerBuyRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.powerBuys.size) {
        if (hideCompleted && x.powerBuys.size === nbSubmittedPowerBuys(x.boothId)) {
          return null;
        }
        return <SimpleSubmittableGroup key={x.boothId}
                                       boothId={x.boothId}
                                       boothNum={x.boothNum}
                                       vendor={x.vendor}
                                       items={x.powerBuys}
                                       hideCompleted={hideCompleted}
                                       hideVendor={false}
                                       prefix='PB' />
      }
      return null;
    });

    let profitCenterRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.profitCenters.size) {
        if (hideCompleted && x.profitCenters.size === nbSubmittedProfitCenters(x.boothId)) {
          return null;
        }
        return <SimpleSubmittableGroup key={x.boothId}
                                       boothId={x.boothId}
                                       boothNum={x.boothNum}
                                       vendor={x.vendor}
                                       items={x.profitCenters}
                                       hideCompleted={hideCompleted}
                                       hideVendor={false}
                                       prefix='PC' />
      }
      return null;
    });

    let openStockRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.openStockForms.length) {
        if (hideCompleted && x.openStockForms.length === nbSubmittedOpenStock(x.boothId)) {
          return null;
        }
        return <OpenStockGroup key={x.boothId}
                              boothId={x.boothId}
                              boothNum={x.boothNum}
                              vendor={x.vendor}
                              items={x.openStockForms}
                              hideCompleted={hideCompleted}
                              hideVendor={false} />;
      }
      return null;
    });


    return (
      <div className='tabInnerLayout'>
        <div className="BCI_vendoritems">
          <div className='BCI_taskgroupitem'>
            <Header as='h2' dividing textAlign='left' color='orange'>Questions</Header>
            {questionRows}
          </div>
          <div className='BCI_taskgroupitem'>
            <Header as='h2' dividing textAlign='left' color='brown'>Open Stock Forms</Header>
            {openStockRows}
          </div>
          <div className='BCI_taskgroupitem'>
            <Header as='h2' dividing textAlign='left' color='violet'>Power Buys</Header>
            {powerBuyRows}
          </div>
          <div className='BCI_taskgroupitem'>
            <Header as='h2' dividing textAlign='left' color='teal'>Profit Centers</Header>
            {profitCenterRows}
          </div>
        </div>
      </div>
    );
  }
}
