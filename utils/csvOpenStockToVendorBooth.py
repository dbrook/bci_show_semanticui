#! /usr/bin/env python3

# Takes a converted-to-CSV open stock order file and determines all vendor/booth/sub-vendors.
# 
# Background:
# Some vendors have multiple sub-vendors that share a booth under a single top-level vendor.
# Other vendors share booths with other vendors despite both being top-level vendors in the
# vendor directory. This utility will make a list of ALL vendors at a booth based on the
# master order list file (after you convert it to a CSV with Excel / LibreOffice / whatever).
#
# Example row:
# ,,,,XXXXXX,XXXXXX,XXXXXX,,505892,77234030707,3070,27200,ETHICAL DOG,SPOT STUFFED LATEX BONE,ASSORTED - 6 IN,$3.84 ,$2.69 ,1,EA,,,,100
#                                                         -----------                                                               ---
#                                                         | Vendor Name (12)                                                Booth num |

# HOW TO RUN:
# $ ./csv2IVendorDirectoryMap.py path/to/csvfile.csv
#
# That output can ... ?

import csv
import json
import sys

vendors = {}      # Vendor Booths
vendor_json = {
    'width': None,
    'height': None,
    'vendors': {},
    'admins': {},
    'activities': {},
}  # JSON-safe Vendor Booths

def parseCSVVendors(argv):
    if argv[1] != 'NO':
        with open(argv[1], newline='') as csvfile:
            csvVendors = csv.reader(csvfile, delimiter=',', quotechar='"')

            # Build an internal structure for the vendor data
            for row in csvVendors:
                booth_num = row[22]
                vendor = row[12]
                try:
                    vendors[booth_num].add(vendor)
                except KeyError:
                    vendors[booth_num] = {vendor}

            # JSON-ify it!
            for booth_num in vendors:
                vendor_json['vendors'][booth_num] = { 'vendors': list(vendors[booth_num]) }

    with open(argv[2], newline='') as csvfile:
        csvBooths = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in csvBooths:
            # First 2 rows are width and height
            if row[0] == 'width':
                vendor_json['width'] = int(row[1])
                continue
            elif row[0] == 'height':
                vendor_json['height'] = int(row[1])
                continue

            # Otherwise just regular booths
            booth_num = row[0]
            booth_type = row[1]
            default_name = row[2]
            x1 = int(row[3])
            y1 = int(row[4])
            width = int(row[5])
            height = int(row[6])

            # A vendor booth has been instantiated already from the order form CSV (hopefully!)
            if booth_type == 'vendor':
                if booth_num not in vendor_json['vendors']:
                    new_name = ""
                    if argv[1] != 'NO':
                        # Offer a deliberate naming opportunity for booths that came from the floorplan
                        print(f"\nBOOTH NUMBER '{booth_num}':'{default_name}' IS ONLY ON THE MAP / DIRECTORY, NOT THE SHOW BOOK")
                        new_name = input(f"PRESS ENTER TO ACCEPT '{default_name}' OR SPECIFY A NEW NAME HERE > ")
                    if new_name == "":
                        unexpected_vendor = {
                            'boothName': default_name,
                            'vendors': [default_name],
                            'x1': x1,
                            'y1': y1,
                            'width': width,
                            'height': height,
                        }
                    else:
                        unexpected_vendor = {
                            'boothName': new_name,
                            'vendors': [new_name],
                            'x1': x1,
                            'y1': y1,
                            'width': width,
                            'height': height,
                        }
                    vendor_json['vendors'][booth_num] = unexpected_vendor
                    continue
                if len(vendor_json['vendors'][booth_num]['vendors']) > 1:
                    print(f"\nBOOTH {booth_num} CONTAINS MULTIPLE VENDORS:\n{vendor_json['vendors'][booth_num]['vendors']}")
                    input_name = input(f'ENTER WHAT TO NAME BOOTH NUMBER {booth_num} > ')
                    if input_name == "":
                        booth_name = default_name
                    else:
                        booth_name = input_name
                else:
                    booth_name = default_name
                vendor_json['vendors'][booth_num]['boothName'] = booth_name
                vendor_json['vendors'][booth_num]['x1'] = x1
                vendor_json['vendors'][booth_num]['y1'] = y1
                vendor_json['vendors'][booth_num]['width'] = width
                vendor_json['vendors'][booth_num]['height'] = height
            
            # An administrative booth is only from the map/directory CSV we made separately
            elif booth_type == 'admin':
                vendor_json['admins'][booth_num] = {
                    'boothName': default_name,
                    'vendors': [],
                    'x1': x1,
                    'y1': y1,
                    'width': width,
                    'height': height,
                }
            
            # An activity booth is very similar to an admin booth
            elif booth_type == 'activity':
                vendor_json['activities'][booth_num] = {
                    'boothName': default_name,
                    'vendors': [],
                    'x1': x1,
                    'y1': y1,
                    'width': width,
                    'height': height,
                }
    
    print("\n\n" + json.dumps(vendor_json))

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Use: python csvOpenStockToVendorBooth.py order_form.csv booth_coordinates.csv")
        print(" OR: python csvOpenStockToVendorBooth.py NO booth_coordinates.csv")
    else:
        parseCSVVendors(sys.argv)
