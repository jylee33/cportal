var $grpTree, $svrGrid, $callDbGrid, $alarmDbGrid, $recAccountGrid;
var _svrGridData;

var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#dGrpTreeGrid');
		$svrGrid = $('#svrGrid'), $callDbGrid = $('#callDbGrid'), $alarmDbGrid = $('#alarmDbGrid'), $recAccountGrid = $('#recAccountGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});

		$svrGrid.bind('rowclick', function(event) {
			var curSvrGridIndex = event.args.rowindex;
			if (curSvrGridIndex === undefined || curSvrGridIndex == -1)
				return;
			_svrGridData = $svrGrid.jqxGrid('getrowdata', curSvrGridIndex);

			HmGrid.updateBoundData($callDbGrid, ctxPath + '/env/recMonitoringMgmt/getCallDbList.do');
			HmGrid.updateBoundData($alarmDbGrid, ctxPath + '/env/recMonitoringMgmt/getAlarmDbList.do');
			HmGrid.updateBoundData($recAccountGrid, ctxPath + '/env/recMonitoringMgmt/getRecAccountList.do');
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch_svr':
			this.searchSvr();
			break;
		}
	},

	/** init design */
	initDesign : function() {
		HmWindow.create($('#pwindow'), 100, 100);
		HmJqxSplitter.createTree($('#mainSplitter'));
		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%' }, { size: '50%' }], 'auto', '100%');

		// 서버목록 그리드
		HmGrid.create($svrGrid, { source : new $.jqx.dataAdapter({ datatype : 'json' }, { formatData : function(data) {
			var _grpNo = 0;
			var grpSelection = $grpTree.jqxTreeGrid('getSelection');
			if (!$.isEmpty(grpSelection) && grpSelection.length > 0)
				_grpNo = grpSelection[0].grpNo;
			$.extend(data, { grpNo : _grpNo, grpType : 'DEFAULT', itemKind : 'GROUP' });
			return data;
		} }), showtoolbar : true, rendertoolbar : function(toolbar) {
			HmGrid.titlerenderer(toolbar, '서버');
		},
			columns : [
				{ text : '그룹명', datafield : 'grpName', width : '33%' },
				{ text : '서버 이름', datafield : 'devName', width : '34%' },
				{ text : '서버 IP', datafield : 'devIp', width : '33%' }
		] }, CtxMenu.NONE);

		// CallDb 그리드
		HmGrid.create($callDbGrid, {
			source : new $.jqx.dataAdapter({ datatype : 'json' }, { formatData : function(data) {
				if (_svrGridData === undefined)
					return;
				$.extend(data, { mngNo : _svrGridData.mngNo });
				return data;
			} }),
			showtoolbar : true,
			sortable : false,
			pageable : false,
			rendertoolbar : function(toolbar) {
				HmGrid.titlerenderer(toolbar, 'Call DB 설정 정보');
			},
			columns : [
					{ text : 'DB 종류', datafield : 'dbKindStr' }, { text : '녹취 DB 종류', datafield : 'recDbTypeStr' }, { text : 'DB 접속 ID', datafield : 'dbId' },
					{ text : 'DB 접속 Password', datafield : 'dbPassAst' }, { text : 'DB 명', datafield : 'dbName' }, { text : '모니터링 여부', datafield : 'isUsingStr' }
			] }, CtxMenu.COMM);

		// AlarmDb 그리드
		HmGrid.create($alarmDbGrid, {
			source : new $.jqx.dataAdapter({ datatype : 'json' }, { formatData : function(data) {
				if (_svrGridData === undefined)
					return;
				$.extend(data, { mngNo : _svrGridData.mngNo });
				return data;
			} }),
			showtoolbar : true,
			sortable : false,
			pageable : false,
			rendertoolbar : function(toolbar) {
				HmGrid.titlerenderer(toolbar, '알람 DB 설정 정보');
			},
			columns : [
					{ text : 'DB 버전', datafield : 'dbVerStr' }, { text : 'DB 접속 ID', datafield : 'dbId' }, { text : 'DB 접속 Password', datafield : 'dbPassAst' },
					{ text : '서버 DB명', datafield : 'svrDbName' }, { text : '알람 DB명', datafield : 'alarmDbName' }, { text : '모니터링 여부', datafield : 'isUsingStr' }
			] }, CtxMenu.COMM);

		// RecAccount 그리드
		HmGrid.create($recAccountGrid, { source : new $.jqx.dataAdapter({ datatype : 'json' }, { formatData : function(data) {
			if (_svrGridData === undefined)
				return;
			$.extend(data, { mngNo : _svrGridData.mngNo });
			return data;
		} }), showtoolbar : true, sortable : false, pageable : false, rendertoolbar : function(toolbar) {
			HmGrid.titlerenderer(toolbar, '녹취 파일 서버 접속 정보');
		}, columns : [
				{ text : 'OS 종류', datafield : 'osTypeStr' }, { text : 'IP', datafield : 'targetIp' }, { text : 'PORT', datafield : 'port' },
				 { text : '서버 접속 ID', datafield : 'svrId' }, { text : '서버 접속 Password', datafield : 'svrPassAst' }
		] }, CtxMenu.COMM);

		$svrGrid.on('rowselect', function(event) {
			curSvrNo = event.args.row.svrNo;
			// Main.searchConfig();
		}).on('contextmenu', function(event) {
			return false;
		}).on('rowclick', function(event) {
			if (event.args.rightclick) {
				$svrGrid.jqxGrid('selectrow', event.args.rowindex);
				var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택해주세요.');
				if (rowIdxes.length < 1) {
					$('#ctxmenu_dev ul').children(':first').css('display', 'none');
				} else {
					$('#ctxmenu_dev ul').children(':first').css('display', 'block');
				}

				var scrollTop = $(window).scrollTop();
				var scrollLeft = $(window).scrollLeft();
				$('#ctxmenu_dev').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
				return false;
			}
		});
		$('#ctxmenu_dev').jqxMenu({ width : 180, autoOpenPopup : false, mode : 'popup', theme : jqxTheme }).on('itemclick', function(event) {
			Main.selectDevCtxmenu(event);
		});

		HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT, Main.searchSvr, null);
	},

	/** init data */
	initData : function() {

	},

	/** ContextMenu */
	selectDevCtxmenu : function(event) {
		switch ($(event.args)[0].id) {
		case 'cm_grpMoveBatchSet':
			try {
				var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택해주세요.');
				if (rowIdxes === false)
					return;
				var _mngNos = [];
				$.each(rowIdxes, function(idx, value) {
					_mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
				});
				var params = { mngNos : _mngNos.join(',') };
				HmWindow.create($('#pwindow'), 1200, 500);
				$.post(ctxPath + '/main/popup/env/pMonitoringSetting.do', params, function(result) {
					HmWindow.open($('#pwindow'), '모니터링 설정', result, 750, 382);
				});
			} catch (e) {
			}
			break;
		case 'cm_filter':
			// 필터
			$svrGrid.jqxGrid('beginupdate');
			if ($svrGrid.jqxGrid('filterable') === false) {
				$svrGrid.jqxGrid({ filterable : true });
			}
			$svrGrid.jqxGrid({ showfilterrow : !$svrGrid.jqxGrid('showfilterrow') });
			$svrGrid.jqxGrid('endupdate');
			break;
		case 'cm_filterReset':
			// 필터초기화
			$svrGrid.jqxGrid('clearfilters');
			break;
		case 'cm_colsMgr':
			// 컬럼관리
			$.post(ctxPath + '/main/popup/comm/pGridColsMgr.do', function(result) {
				HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $svrGrid);
			});
			break;
		}
	}, searchSvr : function() {
		$callDbGrid.jqxGrid('clear');
		$alarmDbGrid.jqxGrid('clear');
		$recAccountGrid.jqxGrid('clear');

		HmGrid.updateBoundData($svrGrid, ctxPath + '/env/recMonitoringMgmt/getSvrList.do');
	} };

function grpResult() {
	HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT);
}

function svrResult() {
	Main.searchSvr();
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});