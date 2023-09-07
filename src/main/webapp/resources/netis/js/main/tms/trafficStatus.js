var TAB = {
		MANG: 0,
		SUB_MANG: 1,
		ALL_USER: 2,
		IN_USER: 3,
		OUT_USER: 4,
		MATRIX: 5,
		MATRIX_PORT: 6,
		APP: 7,
		BIZ: 8,
		GRP: 9,
		SUB_GRP: 10,
		COUNTRY: 11,
		SVR: 12,
		ISP: 13,
		AS: 14,
		IP: 15,
		SVC: 16
};

var $mGrpTree, $bGrpTree, $dGrpTree, $mfGrpTree;
var $period;
var $mangGrid, $subMangGrid, $bizGrid, $grpGrid, $subGrpGrid, $allUserGrid, $inUserGrid, $outUserGrid;
var $ipGrid, $svcGrid, $appGrid, $ispGrid, $asGrid, $svrGrid, $matrixGrid, $matrixPortGrid;
var $countryGrid;
var mangParams, subMangParams, allUserParams, inUserParams, outUserParams, matrixParams, matrixPortParams, 
	grpParams, subGrpParams, appParams, bizParams, svrParams, ispParams, asParams, ipParams, svcParams,
	countryParams;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
		$mGrpTree = $('#mangTree'), $bGrpTree = $('#bizTree'), $dGrpTree = $('#grpTree'), $mfGrpTree = $('#mangFlowTree');
		$period = $('#cbPeriod');
		$mangGrid = $('#mangGrid'), $subMangGrid = $('#subMangGrid'), $bizGrid = $('#bizGrid'), $grpGrid = $('#grpGrid'), $subGrpGrid = $('#subGrpGrid');
		$allUserGrid= $('#allUserGrid'), $inUserGrid = $('#inUserGrid'), $outUserGrid = $('#outUserGrid'), $ipGrid = $('#ipGrid');
		$svcGrid = $('#svcGrid'), $appGrid = $('#appGrid'), $ispGrid = $('#ispGrid'), $asGrid = $('#asGrid'), $svrGrid = $('#svrGrid');
		$matrixGrid = $('#matrixGrid'), $matrixPortGrid = $('#matrixPortGrid');
		$countryGrid = $('#countryGrid');
		this.initCondition();
	},

	initCondition: function() {
		// 기간
		HmBoxCondition.createPeriod('');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': this.search(); break;
		case 'btnExcel': this.exportExcel(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmJqxSplitter.createTree($('#mainSplitter'));
		$('#grpTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function(tab) {
				switch(tab) {
				case 0: HmTreeGrid.create($mGrpTree, HmTree.T_GRP_MANG2, Main.selectTree, {isRootSelect: false}); break;
				case 1: HmTreeGrid.create($bGrpTree, HmTree.T_GRP_SERVICE, Main.selectTree); break;
				case 2: HmTreeGrid.create($dGrpTree, HmTree.T_GRP_DEF_ALL, Main.selectTree); break;
				case 3: HmTreeGrid.create($mfGrpTree, HmTree.T_GRP_MANGFLOW2, Main.selectTree); break;
				}
			}
		})
		.on('selected', function(event) {
			Main.chgGrpTab(event.args.item);
		})
		.on('resize', function(event) {
			event.stopPropagation();
		});
