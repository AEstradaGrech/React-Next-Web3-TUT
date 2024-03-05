import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign.js';
import web3 from '../ethereum/web3.js';
import { Router } from '../routes.js';

class ContributeFormComponent extends Component {
    
    state = {
        value: 0,
        loading: false,
        errorMessage: '',
        successMessage: ''
    }
    //componentDidMount() -> campaignInstance
    onSubmit = async (event) => {
        event.preventDefault();
        let bShouldRefresh = false;
        this.setState({loading: true, errorMessage: '', successMessage: ''});
        if(this.state.value >= this.props.minContribution)
        {
            try{
                let campaign = Campaign(this.props.address);
                let accounts = await web3.eth.getAccounts();
                await campaign.methods.contribute().send({from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')});
                this.setState({loading: false, successMessage: 'Successful contribution' });
                bShouldRefresh = true;
                
            }
            catch(error){
                this.setState({loading: false, errorMessage: error.message });
            }
        }

        else this.setState({loading: false, errorMessage: 'You are not reaching the minimum contribution to join this campaign'})

        setTimeout(() => {
            this.setState({successMessage:'', errorMessage:''})
            if(bShouldRefresh)
                Router.replaceRoute(`/campaigns/${this.props.address}`);
        }, 3500);
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
                <Message error header='Oops!' content={this.state.errorMessage}/>
                <Message success header='Great!' content={this.state.successMessage}/>
            </Form>
        )
    }

}

export default ContributeFormComponent;