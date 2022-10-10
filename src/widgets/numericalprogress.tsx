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

    const buttonStyle = {
      width: '100%',
    };

    let button;
    if (total === 0) {
      if (label) {
        button = <Button as='div' labelPosition='right'>
            <Button>{label}</Button>
            <Label as='a' basic pointing='left'>None</Label>
          </Button>;
      } else {
        button = <Button basic style={buttonStyle}>None</Button>;
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
          button = <Button as='div' labelPosition='right'>
              <Button color={color}>{label}</Button>
              <Label as='a' basic color={color} pointing='left'>{progress}</Label>
            </Button>;
      } else {
          button = <Button color={color} style={buttonStyle}>{progress}</Button>
      }
    }

    return button;
  }
}
