import { OpenStockForm, VendorVisit } from './enums';

/*
 * Data Model Interfaces
 */

export interface IVendorDirectory {
  boothId: string,
  boothNum: number,
  vendor: string,
};


/*
 * Display Model Interfaces
 */

export interface IQuestionAnswer {
  question: string,
  answer?: string,
};

export interface ISubmittableItem {
  itemId: string,
  submitted: boolean,
};

export interface IVendorStatus {
  boothId: string,                    // Completely-unique Booth Identifier (several vendors share 1 booth at times)
  boothNum: number,                   // The actual booth number of the vendor
  vendor: string,                     // Vendor name from the show directory/index
  visit: VendorVisit,                 // Status of the vender from an initial/revisit point of view
  questions: IQuestionAnswer[],       // List of questions relevant to this vendor
  powerBuys: ISubmittableItem[],      // List of Power Buys relevant to this vendor
  profitCenters: ISubmittableItem[],  // List of Profit Centers relevant to this vendor
  openStockForm: OpenStockForm,       // Open Stock Form completion progress (for this vendor)
};
