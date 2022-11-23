import React from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import variables from '../../../utils/variables';
import { withRouter } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../../../assets/home.svg';
import { IconButton } from '@mui/material';
import { hideActiveCard } from '../../../actions/explore';

const Breadcrumb = (props) => {
    const goto = (value, index) => {
        if (value === 'collectionNFTs' && index === 0 && list && list.length === 2) {
            const denom = props.nftDetails && props.nftDetails.denom_id && props.nftDetails.denom_id.id;
            props.history.push('/collection/' + denom);
            props.hideActiveCard();
        } else if (value === 'home') {
            props.history.push('/home');
        }
    };

    const list = [props.nftDetails && props.nftDetails.denom_id && props.nftDetails.denom_id.name,
        props.nftDetails && props.nftDetails.name];

    return (
        <div className="breadcrumb">
            <div
                className="home_icon"
                onClick={() => goto('home')}>
                <IconButton>
                    <HomeIcon/>
                </IconButton>
            </div>
            <span className="slash">/</span>
            {list.map((item, index) => (
                <React.Fragment key={index}>
                    <div
                        className={list && list.length === 2 &&
                        list[0] && index === 0
                            ? 'breadcrumb_collection' : ''}
                        onClick={() => goto('collectionNFTs', index)}>
                        {item}
                    </div>
                    {index === (list.length - 1)
                        ? null
                        : <span className="slash">/</span>}
                </React.Fragment>
            ))}
        </div>
    );
};

Breadcrumb.propTypes = {
    hideActiveCard: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    nftDetails: PropTypes.object.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            listID: PropTypes.string,
            denomID: PropTypes.string,
            nftID: PropTypes.string,
        }),
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        nftDetails: state.marketplace.nftDetails.result,
    };
};

const actionToProps = {
    hideActiveCard,
};

export default withRouter(connect(stateToProps, actionToProps)(Breadcrumb));
