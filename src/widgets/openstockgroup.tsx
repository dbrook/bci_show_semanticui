import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm } from '../types/enums'
import { IOpenStock } from '../types/interfaces'
import OpenStock from './openstock';

interface OpenStockGroupProps {
  boothNum: string;
  vendor: string;
  items: IOpenStock[];
  hideCompleted: boolean;
  hideVendor: boolean;
  showStore?: any;
};

/*
 * SimpleSubmittableGroup Component:
 *
 * Collection of all OpenStock items belonging to a single vendor.
 */
@inject('showStore') @observer
export default class OpenStockGroup extends React.Component<OpenStockGroupProps> {
  render() {
    const {
      boothNum,
      vendor,
      items,
      hideCompleted,
      hideVendor,
    } = this.props;

    const itemsAsSubmittables = items.map((x, itemIdx) => {
      const { label, formState } = x;
      if (hideCompleted &&
          (formState === OpenStockForm.ABANDONED || formState === OpenStockForm.SUBMITTED)) {
        return null;
      }
      return <OpenStock key={itemIdx}
                        formStatus={formState}
                        name={label}
                        boothNum={boothNum}
                        itmIdx={itemIdx} />;
    });

    let header = null;
    let divider = null;
    if (!hideVendor) {
      header = <Header as='h3'>{boothNum} - {vendor}</Header>;
      divider = <Divider />;
    }

    return <div>
        {header}
        <div className='BCItaskitemsflex'>
          {itemsAsSubmittables}
        </div>
        {divider}
      </div>;
  }
}
