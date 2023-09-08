var $regularCheckGrid;
var $regularScheduleGrid;
var $regularResultGrid;

var Main = {
    /** variable */
    initVariable: function () {
		$regularCheckGrid = $('#regularCheckGrid');
		$regularScheduleGrid = $('#regularScheduleGrid');
		$regularResultGrid = $('#regularResultGrid');
    },

    /** add event */
    observe: function () {
		$('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.search();
        }
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
        	case 'btnSearch':
        		this.searchResult();
				break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '25%', collapsible: false }, { size: '75%' }], 'auto', '100%');
        HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

		Main.createRegCheckGrid();
        Main.createRegScheduleGrid();
        Main.createRegResultGrid();
    },

	/** init data */
	initData: function () {
		this.search();
    },

    createRegCheckGrid: function() {
        HmGrid.create($regularCheckGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        var sCmdName = $('#sCmdName').val();
                        if(sCmdName.length !== 0)
                        	data.sCmdName = sCmdName;
                        data.regWorkerCd = 'DAILY_CHECK';
                        return data;
                    }
                }
            ),
            pageable: false,
            selectionmode: 'singlerow',
            columns: [
                { text: 'cmdNo', datafield: 'cmdNo', hidden: true},
                { text: 'workerCd', datafield: 'workerCd', hidden: true},
                { text: 'sendCharStr', datafield: 'sendCharStr', hidden: true},
                { text: '작업명', datafield: 'cmdName', width: '99.9%'},
            ]
        }, CtxMenu.COMM);

        $regularCheckGrid.on('bindingcomplete', function () {
            $regularCheckGrid.jqxGrid('selectrow', 0)
        });

        $regularCheckGrid.on('rowselect', function (event) {
            Main.cmdData = event.args.row;
            Main.searchSchedule();
        });
    },

    createRegScheduleGrid: function () {
        HmGrid.create($regularScheduleGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        if(Main.cmdData) {
                            data.cmdNo = Main.cmdData.cmdNo;
                        }
                        return data;
                    }
                }
            ),
            pageable: false,
            selectionmode: 'multiplerowsextended',
            columns: [
                { text: '실행일시', datafield: 'scheRunDtm', width: '30%', cellsalign: 'center' },
                { text: '스케줄명', datafield: 'scheNm', width: '70%' },
            ]
        }, CtxMenu.COMM);

        $regularScheduleGrid.on('bindingcomplete', function () {
            $regularScheduleGrid.jqxGrid('selectrow', 0)
        });
        $regularScheduleGrid.on('rowselect', function (event) {
            Main.scheduleData = event.args.row;
            Main.searchResult();
        });
    },

    createRegResultGrid: function() {
        HmGrid.create($regularResultGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        if(Main.cmdData) { data.cmdNo = Main.cmdData.cmdNo }
                        if(Main.scheduleData) {
                            $.extend(data, Hlpr.noFormatDate(Main.scheduleData.scheRunDtm))
                        }
                        return data;
                    }
                }
            ),
            selectionmode: 'singleRow',
            columns: [ // 가로 스크롤 발생 이슈로 width 모두 '%' 처리. (minwidth 사용할 경우 스크롤 생김)
                { text: '장비명', datafield: 'devName', width: '22%'},
                { text: '컨피그백업', datafield: 'config_backup', width: '13%', cellsrenderer: Main.workerCdRenderer },
                { text: '라우팅', datafield: 'routing', width: '13%', cellsrenderer: Main.workerCdRenderer },
                { text: 'STP', datafield: 'stp', width: '13%', cellsrenderer: Main.workerCdRenderer },
                { text: 'VLAN', datafield: 'vlan', width: '13%', cellsrenderer: Main.workerCdRenderer },
                { text: '하드웨어', datafield: 'hw_info', width: '13%', cellsrenderer: Main.workerCdRenderer },
                { text: '인터페이스', datafield: 'if_info', width: '13%', cellsrenderer: Main.workerCdRenderer }
            ]
        }, CtxMenu.COMM);

        $regularResultGrid.on('rowselect', function (event) {
            Main.cmdResultData = event.args.row;
        })
    },

	/* ==========================================================
		버튼 이벤트
	 ===========================================================*/
	search : function () {
		HmGrid.updateBoundData($regularCheckGrid, ctxPath + '/main/env/commandMgmt/getCommandList.do');
    },

    searchSchedule: function () {
        HmGrid.updateBoundData($regularScheduleGrid, ctxPath + '/main/env/commandMgmt/getScheduleListForCommand.do');
    },

    searchResult: function () {
        HmGrid.updateBoundData($regularResultGrid, ctxPath + '/main/env/commandMgmt/getRegularCheckDevList.do');
    },

    workerCdRenderer: function (row, field, value) {
        var color;
        switch (value) {
            case 1 : //실행 X
                color = '#F64431';
                break;
            case 2: //변경 O
                color = '#1428A0';
                break;
            case 3: //변경 X
                color = '#b4b4b4';
                break;
            default:
                color = 'black'
        }

        var _style = "";
        _style += 'background:'+ color + ';';
        _style += 'width:12px;height:12px;border-radius:6px;';
        _style += 'margin:auto;margin-top:9px';
        var type = "'" + field.toUpperCase() + "'";
        var cell = '<div onclick="Main.compareOutput('+ type + ')" style='+  _style + '></div>'

        if(value === 0) {
            // 등록X 일 경우
            cell = '<div class="jqx-grid-cell-middle-align" style="margin-top:7px">-</div>';
        }

        return cell;
    },

    /** 최근 점검 결과와 비교 */
    compareOutput: function (workerCd) {
        var rowData = HmGrid.getRowData($regularResultGrid);
        var runStatus = rowData[workerCd.toLowerCase()];
        var params = {
            mngNo: rowData.mngNo,
            cmdNo: Main.cmdData.cmdNo,
            workerCd: workerCd,
            scheRunDtm: Main.scheduleData.scheRunDtm
        };
        if(runStatus === 1) {
            Main.showFailOutput(params);
            return;
        }

        HmUtil.createFullPopup('/main/popup/env/pRegularResultDiff.do', $('#hForm'), 'pRegularResultDiff', params);
    },

    showFailOutput: function (params) {
        var date = Hlpr.noFormatDate(params.scheRunDtm);
        params.yyyymmdd = date.yyyymmdd;
        params.ymdhms = date.ymdhms;
        Server.get('/main/env/commandMgmt/getRegularCheckFailOutput.do', {
            data: params,
            success: function (result) {
                alert(result.output)
            }
        })
    }

}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});