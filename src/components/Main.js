import React, { Component } from 'react'
import io from 'socket.io-client'
import events from '../events'
import ChatPage from '../components/ChatsPage/ChatPage'
import LoginPage from '../components/LoginPage/LoginPage'


// ***** it will used in dev mode
// const socketUrl = 'http://localhost:4000/'
// in dev environment replace 4000 with the custom port specified in server/index.js
const socketUrl = '/'

export class Main extends Component {
    state = {
        socket: null,
        user: null,
        users: {},
        pChats: []
    }

    componentDidMount() {
        this.initSocket()
    }

    initSocket = () => {
        let socket = io( socketUrl )
        this.setState({ socket })
        socket.on('connect', () => console.log( 'Connected'))
        socket.on( events.LOGOUT, this.setUsers( false ))
        socket.on( events.NEW_USER, this.setUsers( true ))
    }

    setUser = user => {
        let { socket } = this.state
        this.setState({ user })
        socket.emit( events.NEW_USER, user )
    }

    setUsers = isNewUsers => ({ newUsers, outUser }) => {
        let { user, pChats } = this.state
        if( isNewUsers ){
            let newPChats = [...pChats]
            let oldPChats = pChats.map( pChat => pChat.name ) 
            user && Object.keys( newUsers ).map( newUser => {
                if( newUser !== user.nickname && !oldPChats.includes( newUser )){
                    newPChats.push({
                        name: newUser,
                        description: 'direct message',
                        messages: [],
                        isTyping: false,
                        msgCount: 0,
                        type: 'Private'
                    })
                }
                return null
            }) 
            this.setState({ users : newUsers, pChats: newPChats  })
        } else {
            let newPChats = pChats.filter( pChat => pChat.name !== outUser )
            this.setState({ users: newUsers, pChats: newPChats })
        }
    }

    logout = () => {
        let { socket } = this.state
        socket.emit( events.LOGOUT )
        this.setState({ user: null }) 
    }

    render() { 
        let { user, users, pChats, socket } = this.state
        return (
            user ? 
            <ChatPage 
                user = { user }
                users = { users }
                pChats = { pChats }
                socket = { socket }
                logout = { this.logout }
            /> : 
            <LoginPage socket={socket} setUser={this.setUser} />
        )
    }
}

export default Main
