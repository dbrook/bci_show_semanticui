import React from 'react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm } from '../types/enums';
import { IVendorDirectory } from '../types/interfaces';

import BoothModal from '../modals/boothmodal';

interface FloorPlanProps {
  boothButtonClick: () => void;
  showStore?: any;
}

interface FloorPlanState {
  boothModalShown: boolean;
}

interface BoothOverall {
  actions: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  openQuestionCount: number | null;
  openStock: OpenStockForm | null;
}

/*
 * Draws a map of the show floor plan with booth numbers based on the booth pixel coordinates.
 * Booths for vendors are outlined in black, activities are in gray, and administrative booths
 * are in blue. Any booth with outstanding questions has an inner thick red border, and the
 * least-completed open stock form status for the entire booth is colored based on the status
 * colors in the OpenStock widget.
 */
@inject('showStore') @observer
export default class FloorPlan extends React.Component<FloorPlanProps, FloorPlanState> {
  private lineColorActBooth = 'rgba(175, 175, 175, 1)';
  private fillColorActBooth = 'rgba(175, 175, 175, 0.10)';
  private lineColorVendorBooth = 'rgba(0, 0, 0, 1)';
  private lineColorAdminBooth = 'rgba(100, 100, 255, 1)';
  private fillColorAdminBooth = 'rgba(100, 100, 255, 0.10)';
  private fillColorPickUp = 'rgba(242, 113, 28, 1)';
  private fillColorRetrieved = 'rgba(163, 51, 200, 1)';
  private fillColorFilledIn = 'rgba(33, 133, 208, 1)';
  private fillColorSubmitted = 'rgba(33, 186, 69, 1)';
  private fillColorAbandoned = 'rgba(255, 201, 232, 1)';

  constructor(props: FloorPlanProps, state: FloorPlanState) {
    super(props, state);
    this.state = {
      boothModalShown: false,
    };
  }

  render() {
    const {
      tradeShowId,
      floorPlanWidthPx,
      floorPlanHeightPx,
      boothAdmins,
      boothVendors,
      boothActivities,
    } = this.props.showStore;

    if (tradeShowId === undefined) {
      return (
        <div className='tabInnerLayout'>
          <p>Select a Trade Show to use the floorplan feature.</p>
        </div>
      );
    }

    let mapStyle = {
      width: floorPlanWidthPx,
      height: floorPlanHeightPx,
      position: "relative" as "relative",
    };

    let activDivs = this.drawBooths(boothActivities, this.lineColorActBooth, this.fillColorActBooth);
    let adminDivs = this.drawBooths(boothAdmins, this.lineColorAdminBooth, this.fillColorAdminBooth);
    let boothDivs = this.drawBooths(boothVendors, this.lineColorVendorBooth, null);

    return (
      <div className='tabInnerLayout'>
        <BoothModal open={this.state.boothModalShown}
                    setAddTaskModal={this.addTaskModalBoothId}
                    closeHandler={this.showBoothModal} />
        <div style={mapStyle}>
          {boothDivs}{activDivs}{adminDivs}
        </div>
      </div>
    );
  }

