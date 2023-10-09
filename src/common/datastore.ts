import { action, computed, runInAction, makeObservable, observable, toJS } from 'mobx';

import {
  DataBackup,
  IVendorDirectory,
  IVendorStatus,
  IQuestionAnswer,
  ISubmittableItem,
  IOpenStock,
} from '../types/interfaces';
import { OpenStockForm } from '../types/enums';
import ShowDatabase from './showdatabase';

/*
 * Global Application State Store
 *
 * This class holds:
 *   - Currently-loaded show (from local storage)
 *   - Vendors list, coordinates of booths to draw in canvas, overall canvas dimension
 *   - Booth lists for administrative tasks (kiosks, etc.) and activities (break booths, etc.)
 *   - Vendors with actions (visit status, open stock form, links to questions, PB, PC)
 *   - Questions, Power Buys, Profit Centers arrays
 *
 * In addition, it is responsible for interacting with Dexie to store/retrieve data from the
 * IndexedDB databases for each show
 */
class TradeShowData {
  // Current Trade Show Database Loaded
  @observable public tradeShowId: string|undefined = undefined;

  // All Vendors, Booth Index List
  @observable public boothVendors: Map<string, IVendorDirectory>;

  // Activities Booth Index List (breaktime / activity spaces)
  @observable public boothActivities: Map<string, IVendorDirectory>;

  // Administrative Booths (kiosk, new items, clearance, etc.)
  @observable public boothAdmins:  Map<string, IVendorDirectory>;

  // Floor Map Canvas Size
  @observable public floorPlanWidthPx: number;
  @observable public floorPlanHeightPx: number;

  // Vendors With Action Items
  // FIXME: Ideally this is the declaration to use for an observable map, but....
  // ... this workaround below is required to make a map "properly" observable
  // https://github.com/mobxjs/mobx-react/issues/398
  public vendorsWithActions = observable.map();

  // Question Data
  @observable public vendorQuestions: Array<IQuestionAnswer|undefined>;

  // Power Buy Data
  @observable public powerBuys: Array<ISubmittableItem|undefined>;

  // Profit Centers Data
  @observable public profitCenters: Array<ISubmittableItem|undefined>;

  // Notes for the vendors
  @observable public vendorNotes: Array<string|undefined>;

  // Instance of the Dexie IndexedDB wrapper
  private db: ShowDatabase;

  // Remembered last-used vendor on vendor tab
  @observable public vendorPanelBoothId: string|undefined;

  constructor() {
    this.boothVendors = new Map();
    this.boothActivities = new Map();
    this.boothAdmins = new Map();
    this.floorPlanWidthPx = 0;
    this.floorPlanHeightPx = 0;
    this.vendorQuestions = [];
    this.powerBuys = [];
    this.profitCenters = [];
    this.vendorNotes = [];
    this.vendorPanelBoothId = undefined;

    // DO NOT REMOVE! This is needed in MobX 6+ to make observers actually respect the decorators
    // More information @ https://mobx.js.org/enabling-decorators.html
    makeObservable(this);

    // Restore Local Storage Information
    const currentShowFromStorage = localStorage.getItem('BciTradeShowCurrent');
    if (currentShowFromStorage !== null) {
      this.tradeShowId = currentShowFromStorage;
      this.db = new ShowDatabase(currentShowFromStorage);
      this.loadShowData();
      this.loadProgressData();
      this.loadQuestionsData();
      this.loadPowerBuys();
      this.loadProfitCenters();
      this.loadVendorNotes();
    } else {
      this.db = new ShowDatabase('');
    }
  }

  @action public eraseAndImportData = (dataBackup: DataBackup) => {
    runInAction(() => {
      // Import the provided Trade Show ID
      this.setCurrentShow(dataBackup.tradeShowId, true);
      this.db = new ShowDatabase(dataBackup.tradeShowId);

      // Import Floor Plan Canvas Dimensions
      this.floorPlanWidthPx = dataBackup.width;
      this.floorPlanHeightPx = dataBackup.height;

      // Import the Booth-Vendor Data, including activities and BCI administrative blocks
      const tempVendorMap = new Map(Object.entries(dataBackup.vendors));
      this.boothVendors = tempVendorMap;

      const tempActivitiesMap = new Map(Object.entries(dataBackup.activities));
      this.boothActivities = tempActivitiesMap;

      const tempAdminsMap = new Map(Object.entries(dataBackup.admins));
      this.boothAdmins = tempAdminsMap;

      const allBoothData: Map<string, any> = new Map();
      allBoothData.set('vendors', tempVendorMap);
      allBoothData.set('activities', tempActivitiesMap);
      allBoothData.set('admins', tempAdminsMap);
      allBoothData.set('width', dataBackup.width);
      allBoothData.set('height', dataBackup.height);
      this.db.putBooths(allBoothData);

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

      // Import the notes
      const tempVNs = dataBackup.vendorNotes;
      this.vendorNotes = tempVNs;
      tempVNs.forEach((elem, index) => {
        if (elem !== null) {
          this.db.putVN(index, elem as string);
        }
      });
    });
  };

