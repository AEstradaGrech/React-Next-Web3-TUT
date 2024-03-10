import React, { Component } from 'react';
import { Form, Button, Message, Input, Checkbox } from 'semantic-ui-react';
import Layout from '../../../components/layout.js';
import Campaign from '../../../ethereum/campaign.js'
import web3 from '../../../ethereum/web3.js'
import { Link, Router } from '../../../routes.js';

class NewRequest extends Component {
    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);
        let contributors = await campaign.methods.getContributorsCount().call();
        console.log('contribs: ', contributors);
        return { address: props.query.address, totalContributors: contributors}
    }
    state = {
        name: '',
        description:'',
        amount: '',
        requiredVotes: '',
        requiresAllContributors: false,
        recipient:'',
        errorMessage: '',
        successMessage: '',
        loading: false
    }

    onSubmit = async event => {
        event.preventDefault()
        this.setState({loading:true, errorMessage: '', successMessage: ''})
        let isValidInput = this.validateInput();

        if(isValidInput)
        {
            console.log('state: ',this.state);
            try{
                const contract = Campaign(this.props.address);
                let accounts = await web3.eth.getAccounts();
                let approvals = this.state.requiresAllContributors ? this.props.totalContributors : this.state.requiredVotes;
                console.log(approvals);
                await contract.methods.triggerCampaignRequest(
                                        this.state.name, 
                                        this.state.description, 
                                        web3.utils.toWei(this.state.amount, 'ether'), 
                                        approvals,
                                        this.state.recipient)
                                      .send({from: accounts[0]});
                this.setState({loading: false, successMessage: `Request: ${this.state.name} successfully triggered`});
            }catch(error){
                this.setState({loading: false, errorMessage: error.message})
            }
        }

        else this.setState({loading: false})

        this.handleErrorFadeOut();
    }

    validateInput() {
        if(this.state.name.length <= 4){
            this.setState({errorMessage: 'A Request must have a name with at least 4 characters'});
            return false;
        }
        if(this.state.description.length > 300){
            this.setState({errorMessage: 'Request description is too long. It must be shorter than 300 characters'});
            return false;
        }
        if(this.state.description.length < 10){
            this.setState({errorMessage: 'Request description must be larger than 10 characters'});
            return false;
        }
        if(this.state.amount <= 0){
            this.setState({errorMessage: 'Request amount must be greater than 0'});
            return false;
        }
        if(!parseFloat(this.state.amount)){
            this.setState({errorMessage: 'Amount value must be an integer or a decimal number'});
            return false
        }
        if(!this.state.requiresAllContributors && this.state.requiredVotes <= 0){
            this.setState({errorMessage: 'A Request needs at least one approval to be submited'})
            return false;
        }
        if(this.state.recipient.length !== 42){
            this.setState({errorMessage: 'The input value for the recipient is not a valid wallet address'});
            return false;
        }
        return true;
    }
    handleErrorFadeOut = () => {
        setTimeout(() => {
            this.setState({errorMessage: '', successMessage: ''});
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        }, 5000)
    }

    render(){
        return(
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`} >
                    {'<<'} Back
                </Link>
                <h3>New Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage}>
                    <label>Name</label>
                    <Form.Field>
                        <Input 
                            value={this.state.name}
                            onChange={event => this.setState({name: event.target.value })}
                            />
                    </Form.Field>
                    <label>Description</label>
                    <Form.Field>
                        <Input 
                            value={this.state.description}
                            onChange={event => this.setState({description: event.target.value })}
                            />
                    </Form.Field>
                    <label>Amount</label>
                    <Form.Field>
                        <Input
                            label='ETH'
                            labelPosition='right' 
                            value={this.state.amount}
                            onChange={event => this.setState({amount: event.target.value })}
                            />
                    </Form.Field>
                    <label>Required Approvals</label>
                    <Form.Field>
                        <Input 
                            disabled={this.state.requiresAllContributors}
                            value={this.state.requiredVotes}
                            onChange={event => this.setState({requiredVotes: event.target.value })}
                            />
                            
                            <Checkbox toggle
                                      label='All contributors'
                                      onChange={() => this.setState({requiresAllContributors: !this.state.requiresAllContributors})}
                                      style={{marginTop: '7px'}}/>
                    </Form.Field>
                    
                    <label>Recipient</label>
                    <Form.Field>
                        <Input 
                            value={this.state.recipient}
                            onChange={event => this.setState({recipient: event.target.value })}
                            />
                    </Form.Field>
                    <Message error header='Oops!' content={this.state.errorMessage}/>
                    <Message success header='Perfect!' content={this.state.successMessage}/>
                    <Button primary loading={this.state.loading} >Create</Button>
                </Form>
            </Layout>
        )
    }
}

export default NewRequest;