import { action, runInAction, observable } from 'mobx';

import { IVendorDirectory, IQuestionAnswer } from '../types/interfaces';
import { VendorVisit, OpenStockForm } from '../types/enums';

class TradeShowData {
  // Current Trade Show Database Loaded
  @observable public tradeShowId: string = '2022-Fall-ACY';

  // Vendor - Booth Index List
  @observable public boothVendors: Map<string, IVendorDirectory>;

  // FIXME: Ideally this is the declaration to use for an observable map, but....
  // @observable public vendorsWithActions: Map<string, IVendorStatus> = new Map<string, IVendorStatus>();

  // ... this workaround below is required to make a map "properly" observable
  // https://github.com/mobxjs/mobx-react/issues/398
  public vendorsWithActions = observable.map();

  @observable public vendorQuestions: Array<IQuestionAnswer|undefined>;

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
  }

  @action public addVisit = (boothId: string) => {
    // FIXME: This is obviously bad to set the map objects like this, but this just gets the stores started
    runInAction(() => {
      if (!this.vendorsWithActions.has(boothId)) {
        this.vendorsWithActions.set(boothId, {
            boothId: boothId,
            boothNum: this.boothVendors.get(boothId)?.boothNum ?? 0,
            vendor: this.boothVendors.get(boothId)?.vendor ?? '',
            visit: VendorVisit.NOT_VISITED,
            questions: [],
            powerBuys: [],
            profitCenters: [],
            openStockForm: OpenStockForm.DO_NOT_GET,
        });
      } else {
        this.vendorsWithActions.get(boothId).visit = VendorVisit.NOT_VISITED;
      }
    });
  };

  @action public addQuestion = (boothId: string, questionText: string) => {
    runInAction(() => {
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

  @action public nbAnsweredQuestions = (boothId: number): number => {
    let answeredQuestions = 0;
    for (const questionId of this.vendorsWithActions.get(boothId).questions) {
      if (this.vendorQuestions[questionId]?.answer !== undefined) {
        answeredQuestions++;
      }
    }
    return answeredQuestions;
  };
}

const store = new TradeShowData();
export { TradeShowData, store as TradeShowStore };

// FIXME: Remove this direct console access port
(window as any).__DATA = store;
