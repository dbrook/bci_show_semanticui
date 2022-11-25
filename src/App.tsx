import React from 'react';
import { RefObject } from 'react';
import './App.css';

// Styling
import 'semantic-ui-css/semantic.css';

import { Message } from 'semantic-ui-react';

// Data Storage
import { Provider } from 'mobx-react';
import { TradeShowStore } from './common/datastore';

// Root-Level Components
import MenuBar from './displays/menubar';
import TabArea from './displays/tabarea';

/*
 * Top-level application component (adapted from the Create-React-App default one) that holds the
 * application menu bar and the tabbed interface with vendors, the floor plan, summary, and tasks
 */
export default class App extends React.Component<any, any> {
  private tabRef: RefObject<TabArea>;

  constructor(props: any) {
    super(props);
    this.tabRef = React.createRef();
    this.state = {
      hideCompleted: false,
      alphaSort: false,
      indexedDbSupport: ('indexedDB' in window),
    };
  }

  render() {
    if (this.state.indexedDbSupport) {
      return (
        <Provider showStore={TradeShowStore}>
          <div className="App">
            <MenuBar hideCompleted={this.state.hideCompleted}
                     toggleHideCompleted={this.toggleHideCompleted}
                     alphaSort={this.state.alphaSort}
                     toggleAlphaSort={this.toggleAlphabetical}
                     dataModalClose={this.onDataModalClose} />
            <TabArea hideCompleted={this.state.hideCompleted}
                     alphaSort={this.state.alphaSort}
                     ref={this.tabRef} />
          </div>
        </Provider>
      );
    } else {
      return (
        <div className="App">
          <Message error>
            <p>A browser with IndexedDB support is required to use this application.</p>
            <p><a href='https://caniuse.com/indexeddb'>
              Click here to see web browser IndexedDB support.
            </a></p>
          </Message>
        </div>
      );
    }
  }

  public toggleHideCompleted = () => {
    this.setState({ hideCompleted: !this.state.hideCompleted });
  };

  public toggleAlphabetical = () => {
    this.setState({ alphaSort: !this.state.alphaSort });
  };

  public vendorListReturn = () => {
    this.tabRef.current?.switchToVendorsList();
  };

  public onDataModalClose = () => {
    this.vendorListReturn();
  };
}
