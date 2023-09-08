var $grpTree, $evtGrid, $ipGrid, $dosIpGrid;
var curEvtData = null;
var editEvtIds = [];

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $evtGrid = $('#evtGrid'), $ipGrid = $('#ipGrid'), $dosIpGrid = $('#dosIpGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnAdd_evt': this.addDosEvtCfg(); break;
			case 'btnDel_evt': this.delDosEvtCfg(); break;
			case 'btnSave_evt': this.saveDosEvtCfg(); break;
			case 'btnSearch_evt': this.searchEvt(); break;
			case 'btnConf_evt': this.confEvt(); break;
			case 'btnRef_ip': this.searchIp(); break;
			case 'btnAddRange_dosIp': this.addDosIpRange(); break;
			case 'btnAdd_dosIp': this.addDosIp(); break;
			case 'btnDel_dosIp': this.delDosIp(); break;
			case 'btnSave_dosIp': this.saveDosIp(); break;
			case 'btnMove': this.moveToDosIp(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmTreeGrid.create($grpTree, HmTree.T_GRP_MANG, Main.searchEvt, null, ['grpName']);
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '40%', collapsible: false }, { size: '60%' }], 'auto', '100%');
			HmJqxSplitter.create($('#bSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '60%', collapsible: false }, { size: '40%' }], 'auto', '100%');
			HmGrid.create($evtGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(editEvtIds.indexOf(rowid) == -1)
									editEvtIds.push(rowid);
				            	commit(true);
				            }
						},
						{
							formatData: function(data) {
								var treeItem = HmTreeGrid.getSelectedItem($grpTree);
								data.grpNo = treeItem == null? 0 : treeItem.grpNo;
								return data;
							},
							loadComplete: function(records) {
								editEvtIds = [];
								curEvtData = null;
							}
						}
				),
			    editable: true,
			    editmode: 'selectedrow',
				columns: 
				[
					{ text : '코드', datafield : 'code', width : 80, hidden: true, editable: false },
					{ text : '이벤트명', datafield : 'evtName', width : 300, editable: false },
					{ text : '설명', datafield : 'evtDesc', editable: false },
					{ text : '사용여부', datafield : 'useFlag', width: 100, columntype: 'checkbox' }
			    ]
			}, CtxMenu.COMM);
			$evtGrid.on('rowselect', function(event) {
				curEvtData = event.args.row;
				Main.searchDosIp();
			});
			
			HmGrid.create($ipGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/env/ntEvtConf/getNtRawIpList.do'
						}
				),
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, 'IP 리스트');
			    },
				columns: 
				[
					 { text : 'IP', datafield : 'ip', minwidth : 120, pinned: true },
					 { text : 'Packet', datafield : 'pkt', width : 120 },
					 { text : 'Byte', datafield : 'bytes', width: 120 },
					 { text : 'Host Count', datafield : 'hostCnt', width: 120 }
				]						
			});
			
			HmGrid.create($dosIpGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							id: 'ip'
						},
						{
							formatData: function(data) {
								if(curEvtData != null) data.code = curEvtData.code;
								return data;
							}
						}
				),
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '예외IP');
			    },
			    selectionmode: 'multiplerowsextended',
				columns: 
				[
					 { text : 'IP', datafield : 'ip' }
				]						
			});
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var treeItem = HmTreeGrid.getSelectedItem($grpTree);
			return {
				grpNo: treeItem == null? 0 : treeItem.grpNo
			};
		},
		
		/** 이벤트 설정 */
		searchEvt: function() {
			// 예외IP 클리어
			$dosIpGrid.jqxGrid('clear');
			
			HmGrid.updateBoundData($evtGrid, ctxPath + '/main/env/ntEvtConf/getDosEvtCfgList.do');
		},
		
		addDosEvtCfg: function() {
			var params = Main.getCommParams();
			$.get(ctxPath + '/main/popup/env/pDosEvtCfgAdd.do',
					function(result) {
						HmWindow.open($('#pwindow'), '이벤트 정책 추가', result, 700, 500, 'pwindow_init', params)
					}
			);
		},
		
		delDosEvtCfg: function() {
			var rowdata = HmGrid.getRowData($evtGrid);
			if(rowdata === null) {
				alert('선택된 이벤트가 없습니다.');
				return;
			}
			
			if(!confirm('[' + rowdata.evtName + '] 이벤트를 삭제하시겠습니까?')) return;
			
			Server.post('/main/env/ntEvtConf/delDosEvtCfg.do', {
				data: { grpNo: rowdata.grpNo, list: [ rowdata ] },
				success: function(result) {
					$evtGrid.jqxGrid('deleterow', rowdata.uid);
					alert('삭제되었습니다.');
				}
			});
		},
		
		saveDosEvtCfg: function() {
			HmGrid.endRowEdit($evtGrid);
			if(editEvtIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			var _list = [];
			$.each(editEvtIds, function(idx, value) {
				_list.push($evtGrid.jqxGrid('getrowdatabyid', value));
			});
			Server.post('/main/env/ntEvtConf/saveDosEvtCfg.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					editEvtIds = [];
				}
			});
		},
		
		confEvt: function() {
			HmUtil.createPopup('/main/popup/env/pDosEvtCodeConf.do', $('#hForm'), 'evtConf', 1000, 600);
		},
		
		/** IP 리스트 */
		searchIp: function() {
			HmGrid.updateBoundData($ipGrid);
		},
		
		/** 예외IP */
		searchDosIp: function() {
			if(curEvtData == null) return;
			HmGrid.updateBoundData($dosIpGrid, ctxPath + '/main/env/ntEvtConf/getDosIpList.do');
		},
		
		addDosIpRange: function() {
			if(curEvtData == null) {
				alert('이벤트를 선택해주세요.');
				return;
			}
			$.get(ctxPath + '/main/popup/env/pDosIpRangeAdd.do',
					function(result) {
						HmWindow.open($('#pwindow'), '예외IP Range 추가', result, 300, 160, 'pwindow_init', curEvtData)
					}
			);
		},
		
		addDosIp: function() {
			if(curEvtData == null) {
				alert('이벤트를 선택해주세요.');
				return;
			}
			$.get(ctxPath + '/main/popup/env/pDosIpAdd.do',
					function(result) {
						HmWindow.open($('#pwindow'), '예외IP 추가', result, 300, 120, 'pwindow_init', curEvtData)
					}
			);
		},
		
		delDosIp: function() {
			var rowIdxes = HmGrid.getRowIdxes($dosIpGrid, '삭제할 IP를 선택해주세요.');
			if(rowIdxes === false) return;
			
			if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
			var _list = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var tmp = $dosIpGrid.jqxGrid('getrowdata', value);
				_list.push(tmp.ip);
				_uids.push(tmp.uid);
			});
			Server.post('/main/env/ntEvtConf/delDosIp.do', {
				data: { code: curEvtData.code, list: _list },
				success: function(result) {
					$dosIpGrid.jqxGrid('deleterow', _uids);
					alert(result);
				}
			});
		},
		
		saveDosIp: function() {
			
		},
		
		moveToDosIp: function() {
			if(curEvtData == null) {
				alert('이벤트를 선택해주세요.');
				return;
			}
			var rowIdxes = HmGrid.getRowIdxes($ipGrid, 'IP를 선택해주세요.');
			if(rowIdxes === false) return;
			var list = [], newIds = [];
			for(var i = 0; i < rowIdxes.length; i++) {
				var tmp = $ipGrid.jqxGrid('getrowdata', rowIdxes[i]);
				var isExist = $dosIpGrid.jqxGrid('getrowdatabyid', tmp.ip);
				if(isExist == null) list.push({ ip: tmp.ip });
			}
			
			$dosIpGrid.jqxGrid('addrow', null, list);
		}
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});