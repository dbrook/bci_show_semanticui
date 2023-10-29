import React from 'react';

import { Accordion, Button, Icon } from 'semantic-ui-react';

interface VendorListItemProps {
  boothNum: string;
  boothName: string;
  vendors: string[];
  hasActions: boolean;
  expand: boolean;
  filter: string;
  jumpToBoothFunc: (boothId: string) => void;
  showStore?: any;
};

interface VendorListItemState {
  activeIndex: number;
};

/*
 * VendorListItem Component:
 *
 * Single vendor for use in the Vendor List display tab. This component shows the booth number
 * (highlighted to indicate there is at least 1 action assigned to the boothId / vendor), the
 * vendor name, an indicator if any notes are associated with the vendor, and a button to open
 * the vendor-specific tab to the vendor.
 */
export default class VendorListItem extends React.Component<VendorListItemProps, VendorListItemState> {
  constructor(props: VendorListItemProps, state: VendorListItemState) {
    super(props, state);
    this.state = { activeIndex: props.expand ? 0 : -1 };
  }

  render() {
    const { boothNum, boothName, hasActions, expand, filter } = this.props;
    const activeIndex = this.state.activeIndex;
    let vendors = this.props.vendors;

    const button = hasActions
      ? <Button icon primary button onClick={this.openTaskModal}>{boothNum}</Button>
      : <Button icon primary basic button onClick={this.openTaskModal}>{boothNum}</Button>;

    if (filter) {
      vendors = vendors.filter((vendorName) => vendorName.toLowerCase().includes(filter));
    }
    let subVendors = <ul>{vendors.map((vendor, index) => {
        return <li key={index}>{vendor}</li>;
      })}</ul>;

    return <div className='BCIvendorListStyle'>
        {button}
        <span className='BCIvendorListName'>
          <Accordion>
            <Accordion.Title active={expand || activeIndex === 0}
                             index={0}
                             onClick={this.handleExpand}>
              <Icon name='dropdown' />
              {boothName}
            </Accordion.Title>
            <Accordion.Content active={expand || activeIndex === 0}>{subVendors}</Accordion.Content>
          </Accordion>
        </span>
      </div>;
  }

  private openTaskModal = () => {
    this.props.jumpToBoothFunc(this.props.boothNum);
  };

  private handleExpand = () => {
    this.setState({ activeIndex: this.state.activeIndex === 0 ? -1 : 0 })
  };
}
