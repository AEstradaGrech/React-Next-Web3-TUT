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
      
        return { 
            address: props.query.address, 
            requestName: props.query.request,
            description: request.description,
            recipient: request.receiver,
            amount: web3.utils.fromWei(request.amount, 'ether'),
            approvals: parseInt(request.approvalsCount),
            rejections: parseInt(request.rejectionsCount),
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
                meta: 'This request has been rejected and won\'t be submited.',
                description: `Reason:\n${this.props.rejectionReason}`,
                color: 'red',
                fluid: true,
                style:{fontWeight:600}
            }
        ]

        return <Card.Group items={items}/>
    }
    renderRejectionsCountCard(){
        const items = [
            {
                header: 'Votes for rejection',
                meta: `${this.props.rejections} contributors have voted for rejection`,
                color: 'orange',
                fluid: true,
                style:{fontWeight:400}
            }
        ]

        return <Card.Group items={items}/>
    }
    renderPendingFinalizeCard() {
        const items =[
            {
                header:'Pending Finalize',
                meta: 'This request has the minimum votes to be approved and will be soon finalized',
                color: 'orange',
                fluid: true,
                style: {fontWeight: 600}
            }
        ]

        return <Card.Group items={items}/>
    }
    renderCards(){
        const {
            recipient,
            amount,
            approvals,
            requiredVotes
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
    renderClaimRows(){
        const { Row, Cell } = Table;
        return this.props.claims.map(element => {
            return(
                <Row>
                    <Cell style={{fontWeight: 600}}>{element.contributor}</Cell>
                    <Cell>{element.description}</Cell>
                </Row>
            )
        })
    }
    render(){
        const { HeaderCell, Header, Row, Body } = Table;
        return(
            <Layout>
                 <Link route={`/campaigns/${this.props.address}/requests`}>
                    {'<<'} Back
                </Link>
                {this.renderHeaderCard()}
                { !this.props.isRejected ? null : this.renderRejectionCard()}
                { this.props.approvals >= this.props.requiredVotes ? this.renderPendingFinalizeCard() : null}
                { !this.props.isRejected && !this.props.complete && this.props.rejections > 0 ? this.renderRejectionsCountCard() : null}
                <Grid>
                    <Grid.Column width={11}>
                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <RequestClaimComponent 
                            reqName={this.props.requestName} 
                            address={this.props.address}
                            isRejected={this.props.isRejected}
                            connectedAccount={this.props.connectedAccount} 
                            isManagerForm={this.props.connectedAccount === this.props.managerAddress}/>
                    </Grid.Column>
                </Grid>
                {
                    this.props.totalClaims == 0 ? null : 
                    (
                    <Table>
                        <Header>
                            <Row>
                                <HeaderCell colSpan='2' style={{textAlign:'center', backgroundColor: '#dd930b'}}>Request Claims</HeaderCell>
                                
                            </Row>
                        </Header>
                        <Body>
                            <Row style={{textAlign:'center'}}>
                                <HeaderCell style={{paddingTop: '10px', paddingBottom: '10px'}}>Contributor</HeaderCell>
                                <HeaderCell style={{paddingTop: '10px', paddingBottom: '10px'}}>Description</HeaderCell>
                            </Row>
                            {this.renderClaimRows()}
                        </Body>
                    </Table>)
                }
                
            </Layout>
        )
    }
}

export default RequestDetail;