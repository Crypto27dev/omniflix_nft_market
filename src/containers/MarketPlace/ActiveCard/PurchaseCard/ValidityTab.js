import React from 'react';
import { Button } from '@mui/material';

class ValidityTab extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            activeValidity: '1year',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange (event, value) {
        this.setState({
            activeValidity: value,
        });
    }

    render () {
        return (
            <div className="validity_tab">
                <Button
                    className={this.state.activeValidity === '1year'
                        ? 'active_validity default_validity'
                        : 'default_validity'}
                    onClick={(e) => this.handleChange(e, '1year')}>
                    1 Year
                </Button>
                <Button
                    className={this.state.activeValidity === '2year'
                        ? 'active_validity default_validity'
                        : 'default_validity'}
                    onClick={(e) => this.handleChange(e, '2year')}>
                    2 Years
                </Button>
                <Button
                    className={this.state.activeValidity === '3year'
                        ? 'active_validity default_validity'
                        : 'default_validity'}
                    onClick={(e) => this.handleChange(e, '3year')}>
                    3 Years
                </Button>
            </div>
        );
    }
}

export default ValidityTab;
