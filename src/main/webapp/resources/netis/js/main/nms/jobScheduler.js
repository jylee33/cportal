var $devScheduler, $ifScheduler;

var Main = {
		/** variable */
		initVariable: function() {
			$devScheduler = $('#devScheduler'), $ifScheduler = $('#ifScheduler');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnAdd': this.addJob(); break;
			case 'btnSearch': this.search(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			$('#mainTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
				initTabContent: function(tab) {
					switch(tab) {
					case 0: // 장비
						var source =
			            {
			                dataType: 'json',
			                dataFields: [
			                    { name: 'keyNo', type: 'long' },
			                    { name: 'regDate', type: 'string', format: 'yyyy-MM-dd HH:mm:ss' },
			                    { name: 'fromYmdhms', type: 'string', format: 'yyyy-MM-dd HH:mm:ss' },
			                    { name: 'toYmdhms', type: 'date', format: 'yyyy-MM-dd HH:mm:ss' },
			                    { name: 'grpName', type: 'string' },
			                    { name: 'devName', type: 'string' },
			                    { name: 'devIp', type: 'string' },
			                    { name: 'devKind2', type: 'string' },
			                    { name: 'jobName', type: 'string' },
			                    { name: 'jobContent', type: 'string' },
			                    { name: 'admin', type: 'string' },
			                    { name: 'contact', type: 'string' }
			                ],
			                id: 'keyNo',
			                url: ctxPath + '/main/nms/jobScheduler/getDevJobList.do'
			            };
			            var adapter = new $.jqx.dataAdapter(source);
						$devScheduler.jqxScheduler({
							date: new $.jqx.date('todayDate'),
							width: '100%',
							height: '100%',
							source: adapter,
							view: 'monthView',
							showLegend: true,
							resources: {
								colorScheme: 'scheme03',
								dataField: 'admin',
								source: new $.jqx.dataAdapter(source)
							},
							appointmentDataFields: {
								from: 'fromYmdhms',
								to: 'toYmdhms',
								id: 'keyNo',
								description: 'jobContent',
								location: 'contact',
								subject: 'jobName',
								resourceId: 'admin'
							},
							views: [ 'dayView', 'weekView', 'monthView' ],
//							contextMenuItemClick: function (menu, appointment, event)
//							{
//								event.stopPropagation();
//								return false;
//							},
							editDialogCreate: function(dialog, fields, editAppointment) {
								dialog.jqxWindow('close'); //강제종료
//								HmWindow.create($('#pwindow'), 880, 650);
//								dialog = $('#pwindow');
//								$.post(ctxPath + '/main/popup/nms/pDevJobAdd.do', 
//										null,
//										function(result) {
//											$('#pwindow').jqxWindow({ title: '<h1>장비 작업등록</h1>', content: result, position: 'center', resizable: false });
//											$('#pwindow').jqxWindow('open');
//										}
//								); 
//								return;
//								fields.repeatContainer.hide();
//								fields.timeZoneContainer.hide();
//								fields.resourceContainer.show();
//								// display text
//								fields.subjectLabel.html('제목');
//								fields.locationLabel.html('연락처');
//								fields.fromLabel.html("시작일시");
//								fields.allDayLabel.html("종일");
//			                    fields.toLabel.html("종료일시");
//			                    fields.descriptionLabel.html("작업내역");
//			                    fields.colorLabel.html("색상");
//			                    fields.stautsLabel.html("작업상태");
//			                    fields.resourceLabel.html("담당자");
							},
							localization: {
								editDialogTitleString: "<h1>Edit Appointment</h1>"
							}
						})
						.on('appointmentDoubleClick', function(event) {
							var args = event.args;
							var appointment = args.appointment;
							event.stopPropagation();
							return false;
						});
						break;
						
					case 1: //회선
						
						break;
					}
				}
			});			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 조회 */
		search: function() {
			
		},
		
		/** 작업등록 */
		addJob: function() {
			HmWindow.create($('#pwindow'), 750, 660);
			$.post(ctxPath + '/main/popup/nms/pJobAdd.do',
					null,
					function(result) {
						$('#pwindow').jqxWindow({ title: '<h1>장비 작업등록</h1>', content: result, position: 'center', resizable: false });
						$('#pwindow').jqxWindow('open');
					}
			); 
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});