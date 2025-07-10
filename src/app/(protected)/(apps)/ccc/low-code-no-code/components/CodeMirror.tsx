import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { CodeMirrorProps } from '../type';


function CodeMirrorCustom({
  code,
  theme,
  height,
  editable,
  onChange
}:CodeMirrorProps) {
  const [value, setValue] = React.useState(code);
  // const onChange = React.useCallback((val, viewUpdate) => {
  //   //console.log('val:', val);
  //   setValue(val);
  // }, []);
  return <CodeMirror value={value} editable={editable!==undefined?editable:true} theme={theme} height={height} extensions={[javascript({ jsx: true })]} onChange={(code)=>{
    onChange(code)
  }} />;
}
export default CodeMirrorCustom;