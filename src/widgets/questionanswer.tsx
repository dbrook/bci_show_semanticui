import React from 'react';
import { Button, Form, Icon, TextArea } from 'semantic-ui-react';

interface QuestionAnswerProps {
  question: string,
  answer?: string,
};

interface QuestionAnswerState {
  editingQuestion: boolean,
  editingAnswer: boolean,
};

export default class QuestionAnswer extends React.Component<QuestionAnswerProps, QuestionAnswerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      editingQuestion: false,
      editingAnswer: false,
    };
    this.toggleQuestionEdit = this.toggleQuestionEdit.bind(this);
    this.toggleAnswerEdit = this.toggleAnswerEdit.bind(this);
  }

  render() {
    const { question, answer } = this.props;
    const { editingAnswer, editingQuestion } = this.state;

    const outerClass = answer !== '' ? 'BCIquestionanswerflex' : 'BCIquestionanswerflex unanswered';
    const questionBtnColor = editingQuestion ? 'blue' : answer !== '' ? 'green' : 'red';
    const answerBtnColor = editingAnswer ? 'blue' : answer !== '' ? 'green' : 'red';
    const questionIcon = editingQuestion ? 'save' : 'question';
    const answerIcon = editingAnswer ? 'save' : answer !== '' ? 'check' : 'arrow alternate circle right';

    return <div className={outerClass}>
        <p className='BCIindividualquestion'>
          <Button basic icon color={questionBtnColor} className='BCIquestionanswerbtn' onClick={this.toggleQuestionEdit}>
            <Icon name={questionIcon}/>
          </Button>
          {
            (!editingQuestion) ? question :
            <Form className='BCIquestionanswerform'>
              <TextArea rows={2} className='BCIquestionanswerinput'>
                {question}
              </TextArea>
            </Form>
          }
        </p>
        <p className='BCIindividualquestion'>
          <Button basic icon color={answerBtnColor} className='BCIquestionanswerbtn' onClick={this.toggleAnswerEdit}>
            <Icon name={answerIcon}/>
          </Button>
          {
            (!editingAnswer) ? answer :
            <Form className='BCIquestionanswerform'>
              <TextArea rows={2} className='BCIquestionanswerinput'>
                {answer}
              </TextArea>
            </Form>
          }
        </p>
      </div>;
  }

  private toggleQuestionEdit() {
    // FIXME: This should eventually handle saving the data when leaving edit mode
    this.setState({ editingQuestion: !this.state.editingQuestion });
  }

  private toggleAnswerEdit() {
    // FIXME: This should eventually handle saving the data when leaving edit mode
    this.setState({ editingAnswer: !this.state.editingAnswer });
  }
}
