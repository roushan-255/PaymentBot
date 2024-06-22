import React from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import EventSource from 'eventsource';
import axios from 'axios';
import logo from './amazonlogo.png';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.listenNewMessages = this.listenNewMessages.bind(this);
        this.handleNewUserMessage = this.handleNewUserMessage.bind(this);
    }

    componentDidMount() {
        addResponseMessage("Bot: Hello! I'm here to help you with tracking your expenses and managing your payments. How can I assist you today?");
        this.listenNewMessages();
    }

    listenNewMessages() {
        let es = new EventSource("/index/routeMessage", { proxy: "http://localhost:3001" });
        es.addEventListener(this.props.listeningEvent, function (e) {
            let _data = JSON.parse(e.data);
            addResponseMessage(_data.userId + ": " + _data.message);
        });
    }

    handleNewUserMessage(message) {
        const lowerCaseMessage = message.toLowerCase();
        axios.post('/index/sendMessage', {
            message: message,
            userId: this.props.userId
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <Widget
                    handleNewUserMessage={this.handleNewUserMessage}
                    // badge={badge}
                    profileAvatar={logo}
                    title={"Expense Tracker Assistant"}
                    subtitle={"Your personal expense tracker and payment assistant"}
                />
            </div>
        );
    }
}

export default Chat;
