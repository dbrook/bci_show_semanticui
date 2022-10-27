import React from 'react';

import { inject, observer } from 'mobx-react';

import VendorListItem from '../widgets/vendorlistitem';

interface TaskListProps {
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
}

@inject('showStore') @observer
export default class TaskList extends React.Component<TaskListProps> {
  render() {
    const { showStore: { boothVendors } } = this.props;

    // FIXME: Maybe make this whole thing sortable by vendor -OR- booth number?
    const tempVendorStat = Array.from(boothVendors, ([key, value]) => {
      return {boothId: key, boothNum: value.boothNum, vendor: value.vendor};
    });

    // FIXME: make the result from Array.from() above into a type so a VendorListItem
    //        won't need to map with just 'any' as the type
    let vendorRows = tempVendorStat.map((x: any) => {
      return <VendorListItem key={x.boothId} boothId={x.boothId} boothNum={x.boothNum} vendor={x.vendor}/>
    });

    return (
      <div className='tabInnerLayout'>
        {vendorRows}
      </div>
    );
  }
}
