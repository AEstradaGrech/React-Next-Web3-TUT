import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Layout from '../../../components/layout.js';
import Campaign from '../../../ethereum/campaign.js'

class NewRequest extends Component {
    state = {
        name: '',
        description:'',
        amount: '',
        requiredVotes: '',
        recipient:'',
        errorMessage: '',
        successMessage: '',
        loading: false
    }

    onSubmit = async event => {
        event.preventDefault()
    }

    render(){
        return(
            <Layout>
                <h3>New Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage}>
                    <label>Name</label>
                    <Form.Field>
                        <Input 
                            value={this.state.name}
                            onChange={event => this.setState({name: event.target.value })}
                            />
                    </Form.Field>
                    <label>Description</label>
                    <Form.Field>
                        <Input 
                            value={this.state.description}
                            onChange={event => this.setState({description: event.target.value })}
                            />
                    </Form.Field>
                    <label>Amount</label>
                    <Form.Field>
                        <Input 
                            value={this.state.amount}
                            onChange={event => this.setState({amount: event.target.value })}
                            />
                    </Form.Field>
                    <label>Required Approvals</label>
                    <Form.Field>
                        <Input 
                            value={this.state.requiredVotes}
                            onChange={event => this.setState({requiredVotes: event.target.value })}
                            />
                    </Form.Field>
                    <label>Recipient</label>
                    <Form.Field>
                        <Input 
                            value={this.state.recipient}
                            onChange={event => this.setState({recipient: event.target.value })}
                            />
                    </Form.Field>
                    <Message error header='Oops!' content={this.state.errorMessage}/>
                    <Message success header='Perfect!' content={this.state.successMessage}/>
                    <Button primary loading={this.state.loading} >Create</Button>
                </Form>
            </Layout>
        )
    }
}

export default NewRequest;