import React from 'react';

import { Header } from 'semantic-ui-react';

export default class AboutPanel extends React.Component {
  private uiLibrary: string = 'React 18.0.0';
  private uiControls: string = 'Semantic UI React 2.1.3';
  private stateManagement: string = 'MobX 6.6.2, MobX-React 7.5.3';
  private database: string = 'Dexie 3.2.2';

  render() {
    return (
      <>
        <Header color='violet' as='h1'>BCI Trade Show Tracker</Header>
        <p>A simple vendor interaction tracking application for Dealers attending BCI Trade Shows.</p>
        <p>Copyright © 2022, Daniel Brook</p>
        <p>Not affiliated with Bradley Caldwell, Inc.</p>
        <Header color='orange' as='h3'>Application Details</Header>
        <p>Created with Create-React-App (CRA)</p>
        <p>Core User Interface: {this.uiLibrary}</p>
        <p>User Interface Controls: {this.uiControls}</p>
        <p>State Management: {this.stateManagement}</p>
        <p>IndexedDB Interface: {this.database}</p>
      </>
    );
  }
}
