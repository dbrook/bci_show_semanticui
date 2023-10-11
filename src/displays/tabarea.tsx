import React from 'react';
import { SyntheticEvent } from 'react';

import { Tab, TabProps } from 'semantic-ui-react';

import VendorList from './vendorlist';
import FloorPlan from './floorplan';
import Summary from './summary';
import TaskDetailList from './taskdetaillist';
import SingleVendor from './singlevendor';

interface TabAreaProps {
  hideCompleted: boolean;
  alphaSort: boolean;
};

interface TabAreaState {
  activeTab: number;
};

/*
 * Primary application tabbed interface, wraps each component in a Tab Pane.
 * This is a controlled component that will be reset to the vendors list after the Data Management
 * modal is opened (or else changing shows will lead to confusingly empty contents in the other
 * tabs as all the data is refreshed in the MobX store).
 */
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
        menuItem: 'Index',
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
              <FloorPlan boothButtonClick={this.switchToSingleVendorTab} />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Vendor',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <SingleVendor />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'Summary',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <Summary hideCompleted={this.props.hideCompleted}
                       alphaSort={this.props.alphaSort}
                       boothButtonClick={this.switchToSingleVendorTab} />
            </Tab.Pane>
          );
        },
      },
      {
        menuItem: 'All',
        render: () => {
          return (
            <Tab.Pane attached='top' className='innerTabStyle'>
              <TaskDetailList hideCompleted={this.props.hideCompleted}
                              alphaSort={this.props.alphaSort} />
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

  public switchToSingleVendorTab = () => {
    this.setState({ activeTab: 2 });
  };
}
