import React from 'react';
import CopyButton from '../../../../components/CopyButton';
import * as PropTypes from 'prop-types';
import { chainName } from '../../../../config';
import { withRouter } from 'react-router-dom';
import variables from '../../../../utils/variables';
import moment from 'moment/moment';
import { connect } from 'react-redux';

const Info = (props) => {
    const address = props.value && props.value.nftDetails && props.value.nftDetails.list &&
        props.value.nftDetails.list.owner && (props.value.nftDetails.list.owner);
    const nftID = props.value && props.value.nftDetails && props.value.nftDetails.id;
    const nftOwner = props.value && props.value.nftDetails && props.value.nftDetails.owner;
    const denomID = props.value && props.value.nftDetails && props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.id;
    const ipfsLink = props.value && props.value.nftDetails && props.value.nftDetails.media_uri;
    const extensible = props.value && props.value.nftDetails && props.value.nftDetails.extensible;
    const nsfw = props.value && props.value.nftDetails && props.value.nftDetails.nsfw;

    let royalty = props.value && props.value.nftDetails && props.value.nftDetails.royalty_share && Number(props.value.nftDetails.royalty_share);
    royalty = royalty * 100;
    const splitShares = props.value && props.value.nftDetails && props.value.nftDetails.auction && props.value.nftDetails.auction
        ? props.value && props.value.nftDetails && props.value.nftDetails.auction && props.value.nftDetails.auction.split_shares
        : props.value && props.value.nftDetails && props.value.nftDetails.list && props.value.nftDetails.list.split_shares;

    const bidPercentage = props.value && props.value.nftDetails && props.value.nftDetails.auction && props.value.nftDetails.auction.increment_percentage;
    const startDate = props.value && props.value.nftDetails && props.value.nftDetails.auction && props.value.nftDetails.auction.start_time;
    const endDate = props.value && props.value.nftDetails && props.value.nftDetails.auction && props.value.nftDetails.auction.end_time;
    const whiteListedAccounts = props.value && props.value.nftDetails && props.value.nftDetails.auction && props.value.nftDetails.auction.whitelist_accounts;

    const handleClick = (value, address) => {
        if (value === 'denom') {
            props.history.push('/collection/' + denomID);
        }
        if (value === 'nft') {
            props.history.push('/nft/' + nftID);
        }
        if (value === 'ipfs' && ipfsLink) {
            window.open(ipfsLink);
        }
        if (value === 'address') {
            props.history.push('/account/' + address + '/nfts');
        }
    };

    return (
        <div className="info_section">
            <div className="info_section1">
                <span/>
                <div className="info_profile">
                    <span>Owned By</span>
                    {
                        props.value && props.value.nftDetails && props.value.nftDetails.list &&
                        props.value.nftDetails.list.owner
                            ? <a
                                className="hash_text hover_me"
                                href={'/account/' + address + '/nfts'}
                                title={address}
                                onClick={() => handleClick('address', address)}>
                                <p className="name">{address}</p>
                                {address.slice(address.length - 4, address.length)}
                            </a>
                            : nftOwner && <a
                                className="hash_text hover_me"
                                href={'/account/' + nftOwner + '/nfts'}
                                title={nftOwner} onClick={() => handleClick('address', nftOwner)}>
                                <p className="name">{nftOwner}</p>
                                {nftOwner.slice(nftOwner.length - 4, nftOwner.length)}
                            </a>
                    }
                </div>
            </div>
            <div className="info_section2">
                <div className="info_section2_class">
                    <span>NFT ID</span>
                    <div className="section2_class_div">
                        {props.value && props.value.nftDetails && props.value.nftDetails.id &&
                            <a
                                className={
                                    props.match && props.match.params && props.match.params.nftID
                                        ? '' : 'hover_me'}
                                href={'/nft/' + nftID}
                                onClick={() => handleClick('nft')}>{nftID} </a>}
                        <CopyButton data={nftID}/>
                    </div>
                </div>
                <div className="info_section2_class">
                    <span>DENOM ID</span>
                    <div className="section2_class_div">
                        {props.value && props.value.nftDetails && props.value.nftDetails.denom_id &&
                            props.value.nftDetails.denom_id.id &&
                            <a
                                className="hover_me"
                                href={'/collection/' + denomID}
                                onClick={() => handleClick('denom')}> {denomID}</a>}
                        <CopyButton data={denomID}/>
                    </div>
                </div>
                <div className="info_section2_class">
                    <span>IPFS Link</span>
                    {props.value && props.value.nftDetails &&
                        props.value.nftDetails.media_uri &&
                        <div className="section2_class_div">
                            <a
                                className="hover_me"
                                href={ipfsLink}
                                rel="noopener noreferrer" target="_blank">{ipfsLink}</a>
                            <CopyButton data={ipfsLink}/>
                        </div>}
                </div>
                <div className="info_section2_class">
                    <span>Blockchain</span>
                    <div className="section2_class_div">
                        {chainName}
                    </div>
                </div>
                {extensible && <div className="info_section2_class">
                    <span>Extensible</span>
                    <div className="section2_class_div">
                        True
                    </div>
                </div>}
                {nsfw &&
                    <div className="info_section2_class">
                        <span>NSFW</span>
                        <div className="section2_class_div">
                            True
                        </div>
                    </div>}
                {props.value && props.value.nftDetails && props.value.nftDetails.auction && bidPercentage &&
                    <div className="row info_section2_class">
                        <span>{variables[props.lang].bid_increment_per}</span>
                        <p className="section2_class_div">{(bidPercentage) * 100} {' %'}</p>
                    </div>}
                {props.value && props.value.nftDetails && props.value.nftDetails.auction && startDate &&
                    <div className="row info_section2_class">
                        <span>{variables[props.lang]['start_time']}</span>
                        <p className="section2_class_div">{startDate && moment(startDate).format('MMM Do \'YY LT')}</p>
                    </div>}
                {props.value && props.value.nftDetails && props.value.nftDetails.auction && endDate &&
                    <div className="row info_section2_class">
                        <span>{variables[props.lang]['end_time']}</span>
                        <p className="section2_class_div">{endDate && moment(endDate).format('MMM Do \'YY LT')}</p>
                    </div>}
                {royalty > 0 &&
                    <div className="info_section2_class">
                        <span>Royalty</span>
                        <div className="section2_class_div">
                            {royalty} %
                        </div>
                    </div>}
                {splitShares && splitShares.length > 0 &&
                    <div className="info_section2_class split_shares_head">
                        <span>Split Shares</span>
                    </div>
                }
                {splitShares && splitShares.length > 0 &&
                    splitShares.map((item, index) => {
                        let royaltySplits = item.weight && Number(item.weight);
                        royaltySplits = royaltySplits * 100;
                        return (
                            <React.Fragment key={index}>
                                <div className="info_section2_class split_shares">
                                    <div className="copy_div address_section">
                                        <div className="field_data hash_text" title={item.address}>
                                            <p className="name">{item.address}</p>
                                            {item.address && item.address.slice(item.address.length - 6, item.address.length)}
                                        </div>
                                    </div>
                                    <span className="share_section">{royaltySplits}%</span>
                                </div>
                            </React.Fragment>
                        );
                    })}
                {whiteListedAccounts && whiteListedAccounts.length > 0 &&
                    <div className="info_section2_class split_shares_head">
                        <span>WhiteListed Accounts</span>
                    </div>}
                {whiteListedAccounts && whiteListedAccounts.length > 0 &&
                    whiteListedAccounts.map((value, index) => {
                        return (
                            <div key={index} className="info_section2_class split_shares">
                                <div className="copy_div address_section">
                                    <div className="field_data hash_text" title={value}>
                                        <p className="name">{value}</p>
                                        {value && value.slice(value.length - 6, value.length)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

Info.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            denomID: PropTypes.string,
            nftID: PropTypes.string,
            listID: PropTypes.string,
        }),
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

export default withRouter(connect(stateToProps)(Info));
