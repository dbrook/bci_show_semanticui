import React from 'react';
import { SyntheticEvent } from 'react';

import { Tab, TabProps } from 'semantic-ui-react';

import VendorList from './vendorlist';
import FloorPlan from './floorplan';
import Summary from './summary';
import TaskDetailList from './taskdetaillist';

interface TabAreaProps {
  hideCompleted: boolean;
  alphaSort: boolean;
};

interface TabAreaState {
  activeTab: number;
};

export default class TabArea extends React.Component<TabAreaProps, TabAreaState> {
  constructor(props: TabAreaProps, state: TabAreaState) {
    super(props, state);
    this.state = {
      activeTab: 0,
    };
  }

  render() {
    const { activeTab } = this.state;
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
      <Tab menu={{ attached: 'bottom', tabular: true }}
           activeIndex={activeTab}
           onTabChange={this.handleTabChange}
           panes={panes}
           className='outerTabStyle' />
    );
  }

  private handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    this.setState({ activeTab: data.activeIndex as number });
  };

  public switchToVendorsList = () => {
    this.setState({ activeTab: 0 });
  };
}
