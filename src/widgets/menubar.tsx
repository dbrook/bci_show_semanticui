import React from 'react';
import { Button, Dropdown, Icon, Menu } from 'semantic-ui-react';

import TaskModal from './taskmodal';

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

    const menuStyle = {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: '8px 4px 8px 8px',
      marginBottom: '5px',
    };

    const buttonStyle = {
      alignSelf: 'stretch',
    };

    const spacerStyle = {
      flexGrow: 1,
    };

    return (
      <>
        <TaskModal open={addTaskModalShown} closeHander={this.showAddTaskModal} presetItemType='VI'/>
        <Menu style={menuStyle}>
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
        </Menu>
      </>
    );
  }

  private showAddTaskModal(showIt: boolean): any {
    this.setState({ addTaskModalShown: showIt });
    return;
  }
}
