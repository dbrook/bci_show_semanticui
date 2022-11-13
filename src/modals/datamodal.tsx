import React from 'react';
import { ChangeEvent } from 'react';

import { Button, Divider, Dropdown, DropdownItemProps, Form, Message, Modal, Tab } from 'semantic-ui-react';

import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import { DataLoad } from '../types/enums';
import { DataBackup } from '../types/interfaces';

interface DataModalProps {
  open: boolean,
  closeHander: (arg0: boolean) => any;
//   showStore?: TradeShowData;
  showStore?: any;  // Workaround for now ... FIXME: How to use a type?
};

interface DataModalState {
  selectedShow: string|undefined;
  availableShows: DropdownItemProps[];
  remoteVendorLoad: DataLoad;
  exportJson: Blob|undefined;
  importingFile: boolean;
  errorImportingFile: boolean;
  clearerOpen: boolean;
};

@inject('showStore') @observer
export default class DataModal extends React.Component<DataModalProps, DataModalState> {
  constructor(props: DataModalProps, state: DataModalState) {
    super(props, state);

    this.state = {
      selectedShow: undefined,
      availableShows: [],
      remoteVendorLoad: DataLoad.NONE,
      exportJson: undefined,
      importingFile: false,
      errorImportingFile: false,
      clearerOpen: false,
    };
  }

