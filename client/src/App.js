import './App.css';
import React from 'react';
import io from "socket.io-client";
const ENDPOINT = "127.0.0.1:3001";


function Message(props){
    let messagesHTML = []; 
    console.log(props.messages)
    for(let j = 0; j < props.messages.length; j++){ 
        let containerCss;

        if(props.messages[j].name === props.name){
            containerCss = "containerLeft"
        }
        else{
            containerCss = "containerRight"
        }

        messagesHTML[j] = <div className = {containerCss}>
                            <div className = "message">
                                <p>{props.messages[j].message}</p>
                                <span className = "UserName"> {props.messages[j].name} </span>
                            </div>
                    </div>
    }
    
    return (<div className = "board"> 
               {messagesHTML}
           </div> 
    )
}


class App extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
            socket: props.socket,
            messages: new Array(),
            isLoggedIn: false,
            message: '',
            name: props.data.name,
            roomNum: null
        }

        console.log(this.state.messages)

        this.SendMessage = this.SendMessage.bind(this)
        this.InputOnChange = this.InputOnChange.bind(this)
    }

    InputOnChange(event){
        this.setState({
            message: event.target.value,
        })     
    }

    SendMessage(){
        console.log("sending message")
        this.state.socket.emit('SendMessage', ({message: this.state.message, name: this.state.name}))
        
        this.setState({
            message: ''
        })
    }

    componentDidMount(){
        this.state.socket.on('NewMessage', (data) => {
            let prevState = this.state.messages
            
            prevState.push(data)
            
            this.setState({
                messages: prevState
            })
        })
    }

    render(){
        if(!this.state.isLoggedIn){
            let messagesOnStart = []
            this.state.socket.emit('LogIn', (response) => {
                console.log(response.messages)
                messagesOnStart = response.messages
                this.setState({
                    isLoggedIn: true,
                    messages: messagesOnStart,
                    roomNum: response.roomNum
                })
            })
        }

        console.log(this.state.messages)
        let messages = <Message name = {this.state.name} messages = {this.state.messages}></Message>

        return (
            <div className="App">
                <header className="App-header"> Room Number: {this.state.roomNum}
                </header>
                    <div>
                        {messages}
                        <div>
                            <input value = {this.state.message} onChange={this.InputOnChange} type="text" placeholder="Enter Username" name="username" />
                            <button className = 'entry' onClick = {() => this.SendMessage()}>Send</button> 
                        </div>
                </div>
            </div>
        );  
    }
}

export default App;
