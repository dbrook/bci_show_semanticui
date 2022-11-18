import { action, computed, runInAction, makeObservable, observable, toJS } from 'mobx';

import { DataBackup, IVendorDirectory, IVendorStatus, IQuestionAnswer, ISubmittableItem } from '../types/interfaces';
import { VendorVisit, OpenStockForm } from '../types/enums';
import ShowDatabase from './showdatabase';

class TradeShowData {
  // Current Trade Show Database Loaded
  @observable public tradeShowId: string|undefined = undefined;

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

  private db: ShowDatabase;

  constructor() {
    this.boothVendors = new Map();
    this.vendorQuestions = [];
    this.powerBuys = [];
    this.profitCenters = [];

    // DO NOT REMOVE! This is needed in MobX 6+ to make observers actually respect the decorator syntax?
    // More information @ https://mobx.js.org/enabling-decorators.html
    makeObservable(this);

    this.db = new ShowDatabase();

    // Restore Local Storage Information
    const currentShowFromStorage = localStorage.getItem('BciTradeShowCurrent');
    if (currentShowFromStorage !== null) {
      this.tradeShowId = currentShowFromStorage;
      this.loadShowData();
      this.loadProgressData();
      this.loadQuestionsData();
      this.loadPowerBuys();
      this.loadProfitCenters();
    }
  }

  @action public eraseAndImportData = (dataBackup: DataBackup) => {
    runInAction(() => {
      // Import the provided Trade Show ID
      this.setCurrentShow(dataBackup.tradeShowId);

      // Import the Booth-Vendor Data
      const tempDbMap = new Map(Object.entries(dataBackup.boothVendors))
      this.boothVendors = tempDbMap;
      this.db.clearBoothVendors();
      this.db.putBoothVendors(tempDbMap);

      // Import the Vendors with vendors with actions
      const tempVwaMap = new Map(Object.entries(dataBackup.vendorsWithActions));
      this.vendorsWithActions = observable.map(tempVwaMap);
      tempVwaMap.forEach((value, key) => {
        this.saveActionToDatabase(key);
      });

      // Import the Questions
      const tempQuestions = dataBackup.vendorQuestions;
      this.vendorQuestions = tempQuestions;
      tempQuestions.forEach((elem, index) => {
        if (elem !== null) {
          this.db.putQuestion(index, elem);
        }
      });

      // Import the Power Buys
      const tempPBs = dataBackup.powerBuys;
      this.powerBuys = tempPBs;
      tempPBs.forEach((elem, index) => {
        if (elem !== null) {
          this.db.putPB(index, elem);
        }
      });

      // Import the Profit Centers
      const tempPCs = dataBackup.profitCenters;
      this.profitCenters = tempPCs;
      tempPCs.forEach((elem, index) => {
        if (elem !== null) {
          this.db.putPC(index, elem);
        }
      });
    });
  };

