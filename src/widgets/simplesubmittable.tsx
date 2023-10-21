import React from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

interface SimpleSubmittableProps {
  boothId: string;
  prefix: string;
  boothNum: number;
  submitted: boolean;
  quantity: number;
  itemId: string;
  showStore?: any;
};

/*
 * SimpleSubmittable Component:
 *
 * Graphical representation of a submittable item (like a Power Buy) that displays a prefix, number,
 * button that indicates the submission is done or not, and a delete button to remove it from the
 * database.
 */
@inject('showStore') @observer
export default class SimpleSubmittable extends React.Component<SimpleSubmittableProps> {
  render() {
    const { prefix, boothNum, submitted, quantity, itemId } = this.props;
    const itemName = `${prefix}-${boothNum}${itemId}`;

    if (submitted) {
      return <Button.Group>
          <Button as='div' labelPosition='left'>
            <Label basic color='green' as='a' className='BCIsimplesubmittable'>{quantity} x {itemName}</Label>
            <Button icon color='green' onClick={this.toggleSubmitted}>
              <Icon name='check circle'/>
            </Button>
            <Button icon basic color='red' disabled><Icon name='trash alternate outline'/></Button>
          </Button>
        </Button.Group>;
    } else {
      return <Button.Group>
          <Button as='div' labelPosition='left'>
            <Label basic color='grey' as='a' className='BCIsimplesubmittable'>{quantity} x {itemName}</Label>
            <Button icon basic color='grey' onClick={this.toggleSubmitted}>
              <Icon name='circle outline'/>
            </Button>
            <Button icon basic color='red' onClick={this.deleteItem}>
              <Icon name='trash alternate outline'/>
            </Button>
          </Button>
        </Button.Group>;
    }
  }

  private toggleSubmitted = () => {
    const {
      prefix,
      boothId,
      submitted,
      itemId,
      showStore: { submitPowerBuy, submitProfitCenter },
    } = this.props;
    switch (prefix) {
      case 'PB':
        submitPowerBuy(boothId, itemId, !submitted);
        break;
      case 'PC':
        submitProfitCenter(boothId, itemId, !submitted);
        break;
    }
  };

  private deleteItem = () => {
    const {
      prefix,
      boothId,
      itemId,
      showStore: { removePowerBuy, removeProfitCenter },
    } = this.props;
    switch (prefix) {
      case 'PB':
        removePowerBuy(boothId, itemId);
        break;
      case 'PC':
        removeProfitCenter(boothId, itemId);
        break;
    }
  }
}