  @action public loadAvailableShows = (): Promise<string[]> => {
    return fetch('show_vendors/all_shows.json', { cache: "no-store" })
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
        fetch(`show_vendors/${this.tradeShowId}.json`, { cache: "no-store" })
          .then((response) => response.json())
          .then((responseJson) => {
            runInAction(() => {
              this.boothVendors = new Map(Object.entries(responseJson.vendors));
              this.boothActivities = new Map(Object.entries(responseJson.activities));
              this.boothAdmins = new Map(Object.entries(responseJson.admins));
              this.floorPlanWidthPx = responseJson.width;
              this.floorPlanHeightPx = responseJson.height;
            });
            const tempVendorMap: Map<string, IVendorDirectory> =
              new Map(Object.entries(responseJson.vendors));
            const tempActivitiesMap: Map<string, IVendorDirectory> =
              new Map(Object.entries(responseJson.activities));
            const tempAdminsMap: Map<string, IVendorDirectory> =
              new Map(Object.entries(responseJson.admins));
            this.db.clearBooths();
            const allBoothData: Map<string, any> = new Map();
            allBoothData.set('vendors', tempVendorMap);
            allBoothData.set('activities', tempActivitiesMap);
            allBoothData.set('admins', tempAdminsMap);
            allBoothData.set('width', this.floorPlanWidthPx);
            allBoothData.set('height', this.floorPlanHeightPx);
            this.db.putBooths(allBoothData);
          });
      } else {
        console.log('Loading vendors from the local database!');
        this.db.getBooths().then((dataMap) => {
          runInAction(() => {
            this.boothVendors = dataMap.get('vendors');
            this.boothActivities = dataMap.get('activities');
            this.boothAdmins = dataMap.get('admins');
            this.floorPlanWidthPx = dataMap.get('width');
            this.floorPlanHeightPx = dataMap.get('height');
          });
        });
      }
    });
  };

  @action public clearDatabases = (eraseBoothVendors: boolean) => {
    if (eraseBoothVendors) {
      this.db.clearBooths();
    }
    this.db.clearVendorActions();
    this.db.clearQuestions();
    this.db.clearPBs();
    this.db.clearPCs();
    this.db.clearVNs();
  };

  @action public clearJSObjects = (eraseBoothVendors: boolean) => {
    runInAction(() => {
      this.vendorQuestions = [];
      this.powerBuys = [];
      this.profitCenters = [];
      this.vendorNotes = [];
      this.vendorsWithActions.clear();
      if (eraseBoothVendors) {
        this.boothVendors = new Map();
        this.boothActivities = new Map();
        this.boothAdmins = new Map();
        this.floorPlanWidthPx = 0;
        this.floorPlanHeightPx = 0;
      }
    });
  };

  @action public setCurrentShow = (newShowId: string|undefined, skipDbLoad: boolean) => {
    const oldShowId = this.tradeShowId;
    this.tradeShowId = newShowId;
    if (newShowId !== undefined) {
      localStorage.setItem('BciTradeShowCurrent', newShowId);
    } else {
      localStorage.removeItem('BciTradeShowCurrent');
      this.clearDatabases(true);
    }

    this.clearJSObjects(newShowId !== oldShowId);

    // If there is data from the newly-loaded show in the IndexedDB, load it up
    if (newShowId !== undefined && !skipDbLoad) {
      this.db = new ShowDatabase(newShowId);
      this.loadProgressData();
      this.loadQuestionsData();
      this.loadPowerBuys();
      this.loadProfitCenters();
      this.loadVendorNotes();
    }
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

  private loadVendorNotes = () => {
    this.db.getVNs().then((vnArray) => {
      runInAction(() => {
        this.vendorNotes = vnArray;
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
        questions: [],
        powerBuys: [],
        profitCenters: [],
        vendorNotes: [],
        openStockForms: [],
      });
    }
  };

  private cleanupBoothAuto = (boothId: string) => {
    // Checks the boothId contents to see if it can be removed from the "vendorWithActions" data set
    if (this.vendorsWithActions.has(boothId)) {
      const booth: IVendorStatus = this.vendorsWithActions.get(boothId);
      if (booth.questions.length === 0 &&
          booth.powerBuys.length === 0 &&
          booth.profitCenters.length === 0 &&
          booth.vendorNotes.length === 0 &&
          booth.openStockForms.length === 0) {
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
    const nextQIdx = this.vendorQuestions.indexOf(undefined);
    const newQIdx = nextQIdx !== -1 ? nextQIdx : this.vendorQuestions.length;
    this.db.putQuestion(newQIdx, { question: questionText }).then(() => {
      runInAction(() => {
        this.initBoothIfNeeded(boothId);
        if (nextQIdx !== -1) {
          this.vendorQuestions[nextQIdx] = { question: questionText };
          this.vendorsWithActions.get(boothId).questions.push(nextQIdx);
        } else {
          this.vendorQuestions.push({ question: questionText });
          this.vendorsWithActions.get(boothId).questions.push(this.vendorQuestions.length - 1);
        }
      });
      this.saveActionToDatabase(boothId);
    });
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
      this.db.deleteQuestion(questionId);
      this.cleanupBoothAuto(boothIdFound);
    }
  }

  @action public changeQuestion = (questionId: number, questionText: string) => {
    if (questionId >= 0 &&
        questionId < this.vendorQuestions.length &&
        this.vendorQuestions[questionId] !== undefined) {
      this.vendorQuestions[questionId] = { ...this.vendorQuestions[questionId], question: questionText };
      // This ignore is needed because the value could be undefined but it was already checked above
      this.db.putQuestion(questionId, {
                            question: questionText,
                            // @ts-ignore
                            answer: this.vendorQuestions[questionId].answer,
                          });
    }
  };

  @action public answerQuestion = (questionId: number, answerText: string) => {
    if (questionId >= 0 &&
        questionId < this.vendorQuestions.length &&
        this.vendorQuestions[questionId] !== undefined) {
      if (answerText === '') {
        delete this.vendorQuestions[questionId]?.answer
        this.db.putQuestion(questionId,
                            {
                              // @ts-ignore
                              question: this.vendorQuestions[questionId].question,
                              answer: undefined,
                            });
      } else {
        // @ts-ignore
        this.vendorQuestions[questionId].answer = answerText;
        this.db.putQuestion(questionId,
                            {
                              // @ts-ignore
                              question: this.vendorQuestions[questionId].question,
                              answer: answerText,
                            });
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
    const nextPbIdx = this.powerBuys.indexOf(undefined);
    const newPbIdx = nextPbIdx !== -1 ? nextPbIdx : this.powerBuys.length;
    this.db.putPB(newPbIdx, { itemId: pbNum, submitted: false }).then(() => {
      runInAction(() => {
        this.initBoothIfNeeded(boothId);
        if (nextPbIdx !== -1) {
          this.powerBuys[nextPbIdx] = { itemId: pbNum, submitted: false };
          this.vendorsWithActions.get(boothId).powerBuys.push(nextPbIdx);
        } else {
          this.powerBuys.push({ itemId: pbNum, submitted: false });
          this.vendorsWithActions.get(boothId).powerBuys.push(this.powerBuys.length - 1);
        }
      });
      this.saveActionToDatabase(boothId);
    });
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
      this.db.putPB(pbId,
                    {
                      // @ts-ignore
                      itemId: this.powerBuys[pbId].itemId,
                      submitted: submitted,
                    }).then(() => {
        // @ts-ignore
        this.powerBuys[pbId].submitted = submitted;
      });
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
    const nextPcIdx = this.profitCenters.indexOf(undefined);
    const newPcIdx = nextPcIdx !== -1 ? nextPcIdx : this.profitCenters.length;
    this.db.putPC(newPcIdx, { itemId: pcNum, submitted: false }).then(() => {
      runInAction(() => {
        this.initBoothIfNeeded(boothId);
        if (nextPcIdx !== -1) {
          this.profitCenters[nextPcIdx] = { itemId: pcNum, submitted: false };
          this.vendorsWithActions.get(boothId).profitCenters.push(nextPcIdx);
        } else {
          this.profitCenters.push({ itemId: pcNum, submitted: false });
          this.vendorsWithActions.get(boothId).profitCenters.push(this.profitCenters.length - 1);
        }
      });
      this.saveActionToDatabase(boothId);
    });
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
      this.db.putPC(pcId,
                    {
                      // @ts-ignore
                      itemId: this.profitCenters[pcId].itemId,
                      submitted: submitted,
                    }).then(() => {
        // @ts-ignore
        this.profitCenters[pcId].submitted = submitted;
      });
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
   * Vendor Notes Maintenance
   */
  @action nbVendorNotes = (boothId: string): number => {
    let nbDefined = 0;
    for (const vn of this.vendorsWithActions.get(boothId).vendorNotes) {
      if (vn !== undefined) {
        nbDefined++;
      }
    }
    return nbDefined;
  }

  @action public addVendorNote = (boothId: string, note: string) => {
    const nextNoteIdx = this.vendorNotes.indexOf(undefined);
    const newNoteIdx = nextNoteIdx !== -1 ? nextNoteIdx : this.vendorNotes.length;
    this.db.putVN(newNoteIdx, note).then(() => {
      runInAction(() => {
        this.initBoothIfNeeded(boothId);
        if (nextNoteIdx !== -1) {
          this.vendorNotes[nextNoteIdx] = note;
          this.vendorsWithActions.get(boothId).vendorNotes.push(nextNoteIdx);
        } else {
          this.vendorNotes.push(note);
          this.vendorsWithActions.get(boothId).vendorNotes.push(this.vendorNotes.length - 1);
        }
      });
      this.saveActionToDatabase(boothId);
    });
  };

  @action public removeVendorNote = (vnId: number) => {
    if (vnId >= 0 && vnId < this.vendorNotes.length) {
      let boothIdFound: string = '';
      this.vendorsWithActions.forEach((value, key) => {
        const idxFound = this.vendorsWithActions.get(key).vendorNotes.indexOf(vnId);
        if (idxFound !== -1) {
          this.vendorsWithActions.get(key).vendorNotes.splice(idxFound, 1);
          boothIdFound = key;
        }
      });
      this.vendorNotes[vnId] = undefined;
      this.db.deleteVN(vnId);
      this.cleanupBoothAuto(boothIdFound);
    }
  }

  @action public nbVendorNotesForBoothId = (boothId: string): number => {
    let notes = 0;
    for (const noteId of this.vendorsWithActions.get(boothId).vendorNotes) {
      if (this.vendorNotes[noteId] !== undefined) {
        notes++;
      }
    }
    return notes;
  };

  @action public changeVendorNote = (noteId: number, text: string) => {
    if (noteId >= 0 &&
        noteId < this.vendorNotes.length &&
        this.vendorNotes[noteId] !== undefined) {
      // @ts-ignore
      this.vendorNotes[noteId] = text;
      this.db.putVN(noteId, text);
    }
  };


  /*
   * Open Stock Form Progress Handling
   */
  @action public nbSubmittedOpenStock = (boothId: string) => {
    let completed = 0;
    for (const os of this.vendorsWithActions.get(boothId).openStockForms) {
      if (os.formState === OpenStockForm.SUBMITTED || os.formState === OpenStockForm.ABANDONED) {
        completed++;
      }
    }
    return completed;
  };

  @action public addOpenStock = (boothId: string, label: string, osStatus: OpenStockForm) => {
    runInAction(() => {
      this.initBoothIfNeeded(boothId);
      let osForm: IOpenStock = { label: label, formState: osStatus };
      this.vendorsWithActions.get(boothId).openStockForms.push(osForm);
      this.cleanupBoothAuto(boothId);
    });
  };

  @action public setOpenStock = (boothId: string, osIdx: number, osStatus: OpenStockForm) => {
    runInAction(() => {
      this.vendorsWithActions.get(boothId).openStockForms[osIdx].formState = osStatus;
      this.cleanupBoothAuto(boothId);
    });
  };

  @action public advanceOpenStockStatus = (boothId: string, osIdx: number) => {
    if (this.vendorsWithActions.has(boothId)) {
      const osState = this.vendorsWithActions.get(boothId).openStockForms[osIdx].formState;
      let osNext: OpenStockForm = OpenStockForm.PICK_UP;
      switch (osState) {
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
          osNext = OpenStockForm.PICK_UP;
          break;
      }
      runInAction(() => {
        // Progress the status of the form
        this.vendorsWithActions.get(boothId).openStockForms[osIdx].formState = osNext;
        this.cleanupBoothAuto(boothId);
      });
    }
  };

  @action public abandonOpenStock = (boothId: string, osIdx: number) => {
    if (this.vendorsWithActions.has(boothId)) {
      this.vendorsWithActions.get(boothId).openStockForms[osIdx].formState = OpenStockForm.ABANDONED;
      this.saveActionToDatabase(boothId);
    }
  };


  @action public setVendorPanelBoothId = (boothId: string|undefined) => {
    this.vendorPanelBoothId = boothId;
  };


  @action public deleteDatabase = () => {
    if (this.tradeShowId !== undefined) {
      this.db.deleteDB(this.tradeShowId);
    }
  };
}

const store = new TradeShowData();
export { TradeShowData, store as TradeShowStore };

// FIXME: Remove this direct console access port (at some point)
(window as any).__DATA = store;
