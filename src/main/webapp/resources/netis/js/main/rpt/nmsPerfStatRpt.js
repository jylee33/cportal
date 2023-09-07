var $cpuGrid, $memGrid, $tempGrid, $restimeGrid ;
var ifGrpCnt = [];

var Main = {
	/** variable */
	initVariable : function() {
		$cpuGrid = $('#cpuGrid'), $memGrid = $('#memGrid'), $tempGrid = $('#tempGrid'), $restimeGrid = $('#restimeGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			case 'btnReport': this.report(); break;
			// case 'ckTimeSet': this.chgTimeSet(); break;
			case 'btnSchedule': this.showScheduleList(); break;
		}
	},

	/** init design */
	initDesign : function() {

		//2022.10.13 컴포넌트 변경
		HmBoxCondition.createPeriod('', null, null, 'sPerfCycle');
		HmDate.create($('#sDate1'), $('#sDate2'), HmDate.HOUR, 24 , HmDate.FS_MIDDLE);

		HmGrid.create($cpuGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json'
				},
				{
					formatData : function(data) {
						$.extend(data, Main.getCommParams());
						$.extend(data, {
							itemType: 1
						});
						return data;
					}
				}
			),
			showtoolbar: true,
			rendertoolbar: function(toolbar) {
				HmGrid.titlerenderer(toolbar, 'CPU 사용률(%)');
			},
			height : 270,
			pageable : false,
			columns:
				[
					{ text : 'No.', datafield : 'no', width: 50  ,cellsalign: 'right'},
					{ text : '장비', datafield : 'devName', minwidth: 100 },
					{ text : '평균', datafield : 'avgVal', width: 150  ,cellsalign: 'right'},
					{ text : '최대', datafield : 'maxVal', width: 150 ,cellsalign: 'right'}
				]
		});

		HmGrid.create($memGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json'

				},
				{
					formatData : function(data) {
						$.extend(data, Main.getCommParams());
						$.extend(data, {
							itemType: 2
						});
						return data;
					}
				}
			),
			showtoolbar: true,
			rendertoolbar: function(toolbar) {
				HmGrid.titlerenderer(toolbar, 'MEMORY 사용률(%)');
			},
			height : 270,
			pageable : false,
			columns:
				[
					{ text : 'No.', datafield : 'no', width: 50  ,cellsalign: 'right'},
					{ text : '장비', datafield : 'devName', minwidth: 100 },
					{ text : '평균', datafield : 'avgVal', width: 150  ,cellsalign: 'right'},
					{ text : '최대', datafield : 'maxVal', width: 150 ,cellsalign: 'right'}
				]
		});
		HmGrid.create($tempGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json'
				},
				{
					formatData : function(data) {
						$.extend(data, Main.getCommParams());
						$.extend(data, {
							itemType: 5
						});
						return data;
					}
				}
			),
			showtoolbar: true,
			rendertoolbar: function(toolbar) {
				HmGrid.titlerenderer(toolbar, '온도 사용률(ºC)');
			},
			height : 270,
			pageable : false,
			columns:
				[
					{ text : 'No.', datafield : 'no', width: 50  ,cellsalign: 'right'},
					{ text : '장비', datafield : 'devName', minwidth: 100 },
					{ text : '평균', datafield : 'avgVal', width: 150  ,cellsalign: 'right'},
					{ text : '최대', datafield : 'maxVal', width: 150 ,cellsalign: 'right'}
				]
		});
		HmGrid.create($restimeGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json'
				},
				{
					formatData : function(data) {
						$.extend(data, Main.getCommParams());
						$.extend(data, {
							itemType: 6
						});
						return data;
					}
				}
			),
			showtoolbar: true,
			rendertoolbar: function(toolbar) {
				HmGrid.titlerenderer(toolbar, '응답시간 사용률(msec.)');
			},
			height : 270,
			pageable : false,
			columns:
				[
					{ text : 'No.', datafield : 'no', width: 50  ,cellsalign: 'right'},
					{ text : '장비', datafield : 'devName', minwidth: 100 },
					{ text : '평균', datafield : 'avgVal', width: 150  ,cellsalign: 'right'},
					{ text : '최대', datafield : 'maxVal', width: 150 ,cellsalign: 'right'}
				]
		});

		// 회선그룹별 트래픽이용률!
		Server.get('/grp/getIfGrpTreeList.do', {
			success: function(result) {
				if(result != null && result.length > 0) {
					$.each(result, function(idx, value) {
						if(value.grpParent == 0) return;
						var grpId = 'ifGrp' + idx + 'Grid';
						var title = '<div style="clear: both; height: 26px;line-height:26px;font-weight:Bold"> 회선 정의 그룹 - ' + value.grpName + '</div>';
						var content = '<div style="width: 100%; clear: both; margin-bottom:5px;"><div id="' + grpId +'"></div></div>';
						$('#ifGrpDiv').append(title).append(content);
						ifGrpCnt.push(idx);

						HmGrid.create($('#' + grpId), {
							source: new $.jqx.dataAdapter(
								{
									datatype: 'json'
								},
								{
									formatData: function(data) {
										$.extend(data, Main.getCommParams());
										data.grpNo = value.grpNo;
										return data;
									}
								}
							),
							showtoolbar: true,
							rendertoolbar: function(toolbar) {
								HmGrid.titlerenderer(toolbar, '1.트래픽 이용률');
							},
							height: 250,
							columns:
								[
									{ text : '장비', datafield : 'devName', width: 150 },
									{ text : '회선', datafield : 'ifName', minwidth: 120 },
									{ text : '대역폭', datafield : 'lineWidth', width: 120 , cellsrenderer: HmGrid.unit1000renderer },
									{ text : '평균', columngroup : 'inbps', datafield : 'avgInbps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
									{ text : '최대', columngroup : 'inbps', datafield : 'maxInbps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
									{ text : '평균', columngroup : 'outbps', datafield : 'avgOutbps', width: 100 , cellsrenderer: HmGrid.unit1000renderer },
									{ text : '최대', columngroup : 'outbps', datafield : 'maxOutbps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
									{ text : '평균', columngroup : 'inLoad', datafield : 'avgInbpsPer', width: 100 ,cellsalign: 'right'},
									{ text : '최대', columngroup : 'inLoad', datafield : 'maxInbpsPer', width: 100 ,cellsalign: 'right'},
									{ text : '평균', columngroup : 'outLoad', datafield : 'avgOutbpsPer', width: 100 ,cellsalign: 'right'},
									{ text : '최대', columngroup : 'outLoad', datafield : 'maxOutbpsPer', width: 100 ,cellsalign: 'right'}
								],
							columngroups:
								[
									{ text: 'IN BPS', align: 'center', name: 'inbps' },
									{ text: 'OUT BPS', align: 'center', name: 'outbps' },
									{ text: 'IN BPS(%)', align: 'center', name: 'inLoad' },
									{ text: 'OUT BPS(%)',	 align: 'center', name: 'outLoad' }
								]
						});
					});
				}
			}
		});
	},

	/** init data */
	initData : function() {

	},

	/** 공통 파라미터 */
	getCommParams: function() {
		var isChecked = $('#sPeriod_4').is(':checked') + '' ;
		var time1 = $('#sDate1').val('date').getTime();
		var time2 = $('#sDate2').val('date').getTime();
		var tableCnt = 2;

		if(isChecked == 'false') { //시간설정을 미사용 할때
			if(((time2 - time1) / 1000) >= (7 * 24 * 60 * 60)) { //기간이 7일보다 크거나 같으면 3번 테이블 조회
				tableCnt = 3;
			}
		}

		var params = {
			ckTimeSet: isChecked,
			tableCnt: tableCnt,
			date1: HmDate.getDateStr($('#sDate1')),
			date2: HmDate.getDateStr($('#sDate2')),
			time1: $('#sDate1').val().substr(-2) + '00',
			time2: $('#sDate2').val().substr(-2) + '00',
		};
		return params;
	},

	/** 조회 */
	search : function() {
		var time1 = $('#sDate1').val(), time2 = $('#sDate2').val();
		if(time1 > time2) {
			alert('시작시간이 종료시간 이후일 수 없습니다.');
			return;
		}
		HmGrid.updateBoundData($cpuGrid, ctxPath + '/main/rpt/nmsPerfStatRpt/getDevPerfList.do' );
		HmGrid.updateBoundData($memGrid, ctxPath + '/main/rpt/nmsPerfStatRpt/getDevPerfList.do' );
		HmGrid.updateBoundData($tempGrid, ctxPath + '/main/rpt/nmsPerfStatRpt/getDevPerfList.do' );
		HmGrid.updateBoundData($restimeGrid, ctxPath + '/main/rpt/nmsPerfStatRpt/getDevPerfList.do' );
		for(var i = 0; i < ifGrpCnt.length; i++) {
			HmGrid.updateBoundData($('#ifGrp' + ifGrpCnt[i] + 'Grid'), ctxPath + '/main/rpt/nmsPerfStatRpt/getIfPerfList.do');
		}
	},

	/** export Excel */
	exportExcel: function() {
		HmUtil.exportExcel(ctxPath + '/main/rpt/nmsPerfStatRpt/export.do', Main.getCommParams());
	},

	/** 보고서 */
	report: function() {
		HmUtil.createPopup('/oz/viewer/perfStatRptViewer.do', $('#hForm'), 'oz', 1200, 700, Main.getCommParams());
	},

	/** 스케줄 파일 목록 보기 */
	showScheduleList: function() {
		HmUtil.createPopup('/oz/popup/pPerfStatFileList.do', $('#hForm'), 'ozpopup', 400, 600);
	}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});