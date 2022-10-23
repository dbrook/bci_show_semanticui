import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import TaskModal from './taskmodal';

interface VendorListItemProps {
  boothId: string,
  boothNum: number,
  vendor: string,
};

interface VendorListItemState {
  addTaskModalShown: boolean,
};

export default class VendorListItem extends React.Component<VendorListItemProps, VendorListItemState> {
  constructor(props: any) {
    super(props);
    this.state = { addTaskModalShown: false };
    this.showAddTaskModal = this.showAddTaskModal.bind(this);
    this.openTaskModal = this.openTaskModal.bind(this);
  }

  render() {
    const { boothId, boothNum, vendor } = this.props;
    const { addTaskModalShown } = this.state;

    const vendorListStyle = {
      display: 'flex',
      width: '100%',
      marginBottom: '5px',
      alignItems: 'center',
      columnGap: '5px',
    };

    const vendorBoothNumStyle = {
      border: '1px solid #D4D4D5',
      backgroundColor: '#D4D4D5',
      borderRadius: '4px',
      padding: '5px',
      width: '3em',
      flexShrink: '0',
    };

    const vendorNameStyle = {
      textAlign: 'left' as const,
    };

    return <div style={vendorListStyle}>
        <TaskModal open={addTaskModalShown}
                   closeHander={this.showAddTaskModal}
                   presetItemType='VI'
                   presetBoothId={boothId}
                   presetVendorName={vendor} />
        <Button icon primary basic button labelPosition='left' onClick={this.openTaskModal}>
          <Icon name='plus square outline' />
          Add...
        </Button>
        <span style={vendorBoothNumStyle}>{boothNum}</span>
        <span style={vendorNameStyle}>{vendor}</span>
      </div>;
  }

  private openTaskModal() {
    this.showAddTaskModal(true);
  }

  private showAddTaskModal(showIt: boolean) {
    this.setState({ addTaskModalShown: showIt });
    return;
  }
}
