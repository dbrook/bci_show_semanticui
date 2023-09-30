import React from 'react';

import { inject, observer } from 'mobx-react';

import { VendorVisit, OpenStockForm } from '../types/enums';
import { IVendorDirectory, IVendorStatus } from '../types/interfaces';

interface FloorPlanProps {
  showStore?: any;
}

/*
 * React wrapper around an HTML Canvas element responsible for drawing all the booths based on the
 * type (vendor, admin, activity) and makes an inner outline based on the booth visit status, fill
 * based on the open stock form submission status
 */
@inject('showStore') @observer
export default class FloorPlan extends React.Component<FloorPlanProps> {
  private myCanvasRef = React.createRef<HTMLCanvasElement>();
  private visitBorderWidth = 4;
  private boothNumberFont = '11px Lato';
  private lineColorActivityBooth = 'rgba(175, 175, 175, 1)';
  private fillColorActivityBooth = 'rgba(175, 175, 175, 0.10)';
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

    let boothDivs = this.drawBooths(boothVendors, this.lineColorVendorBooth, vendorsWithActions);
    let activityDivs = this.drawBooths(boothActivities, this.lineColorActivityBooth, vendorsWithActions);
    let adminDivs = this.drawBooths(boothAdmins, this.lineColorAdminBooth, vendorsWithActions);

    return (
      <div className='tabInnerLayout'>
        <div style={mapStyle}>
          {boothDivs}
          {activityDivs}
          {adminDivs}
        </div>
      </div>
    );
  }

  private drawBooths = (booths: Map<string, IVendorDirectory>,
                        outlineColor: string,
                        vendStat: Map<string, IVendorStatus>) => {
    const vendorDrawCoords = Array.from(booths, ([key, value]) => {
      return {
        boothNum: value.boothNum,
        x: value.x1,
        y: value.y1,
        width: value.width,
        height: value.height,
        boothId: key,
      };
    });

    let drawnBooth: Set<number> = new Set();
    let divs = [];
    for (const vend of vendorDrawCoords) {
      // Don't repeatedly draw into the same booth (multi-vendor booths)
      // FIXME: we should draw the most in-need status if multi-vendor booth!
      if (!drawnBooth.has(vend.boothNum)) {
        let bgColor = "";
        let stat = vendStat.get(vend.boothId);
        if (stat) {
        switch (stat.openStockForm) {
          case OpenStockForm.DO_NOT_GET:
            break;
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
//           boxShadow: bgColor ? "inset 0 0 0 5px " + bgColor : "",
          display: "flex",
          flexDirection: "column" as "column",
          justifyContent: "center",
        };

        let itm = <div key={vend.boothNum} style={styleItem}>{vend.boothNum}</div>;
        divs.push(itm);
        drawnBooth.add(vend.boothNum);

//         ctx.strokeRect(vend.x, vend.y, vend.width, vend.height);
//         ctx.fillStyle = fillStyle;
//         ctx.fillRect(vend.x + 1, vend.y + 1, vend.width - 2, vend.height - 2);
//         ctx.fillStyle = 'black';
//         ctx.fillText(`${vend.boothNum}`, vend.x + 8, vend.y + 18);
//         drawnBooth.add(vend.boothNum);
      }
    }
    return divs;
  };

  private drawBoothStatus = (ctx: CanvasRenderingContext2D,
                             booths: Map<string, IVendorDirectory>,
                             vendStat: Map<string, IVendorStatus>) => {
    const arrayVendorStat = Array.from(vendStat, ([key, value]) => {
      return {
        visit: value.visit,
        openStock: value.openStockForm,
        boothNum: value.boothNum,
        //@ts-ignore
        x1: booths.get(value.boothId).x1 + (this.visitBorderWidth - 1),
        //@ts-ignore
        y1: booths.get(value.boothId).y1 + (this.visitBorderWidth - 1),
        //@ts-ignore
        width: booths.get(value.boothId).width - (this.visitBorderWidth - 1) * 2,
        //@ts-ignore
        height: booths.get(value.boothId).height - (this.visitBorderWidth - 1) * 2,
      };
    });

    ctx.lineWidth = this.visitBorderWidth;
    for (const stat of arrayVendorStat) {
      switch (stat.visit) {
        case VendorVisit.DO_NOT_VISIT:
          ctx.strokeStyle = this.lineColorDoNotVisit;
          break;
        case VendorVisit.NOT_VISITED:
          ctx.strokeStyle = this.lineColorNotVisited;
          break;
        case VendorVisit.VISITED:
          ctx.strokeStyle = this.lineColorVisited;
          break;
        case VendorVisit.NEED_REVISIT:
          ctx.strokeStyle = this.lineColorRevisit;
          break;
      }

      let redrawBoothNum: boolean = true;
      let boothNumColor: string = 'white';
      switch (stat.openStock) {
        case OpenStockForm.DO_NOT_GET:
          redrawBoothNum = false;
          ctx.fillStyle = this.lineColorDoNotVisit;  // Transparency
          break;
        case OpenStockForm.PICK_UP:
          ctx.fillStyle = this.fillColorPickUp;
          break;
        case OpenStockForm.RETRIEVED:
          ctx.fillStyle = this.fillColorRetrieved;
          break;
        case OpenStockForm.FILLED_IN:
          ctx.fillStyle = this.fillColorFilledIn;
          break;
        case OpenStockForm.SUBMITTED:
          ctx.fillStyle = this.fillColorSubmitted;
          break;
        case OpenStockForm.ABANDONED:
          ctx.fillStyle = this.fillColorAbandoned;
          boothNumColor = 'black';
          break;
      }

      ctx.strokeRect(stat.x1, stat.y1, stat.width, stat.height);
      ctx.fillRect(stat.x1 + 2, stat.y1 + 2, stat.width - 4, stat.height - 4);
      if (redrawBoothNum) {
        ctx.fillStyle = boothNumColor;
        ctx.fillText(`${stat.boothNum}`, stat.x1 + 5, stat.y1 + 14);
        // For Chromium, set the fill style back to black explicitly or else fonts are all white
        ctx.fillStyle = 'black';
      }
    }
  };
}
