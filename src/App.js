import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import Login from './components/Login'
import Profile from './components/Profile';

function App() {
  return (
    <HashRouter>
      <div className="wrapper">
        <Route exact path="/" component={Login} />
        <Route exact path="/profile" component={Profile} />
      </div>
    </HashRouter>
  )
}

export default App;






