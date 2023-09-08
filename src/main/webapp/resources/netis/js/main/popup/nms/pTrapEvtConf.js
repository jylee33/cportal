var $configGrid;
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;
var evtLevelList = [];
var Main = {
		/** variable */
		initVariable : function() {
			$configGrid = $('#configGrid');
			evtLevel1Text = $('#pEvtLevel1Text').val();
			evtLevel2Text = $('#pEvtLevel2Text').val();
			evtLevel3Text = $('#pEvtLevel3Text').val();
			evtLevel4Text = $('#pEvtLevel4Text').val();
			evtLevel5Text = $('#pEvtLevel5Text').val();
			evtLevelList = [{ label: evtLevel1Text, value: 1 }, 
				         	{ label: evtLevel2Text, value: 2 }, 
				         	{ label: evtLevel3Text, value: 3 }, 
				         	{ label: evtLevel4Text, value: 4 }, 
				         	{ label: evtLevel5Text, value: 5 }]
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {

			// 등급 설정
			case "btnReg_conf":
				this.addConf();
				break;
			case 'btnEdit_conf':
				this.editConf();
				break;
			case 'btnDel_conf':
				this.delConf();
				break;
			case 'p_btnClose':
				self.close();
				break;

			}

		},

		/** init design */
		initDesign : function() {
			HmWindow.create($('#pwindow'), 100, 100);
			Main.searchDtlInfo();
		},

		/** init data */
		initData : function() {

		},

		/** 상세정보 */
		searchDtlInfo: function() {
            HmGrid.create($configGrid, {
                source : new $.jqx.dataAdapter(
                    {
                        datatype : 'json',
                        url: ctxPath + '/main/nms/trap/getTrapEvtConfListGyeonggi.do',
                        datafields: [
                            { name: 'evtNo', type: 'int' },
                            { name: 'evtNm', type: 'string' },
                            { name: 'evtLevel', type: 'int' },
                            { name: 'useFlag', type: 'int' },
                            { name: 'lastUpd', type: 'string' }
                        ]
                    }
                ),
                columns :
                    [
                        { text : '번호', datafield : 'evtNo' },
                        { text : '이벤트 명', datafield : 'evtNm', minwidth: 200 },
                        { text : '사용여부', datafield : 'useFlag',width: 80, columntype: 'checkbox' }
                    ]
            });
		},

		setDevNames: function (row, column, value) {
			var rowData = HmGrid.getRowData($configGrid, row);
			var returnTxt = rowData.mngNos === '0' ? '전체' : value;
			return '<div style="margin: 6.5px 4px 4px 4px">' + returnTxt + '</div>';
        },

		searchConf: function() {
			HmGrid.updateBoundData($configGrid, ctxPath + '/main/nms/trap/getTrapEvtConfList.do');
		},

		addConf: function() {
			var initData = { evtLevelList: evtLevelList };
			/*$.post(ctxPath + '/main/popup/nms/pTrapEvtConfAdd.do',
			function(result) {
				HmWindow.openFit($('#pwindow'), 'Trap 이벤트 설정 추가', result, 1100, 700, 'pwindow_init', initData);
			});*/
            $.post(ctxPath + '/main/popup/nms/pTrapEvtConfGyeonggiAdd.do',
                function(result) {
                    HmWindow.openFit($('#pwindow'), 'Trap 이벤트 설정 추가', result, 400, 700, 'pwindow_init', initData);
                });
		},

		editConf: function() {
			var rowIdx = HmGrid.getRowIdx($configGrid, '이벤트를 선택해주세요.');
			if(rowIdx === false) return;

			var rowData = HmGrid.getRowData($configGrid, rowIdx);

            rowData.evtLevelList= evtLevelList;

			$.post(ctxPath + '/main/popup/nms/pTrapEvtConfGyeonggiEdit.do', {}, function(result) {
				HmWindow.openFit($('#pwindow'), 'Trap 이벤트수정', result, 400, 700, 'pwindow_init', rowData);
			});
		},

		delConf: function() {
			var rowIdx = HmGrid.getRowIdxes($configGrid, '이벤트를 선택해주세요.');
			if(rowIdx === false) return;
			if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

			var _evtNo = $configGrid.jqxGrid('getcellvalue', rowIdx, "evtNo");
			Server.post('/main/nms/trap/delTrapEvtConfGyeonggi.do', {
				data: { evtNo: _evtNo},
				success: function(msg) {
					$configGrid.jqxGrid('deleterow', $configGrid.jqxGrid('getrowid', rowIdx));
					alert(msg);
				}
			});
		},
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
