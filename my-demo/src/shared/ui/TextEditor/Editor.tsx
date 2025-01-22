"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { HeadingNode } from "@lexical/rich-text";
import ToolbarPlugin from "./ToolbarPlugin";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { useEffect, useState } from "react";
// import { EditorState } from "lexical";

const exampleTheme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "font-bold text-3xl",
    h2: "font-bold text-2xl",
    h3: "font-bold text-xl",
    h4: "font-bold text-lg",
    h5: "font-bold text-3xl",
    h6: "font-bold text-3xl",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listItem",
    listitemChecked: "editor-listItemChecked",
    listitemUnchecked: "editor-listItemUnchecked",
  },
  hashtag: "editor-hashtag",
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-textBold",
    code: "editor-textCode",
    italic: "editor-textItalic",
    strikethrough: "editor-textStrikethrough",
    subscript: "editor-textSubscript",
    superscript: "editor-textSuperscript",
    underline: "underline",
    underlineStrikethrough: "editor-textUnderlineStrikethrough",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

function onError(error: unknown) {
  console.error(error);
}

const initialConfig = {
  namespace: "MyEditor",
  theme: exampleTheme,
  nodes: [HeadingNode],
  onError,
};

// function MyOnChangePlugin({ onChange }) {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     return editor.registerUpdateListener(({ editorState }) => {
//       onChange(editorState);
//     });
//   }, [editor, onChange]);

//   return null;
// }

// interface EditorProps {
//   onEditorChange: (editorStateJSON: string) => void;
// }

export default function Editor() {
  // const [editorStateJSON, setEditorStateJSON] = useState<string | null>(null);

  // const onChange = (editorState: EditorState) => {
  //   const newEditorStateJSON = JSON.stringify(editorState.toJSON());

  //   if (editorStateJSON !== newEditorStateJSON) {
  //     setEditorStateJSON(newEditorStateJSON);
  //     onEditorChange(newEditorStateJSON);
  //   }
  // };
  return (
    <div className="w-full mx-auto max-h-[30vh] border relative">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="focus:outline-none p-3 max-h-[25vh] overflow-auto" />
          }
          placeholder={
            <div className="text-gray-300 pl-3">Enter some text...</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        {/* <MyOnChangePlugin onChange={onChange} /> */}
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
}
