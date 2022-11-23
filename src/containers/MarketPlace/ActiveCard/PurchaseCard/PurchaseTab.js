import React from 'react';
import { Button } from '@mui/material';

class PurchaseTab extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            activePurchase: 'ownership',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange (event, value) {
        this.setState({
            activePurchase: value,
        });
    }

    render () {
        return (
            <div className="purchase_tab">
                {/* <Button */}
                {/*    className={this.state.activePurchase === 'rent' */}
                {/*        ? 'active_purchase default_purchase' */}
                {/*        : 'default_purchase'} */}
                {/*    onClick={(e) => this.handleChange(e, 'rent')} > */}
                {/*    Rent */}
                {/* </Button> */}
                {/* <Button */}
                {/*    className={this.state.activePurchase === 'license' */}
                {/*        ? 'active_purchase default_purchase' */}
                {/*        : 'default_purchase'} */}
                {/*    onClick={(e) => this.handleChange(e, 'license')}> */}
                {/*    License */}
                {/* </Button> */}
                <Button
                    className={this.state.activePurchase === 'ownership'
                        ? 'active_purchase default_purchase'
                        : 'default_purchase'}
                    onClick={(e) => this.handleChange(e, 'ownership')}>
                    Ownership
                </Button>
                {/* <Button */}
                {/*    className={this.state.activePurchase === 'subscription' */}
                {/*        ? 'active_purchase default_purchase' */}
                {/*        : 'default_purchase'} */}
                {/*    onClick={(e) => this.handleChange(e, 'subscription')}> */}
                {/*    Subscription */}
                {/* </Button> */}
            </div>
        );
    }
}

export default PurchaseTab;
