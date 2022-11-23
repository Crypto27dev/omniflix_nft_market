import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../../../utils/variables';
import { config } from '../../../../../config';
import { ReactComponent as ArrowIcon } from '../../../../../assets/top_right_arrow.svg';
import { ReactComponent as ArrowFirstIcon } from '../../../../../assets/top_right_first.svg';

const TotalSale = (props) => {
    const tokens = (props.totalSale && props.totalSale.tokenPrice) / 100;
    let royalty = props.totalSale && props.totalSale.details && props.totalSale.details.royalty_share;
    royalty = royalty * 100;

    let royaltyTokens = (props.totalSale && props.totalSale.tokenPrice - tokens) / 100;
    royaltyTokens = royaltyTokens * royalty;

    let denom = config.COIN_DENOM;
    if (props.totalSale && props.totalSale.tokenValue &&
        !(props.totalSale && props.totalSale.tokenValue && props.totalSale.tokenValue.value)) {
        denom = props.totalSale && props.totalSale.tokenValue && props.totalSale.tokenValue.network && props.totalSale.tokenValue.network.display_denom;
    }

    return (props.totalSale && props.totalSale.tokenValue) && (props.totalSale && props.totalSale.tokenPrice)
        ? (
            <div className="total_sale">
                <h3>{variables[props.lang]['total_sale_breakdown']}</h3>
                <div className="row">
                    <p className="label">{variables[props.lang]['market_place_share']}&nbsp;(1%)</p>
                    <p className="value">{tokens}&nbsp;{denom}</p>
                </div>
                <div className="row">
                    <p className="label">{variables[props.lang]['sale_breakdown']}&nbsp;({99}%)</p>
                    <p className="value">{((props.totalSale && props.totalSale.tokenPrice) - tokens)}&nbsp;{denom}</p>
                </div>
                {royalty
                    ? <div className="creator_royalty">
                        <div className="row">
                            <p className="label">
                                <ArrowFirstIcon/>
                                {variables[props.lang]['creators_royalty']}&nbsp;({royalty.toLocaleString()}%)
                            </p>
                            <p className="value">{royaltyTokens.toLocaleString()}&nbsp;{denom}</p>
                        </div>
                        <div className="row splits">
                            <p className="label">
                                <ArrowIcon/>
                                {variables[props.lang].splits}&nbsp;({99 - royalty}%)
                            </p>
                            <p className="value">{((props.totalSale && props.totalSale.tokenPrice) - tokens) - (royaltyTokens)}&nbsp;{denom}</p>
                        </div>
                    </div> : null}
                {props.totalSale && props.totalSale.splitInfo && props.totalSale.splitInfo.length
                    ? props.totalSale.splitInfo.map((val, index) => {
                        const percentageTokens = royaltyTokens
                            ? ((props.totalSale && props.totalSale.tokenPrice) - (tokens + royaltyTokens)) / 100
                            : ((props.totalSale && props.totalSale.tokenPrice) - tokens) / 100;
                        const weight = props.deList
                            ? val.weight && (Number(val.weight) * 100)
                            : val.weight && Number(val.weight);

                        return val.address !== '' && val.weight !== '' && (
                            <div
                                key={index}
                                className={royalty ? 'royalty_splits row info splits_info' : 'row info splits_info'}>
                                <div className="label">
                                    {index === 0
                                        ? <ArrowFirstIcon/>
                                        : <ArrowIcon/>}
                                    {val.address && val.address.length > 20
                                        ? <div className="tx_hash">
                                            <div className="hash_text" title={val.address}>
                                                <p className="name">{val.address}</p>
                                                {val.address &&
                                                    val.address.slice(val.address.length - 6, val.address.length)}
                                            </div>
                                        </div>
                                        : <div className="tx_hash" title={val.address}>
                                            {val.address}
                                        </div>}&nbsp;
                                    ({weight && weight.toFixed(2)}%)
                                </div>
                                <p className="value">{(percentageTokens * weight).toFixed(2)}&nbsp; {denom}</p>
                            </div>
                        );
                    }) : null}
            </div>
        ) : null;
};

TotalSale.propTypes = {
    lang: PropTypes.string.isRequired,
    totalSale: PropTypes.object.isRequired,
    deList: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

export default connect(stateToProps)(TotalSale);
