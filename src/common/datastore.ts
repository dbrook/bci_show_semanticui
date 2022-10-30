import { action, runInAction, makeObservable, observable } from 'mobx';

import { IVendorDirectory, IQuestionAnswer, ISubmittableItem } from '../types/interfaces';
import { VendorVisit, OpenStockForm } from '../types/enums';

class TradeShowData {
  // Current Trade Show Database Loaded
  @observable public tradeShowId: string = '2022-Fall-ACY';

  // All Vendors, Booth Index List
  @observable public boothVendors: Map<string, IVendorDirectory>;

  // Vendors With Action Items
  // FIXME: Ideally this is the declaration to use for an observable map, but....
  // @observable public vendorsWithActions: Map<string, IVendorStatus> = new Map<string, IVendorStatus>();
  // ... this workaround below is required to make a map "properly" observable
  // https://github.com/mobxjs/mobx-react/issues/398
  public vendorsWithActions = observable.map();

  // Question Data
  @observable public vendorQuestions: Array<IQuestionAnswer|undefined>;

  // Power Buy Data
  @observable public powerBuys: Array<ISubmittableItem|undefined>;

  // Profit Centers Data
  @observable public profitCenters: Array<ISubmittableItem|undefined>;

  constructor() {
    this.boothVendors = new Map([
      ['100-0', {
        boothNum: 100,
        vendor: 'Initial Added',
      }],
      ['196-0', {
        boothNum: 196,
        vendor: 'Company Foo',
      }],
      ['205-0', {
        boothNum: 205,
        vendor: 'Bar, Inc.',
      }],
      ['212-0', {
        boothNum: 212,
        vendor: 'Another Industries Inc, a DEWARTIMER enterprises subsidiary',
      }],
      ['222-0', {
        boothNum: 222,
        vendor: 'Yet Another, Inc.',
      }],
      ['222-1', {
        boothNum: 222,
        vendor: 'Visited Co.',
      }],
      ['998-0', {
        boothNum: 998,
        vendor: 'Everything, Inc.',
      }],
      ['999-0', {
        boothNum: 999,
        vendor: 'Power Corporation',
      }],
    ]);

    this.vendorQuestions = [];
    this.powerBuys = [];
    this.profitCenters = [];

    // DO NOT REMOVE! This is needed in mobx 6+ to make observers actually respect the decorator syntax?
    // More information @ https://mobx.js.org/enabling-decorators.html
    makeObservable(this);
  }

  private initBoothIfNeeded = (boothId: string) => {
    if (!this.vendorsWithActions.has(boothId)) {
      this.vendorsWithActions.set(boothId, {
        boothId: boothId,
        boothNum: this.boothVendors.get(boothId)?.boothNum ?? 0,
        vendor: this.boothVendors.get(boothId)?.vendor ?? '',
        visit: VendorVisit.DO_NOT_VISIT,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.DO_NOT_GET,
      });
    }
  };

