import React from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

interface SimpleSubmittableProps {
  prefix: string;
  itemIdx: number;
  showStore?: any;
};

@inject('showStore') @observer
export default class SimpleSubmittable extends React.Component<SimpleSubmittableProps> {
  render() {
    const { prefix, itemIdx, showStore } = this.props;
    let chosenItemId: string|undefined;
    let chosenSubmitted: boolean|undefined;

    switch (prefix) {
      case 'PB':
        chosenItemId = showStore.powerBuys[itemIdx].itemId;
        chosenSubmitted = showStore.powerBuys[itemIdx].submitted;
        break;
      case 'PC':
        chosenItemId = showStore.profitCenters[itemIdx].itemId;
        chosenSubmitted = showStore.profitCenters[itemIdx].submitted;
        break;
    }

    const itemName = `${prefix}-${chosenItemId}`;

    if (chosenSubmitted) {
      return <Button.Group>
          <Button as='div' labelPosition='left'>
            <Label basic color='green' as='a' className='BCIsimplesubmittable'>{itemName}</Label>
            <Button icon color='green' onClick={this.toggleSubmitted}>
              <Icon name='check circle'/>
            </Button>
            <Button icon basic color='red' disabled><Icon name='trash alternate outline'/></Button>
          </Button>
        </Button.Group>;
    } else {
      return <Button.Group>
          <Button as='div' labelPosition='left'>
            <Label basic color='grey' as='a' className='BCIsimplesubmittable'>{itemName}</Label>
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
      itemIdx,
      showStore: { submitPowerBuy, powerBuys, submitProfitCenter, profitCenters },
    } = this.props;
    switch (prefix) {
      case 'PB':
        submitPowerBuy(itemIdx, !powerBuys[itemIdx].submitted);
        break;
      case 'PC':
        submitProfitCenter(itemIdx, !profitCenters[itemIdx].submitted);
        break;
    }
  };

  private deleteItem = () => {
    const {
      prefix,
      itemIdx,
      showStore: { removePowerBuy, removeProfitCenter },
    } = this.props;
    switch (prefix) {
      case 'PB':
        removePowerBuy(itemIdx);
        break;
      case 'PC':
        removeProfitCenter(itemIdx);
        break;
    }
  }
}
