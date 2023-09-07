var $filterHistGrid;
var $filterHistDetailGrid;
var $cmdCheckGrid;
var _cmdNo, _ymdhmsStr, _mngNo;
var Main = {
    /** variable */
    initVariable: function () {
        $filterHistGrid = $('#filterHistGrid');
        $filterHistDetailGrid = $('#filterHistDetailGrid');
        $cmdCheckGrid = $('#cmdCheckGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;
        }
    },

    keyupEventControl: function (event) {
        if(event.keyCode === 13) {
            Main.search();
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmBoxCondition.createPeriod('');
        // 명령어 자동실행 이력
        HmGrid.create($filterHistGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        $.extend(data, HmBoxCondition.getPeriodParams());
                        data.sCmdName = $('#sCmdName').val();
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '점검필터 이력');
            },
            columns: [
                { text: '명령어번호', datafield: 'cmdNo', cellsalign: 'center', width: 200, hidden: true},
                { text: '실행일시', datafield: 'ymdhmsStr', cellsalign: 'center', width: 200},
                { text: '명령어 실행 작업명', datafield: 'cmdName', minwidth: 100},
                { text: '작업자_ID', datafield: 'userId', cellsalign: 'center', width: 100},
                { text: '작업자_IP', datafield: 'userIp', cellsalign: 'center', width: 100},
                { text: '대상장비수', datafield: 'totalCnt', width: 150, cellsrenderer: HmGrid.commaNumrenderer},
                { text: '성공/실패', datafield: 'successFailCnt', cellsalign: 'center', width: 150},
            ]
        });

        $filterHistGrid.on('rowdoubleclick', function (event) {
            var rowIdx = HmGrid.getRowIdx($filterHistGrid, '작업을 선택하세요');
            if(rowIdx === false) return;
            var _rowData = HmGrid.getRowData($filterHistGrid, rowIdx);

            _ymdhmsStr = _rowData.ymdhmsStr.replace(/[-: ]/gi, '');
            _cmdNo = _rowData.cmdNo;
            Main.searchDetail();
        });

        // 실패 결과 상세
        HmGrid.create($filterHistDetailGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        data.cmdNo = _cmdNo;
                        data.ymdhms = _ymdhmsStr;
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '실패 결과 상세 정보');
            },
            columns: [
                { text: 'yyyymmdd', datafield: 'yyyymmdd', hidden: true},
                { text: 'ymdhms', datafield: 'ymdhms', hidden: true},
                { text: 'mngNo', datafield: 'mngNo', hidden: true},
                { text: 'cmdNo', datafield: 'cmdNo', hidden: true},
                { text: '실행일시', datafield: 'ymdhmsStr', cellsalign: 'center', width: 120},
                { text: '장비명', datafield: 'devName', cellsalign: 'center'},
                { text: '장비IP', datafield: 'devIp', cellsalign: 'center'},
                { text: '실행결과', datafield: 'runStatusStr', cellsalign: 'center'},
                { text: '점검필터', datafield: 'filterStatus', cellsalign: 'center', cellsrenderer : function (row, datafield, value) {
                    var _result = '';
                    if(value > 0){
                        _result = '검출';
                    } else {
                        _result = '_';
                    }
                    return "<div style='margin-top: 6.5px; margin-left: 5px' class='jqx-center-align'>" + _result + "</div>";
                }},
            ]
        }, CtxMenu.AUTO_CMD_HIST);
        $filterHistDetailGrid.on('rowdoubleclick', function (event) {

            var rowIdx = HmGrid.getRowIdx($filterHistDetailGrid, '작업을 선택하세요');
            if(rowIdx === false) return;
            var _rowData = HmGrid.getRowData($filterHistDetailGrid, rowIdx);

            _ymdhmsStr = _rowData.ymdhmsStr.replace(/[-: ]/gi, '');
            _mngNo = _rowData.mngNo;
            Main.searchCmdCheckHist();
        });


        HmGrid.create($cmdCheckGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        data.cmdNo = _cmdNo;
                        data.ymdhms = _ymdhmsStr;
                        data.mngNo = _mngNo;
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '점검필터정규식 이력');
            },
            columns: [
                { text: '실행일시', datafield: 'ymdhmsStr', cellsalign: 'center', width: 120},
                { text: '필터', datafield: 'regexpForm', width: 300},
                { text: '조치방안', datafield: 'actionDesc', minwidth: 200},
                { text: '필터설명', datafield: 'filterDesc',width: 150},
            ]
        });
    },

	/** init data */
	initData: function () {
        Main.search();
    },

    search: function () {
        HmGrid.updateBoundData($filterHistGrid, ctxPath + '/main/env/autoFilterHist/getAutoFilterHistList.do');
    },

    searchDetail: function () {
        HmGrid.updateBoundData($filterHistDetailGrid, ctxPath + '/main/env/autoFilterHist/getAutoFilterHistDetailList.do');
    },
    searchCmdCheckHist: function () {
        HmGrid.updateBoundData($cmdCheckGrid, ctxPath + '/main/env/autoFilterHist/getCmdCheckHistList.do');
    }
}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});