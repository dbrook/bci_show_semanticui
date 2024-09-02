import React, { createRef } from 'react';
import { ChangeEvent, SyntheticEvent } from 'react';
import {
  Button,
  Form,
  Input,
  InputProps,
  Message,
  Modal,
} from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { SimpleSubmittableType } from '../types/enums';

interface BulkAddModalProps {
  open: boolean,
  closeHandler: (isShown: boolean) => any;
  type: SimpleSubmittableType;
  showStore?: any;
};

interface BulkAddModalState {
  inBoothNum: string;
  inItemCode: string;
  inItemQty: number;
  successMsg: string;
  rejectMsg: string;
};

/*
 * Bulk Add Task modal:
 *
 * Facilitates adding multiple Profit Center items across all booths.
 */
@inject('showStore') @observer
export default class BulkAddModal extends React.Component<BulkAddModalProps, BulkAddModalState> {
  private boothInputRef: React.RefObject<Input>;
  private pcInputRef: React.RefObject<Input>;

  constructor(props: BulkAddModalProps, state: BulkAddModalState) {
    super(props, state);
    this.state = {
      inBoothNum: '',
      inItemCode: '',
      inItemQty: 1,
      successMsg: '',
      rejectMsg: '',
    };
    this.boothInputRef = createRef();
    this.pcInputRef = createRef();
  }

  render() {
    const headerText = this.props.type === 'PC' ? 'Profit Center' : 'Power Buy';
    return (
      <Modal open={this.props.open} centered={false}>
        <Modal.Header>Bulk-Add {headerText} Items</Modal.Header>
        <Modal.Content scrolling={true}>
          <Form>
            <Form.Group>
              <Form.Field>
                <Input style={{fontFamily: 'monospace', width: '85px'}}
                       label={this.props.type}
                       ref={this.boothInputRef}
                       maxLength={3}
                       value={this.state.inBoothNum}
                       onChange={this.boothNumChange} />
              </Form.Field>
              <Form.Field>
                <Input style={{fontFamily: 'monospace', width: '45px'}}
                       ref={this.pcInputRef}
                       maxLength={1}
                       value={this.state.inItemCode}
                       onChange={this.pcCodeChange} />
              </Form.Field>
              <Form.Field>
                Qty:
                <Input style={{fontFamily: 'monospace', width: '90px'}}
                       value={this.state.inItemQty}
                       onChange={this.qtyChange}
                       type='number' min='0' max='9999' placeholder='Qty' />
              </Form.Field>
              <Form.Field>
                <Button primary button onClick={this.addSameBooth}>Add (Retain Booth)</Button>
                <Button primary button onClick={this.addDiffBooth}>Add (Different Booth)</Button>
              </Form.Field>
            </Form.Group>
          </Form>
          {this.state.successMsg
            ? <Message success>{this.state.successMsg}</Message>
            : null
          }
          {this.state.rejectMsg
            ? <Message negative>{this.state.rejectMsg}</Message>
            : null
          }
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='grey' onClick={this.modalCloseOps}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private boothNumChange = (e: SyntheticEvent, data: InputProps) => {
    this.setState({ inBoothNum: data.value });
  };

  private pcCodeChange = (e: SyntheticEvent, data: InputProps) => {
    const upperified = data.value.toUpperCase();
    this.setState({ inItemCode: upperified });
  };

  private qtyChange = (e: ChangeEvent<HTMLInputElement>, data: InputProps) => {
    this.setState({ inItemQty: data.value });
  };

  private addSameBooth = () => {
    if (this.updatePCList()) {
      this.setState({
        inItemCode: '',
        inItemQty: 1,
      });
      this.pcInputRef.current?.focus();
    } else {
      this.boothInputRef.current?.focus();
    }
  };

  private addDiffBooth = () => {
    if (this.updatePCList()) {
      this.setState({
        inBoothNum: '',
        inItemCode: '',
        inItemQty: 1,
      });
    }
    this.boothInputRef.current?.focus();
  };

  private updatePCList = (): boolean => {
    const boothNum = this.state.inBoothNum;
    const booth = this.props.showStore.boothVendors.get(boothNum);
    if (!booth) {
      this.setState({
        successMsg: '',
        rejectMsg: `Requested Booth (${boothNum}) does not exist or is not a vendor booth number.`,
      });
      return false;
    }
    const itemCode = this.state.inItemCode;
    if (itemCode.length !== 1 || !itemCode.match(/[A-Z]/)) {
      this.setState({
        successMsg: '',
        rejectMsg: `Invalid ${this.props.type} Code specified (${itemCode}), must be [A-Z].`,
      });
      return false;
    }
    if (this.props.type === 'PC') {
      this.props.showStore.updateProfitCenter(boothNum, itemCode, +this.state.inItemQty);
    } else if (this.props.type === 'PB') {
      this.props.showStore.updatePowerBuy(boothNum, itemCode, +this.state.inItemQty);
    } else {
      this.setState({
        successMsg: "",
        rejectMsg: "Tried to add something that wasn't a Power Buy or Profit Center",
      });
      return false;
    }
    this.setState({
      successMsg: `Updated ${this.props.type}-${boothNum}${itemCode} with quantity ${this.state.inItemQty}`,
      rejectMsg: '',
    });
    return true;
  };

  private modalCloseOps = () => {
    this.setState({
      inBoothNum: '',
      inItemCode: '',
      inItemQty: 1,
    });
    this.props.closeHandler(false);
  };
}
