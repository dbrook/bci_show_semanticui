# BCI Trade Show Vendor Visit Tracker

A simple web-based application to allow dealers to keep track of vendor interactions during trade
show instances.

**Note: This project is not affiliated with  Bradley Caldwell, Inc.

This project was started with [Create React App](https://github.com/facebook/create-react-app).

This repository contains just the source code for the application. A production instance of it is
available at my website: [BCI Trade Show](https://danbrook.org/bci/).

## Implementation

This is a web-based application that, once vendor data is loaded from the server, saves all
vendor and progress data on your local device / browser using IndexedDB (via Dexie) and local
storage to remember which show was last opened. No data is ever uploaded to another server, so
if you wish to save and load progress data to another device, import/export functionality is
present.

The UI is a tweaked version of Semantic UI React (as it provided a great deal of out-of-the-box
usefulness) to add some non-standard component designs, in particular a heavy use of flexbox.

When loaded on an HTTPS site, a service worker and application manifest allow installing the
single page application as a device "app", and will prompt a user to do so upon connecting.

## How to Use / Components

The help guide has been moved into an online help system within the application itself. Click
on the Trade Show Data Button (the leftmost one in the page header) to get instructions on how
to use the application's different views and manage your data.

### Menu Bar

The menu bar at the top contains 3 buttons for application-wide features: choosing a trade
show instance from the database (or new data from the server, exporting data, and getting
usage help), sorting the "Index" and "All" panels by vendor or booth number, and hiding all
tasks which are complete from the "Summary" and "All" panels.


## Building the Application

After cloning this repository, simply run: `yarn` followed by `yarn start`. This will open a
local development instance at [http://localhost:3000](http://localhost:3000).

### Production Deployment

Be sure to update the `package.json` file's "homepage" field to match your deploy target's actual
path. For my server, I configure this to be `"homepage": "/bci/"` to get it working on my server
at [https://danbrook.org/bci/](https://danbrook.org/bci/), but your path may vary. This is needed
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

See the `utils` directory for sample test data and a conversion script for CSV vendor data to a
JSON file like those under "public/show_vendors".

### Basic Procedure

1. Acquire the new show directory and floorplan.
1. Convert the directory into a CSV file, with the fields in the following order:
    1. Booth Number (as it appears on the directory)
    1. Type of Booth: "activity", "admin", or "vendor"
    1. Vendor Name / Activity Name / Admin Type. For booths that appear twice, try and unify
       the name so there aren't duplicate booth entries.
    1. Left-most Pixel Coordinate of Booth on floorplan
    1. Top-most Pixel Coordinate of Booth on floorplan
    1. Width (in pixels) of booth on floorplan
    1. Height (in pixels) of booth on floorplan
1. Add 2 lines at the top of the CSV file for the overall height/width of the floorplan, for ex:
    1. `width,590,,,,,,`
    1. `height,620,,,,,,`
1. Acquire the Open Stock "Showbook Order Form" for the new trade show.
    1. Export it as a CSV file and make sure that the `"` symbol is the text quote character.
    1. Open the exported file in a text editor and remove all the heading rows so that there is
       only data to be processed.
1. Run the Python application and direct the output to the "public/show_vendors/" path:
    1. `cd utils`
    1. `./csvOpenStockToVendorBooth.py F19_Showbook_Order_Form.csv 2019-Fall-ACY.csv`
       1. (Note: if you don't have a showbook order form, you should really get a copy! But if
          you cannot, just pass a `NO` as the command ling argument instead of the order form
          file and it'll make due with just the data from the directoy/floorplan)
    1. Any booth that has multiple vendors per the showbook order form file will prompt you to
       fill in a useful name to represent the booth as a whole on the "Index" panel, this should
       be taken from the show floorplan or directory.
    1. Any booth that is only on the floorplan or directory (from the file you generate from the
       directory originally when making the pixel coordinates) that does not exist in the showbook
       order form will be alerted to and you'll be given the opportunity to update the name.
    1. Upon completion, a JSON blob will be dumped to your terminal, which you can copy and paste
       for the next step.
1. Update the file "public/show_vendors/all_shows.json" to include the new show based on its file
   name. (For example, add "2019-Fall-ACY" for the created "2019-Fall-ACY.json" file.). The
   all_shows.json file is used for finding shows when the Data Management modal is opened.