  private reduceBooths = (booths: Map<string, IVendorDirectory>): Map<string, BoothOverall> => {
    let overallBoothStatuses = new Map<string, BoothOverall>();

    booths.forEach((booth, boothNum) => {
      let boothAction = this.props.showStore.vendorsWithActions.get(boothNum);

      // Current Vendor Details
      let curQuestionCount = null;
      let curOpenStock = null;

      // Most-restrictive known booth status so far
      let knownBoothItem = overallBoothStatuses.get(boothNum);
      let knownQuestionCount = null;
      let knownOpenStock = null;
      if (knownBoothItem) {
        knownQuestionCount = knownBoothItem.openQuestionCount;
        knownOpenStock = knownBoothItem.openStock;
      }

      if (boothAction) {
        curQuestionCount = boothAction.questions.length -
                           this.props.showStore.nbAnsweredQuestions(boothNum);
        for (const osf of boothAction.openStockForms) {
          if (osf.formState !== OpenStockForm.ABANDONED) {
            if (osf.formState < knownOpenStock || knownOpenStock === null) {
              knownOpenStock = osf.formState;
            }
          }
        }
      }

      // See if the booth has any outstanding questions
      if (curQuestionCount !== null) {
        if (knownQuestionCount !== null) {
          knownQuestionCount = curQuestionCount > knownQuestionCount ? curQuestionCount : knownQuestionCount;
        } else {
          knownQuestionCount = curQuestionCount;
        }
      }

      // See if the open stock form status is less-complete than the previously known one
      // Will skip consideration of abandoned and do-not-collect statuses
      if (curOpenStock !== null) {
        if (knownOpenStock !== null) {
          knownOpenStock = curOpenStock < knownOpenStock ? curOpenStock : knownOpenStock;
        } else {
          knownOpenStock = curOpenStock
        }
      }

      let tmpBooth: BoothOverall = {
        actions: boothAction !== undefined,
        x: booth.x1,
        y: booth.y1,
        width: booth.width,
        height: booth.height,
        openQuestionCount: knownQuestionCount,
        openStock: knownOpenStock,
      };

      overallBoothStatuses.set(boothNum, tmpBooth);
    });

    return overallBoothStatuses;
  };

  private drawBooths = (booths: Map<string, IVendorDirectory>,
                        outlineColor: string,
                        fillColor: string|null) => {
    let divs: React.ReactElement[] = [];
    const vendorDrawCoords = this.reduceBooths(booths);
    vendorDrawCoords.forEach((vend, boothNum) => {
      let bgColor = "";
      switch (vend.openStock) {
        case OpenStockForm.PICK_UP:
          bgColor = this.fillColorPickUp;
          break;
        case OpenStockForm.RETRIEVED:
          bgColor = this.fillColorRetrieved;
          break;
        case OpenStockForm.FILLED_IN:
          bgColor = this.fillColorFilledIn;
          break;
        case OpenStockForm.SUBMITTED:
          bgColor = this.fillColorSubmitted;
          break;
        case OpenStockForm.ABANDONED:
          bgColor = this.fillColorAbandoned;
          break;
      }

      let styleItem = {
        position: "absolute" as "absolute",
        top: vend.y,
        left: vend.x,
        width: vend.width,
        height: vend.height,
        borderWidth: "2px",
        borderColor: outlineColor,
        borderStyle: "solid",
        backgroundColor: fillColor ?? bgColor,
        color: bgColor ? "white" : "black",
        boxShadow: (vend.openQuestionCount && vend.openQuestionCount > 0)
                     ? "inset 0 0 0 5px red"
                     : vend.actions && !bgColor ? "inset 0 0 0 5px #6dcfcf" : "",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        cursor: "pointer",
      };

      let itm = <div key={boothNum} style={styleItem} onClick={() => this.openBooth(boothNum)}>
          {boothNum}
        </div>;
      divs.push(itm);
    });
    return divs;
  };

  private openBooth = (boothNum: string) => {
    this.props.showStore.setMapSelectedBoothNum(boothNum);
    this.showBoothModal(true, boothNum);
  };

  private showBoothModal = (showIt: boolean, boothNum: any) => {
    if (showIt) {
      this.props.showStore.setVendorPanelBoothId(boothNum);
    }

    this.setState({
      boothModalShown: showIt
    });

    if (!showIt && boothNum) {
      // Closing modal and have a booth identifier: switch to the vendor tab
      this.props.boothButtonClick();
    }
    return;
  };

  private addTaskModalBoothId = (boothId: string|undefined) => {
    if (boothId) {
      // Add a simple note to the booth so it can be interfaced with in the Vendor pane
      this.props.showStore.setVendorPanelBoothId(boothId);
      this.props.showStore.addVendorNote(
        boothId,
        "This is a newly initialized vendor. Use the buttons to add tasks and then delete this note."
      );
    }
  };

}
