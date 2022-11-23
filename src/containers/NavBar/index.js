import React from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import logo from '../../assets/logo.svg';
import { withRouter } from 'react-router';
import ProfilePopover from './ProfilePopover';
import Tabs from './Tabs';
import { Button } from '@material-ui/core';
import { STUDIO_URL } from '../../config';
import FaucetDialog from './SidePanel/FaucetDialog';
import ExpansionButton from './ExpansionButton';
import ClassNames from 'classnames';
import Icon from '../../components/Icon';
import { connect } from 'react-redux';
import { hideSideBar } from '../../actions/navbar';
import AppsPopover from './AppsPopover';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../../constants/seo';
import { Helmet } from 'react-helmet';
import ConnectDialog from './ConnectDialog';

const NavBar = (props) => {
    const handleCreate = () => {
        window.open(STUDIO_URL);
        if (props.show) {
            props.hideSideBar();
        }
    };

    const handleClose = () => {
        const path = props.location && props.location.pathname && props.location.pathname.split('/')[1];
        if ((path === 'account') || (path === 'collection')) {
            document.body.style.overflow = null;
        }

        props.hideSideBar();
    };

    const handleHome = (event) => {
        event.preventDefault();
        props.history.push('/home');
    };

    return (
        <div className="nav_bar">
            <Helmet>
                <meta charSet="utf-8"/>
                <title>{DEFAULT_TITLE}</title>
                <meta content={DEFAULT_DESCRIPTION} name="description"/>
            </Helmet>
            <Button
                className="logo_button"
                href="/home"
                onClick={handleHome}>
                <img alt="logo" src={logo}/>
            </Button>
            <div className="expansion_div">
                <AppsPopover/>
                <ExpansionButton/>
            </div>
            <div className={ClassNames('right_nav', props.show ? 'show' : '')}>
                <div className="back_button" onClick={props.hideSideBar}>
                    <IconButton
                        onClick={handleClose}>
                        <Icon className="close" icon="close"/>
                    </IconButton>
                </div>
                <Tabs/>
                <AppsPopover/>
                <Button
                    className="create_button"
                    onClick={handleCreate}>
                    Create
                </Button>
                <ProfilePopover/>
            </div>
            <FaucetDialog/>
            <ConnectDialog/>
        </div>
    );
};

NavBar.propTypes = {
    hideSideBar: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    show: PropTypes.bool.isRequired,
    hideTabs: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        show: state.navbar.show,
    };
};

const actionToProps = {
    hideSideBar,
};

export default withRouter(connect(stateToProps, actionToProps)(NavBar));
