import React from 'react';
import { Button, Dropdown, Icon, Menu } from 'semantic-ui-react';

export default class MenuBar extends React.Component {
  render() {
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
      <Menu style={menuStyle}>
        <Button icon primary basic labelPosition='left' style={buttonStyle}>
          <Icon name='calendar alternate outline' />
          2022-Fall (ACY)
        </Button>
        <Dropdown labeled button text='Data' className='icon basic primary' iconPosition='left' icon='database'>
          <Dropdown.Menu>
            <Dropdown.Item>Import...</Dropdown.Item>
            <Dropdown.Item>Export...</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Clear...</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div style={spacerStyle} />
        <Button icon primary basic button labelPosition='left'>
          <Icon name='clipboard check' />
          Hide Done
        </Button>
        <Button icon primary basic button labelPosition='left'>
          <Icon name='plus square outline' />
          New Task
        </Button>
      </Menu>
    );
  }
}
