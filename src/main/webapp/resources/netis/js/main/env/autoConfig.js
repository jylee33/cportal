var $configGrid;
var Main = {
    /** variable */
    initVariable: function () {
		$configGrid = $('#configGrid');
    },

    /** add event */
    observe: function () {
		$('button').bind('click', function(event) { Main.eventControl(event); });
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
        	case 'btnSearch':
        		this.search();
				break;
			case 'btnAdd':
				this.addConfig();
				break;
			case 'btnEdit':
				this.editConfig();
				break;
			case 'btnDel':
				this.delConfig();
				break;
            case 'btnCopy':
                this.copyCommand();
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
		HmGrid.create($configGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
				},
				{
					formatData: function(data) {
                        var sAutoConfigNm = $('#sAutoConfigNm').val();
                        if(sAutoConfigNm.length != 0)
                            data.sAutoConfigNm = sAutoConfigNm;
						return data;
					}
				}
			),
			selectionmode: 'multiplerowsextended',
			columns: [
                { text: 'autConfigdNo', datafield: 'autoConfigNo', hidden: true},
                { text: 'autoConfigType', datafield: 'autoConfigType', hidden: true},
                { text: 'cronType', datafield: 'cronType', hidden: true},
                { text: 'Config 점검명', datafield: 'autoConfigNm', width: 200},
                { text: '활성화상태', datafield: 'useFlagStr', width: 100, cellsalign: 'center'},
                { text: '실행상태', datafield: 'runFlagStr', width: 100, cellsalign: 'center'},
                { text: '마지막실행일자', datafield: 'lastRunDtmStr', width: 100, cellsalign: 'center'},
                { text: '주기구분', datafield: 'cronTypeStr', width: 150, cellsalign: 'center'},
                { text: '요일', datafield: 'cronWeekStr', width: 150, cellsalign: 'center'},
                { text: '반복시간', datafield: 'execTimeStr', width: 150},
                { text: '대상장비수', datafield: 'devCnt', width: 150, cellsrenderer: HmGrid.commaNumrenderer },
                { text: '담당자', datafield: 'managerNm', width: 100},
                { text: '수정자_ID', datafield: 'userId', width: 100},
                { text: '수정자_IP', datafield: 'userIp', width: 100},
                { text: '설명', datafield: 'memo', minwidth: 150},
          	]
		}, CtxMenu.COMM);
    },

	/** init data */
	initData: function () {
        this.search();
    },

	/* ==========================================================
		버튼 이벤트
	 ===========================================================*/
	search : function () {
        HmGrid.updateBoundData($configGrid, ctxPath + '/main/env/autoConfig/getAutoConfigList.do');
    },

	addConfig: function () {
        $.post(ctxPath + '/main/popup/env/pAutoConfigAdd.do',
            function(result) {
                HmWindow.openFit($('#pwindow'), "Config 추가", result, 800, 500, 'pwindow_init', null);
            }
        );
		//HmUtil.createPopup('/main/popup/env/pConfigAdd.do' , $('#hForm'), 'pConfigAdd', 600, 220);
    },

	editConfig: function () {
        var rowIdxes = HmGrid.getRowIdxes($configGrid, '선택한 스케줄러가 없습니다.');
        if(!rowIdxes) return;
        if(rowIdxes.length != 1){
            alert('하나만 수정할수 있습니다.');
            return ;
        }

        var rowData = HmGrid.getRowData($configGrid, rowIdxes[0]);

        $.post(ctxPath + '/main/popup/env/pAutoConfigEdit.do',
            function(result) {
                HmWindow.open($('#pwindow'), "점검필터 수정", result, 800, 500, 'pwindow_init', rowData);
            }
        );
    },

	delConfig: function () {
        var _dataList = HmGrid.getRowDataList($configGrid);
        if(_dataList == null) return;

        if(!confirm('[' + _dataList.length +']개의 Config점검을 삭제하시겠습니까?')) return;

        var _cronList = [];
        var _reserveList = [];
        for(var i = 0 ; i < _dataList.length ; i++){
            var _item = _dataList[i];
            if(_item.useFlag == 1){
                if(_item.autoConfigType == 'crontab'){
                    _cronList.push(_item.autoConfigNo);
                } else {
                    _reserveList.push(_item.autoConfigNo);
                }
            }
        }//for end(i)

        var _restParam = {};
        if(_cronList.length != 0){
            _restParam.CRON = {
                DELETE: _cronList
            }
        }
        if(_reserveList.length != 0){
            _restParam.RESERVATION = {
                DELETE: _reserveList
            }
        }

        console.log(_dataList);
        Server.post('/main/env/autoConfig/delAutoConfigList.do', {
            data: {dataList: _dataList},
            success: function(result){
                alert('삭제되었습니다.');
                Main.search();
                ServerRest.reqCronTab(_restParam);
                $('#pbtnClose').click();
            }//success()
        });//Server.post();
    },
    copyCommand: function(){

        var rowIdxes = HmGrid.getRowIdxes($configGrid, '선택한 스케줄러가 없습니다.');
        if(rowIdxes.length != 1){
            alert('하나만 복사할 수 있습니다.');
            return ;
        }

        var rowData = HmGrid.getRowData($configGrid, rowIdxes[0]);

        Server.post('/main/com/autoCommon/copyAutoCommand.do', {
            data: {jobType: 'cfg_backup', jobNo: rowData.jobNo, table: rowData.autoConfigType},
            success: function(result){
                alert('복사되었습니다.');
                Main.search();
                if(rowData.useFlag == 1){
                    var _restParam = {};
                    if(rowData.autoConfigType == 'crontab'){
                        _restParam.CRON = {
                            INSERT: [result.cronNo]
                        }
                    } else {
                        _restParam.RESERVATION = {
                            INSERT: [result.reserveNo]
                        }
                    }
                    ServerRest.reqCronTab(_restParam);
                }
                $('#pbtnClose').click();
            }//success()
        });//Server.post();
    }
};//Main
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();

    setInterval(function(){
        Main.search();
    }, 60 * 1000)
});