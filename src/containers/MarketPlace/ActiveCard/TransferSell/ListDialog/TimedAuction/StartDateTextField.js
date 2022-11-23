import * as React from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setStartDate } from '../../../../../../actions/marketplace';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import Stack from '@mui/material/Stack';
import calendarIcon from '../../../../../../assets/calendar.png';
import { InputAdornment } from '@mui/material';
import moment from 'moment';

const StartDateTextField = (props) => {
    const handleChange = (value) => {
        if (moment().diff(value) > 0) {
            let now = new Date();
            now.setMinutes(now.getMinutes() + 2);
            now = new Date(now);
            props.setStartDate(now);

            return;
        }

        props.setStartDate(value);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack className="date_field" spacing={3}>
                <MobileDateTimePicker
                    for
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <img alt="calendar" src={calendarIcon}/>
                            </InputAdornment>
                        ),
                    }}
                    minDateTime={new Date()}
                    renderInput={(params) => <TextField
                        className="text_field"
                        placeholder="Start Time"
                        {...params} />}
                    value={props.value}
                    onChange={handleChange}
                />
            </Stack>
        </LocalizationProvider>
    );
};

StartDateTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    setStartDate: PropTypes.func.isRequired,
    value: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.marketplace.startDate,
    };
};

const actionToProps = {
    setStartDate,
};

export default connect(stateToProps, actionToProps)(StartDateTextField);
