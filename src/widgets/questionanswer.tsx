import React from 'react';
import { SyntheticEvent } from 'react';
import { Button, Form, Icon, TextArea, TextAreaProps } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

interface QuestionAnswerProps {
  questionId: number;
  showStore?: any;
};

interface QuestionAnswerState {
  editingQuestion: boolean;
  editingAnswer: boolean;
  newQuestionText: string|undefined;
  newAnswerText: string|undefined;
};

/*
 * QuestionAnswer Component:
 *
 * Displays the current question and answer text for an IQuestionAnswer item in the database. The
 * fields can be edited using the associated edit button and saved with the same button. An
 * IQuestionAnswer item may also be deleted with the included delete button.
 */
@inject('showStore') @observer
export default class QuestionAnswer extends React.Component<QuestionAnswerProps,
                                                            QuestionAnswerState> {
  constructor(props: QuestionAnswerProps, state: QuestionAnswerState) {
    super(props, state);
    this.state = {
      editingQuestion: false,
      editingAnswer: false,
      newQuestionText: undefined,
      newAnswerText: undefined,
    };
  }

  render() {
    const { questionId, showStore } = this.props;
    const { editingAnswer, editingQuestion } = this.state;

    const { question, answer } = showStore.vendorQuestions[questionId];

    const outerClass = answer !== undefined ?
                       'BCIquestionanswerflex' :
                       'BCIquestionanswerflex unanswered';
    const questionBtnColor = editingQuestion ? 'blue' : answer !== undefined ? 'green' : 'red';
    const answerBtnColor = editingAnswer ? 'blue' : answer !== undefined ? 'green' : 'red';
    const questionIcon = editingQuestion ? 'save' : 'question';
    const answerIcon = editingAnswer ?
                       'save' :
                       answer !== undefined ?
                         'check' :
                         'arrow alternate circle right';

    return <div className={outerClass}>
        <div className='BCIindividualquestion'>
          <Button basic icon
                  color={questionBtnColor}
                  className='BCIquestionanswerbtn'
                  onClick={this.toggleQuestionEdit}>
            <Icon name={questionIcon}/>
          </Button>
          {
            (!editingQuestion) ?
            <div className='BCIquestionanswerform'>{question}</div> :
            <Form className='BCIquestionanswerform'>
              <TextArea rows={2}
                        className='BCIquestionanswerinput'
                        value={this.state.newQuestionText}
                        onChange={this.updatedQuestionText} />
            </Form>
          }
          <Button basic icon
                  className='BCIquestiondeletebtn'
                  color='red'
                  onClick={this.deleteQuestion}>
            <Icon name='trash alternate outline'/>
          </Button>
        </div>
        <div className='BCIindividualquestion'>
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
        </div>
      </div>;
  }

  private toggleQuestionEdit = () => {
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

  private toggleAnswerEdit = () => {
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

  private updatedQuestionText = (e: SyntheticEvent, data: TextAreaProps) => {
    this.setState({ newQuestionText: data.value as string });
  }

  private updatedAnswerText = (e: SyntheticEvent, data: TextAreaProps) => {
    this.setState({ newAnswerText: data.value as string });
  }

  private deleteQuestion = () => {
    this.props.showStore.removeQuestion(this.props.questionId);
  }
}
