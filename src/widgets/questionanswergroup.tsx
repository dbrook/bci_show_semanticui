import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import QuestionAnswer from './questionanswer';

interface QuestionAnswerGroupProps {
  boothNum: number;
  vendor: string;
  items: number[];
  hideCompleted: boolean;
  hideVendor: boolean;
  showStore?: any;
};

/*
 * QuestionAnswerGroup Component:
 *
 * Collection of all QuestionAnswer components belonging to a single vendor.
 */
@inject('showStore') @observer
export default class QuestionAnswerGroup extends React.Component<QuestionAnswerGroupProps> {
  render() {
    const {
      boothNum,
      vendor,
      items,
      hideCompleted,
      hideVendor,
      showStore: { vendorQuestions }
    } = this.props;

    const itemsAsQuestAns = items.map((x) => {
      const { answer } = vendorQuestions[x];
      if (hideCompleted && answer) {
        return null;
      }
      return <QuestionAnswer key={x} questionId={x}/>;
    });

    let header = null;
    let divider = null;
    if (!hideVendor) {
      header = <Header as='h3'>{boothNum} - {vendor}</Header>;
      divider = <Divider />;
    }
    return <div>
        {header}
        <div>
          {itemsAsQuestAns}
        </div>
        {divider}
      </div>;
  }
}
