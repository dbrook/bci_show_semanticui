import React from 'react';
import { Button } from 'semantic-ui-react';
import { VendorVisit } from  '../types/enums';

interface NumericalProgressProps {
  visitStatus: VendorVisit,
};

export default class Visitation extends React.Component<NumericalProgressProps> {
  render() {
    const buttonStyle = {
      width: '100%',
    };

    let button;
    switch (this.props.visitStatus) {
    case VendorVisit.NOT_VISITED:
      button = <Button color='red' style={buttonStyle}>Not Visited</Button>;
      break;
    case VendorVisit.VISITED:
      button = <Button color='green' style={buttonStyle}>Visited</Button>;
      break;
    case VendorVisit.DO_NOT_VISIT:
    default:
      button = <Button basic style={buttonStyle}>None</Button>;
    };

    return button;
  }
}
