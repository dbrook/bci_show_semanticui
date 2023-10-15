import React from 'react';
import { SyntheticEvent } from 'react';

import { Input, InputProps } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import TaskModal from '../modals/taskmodal';
import VendorListItem from '../widgets/vendorlistitem';

interface VendorListProps {
  alphaSort: boolean;
  showStore?: any;
}

interface VendorListState {
  filterText: string;
  vendorTaskModalBoothId: string|undefined;
}

/*
 * List of all vendors loaded from the Trade Show Data. Allows filtering the vendors with an input
 * component at the top. Can be sorted by booth number or lexicographically by vendor.
 */
@inject('showStore') @observer
export default class VendorList extends React.Component<VendorListProps, VendorListState> {
  constructor(props: VendorListProps, state: VendorListState) {
    super(props, state);
    this.state = { filterText: '', vendorTaskModalBoothId: undefined };
  }

  render() {
    const { alphaSort, showStore: { boothVendors, vendorsWithActions } } = this.props;
    const { filterText, vendorTaskModalBoothId } = this.state;
    const lowerFilterText = filterText.toLowerCase();

    // Filter results by vendor and sort them according to the global sort setting
    const tempVendorStat = Array.from(boothVendors, ([key, value]) => {
      return {boothId: key, boothNum: value.boothNum, vendor: value.vendor};
    }).filter((item: any) => {
      if (lowerFilterText !== '') {
        return item.vendor.toLowerCase().includes(lowerFilterText);
      }
      return true;
    }).sort((a: any, b: any) => {
      if (alphaSort) {
        return a.vendor < b.vendor ? -1 : (a.vendor > b.vendor ? 1 : 0);
      }
      return a.boothId < b.boothId ? -1 : (a.boothId > b.boothId ? 1 : 0);
    });

    // FIXME: make the result from Array.from() above into a type so a VendorListItem
    //        won't need to map with just 'any' as the type
    let vendorRows = tempVendorStat.map((x: any) => {
      const vendorHasActions = vendorsWithActions.has(x.boothId);
      return <VendorListItem key={x.boothId}
                             boothId={x.boothId}
                             boothNum={x.boothNum}
                             vendor={x.vendor}
                             setAddTaskModalBoothId={this.setAddTaskModalBoothId}
                             hasActions={vendorHasActions}/>
    });

    let vendorName = vendorTaskModalBoothId === undefined ? "" : boothVendors.get(vendorTaskModalBoothId).vendor;
    let addTaskModal = <TaskModal open={vendorTaskModalBoothId !== undefined}
        closeHander={this.showAddTaskModal}
        presetBoothId={vendorTaskModalBoothId}
        presetVendorName={vendorName}
      />;

    return (
      <>
        {addTaskModal}
        <Input fluid
               placeholder='Filter Vendors'
               action={{ icon: 'x', onClick: this.clearFilterText }}
               value={filterText}
               onChange={this.updateFilterText} />
        <div className='tabInnerLayout BCIouterVendorList'>
          {vendorRows}
        </div>
      </>
    );
  }

  private updateFilterText = (e: SyntheticEvent, data: InputProps) => {
    this.setState({ filterText: data.value });
  };

  private clearFilterText = (e: SyntheticEvent, data: InputProps) => {
    this.setState({ filterText: '' });
  };

  private setAddTaskModalBoothId = (boothId: string|undefined) => {
    this.setState({ vendorTaskModalBoothId: boothId });
  };

  private showAddTaskModal = (showIt: boolean) => {
    if (!showIt) {
      this.setState({ vendorTaskModalBoothId: undefined });
    }
    return;
  };
}
