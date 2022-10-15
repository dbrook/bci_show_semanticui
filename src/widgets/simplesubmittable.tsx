import React from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';

interface SimpleSubmittableProps {
  prefix?: string,
  itemId: string,
  submitted: boolean,
};

export default class SimpleSubmittable extends React.Component<SimpleSubmittableProps> {
  render() {
    const { prefix, itemId, submitted } = this.props;

    const labelStyle = {
      justifyContent: 'center',
      width: '6.5em',
    };

    const itemName = prefix ? `${prefix}-${itemId}` : itemId;

    if (submitted) {
      return <Button.Group>
          <Button as='div' labelPosition='left'>
            <Label basic color='green' as='a' style={labelStyle}>{itemName}</Label>
            <Button icon color='green'><Icon name='check circle'/></Button>
            <Button icon basic color='red'><Icon name='trash alternate outline'/></Button>
          </Button>
        </Button.Group>;
    } else {
      return <Button.Group>
          <Button as='div' labelPosition='left'>
            <Label basic color='grey' as='a' style={labelStyle}>{itemName}</Label>
            <Button icon basic color='grey'><Icon name='circle outline'/></Button>
            <Button icon basic color='red'><Icon name='trash alternate outline'/></Button>
          </Button>
        </Button.Group>;
    }
  }
}
