import { OpenStockForm } from './enums';

/*
 * Data Model Interfaces
 */

export interface IVendorDirectory {
  boothNum: number;
  vendor: string;
  x1: number;
  y1: number;
  width: number;
  height: number;
};

export interface DBVendorDirectory extends IVendorDirectory {
  boothId: string;
};

export interface IOpenStock {
  label: string;
  formState: OpenStockForm;
};


/*
 * Data Export/Import Interfaces
 */

export interface VendorStatusBackup {
  boothId: string;
  boothNum: number;
  vendor: string;
  questions: number[];
  powerBuys: { [key: string]: ISubmittableQty };      // Exporting maps is apparently a no-go...
  profitCenters: { [key: string]: ISubmittableQty };  // Exporting maps is apparently a no-go...
  vendorNotes: number[];
  openStockForms: IOpenStock[];
};

export interface DataBackup {
  tradeShowId: string;
  width: number;
  height: number;
  admins: { [key: string]: IVendorDirectory };
  activities: { [key: string]: IVendorDirectory };
  vendors: { [key: string]: IVendorDirectory };
  vendorsWithActions: { [key: string]: VendorStatusBackup };
  vendorQuestions: IQuestionAnswer[];
  vendorNotes: string[];
};


/*
 * Display Model Interfaces
 */

export interface IQuestionAnswer {
  question: string;
  answer?: string;
};

export interface DBQuestionAnswer extends IQuestionAnswer {
  qIdx: number;
};

export interface ISubmittableItem {
  itemId: string;
  submitted: boolean;
};

export interface ISubmittableQty {
  quantity: number;
  submitted: boolean;
};

export interface DBSubmittableItem extends ISubmittableItem {
  itmIdx: number;
};

export interface DBIndexedString {
  itmIdx: number;
  note: string;
};

export interface IVendorStatus {
  boothId: string;                              // Unique Booth Identifier (several vendors may share a booth)
  boothNum: number;                             // The actual booth number of the vendor
  vendor: string;                               // Vendor name from the show directory/index
  questions: number[];                          // List of question IDs relevant to this vendor
  powerBuys: Map<string, ISubmittableQty>;      // Power Buys (letter) relevant to this vendor
  profitCenters: Map<string, ISubmittableQty>;  // List of Profit Centers relevant to this vendor
  vendorNotes: number[];                        // List of notes relevant to this vendor
  openStockForms: IOpenStock[];                 // Open Stock Forms' completion progress (for this vendor)
};
