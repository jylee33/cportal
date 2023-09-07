var $tab = null, $policyGrid;
var hmPolicyGrid, hmCmdGrid, hmJobGrid;
var Main = {
	/** variable */
	initVariable : function() {
        $tab = $('#tab'), $policyGrid = $('#policyGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnSearch_pol': this.search(); break;
            case 'btnAdd_pol': this.addCliPolicy(); break;
            case 'btnEdit_pol': this.editCliPolicy(); break;
            case 'btnDel_pol': this.delCliPolicy(); break;
			case 'btnDist_pol': this.distCliPolicy(); break;
			case 'btnSet_pol': this.setConnInfo(); break;
			case 'btnSearch_cmd': this.searchCmd(); break;
            case 'btnSearch_job': this.searchJob(); break;
		}
	},

	/** init design */
	initDesign : function() {
		$tab.on('created', function() {
				$(this).css('visibility', 'visible');
			})
			.jqxTabs({ width: '100%', height: '100%', theme:  'ui-hamon-v1-tab-top',
                initTabContent: function(tab) {
				switch(tab) {
					case 0:
						HmJqxSplitter.create($('#policySplitter'), HmJqxSplitter.ORIENTATION_H, [{size: '40%'}, {size: '60%'}]);

						var adapter_policy = new HmDataAdapter('POST', ctxPath + '/main/env/cliJob/getCmdJobPolicyList.do', 'cmdPolicyNo')
							.create(
								function(data) {
									return data;
								},
								function (records) {
									try {
										$('#cmdGrid').jqxGrid('clear');
									} catch(e) {}
								}
							);
						adapter_policy.setDataFields([
							{name: 'cmdPolicyNo', type: 'number', text: '정책번호', width: 80, hidden: true},
							{name: 'cmdPolicyName', type: 'string', text: '정책명', minwidth: 200},
							{name: 'cmdPolicyDesc', type: 'string', text: '정책설명', minwidth: 200},
							{name: 'updDate', type: 'string', text: '등록일시', width: 160},
							{name: 'updUserNm', type: 'string', text: '등록자', width: 130}
						]);
						hmPolicyGrid = new HmJqxGrid('policyGrid', adapter_policy);
						hmPolicyGrid.create({
							editable: false,
							showtoolbar: true,
							rendertoolbar: function(toolbar) {
								HmGrid.titlerenderer(toolbar, '정책 설정');
							}
						}, CtxMenu.NONE);

						$policyGrid.on('rowselect', function(event) {
							Main.searchCmd(event.args.row.cmdPolicyNo);
						});

						// 명령어
						var adapter_cmd = new HmDataAdapter().create(
							function(data) {
								return data;
							},
							function (records) {

							}
						);
						adapter_cmd.setDataFields([
							{name: 'cmdPolicyNo', type: 'number', text: '정책번호', width: 80, hidden: true},
							{name: 'cmdNo', type: 'number', text: 'CMD_NO', width: 80, cellsalign: 'right', hidden: true},
							{name: 'cmdExecSeq', type: 'number', text: '실행순서', width: 80, cellsalign: 'right'},
							{name: 'command', type: 'string', text: '명령어', minwidth: 200},
							{name: 'cmdTimeOut', type: 'number', text: 'Timeout(초)', width: 130, cellsalign: 'right'},
							{name: 'updDate', type: 'string', text: '등록일시', width: 160, cellsalign: 'center'},
							{name: 'updUserNm', type: 'string', text: '등록자', width: 130}
						]);
						hmCmdGrid = new HmJqxGrid('cmdGrid', adapter_cmd);
						hmCmdGrid.create({
							editable: false,
							showtoolbar: true,
							rendertoolbar: function(toolbar) {
								HmGrid.titlerenderer(toolbar, '정책 명령어 설정');
							}
						}, CtxMenu.NONE);
						break;
					case 1:
						HmBoxCondition.createPeriod('');
						HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));

                        // Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));
						HmDropDownList.create($('#sCmdExecuteStatus'), {
							source: [
								{label: '전체', value: 'ALL'},
								{label: 'WAIT', value: 'WAIT'},
								{label: 'END', value: 'END'}
							], selectedIndex: 0, width: 100
						});
                        HmDropDownList.create($('#sCmdResult'), {
							source: [
								{label: '전체', value: -1},
								{label: '정상', value: 0},
								{label: '접속실패', value: 1},
								{label: '명령어수행실패', value: 2}
							], selectedIndex: 0, width: 120
						});

						var adapter_job = new HmDataAdapter('post', ctxPath + '/main/env/cliJob/getCmdJobResult.do')
							.create(
								function(data) {
									$.extend(data, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams());
									data.viewType = 'HIST';
									data.isAllDate = data.period == 'ALL'? 1 : 0;
									data.sCmdExecuteStatus = $('#sCmdExecuteStatus').val() || 'ALL';
									data.sCmdResult = $('#sCmdResult').val() || -1;
									// $.extend(data, {
									// 	viewType: 'HIST',
									// 	isAllDate: $('#chkAllDate').is(':checked')? 1 : 0,
									// 	date1: HmDate.getDateStr($('#date1')),
									// 	time1: HmDate.getTimeStr($('#date1')),
									// 	date2: HmDate.getDateStr($('#date2')),
									// 	time2: HmDate.getTimeStr($('#date2')),
									// 	sCmdExecuteStatus: $('#sCmdExecuteStatus').val() || 'ALL',
									// 	sCmdResult: $('#sCmdResult').val() || -1
									// });
									return data;
								}
							);
						adapter_job.setDataFields([
							{name: 'seqNo', type: 'number', text: '작업번호', width: 80, cellsalign: 'right', hidden: true},
							{name: 'mngNo', type: 'number', text: '장비번호', width: 80, cellsalign: 'right', hidden: true},
							{name: 'cmdPolicyNo', type: 'number', text: '정책번호', width: 80, cellsalign: 'right', hidden: true},
							{name: 'cmdExecuteDateTime', type: 'string', text: '작업일시', width: 160, cellsalign: 'center'},
							{name: 'cmdExecuteType', type: 'int', text: '작업유형', displayfield: 'disCmdExecuteType', width: 130, cellsalign: 'center'},
							{name: 'disCmdExecuteType', type: 'string'},
							{name: 'cmdPolicyName', type: 'string', text: '정책명', minwidth: 200},
							{name: 'cmdExecuteStatus', type: 'string', text: '작업상태', width: 160, cellsalign: 'center'},
							{name: 'grpName', type: 'string', text: '그룹명', width: 150},
							{name: 'devName', type: 'string', text: '장비명', width: 200},
							{name: 'cmdResult', type: 'int', text: '작업결과', displayfield: 'disCmdResult', width: 100},
							{name: 'disCmdResult', type: 'string'}
						]);
						hmJobGrid = new HmJqxGrid('jobGrid', adapter_job);
						hmJobGrid.create({
							groupable: true,
							groupsrenderer: function (text, group, expanded, data) {
								var tmp = data.subItems[0];
								return '<div class="jqx-grid-groups-row" style="position: absolute;">' +
									'<span>' + '작업일시: {0} ({1} 건), '.substitute(tmp.cmdExecuteDateTime, data.subItems.length) + '</span>' +
									'<span class="jqx-grid-groups-row-details" style="padding-left: 15px">[작업유형: {0}, 정책명: {1}]</span></div>'
											.substitute(tmp.disCmdExecuteType, tmp.cmdPolicyName);
							},
							showgroupsheader: false,
							groups: ['seqNo']
						}, CtxMenu.COMM);
						$('#jobGrid').on('bindingcomplete', function() {
							$(this).jqxGrid('expandallgroups');
						}).on('rowdoubleclick', Main.showJobResult);
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
		HmGrid.updateBoundData($('#policyGrid'));
	},

	searchCmd: function(cmdPolicyNo) {
		if(cmdPolicyNo === undefined) {
			var rowdata = HmGrid.getRowData($('#policyGrid'));
			if(rowdata == null) {
				alert('정책을 선택하세요.');
				return;
			}
			cmdPolicyNo = rowdata.cmdPolicyNo;
		}

		Server.post('/main/env/cliJob/getCmdJobBundleList.do', {
			data: {cmdPolicyNo: cmdPolicyNo},
			success: function(result) {
				hmCmdGrid.updateLocalData(result);
			}
		});
	},

	addCliPolicy: function() {
		$.post(ctxPath + '/main/popup/env/pCliJobPolicyAdd.do', function(result) {
			HmWindow.open($('#pwindow'), '정책 추가', result, 1000, 605);
		});
	},

    editCliPolicy: function() {
		var rowdata = HmGrid.getRowData($policyGrid);
		if(rowdata == null) {
			alert("정책을 선택하세요.");
			return;
		}
		$.post(ctxPath + '/main/popup/env/pCliJobPolicyEdit.do', rowdata, function(result) {
            HmWindow.open($('#pwindow'), '정책 수정', result, 1000, 605, 'pwindow_init', rowdata);
        });
    },

    delCliPolicy: function() {
        var rowdata = HmGrid.getRowData($('#policyGrid'));
        if(rowdata == null) {
            alert("정책을 선택하세요.");
            return;
        }
        if(!confirm('[{0}] 정책을 삭제하시겠습니까?'.substitute(rowdata.cmdPolicyName))) return;

        Server.post('/main/env/cliJob/delCmdJobPolicy.do', {
        	data: { cmdPolicyNo: rowdata.cmdPolicyNo },
			success: function(result) {
        		$('#policyGrid').jqxGrid('deleterow', rowdata.uid);
                $('#cmdGrid').jqxGrid('clear');
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
        $.post(ctxPath + '/main/popup/env/pCliJobPolicyDist.do', function(result) {
            HmWindow.open($('#pwindow'), '정책 배포', result, 1200, 600, 'pwindow_init', rowdata);
        });
	},

	/* 접속정보 설정 */
	setConnInfo: function() {
		$.post(ctxPath + '/main/popup/env/pCliJobConnInfoSet.do', function(result) {
			HmWindow.open($('#pwindow'), '접속정보 설정', result, 1200, 600, 'pwindow_init');
		});
	},

    /** 작업이력 */
    searchJob: function() {
    	hmJobGrid.updateBoundData();
    },

	showJobResult: function() {
    	var rowdata = HmGrid.getRowData($('#jobGrid'));
    	if(rowdata == null) {
    		return;
		}
		$.post(ctxPath + '/main/popup/env/pCliJobResult.do',
			rowdata,
			function(result) {
				HmWindow.open($('#pwindow'), '작업결과 상세', result, 800, 600);
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