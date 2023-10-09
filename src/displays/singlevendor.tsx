import React from 'react';
import { SyntheticEvent } from 'react';
import { Button, Dropdown, DropdownProps, Header, Icon } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import TaskModal from '../modals/taskmodal';
import SimpleSubmittableGroup from '../widgets/simplesubmittablegroup';
import QuestionAnswerGroup from '../widgets/questionanswergroup';
import OpenStockGroup from '../widgets/openstockgroup';
import NotesGroup from '../widgets/notesgroup';

interface SingleVendorProps {
  showStore?: any;
};

interface DataModalState {
  addTaskModalShown: boolean;
};

/*
 * Displays all notes, questions, power buys, profit centers, and open stock forms present for
 * a single vendor all in one page. This page is exempt from the 'Hide Completed' feature.
 */
@inject('showStore') @observer
export default class SingleVendor extends React.Component<SingleVendorProps, DataModalState> {
  constructor(props: SingleVendorProps, state: DataModalState) {
    super(props, state);
    this.state = { addTaskModalShown: false };
  }

  render() {
    const { showStore: { vendorPanelBoothId, vendorsWithActions } } = this.props;
    const { addTaskModalShown } = this.state;

    const tempVendorStat = Array.from(vendorsWithActions, ([key, value]) => {
      return {boothId: key, boothNum: value.boothNum, vendor: value.vendor};
    });

    let vendorMenu = tempVendorStat.map((x: any) => {
      return {key: x.boothId, text: `${x.boothNum} - ${x.vendor}`, value: x.boothId}
    });

    let vendorItem = vendorsWithActions.get(vendorPanelBoothId);
    let notesComponent = null;
    let questionsComponent = null;
    let powerBuysComponent = null;
    let profitCtrComponent = null;
    let openStockComponent = null;
    let taskModal = null;
    let taskButton = null;
    if (vendorItem) {
      notesComponent = <NotesGroup key={'NO-' + vendorItem.boothId}
                                   items={vendorItem.vendorNotes} />;
      questionsComponent = <QuestionAnswerGroup key={'QU-' + vendorItem.boothId}
                                                boothNum={vendorItem.boothNum}
                                                vendor={vendorItem.vendor}
                                                items={vendorItem.questions}
                                                hideCompleted={false}
                                                hideVendor={true} />
      powerBuysComponent = <SimpleSubmittableGroup key={'PB-' + vendorItem.boothId}
                                                   boothNum={vendorItem.boothNum}
                                                   vendor={vendorItem.vendor}
                                                   items={vendorItem.powerBuys}
                                                   hideCompleted={false}
                                                   hideVendor={true}
                                                   prefix='PB' />
      profitCtrComponent = <SimpleSubmittableGroup key={'PC-' + vendorItem.boothId}
                                                   boothNum={vendorItem.boothNum}
                                                   vendor={vendorItem.vendor}
                                                   items={vendorItem.profitCenters}
                                                   hideCompleted={false}
                                                   hideVendor={true}
                                                   prefix='PC' />
      openStockComponent = <OpenStockGroup key={'OS-' + vendorItem.boothId}
                                           boothId={vendorItem.boothId}
                                           boothNum={vendorItem.boothNum}
                                           vendor={vendorItem.vendor}
                                           items={vendorItem.openStockForms}
                                           hideCompleted={false}
                                           hideVendor={true} />

      taskModal = <TaskModal open={addTaskModalShown}
                             closeHander={this.showAddTaskModal}
                             presetItemType='NO'
                             presetBoothId={vendorItem.boothId}
                             presetVendorName={vendorItem.vendor} />

      taskButton = <Button icon primary basic button labelPosition='left' onClick={this.openTaskModal}>
          <Icon name='plus square outline' />
          Add Item / Task to [{vendorItem.boothId}]...
        </Button>
    }

    return (
      <div className='tabInnerLayout'>
        {taskModal}
        <Dropdown as='h3'
                  fluid
                  selection
                  options={vendorMenu}
                  placeholder='Vendors'
                  defaultValue={vendorPanelBoothId ?? vendorPanelBoothId}
                  onChange={this.newVendorSelected} />
        {notesComponent}
        <Header as='h2' dividing textAlign='left' color='orange'>Questions</Header>
        {questionsComponent}
        <Header as='h2' dividing textAlign='left' color='violet'>Power Buys</Header>
        {powerBuysComponent}
        <Header as='h2' dividing textAlign='left' color='teal'>Profit Centers</Header>
        {profitCtrComponent}
        <Header as='h2' dividing textAlign='left' color='brown'>Open Stock Forms</Header>
        {openStockComponent}
        <Header as='h2' dividing textAlign='left' color='black' />
        {taskButton}
      </div>
    );
  }

  private newVendorSelected = (e: SyntheticEvent, data: DropdownProps) => {
    this.props.showStore.setVendorPanelBoothId(data.value as string);
  };

  private openTaskModal = () => {
    this.showAddTaskModal(true);
  };

  private showAddTaskModal = (showIt: boolean) => {
    this.setState({ addTaskModalShown: showIt });
    return;
  };
}
