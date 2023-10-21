import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

import DataModal from '../modals/datamodal';

interface MenuBarProps {
  hideCompleted: boolean;
  toggleHideCompleted: () => void;
  alphaSort: boolean;
  toggleAlphaSort: () => void;
  dataModalClose: () => void;
  showStore?: any;
}

interface MenuBarState {
  dataModalShown: boolean,
}

/*
 * Toolbar-like widget that appears at the top of the application window to allow users to start
 * the Data Management modal, add tasks, sort lists based on booth vs. vendor name, hide booths and
 * tasks that have no further actions
 */
@inject('showStore') @observer
export default class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
  constructor(props: MenuBarProps, state: MenuBarState) {
    super(props, state);
    this.state = {
      dataModalShown: false,
    };
  }

  render() {
    const {
      hideCompleted,
      toggleHideCompleted,
      alphaSort,
      toggleAlphaSort,
      showStore: { tradeShowId },
    } = this.props;

    const { dataModalShown } = this.state;

    const sortingIconName = alphaSort ? 'sort alphabet down' : 'sort numeric down';
    const sortingIconText = alphaSort ? 'Sort: Vendor' : 'Sort: Booth';

    const vendorsPresent = tradeShowId !== undefined;

    return (
      <>
        <DataModal open={dataModalShown} closeHander={this.showDataModal}/>
        <div className='topBar'>
          <Button icon primary basic={vendorsPresent} labelPosition='left' onClick={() => this.showDataModal(true)}>
            <Icon name='calendar alternate outline' />
            {tradeShowId ?? 'Load Show Data...'}
          </Button>
          <div className='BCIflexmenubarspacer' />
          <Button icon primary basic onClick={toggleAlphaSort} button labelPosition='left'>
            <Icon name={sortingIconName} />
            {sortingIconText}
          </Button>
          <Button icon primary button
                  basic={!hideCompleted}
                  onClick={toggleHideCompleted}
                  labelPosition='left'>
            <Icon name='clipboard check' />
            Hide Done
          </Button>
        </div>
        <div className='topBarCondensed'>
          <Button icon primary
                  basic={vendorsPresent}
                  labelPosition='left'
                  onClick={() => this.showDataModal(true)}>
            <Icon name='calendar alternate outline' />
            {tradeShowId ?? 'Load Show Data...'}
          </Button>
          <div className='BCIflexmenubarspacer' />
          <Button icon primary basic onClick={toggleAlphaSort} button>
            <Icon name={sortingIconName} />
          </Button>
          <Button icon primary basic={!hideCompleted} onClick={toggleHideCompleted} button>
            <Icon name='clipboard check' />
          </Button>
        </div>
      </>
    );
  }

  private showDataModal = (showIt: boolean) => {
    this.setState({ dataModalShown: showIt });
    if (!showIt) {
      this.props.dataModalClose();
    }
    return;
  }
}
