var $p_devGrid, $p_oidGrid, $p_cfgGrid;
var Main = {
		/** variable */
		initVariable : function() {
			$p_devGrid = $('#p_devGrid');
			$p_oidGrid = $('#p_oidGrid');
			$p_cfgGrid = $('#p_cfgGrid');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('#btnMove_cfg').on('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "p_btnSearch": this.search(); break;
			case "p_btnExcel": this.exportExcel(); break;
			case 'p_btnAdd_oid': Main.addOid(); break;
			case 'p_btnEdit_oid': Main.editOid(); break;
			case 'p_btnDel_oid': Main.delOid(); break;
			case 'p_btnMove_cfg': Main.moveToCfg(); break;
			case 'p_btnSearch_cfg': Main.searchOidConfig(); break;
			case 'p_btnDel_cfg': Main.delOidConfig(); break;
			case 'p_btnSave_cfg': Main.saveOidConfig(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmWindow.create($('#p2window'), 100, 100);

			
			$('#hSplitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'horizontal', theme: jqxTheme, panels : [{ size: '50%', collapsible: false }, { size: '50%' }] });
			$('#tv1Splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'vertical', theme: jqxTheme, panels : [{ size: 300, collapsible: false }, { size: '100%' }] });
			$('#bvSplitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'vertical', theme: jqxTheme, panels : [{ size: 400, collapsible: false }, { size: '100%' }] });
			
			Master.createGrpTab(Main.search);
			HmGrid.create($p_devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				selectionmode : 'multiplerowsextended',
				columns: 
				[
				 	{ text : '장비명', 	datafield: 'devName',			minwidth: 150 	 },
					{ text : 'IP', 	datafield: 'devIp',			width: 120 	 },
					{ text : '종류', 		datafield: 'devKind2',		width: 150 	 },
					{ text : '모델', 		datafield: 'model',		width: 150	 },
					{ text : '제조사', 			datafield: 'vendor',	minwidth: 120    },
					{ text : 'mngNo', 	datafield: 'mngNo',			width: 150, hidden: true }
			    ]
			});
			
			HmGrid.create($p_oidGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						}
				),
				columns: 
				[
				 	{ text : 'OID', 		datafield: 'oid',				minwidth: 120 	 },
					{ text : 'OID명', 		datafield: 'oidName',		width: 80 	 },
					{ text : 'OID설명', 	datafield: 'oidDetail',		width: 80 	 },
					{ text : '임계값', 		datafield: 'limitVal',			width: 80	 },
					{ text : 'oidNo', 		datafield: 'oidNo', hidden: true  }
			    ]
			});
			$p_oidGrid.on('bindingcomplete', function(event) {
				$p_oidGrid.jqxGrid('selectrow', 0);
				HmGrid.updateBoundData($p_cfgGrid, ctxPath +  '/main/nms/oidPerfConf/getOidConfigList.do');
			})
			HmGrid.create($p_cfgGrid,
					{
						source : new $.jqx.dataAdapter(
							{ 
								datatype : 'json'
							},
							{
								formatData : function(data) {
									var idx = HmGrid.getRowIdx($p_oidGrid);
									if(idx !== false) {
										if($p_oidGrid.jqxGrid('getrowdata', idx)){
											var _oidNo = $p_oidGrid.jqxGrid('getrowdata', idx).oidNo;
											$.extend(data, {
												oidNo: _oidNo
											});
										}
									}
									return data;
								}
							}
						),
						editable: true,
						editmode: 'selectedrow',
						selectionmode: 'multiplerowsextended',
						columns : 
						[
				 			{ text : '장비명', datafield : 'devName',minwidth : 150, editable: false },
							{ text : '장비IP', datafield : 'devIp', width : 120, editable: false },
							{ text : '장비종류', datafield : 'devKind2', width : 150, editable: false },
							{ text : '모델', datafield : 'model', width : 150, editable: false },
							{ text : '제조사', datafield : 'vendor', minwidth : 120, editable: false },
							{ text : '이벤트', datafield : 'isEvt', width : 100 , columntype: 'checkbox' },
							{ text : 'devNo', 		datafield: 'devNo', hidden: true  }
						] 
				});
			
			$p_oidGrid.on('rowdoubleclick', function(event){
				HmGrid.updateBoundData($p_cfgGrid, ctxPath +  '/main/nms/oidPerfConf/getOidConfigList.do');
			});

		},

		/** init data */
		initData : function() {

		},
		selectTree: function() {
			Main.search();
		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			$.extend(params, {
				sIp: $('#sIp').val(),
				sDevName: $('#sDevName').val(),
			});
			//alert(JSON.stringify(params));
			return params;
		},

		
		search : function() {
			HmGrid.updateBoundData($p_devGrid, ctxPath + '/main/nms/oidPerfConf/getDevList.do');
			HmGrid.updateBoundData($p_oidGrid, ctxPath + '/main/nms/oidPerfConf/getOidList.do');
		},
		
	    
		/** export Excel */
		exportExcel: function() {
			var params = Master.getGrpTabParams();
			$.extend(params, {
				sIp: $('#sIp').val(),
				sDevName: $('#sDevName').val(),
			});


			HmUtil.exportExcel(ctxPath + '/main/nms/syslog/export.do', params);
		},
		
		addOid: function() {
			$.get(ctxPath + '/main/popup/nms/pOidAdd.do', 
					function(result) {
						$('#p2window').jqxWindow({ width: 300, height: 200, title: '<h1>OID 등록</h1>', content: result, position: 'center', resizable: false });
						$('#p2window').jqxWindow('open');
					}
			);
		},
		
		editOid: function() {
			var idx = HmGrid.getRowIdx($p_oidGrid);
			if(idx !== false) {
				$.get(ctxPath + '/main/popup/nms/pOidEdit.do', 
						{	oidNo: $p_oidGrid.jqxGrid('getrowdata', idx).oidNo,
							oid: $p_oidGrid.jqxGrid('getrowdata', idx).oid,
							oidName: $p_oidGrid.jqxGrid('getrowdata', idx).oidName,
							oidDetail: $p_oidGrid.jqxGrid('getrowdata', idx).oidDetail,
							limitVal: $p_oidGrid.jqxGrid('getrowdata', idx).limitVal
						},

						function(result) {
							$('#p2window').jqxWindow({ width: 300, height: 200, title: '<h1>OID 수정</h1>', content: result, position: 'center', resizable: false });
							$('#p2window').jqxWindow('open');
						}
				);
			}else{	alert('OID를 선택해주세요.');	}
		},

		delOid: function() {
			var idx = HmGrid.getRowIdx($p_oidGrid);
			if(idx !== false) {
				Server.post('/main/nms/oidPerfConf/delOid.do', {
					data: {	oidNo: $p_oidGrid.jqxGrid('getrowdata', idx).oidNo},
					success: function(result) {
						HmGrid.updateBoundData($p_oidGrid, ctxPath + '/main/nms/oidPerfConf/getOidList.do');
						alert('삭제되었습니다.');
						$('#pbtnClose').click();
					}
				});
			}else{	alert('OID 선택해주세요.');	}
		},
		moveToCfg : function() {
			var idx = HmGrid.getRowIdx($p_oidGrid);
			if(idx !== false) {
				var rowIdxes = HmGrid.getRowIdxes($p_devGrid, '장비를 선택해주세요.');
				if(rowIdxes === false) return;
				var list = [], newIds = [];
				for(var i = 0; i < rowIdxes.length; i++) {
					var tmp = $p_devGrid.jqxGrid('getrowdata', rowIdxes[i]);
						list.push({ devName: tmp.devName, devIp: tmp.devIp, devKind2: tmp.devKind2, model: tmp.model, 
							vendor: tmp.vendor, mngNo: tmp.mngNo, oidNo: $p_oidGrid.jqxGrid('getrowdata', idx).oidNo });
				}
				$p_cfgGrid.jqxGrid('addrow', null, list);
			}else{	alert('OID를 선택해주세요.');	}
			

	
		},

		searchOidConfig: function() {
			HmGrid.updateBoundData($p_oidGrid, ctxPath + '/main/nms/oidPerfConf/getOidList.do');
		},

		delOidConfig: function() {
			var rowIdxes = HmGrid.getRowIdxes($p_cfgGrid);
			if(rowIdxes === false) {
				alert('선택된 데이터가 없습니다.');
				return;
			}
			
			if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
			var _devNos = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var rowdata = $p_cfgGrid.jqxGrid('getrowdata', value);
				// 로컬메모리에서 추가된 경우 삭제하고 리턴
				if(rowdata.devNo == -1) {
					$p_cfgGrid.jqxGrid('deleterow', rowdata.uid);
				}
				else {
					_devNos.push(rowdata.devNo);
					_uids.push(rowdata.uid);
				}
			});
			
			if(_devNos.length > 0) {
				Server.post('/main/nms/oidPerfConf/delOidConfig.do', {
					data : { devNos: _devNos },
					success : function(result) {
						$p_cfgGrid.jqxGrid('deleterow', _uids);
					} 
				});
			}
		},
		
		saveOidConfig: function() {
			var idx = HmGrid.getRowIdx($p_oidGrid);
			if(idx !== false) {
				var _list = $p_cfgGrid.jqxGrid('getboundrows');
				Server.post('/main/nms/oidPerfConf/saveOidConfig.do', {
					data: { oidNo: $p_oidGrid.jqxGrid('getrowdata', idx).oidNo, list: _list },
					success: function(result) {
						HmGrid.updateBoundData($p_cfgGrid);
						alert('저장되었습니다.');
					}
				});
			}else{	alert('OID를 선택해주세요.');	}
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});