import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { ISubmittableQty } from '../types/interfaces';
import SimpleSubmittable from './simplesubmittable';

interface SimpleSubmittableGroupProps {
  boothNum: string;
  vendor: string;
  items: Map<string, ISubmittableQty>;
  hideCompleted: boolean;
  hideVendor: boolean;
  prefix: string;
  showStore?: any;
};

/*
 * SimpleSubmittableGroup Component:
 *
 * Collection of all SimpleSubmittable components belonging to a single vendor.
 */
@inject('showStore') @observer
export default class SimpleSubmittableGroup extends React.Component<SimpleSubmittableGroupProps> {
  render() {
    const {
      boothNum,
      vendor,
      items,
      hideCompleted,
      hideVendor,
      prefix,
    } = this.props;

    let itemsAsSubmittables: React.ReactElement[] = [];
    if (items) {
      items.forEach((value, key) => {
        let submitted = value.submitted as boolean;
        if (!(hideCompleted && submitted)) {
          itemsAsSubmittables.push(
            <SimpleSubmittable key={key} 
              boothNum={boothNum} 
              submitted={submitted} 
              quantity={value.quantity}
              prefix={prefix} 
              itemId={key} />
          );
        }
      });
    }

    let header = hideVendor ? null : <Header as='h3'>{boothNum} - {vendor}</Header>;
    let divider = hideVendor ? null : <Divider />;
    return <div>
        {header}
        <div className='BCItaskitemsflex'>
          {itemsAsSubmittables}
        </div>
        {divider}
      </div>;
  }
}
