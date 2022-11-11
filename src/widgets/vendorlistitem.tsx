import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import TaskModal from '../modals/taskmodal';

interface VendorListItemProps {
  boothId: string;
  boothNum: number;
  vendor: string;
  hasActions: boolean;
};

interface VendorListItemState {
  addTaskModalShown: boolean;
};

export default class VendorListItem extends React.Component<VendorListItemProps, VendorListItemState> {
  constructor(props: any) {
    super(props);
    this.state = { addTaskModalShown: false };
    this.showAddTaskModal = this.showAddTaskModal.bind(this);
    this.openTaskModal = this.openTaskModal.bind(this);
  }

  render() {
    const { boothId, boothNum, vendor, hasActions } = this.props;
    const { addTaskModalShown } = this.state;

    const boothClassName = hasActions ? 'BCIvendorBoothNumStyle actioned': 'BCIvendorBoothNumStyle';

    return <div className='BCIvendorListStyle'>
        <TaskModal open={addTaskModalShown}
                   closeHander={this.showAddTaskModal}
                   presetItemType='VI'
                   presetBoothId={boothId}
                   presetVendorName={vendor} />
        <Button icon primary basic button onClick={this.openTaskModal}>
          <Icon name='plus square outline' />
        </Button>
        <span className={boothClassName}>{boothNum}</span>
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
