import React from 'react';

import { inject, observer } from 'mobx-react';

import Note from './note';

interface NotesGroupProps {
  items: number[];
  showStore?: any;
};

/*
 * A list of all notes relevant to a single vendor, rendered as Note items
 */
@inject('showStore') @observer
export default class NotesGroup extends React.Component<NotesGroupProps> {
  render() {
    const {
      items,
    } = this.props;

    const notes = items.map((x) => {
      return <Note key={x} noteId={x} />;
    });

    return <div style={{marginBottom: '14px', width: '710px'}}>
        {notes}
      </div>;
  }
}
