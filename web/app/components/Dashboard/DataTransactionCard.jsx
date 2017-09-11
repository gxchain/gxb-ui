import React from 'react'
import {Apis} from 'gxbjs-ws'
import { Icon } from 'antd';
import notify from "actions/NotificationActions"
import ChainTypes from "../Utility/ChainTypes";
import Translate from "react-translate-component";
import FormattedAsset from "../Utility/FormattedAsset"
import BindToChainState from '../Utility/BindToChainState';

let curDate = new Date().toISOString().substr(0,19);
let preDate = new Date(new Date().getTime() - 24*60*60*1000).toISOString().substr(0,19); //前一天
let weekDate = new Date(new Date().getTime() - 7*24*60*60*1000).toISOString().substr(0,19); //前七天

class DataProductCard extends React.Component {
    static propTypes = {
        coreAsset: ChainTypes.ChainAsset.isRequired,
    };

    static defaultProps = {
        coreAsset: "1.3.0",
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            transaction_total_costs: 0,
            transaction_week_costs: 0,
            transaction_today_costs: 0,
            transaction_total_count: 0,
            transaction_week_count: 0,
            transaction_today_count: 0,
            transaction_pay_fees: 0,
        }
        this.statsInterval = null;
    }

    componentWillMount() {
        let self = this;
        self.loadTransactionCosts();
        self.loadTransactionCount();
        this.statsInterval = setInterval(function () {
            self.loadTransactionCosts();
            self.loadTransactionCount();
        },10 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.statsInterval);
        this.statsInterval = null;
    }

    loadTransactionCosts() {
        let self = this;
        self.setState({
            loading: true,
        });

        Apis.instance().db_api().exec('get_data_transaction_product_costs', ['2017-06-15T00:00:00',curDate]).then(function (res) {
            self.setState({
                transaction_total_costs: res,
            })
        }).catch(function (err) {
            console.error('error on fetching data products', err);
            notify.addNotification({
                message: `加载交易额数据失败`,
                level: "error",
                autoDismiss: 5
            });
            self.setState({
                loading: false
            })
        })

        Apis.instance().db_api().exec('get_data_transaction_product_costs', [weekDate,curDate]).then(function (res) {
            self.setState({
                transaction_week_costs: res
            })
        }).catch(function (err) {
            console.error('error on fetching data products', err);
            notify.addNotification({
                message: `加载交易额数据失败`,
                level: "error",
                autoDismiss: 5
            });
            self.setState({
                loading: false
            })
        })

        Apis.instance().db_api().exec('get_data_transaction_product_costs', [preDate,curDate]).then(function (res) {
            self.setState({
                transaction_today_costs: res
            })
        }).catch(function (err) {
            console.error('error on fetching data products', err);
            notify.addNotification({
                message: `加载交易额数据失败`,
                level: "error",
                autoDismiss: 5
            });
            self.setState({
                loading: false
            })
        })

        Apis.instance().db_api().exec('get_data_transaction_pay_fee', ['2017-06-15T00:00:00',curDate]).then(function (res) {
            self.setState({
                transaction_pay_fees: res
            })
            self.loadTransactionCount();
        }).catch(function (err) {
            console.error('error on fetching data products', err);
            notify.addNotification({
                message: `加载交易额数据失败`,
                level: "error",
                autoDismiss: 5
            });
            self.setState({
                loading: false
            })
        })
    }

    loadTransactionCount() {
        let self = this;
        self.setState({
            loading: true,
        });

        Apis.instance().db_api().exec('get_data_transaction_total_count', ['2017-06-15T00:00:00',curDate]).then(function (res) {
            self.setState({
                transaction_total_count: res
            })
        }).catch(function (err) {
            console.error('error on fetching data products', err);
            notify.addNotification({
                message: `加载交易次数数据失败`,
                level: "error",
                autoDismiss: 5
            });
            self.setState({
                loading: false
            })
        })

        Apis.instance().db_api().exec('get_data_transaction_total_count', [weekDate,curDate]).then(function (res) {
            self.setState({
                transaction_week_count: res
            })
        }).catch(function (err) {
            console.error('error on fetching data products', err);
            notify.addNotification({
                message: `加载交易次数数据失败`,
                level: "error",
                autoDismiss: 5
            });
            self.setState({
                loading: false
            })
        })

        Apis.instance().db_api().exec('get_data_transaction_total_count', [preDate,curDate]).then(function (res) {
            self.setState({
                transaction_today_count: res
            })
        }).catch(function (err) {
            console.error('error on fetching data products', err);
            notify.addNotification({
                message: `加载交易次数数据失败`,
                level: "error",
                autoDismiss: 5
            });
            self.setState({
                loading: false
            })
        })

        Apis.instance().db_api().exec('get_merchants_total_count', [preDate,curDate]).then(function (res) {
            self.setState({
                merchants_total_count: res
            })
        }).catch(function (err) {
            console.error('error on fetching data products', err);
            notify.addNotification({
                message: `加载交易次数数据失败`,
                level: "error",
                autoDismiss: 5
            });
            self.setState({
                loading: false
            })
        })
    }

    render() {
        let {coreAsset} = this.props;

        return (
            <div className="grid-block vertical page-layout">
                {/* First row of stats */}
                <div className="align-center grid-block shrink small-horizontal blocks-row">
                    <div className="grid-block text-center small-6 medium-3">
                        <div className="grid-content no-overflow">
                            <span className="txtlabel subheader"><Translate component="span" content="explorer.statistics.transaction_total_costs" /></span>
                            <h3 className="txtlabel success">
                                <FormattedAsset
                                    amount={this.state.transaction_total_costs}
                                    asset={coreAsset.get("id")}
                                    decimalOffset={5}
                                />
                            </h3>
                        </div>
                    </div>
                    <div className="grid-block text-center small-6 medium-3">
                        <div className="grid-content no-overflow">
                            <span className="txtlabel subheader"><Translate component="span" content="explorer.statistics.transaction_week_costs" /></span>
                            <h3 className="txtlabel">
                                <FormattedAsset
                                    amount={this.state.transaction_week_costs}
                                    asset={coreAsset.get("id")}
                                    decimalOffset={5}
                                />
                            </h3>
                        </div>
                    </div>
                    <div className="grid-block text-center small-6 medium-3">
                        <div className="grid-content no-overflow">
                            <span className="txtlabel subheader"><Translate component="span" content="explorer.statistics.transaction_today_costs" /></span>
                            <h3 className="txtlabel">
                                <FormattedAsset
                                    amount={this.state.transaction_today_costs}
                                    asset={coreAsset.get("id")}
                                    decimalOffset={5}
                                />
                            </h3>
                        </div>
                    </div>
                    <div className="grid-block text-center small-6 medium-3">
                        <div className="grid-content no-overflow">
                            <span className="txtlabel subheader"><Translate component="span" content="explorer.statistics.transaction_pay_fees" /></span>
                            <h3 className="txtlabel">
                                <FormattedAsset
                                    amount={this.state.transaction_pay_fees}
                                    asset={coreAsset.get("id")}
                                    decimalOffset={5}
                                />
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Second row of stats */}
                <div className="align-center grid-block shrink small-horizontal blocks-row">
                    <div className="grid-block text-center small-6 medium-3">
                        <div className="grid-content no-overflow">
                            <span className="txtlabel subheader"><Translate component="span" content="explorer.statistics.transaction_total_count" /></span>
                            <h3 className="txtlabel success">{this.state.transaction_total_count}</h3>
                        </div>
                    </div>
                    <div className="grid-block text-center small-6 medium-3">
                        <div className="grid-content no-overflow">
                            <span className="txtlabel subheader"><Translate component="span" content="explorer.statistics.transaction_week_count" /></span>
                            <h3 className="txtlabel">{this.state.transaction_week_count}</h3>
                        </div>
                    </div>
                    <div className="grid-block text-center small-6 medium-3">
                        <div className="grid-content no-overflow">
                            <span className="txtlabel subheader"><Translate component="span" content="explorer.statistics.transaction_today_count" /></span>
                            <h3 className="txtlabel">{this.state.transaction_today_count}</h3>
                        </div>
                    </div>
                    <div className="grid-block text-center small-6 medium-3">
                        <div className="grid-content no-overflow">
                            <span className="txtlabel subheader"><Translate component="span" content="explorer.statistics.merchants_total_count" /></span>
                            <h3 className="txtlabel warning">{this.state.merchants_total_count}</h3>
                        </div>
                    </div>
                </div>

                {/* Third row of furturn */}
                <div className="center">
                    <div className="banner-text-button" ><Icon type="bank" /> <Translate component="span" content="explorer.statistics.transaction_year_costs" />: <FormattedAsset amount={this.state.transaction_today_costs * 365} asset={coreAsset.get("id")} decimalOffset={5}/></div>
                    <div className="banner-text-button template"><Icon type="line-chart" /> <Translate component="span" content="explorer.statistics.transaction_year_count" />: {this.state.transaction_today_count * 365}<i></i></div>
                </div>
            </div>
        );
    }

}


export default BindToChainState(DataProductCard)