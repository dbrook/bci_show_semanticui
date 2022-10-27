import React from 'react';
import { Tab } from 'semantic-ui-react';

import VendorList from './vendorlist';
import Summary from './summary';
import TaskDetailList from './taskdetaillist';

interface TabAreaProps {
  hideCompleted: boolean;
};

export default class TabArea extends React.Component<TabAreaProps> {
  render() {
    const panes = [
      {
        menuItem: 'Vendors',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <VendorList />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Map',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              Trade Show Floor Map Placeholder
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Summary',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <Summary hideCompleted={this.props.hideCompleted} />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Tasks',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <TaskDetailList hideCompleted={this.props.hideCompleted} />
            </Tab.Pane>
          );
        },
      },
    ];

    return (
      <Tab menu={{ attached: 'bottom', tabular: true }} panes={panes} className='outerTabStyle' />
    );
  }
}
