import React from 'react';
import { Label, SemanticCOLORS } from 'semantic-ui-react';

interface NumericalProgressProps {
  completed?: number;
  total?: number;
  label?: string;
};

/*
 * NumericalProgress Component:
 *
 * Shows either "None" (for when no items are present) or "x of n" (where x is the number of
 * completed tasks out of n total tasks). The label will be red if 0 items are done, orange if
 * some are done, and green if all are done. The component can be labeled with 2 characters to
 * indicate what the count is representative of (for mobile layouts when there is no table header).
 */
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
        button = <Label size='large' color={color} className='BCIunlabelednumerical'>
            {progress}
          </Label>
      }
    }

    return button;
  }
}
