import React from "react";
import Box from '@mui/material/Box';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import IconButton from '@mui/material/IconButton';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import TitleIcon from '@mui/icons-material/Title';
import Tooltip from '@mui/material/Tooltip';
import ErrorBoundary from '@/components/ErrorBoundary'
import { useMediaQuery } from '@mui/material';
import {Theme}from '@mui/system'
import "draft-js/dist/Draft.css";
import { Editor, EditorState,RichUtils, ContentState, convertFromHTML,getDefaultKeyBinding ,KeyBindingUtil} from "draft-js";
const {hasCommandModifier} = KeyBindingUtil;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { stateToHTML}= require('draft-js-export-html' )

type blockStyles= 'header-four'|'blockquote'|'unordered-list-item'|'ordered-list-item'
type InlineStyles= 'BOLD'|'ITALIC'|'UNDERLINE' 

export default function MyEditor({placeholder,onChange,error,defaultData,resetCount}:{placeholder?:string,defaultData?:string,error:string,onChange:(text:string)=>void,resetCount?:number}) {

  const [editorState, setEditorState] = React.useState<EditorState>(() =>
    EditorState.createEmpty()
  );
  const [isFocus, setIsFocus] = React.useState<boolean>(false)
  const [isMount, setIsMount] = React.useState<boolean>(false)
    ////reset text when reset is trigger
  React.useEffect(() => {
if(resetCount)  setEditorState(EditorState.createEmpty())
  }, [resetCount])



React.useEffect(() => {
setIsMount(true)
}, [])
const handleFocus = ()=>{
  setIsFocus(true)
}
const handleBlur= ()=>{
  setIsFocus(false)

}
  const onEditorChange = (editorState:EditorState )=>{
    
    setEditorState(editorState);
 
  }

 

  


  const  toggleInlineStyle =(e:React.MouseEvent<HTMLElement>,style:InlineStyles )=>  {
   e.preventDefault()
   onEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  }
  const toggleBlockType = (e:React.MouseEvent<HTMLElement>|React.KeyboardEvent<HTMLElement>,style:blockStyles)=>{
   e.preventDefault()
 onEditorChange(RichUtils.toggleBlockType(editorState, style));

  }
  const getEditorState = (html:string) => {
      const blocks = convertFromHTML(html)
      const content = ContentState.createFromBlockArray(
        blocks.contentBlocks,
        blocks.entityMap
      )

      return EditorState.createWithContent(content)
    }
 const stylesControls:{[key:string]:string}={
  'BOLD':'Ctr+b',
   'ITALIC':'Ctr+i',
  'UNDERLINE':'Ctr+u',
  'header-four':'Ctr+a',
   'blockquote':'Ctr+q',
 'unordered-list-item':'Ctr+m',
  'ordered-list-item':'Ctr+y',
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

    
              /* `A` key + Alt */ 
       if (e.keyCode === 65 && hasCommandModifier(e)) return toggleBlockType(e,'header-four') 
               /* `M` key  */ 
        if (e.keyCode === 77 && hasCommandModifier(e)) return toggleBlockType(e,'unordered-list-item') 
              /* `Y` key  */ 
        if (e.keyCode === 89  && hasCommandModifier(e)) return toggleBlockType(e,'ordered-list-item') 

           /* ` Q "` key  */ 
           if (e.keyCode === 81  && hasCommandModifier(e)) return toggleBlockType(e,'blockquote') 
          return getDefaultKeyBinding(e);
      
        }
     
   const selection = editorState.getSelection();
   const blockType = editorState
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType();

   const currentStyle = editorState.getCurrentInlineStyle();
const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
   const BLOCK_TYPES:{icone:React.ReactNode,style:blockStyles}[]  = [

        {icone: <TitleIcon fontSize={isInSmScreen? 'medium':'small'}  />, style: 'header-four'},

        {icone: <FormatListBulletedIcon fontSize={isInSmScreen? 'medium':'small'} />, style: 'unordered-list-item'},
        {icone: < FormatListNumberedIcon fontSize={isInSmScreen? 'medium':'small'}/>, style: 'ordered-list-item'},
                {icone: <FormatQuoteIcon fontSize={isInSmScreen? 'medium':'small'}/>, style: 'blockquote'},
     
      ];
        const   INLINE_STYLES:{icone:React.ReactNode,style:InlineStyles}[] = [
        {icone: <FormatBoldIcon fontSize={isInSmScreen? 'medium':'small'}  />, style: 'BOLD'},
        {icone: <FormatItalicIcon fontSize={isInSmScreen? 'medium':'small'} />, style: 'ITALIC'},
        {icone:  <FormatUnderlinedIcon  fontSize={isInSmScreen? 'medium':'small'}/>, style: 'UNDERLINE'},
      ];

React.useEffect(() => {

  if(!defaultData)return

  const defaultState=  getEditorState(defaultData)

 setEditorState(defaultState)
 
}, [defaultData])

React.useEffect(() => {
  if(!editorState) return
  const content=editorState.getCurrentContent()
  if(!content) return
  const html = stateToHTML(content);
  onChange(html)
}, [editorState])

  if(!isMount) return <div/>
  return (
    <ErrorBoundary>
    <Box sx={{display:'flex',border:error? ' 1px solid #d32f2f': isFocus? '1px solid rgba(0, 0, 0, 0.6)' : '1px solid rgba(0, 0, 0, 0.3)'   ,borderBottom:'transparent'}} >


      {INLINE_STYLES.map(inlineStyle=> 
      <Tooltip  title={stylesControls[inlineStyle.style]}  key={inlineStyle.style}>
        <IconButton size={isInSmScreen? 'medium':'small'} aria-label={inlineStyle.style}component="span" color={currentStyle.has(inlineStyle.style) ? 'primary': 'default' } onClick={(e:React.MouseEvent<HTMLElement>) =>toggleInlineStyle(e,inlineStyle.style)}>
          {inlineStyle.icone}
        </IconButton>
        </Tooltip>
        )}
        <Box sx={{borderLeft: '1px solid rgba(0, 0, 0, 0.3)',ml:1}}/>
     {BLOCK_TYPES.map(blockStyle=> 
           <Tooltip title={stylesControls[blockStyle.style]} key={blockStyle.style}>
        <IconButton size={isInSmScreen? 'medium':'small'}  aria-label={blockStyle.style} component="span" color={blockStyle.style === blockType ? 'primary': 'default' }  onClick={(e:React.MouseEvent<HTMLElement>) =>toggleBlockType(e,blockStyle.style)}>
          {blockStyle.icone}
        </IconButton>
        </Tooltip>
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
      '*':{
        fontSize:{sm:'16px',xs:'14px'}
      },
       '.public-DraftEditorPlaceholder-root':{
          color:error?'#d32f2f':'inherit',
   

        }
    }}
  
    >

      <Editor
      editorKey="editor"
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
    </ErrorBoundary>
  );
}