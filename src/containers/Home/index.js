import React, { Component, lazy, Suspense } from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import variables from '../../utils/variables';
import rightArrow from '../../assets/right-arrow.svg';
import twitterIcon from '../../assets/social/twitter.svg';
import telegramIcon from '../../assets/social/telegram.svg';
import githubIcon from '../../assets/social/github.svg';
import discordIcon from '../../assets/social/discord.svg';
import websiteIcon from '../../assets/social/website.svg';
import youtubeIcon from '../../assets/social/youtube.svg';
import { withRouter } from 'react-router';
import { DEFAULT_LIMIT, DEFAULT_SKIP, socialLinks } from '../../config';
import { fetchListings, setMarketPlaceTab } from '../../actions/marketplace';
import { fetchHomeCollections, fetchLaunchpadCollections } from '../../actions/home';
import DotsLoading from '../../components/DotsLoading';
import { ReactComponent as ArrowRight } from '../../assets/arrow-right-white.svg';

const Collections = lazy(() => import('./Collections').then().catch());
const Launchpad = lazy(() => import('./Launchpad').then().catch());
const RecentlyListed = lazy(() => import('./RecentlyListed').then().catch());

class Home extends Component {
    constructor (props) {
        super(props);

        this.handleLaunchPad = this.handleLaunchPad.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount () {
        if (this.props.collections && !this.props.collections.length &&
            !this.props.collectionsInProgress) {
            this.props.fetchCollections(null, DEFAULT_SKIP, 12);
        }
        if (this.props.launchpadCollections && !this.props.launchpadCollections.length &&
            !this.props.launchpadCollectionsInProgress) {
            this.props.fetchLaunchpadCollections(null, DEFAULT_SKIP, 12);
        }
        if (this.props.listings && !this.props.listings.length &&
            !this.props.listingsInProgress) {
            this.props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT);
        }
    }

    onClick (url) {
        if (url) {
            window.open(url, '_blank');
        }
    }

    handleLaunchPad () {
        this.props.history.push('/nfts');
        this.props.setMarketPlaceTab('launchpad');
    }

    render () {
        return (
            <div className="home_page scroll_bar">
                {this.props.launchpadCollections && this.props.launchpadCollections.length
                    ? <>
                        <div className="section1">
                            <h2>{variables[this.props.lang]['explore_launchpad']}</h2>
                            <Button onClick={this.handleLaunchPad}>
                                {variables[this.props.lang].explore}
                            </Button>
                        </div>
                        <Suspense fallback={<DotsLoading style={{ minHeight: '300px' }}/>}>
                            <Launchpad/>
                        </Suspense>
                    </> : null}
                <div className="section1">
                    <h2>{variables[this.props.lang]['explore_head']}</h2>
                    <Button onClick={() => this.props.history.push('/nfts')}>
                        {variables[this.props.lang].explore}
                    </Button>
                </div>
                <Suspense fallback={<DotsLoading style={{ minHeight: '300px' }}/>}>
                    <Collections/>
                </Suspense>
                <div className="recently_listed">
                    <div className="header">
                        <h2>{variables[this.props.lang].recently_listed}</h2>
                        <Button onClick={() => this.props.history.push('/nfts')}>
                            <p>{variables[this.props.lang].explore_more}</p>
                            <img alt="arrow" src={rightArrow}/>
                        </Button>
                    </div>
                    <Suspense fallback={<DotsLoading style={{ minHeight: '300px' }}/>}>
                        <RecentlyListed/>
                    </Suspense>
                </div>
                <div className="footer">
                    <div className="section1">
                        <div className="left">
                            <span>{variables[this.props.lang].footer_content1}</span>
                            <p>{variables[this.props.lang].footer_content2}</p>
                        </div>
                        <Button onClick={() => this.onClick(socialLinks.WEBSITE)}>
                            <p>{variables[this.props.lang].get_in_touch}</p>
                            <ArrowRight/>
                        </Button>
                    </div>
                    <div className="social_icons">
                        <Button>
                            <img alt="twitter" src={twitterIcon} onClick={() => this.onClick(socialLinks.TWITTER)}/>
                        </Button>
                        <Button>
                            <img alt="telegram" src={telegramIcon} onClick={() => this.onClick(socialLinks.TELEGRAM)}/>
                        </Button>
                        <Button>
                            <img alt="discord" src={discordIcon} onClick={() => this.onClick(socialLinks.DISCORD)}/>
                        </Button>
                        <Button>
                            <img alt="github" src={githubIcon} onClick={() => this.onClick(socialLinks.GITHUB)}/>
                        </Button>
                        <Button>
                            <img alt="website" src={websiteIcon} onClick={() => this.onClick(socialLinks.WEBSITE)}/>
                        </Button>
                        <Button>
                            <img alt="youtube" src={youtubeIcon} onClick={() => this.onClick(socialLinks.YOUTUBE)}/>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    address: PropTypes.string.isRequired,
    collections: PropTypes.array.isRequired,
    collectionsInProgress: PropTypes.bool.isRequired,
    fetchCollections: PropTypes.func.isRequired,
    fetchLaunchpadCollections: PropTypes.func.isRequired,
    fetchListings: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    launchpadCollections: PropTypes.array.isRequired,
    launchpadCollectionsInProgress: PropTypes.bool.isRequired,
    listings: PropTypes.array.isRequired,
    listingsInProgress: PropTypes.bool.isRequired,
    setMarketPlaceTab: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        collections: state.home.homeCollections.result,
        collectionsInProgress: state.home.homeCollections.inProgress,
        lang: state.language,
        launchpadCollections: state.home.launchpadCollections.result,
        launchpadCollectionsInProgress: state.home.launchpadCollections.inProgress,
        listings: state.marketplace.listings.result,
        listingsInProgress: state.marketplace.listings.inProgress,
    };
};

const actionToProps = {
    fetchCollections: fetchHomeCollections,
    fetchLaunchpadCollections,
    fetchListings,
    setMarketPlaceTab,
};

export default withRouter(connect(stateToProps, actionToProps)(Home));
