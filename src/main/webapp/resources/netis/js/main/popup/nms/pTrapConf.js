var $dtlTab;
var $configGrid, $translateGrid;
var editConfNos = []
var editTanslateNos = []
var Main = {
	/** variable */
	initVariable : function() {
		$dtlTab = $('#dtlTab');
		$configGrid = $('#configGrid'), $translateGrid = $('#translateGrid');
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
		case "btnReg_conf": 	this.addConf(); break;
		case 'btnDel_conf': 		this.delConf(); break;
		case 'btnSave_conf':		this.saveConf(); break;

		// 해석 문구
		case "btnReg_translate":	this.addTranslate(); break;
		case "btnDel_translate":	this.delTranslate(); break;
		case "btnSave_translate":	this.saveTranslate(); break;
		case "btnUp":				this.rankUp(); break;
		case "btnDown":				this.rankDown(); break;
		case 'btnClose': self.close(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmWindow.create($('#pwindow'), 100, 100);
		/** 탭 그리기 */
		$dtlTab.jqxTabs({ width : '100%', height : '100%',
			initTabContent : function(tab) {
				switch (tab) {
				case 0: // 등급 설정
					HmGrid.create($configGrid, {
						source : new $.jqx.dataAdapter(
								{
									datatype : 'json',
									updaterow: function(rowid, rowdata, commit) {
										if(editConfNos.indexOf(rowid) == -1)
											editConfNos.push(rowid);
											commit(true);
						            },
									url: ctxPath + '/main/nms/trap/getTrapConfList.do',
									datafields: [
							             { name: 'trapNo', type: 'int' },
							             { name: 'trapMsg', type: 'string' },
							             { name: 'trapLevel', type: 'int' },
							             { name: 'trapLevelStr', type: 'string' }
						            ]
								}
						),
						editable: true,
						editmode: 'selectedrow',
						columns :
						[
				           	{ text : '번호', datafield : 'trapNo' , hidden:true },
				           	{ text : '포함문구 문구', datafield : 'trapMsg' },
				           	{ text : '표현등급', datafield : 'trapLevel', displayfield: 'trapLevelStr' , width: 150, columntype: 'dropdownlist',
								createeditor: function(row, value, editor) {
									var s = [
									         	{ label: '정상',	value: 0 },
									         	{ label: '알람',	value: 1 },
									         	{ label: '경보',	value: 2 },
									         	{ label: '장애',	value: 3 }
									         ];
									editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
								}
				           	},
				        ]
					});
					break;

				case 1: // 해석 문구
					HmGrid.create($translateGrid, {
						source : new $.jqx.dataAdapter(
								{
									datatype : 'json',
									updaterow: function(rowid, rowdata, commit) {
										if(editTanslateNos.indexOf(rowid) == -1)
											editTanslateNos.push(rowid);
											commit(true);
						            },
									url: ctxPath + '/main/nms/trap/getTranslateList.do'
								}
						),
						editable: true,
						editmode: 'selectedrow',
						columns :
						[
							{ text : '번호', datafield : 'seqNo' , hidden:true},
				           	{ text : '순번', cellsrenderer : HmGrid.rownumrenderer, editable: false, width :40 },
				           	{ text : '원본 문구', datafield : 'msg' },
				           	{ text : '해석 문구', datafield : 'userMsg' },
				           	{ text : 'FLAG', datafield : 'flag' , editable: false , hidden: true}
			           	]
					});
					break;
				}

			}
		}).on('selected', function(event) {
			Main.searchDtlInfo();
		});
	},

	/** init data */
	initData : function() {

	},

	/** 상세정보 */
	searchDtlInfo: function() {
		switch($dtlTab.val()) {
		case 0: this.searchConf(); break;
		case 1: this.searchtTranslate(); break;
		}
	},

	searchConf: function() {
		HmGrid.updateBoundData($configGrid, ctxPath + '/main/nms/trap/getTrapConfList.do');
	},

	searchtTranslate: function() {
		HmGrid.updateBoundData($translateGrid, ctxPath + '/main/nms/trap/getTranslateList.do');
	},


	addConf: function() {
		$.post(ctxPath + '/main/popup/nms/pTrapConfAdd.do',
				function(result) {
					HmWindow.open($('#pwindow'), 'Trap 설정 추가', result, 400, 285);
				}
		);
	},

	delConf: function() {
		var rowIdx = HmGrid.getRowIdxes($configGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

		var _trapNo=$configGrid.jqxGrid('getcellvalue', rowIdx, "trapNo");
		Server.post('/main/nms/trap/delTrapConf.do', {
			data: { trapNo: _trapNo },
			success: function(result) {
				$configGrid.jqxGrid('deleterow', $configGrid.jqxGrid('getrowid', rowIdx));
				alert('삭제되었습니다.');
			}
		});
	},

	saveConf: function() {
		HmGrid.endRowEdit($configGrid);
		if(editConfNos.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
	//	var rows = $configGrid.jqxGrid('getboundrows');
		$.each(editConfNos, function(idx, value) {
			_list.push($configGrid.jqxGrid('getrowdatabyid', value));
		});
		Server.post('/main/nms/trap/saveTrapConf.do', {
			data: { list: _list },
			success: function(data) {
				alert("저장되었습니다.");
				editConfNos = [];
			}
		});
	},


	addTranslate: function() {
		$.post(ctxPath + '/main/popup/nms/pTrapTranslateAdd.do',
				function(result) {
					HmWindow.open($('#pwindow'), 'Trap 해석 문구 추가', result, 400, 275);
				}
		);
	},

	delTranslate: function() {
		var rowIdx = HmGrid.getRowIdxes($translateGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

		var _seqNo=$translateGrid.jqxGrid('getcellvalue', rowIdx, "seqNo");
		Server.post('/main/nms/trap/delTrapTranslate.do', {
			data: { seqNo: _seqNo },
			success: function(result) {
				$translateGrid.jqxGrid('deleterow', $translateGrid.jqxGrid('getrowid', rowIdx));
				alert('삭제되었습니다.');
			}
		});
	},

	saveTranslate: function() {
		HmGrid.endRowEdit($translateGrid);
		if(editTanslateNos.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
		var rows = $translateGrid.jqxGrid('getboundrows');
		$.each(rows, function(idx, value) {
			value.rank = idx + 1;
			_list.push(value);
		});
		Server.post('/main/nms/trap/saveTrapTranslate.do', {
			data: { list: _list },
			success: function(data) {
				alert("저장되었습니다.");
				editTanslateNos = [];
			}
		});
	},
	rankUp: function() {
		var rowindex = $translateGrid.jqxGrid('getselectedrowindexes');
		var prevData, prevMsg, prevUserMsg, prevSeqNo;
		var nextData, nextMsg, nextUserMsg, nextSeqNo;
		if(rowindex != 0){
			prevData = $translateGrid.jqxGrid('getrowdata', rowindex-1);
			nextData = $translateGrid.jqxGrid('getrowdata', rowindex);
			prevMsg=prevData.msg;
			prevUserMsg=prevData.userMsg;
			prevSeqNo=prevData.seqNo;
			nextMsg=nextData.msg;
			nextUserMsg=nextData.userMsg;
			nextSeqNo=nextData.seqNo;
			$translateGrid.jqxGrid('setcellvalue', rowindex-1, "msg", nextMsg);
			$translateGrid.jqxGrid('setcellvalue', rowindex-1, "userMsg", nextUserMsg);
			$translateGrid.jqxGrid('setcellvalue', rowindex-1, "seqNo", nextSeqNo);
			$translateGrid.jqxGrid('setcellvalue', rowindex, "msg", prevMsg);
			$translateGrid.jqxGrid('setcellvalue', rowindex, "userMsg", prevUserMsg);
			$translateGrid.jqxGrid('setcellvalue', rowindex, "seqNo", prevSeqNo);
			$translateGrid.jqxGrid('selectrow', rowindex-1);
		}
	},
	rankDown: function() {
		var rowindex = $translateGrid.jqxGrid('getselectedrowindexes');
		var rowindexP=parseInt(rowindex)+1;
		var prevData, prevMsg, prevUserMsg, prevSeqNo;
		var nextData, nextMsg, nextUserMsg, nextSeqNo;
		if($translateGrid.jqxGrid('getrowdata', rowindexP) != undefined){
			nextData = $translateGrid.jqxGrid('getrowdata', rowindexP);
			prevData = $translateGrid.jqxGrid('getrowdata', rowindex);
			nextMsg=nextData.msg;
			nextUserMsg=nextData.userMsg;
			nextSeqNo=nextData.seqNo;
			prevMsg=prevData.msg;
			prevUserMsg=prevData.userMsg;
			prevSeqNo=prevData.seqNo;
			$translateGrid.jqxGrid('setcellvalue', rowindexP, "msg", prevMsg);
			$translateGrid.jqxGrid('setcellvalue' ,rowindexP, "userMsg", prevUserMsg);
			$translateGrid.jqxGrid('setcellvalue', rowindexP, "seqNo", prevSeqNo);
			$translateGrid.jqxGrid('setcellvalue', rowindex, "msg", nextMsg);
			$translateGrid.jqxGrid('setcellvalue', rowindex, "userMsg", nextUserMsg);
			$translateGrid.jqxGrid('setcellvalue', rowindex, "seqNo", nextSeqNo);
			$translateGrid.jqxGrid('selectrow', rowindexP);
		};

	}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
