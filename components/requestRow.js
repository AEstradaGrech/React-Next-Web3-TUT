import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign.js';
import web3 from '../ethereum/web3.js';
import { Router } from '../routes.js'

class RequestRowComponent extends Component{

    onApprove = async () => {
        console.log(this.props.connectedAccount)
        if(this.props.request.complete) return;
        const campaign = Campaign(this.props.address);
        console.log(campaign)
        try{
            await campaign.methods.voteRequest(this.props.request.name, true).send({from: this.props.connectedAccount});
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
            
        }catch(error){
            this.props.onError(error.message);
        }
    }
    canFinalize(){
        return this.props.request.canSubmit && this.props.connectedAccount === this.props.campaignManager;
    }
    render(){
        const { Row, Cell } = Table;
        return(
            <Row disabled={this.props.request.complete}>
                <Cell ><b>{this.props.request.name}</b></Cell>
                <Cell>{this.props.request.description}</Cell>
                <Cell>{web3.utils.fromWei(this.props.request.amount, 'ether')}</Cell>
                <Cell> {parseInt(this.props.request.approvalsCount)} / {parseInt(this.props.request.requiredApprovals)}</Cell>
                <Cell> <Button color={this.props.request.complete ? 'red' : this.props.request.canSubmit ? 'orange' : 'green'} basic onClick={this.onApprove}>Approve</Button></Cell>
                <Cell> 
                    { this.props.request.complete ? null :
                        <Button disabled={!this.canFinalize() || !this.props.request.canSubmit} color={this.canFinalize() ? 'green' : 'grey'} basic onClick={this.onApprove}>Finalize</Button>
                    }
                </Cell>
            </Row>
        )
    }
}

export default RequestRowComponent;