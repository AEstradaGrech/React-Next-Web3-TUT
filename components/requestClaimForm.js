import React, { Component } from 'react';
import { Form, TextArea, Button, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign.js';
import { Router } from '../routes.js';

class RequestClaimComponent extends Component{
    state = {
        text: '',
        loading: false,
        errorMessage:'',
        successMessage: ''
    }
    onSubmit = async (event) => {
        event.preventDefault();

        if(this.state.text.length === 0) return;

        this.setState({loading: true, errorMessage: '', successMessage: ''});
        try{
            const campaign = Campaign(this.props.address);
            let successMsg = '';
            if(this.props.isManagerForm){
                successMsg = `${this.props.reqName} has been marked as rejected`;
                await campaign.methods.rejectRequest(this.props.reqName, this.state.text).send({from: this.props.connectedAccount});
            }   
            else{
                successMsg = 'We hear you bro. But we don\'t give a fuck';
                await campaign.methods.claimRequest(this.props.reqName, this.state.text).send({from: this.props.connectedAccount});
            }
            
            this.setState({loading: false, successMessage: successMsg, text:''});
            Router.replaceRoute(`/campaigns/${this.props.address}/requests/${this.props.reqName}`);
        }catch(error){
            this.setState({loading:false, errorMessage: error.message})
        }

        this.handleMessageFadeOut();
    }

    handleMessageFadeOut(){
        setTimeout(() => {
            this.setState({errorMessage: '', successMessage: ''});
        }, 5000)
    }
    render(){
        return (
            <Form error={!!this.state.errorMessage} success={!!this.state.successMessage}>
                <TextArea 
                    disabled={this.props.isRejected}
                    placeholder={this.props.isManagerForm ? 'Reason...' : 'Drop your shit...'}
                    value={this.state.text}
                    onChange={(event) => this.setState({text: event.target.value})}
                    />
                <Button 
                    basic 
                    color='orange'
                    loading={this.state.loading}
                    onClick={this.onSubmit}
                    style={{marginTop: '10px', marginLeft: '128px'}}
                    content={this.props.isManagerForm ? 'Reject':'Claim'}
                    disabled={this.props.isRejected}
                    />
                <Message error header='Oops!' content={this.state.errorMessage}/>
                <Message success header='Nice' content={this.state.successMessage}/>
            </Form>
        )
    }
}

export default RequestClaimComponent;