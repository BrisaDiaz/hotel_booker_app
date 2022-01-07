import React from "react";
import { Editor, EditorState,RichUtils, ContentState, convertFromHTML,getDefaultKeyBinding } from "draft-js";

import Box from '@mui/material/Box';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import IconButton from '@mui/material/IconButton';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import TitleIcon from '@mui/icons-material/Title';
import "draft-js/dist/Draft.css";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { stateToHTML}= require('draft-js-export-html' )

type blockStyles= 'header-four'|'blockquote'|'unordered-list-item'|'ordered-list-item'
type InlineStyles= 'BOLD'|'ITALIC'|'UNDERLINE' 

export default function MyEditor({placeholder,onChange,error,defaultData}:{placeholder?:string,defaultData?:string,error:string,onChange:(text:string)=>void}) {

  const [editorState, setEditorState] = React.useState<EditorState>(() =>
    EditorState.createEmpty()
  );
const [isFocus, setIsFocus] = React.useState<boolean>(false)

const handleFocus = ()=>{
  setIsFocus(true)
}
const handleBlur= ()=>{
  setIsFocus(false)
   const html = stateToHTML(editorState.getCurrentContent());
   
    onChange(JSON.stringify(html))
  
}
  const onEditorChange = (editorState:EditorState )=>{
    
    setEditorState(editorState);
 
  }

 

  


  const  toggleInlineStyle =(e:React.MouseEvent<HTMLElement>,style:InlineStyles )=>  {
   e.preventDefault()
   onEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  }
  const toggleBlockType = (e:React.MouseEvent<HTMLElement>, style:blockStyles)=>{
   e.preventDefault()
 onEditorChange(RichUtils.toggleBlockType(editorState, style));

  }
  const handleKeyCommand = (command:any, editorState:EditorState) => {
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            onEditorChange(newState);
            return true;
          }
          return false;
 }
     const mapKeyToEditorCommand =(e:React.KeyboardEvent<HTMLElement>)=> {
          if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
              e,
              editorState,
              4, /* maxDepth */
            );
            if (newEditorState !== editorState) {
            onEditorChange(newEditorState);
            }
            return;
          }
          return getDefaultKeyBinding(e);
        }
   const selection = editorState.getSelection();
   const blockType = editorState
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType();

   const currentStyle = editorState.getCurrentInlineStyle();

   const BLOCK_TYPES:{icone:React.ReactNode,style:blockStyles}[]  = [

        {icone: <TitleIcon/>, style: 'header-four'},

        {icone: <FormatListBulletedIcon/>, style: 'unordered-list-item'},
        {icone: < FormatListNumberedIcon/>, style: 'ordered-list-item'},
                {icone: <FormatQuoteIcon/>, style: 'blockquote'},
     
      ];
        const   INLINE_STYLES:{icone:React.ReactNode,style:InlineStyles}[] = [
        {icone: <FormatBoldIcon />, style: 'BOLD'},
        {icone: <FormatItalicIcon />, style: 'ITALIC'},
        {icone:  <FormatUnderlinedIcon />, style: 'UNDERLINE'},
      ];


React.useEffect(() => {
 if(defaultData){
  const defaultState=  EditorState.createWithContent( ContentState.createFromBlockArray(
          convertFromHTML(defaultData) as any
        ))
 setEditorState(defaultState)
 }
}, [defaultData])
  return (
    <>
    <Box sx={{display:'flex',border: isFocus? '1px solid rgba(0, 0, 0, 0.6)' : '1px solid rgba(0, 0, 0, 0.3)' ,borderBottom:'transparent'}} >


      {INLINE_STYLES.map(inlineStyle=> 
        <IconButton key={inlineStyle.style} aria-label={inlineStyle.style}component="span" color={currentStyle.has(inlineStyle.style) ? 'primary': 'default' } onClick={(e:React.MouseEvent<HTMLElement>) =>toggleInlineStyle(e,inlineStyle.style)}>
          {inlineStyle.icone}
        </IconButton>
        
        )}
        <Box sx={{borderLeft: '1px solid rgba(0, 0, 0, 0.3)',ml:1}}/>
     {BLOCK_TYPES.map(blockStyle=> 
        <IconButton key={blockStyle.style} aria-label={blockStyle.style}component="span" color={blockStyle.style === blockType ? 'primary': 'default' }  onClick={(e:React.MouseEvent<HTMLElement>) =>toggleBlockType(e,blockStyle.style)}>
          {blockStyle.icone}
        </IconButton>
        
        )}
      
  </Box>
    <Box
      sx={{ border:error? ' 1px solid #d32f2f': isFocus? '1px solid rgba(0, 0, 0, 0.6)' : '1px solid rgba(0, 0, 0, 0.3)'  ,borderRadius:1, cursor: "text" 
    ,borderTopLeftRadius:'unset',borderTopRightRadius:'unset',
    '.public-DraftEditor-content':{
 
       minHeight:"250px",
       maxHeight:"300px",
      overflowY:'auto'
    },
      '.DraftEditor-root':{
        p:1.5,
        pr:0.5,
        fontFamily:'inherit',
      },
       '.public-DraftEditorPlaceholder-root':{
          color:error?'#d32f2f':'inherit',
   

        }
    }}
  
    >

      <Editor
        onFocus={handleFocus}
        onBlur={handleBlur}
        editorState={editorState}
        spellCheck={true}
        onChange={setEditorState}
        placeholder={isFocus ? '' : placeholder ||'' }
        handleKeyCommand={handleKeyCommand as  any}
        keyBindingFn={mapKeyToEditorCommand as  any}
        
      />
    </Box>
    </>
  );
}