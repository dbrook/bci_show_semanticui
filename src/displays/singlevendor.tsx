import React from 'react';
import { ChangeEvent, SyntheticEvent } from 'react';
import { Dropdown, DropdownProps, Form } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

// import { OpenStockForm } from '../types/enums';
// import { IVendorStatus } from '../types/interfaces';
import VendorActions from '../widgets/vendoractions';

interface SingleVendorProps {
  showStore?: any;
};

interface DataModalState {
  selectedVendor: string|undefined;
};

/*
 * Contents of the ...
 */
@inject('showStore') @observer
export default class SingleVendor extends React.Component<SingleVendorProps, DataModalState> {
  render() {
    const { showStore: { vendorPanelBoothId, vendorsWithActions } } = this.props;

    const tempVendorStat = Array.from(vendorsWithActions, ([key, value]) => {
      return {boothId: key, boothNum: value.boothNum, vendor: value.vendor};
    });

    let vendorMenu = tempVendorStat.map((x: any) => {
      return {key: x.boothId, text: `${x.boothNum} - ${x.vendor}`, value: x.boothId}
    });

    return (
      <div className='tabInnerLayout'>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Select Vendor:</label>
            <Dropdown selection
                      options={vendorMenu}
                      placeholder='Vendors'
                      defaultValue={vendorPanelBoothId ?? vendorPanelBoothId}
                      onChange={this.newVendorSelected} />
          </Form.Field>
        </Form.Group>
      </div>
    );
  }

  private newVendorSelected = (e: SyntheticEvent, data: DropdownProps) => {
    this.props.showStore.setVendorPanelBoothId(data.value as string);
//     this.setState({ selectedVendor: data.value as string });
  };
}
