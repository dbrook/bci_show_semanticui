import React from 'react';
import { Tab } from 'semantic-ui-react';

import VendorList from './vendorlist';
import FloorPlan from './floorplan';
import Summary from './summary';
import TaskDetailList from './taskdetaillist';

interface TabAreaProps {
  hideCompleted: boolean;
  alphaSort: boolean;
};

export default class TabArea extends React.Component<TabAreaProps> {
  render() {
    const panes = [
      {
        menuItem: 'Vendors',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <VendorList alphaSort={this.props.alphaSort} />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Map',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <FloorPlan />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Summary',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <Summary hideCompleted={this.props.hideCompleted} alphaSort={this.props.alphaSort} />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Tasks',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <TaskDetailList hideCompleted={this.props.hideCompleted} alphaSort={this.props.alphaSort} />
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