  @action public addVisit = (boothId: string) => {
    // FIXME: This is obviously bad to set the map objects like this, but this just gets the stores started
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      this.vendorsWithActions.get(boothId).visit = VendorVisit.NOT_VISITED;
    });
  };


  /*
   * Question Maintenance
   */

  @action public addQuestion = (boothId: string, questionText: string) => {
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      this.vendorQuestions.push({ question: questionText });
      this.vendorsWithActions.get(boothId).questions.push(this.vendorQuestions.length - 1);
    });
  };

  // @action public removeQuestion = (questionId: number) => {
  //   // Unlink the question from the vendorsWithActions
  //   this.vendorsWithActions.forEach((value, key) => {
  //     const questionIdxFound = this.vendorsWithActions.get(key).questions.indexOf(questionId);
  //     if (questionIdxFound !== -1) {
  //       this.vendorsWithActions.get(key).questions[questionIdxFound] = undefined;
  //       console.log('Successfully removed!');
  //     }
  //   });
  //
  //   if (questionId >= 0 && questionId < this.vendorQuestions.length) {
  //     this.vendorQuestions[questionId] = undefined;
  //   }
  // }

  @action public changeQuestion = (questionId: number, questionText: string) => {
    if (questionId >= 0 &&
        questionId < this.vendorQuestions.length &&
        this.vendorQuestions[questionId] !== undefined) {
      // FIXME: Should probably sanitize the input!
      this.vendorQuestions[questionId] = { ...this.vendorQuestions[questionId], question: questionText };
    }
  };

  @action public answerQuestion = (questionId: number, answerText: string) => {
    if (questionId >= 0 &&
        questionId < this.vendorQuestions.length &&
        this.vendorQuestions[questionId] !== undefined) {
      if (answerText === '') {
        delete this.vendorQuestions[questionId]?.answer
      } else {
        // FIXME: Should probably sanitize the input!
        // This ignore is needed because the value could be undefined but it was already checked above
        // @ts-ignore
        this.vendorQuestions[questionId].answer = answerText;
      }
    }
  };

  @action public nbAnsweredQuestions = (boothId: string): number => {
    let answeredQuestions = 0;
    for (const questionId of this.vendorsWithActions.get(boothId).questions) {
      if (this.vendorQuestions[questionId]?.answer !== undefined) {
        answeredQuestions++;
      }
    }
    return answeredQuestions;
  };


  /*
   * Power Buy Maintenance
   */
  @action public addPowerBuy = (boothId: string, pbNum: string) => {
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      this.powerBuys.push({ itemId: pbNum, submitted: false });
      this.vendorsWithActions.get(boothId).powerBuys.push(this.powerBuys.length - 1);
    });
  };

  @action public submitPowerBuy = (pbId: number, submitted: boolean) => {
    if (pbId >= 0 && pbId < this.powerBuys.length && this.powerBuys[pbId] !== undefined) {
      // This ignore is needed because the value could be undefined but it was already checked above
      // @ts-ignore
      this.powerBuys[pbId].submitted = submitted;
    }
  };

  @action public nbSubmittedPowerBuys = (boothId: string): number => {
    let submitted = 0;
    for (const questionId of this.vendorsWithActions.get(boothId).powerBuys) {
      if (this.powerBuys[questionId]?.submitted) {
        submitted++;
      }
    }
    return submitted;
  };

  /*
   * Profit Center Maintenance
   */
  @action public addProfitCenter = (boothId: string, pcNum: string) => {
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      this.profitCenters.push({ itemId: pcNum, submitted: false });
      this.vendorsWithActions.get(boothId).profitCenters.push(this.profitCenters.length - 1);
    });
  };

  @action public submitProfitCenter = (pcId: number, submitted: boolean) => {
    if (pcId >= 0 && pcId < this.profitCenters.length && this.profitCenters[pcId] !== undefined) {
      // This ignore is needed because the value could be undefined but it was already checked above
      // @ts-ignore
      this.profitCenters[pcId].submitted = submitted;
    }
  };

  @action public nbSubmittedProfitCenters = (boothId: string): number => {
    let submitted = 0;
    for (const questionId of this.vendorsWithActions.get(boothId).profitCenters) {
      if (this.profitCenters[questionId]?.submitted) {
        submitted++;
      }
    }
    return submitted;
  };


  /*
   * Open Stock Form Progress Handling
   */
  @action public advanceOpenStockStatus = (boothId: string) => {
    if (this.vendorsWithActions.has(boothId)) {
      const osState = this.vendorsWithActions.get(boothId).openStockForm;
      let osNext: OpenStockForm = OpenStockForm.DO_NOT_GET;
      switch (osState) {
        case OpenStockForm.DO_NOT_GET:
          osNext = OpenStockForm.PICK_UP;
          break;
        case OpenStockForm.PICK_UP:
          osNext = OpenStockForm.RETRIEVED;
          break;
        case OpenStockForm.RETRIEVED:
          osNext = OpenStockForm.FILLED_IN;
          break;
        case OpenStockForm.FILLED_IN:
          osNext = OpenStockForm.SUBMITTED;
          break;
        default:
          osNext = OpenStockForm.DO_NOT_GET;
          break;
      }
      runInAction(() => {
        // Progress the status of the form
        this.vendorsWithActions.get(boothId).openStockForm = osNext;
      });
    }
  };

  @action public abandonOpenStock = (boothId: string) => {
    if (this.vendorsWithActions.has(boothId)) {
      this.vendorsWithActions.get(boothId).openStockForm = OpenStockForm.ABANDONED;
    }
  };
}

const store = new TradeShowData();
export { TradeShowData, store as TradeShowStore };

// FIXME: Remove this direct console access port
(window as any).__DATA = store;
