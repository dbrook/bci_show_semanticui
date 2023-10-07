import Dexie from 'dexie';

import {
  DBVendorDirectory,
  IVendorDirectory,
  IVendorStatus,
  IQuestionAnswer,
  DBQuestionAnswer,
  ISubmittableItem,
  DBSubmittableItem,
  DBIndexedString,
} from '../types/interfaces';

/*
 * IndexedDB wrapper implemented with Dexie
 *
 * Responsible for:
 *   - Opening existing or creating new database for the showId specified at construction
 *   - Writing out changes to the database
 *   - Reading-in data from the database (if present for a showId) and providing it to the store
 */
export default class ShowDatabase extends Dexie {
  vendors!: Dexie.Table<DBVendorDirectory>;
  activities!: Dexie.Table<DBVendorDirectory>;
  admins!: Dexie.Table<DBVendorDirectory>;
  mapDimensions!: Dexie.Table<any>;
  actions!: Dexie.Table<IVendorStatus>;
  questions!: Dexie.Table<DBQuestionAnswer>;
  pwrBuys!: Dexie.Table<DBSubmittableItem>;
  prfCtrs!: Dexie.Table<DBSubmittableItem>;
  vndNote!: Dexie.Table<DBIndexedString>;

  constructor(showId: string) {
    super(showId);
    this.version(1).stores({
      vendors: 'boothId, boothNum, vendor, x1, y1, width, height',
      activities: 'boothId, boothNum, vendor, x1, y1, width, height',
      admins: 'boothId, boothNum, vendor, x1, y1, width, height',
      mapDimensions: 'parameter, value',
      actions: 'boothId, boothNum, vendor, questions, powerBuys, profitCenters, openStockForms, vndNote',
      questions: 'qIdx, question, answer',
      pwrBuys: 'itmIdx, itemId, submitted',
      prfCtrs: 'itmIdx, itemId, submitted',
      vndNote: 'itmIdx, note',
    });
  }

  public clearBooths = () => {
    this.vendors.clear();
    this.activities.clear();
    this.admins.clear();
    this.mapDimensions.clear();
  };

  public get nbBoothVendors() {
    return this.vendors.count();
  }

  public getBooths = (): Promise<Map<string, any>> => {
    return new Promise((resolve, reject) => {
      let outputMap = new Map();
      this.vendors.toArray().then((outputArray) => {
        let vendorsMap: Map<string, IVendorDirectory> = new Map();
        for (const item of outputArray) {
          vendorsMap.set(item.boothId, {
            boothNum: item.boothNum,
            vendor: item.vendor,
            x1: item.x1,
            y1: item.y1,
            width: item.width,
            height: item.height,
          });
        }
        this.activities.toArray().then((actArray) => {
          let actsMap: Map<string, IVendorDirectory> = new Map();
          for (const item of actArray) {
            actsMap.set(item.boothId, {
              boothNum: item.boothNum,
              vendor: item.vendor,
              x1: item.x1,
              y1: item.y1,
              width: item.width,
              height: item.height,
            });
          }
          this.admins.toArray().then((admArray) => {
            let admMap: Map<string, IVendorDirectory> = new Map();
            for (const item of admArray) {
              admMap.set(item.boothId, {
                boothNum: item.boothNum,
                vendor: item.vendor,
                x1: item.x1,
                y1: item.y1,
                width: item.width,
                height: item.height,
              });
            }
            this.mapDimensions.toArray().then((dimsArray) => {
              let width = 0;
              let height = 0;
              for (const item of dimsArray) {
                if (item.parameter === 'height') {
                  height = item.value;
                } else if (item.parameter === 'width') {
                  width = item.value;
                }
              }
              outputMap.set('vendors', vendorsMap);
              outputMap.set('activities', actsMap);
              outputMap.set('admins', admMap);
              outputMap.set('height', height);
              outputMap.set('width', width);
              resolve(outputMap);
            });
          });
        });
      });
    });
  };

  public putBooths = (booths: Map<string, any>) => {
    booths.get('vendors').forEach((vendor: IVendorDirectory, key: string) => {
      const itemWithId: DBVendorDirectory = { boothId: key, ...vendor };
      this.vendors.put(itemWithId);
    });
    booths.get('activities').forEach((vendor: IVendorDirectory, key: string) => {
      const itemWithId: DBVendorDirectory = { boothId: key, ...vendor };
      this.activities.put(itemWithId);
    });
    booths.get('admins').forEach((vendor: IVendorDirectory, key: string) => {
      const itemWithId: DBVendorDirectory = { boothId: key, ...vendor };
      this.admins.put(itemWithId);
    });
    this.mapDimensions.put({ parameter: 'width', value: booths.get('width') });
    this.mapDimensions.put({ parameter: 'height', value: booths.get('height') });
  };

