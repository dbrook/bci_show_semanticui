import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

import { ISubmittableItem } from '../types/interfaces';

import SimpleSubmittable from './simplesubmittable';

interface SimpleSubmittableGroupProps {
  boothId: number,
  vendor: string,
  items: ISubmittableItem[],
  prefix?: string,
};

export default class SimpleSubmittableGroup extends React.Component<SimpleSubmittableGroupProps> {
  render() {
    const { boothId, vendor, items, prefix } = this.props;

    const itemsAsSubmittables = items.map((x) =>
      <SimpleSubmittable key={x.itemId} itemId={x.itemId} submitted={x.submitted} prefix={prefix}/>
    );

    return <div>
        <Header as='h3'>{boothId} - {vendor}</Header>
        <div className='BCIleftalignflex'>
          {itemsAsSubmittables}
        </div>
        <Divider />
      </div>;
  }
}
