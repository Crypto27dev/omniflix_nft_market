import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import variables from '../../../../utils/variables';
import { connect } from 'react-redux';
import { fetchNFT } from '../../../../actions/marketplace';
import { withRouter } from 'react-router-dom';

const Counter = (props) => {
    const [time, setTime] = useState();
    const [status, setStatus] = useState(true);
    const [timerObj] = useState({ timer: false });
    const [type, setType] = useState(null);

    useEffect(() => {
        const auction = props.auction;
        if (auction && !Object.keys(auction).length) {
            return;
        }

        if (auction && auction.start_time && (moment().diff(auction.start_time) < -1000)) {
            if (timerObj.timer) {
                clearTimeout(timerObj.timer);
            }

            handleTimer(new Date(auction.start_time).getTime());
            setType('start');
        } else if (auction && auction.end_time && (moment().diff(auction.end_time) < -1000)) {
            if (timerObj.timer) {
                clearTimeout(timerObj.timer);
            }

            handleTimer(new Date(auction.end_time).getTime());
            setType('end');
        } else {
            setStatus(false);
        }

        return () => {
            if (timerObj.timer) {
                clearTimeout(timerObj.timer);
            }
        };
        /* eslint-disable */
    }, []);

    const handleTimer = (endTime) => {
        const now = new Date().getTime();
        const distance = endTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const obj = {
            days,
            hours,
            minutes,
            seconds,
        };

        setTime(obj);

        if (distance > 0) {
            timerObj.timer = setTimeout(() => handleTimer(endTime), 1000);
        } else {
            setStatus(false);
            if (props.match && props.match.params && props.match.params.nftID) {
                props.fetchNFT(props.match.params.nftID);
            }
        }
    };

    return (
        status &&
        <div className="counter">
            {type === 'start' ? variables[props.lang]['auction_go_live']
                : variables[props.lang]['auction_ends_in']}{' '}
            <span>
                &nbsp;
                {time && time.days ? time.days + 'Days ' : ''}
                {time && time.hours ? time.hours + 'Hrs ' : ''}
                {time && time.minutes ? time.minutes + 'Mins ' : ''}
                {time && time.seconds ? time.seconds + 'Secs ' : '00Secs'}
                &nbsp;
            </span>
        </div>
    );
};

Counter.propTypes = {
    fetchNFT: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    auction: PropTypes.shape({
        start_time: PropTypes.string,
        end_time: PropTypes.string,
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            nftID: PropTypes.string,
        }),
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

const actionToProps = {
    fetchNFT,
};

export default withRouter(connect(stateToProps, actionToProps)(Counter));
