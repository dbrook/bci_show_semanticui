import React from 'react';

import { Button, List } from 'semantic-ui-react';

interface VendorListItemProps {
  boothNum: string;
  boothName: string;
  vendors: string[];
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
    const { boothNum, boothName, vendors, hasActions } = this.props;

    const button = hasActions
      ? <Button icon primary button onClick={this.openTaskModal}>{boothNum}</Button>
      : <Button icon primary basic button onClick={this.openTaskModal}>{boothNum}</Button>;

    const subVendors = vendors.length > 1
      ? <List>{vendors.map((vendor) => <List.Item>{vendor}</List.Item>)}</List>
      : null;

    return <div className='BCIvendorListStyle'>
        {button}
        <span className='BCIvendorListName'>
          <b>{boothName}</b>
          {subVendors}
        </span>
      </div>;
  }

  private openTaskModal = () => {
    this.props.jumpToBoothFunc(this.props.boothNum);
  }
}
