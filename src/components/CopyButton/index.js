import { Button, Tooltip } from '@mui/material';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';
import Icon from '../Icon';

const CopyButton = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCopy = (e) => {
        navigator.clipboard.writeText(props.data);

        e.stopPropagation();
        setOpen(true);
        setTimeout(handleClose, 1000);
    };

    return (
        <Tooltip
            arrow
            open={open}
            title="Copied!">
            <Button
                className="copy_button theme_color copy_icon_button"
                variant="contained"
                onClick={handleCopy}>
                {props.icon
                    ? <img alt="copy" src={props.icon}/>
                    : <Icon className="copy" icon="copy"/>}
            </Button>
        </Tooltip>
    );
};

CopyButton.propTypes = {
    data: PropTypes.string,
    icon: PropTypes.any,
};

export default CopyButton;
