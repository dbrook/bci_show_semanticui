import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { IVendorDirectory } from '../types/interfaces'

interface BoothModalProps {
  open: boolean,
  closeHandler: (shown: boolean, boothNum: any) => any;
  showStore?: any;
};

/*
 * Modal to show a list of vendors within a booth and provide buttons to add tasks (for booths that
 * don't have any actions yet) or go to the vendow-specific page for that vendor if there are
 * already actions assigned to it.
 */
@inject('showStore') @observer
export default class BoothModal extends React.Component<BoothModalProps> {
  render() {
    const { open, showStore: { mapSelectedBoothNum } } = this.props;

    let vendors = this.getVendorsForBooth(mapSelectedBoothNum);
    return (
      <Modal open={open} centered={false}>
        <Modal.Header>Booth #{mapSelectedBoothNum}</Modal.Header>
        <Modal.Content>
          {vendors}
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='grey' onClick={this.modalCloseOps}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  };

  private getVendorsForBooth = (boothNum: number) => {
    let boothsVendors: string[] = [];

    // Is the booth for a vendor?
    this.props.showStore.boothVendors.forEach((vendor: IVendorDirectory, boothId: string) => {
      if (vendor.boothNum === boothNum) {
        boothsVendors.push(boothId);
      }
    });
    if (boothsVendors.length) {
      let vendors = boothsVendors.map((item: string) => {
        let boothItem = this.props.showStore.boothVendors.get(item);
        let activeBooth = this.props.showStore.vendorsWithActions.get(item);
        if (activeBooth) {
          return <div key={item}>
              <Button color='blue' onClick={() => this.vendorSwitch(item)}>{item}</Button>
              : {boothItem.vendor}
            </div>;
        } else {
          return <div key={item}>
              <Button basic color='blue' disabled>{item}</Button>
              : {boothItem.vendor}
            </div>;
        }
      });
      return vendors;
    }

    // Is the booth for administrative purposes?
    boothsVendors = [];
    this.props.showStore.boothAdmins.forEach((vendor: IVendorDirectory, boothId: string) => {
      if (vendor.boothNum === boothNum) {
        boothsVendors.push(boothId);
      }
    });
    if (boothsVendors.length) {
      let vendors = boothsVendors.map((item: string) => {
        let boothItem = this.props.showStore.boothAdmins.get(item);
        return <div key={item}>{boothItem.vendor}</div>;
      });
      return vendors;
    }

    // Is the booth for a show activity?
    boothsVendors = [];
    this.props.showStore.boothActivities.forEach((vendor: IVendorDirectory, boothId: string) => {
      if (vendor.boothNum === boothNum) {
        boothsVendors.push(boothId);
      }
    });
    if (boothsVendors.length) {
      let vendors = boothsVendors.map((item: string) => {
        let boothItem = this.props.showStore.boothActivities.get(item);
        return <div key={item}>{boothItem.vendor}</div>;
      });
      return vendors;
    }
  };

  private vendorSwitch = (boothId: string) => {
    this.props.showStore.setVendorPanelBoothId(boothId);
    this.props.closeHandler(false, boothId);
  }

  private modalCloseOps = () => {
    this.props.closeHandler(false, undefined);
  };
}
