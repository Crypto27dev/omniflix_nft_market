import { Button, Tooltip } from '@mui/material';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';

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
                className="primary_button"
                variant="contained"
                onClick={handleCopy}>
                {props.children}
            </Button>
        </Tooltip>
    );
};

CopyButton.propTypes = {
    data: PropTypes.string.isRequired,
    children: PropTypes.any,
};

export default CopyButton;
