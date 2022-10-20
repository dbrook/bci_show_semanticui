import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

import { IQuestionAnswer } from '../types/interfaces';

import QuestionAnswer from './questionanswer';

interface QuestionAnswerGroupProps {
  boothId: number,
  vendor: string,
  items: IQuestionAnswer[],
  hideCompleted: boolean,
};

export default class QuestionAnswerGroup extends React.Component<QuestionAnswerGroupProps> {
  render() {
    const { boothId, vendor, items, hideCompleted } = this.props;

    const itemsAsQuestAns = items.map((x) => {
      if (hideCompleted && x.answer) {
        return null;
      }

      // FIXME: Since the questions will be enhanced/replaced with unique lookup IDs, add
      //        a key prop here with said identifier when that is implemented.
      return <QuestionAnswer question={x.question} answer={x.answer}/>;
    });

    return <div>
        <Header as='h3'>{boothId} - {vendor}</Header>
        <div>
          {itemsAsQuestAns}
        </div>
        <Divider />
      </div>;
  }
}
