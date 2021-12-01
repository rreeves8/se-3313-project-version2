import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class LogIn extends Component{ //creating the LogIn component
    constructor(props){
        super(props);
        //setting up initial state
        this.state = {
            name: '',
            selectedRoom: null,
            setName: props.setName,
            loggedIn: false,
            socket: props.socket,
            room: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.logIn = this.logIn.bind(this);
    }


    logIn(){ //sets name to the state name and mark client as logged in
        this.state.setName({name: this.state.name})
        this.setState({
            loggedIn: true
        })
    }

    handleChange(event) { //change name state to event value
        this.setState({
            name: event.target.value,
        })  
    }

    handleChangeRoom(event) {
        this.setState({
            name: event.target.value,
        })  
    }
    
    render(){ //creating the render
        let logIn = <button className = 'entry' onClick = {() => this.logIn()}>LogIn</button> //creating log in button
 
        if(this.state.loggedIn){ //if user is logged in then the button will link to the App page
            logIn = <Link to ='/App'> LOGIN</Link>
        }

        //returns the html for the login page
        return(
            <div class = 'container'>
                <h1> Log In Type </h1>
                <div>
                    <ul>
                        <label>Username : </label>   
                        <input value = {this.state.name} onChange={this.handleChange} type="text" placeholder="Enter Username" name="username" />  
                    </ul>
                    {logIn}
                </div>
            </div>
        );
    }
}


export default LogIn;