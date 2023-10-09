import React from 'react';
import { Button } from 'semantic-ui-react';

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

/*
 * VendorListItem Component:
 *
 * Single vendor for use in the Vendor List display tab. This component shows the booth number
 * (highlighted to indicate there is at least 1 action assigned to the boothId / vendor), the
 * vendor name, and a button to show the Add Task modal preset to the vendor.
 */
export default class VendorListItem extends React.Component<VendorListItemProps,
                                                            VendorListItemState> {
  constructor(props: VendorListItemProps, state: VendorListItemState) {
    super(props, state);
    this.state = { addTaskModalShown: false };
  }

  render() {
    const { boothId, boothNum, vendor, hasActions } = this.props;
    const { addTaskModalShown } = this.state;

    const button = hasActions
      ? <Button icon primary button onClick={this.openTaskModal}>{boothNum}</Button>
      : <Button icon primary basic button onClick={this.openTaskModal}>{boothNum}</Button>;

    return <div className='BCIvendorListStyle'>
        <TaskModal open={addTaskModalShown}
                   closeHander={this.showAddTaskModal}
                   presetItemType='NO'
                   presetBoothId={boothId}
                   presetVendorName={vendor} />
        {button}
        <span className='BCIvendorListName'>{vendor}</span>
      </div>;
  }

  private openTaskModal = () => {
    this.showAddTaskModal(true);
  }

  private showAddTaskModal = (showIt: boolean) => {
    this.setState({ addTaskModalShown: showIt });
    return;
  }
}
