import React from 'react';
import { Button, Label, Icon, SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import { OpenStockForm } from  '../types/enums';

interface OpenStockProps {
  formStatus: OpenStockForm,
  labeled: boolean,
};

export default class OpenStock extends React.Component<OpenStockProps> {
  render() {
    const { formStatus, labeled } = this.props;

    let currentStateStr: string;
    let nextColor: SemanticCOLORS;
    let nextIcon: SemanticICONS;
    let deleteBtnDisable: boolean;
    let mainProps = {};

    let button;

    switch (formStatus) {
    case OpenStockForm.PICK_UP:
      mainProps = { color: 'violet' };
      currentStateStr = 'Pick Up';
      nextColor = 'pink';
      nextIcon = 'download';
      deleteBtnDisable = false;
      break;
    case OpenStockForm.RETRIEVED:
      mainProps = { color: 'pink' };
      currentStateStr = 'Retrieved';
      nextColor = 'blue';
      nextIcon = 'pencil alternate';
      deleteBtnDisable = false;
      break;
    case OpenStockForm.FILLED_IN:
      mainProps = { color: 'blue' };
      currentStateStr = 'Filled-In';
      nextColor = 'green';
      nextIcon = 'upload';
      deleteBtnDisable = false;
      break;
    case OpenStockForm.SUBMITTED:
      mainProps = { color: 'green' };
      currentStateStr = 'Submitted';
      nextColor = 'violet';
      nextIcon = 'undo';
      deleteBtnDisable = true;
      break;
    case OpenStockForm.ABANDONED:
      mainProps = { color: 'red', basic: true };
      currentStateStr = 'Abandoned';
      nextColor = 'violet';
      nextIcon = 'undo';
      deleteBtnDisable = true;
      break;
    case OpenStockForm.DO_NOT_GET:
    default:
      mainProps = { basic: true };
      currentStateStr = 'None';
      nextColor = 'violet';
      nextIcon = 'play';
      deleteBtnDisable = true;
    };

    const deleteBtn = !deleteBtnDisable ?
      <Button icon basic color='red'><Icon name='trash alternate outline'/></Button> :
      <Button disabled icon basic color='red'><Icon name='trash alternate outline'/></Button>;

    if (labeled) {
      const labelStyle = {
        justifyContent: 'center',  // Items are secretyly flexbox under the hood!
        width: '7em',
      };
      const buttonStyle = {
        width: '4.5em',
      };

      button = <div>
          <Button as='div' labelPosition='right'>
            <Button {...mainProps} style={buttonStyle}>OS</Button>
            <Label {...mainProps} style={labelStyle} as='a' basic pointing='left'>{currentStateStr}</Label>
          </Button>
          <Button.Group>
            <Button icon basic color={nextColor}>
              <Icon name={nextIcon}/>
            </Button>
            {deleteBtn}
          </Button.Group>
        </div>;
    } else {
      const buttonStyle = {
        width: '9em',
      };

      button = <div>
          <Button {...mainProps} style={buttonStyle}>{currentStateStr}</Button>
          <Button.Group>
            <Button icon basic color={nextColor}>
              <Icon name={nextIcon}/>
            </Button>
            {deleteBtn}
          </Button.Group>
        </div>;
    }

    return button;
  }
}

/*
<Button as='div' labelPosition='right'>
  <Button color={color}>{label}</Button>
  <Label as='a' basic color={color} pointing='left'>{progress}</Label>
</Button>
*/
