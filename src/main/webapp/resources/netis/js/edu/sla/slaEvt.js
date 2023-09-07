var $infoGrid;

var Main = {
        SLA_STATE_CD: {
            //NONE -> 소명신청 -> 검토중 -> 반려 -> 보완완료(재요청) -> 소명거부 -> 소명완료
            NONE: 0, REQ: 1, CHECK: 2,  RETURN: 3, REREQ: 4, REJECT: 5, APPROVE: 6
        },



		/** variable */
		initVariable: function() {
			$infoGrid = $('#infoGrid');
			sessAuth = $('#sAuth').val().toUpperCase();
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
                case 'btnSearch': this.search(); break;
                case 'btnExcel': this.exportExcel(); break;
                case 'btnAct': this.showAction(); break;
                case 'btnRpt': this.showReport(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
            HmJqxSplitter.createTree($('#mainSplitter'));
            Master.createGrpTab2(Main.selectTree);
            $('#sDate1').jqxDateTimeInput({width: 120, height: 21, formatString: 'yyyy-MM', theme: jqxTheme, culture: 'ko-KR', views: ["year", "decade"]});

			HmGrid.create($infoGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
                        type: 'post',
                        contentType: 'application/json',
                        id: 'seqNo',
                        // 필터위해 미리 추가
                        // datafields:[
                        //     { name:'seqNo', type:'number' },
                        //     { name:'slaSeqNo', type:'number' },
                        //     { name:'slaActionCd', type:'string' },
                        //     { name:'slaStateCd', type:'string' },
                        //     { name:'slaReqUserNm', type:'string' },
                        //     { name:'slaApprUserNm', type:'string' },
                        //     { name:'disIspCd', type:'string' },
                        //     { name:'srcInfo', type:'string' },
                        //     { name:'evtStartdate', type:'string' },
                        //     { name:'evtFreedate', type:'string' },
                        //     { name:'sumSec', type:'number' },
                        //     { name:'slaSumSec', type:'number' },
                        // ]
                    },
                    {
                        formatData: function(data) {
                            $.extend(data, Main.getCommParams());
                            return JSON.stringify(data);
                        }
                    }
                ),
                selectionmode: 'checkbox',
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
                columns:
                [
                    { text : 'SEQ', datafield : 'seqNo', width : 60, pinned: true, hidden: true },
                    { text : 'SLA_SEQ', datafield : 'slaSeqNo', width : 60, pinned: true, hidden: true },
                    { text : '장애통보', datafield : 'slaActionCd', width : 100, cellsrenderer: HmGrid.slaActionrenderer },
                    { text : '소명관리', datafield : 'slaStateCd', width : 100, cellsrenderer: HmGrid.slaStaterenderer },
                    { text : '소명신청자', datafield : 'slaReqUserNm', width: 120, cellsalign: 'center'},
                    { text : '소명처리자', datafield : 'slaApprUserNm', width: 120, cellsalign: 'center'},
                    { text : '통신사', datafield : 'disIspCd', width : 70, cellsalign: 'center' },
                    { text : '장애대상', datafield : 'srcInfo', minwidth : 250 },
                    { text : '시작일시', datafield : 'evtStartdate', width : 160, cellsalign: 'center' },
                    { text : '종료일시', datafield : 'evtFreedate', width: 160, cellsalign: 'center' },
                    { text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
                    { text : 'SLA 지속시간', datafield : 'slaSumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer, editable: false }
                ]
            }, CtxMenu.COMM, 'infoGrid');

            $('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {

		},

		getCommParams: function() {
            var params = Master.getGrpTabParams();
            params.yyyymm = $.format.date($('#sDate1').val('date'), 'yyyyMM');
			return params;
		},

        /** 그룹트리 선택이벤트 */
        selectTree: function() {
            Main.search();
        },
		
		/** 조회 */
		search: function() {
			HmGrid.updateBoundData($infoGrid, ctxPath + '/main/sla/slaEvt/getSlaEvtList2.do');
		},

		/** export Excel */
		exportExcel: function() {
		    HmUtil.exportGrid($infoGrid, 'SLA장애', false);
		},

        /** 통보서 */
        showAction: function() {
            var list = HmGrid.getRowDataList($infoGrid);
            if(list == null) {
                alert('장애를 선택하세요.');
                return;
            }
            var seqNoList = [];
            $.each(list, function(i,v) {
                seqNoList.push(v.seqNo);
            });

            HmUtil.createPopup('/main/popup/sla/pSlaEvtAction.do', $('#hForm'), 'pSlaEvtAction', 820, 600, {seqNoList: seqNoList});
        },

    /** 소명 */
    showReport: function() {

        var list = HmGrid.getRowDataList($infoGrid);
        if(list == null) {
            alert('장애를 선택하세요.');
            return;
        }
        var seqNoList = [];
        $.each(list, function(i,v) {
            seqNoList.push(v.seqNo);
        });
        HmUtil.createPopup('/main/popup/sla/pErrSlaReport.do', $('#hForm'), 'pErrSlaReport', 820, 720, {seqNoList: seqNoList});

    },

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

function callbackState(seqNo, datafield, value) {
    var rowdata = $('#infoGrid').jqxGrid('getrowdatabyid', seqNo);
    $('#infoGrid').jqxGrid('setcellvaluebyid', seqNo, datafield, value);
}