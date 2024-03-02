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
            <h1>New Req</h1>
        )
    }
}

export default NewRequestComponent;