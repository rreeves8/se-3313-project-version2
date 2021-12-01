import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class LogIn extends Component{
    constructor(props){
        super(props);
    
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


    logIn(){
        this.state.setName({name: this.state.name})
        this.setState({
            loggedIn: true
        })
    }

    handleChange(event) {
        this.setState({
            name: event.target.value,
        })  
    }

    handleChangeRoom(event) {
        this.setState({
            name: event.target.value,
        })  
    }
    
    render(){ 
        let logIn = <button className = 'entry' onClick = {() => this.logIn()}>LogIn</button>
 
        if(this.state.loggedIn){
            logIn = <Link to ='/App'> LOGIN</Link>
        }

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