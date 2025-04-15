import React, { useState, useEffect } from 'react'
// import styled from 'styled-components'
// npm i @uiw/react-codemirror
import CodeMirror from '@uiw/react-codemirror'
// npm i @uiw/codemirror-theme-bespin @uiw/codemirror-theme-duotone @uiw/codemirror-theme-dracula @uiw/codemirror-theme-github @uiw/codemirror-theme-xcode @uiw/codemirror-theme-vscode @uiw/codemirror-theme-okaidia

// theme
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { bespin } from '@uiw/codemirror-theme-bespin'
import { duotoneDark, duotoneLight } from '@uiw/codemirror-theme-duotone'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { xcodeDark, xcodeLight } from '@uiw/codemirror-theme-xcode'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { okaidia } from '@uiw/codemirror-theme-okaidia'

// npm i @codemirror/lang-cpp @codemirror/lang-java @codemirror/lang-javascript @codemirror/lang-python

// language

import { python } from '@codemirror/lang-python'
import { sql } from "@codemirror/lang-sql";

//configuration
import { indentUnit } from '@codemirror/language'
import { EditorState } from '@codemirror/state'

const CodeEditor = ({
    currentLanguage,
    currentTheme,
    currentCode,
    setCurrentCode
}) => {

    const [theme, setTheme] = useState(githubDark)
    const [language, setLanguage] = useState(sql);
    // console.log(currentCode)

    useEffect(() => {
        if (currentLanguage === 'sql') setLanguage(sql);
        if (currentLanguage === 'python') setLanguage(python);
    }, [currentLanguage])


    useEffect(() => {
        if (currentTheme === 'githubDark') setTheme(githubDark);
        if (currentTheme === 'githubLight') setTheme(githubLight);
        if (currentTheme === 'bespin') setTheme(bespin);
        if (currentTheme === 'duotoneDark') setTheme(duotoneDark);
        if (currentTheme === 'duotoneLight') setTheme(duotoneLight);
        if (currentTheme === 'dracula') setTheme(dracula);
        if (currentTheme === 'xcodeDark') setTheme(xcodeDark);
        if (currentTheme === 'xcodeLight') setTheme(xcodeLight);
        if (currentTheme === 'vscodeDark') setTheme(vscodeDark);
        if (currentTheme === 'okaidia') setTheme(okaidia);
    }, [currentTheme])


    useEffect(() => {
        // console.log("currentCode has changed:", currentCode);
    }, [currentCode]);
    

    return (
        <CodeMirror
            value={currentCode}
            height="100%"
            theme={theme}
            extensions={[
                language,
                indentUnit.of("        "),
                EditorState.tabSize.of(8),
                EditorState.changeFilter.of(() => true)
            ]}
            onChange={(value) => {
                // console.log("Updated code:", value); // Log the updated value
                setCurrentCode(value);
        
            }}
            
            basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                history: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                defaultKeymap: true,
                searchKeymap: true,
                historyKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
            }}
        />
    )
}

export default CodeEditor