import React from 'react';

import { Input } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import VendorListItem from '../widgets/vendorlistitem';

interface VendorListProps {
  alphaSort: boolean;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
}

interface VendorListState {
  filterText: string;
}

@inject('showStore') @observer
export default class VendorList extends React.Component<VendorListProps, VendorListState> {
  constructor(props: any, state: any) {
    super(props, state);
    this.state = { filterText: '' };
  }

  render() {
    const { alphaSort, showStore: { boothVendors, vendorsWithActions } } = this.props;
    const { filterText } = this.state;
    const lowerFilterText = filterText.toLowerCase();

    // FIXME: Maybe make this whole thing sortable by vendor -OR- booth number?
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
                             hasActions={vendorHasActions}/>
    });

    return (
      <>
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

  private updateFilterText = (e: any, data: any) => {
    this.setState({ filterText: e.target.value });
  };

  private clearFilterText = (e: any, data: any) => {
    this.setState({ filterText: '' });
  };
}
