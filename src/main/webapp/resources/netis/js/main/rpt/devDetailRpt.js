var $rptGrid, $rptSvrGrid, $tab;
var Main = {
		/** variable */
		initVariable : function() {
			$rptGrid = $('#rptGrid');
			$rptSvrGrid = $('#rptSvrGrid');
			$tab = $('#tabs');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
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
			$('#mainSplitter').jqxSplitter({ width: '99.8%', height: '99.8%', orientation: 'vertical', theme: jqxTheme, panels: [{ size: 254, collapsible: true }, { size: '100%' }] });
			HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 1);
			$('#date1, #date2').jqxDateTimeInput({ width: '120px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme });

              var source = 	{
            		  				datatype: "json",
            		  				url:  ctxPath +'/main/env/optConf/getWorkTimeConfList.do',
            		  	            formatData: function (data) {
            		  	                $.extend(data, {isAll:'true'});
            		  	                return data;
            		  	            }
             					};
              var dataAdapter = new $.jqx.dataAdapter(source);
              $('#cbTimeId').jqxDropDownList({ selectedIndex: 0, source: dataAdapter, displayMember: "memo", valueMember: "codeId", 
                  placeHolder: '선택',theme: jqxTheme, width: 100, height: 21,
            	  	autoDropDownHeight: true });
//              $("#cbTimeId").on('bindingComplete', function (event) {
//            	  $('#cbTimeId').jqxDropDownList('insertAt', { label: '전체', value: '0'} , 0);
//              });

            $tab.jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
                initTabContent: function(tab) {
                    switch(tab) {
                        case 0:
                            HmGrid.create($rptGrid, {
                                source: new $.jqx.dataAdapter(
                                    {
                                        datatype: 'json'
                                    },
                                    {
                                        formatData: function(data) {
                                            var params = Master.getGrpTabParams();
                                            //	alert("cbCodeId : "+$('#cbTimeId').val() );
                                            $.extend(params, {
                                                timeId: $('#cbTimeId').val(),
                                                date1: HmDate.getDateStr($('#date1')),
                                                date2: HmDate.getDateStr($('#date2')),
                                                sIp: $('#sIp').val(),
                                                sDevName: $('#sDevName').val(),
                                                isDayOff: $('#ckDayOff').val()? 1 : 0,
                                                isHoliday: $('#ckHoliday').val()? 1 : 0
                                            });
                                            //alert(JSON.stringify(data));
                                            return params;
                                        }
                                    }
                                ),
                                columns: [
                                            { text: '장비번호'		, datafield: 'mngNo', 		hidden: true },
                                            { text: '장비이름'		, datafield: 'devName', 		hidden: true },
                                            { text: '그룹'			, datafield: 'grpName',		minwidth: 140, pinned: true, align: 'center' },
                                            { text: '장비명'		, datafield: 'disDevName', 	minwidth: 150, pinned: true, align: 'center' },
                                            { text: 'IP'		, datafield: 'devIp', 			minwidth: 140, pinned: true, align: 'center' },
                                            { text: '종류'		, datafield: 'devKind2', 		width: 100, align: 'center' },
                                            { text: '제조사'		, datafield: 'vendor', 			minwidth: 140, align: 'center' },
                                            { text: '모델'			, datafield: 'model', 			minwidth: 140, align: 'center' },
                                            { text: '평균'	, columngroup: 'cpu'	, datafield: 'cpuAvg', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center' },
                                            { text: '최대'	, columngroup: 'cpu'	, datafield: 'cpuMax', width: 80, cellsrenderer: HmGrid.unit1000renderer , align: 'center' },
                                            { text: '평균'	, columngroup: 'memory'	, datafield: 'memAvg', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center' },
                                            { text: '최대'	, columngroup: 'memory'	, datafield: 'memMax', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center'  },
                                            { text: '평균'	, columngroup: 'temp'	, datafield: 'tempAvg', width: 80, cellsalign: 'right', align: 'center' },
                                            { text: '최대'	, columngroup: 'temp'	, datafield: 'tempMax', width: 80, cellsalign: 'right', align: 'center'  },
                                            { text: '평균'	, columngroup: 'resp'	, datafield: 'respAvg', width: 80, cellsalign: 'right', align: 'center' },
                                            { text: '최대'	, columngroup: 'resp'	, datafield: 'respMax', width: 80, cellsalign: 'right', align: 'center'  },
                                            { text: '평균'	, columngroup: 'sess'	, datafield: 'sessAvg', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center' },
                                            { text: '최대'	, columngroup: 'sess'	, datafield: 'sessMax', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center'  }
                                        ],
                                    columngroups: [
                                        { text: 'CPU',  align: 'center', name: 'cpu' },
                                        { text: '메모리', align: 'center', name: 'memory' },
                                        { text: '온도', align: 'center', name: 'temp' },
                                        { text: '응답시간', align: 'center', name: 'resp' },
                                        { text: '세션', align: 'center', name: 'sess' }
                                    ]
                            }, CtxMenu.DEV10);
                            break;
                        case 1:
                            HmGrid.create($rptSvrGrid, {
                                source: new $.jqx.dataAdapter(
                                    {
                                        datatype: 'json'
                                    },
                                    {
                                        formatData: function(data) {
                                            var params = Master.getGrpTabParams();
                                            //	alert("cbCodeId : "+$('#cbTimeId').val() );
                                            $.extend(params, {
                                                timeId: $('#cbTimeId').val(),
                                                date1: HmDate.getDateStr($('#date1')),
                                                date2: HmDate.getDateStr($('#date2')),
                                                sIp: $('#sIp').val(),
                                                sDevName: $('#sDevName').val(),
                                                isDayOff: $('#ckDayOff').val()? 1 : 0,
                                                isHoliday: $('#ckHoliday').val()? 1 : 0
                                            });
                                            //alert(JSON.stringify(data));
                                            return params;
                                        }
                                    }
                                ),
                                columns: [
                                    { text: '장비번호'		, datafield: 'mngNo', 		hidden: true },
                                    { text: '장비이름'		, datafield: 'devName', 		hidden: true },
                                    { text: '그룹'			, datafield: 'grpName',		minwidth: 140, pinned: true, align: 'center' },
                                    { text: '서버명'		, datafield: 'disDevName', 	minwidth: 150, pinned: true, align: 'center' },
                                    { text: 'IP'		, datafield: 'devIp', 			minwidth: 140, pinned: true, align: 'center' },
                                    { text: '종류'		, datafield: 'devKind2', 		width: 100, align: 'center' },
                                    { text: '제조사'		, datafield: 'vendor', 			minwidth: 140, align: 'center' },
                                    { text: '모델'			, datafield: 'model', 			minwidth: 140, align: 'center' },

                                    { text: '평균'	, columngroup: 'cpu'	, datafield: 'cpuAvg', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center' },
                                    { text: '최대'	, columngroup: 'cpu'	, datafield: 'cpuMax', width: 80, cellsrenderer: HmGrid.unit1000renderer , align: 'center' },
                                    { text: '평균'	, columngroup: 'memory'	, datafield: 'memAvg', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center' },
                                    { text: '최대'	, columngroup: 'memory'	, datafield: 'memMax', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center'  },
                                    { text: '평균'	, columngroup: 'swap'	, datafield: 'swapAvg', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center' },
                                    { text: '최대'	, columngroup: 'swap'	, datafield: 'swapMax', width: 80, cellsrenderer: HmGrid.unit1000renderer, align: 'center'  }
                                ],
                                columngroups: [
                                    { text: 'CPU',  align: 'center', name: 'cpu' },
                                    { text: '메모리', align: 'center', name: 'memory' },
                                    { text: 'Swap', align: 'center', name: 'swap' }
                                ]
                            }, CtxMenu.SVR);
                            break;
                    }
                }
            });

             //휴일 공휴일 체크박스
              $('#ckDayOff, #ckHoliday').jqxCheckBox({ width: 80, height: 22 ,checked:false });
		},

		/** init data */
		initData : function() {
			setTimeout('Master.createGrpTab2(Main.selectTree);', 500);
		},
		
		selectTree: function() {
			Main.search();
		},
	
		/** 조회 */
		search : function() {
		    switch ($tab.val()) {
                case 0: HmGrid.updateBoundData($rptGrid, ctxPath + '/main/rpt/devDetailRpt/getDevDetailRptList.do'); break;
                case 1: HmGrid.updateBoundData($rptSvrGrid, ctxPath + '/main/rpt/devDetailRpt/getDevDetailRptSvrList.do'); break;
            }
		},
		
		/** export Excel */
		exportExcel: function() {
		    if($('#gSiteName').val() == 'HCN') {
		        HmUtil.exportGrid($tab.val()==0? $rptGrid : $rptSvrGrid, '장비상세');
            }
		    else {
                var params = Master.getGrpTabParams();
                $.extend(params, {
                    timeId: $('#cbTimeId').val(),
                    date1: HmDate.getDateStr($('#date1')),
                    date2: HmDate.getDateStr($('#date2')),
                    sIp: $('#sIp').val(),
                    sDevName: $('#sDevName').val(),
                    isDayOff: $('#ckDayOff').val() ? 1 : 0,
                    isHoliday: $('#ckHoliday').val() ? 1 : 0
                });
                //	alert(JSON.stringify(params));

                switch ($tab.val()) {
                    case 0:
                        HmUtil.exportExcel(ctxPath + '/main/rpt/devDetailRpt/export.do', params);
                        break;
                    case 1:
                        HmUtil.exportExcel(ctxPath + '/main/rpt/devDetailRpt/exportSvr.do', params);
                        break;
                }
            }
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});