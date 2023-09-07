var $grpTree, $vsvrGrid;
var editVsvrIds = [];

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $vsvrGrid = $('#vsvrGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchVsvr(); break;
			case 'btnAdd': this.addVsvr(); break;
			case 'btnSave': this.saveVsvr(); break;
			// case 'btnDevReg': this.regiVsvrToDev10(); break;
			case 'btnDel': this.delVsvr(); break;
			}
		},

		/** init design */
		initDesign: function() {
            HmJqxSplitter.createTree($('#mainSplitter'));
            HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind1: 'VSVR' });

			HmGrid.create($vsvrGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
                            datafields:[
                                { name:'mngNo', type:'number' },
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'svrName', type:'string' },
                                { name:'vendor', type:'string' },
                                { name:'model', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'user', type:'string' },
                                { name:'pwd', type:'string' },
                                { name:'port', type:'string' },
                                { name:'sslYn', type:'string' },
                            ],
                            updaterow: function(rowid, rowdata, commit) {
                                if(editVsvrIds.indexOf(rowid) == -1)
                                    editVsvrIds.push(rowid);
                                commit(true);
                            }
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							},
                            loadComplete: function(records) {
                                editVsvrIds = [];
                            }
						}
				),
                editable: true,
                editmode: 'selectedrow',
				columns:
				[
				 	// { text: '장비 등록여부', datafield: 'dev10RegFlagStr', width: '100', pinned: true },
				 	{ text: '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true },
				 	{ text: '그룹', datafield: 'grpName', width : 180, pinned: true, editable: false },
				 	{ text: '호스트명', datafield: 'devName', minwidth : 130, pinned: true, editable: false },
				 	{ text: '서버명', datafield: 'svrName', minwidth : 130 },
					{ text: '제조사', datafield: 'vendor', width: 200, filtertype: 'checkedlist' },
					{ text: '모델', datafield: 'model', width: 200, filtertype: 'checkedlist' },
					// { text: 'OS', datafield: 'os', width: 130 },
					// { text: 'OS 버전', datafield: 'osVer', width: 100 },
				 	// { text: 'GUID', datafield: 'guid', width : 270, editable: false },
					{ text: 'IP', datafield: 'devIp', width: 120 },
				 	// { text: '수집서버 URL', datafield: 'vsvrUrl', width : 200 },
				 	{ text: 'ID', datafield: 'user', width : 100 },

                    { text : '패스워드', datafield : 'pwd', width: 100, columntype: 'custom', enabletooltips: false,
                        createeditor: function(row, value, editor) {

                            var element = $('<input type="password" style="width: 100%; height: 100%;" autocomplete="off" />');
                            editor.append(element);
                            element.jqxPasswordInput();
                        },
                        initeditor: function(row, value, editor) {

                            var element = editor.find('input:first');
                            element.jqxPasswordInput('val', value);

                        },
                        geteditorvalue: function(row, value, editor) {
                            var element = editor.find('input:first');
                            return element.val();
                        },
                        cellsrenderer: function(row, columnfield, value) {
                            var hidVal = '';
                            for(var i = 0; i < value.length; i++) {
                                hidVal += '*';
                            }
                            return hidVal;
                        }
                    },
				 	{ text: 'PORT', datafield: 'port', width : 100 },
				 	{ text: 'SSL 여부', datafield: 'sslYn', width : 100, columntype: 'checkbox' }
				]
            }, CtxMenu.NONE);

            $vsvrGrid.on('contextmenu', function(event) {
                return false;
            })
                .on('rowclick', function(event) {
                    if(event.args.rightclick) {
                        $vsvrGrid.jqxGrid('selectrow', event.args.rowindex);
                        var rowIdxes = HmGrid.getRowIdxes($vsvrGrid, '장비를 선택해주세요.');

                        var scrollTop = $(window).scrollTop();
                        var scrollLeft = $(window).scrollLeft();
                        $('#ctxmenu_vsvr').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                            parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                        return false;
                    }
                });
            $('#ctxmenu_vsvr').jqxMenu({ width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme })
                .on('itemclick', function(event) {
                    Main.selectVsvrCtxmenu(event);
                });
		},
    /** ContextMenu */
    selectVsvrCtxmenu: function(event) {
        switch($(event.args)[0].id) {
            case 'cm_grpMoveBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($vsvrGrid, '서버를 선택해주세요.');
                    if(rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function(idx, value) {
                        _mngNos.push($vsvrGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(',')
                    };
                    HmWindow.create($('#pwindow'), 500, 500, 999);
                    $.post(ctxPath + '/main/popup/env/pDevGrpBatchSet.do',
                        params,
                        function(result) {
                            HmWindow.open($('#pwindow'), '장비 그룹이동', result, 500, 395);
                        }
                    );
                } catch(e) {}
                break;
            case 'cm_filter':
                $vsvrGrid.jqxGrid('beginupdate');
                if($vsvrGrid.jqxGrid('filterable') === false) {
                    $vsvrGrid.jqxGrid({ filterable: true });
                }
                setTimeout(function() {
                    $vsvrGrid.jqxGrid({showfilterrow: !$vsvrGrid.jqxGrid('showfilterrow')});
                }, 300);
                $vsvrGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $vsvrGrid.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function(result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $vsvrGrid);
                    }
                );
                break;
        }
    },
		/** init data */
		initData: function() {

		},

		/** 트리선택 */
		selectTree: function() {
			Main.searchVsvr();
		},

		/** 공통 파라미터 */
		getCommParams: function() {
            var params = Master.getDefGrpParams();
			return params;
		},

		/** 가상서버 조회 */
		searchVsvr: function() {
			HmGrid.updateBoundData($vsvrGrid, ctxPath + '/main/env/vsvrMgmt/getVsvrList.do');
		},

		/** 가상서버 추가 */
		addVsvr: function() {
		    var obj = HmTreeGrid.getSelectedItem($grpTree);
		    var param = {
		        grpNo: obj.grpNo
		    }
            $.get(ctxPath + '/main/popup/env/pVsvrAdd.do', param,  function(result) {
				HmWindow.open($('#pwindow'), '가상서버 등록', result, 600, 237, 'pwindow_init',obj );
			});
		},
		//
		// /** 가상서버 저장 */
		saveVsvr: function() {

			console.log(editVsvrIds)
            if(editVsvrIds.length == 0) {
                alert('변경된 데이터가 없습니다.');
                return;
            }
            var _list = [];
            $.each(editVsvrIds, function(idx, value) {
                var data = $vsvrGrid.jqxGrid('getrowdatabyid', value);

                _list.push({ mngNo: data.mngNo, userDevName: data.svrName, devIp: data.devIp, user: data.user, pwd: data.pwd, port: data.port, sslYn: data.sslYn });
            });

            Server.post('/main/env/vsvrMgmt/saveVsvr.do', {
                data: { list: _list },
                success: function(result) {
                    alert('저장되었습니다.');
                    editVsvrIds = [];
                }
            });

		},
		//
		// /** 가상서버를 DEV10으로 등록 */
		// regiVsvrToDev10: function() {
		// 	var rows = HmGrid.getRowDataList($vsvrGrid);
		// 	if(rows == null || rows.length == 0) {
		// 		alert('선택된 가상서버가 없습니다.');
		// 		return;
		// 	}
		//
		// 	var _unregList = [];
		// 	$.each(rows, function(idx, value) {
		// 		if(value.dev10RegFlag != 1) _unregList.push(value);
		// 	});
		// 	if(_unregList.length == 0) {
		// 		alert('선택된 가상서버는 이미 장비로 등록되어 있습니다.');
		// 		return;
		// 	}
		//
		// 	$.get(ctxPath + '/main/popup/env/pVsvrDevReg.do', function(result) {
		// 		HmWindow.open($('#pwindow'), '가상서버 장비 등록', result, 400, 450, 'pwindow_init', _unregList);
		// 	});
		// },
		//
		/** 가상서버 삭제 */
		delVsvr: function() {
			var rows = HmGrid.getRowDataList($vsvrGrid);
			if(rows == null || rows.length == 0) {
				alert('삭제할 가상서버를 선택해주세요.');
				return;
			}
			if(!confirm('[' + rows.length + '] 대의 가상서버를 삭제하시겠습니까?')) return;
			var _mngNos = [], _uids = [];
			$.each(rows, function(idx, value) {
				_mngNos.push(value.mngNo);
				_uids.push(value.uid);
			});
			Server.post('/main/env/vsvrMgmt/delVsvr.do', {
				data: { mngNos: _mngNos },
				success: function(result) {
					$vsvrGrid.jqxGrid('deleterow', _uids);
					alert(result);
                    refreshGrp();
                }
			});
		}
};
function refreshGrp() {
    HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT2, { devKind1 : 'VSVR' });
}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});