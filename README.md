# BCI Trade Show Vendor Visit Tracker

A simple web-based application to allow dealers to keep track of vendor interactions during trade
show instances.

**Note: This project is not affiliated with  Bradley Caldwell, Inc.

This project was started with [Create React App](https://github.com/facebook/create-react-app).

This repository contains just the source code for the application. A production instance of it is
available at my website: [BCI Trade Show](http://danbrook.org/bci/).

## Implementation

This is a web-based application that, once vendor data is loaded from the server, saves all
vendor and progress data on your local device / browser using IndexedDB (via Dexie) and local
storage to remember which show was last opened. No data is ever uploaded to another server, so
if you wish to save and load progress data to another device, import/export functionality is
present.

The UI is a tweaked version of Semantic UI React (as it provided a great deal of out-of-the-box
usefulness) to add some non-standard component designs, in particular a heavy use of flexbox.

## How to Use

Upon first load of the site, you are prompted to select a show with the upper-left menu bar button
"Load Show Data...". After you've set a show, this information is stored in your web browser and
will be automatically reloaded after coming back to the application or refreshing the page.

### Menu Bar

The menu bar at the top contains 4 buttons for application-wide features:

#### Data Management

This button text will show the currently-loaded trade show data. It also is how you can change
between trade shows (as time progresses, new show data will be added). Clicking it reveals the
Data Management modal.

##### Data Management Modal

- "Erase All Show Data": shown next to the currently-loaded show. This purges all database
  storage of the current show (including the vendor directory information and your progress!)
- "Vendor Data": lets you load (a different) trade show vendor directory. If you switch to one
  you previously used, it will also restore your progress data from the local database.
- "On-Device Data": shows your current progress data, allows you to save it to a JSON file,
  and allows you to load a JSON file from your device into the application. The "Clear" feature
  erases the local progress data but leaves the vendor directory for the show intact.
- "About": just a standard 'about this application' style of window.

#### Add...

Adds a visit flag, question, Power Buy, Profit Center tasks to any vendor using a vendor search
dropdown menu.

#### Sort: Booth/Vendor

Sorts the "Vendors", "Summary", and "Tasks" interfaces either by booth number or alphabetically
by vendor.

#### Hide Done

Hides vendors in the "Summary" and "Tasks" interfaces that have no remaining actions for the show.
What constitutes as "no remaining actions"?

- None/Abandoned/Submitted Open Stock Form
- No Visit or Visited vendor visit status
- 0 unanswered questions
- 0 unsubmitted items

### Main (Tabbed) Interface

The primary view is a 4-tab window that has the following panels:

#### Vendors

The list of all vendors present at the show. The booth number appears as purple if the associated
vendor has any actions assigned to it. Clicking the (+) button next to the booth will open the
"Add Task" modal, preset to that vendor. The Vendors tab also supports filtering the vendors by
name at the top.

The sorting of this view may be changed with the Sort Menu Bar button.

#### Map

Displays a floorplan of the current trade show.

Vendor Booths: black outline. An inner outline represents the booth visit status. The fill of
the booth matches the color scheme of the open stock form status for that vendor.

Activities Booths: light gray outline and fill.

Administrative Booths: light blue outline and fill. These are the BCI kiosk and clearance booths.

#### Summary

Shows all vendors with at least 1 action assigned. The booth number is a button that allows adding
a task to that vendor with the "Add Task" modal. The visit status is a button that, when clicked,
allows quick follow-up actions like changing the open stock form status and marking a revisit by
opening the Visitation Modal. The Questions (QU), Power Buy (PB), Profit Center (PC) display the
number (if any) tasks for the vendor. Lastly, the Open Stock Form (OS) component displays the
current status of the form for the vendor.

A note about progression through the open stock form statuses:

None, Pick-Up, Retrieved, Filled-In, Submitted. At any time between Pick-Up and Filled-In, a form
may be marked as abandoned. After a form is marked submitted, it may be restarted. An abandoned
form can always be restarted.

The sorting of this view may be changed with the Sort Menu Bar button. Completed vendors can be
hidden using the "Hide Done" Menu Bar button.

#### Tasks

The Questions/Answers as well as Power Buy / Profit Center submission statuses are all updated in
this interface. Questions are shown first, followed by Power Buys, and finally Profit Centers.

Questions may be deleted with the trash can icon to the right. By clicking the question mark icon,
a question's text may be updated. By clicking the red right arrow icon, an answer can be provided
or modified. When done modifying the content, be sure to press the save (floppy disk) icon. Any
content in the answer field intrinsically marks the question as "answered" across the application.

Power Buys and Profit Centers can be marked as submitted by clicking the gray circle button to
make it into a green check mark. They can be deleted with the attached trash can icon.

The sorting of this view may be changed with the Sort Menu Bar button. Completed tasks can be
hidden using the "Hide Done" Menu Bar button.

## Building the Application

After cloning this repository, simply run: `yarn` followed by `yarn start`. This will open a
local development instance at [http://localhost:3000](http://localhost:3000).

### Production Deployment

Be sure to update the `package.json` file's "homepage" field to match your deploy target's actual
path. For my server, I configure this to be `"homepage": "/bci/"` to get it working on my server
at [http://danbrook.org/bci/](http://danbrook.org/bci/), but your path may vary. This is needed
or else the Vendor Data load will not properly function.

After picking your homepage path, run `yarn build` and copy all contents of the resulting "build"
directory to your server. Your web server need only serve these files as all other actions are
purely in the user's client with no server side data storage.

## Changing the application

When making a feature or bugfix change, make sure to update the version number under the
"src/common/appversions.ts" file. This includes updates to dependencies, as those are also
mentioned in the "About" section of the "Data Management" modal.

## Adding New Show Data

**Note: Adding new shows is not considered a version change as the operations to do so are entirely
outside of the "src" directory.

See the "utls" directory for sample test data and a conversion script for CSV vendor data to a
JSON file like those under "public/show_vendors".

### Basic Procedure

1. Acquire the new show directory and floorplan.
1. Convert the directory into a CSV file, with the fields in the following order:
    1. Booth ID (unique to each vendor, even if they share a booth, make this up based on booth nb)
    1. Booth Number (as it appears on the directory)
    1. Type of Booth: "activity", "admin", or "vendor"
    1. Vendor Name / Activity Name / Admin Type
    1. Left-most Pixel Coordinate of Booth on floorplan
    1. Top-most Pixel Coordinate of Booth on floorplan
    1. Width (in pixels) of booth on floorplan
    1. Height (in pixels) of booth on floorplan
1. Add 2 lines at the top of the CSV file for the overall height/width of the floorplan, for ex:
    1. `width,590,,,,,,`
    1. `height,620,,,,,,`
1. Run the Python application and direct the output to the "public/show_vendors/" path:
    1. `cd utils`
    1. `./csv2IVendorDirectoryMap.py 2019-Fall-ACY.csv > ../public/show_vendors/2019-Fall-ACY.json`
1. Update the file "public/show_vendors/all_shows.json" to include the new show based on its file
   name. (For example, add "2019-Fall-ACY" for the created "2019-Fall-ACY.json" file.). The
   all_shows.json file is used for finding shows when the Data Management modal is opened.
