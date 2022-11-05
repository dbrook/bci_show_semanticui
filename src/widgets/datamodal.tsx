import React from 'react';

import { Button, Dropdown, DropdownItemProps, Form, Message, Modal } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

interface DataModalProps {
  open: boolean,
  closeHander: (arg0: boolean) => any;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

interface DataModalState {
  selectedShow: string|undefined;
  availableShows: DropdownItemProps[];
};

@inject('showStore') @observer
export default class DataModal extends React.Component<DataModalProps, DataModalState> {
  constructor(props: DataModalProps, state: DataModalState) {
    super(props, state);

    this.state = {
      selectedShow: undefined,
      availableShows: [],
    };
  }

  render() {
    const { open, closeHander, showStore: { tradeShowId } } = this.props;

    return (
      <Modal open={open} onMount={this.requestLoadAvailableShows}>
        <Modal.Header>Load New Trade Show Vendor Data</Modal.Header>
        <Modal.Content>
          <Message warning>
            <Message.Header>Data Loss Warning</Message.Header>
            <p>
              Loading a new Trade Show data set will erase any current data installed in your
              browser! If you have data from a previous show you would like to save, click
              the <b>Close</b> button below and use the Data menu to save the existing data.
            </p>
          </Message>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Currently-loaded Show Data:</label>{tradeShowId ?? 'None'}
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Trade Show Year/Season to Load</label>
                <Dropdown selection
                          options={this.state.availableShows}
                          defaultValue={tradeShowId}
                          onChange={this.newShowSelected} />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='green' onClick={this.loadSelectedShow}>Load</Button>
          <Button basic color='grey' onClick={() => closeHander(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private requestLoadAvailableShows = (e: any, data: any) => {
    // FIXME: for some reason this gets called 2x when the modal is opened?
    this.props.showStore.loadAvailableShows().then((shows: string[]) => {
      const tempAvailableShows = shows.map((showItem, index) => {
        return {key: index, text: showItem, value: showItem};
      });
      this.setState({ availableShows: tempAvailableShows });
    });
  };

  private newShowSelected = (e: any, data: any) => {
    this.setState({ selectedShow: data.value });
  };

  private loadSelectedShow = (e: any, data: any) => {
    this.props.showStore.setCurrentShow(this.state.selectedShow);
    this.props.showStore.loadShowData();
    this.props.closeHander(false);
  };
}
