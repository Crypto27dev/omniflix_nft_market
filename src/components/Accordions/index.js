import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import * as PropTypes from 'prop-types';
import { ReactComponent as ExpandIcon } from '../../assets/explore/expand.svg';
import ClassNames from 'classnames';
import './index.css';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters square elevation={0} {...props} />
))(({ theme }) => ({
    color: '#F2F2F2',
    backgroundColor: '#21262b66',
    border: '1px solid #2F363D',
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ExpandIcon/>}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: 'unset',
    padding: '19px 20px',
    '& .MuiAccordionSummary-expandIconWrapper': {
        transform: 'rotate(180deg)',
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(0deg)',
    },
    '& .MuiAccordionSummary-content': {
        margin: 0,
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: '20px',
    borderTop: '1px solid #2F363D',
}));

const Accordions = (props) => {
    return (
        <Accordion
            // defaultExpanded
            className={ClassNames('accordion', props.className ? props.className : '')}>
            <AccordionSummary aria-controls={props.name} className="summary" id={props.name}>
                <Typography>{props.name}</Typography>
            </AccordionSummary>
            <AccordionDetails className="details">
                {props.children}
            </AccordionDetails>
        </Accordion>
    );
};

Accordions.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.any,
    className: PropTypes.string,
};

export default Accordions;
