import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign.js';

class ContributeFormComponent extends Component {
    
    state = {
        value: 0,
        loading: false,
        errorMessage: '',
        successMessage: ''
    }
    
    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: '', successMessage: ''});
        try{
            this.setState({loading: false, successMessage: 'Successful contribution' });

            
        }
        catch(error){
            this.setState({loading: false, errorMessage: error.message });
        }

        setTimeout(() => {this.setState({successMessage:'', errorMessage:''})}, 3000);
    }
    render(){
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage}>
                <Form.Field>
                    <label>Amount:</label>
                    <Input
                        label='ETH'
                        labelPosition='right'
                        value={this.state.value}
                        onChange={(event) => this.setState({value: event.target.value }) }/>
                    
                </Form.Field>
                <Button primary loading={this.state.loading}>Contribute </Button>
                <Message error header='Oops!' description={this.state.errorMessage}/>
                <Message success header='Great!' description={this.state.successMessage}/>
            </Form>
        )
    }

}

export default ContributeFormComponent;