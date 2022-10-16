import React from 'react';
import { Button, Checkbox, Dropdown, Form, Input, Modal } from 'semantic-ui-react';

interface TaskModalProps {
  open: boolean,
  closeHander: (arg0: boolean) => any,
  presetBoothNum?: number,
  presetItemType?: string,
};

interface TaskModalState {
  itemTypeToAdd: string,
};

export default class TaskModal extends React.Component<TaskModalProps, TaskModalState> {
  constructor(props: TaskModalProps, state: TaskModalState) {
    super(props, state);
    this.state = { itemTypeToAdd: props?.presetItemType ?? 'VI' };
    this.changeItemType = this.changeItemType.bind(this);
  }

  render() {
    const { open, closeHander } = this.props;
    const { itemTypeToAdd } = this.state;

    const vendorMenu = [
      {key: 100, text:'100 - Business Title', value: 100},
      {key: 101, text:'101 - Other Title', value: 101},
      {key: 102, text:'102 - Yet Another Title', value: 102},
      {key: 103, text:'103 - Foo Integration Systems', value: 103},
      {key: 104, text:'104 - Bar Separation Network', value: 104},
      {key: 105, text:'105 - Business Title Again', value: 105},
      {key: 106, text:'106 - Uncreative Name', value: 106},
      {key: 107, text:'107 - Regaining Creativity', value: 107},
      {key: 108, text:'108 - Shortlived Name', value: 108},
      {key: 109, text:'109 - ABC, Inc.', value: 109},
      {key: 110, text:'110 - XYZ Corporation', value: 110},
      {key: 111, text:'111 - Some Other Name', value: 111},
      {key: 112, text:'112 - Come on Only a few left you can do it and I know it is possible', value: 112},
      {key: 113, text:'113 - Lucky Thirteen', value: 113},
      {key: 114, text:'114 - Just Two More', value: 114},
      {key: 115, text:'115 - The Final Company', value: 115},
    ];

    let entryField;
    switch (itemTypeToAdd) {
      case 'QU':
        entryField = <Form.Group widths='equal'>
            <Form.Field>
              <Input fluid label={itemTypeToAdd}/>
            </Form.Field>
          </Form.Group>;
        break;
      case 'PC':
      case 'PB':
        const inputStyle = { width: '8em' };
        entryField = <Form.Group widths='equal'>
            <Form.Field>
              <Input fluid label={itemTypeToAdd} style={inputStyle}/>
            </Form.Field>
          </Form.Group>;
        break;
      case 'VI':
      default:
        entryField = null;
    }

    return (
      <Modal open={open}>
        <Modal.Header>Add Item</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Vendor</label>
                <Dropdown scrolling search selection fluid options={vendorMenu}/>
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <Checkbox radio label='Visit' value='VI' checked={itemTypeToAdd === 'VI'} onChange={this.changeItemType}/>
              </Form.Field>
              <Form.Field>
                <Checkbox radio label='Question' value='QU' checked={itemTypeToAdd === 'QU'} onChange={this.changeItemType}/>
              </Form.Field>
              <Form.Field>
                <Checkbox radio label='Profit Center' value='PC' checked={itemTypeToAdd === 'PC'} onChange={this.changeItemType}/>
              </Form.Field>
              <Form.Field>
                <Checkbox radio label='Power Buy' value='PB' checked={itemTypeToAdd === 'PB'} onChange={this.changeItemType}/>
              </Form.Field>
            </Form.Group>
            {entryField}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Checkbox label='Keep Open'/>
          <Button basic color='green' onClick={() => closeHander(false)}>Add</Button>
          <Button basic color='grey' onClick={() => closeHander(false)}>Discard</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private changeItemType(e: any, data: any) {
    console.log(data);
    this.setState({ itemTypeToAdd: data.value });
  }
}
