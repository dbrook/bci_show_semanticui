import React from 'react';
import { Button } from 'semantic-ui-react';

import { VendorVisit } from  '../types/enums';
import VisitModal from '../modals/visitmodal';

interface VisitationProps {
  boothId: string;
  visitStatus: VendorVisit;
  mobile?: boolean;
};

interface VisitationState {
  visitModalShown: boolean;
};

export default class Visitation extends React.Component<VisitationProps, VisitationState> {
  constructor(props: any, state: any) {
    super(props, state);
    this.state = { visitModalShown: false };
  }

  render() {
    const { visitStatus, mobile, boothId } = this.props;
    const buttonProps = {
      className: mobile ? 'BCImobilesinglevendorvisit' : 'BCIdesktopsinglevendorvisit',
      onClick: this.openVisitModal,
    };

    let button;
    switch (visitStatus) {
    case VendorVisit.NOT_VISITED:
      button = <Button color='red' {...buttonProps}>Not Visited</Button>;
      break;
    case VendorVisit.VISITED:
      button = <Button color='green' {...buttonProps}>Visited</Button>;
      break;
    case VendorVisit.NEED_REVISIT:
      button = <Button color='pink' {...buttonProps}>Revisit</Button>;
      break;
    case VendorVisit.DO_NOT_VISIT:
    default:
      button = <Button basic {...buttonProps}>No Visit</Button>;
    };

    return <>
      <VisitModal open={this.state.visitModalShown}
                  closeHander={this.showVisitModal}
                  boothId={boothId} />
      {button}
    </>;
  }

  private openVisitModal = () => {
    this.showVisitModal(true);
  }

  private showVisitModal = (showIt: boolean) => {
    this.setState({ visitModalShown: showIt });
    return;
  }
}
