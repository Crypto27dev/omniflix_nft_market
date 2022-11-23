import React from 'react';
import DataTable from '../../components/DataTable';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import Icon from '../../components/Icon';
import { withRouter } from 'react-router';
import { fetchCollectionsTable } from '../../actions/marketplace';
import thumbnail from '../../assets/thumbnail.svg';
import moment from 'moment';
import { config } from '../../config';
import { commaSeparator, splitDecimals } from '../../utils/numbers';
import { Tooltip } from '@mui/material';
import { getAssetType, getAssetTypeExtension } from '../../utils/strings';
import VideoOnLoad from '../../components/ImageOnLoad/VideoOnLoad';
import ImageOnLoad from '../../components/ImageOnLoad/BackgroundImage';
import ImageSkeletonLoader from '../../components/SkeletonLoader/CollectionTable/Image';
import TextSkeletonLoader from '../../components/SkeletonLoader/CollectionTable/Text';

const Table = (props) => {
    const onClick = (id, page) => {
        if (page === 'collection') {
            props.history.push('/collection/' + id);
        } else if (page === 'my_account') {
            props.history.push('/account/' + id + '/nfts');
        }
    };

    const options = {
        textLabels: {
            body: {
                noMatch: <div className="no_data_table"> No data found </div>,
                toolTip: 'Sort',
            },
            viewColumns: {
                title: 'Show Columns',
                titleAria: 'Show/Hide Table Columns',
            },
        },
        onSearchChange: (searchText) => {
            if (props.collections && props.collections.length === 0) {
                return;
            }

            props.fetchCollectionsTable(props.address, props.skip, props.limit, props.sortBy, props.order, searchText);
        },
        onChangePage: (currentPage) => {
            if (props.collections && props.collections.length === 0) {
                return;
            }

            props.fetchCollectionsTable(props.address, props.limit * currentPage, props.limit, props.sortBy, props.order, props.searchKey);
        },
        onChangeRowsPerPage: (numberOfRows) => {
            if (props.collections && props.collections.length === 0) {
                return;
            }

            props.fetchCollectionsTable(props.address, props.skip, numberOfRows, props.sortBy, props.order, props.searchKey);
        },
        onColumnSortChange: (changedColumn, direction) => {
            if (props.collections && props.collections.length === 0) {
                return;
            }

            props.fetchCollectionsTable(props.address, props.skip, props.limit, changedColumn, direction, props.searchKey);
        },
        responsive: 'standard',
        serverSide: true,
        pagination: true,
        count: props.total,
        selectableRows: 'none',
        download: false,
        filter: false,
        print: false,
        viewColumns: true,
    };

    const columns = [{
        name: 'image',
        label: 'Image',
        options: {
            sort: false,
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <ImageSkeletonLoader/>;
                }

                const image = value && value.preview_uri ? value.preview_uri : thumbnail;
                const mediaType = value && value.media_type;

                return (
                    <React.Fragment>
                        {mediaType &&
                        getAssetType(mediaType) === 'video'
                            ? <div
                                className="collection_icon inline_video_section"
                                onClick={() => onClick(value.id, 'collection')}>
                                <VideoOnLoad
                                    src={image}
                                    type={mediaType}/>
                            </div>
                            : mediaType &&
                            getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                ? <ImageOnLoad
                                    className="collection_icon"
                                    src={image}
                                    onClick={() => onClick(value.id, 'collection')}/>
                                : <ImageOnLoad
                                    cdn={value && value.cloudflare_cdn && value.cloudflare_cdn.variants}
                                    className="collection_icon"
                                    src={image}
                                    onClick={() => onClick(value.id, 'collection')}/>}
                    </React.Fragment>
                );
            },
        },
    }, {
        name: 'name',
        label: 'Collection Name',
        options: {
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                const name = value.name && (value.name || value.symbol);
                return (
                    <Tooltip title={value.name + ' | ' + value.symbol}>
                        <div
                            className="collection_name"
                            onClick={() => onClick(value.id, 'collection')}>
                            {name}
                        </div>
                    </Tooltip>
                );
            },
        },
    }, {
        name: 'creator',
        label: 'Creator',
        options: {
            sort: false,
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width={180}/>;
                }

                return (
                    <div
                        className="to_value tx_hash creator_address"
                        onClick={() => onClick(value, 'my_account')}>
                        <div className="hash_text" title={value}>
                            <p className="name">{value}</p>
                            {value && value.slice(value.length - 6, value.length)}
                        </div>
                    </div>
                );
            },
        },
    }, {
        name: 'total_nfts',
        label: 'Total NFTs',
        options: {
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                return (
                    <div className="">
                        {value}
                    </div>
                );
            },
        },
    }, {
        name: 'unique_owners',
        label: 'Unique Owners',
        options: {
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                return (
                    <div className="">
                        {value}
                    </div>
                );
            },
        },
    }, {
        name: 'total_lists',
        label: 'Listed NFTs',
        options: {
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                return (
                    <div className="">
                        {value}
                    </div>
                );
            },
        },
    }, {
        name: 'owned_nfts',
        label: 'My NFTs',
        options: {
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                return (
                    (value || value === 0)
                        ? <div className="badge">
                            {value}
                        </div>
                        : <div>
                            N/A
                        </div>
                );
            },
        },
    }, {
        name: 'owned_lists',
        label: 'My Listed NFTs',
        options: {
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                return (
                    (value || value === 0)
                        ? <div className="badge">
                            {value}
                        </div>
                        : <div>
                            N/A
                        </div>
                );
            },
        },
    }, {
        name: 'created_at',
        label: 'Created Date',
        options: {
            display: false,
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                return (
                    <div className="created_date">
                        {value && moment(value).format('MMM Do \'YY')}
                    </div>
                );
            },
        },
    }, {
        name: 'view',
        label: 'View',
        options: {
            sort: false,
            display: false,
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                return (
                    <div className="link_div" onClick={() => onClick(value, 'collection')}>
                        <Icon className="link" icon="link"/>
                    </div>
                );
            },
        },
    }];

    if (props.ibcTokensList && props.ibcTokensList.length) {
        props.ibcTokensList.map((val, ind) => {
            const denom = val && val.network && val.network.display_denom;
            const ibcDenom = val && val.ibc_denom_hash;
            const obj = {
                name: `trade_info.${ibcDenom}`,
                label: `Traded Volume (${denom})`,
                options: {
                    customBodyRender: function (value) {
                        if (value === 'skeleton-loader') {
                            return <TextSkeletonLoader width="80%"/>;
                        }

                        let balance = 0;
                        const token = Object.keys(value).find((item, index) => {
                            const decimals = val && val.network && val.network.decimals
                                ? val.network.decimals
                                : config.COIN_DECIMALS;
                            balance = Object.values(value)[index] &&
                                splitDecimals(Object.values(value)[index] / (10 ** decimals));
                            if (ibcDenom === item) {
                                return item;
                            }

                            return null;
                        });

                        return (
                            token
                                ? <div>
                                    <div className="token_info">
                                        <span className="token_bal">
                                            {balance && balance.length
                                                ? <>
                                                    {balance.length && balance[0] && commaSeparator(balance[0])}
                                                    {balance.length && balance[1] &&
                                                        <span>.{balance.length && balance[1]}</span>}
                                                </>
                                                : 0}
                                        </span>
                                    </div>
                                </div> : <div>0</div>
                        );
                    },
                },
            };

            columns.splice(8 + ind, 0, obj);
            return null;
        });

        props.ibcTokensList.map((val, ind) => {
            const denom = val && val.network && val.network.display_denom;
            const ibcDenom = val && val.ibc_denom_hash;
            const obj = {
                name: `floor_prices.${ibcDenom}`,
                label: `Floor Price (${denom})`,
                options: {
                    customBodyRender: function (value) {
                        if (value === 'skeleton-loader') {
                            return <TextSkeletonLoader width="80%"/>;
                        }

                        let balance = 0;
                        const token = Object.keys(value).find((item, index) => {
                            const decimals = val && val.network && val.network.decimals
                                ? val.network.decimals
                                : config.COIN_DECIMALS;
                            balance = Object.values(value)[index] &&
                                splitDecimals(Object.values(value)[index] / (10 ** decimals));
                            if (ibcDenom === item) {
                                return item;
                            }

                            return null;
                        });

                        return (
                            token
                                ? <div>
                                    <div className="token_info">
                                        <span className="token_bal">
                                            {balance && balance.length
                                                ? <>
                                                    {balance.length && balance[0] && commaSeparator(balance[0])}
                                                    {balance.length && balance[1] &&
                                                        <span>.{balance.length && balance[1]}</span>}
                                                </>
                                                : 0}
                                        </span>
                                    </div>
                                </div> : <div>0</div>
                        );
                    },
                },
            };

            columns.splice(props.ibcTokensList.length + 8 + ind, 0, obj);
            return null;
        });
    }

    const tableData =
        props.collections && props.collections.length > 0
            ? props.collections.map((item, index) => {
                const array = [
                    item,
                    item,
                    item.creator,
                    item.total_nfts,
                    item.unique_owners,
                    item.total_lists,
                    item.owned_nfts,
                    item.owned_lists,
                    item.created_at ? item.created_at : '-',
                    item.id,
                ];
                array.splice(8, 0, ...[...Array(props.ibcTokensList && props.ibcTokensList.length).fill(item.trade_info), ...Array(props.ibcTokensList && props.ibcTokensList.length).fill(item.floor_prices)]);

                return array;
            })
            : [];

    const loadingData = Array.from(new Array(10)).map((item, index) => {
        const array = [
            'skeleton-loader',
            'skeleton-loader',
            'skeleton-loader',
            'skeleton-loader',
            'skeleton-loader',
            'skeleton-loader',
            'skeleton-loader',
            'skeleton-loader',
            'skeleton-loader',
            'skeleton-loader',
        ];
        array.splice(8, 0, ...[...Array(props.ibcTokensList && props.ibcTokensList.length).fill('skeleton-loader'), ...Array(props.ibcTokensList && props.ibcTokensList.length).fill('skeleton-loader')]);

        return array;
    });

    return (
        <>
            <DataTable
                columns={columns}
                data={props.inProgress ? loadingData : tableData}
                name=""
                options={options}/>
        </>
    );
};

Table.propTypes = {
    address: PropTypes.string.isRequired,
    collections: PropTypes.array.isRequired,
    fetchCollectionsTable: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    limit: PropTypes.number.isRequired,
    skip: PropTypes.number.isRequired,
    sortBy: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    order: PropTypes.string,
    searchKey: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,

        collections: state.marketplace.tableCollections.result,
        inProgress: state.marketplace.tableCollections.inProgress,
        total: state.marketplace.tableCollections.total,
        skip: state.marketplace.tableCollections.skip,
        limit: state.marketplace.tableCollections.limit,
        sortBy: state.marketplace.tableCollections.sortBy,
        order: state.marketplace.tableCollections.order,
        searchKey: state.marketplace.tableCollections.searchKey,
    };
};

const actionToProps = {
    fetchCollectionsTable,
};

export default withRouter(connect(stateToProps, actionToProps)(Table));
