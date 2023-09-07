var $regularCheckGrid;
var Main = {
    /** variable */
    initVariable: function () {
		$regularCheckGrid = $('#regularCheckGrid');
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
        		this.search();
				break;
			case 'btnAdd':
				this.addCheck();
				break;
			case 'btnEdit':
				this.editCheck();
				break;
			case 'btnDel':
				this.delCheck();
				break;
            case 'btnCopy':
                this.copyCheck();
                break;
        }
    },

    /** init design */
    initDesign: function () {
		HmGrid.create($regularCheckGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json'
				},
				{
					formatData: function(data) {
						var sCmdName = $('#sCmdName').val();
						if(sCmdName.length != 0)
							data.sCmdName = sCmdName;
						data.regWorkerCd = 'DAILY_CHECK';
						return data;
					}
				}
			),
			selectionmode: 'multiplerowsextended',
			columns: [
				{ text: 'cmdNo', datafield: 'cmdNo', hidden: true},
				{ text: 'workerCd', datafield: 'workerCd', hidden: true},
                { text: 'sendCharStr', datafield: 'sendCharStr', hidden: true},
                { text: '작업명', datafield: 'cmdName', minwidth: 180},
                { text: '작업종류', datafield: 'workerCdStr', width: 130, cellsalign: 'center'},
                { text: '개행문자열', datafield: 'sendCharStrStr', width: 100, cellsalign: 'center'},
				{ text: 'MORE 문자열', datafield: 'moreStr', width: 150, cellsalign: 'center',
					cellsrenderer: function (row, datafield, value) {
						var txt = value.htmlCharacterEscapes();
						return '<div style="margin-top: 6.5px" class="jqx-grid-cell-middle-align">'+ txt +' </div>';
                	}
                },
				{ text: 'Timeout(초)', datafield: 'timeOut', width: 80, cellsalign: 'right'},
				{ text: '사용여부', datafield: 'useFlag', width: 80, columntype: 'checkbox'},
				{ text: '계속실행', datafield: 'runType', width: 80, columntype: 'checkbox'},
				{ text: '수정자', datafield: 'userName', width: 120, cellsalign: 'center'},
				{ text: '변경일시', datafield: 'lastUpdStr', width: 140, cellsalign: 'center'},
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
        HmGrid.updateBoundData($regularCheckGrid, ctxPath + '/main/env/commandMgmt/getCommandList.do');
    },

	addCheck: function () {
        $.post(ctxPath + '/main/popup/env/pRegularCheckAdd.do',
			{action: 'A'},
            function(result) {
                HmWindow.open($('#pwindow'), "정기점검 등록", result, 800, 502, 'pwindow_init', null);
            }
        );
    },

	editCheck: function () {

        var rowIdxes = HmGrid.getRowIdxes($regularCheckGrid, '선택한 작업이 없습니다.');
        if(!rowIdxes){
        	return;
		} else if(rowIdxes.length != 1){
        	alert('하나의 작업만 수정할 수 있습니다.');
        	return ;
		}

        var rowData = HmGrid.getRowData($regularCheckGrid, rowIdxes[0]);

        $.post(ctxPath + '/main/popup/env/pRegularCheckAdd.do',
            {action: 'U'},
            function(result) {
                HmWindow.open($('#pwindow'), "정기점검 수정", result, 800, 502, 'pwindow_init', rowData);
            }
        );
    },

	delCheck: function () {

        var rowIdxes = HmGrid.getRowIdxes($regularCheckGrid, '선택한 작업이 없습니다.');

        if(rowIdxes === false) return;
        if (!confirm('[' + rowIdxes.length + ']건의 작업을 삭제하시겠습니까?\n삭제후 해당 작업만 설정된 스케줄도 삭제됩니다.')) return;
        var _cmdNos = [];
        $.each(rowIdxes, function (idx, value) {
            var rowdata = $regularCheckGrid.jqxGrid('getrowdata', value);
            _cmdNos.push({cmdNo: rowdata.cmdNo});
        });
        Server.post('/main/env/commandMgmt/delCommandList.do', {
            data: {dataList: _cmdNos},
            success: function(result){
            	if(result.delScheList == undefined || result.delScheList.length == 0){
                	alert('삭제되었습니다.');
				} else {
                	alert('삭제되었습니다.\n' + result.delScheList + '건의 스케줄이 삭제 되었습니다.');
				}


				//tb_cli_cmd_link를 지우는과정에서 삭제된 스케줄정보를 rest호출해준다.
                var _delScheList = result.delScheList;
                var _delCronList = [];
                var _delReserveList = [];
                for(var i = 0 ; i < _delScheList.length ; i++){
                	var _item = _delScheList[i];
					if(_item.scheType == 'C'){
                        _delCronList.push(parseInt(_item.scheNo));
					} else {
                        _delReserveList.push(parseInt(_item.scheNo));
					}
				}//for end(i)

				var _restParam = {};
				if(_delCronList.length > 0){
                    _restParam.CRON = {
                    	DELETE: _delCronList
					}
				}
				if(_delReserveList.length > 0){
                    _restParam.RESERVATION = {
                    	DELETE: _delReserveList
					}
				}
                ServerRest.reqCronTab(_restParam);
                Main.search();
            }//success()
        });//Server.post();
    },

    copyCheck: function(){
        // 미정
    }
}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});