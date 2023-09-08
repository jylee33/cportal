var $grpTree, $svcGrid;

var Main = {
	/** variable */
	initVariable: function() {
		$grpTree = $('#dGrpTreeGrid'), $svcGrid = $('#svcGrid');
		this.initCondition();
	},

	initCondition: function() {
		HmBoxCondition.createRadio($('#sStatus'), [{label: '전체', value: -1}, {label: '정상', value: 1}, {label: '장애', value: 0}]);
		HmBoxCondition.createRadioInput($('#sSrchType'), [{label: '서비스명', value: 'S_NAME'}, {label: 'IP/PORT', value: 'S_INFO'}]);
	},

	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

	/** keyup event handler */
	keyupEventControl: function(event) {
		if(event.keyCode == 13) {
			console.log("엔터누름");
			Main.search();
		}
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
		case "btnSearch": this.search(); break;
		case "btnConf": this.config(); break;
		case "btnExcel": this.exportExcel(); break;
		}
	},

	/** init design */
	initDesign: function() {
		HmJqxSplitter.createTree($('#mainSplitter'));
		HmTreeGrid.create($grpTree, HmTree.T_GRP_SVC, Main.search, {}, ['grpName']);

		HmGrid.create($svcGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						datafields:[ // 필터위해 추가
							{ name:'grpName', type:'string' },
							{ name:'svcName', type:'string' },
							{ name:'ip', type:'string' },
							{ name:'port', type:'string' },
							{ name:'useFlag', type:'string' },
							{ name:'status', type:'string' },
							{ name:'respMin', type:'string' },
							{ name:'respMax', type:'string' },
							{ name:'respAvg', type:'string' },
							{ name:'successCnt', type:'number' },
							{ name:'iterateCnt', type:'number' },
							{ name:'respPer', type:'number' },
							{ name:'lastUpd', type:'string' },
							{ name:'svcType', type:'string' },
							{ name:'svcNo', type:'int' }
						]
					},
					{
						formatData : function(data) {
							var _grpNo = 0;
							var treeItem = HmTreeGrid.getSelectedItem($grpTree);
							if(treeItem != null) _grpNo = treeItem.grpNo;
							$.extend(data, {
								grpNo: _grpNo,
								sStatus: HmBoxCondition.val('sStatus')
							},Main.getSrchParams());
							return data;
						}
					}
			),
			columns:
			[
				{ text : '그룹명', datafield : 'grpName', width: 130 },
				{ text : '서비스명', datafield : 'svcName', minwidth: 150  },
				{ text : 'IP', datafield : 'ip', width : 120 },
				{ text : 'PORT', datafield : 'port', width : 80 },
				{ text : '사용여부', datafield : 'useFlag', width: 70, cellsrenderer : HmGrid.setUnsetRenderer, cellsalign:'center' },
				{ text : '상태', datafield : 'status', width : 70, filtertype: 'checkedlist', cellsrenderer : HmGrid.healthChkrenderer, cellsalign: 'center',
					  createfilterwidget: function (column, columnElement, widget) {
						  widget.jqxDropDownList({
							  renderer: HmGrid.healthChkFilterRenderer
						  });
					  }
				},
				{ text : '최소(ms)', columngroup: 'resptime', datafield : 'respMin',  width: 80, cellsalign: 'right' },
				{ text : '최대(ms)', columngroup: 'resptime', datafield : 'respMax',  width: 80, cellsalign: 'right' },
				{ text : '평균(ms)', columngroup: 'resptime', datafield : 'respAvg',  width: 80, cellsalign: 'right' },
				{ text : '응답횟수', datafield : 'successCnt', width: 80, cellsalign: 'right' },
				{ text : '시도횟수', datafield : 'iterateCnt', width: 80, cellsalign: 'right' },
				{ text : '응답률(%)', datafield : 'respPer', width: 100, cellsrenderer: HmGrid.progressbarrenderer },
				{ text : '최종수집일시', datafield : 'lastUpd', width: 130, cellsalign: 'center' }
			],
			columngroups:
			[
				{ text: '응답시간', align: 'center', name: 'resptime' }
			]
		}, CtxMenu.RESTIME);

	},

	/** init data */
	initData: function() {

	},

	/** 그룹트리 선택이벤트 */
	selectTree: function() {
		Main.search();
	},

	/** 조회 */
	search: function() {
		HmGrid.updateBoundData($svcGrid, ctxPath + '/main/nms/healthChk/getHealthChkList.do');
	},

	/** 설정 */
	config: function() {
		HmUtil.createPopup('/main/popup/nms/pHealthChkConf.do', $('#hForm'), 'pHealthChk', 1400, 700);
	},

	/** TCP 포트 감시 그룹 추가 또는 삭제 된 경우 그룹 Tree 재 조회 */
	grpTreeUpdate : function() {
		HmTreeGrid.updateData($grpTree, HmTree.T_GRP_SVC, {}, true);
	},

	/** export Excel */
	exportExcel: function() {
		HmUtil.exportGrid($svcGrid, '헬스체크', false);
	},

	getSrchParams: function(radioNm) {
		if(radioNm === undefined) {
			radioNm = 'sSrchType';
		}
		var _stype = $("input:radio[name={0}]:checked".substitute(radioNm)).val(),
			_stext = $('#{0}_input'.substitute(radioNm)).val();
		return {
			sName: _stype == 'S_NAME'? _stext : null,
			sInfo: _stype == 'S_INFO'? _stext : null,
		};
	},
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});