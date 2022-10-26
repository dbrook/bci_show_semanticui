import React from 'react';
import { Button } from 'semantic-ui-react';
import { VendorVisit } from  '../types/enums';

interface NumericalProgressProps {
  visitStatus: VendorVisit;
  mobile?: boolean;
};

export default class Visitation extends React.Component<NumericalProgressProps> {
  render() {
    const { visitStatus, mobile } = this.props;

    const buttonClass = mobile ? 'BCImobilesinglevendorvisit' : 'BCIdesktopsinglevendorvisit';

    let button;
    switch (visitStatus) {
    case VendorVisit.NOT_VISITED:
      button = <Button color='red' className={buttonClass}>Not Visited</Button>;
      break;
    case VendorVisit.VISITED:
      button = <Button color='green' className={buttonClass}>Visited</Button>;
      break;
    case VendorVisit.NEED_REVISIT:
      button = <Button color='pink' className={buttonClass}>Revisit</Button>;
      break;
    case VendorVisit.DO_NOT_VISIT:
    default:
      button = <Button basic className={buttonClass}>No Visit</Button>;
    };

    return button;
  }
}
