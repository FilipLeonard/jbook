import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import React, { useRef } from 'react';
import './code-editor.css';
import './syntax.css';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

type Editor = Parameters<EditorDidMount>[1];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChange,
}) => {
  const editorRef = useRef<Editor>();

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(e => {
      onChange(getValue());
    });
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    // Add JSX syntax highlighting
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    if (!editorRef.current) return;

    const unformattedCode = editorRef.current.getModel()?.getValue();

    if (!unformattedCode) return;

    try {
      const formattedCode = prettier
        .format(unformattedCode, {
          parser: 'babel',
          plugins: [parser],
          useTabs: false,
          semi: true,
          singleQuote: true,
        })
        .replace(/\n$/, ''); // remove last auto-generated new line

      editorRef.current.setValue(formattedCode);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>

      <MonacoEditor
        value={initialValue}
        editorDidMount={onEditorDidMount}
        theme="dark"
        language="javascript"
        height="100%"
        options={{
          wordWrap: 'on',
          smoothScrolling: true,
          minimap: { enabled: false },
          // showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
