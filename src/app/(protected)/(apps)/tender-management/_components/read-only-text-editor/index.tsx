import * as React from "react";
import {
  Editor,
  EditorMountEvent,
  EditorTools,
  EditorUtils,
  ProseMirror,
} from "@progress/kendo-react-editor";
import { Button } from "@progress/kendo-react-buttons";

const { EditorState, EditorView, Plugin, PluginKey } = ProseMirror;
const { Pdf } = EditorTools;

const ReadOnlyEditor = React.forwardRef(({
      value = "",
      onChange,
      height = 450
    }: { value: string; onChange: any, height: number }, ref) => {
  const [editable, setEditable] = React.useState<boolean>(true);
  const editableRef = React.useRef<boolean>(false);
  const editorRef = React.useRef(null);
  const view = React.useRef<any>(null);

  React.useImperativeHandle(ref, () => ({
    getHtml: () => {
      // return editorRef.current
      //   ? editorRef.current.view.state.doc.textContent
      //   : "";
      if (editorRef?.current) {
        const view = editorRef.current.view;
        if (view) {
          console.log(EditorUtils.getHtml(view.state));
          return EditorUtils.getHtml(view.state);
        }
      }
    },
    setHtml: (html: string) => {
      console.log('received html 1',html)
      if (editorRef.current) {
        const view = editorRef.current.view;
        if (view) {
           setEditable((prev) => true);
           editableRef.current = true;
          EditorUtils.setHtml(view, html);
           setEditable((prev) => false);
           editableRef.current = false;
        }
      }
    },
  }));

  const onMount = (event: EditorMountEvent) => {
    const state = event.viewProps.state;
    const plugins = [
      ...state.plugins,
      new Plugin({
        key: new PluginKey("readonly"),
        props: { editable: () => editableRef.current },
        filterTransaction: (tr, _st) => editableRef.current || !tr.docChanged,
      }),
    ];
    view.current = new EditorView(
      { mount: event.dom },
      {
        ...event.viewProps,
        state: EditorState.create({ doc: state.doc, plugins }),
      }
    );

    return view.current;
  };

  React.useEffect(() => {
    if (view.current && editable) {
      view.current.updateState(view.current.state);
    }
  }, [editable]);

  const toggleEditable = () => {
    setEditable(!editable);
    editableRef.current = !editable;
  };

  return (
    <div>
      {/* <Button type="button" onClick={toggleEditable}>
        Set Read-Only to {String(editable)}
      </Button>
      <br />
      <br /> */}
      <Editor
        tools={[[Pdf]]}
        contentStyle={{ height: height }}
        onMount={onMount}
        defaultContent={value}
        ref={editorRef}
      />
    </div>
  );
});

export default ReadOnlyEditor;
