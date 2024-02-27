import React, { Component } from 'react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory.js';
import web3 from '../../ethereum/web3.js'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import { Link, Router } from '../../routes.js'

class NewCampaignComponent extends Component
{
    state = {
        campaignName: '',
        minimumContribution: '',
        errorMessage: '',
        successMessage: '',
        loading: false
    }

    onSubmit = async (event) =>{
        
        event.preventDefault();

        this.setState({loading: true, errorMessage: '', successMessage: ''});
        try{
        let accounts = await web3.eth.getAccounts();

        await factory.methods.createCampaign(this.state.campaignName, web3.utils.toWei(this.state.minimumContribution, 'ether'))
                             .send({from: accounts[0], arguments: [event]})
        this.setState({successMessage: `Campaign ${this.state.campaignName} successfully deployed!`})
        setTimeout(() => {
            Router.pushRoute('/')
        }, 3000)
        }catch(error){
            this.setState({errorMessage: error.message })
            this.handleErrorFadeOut();
        }
        
        this.setState({ loading: false});
    }

    handleErrorFadeOut = () => {
        setTimeout(() => {
            this.setState({errorMessage: ''});
        }, 5000)
    }

    render(){
        return (
            <Layout>
                <h3>Create Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage}>
                    <Form.Field>
                        <label>Campaign Name</label>
                        <Input 
                            value={this.state.campaignName}
                            onChange={event => this.setState({campaignName: event.target.value })} />
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label='eth'
                            labelPosition='right'
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({minimumContribution: event.target.value })} /> 
                    </Form.Field>
                    
                    <Message error header='Oops!' content={this.state.errorMessage } />
                    <Message success header='Cool!' content={this.state.successMessage } />
                    <Button primary loading={this.state.loading}> Deploy </Button>
                </Form>
            </Layout>
        )
    }
}

export default NewCampaignComponent;