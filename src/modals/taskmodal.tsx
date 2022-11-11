import React from 'react';
import { Button, Checkbox, Dropdown, Form, Input, Modal } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

interface TaskModalProps {
  open: boolean,
  closeHander: (arg0: boolean) => any;
  presetBoothId?: string;
  presetVendorName?: string;
  presetItemType?: string;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

interface TaskModalState {
  boothIdToAdd: string;
  itemTypeToAdd: string;
  keepOpenOnAdd: boolean;
  inputValue: string,
};

@inject('showStore') @observer
export default class TaskModal extends React.Component<TaskModalProps, TaskModalState> {
  constructor(props: TaskModalProps, state: TaskModalState) {
    super(props, state);

    this.state = {
      boothIdToAdd: props?.presetBoothId ?? '',
      itemTypeToAdd: props?.presetItemType ?? 'VI',
      keepOpenOnAdd: false,
      inputValue: '',
    };

    this.changeBooth = this.changeBooth.bind(this);
    this.changeItemType = this.changeItemType.bind(this);
    this.setKeepOpened = this.setKeepOpened.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.changeInputAreaValue = this.changeInputAreaValue.bind(this);
  }

  render() {
    const { open, closeHander, presetBoothId, presetVendorName, showStore: { boothVendors } } = this.props;
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
      case 'QU':
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
                     label={itemTypeToAdd}
                     style={inputStyle}
                     value={this.state.inputValue}
                     onChange={this.changeInputAreaValue} />
            </Form.Field>
          </Form.Group>;
        break;
      case 'VI':
      default:
        entryField = null;
    }

    let headerText: string = presetBoothId ? `Add Task to ${presetBoothId}` : 'Add Task to Vendor';

    return (
      <Modal open={open}>
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
                          label='Visit'
                          value='VI'
                          checked={itemTypeToAdd === 'VI'}
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
            </Form.Group>
            {entryField}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Checkbox checked={keepOpenOnAdd} onChange={this.setKeepOpened} label='Keep Open'/>
          <Button basic color='green' onClick={this.addEntry}>Add</Button>
          <Button basic color='grey' onClick={() => closeHander(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private changeBooth(e: any, data: any) {
    this.setState({ boothIdToAdd: data.value });
  }

  private changeItemType(e: any, data: any) {
    this.setState({ itemTypeToAdd: data.value });
  }

  private changeInputAreaValue(e: any, data: any) {
    this.setState({ inputValue: e.target.value });
  }

  private setKeepOpened(e: any, data: any) {
    this.setState({ keepOpenOnAdd: data.checked });
  }

  private addEntry(e: any, data: any) {
    if (this.state.boothIdToAdd === '' || this.state.boothIdToAdd === undefined) {
      console.error('FIXME (make a warning): Unable to add item as booth was not set!');
      return;
    }

    switch (this.state.itemTypeToAdd) {
      case 'QU':
        this.props.showStore.addQuestion(this.state.boothIdToAdd, this.state.inputValue);
        break;
      case 'PB':
        this.props.showStore.addPowerBuy(this.state.boothIdToAdd, this.state.inputValue);
        break;
      case 'PC':
        this.props.showStore.addProfitCenter(this.state.boothIdToAdd, this.state.inputValue);
        break;
      case 'VI':
        this.props.showStore.addVisit(this.state.boothIdToAdd);
        break;
    }

    this.setState({ inputValue: '' });

    if (!this.state.keepOpenOnAdd) {
      this.props.closeHander(false);
    }
  }
}
