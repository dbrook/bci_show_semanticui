import React from 'react';
import {
  Divider,
  Header,
  Input,
  DropdownProps,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
  Select,
  TableBody,
  TableFooter,
  Label,
} from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import { ISubmittableQty } from '../types/interfaces';
import SimpleSubmittable from './simplesubmittable';

interface SimpleSubmittableGroupProps {
  boothNum: string;
  vendor: string;
  items: Map<string, ISubmittableQty>;
  hideCompleted: boolean;
  hideVendor: boolean;
  prefix: string;
  showStore?: any;
};

interface SimpleSubmittableGroupState {
  curSelectVal: string;
};

/*
 * SimpleSubmittableGroup Component:
 *
 * Collection of all SimpleSubmittable components belonging to a single vendor.
 */
@inject('showStore') @observer
export default class SimpleSubmittableGroup extends React.Component<SimpleSubmittableGroupProps, SimpleSubmittableGroupState> {
  private allLets: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                               'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  constructor(props: SimpleSubmittableGroupProps, state: SimpleSubmittableGroupState) {
    super(props, state);
    this.state = { curSelectVal: '' };
  }

  render() {
    const {
      boothNum,
      vendor,
      items,
      hideCompleted,
      hideVendor,
      prefix,
    } = this.props;

    let availableSubmittables = [{key: '', text: '', value: ''}];
    for (const submittableLetter of this.allLets) {
      if (typeof(items) == 'object' && !items.get(submittableLetter)) {
        availableSubmittables.push({
          key: submittableLetter,
          text: `${prefix}-${boothNum}${submittableLetter}`,
          value: submittableLetter
        });
      }
    }

    let itemsAsSubmittablesTbl: React.ReactElement[] = [];
    let itemsAsSubmittablesMob: React.ReactElement[] = [];
    if (items) {
      items.forEach((value, key) => {
        let submitted = value.submitted as boolean;
        let fulfillMonthItemsTbl = [];
        let fulfillMonthItemsMob = [];
        if (items.get(key) !== undefined) {
          // @ts-ignore ts(2532)
          for (let i = 0; i < items.get(key).quantities.length; i++) {
            fulfillMonthItemsTbl.push(
              <TableCell key={prefix + boothNum + key + i} textAlign='center'>
                <Input style={{width: '55px'}} maxLength={3}>
                  <input id={'sub-' + prefix + '-' + boothNum + '-' + key + '-' + i}
                         style={{textAlign: 'right', fontFamily: 'monospace'}}
                         defaultValue={items.get(key)?.quantities[i]}
                         onBlur={this.updateQuantity}
                         disabled={submitted} />
                </Input>
              </TableCell>
            );
            fulfillMonthItemsMob.push(
              <span key={prefix + boothNum + key + i}>
                <Label style={{width: '50px'}}>{this.props.showStore.fulfillmentMonths[i]}</Label>
                <Input style={{width: '55px'}} maxLength={3}>
                  <input id={'mob-' + prefix + '-' + boothNum + '-' + key + '-' + i}
                         style={{textAlign: 'right', fontFamily: 'monospace'}}
                         defaultValue={items.get(key)?.quantities[i]}
                         onBlur={this.updateQuantity}
                         disabled={submitted} />
                </Input>
              </span>
            );
          }
        }

        if (!(hideCompleted && submitted)) {
          itemsAsSubmittablesTbl.push(
            <TableRow key={key}>
              {fulfillMonthItemsTbl}
              <TableCell textAlign='center' className='BCIsimplesubmittable'>
                {prefix}-{boothNum}{key}
              </TableCell>
              <TableCell textAlign='center'>
                <SimpleSubmittable key={key}
                                   boothNum={boothNum}
                                   submitted={submitted}
                                   quantity={0}
                                   prefix={prefix}
                                   itemId={key} />
              </TableCell>
            </TableRow>
          );
          itemsAsSubmittablesMob.push(
            <span key={key}>
              <Label style={{width: '75px'}} color='grey' className='BCIsimplesubmittable'>
                {prefix}-{boothNum}{key}
              </Label>
              <br />
              {fulfillMonthItemsMob}
              <SimpleSubmittable key={key}
                                 boothNum={boothNum}
                                 submitted={submitted}
                                 quantity={0}
                                 prefix={prefix}
                                 itemId={key} />
              <Divider />
            </span>
          );
        }
      });
    }

    const fulfillMonths = this.props.showStore.fulfillmentMonths.map((month: string) => {
      return <TableHeaderCell key={month} textAlign='center'>{month}</TableHeaderCell>
    });

    let header  = hideVendor ? null : <Header as='h3'>{boothNum} - {vendor}</Header>;
    let divider = hideVendor ? null : <Divider />;
    return <div>
        {header}
        <div className='BCItaskitemsflex'>
          <Table unstackable className='BCIdesktop'>
            <TableHeader>
              <TableRow>
                {fulfillMonths}
                <TableHeaderCell key='prefix' textAlign='center'>{prefix} #</TableHeaderCell>
                <TableHeaderCell key='subdel' textAlign='center'>Sub / Del</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemsAsSubmittablesTbl}
            </TableBody>
            {hideVendor ?
            <TableFooter>
              <TableRow>
                <TableHeaderCell colSpan={this.props.showStore.fulfillmentMonths.length} textAlign='right'>
                  Add a new {prefix} item by selecting an entry in the drop-down:
                </TableHeaderCell>
                <TableHeaderCell colSpan='2'>
                  <Select style={{width: '6em', fontFamily: 'monospace'}}
                          options={availableSubmittables}
                          value={this.state.curSelectVal}
                          onChange={this.addRow} />
                </TableHeaderCell>
              </TableRow>
            </TableFooter>
            : null}
          </Table>
          <div className='BCImobiletablet'>
            {itemsAsSubmittablesMob}
            {hideVendor ?
              <>
                Add a new {prefix} item:
                <Select style={{width: '6em', fontFamily: 'monospace'}}
                              options={availableSubmittables}
                              value={this.state.curSelectVal}
                              onChange={this.addRow} />
              </>
            : null}
          </div>
        </div>
        {divider}
      </div>;
  }

  private addRow = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    if (data.value === '') {
      return;
    }

    const { prefix, boothNum } = this.props;
    if (prefix === 'PC') {
      this.props.showStore.addProfitCenter(boothNum, data.value);
    } else if (prefix === 'PB') {
      this.props.showStore.addPowerBuy(boothNum, data.value);
    }

    this.setState({ curSelectVal: '' });
  }

  private updateQuantity = (event: React.SyntheticEvent<HTMLInputElement>) => {
    // @ts-ignore
    const updatedValue = +event.target?.value;
    // @ts-ignore
    const updatedId: string = event.target?.id;

    const requestChunks = updatedId.split('-');
    if (requestChunks[1] === 'PC') {
      this.props.showStore.updateProfitCenter(requestChunks[2], requestChunks[3],
                                              requestChunks[4], updatedValue);
    } else if (requestChunks[1] === 'PB') {
      this.props.showStore.updatePowerBuy(requestChunks[2], requestChunks[3],
                                          requestChunks[4], updatedValue);
    }
  }
}
