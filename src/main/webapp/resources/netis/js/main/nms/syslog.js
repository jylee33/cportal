var $syslogGrid;
var timer;
var isSearchBtn = false, gridParams = [];
var Main = {
		sysConfList: [],
		syslogGridtotalrecords : 0,
		/** variable */
		initVariable : function() {
			$cbPeriod = $('#cbPeriod');
			$syslogGrid = $('#syslogGrid');
			this.initCondition();
		},

		initCondition: function() {
			HmBoxCondition.createPeriod('', Main.search, timer);
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
			HmDropDownList.create($('#sRealtime'), {
				source: [{label: '최근 30분', value: '48'}, {label: '최근 1시간', value: '24'}, {label: '최근 1일', value: '1'}],
				selectedIndex: 0, width: 80
			});
			// HmBoxCondition.createRadio($('#sRealTime'), [{label: '최근 30분', value: '48'}, {label: '최근 1시간', value: '24'}, {label: '최근 1일', value: '1'}]);
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
			case "btnSearch": this.search(); break;
			case "btnConf":	this.confPopup(); break;
			case "btnEvtConf":	this.evtConfPopup(); break;
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
			Master.createGrpTab(Main.search, {devKind1: 'DEV,SVR'});

			var source = {
					datatype: 'json',
					root: 'rows',
                	datafields:[
                    	{ name:'ymdhms', type:'string' },
                    	{ name:'levelVal', type:'string' },
                    	{ name:'facilityVal', type:'string' },
                    	{ name:'devName', type:'string' },
                    	{ name:'hostIp', type:'string' },
                    	{ name:'msg', type:'string' },
                    	{ name:'grpName', type:'string' },
                    	{ name:'sysLevel', type:'string' },
					],
					beforeprocessing: function(data) {
						if(data != null)
							source.totalrecords = data.resultData != null? data.resultData.totalrecords : 0;
					},
					sort: function() {
						$syslogGrid.jqxGrid('updatebounddata', 'sort');
					},
					filter: function() {
						$syslogGrid.jqxGrid('updatebounddata', 'filter');
					}
			};
			var adapter = new $.jqx.dataAdapter(
					source,
					{
						formatData: function(data) {
							$.extend(data, Main.getCommParams());
							data.viewType = data.period == 0? 'REALTIME' : 'HISTORY';
							data.time = $('#sRealtime').val();
							data.totalrecords = Main.syslogGridtotalrecords;
							gridParams = data;
							console.log(data);
							return data;
						}
					}

			);

			HmGrid.create($syslogGrid, {
				source: adapter,
				virtualmode: true,
				rendergridrows: function(params) {
					return adapter.records;
				},
                // pagesize : 100,
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns: 
				[
				 	{ text : '발생일시', datafield: 'ymdhms', width: 160, cellsalign: 'center' },
					{ text : 'Severity', datafield: 'levelVal', width: 120 				},
					{ text : 'Facility', datafield: 'facilityVal', width: 120 				},
					{ text : '장비명', datafield: 'devName', width: 150			},
//					{ text : '사용자장비명', datafield: 'userDevName', width: 150 ,cellclassname: Main.cellclass },
					{ text : 'IP', datafield: 'hostIp', width: 120 						},
					{ text : '이벤트명', datafield: 'msg', minwidth: 300	, cellsrenderer: function(row, datafield, value){
						var _result = value;
						for(var i = 0 ; i < Main.sysConfList.length ; i++){
							if (Main.sysConfList[i].useFlag == 1) {
								var _reg = new RegExp(Main.sysConfList[i].sysMsg, 'gi');
								_result = _result.replace(_reg, '<span style="background-color:'+ Main.sysConfList[i].sysColor +'">' + Main.sysConfList[i].sysMsg + '</span>');
							}
						}//for end(i)

                        return "<div style='margin-top: 6.5px; margin-bottom: 2px;margin-left: 5px;' class='jqx-left-align'>"+ _result +"</div>";
					}},
					{ text : '그룹', datafield: 'grpName', width: 150					},
	                { text: "sysLevel",datafield: "sysLevel", width: 40, hidden: true }
			    ]
			}, CtxMenu.SYSLOG);

			$('#section').css('display', 'block');
		},

		initSysConf: function(){
            Server.get('/main/nms/syslog/getSyslogConfList.do',{
                data: null,
                success: function(result){
                	console.log(result);
                    Main.sysConfList = [];
                	$.each(result, function(i, el){
                    	Main.sysConfList.push({
							sysMsg: el.sysMsg,
							sysColor: el.sysColor,
							useFlag: el.useFlag
						});
					})
                }//success
            });//Server.get
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
			var cellval = $syslogGrid.jqxGrid('getcellvalue', row, 'sysLevel');
			switch(String(cellval)) {
                case '1': return 'info';
                case '2': return 'warning';
                case '3': return 'minor';
                case '4': return 'major';
                case '5': return 'critical';
                default: return null;
			}
		},

		searchDevCond: function() {
			HmGrid.updateBoundData($('#devGrid'), ctxPath + '/dev/getDevList.do');
		},
		
		search : function() {

			Main.initSysConf();

			HmBoxCondition.refreshPeriod();
			$syslogGrid.jqxGrid("gotopage", 0); // jqxgrid의 paginginformation 초기화를 위해 호출
			Main.syslogGridtotalrecords = 0; // jqxgrid의 paginginformation 초기화를 위해 호출
			HmGrid.updateBoundData($syslogGrid, ctxPath + '/main/nms/syslog/getSyslogList.do');
			$('#prgrsBar').val(0);
		},
		
		/*설정팝업*/
		confPopup: function() {
			//HmUtil.createPopup('/main/popup/nms/pSyslogConf.do', $('#hForm'), 'pConf', 720, 480);
			//HmUtil.open('/main/popup/nms/pSyslogConf.do', $('#hForm'), 'pConf', 720, 480);
			console.log("confOPop")
            $.post(ctxPath + '/main/popup/nms/pSyslogConf.do',
				{a: 'a'},
                function(result) {
                    HmWindow.open($('#pwindow'), 'Syslog 설정', result, 720, 480, 'pwindow_init');
                }
            );
	    },
	    
	    /*이벤트 설정팝업*/
	    evtConfPopup: function() {
			HmUtil.createPopup('/main/popup/nms/pSyslogEvtConf.do', $('#hForm'), 'pEvtConf', 1200, 650);
	    },
	    
		/** export Excel */
		exportExcel: function() {

			if($('#gSiteName').val() == 'HyundaiSteel'){
				HmUtil.exportGrid($syslogGrid, 'Syslog_' + $.format.date(new Date(), 'yyyyMMddHHmmss') + '_' + ($syslogGrid.jqxGrid('getpaginginformation').pagenum + 1), false);
			} else {
				HmUtil.exportGrid($syslogGrid, 'Syslog', false);
			}
			// HmUtil.exportExcel(ctxPath + '/main/nms/syslog/export.do', gridParams);
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});