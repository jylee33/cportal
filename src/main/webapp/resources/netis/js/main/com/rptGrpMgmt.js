var $rptGrpGrid, currRptGrpNo;
var editIds_evt = [];

var Main = {
		/** variable */
		initVariable: function() {
			$rptGrpGrid = $('#rptGrpGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnAdd_grp': this.addGrp(); break;
			case 'btnEdit_grp': this.editGrp(); break;
			case 'btnDel_grp': this.delGrp(); break;
			case 'btnAdd_dev': case 'btnAdd_if': this.addTarget(); break;
			case 'btnDel_dev': case 'btnDel_if': this.delTarget(); break;
			case 'btnSave_evt': this.saveConfEvt(); break;
			}
		},

		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 350, min: 150, collapsible: false }, { size: '100%' }], 'auto', '100%');

			HmGrid.create($rptGrpGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							id: 'rptGrpNo',
							type: 'post',
							contenttype: 'application/json;charset=utf-8',
							url: ctxPath + '/main/com/rptGrpMgmt/getRptGrpList.do',
                            addrow: function(rowid, rowdata, commit) {
                                Server.post('/main/com/rptGrpMgmt/addRptGrp.do', {
                                    data: rowdata,
                                    success: function() {
                                        HmGrid.updateBoundData($rptGrpGrid);
                                        $('#pwindow').jqxWindow('close');
                                        alert('추가되었습니다.');
                                    }
                                });
                                commit(true);
                            }
						},
						{
							formatData: function(data) {
								return JSON.stringify(data);
							},
							loadComplete: function(records) {
					            $('#disRptGrpNm').text('그룹 [-]');
							}
						}
				),
				ready: function() {
					Main.search();
				},
				columns:
				[
				 	{ text : '그룹번호', datafield : 'rptGrpNo', hidden: true },
			 		{ text : '그룹명', datafield : 'rptGrpName' },
					{ text : '보고서 타입', datafield : 'disRptType', width: 100, cellsalign: 'center' },
                    { text : '표시 순서', datafield : 'sortIdx', width: 100, cellsalign: 'right' }
				]
			});
			$rptGrpGrid.on('rowselect', function(event) {
				currRptGrpNo = event.args.row.rptGrpNo;
                $('#disRptGrpNm').text('그룹 [ ' + event.args.row.rptGrpName+ ' ]');
				Main.search();
			});

			$('#mainTabs').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
				initTabContent: function(tab) {
					switch(tab) {
					case 0:
                        Main.initTab_dev();
						Main.search();
						break;
					case 1:
						Main.initTab_if();
						Main.search();
						break;
					case 2:
                        Main.initTab_evt();
						Main.search();
						break;
					}
				}
			}).on('selected', function(event) {
                Main.search();
            });

			$('#section').css('display', 'block');
		},

		/** init data */
		initData: function() {

		},

		initTab_dev: function() {
            HmGrid.create($('#confGrid_dev'), {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
						id: 'mngNo',
                        type: 'post',
                        contenttype: 'application/json;charset=utf-8',
                        url: ctxPath + '/main/com/rptGrpMgmt/getRptGrpDev10List.do'
                    },
                    {
                        formatData: function(data) {
                            data.rptGrpNo = currRptGrpNo;
                            return JSON.stringify(data);
                        }
                    }
                ),
                selectionmode : 'multiplerowsextended',
                columns:
				[
					{ text : '장비번호', datafield: 'mngNo', hidden: true },
					{ text : '그룹명', datafield: 'grpName', width: '20%' },
					{ text : '장비명', datafield: 'devName', width: '25%' },
					{ text : '대표IP', datafield: 'devIp', width: '10%' },
					{ text : '종류', datafield: 'devKind2', width: '15%', filtertype: 'checkedlist' },
					{ text : '모델', datafield: 'model', width: '15%', filtertype: 'checkedlist' },
					{ text : '제조사', datafield: 'vendor', width: '15%', filtertype: 'checkedlist' }
				]
            }, CtxMenu.COMM, 'conf_dev');
		},

		initTab_if: function() {
            HmGrid.create($('#confGrid_if'), {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
						id: 'uniqKey',
                        type: 'post',
                        contenttype: 'application/json;charset=utf-8',
                        url: ctxPath + '/main/com/rptGrpMgmt/getRptGrpDev20List.do'
                    },
                    {
                        formatData: function(data) {
                            data.rptGrpNo = currRptGrpNo;
                            return JSON.stringify(data);
                        }
                    }
                ),
                selectionmode : 'multiplerowsextended',
                columns:
                    [
                        { text : '장비번호', datafield: 'mngNo', hidden: true },
                        { text : '그룹명', datafield: 'grpName', width: '20%' },
                        { text : '장비명', datafield: 'devName', width: '20%' },
                        { text : '회선 Index', datafield: 'ifIdx', width: '10%', cellsalign: 'right' },
                        { text : '회선명', datafield: 'ifName', width: '30%' },
                        { text : '별칭', datafield: 'ifAlias', width: '20%' }
                    ]
            }, CtxMenu.COMM, 'conf_if');
		},

		initTab_evt: function() {
			HmGrid.create($('#confGrid_evt'), {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						type: 'post',
						contenttype: 'application/json;charset=utf-8',
						url: ctxPath + '/main/com/rptGrpMgmt/getRptGrpEvtList.do',
						updaterow: function(rowid, rowdata, commit) {
							if(editIds_evt.indexOf(rowid) === -1) {
                                editIds_evt.push(rowid);
							}
							commit(true);
						}
					},
					{
						formatData: function(data) {
							data.rptGrpNo = currRptGrpNo;
							return JSON.stringify(data);
						},
						loadComplete: function(record) {
                            editIds_evt.length = 0;
						}
					}
				),
				editable: true,
				selectionmode : 'multiplerowsextended',
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns:
					[
						{ text : '분류', datafield: 'sysCode', width: '20%', editable: false },
						{ text : '이벤트코드', datafield: 'code', width: '20%', editable: false },
						{ text : '이벤트명', datafield: 'evtName', width: '50%', editable: false },
						{ text : '사용', datafield: 'isUse', columntype: 'checkbox', width: '10%' }
					]
			}, CtxMenu.COMM, 'conf_evt');
		},

		/** 그룹 관리 */
		addGrp: function() {
			$.get(ctxPath + '/main/popup/com/pRptGrpAdd.do', function(result) {
				 HmWindow.open($('#pwindow'), '보고서 그룹 등록', result, 300, 175, 'pwindow_init', {});
			});
		},

		editGrp: function() {
			var rowdata = HmGrid.getRowData($rptGrpGrid);
			if(rowdata == null) {
				alert('보고서 그룹을 선택하세요.');
				return;
			}

			$.post(ctxPath + '/main/popup/com/pRptGrpEdit.do',
				rowdata,
				function(result) {
					HmWindow.open($('#pwindow'), '보고서 그룹 수정', result, 300, 175, 'pwindow_init', rowdata);
				}
			);
		},

		delGrp: function() {
            var rowdata = HmGrid.getRowData($rptGrpGrid);
            if(rowdata == null) {
                alert('보고서 그룹을 선택하세요.');
                return;
            }
            // 최상위 보고서그룹은 삭제 불가
            if(rowdata.rptGrpNo == 1) {
            	alert('[{0}] 그룹은 삭제할 수 없습니다.'.substitute(rowdata.rptGrpName));
            	return;
			}
			if(!confirm('[{0}] 그룹을 삭제하시겠습니까?'.substitute(rowdata.rptGrpName))) return;

			Server.post('/main/com/rptGrpMgmt/delRptGrp.do', {
				data: {rptGrpNo: rowdata.rptGrpNo},
				success: function(result) {
					$rptGrpGrid.jqxGrid('deleterow', rowdata.uid);
					alert('삭제되었습니다.');
				}
			});
		},

		searchDev: function() {
			var tabIdx = $('#mainTabs').val();
			if(tabIdx == 0) {
                HmGrid.updateBoundData($('#devGrid_dev'), ctxPath + '/main/com/rptGrpMgmt/getUnregDevList.do');
			}

		},
		/** 조회 */
		search: function() {
			switch($('#mainTabs').val()) {
			case 0:
                HmGrid.updateBoundData($('#confGrid_dev'));
				break;
			case 1:
                HmGrid.updateBoundData($('#confGrid_if'));
				break;
			case 2:
                HmGrid.updateBoundData($('#confGrid_evt'));
				break;
			}
		},

		/* 대상회선 */
		addTarget: function() {
            var rowdata = HmGrid.getRowData($rptGrpGrid);
            if(rowdata == null) {
                alert('보고서 그룹을 선택하세요.');
                return;
            }

			var tabIdx = $('#mainTabs').val();
			var dataType = 'DEV';
			if(tabIdx == 0) {
				dataType = 'DEV';
			}
			else if(tabIdx == 1) {
				dataType = 'IF';
			}
			else {
				return;
			}

			var params = {
                dataType: dataType,
                callbackFn: 'addTargetResult',
                addedIds: []
            };
            HmUtil.createPopup(ctxPath + '/main/popup/nms/pTargetAdd.do', $('#hForm'), 'pTargetAdd', 1000, 600, params);
		},

		delTarget: function() {
            var rowdata = HmGrid.getRowData($rptGrpGrid);
            if(rowdata == null) {
                alert('보고서 그룹을 선택하세요.');
                return;
            }
            var tabIdx = $('#mainTabs').val();
            if(tabIdx == 0) {
                var delList = HmGrid.getRowDataList($('#confGrid_dev'));
                if(delList == null) {
                    alert('삭제할 장비를 선택하세요.');
                    return;
                }

                if(!confirm('선택된 장비를 삭제하시겠습니까?')) return;

                Server.post('/main/com/rptGrpMgmt/delRptGrpDev10.do', {
                    data: {rptGrpNo: currRptGrpNo, list: delList},
                    success: function(result) {
                        $('#confGrid_dev').jqxGrid('clearSelection');
                        $('#confGrid_dev').jqxGrid('updateBoundData');
                        alert('삭제되었습니다.');
                    }
                });
            }
            else if(tabIdx == 1) {
            	var delList = HmGrid.getRowDataList($('#confGrid_if'));
            	if(delList == null) {
            		alert('삭제할 회선을 선택하세요.');
            		return;
				}

				if(!confirm('선택된 회선을 삭제하시겠습니까?')) return;

                Server.post('/main/com/rptGrpMgmt/delRptGrpDev20.do', {
                    data: {rptGrpNo: currRptGrpNo, list: delList},
                    success: function(result) {
                        $('#confGrid_if').jqxGrid('clearSelection');
                        $('#confGrid_if').jqxGrid('updateBoundData');
                        alert('삭제되었습니다.');
                    }
                });
			}
		},

		saveConfEvt: function() {
			HmGrid.endRowEdit($('#confGrid_evt'));
        	if(editIds_evt.length == 0) {
        		alert('변경된 데이터가 없습니다.');
        		return;
			}

			var saveData = [];
			$.each(editIds_evt, function(i, v) {
				var tmp = $('#confGrid_evt').jqxGrid('getrowdatabyid', v);
				saveData.push(tmp);
			});

            Server.post('/main/com/rptGrpMgmt/saveRptGrpEvt.do', {
                data: {rptGrpNo: currRptGrpNo, list: saveData},
                success: function(result) {
                    $('#confGrid_evt').jqxGrid('updateBoundData');
                    alert('저장되었습니다.');
                }
            });
		}
};

