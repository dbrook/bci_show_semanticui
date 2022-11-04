import React from 'react';

import { inject, observer } from 'mobx-react';

interface FloorPlanProps {
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
}

@inject('showStore') @observer
export default class FloorPlan extends React.Component<FloorPlanProps> {
  render() {
    return (
      <div className='tabInnerLayout'>
        <img src='show_vendors/2022-Fall-ACY.png' alt='Trade Show Flor Map' width='1600' />
      </div>
    );
  }
}
