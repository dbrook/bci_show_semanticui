import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import SimpleSubmittable from './simplesubmittable';

interface SimpleSubmittableGroupProps {
  boothNum: number;
  vendor: string;
  items: number[];
  hideCompleted: boolean;
  prefix: string;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

@inject('showStore') @observer
export default class SimpleSubmittableGroup extends React.Component<SimpleSubmittableGroupProps> {
  render() {
    const { boothNum, vendor, items, hideCompleted, prefix, showStore: { powerBuys, profitCenters } } = this.props;

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

    return <div>
        <Header as='h3'>{boothNum} - {vendor}</Header>
        <div className='BCItaskitemsflex'>
          {itemsAsSubmittables}
        </div>
        <Divider />
      </div>;
  }
}
