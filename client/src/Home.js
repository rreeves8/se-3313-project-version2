import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import LogIn from './LogIn';
import App from './App';
import io from "socket.io-client";
const ENDPOINT = "104.197.128.202:80";

class Home extends React.Component { //creating Home component
    constructor(props){
        super(props)

        let socket = io(ENDPOINT) //setup socket to ENDPOINT

        this.state = { //define the initial state
            data: null,
            socket: socket
        }
    }
    
    //setName is defined as a function that sets data state to the reveived data
    setName = (data) => {
        this.setState({
            data: data
        })
    }
    
    render(){ //return the Components used in building the home page
        return (
            <Router>
                <Switch> 
                    <Route exact path='/'>
                        <LogIn socket = {this.state.socket} setName = {this.setName}/>
                    </Route>
                    <Route exact path='/App'>
                        <App socket = {this.state.socket} data = {this.state.data}/>
                    </Route>
                </Switch>
            </Router>
        )    
    }
}
export default Home;