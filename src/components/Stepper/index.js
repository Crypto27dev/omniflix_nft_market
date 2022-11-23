import React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles, Step, StepConnector, StepLabel, Stepper as MaterialStepper, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import './index.css';
import Icon from '../Icon';

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
        width: '100%',
    },
    active: {
        '& $line': {
            backgroundImage: 'linear-gradient(91.79deg, #fac01e 3.15%, #fc762a 85.66%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage: 'linear-gradient(91.79deg, #fac01e 3.15%, #fc762a 85.66%)',
        },
    },
    line: {
        height: 6,
        border: 0,
        backgroundColor: '#353535',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: 'transparent',
        zIndex: 1,
        color: '#fff',
        width: 35,
        height: 35,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        border: '4px solid #353535',
        marginTop: '6px',
    },
    completed: {
        backgroundImage: 'linear-gradient(91.79deg, #fac01e 3.15%, #fc762a 85.66%)',
    },
});

const ColorlibStepIcon = (props, parentProps) => {
    const classes = useColorlibStepIconStyles();
    const {
        active,
        completed,
    } = props;

    return (
        <div
            className={classNames(classes.root, {
                [classes.completed]: completed,
            }, 'icon_div', completed ? 'completed' : '', active ? 'active' : '')}>
            {completed
                ? <Icon className="step_complete" icon="step_complete"/>
                : parentProps.inProgress && active
                    ? <Icon className="step_pending" icon="step_pending"/>
                    : parentProps.clickable && parentProps.clickable[String(props.icon)]
                        ? <Icon className="step_done" icon="step_done"/>
                        : parentProps.clickable && !parentProps.clickable[String(props.icon - 1)] && !active
                            ? <Icon className="step_lock" icon="step_lock"/>
                            : null}
        </div>
    );
};

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

const Stepper = (props) => {
    const count = 100 / props.steps.length;
    let percentage = count * (props.activeStep + 1);

    if (percentage > 100) {
        percentage = 100;
    }

    const handleStep = (step) => () => {
        if (props.setActiveStep && props.clickable[String(step)] && (props.activeStep !== step)) {
            props.setActiveStep(step);
        }
    };

    return (
        <MaterialStepper
            alternativeLabel
            activeStep={props.activeStep}
            className="stepper"
            connector={<ColorlibConnector/>}>
            {props.steps && props.steps.length &&
                props.steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconComponent={(elProps) => ColorlibStepIcon(elProps, props)}
                            className={classNames('label', props.clickable && props.clickable[String(index)] ? 'action_label' : '')}
                            onClick={handleStep(index)}>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            <span
                className="progress_bar"
                style={{
                    width: percentage + '%',
                }}/>
        </MaterialStepper>
    );
};

Stepper.propTypes = {
    activeStep: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    clickable: PropTypes.object,
    icons: PropTypes.object,
    inProgress: PropTypes.bool,
    setActiveStep: PropTypes.func,
};

export default Stepper;
