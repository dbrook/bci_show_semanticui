import React from 'react';
import { SyntheticEvent } from 'react';
import {
  Button,
  Label,
  Icon,
  SemanticCOLORS,
  SemanticICONS,
  TextArea,
  TextAreaProps
} from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm } from  '../types/enums';

interface OpenStockProps {
  formStatus: OpenStockForm;
  name: string;
  boothNum: string;
  itmIdx: number;
  showStore?: any;
};

interface OpenStockState {
  editing: boolean;
  newName: string;
};

/*
 * OpenStock Component:
 *
 * Shows current open stock form status as well as action buttons for proceding to the next step and
 * the ability to abandon a form after initially retrieving one, displays with a label indicating
 * the sub-vendor (as some vendors have multiple sub-brands in the BCI database).
 */
@inject('showStore') @observer
export default class OpenStock extends React.Component<OpenStockProps, OpenStockState> {
  constructor(props: OpenStockProps, state: OpenStockState) {
    super(props, state);
    this.state = {
      editing: false,
      newName: props.name,
    };
  }

  render() {
    const { formStatus, name } = this.props;
    const { editing, newName } = this.state;

    let currentStateStr: string;
    let nextColor: SemanticCOLORS;
    let nextIcon: SemanticICONS;
    let deleteBtnFinal: boolean;
    let advanceBtnDisable: boolean = false;
    let mainProps = {};

    switch (formStatus) {
    case OpenStockForm.PICK_UP:
      mainProps = { color: 'orange' };
      currentStateStr = 'Retrieve';
      nextColor = 'purple';
      nextIcon = 'handshake outline';
      deleteBtnFinal = false;
      break;
    case OpenStockForm.RETRIEVED:
      mainProps = { color: 'purple' };
      currentStateStr = 'Retrieved';
      nextColor = 'blue';
      nextIcon = 'edit';
      deleteBtnFinal = false;
      break;
    case OpenStockForm.FILLED_IN:
      mainProps = { color: 'blue' };
      currentStateStr = 'Filled-In';
      nextColor = 'green';
      nextIcon = 'checkmark';
      deleteBtnFinal = false;
      break;
    case OpenStockForm.SUBMITTED:
      mainProps = { color: 'green' };
      currentStateStr = 'Submitted';
      nextColor = 'black';
      nextIcon = 'undo';
      deleteBtnFinal = false;
      break;
    case OpenStockForm.ABANDONED:
      mainProps = { color: 'red', basic: true };
      currentStateStr = 'Discarded';
      nextColor = 'black';
      nextIcon = 'undo';
      deleteBtnFinal = true;
      break;
    default:
      mainProps = { basic: true };
      currentStateStr = 'None';
      nextColor = 'orange';
      nextIcon = 'file';
      deleteBtnFinal = true;
    };

    if (editing) {
      advanceBtnDisable = true;
    }

    const deleteBtn = <Button icon color='red' basic={!deleteBtnFinal} onClick={this.abandonButtonAction}>
        <Icon name='trash alternate outline'/>
      </Button>;

    const editBtnIcon = editing ? 'save' : 'pencil alternate';

    let button = <div className='BCIopenstockmobilegroup'>
          <Label {...mainProps} size='large' className='BCIlabeledopenstock'>
            {currentStateStr}
          </Label>
          <Button.Group>
            <Button icon basic color={nextColor} disabled={advanceBtnDisable} onClick={this.advanceButtonAction}>
              <Icon name={nextIcon}/>
            </Button>
            {deleteBtn}
            <Button basic icon color='blue' onClick={this.toggleEdit}>
              <Icon name={editBtnIcon} />
            </Button>
          </Button.Group>
          {(!editing)
            ? name
            : <TextArea rows={2}
                className='BCIquestionanswerinput'
                value={newName}
                onChange={this.updatedName} />
          }
        </div>;

    return button;
  }

  private advanceButtonAction = () => {
    this.props.showStore.advanceOpenStockStatus(this.props.boothNum, this.props.itmIdx);
  }

  private abandonButtonAction = () => {
    if (this.props.formStatus === OpenStockForm.ABANDONED) {
      this.props.showStore.deleteOpenStock(this.props.boothNum, this.props.itmIdx);
    } else {
      this.props.showStore.abandonOpenStock(this.props.boothNum, this.props.itmIdx);
    }
  }

  private toggleEdit = () => {
    if (this.state.editing) {
      this.props.showStore.renameOpenStock(this.props.boothNum, this.props.itmIdx, this.state.newName);
      this.setState({
        editing: !this.state.editing,
        newName: "",
      });
    } else {
      this.setState({
        editing: !this.state.editing,
        newName: this.props.name,
      });
    }
  }

  private updatedName = (e: SyntheticEvent, data: TextAreaProps) => {
    this.setState({ newName: data.value as string });
  }
}
