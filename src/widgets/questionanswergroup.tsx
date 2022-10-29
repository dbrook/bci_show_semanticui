import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import QuestionAnswer from './questionanswer';

interface QuestionAnswerGroupProps {
  boothNum: number;
  vendor: string;
  items: number[];
  hideCompleted: boolean;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

@inject('showStore') @observer
export default class QuestionAnswerGroup extends React.Component<QuestionAnswerGroupProps> {
  render() {
    const { boothNum, vendor, items, hideCompleted, showStore: { vendorQuestions } } = this.props;

    const itemsAsQuestAns = items.map((x) => {
      const { answer } = vendorQuestions[x];
      if (hideCompleted && answer) {
        return null;
      }
      return <QuestionAnswer key={x} questionId={x}/>;
    });

    return <div>
        <Header as='h3'>{boothNum} - {vendor}</Header>
        <div>
          {itemsAsQuestAns}
        </div>
        <Divider />
      </div>;
  }
}
