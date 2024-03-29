import React from 'react';
import { ChangeEvent, SyntheticEvent } from 'react';

import {
  Button,
  Divider,
  Dropdown,
  DropdownProps,
  DropdownItemProps,
  Form,
  Label,
  Message,
  Modal,
  Tab,
} from 'semantic-ui-react';

import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import { DataLoad } from '../types/enums';
import { DataBackup, VendorStatusBackup, IVendorStatus, ISubmittableQty } from '../types/interfaces';
import AboutPanel from '../widgets/aboutpanel';
import HelpPanel from '../widgets/helppanel';

interface DataModalProps {
  open: boolean,
  closeHander: (arg0: boolean) => any;
  showStore?: any;
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

/*
 * Data Management modal:
 *
 * Allows switching between trade shows, downloading new show(s) booth data, exporting/importing
 * data to/from JSON payloads (respectively), and contains an 'about this application' panel
 */
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
      },
    } = this.props;
    const { selectedShow, remoteVendorLoad, exportJson, importingFile, clearerOpen } = this.state;

    let vendorDataButtons = <div className='BCIvendorquickactions'>
        <Button color='purple'
                disabled={selectedShow === undefined ||
                          tradeShowId === selectedShow ||
                          remoteVendorLoad === DataLoad.FAILURE}
                onClick={this.loadSelectedShow}>
          Load Selected
        </Button>
        <Button primary onClick={this.requestLoadAvailableShows}>Reload Trade Show List</Button>
      </div>;

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
          <Message.Header>Data Storage and Privacy Notice</Message.Header>
          <p>
            This application stores all trade show data as well as your notes, questions,
            and all other items in your device's web browser storage. This data is not
            transmitted or uploaded anywhere, so clearing your browser's data may erase
            it. If you wish to backup your data or package it for use on another device,
            go to "On-Device Data" and choose "Export".
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
              <p>You have <b>{nbVendorActions()}</b> vendors with activity data stored on this device for trade show <b>{tradeShowId}</b>.</p>
            </Form.Field>
          </Form.Group>
          <Divider />
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Trade Show Local Data Actions:</label>
              <Form.Field className='BCIvendorquickactions'>
                <Button basic={!exportJson}
                        color='blue'
                        onClick={this.exportData}>
                  Backup or extract for import on another device (Export...)
                </Button>
                <Button basic={!importer}
                        color='pink'
                        onClick={this.openImporter}>
                  Load an export of data from a file you have (Import...)
                </Button>
                <Button basic={!clearerOpen}
                        color='red'
                        onClick={clearerOpen ? this.reallyClear : this.openClearer}>
                  Erase your local data but keep Trade Show data in place (Clear...)
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

    const aboutApp = <Tab.Pane>
        <AboutPanel />
      </Tab.Pane>;

    const help = <Tab.Pane>
        <HelpPanel />
      </Tab.Pane>;

    const dataPanes = [
      {menuItem: 'Shows', render: () => showDataTab},
      {menuItem: 'Your Data', render: () => localDataTab},
      {menuItem: 'Help', render: () => help},
      {menuItem: 'About', render: () => aboutApp},
    ];

    return (
      <Modal open={open}
             centered={false}
             onMount={this.requestLoadAvailableShows}
             onUnmount={this.clearLocalState}>
        <Modal.Header>BCI Trade Show - Dealer App</Modal.Header>
        <Modal.Content scrolling>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Currently-loaded Trade Show Vendor Data:</label>
                {tradeShowId !== undefined ?
                  <Button as='div' labelPosition='left'>
                    <Label basic>{tradeShowId}</Label>
                    <Button color='red' onClick={this.eraseSelectedShow}>
                      Erase All Show Data
                    </Button>
                  </Button> :
                  'None'
                }
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

  private requestLoadAvailableShows = () => {
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

  private newShowSelected = (e: SyntheticEvent, data: DropdownProps) => {
    this.setState({ selectedShow: data.value as string });
  };

  private loadSelectedShow = () => {
    this.props.showStore.setCurrentShow(this.state.selectedShow, false);
    this.props.showStore.loadShowData();
    this.props.closeHander(false);
  };

  private eraseSelectedShow = () => {
    this.props.showStore.deleteDatabase();
    this.props.showStore.setCurrentShow(undefined, true);
    this.props.closeHander(false);
  };

  private openImporter = () => {
    this.setState({
      importingFile: true,
      exportJson: undefined,
      errorImportingFile: false,
      clearerOpen: false,
    });
  };

  private processImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    const file: File = e.target.files[0];
    const inFile: FileReader = new FileReader();
    inFile.readAsDataURL(file);
    inFile.onload = () => {
      file.text().then((inputText: string) => {
        try {
          const inputObj: DataBackup = JSON.parse(inputText);
          this.props.showStore.eraseAndImportData(inputObj);
          this.props.closeHander(false);
        } catch (e) {
          console.error('Failed to parse imported JSON file', e);
          // FIXME: purge all local data anyway?
          this.setState({ errorImportingFile: true });
        }
      });
    };
  };

  private exportData = () => {
    const {
      tradeShowId,
      floorPlanWidthPx,
      floorPlanHeightPx,
      boothVendors,
      boothActivities,
      boothAdmins,
      vendorQuestions,
      vendorNotes,
    } = this.props.showStore;

    const backupObj: DataBackup = {
      tradeShowId: tradeShowId,
      width: floorPlanWidthPx,
      height: floorPlanHeightPx,
      admins: Object.fromEntries(toJS(boothAdmins)),
      activities: Object.fromEntries(toJS(boothActivities)),
      vendors: Object.fromEntries(toJS(boothVendors)),
      // vendorsWithActions is a complicated object so it needs to have its own handler
      vendorsWithActions: this.extractVendorsWithActions(),
      vendorQuestions: toJS(vendorQuestions),
      vendorNotes: toJS(vendorNotes),
    };

    this.setState({
      exportJson: new Blob([JSON.stringify(backupObj, null, 2)], { type: 'text/json' }),
      importingFile: false,
      errorImportingFile: false,
      clearerOpen: false,
    });
  };

  private extractVendorsWithActions = () => {
    // This is a gross leaky abstraction ... it should be probably done in the datastore.ts ?

    let vwaExp: { [key: string]: VendorStatusBackup } = {};
    this.props.showStore.vendorsWithActions.forEach((vendor: IVendorStatus, boothId: string) => {
      let powerBuys: { [key: string]: ISubmittableQty } = {};
      vendor.powerBuys.forEach((pb, key) => {
        powerBuys[key] = pb;
      });
      let profitCenters: { [key: string]: ISubmittableQty } = {};
      vendor.profitCenters.forEach((pc, key) => {
        profitCenters[key] = pc;
      });
      let curVend: VendorStatusBackup = {
        boothNum: vendor.boothNum,
        boothName: vendor.boothName,
        questions: vendor.questions,
        powerBuys: powerBuys,
        profitCenters: profitCenters,
        vendorNotes: vendor.vendorNotes,
        openStockForms: vendor.openStockForms,
      };
      vwaExp[boothId] = curVend;
    });
    return vwaExp;
  };

  private openClearer = () => {
    this.setState({
      exportJson: undefined,
      importingFile: false,
      errorImportingFile: false,
      clearerOpen: true,
    });
  };

  private reallyClear = () => {
    this.props.showStore.clearDatabases(false);
    this.props.showStore.clearJSObjects(true);
    this.props.showStore.loadShowData();
    this.props.closeHander(false);
  };
}
