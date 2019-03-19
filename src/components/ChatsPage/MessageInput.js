import React, { Component } from 'react'
import { Segment, Form, Icon } from 'semantic-ui-react';

export class MessageInput extends Component {
  state = {
    msg: ''
  }

  handleChange = e => this.setState({ msg: e.target.value })

  handleSubmit = () => {
    this.props.sendMsg( this.state.msg )
    this.setState({ msg: '' })
  }

  handleOnFocused = () => this.props.sendTyping( true )

  handleOnBlur = () => this.props.sendTyping( false )

  render() {
    let { msg } = this.state 
    return (
      <Segment>
        <Form onSubmit={msg.length > 0 ? this.handleSubmit : null }>
          <Form.Input
            fluid
            name='msg'
            value={msg}
            placeholder='Write your message'
            onChange={this.handleChange}
            onFocus = {this.handleOnFocused}
            onBlur = {this.handleOnBlur}
            icon={<Icon 
              name='send' 
              link 
              circular 
              inverted 
              onClick={ this.handleSubmit }
              disabled = { msg.length < 1 } 
            />}
          />
        </Form>
      </Segment>
    )
  }
}

export default MessageInput
