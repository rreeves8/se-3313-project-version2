import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import LogIn from './LogIn';
import App from './App';
import io from "socket.io-client";
const ENDPOINT = "127.0.0.1:3001";

class Home extends React.Component {
    constructor(props){
        super(props)

        let socket = io(ENDPOINT)

        this.state = {
            data: null,
            socket: socket
        }
    }
    
    setName = (data) => {
        this.setState({
            data: data
        })
    }
    
    render(){
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