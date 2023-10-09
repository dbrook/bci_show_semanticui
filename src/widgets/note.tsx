import React from 'react';
import { SyntheticEvent } from 'react';
import { Button, Form, Icon, Message, TextArea, TextAreaProps } from 'semantic-ui-react';

import { inject, observer } from 'mobx-react';

interface NoteProps {
  noteId: number;
  showStore?: any;
};

interface NoteState {
  editing: boolean;
  newText: string|undefined;
};

/*
 * An editable note: renders as a Semantic UI (warning) Message with left-aligned text and a
 * button to edit/save (changes to a text input until saved) the note and another to delete it.
 */
@inject('showStore') @observer
export default class Note extends React.Component<NoteProps, NoteState> {
  constructor(props: NoteProps, state: NoteState) {
    super(props, state);
    this.state = {
      editing: false,
      newText: undefined,
    };
  }

  render() {
    const { noteId, showStore } = this.props;
    const { editing, newText } = this.state;
    const note = showStore.vendorNotes[noteId];
    const icon = editing ? 'save' : 'pencil alternate';

    return <Message warning className='BCIindividualquestion'>
        {
          (!editing) ?
          <div className='BCIquestionanswerform'>{note}</div> :
          <Form className='BCIquestionanswerform'>
            <TextArea rows={2}
                      className='BCIquestionanswerinput'
                      value={newText}
                      onChange={this.updatedText} />
          </Form>
        }
        <Button basic icon color='blue' onClick={this.toggleEdit}>
          <Icon name={icon}/>
        </Button>
        <Button basic icon color='red' onClick={this.deleteNote}>
          <Icon name='trash alternate outline'/>
        </Button>
      </Message>;
  }

  private toggleEdit = () => {
    if (this.state.editing) {
      this.props.showStore.changeVendorNote(this.props.noteId, this.state.newText);
      this.setState({
        editing: !this.state.editing,
        newText: undefined,
      });
    } else {
      this.setState({
        editing: !this.state.editing,
        newText: this.props.showStore.vendorNotes[this.props.noteId],
      });
    }
  }

  private updatedText = (e: SyntheticEvent, data: TextAreaProps) => {
    this.setState({ newText: data.value as string });
  }

  private deleteNote = () => {
    this.props.showStore.removeVendorNote(this.props.noteId);
  }
}
