#! /usr/bin/env python3

# Very very quick and dirty utility to take CSV files generated by LibreOffice or Excel and turn
# them into a JSON object that is readable by the GUI data stores. CSV file is expected in format:
# ID (string), boothNum (integer), vendorName (string), leftMapPixel, topMapPixel, width, height
#
# Example row:
# "276-0",276,"THE AMES COMPANY",2259,1503,74,183
#
# HOW TO RUN:
# $ ./csv2IVendorDirectoryMap.py path/to/csvfile.csv
#
# That output can then be added to public/show_vendors/(name_of_show).json
# and make sure to then add a new entry to public/show_vendors/all_shows.json matching the name.
#
# TIP for making the pixel coordinates:
# A good size of the image is using a width of 1600 pixels. Calibrated, this makes the fonts
# in the image more-or-less match that of the UI. See an example of this as a PNG file in
# public/show_vendors/2022-Fall-ACY.png to know how to crop any future images.

import csv
import json
import sys

vendors = {}     # Vendor Booths
activities = {}  # Activity / Game Booths
admins = {}      # Administrative Booths
width = 0        # Canvas Floor Map Width
height = 0       # Canvas Floor Map Height

def parseCSVVendors(argv):
    with open(argv[1], newline='') as csvfile:
        csvVendors = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in csvVendors:
            if row[0] == 'width':
                width = int(row[1])
            elif row[0] == 'height':
                height = int(row[1])
            elif row[2] == 'activity':
                activities[row[0]] = {        # The boothId is the main 'key' to the map/object
                    'boothNum': int(row[1]),  # boothNum is the actual booth # in the directory
                    'vendor': row[3],         # the unique name of the vendor
                    'x1': int(row[4]),        # leftmost pixel position of the booth on the map
                    'y1': int(row[5]),        # topmost pixel position of the booth on the map
                    'width': int(row[6]),     # width of the booth in pixels
                    'height': int(row[7]),    # height of the booth in pixels
                }
            elif row[2] == 'admin':
                admins[row[0]] = {
                    'boothNum': int(row[1]),
                    'vendor': row[3],
                    'x1': int(row[4]),
                    'y1': int(row[5]),
                    'width': int(row[6]),
                    'height': int(row[7]),
                }
            elif row[2] == 'vendor':
                vendors[row[0]] = {
                    'boothNum': int(row[1]),
                    'vendor': row[3],
                    'x1': int(row[4]),
                    'y1': int(row[5]),
                    'width': int(row[6]),
                    'height': int(row[7]),
                }

        allBooths = {
            'width': width,
            'height': height,
            'vendors': vendors,
            'admins': admins,
            'activities': activities,
        }
        print(json.dumps(allBooths))

if __name__ == "__main__":
    parseCSVVendors(sys.argv)
