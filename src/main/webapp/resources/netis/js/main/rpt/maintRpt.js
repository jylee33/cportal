var $maintGrid;
var editMaintIds = [];
var isAdmin;
var Main = {
		/** variable */
		initVariable : function() {
            var auth= $('#sAuth').val().toUpperCase();
            if(auth == 'SYSTEM' || auth == 'ADMIN') isAdmin = true;
			$maintGrid = $('#maintGrid');
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
			case "btnAdd": this.addMaint(); break;
			case "btnEdit": this.editMaint(); break;
			case "btnDel": this.delMaint(); break;
			case "btnSet": this.setMaintCode(); break;
			case "btnExcel": this.exportExcel(); break;
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
            Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));
            
            $('#sCompanyNm').jqxDropDownList({
                source: HmDropDownList.getSourceByUrl('/main/rpt/maintRpt/getMaintCodeList.do', {maintCode: 'COMPANY_NM_CD', useFlag: 1}),
                displayMember: 'maintValue', valueMember: 'maintId', width: 150, height: 22, dropDownHeight: 250, selectedIndex:0, theme: jqxTheme
            })
            
            
            HmWindow.create($('#pwindow'));
            HmGrid.create($maintGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
                    },
                    {
                        formatData: function(data) {
                            data.date1 = HmDate.getDateStr($('#date1'));
                            data.time1 = HmDate.getTimeStr($('#date1'));
                            data.date2 = HmDate.getDateStr($('#date2'));
                            data.time2 = HmDate.getTimeStr($('#date2'));
                            // var companyNm =  $('#sCompanyNm').jqxDropDownList('getSelectedItem').originalItem;
                            // data.sCompanyNm = companyNm.maintId;
                           return data;
                        }
                    },
                    {
                        loadComplete: function(records) {
                            editMaintIds = [];
                        }
                    }
                ),
                editmode: 'selectedrow',
                columns:
                    [
                        { text : 'No', datafield : 'maintNo', width: 80 },
                        { text : '일자', datafield : 'regDate', width: 140 },
                        { text : '제목', datafield : 'maintHist' },
                        { text : '협력사명', datafield : 'companyNm' },
                        { text : '지원담당자', datafield : 'companyMgr', width:80 },
                        { text : '구분', datafield : 'maintKind', displayfield: 'disMaintKind', width:80 },
                        { text : '지원방식', datafield : 'supportMethod', displayfield: 'disSupportMethod', width:80 },
                        { text : '제조사', datafield : 'vendor', displayfield: 'disVendor' },
                        { text : '품목', datafield : 'subject', displayfield: 'disSubject' },
                        { text : '고객사 명', datafield : 'custNm', displayfield: 'disCustNm' },
                        { text : '담당자', datafield : 'custMgr', width:80 , displayfield: 'disCustMgr' },
                        { text : '리포트 출력', datafield : 'print', width:80, cellsrenderer: function(row, columnfield, value){
                                var maintData = $maintGrid.jqxGrid('getrowdata', row);

                                // 다운로드 이미지 추가
                                var cell = '<div style="overflow: hidden; text-align: center; padding-bottom: 2px; margin-top: 2px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';

                                    // cell += '<a style="cursor: pointer" href='+ ctxPath + "/main/rpt/maintRpt/exportRpt.do?maintNo=" + maintData.maintNo+'><div class="p_btnExportExcelGrid" style="display:inline-block"></div></a>'
                                    cell += '<a style="cursor: pointer" href="javascript:Main.exportRpt('+ row +');"><div class="p_btnExportExcelGrid" style="display:inline-block"></div></a>'

                                cell += '</div>';
                                return cell;
                            }
                        },
                        { text : '첨부파일', datafield : 'attachment', width:80, cellsrenderer: function(row, columnfield, value){
                                var maintData = $maintGrid.jqxGrid('getrowdata', row);
                                // 다운로드 이미지 추가
                                var cell = '<div style="overflow: hidden; text-align: center; padding-bottom: 2px; margin-top: 2px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';

                                if(maintData.fileNm != null){
                                    cell += '<a style="cursor: pointer" href='+ ctxPath + "/main/rpt/maintRpt/download.do?maintNo=" + maintData.maintNo+'><div class="p_btnExportExcelGrid" style="display:inline-block"></div></a>'
                                }
                                cell += '</div>';
                                return cell;
                            }
                        },
                        /*{ text : '파일명', datafield : 'fileNm', width:80, hidden: true },
                        { text : '원본파일명', datafield : 'orgFileNm', width:80, hidden: true },
                        { text : '첨부파일', datafield : 'fileType', width:80, hidden: true },
                        { text : '첨부파일', datafield : 'fileSize', width:80, hidden: true },*/
                        { text : '시작시간', datafield : 'jobStartDate', width:80, hidden: true },
                        { text : '종료시간', datafield : 'jobEndDate', width:80, hidden: true },
                        { text : '비고', datafield : 'remarks' }
                    ]
            });
            Main.search();
		},

		/** init data */
		initData : function() {
		},


		/** 조회 */
		search : function() {
            HmGrid.updateBoundData($maintGrid, ctxPath + '/main/rpt/maintRpt/getMaintRptList.do');
		},

    addMaint: function(){
        $.post(ctxPath + '/main/popup/rpt/pMaintAdd.do',
            function (result) {
                HmWindow.open($('#pwindow'), '유지보수 등록', result, 800, 700, 'pwindow_init');
            }
        );
	},
    editMaint: function(){

        var rowIdx = HmGrid.getRowIdx($maintGrid, '항목을 선택해주세요.');
        if(rowIdx === false) return;

        var maintGridData = $maintGrid.jqxGrid('getrowdata', rowIdx);



        $.post(ctxPath + '/main/popup/rpt/pMaintEdit.do',
            maintGridData,
            function (result) {
                HmWindow.open($('#pwindow'), '유지보수 수정', result, 800, 700, 'pwindow_init', maintGridData);
            }
        );
    },
    delMaint: function(){
        var rowidx = HmGrid.getRowIdx($maintGrid, '선택된 데이터가 없습니다.');
        if(rowidx === false) return;

        if(!confirm('정기점검 보고서를 삭제하시겠습니까?')) return;
        var _maintNo = $maintGrid.jqxGrid('getrowdata', rowidx).maintNo;
        var _uid = $maintGrid.jqxGrid('getrowdata', rowidx).uid;
        // var _maintNos= [], _uids = [];
        // $.each(rowIdxes, function(idx, value) {
        //     var tmp = $maintGrid.jqxGrid('getrowdata', value);
        //     _maintNos.push(tmp.maintNo);
        //     _uids.push(tmp.uid);
        // });

        Server.post('/main/rpt/maintRpt/delMaintRpt.do', {
            data: { maintNo: _maintNo },
            success: function(result) {
                $maintGrid.jqxGrid('deleterow', _uid);
                alert('삭제되었습니다.');
            }
        });
    },
    setMaintCode: function(){
        $.post(ctxPath + '/main/popup/rpt/pMaintSetting.do',
            function (result) {
                HmWindow.open($('#pwindow'), '항목 관리', result, 400, 400, 'pwindow_init');
            }
        );
    },

    exportRpt: function(row){
        // $.post(ctxPath + '/main/popup/rpt/pMaintRpt.do',
        //     function (result) {
        //         HmWindow.open($('#pwindow'), '정기점검 관리', result, 1000, 800, 'pwindow_init');
        //     }
        // );
        var maintData = $maintGrid.jqxGrid('getrowdata', row);

        var toDate = new Date();
        var yyyy = toDate.getFullYear();
        var mm = toDate.getMonth();
        var dd = toDate.getDate();
        var params = {
            maintNo: maintData.maintNo,
            custNm: maintData.custNm,
            disCustMgr: maintData.disCustMgr,
            companyNm: maintData.companyNm,
            companyMgr: maintData.companyMgr,
            companyCell: maintData.companyCell,
            vendor: maintData.vendor,
            disMaintKind: maintData.disMaintKind,
            disSupportMethod: maintData.disSupportMethod,
            maintHist: maintData.maintHist,
            content: maintData.content,
            jobStartDate: maintData.jobStartDate,
            jobEndDate: maintData.jobEndDate,
            yyyy: yyyy,
            mm: mm+1,
            dd: dd
        };


         HmUtil.createPopup(ctxPath + '/main/popup/rpt/pMaintRpt.do', $('#hForm'), 'exportRpt'+maintData.maintNo, 900, 700, params);
    }


};
function formatDateTime(date, time) {
    var str = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);
    str += ' ' + time.substr(0, 2) + ':' + time.substr(2, 2);
    return str;
}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});