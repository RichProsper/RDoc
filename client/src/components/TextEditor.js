import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const TOOLBAR_OPTIONS = [
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{font: []}],
    [{list: 'ordered'}, {list: 'bullet'}],
    ['bold', 'italic', 'underline'],
    [{color: []}, {background: []}],
    [{script: 'sub'}, {script: 'super'}],
    [{align: []}],
    ['image', 'blockquote', 'code-block'],
    ['clean']
]

export default function TextEditor() {
    const quillRef = useRef()

    useEffect(() => {
        const editor = document.createElement('div')
        quillRef.current.appendChild(editor)
        new Quill(editor, {theme: 'snow', modules: {toolbar: TOOLBAR_OPTIONS}})

        return () => quillRef.current.innerHTML = null
    }, [])

    return (
        <div className='quill' ref={quillRef}></div>
    )
}