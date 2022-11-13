import Dexie from 'dexie';

import {
  DBVendorDirectory,
  IVendorDirectory,
  IVendorStatus,
  IQuestionAnswer,
  DBQuestionAnswer,
  ISubmittableItem,
  DBSubmittableItem,
} from '../types/interfaces';

export default class ShowDatabase extends Dexie {
  vendors!: Dexie.Table<DBVendorDirectory>;
  actions!: Dexie.Table<IVendorStatus>;
  questions!: Dexie.Table<DBQuestionAnswer>;
  pwrBuys!: Dexie.Table<DBSubmittableItem>;
  prfCtrs!: Dexie.Table<DBSubmittableItem>;

  constructor() {
    super('ShowDatabase');
    this.version(1).stores({
      vendors: 'boothId, boothNum, vendor, x1, y1, width, height',
      actions: 'boothId, boothNum, vendor, visit, questions, powerBuys, profitCenters, openStockForm',
      questions: 'qIdx, question, answer',
      pwrBuys: 'itmIdx, itemId, submitted',
      prfCtrs: 'itmIdx, itemId, submitted',
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
            visit: item.visit,
            questions: item.questions,
            powerBuys: item.powerBuys,
            profitCenters: item.profitCenters,
            openStockForm: item.openStockForm,
          });
        }
        resolve(outputMap);
      });
    });
  };

  public clearVendorActions = () => {
    this.actions.clear();
  };

  /*
  questions!: Dexie.Table<DBQuestionAnswer>;
  */
  public putQuestion = (qIdx: number, qa: IQuestionAnswer) => {
    this.questions.put({ qIdx: qIdx, ...qa }).then((keyname) => {
      // console.log('Added', keyname);
    });
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

  /*
  pwrBuys!: Dexie.Table<DBSubmittableItem>;
  */
  public putPB = (pbIdx: number, pb: ISubmittableItem) => {
    this.pwrBuys.put({ itmIdx: pbIdx, ...pb }).then((keyname) => {
      // console.log('Added', keyname);
    });
  };

  public deletePB = (pbIdx: number) => {
    this.pwrBuys.delete(pbIdx).then((keyname) => {
      // console.log('Added', keyname);
    });
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

  /*
  prfCtrs!: Dexie.Table<DBSubmittableItem>;
  */
  public putPC = (pcIdx: number, pc: ISubmittableItem) => {
    this.prfCtrs.put({ itmIdx: pcIdx, ...pc }).then((keyname) => {
      // console.log('Added', keyname);
    });
  };

  public deletePC = (pcIdx: number) => {
    this.prfCtrs.delete(pcIdx).then((keyname) => {
      // console.log('Added', keyname);
    });
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
}
