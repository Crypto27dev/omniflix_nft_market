import { Button, Popover } from '@mui/material';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideMenuPopover, showBurnDialog } from '../../../actions/marketplace';
import variables from '../../../utils/variables';
import './index.css';

const MenuPopover = (props) => {
    const open = Boolean(props.anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleBurn = () => {
        props.hideMenuPopover();
        props.showBurnDialog(props.asset);
    };

    return (
        <Popover
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            className="menu_popover"
            id={id}
            open={open}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={props.hideMenuPopover}>
            <div className="menu_list">
                <Button onClick={handleBurn}>
                    {variables[props.lang].burn}
                </Button>
            </div>
        </Popover>
    );
};

MenuPopover.propTypes = {
    asset: PropTypes.object.isRequired,
    hideMenuPopover: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    showBurnDialog: PropTypes.func.isRequired,
    anchorEl: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        anchorEl: state.marketplace.menuPopover.anchorEl,
        asset: state.marketplace.menuPopover.asset,
    };
};

const actionToProps = {
    hideMenuPopover,
    showBurnDialog,
};

export default connect(stateToProps, actionToProps)(MenuPopover);
