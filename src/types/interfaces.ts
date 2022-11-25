import { OpenStockForm, VendorVisit } from './enums';

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


/*
 * Data Export/Import Interfaces
 */

export interface DataBackup {
  tradeShowId: string;
  width: number;
  height: number;
  admins: { [key: string]: IVendorDirectory };
  activities: { [key: string]: IVendorDirectory };
  vendors: { [key: string]: IVendorDirectory };
  vendorsWithActions: { [key: string]: IVendorStatus };
  vendorQuestions: IQuestionAnswer[];
  powerBuys: ISubmittableItem[];
  profitCenters: ISubmittableItem[];
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

export interface DBSubmittableItem extends ISubmittableItem {
  itmIdx: number;
};

export interface IVendorStatus {
  boothId: string;               // Unique Booth Identifier (several vendors may share a booth)
  boothNum: number;              // The actual booth number of the vendor
  vendor: string;                // Vendor name from the show directory/index
  visit: VendorVisit;            // Status of the vender from an initial/revisit point of view
  questions: number[];           // List of question IDs relevant to this vendor
  powerBuys: number[];           // List of Power Buys relevant to this vendor
  profitCenters: number[];       // List of Profit Centers relevant to this vendor
  openStockForm: OpenStockForm;  // Open Stock Form completion progress (for this vendor)
};
