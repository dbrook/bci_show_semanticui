import React from 'react';
import { ChangeEvent, SyntheticEvent } from 'react';
import {
  Button,
  Checkbox,
  CheckboxProps,
  Dropdown,
  Form,
  Input,
  InputProps,
  Message,
  Modal,
  Header,
  DropdownProps,
} from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm } from '../types/enums'

interface TaskModalProps {
  open: boolean,
  closeHander: (arg0: boolean, arg1: string) => any;
  presetBoothId?: string;
  presetVendorName?: string;
  presetItemType?: string;
  subVendors?: string[];
  showStore?: any;
};

interface TaskModalState {
  itemTypeToAdd: string;
  keepOpenOnAdd: boolean;
  inputValue: string;
  pcpbValues: Map<string, number|undefined>;
};

/*
 * Add Task modal:
 *
 * Adds one or more tasks to a vendor of the user's choosing (with a searchable dropdown), or can
 * be instantiated with a booth and/or item type to perform a task addition to a vendor without
 * having to search (useful when instantiated from the Summary tab, for instance).
 */
@inject('showStore') @observer
export default class TaskModal extends React.Component<TaskModalProps, TaskModalState> {
  constructor(props: TaskModalProps, state: TaskModalState) {
    super(props, state);

    // BE WARNED: the way modals work is they're always around/constructed and are shown
    // by a visual trigger. The on/off visual trigger DOES NOT CONSTRUCT THE OBJECT, so
    // relying on a booth ID in the state, specifically, is dangerous if other booths are
    // added to and reuse the existing modal. As a result, preset booth ID will take
    // precedence over the state if it was set.
    this.state = {
      itemTypeToAdd: props?.presetItemType ?? 'NOTE',
      keepOpenOnAdd: false,
      inputValue: '',
      pcpbValues: new Map<string, number|undefined>(),
    };
  };

