import React from 'react';
import { Label, SemanticCOLORS } from 'semantic-ui-react';

interface NumericalProgressProps {
  completed?: number,
  total?: number,
  label?: string,
};

export default class NumericalProgress extends React.Component<NumericalProgressProps> {
  render() {
    const { completed, total, label } = this.props;

    const buttonOnlyStyle = {
      textAlign: 'center',
      width: '100%',
    };
    const labelDetailStyle = {
      width: '5.75em',
    };
    const outerButtonLabelStyle = {
      marginBottom: '4px',
      height: '100%',
      width: '10.15em',
    };

    let button;
    if (total === 0) {
      if (label) {
        button = <Label size='large' basic style={outerButtonLabelStyle}>
            {label}
            <Label.Detail style={labelDetailStyle}>None</Label.Detail>
          </Label>;
      } else {
        button = <Label size='large' basic style={buttonOnlyStyle}>None</Label>;
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
        button = <Label size='large' color={color} style={outerButtonLabelStyle}>
            {label}
            <Label.Detail style={labelDetailStyle}>{progress}</Label.Detail>
          </Label>;
      } else {
        button = <Label size='large' color={color} style={buttonOnlyStyle}>{progress}</Label>
      }
    }

    return button;
  }
}
