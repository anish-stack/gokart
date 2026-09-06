import { useMemo, useRef } from 'react';
import JoditEditor from 'jodit-react';

/**
 * WYSIWYG HTML editor for article/CMS body fields. Supports pasting rich
 * HTML directly (Jodit sanitizes/normalizes pasted markup automatically).
 * The underlying value stored is an HTML string.
 */
export default function RichTextEditor({ value, onChange, placeholder, minHeight = 320 }) {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: minHeight,
      placeholder: placeholder || 'Start writing...',
      buttons: [
        'source', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'ul', 'ol', '|',
        'font', 'fontsize', 'paragraph', '|',
        'image', 'link', 'table', '|',
        'align', 'undo', 'redo', '|',
        'hr', 'eraser', 'fullsize',
      ],
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_as_html',
      toolbarAdaptive: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    [placeholder, minHeight]
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
}