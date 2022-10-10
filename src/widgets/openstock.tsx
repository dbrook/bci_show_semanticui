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
          <Button color='violet' style={buttonStyle}>Pick Up</Button>
          <Button.Group>
            <Button icon basic color='pink'>
                <Icon name='download'/>
            </Button>
            <Button icon basic color='red'>
                <Icon name='trash alternate outline'/>
            </Button>
          </Button.Group>
        </>;
      break;
    case OpenStockForm.RETRIEVED:
      button = <>
          <Button color='pink' style={buttonStyle}>Retrieved</Button>
          <Button.Group>
          <Button icon basic color='blue'>
            <Icon name='pencil alternate'/>
          </Button>
          <Button icon basic color='red'>
            <Icon name='trash alternate outline'/>
          </Button>
          </Button.Group>
        </>;
      break;
    case OpenStockForm.FILLED_IN:
      button = <>
          <Button color='blue' style={buttonStyle}>Filled-In</Button>
          <Button.Group>
            <Button icon basic color='green'>
              <Icon name='upload'/>
            </Button>
            <Button icon basic color='red'>
              <Icon name='trash alternate outline'/>
            </Button>
          </Button.Group>
        </>;
      break;
    case OpenStockForm.SUBMITTED:
      button = <>
          <Button color='green' style={buttonStyle}>Submitted</Button>
          <Button.Group>
            <Button icon basic color='violet'>
              <Icon name='undo'/>
            </Button>
            <Button disabled icon basic color='red'>
              <Icon name='trash alternate outline'/>
            </Button>
          </Button.Group>
        </>;
      break;
    case OpenStockForm.ABANDONED:
      button = <>
          <Button basic color='red' style={buttonStyle}>Abandoned</Button>
          <Button.Group>
            <Button icon basic color='violet'>
              <Icon name='undo'/>
            </Button>
            <Button disabled icon basic color='red'>
              <Icon name='trash alternate outline'/>
            </Button>
          </Button.Group>
        </>;
      break;
    case OpenStockForm.DO_NOT_GET:
    default:
      button = <>
          <Button basic style={buttonStyle}>None</Button>
          <Button.Group>
            <Button icon basic color='violet'>
              <Icon name='play'/>
            </Button>
            <Button disabled icon basic color='red'>
              <Icon name='trash alternate outline'/>
            </Button>
          </Button.Group>
        </>;
    };

    return button;
  }
}
