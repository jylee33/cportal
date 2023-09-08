var $phoneGrid;
var timer;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$phoneGrid = $('#phoneGrid');
			this.initCondition();
		},
		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('', Main.search, timer);
			$("input[name=sRef]").eq(2).click();
			// radio 조건
			HmBoxCondition.createRadioInput($('#sSrchType'), [
				{label: '전화기명', value: 'sIptName'},
				{label: '내선', value: 'sIptDesc'},
				{label: 'IP', value: 'sIptIp'},
			]);
		},
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox').keypress(function(e) {
				if (e.keyCode == 13) Main.search(); 
			});
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
            HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'PBX' });
			$('#sIptStatus').jqxDropDownList({ width: 130, height: 22, selectedIndex: 0, theme: jqxTheme, autoDropDownHeight: true,
				source: [{label: '전체', value: -1}, {label: 'unknown', value: 1}, {label: 'registered', value: 2}, {label: 'unregistered', value: 3}, {label: 'rejected', value: 4}, {label: 'partiallyregistered', value: 5}]
			});
			
			HmGrid.create($phoneGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [
                                {name: 'iptName', type: 'string'},
                                {name: 'iptDesc', type: 'string'},
                                {name: 'iptIp', type: 'string'},
                                {name: 'iptMac', type: 'string'},
                                {name: 'iptStatusStr', type: 'string'},
                                {name: 'devName', type: 'string'},
                                {name: 'devIp', type: 'string'},
                                {name: 'iptProtocolStr', type: 'string'}
							]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
                columns:
				[
				 	{ text: '전화기명', datafield: 'iptName', minwidth: 150 },
				 	{ text: '내선번호', datafield: 'iptDesc', width: 100},
//				 	{ text: '사용자', datafield: 'iptUser', minwidth: 80 },
				 	{ text: 'IP 주소', datafield: 'iptIp', width: 120 },
				 	{ text: 'Mac 주소', datafield: 'iptMac', minwidth: 200 },
//				 	{ text: '모델명', datafield: 'iptModel', minwidth: 130 },
				 	{ text: '상태', datafield: 'iptStatusStr', width: 130, cellsalign: 'center' },
				 	{ text: '교환기', datafield: 'devName', minwidth: 150 },
				 	{ text: '교환기 IP', datafield: 'devIp', width: 120 },
				 	{ text: '프로토콜', datafield: 'iptProtocolStr', width: 100 }
				]
			}, CtxMenu.COMM, ctxmenuIdx++);
		},
		
		/** init data */
		initData: function() {
		/*	Main.chgRefreshCycle();*/
		},
		
		/** 트리선택 */
		selectTree: function() {
			Main.search();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams();
			$.extend(params,Main.getSrchParams());
			return params;
		},
		getSrchParams: function(radioNm) {
			if(radioNm === undefined) {
				radioNm = 'sSrchType';
			}
			var _stype = $("input:radio[name={0}]:checked".substitute(radioNm)).val(),
				_stext = $('#{0}_input'.substitute(radioNm)).val();
			return {
				sIptName: _stype == 'sIptName'? _stext : null,
				sIptDesc: _stype == 'sIptDesc'? _stext : null,
				sIptIp: _stype == 'sIptIp'? _stext : null,
				sIptStatus: $('#sIptStatus').val() == -1? null : $('#sIptStatus').val()
			};
		},
		
		search: function() {
			HmGrid.updateBoundData($phoneGrid, ctxPath + '/main/ipt/ciscoPhoneMonitor/getIptPhoneList.do');
		},
		
		/** export */
		exportExcel: function() {
			var params = Main.getCommParams();
			HmUtil.exportExcel(ctxPath + '/main/ipt/ciscoPhoneMonitor/export.do', params);
		},
		
		/** 새로고침 주기 변경 */
		chgRefreshCycle : function() {
			var cycle = $('#refreshCycleCb').val();
			if (timer != null)
				clearInterval(timer);
			if (cycle > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar').val();
					if (curVal < 100)
						curVal += 100 / cycle;
					$('#prgrsBar').val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar').val(0);
			}
		}
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});