  public putVendorAction = (action: IVendorStatus) => {
    this.actions.put(action).then((keyname) => {
      // console.log('Added', keyname);
    });
  };

  public deleteVendorAction = (boothId: string) => {
    this.actions.delete(boothId).then((recordsRemoved) => {
      // console.log(`Deleted: ${recordsRemoved} recs`);
    });
  };

  public getVendorActions = (): Promise<Map<string, IVendorStatus>> => {
    return new Promise((resolve, reject) => {
      this.actions.toArray().then((outputArray) => {
        let outputMap: Map<string, IVendorStatus> = new Map();
        for (const item of outputArray) {
          outputMap.set(item.boothId, {
            boothId: item.boothId,
            boothNum: item.boothNum,
            vendor: item.vendor,
            questions: item.questions,
            powerBuys: item.powerBuys,
            profitCenters: item.profitCenters,
            vendorNotes: item.vendorNotes,
            openStockForms: item.openStockForms,
          });
        }
        resolve(outputMap);
      });
    });
  };

  public clearVendorActions = () => {
    this.actions.clear();
  };


  public putQuestion = (qIdx: number, qa: IQuestionAnswer): Promise<IQuestionAnswer[]> => {
    return this.questions.put({ qIdx: qIdx, ...qa });
  };

  public deleteQuestion = (qIdx: number) => {
    this.questions.delete(qIdx).then((keyname) => {
      // console.log('Added', keyname);
    });
  };

  public getQuestions = (): Promise<IQuestionAnswer[]> => {
    return new Promise((resolve, reject) => {
      this.questions.toArray().then((srcArr) => {
        let tmpArr: IQuestionAnswer[] = [];
        for (const item of srcArr) {
          tmpArr[item.qIdx] = { question: item.question, answer: item.answer };
        }
        resolve(tmpArr);
      });
    });
  };

  public clearQuestions = () => {
    this.questions.clear();
  };


  public putPB = (pbIdx: number, pb: ISubmittableItem): Promise<number> => {
    return this.pwrBuys.put({ itmIdx: pbIdx, ...pb });
  };

  public deletePB = (pbIdx: number) => {
    this.pwrBuys.delete(pbIdx);
  };

  public getPBs = (): Promise<ISubmittableItem[]> => {
    return new Promise((resolve, reject) => {
      this.pwrBuys.toArray().then((srcArr) => {
        let tmpArr: ISubmittableItem[] = [];
        for (const item of srcArr) {
          tmpArr[item.itmIdx] = { itemId: item.itemId, submitted: item.submitted };
        }
        resolve(tmpArr);
      });
    });
  };

  public clearPBs = () => {
    this.pwrBuys.clear();
  };


  public putPC = (pcIdx: number, pc: ISubmittableItem): Promise<number> => {
    return this.prfCtrs.put({ itmIdx: pcIdx, ...pc });
  };

  public deletePC = (pcIdx: number) => {
    this.prfCtrs.delete(pcIdx);
  };

  public getPCs = (): Promise<ISubmittableItem[]> => {
    return new Promise((resolve, reject) => {
      this.prfCtrs.toArray().then((srcArr) => {
        let tmpArr: ISubmittableItem[] = [];
        for (const item of srcArr) {
          tmpArr[item.itmIdx] = { itemId: item.itemId, submitted: item.submitted };
        }
        resolve(tmpArr);
      });
    });
  };

  public clearPCs = () => {
    this.prfCtrs.clear();
  };


  public putVN = (vnIdx: number, vn: string): Promise<number> => {
    return this.vndNote.put({ itmIdx: vnIdx, note: vn });
  };

  public deleteVN = (vnIdx: number) => {
    this.vndNote.delete(vnIdx);
  };

  public getVNs = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      this.vndNote.toArray().then((srcArr) => {
        let tmpArr: string[] = [];
        for (const item of srcArr) {
          tmpArr[item.itmIdx] = item.note;
        }
        resolve(tmpArr);
      });
    });
  };

  public clearVNs = () => {
    this.vndNote.clear();
  };


  public deleteDB = (dbName: string) => {
    Dexie.delete(dbName);
  };
}
