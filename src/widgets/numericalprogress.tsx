import React from 'react';
import { Button, Label, SemanticCOLORS } from 'semantic-ui-react';

interface NumericalProgressProps {
  completed?: number,
  total?: number,
  label?: string,
};

export default class NumericalProgress extends React.Component<NumericalProgressProps> {
  render() {
    const { completed, total, label } = this.props;

    const buttonOnlyStyle = {
      width: '100%',
    };
    const labelButtonStyle = {
      width: '4.5em',
    };
    const labelOnlyStyle = {
      justifyContent: 'center',  // Items are secretyly flexbox under the hood!
      width: '5.75em',
    };
    const outerButtonLabelStyle = {
      marginBottom: '4px',
    };

    let button;
    if (total === 0) {
      if (label) {
        button = <Button as='div' labelPosition='right' style={outerButtonLabelStyle}>
            <Button style={labelButtonStyle}>{label}</Button>
            <Label as='a' basic pointing='left' style={labelOnlyStyle}>None</Label>
          </Button>;
      } else {
        button = <Button basic style={buttonOnlyStyle}>None</Button>;
      }
    } else {
      let color: SemanticCOLORS;
      let progress: string = `${completed} of ${total}`;

      if (completed === 0) {
        color = 'red';
      } else if (completed !== total) {
        color = 'orange';
      } else {
        color = 'green';
      }

      if (label) {
        button = <Button as='div' labelPosition='right' style={outerButtonLabelStyle}>
            <Button color={color} style={labelButtonStyle}>{label}</Button>
            <Label as='a' basic color={color} pointing='left' style={labelOnlyStyle}>{progress}</Label>
          </Button>;
      } else {
        button = <Button color={color} style={buttonOnlyStyle}>{progress}</Button>
      }
    }

    return button;
  }
}
