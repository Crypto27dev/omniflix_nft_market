import { IconButton, Slide, Snackbar as MaterialSnackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';
import successIcon from '../../assets/success.svg';
import errorIcon from '../../assets/error.svg';
import shareIcon from '../../assets/share.svg';
import CopyButton from '../CopyButton';
import copyIcon from '../../assets/copy.svg';
import { LinearProgress } from '@mui/material';
import warningIcon from '../../assets/warning.png';
import { EXPLORER_URL } from '../../config';

const TransitionUp = (props) => <Slide direction="up" {...props}/>;

const Snackbar = (props) => {
    const handleClose = () => {
        if (props.manual) {
            return null;
        }

        props.onClose();
    };

    const explorer = props.explorer ? props.explorer : EXPLORER_URL;

    return (
        <MaterialSnackbar
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            TransitionComponent={TransitionUp}
            action={
                <React.Fragment>
                    {<IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={props.onClose}>
                        <CloseIcon/>
                    </IconButton>}
                </React.Fragment>
            }
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            autoHideDuration={props.manual ? null : 5000}
            className="snackbar"
            message={<div>
                {props.variant === 'success'
                    ? <div className="snackbar_class success_snackbar" id="message-id">
                        <img alt="icon" src={successIcon}/>
                        <span>{props.message}</span>
                    </div>
                    : props.variant === 'error'
                        ? <div className="snackbar_class error_snackbar" id="message-id">
                            <img alt="icon" src={errorIcon}/>
                            <span>{props.message}</span>
                        </div>
                        : props.variant === 'warning'
                            ? <div className="snackbar_class error_snackbar" id="message-id">
                                <img alt="icon" src={warningIcon}/>
                                <span>{props.message}</span>
                            </div>
                            : <div className="snackbar_class" id="message-id">
                                <span>{props.message}</span>
                            </div>}
                {props.hash && <div className="tx_hash">
                    <span>TxnHash</span>
                    <p>{props.hash}</p>
                    <CopyButton data={explorer + '/transactions/' + props.hash} icon={copyIcon}/>
                    <img
                        alt="share"
                        src={shareIcon}
                        onClick={() => window.open(explorer + '/transactions/' + props.hash)}/>
                </div>}
                {(props.variant === 'success' || props.variant === 'processing') && props.progress
                    ? <div className="snackbar_linear_progress">
                        <LinearProgress className="success_progress"/>
                    </div>
                    : props.variant === 'error' && props.progress
                        ? <div className="snackbar_linear_progress">
                            <LinearProgress className="fail_progress"/>
                        </div>
                        : props.variant === 'warning' && props.progress
                            ? <div className="snackbar_linear_progress">
                                <LinearProgress className="warning_progress"/>
                            </div>
                            : props.progress
                                ? <div className="snackbar_linear_progress">
                                    <LinearProgress/>
                                </div>
                                : null}
            </div>}
            open={props.open}
            variant={props.variant}
            onClose={handleClose}/>
    );
};

Snackbar.propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    explorer: PropTypes.string,
    hash: PropTypes.string,
    manual: PropTypes.bool,
    progress: PropTypes.bool,
    variant: PropTypes.string,
};

export default Snackbar;
