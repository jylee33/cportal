var $grpTree, $devGrid, $ifGrid, $groupGrid, $mcfgGrid;
var _grpData = [];
var $nfGrpTree, $nfDevGrid, $nfInIfGrid, $nfOutIfGrid, $mfGrpGrid, $mfcfgGrid;

var Main =
	{
		/** variable */
		initVariable : function() {
			// netTab
			$grpTree = $('#grpTree'), $devGrid = $('#netTabDevGrid'), $ifGrid = $('#netTabIfGrid'), $groupGrid = $('#groupGrid'), $mcfgGrid = $('#mcfgGrid');
			// netFlowTab
			$nfGrpTree = $('#netFlowTabgrpTree'), $nfDevGrid = $('#netFlowTabDevGrid'), $nfInIfGrid = $('#netFlowTabInIfGrid'), $nfOutIfGrid = $('#netFlowTabOutIfGrid');
			$mfGrpGrid = $('#mfGrpGrid'), $mfcfgGrid = $('#mfcfgGrid');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			try {
				switch(event.currentTarget.id) {
				// mang
				case 'btnAdd_mgrp': Main.addMangGrp(); break;
				case 'btnEdit_mgrp': Main.editMangGrp(); break;
				case 'btnDel_mgrp': Main.delMangGrp(); break;
				case 'btnMove_mcfg': Main.moveToMcfg(); break;
				case 'btnSearch_mcfg': Main.searchMangConfig(); break;
				case 'btnDel_mcfg': Main.delMangConfig(); break;
				case 'btnSave_mcfg': Main.saveMangConfig(); break;
				// mang flow
				case 'btnAdd_mfgrp': Main.addMFGrp(); break;
				case 'btnEdit_mfgrp': Main.editMFGrp(); break;
				case 'btnDel_mfgrp': Main.delMFGrp(); break;
				case 'btnMove_mfcfg': Main.moveToMfcfg(); break;
				case 'btnSearch_mfcfg': Main.searchMangFlowConfig(); break;
				case 'btnDel_mfcfg': Main.delMangFlowConfig(); break;
				case 'btnSave_mfcfg': Main.saveMangFlowConfig(); break;
				}
			} catch(e) {}
		},

		/** init design */
		initDesign : function() {

			HmWindow.create($('#pwindow'), 100, 100);

			$('#mainTab').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch (tab) {
					case 0:
						Main.networkTabShow();
						break;
					case 1:
						Main.networkFlowTabShow();
						break;
					}
				}
			});
		},

		networkTabShow : function() {

			HmJqxSplitter.create($('#m_hSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

			HmJqxSplitter.create($('#m_tv1Splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 250, min: 150, collapsible: false }, { size: '100%' }], 'auto', '100%');
			HmJqxSplitter.create($('#m_tv2Splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '100%' }], 'auto', '100%');
			HmJqxSplitter.create($('#m_bvSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 250, min: 150, collapsible: false }, { size: '100%' }], 'auto', '100%');

			HmGrid.create($devGrid,
				{
					source : new $.jqx.dataAdapter(
						{ datatype : 'json' },
						{
							formatData : function(data) {
								var _grpNo = 0;
								var grpSelection = $grpTree.jqxTreeGrid('getSelection');
								if (!$.isEmpty(grpSelection) && grpSelection.length > 0)
									_grpNo = grpSelection[0].grpNo;

								$.extend(data,
									{ grpNo : _grpNo });
								return data;
							},
							loadComplete : function(record) {
								if (record.hasOwnProperty('resultData')) {
									$devGrid.jqxGrid('selectrow', 0);
								}
							} }),
					columns :
					[
					 	{ text: '장비명', datafield: 'disDevName' },
					 	{ text: 'IP', datafield: 'devIp' },
					 	{ text: '종류', datafield: 'devKind2', filtertype: 'checkedlist' }
					] 
			});
			$devGrid.on('rowdoubleclick', function(event) {
				HmGrid.updateBoundData($ifGrid, ctxPath + "/line/getLineList.do");
			});

			HmGrid.create($ifGrid,
				{
					source : new $.jqx.dataAdapter(
						{ datatype : 'json' },
						{
							formatData : function(data) {
								if ($devGrid.jqxGrid('getselectedrowindex') == -1)
									return;
								$.extend(data,
									{ mngNo : $devGrid.jqxGrid('getrowdata', $devGrid.jqxGrid('getselectedrowindex')).mngNo });
								return data;
							},
							loadComplete : function(record) {
								if (record.hasOwnProperty('resultData')) {
									$ifGrid.jqxGrid('selectrow', 0);
								}
							} 
					}),
					selectionmode : 'multiplerowsextended',
                    pagerheight: 27,
                    pagerrenderer : HmGrid.pagerrenderer,
					columns : 
					[
					 	{ text : '회선명', datafield : 'ifName' },
						{ text : '회선별칭', datafield : 'ifAlias' },
						{ text : '대역폭', datafield : 'lineWidth', cellsrenderer : HmGrid.unit1000renderer } 
					] 
			});
			
			var adapter = new $.jqx.dataAdapter({ datatype: 'json', url: ctxPath + '/grp/getDefaultGrpTreeList.do' });
			$groupGrid.jqxTreeGrid({
				source : new $.jqx.dataAdapter(
						{
							datatype: 'json',
							root: 'resultData',
							url: ctxPath + '/grp/getMangGrpTreeList.do',
							hierarchy: {
								keyDataField: { name: 'grpNo' },
								parentDataField: { name: 'grpParent' }
							},
							id: 'grpNo'
						}
				),
				width : '100%',
				height : '99.8%',
				theme : jqxTheme,
				editable: false,
				pageable : false,

				icons : function(rowKey, rowData) {
					try {
						if (rowData['devKind2'] === undefined) {
							return ctxPath + '/img/tree/p_tree.png';
						}
						switch (rowData.devKind2) {
						case 'GROUP':
							return ctxPath + '/img/tree/p_tree.png';
						default:
							return ctxPath + '/img/historyIcon.gif';
						}
					} catch (e) {
						return ctxPath + '/img/tree/p_tree.png';
					}
				},
				ready : function() {
					var uid = null;
					var rows = $groupGrid.jqxTreeGrid('getRows');
					if (rows != null && rows.length > 0) {
						uid = $groupGrid.jqxTreeGrid('getKey', rows[0]);
					}
					if (uid != null) {
						$groupGrid.jqxTreeGrid('expandRow', uid);
						$groupGrid.jqxTreeGrid('selectRow', uid);
					}
				},

				columns:
				[
				 	{ text: '그룹', datafield: 'grpName' },
				 	{ text: '권한그룹', datafield: 'grpRefString', width: 130 }
				]
			}).on('rowSelect', function(event) {
				Main.searchMangConfig();
			});
			
			HmGrid.create($mcfgGrid,
				{
					source : new $.jqx.dataAdapter(
						{ 
							datatype : 'json'
						},
						{
							formatData : function(data) {
								var treeItem = HmTreeGrid.getSelectedItem($groupGrid);
								var _grpNo = 0;
								if(treeItem !== null) {
									_grpNo = treeItem.grpNo;
								}
								$.extend(data, {
									grpNo: _grpNo
								});
								return data;
							}
						}
					),
					editable: true,
					editmode: 'selectedrow',
					selectionmode: 'multiplerowsextended',
					columns :
					[
			 			{ text : '장비명', datafield : 'devName', minwidth: 100, editable: false },
						{ text : '장비IP', datafield : 'devIp', width : 150, editable: false },
						{ text : '회선명', datafield : 'ifName', editable: false },
						{ text : '회선별칭', datafield : 'ifAlias', width : 150, editable: false },
						{ text : '대역폭', datafield : 'lineWidth', width : 150, editable: false, cellsrenderer : HmGrid.unit1000renderer },
						{ text : 'IN/OUT', datafield : 'ifInout', displayfield: 'ifInoutStr', width : 150, columntype: 'dropdownlist',
							createeditor: function(row, value, editor) {
								editor.jqxDropDownList({ source: [{ label: 'IN', value: 'I' }, { label: 'OUT', value: 'O' }], autoDropDownHeight: true });
							}										
						} 
					] 
			});

			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEF_ALL, Main.searchDevGrid, null, ['grpName']);

		},

		networkFlowTabShow : function() {
			$('#mf_hSplitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'horizontal', theme: jqxTheme, panels : [{ size: '50%', collapsible: false }, { size: '50%' }] });
			$('#mf_tv1Splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'vertical', theme: jqxTheme, panels : [{ size: 300, collapsible: false }, { size: '100%' }] });
			$('#mf_tv2Splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'vertical', theme: jqxTheme, panels : [{ size: 400, collapsible: false }, { size: '100%' }] });
			$('#mf_bvSplitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'vertical', theme: jqxTheme, panels : [{ size: 400, collapsible: false }, { size: '100%' }] });
			
			HmGrid.create($nfDevGrid,
				{
					source : new $.jqx.dataAdapter(
						{ datatype : 'json' },
						{
							formatData : function(data) {
								var _grpNo = 0;
								var grpSelection = $nfGrpTree.jqxTreeGrid('getSelection');
								if (!$.isEmpty(grpSelection) && grpSelection.length > 0)
									_grpNo = grpSelection[0].grpNo;

								$.extend(data,
									{ grpNo : _grpNo });
								return data;
							},
							loadComplete : function(record) {
								if (record.hasOwnProperty('resultData')) {
									$devGrid.jqxGrid('selectrow', 0);
								}
							} }),
					columns : 
					[
					 	{ text : '장비명', datafield : 'devName' },
						{ text : 'ip', datafield : 'devIp' } 
				 	] 
			});
			$nfDevGrid.on('rowdoubleclick', function(event) {
				HmGrid.updateBoundData($nfInIfGrid, ctxPath + "/main/env/networkConfigure/getNetFlowInIfGrid.do");
				HmGrid.updateBoundData($nfOutIfGrid, ctxPath + "/main/env/networkConfigure/getNetFlowOutIfGrid.do");
			});

			HmGrid.create($nfInIfGrid,
				{
					source : new $.jqx.dataAdapter(
						{ datatype : 'json' },
						{
							formatData : function(data) {
								if ($nfDevGrid.jqxGrid('getselectedrowindex') == -1)
									return;
								$.extend(data,
									{ mngNo : $nfDevGrid.jqxGrid('getrowdata', $nfDevGrid.jqxGrid('getselectedrowindex')).mngNo });
								return data;
							},
							loadComplete : function(record) {
								if (record.hasOwnProperty('resultData')) {
									$nfInIfGrid.jqxGrid('selectrow', 0);
								}
							} }),
					columns : [
								{
									text : 'IN회선명',
									datafield : 'ifName' },
								{
									text : 'IN회선별칭',
									datafield : 'ifAlias' } ] });

			HmGrid.create($nfOutIfGrid,
				{
					source : new $.jqx.dataAdapter(
						{ datatype : 'json' },
						{
							formatData : function(data) {
								if ($nfDevGrid.jqxGrid('getselectedrowindex') == -1)
									return;
								$.extend(data,
									{ mngNo : $nfDevGrid.jqxGrid('getrowdata', $nfDevGrid.jqxGrid('getselectedrowindex')).mngNo });
								return data;
							},
							loadComplete : function(record) {
								if (record.hasOwnProperty('resultData')) {
									$nfOutIfGrid.jqxGrid('selectrow', 0);
								}
							} }),
					columns : [
								{
									text : 'OUT회선명',
									datafield : 'ifName' },
								{
									text : 'OUT회선별칭',
									datafield : 'ifAlias' } ] });

			
			var adapter = new $.jqx.dataAdapter({ datatype: 'json', url: ctxPath + '/grp/getDefaultGrpTreeList.do' });
			$mfGrpGrid.jqxTreeGrid({
				source : new $.jqx.dataAdapter(
						{
							datatype: 'json',
							root: 'resultData',
							url: ctxPath + '/grp/getMangFlowGrpTreeList.do',
							hierarchy: {
								keyDataField: { name: 'grpNo' },
								parentDataField: { name: 'grpParent' }
							},
							id: 'grpNo'
						}
				),
				width : '100%',
				height : '99.8%',
				theme : jqxTheme,
				editable: false,
				pageable : false,
				icons : function(rowKey, rowData) {
					try {
						if (rowData['devKind2'] === undefined) {
							return ctxPath + '/img/tree/p_tree.png';
						}
						switch (rowData.devKind2) {
						case 'GROUP':
							return ctxPath + '/img/tree/p_tree.png';
						default:
							return ctxPath + '/img/historyIcon.gif';
						}
					} catch (e) {
						return ctxPath + '/img/tree/p_tree.png';
					}
				},
				ready : function() {
					var uid = null;
					var rows = $mfGrpGrid.jqxTreeGrid('getRows');
					if (rows != null && rows.length > 0) {
						uid = $mfGrpGrid.jqxTreeGrid('getKey', rows[0]);
					}
					if (uid != null) {
						$mfGrpGrid.jqxTreeGrid('expandRow', uid);
						$mfGrpGrid.jqxTreeGrid('selectRow', uid);
					}
				},
				columns:
				[
				 	{ text: '그룹', datafield: 'grpName' },
				 	{ text: '권한그룹', datafield: 'grpRefString', width: 130 }
				]
			}).on('rowSelect', function(event) {
				Main.searchMangFlowConfig();
			});

			HmGrid.create($mfcfgGrid,
				{
					source : new $.jqx.dataAdapter(
						{ datatype : 'json' },
						{
							formatData : function(data) {
								var _grpNo = 0;
								var treeItem = HmTreeGrid.getSelectedItem($mfGrpGrid);
								if(treeItem !== null) _grpNo = treeItem.grpNo;
								$.extend(data,
									{ grpNo : _grpNo });
								return data;
							},
							loadComplete : function(record) {
								if (record.hasOwnProperty('resultData')) {
									$mfcfgGrid.jqxGrid('selectrow', 0);
								}
							} 
						}
					),
					selectionmode: 'multiplerowsextended',
					columns: 
					[
						{ text : '장비명', datafield : 'devName' },
						{ text : '장비IP', datafield : 'devIp' },
						{ text : 'IN회선명', datafield : 'inIfName' },
						{ text : 'IN회선별칭', datafield : 'inIfAlias' },
						{ text : 'OUT회선명', datafield : 'outIfName' },
						{ text : 'OUT회선별칭', datafield : 'outIfAlias' } 
					] 
			});

			HmTreeGrid.create($nfGrpTree, HmTree.T_GRP_DEF_ALL, Main.searchNetFlowTabDevGrid);
		},


		/** init data */
		initData : function() {

		},

		/** 망 설정 */
		searchDevGrid : function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/dev/getDevList.do');
		},


		addMangGrp: function() {
			$.get(ctxPath + '/main/popup/env/pMangGrpAdd.do', 
					function(result) {
						HmWindow.open($('#pwindow'), '망그룹 등록', result, 400, 492);
					}
			);
		},
		
		editMangGrp: function() {
			var treeItem = HmTreeGrid.getSelectedItem($groupGrid);
			if(treeItem === null) {
				alert('망그룹을 선택해주세요.');
				return;
			}
			if(treeItem.grpParent == 0) {
				alert('최상위 그룹을 수정할 수 없습니다.');
				return;
			}
			
			$.get(ctxPath + '/main/popup/env/pMangGrpEdit.do',
					{ grpNo: treeItem.grpNo, grpParent: treeItem.grpParent, grpRef: treeItem.grpRef, grpName: treeItem.grpName },
					function(result) {
						HmWindow.open($('#pwindow'), '망그룹 수정', result, 400, 492);
					}
			);
		},

		delMangGrp : function() {
			var treeItem = HmTreeGrid.getSelectedItem($groupGrid);
			if(treeItem === null) {
				alert('망그룹을 선택해주세요.');
				return;
			}
			
			if(!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
			Server.post('/grp/delMangGrp.do', {
				data: { grpNo: treeItem.grpNo },
				success: function(result) {
					$groupGrid.jqxTreeGrid('deleteRow', treeItem.uid);
					alert('삭제되었습니다.');
				}
			});
		},
		
		moveToMcfg : function() {
			var treeItem = HmTreeGrid.getSelectedItem($groupGrid);
			if(treeItem === null) {
				alert('망그룹을 선택해주세요.');
				return;
			}
			var rowIdxes = HmGrid.getRowIdxes($ifGrid, '회선을 선택해주세요.');
			if(rowIdxes === false) return;
			var list = [], newIds = [];
			for(var i = 0; i < rowIdxes.length; i++) {
				var tmp = $ifGrid.jqxGrid('getrowdata', rowIdxes[i]);
				var newId = tmp.mngNo + '_' + tmp.ifIdx;
//				if($mcfgGrid.jqxGrid('getrowdatabyid', newId) === undefined) {
//					newIds.push(tmp.mngNo + '_' + tmp.ifIdx);
					list.push({ devName: tmp.devName, devIp: tmp.devIp, ifName: tmp.ifName, ifAlias: tmp.ifAlias, ifIdx: tmp.ifIdx,
						lineWidth: tmp.lineWidth, ifInout: 'I', mngNo: tmp.mngNo, grpNo: treeItem.grpNo, netNo: -1 });
//				}
			}
//			$mcfgGrid.jqxGrid('addrow', newIds, list);
			$mcfgGrid.jqxGrid('addrow', null, list);
		},

		searchMangConfig: function() {
			HmGrid.updateBoundData($mcfgGrid, ctxPath + '/main/env/networkConfigure/getMangConfigList.do');
		},

		delMangConfig: function() {
			var rowIdxes = HmGrid.getRowIdxes($mcfgGrid);
			if(rowIdxes === false) {
				alert('선택된 데이터가 없습니다.');
				return;
			}
			
			if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
			var _netNos = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var rowdata = $mcfgGrid.jqxGrid('getrowdata', value);
				// 로컬메모리에서 추가된 경우 삭제하고 리턴
				if(rowdata.netNo == -1) {
					$mcfgGrid.jqxGrid('deleterow', rowdata.uid);
				}
				else {
					_netNos.push(rowdata.netNo);
					_uids.push(rowdata.uid);
				}
			});
			
			if(_netNos.length > 0) {
				Server.post('/main/env/networkConfigure/delMangConfig.do', {
					data : { netNos: _netNos },
					success : function(result) {
						$mcfgGrid.jqxGrid('deleterow', _uids);
						alert('삭제되었습니다.');
					} 
				});
			}
		},
		
		saveMangConfig: function() {
			var treeItem = HmTreeGrid.getSelectedItem($groupGrid);
			if(treeItem === false) {
				alert('망그룹을 선택해주세요.');
				return;
			}
			var _grpNo = treeItem.grpNo;
			var _list = $mcfgGrid.jqxGrid('getboundrows');
			Server.post('/main/env/networkConfigure/saveMangConfig.do', {
				data: { grpNo: _grpNo, list: _list },
				success: function(result) {
					HmGrid.updateBoundData($mcfgGrid);
					alert('저장되었습니다.');
				}
			});
		},

		
		/** 망흐름 설정 */
		searchNetFlowTabDevGrid : function() {
			HmGrid.updateBoundData($nfDevGrid, ctxPath + '/main/env/networkConfigure/getNetFlowDevGrid.do');
		},
		
		addMFGrp: function() {
			$.get(ctxPath + '/main/popup/env/pMangFlowGrpAdd.do', 
					function(result) {
						$('#pwindow').jqxWindow({ width: 400, height: 550, title: '<h1>망흐름그룹 추가</h1>', content: result, position: 'center', resizable: false });
						$('#pwindow').jqxWindow('open');
					}
			);
		},

		editMFGrp: function() {
			var treeItem = HmTreeGrid.getSelectedItem($mfGrpGrid);
			if(treeItem === null) {
				alert('망흐름 그룹을 선택해주세요.');
				return;
			}
			
			$.get(ctxPath + '/main/popup/env/pMangFlowGrpEdit.do', 
					{ grpNo: treeItem.grpNo, grpParent: treeItem.grpParent, grpRef: treeItem.grpRef, grpName: treeItem.grpName },
					function(result) {
						$('#pwindow').jqxWindow({ width: 400, height: 550, title: '<h1>망흐름그룹 수정</h1>', content: result, position: 'center', resizable: false });
						$('#pwindow').jqxWindow('open');
					}
			);
		},

		delMFGrp: function() {
			var treeItem = HmTreeGrid.getSelectedItem($mfGrpGrid);
			if(treeItem === null) {
				alert('망흐름그룹을 선택해주세요.');
				return;
			}
			
			if(!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
			Server.post('/grp/delMangFlowGrp.do', {
				data: { grpNo: treeItem.grpNo },
				success: function(result) {
					$mfGrpGrid.jqxTreeGrid('deleteRow', treeItem.uid);
					alert('삭제되었습니다.');
				}
			});
		},

		moveToMfcfg : function() {
			var treeItem = HmTreeGrid.getSelectedItem($mfGrpGrid);
			if(treeItem === null) {
				alert('망흐름 그룹을 선택해주세요.');
				return;
			}
			var idx = HmGrid.getRowIdx($nfDevGrid, '장비를 선택해주세요.');
			if(idx === false) return;
			var devRowdata = $nfDevGrid.jqxGrid('getrowdata', idx);
			var inIdx = HmGrid.getRowIdx($nfInIfGrid, 'IN회선을 선택해주세요.');
			if(inIdx === false) return;
			var outIdx = HmGrid.getRowIdx($nfOutIfGrid, 'OUT회선을 선택해주세요.');
			if(outIdx === false) return;
			
			var inRowdata = $nfInIfGrid.jqxGrid('getrowdata', inIdx);
			var outRowdata = $nfOutIfGrid.jqxGrid('getrowdata', outIdx);
			var obj = { 
					mngNo: devRowdata.mngNo,
					devName: devRowdata.devName,
					devIp: devRowdata.devIp,
					inIfNo: inRowdata.ifIdx,
					inIfName: inRowdata.ifName,
					inIfAlias: inRowdata.ifAlias,
					outIfNo: outRowdata.ifIdx,
					outIfName: outRowdata.ifName,
					outIfAlias: outRowdata.ifAlias,
					mnetNo: -1,
					grpNo: treeItem.grpNo
			};
			$mfcfgGrid.jqxGrid('addrow', null, obj);
		},
		
		searchMangFlowConfig: function() {
			HmGrid.updateBoundData($mfcfgGrid, ctxPath + '/main/env/networkConfigure/getMangFlowConfigList.do');
		},
		
		delMangFlowConfig: function() {
			var rowIdxes = HmGrid.getRowIdxes($mfcfgGrid);
			if(rowIdxes === false) {
				alert('선택된 데이터가 없습니다.');
				return;
			}
			
			if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
			var _mnetNos = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var rowdata = $mfcfgGrid.jqxGrid('getrowdata', value);
				// 로컬메모리에서 추가된 경우 삭제하고 리턴
				if(rowdata.mnetNo == -1) {
					$mfcfgGrid.jqxGrid('deleterow', rowdata.uid);
				}
				else {
					_mnetNos.push(rowdata.mnetNo);
					_uids.push(rowdata.uid);
				}
			});
			
			if(_mnetNos.length > 0) {
				Server.post('/main/env/networkConfigure/delMangFlowConfig.do', {
					data : { mnetNos: _mnetNos },
					success : function(result) {
						$mfcfgGrid.jqxGrid('deleterow', _uids);
						alert('삭제되었습니다.');
					} 
				});
			}
		},
		
		saveMangFlowConfig: function() {
			var treeItem = HmTreeGrid.getSelectedItem($mfGrpGrid);
			if(treeItem === null) {
				alert('망흐름 그룹을 선택해주세요.');
				return;
			}
			var _grpNo = treeItem.grpNo;
			var _list = $mfcfgGrid.jqxGrid('getboundrows');
			Server.post('/main/env/networkConfigure/saveMangFlowConfig.do', {
				data: { grpNo: _grpNo, list: _list },
				success: function(result) {
					HmGrid.updateBoundData($mfcfgGrid);
					alert('저장되었습니다.');
				}
			});
		}

};

// 그룹데이터 갱신
function refreshGrp(type) {
	if(type == HmTree.T_GRP_MANG) {
		$groupGrid.jqxTreeGrid('updateBoundData');
	}
	else if(type == HmTree.T_GRP_MANGFLOW) {
		$mfGrpGrid.jqxTreeGrid('updateBoundData');
	}
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});