import React from 'react';
import './App.css';

import 'semantic-ui-css/semantic.css';

// Temporary includes to just get the examples rendered
import MenuBar from './displays/menubar';
import TabArea from './displays/tabarea';

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hideCompleted: false };
    this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
  }

  render() {
    return (
      <div className="App">
        <MenuBar hideCompleted={this.state.hideCompleted} toggleHideCompleted={this.toggleHideCompleted}/>
        <TabArea hideCompleted={this.state.hideCompleted} />
      </div>
    );
  }

  public toggleHideCompleted() {
    this.setState({ hideCompleted: !this.state.hideCompleted });
  }
}

