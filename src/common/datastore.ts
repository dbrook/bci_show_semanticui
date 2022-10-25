import { observable } from 'mobx';

class TradeShowData {
  @observable public tradeShowId = '2022-Fall-ACY';
}

const store = new TradeShowData();
export { TradeShowData, store as TradeShowStore };
