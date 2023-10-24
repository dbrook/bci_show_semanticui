import React from 'react';

import { Header } from 'semantic-ui-react';

export default class HelpPanel extends React.Component {
  render() {
    return (
      <>
        <Header color='blue' as='h1'>Summary</Header>
        <p>
          This application is designed for dealers attending BCI trade shows to keep track
          of interactions with vendors at the show, including collecting Open Stock forms,
          submitting Power Buys and Profit Centers, as well as keeping questions, answers, and
          any notes on a per-vendor basis. Despite being a web application, once loaded on your
          device, it requires no network connection to continue using it (thanks to a service
          worker, if you must know), perfect for buildings with overtaxed WiFi or otherwise
          poor reception!
        </p>
        <Header color='blue' as='h1'>Trade Show Operations</Header>
        <p>
          Choose the current trade show under the "Vendors" tab of this window, then click "Load
          Selected". You may also wish to load an existing backup file, which can be done in the
          "Activity" tab of this window. Once a show has been loaded, interactions are performed
          across 5 tabs (selected at the bottom of the screen).
        </p>
        <ol>
          <li>
            <b>Index</b>:
            <ol><li>
              All vendors present at the show with the booth number. Sorting by vendor or booth
              number can be chosen with the Sort button in the title bar at the top. A vendor
              with tasks assigned will be filled blue. Clicking the booth number will open the
              "Vendor" tab to that vendor (and will initialize a task if there are none).
              </li></ol>
          </li>
          <li>
            <b>Summary</b>:
            <ol><li>
              Only vendors which have an action associated and a count of each action type. If
              there is at least one note assigned to the vendor, an icon will appear to the right
              of the booth number button. Clicking the booth number button will open the "Vendor"
              tab to that vendor. Counts are colored green if they are all submitted/answered.
            </li></ol>
          </li>
          <li>
            <b>Map</b>:
            <ol>
              <li>
                Clickable floorplan of the trade show with booth numbers. Clicking a booth will
                open a window describing the vendors or other details present at the booth. If a
                vendor booth, the buttons present will perform the same action as those in the
                "Index" tab: colored blue if there are already actions assigned, clicking an
                uninitialized vendor will add a single task and switch to that tab.
              </li>
              <li>
                Unanswered questions are indicated by a red outline in the booth. The fill color
                of a booth represents the least-completed open stock form status of all vendors
                and forms at that booth. Orange: form to be collected, Purple: form collected,
                Blue: form filled-in, Green: form submitted.
              </li>
            </ol>
          </li>
          <li>
            <b>Vendor</b>:
            <ol>
              <li>
                All notes, questions, Open Stock forms, Power Buys, and Profit Centers for a
                single vendor (chosen by a drop-down menu at the top). This is where new items
                may be associated to a vendor by clicking the corresponding blue buttons just
                underneath the vendor drop-down menu.
              </li>
              <li>
                Items may be deleted using the trash can icon attached. Questions and answers
                may be modified by clicking the buttons to the left (make sure to save changes
                using the save / diskette icon). 
              </li>
              <li>
                Open Stock form controls have 4 states: pick up (meaning not yet collected),
                Retrieved (waiting to be filled in), Filled In (waiting to be submitted), and
                Submitted. Clicking the button on the left will advance through those statuses
                and the trash can will abandon the form (but keep it in place, you can really
                delete it by clicking the button again).
              </li>
            </ol>
          </li>
          <li>
            <b>All</b>:
            <ol>
              <li>
                This view is very similar to the "Vendor" tab, except it shows all actions
                for all vendors (minus any vendor-specific notes). The groups may be sorted
                by either booth number or vendor name (using the Sort button in the title
                bar). You can also hide all completed actions from this view by clicking the
                "Hide Done" button in the title bar.
              </li>
            </ol>
          </li>
        </ol>
        <Header color='blue' as='h1'>Your Data</Header>
        <p>
          All data you generate in this app is stored <b>only on your device</b>, it is not
          saved anywhere else or uploaded to any other server. Your browser has an internal
          database feature called "IndexedDB" that is used to save this data, so if you clear
          your website settings or data, you risk losing that data. At the conclusion of a
          trade show, you should export your data to a file using the "Export..." feature in
          the "Activity" tab of this window. Any data you export using this feature can be
          imported using the "Import..." feature just below it!
        </p>
      </>
    );
  }
}
