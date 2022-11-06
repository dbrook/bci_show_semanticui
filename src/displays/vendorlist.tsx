import React from 'react';

import { inject, observer } from 'mobx-react';

import VendorListItem from '../widgets/vendorlistitem';

interface TaskListProps {
  alphaSort: boolean;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
}

@inject('showStore') @observer
export default class TaskList extends React.Component<TaskListProps> {
  render() {
    const { alphaSort, showStore: { boothVendors, vendorsWithActions } } = this.props;

    // FIXME: Maybe make this whole thing sortable by vendor -OR- booth number?
    const tempVendorStat = Array.from(boothVendors, ([key, value]) => {
      return {boothId: key, boothNum: value.boothNum, vendor: value.vendor};
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
                             hasActions={vendorHasActions}/>
    });

    return (
      <div className='tabInnerLayout BCIouterVendorList'>
        {vendorRows}
      </div>
    );
  }
}
