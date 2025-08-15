import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

interface SimpleSubmittableProps {
  prefix: string;
  boothNum: string;
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
    const { submitted } = this.props;
    if (submitted) {
      return <Button.Group>
          <Button as='div' labelPosition='left'>
            <Button icon color='green' onClick={this.toggleSubmitted}>
              <Icon name='check circle'/>
            </Button>
            <Button icon basic color='red' disabled><Icon name='trash alternate outline'/></Button>
          </Button>
        </Button.Group>;
    } else {
      return <Button.Group>
          <Button as='div' labelPosition='left'>
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
      boothNum,
      submitted,
      itemId,
      showStore: { submitPowerBuy, submitProfitCenter },
    } = this.props;
    switch (prefix) {
      case 'PB':
        submitPowerBuy(boothNum, itemId, !submitted);
        break;
      case 'PC':
        submitProfitCenter(boothNum, itemId, !submitted);
        break;
    }
  };

  private deleteItem = () => {
    const {
      prefix,
      boothNum,
      itemId,
      showStore: { removePowerBuy, removeProfitCenter },
    } = this.props;
    switch (prefix) {
      case 'PB':
        removePowerBuy(boothNum, itemId);
        break;
      case 'PC':
        removeProfitCenter(boothNum, itemId);
        break;
    }
  }
}