  @action public loadAvailableShows = (): Promise<string[]> => {
    return fetch('show_vendors/all_shows.json')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.shows;
      });
  };

  @action public loadShowData = (): Promise<any> => {
    return this.db.nbBoothVendors.then((nbVendorsInDb) => {
      // Look for local show database first, otherwise pull from server
      if (nbVendorsInDb === 0) {
        console.log('Loading vendors from the server!');
        fetch(`show_vendors/${this.tradeShowId}.json`)
          .then((response) => response.json())
          .then((responseJson) => {
            runInAction(() => {
              this.boothVendors = new Map(Object.entries(responseJson));
            });
            const tempDbMap: Map<string, IVendorDirectory> = new Map(Object.entries(responseJson));
            this.db.clearBoothVendors();
            this.db.putBoothVendors(tempDbMap);
          });
      } else {
        console.log('Loading vendors from the local database!');
        this.db.getBoothVendors().then((dataMap) => {
          runInAction(() => {
            this.boothVendors = dataMap;
          });
        });
      }
    });
  };

  @action public setCurrentShow = (newShowId: string|undefined) => {
    const oldShowId = this.tradeShowId;
    this.tradeShowId = newShowId;
    if (newShowId !== undefined) {
      localStorage.setItem('BciTradeShowCurrent', newShowId);
    } else {
      localStorage.removeItem('BciTradeShowCurrent');
    }

    // Erase the local database
    if (newShowId !== oldShowId) {
      this.db.clearBoothVendors();
    }
    this.db.clearVendorActions();
    this.db.clearQuestions();
    this.db.clearPBs();
    this.db.clearPCs();

    // Blow away all the existing data, it is invalidated when a new show is loaded
    runInAction(() => {
      this.vendorQuestions = [];
      this.powerBuys = [];
      this.profitCenters = [];
      this.vendorsWithActions.clear();
      if (newShowId !== oldShowId) {
        this.boothVendors = new Map();
      }
    });
  };

  private loadProgressData = () => {
    this.db.getVendorActions().then((dataMap) => {
      runInAction(() => {
        this.vendorsWithActions = observable.map(dataMap);
      });
    });
  };

  private loadQuestionsData = () => {
    this.db.getQuestions().then((qArray) => {
      runInAction(() => {
        this.vendorQuestions = qArray;
      });
    });
  };

  private loadPowerBuys = () => {
    this.db.getPBs().then((pbArray) => {
      runInAction(() => {
        this.powerBuys = pbArray;
      });
    });
  };

  private loadProfitCenters = () => {
    this.db.getPCs().then((pcArray) => {
      runInAction(() => {
        this.profitCenters = pcArray;
      });
    });
  };

  @action public nbVendorActions = () => {
    return this.vendorsWithActions.size;
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

  private cleanupBoothAuto = (boothId: string) => {
    // Checks the boothId contents to see if it can be removed from the "vendorWithActions" data set
    if (this.vendorsWithActions.has(boothId)) {
      const booth: IVendorStatus = this.vendorsWithActions.get(boothId);
      if (booth.visit === VendorVisit.DO_NOT_VISIT &&
          booth.questions.length === 0 &&
          booth.powerBuys.length === 0 &&
          booth.profitCenters.length === 0 &&
          booth.openStockForm === OpenStockForm.DO_NOT_GET) {
        this.vendorsWithActions.delete(boothId);
        this.db.deleteVendorAction(boothId);
      } else {
        this.saveActionToDatabase(boothId);
      }
    }
  }


  /*
   * Propagate data changes to the database
   */
  private saveActionToDatabase = (boothId: string) => {
    const stat: IVendorStatus = toJS(this.vendorsWithActions.get(boothId));
    this.db.putVendorAction(stat);
  };


  /*
   * Booth Visit Changes
   */
  @action public addVisit = (boothId: string) => {
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      this.vendorsWithActions.get(boothId).visit = VendorVisit.NOT_VISITED;
    });
    this.saveActionToDatabase(boothId);
  };

  @action public setVisitMode = (boothId: string, visitStatus: VendorVisit) => {
    runInAction(() => {
      this.vendorsWithActions.get(boothId).visit = visitStatus;
      this.cleanupBoothAuto(boothId);
    });
  };


  /*
   * Question Maintenance
   */

  @computed get nbQuestions() {
    let nbDefined = 0;
    for (const question of this.vendorQuestions) {
      if (question !== undefined) {
        nbDefined++;
      }
    }
    return nbDefined;
  }

  @action public addQuestion = (boothId: string, questionText: string) => {
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      // FIXME: Recycle any undefined positions before just pushing
      this.vendorQuestions.push({ question: questionText });
      this.vendorsWithActions.get(boothId).questions.push(this.vendorQuestions.length - 1);
    });
    this.saveActionToDatabase(boothId);
    this.db.putQuestion(this.vendorQuestions.length - 1, { question: questionText });
  };

  @action public removeQuestion = (questionId: number) => {
    if (questionId >= 0 && questionId < this.vendorQuestions.length) {
      let boothIdFound: string = '';
      this.vendorsWithActions.forEach((value, key) => {
        const idxFound = this.vendorsWithActions.get(key).questions.indexOf(questionId);
        if (idxFound !== -1) {
          this.vendorsWithActions.get(key).questions.splice(idxFound, 1);
          boothIdFound = key;
        }
      });
      this.vendorQuestions[questionId] = undefined;
      this.cleanupBoothAuto(boothIdFound);
      this.db.deleteQuestion(questionId);
    }
  }

  @action public changeQuestion = (questionId: number, questionText: string) => {
    if (questionId >= 0 &&
        questionId < this.vendorQuestions.length &&
        this.vendorQuestions[questionId] !== undefined) {
      this.vendorQuestions[questionId] = { ...this.vendorQuestions[questionId], question: questionText };
      // This ignore is needed because the value could be undefined but it was already checked above
      // @ts-ignore
      this.db.putQuestion(questionId, { question: questionText, answer: this.vendorQuestions[questionId].answer });
    }
  };

  @action public answerQuestion = (questionId: number, answerText: string) => {
    if (questionId >= 0 &&
        questionId < this.vendorQuestions.length &&
        this.vendorQuestions[questionId] !== undefined) {
      if (answerText === '') {
        delete this.vendorQuestions[questionId]?.answer
        // @ts-ignore
        this.db.putQuestion(questionId, { question: this.vendorQuestions[questionId].question, answer: undefined });
      } else {
        // @ts-ignore
        this.vendorQuestions[questionId].answer = answerText;
        // @ts-ignore
        this.db.putQuestion(questionId, { question: this.vendorQuestions[questionId].question, answer: answerText });
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
  @computed get nbPowerBuys() {
    let nbDefined = 0;
    for (const pb of this.powerBuys) {
      if (pb !== undefined) {
        nbDefined++;
      }
    }
    return nbDefined;
  }

  @action public addPowerBuy = (boothId: string, pbNum: string) => {
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      // FIXME: Recycle any undefined positions before just pushing
      this.powerBuys.push({ itemId: pbNum, submitted: false });
      this.vendorsWithActions.get(boothId).powerBuys.push(this.powerBuys.length - 1);
    });
    this.db.putPB(this.powerBuys.length - 1, { itemId: pbNum, submitted: false });
    this.saveActionToDatabase(boothId);
  };

  @action public removePowerBuy = (pbId: number) => {
    if (pbId >= 0 && pbId < this.powerBuys.length) {
      let boothIdFound: string = '';
      this.vendorsWithActions.forEach((value, key) => {
        const idxFound = this.vendorsWithActions.get(key).powerBuys.indexOf(pbId);
        if (idxFound !== -1) {
          this.vendorsWithActions.get(key).powerBuys.splice(idxFound, 1);
          boothIdFound = key;
        }
      });
      this.powerBuys[pbId] = undefined;
      this.db.deletePB(pbId);
      this.cleanupBoothAuto(boothIdFound);
    }
  }

  @action public submitPowerBuy = (pbId: number, submitted: boolean) => {
    if (pbId >= 0 && pbId < this.powerBuys.length && this.powerBuys[pbId] !== undefined) {
      // This ignore is needed because the value could be undefined but it was already checked above
      // @ts-ignore
      this.powerBuys[pbId].submitted = submitted;
      // @ts-ignore
      this.db.putPB(pbId, { itemId: this.powerBuys[pbId].itemId, submitted: submitted });
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
  @computed get nbProfitCenters() {
    let nbDefined = 0;
    for (const pc of this.profitCenters) {
      if (pc !== undefined) {
        nbDefined++;
      }
    }
    return nbDefined;
  }

  @action public addProfitCenter = (boothId: string, pcNum: string) => {
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      // FIXME: Recycle any undefined positions before just pushing
      this.profitCenters.push({ itemId: pcNum, submitted: false });
      this.vendorsWithActions.get(boothId).profitCenters.push(this.profitCenters.length - 1);
    });
    this.db.putPC(this.profitCenters.length - 1, { itemId: pcNum, submitted: false });
    this.saveActionToDatabase(boothId);
  };

  @action public removeProfitCenter = (pcId: number) => {
    if (pcId >= 0 && pcId < this.profitCenters.length) {
      let boothIdFound: string = '';
      this.vendorsWithActions.forEach((value, key) => {
        const idxFound = this.vendorsWithActions.get(key).profitCenters.indexOf(pcId);
        if (idxFound !== -1) {
          this.vendorsWithActions.get(key).profitCenters.splice(idxFound, 1);
          boothIdFound = key;
        }
      });
      this.profitCenters[pcId] = undefined;
      this.db.deletePC(pcId);
      this.cleanupBoothAuto(boothIdFound);
    }
  }

  @action public submitProfitCenter = (pcId: number, submitted: boolean) => {
    if (pcId >= 0 && pcId < this.profitCenters.length && this.profitCenters[pcId] !== undefined) {
      // This ignore is needed because the value could be undefined but it was already checked above
      // @ts-ignore
      this.profitCenters[pcId].submitted = submitted;
      // @ts-ignore
      this.db.putPC(pcId, { itemId: this.profitCenters[pcId].itemId, submitted: submitted });
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
  @action public setOpenStock = (boothId: string, osStatus: OpenStockForm) => {
    runInAction(() => {
      this.vendorsWithActions.get(boothId).openStockForm = osStatus;
      this.cleanupBoothAuto(boothId);
    });
  };

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
        this.cleanupBoothAuto(boothId);
      });
    }
  };

  @action public abandonOpenStock = (boothId: string) => {
    if (this.vendorsWithActions.has(boothId)) {
      this.vendorsWithActions.get(boothId).openStockForm = OpenStockForm.ABANDONED;
      this.saveActionToDatabase(boothId);
    }
  };
}

const store = new TradeShowData();
export { TradeShowData, store as TradeShowStore };

// FIXME: Remove this direct console access port (at some point)
(window as any).__DATA = store;
