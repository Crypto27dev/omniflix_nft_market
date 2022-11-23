import { AppBar, Tab } from '@mui/material';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { withRouter } from 'react-router';
import { hideSideBar } from '../../actions/navbar';

class NavTabs extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: '',
        };
    }

    componentDidMount () {
        const route = this.props.location.pathname && this.props.location.pathname.split('/') &&
            this.props.location.pathname.split('/')[1];

        if (route === '') {
            this.props.history.push('/home');
        }

        if (this.state.value !== route) {
            this.setState({
                value: route,
            });
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if (pp.location.pathname !== this.props.location.pathname) {
            const value = this.props.location.pathname.split('/')[1];

            if (value !== this.state.value) {
                this.setState({
                    value: value,
                });
            }
        }
    }

    handleChange (newValue, event) {
        event.preventDefault();

        if (newValue === this.state.value) {
            return;
        }
        if (this.props.show) {
            this.props.hideSideBar();
        }

        this.props.history.push('/' + newValue);
        this.setState({
            value: newValue,
        });
    }

    render () {
        const a11yProps = (index) => {
            return {
                id: `nav-tab-${index}`,
                'aria-controls': `nav-tabpanel-${index}`,
            };
        };

        return (
            <AppBar className="horizontal_tabs" position="static">
                <div className="tabs_content">
                    <Tab
                        disableRipple
                        className={'tab ' + (this.state.value === 'home' ? 'active_tab' : '')}
                        component="a"
                        href="/home"
                        label={<p className="text">{variables[this.props.lang].home}</p>}
                        role="button"
                        value="home"
                        onClick={(event) => this.handleChange('home', event)}
                        {...a11yProps(0)} />
                    <Tab
                        disableRipple
                        className={'tab ' + (this.state.value === 'nfts' ? 'active_tab' : '')}
                        component="a"
                        href="/nfts"
                        label={<p className="text">{variables[this.props.lang]['market_place']}</p>}
                        role="button"
                        value="nfts"
                        onClick={(event) => this.handleChange('nfts', event)}
                        {...a11yProps(0)} />
                    <Tab
                        disableRipple
                        className={'tab ' + (this.state.value === 'collections' ? 'active_tab' : '')}
                        component="a"
                        href="/collections"
                        label={<p className="text">{variables[this.props.lang].collections}</p>}
                        role="button"
                        value="collections"
                        onClick={(event) => this.handleChange('collections', event)}
                        {...a11yProps(1)} />
                </div>
            </AppBar>
        );
    }
}

NavTabs.propTypes = {
    hideSideBar: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    show: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        show: state.navbar.show,
    };
};

const actionToProps = {
    hideSideBar,
};

export default withRouter(connect(stateToProps, actionToProps)(NavTabs));
