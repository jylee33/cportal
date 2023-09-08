var $configGrid ;
var editConfNos = [];
var Main = {
	/** variable */
	initVariable : function() {
		$configGrid = $('#configGrid');
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
		case 'btnEdit_conf': this.editConf(); break;
		case 'btnDel_conf': 		this.delConf(); break;
		case 'btnSave_conf':		this.saveConf(); break;
		case 'btnClose_conf':	this.cancelConf();break;
		case 'btnClose': self.close(); break;
		}
		
	},

	/** init design */
	initDesign : function() {
		HmWindow.create($('#pwindow'), 100, 100);
		HmGrid.create($configGrid, {
			source : new $.jqx.dataAdapter(
					{	height:'93%',
						datatype : 'json',
						updaterow: function(rowid, rowdata, commit) {
							if(editConfNos.indexOf(rowid) == -1)
								editConfNos.push(rowid);
								commit(true);
			            },
						url: ctxPath + '/main/nms/syslog/getSyslogEvtConfList.do'
					}
			),
			columns : 
			[ 
	           	{ text : '번호', datafield : 'seqNo' , hidden:true, pinned: true },
	           	{ text : '이벤트명', datafield : 'evtName' , minwidth:130, pinned: true }, 
	         	{ text : '등급', datafield : 'evtLevel', displayfield: 'evtLevelStr' , width: 80, filtertype: 'checkedlist',
					cellsrenderer : HmGrid.evtLevelrenderer, cellsalign: 'center',
					createfilterwidget: function (column, columnElement, widget) {
						widget.jqxDropDownList({
							renderer: HmGrid.evtLevelFilterRenderer
						});
					}},
	           	{ text : '이벤트 발생 장비', datafield : 'celDevNames' , width: 150}, 
	           	{ text : 'Severity 조건', datafield : 'severity' , width: 100},
	           	{ text : '문자열 조건', datafield : 'evtMsg', width: 300 }, 
	           	{ text : 'Severity 변경', datafield : 'levelNo', displayfield: 'levelNoStr' , width: 150, columntype: 'dropdownlist' },
	           	{ text : 'Log설정', datafield : 'linkEvt', displayfield: 'linkEvtStr' , width: 150, columntype: 'dropdownlist' },
	           	{ text : '사용여부', datafield : 'useFlag' , width: 70,  columntype: 'checkbox'}
	        ]
		});  
		
		

	},

	/** init data */
	initData : function() {

	},
	
	/** 상세정보 */
	searchDtlInfo: function() {
		
	},
	
	searchConf: function() {
		HmGrid.updateBoundData($configGrid, ctxPath + '/main/nms/syslog/getSyslogEvtConfList.do');
	},
	
	addConf: function() {
		$.post(ctxPath + '/main/popup/nms/pSyslogEvtConfAdd.do', 
				function(result) {
					HmWindow.open($('#pwindow'), 'Syslog 이벤트 등록', result, 715, 407, 'pwindow_init');
				}
		);
	},
	
	editConf: function() {
		var rowdata = HmGrid.getRowData($configGrid);
		if(rowdata == null) {
			alert('데이터를 선택해주세요.');
			return;
		}
		$.post(ctxPath + '/main/popup/nms/pSyslogEvtConfEdit.do',
				{ seqNo: rowdata.seqNo },
				function(result) {
					HmWindow.open($('#pwindow'), 'Syslog 이벤트 수정', result, 715, 407, 'pwindow_init');
				}
		);
	},
	
	delConf: function() {
		var rowIdx = HmGrid.getRowIdxes($configGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
		
		var _seqNo=$configGrid.jqxGrid('getcellvalue', rowIdx, "seqNo");
		Server.post('/main/nms/syslog/delSyslogEvtConf.do', {
			data: { seqNo: _seqNo },
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
		Server.post('/main/nms/syslog/saveSyslogEvtConf.do', {
			data: { list: _list },
			success: function(data) {
				alert("저장되었습니다.");
				editConfNos = [];
			}
		});
	},
	  // 취소
	cancelConf: function() {
    	self.close();
    }
	
	
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
