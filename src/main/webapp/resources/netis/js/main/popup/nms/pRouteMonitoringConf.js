var $p_routeGrid, $p_caseGrid, $p_hopGrid;
var routeIds = [], caseIds = [], hopIds = [];
var ctxPath;
var selectedRoutNo, selectedCaseNo;

var PMain = {
	/** variable */
	initVariable: function() {;
		$p_routeGrid = $('#p_routeGrid'), $p_caseGrid = $('#p_caseGrid'), $p_hopGrid = $('#p_hopGrid');
		ctxPath = $('#ctxPath').val();
	},
	
	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { PMain.eventControl(event); });
	},
	
	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
		case 'pbtnAdd_route': this.addRoute(); break;
		case 'pbtnEdit_route': this.editRoute(); break;
		case 'pbtnDel_route': this.delRoute(); break;
		
		case 'pbtnAdd_case': this.addCase(); break;
		case 'pbtnEdit_case': this.editCase(); break;
		case 'pbtnDel_case': this.delCase(); break;

		case 'pbtnAdd_hop': this.addHop(); break;
		case 'pbtnEdit_hop': this.editHop(); break;
		case 'pbtnDel_hop': this.delHop(); break;
		case 'p_btnClose': self.close(); break;
		}
	},
	
	/** init design */
	initDesign: function() {
		HmWindow.create($('#pwindow'));
		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

		HmGrid.create($p_routeGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						type: 'POST',
						contenttype: 'application/json; charset=utf8;',
						updaterow: function(rowid, rowdata, commit) {
							if(routeIds.indexOf(rowid) == -1)
								routeIds.push(rowid);
			            	commit(true);
			            }
					},
					{
						formatData: function(data) {
							$.extend(data, PMain.getCommParams());
							return JSON.stringify(data);
						},
						loadComplete: function(records) {
							routeIds = [];
						}
					}
			),
			editable : false,
			editmode : 'selectedcell',
			columns: 
			[
			 	{ text : '라우트번호', datafield: 'routeNo', width: 100, hidden: true },
//				{ text : 'Node명', datafield : 'nodeName', minwidth : 100,
//					 validation: function(cell, value) {
//						 if($.isBlank(value)) {
//							 return { result: false, message: 'Node명을 입력해주세요.' };
//						 }
//						 return true;
//					 }
//				},
				{ text : 'Source 장비명', datafield: 'routeName', minwidth: 100, editable: false },
				{ text : '명령어구분', datafield:'traceCmdType', displayfield: 'disTraceCmdType', width: 100, editable: false },
				{ text : 'Source IP', datafield : 'srcIp', width : 100,
					 validation: function(cell, value) {
						 if($.isBlank(value)) {
							 return { result: false, message: 'Source IP를 입력해주세요.' };
						 }
						 if(!$.validateIp(value)) {
							 return { result: false, message: 'Source IP를 확인해주세요.' };
						 }
						 return true;
					 }
				}, 
				{ text : 'Target IP', datafield: 'dstIp', width: 100,
					validation: function(cell, value) {
					 if($.isBlank(value)) {
						 return { result: false, message: 'Target IP를 입력해주세요.' };
					 }
					 if(!$.validateIp(value)) {
						 return { result: false, message: 'Target IP를 확인해주세요.' };
					 }
					 return true;
					} 
				}
			]
		});
		$p_routeGrid.on('rowclick', function(event) {
			console.log(event.args.row.bounddata);
            selectedRoutNo=event.args.row.bounddata.routeNo;
            PMain.searchCaseGrid();
        });
		HmGrid.create($p_caseGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						type: 'POST',
						contenttype: 'application/json; charset=utf8;',
						updaterow: function(rowid, rowdata, commit) {
							if(caseIds.indexOf(rowid) == -1)
								caseIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function(data) {
							$.extend(data,{
								routeNo: selectedRoutNo
							})
							return JSON.stringify(data);
						},
						loadComplete: function(records) {
							caseIds = [];
						}
					}
			),
			editable : false,
			editmode : 'selectedcell',
			columns: 
				[
				 { text : '라우트번호', datafield: 'routeNo', hidden: true },
				 { text : '케이스번호', datafield : 'rtCaseNo', width : 100, editable: false },
				 { text : '케이스 명', datafield: 'rtCaseName', minwidth: 150,
					 validation: function(cell, value) {
						 if($.isBlank(value)) {
							 return { result: false, message: '케이스명을 입력해주세요.' };
						 }
						 return true;
					 }
				 }
				 ]
		});
		$p_caseGrid.on('rowclick', function(event) {
            selectedCaseNo=event.args.row.bounddata.rtCaseNo;
            PMain.searchHopGrid();
        });
		HmGrid.create($p_hopGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						type: 'POST',
						contenttype: 'application/json; charset=utf8;',
						updaterow: function(rowid, rowdata, commit) {
							if(hopIds.indexOf(rowid) == -1)
								hopIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function(data) {
							$.extend(data,{
								routeNo: selectedRoutNo,
								rtCaseNo: selectedCaseNo
							});
							return JSON.stringify(data);
						},
						loadComplete: function(records) {
							hopIds = [];
						}
					}
			),
			editable : false,
			editmode : 'selectedcell',
			columns: 
			[
				 { text : '라우트번호', datafield: 'routeNo', minwidth: 100, hidden: true },
				 { text : '케이스번호', datafield: 'rtCaseNo', minwidth: 100, hidden: true },
				 { text : '홉 순서', datafield : 'hopIdx', width : 150, editable: false },
				 { text : '경로', datafield: 'hopPath', minwidth: 300, validation: function(cell, value) {
						 if($.isBlank(value)) {
							 return { result: false, message: 'Node명을 입력해주세요.' };
						 }
						 return true;
				 	}
				 }
			]
		});
	},
	
	/** init data */
	initData: function() {
		PMain.searchRouteGrid();
	},
	
	getCommParams: function () {
		return {
			itemKind: 'GROUP',
			grpType: $('#pGrpType').val(),
			grpNo: $('#pGrpNo').val() 
		}
	},
	
	addRoute: function() {
		$.post(ctxPath + '/main/popup/nms/pRouteChgAdd.do', function(result) {
			HmWindow.open($('#pwindow'), '경로감시 설정 등록', result, 550, 150, 'pwindow_init', PMain.getCommParams() );
		});
	},
	
	editRoute: function() {
		var rowdata = HmGrid.getRowData($p_routeGrid);
		if(rowdata == null) {
			alert('데이터를 선택하세요.');
			return;
		}

		var params = {
				routeNo: rowdata.routeNo,
				routName: rowdata.routeName,
				srcIp: rowdata.srcIp,
				dstIp: rowdata.dstIp,
				mngNo: rowdata.mngNo,
				traceCmdType: rowdata.traceCmdType
		};
		$.extend(params, PMain.getCommParams());
		
		$.post(ctxPath + '/main/popup/nms/pRouteChgEdit.do', function(result) {
			HmWindow.open($('#pwindow'), '경로감시 설정 수정', result, 550, 150, 'pwindow_init', params );
		});
	},
	
	delRoute: function() {
		var rowdata = HmGrid.getRowData($p_routeGrid);
		if(rowdata == null) {
			alert('데이터를 선택하세요.');
			return;
		}
		if(!confirm('선택한 데이터를 삭제하시겠습니까?')) return;
		
		Server.post('/main/nms/devRouting/delCfgRouting.do', {
			data: { routeNo: rowdata.routeNo },
			success: function(result) {
				PMain.searchRouteGrid();
				PMain.searchCaseGrid();
				PMain.searchHopGrid();
				alert('삭제되었습니다.');
			}
		});
	},
	
	addCase: function(){
		var rowIdxes = HmGrid.getRowIdxes($p_routeGrid, '노드 설정을 선택해주세요.');
		if(rowIdxes === false) return;
		var rowData = $p_routeGrid.jqxGrid('getrowdata', rowIdxes);
		
		if(rowData.routeNo != null){
			//sortIdx 제일 큰 수에 이어서 자동으로 입력되게
			var rows = $p_caseGrid.jqxGrid('getrows');
			var lastIdx;
			if (rows.length == 0) {
				lastIdx = 1;
			}else{
				var Data = $p_caseGrid.jqxGrid('getrowdata', rows.length-1);
				lastIdx = Data.rtCaseNo + 1;
			}
			
			var obj = { 
					rtCaseNo: lastIdx,
					routeNo: rowData.routeNo
			};
			$.post(ctxPath + '/main/popup/nms/pRouteCaseAdd.do', function(result) {
				HmWindow.open($('#pwindow'), '케이스 등록', result, 400, 130, 'pwindow_init', obj);
			});
		}else{
			alert("저장되지 않은 노드입니다. \n노드를 다시 선택해주세요.");
    		return;
		}
	},
	
	editCase: function(){
		var rowIdx = HmGrid.getRowIdx($p_caseGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		var rowdata = $p_caseGrid.jqxGrid('getrowdata', rowIdx);
		
		var params = {
			rtCaseNo: rowdata.rtCaseNo,
			routeNo: rowdata.routeNo,
			rtCaseName: rowdata.rtCaseName
		};
		
		$.post(ctxPath + '/main/popup/nms/pRouteCaseEdit.do', function(result) {
			HmWindow.open($('#pwindow'), '케이스 수정', result, 400, 150, 'pwindow_init', params );
		});
	},
	
	delCase: function(){
		var rowIdx = HmGrid.getRowIdx($p_caseGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		var rowdata = $p_caseGrid.jqxGrid('getrowdata', rowIdx);
		if(!confirm('선택한 데이터를 삭제하시겠습니까?')) return;
		
		Server.post('/main/nms/devRouting/delCfgRoutingCase.do', {
			data: { rtCaseNo: rowdata.rtCaseNo, routeNo: rowdata.routeNo },
			success: function(result) {
				PMain.searchCaseGrid();
				PMain.searchHopGrid();
				alert('삭제되었습니다.');
			}
		});
	},
	
	addHop: function(){
		var rowIdxes = HmGrid.getRowIdxes($p_caseGrid, '케이스를 선택해주세요.');
		if(rowIdxes === false) return;
		var rowData = $p_caseGrid.jqxGrid('getrowdata', rowIdxes);
		
		if(rowData.rtCaseNo != null){
			//sortIdx 제일 큰 수에 이어서 자동으로 입력되게
			var rows = $p_hopGrid.jqxGrid('getrows');
			var lastIdx;
			if (rows.length == 0) {
				lastIdx = 1;
			}else{
				var Data = $p_hopGrid.jqxGrid('getrowdata', rows.length-1);
				lastIdx = Data.hopIdx + 1;
			}
			
			var obj = { 
				routeNo: rowData.routeNo,
				rtCaseNo: rowData.rtCaseNo,
				hopIdx: lastIdx
			};
	
			$.post(ctxPath + '/main/popup/nms/pRouteHopAdd.do', function(result) {
				HmWindow.open($('#pwindow'), '홉  등록', result, 400, 130, 'pwindow_init', obj);
			});

	//		var rowIdxes = HmGrid.getRowIdxes($p_caseGrid, '케이스를 선택해주세요.');
	//		if(rowIdxes === false) return;
	//		var rowData = $p_caseGrid.jqxGrid('getrowdata', rowIdxes);

	//		$p_hopGrid.jqxGrid('addrow', null, obj);
		}else{
			alert("저장되지 않은 노드입니다. \n노드를 다시 선택해주세요.");
    		return;
		}
	},
	
	editHop: function(){
		var rowIdx = HmGrid.getRowIdx($p_hopGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		var rowdata = $p_hopGrid.jqxGrid('getrowdata', rowIdx);
		
		var params = {
			rtCaseNo: rowdata.rtCaseNo,
			routeNo: rowdata.routeNo,
			hopNo: rowdata.hopNo,
			hopIdx: rowdata.hopIdx,
			hopPath: rowdata.hopPath
		};
		
		$.post(ctxPath + '/main/popup/nms/pRouteHopEdit.do', function(result) {
			HmWindow.open($('#pwindow'), '홉 수정', result, 400, 150, 'pwindow_init', params );
		});
		
//		HmGrid.endRowEdit($p_hopGrid);
//		if(hopIds.length == 0) {
//			alert('변경된 데이터가 없습니다.');
//			return;
//		}
//		
//		var _list = [];
//		$.each(hopIds, function(idx, value) {
//			_list.push($p_hopGrid.jqxGrid('getrowdatabyid', value));
//		});
//	
//		console.log(_list);
//		Server.post('/main/nms/devPerf3/saveHopList.do', {
//			data: { list: _list },
//			success: function(result) {
//				alert(result);
//				hopIds = [];
//			}
//		});
	},
	
	delHop: function(){
		var rowIdx = HmGrid.getRowIdx($p_hopGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		var rowdata = $p_hopGrid.jqxGrid('getrowdata', rowIdx);
		if(!confirm('선택한 데이터를 삭제하시겠습니까?')) return;
		
		Server.post('/main/nms/devRouting/delCfgRoutingCaseHop.do', {
			data: { hopNo: rowdata.hopNo },
			success: function(result) {
				PMain.searchHopGrid();
				alert('삭제되었습니다.');
			}
		});
	},
	
	searchRouteGrid: function() {
		HmGrid.updateBoundData($p_routeGrid, ctxPath + '/main/nms/devRouting/getCfgRoutingList.do');
	},
	
	searchCaseGrid: function() {
		HmGrid.updateBoundData($p_caseGrid, ctxPath + '/main/nms/devRouting/getCfgRoutingCaseList.do');
	},
	
	searchHopGrid: function() {
		HmGrid.updateBoundData($p_hopGrid, ctxPath + '/main/nms/devRouting/getCfgRoutingCaseHopList.do');
	}
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

