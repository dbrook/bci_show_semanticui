import React from 'react';

import { inject, observer } from 'mobx-react';

interface FloorPlanProps {
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
}

@inject('showStore') @observer
export default class FloorPlan extends React.Component<FloorPlanProps> {
  render() {
    const { tradeShowId } = this.props.showStore;

    if (tradeShowId === undefined) {
      return (
        <div className='tabInnerLayout'>
          <p>Select a Trade Show to use the floorplan feature.</p>
        </div>
      );
    }

    const imageSource = `show_vendors/${tradeShowId}.png`;

    return (
      <div className='tabInnerLayout'>
        <img src={imageSource} alt='Trade Show Floor Map' width='1600' />
      </div>
    );
  }
}
