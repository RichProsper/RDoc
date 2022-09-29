import React from 'react'
import TextEditor from './components/TextEditor'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
    return (
        <Router>
            <TextEditor />
        </Router>
    )
}
  
export default App