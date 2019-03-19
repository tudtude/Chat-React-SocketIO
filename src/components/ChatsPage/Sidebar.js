import React, { Component } from 'react'
import events from '../../events'
import { Menu, Header, Icon, Button, Label, Modal, Form, Input, Message } from 'semantic-ui-react'
import Loader from 'react-dots-loader'
import 'react-dots-loader/index.css'

export class Sidebar extends Component {

  state = {
    modal: false,
    channelName: '',
    channelDescription: '',
    error: null
  }

  displayChannels = chats => (
    chats.map(chat => (
      <Menu.Item
        key={chat.name}
        onClick={() => this.props.setActiveChannel(chat.name)}
        active={this.props.activeChannel.name === chat.name}
      >
        # {chat.name}
        {chat.msgCount > 0 && <Label size='mini' color='red'> {chat.msgCount} </Label>}
      </Menu.Item>
    ))
  )

  displayUsers = users => {
    let { user, setActivePChannel, pChats, activeChannel } = this.props
    delete users[user.nickname]
    users = Object.assign({ 'You...': user }, users)
    return Object.keys(users).map(user => {
      let pChat = pChats.filter(pchat => pchat.name === user)
      let msgCount = null
      if (pChat[0] && pChat[0].name !== activeChannel.name) {
        if (pChat[0].msgCount > 0) {
          msgCount = pChat[0].msgCount
        }
      }
      return (
        <Menu.Item
          key={user}
          onClick={(user === 'You...') ? null : () => setActivePChannel(user)}
          active={this.props.activeChannel.name === user}
        >
          # {user[0].toUpperCase() + user.slice(1)}
          <Loader
            style={{ marginLeft: '10px' }}
            size={4} color='grey' distance={3}
            visible={pChat[0] ? pChat[0].isTyping : false} />
          {msgCount && <Label size='mini' color='red'> {msgCount} </Label>}
        </Menu.Item>
      )
    })
  }

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false, channelName: '', channelDescription: '', error: null })

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  isFormValid = ({ channelDescription, channelName }) => {
    if (channelDescription && channelName) {
      this.setState({ error: null })
      return true
    } else {
      this.setState({ error: 'Both Name and Description are require ' })
      return false
    }
  }

  handleSubmit = () => {
    this.setState({ error: null })
    let { channelDescription, channelName } = this.state
    if (this.isFormValid(this.state)) {
      let { socket } = this.props
      socket.emit(events.CHECK_CHANNEL, { channelName, channelDescription }, this.checkChannel)
    }
  }

  checkChannel = isChannel => {
    isChannel ? this.setState({ error: `Channel "${ this.state.channelName }" name alredy take` }) :
    this.closeModal()
  }

  render() {
    let { user, users, chats, logout } = this.props
    let { modal, error } = this.state
    return (
      <React.Fragment>
        <Menu
          style={{ background: '#4c3c4c', paddingTop: '2em' }}
          vertical
          inverted
          fluid
          stackable
          size='large'
        >

          <Header inverted as='h3'>
            <Icon name='chat' />
            <Header.Content> Simple Chat </Header.Content>
            <Header.Subheader>
              Login as : {user.nickname[0].toUpperCase() + user.nickname.slice(1)}
            </Header.Subheader>
          </Header>
          <Menu.Menu>
            <Menu.Item style={{ paddingLeft: '0' }}>
              <span style={{ fontSize: '1.2em' }}>
                <Icon name='bullhorn' /> Channel lists
              </span>
              <Icon name='add' onClick={this.openModal} />
            </Menu.Item>
            {chats[0] && this.displayChannels(chats)}
          </Menu.Menu>
          <br />
          <Menu.Menu>
            <Menu.Item style={{ paddingLeft: '0' }}>
              <span style={{ fontSize: '1.2em' }}>
                <Icon name='address book' /> Online Users
              </span>
            </Menu.Item>
            {(users && chats[0]) && this.displayUsers(users)}
          </Menu.Menu>
          <br />
          <Menu.Menu>
            <Menu.Item style={{ paddingLeft: '0' }}>
              <Button
                icon
                inverted
                labelPosition='right'
                onClick={logout}
              >
                <Icon name='sign-out alternate' />
                LogOut
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Modal open={modal} size='small'  >
          <Header icon='bullhorn' content='Add new Channel' />
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  placeholder='Channel Name'
                  name='channelName'
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  name='channelDescription'
                  placeholder='Channel Description'
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
            {
              error && (
                <Message error >
                  <h4>Error</h4>
                  {this.state.error}
                </Message>
              )
            }
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
            <Button color='green' inverted onClick={this.handleSubmit}>
              <Icon name='checkmark' /> Add
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default Sidebar
