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

    return <div className='BCIvendorListStyle'>
        <TaskModal open={addTaskModalShown}
                   closeHander={this.showAddTaskModal}
                   presetItemType='VI'
                   presetBoothId={boothId}
                   presetVendorName={vendor} />
        <Button icon primary basic button labelPosition='left' onClick={this.openTaskModal}>
          <Icon name='plus square outline' />
          Add...
        </Button>
        <span className='BCIvendorBoothNumStyle'>{boothNum}</span>
        <span className='BCIvendorListName'>{vendor}</span>
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
