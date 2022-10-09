import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { OpenStockForm } from  '../types/enums';

interface OpenStockProps {
  formStatus: OpenStockForm,
};

export default class OpenStock extends React.Component<OpenStockProps> {
  render() {
    const buttonStyle = {
      width: '9em',
    };

    let button;
    switch (this.props.formStatus) {
    case OpenStockForm.PICK_UP:
      button = <>
          <Button color='red' style={buttonStyle}>Pick Up</Button>
          <Button icon basic color='green'>
            <Icon name='play'/>
          </Button>
          <Button icon basic color='red'>
            <Icon name='trash alternate outline'/>
          </Button>
        </>;
      break;
    case OpenStockForm.RETRIEVED:
      button = <>
          <Button color='pink' style={buttonStyle}>Retrieved</Button>
          <Button icon basic color='green'>
            <Icon name='play'/>
          </Button>
          <Button icon basic color='red'>
            <Icon name='trash alternate outline'/>
          </Button>
        </>;
      break;
    case OpenStockForm.FILLED_IN:
      button = <>
          <Button color='blue' style={buttonStyle}>Filled-In</Button>
          <Button icon basic color='green'>
            <Icon name='play'/>
          </Button>
          <Button icon basic color='red'>
            <Icon name='trash alternate outline'/>
          </Button>
        </>;
      break;
    case OpenStockForm.SUBMITTED:
      button = <>
          <Button color='green' style={buttonStyle}>Submitted</Button>
          <Button icon basic color='purple'>
            <Icon name='undo'/>
          </Button>
          <Button disabled icon basic color='red'>
            <Icon name='trash alternate outline'/>
          </Button>
        </>;
      break;
    case OpenStockForm.DO_NOT_GET:
    default:
      button = <>
          <Button basic style={buttonStyle}>None</Button>
          <Button disabled icon basic color='green'>
            <Icon name='play'/>
          </Button>
          <Button disabled icon basic color='red'>
            <Icon name='trash alternate outline'/>
          </Button>
        </>;
    };

    return button;
  }
}


/*
  DO_NOT_GET = 0,
  PICK_UP = 1,
  RETRIEVED = 2,
  FILLED_IN = 3,
  SUBMITTED = 4,
*/
