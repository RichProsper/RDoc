import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'

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
    const [socket, setSocket] = useState(null)
    const [quill, setQuill] = useState(null)
    const { docId } = useParams()

    const quillRef = useRef()

    useEffect(() => {
        const socket_ = io('http://localhost:3001')
        setSocket(socket_)
        
        const quillCurrent = quillRef.current
        const editor = document.createElement('div')
        
        quillCurrent.appendChild(editor)
        const quill_ = new Quill(editor, {theme: 'snow', modules: {toolbar: TOOLBAR_OPTIONS}})
        quill_.disable()
        quill_.setText('Loading...')
        setQuill(quill_)

        return () => {
            socket_.disconnect()
            quillCurrent.innerHTML = null
        }
    }, [])

    useEffect(() => {
        if (socket === null || quill === null) return

        socket.once('load-document', document => {
            quill.setContents(document)
            quill.enable()
        })

        socket.emit('get-document', docId)
    }, [socket, quill, docId])

    useEffect(() => {
        if (socket === null || quill === null) return

        const textChange = (delta, oldDelta, source) => {
            if (source !== 'user') return
            socket.emit('send-changes', delta)
            socket.emit('save-document', quill.getContents())
        }

        quill.on('text-change', textChange)

        return () => quill.off('text-change', textChange)
    }, [socket, quill])

    useEffect(() => {
        if (socket === null || quill === null) return
        
        const receiveChanges = delta => {
            quill.updateContents(delta)
        }

        socket.on('receive-changes', receiveChanges)

        return () => socket.off('receive-changes', receiveChanges)
    }, [socket, quill])

    return (
        <div className='quill' ref={quillRef}></div>
    )
}