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

/*
 * About This Application Component:
 *
 * Just a standard "about this application" window that every quality program should have!
 *
 * The versions are all stores in a file under the "common" directory for centralized management.
 */
export default class AboutPanel extends React.Component {
  render() {
    return (
      <>
        <Header color='violet' as='h1'>BCI Trade Show Tracker</Header>
        <p><b>Version {applicationVersion}</b></p>
        <p>
          A simple vendor interaction tracking application for dealers attending BCI Trade Shows.
        </p>
        <p>Copyright © {copyrightYearRange}, Daniel Brook. Not affiliated with Bradley Caldwell, Inc.</p>
        <p><a href="https://www.flaticon.com/free-icons/trade-show"
              title="trade show icons"
              rel='noreferrer'
              target="_blank">Trade show icon provided by Flat Icons - Flaticon</a></p>
        <Header color='orange' as='h2'>Application Details</Header>
        <p><u>User Interface Framework</u>: {uiLibrary}</p>
        <p><u>User Interface Controls</u>: {uiControls}</p>
        <p><u>State Management</u>: {stateManagement}</p>
        <p><u>IndexedDB Interface</u>: {database}</p>
      </>
    );
  }
}
