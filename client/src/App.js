import './App.css';
import React from 'react';

function Message(props){ //function for the client message
    let messagesHTML = []; 
    console.log(props.messages)
    for(let j = 0; j < props.messages.length; j++){ 
        let containerCss;

        if(props.messages[j].name === props.name){ //what side the message is on
            containerCss = "containerLeft"
        }
        else{
            containerCss = "containerRight"
        }

        //defining the HTML for the message
        messagesHTML[j] = <div className = {containerCss}>
                            <div className = "message">
                                <p>{props.messages[j].message}</p>
                                <span className = "UserName"> {props.messages[j].name} </span>
                            </div>
                    </div>
    }
    
    //return the message
    return (<div className = "board"> 
               {messagesHTML}
           </div> 
    )
}


class App extends React.Component {
    constructor(props){
        super(props)
        
        this.state = { //defines the current state
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

    InputOnChange(event){ //set message to the event value
        this.setState({
            message: event.target.value,
        })     
    }

    SendMessage(){ //send the message with the required values in the state
        console.log("sending message")
        this.state.socket.emit('SendMessage', ({message: this.state.message, name: this.state.name}))
        
        this.setState({ //empty the message after sending
            message: ''
        })
    }

    componentDidMount(){
        this.state.socket.on('NewMessage', (data) => { //set up a new message 
            let prevState = this.state.messages //intialize temp var for the messages
            
            prevState.push(data) //push data to new var
            
            this.setState({ //set messages to new var
                messages: prevState
            })
        })
    }

    render(){ //render class for the app
        if(!this.state.isLoggedIn){
            let messagesOnStart = []
            this.state.socket.emit('LogIn', (response) => { //when not logged in will send LogIn to get user set into a chat room
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
        let messages = <Message name = {this.state.name} messages = {this.state.messages}></Message> //create message component

        //return the messages as well as the ways to send a message
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
