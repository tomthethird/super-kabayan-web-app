import "./App.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Savings from "./components/Savings-main";
import Payment from "./components/Payment";
import Development from "./components/Development";
import MissingPage from "./components/404";
import SavingsItem from "./components/Savings-item";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  // const verify = async () => {
  //   try {
  //     const response = await fetch("https://superkabayan-server.herokuapp.com/auth/verify", {
  //       method: 'GET',
  //       headers: {Authorization: localStorage.getItem('token')}
  //     });
  //     const parseRes = await response.json();
  //     if(parseRes.uuid) {
  //       return true;
  //     } else{
  //       return false;
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    //router to redirect and check authentication
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={ !isAuthenticated ? ( <Home setAuth={setAuth} /> ) : (
                  <Navigate to="/dashboard" /> ) }></Route>

            <Route exact path="/login" element={ !isAuthenticated ? ( <Login setAuth={setAuth} /> ) : (
                  <Navigate to="/dashboard" /> ) }></Route>

            <Route exact path="/dashboard" element={<Dashboard/> }></Route>

            {/* <Route exact path="/dashboard" element={ isAuthenticated ? ( <Dashboard setAuth={setAuth}/> ) : (
                  <Navigate to="/login"/> ) }></Route> */}

            <Route exact path="/profile" element={  <Profile />}></Route>
            <Route exact path="/savings" element={ <Savings /> }></Route>
            <Route eaxct path="/savings/:id" element={ <SavingsItem /> }></Route>
            <Route exact path="/settings" element={ <Settings /> }></Route>
            <Route exact path="/payments" element={ <Payment /> }></Route>
            <Route exact path="/development" element={ <Development /> }></Route>
            <Route exact path="*" element={ <MissingPage /> }></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
