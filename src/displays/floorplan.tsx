import React from 'react';

import { inject, observer } from 'mobx-react';

import { OpenStockForm } from '../types/enums';
import { IVendorDirectory, IVendorStatus } from '../types/interfaces';

interface FloorPlanProps {
  showStore?: any;
}

interface BoothOverall {
  x: number,
  y: number,
  width: number,
  height: number,
  openQuestionCount: number | null;
  openStock: OpenStockForm | null;
}

/*
 * React wrapper around an HTML Canvas element responsible for drawing all the booths based on the
 * type (vendor, admin, activity) and makes an inner outline based on the booth visit status, fill
 * based on the open stock form submission status
 */
@inject('showStore') @observer
export default class FloorPlan extends React.Component<FloorPlanProps> {
  private lineColorActBooth = 'rgba(175, 175, 175, 1)';
  private fillColorActBooth = 'rgba(175, 175, 175, 0.10)';
  private lineColorVendorBooth = 'rgba(0, 0, 0, 1)';
  private lineColorAdminBooth = 'rgba(100, 100, 255, 1)';
  private fillColorAdminBooth = 'rgba(100, 100, 255, 0.10)';
  private lineColorDoNotVisit = 'rgba(0, 0, 0, 0)';
  private lineColorNotVisited = 'rgba(219, 40, 40, 1)';
  private lineColorVisited = 'rgba(88, 227, 64, 1)';
  private lineColorRevisit = 'rgba(230, 95, 237, 1)';
  private fillColorPickUp = 'rgba(242, 113, 28, 1)';
  private fillColorRetrieved = 'rgba(163, 51, 200, 1)';
  private fillColorFilledIn = 'rgba(33, 133, 208, 1)';
  private fillColorSubmitted = 'rgba(33, 186, 69, 1)';
  private fillColorAbandoned = 'rgba(255, 201, 232, 1)';

  render() {
    const {
      tradeShowId,
      floorPlanWidthPx,
      floorPlanHeightPx,
      boothAdmins,
      boothVendors,
      boothActivities,
      vendorsWithActions,
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

    let activDivs = this.drawBooths(boothActivities, this.lineColorActBooth, vendorsWithActions);
    let adminDivs = this.drawBooths(boothAdmins, this.lineColorAdminBooth, vendorsWithActions);
    let boothDivs = this.drawBooths(boothVendors, this.lineColorVendorBooth, vendorsWithActions);

    return (
      <div className='tabInnerLayout'>
        <div style={mapStyle}>
          {boothDivs}{activDivs}{adminDivs}
        </div>
      </div>
    );
  }

  private reduceBooths = (booths: Map<string, IVendorDirectory>): Map<number, BoothOverall> => {
    // Some vendors share a booth, which is kind of impossible to draw in a sane way, so every
    // vendor will be reduced into a booth and its "most pressing" condition of both open stock
    // form status and open question status will be saved for rendering.
    let overallBoothStatuses = new Map<number, BoothOverall>();

    booths.forEach((booth, boothId) => {
      let boothAction = this.props.showStore.vendorsWithActions.get(boothId);

      // Current Vendor Details
      let curQuestionCount = null;
      let curOpenStock = null;

      // Most-restrictive known booth status so far
      let knownBoothItem = overallBoothStatuses.get(booth.boothNum);
      let knownQuestionCount = null;
      let knownOpenStock = null;
      if (knownBoothItem) {
        knownQuestionCount = knownBoothItem.openQuestionCount;
        knownOpenStock = knownBoothItem.openStock;
      }

      if (boothAction) {
        curQuestionCount = boothAction.questions.length -
                           this.props.showStore.nbAnsweredQuestions(boothId);
        for (const osf of boothAction.openStockForms) {
          if (osf.formState !== OpenStockForm.ABANDONED) {
            if (osf.formState < knownOpenStock || knownOpenStock === null) {
              knownOpenStock = osf.formState;
            }
          }
        }
      }

      // See if the current vendor has more outstanding questions than the others
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
        x: booth.x1,
        y: booth.y1,
        width: booth.width,
        height: booth.height,
        openQuestionCount: knownQuestionCount,
        openStock: knownOpenStock,
      };

      overallBoothStatuses.set(booth.boothNum, tmpBooth);
    });

    return overallBoothStatuses;
  };

  private drawBooths = (booths: Map<string, IVendorDirectory>,
                        outlineColor: string,
                        vendStat: Map<string, IVendorStatus>) => {
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
        backgroundColor: bgColor,
        color: bgColor ? "white" : "black",
        boxShadow: (vend.openQuestionCount && vend.openQuestionCount > 0) ? "inset 0 0 0 5px red" : "",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
      };

      let itm = <div key={boothNum} style={styleItem}>{boothNum}</div>;
      divs.push(itm);
    });
    return divs;
  };
}
