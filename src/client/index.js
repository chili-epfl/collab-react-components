/**
 * Created by dario on 11.05.17.
 */

import ShareDB from 'sharedb/lib/client';
import RichText from 'rich-text';
import CollabForm from './CollabForm';
import CollabEditor from './CollabEditor';
import CollabRichEditor from './CollabRichEditor';
import { Quill } from 'react-quill';
import DragAndDropModule from './DragAndDropModule';

// Register rich-text type on the client
ShareDB.types.register(RichText.type);

// Register module Drag and Drop into Quill
Quill.register('modules/dragAndDrop', DragAndDropModule);

export { CollabForm, CollabEditor, CollabRichEditor };
