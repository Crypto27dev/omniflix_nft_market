import React from 'react';
import '../index.css';
import './index.css';
import calendarIcon from '../../../assets/my-account/calendar.svg';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';

const ActivitySkeletonLoader = (props) => {
    return (
        <div className="activity_section activity_skeleton_loader">
            <div className="activity_timeline">
                {props.index === 0 && props.start && <div className="calendar_date">
                    <img alt="calendar" src={calendarIcon}/>
                    {moment().format('DD-MM-YYYY')}
                </div>}
                <div/>
                <Skeleton
                    animation="wave"
                    className="created_at skeleton_loader"
                    height={40}
                    width={60}/>
                <div/>
            </div>
            <div className="activity_card">
                <div className="card_section1">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={30}
                        variant="circular"
                        width={30}/>
                    <div className="name">
                        <Skeleton
                            animation="wave"
                            className="skeleton_loader"
                            height={26}
                            width="80%"/>
                        <Skeleton
                            animation="wave"
                            className="skeleton_loader"
                            height={26}
                            width="100%"/>
                    </div>
                </div>
                <div className="card_section2">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        width="80%"/>
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        width="100%"/>
                </div>
                <div className="card_section3">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={30}
                        width="100%"/>
                </div>
            </div>
        </div>
    );
};

ActivitySkeletonLoader.propTypes = {
    index: PropTypes.number,
    start: PropTypes.bool,
};

export default ActivitySkeletonLoader;