  render() {
    const {
      open,
      closeHander,
      showStore: {
        tradeShowId,
        nbVendorActions,
        nbQuestions,
        nbPowerBuys,
        nbProfitCenters,
      },
    } = this.props;
    const { selectedShow, remoteVendorLoad, exportJson, importingFile, clearerOpen } = this.state;

    let vendorDataButtons = <>
        <Button color='purple'
                disabled={selectedShow === undefined ||
                          tradeShowId === selectedShow ||
                          remoteVendorLoad === DataLoad.FAILURE}
                onClick={this.loadSelectedShow}>
          Load
        </Button>
        <Button color='red' onClick={this.eraseSelectedShow}>Erase</Button>
        <Button primary onClick={this.requestLoadAvailableShows}>Reload List</Button>
      </>;

    let dataDropdown;
    switch (remoteVendorLoad) {
      case DataLoad.NONE:
        dataDropdown = <Message info>Waiting for data</Message>;
        break;
      case DataLoad.SUCCESS:
        dataDropdown = <Form>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Select Trade Show Vendor Data to Load:</label>
                <Dropdown selection
                          options={this.state.availableShows}
                          placeholder='Available shows in this drop-down'
                          defaultValue={selectedShow ?? tradeShowId}
                          onChange={this.newShowSelected} />
              </Form.Field>
            </Form.Group>
            {vendorDataButtons}
          </Form>
        break;
      case DataLoad.FAILURE:
        dataDropdown = <>
            <Message error>
              Unable to retrieve Vendor Data. Check your network connection.
            </Message>
            {vendorDataButtons}
          </>;
        break;
    }

    const showDataTab = <Tab.Pane>
        {dataDropdown}
        <Message warning>
          <Message.Header>Data Loss Warning!</Message.Header>
          <p>
            This application keeps all progress tracking data on your device.
            <b> None of your data is uploaded or backed-up anywhere</b>.
          </p>
          <p>
            <b>Changing the Vendor Data will erase this local device storage</b>.
            If you wish to save your existing data, you should switch to the
            On-Device Data tab and export it to save it first.
          </p>
        </Message>
      </Tab.Pane>;

    const downloader = exportJson ? <>
      <p>Export of local data created, click to download:</p>
      <a download={`${tradeShowId}.json`} href={URL.createObjectURL(exportJson)}>
        {`${tradeShowId}.json`}
      </a></> : null;

    const importer = importingFile ? <>
        <p>WARNING: Importing a file will overwrite all existing data!</p>
        <input type='file' onChange={this.processImportFile} accept='text/json' />
      </> : null;

    const clearer = clearerOpen ? <>
        <p>To erase your local progress data, press 'Clear...' again</p>
      </> : null;

    const localDataTab = <Tab.Pane>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <p>Vendors with Actions: <b>{nbVendorActions()}</b></p>
              <p>Number of Questions: <b>{nbQuestions}</b></p>
              <p>Number of Power Buys: <b>{nbPowerBuys}</b></p>
              <p>Number of Profit Centers: <b>{nbProfitCenters}</b></p>
            </Form.Field>
          </Form.Group>
          <Divider />
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Local Show Data Actions</label>
              <Form.Field className='BCIvendorquickactions'>
                <Button basic color='blue' onClick={this.exportData}>Export...</Button>
                <Button basic color='pink' onClick={this.openImporter}>Import...</Button>
                <Button basic={!clearerOpen}
                        color='red'
                        onClick={clearerOpen ? this.reallyClear : this.openClearer}>
                  Clear...
                </Button>
              </Form.Field>
              <Form.Field>
                {downloader}
                {importer}
                {clearer}
              </Form.Field>
            </Form.Field>
          </Form.Group>
        </Form>
      </Tab.Pane>;

    const dataPanes = [
      {menuItem: 'Vendor Data', render: () => showDataTab},
      {menuItem: 'On-Device Data', render: () => localDataTab},
    ];

    // FIXME: do something on dismount to clear the existing save data?
    return (
      <Modal open={open}
             centered={false}
             onMount={this.requestLoadAvailableShows}
             onUnmount={this.clearLocalState}>
        <Modal.Header>Data Management</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Currently-loaded Trade Show Vendor Data:</label>{tradeShowId ?? 'None'}
              </Form.Field>
            </Form.Group>
          </Form>
          <Tab panes={dataPanes} />
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='grey' onClick={() => closeHander(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private clearLocalState = () => {
    this.setState({
      selectedShow: undefined,
      availableShows: [],
      remoteVendorLoad: DataLoad.NONE,
      exportJson: undefined,
      importingFile: false,
      errorImportingFile: false,
      clearerOpen: false,
    });
  };

  private requestLoadAvailableShows = (e: any, data: any) => {
    // FIXME: for some reason this gets called 2x when the modal is opened?
    this.props.showStore.loadAvailableShows().then((shows: string[]) => {
      const tempAvailableShows = shows.map((showItem, index) => {
        return {key: index, text: showItem, value: showItem};
      });
      this.setState({
        availableShows: tempAvailableShows,
        remoteVendorLoad: DataLoad.SUCCESS,
      });
    }).catch((exception: any) => {
      this.setState({
        availableShows: [],
        remoteVendorLoad: DataLoad.FAILURE,
      });
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

  private eraseSelectedShow = (e: any, data: any) => {
    this.props.showStore.setCurrentShow(undefined);
    this.props.closeHander(false);
  };

  private openImporter = (e: any, data: any) => {
    this.setState({
      importingFile: true,
      exportJson: undefined,
      errorImportingFile: false,
      clearerOpen: false,
    });
  };

  private processImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    //@ts-ignore
    const file: File = e.target.files[0];
    const inFile: FileReader = new FileReader();
    inFile.readAsDataURL(file);
    inFile.onload = () => {
      file.text().then((inputText: string) => {
        try {
          const inputObj: DataBackup = JSON.parse(inputText);
          this.props.showStore.eraseAndImportData(inputObj);
          console.log(inputObj);
        } catch (e) {
          console.error('Failed to parse imported JSON file', e);
          // FIXME: purge all local data anyway?
          this.setState({
            errorImportingFile: true,
          });
        }
      });
    };
  };

  private exportData = (e: any, data: any) => {
    const {
      tradeShowId,
      boothVendors,
      vendorsWithActions,
      vendorQuestions,
      powerBuys,
      profitCenters,
    } = this.props.showStore;

    const backupObj: DataBackup = {
      tradeShowId: tradeShowId,
      boothVendors: Object.fromEntries(toJS(boothVendors)),
      vendorsWithActions: Object.fromEntries(toJS(vendorsWithActions)),
      vendorQuestions: toJS(vendorQuestions),
      powerBuys: toJS(powerBuys),
      profitCenters: toJS(profitCenters),
    };

    this.setState({
      exportJson: new Blob([JSON.stringify(backupObj, null, 2)], { type: 'text/json' }),
      importingFile: false,
      errorImportingFile: false,
      clearerOpen: false,
    });
  };

  private openClearer = (e: any, data: any) => {
    this.setState({
      exportJson: undefined,
      importingFile: false,
      errorImportingFile: false,
      clearerOpen: true,
    });
  };

  private reallyClear = (e: any, data: any) => {
    this.props.showStore.setCurrentShow(this.props.showStore.tradeShowId);
    this.props.showStore.loadShowData();
    this.props.closeHander(false);
  };
}
