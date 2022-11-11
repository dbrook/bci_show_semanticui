import Dexie from 'dexie';

import { DBVendorDirectory, IVendorDirectory } from '../types/interfaces';

export default class ShowDatabase extends Dexie {
  vendors!: Dexie.Table<DBVendorDirectory>;

  constructor() {
    super('ShowDatabase');
    this.version(1).stores({
      vendors: 'boothId, boothNum, vendor, x1, y1, width, height',
    });
  }

  public clearBoothVendors = () => {
    this.vendors.clear();
  };

  public get nbBoothVendors() {
    return this.vendors.count();
  }

  public getBoothVendors = (): Promise<Map<string, IVendorDirectory>> => {
    return new Promise((resolve, reject) => {
      this.vendors.toArray().then((outputArray) => {
        let outputMap: Map<string, IVendorDirectory> = new Map();
        for (const item of outputArray) {
          outputMap.set(item.boothId, {
            boothNum: item.boothNum,
            vendor: item.vendor,
            x1: item.x1,
            y1: item.y1,
            width: item.width,
            height: item.height,
          });
        }
        resolve(outputMap);
      });
    });
  };

  public putBoothVendors = (vendors: Map<string, IVendorDirectory>) => {
    vendors.forEach((vendor, key) => {
      const itemWithId: DBVendorDirectory = { boothId: key, ...vendor };
      this.vendors.put(itemWithId).then((keyname) => {
        // FIXME: Remove this later
        // console.log(keyname, typeof(keyname));
      });
    });
  };
}
