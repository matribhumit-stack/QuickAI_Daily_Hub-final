import React, {useState} from 'react'
import Scanner from './components/Scanner'

export default function App(){
  return (
    <div className="app">
      <header className="topbar">
        <h1>QuickScan Prototype</h1>
      </header>
      <main>
        <Scanner />
      </main>
      <footer className="footer">PWA • Demo • Use PWABuilder to package to APK</footer>
    </div>
  )
}
