import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign.js';
import web3 from '../ethereum/web3.js';
import { Router } from '../routes.js';

class AddFundsFormComponent extends Component {
    
    state = {
        value: 0,
        loading: false,
        loadingCancel: false,
        errorMessage: '',
        successMessage: ''
    }
    //componentDidMount() -> campaignInstance
    onSubmit = async (event) => {
        event.preventDefault();
        let bShouldRefresh = false;
        this.setState({loading: true, errorMessage: '', successMessage: ''});
        if(this.state.value > 0)
        {
            try{
                let campaign = Campaign(this.props.address);
                let accounts = await web3.eth.getAccounts();
                await campaign.methods.addFunds().send({from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')});
                this.setState({loading: false, successMessage: 'Funds added to campaign', value: 0 });
                bShouldRefresh = true;
                
            }
            catch(error){
                this.setState({loading: false, errorMessage: error.message });
            }
        }

        else this.setState({loading: false, errorMessage: 'Invalid input. The amount of funds to send must be grater than 0'})

        this.handleMessageFadeOut(bShouldRefresh);
        
    }

    onCancel = async () => {
        this.setState({loadingCancel: true, errorMessage: '', successMessage: ''});
        let bShouldRefresh = false; 
        try{
            let accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.cancelCampaign().send({from: accounts[0]});
            this.setState({loadingCancel:false, successMessage: 'This campaign has been successfully cancelled'});
            bShouldRefresh = true; 
        }catch(error){
            this.setState({loadingCancel: false, errorMessage: error.message});
        }
        this.handleMessageFadeOut(bShouldRefresh);
    }

    handleMessageFadeOut(bShouldRefresh){
        setTimeout(() => {
            this.setState({successMessage:'', errorMessage:''})
            if(bShouldRefresh)
                Router.replaceRoute(`/campaigns/${this.props.address}`);
        }, 3500);
    }
    render(){
        return (
            <Form error={!!this.state.errorMessage} success={!!this.state.successMessage}>
                <Form.Field>
                    <label>Amount:</label>
                    <Input
                        disabled={this.props.isCancelled}
                        label='ETH'
                        labelPosition='right'
                        value={this.state.value}
                        onChange={(event) => this.setState({value: event.target.value }) }/>
                    
                </Form.Field>
                <Button disabled={this.props.isCancelled} 
                        color='red' 
                        basic 
                        loading={this.state.loadingCancel} 
                        onClick={this.onCancel}
                        floated='left' 
                        style={{marginLeft:'55px', width:'30%'}}>Cancel </Button>
                <Button disabled={this.props.isCancelled} 
                        primary 
                        basic 
                        onClick={this.onSubmit}
                        loading={this.state.loading} 
                        floated='right' 
                        style={{marginRight: '55px', width:'30%'}}>Send Funds </Button>
                <Message error header='Oops!' content={this.state.errorMessage}/>
                <Message success header='Great!' content={this.state.successMessage}/>
            </Form>
        )
    }

}

export default AddFundsFormComponent;