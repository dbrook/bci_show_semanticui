import React from 'react';

import { Header } from 'semantic-ui-react';

import {
  applicationVersion,
  copyrightYearRange,
  uiLibrary,
  uiControls,
  stateManagement,
  database,
} from '../common/appversions';

export default class AboutPanel extends React.Component {
  render() {
    return (
      <>
        <Header color='violet' as='h1'>BCI Trade Show Tracker</Header>
        <p><b>Version {applicationVersion}</b></p>
        <p>A simple vendor interaction tracking application for Dealers attending BCI Trade Shows.</p>
        <p>Copyright © {copyrightYearRange}, Daniel Brook</p>
        <p>Not affiliated with Bradley Caldwell, Inc.</p>
        <Header color='orange' as='h3'>Application Details</Header>
        <p>Created with Create-React-App (CRA)</p>
        <p>Core User Interface: {uiLibrary}</p>
        <p>User Interface Controls: {uiControls}</p>
        <p>State Management: {stateManagement}</p>
        <p>IndexedDB Interface: {database}</p>
      </>
    );
  }
}
