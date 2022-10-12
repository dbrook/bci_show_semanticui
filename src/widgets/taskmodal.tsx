import React from 'react';
import { Button, Checkbox, Dropdown, Modal } from 'semantic-ui-react';

interface TaskModalProps {
  open: boolean,
  closeHander: (arg0: boolean) => any,
  presetBoothNum?: number,
};

export default class TaskModal extends React.Component<TaskModalProps> {
  render() {
    const { open, closeHander } = this.props;

    return (
      <Modal open={open}>
        <Modal.Header>Add Vendor</Modal.Header>
        <Modal.Content>
          <Dropdown placeholder='Vendor Booth' scrolling selection fluid options={
            [
              {key:100,text:'100 - Business Title',value:100},
              {key:101,text:'101 - Other Title',value:101},
              {key:102,text:'102 - Yet Another Title',value:102},
              {key:103,text:'103 - Foo Integration Systems',value:103},
              {key:104,text:'104 - Bar Separation Network',value:104},
              {key:105,text:'105 - Business Title Again',value:105},
              {key:106,text:'106 - Uncreative Name',value:106},
              {key:107,text:'107 - Regaining Creativity',value:107},
              {key:108,text:'108 - Shortlived Name',value:108},
              {key:109,text:'109 - ABC, Inc.',value:109},
              {key:110,text:'110 - XYZ Corporation',value:110},
              {key:111,text:'111 - Some Other Name',value:111},
              {key:112,text:'112 - Come on Only a few left',value:112},
              {key:113,text:'113 - Lucky Thirteen',value:113},
              {key:114,text:'114 - Just Two More',value:114},
              {key:115,text:'115 - The Final Company',value:115},
            ]
          }/>
        </Modal.Content>
        <Modal.Actions>
          <Checkbox label='Make Another'/>
          <Button basic color='green' onClick={() => closeHander(false)}>Add</Button>
          <Button basic onClick={() => closeHander(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
