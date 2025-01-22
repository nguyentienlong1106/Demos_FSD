import { useFormStore } from "@/features/create/lib/store";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useEffect } from "react";

export default function LoadState() {
  const [editor] = useLexicalComposerContext();
  const { formData } = useFormStore();
  console.log(formData.desc_lexical);

  // fetching data useEffect
  useEffect(() => {
    if (!formData.desc_lexical) {
      return;
    }

    const newState = editor.parseEditorState(formData.desc_lexical);

    editor.setEditorState(newState);
  }, [editor, formData.desc_lexical]);

  return <></>;
}
