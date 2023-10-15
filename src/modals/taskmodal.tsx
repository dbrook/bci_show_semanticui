import React from 'react';
import { SyntheticEvent } from 'react';
import {
  Button,
  Checkbox,
  CheckboxProps,
  Dropdown,
  DropdownProps,
  Form,
  Input,
  InputProps,
  Modal,
} from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm } from '../types/enums'

interface TaskModalProps {
  open: boolean,
  closeHander: (arg0: boolean) => any;
  presetBoothId?: string;
  presetVendorName?: string;
  presetItemType?: string;
  showStore?: any;
};

interface TaskModalState {
  boothIdToAdd: string;
  itemTypeToAdd: string;
  keepOpenOnAdd: boolean;
  inputValue: string,
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
      boothIdToAdd: props?.presetBoothId ?? '',
      itemTypeToAdd: props?.presetItemType ?? 'NOTE',
      keepOpenOnAdd: false,
      inputValue: '',
    };
  };

  private getDesiredBoothId = (): string => {
    if (this.props.presetBoothId !== undefined && this.props.presetBoothId !== '') {
      return this.props.presetBoothId;
    } else {
      return this.state.boothIdToAdd;
    }
  };

  render() {
    const {
      open, presetBoothId, presetVendorName, showStore: { boothVendors },
    } = this.props;
    const { itemTypeToAdd, keepOpenOnAdd } = this.state;
    let vendorMenu: any = [];
    if (presetBoothId === undefined) {
      const tempVendorStat = Array.from(boothVendors, ([key, value]) => {
        return {boothId: key, boothNum: value.boothNum, vendor: value.vendor};
      });

      vendorMenu = tempVendorStat.map((x: any) => {
        return {key: x.boothId, text: `${x.boothNum} - ${x.vendor}`, value: x.boothId}
      });
    }

    let entryField;
    switch (itemTypeToAdd) {
      case 'NOTE':
      case 'QU':
      case 'OS':
        entryField = <Form.Group widths='equal'>
            <Form.Field>
              <Input fluid
                     label={itemTypeToAdd}
                     value={this.state.inputValue}
                     onChange={this.changeInputAreaValue} />
            </Form.Field>
          </Form.Group>;
        break;
      case 'PC':
      case 'PB':
        const inputStyle = { width: '8em' };
        entryField = <Form.Group widths='equal'>
            <Form.Field>
              <Input fluid
                     type='text'
                     maxLength={4}
                     label={itemTypeToAdd}
                     style={inputStyle}
                     value={this.state.inputValue}
                     onChange={this.changeInputAreaValue} />
            </Form.Field>
          </Form.Group>;
        break;
      default:
        entryField = null;
    }

    let headerText: string = presetBoothId ? `Add Task to ${presetBoothId}` : 'Add Task to Vendor';

    let boothId = this.getDesiredBoothId();
    let hideAdd = boothId === '' || boothId === undefined || this.state.inputValue === '';

    return (
      <Modal open={open} centered={false}>
        <Modal.Header>{headerText}</Modal.Header>
        <Modal.Content>
          <Form>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label>Vendor</label>
                  {presetVendorName ??
                    <Dropdown scrolling search selection fluid
                              options={vendorMenu}
                              onChange={this.changeBooth} />
                  }
                </Form.Field>
              </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <Checkbox radio
                          label='Note'
                          value='NOTE'
                          checked={itemTypeToAdd === 'NOTE'}
                          onChange={this.changeItemType} />
              </Form.Field>
              <Form.Field>
                <Checkbox radio
                          label='Question'
                          value='QU'
                          checked={itemTypeToAdd === 'QU'}
                          onChange={this.changeItemType} />
              </Form.Field>
              <Form.Field>
                <Checkbox radio
                          label='Power Buy'
                          value='PB'
                          checked={itemTypeToAdd === 'PB'}
                          onChange={this.changeItemType} />
              </Form.Field>
              <Form.Field>
                <Checkbox radio
                          label='Profit Center'
                          value='PC'
                          checked={itemTypeToAdd === 'PC'}
                          onChange={this.changeItemType} />
              </Form.Field>
              <Form.Field>
                <Checkbox radio
                          label='Open Stock Form'
                          value='OS'
                          checked={itemTypeToAdd === 'OS'}
                          onChange={this.changeItemType} />
              </Form.Field>
            </Form.Group>
            {entryField}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Checkbox checked={keepOpenOnAdd} onChange={this.setKeepOpened} label='Keep Open'/>
          <Button basic
                  color='green'
                  onClick={this.addEntry}
                  disabled={hideAdd}>
            Add
          </Button>
          <Button basic color='grey' onClick={this.modalCloseOps}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  };

  private changeBooth = (e: SyntheticEvent, data: DropdownProps) => {
    let boothId = data.value as string;
    if (this.state.itemTypeToAdd === 'PC') {
      // Pre-fill the PC booth number when a booth is (re)selected
      this.setState({
        boothIdToAdd: data.value as string,
        inputValue: this.props.showStore.boothVendors.get(boothId).boothNum,
      });
    } else if (this.state.itemTypeToAdd === 'OS') {
      // Pre-fill the PC booth number when a booth is (re)selected
      this.setState({
        boothIdToAdd: data.value as string,
        inputValue: this.props.showStore.boothVendors.get(boothId).vendor,
      });
    } else {
      this.setState({ boothIdToAdd: boothId });
    }
  };

  private changeItemType = (e: SyntheticEvent, data: CheckboxProps) => {
    if (data.value === 'PC') {
      // Pre-fill the PC booth number if a profit center is requested to be added
      let boothId = this.getDesiredBoothId();
      let boothNum = boothId ? this.props.showStore.boothVendors.get(boothId).boothNum : "";
      this.setState({
        itemTypeToAdd: data.value as string,
        inputValue: boothNum,
      });
    } else if (data.value === 'OS') {
      // Pre-fill the vendor name if an open stock is requested to be added
      let boothId = this.getDesiredBoothId();
      let vendorName = boothId ? this.props.showStore.boothVendors.get(boothId).vendor : "";
      this.setState({
        itemTypeToAdd: data.value as string,
        inputValue: vendorName,
      });
    } else {
      this.setState({ itemTypeToAdd: data.value as string });
    }
  };

  private changeInputAreaValue = (e: SyntheticEvent, data: InputProps) => {
    this.setState({ inputValue: data.value });
  };

  private setKeepOpened = (e: SyntheticEvent, data: CheckboxProps) => {
    this.setState({ keepOpenOnAdd: data.checked as boolean });
  };

  private addEntry = () => {
    let boothId = this.getDesiredBoothId();
    switch (this.state.itemTypeToAdd) {
      case 'QU':
        this.props.showStore.addQuestion(boothId, this.state.inputValue);
        break;
      case 'PB':
        this.props.showStore.addPowerBuy(boothId, this.state.inputValue);
        break;
      case 'PC':
        this.props.showStore.addProfitCenter(boothId, this.state.inputValue);
        break;
      case 'NOTE':
        this.props.showStore.addVendorNote(boothId, this.state.inputValue);
        break;
      case 'OS':
        this.props.showStore.addOpenStock(boothId, this.state.inputValue, OpenStockForm.PICK_UP);
        break;
    }

    this.setState({ inputValue: '' });

    if (!this.state.keepOpenOnAdd) {
      this.props.closeHander(false);
    }
  };

  private modalCloseOps = () => {
    if (!this.props.presetBoothId) {
      this.setState({ inputValue: '', boothIdToAdd: '' });
    } else {
      this.setState({ inputValue: '' });
    }
    this.props.closeHander(false);
  };
}
