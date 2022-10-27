import { action, observable } from 'mobx';

import { IVendorDirectory } from '../types/interfaces';
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
  }

  @action public addVisit = (boothId: string) => {
    // FIXME: This is obviously bad to set the map objects like this, but this just gets the stores started
    if (this.vendorsWithActions.has(boothId)) {
      this.vendorsWithActions.set(boothId, {
        boothId: boothId,
        boothNum: this.boothVendors.get(boothId)?.boothNum ?? 0,
        vendor: this.boothVendors.get(boothId)?.vendor ?? '',
        visit: VendorVisit.VISITED,
        questions: [],
        powerBuys: [],
        profitCenters: [],
        openStockForm: OpenStockForm.DO_NOT_GET,
      });
    } else {
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
    }
  };
}

const store = new TradeShowData();
export { TradeShowData, store as TradeShowStore };
