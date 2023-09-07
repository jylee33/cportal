/**
 * PerfData
 * @param chartId
 * @constructor
 */
var PerfData = function (chartId) {
    this.chartId = chartId;
    this.chart = null;
};

PerfData.prototype = function () {

    var initialize = function () {

    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, itemType: 1, mngNo: 1, itemIdx: 1, date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */

    var searchDevPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/rawPerfChart/getPerfChartForDev.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    /**
     *  차트 데이터 조회
     * @param params {itemType: 1, mngNo: 1, timeToday: '20221024000000', timeYesterday: '20221023000000'}
     */
    var searchDevThresholdPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/rawPerfChart/getPerfForDevThreshold.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    var searchEsDevPerf = function (_this, params, searchDataResult) {
        var hmEs = new HmES();
        var client = hmEs.getClient();

        // 스크롤로 가져온 모든 데이터 담을 변수
        var allResult = [];

        var param = params;
        var itemType = param.itemType;

        switch (itemType) {
            case '1':
            case '2':
            case '5':
            case '14':
                param.yValue = ['RATE'];
                param.seriesName = ['평균'];
                break;
            case '11':
                param.yValue = ['CNT'];
                param.seriesName = ['평균'];
                break;
            case '6':
                param.yValue = ['RESP_AVG'];
                param.seriesName = ['평균'];
                break;
        }
        param.indexName = param.itemType != 6 ? 'cm_dev_perf_0' : 'cm_ip_perf_0';
        param.source = ['YMDHMS_FT'].concat(param.yValue)

        param.body = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                'YMDHMS': {
                                    gte: param.date1 + param.time1 + '00',
                                    lte: param.date2 + param.time2 + '59'
                                }
                            }
                        },
                        {term: {MNG_NO: param.mngNo}}
                    ],
                    must_not: [],
                    should: []
                }
            },
            from: 0,
            size: 10000,
            sort: [{'YMDHMS': 'asc'}],
            aggs: {
                'group_by_ymdhms': {
                    'terms': {'field': 'YMDHMS'},
                    aggs: {'group_by_mngno': {'terms': {'field': 'MNG_NO'}}}
                }
            }
        };
        if (param.itemType != 6) {
            param.body.query.bool.must.push({term: {ITEM_TYPE: param.itemType}});
            param.body.query.bool.must.push({
                query_string: {
                    default_field: "IDX",
                    query: ((param.itemIdx) == '-1' ? '*' : param.itemIdx)
                }
            });
        }
        if (param.itemType != 6 && param.hasOwnProperty('moduleTmplOidSeq') && param.moduleTmplOidSeq > 0) {
            param.body.query.bool.must.push({term: {MODULE_TMPL_OID_SEQ: param.moduleTmplOidSeq}});
        }

        param.callbackFn = function (err, resp, stat) {
            if (!resp.hasOwnProperty('hits')) {
                return;
            } else {
                var total = resp.hits.total;
                var result = resp.hits.hits;

                result.forEach(function (hit) {
                    allResult.push(hit._source);
                });

                if ((resp.hits.total > allResult.length)) {
                    client.scroll({
                        scrollId: resp._scroll_id,
                        scroll: '30s'
                    }, callbackFn);
                } else {
                    var data = [];
                    $.each(allResult, function (i, v) {
                        data.push({
                            DT_YMDHMS: HmHighchart.change_date(v.YMDHMS_FT).getTime(),
                            RATE: parseInt(v[param.yValue])
                        });
                    });
                    searchDataResult.call(_this, params, data);
                }
            }
        }
        hmEs.search(param);
    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, itemType: 1, mngNo: 1, itemIdx: 1, date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */

    var searchIfTotalPerfTopN = function (_this, params, searchDataResult) {
        Server.post('/main/popup/devDetail/getIfTotalPerfTopNList.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, mngNo: 1, ifIdx: 1, itemType: 'BPS|BPSPER|PPS|ERR', date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */
    var searchIfPerf = function (_this, params, searchDataResult) {

        Server.post('/main/popup/rawPerfChart/getPerfChartForIf.do', {
            data: params,
            success: function (result) {

                searchDataResult.call(_this, params, result);
            }
        });
    }

    /**
     *  차트 데이터 조회
     * @param params {}
     */
    var searchIfPerfTopN = function (_this, params, searchDataResult) {

        Server.post('/main/nms/ifPerf/getIfPerfBpsList.do', {
            data: params,
            success: function (result) {

                searchDataResult.call(_this, params, result);
            }
        });
    }

    /**
     *  차트 데이터 조회
     * @param params {itemType: 1, mngNo: 1, timeToday: '20221024000000', timeYesterday: '20221023000000'}
     */
    var searchIfThresholdPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/rawPerfChart/getPerfForIfThreshold.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    var searchEsIfPerf = function (_this, params, searchDataResult) {
        var hmEs = new HmES();
        var client = hmEs.getClient();

        // 스크롤로 가져온 모든 데이터 담을 변수
        var allResult = [];

        var param = params;
        var itemType = param.itemType;
        param.indexName = 'cm_if_perf_0';
        switch (itemType) {
            case 'BPS':
                param.yValue = ['AVG_INBPS', 'AVG_OUTBPS'];
                // param.seriesName = ['IN BPS', 'OUT BPS'];
                break;
            case 'BPSPER':
                param.yValue = ['INBPSRATE', 'OUTBPSRATE'];
                // param.seriesName = ['IN BPS%', 'OUT BPS%'];
                break;
            case 'PPS':
                param.yValue = ['AVG_INPPS', 'AVG_OUTPPS'];
                // param.seriesName = ['IN PPS', 'OUT PPS'];
                break;
            case 'ERR':
                param.yValue = ['AVG_INERR', 'AVG_OUTERR'];
                // param.seriesName = ['IN ERR', 'OUT ERR'];
                break;
            case 'CRC':
                param.yValue = ['AVG_CRC'];
                // param.seriesName = ['IN ERR', 'OUT ERR'];
                break;
            case 'COL':
                param.yValue = ['AVG_COLLISION'];
                // param.seriesName = ['IN ERR', 'OUT ERR'];
                break;
            case 'NONUNICAST':
                param.yValue = ['AVG_INNUPPS', 'AVG_OUTNUPPS'];
                // param.seriesName =  ['IN NONUNICAST', 'OUT NONUNICAST'];
                break;
            case 'DISCARD':
                param.yValue = ['AVG_INDISCARD', 'AVG_OUTDISCARD'];
                // param.seriesName =  ['IN DISCARD', 'OUT DISCARD'];
                break;
            case 'MULTICAST':
                param.yValue = ['AVG_INMCASTPPS', 'AVG_OUTMCASTPPS'];
                // param.seriesName =  ['IN MULTICAST', 'OUT MULTICAST'];
                break;
            case 'BROADCAST':
                param.yValue = ['AVG_INBCASTPPS', 'AVG_OUTBCASTPPS'];
                // param.seriesName =  ['IN BROADCAST', 'OUT BROADCAST'];
                break;
        }
        param.source = ['YMDHMS_FT'].concat(param.yValue);

        param.body = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                'YMDHMS': {
                                    gte: param.date1 + param.time1 + '00',
                                    lte: param.date2 + param.time2 + '59'
                                }
                            }
                        },
                        {term: {MNG_NO: param.mngNo}},
                        {term: {IF_KEY: param.ifIdx}},
                    ],
                    must_not: [],
                    should: []
                }
            },
            from: 0, size: 10000, sort: [{'YMDHMS': 'asc'}], aggs: {}
        };
        param.callbackFn = function (err, resp, stat) {
            if (!resp.hasOwnProperty('hits')) {
                return;
            } else {
                var total = resp.hits.total;
                var result = resp.hits.hits;

                result.forEach(function (hit) {
                    allResult.push(hit._source);
                });

                if ((resp.hits.total > allResult.length)) {
                    // ask elasticsearch for the next set of hits from this search
                    client.scroll({
                        scrollId: resp._scroll_id,
                        scroll: '30s'
                    }, callbackFn);
                } else {
                    var data = [];
                    $.each(allResult, function (i, v) {
                        data.push({
                            DT_YMDHMS: HmHighchart.change_date(v.YMDHMS_FT).getTime(),
                            AVG_IN: parseInt(v[param.yValue[0]]),
                            AVG_OUT: parseInt(v[param.yValue[1]])
                        });
                    });
                    searchDataResult.call(_this, params, data);
                }
            }
        }

        hmEs.search(param);
    }


    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, mngNo: 1, ifIdx: 1, itemType: 'CPU|MEM (NETWORK|DISK 미구현)', date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */
    var searchSvrPerf = function (_this, params, searchDataResult) {

        Server.post('/main/popup/rawPerfChart/getPerfChartForSvr.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });

    }


    var searchEsSvrPerf = function (_this, params, searchDataResult) {
        var hmEs = new HmES();
        var client = hmEs.getClient();

        // 스크롤로 가져온 모든 데이터 담을 변수
        var allResult = [];

        var param = params;
        var itemType = param.itemType;
        switch (itemType) {
            case '1':
                param.indexName = 'nt_svr_cpu_0';
                this.yValue = ['user_pct'];
                break;
            case '2':
                param.indexName = 'nt_svr_memory_0';
                this.yValue = ['used_pct', 'swap_used_pct'];
                break;
            case "3": //network
                this.indexName = 'nt_svr_network_0.';
                this.yValue = [];
                break;
            case "4": //disk I/O
                this.indexName = 'nt_svr_diskio_0.';
                this.yValue = [];
                break;
        }
        param.source = ['YMDHMS_FT'].concat(param.yValue);

        param.body = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                'YMDHMS': {
                                    gte: param.date1 + param.time1 + '00',
                                    lte: param.date2 + param.time2 + '59'
                                }
                            }
                        },
                        {term: {MNG_NO: param.mngNo}},
                        {term: {IF_KEY: param.ifIdx}},
                    ],
                    must_not: [],
                    should: []
                }
            },
            from: 0, size: 10000, sort: [{'YMDHMS': 'asc'}], aggs: {}
        };
        param.callbackFn = function (err, resp, stat) {
            if (!resp.hasOwnProperty('hits')) {
                console.log('elasticSearch data is empty');
                return;
            } else {
                var total = resp.hits.total;
                var result = resp.hits.hits;

                result.forEach(function (hit) {
                    allResult.push(hit._source);
                });

                if ((resp.hits.total > allResult.length)) {
                    // ask elasticsearch for the next set of hits from this search
                    client.scroll({
                        scrollId: resp._scroll_id,
                        scroll: '30s'
                    }, callbackFn);
                } else {
                    var data = [];
                    $.each(allResult, function (i, v) {
                        // data.push({ DT_YMDHMS: HmHighchart.change_date(v.YMDHMS_FT).getTime(), AVG_IN: parseInt(v[param.yValue[0]]), AVG_OUT: parseInt(v[param.yValue[1]]) });
                    });
                    searchDataResult.call(_this, params, data);
                }
            }
        }

        hmEs.search(param);
    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, mngNo: 1, ifIdx: 1, itemType: 'CPU|MEM (NETWORK|DISK 미구현)', date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */
    var searchAloneUpsPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/aloneUpsPerf/getPerfChartForAloneUps.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    var searchAloneUpsTempPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/aloneUpsPerf/getPerfTempChartForAloneUps.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    /**
     *  차트 데이터 조회
     * @param params { date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */

    var searchApPerf = function (_this, params, searchDataResult) {

        Server.post('/main/popup/apDetail/getApUsageChartListForApBw.do', {
            data: params,
            success: function (result) {

                searchDataResult.call(_this, params, result);
            }
        });

    }
    /**
     *  차트 데이터 조회
     * @param params { date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */

    var searchApClientPerf = function (_this, params, searchDataResult) {

        Server.post('/main/popup/apClientDetail/getApClientUsageChartList.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });

    }

    /**
     *  차트 데이터 조회
     * @param params { date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */

    var searchApClientAppPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/apClientDetail/getApClientAppChartList.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, itemType: 1, mngNo: 1, itemIdx: 1, date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */

    var searchSvrWasPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/rawPerfChart/getPerfChartForWas.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }
    var searchSvrDbmsPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/rawPerfChart/getPerfChartForDbms.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    var searchDbmsTiberoPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/dbmsTiberoDetail/getPerfChartForTibero.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    /**
     *  차트 데이터 조회
     * @param params {itemType: 1, mngNo: 1, timeToday: '20221024000000', timeYesterday: '20221023000000'}
     */
    var searchSvrThresholdPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/rawPerfChart/getPerfForSvrThreshold.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    var searchVsvrPerf = function (_this, params, searchDataResult) {

        Server.post('/main/popup/rawPerfChart/getPerfChartForVsvr.do', {
            data: params,
            success: function (result) {

                searchDataResult.call(_this, params, result);

            }
        });
    }

    var searchCustomPerf = function (_this, params, url, searchDataResult) {
        Server.post(url, {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    /* cm_ip_perf 조회 */
    var searchIpPerf = function (_this, params, searchDataResult) {
        Server.post('/main/popup/rawPerfChart/getPerfChartForIp.do', {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    /** 외부연동 URL 데이터 조회
     * */
    var searchExternalGet = function (_this, params, url, searchDataResult) {
        Server_external.get(url, {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    var searchExternalPost = function (_this, params, url, searchDataResult) {
        Server_external.post(url, {
            data: params,
            success: function (result) {
                searchDataResult.call(_this, params, result);
            }
        });
    }

    return {
        initialize: initialize,
        searchDevThresholdPerf: searchDevThresholdPerf,
        searchDevPerf: searchDevPerf,
        searchIpPerf: searchIpPerf,
        searchEsDevPerf: searchEsDevPerf,
        searchIfTotalPerfTopN: searchIfTotalPerfTopN,
        searchIfPerf: searchIfPerf,
        searchIfPerfTopN: searchIfPerfTopN,
        searchIfThresholdPerf: searchIfThresholdPerf,
        searchEsIfPerf: searchEsIfPerf,
        searchSvrPerf: searchSvrPerf,
        searchEsSvrPerf: searchEsSvrPerf,
        searchAloneUpsPerf: searchAloneUpsPerf,
        searchAloneUpsTempPerf: searchAloneUpsTempPerf,
        searchApPerf: searchApPerf,
        searchApClientPerf: searchApClientPerf,
        searchApClientAppPerf: searchApClientAppPerf,
        searchSvrWasPerf: searchSvrWasPerf,
        searchSvrDbmsPerf: searchSvrDbmsPerf,
        searchDbmsTiberoPerf: searchDbmsTiberoPerf,
        searchSvrThresholdPerf: searchSvrThresholdPerf,
        searchVsvrPerf: searchVsvrPerf,
        searchCustomPerf: searchCustomPerf,
        searchExternalGet: searchExternalGet,
        searchExternalPost: searchExternalPost
    }

}();