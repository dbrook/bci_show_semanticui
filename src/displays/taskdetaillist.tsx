import React from 'react';
import { Button, Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { IVendorStatus } from '../types/interfaces';
import SimpleSubmittableGroup from '../widgets/simplesubmittablegroup';
import QuestionAnswerGroup from '../widgets/questionanswergroup';
import OpenStockGroup from '../widgets/openstockgroup';
import BulkAddModal from '../modals/bulkaddmodal';

interface TaskDetailListProps {
  hideCompleted: boolean;
  alphaSort: boolean;
  showStore?: any;
};

interface TaskDetailListState {
  bulkModalPBShown: boolean;
  bulkModalPCShown: boolean;
};

/*
 * Interface to show all questions/answers, Power Buys, Profit Centers, and Open Stock Forms for
 * the show, grouped by type, then by each vendor.
 * The display can be sorted by booth number or lexicographically by vendor.
 */
@inject('showStore') @observer
export default class TaskDetailList extends React.Component<TaskDetailListProps, TaskDetailListState> {
  constructor(props: TaskDetailListProps, state: TaskDetailListState) {
    super(props, state);
    this.state ={
      bulkModalPBShown: false,
      bulkModalPCShown: false,
    };
  }

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
        return a.boothName < b.boothName ? -1 : (a.boothName > b.boothName ? 1 : 0);
      }
      return a.boothNum < b.boothNum ? -1 : (a.boothNum > b.boothNum ? 1 : 0);
    });

    let questionRows = tempVendorStat.map((x) => {
      if (x.questions.length) {
        if (hideCompleted && x.questions.length === nbAnsweredQuestions(x.boothNum)) {
          return null;
        }
        return <QuestionAnswerGroup key={x.boothNum}
                                    boothNum={x.boothNum}
                                    vendor={x.boothName}
                                    items={x.questions}
                                    hideVendor={false}
                                    hideCompleted={hideCompleted} />
      }
      return null;
    });

    let powerBuyRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.powerBuys.size) {
        if (hideCompleted && x.powerBuys.size === nbSubmittedPowerBuys(x.boothNum)) {
          return null;
        }
        return <SimpleSubmittableGroup key={x.boothNum}
                                       boothNum={x.boothNum}
                                       vendor={x.boothName}
                                       items={x.powerBuys}
                                       hideCompleted={hideCompleted}
                                       hideVendor={false}
                                       prefix='PB' />
      }
      return null;
    });

    let profitCenterRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.profitCenters.size) {
        if (hideCompleted && x.profitCenters.size === nbSubmittedProfitCenters(x.boothNum)) {
          return null;
        }
        return <SimpleSubmittableGroup key={x.boothNum}
                                       boothNum={x.boothNum}
                                       vendor={x.boothName}
                                       items={x.profitCenters}
                                       hideCompleted={hideCompleted}
                                       hideVendor={false}
                                       prefix='PC' />
      }
      return null;
    });

    let openStockRows = tempVendorStat.map((x: IVendorStatus) => {
      if (x.openStockForms.length) {
        if (hideCompleted && x.openStockForms.length === nbSubmittedOpenStock(x.boothNum)) {
          return null;
        }
        return <OpenStockGroup key={x.boothNum}
                               boothNum={x.boothNum}
                               vendor={x.boothName}
                               items={x.openStockForms}
                               hideCompleted={hideCompleted}
                               hideVendor={false} />;
      }
      return null;
    });


    return (
      <div className='tabInnerLayout'>
        <BulkAddModal open={this.state.bulkModalPBShown} closeHandler={this.showBulkModalPB} type='PB' />
        <BulkAddModal open={this.state.bulkModalPCShown} closeHandler={this.showBulkModalPC} type='PC' />
        <div className="BCI_vendoritems">
        <div className='BCI_taskgroupitem' style={{textAlign: 'left'}}>
          <Button primary button name='PB' key='PBbtn' onClick={this.triggerBulkModalPB}>
            Bulk-Add Power Buys
          </Button>
          <Button primary button name='PC' key='PCbtn' onClick={this.triggerBulkModalPC}>
            Bulk-Add Profit Centers
          </Button>
        </div>
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

  private triggerBulkModalPC = () => {
    this.showBulkModalPC(true);
  };

  private showBulkModalPC = (shown: boolean) => {
    this.setState({
      bulkModalPCShown: shown,
    });
  };

  private triggerBulkModalPB = () => {
    this.showBulkModalPB(true);
  };

  private showBulkModalPB = (shown: boolean) => {
    this.setState({
      bulkModalPBShown: shown,
    });
  };
}