  render() {
    const {
      open, presetBoothId, presetVendorName, subVendors, showStore: { boothVendors, vendorsWithActions },
    } = this.props;
    const { itemTypeToAdd, keepOpenOnAdd } = this.state;

    let boothNum = boothVendors.get(presetBoothId)?.boothNum;

    let entryField;
    let pbpcSelection;
    let headerText: string = '';
    switch (itemTypeToAdd) {
      case 'NOTE':
        headerText += 'Add Note';
        break;
      case 'QU':
        headerText += 'Add Question';
        break;
      case 'OS':
        headerText += 'Add Open Stock Form';
        break;
      case 'PC':
        headerText += 'Update Profit Centers';
        break;
      case 'PB':
        headerText += 'Update Power Buys';
        break;
    }

    let keepOpenCheckbox = null;
    let addBtnText = 'Add';
    let helperBox = null;
    switch (itemTypeToAdd) {
      case 'NOTE':
      case 'QU':
      case 'OS': {
        let vendorDropDown = null;
        if (itemTypeToAdd === 'OS') {
          let vendorMenu = subVendors?.map((x: any, index) => {
            return {key: index, text: x, value: x}
          });
          vendorDropDown = <Dropdown fluid
                                     selection
                                     options={vendorMenu}
                                     placeholder='Name form from known vendors'
                                     onChange={this.newVendorSelected} />
        }
        entryField = <Form.Group widths='equal'>
            <Form.Field>
              {vendorDropDown}
              <Input fluid
                     label={itemTypeToAdd}
                     defaultValue={this.state.inputValue}
                     onChange={this.changeInputAreaValue} />
            </Form.Field>
          </Form.Group>;
        pbpcSelection = null;
        keepOpenCheckbox = <Checkbox checked={keepOpenOnAdd} onChange={this.setKeepOpened} label='Keep Open'/>;
        break;
      }
      case 'PC':
      case 'PB': {
        let fields = [];
        if (presetBoothId) {
          for (const letter of ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']) {
            let initValPB = vendorsWithActions.get(presetBoothId)?.powerBuys.get(letter)?.quantity;
            let initValPC = vendorsWithActions.get(presetBoothId)?.profitCenters.get(letter)?.quantity;
            let field = <Form.Field inline key={letter}>
                <label style={{fontFamily: 'monospace', fontSize: 'medium'}}>{itemTypeToAdd}-{boothNum}{letter}: </label>
                <Input style={{fontFamily: 'monospace', width: '90px'}}
                       defaultValue={itemTypeToAdd === 'PC' ? initValPC : initValPB}
                       onChange={this.qtyChange}
                       type='number' min='0' max='9999' name={letter} placeholder='Qty' />
              </Form.Field>;
            fields.push(field);
          }
        }
        entryField = null;
        pbpcSelection = <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', columnGap: '45px'}}>{fields}</div>;
        addBtnText = 'Update';
        helperBox = <Message info>
            <Message.Header>How to {headerText}:</Message.Header>
            <p>Use the input boxes to set a quantity above 0 and the profit center will be added. Input boxes that are empty or 0 will be deleted.</p>
          </Message>;
        break;
      }
      default:
        entryField = null;
        pbpcSelection = null;
    }

    let hideAdd = presetBoothId === '' || presetBoothId === undefined || (this.state.inputValue === '' && addBtnText !== 'Update');

    return (
      <Modal open={open} centered={false}>
        <Modal.Header>{headerText}</Modal.Header>
        <Modal.Content scrolling={itemTypeToAdd !== 'OS'}>
        <Header as='h3'>Vendor: {presetVendorName}</Header>
          <Form>
            {helperBox}
            {entryField}
            {pbpcSelection}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {keepOpenCheckbox}
          <Button basic
                  color='green'
                  onClick={this.addEntry}
                  disabled={hideAdd}>
            {addBtnText}
          </Button>
          <Button basic color='grey' onClick={this.modalCloseOps}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  };

  private changeInputAreaValue = (e: SyntheticEvent, data: InputProps) => {
    this.setState({ inputValue: data.value });
  };

  private qtyChange = (e: ChangeEvent<HTMLInputElement>, data: InputProps) => {
    let curItemMap = this.state.pcpbValues;
    let subLetter = e.target.name;
    curItemMap.set(subLetter, +data.value);
    this.setState({ pcpbValues: curItemMap });
  };

  private setKeepOpened = (e: SyntheticEvent, data: CheckboxProps) => {
    this.setState({ keepOpenOnAdd: data.checked as boolean });
  };

  private addEntry = () => {
    let boothId = this.props.presetBoothId;
    switch (this.state.itemTypeToAdd) {
      case 'QU':
        this.props.showStore.addQuestion(boothId, this.state.inputValue);
        break;
      case 'PB':
        this.props.showStore.setPowerBuys(boothId, this.state.pcpbValues);
        break;
      case 'PC':
        this.props.showStore.setProfitCenters(boothId, this.state.pcpbValues);
        break;
      case 'NOTE':
        this.props.showStore.addVendorNote(boothId, this.state.inputValue);
        break;
      case 'OS':
        this.props.showStore.addOpenStock(boothId, this.state.inputValue, OpenStockForm.PICK_UP);
        break;
    }

    this.setState({ inputValue: '', pcpbValues: new Map<string, number|undefined>() });

    if (!this.state.keepOpenOnAdd) {
      this.modalCloseOps();
    }
  };

  private modalCloseOps = () => {
    if (!this.props.presetBoothId) {
      this.setState({ inputValue: '', pcpbValues: new Map<string, number|undefined>() });
    } else {
      this.setState({ inputValue: '', pcpbValues: new Map<string, number|undefined>() });
    }
    this.props.closeHander(false, this.state.itemTypeToAdd);
  };

  private newVendorSelected = (event: SyntheticEvent, data: DropdownProps) => {
    this.setState({ inputValue: data.value as string });
  };
}
