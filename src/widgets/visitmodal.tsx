import React from 'react';
import { Button, Divider, Dropdown, Form, Modal } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { VendorVisit, OpenStockForm } from  '../types/enums';

interface VisitModalProps {
  open: boolean,
  closeHander: (arg0: boolean) => any;
  boothId: string;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

interface VisitModalState {
  visitation: VendorVisit;
  openStock: OpenStockForm,
  openStockChanged: boolean,
};

@inject('showStore') @observer
export default class VisitModal extends React.Component<VisitModalProps, VisitModalState> {
  private visitOptions;
  private openStockOptions;

  constructor(props: VisitModalProps, state: VisitModalState) {
    super(props, state);

    this.state = {
      visitation: props?.showStore.vendorsWithActions.get(props.boothId).visit,
      openStock: props?.showStore.vendorsWithActions.get(props.boothId).openStockForm,
      openStockChanged: false,
    };

    this.visitOptions = [
      { key: VendorVisit.DO_NOT_VISIT, text: 'Do Not Visit', value: VendorVisit.DO_NOT_VISIT, },
      { key: VendorVisit.NOT_VISITED,  text: 'Not Visited',  value: VendorVisit.NOT_VISITED,  },
      { key: VendorVisit.VISITED,      text: 'Visited',      value: VendorVisit.VISITED,      },
      { key: VendorVisit.NEED_REVISIT, text: 'Revisit',      value: VendorVisit.NEED_REVISIT, },
    ];
    this.openStockOptions = [
      { key: OpenStockForm.DO_NOT_GET, text: 'None',      value: OpenStockForm.DO_NOT_GET, },
      { key: OpenStockForm.PICK_UP,    text: 'Pick Up',   value: OpenStockForm.PICK_UP,    },
      { key: OpenStockForm.RETRIEVED,  text: 'Retrieved', value: OpenStockForm.RETRIEVED,  },
      { key: OpenStockForm.FILLED_IN,  text: 'Filled-In', value: OpenStockForm.FILLED_IN,  },
      { key: OpenStockForm.SUBMITTED,  text: 'Submitted', value: OpenStockForm.SUBMITTED,  },
      { key: OpenStockForm.ABANDONED,  text: 'Abandoned', value: OpenStockForm.ABANDONED,  },
    ];
  }

  render() {
    const { open, closeHander, boothId, showStore: { vendorsWithActions } } = this.props;
    const vendorName = vendorsWithActions.get(boothId).vendor;
    const initialVisitState = vendorsWithActions.get(boothId).visit;
    const initialOpenStock = vendorsWithActions.get(boothId).openStockForm;

    return (
      <Modal open={open}>
        <Modal.Header>{vendorName} ({boothId})</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Quick Actions (sets and submits)</label>
                <Form.Field className='BCIvendorquickactions'>
                  <Button basic color='orange' onClick={this.getOSLater}>Get OS Later</Button>
                  <Button basic color='purple' onClick={this.pickupOS}>Picked Up OS</Button>
                  <Button basic color='green' onClick={this.submitOS}>Submitted OS</Button>
                  <Button basic color='red' onClick={this.nothingMore}>Skip OS</Button>
                  <Button basic color='pink' onClick={this.revistWithQ}>Question & Revisit</Button>
                </Form.Field>
              </Form.Field>
            </Form.Group>
            <Divider />
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Visit</label>
                <Dropdown selection
                          options={this.visitOptions}
                          defaultValue={initialVisitState}
                          onChange={this.newVisit} />
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Open Stock Form</label>
                <Dropdown selection
                          options={this.openStockOptions}
                          defaultValue={initialOpenStock}
                          onChange={this.newOpenStock} />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='green' onClick={this.updateVendorAction}>Update</Button>
          <Button basic color='grey' onClick={() => closeHander(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private newVisit = (e: any, data: any) => {
    this.setState({ visitation: data.value });
  };

  private newOpenStock = (e: any, data: any) => {
    this.setState({ openStock: data.value, openStockChanged: true });
  };

  private getOSLater = () => {
    this.props.showStore.setVisitMode(this.props.boothId, VendorVisit.VISITED);
    this.props.showStore.setOpenStock(this.props.boothId, OpenStockForm.PICK_UP);
    this.props.closeHander(false);
  };

  private pickupOS = () => {
    this.props.showStore.setVisitMode(this.props.boothId, VendorVisit.VISITED);
    this.props.showStore.setOpenStock(this.props.boothId, OpenStockForm.RETRIEVED);
    this.props.closeHander(false);
  };

  private submitOS = () => {
    this.props.showStore.setVisitMode(this.props.boothId, VendorVisit.VISITED);
    this.props.showStore.setOpenStock(this.props.boothId, OpenStockForm.SUBMITTED);
    this.props.closeHander(false);
  };

  private revistWithQ = () => {
    this.props.showStore.setVisitMode(this.props.boothId, VendorVisit.NEED_REVISIT);
    this.props.showStore.addQuestion(this.props.boothId, 'FROM_VISIT_MENU');
    this.props.closeHander(false);
  };

  private nothingMore = () => {
    this.props.showStore.setVisitMode(this.props.boothId, VendorVisit.VISITED);
    this.props.showStore.setOpenStock(this.props.boothId, OpenStockForm.DO_NOT_GET);
    this.props.closeHander(false);
  };

  private updateVendorAction = (e: any, data: any) => {
    this.props.showStore.setVisitMode(this.props.boothId, this.state.visitation);

    // Workaround: open modal after changing open stock form widget - original state at
    // time of construction is used as the value, so only do this if the OS value was changed
    if (this.state.openStockChanged) {
      this.props.showStore.setOpenStock(this.props.boothId, this.state.openStock);
    }

    this.props.closeHander(false);
  };
}
