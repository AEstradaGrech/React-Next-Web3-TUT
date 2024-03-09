import React, { Component } from 'react';
import Layout from '../../../components/layout';
import Campaign from '../../../ethereum/campaign.js';
import { Link } from '../../../routes.js';
import { Grid, Card, Table } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3.js'
import RequestClaimComponent from '../../../components/requestClaimForm.js';


class RequestDetail extends Component{
    static async getInitialProps(props)
    {
        const contract = Campaign(props.query.address);
        const request = await contract.methods.requests(props.query.request).call();
        const claims = await contract.methods.getRequestClaims(request.name).call();
        const accounts = await web3.eth.getAccounts();
        const manager = await contract.methods.getManager().call();
        console.log(':: REQ CLAIMS --> ', claims);
        return { 
            address: props.query.address, 
            requestName: props.query.request,
            description: request.description,
            recipient: request.receiver,
            amount: web3.utils.fromWei(request.amount, 'ether'),
            approvals: parseInt(request.approvalsCount),
            requiredVotes: parseInt(request.requiredApprovals),
            totalClaims: parseInt(request.claimsCount),
            claims: claims,
            isRejected: request.rejected,
            rejectionReason: request.rejectReason,
            connectedAccount: accounts[0],
            managerAddress: manager
        }
    }
    renderHeaderCard() {
        const items = [
            {
                header: this.props.requestName,
                meta: this.props.description,
                fluid: true,
                color: 'green'
            }
        ]
        return <Card.Group items={items}/>
    }
    renderRejectionCard(){
        const items = [
            {
                header: 'Rejected',
                meta: 'This request has been rejected and won\'t be submited. Approvers can get their funds back',
                description: `Reason:\n${this.props.rejectedReason}`,
                color: 'red',
                fluid: true,
                style:{fontWeight:600}
            }
        ]

        return <Card.Group items={items}/>
    }
    renderCards(){
        const {
            recipient,
            amount,
            approvals,
            requiredVotes,
            totalClaims
        } = this.props;

        const items = [
            {
                header: 'Recipient address',
                meta: 'Address we want to send funds to',
                description: recipient,
                style: { overflowWrap: 'break-word'}
            },
            {
                header: 'Funds amount (ETH)',
                meta: 'amount of ether we want to spend in this request',
                description: amount
            },
            {
                header: 'Approvals',
                meta: 'Current approvals count for this request',
                description: approvals
            },
            {
                header: 'Required approvals',
                meta: 'Minimum positive votes for this request to be approved',
                description: requiredVotes
            }
        ]
        return (
            <Card.Group items={items}/>
        )
    }

    render(){
        return(
            <Layout>
                 <Link route={`/campaigns/${this.props.address}/requests`} >
                    {'<<'} Back
                </Link>
                {this.renderHeaderCard()}
                { !this.props.isRejected ? null : this.renderRejectionCard()}
                <Grid>
                    <Grid.Column width={11}>
                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <RequestClaimComponent 
                            reqName={this.props.requestName} 
                            address={this.props.address}
                            connectedAccount={this.props.connectedAccount} 
                            isManagerForm={this.props.connectedAccount === this.props.managerAddress}/>
                    </Grid.Column>
                </Grid>
                {
                    this.props.totalClaims == 0 ? null : 
                    (<Table>

                    </Table>)
                }
                
            </Layout>
        )
    }
}

export default RequestDetail;