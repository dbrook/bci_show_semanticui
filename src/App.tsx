import React from 'react';
import './App.css';

// Styling
import 'semantic-ui-css/semantic.css';

// Data Storage
import { Provider } from 'mobx-react';
import { TradeShowStore } from './common/datastore';

// Root-Level Components
import MenuBar from './displays/menubar';
import TabArea from './displays/tabarea';

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      hideCompleted: false,
      alphaSort: false,
    };
    this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    this.toggleAlphabetical = this.toggleAlphabetical.bind(this);
  }

  render() {
    return (
      <Provider showStore={TradeShowStore}>
        <div className="App">
          <MenuBar hideCompleted={this.state.hideCompleted}
                   toggleHideCompleted={this.toggleHideCompleted}
                   alphaSort={this.state.alphaSort}
                   toggleAlphaSort={this.toggleAlphabetical} />
          <TabArea hideCompleted={this.state.hideCompleted} alphaSort={this.state.alphaSort} />
        </div>
      </Provider>
    );
  }

  public toggleHideCompleted() {
    this.setState({ hideCompleted: !this.state.hideCompleted });
  }

  public toggleAlphabetical() {
    this.setState({ alphaSort: !this.state.alphaSort });
  }
}

