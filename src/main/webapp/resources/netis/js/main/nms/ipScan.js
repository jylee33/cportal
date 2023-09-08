var $grpTree, $ipGrid;
var isSearchAll = false;

var Main = {
		/** variable */
		initVariable : function() {
			$grpTree = $('#grpTree'), $ipGrid = $('#ipGrid');
			this.initCondition();
		},
		initCondition: function() {
			// search condition
			HmBoxCondition.createRadioInput($('#sSrchType'), [
				{label: '대표IP', value: 'IP'},
				{label: '장비', value: 'NAME'},
				{label: '사용자IP', value: 'SHOSTIP'},
			]);
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) {
				Main.eventControl(event);
			});
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.search();
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			$('#leftTab').jqxTabs({ width: '100%', height: '99.8%', scrollable: true, theme: jqxTheme,
				initTabContent: function(tab) {
					switch(tab) {
						case 0: HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind1 : 'DEV'}); break;
						case 1: HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH2, Main.selectTree); break;
						case 2: HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF, Main.selectTree); break;
					}
				}
			});
			HmGrid.create($ipGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'devKind2', type:'string' },
                                { name:'model', type:'string' },
                                { name:'vendor', type:'string' },
                                { name:'disIfName', type:'string' },
                                { name:'hostIp', type:'string' },
                                { name:'hostMac', type:'string' },
							]
						},
						{
							formatData: function(data) {
								var params = Main.getCommParams();
								$.extend(data, params,Main.getSrchParams());
								return data;
							}
						}
				),
				columns:
				[
			 		{ text: '그룹명', datafield: 'grpName', minwidth: 120 },
			 		{ text: '장비명', datafield: 'devName', displayfield: 'disDevName', minwidth: 140 },
			 		{ text: '대표 IP', datafield: 'devIp', width: 140 },
			 		{ text: '종류', datafield: 'devKind2', width: 120, filtertype: 'checkedlist' },
			 		{ text: '모델', datafield: 'model', width: 120, filtertype: 'checkedlist' },
			 		{ text: '제조사', datafield: 'vendor', width: 120, filtertype: 'checkedlist' },
			 		{ text: '회선명', datafield: 'disIfName', width: 150 },
			 		{ text: '사용자 IP', datafield: 'hostIp', width: 140 },
			 		{ text: 'MAC', datafield: 'hostMac', minwidth: 120 },
				]
			}, CtxMenu.COMM, 'IP');

			$('#section').css('display', 'block');
		},

		/** init data */
		initData : function() {

		},
		/** 공통 파라미터 */
		getCommParams: function () {
			var treeItem = null, _grpType = 'DEFAULT';
			switch ($('#leftTab').val()) {
				case 0:
					treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
					_grpType = 'DEFAULT';
					break;
				case 1:
					treeItem = HmTreeGrid.getSelectedItem($('#sGrpTreeGrid'));
					_grpType = 'SEARCH';
					break;
				case 2:
					treeItem = HmTreeGrid.getSelectedItem($('#iGrpTreeGrid'));
					_grpType = 'IF';
					break;
			}
			var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
			if (treeItem != null) {
				_itemKind = treeItem.devKind2;
				_grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
				_grpParent = treeItem.grpParent;
			}

			var params = {
				grpType: _grpType,
				grpNo: _grpNo,
				grpParent: _grpParent,
				itemKind: _itemKind,
				/*sIp: Master.getSrchIp(),
				sDevName:Master.getSrchDevName(),
				sHostIp: $('#sHostIp').val()*/
			};

			return params;
		},
		/** 그룹트리 선택 */
		selectTree: function() {
			Main.search();
		},
		
		/** 조회 */
		search : function() {
			HmGrid.updateBoundData($ipGrid, ctxPath + '/main/nms/ipScan/getIpScanList.do');
		},

		
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($ipGrid, 'IP자동추적', false);
		},
		getSrchParams: function(radioNm) {
			if(radioNm === undefined) {
				radioNm = 'sSrchType';
			}
			var _stype = $("input:radio[name={0}]:checked".substitute(radioNm)).val(),
				_stext = $('#{0}_input'.substitute(radioNm)).val();
			return {
				sIp: _stype == 'IP'? _stext : null,
				sDevName: _stype == 'NAME'? _stext : null,
				sHostIp: _stype == 'SHOSTIP'? _stext : null,
			};
		},

	};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});