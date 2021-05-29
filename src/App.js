import React from 'react'
import { HashRouter/*, Redirect*/, Route } from 'react-router-dom'
import Login from './components/Login'
import Profile from './components/Profile';

/*uuid*/

// function App() {
//   return (
//     <HashRouter>
//       <div className="wrapper">
//         <Route path="/" exact /*component={Login}*/ render={() => !localStorage.getItem('isAuthenticated') ? <Login /> : <Profile />} />
//         <Route path="/profile" exact /*component={Profile}*/ render={() => !localStorage.getItem('isAuthenticated') ? <Login /> : <Profile />} />
//       </div>
//     </HashRouter>
//   )
// }

function App() {
  return (
    <HashRouter>
      <div className="wrapper">
        <Route exact path="/" component={Login}/*render={() => !localStorage.getItem('isAuthenticated') ? <Login /> : <Profile />}*/>
          {/* {!localStorage.getItem('isAuthenticated') ? <Login /> : <Redirect to='/profile' />} */}
        </Route>
        <Route exact path="/profile" component={Profile}/*render={() => !localStorage.getItem('isAuthenticated') ? <Login /> : <Profile />}*/>
          {/* {localStorage.getItem('isAuthenticated') ? <Profile /> : <Redirect to='/' />} */}
        </Route>
      </div>
    </HashRouter>
  )
}

export default App;






