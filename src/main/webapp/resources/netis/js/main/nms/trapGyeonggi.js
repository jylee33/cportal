var $trapGrid;
var timer;

var isLoadComplete = false;

var Main = {
		/** variable */
		initVariable : function() {
			$cbPeriod = $('#cbPeriod');
			$trapGrid = $('#trapGrid');
			this.initCondition();
		},

		initCondition: function() {
			HmBoxCondition.createPeriod('', Main.search, timer);
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
			HmDropDownList.create($('#sRealtime'), {
				source: [{label: '최근 30분', value: 30}, {label: '최근 1시간', value: 60}, {label: '최근 1일', value: 60*24}],
				selectedIndex: 0, width: 80
			});
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
			$('input:radio[name=sPeriod]').on('change', function() {
				$('#sRealtimeBox').css('display', $(this).val() == 0? 'block' : 'none');
			});
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnEventConf": this.evtConfPopup(); break;
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
			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createGrpTab(Main.search,  {devKind1: 'DEV'} );

			var source = {
					datatype: 'json',
					root: 'rows',
					datafields:[
                        { name:'ymdhms', type:'string' },
                        { name:'grpName', type:'string' },
                        { name:'devName', type:'string' },
                        { name:'devIp', type:'string' },
                        { name:'trMsg', type:'string' },
                        { name:'trType', type:'string' },
					],
					beforeprocessing: function(data) {
						if(data != null)
							source.totalrecords = data.resultData.totalRows;
					},
					sort: function() {
						$trapGrid.jqxGrid('updatebounddata', 'sort');
					},
					filter: function() {
						$trapGrid.jqxGrid('updatebounddata', 'filter');
					},

			};
			
			var adapter = new $.jqx.dataAdapter(
					source,
					{
						formatData: function(data) {
							debugger
							$.extend(data, Main.getCommParams());
							data.viewType = data.period == 0? 'REALTIME' : 'HISTORY';
							data.time = $('#sRealtime').val();
							console.log('data',data)
							return data;
						}
					}
			);
			
			HmGrid.create($trapGrid, {
				source: adapter,
				virtualmode: true,
				rendergridrows: function(params) {
					return adapter.records;
				},
				columns:
				[
				 	{ text : '발생일시', datafield: 'ymdhms', width: 160, cellsalign: 'center' },
				 	{ text : '그룹', datafield: 'grpName', width: 150 },
				 	{ text : '장비명', datafield: 'devName', width: 150 },
				 	{ text : 'IP', datafield: 'devIp', width: 120 },
				 	{ text : '이벤트명', datafield: 'trMsg', minwidth: 300 },
					{ text : 'Trap타입', datafield: 'trType', width: 120 }
			    ]
			}, CtxMenu.TRAP);

			$('#section').css('display', 'block');
		},

		/** init data */
		initData : function() {

		},
		selectTree: function() {
			Main.search();
		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			$.extend(params, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams());
			return params;
		},
		cellclass: function(row, columnfield, value) {
			var cellval = $trapGrid.jqxGrid('getcellvalue', row, 'trapLevel');
			var classnm = '';
			switch(String(cellval)) {
			case "1": classnm='yellow'; break;
			case "2": classnm='orange'; break;
			case "3": classnm='red'; break;
			}
			return classnm;
		},

		searchDevCond: function() {
			HmGrid.updateBoundData($('#devGrid'));
		},
		
		evtConfPopup: function(){			
			var params = {
					evtLevel1Text: $('#sEvtLevel1').val(),
					evtLevel2Text: $('#sEvtLevel2').val(),
					evtLevel3Text: $('#sEvtLevel3').val(),
					evtLevel4Text: $('#sEvtLevel4').val(),
					evtLevel5Text: $('#sEvtLevel5').val()
			};
			HmUtil.createPopup('/main/popup/nms/pTrapEvtConf.do', $('#hForm'), 'pTrapEvtConf', 600, 700, params);
			
		},		
		
		search : function() {
			if(!isLoadComplete){
				isLoadComplete = true;
				return false;
			}
			HmBoxCondition.refreshPeriod();
            $trapGrid.jqxGrid("gotopage", 0); // jqxgrid의 paginginformation 초기화를 위해 호출
            HmGrid.updateBoundData($trapGrid, ctxPath + '/main/nms/trap/getTrapList.do');
			$('#prgrsBar').val(0);
		},

	    /** export Excel */
		exportExcel: function() {
            HmUtil.exportGrid($trapGrid, 'Trap', false);
			// var btnIdx = $('#btnViewType').jqxButtonGroup('getSelection');
			// var params = Master.getGrpTabParams();
			// $.extend(params, {
			// 	period: $cbPeriod.val(),
			// 	date1: HmDate.getDateStr($('#date1')),
			// 	time1: HmDate.getTimeStr($('#date1')),
			// 	date2: HmDate.getDateStr($('#date2')),
			// 	time2: HmDate.getTimeStr($('#date2')),
			// 	sIp: $('#sIp').val(),
			// 	sDevName: $('#sDevName').val(),
			// 	viewType: btnIdx == 0? 'HISTORY' : 'REALTIME',
			// 	time: 	$('#cbTime').val()
			// });
            //
			//
			//
			//
			// HmUtil.exportExcel(ctxPath + '/main/nms/trap/export.do', params);
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});