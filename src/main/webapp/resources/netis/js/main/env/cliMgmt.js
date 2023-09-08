var $tab = null;
var Main = {
	/** variable */
	initVariable : function() {
        $tab = $('#tab');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnSearch_pol': this.searchCliPolicy(); break;
            case 'btnAdd_pol': this.addCliPolicy(); break;
            case 'btnEdit_pol': this.editCliPolicy(); break;
            case 'btnDel_pol': this.delCliPolicy(); break;
			case 'btnDist_pol': this.distCliPolicy(); break;
            case 'btnSearch_job': this.searchJobHist(); break;
		}
	},

	/** init design */
	initDesign : function() {
		$tab.on('created', function() {
				$(this).css('visibility', 'visible');
			})
			.jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function(tab) {
				switch(tab) {
					case 0:
						$('#policySplitter').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'vertical', panels: [{size: '60%'}, {size: '40%'}]});
						HmGrid.create($('#policyGrid'), {
							source: new $.jqx.dataAdapter({
									datatype: 'json'
								}, {
									loadComplete: function(records) {
                                        $('#policyCmd').empty();
									}
								}
							),
							ready: function() {
                                Main.searchCliPolicy();
							},
							columns: [
                                { text: '정책번호', datafield: 'policyNo', width: 80, hidden: true },
                                { text: '정책명', datafield: 'name', width: 250 },
                                { text: '설명', datafield: 'explanation' },
                                { text: '등록일시', datafield: 'applyDate', width: 160, cellsalign: 'center' }
							]
						}, CtxMenu.COMM, 'policy');
						$('#policyGrid').on('rowselect', function(event) {
							$('#policyCmd').html(event.args.row.contents.replace(/\n/ig, '<br>'));
						});
						break;
					case 1:
                        Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));

                        HmGrid.create($('#jobGrid'), {
                            source: new $.jqx.dataAdapter({
                                    datatype: 'json'
                                }, {
                            		formatData: function(data) {
                            			$.extend(data, {
                                            isAllDate: $('#chkAllDate').is(':checked')? 1 : 0,
                                            date1: HmDate.getDateStr($('#date1')),
                                            time1: HmDate.getTimeStr($('#date1')),
                                            date2: HmDate.getDateStr($('#date2')),
                                            time2: HmDate.getTimeStr($('#date2'))
										});
										return data;
									}
								}
                            ),
                            ready: function() {
                                Main.searchJobHist();
                            },
                            groupable: true,
                            groupsrenderer: function (text, group, expanded, data) {
                                var tmp = data.subItems[0];
                            	return '<div class="jqx-grid-groups-row" style="position: absolute;">' +
									'<span>' + '작업일시: {0} ({1} 건), '.substitute(tmp.jobDate, data.subItems.length) + '</span>' +
									'<span class="jqx-grid-groups-row-details" style="padding-left: 15px">[작업타입: {0}, 정책명: {1}]</span></div>'.substitute(tmp.disJobType, tmp.policyNm);
                            },
                            showgroupsheader: false,
                            columns: [
                                { text: '작업번호', datafield: 'jobNo', width: 60, cellsalign: 'center', hidden: true },
								{ text: '장비번호', datafield: 'mngNo', width: 60, cellsalign: 'center', hidden: true },
                            	{ text: '등록일시', datafield: 'regDate', width: 160, cellsalign: 'center' },
                                { text: '작업일시', datafield: 'jobDate', width: 160, cellsalign: 'center' },
                                { text: '작업종료일시', datafield: 'finishDate', width: 160, cellsalign: 'center' },
                                { text: '작업타입', datafield: 'disJobType', width: 100, cellsalign: 'center' },
                                { text: '작업유형', datafield: 'jobKind', width: 100, cellsalign: 'center' },
                                { text: '정책명', datafield: 'policyNm', width: 150 },
                                { text: '장비명', datafield: 'devName', minwidth: 150 },
                                { text: '작업상태', datafield: 'jobStatus', width: 100, cellsalign: 'center' },
                                { text: '작업결과', datafield: 'jobResult', width: 160, cellsalign: 'center' },
                                { text: '등록자', datafield: 'regUserNm', width: 100 }
                            ],
                            groups: ['jobNo']
                        }, CtxMenu.CLI_JOB, 'job');
                        $('#jobGrid').on('bindingcomplete', function() {
                            $(this).jqxGrid('expandallgroups');
						});
                        break;
				}
			}
		});
	},

	/** init data */
	initData: function() {

	},

	/** 작업관리 */
	searchCliPolicy: function() {
		HmGrid.updateBoundData($('#policyGrid'), ctxPath + '/main/env/cliMgmt/getPolicyList.do');
	},

	addCliPolicy: function() {
		$.post(ctxPath + '/main/popup/env/pCliPolicyAdd.do', function(result) {
			HmWindow.open($('#pwindow'), 'CLI 정책 추가', result, 1000, 600);
		});
	},

    editCliPolicy: function() {
		var rowdata = HmGrid.getRowData($('#policyGrid'));
		if(rowdata == null) {
			alert("정책을 선택하세요.");
			return;
		}
		$.post(ctxPath + '/main/popup/env/pCliPolicyEdit.do', function(result) {
            HmWindow.open($('#pwindow'), 'CLI 정책 수정', result, 1000, 600, 'pwindow_init', rowdata);
        });
    },

    delCliPolicy: function() {
        var rowdata = HmGrid.getRowData($('#policyGrid'));
        if(rowdata == null) {
            alert("정책을 선택하세요.");
            return;
        }
        if(!confirm('[{0}] 정책을 삭제하시겠습니까?'.substitute(rowdata.name))) return;

        Server.post('/main/env/cliMgmt/delPolicy.do', {
        	data: { policyNo: rowdata.policyNo },
			success: function(result) {
        		$('#policyGrid').jqxGrid('deleterow', rowdata.uid);
                $('#policyCmd').empty();
        		alert('삭제되었습니다.');
			}
		});
    },

    distCliPolicy: function() {
        var rowdata = HmGrid.getRowData($('#policyGrid'));
        if(rowdata == null) {
            alert("정책을 선택하세요.");
            return;
        }
        $.post(ctxPath + '/main/popup/env/pCliPolicyDist.do', function(result) {
            HmWindow.open($('#pwindow'), 'CLI 정책 배포', result, 1200, 600, 'pwindow_init', rowdata);
        });
	},

    /** 작업이력 */
    searchJobHist: function() {
        HmGrid.updateBoundData($('#jobGrid'), ctxPath + '/main/env/cliMgmt/getJobHist.do');
    },
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});