import React from 'react';
import { Table } from 'semantic-ui-react';


import { IQuestionAnswer, ISubmittableItem, IVendorStatus } from '../types/interfaces';
import { OpenStockForm, VendorVisit } from '../types/enums';
import NumericalProgress from './numericalprogress';
import Visitation from './visitation';
import OpenStock from './openstock';

interface VendorActionsProps {
  vendorStatus: IVendorStatus,
};

export default class VendorActions extends React.Component<VendorActionsProps> {
  render() {
    const { boothId, vendor, visit, questions, powerBuys, profitCenters, openStockForm } = this.props.vendorStatus;
    return <Table.Row>
      <Table.Cell textAlign='center'><b>{boothId}</b></Table.Cell>
      <Table.Cell>{vendor}</Table.Cell>
      <Table.Cell><Visitation visitStatus={visit}/></Table.Cell>
      <Table.Cell><NumericalProgress completed={this.nbAnsweredQuestions(questions)} total={questions.length}/></Table.Cell>
      <Table.Cell><NumericalProgress completed={this.nbSubmitted(powerBuys)} total={powerBuys.length}/></Table.Cell>
      <Table.Cell><NumericalProgress completed={this.nbSubmitted(profitCenters)} total={profitCenters.length}/></Table.Cell>
      <Table.Cell><OpenStock formStatus={openStockForm}/></Table.Cell>
    </Table.Row>;
  }

  private nbAnsweredQuestions(questions: IQuestionAnswer[]): number {
    let nbAnswered = 0;
    questions.forEach((x) => {
      if (x.answer) {
        ++nbAnswered;
      }
    });
    return nbAnswered;
  }

  private nbSubmitted(submittables: ISubmittableItem[]): number {
    let nbSubmitted = 0;
    submittables.forEach((x) => {
      if (x.submitted) {
        ++nbSubmitted;
      }
    });
    return nbSubmitted;
  }
}

/*
      boothId: 196,
      vendor: 'Foo',
      visit: VendorVisit.NOT_VISITED,
      questions: [],
      powerBuys: [],
      profitCenters: [],
      openStockForm: OpenStockForm.DO_NOT_GET
*/
