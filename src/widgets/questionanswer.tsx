import React from 'react';
import { Button, Form, Icon, TextArea } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

interface QuestionAnswerProps {
  questionId: number;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

interface QuestionAnswerState {
  editingQuestion: boolean;
  editingAnswer: boolean;
  newQuestionText: string|undefined;
  newAnswerText: string|undefined;
};

@inject('showStore') @observer
export default class QuestionAnswer extends React.Component<QuestionAnswerProps, QuestionAnswerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      editingQuestion: false,
      editingAnswer: false,
      newQuestionText: undefined,
      newAnswerText: undefined,
    };
    this.toggleQuestionEdit = this.toggleQuestionEdit.bind(this);
    this.toggleAnswerEdit = this.toggleAnswerEdit.bind(this);
    this.updatedQuestionText = this.updatedQuestionText.bind(this);
    this.updatedAnswerText = this.updatedAnswerText.bind(this);
  }

  render() {
    const { questionId, showStore } = this.props;
    const { editingAnswer, editingQuestion } = this.state;

    const { question, answer } = showStore.vendorQuestions[questionId];

    const outerClass = answer !== undefined ? 'BCIquestionanswerflex' : 'BCIquestionanswerflex unanswered';
    const questionBtnColor = editingQuestion ? 'blue' : answer !== undefined ? 'green' : 'red';
    const answerBtnColor = editingAnswer ? 'blue' : answer !== undefined ? 'green' : 'red';
    const questionIcon = editingQuestion ? 'save' : 'question';
    const answerIcon = editingAnswer ? 'save' : answer !== undefined ? 'check' : 'arrow alternate circle right';

    return <div className={outerClass}>
        <p className='BCIindividualquestion'>
          <Button basic icon
                  color={questionBtnColor}
                  className='BCIquestionanswerbtn'
                  onClick={this.toggleQuestionEdit}>
            <Icon name={questionIcon}/>
          </Button>
          {
            (!editingQuestion) ? question :
            <Form className='BCIquestionanswerform'>
              <TextArea rows={2}
                        className='BCIquestionanswerinput'
                        value={this.state.newQuestionText}
                        onChange={this.updatedQuestionText} />
            </Form>
          }
        </p>
        <p className='BCIindividualquestion'>
          <Button basic icon
                  color={answerBtnColor}
                  className='BCIquestionanswerbtn'
                  onClick={this.toggleAnswerEdit}>
            <Icon name={answerIcon}/>
          </Button>
          {
            (!editingAnswer) ? answer :
            <Form className='BCIquestionanswerform'>
              <TextArea rows={2}
                        className='BCIquestionanswerinput'
                        value={this.state.newAnswerText}
                        onChange={this.updatedAnswerText} />
            </Form>
          }
        </p>
      </div>;
  }

  private toggleQuestionEdit() {
    if (this.state.editingQuestion) {
      this.props.showStore.changeQuestion(this.props.questionId, this.state.newQuestionText);
      this.setState({
        editingQuestion: !this.state.editingQuestion,
        newQuestionText: undefined,
      });
    } else {
      this.setState({
        editingQuestion: !this.state.editingQuestion,
        newQuestionText: this.props.showStore.vendorQuestions[this.props.questionId].question,
      });
    }
  }

  private toggleAnswerEdit() {
    if (this.state.editingAnswer) {
      this.props.showStore.answerQuestion(this.props.questionId, this.state.newAnswerText);
      this.setState({
        editingAnswer: !this.state.editingAnswer,
        newAnswerText: undefined,
      });
    } else {
      this.setState({
        editingAnswer: !this.state.editingAnswer,
        newAnswerText: this.props.showStore.vendorQuestions[this.props.questionId].answer ?? '',
      });
    }
  }

  private updatedQuestionText(e: any, data: any) {
    this.setState({ newQuestionText: e.target.value });
  }

  private updatedAnswerText(e: any, data: any) {
    this.setState({ newAnswerText: e.target.value });
  }
}
