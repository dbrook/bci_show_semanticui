import React from 'react';

import { inject, observer } from 'mobx-react';
import { TradeShowData } from '../common/datastore';

import { IVendorDirectory } from '../types/interfaces';
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

    let vendorRows = boothVendors.map((x: IVendorDirectory) => {
      return <VendorListItem key={x.boothId} boothId={x.boothId} boothNum={x.boothNum} vendor={x.vendor}/>
    });

    return (
      <div className='tabInnerLayout'>
        {vendorRows}
      </div>
    );
  }
}
