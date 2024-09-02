/*
 * Data Types
 */
export enum OpenStockForm {
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


/*
 * Task Types
 */
export enum TaskType {

};

export type SimpleSubmittableType = 'PC' | 'PB';
