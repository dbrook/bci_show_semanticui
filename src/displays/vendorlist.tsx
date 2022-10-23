import React from 'react';

import { IVendorDirectory } from '../types/interfaces';
import VendorListItem from '../widgets/vendorlistitem';

export default class TaskList extends React.Component {
  render() {
    const tempVendorStat: IVendorDirectory[] = [
      {
        boothId: '100-0',
        boothNum: 100,
        vendor: 'Initial Added',
      },
      {
        boothId: '196-0',
        boothNum: 196,
        vendor: 'Company Foo',
      },
      {
        boothId: '205-0',
        boothNum: 205,
        vendor: 'Bar, Inc.',
      },
      {
        boothId: '212-0',
        boothNum: 212,
        vendor: 'Another Industries Inc, a DEWARTIMER enterprises subsidiary',
      },
      {
        boothId: '222-0',
        boothNum: 222,
        vendor: 'Yet Another, Inc.',
      },
      {
        boothId: '222-1',
        boothNum: 222,
        vendor: 'Visited Co.',
      },
      {
        boothId: '239-0',
        boothNum: 239,
        vendor: 'Testing Ltd.',
      },
      {
        boothId: '246-0',
        boothNum: 246,
        vendor: 'Abandoned Forms',
      },
      {
        boothId: '247-0',
        boothNum: 247,
        vendor: 'Vendor Revisit, Inc.',
      },
      {
        boothId: '998-0',
        boothNum: 998,
        vendor: 'Everything, Inc.',
      },
      {
        boothId: '999-0',
        boothNum: 999,
        vendor: 'Power Corporation',
      },
    ];

    let vendorRows = tempVendorStat.map((x: IVendorDirectory) => {
      return <VendorListItem key={x.boothId} boothId={x.boothId} boothNum={x.boothNum} vendor={x.vendor}/>
    });

    return (
      <div className='tabInnerLayout'>
        {vendorRows}
      </div>
    );
  }
}
