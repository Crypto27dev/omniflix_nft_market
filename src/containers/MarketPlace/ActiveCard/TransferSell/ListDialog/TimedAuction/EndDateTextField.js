import * as React from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setEndDate } from '../../../../../../actions/marketplace';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import Stack from '@mui/material/Stack';
import { InputAdornment } from '@mui/material';
import calendarIcon from '../../../../../../assets/calendar.png';
import moment from 'moment';

const EndDateTextField = (props) => {
    let now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    now = new Date(now);

    const handleChange = (value) => {
        if (moment().diff(value) > 0) {
            let now = new Date();
            now.setMinutes(now.getMinutes() + 10);
            now = new Date(now);
            props.setEndDate(now);

            return;
        }

        props.setEndDate(value);
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
                    minDateTime={now}
                    renderInput={(params) => <TextField
                        className="text_field"
                        placeholder="End Time"
                        {...params} />}
                    value={props.value}
                    onChange={handleChange}
                />
            </Stack>
        </LocalizationProvider>
    );
};

EndDateTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    setEndDate: PropTypes.func.isRequired,
    value: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.marketplace.endDate,
    };
};

const actionToProps = {
    setEndDate,
};

export default connect(stateToProps, actionToProps)(EndDateTextField);
