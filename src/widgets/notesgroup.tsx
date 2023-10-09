import React from 'react';

import { inject, observer } from 'mobx-react';

import Note from './note';

interface NotesGroupProps {
  items: number[];
  showStore?: any;
};

/*
 * QuestionAnswerGroup Component:///
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

    return <div>
        {notes}
      </div>;
  }
}
