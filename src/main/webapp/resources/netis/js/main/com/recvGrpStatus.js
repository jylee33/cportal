var $recvDevGrid, $recvUserGrid, $recvStatEvtGrid, $recvLimitEvtGrid;
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;
var evtLevelList = [];
var editRecvStatEvtIds = [];
var editRecvLimitEvtIds = [];
var isAdmin;
var userId;
var Main = {
		/** variable */
		initVariable: function() {
	        /*권한이 admin이나 system이면 true*/
	        var auth= $('#sAuth').val().toUpperCase();
	        if(auth == 'SYSTEM' || auth == 'ADMIN') isAdmin = true;
	        userId = $('#sUserId').val();
			$recvUserGrid = $('#recvUserGrid');
			$recvDevGrid = $('#recvDevGrid');
			$recvStatEvtGrid = $('#recvStatEvtGrid');
			$recvLimitEvtGrid = $('#recvLimitEvtGrid');
			evtLevel1Text = $('#sEvtLevel1').val();
			evtLevel2Text = $('#sEvtLevel2').val();
			evtLevel3Text = $('#sEvtLevel3').val();
			evtLevel4Text = $('#sEvtLevel4').val();
			evtLevel5Text = $('#sEvtLevel5').val();
			evtLevelList = [ { label: evtLevel1Text, value: 1 }, { label: evtLevel2Text, value: 2 }, { label: evtLevel3Text, value: 3 }, { label: evtLevel4Text, value: 4 }, { label: evtLevel5Text, value: 5 } ];
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			}
		},

		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmJqxSplitter.create($('#recvEvt_mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%' }, { size: '50%' }], 'auto', '100%');

			$('#ddbUser').jqxDropDownButton({ width: 200, height: 22, theme: jqxTheme })
				.on('open', function(event) {
					$('#recvUserGrid').css('display', 'block');
				});
			
	        $('#recvGrp').jqxDropDownList({
//	            source: new $.jqx.dataAdapter(
//	                {
//	                    datatype: 'json',
//	                    url: ctxPath + '/main/com/recvGrpMgmt/getRecvGrpList.do'
//	                }
//	            ),
	            displayMember: 'recvGrpName', valueMember: 'recvGrpNo', width: 150, height: 22, theme: jqxTheme,selectedIndex: 0
	        }).on('change', function(){
	        	Main.searchInfo();
	        });
			
			
			HmGrid.create($recvUserGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/com/recvGrpStatus/getRecvUserList.do'
						},
						{
							formatData: function(data) {
								data.isAdmin = isAdmin;
		                		return data;
							}
						}
				),
				editmode: 'selectedrow',
				width: '600px',
				columns:
				[
                    { text : '아이디', datafield: 'userId', width: 70, editable: false },
			 		{ text : '이름', datafield: 'userName', width: 200, editable: false },
			 		{ text : '소속', datafield: 'deptName', minwidth: 200, editable: false },
			 		{ text : '휴대폰', datafield: 'cellTel', width: 120, editable: false }
				]
			});
			
			$recvUserGrid.on('bindingcomplete', function(event) {
				var rows = $recvUserGrid.jqxGrid('getboundrows');
				$.each(rows, function(i,v){
					console.log(v)
					if(v.userId == userId){
						$recvUserGrid.jqxGrid('selectrow', v.boundindex);
					}
				});
				Main.searchRecvGrp();
			}).on('rowselect', function(event) {
				var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
				if(rowdata === undefined) return;
				var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.userName + '</div>';
				$('#ddbUser').jqxDropDownButton('setContent', content);
			}).on('rowdoubleclick', function(event){
				Main.searchRecvGrp();
				$('#ddbUser').jqxDropDownButton('close'); 
			});
			
			
			
			
			
			HmGrid.create($recvDevGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/com/recvGrpMgmt/getRecvDevList.do'
						},
						{
							formatData: function(data) {
								$.extend(data, {
									recvGrpNo: $('#recvGrp').val()
								});
								return data;
							}
						}
				),
				columns:
					[
					 { text : '그룹명', datafield: 'grpName' },
					 { text : '장비명', datafield: 'devName' },
					 { text : '대표IP', datafield: 'devIp' },
					 { text : '종류', datafield: 'devKind2', filtertype: 'checkedlist' },
					 { text : '모델', datafield: 'model', filtertype: 'checkedlist' },
					 { text : '제조사', datafield: 'vendor', filtertype: 'checkedlist' }
					 ]
			});
				HmGrid.create($recvStatEvtGrid, {
					source: new $.jqx.dataAdapter(
							{
								datatype: 'json',
								updaterow: function(rowid, rowdata, commit) {
									if(editRecvStatEvtIds.indexOf(rowid) == -1)
										editRecvStatEvtIds.push(rowid);
					            	commit(true);
					            },
							},
							{
								formatData: function(data) {
									$.extend(data, {
										recvGrpNo: $('#recvGrp').val(),
										codeType: 0
									});
								return data;
								},
								loadComplete: function(records) {
									editRecvStatEvtIds = [];
								}
							}
					),
					showtoolbar: true,
		            rendertoolbar: function(toolbar) {
		                HmGrid.titlerenderer(toolbar, '발송 이벤트(상태)');
		            },
		            editable: false,
					columns:
						[
						 { text : '이벤트명', datafield: 'evtName', editable: false, },
						 { text : 'SMS', datafield: 'isRecvSms', columnType: 'checkbox' },
						 { text : 'Mail', datafield: 'isRecvEmail', columnType: 'checkbox' },
						 { text : 'Push', datafield: 'isRecvPush', columnType: 'checkbox' }
						 ]
				});

				HmGrid.create($recvLimitEvtGrid, {
					source: new $.jqx.dataAdapter(
							{
								datatype: 'json',
								updaterow: function(rowid, rowdata, commit) {
									if(editRecvLimitEvtIds.indexOf(rowid) == -1)
										editRecvLimitEvtIds.push(rowid);
					            	commit(true);
					            },
							},
							{
								formatData: function(data) {
									$.extend(data, {
										recvGrpNo: $('#recvGrp').val(),
										codeType: 1
									});
									return data;
								},
								loadComplete: function(records) {
									editRecvLimitEvtIds = [];
								}
							}
					),
					
					showtoolbar: true,
		            rendertoolbar: function(toolbar) {
		                HmGrid.titlerenderer(toolbar, '발송 이벤트(대상)');
		            },
		            editable: false,
					columns:
						[
						 { text : '이벤트명', datafield: 'evtName', editable: false },
						 { text: '등급', datafield: 'evtLevel', displayfield: 'disEvtLevel', width: 100, columntype: 'dropdownlist',
								createeditor: function(row, value, editor) {
									editor.jqxDropDownList({ source: evtLevelList, autoDropDownHeight: true,
										displayMember: 'label', valueMember: 'value' });
								}
						 },	
						 { text : 'SMS', datafield: 'isRecvSms', columnType: 'checkbox' },
						 { text : 'Mail', datafield: 'isRecvEmail', columnType: 'checkbox' },
						 { text : 'Push', datafield: 'isRecvPush', columnType: 'checkbox' }
						 ]
				});
		},

		/** init data */
		initData: function() {

		},
		
		searchRecvGrp: function(){
			var ridx = HmGrid.getRowIdx($recvUserGrid);
			if(ridx === false) return;
			Server.get('/main/com/recvGrpStatus/getRecvGrpList.do', {
				data: { userId: $recvUserGrid.jqxGrid('getrowdata', ridx).userId },
				success: function(data) {
					console.log(data)
					$('#recvGrp').jqxDropDownList({ source: data, selectedIndex: 0 });
				}
			})
		},
		
		searchInfo: function(){
			HmGrid.updateBoundData($recvDevGrid);
			HmGrid.updateBoundData($recvStatEvtGrid, ctxPath + '/main/com/recvGrpMgmt/getRecvEvtList.do');
			HmGrid.updateBoundData($recvLimitEvtGrid, ctxPath + '/main/com/recvGrpMgmt/getRecvEvtList.do');
		}
		

}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});