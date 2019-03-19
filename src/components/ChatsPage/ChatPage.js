import React, { Component } from 'react'
import events from '../../events'
import { Grid } from 'semantic-ui-react'
import Sidebar from './Sidebar';
import MessageHeader from './MessageHeader'
import MessagesBody from './MessagesBody'
import MessageInput from './MessageInput'


export class ChatPage extends Component {

  state = {
    chats: [],
    activeChannel: null
  }

  componentDidMount(){
    let { socket } = this.props
    socket.emit(events.INIT_CHATS, this.initChats )
    socket.on( events.MESSAGE_SEND, this.addMessage )
    socket.on( events.TYPING, this.addTyping )
    socket.on( events.P_MESSAGE_SEND, this.addPMessage )
    socket.on( events.P_TYPING, this.addPTyping)
    socket.on( events.CREATE_CHANNEL, this.updateChats )
  }

  initChats =  _chats  => this.updateChats( _chats, true )
  
  updateChats = ( _chats, init=false ) => {
    let { chats } = this.state
    let newChats = init ? [ ..._chats ] : [ ...chats, _chats ]
    this.setState({ chats: newChats, activeChannel: init ? _chats[0] : this.state.activeChannel })
  }

  addTyping = ({ channel, isTyping, sender }) => {
    let { user } = this.props
    let { chats } = this.state
    if( sender === user.nickname ) return
    chats.map( chat => {
      if( chat.name === channel ){
        if( isTyping && !chat.typingUser.includes( sender )){
          chat.typingUser.push( sender )
        } else if( !isTyping && chat.typingUser.includes( sender )){
          chat.typingUser = chat.typingUser.filter( u => u !== sender )
        }
      }
      return null
    })
    this.setState({ chats })
  }

  addPTyping = ({ channel, isTyping }) => {
    console.log( channel, isTyping )
    let { pChats } = this.props
    pChats.map( pChat => {
      if( pChat.name === channel ){
        pChat.isTyping = isTyping
      }
      return null
    })
    this.setState({ pChats })
  }

  addMessage = ({ channel, message }) => {
    let { activeChannel, chats } = this.state

    chats.map( chat => {
      if( chat.name === channel ) {
        chat.messages.push( message )
        if ( activeChannel.name !== channel ) chat.msgCount ++
      }
      return null
    })
    this.setState({ chats })
  }

  addPMessage = ({ channel, message }) => {
    let { activeChannel } = this.state
    let { pChats } = this.props

    pChats.map( pChat => {
      if( pChat.name === channel ) {
        pChat.messages.push( message )
        if( activeChannel.name !== channel ) pChat.msgCount ++
      }
      return null
    })
    this.setState({ pChats })
  }

  sendMsg = msg => {
    let { socket, users  } = this.props
    let { activeChannel } = this.state
    if( activeChannel.type ) {
      let receiver = users[ activeChannel.name ]
      socket.emit( events.P_MESSAGE_SEND, { receiver, msg })
    } else {
      socket.emit( events.MESSAGE_SEND, { channel: activeChannel.name, msg })
    }

  }

  sendTyping = isTyping => {
    let { socket, users } = this.props
    let { activeChannel } = this.state
    if( activeChannel.type ){
      let receiver = users[ activeChannel.name ]
      socket.emit( events.P_TYPING, { receiver: receiver.socketId, isTyping })
    }
    socket.emit( events.TYPING, { channel: activeChannel.name, isTyping })
  }

  setActiveChannel = name => {
    let newActive = this.state.chats.filter( chat => chat.name === name )
    newActive[0].msgCount = 0
    this.setState({ activeChannel: newActive[0] })
  }

  setActivePChannel = name => {
    let newActive = this.props.pChats.filter( pChat => pChat.name === name )
    newActive[0].msgCount = 0
    this.setState({ activeChannel: newActive[0] })
  }
 
  render() {
    let { user, users, pChats, logout, socket } = this.props
    let { activeChannel, chats } = this.state
    return (
      <Grid style={{ height: '100vh', margin: '0px'}}>
        <Grid.Column computer={4} tablet={ 4 } mobile={6} style={{ background: '#4c3c4c', height: '100%'}}>
          <Sidebar
            user = { user }
            users = { users }
            chats = { chats }
            socket = { socket }
            activeChannel = { activeChannel }
            logout = { logout }
            setActivePChannel = { this.setActivePChannel }
            setActiveChannel = { this.setActiveChannel }
            pChats = { pChats }
          />
        </Grid.Column>
        <Grid.Column computer={12} tablet={ 12 } mobile={10} style={{ background: '#eee', height: '100%'}}>
        {
          activeChannel && (
            <React.Fragment>
              <MessageHeader activeChannel= { activeChannel } />
              <MessagesBody 
                messages = { activeChannel.messages } 
                user={ user } 
                typingUser = { activeChannel.typingUser } />
              <MessageInput 
                sendMsg = { this.sendMsg } 
                sendTyping = { this.sendTyping } />  
            </React.Fragment>
          ) 
        }
        </Grid.Column>
      </Grid>   
    )
  }
}

export default ChatPage
