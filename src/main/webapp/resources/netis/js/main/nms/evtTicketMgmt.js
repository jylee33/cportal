var $evtTicketGrid;
var periodType = -1;
var ticketStateCd = '-1';
var Main = {
		/** variable */
		initVariable : function() {
			$cbPeriod = $('#cbPeriod');
			$evtTicketGrid = $('#evtTicketGrid');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('');
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
			case "btnAdd":	this.ticketAdd(); break;
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

			Master.createGrpTab(Main.search, {devKind1: 'DEV'});
			
			HmGrid.create($evtTicketGrid, {
				source : new $.jqx.dataAdapter(
						{
							datatype : 'json',
							datafields:[
                                { name: 'ticketNo', type: 'string' },
                                { name: 'ticketTitle', type: 'string' },
                                { name: 'eventCauseCd', type: 'string' },
                                { name: 'disEventCauseCd', type: 'string' },
                                { name: 'ticketStateCd', type: 'string' },
                                { name: 'disTicketStateCd', type: 'string' },
                                { name: 'regUserId', type: 'string' },
                                { name: 'regUserName', type: 'string' },
                                { name: 'receiptUserId', type: 'string' },
                                { name: 'receiptUserName', type: 'string' },
                                { name: 'ticketPriorityCd', type: 'string' },
                                { name: 'disTicketPriorityCd', type: 'string' },
                                { name: 'ticketEffectCd', type: 'string' },
                                { name: 'disTicketEffectCd', type: 'string' },
                            ]
						},
						{
							formatData : function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				selectionmode: 'singlerow',
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns : [
					{ text : '번호', datafield : 'ticketNo', cellsalign: 'center', width : 80 },
					{ text : '제목', datafield : 'ticketTitle', minwidth : 100 },
					{ text : '장애 유형 코드', datafield : 'eventCauseCd', width: 200, hidden: true },
					{ text : '장애 유형', datafield : 'disEventCauseCd', width: 200, },
					{ text : '상태 코드', datafield : 'ticketStateCd', width: 200, hidden: true },
					{ text : '처리현황', datafield : 'disTicketStateCd', width : 100 , filtertype:'checkedlist' },
					{ text : '등록자 ID', datafield : 'regUserId', width : 140, hidden: true },
					{ text : '등록자', datafield : 'regUserName', width : 140 },
					{ text : '담당자 ID', datafield : 'receiptUserId', width : 140, hidden: true },
					{ text : '담당자', datafield : 'receiptUserName', width : 140 },
					{ text : '우선순위 코드', datafield : 'ticketPriorityCd', width: 100, hidden: true},
					{ text : '우선순위', datafield : 'disTicketPriorityCd', width: 100},
					{ text : '영향도 코드', datafield : 'ticketEffectCd', width: 100, hidden: true },
					{ text : '영향도', datafield : 'disTicketEffectCd', width: 100 }
				]
			}, CtxMenu.NONE);
			Main.search();
			$evtTicketGrid.on('rowdoubleclick', function(event) {
				var rowData = event.args.row.bounddata;
                Main.ticketMgmt(rowData);
            });

			$('#section').css('display', 'block');
		},

		/** init data */
		initData : function() {
			Main.getTicketCnt();
		},

		getTicketCnt: function(){
			var params = Main.getCommParams();
			Server.get('/main/nms/evtTicketMgmt/getTicketCnt.do', {
				data: params,
				success: function(result) {
						console.log(result)
					if(result == null) {
						result = {'standby': 0, 'measure': 0, 'action': 0, 'finish': 0};
					}
					$.each(result, function(key, value) {
						try {
							var obj = $('#' + key);
							if(obj === undefined) return;
							if(parseInt(value) > 0){
								$('#ul_'+key).removeClass().addClass(key);
							}else{
								$('#ul_'+key).removeClass();
							}
							obj.text(HmUtil.commaNum(value));
						} catch(e) {}
					});

				}
			});
		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			$.extend(params, {
				ticketStateCd: ticketStateCd
			}, HmBoxCondition.getPeriodParams());

			params.period = params.period == '' ? 'ALL':params.period;
			return params;
		},


		search : function() {
			ticketStateCd = '-1';
//			$('#cbPeriod').jqxDropDownList('selectItem', $('#cbPeriod').jqxDropDownList('getItemByValue', -1));
			HmGrid.updateBoundData($evtTicketGrid, ctxPath + '/main/nms/evtTicketMgmt/getEvtTicketList.do');
			Main.getTicketCnt();
		},

		ticketAdd: function(){
			var params = {
					seqNos: null,
					errYn: 'N'
			};
			$.post(ctxPath + '/main/popup/nms/pEvtTicketAdd.do',
					params,
					function(result) {
				HmWindow.open($('#pwindow'), '티켓 등록', result, 750, 530, 'pwindow_init');
					}
			);
		},
		ticketMgmt: function(rowData){
			var params = {
					ticketNo: rowData.ticketNo
			};
			$.post(ctxPath + '/main/popup/nms/pEvtTicketEdit.do',
					params,
					function(result) {
				HmWindow.open($('#pwindow'), '티켓 관리', result, 750, 679, 'pwindow_init', rowData);
			});
		},
		state: function(cd){
			// $('input:radio[name=cbPeriod]').eq(0).prop("checked", true);
			// $('#date1, #date2').jqxDateTimeInput({disabled:true});

			switch(cd){
			case 'cd001':
				ticketStateCd = '001';
				break;
			case 'cd002':
				ticketStateCd = '002';
					break;
			case 'cd003':
				ticketStateCd = '003';
					break;
			case 'cd004':
				ticketStateCd = '004';
					break;
			}
			HmGrid.updateBoundData($evtTicketGrid, ctxPath + '/main/nms/evtTicketMgmt/getEvtTicketList.do');
		},
		/** export Excel */
		exportExcel: function() {
//			HmUtil.exportExcel(ctxPath + '/main/nms/syslog/export.do', gridParams);
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});