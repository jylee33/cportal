var $smsHistGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$smsHistGrid = $('#smsHistGrid');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			/*사용자 관리 */
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			//검색바 호출.
			// Master.createSearchBar1($("#periodBox"),$("#dateBox"),'');

			// Master.setCommInit();
		/*	Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));*/
			
			var columns = [];
				columns.push(
                    	{ text : '구분', datafield: 'disMsgType', width: 200, cellsalign: 'center' },
						{ text : '전송시간', datafield: 'date', width: 200, cellsalign: 'center' },
						{ text : '전송결과', datafield: 'sndFlagStr', width: 150, cellsalign: 'center' },
						{ text : '수신자', datafield : 'cellName', width: 150, cellsalign: 'center' },
						{ text : '수신번호', datafield : 'cellNo', width: 150, cellsalign: 'center' },
						{ text : '발신번호', datafield: 'sendNo', width: 150, cellsalign: 'center' },
						{ text : '메시지내용', datafield: 'shortMsg', minwidth: 130 }
				);
			
			HmGrid.create($smsHistGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'disMsgType', type:'string' },
                                { name:'date', type:'string' },
                                { name:'sndFlagStr', type:'string' },
                                { name:'cellName', type:'string' },
                                { name:'cellNo', type:'number' },
                                { name:'sendNo', type:'number' },
                                { name:'shortMsg', type:'string' },
							]
//							url: ctxPath + '/dev/getDevList.do'
						},
						{
							formatData: function(data) {
								// $.extend(data, {
								// 	period:$("input[name='cbPeriod']:checked").val(),
								// 	date1: HmDate.getDateStr($('#date1')),
								// 	time1: HmDate.getTimeStr($('#date1')),
								// 	date2: HmDate.getDateStr($('#date2')),
								// 	time2: HmDate.getTimeStr($('#date2'))
								// });
								$.extend(data, HmBoxCondition.getPeriodParams());
								return data;
							}
						}
				),
				columns: columns
			});

			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {

		},
		
		search: function() {
			HmGrid.updateBoundData($smsHistGrid, ctxPath + '/main/env/smsHistory/getSmsHistoryList.do');
		},
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($smsHistGrid, '단문자 발송이력', false);
		}
		
	
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});