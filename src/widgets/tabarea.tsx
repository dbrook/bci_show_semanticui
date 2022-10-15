import React from 'react';
import { Tab } from 'semantic-ui-react';

import TaskList from './tasklist';
import TaskDetailList from './taskdetaillist';

interface TabAreaProps {
  hideCompleted: boolean,
};

export default class TabArea extends React.Component<TabAreaProps> {
  render() {
    const innerTabStyle = {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '8px',
      height: '0px',
      overflowY:'auto',
    };

    const panes = [
      {
        menuItem: 'Vendors',
        render: () => {
          return (
            <Tab.Pane attached='top' style={innerTabStyle}>
              List of All Vendors, Baby!
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Map',
        render: () => {
          return (
            <Tab.Pane attached='top' style={innerTabStyle}>
              Trade Show Floor Map Placeholder
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Summary',
        render: () => {
          return (
            <Tab.Pane attached='top' style={innerTabStyle}>
              <TaskList hideCompleted={this.props.hideCompleted} />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Tasks',
        render: () => {
          return (
            <Tab.Pane attached='top' style={innerTabStyle}>
              <TaskDetailList hideCompleted={this.props.hideCompleted} />
            </Tab.Pane>
          );
        },
      },
    ];

    const outerTabStyle = {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    };

    return (
      <Tab menu={{ attached: 'bottom', tabular: true }} panes={panes} style={outerTabStyle} />
    );
  }
}
