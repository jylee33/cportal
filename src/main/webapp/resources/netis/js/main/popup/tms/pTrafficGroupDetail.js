var $p_dtlGrid;
var _isSizeHidden = false, _isFlagHidden = false;

var PMain = {
		/** variable */
		initVariable: function() {
			$p_dtlGrid = $('#p_dtlGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'pbtnClose': self.close(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmDate.create($('#date1'), $('#date2'), HmDate.HOUR, 6);
			HmGrid.create($p_dtlGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								$.extend(data, {
									grpNo: $('#grpNo').val(),
									date1: HmDate.getDateStr($('#date1')),
									time1: HmDate.getTimeStr($('#date1')),
									date2: HmDate.getDateStr($('#date2')),
									time2: HmDate.getTimeStr($('#date2'))
								});
								return data;
							}
						}
				),
				columns: 
					[
					 	{ text: '그룹번호', datafield: 'grpNo', minwidth: 130, pinned: true, hidden: true },
						{ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true },
						{ text: 'BYTES(%)', datafield: 'bytesPer', cellsalign: 'right', width: 100 },
						{ text: 'PACKET(%)', datafield: 'pktPer', cellsalign: 'right', width: 100 },
						{ text: 'HOST수(%)', datafield: 'hostPer', cellsalign: 'right', width: 100 },
						{ text: 'Bytes', datafield: 'bytes', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1024renderer },
						{ text: 'Packet', datafield: 'pkt', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
						{ text: 'BPS', datafield: 'bps', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
						{ text: 'PPS', datafield: 'pps', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
						{ text: 'Host수', datafield: 'hostCnt', cellsalign: 'right', width: 100 },
						{ text: 'P64', datafield: 'p64', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
						{ text: 'P128', datafield: 'p128', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
						{ text: 'P256', datafield: 'p256', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
						{ text: 'P512', datafield: 'p512', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
						{ text: 'P1024', datafield: 'p1024', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
						{ text: 'P1518', datafield: 'p1518', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
						{ text: 'POVER', datafield: 'pover', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
						{ text: 'URG', datafield: 'urg', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
						{ text: 'ACK', datafield: 'ack', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
						{ text: 'PSH', datafield: 'psh', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
						{ text: 'RST', datafield: 'rst', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
						{ text: 'SYN', datafield: 'syn', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
						{ text: 'FIN', datafield: 'fin', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden }
				    ]						
				}, CtxMenu.GRP_DETAIL);
		},
		/** init data */
		initData: function() {
		},
		/** 조회 */
		search: function() {
			url = ctxPath + '/main/tms/trafficCompare/getGrpTrafficCompareList.do';
			HmGrid.updateBoundData($p_dtlGrid, url);
		}
}
$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});