//		$('#date1').add($('#date2')).jqxDateTimeInput({ width: 110, height: 21, formatString: 'yyyy-MM-dd', theme: jqxTheme });
//		// 시간설정 > cm_code10테이블에서 tms성능수집 관련 코드값을 조회하여 수집주기를 계산.. 시간&분 콤보를 생성
//		Server.get('/main/tms/trafficStatus/getTimeCycle.do', {
//			success: function(result) {
//				var timeList = [];
//				var tmpDate = new Date(2000, 1, 1);
//				timeList.push({ label: $.format.date(tmpDate, 'HH:mm'), value: $.format.date(tmpDate, 'HHmm' )});
//				while(true) {
//					tmpDate.setTime(tmpDate.getTime() + (result * 60 * 1000));
//					if(tmpDate.getDate() > 1) break;
//					timeList.push({ label: $.format.date(tmpDate, 'HH:mm'), value: $.format.date(tmpDate, 'HHmm' )});
//				}
//				$('#time1, #time2').jqxDropDownList({ width: 60, height: 21, source: timeList, displayMember: 'label', valueMember: 'value', theme: jqxTheme });
//				var curDate = new Date();
//				var curTime = (curDate.getHours() * 60 * 60) + (curDate.getMinutes() * 60);
//				$('#time2').jqxDropDownList('selectIndex', Math.floor(curTime / (result * 60)));
//				curDate.setTime(curDate.getTime() - (6 * 60 * 60 * 1000));
//				curTime = (curDate.getHours() * 60 * 60) + (curDate.getMinutes() * 60);
//				$('#time1').jqxDropDownList('selectIndex', Math.floor(curTime / (result * 60)));
//			}
//		});

		$('#dataTypeCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
			source: [
			         { label: 'BYTES', value: 'BYTES' },
			         { label: 'PACKET', value: 'PACKET' },
			         { label: 'BPS', value: 'BPS' },
			         { label: 'PPS', value: 'PPS' },
			         { label: 'HOST수', value: 'HOSTCNT' }
			         ],
	        displayMember: 'label', valueMember: 'value', selectedIndex: 0
		});
		
		$('#mainTabs').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function(tab) {
				switch(tab) {
				case TAB.MANG: Main.createGrid($mangGrid); break;
				case TAB.SUB_MANG: Main.createGrid($subMangGrid); break;
				case TAB.ALL_USER: Main.createGrid($allUserGrid); break;
				case TAB.IN_USER: Main.createGrid($inUserGrid); break;
				case TAB.OUT_USER: Main.createGrid($outUserGrid); break;
				case TAB.IP: Main.createGrid($ipGrid); break;
				case TAB.SVC: Main.createGrid($svcGrid); break;
				case TAB.APP: Main.createGrid($appGrid); break;
				case TAB.BIZ: Main.createGrid($bizGrid); break;
				case TAB.ISP: Main.createGrid($ispGrid); break;
				case TAB.AS: Main.createGrid($asGrid); break;
				case TAB.SVR: Main.createGrid($svrGrid); break;
				case TAB.MATRIX: Main.createGrid($matrixGrid); break;
				case TAB.MATRIX_PORT: Main.createGrid($matrixPortGrid); break;
				case TAB.GRP: Main.createGrid($grpGrid); break;
				case TAB.SUB_GRP: Main.createGrid($subGrpGrid); break;
				case TAB.COUNTRY: Main.createGrid($countryGrid); break;
				}
			}
		})
		.on('resize', function(event) {
			event.stopPropagation();
		});;
	},

	/** init data */
	initData : function() {
		Main.chgGrpTab(0);
	},

	/** 그리드 생성 */
	createGrid: function($grid) {
		var _columns = [];
		switch($grid.attr('id')) {
		case 'mangGrid': 
			_columns.push({ text: '망', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'subMangGrid': 
			_columns.push({ text: '하위망', datafield: 'grpName', minwidth: 130, pinned: true });
			_columns.push({ text: '회선별칭', datafield: 'ifAlias', minwidth: 130, pinned: true });
			break;
		case 'bizGrid':
			_columns.push({ text: '업무', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'grpGrid':
			_columns.push({ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'subGrpGrid':
			_columns.push({ text: '하위그룹', datafield: 'grpName', minwidth: 130, pinned: true });
			break;			
		case 'allUserGrid':
		case 'inUserGrid':
		case 'outUserGrid':
			_columns.push({ text: 'IP', datafield: 'hostIp', minwidth: 130, pinned: true });
			break;
		case 'appGrid':
			_columns.push({ text: 'APP', datafield: 'name', minwidth: 130, pinned: true }); 
			break;
		case 'ispGrid':
			_columns.push({ text: 'ISP명', datafield: 'ispName', minwidth: 130, pinned: true }); 
			break;
		case 'asGrid':
			_columns.push({ text: 'SRC AS NO', datafield: 'srcAs', minwidth: 130, pinned: true });
			_columns.push({ text: 'SRC NAME', datafield: 'srcName', minwidth: 130, pinned: true });
			_columns.push({ text: 'DST AS NO', datafield: 'dstAs', minwidth: 130, pinned: true });
			_columns.push({ text: 'DST NAME', datafield: 'dstName', minwidth: 130, pinned: true });
			break;
		case 'svrGrid':
			_columns.push({ text: '서버명', datafield: 'name', minwidth: 130, pinned: true });
			_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true });
			break;
		case 'matrixGrid':
			_columns.push({ text: '출발지IP', datafield: 'srcIp', minwidth: 130, pinned: true });
			_columns.push({ text: '목적지IP', datafield: 'dstIp', minwidth: 130, pinned: true });
			break;
		case 'matrixPortGrid':
			_columns.push({ text: '출발지IP', datafield: 'srcIp', minwidth: 130, pinned: true });
			_columns.push({ text: '출발지PORT', datafield: 'srcPort', minwidth: 130, pinned: true });
			_columns.push({ text: '목적지IP', datafield: 'dstIp', minwidth: 130, pinned: true });
			_columns.push({ text: '목적지PORT', datafield: 'dstPort', minwidth: 130, pinned: true });
			_columns.push({ text: 'PROTOCOL', datafield: 'protocolNm', minwidth: 130, pinned: true });
			break;
		case 'ipGrid':
			_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true });
			break;
		case 'svcGrid':
			_columns.push({ text: '서비스', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'countryGrid':
			_columns.push({ text: '국가명', datafield: 'nameLong', minwidth: 130, pinned: true });
			break;
		}
		
		var commColumns = [
				{ text: 'BYTES(%)', datafield: 'bytesPer', cellsalign: 'right', width: 100 },
				{ text: 'PACKET(%)', datafield: 'pktPer', cellsalign: 'right', width: 100 },
				{ text: 'HOST수(%)', datafield: 'hostPer', cellsalign: 'right', width: 100 },
				{ text: 'Bytes', datafield: 'bytes', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1024renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1024sumrenderer
				},
				{ text: 'Packet', datafield: 'pkt', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'BPS', datafield: 'bps', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'PPS', datafield: 'pps', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'Host수', datafield: 'hostCnt', cellsalign: 'right', width: 100,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_sumrenderer
				},
				{ text: 'P64', datafield: 'p64', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer	
				},
				{ text: 'P128', datafield: 'p128', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P256', datafield: 'p256', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P512', datafield: 'p512', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P1024', datafield: 'p1024', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P1518', datafield: 'p1518', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'POVER', datafield: 'pover', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'URG', datafield: 'urg', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'ACK', datafield: 'ack', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'PSH', datafield: 'psh', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'RST', datafield: 'rst', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'SYN', datafield: 'syn', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'FIN', datafield: 'fin', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				}
           ];
		
		var source = {
				datatype: 'json',
				root: 'rows',
				beforeprocessing: function(data) {
					if(data != null) source.totalrecords = data.resultData.totalRows;
				},
				sort: function() {
					$grid.jqxGrid('updatebounddata', 'sort');
				},
				filter: function() {
					$grid.jqxGrid('updatebounddata', 'filter');
				}
		};
		var adapter = new $.jqx.dataAdapter(
				source,
				{
					formatData: function(data) {
						$.extend(data, Main.getCommParams());
						switch($('#grpTab').val()) {
						case TAB.MANG: mangParams = data; break;
						case TAB.SUB_MANG: subMangParams = data; break;
						case TAB.ALL_USER: allUserParams = data; break;
						case TAB.IN_USER: inUserParams = data; break;
						case TAB.OUT_USER: outUserParams = data; break;
						case TAB.IP: ipParams = data; break;
						case TAB.SVC: svcParams = data; break;
						case TAB.APP: appParams = data; break;
						case TAB.BIZ: bizParams = data; break;
						case TAB.ISP: ispParams = data; break;
						case TAB.AS: asParams = data; break;
						case TAB.SVR: svrParams = data; break;
						case TAB.MATRIX: matrixParams = data; break;
						case TAB.MATRIX_PORT: matrixPortParams = data; break;
						case TAB.GRP: grpParams = data; break;
						case TAB.SUB_GRP: subGrpParams = data; break;
						case TAB.COUNTRY: countryParams = data; break;
						}
						return data;
					}
				}
		);
		
		HmGrid.create($grid, {
			source: adapter,
			virtualmode: true,
			rendergridrows: function(params) {
				return adapter.records;
			},
			showstatusbar: true,
            statusbarheight: 25,
			showaggregates: true,
			columns: _columns.concat(commColumns)						
		});

	},
	
	/** 공통 파라미터 */
	getCommParams: function() {
		var _grpNo = -1, _grpType = 'MANG', _isleaf = false, _itemKind = 'GROUP', _ifInout = '', _exportType = '';
		switch($('#grpTab').val()) {
		case 0: 
			_grpType = 'MANG';
			var treeItem = HmTreeGrid.getSelectedItem($mGrpTree);
			if(treeItem !== null) {
				_itemKind = treeItem.devKind2;
				if(_itemKind == 'GROUP') {
					_grpNo = treeItem.grpNo;
				}
				else {
					var tmp = treeItem.grpNo.split('_');
					_grpNo = tmp[1];
					_ifInout = tmp[2] == 'I'? 'IN' : 'OUT';
				}
			}
			break;
		case 1: 
			_grpType = 'BIZ';
			var treeItem = HmTreeGrid.getSelectedItem($bGrpTree);
			if(treeItem !== null) {
				_grpNo = treeItem.grpNo;
			}
			break;
		case 2: 
			_grpType = 'GRP';
			var treeItem = HmTreeGrid.getSelectedItem($dGrpTree);
			if(treeItem !== null) {
				_itemKind = treeItem.devKind2;
				_grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
				_isleaf = !treeItem.hasItems;
			}
			break;
		case 3: 
			_grpType = 'MANGFLOW';
			var treeItem = HmTreeGrid.getSelectedItem($mfGrpTree);
			if(treeItem !== null) {
				_itemKind = treeItem.devKind2;
				_grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
			}
			break;
		}
		
		switch($('#mainTabs').val()) {
		case TAB.MANG: _exportType = 'mang'; break;
		case TAB.SUB_MANG: _exportType = 'subMang'; break;
		case TAB.GRP: _exportType = 'grp'; break;
		case TAB.SUB_GRP: _exportType = 'subGrp'; break;
		case TAB.ALL_USER: _exportType = 'allUser'; break;
		case TAB.IN_USER: _exportType = 'inUser'; break;
		case TAB.OUT_USER: _exportType = 'outUser'; break;
		case TAB.MATRIX: _exportType = 'matrix'; break;
		case TAB.MATRIX_PORT: _exportType = 'matrixPort'; break;
		case TAB.APP: _exportType = 'app'; break;
		case TAB.BIZ: _exportType = 'biz'; break;
		case TAB.SVR: _exportType = 'svr'; break;
		case TAB.ISP: _exportType = 'isp'; break;
		case TAB.AS: _exportType = 'as'; break;
		case TAB.IP: _exportType = 'ip'; break;
		case TAB.SVC: _exportType = 'svc'; break;
		case TAB.COUNTRY: _exportType = 'country'; break; 
		}
		var params = {								
			grpType: _grpType,
			grpNo: _grpNo,
			itemKind: _itemKind,
			ifInout: _ifInout,
			isleaf: _isleaf,
			exportType: _exportType
		};
		$.extend(params, HmBoxCondition.getPeriodParams());
		// 사용자 조회시 tabNm 추가
		switch($('#mainTabs').val()) {
		case TAB.ALL_USER: params.tabNm = 'ALL'; break;
		case TAB.IN_USER: params.tabNm = 'IN'; break;
		case TAB.OUT_USER: params.tabNm = 'OUT'; break;
		}
		return params;
	},
	
	/** 검색조건: 그룹탭 선택시 
	 * 메인탭 show/hide
	 * */
	chgGrpTab: function(tab) {
		var showTab = null;
		switch(tab) {
		case 0: showTab = [ TAB.ALL_USER, TAB.IN_USER, TAB.OUT_USER, TAB.MATRIX, TAB.MATRIX_PORT, TAB.APP, TAB.BIZ, TAB.GRP, TAB.COUNTRY, TAB.AS ]; break;
		case 1: showTab = [ TAB.MANG, TAB.GRP ]; break;
		case 2: showTab = [ TAB.MANG, TAB.SUB_GRP, TAB.APP ]; break;
		case 3: showTab = [ TAB.MATRIX, TAB.MATRIX_PORT, TAB.APP, TAB.IP, TAB.SVC ]; break;
		}
		$('#mainTabs .jqx-tabs-title').css('display', 'none');
		$.each(showTab, function(idx, value) {
			$('#mainTabs .jqx-tabs-title:eq(' + value + ')').css('display', 'block');
		});
		$('#mainTabs').jqxTabs('select', showTab[0]);
	},
	
	/** 검색조건: 그룹탭 > 트리아이템 선택시 */
	selectTree: function() {
		Main.search();
	},
	
	/** 조회 */
	search : function() {
		// Master.refreshCbPeriod($period);
		var tabIdx = $('#mainTabs').jqxTabs('val');
		var url = null, $grid = null;
		switch(tabIdx) {
		case TAB.MANG:
			url = ctxPath + '/main/tms/trafficStatus/getMangTrafficStatusList.do';
			$grid = $mangGrid;
			break;
		case TAB.SUB_MANG:
			url = ctxPath + '/main/tms/trafficStatus/getSubMangTrafficStatusList.do';
			$grid = $subMangGrid;
			break;
		case TAB.BIZ:
			url = ctxPath + '/main/tms/trafficStatus/getBizTrafficStatusList.do';
			$grid = $bizGrid;
			break;
		case TAB.GRP:
			url = ctxPath + '/main/tms/trafficStatus/getGrpTrafficStatusList.do';
			$grid = $grpGrid;
			break;
		case TAB.SUB_GRP:
			url = ctxPath + '/main/tms/trafficStatus/getSubGrpTrafficStatusList.do';
			$grid = $subGrpGrid;
			break;
		case TAB.ALL_USER:
			url = ctxPath + '/main/tms/trafficStatus/getUserTrafficStatusList.do';
			$grid = $allUserGrid;
			break;
		case TAB.IN_USER:
			url = ctxPath + '/main/tms/trafficStatus/getUserTrafficStatusList.do';
			$grid = $inUserGrid;
			break;
		case TAB.OUT_USER:
			url = ctxPath + '/main/tms/trafficStatus/getUserTrafficStatusList.do';
			$grid = $outUserGrid;
			break;
		case TAB.IP:
			url = ctxPath + '/main/tms/trafficStatus/getIpTrafficStatusList.do';
			$grid = $ipGrid;
			break;
		case TAB.SVC:
			url = ctxPath + '/main/tms/trafficStatus/getSvcTrafficStatusList.do';
			$grid = $svcGrid;
			break;
		case TAB.APP:
			url = ctxPath + '/main/tms/trafficStatus/getAppTrafficStatusList.do';
			$grid = $appGrid;
			break;
		case TAB.ISP:
			url = ctxPath + '/main/tms/trafficStatus/getIspTrafficStatusList.do';
			$grid = $ispGrid;
			break;
		case TAB.AS:
			url = ctxPath + '/main/tms/trafficStatus/getAsTrafficStatusList.do';
			$grid = $asGrid;
			break;
		case TAB.SVR:
			url = ctxPath + '/main/tms/trafficStatus/getSvrTrafficStatusList.do';
			$grid = $svrGrid;
			break;
		case TAB.MATRIX:
			url = ctxPath + '/main/tms/trafficStatus/getMatrixTrafficStatusList.do';
			$grid = $matrixGrid;
			break;
		case TAB.MATRIX_PORT:
			url = ctxPath + '/main/tms/trafficStatus/getMatrixPortTrafficStatusList.do';
			$grid = $matrixPortGrid;
			break;
		case TAB.COUNTRY:
			url = ctxPath + '/main/tms/trafficStatus/getCountryTrafficStatusList.do';
			$grid = $countryGrid;
			break;
		}
		if($grid !== null && url !== null)
			HmGrid.updateBoundData($grid, url);
	},
	
	exportExcel: function() {
		var params = null;
		switch($('#grpTab').val()) {
		case TAB.MANG: params = mangParams; break;
		case TAB.SUB_MANG: params = subMangParams; break;
		case TAB.ALL_USER: params = allUserParams; break;
		case TAB.IN_USER: params = inUserParams; break;
		case TAB.OUT_USER: params = outUserParams; break;
		case TAB.IP: params = ipParams; break;
		case TAB.SVC: params = svcParams; break;
		case TAB.APP: params = appParams; break;
		case TAB.BIZ: params = bizParams; break;
		case TAB.ISP: params = ispParams; break;
		case TAB.AS: params = asParams; break;
		case TAB.SVR: params = svrParams; break;
		case TAB.MATRIX: params = matrixParams; break;
		case TAB.MATRIX_PORT: params = matrixPortParams; break;
		case TAB.GRP: params = grpParams; break;
		case TAB.SUB_GRP: params = subGrpParams; break;
		case TAB.COUNTRY: params = countryParams; break;
		}
		HmUtil.exportExcel(ctxPath + '/main/tms/trafficStatus/export.do', params);
	}

};
