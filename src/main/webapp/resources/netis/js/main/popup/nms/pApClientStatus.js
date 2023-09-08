var $p_clientGrid;

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

var PMain = {
		/** variable */
		initVariable: function() {
			$p_clientGrid = $('#p_clientGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'pbtnSearch': this.search(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			if($('#pInflow').val() == 'APC') {
				$('#p_lbSubTitle').text('컨트롤러 : ');
			}
			else {
				$('#p_lbSubTitle').text('AP');
			}
			
			HmGrid.create($p_clientGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/nms/apClients/getClientList.do'
						},
						{
							formatData: function(data) {
								// var _inflow = $('#pInflow').val();
								// data.grpType = 'DEFAULT';
								// if(_inflow == 'APC') {
								// 	data.itemKind = 'DEV';
								// 	data.grpNo = $('#pMngNo').val();
								// }
								// else {
								// 	data.itemKind = 'GROUP';
									data.grpNo = 1;
									data.apNo = $('#pMngNo').val();
								// }
								return data;
							}
						}
				),
				columns: 
				[
					{ text: '접속자 ID', datafield: 'connId', width: 150, pinned: true },
					{ text: 'AP 명', datafield: 'apName', width: 150, pinned: true },
					{ text: 'SSID 명', datafield: 'apSsid', width: 120, pinned: true },
					{ text: '접속자 또는 디바이스명', datafield: 'connName', minwidth: 150 },
					{ text: '접속자 IP', datafield: 'connIp', width: 120 },
					{ text: '접속자 MAC', datafield: 'connMac', width: 150 },
					{ text: "접속자 인증 방식", datafield: "connAuth", width: 150 },
					{ text: "접속 유지 시간", datafield: "connStayTime", width: 120, cellsrenderer: HmGrid.cTimerenderer },
					{ text: "접속자 수신Byte", datafield: "connRxByte", width: 120, cellsrenderer: HmGrid.unit1024renderer },
					{ text: "접속자 송신Byte", datafield: "connTxByte", width: 120, cellsrenderer: HmGrid.unit1024renderer }
				 ]
			}, CtxMenu.AP_CLIENT);
		},
		
		/** init data */
		initData: function() {
			PMain.search();
		},
		
		search: function() {
			HmGrid.updateBoundData($p_clientGrid);
		},
		
		linkrenderer: function(row, column, value) {
			return '<div style="margin-left: 2px; margin-top: 2px;"><a href="javascript: PMain.showClientDetail(' + row + ')">' + value + '</a></div>';
		},
		
		showClientDetail: function(row) {
			var rowdata = $p_clientGrid.jqxGrid('getrowdata', row);
			if(rowdata == null) return;
			var params = {
					apNo: rowdata.apNo,
					apSubNo: rowdata.apSubNo,
					connId: rowdata.connId
			};
			HmUtil.createPopup('/main/popup/nms/pApClientDetail.do', $('#hForm'), HmUtil.generateUUID(), 900, 420, params);
		}

};
