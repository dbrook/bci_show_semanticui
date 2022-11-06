import React from 'react';
import { Button, Dropdown, Icon } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import TaskModal from '../widgets/taskmodal';
import DataModal from '../widgets/datamodal';

interface MenuBarProps {
  hideCompleted: boolean;
  toggleHideCompleted: () => void;
  alphaSort: boolean;
  toggleAlphaSort: () => void;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

interface MenuBarState {
  addTaskModalShown: boolean,
  dataModalShown: boolean,
};

@inject('showStore') @observer
export default class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      addTaskModalShown: false,
      dataModalShown: false
    };
    this.showAddTaskModal = this.showAddTaskModal.bind(this);
    this.showDataModal = this.showDataModal.bind(this);
  }

  render() {
    const {
      hideCompleted,
      toggleHideCompleted,
      alphaSort,
      toggleAlphaSort,
      showStore: { tradeShowId },
    } = this.props;

    const { addTaskModalShown, dataModalShown } = this.state;

    const sortingIconName = alphaSort ? 'sort alphabet down' : 'sort numeric down';
    const sortingIconText = alphaSort ? 'Sort: Vendor' : 'Sort: Booth';

    return (
      <>
        <DataModal open={dataModalShown} closeHander={this.showDataModal}/>
        <TaskModal open={addTaskModalShown} closeHander={this.showAddTaskModal} presetItemType='VI'/>
        <div className='topBar'>
          <Button icon primary basic labelPosition='left' onClick={() => this.showDataModal(true)}>
            <Icon name='calendar alternate outline' />
            {tradeShowId ?? 'Load Show Data...'}
          </Button>
          <Dropdown labeled button text='Data' className='icon basic primary' iconposition='left' icon='database'>
            <Dropdown.Menu>
              <Dropdown.Item>Import...</Dropdown.Item>
              <Dropdown.Item>Export...</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Clear...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button icon primary basic button labelPosition='left' onClick={() => this.showAddTaskModal(true)}>
            <Icon name='plus square outline' />
            Add...
          </Button>
          <div className='BCIflexmenubarspacer' />
          <Button icon primary basic onClick={toggleAlphaSort} button labelPosition='left'>
            <Icon name={sortingIconName} />
            {sortingIconText}
          </Button>
          <Button icon primary basic={!hideCompleted} onClick={toggleHideCompleted} button labelPosition='left'>
            <Icon name='clipboard check' />
            Hide Done
          </Button>
        </div>
        <div className='topBarCondensed'>
          <Button icon primary basic labelPosition='left' onClick={() => this.showDataModal(true)}>
            <Icon name='calendar alternate outline' />
            {tradeShowId ?? 'Load Show Data...'}
          </Button>
          <Dropdown button className='icon basic primary' iconposition='left' icon='database'>
            <Dropdown.Menu>
              <Dropdown.Item>Import...</Dropdown.Item>
              <Dropdown.Item>Export...</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Clear...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button icon primary basic button onClick={() => this.showAddTaskModal(true)}>
            <Icon name='plus square outline' />
          </Button>
          <div className='BCIflexmenubarspacer' />
          <Button icon primary basic onClick={toggleAlphaSort} button>
            <Icon name={sortingIconName} />
          </Button>
          <Button icon primary basic={!hideCompleted} onClick={toggleHideCompleted} button>
            <Icon name='clipboard check' />
          </Button>
        </div>
      </>
    );
  }

  private showAddTaskModal(showIt: boolean): any {
    this.setState({ addTaskModalShown: showIt });
    return;
  }

  private showDataModal(showIt: boolean): any {
    this.setState({ dataModalShown: showIt });
    return;
  }
}
