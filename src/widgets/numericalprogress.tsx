import React from 'react';
import { Label, SemanticCOLORS } from 'semantic-ui-react';

interface NumericalProgressProps {
  completed?: number;
  total?: number;
  label?: string;
};

export default class NumericalProgress extends React.Component<NumericalProgressProps> {
  render() {
    const { completed, total, label } = this.props;

    let button;
    if (total === 0) {
      if (label) {
        button = <Label size='large' basic className='BCIouternumerical'>
            {label}
            <Label.Detail className='BCIlabelednumericallabel'>None</Label.Detail>
          </Label>;
      } else {
        button = <Label size='large' basic className='BCIunlabelednumerical'>None</Label>;
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
        button = <Label size='large' color={color} className='BCIouternumerical'>
            {label}
            <Label.Detail className='BCIlabelednumericallabel'>{progress}</Label.Detail>
          </Label>;
      } else {
        button = <Label size='large' color={color} className='BCIunlabelednumerical'>{progress}</Label>
      }
    }

    return button;
  }
}
