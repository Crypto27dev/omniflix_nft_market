import React from 'react';
import './index.css';
import '../MarketPlace/index.css';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchNFT, fetchNFTActivity } from '../../actions/marketplace';
import { DEFAULT_LIMIT, DEFAULT_SKIP, IPFS_URL } from '../../config';
import { getAssetType, getAssetTypeExtension } from '../../utils/strings';
import ImageOnLoad from '../../components/ImageOnLoad';
import VideoPlayer from './VideoPlayer';
import thumbnail from '../../assets/thumbnail.svg';
import { Button } from '@mui/material';
import downloadIcon from '../../assets/download.svg';
import variables from '../../utils/variables';
import { saveAs } from 'file-saver';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../../constants/seo';
import { Helmet } from 'react-helmet';
import PlaceBidDialog from '../MarketPlace/ActiveCard/PlaceBid/PlaceBidDialog';
import MenuPopover from '../MarketPlace/MenuPopover';
import BurnDialog from '../MarketPlace/BurnDialog';
import ImageSkeletonLoader from '../../components/SkeletonLoader/SingleAsset/ImageSkeletonLoader';
import DeListDialog from '../MarketPlace/ActiveCard/DeList/DeListDialog';
import TransferDialog from '../MarketPlace/ActiveCard/TransferSell/TransferDialog';
import ListDialog from '../MarketPlace/ActiveCard/TransferSell/ListDialog';
import BuyNFTDialogResponse from '../MarketPlace/ActiveCard/PurchaseCard/BuyNFTDialogResponse';
import CardSkeletonLoader from '../../components/SkeletonLoader/SingleAsset/CardSkeletonLoader';
import Card from './Card';

class SingleAsset extends React.Component {
    componentDidMount () {
        if (this.props.match && this.props.match.params && this.props.match.params.nftID) {
            this.props.fetchNFT(this.props.match.params.nftID);
            this.props.fetchNFTActivity(this.props.match.params.nftID, DEFAULT_SKIP, DEFAULT_LIMIT);
        } else {
            this.props.history.push('/nfts');
        }
    }

    saveFile (value, nft) {
        saveAs(value, nft && nft.name + '.pdf');
    }

    render () {
        const {
            nftDetails,
            nftDetailsInProgress,
        } = this.props;
        const url = nftDetails && nftDetails.file && nftDetails.file.IPFS_hash
            ? `${IPFS_URL}/${nftDetails.file.IPFS_hash}`
            : nftDetails && nftDetails.media_uri
                ? nftDetails.media_uri
                : null;

        const poster = nftDetails && nftDetails.file && nftDetails.file['preview_IPFS_hash']
            ? `${IPFS_URL}/${nftDetails.file['preview_IPFS_hash']}`
            : nftDetails && nftDetails.preview_uri
                ? nftDetails.preview_uri
                : null;
        const mediaType = nftDetails && (nftDetails.media_type) && nftDetails.media_type;

        return (
            <div className="single_asset scroll_bar">
                {nftDetailsInProgress
                    ? <ImageSkeletonLoader/>
                    : <div className="pdf_section_asset">
                        <Helmet>
                            <meta charSet="utf-8"/>
                            <title>{nftDetails && nftDetails.name && nftDetails.denom_id && nftDetails.denom_id.name
                                ? nftDetails.name + ' - ' + nftDetails.denom_id.name + ' | OmniFlix'
                                : nftDetails && nftDetails.name
                                    ? nftDetails.name + ' | OmniFlix'
                                    : DEFAULT_TITLE}</title>
                            <meta
                                content={nftDetails && nftDetails.description
                                    ? nftDetails.description
                                    : DEFAULT_DESCRIPTION}
                                name="description"/>
                        </Helmet>
                        {mediaType && getAssetType(mediaType) === 'document' && url
                            ? <iframe
                                className="pdf_view"
                                src={url}
                                title={nftDetails.name}/>
                            : mediaType &&
                            getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                ? <div className="active_asset_image">
                                    <ImageOnLoad
                                        main
                                        alt="icon"
                                        preview={poster}
                                        src={url}/>
                                </div>
                                : mediaType && getAssetType(mediaType) === 'image'
                                    ? <div className="active_asset_image">
                                        <ImageOnLoad
                                            main
                                            alt="icon"
                                            cdn={nftDetails.cloudflare_cdn && nftDetails.cloudflare_cdn.variants}
                                            preview={poster}
                                            src={url}/>
                                    </div>
                                    : mediaType && (getAssetType(mediaType) === 'video' || getAssetType(mediaType) === 'audio')
                                        ? <div className="video_content">
                                            <VideoPlayer poster={poster} type={mediaType} url={url}/>
                                        </div>
                                        : <div className="active_asset_image">
                                            <img alt="thumbnail" src={thumbnail}/>
                                        </div>}
                        {mediaType && getAssetType(mediaType) === 'document' &&
                            <div className="pdf_download">
                                <Button onClick={() => this.saveFile(url, nftDetails)}>
                                    <img alt="download" src={downloadIcon}/>
                                    <p>{variables[this.props.lang]['download_file']}</p>
                                </Button>
                            </div>}
                    </div>}
                {nftDetailsInProgress
                    ? <CardSkeletonLoader/>
                    : <Card/>}
                <DeListDialog/>
                <TransferDialog/>
                <ListDialog/>
                <BuyNFTDialogResponse/>
                <PlaceBidDialog/>
                <MenuPopover/>
                <BurnDialog/>
            </div>
        );
    }
}

SingleAsset.propTypes = {
    fetchNFT: PropTypes.func.isRequired,
    fetchNFTActivity: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    nftDetails: PropTypes.object.isRequired,
    nftDetailsInProgress: PropTypes.bool.isRequired,
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
        nftDetailsInProgress: state.marketplace.nftDetails.inProgress,
    };
};

const actionsToProps = {
    fetchNFT,
    fetchNFTActivity,
};

export default withRouter(connect(stateToProps, actionsToProps)(SingleAsset));
