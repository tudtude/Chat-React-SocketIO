import React, { Component } from 'react'
import event from  '../../events'
import { Grid, Header, Icon, Form, Message } from 'semantic-ui-react';

export class LoginPage extends Component {
  state = {
    nickname: '',
    error: ''
  }
  
  isvalid = ({ nickname }) => nickname

  setUser = ({ user, isUser }) =>  {
    if( isUser ) {
      this.setState({ error: 'This nickname already taken'})
    } else {
      this.setState({ error : '' })
      this.props.setUser( user )
    }
  }

  handleChange = e => {
    this.setState({ nickname: e.target.value })
  }

  
  handleSubmit = () => {
    let { socket } = this.props
    let { nickname } = this.state
    this.isvalid( this.state ) ? socket.emit( event.IS_USER, nickname, this.setUser ) :
    this.setState({ error : 'Please input your nickname'})
  }

  render() {
    return (
      <Grid
        style={{ height: '100vh', padding: '0px', margin: '0px' }}
        textAlign='center'
        verticalAlign='middle'
      >
        <Grid.Column computer={ 6 } tablet={ 8 } mobile={ 14 } >
          <Header as='h2' icon textAlign='center' color='blue'>
            <Icon name='discussions' />
            Simple Chats.
          </Header>
          <Form size='small' onSubmit={this.handleSubmit}>
            <Form.Input 
              name='nickname'
              type='text'
              placeholder='Your nickname !'
              onChange={this.handleChange}
              autoFocus
              icon={<Icon name='add user' link circular inverted onClick={ this.handleSubmit } />}
            />
            { this.state.error && (
              <Message negative>{ this.state.error }</Message>
            )}
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

export default LoginPage
