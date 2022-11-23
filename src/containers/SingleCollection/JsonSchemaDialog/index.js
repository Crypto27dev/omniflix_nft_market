import React from 'react';
import { Button, Dialog } from '@mui/material';
import * as PropTypes from 'prop-types';
import { hideSchemaJsonDialog } from '../../../actions/marketplace';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import './index.css';
import CopyButton from '../../../components/CopyButton';

const JsonSchemaDialog = (props) => {
    return (
        <Dialog
            aria-describedby="preview-dialog-description"
            aria-labelledby="preview-dialog-title"
            className="dialog json_schema_dialog"
            open={props.open}
            onClose={props.handleClose}>
            <div className="json_schema_section">
                <h2>{variables[props.lang]['json_schema_properties']}</h2>
                <div className="json_schema_parent">
                    <pre className="json_schema scroll_bar">
                        {JSON.stringify(props.schema, undefined, 4)}
                    </pre>
                    <CopyButton data={JSON.stringify(props.schema, undefined, 4)}/>
                </div>
                <div className="json_schema_action">
                    <Button onClick={props.handleClose}>
                        <p>{variables[props.lang]['close_window']}</p>
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

JsonSchemaDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    schema: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
    return {
        open: state.marketplace.jsonSchemaDialog.open,
        lang: state.language,
        schema: state.marketplace.jsonSchemaDialog.value,
    };
};

const actionToProps = {
    handleClose: hideSchemaJsonDialog,
};

export default connect(stateToProps, actionToProps)(JsonSchemaDialog);
