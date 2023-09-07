var $p2_evtTicketGrid;
var p2_ticketStateCd = '-1';
var PMain = {
		/** variable */
		initVariable : function() {
            $p2_evtTicketGrid = $('#p2_evtTicketGrid');
            p2_ticketStateCd = $('#p2_ticketStateCd').val();
		},

		/** add event */
		observe : function() {

		},

		/** event handler */
		eventControl : function(event) {

		},

		/** init design */
		initDesign : function() {
			HmGrid.create($p2_evtTicketGrid, {
				source : new $.jqx.dataAdapter(
						{
							datatype : 'json'
						},
						{
							formatData : function(data) {
								$.extend(data, PMain.getCommParams());
								return data;
							}
						}
				),
				selectionmode: 'singlerow',
				columns : [
					{ text : '번호', datafield : 'ticketNo', cellsalign: 'right', width : 60 },
					{ text : '제목', datafield : 'ticketTitle', minwidth : 100 },
					{ text : '장애 유형 코드', datafield : 'eventCauseCd', width: 200, hidden: true },
					{ text : '장애 유형', datafield : 'disEventCauseCd', width: 200, cellsalign: 'center' },
					{ text : '상태 코드', datafield : 'ticketStateCd', width: 200, hidden: true },
					{ text : '처리현황', datafield : 'disTicketStateCd', width : 100, cellsalign: 'center' },
					{ text : '등록자 ID', datafield : 'regUserId', width : 140, hidden: true },
					{ text : '등록자', datafield : 'regUserName', width : 140 },
					{ text : '담당자 ID', datafield : 'receiptUserId', width : 140, hidden: true },
					{ text : '담당자', datafield : 'receiptUserName', width : 140 },
					{ text : '우선순위 코드', datafield : 'ticketPriorityCd', width: 100, hidden: true},
					{ text : '우선순위', datafield : 'disTicketPriorityCd', width: 100, cellsalign: 'right' },
					{ text : '영향도 코드', datafield : 'ticketEffectCd', width: 100, hidden: true },
					{ text : '영향도', datafield : 'disTicketEffectCd', width: 100, cellsalign: 'center' }
				]
			}, CtxMenu.NONE);

			$p2_evtTicketGrid.on('rowdoubleclick', function(event) {
				var rowData = event.args.row.bounddata;
                PMain.ticketMgmt(rowData);
            })
			
		},

		/** init data */
		initData : function() {
		    PMain.getTicketCnt();
		    PMain.search();
		},

		getTicketCnt: function(){
			var params = {period: 'ALL'};
			Server.get('/main/nms/evtTicketMgmt/getTicketCnt.do', {
				data: params,
				success: function(result) {
					$.each(result, function(key, value) {
						try {
							var obj = $('#p2_' + key);
							if(obj === undefined) return;
							if(parseInt(value) > 0){
								$('#ul_'+key).removeClass().addClass(key);
							}
							obj.text(HmUtil.commaNum(value));
						} catch(e) {}
					});
				}
			});
		},
		/** 공통 파라미터 */
		getCommParams: function() {
			return {
                period: 'ALL',
                ticketStateCd: p2_ticketStateCd
            };
		},

		search : function() {
		    var _disTicketStateCd = '';
		    switch(p2_ticketStateCd) {
                case '001': _disTicketStateCd = '접수대기1'; break;
                case '002': _disTicketStateCd = '조치중'; break;
                case '003': _disTicketStateCd = '조치완료'; break;
                case '004': _disTicketStateCd = '종결'; break;
				default: _disTicketStateCd = '전체'; break;
            }
            $('#p2_disTicketStateCd').text(_disTicketStateCd);
			HmGrid.updateBoundData($p2_evtTicketGrid, ctxPath + '/main/nms/evtTicketMgmt/getEvtTicketList.do');
		},

		ticketMgmt: function(rowData){
			var params = {
					ticketNo: rowData.ticketNo
			};
			$.post(ctxPath + '/main/popup/nms/pEvtTicketEdit.do',
					params,
					function(result) {
				HmWindow.openFit($('#pwindow'), '티켓 관리', result, 750, 660, 'pwindow_init', rowData);
			});
		},

		state: function(cd){
            p2_ticketStateCd = cd;
		    this.search();
		}
};

$(function() {
	PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});