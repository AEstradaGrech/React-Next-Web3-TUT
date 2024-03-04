import React, { Component } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign.js'

class NewRequestComponent extends Component {
    state = {
        description:'',
        amount: 0,
        recipient:'',
        errorMessage: '',
        successMessage: '',
        loading: false
    }

    onSubmit = async () => {

    }

    render(){
        return(
            <Layout>
                <h3>New Request</h3>
            </Layout>
        )
    }
}

export default NewRequestComponent;