import React from 'react';
// import { Divider, Header, Table } from 'semantic-ui-react';

import { VendorVisit } from '../types/enums';
import NumericalProgress from './numericalprogress';
import Visitation from './visitation';
import OpenStock from './openstock';

import { nbAnsweredQuestions, nbSubmitted } from '../common/utils';

interface VendorListItemProps {
  boothId: number,
  vendor: string,
  vendorStatus: VendorVisit,
};

export default class VendorListItem extends React.Component<VendorListItemProps> {
  render() {
    const { boothId, vendor, vendorStatus } = this.props;

    const vendorListStyle = {
      display: 'flex',
      width: '100%',
      marginBottom: '5px',
      alignItems: 'center',
      columnGap: '5px',
    };

    const venderBoothNum = {
      border: '1px solid #D4D4D5',
      backgroundColor: '#D4D4D5',
      borderRadius: '4px',
      padding: '5px',
      width: '3em',
      flexShrink: '0',
    };

    return <div style={vendorListStyle}>
        <Visitation visitStatus={vendorStatus} mobile />
        <span style={venderBoothNum}>{boothId}</span>
        <span>{vendor}</span>
      </div>;
  }
}
