/*
 * Data Types
 */

export enum VendorVisit {
  DO_NOT_VISIT = 0,
  NOT_VISITED = 1,
  VISITED = 2,
  NEED_REVISIT = 3,
};

export enum OpenStockForm {
  DO_NOT_GET = 0,
  PICK_UP = 1,
  RETRIEVED = 2,
  FILLED_IN = 3,
  SUBMITTED = 4,
  ABANDONED = 5,
};


/*
 * State-Tracking Types
 */
export enum DataLoad {
  NONE = 0,
  SUCCESS = 1,
  FAILURE = 2,
};
