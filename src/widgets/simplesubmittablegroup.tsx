import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import SimpleSubmittable from './simplesubmittable';

interface SimpleSubmittableGroupProps {
  boothNum: number;
  vendor: string;
  items: number[];
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
      showStore: { powerBuys, profitCenters },
    } = this.props;

    const itemsAsSubmittables = items.map((x) => {
      if (prefix === 'PB') {
        const { submitted } = powerBuys[x];
        if (hideCompleted && submitted) {
          return null;
        }
        return <SimpleSubmittable key={x} itemIdx={x} prefix={prefix}/>;
      } else if (prefix === 'PC') {
        const { submitted } = profitCenters[x];
        if (hideCompleted && submitted) {
          return null;
        }
        return <SimpleSubmittable key={x} itemIdx={x} prefix={prefix}/>;
      }
      return null;
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