function addGrpResult(addData) {
	$rptGrpGrid.jqxGrid('addrow', null, addData);
}
function editGrpResult(data) {
	switch(data.rptType){
		case 'ALL':
			data.disRptType = '전체';
			 break;
		case 'DEV':
			data.disRptType = '장비';
			 break;
		case 'IF':
			data.disRptType = '회선';
			 break;
	}
	$rptGrpGrid.jqxGrid('updaterow', data.rptGrpNo, data);
}

function addTargetResult(dataType, list) {
	if(dataType == 'DEV') {
        var addList = [];
        $.each(list, function(idx, item) {
        	addList.push({mngNo: item.mngNo});
            // addList.push({mngNo: item.mngNo,
            //     grpName: item.grpName, devName: item.disDevName, devIp: item.devIp, devKind2: item.devKind2,
            //     model: item.model, vendor: item.vendor});
        });
        Server.post('/main/com/rptGrpMgmt/addRptGrpDev10.do', {
            data: {rptGrpNo: currRptGrpNo, list: addList},
            success: function(result) {
                $('#confGrid_dev').jqxGrid('updateBoundData');
                alert('저장되었습니다.');
            }
        });
        // $('#confGrid_dev').jqxGrid('addrow', null, addList);
    }
    else if(dataType == 'IF') {
        var addList = [];
        $.each(list, function(idx, item) {
        	addList.push({mngNo: item.mngNo, ifIdx: item.ifIdx});
            // addList.push({mngNo: item.mngNo, ifIdx: item.ifIdx,
            //     grpName: item.grpName, devName: item.disDevName, ifName: item.ifName, ifAlias: item.ifAlias,
            //     lineWidth: item.lineWidth });
        });

        Server.post('/main/com/rptGrpMgmt/addRptGrpDev20.do', {
            data: {rptGrpNo: currRptGrpNo, list: addList},
            success: function(result) {
                $('#confGrid_if').jqxGrid('updateBoundData');
            	alert('저장되었습니다.');
            }
        });
        // $('#confGrid_if').jqxGrid('addrow', null, addList);
    }
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});