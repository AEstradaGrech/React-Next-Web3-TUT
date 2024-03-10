import React, { Component } from 'react';
import { Card, Table, Button, Message } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign.js'
import Layout from '../../../components/layout.js';
import { Link } from '../../../routes.js'
import web3 from '../../../ethereum/web3.js'
import RequestRowComponent from '../../../components/requestRow.js';

class RequestsIndex extends Component {

    state = {
        errorMessage:''
    }
    static async getInitialProps(props)
    {
        const accounts = await web3.eth.getAccounts();

        const campaign = Campaign(props.query.address);
        let manager = await campaign.methods.getManager().call()
        const summary = await campaign.methods.getSummary().call();
        const reqs = await campaign.methods.getRequests().call();
        const requests = await Promise.all(
            Array(reqs.length).fill().map((element, index) => {
                return campaign.methods.requests(reqs[index].name).call();
            })
        )
        return { 
            address: props.query.address,
            connectedAccount: accounts[0],
            campaignManager: manager,
            requests: requests,
            cancelled: summary.isCancelled
        }
    }

    handleErrorMessage = (message) => {
        this.setState({errorMessage: message})
        setTimeout(() => {this.setState({errorMessage: ''})}, 5000)
    }

    renderCards(){
        const items = this.props.requests.map(req => {
            return {
                header: req.name,
                meta: req.description,
                description: <Link route={`/campaigns/${this.props.address}/requests/${req.name}`}>View Details</Link>,
                fluid: true
            }
        });

        return <Card.Group items={items}/>
    }
    renderTableRows(){
        return this.props.requests.map((req, idx) => {
            console.log(req);
            return <RequestRowComponent
                    key={idx}
                    address={this.props.address}
                    connectedAccount={this.props.connectedAccount}
                    campaignManager={this.props.campaignManager}
                    request={req}
                    campaignCancelled={this.props.cancelled}
                    onError={this.handleErrorMessage}/>
        })
    }
    render(){
        const { Header, Row, HeaderCell, Body } = Table;
        return(
            <Layout>
                <Link route={`/campaigns/${this.props.address}`} >
                    {'<<'} Back
                </Link>
                <h3>Campaign Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <Button
                        floated='right'
                        style={{marginBotton: '10px'}}
                        primary
                        content="Add Request"
                        icon="add circle"/>
                </Link>
                {
                    this.state.errorMessage === '' ? null :
                    <Message error header='Oops!' content={this.state.errorMessage}/>
                }
                
                <Table style={{textAlign:'center'}}>
                    <Header>
                        <Row>
                            <HeaderCell>Name</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (ETH)</HeaderCell>
                            <HeaderCell>Approvals</HeaderCell>
                            <HeaderCell>Claims</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            { this.props.connectedAccount === this.props.campaignManager ?
                                <HeaderCell>Finalize</HeaderCell> :
                                <HeaderCell>Reject</HeaderCell>
                            }
                        </Row>
                    </Header>
                    <Body>
                        {this.renderTableRows()}
                    </Body>
                </Table>
            </Layout>
            
        )
    }
}

export default RequestsIndex;