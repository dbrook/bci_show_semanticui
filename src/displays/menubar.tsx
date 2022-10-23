import React from 'react';
import { Button, Dropdown, Icon } from 'semantic-ui-react';

import TaskModal from '../widgets/taskmodal';

interface MenuBarProps {
  hideCompleted: boolean,
  toggleHideCompleted: () => void,
};

interface MenuBarState {
  addTaskModalShown: boolean,
};

export default class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
  constructor(props: any) {
    super(props);
    this.state = { addTaskModalShown: false };
    this.showAddTaskModal = this.showAddTaskModal.bind(this);
  }

  render() {
    const { hideCompleted, toggleHideCompleted } = this.props;
    const { addTaskModalShown } = this.state;

    const buttonStyle = {
      alignSelf: 'stretch',
    };

    const spacerStyle = {
      flexGrow: 1,
    };

    return (
      <>
        <TaskModal open={addTaskModalShown} closeHander={this.showAddTaskModal} presetItemType='VI'/>
        <div className='topBar'>
          <Button icon primary basic labelPosition='left' style={buttonStyle}>
            <Icon name='calendar alternate outline' />
            2022-Fall (ACY)
          </Button>
          <Dropdown labeled button text='Data' className='icon basic primary' iconposition='left' icon='database'>
            <Dropdown.Menu>
              <Dropdown.Item>Import...</Dropdown.Item>
              <Dropdown.Item>Export...</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Clear...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div style={spacerStyle} />
          <Button icon primary basic={!hideCompleted} onClick={toggleHideCompleted} button labelPosition='left'>
            <Icon name='clipboard check' />
            Hide Done
          </Button>
          <Button icon primary basic button labelPosition='left' onClick={() => this.showAddTaskModal(true)}>
            <Icon name='plus square outline' />
            Add...
          </Button>
        </div>
        <div className='topBarCondensed'>
          <Button icon primary basic labelPosition='left' style={buttonStyle}>
            <Icon name='calendar alternate outline' />
            2022-Fall (ACY)
          </Button>
          <Dropdown button className='icon basic primary' iconposition='left' icon='database'>
            <Dropdown.Menu>
              <Dropdown.Item>Import...</Dropdown.Item>
              <Dropdown.Item>Export...</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Clear...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div style={spacerStyle} />
          <Button icon primary basic={!hideCompleted} onClick={toggleHideCompleted} button>
            <Icon name='clipboard check' />
          </Button>
          <Button icon primary basic button onClick={() => this.showAddTaskModal(true)}>
            <Icon name='plus square outline' />
          </Button>
        </div>
      </>
    );
  }

  private showAddTaskModal(showIt: boolean): any {
    this.setState({ addTaskModalShown: showIt });
    return;
  }
}
