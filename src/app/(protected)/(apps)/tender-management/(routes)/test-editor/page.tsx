'use client'
import React, { useRef } from "react";
import KendoEditor from "../../_components/text-editor-component";


const MyFormComponent = () => {
  const editorRef = useRef(null);

  // Function to handle content changes
  const handleEditorChange = (htmlContent) => {
    console.log("Editor content changed:", htmlContent);
    // Update your state or form data with the new content
  };

  // Example function to get HTML content
  const getEditorContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml();
      console.log("Current editor HTML:", html);
    }
  };

  // Example function to set HTML content
  const setEditorContent = (html) => {
    if (editorRef.current) {
      editorRef.current.setHtml(html);
    }
  };

  return (
    <div className="editor-container">
      <h3>Content Editor</h3>

      <KendoEditor
        ref={editorRef}
        initialContent="<p>Start typing here...</p>"
        onChange={handleEditorChange}
      />

      <div className="editor-actions" style={{ marginTop: "10px" }}>
        <button onClick={getEditorContent}>Get Content</button>
        <button onClick={() => setEditorContent("<p>New content</p>")}>
          Set Content
        </button>
      </div>
    </div>
  );
};

export default MyFormComponent;
