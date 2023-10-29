import React from 'react';
import { SyntheticEvent } from 'react';
import { Button, ButtonProps, Dropdown, DropdownProps, Header, Icon } from 'semantic-ui-react';

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
  addNoteModalShown: boolean;
  addQuModalShown: boolean;
  addPBModalShown: boolean;
  addPCModalShown: boolean;
  addOSModalShown: boolean;
  deleteWarnShown: boolean;
};

/*
 * Displays all notes, questions, power buys, profit centers, and open stock forms present for
 * a single vendor all in one page. This page is exempt from the 'Hide Completed' feature.
 */
@inject('showStore') @observer
export default class SingleVendor extends React.Component<SingleVendorProps, DataModalState> {
  constructor(props: SingleVendorProps, state: DataModalState) {
    super(props, state);
    this.state = {
      addNoteModalShown: false,
      addQuModalShown: false,
      addPBModalShown: false,
      addPCModalShown: false,
      addOSModalShown: false,
      deleteWarnShown: false,
    };
  }

  render() {
    const { showStore: { vendorPanelBoothId, vendorsWithActions, boothVendors } } = this.props;
    const { addNoteModalShown, addQuModalShown, addPBModalShown, addPCModalShown, addOSModalShown } = this.state;

    const tempVendorStat = Array.from(vendorsWithActions, ([key, value]) => {
      return {boothNum: key, vendor: value.boothName};
    });

    let vendorMenu = tempVendorStat.map((x: any) => {
      return {key: x.boothNum, text: `${x.boothNum} - ${x.vendor}`, value: x.boothNum}
    });

    let vendorItem = vendorsWithActions.get(vendorPanelBoothId);
    let notesComponent = null;
    let questionsComponent = null;
    let powerBuysComponent = null;
    let profitCtrComponent = null;
    let openStockComponent = null;
    let taskModals = null;
    let taskButtons = null;
    if (vendorItem) {
      notesComponent = <NotesGroup key={'NO-' + vendorItem.boothNum}
                                   items={vendorItem.vendorNotes} />;
      questionsComponent = <QuestionAnswerGroup key={'QU-' + vendorItem.boothNum}
                                                boothNum={vendorItem.boothNum}
                                                vendor={vendorItem.boothName}
                                                items={vendorItem.questions}
                                                hideCompleted={false}
                                                hideVendor={true} />;
      powerBuysComponent = <SimpleSubmittableGroup key={'PB-' + vendorItem.boothNum}
                                                   boothNum={vendorItem.boothNum}
                                                   vendor={vendorItem.boothName}
                                                   items={vendorItem.powerBuys}
                                                   hideCompleted={false}
                                                   hideVendor={true}
                                                   prefix='PB' />;
      profitCtrComponent = <SimpleSubmittableGroup key={'PC-' + vendorItem.boothNum}
                                                   boothNum={vendorItem.boothNum}
                                                   vendor={vendorItem.boothName}
                                                   items={vendorItem.profitCenters}
                                                   hideCompleted={false}
                                                   hideVendor={true}
                                                   prefix='PC' />;
      openStockComponent = <OpenStockGroup key={'OS-' + vendorItem.boothNum}
                                           boothNum={vendorItem.boothNum}
                                           vendor={vendorItem.boothName}
                                           items={vendorItem.openStockForms}
                                           hideCompleted={false}
                                           hideVendor={true} />;

      taskModals = [
        <TaskModal open={addNoteModalShown}
                   key='note'
                   closeHander={this.showAddTaskModal}
                   presetItemType='NOTE'
                   presetBoothId={vendorItem.boothNum}
                   presetVendorName={vendorItem.boothName} />,
        <TaskModal open={addQuModalShown}
                   key='qu'
                   closeHander={this.showAddTaskModal}
                   presetItemType='QU'
                   presetBoothId={vendorItem.boothNum}
                   presetVendorName={vendorItem.boothName} />,
        <TaskModal open={addOSModalShown}
                   key='os'
                   subVendors={boothVendors.get(vendorPanelBoothId).vendors}
                   closeHander={this.showAddTaskModal}
                   presetItemType='OS'
                   presetBoothId={vendorItem.boothNum}
                   presetVendorName={vendorItem.boothName} />,
        <TaskModal open={addPBModalShown}
                   key='pb'
                   closeHander={this.showAddTaskModal}
                   presetItemType='PB'
                   presetBoothId={vendorItem.boothNum}
                   presetVendorName={vendorItem.boothName} />,
        <TaskModal open={addPCModalShown}
                   key='pc'
                   closeHander={this.showAddTaskModal}
                   presetItemType='PC'
                   presetBoothId={vendorItem.boothNum}
                   presetVendorName={vendorItem.boothName} />,
      ];

      taskButtons = [
        <Button icon primary button name='NOTE' key='NOTEbtn' onClick={this.openTaskModal}>
          <Icon name='sticky note outline' />
        </Button>,
        <Button icon primary button name='QU' key='QUbtn' onClick={this.openTaskModal}>
          <Icon name='question circle outline' />
        </Button>,
        <Button primary button name='OS' key='OSbtn' onClick={this.openTaskModal}>OS</Button>,
        <Button primary button name='PB' key='PBbtn' onClick={this.openTaskModal}>PB</Button>,
        <Button primary button name='PC' key='PCbtn' onClick={this.openTaskModal}>PC</Button>,
      ];
    }

    return (
      <div className='tabInnerLayout'>
        {taskModals}
        <Dropdown as='h3'
                  fluid
                  selection
                  options={vendorMenu}
                  placeholder='Vendors'
                  defaultValue={vendorPanelBoothId ?? vendorPanelBoothId}
                  onChange={this.newVendorSelected} />
        <div className="BCI_vendoritems">
          <div className='BCI_taskgroupitem' style={{textAlign: 'left'}}>{taskButtons}</div>
          <div className='BCI_taskgroupitem'>
            {notesComponent}
          </div>
          <div className='BCI_taskgroupitem'>
            <Header as='h2' dividing textAlign='left' color='orange'>Questions</Header>
            {questionsComponent}
          </div>
          <div className='BCI_taskgroupitem'>
            <Header as='h2' dividing textAlign='left' color='brown'>Open Stock Forms</Header>
            {openStockComponent}
          </div>
          <div className='BCI_taskgroupitem'>
            <Header as='h2' dividing textAlign='left' color='violet'>Power Buys</Header>
            {powerBuysComponent}
          </div>
          <div className='BCI_taskgroupitem'>
            <Header as='h2' dividing textAlign='left' color='teal'>Profit Centers</Header>
            {profitCtrComponent}
          </div>
        </div>
      </div>
    );
  }

  private newVendorSelected = (e: SyntheticEvent, data: DropdownProps) => {
    this.props.showStore.setVendorPanelBoothId(data.value as string);
  };

  private openTaskModal = (e: SyntheticEvent, data: ButtonProps) => {
    this.showAddTaskModal(true, data.name);
  };

  private showAddTaskModal = (showIt: boolean, taskType: string) => {
    switch (taskType) {
    case 'NOTE':
      this.setState({ addNoteModalShown: showIt });
      break;
    case 'QU':
      this.setState({ addQuModalShown: showIt });
      break;
    case 'PB':
      this.setState({ addPBModalShown: showIt });
      break;
    case 'PC':
      this.setState({ addPCModalShown: showIt });
      break;
    case 'OS':
      this.setState({ addOSModalShown: showIt });
      break;
    }
    return;
  };
}
