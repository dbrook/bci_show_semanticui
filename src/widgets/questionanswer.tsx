import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

interface QuestionAnswerProps {
  question: string,
  answer?: string,
};

export default class QuestionAnswer extends React.Component<QuestionAnswerProps> {
  render() {
    const { question, answer } = this.props;

    const outerClass = answer !== '' ? 'BCIquestionanswerflex' : 'BCIquestionanswerflex unanswered';
    const btnColor = answer !== '' ? 'green' : 'red';
    const answerIcon = answer !== '' ? 'check' : 'arrow alternate circle right';
    return <div className={outerClass}>
        <p className='BCIindividualquestion'>
          <Button basic icon color={btnColor} className='BCIquestionanswerbtn'><Icon name='question'/></Button>
          {question}
        </p>
        <p className='BCIindividualquestion'>
          <Button basic icon color={btnColor} className='BCIquestionanswerbtn'><Icon name={answerIcon}/></Button>
          {answer}
        </p>
      </div>;
  }
}
