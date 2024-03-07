import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign.js';
import web3 from '../ethereum/web3.js';
import { Router, Link } from '../routes.js'

class RequestRowComponent extends Component{

    state = {
        loadingFinalize:false,
        loadingApprove: false
    }
    onApprove = async () => {
        if(this.props.request.complete) return;
        const campaign = Campaign(this.props.address);
        this.setState({loadingApprove: true});
        try{
            await campaign.methods.voteRequest(this.props.request.name, true).send({from: this.props.connectedAccount});
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
            
        }catch(error){
            this.props.onError(error.message);
        }
        this.setState({loadingApprove: false});
    }
    onFinalize = async () =>{
        if(!this.props.request.canSubmit) return;
        const campaign = Campaign(this.props.address);
        this.setState({loadingFinalize:true});
        try{
            await campaign.methods.submitRequest(this.props.request.name)
                .send({from: this.props.connectedAccount});
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        }catch(error){
            this.props.onError(error.message);
        }
        this.setState({loadingFinalize:false});
    }
    canFinalize(){
        return this.props.request.canSubmit && this.props.connectedAccount === this.props.campaignManager;
    }
    render(){
        const { Row, Cell } = Table;
        return(
            <Row disabled={this.props.request.complete}>
                <Cell >
                    <Link route={`/campaigns/${this.props.address}/requests/${this.props.request.name}`}>
                        <b>{this.props.request.name}</b>
                    </Link>
                </Cell>
                <Cell>{this.props.request.description}</Cell>
                <Cell>{web3.utils.fromWei(this.props.request.amount, 'ether')}</Cell>
                <Cell> {parseInt(this.props.request.approvalsCount)} / {parseInt(this.props.request.requiredApprovals)}</Cell>
                <Cell style={{color:'red', fontWeight:600}}>{0}</Cell>
                <Cell> 
                    <Button disabled={this.props.connectedAccount === this.props.campaignManager} 
                            color={this.props.request.complete ? 'red' : this.props.request.canSubmit ? 'orange' : 'green'} 
                            loading={this.state.loadingApprove}
                            basic 
                            onClick={this.onApprove}>Approve
                    </Button>
                </Cell>
                <Cell> 
                    { this.props.request.complete ? null :
                        <Button disabled={!this.canFinalize() || !this.props.request.canSubmit} color={this.canFinalize() ? 'green' : 'grey'} 
                                loading={this.state.loadingFinalize}
                                basic 
                                onClick={this.onFinalize}>Finalize</Button>
                    }
                </Cell>
            </Row>
        )
    }
}

export default RequestRowComponent;