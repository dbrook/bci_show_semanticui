import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { IVendorDirectory } from '../types/interfaces'

interface BoothModalProps {
  open: boolean,
  setAddTaskModal: (boothId: string|undefined) => any;
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

  private getVendorsForBooth = (boothNum: string) => {
    // Is the booth for vendors?
    if (this.props.showStore.boothVendors.get(boothNum)?.vendors.length) {
      let vendors = [
        <Header as='h3' key='HEAD'>
          {this.props.showStore.boothVendors.get(boothNum).boothName}
        </Header>,
        this.props.showStore.boothVendors.get(boothNum).vendors.map((vendorName: string) => {
          return <div key={vendorName}>{vendorName}</div>;
        })
      ];

      if (this.props.showStore.vendorsWithActions.get(boothNum)) {
        vendors.push(<Button basic color='blue' onClick={() => this.newVendorTask(boothNum)}>
          Go to Vendor Tab
        </Button>);
      } else {
        vendors.push(<Button basic color='blue' onClick={() => this.newVendorTask(boothNum)}>
          Initialize Vendor
        </Button>);
      }
      return vendors;
    }

    // Is the booth for administrative purposes?
    if (this.props.showStore.boothAdmins.get(boothNum)) {
      return <Header as='h3'>{this.props.showStore.boothAdmins.get(boothNum).boothName}</Header>;
    }

    // Is the booth for a show activity?
    if (this.props.showStore.boothActivities.get(boothNum)) {
      return <Header as='h3'>{this.props.showStore.boothActivities.get(boothNum).boothName}</Header>;
    }
  };

  private vendorSwitch = (boothId: string) => {
    this.props.showStore.setVendorPanelBoothId(boothId);
    this.props.closeHandler(false, boothId);
  };

  private newVendorTask = (boothId: string) => {
    this.props.setAddTaskModal(boothId);
    this.props.closeHandler(false, undefined);
  };

  private modalCloseOps = () => {
    this.props.setAddTaskModal(undefined);
    this.props.closeHandler(false, undefined);
  };
}
