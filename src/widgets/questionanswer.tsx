import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

interface QuestionAnswerProps {
  question: string,
  answer?: string,
};

export default class QuestionAnswer extends React.Component<QuestionAnswerProps> {
  render() {
    const { question, answer } = this.props;

    if (!answer) {
      // No answer for the question, print question + a button to answer
      return <div className='BCIquestionanswerflex unanswered'>
          <p className='BCIindividualquestion'><div className='BCIquestionanswerlabel unanswered'>?</div>{question}</p>
          <Button basic labelPosition='left' icon primary><Icon name='check'/>Add Answer</Button>
        </div>;
    } else {
      // Question is answered / accepted
      return <div className='BCIquestionanswerflex'>
          <p className='BCIindividualquestion'><div className='BCIquestionanswerlabel'>?</div>{question}</p>
          <p className='BCIindividualquestion'><div className='BCIquestionanswerlabel'>&gt;</div>{answer}</p>
        </div>;
    }
  }
}
