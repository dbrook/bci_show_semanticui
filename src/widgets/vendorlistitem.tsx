import React from 'react';

import { Button } from 'semantic-ui-react';

interface VendorListItemProps {
  boothNum: string;
  vendor: string;
  hasActions: boolean;
  jumpToBoothFunc: (boothId: string) => void;
  showStore?: any;
};

/*
 * VendorListItem Component:
 *
 * Single vendor for use in the Vendor List display tab. This component shows the booth number
 * (highlighted to indicate there is at least 1 action assigned to the boothId / vendor), the
 * vendor name, an indicator if any notes are associated with the vendor, and a button to open
 * the vendor-specific tab to the vendor.
 */
export default class VendorListItem extends React.Component<VendorListItemProps> {
  render() {
    const { boothNum, vendor, hasActions } = this.props;

    const button = hasActions
      ? <Button icon primary button onClick={this.openTaskModal}>{boothNum}</Button>
      : <Button icon primary basic button onClick={this.openTaskModal}>{boothNum}</Button>;

    return <div className='BCIvendorListStyle'>
        {button}
        <span className='BCIvendorListName'>{vendor}</span>
      </div>;
  }

  private openTaskModal = () => {
    this.props.jumpToBoothFunc(this.props.boothNum);
  }
}
