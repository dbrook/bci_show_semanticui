import { OpenStockForm, VendorVisit } from './enums';

export interface IQuestionAnswer {
  question: string,
  answer?: string,
};

export interface ISubmittableItem {
  itemId: string,
  submitted: boolean,
};

export interface IVendorStatus {
  boothId: number,
  vendor: string,
  visit: VendorVisit,
  questions: IQuestionAnswer[],
  powerBuys: ISubmittableItem[],
  profitCenters: ISubmittableItem[],
  openStockForm: OpenStockForm,
};
