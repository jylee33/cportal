var $dtlTab;
var $devChgGrid, $ifChgGrid, $userChgGrid, $svrChgGrid;
var $cbPeriod;

var Main = {
		/** variable */
		initVariable: function() {
			$dtlTab = $('#dtlTab');
			$devChgGrid = $('#devChgGrid');
			$ifChgGrid = $('#ifChgGrid');
			$userChgGrid = $('#userChgGrid');
			$svrChgGrid = $('#svrChgGrid');
			$cbPeriod = $('#cbPeriod');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('', Main.search);
			// radio 조건
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
			$('#cbKind').jqxDropDownList({
				source: [
					{label: '전체', value: 'ALL'},
					{label: '장비', value: 'DEV'},
					{label: '회선', value: 'IF'},
					{label: '서버', value: 'SVR'},
					{label: '사용자', value: 'USER'}
				],
				width: '120px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
				displayMember: 'label',
				valueMember: 'value',
				selectedIndex: 4
			});
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case "btnSearch": this.searchChgMgmt(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.searchChgMgmt();
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createGrpTab2(Main.searchChgMgmt);

			$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case 0: // 사용자
						HmGrid.create($userChgGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										datafields:[
                                            { name:'ymdhms', type:'string' },
                                            { name:'chgKind', type:'string' },
                                            { name:'chgContent', type:'string' },
                                            { name:'chgBefore', type:'string' },
                                            { name:'chgAfter', type:'string' },
                                            { name:'changer', type:'string' },
										]
									},
									{
											formatData : function(data) {
												$.extend(data, Main.getCommParams());
												return data;
											}
									}
							),
							columns:
							[
								{ text : '일시', datafield : 'ymdhms', width : 150, cellsAlign: 'center' },
								{ text : '종류', datafield : 'chgKind', width: 150, filtertype: 'checkedlist'},
								{ text : '변경내용', datafield : 'chgContent', minwidth: 250 },
								{ text : '변경전', datafield : 'chgBefore', width: 200, cellsAlign: 'center' },
								{ text : '변경후', datafield : 'chgAfter',  width: 200, cellsAlign: 'center'},
								{ text : '변경자', datafield : 'changer', width: 100, cellsAlign: 'center'}
						    ]						
						}, CtxMenu.COMM, "0");
						break;
					case 1: // 장비
						HmGrid.create($devChgGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										datafields:[
                                            { name:'ymdhms', type:'string' },
                                            { name:'grpName', type:'string' },
                                            { name:'userDevName', type:'string' },
                                            { name:'disDevName', type:'string' },
                                            { name:'devName', type:'string' },
                                            { name:'devIp', type:'string' },
                                            { name:'chgKind', type:'string' },
                                            { name:'chgSort', type:'string' },
                                            { name:'chgContent', type:'string' },
                                            { name:'chgBefore', type:'string' },
                                            { name:'chgAfter', type:'string' },
                                            { name:'changer', type:'string' },
										]
									},
									{
											formatData : function(data) {
												$.extend(data, Main.getCommParams());
												return data;
											}
									}
							),
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
							columns: 
							[
								{ text : '일시', datafield : 'ymdhms', width : 150, cellsAlign: 'center' },
								{ text : '그룹명', datafield : 'grpName'},
								{ text : '장비명', datafield : 'devName', width : 150  },
								{ text : '사용자장비명', datafield : 'userDevName'  },
								{ text : '장비IP', datafield : 'devIp', width : 150  },
								{ text : '종류', datafield : 'chgKind', width : 100, filtertype: 'checkedlist' },
								{ text : '작업', datafield : 'chgSort', width : 100, cellsalign: 'center', filtertype: 'checkedlist' },
								{ text : '변경내역', datafield : 'chgContent' },
								{ text : '변경전', datafield : 'chgBefore', width: 150, cellsAlign: 'center' },
								{ text : '변경후', datafield : 'chgAfter',  width: 150, cellsAlign: 'center'},
								{ text : '변경자', datafield : 'changer', width: 100, cellsAlign: 'center'}
						    ]						
						}, CtxMenu.COMM, "1");
						break;
						
					case 2: //회선
							HmGrid.create($ifChgGrid, {
								source: new $.jqx.dataAdapter(
										{
											datatype: 'json',
											datafields:[
                                                { name:'ymdhms', type:'string' },
                                                { name:'grpName', type:'string' },
                                                { name:'userDevName', type:'string' },
                                                { name:'disDevName', type:'string' },
                                                { name:'devName', type:'string' },
                                                { name:'devIp', type:'string' },
                                                { name:'ifName', type:'string' },
                                                { name:'ifAlias', type:'string' },
                                                { name:'ifIp', type:'string' },
                                                { name:'chgKind', type:'string' },
                                                { name:'chgSort', type:'string' },
                                                { name:'chgBefore', type:'string' },
                                                { name:'chgAfter', type:'string' },
                                                { name:'changer', type:'string' }
											]
										},
										{
												formatData : function(data) {
													$.extend(data, Main.getCommParams());
                                                    return data;
												}
										}
							),
							columns:
							[
								{ text : '일시', datafield : 'ymdhms', width : 150, cellsAlign: 'center' },
								{ text : '그룹명', datafield : 'grpName', width: 130},
                                { text : '장비명', datafield : 'devName', width : 150  },
								{ text : '사용자장비명', datafield : 'userDevName', width: 150 },
                                { text : '장비IP', datafield : 'devIp', width : 150  },
                                { text : '회선IP', datafield : 'ifIp', width : 150  },
                                { text : '회선명', datafield : 'ifName', minwidth: 150 },
								{ text : '회선별칭', datafield : 'ifAlias', width: 150 },
								{ text : '종류', datafield : 'chgKind', width : 100, filtertype: 'checkedlist'},
								{ text : '작업', datafield : 'chgSort', width : 100, cellsalign: 'center', filtertype: 'checkedlist' },
								{ text : '변경전', datafield : 'chgBefore', width: 150, cellsAlign: 'center' },
								{ text : '변경후', datafield : 'chgAfter',  width: 150, cellsAlign: 'center'},
								{ text : '변경자', datafield : 'changer', width: 100, cellsAlign: 'center'}
						    ]						
						}, CtxMenu.COMM, "2");
						break;

						case 3: // 서버
							HmGrid.create($svrChgGrid, {
								source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										datafields:[
											{ name:'ymdhms', type:'string' },
											{ name:'grpName', type:'string' },
											{ name:'userDevName', type:'string' },
											{ name:'disDevName', type:'string' },
                                            { name:'devName', type:'string' },
                                            { name:'devIp', type:'string' },
                                            { name:'chgKind', type:'string' },
											{ name:'chgSort', type:'string' },
											{ name:'chgContent', type:'string' },
											{ name:'chgBefore', type:'string' },
											{ name:'chgAfter', type:'string' },
											{ name:'changer', type:'string' },
										]
									},
									{
										formatData : function(data) {
											$.extend(data, Main.getCommParams());
											data.kind = 'SVR';
                                            return data;
										}
									}
								),
								pagerheight: 27,
								pagerrenderer : HmGrid.pagerrenderer,
								columns:
									[
										{ text : '일시', datafield : 'ymdhms', width : 150, cellsAlign: 'center' },
										{ text : '그룹명', datafield : 'grpName'},
                                        { text : '서버명', datafield : 'devName', width : 150  },
										{ text : '사용자서버명', datafield : 'userDevName'  },
                                        { text : '서버IP', datafield : 'devIp', width : 150  },
                                        { text : '종류', datafield : 'chgKind', width : 100, filtertype: 'checkedlist' },
										{ text : '작업', datafield : 'chgSort', width : 100, cellsalign: 'center', filtertype: 'checkedlist' },
										{ text : '변경내역', datafield : 'chgContent' },
										{ text : '변경전', datafield : 'chgBefore', width: 150, cellsAlign: 'center' },
										{ text : '변경후', datafield : 'chgAfter',  width: 150, cellsAlign: 'center'},
										{ text : '변경자', datafield : 'changer', width: 100, cellsAlign: 'center'}
									]
							}, CtxMenu.COMM, "3");
							break;
					}
				}
			}).on('selected', function(event) {
				Main.searchChgMgmt();
			});

			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
			this.searchChgMgmt();
		},
		selectTree: function() {
			Main.searchChgMgmt();
		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			$.extend(params, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams());
			params.kind = $('#cbKind').val();
			return params;
		},
		/** 변경관리 조회 */
		searchChgMgmt: function() {
			switch($dtlTab.val()) {
				case 0:
                     //$('#cbKind').jqxDropDownList('selectedIndex', 4);
                    $('#cbKind').jqxDropDownList('disabled', false);
                    $('#typeArea').hide();
                    $('#kindArea').show();
					HmGrid.updateBoundData($userChgGrid, ctxPath + '/main/nms/chgMgmt/getUserChgList.do' ); break;
				case 1:
                    //$('#cbKind').jqxDropDownList('selectedIndex', 1);
                    $('#cbKind').jqxDropDownList('disabled', true);
                    $('#kindArea').hide();
                    $('#typeArea').show();
					HmGrid.updateBoundData($devChgGrid, ctxPath + '/main/nms/chgMgmt/getDevChgList.do' ); break;
				case 2:
                    //$('#cbKind').jqxDropDownList('selectedIndex', 2);
                    $('#cbKind').jqxDropDownList('disabled', true);
                    $('#kindArea').hide();
                    $('#typeArea').show();
					HmGrid.updateBoundData($ifChgGrid, ctxPath + '/main/nms/chgMgmt/getIfChgList.do' ); break;
				case 3:
					//$('#cbKind').jqxDropDownList('selectedIndex', 3);
					$('#cbKind').jqxDropDownList('disabled', true);
                    $('#kindArea').hide();
                    $('#typeArea').show();
					HmGrid.updateBoundData($svrChgGrid, ctxPath + '/main/nms/chgMgmt/getDevChgList.do' ); break;
			}
		},
		
		/** export Excel */
		exportExcel: function() {
            switch($dtlTab.val()) {
                case 0: HmUtil.exportGrid($userChgGrid, '변경관리_사용자', false); break;
                case 1: HmUtil.exportGrid($devChgGrid, '변경관리_장비', false); break;
                case 2: HmUtil.exportGrid($ifChgGrid, '변경관리_회선', false); break;
				case 3: HmUtil.exportGrid($svrChgGrid, '변경관리_서버', false); break;
            }
			return;

			//alert("$dtlTab.val() :"+$dtlTab.val());
			var params = Master.getGrpTabParams();
			$.extend(params, {
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2')),
				sIp: $('#sIp').val(),
				sDevName: $('#sDevName').val(),
				selectTab : $dtlTab.val()
			});
			
			HmUtil.exportExcel(ctxPath + '/main/nms/chgMgmt/export.do', params);
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});