import React from 'react';
import { Button } from 'semantic-ui-react';

interface NumericalProgressProps {
  completed?: number,
  total?: number,
};

export default class NumericalProgress extends React.Component<NumericalProgressProps> {
  render() {
    const buttonStyle = {
      width: '100%',
    };

    let button;
    if (this.props.total === 0) {
        button = <Button basic style={buttonStyle}>None</Button>;
    } else if (this.props.completed === 0) {
        button = <Button color='red' style={buttonStyle}>{this.props.completed} of {this.props.total}</Button>
    } else if (this.props.completed !== this.props.total) {
        button = <Button color='orange' style={buttonStyle}>{this.props.completed} of {this.props.total}</Button>
    } else {
        button = <Button color='green' style={buttonStyle}>{this.props.completed} of {this.props.total}</Button>
    }

    return button;
  }
}
