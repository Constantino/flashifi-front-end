import { useState, useEffect } from 'react'
import './App.css'
import { Headers } from './components/Headers';
import { ContentBox } from './components/ContentBox';

function App() {

  return (
    <div className="app-wrapper">

      <Headers />

      <main className="main-content">
        <ContentBox />
      </main>
    </div>
  )
}

export default App
