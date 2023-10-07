import React from 'react';
import { Button, Label, Icon, SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm } from  '../types/enums';

interface OpenStockProps {
  formStatus: OpenStockForm;
  labeled: boolean;
  boothId: string;
  showStore?: any;
};

/*
 * OpenStock Component:
 *
 * Shows current open stock form status as well as action buttons for proceding to the next step and
 * the ability to abandon a form after initially retrieving one.
 */
@inject('showStore') @observer
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
      mainProps = { color: 'orange' };
      currentStateStr = 'Pick Up';
      nextColor = 'purple';
      nextIcon = 'download';
      deleteBtnDisable = false;
      break;
    case OpenStockForm.RETRIEVED:
      mainProps = { color: 'purple' };
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
      nextColor = 'black';
      nextIcon = 'undo';
      deleteBtnDisable = true;
      break;
    case OpenStockForm.ABANDONED:
      mainProps = { color: 'red', basic: true };
      currentStateStr = 'Abandoned';
      nextColor = 'black';
      nextIcon = 'undo';
      deleteBtnDisable = true;
      break;
    default:
      mainProps = { basic: true };
      currentStateStr = 'None';
      nextColor = 'orange';
      nextIcon = 'file';
      deleteBtnDisable = true;
    };

    const deleteBtn = !deleteBtnDisable ?
      <Button icon basic color='red' onClick={this.abandonButtonAction}>
        <Icon name='trash alternate outline'/>
      </Button> :
      <Button disabled icon basic color='red'><Icon name='trash alternate outline'/></Button>;

    if (labeled) {
      button = <div className='BCIopenstockmobilegroup'>
          <Label size='large' {...mainProps}>
            OS
            <Label.Detail className='BCIunlabeledopenstock'>{currentStateStr}</Label.Detail>
          </Label>
          <Button.Group>
            <Button icon basic color={nextColor} onClick={this.advanceButtonAction}>
              <Icon name={nextIcon}/>
            </Button>
            {deleteBtn}
          </Button.Group>
        </div>;
    } else {
      button = <div>
          <Label {...mainProps} size='large' className='BCIlabeledopenstock'>
            {currentStateStr}
          </Label>
          <Button.Group>
            <Button icon basic color={nextColor} onClick={this.advanceButtonAction}>
              <Icon name={nextIcon}/>
            </Button>
            {deleteBtn}
          </Button.Group>
        </div>;
    }

    return button;
  }

  private advanceButtonAction = () => {
    this.props.showStore.advanceOpenStockStatus(this.props.boothId);
  }

  private abandonButtonAction = () => {
    this.props.showStore.abandonOpenStock(this.props.boothId);
  }
}
