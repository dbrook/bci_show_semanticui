import React from 'react';
import { Button } from 'semantic-ui-react';
import { VendorVisit } from  '../types/enums';

interface NumericalProgressProps {
  visitStatus: VendorVisit,
  mobile: boolean,
};

export default class Visitation extends React.Component<NumericalProgressProps> {
  render() {
    const { visitStatus, mobile } = this.props;
    const buttonStyle = {
      width: mobile ? '10.1em' : '100%',
      marginBottom: mobile ? '4px' : '0',
    };

    let button;
    switch (visitStatus) {
    case VendorVisit.NOT_VISITED:
      button = <Button color='red' style={buttonStyle}>Not Visited</Button>;
      break;
    case VendorVisit.VISITED:
      button = <Button color='green' style={buttonStyle}>Visited</Button>;
      break;
    case VendorVisit.DO_NOT_VISIT:
    default:
      button = <Button basic style={buttonStyle}>No Visit</Button>;
    };

    return button;
  }
}
