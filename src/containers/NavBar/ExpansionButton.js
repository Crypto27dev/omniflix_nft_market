import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { showSideBar } from '../../actions/navbar';

const ExpansionButton = (props) => {
    const handleOpen = () => {
        props.showSideBar();

        document.body.style.overflow = 'hidden';
    };

    return (
        <Button
            aria-label="Open drawer"
            className="toggle_button"
            color="inherit"
            onClick={handleOpen}>
            <Menu/>
        </Button>
    );
};

ExpansionButton.propTypes = {
    showSideBar: PropTypes.func.isRequired,
};

const actionToProps = {
    showSideBar,
};

export default connect(null, actionToProps)(ExpansionButton);
