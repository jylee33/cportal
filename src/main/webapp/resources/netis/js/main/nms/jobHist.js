var $cbPeriod;
var $jobGrid, $targetGrid;
var isApprHidden = false, timer;
var ctxmenuIdx = 1;

var Main = {
    /** variable */
    initVariable: function() {
        $cbPeriod = $('#cbPeriod');
        $jobGrid = $('#jobGrid'), $targetGrid = $('#targetGrid');
        this.initCondition();
    },

    initCondition: function() {
        // 기간
        HmBoxCondition.createPeriod('');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnScheduler': this.showScheduler(); break;
            case 'btnAdd': this.addJob(); break;
            case 'btnEdit': this.editJob(); break;
            case 'btnDel': this.delJob(); break;
            case 'btnQuit': this.quitJob(); break;
            case 'btnSearch': this.search(); break;
            case "btnExcel": this.exportExcel('job'); break;
            case 'btnExcel_target': this.exportExcel('target'); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#contentSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        // Main.createPeriodCondition($('#date1'), $('#date2'));
        Master.createGrpTab(Main.search);
        HmGrid.create($jobGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields:[
                        { name:'regDate', type:'string' },
                        { name:'fromYmdhms', type:'string' },
                        { name:'toYmdhms', type:'string' },
                        { name:'jobLevelStr', type:'string' },
                        { name:'jobName', type:'string' },
                        { name:'disJobType', type:'string' },
                        { name:'admin', type:'string' },
                        { name:'contact', type:'string' },
                        { name:'reqUserNm', type:'string' },
                        { name:'icmpPoll', type:'string' },
                        { name:'isSms', type:'string' },
                        { name:'keyNo', type:'number' },
                        { name:'jobType', type:'string' }
                    ]
                },
                {
                    formatData : function(data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    loadComplete: function(records) {
                        $targetGrid.jqxGrid('clear');
                        // var cnt = records.resultData != null? records.resultData.length : 0;
                        // document.getElementById('totalLabel').innerHTML = 'total : ' + cnt;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '작업내역');
            },
            columns:
                [
                    // { text : '작업상태', datafield : 'jobFlag', width: 80, cellsalign: 'center', hidden: isApprHidden },
                    { text : '등록일시', datafield : 'regDate', width: 130, cellsalign: 'center' },
                    { text : '시작일시', datafield : 'fromYmdhms', width: 130, cellsalign: 'center' },
                    { text : '종료일시', datafield : 'toYmdhms', width: 130, cellsalign: 'center' },
                    { text : '중요도', datafield : 'jobLevelStr',  width: 80, cellsrenderer: HmGrid.jobLevelrenderer, filtertype:'checkedlist' },
                    { text : '작업명', datafield : 'jobName',  minwidth: 200 },
                    { text : '작업유형', datafield : 'disJobType', width : 80, cellsalign: 'center', filtertype: 'checkedlist' },
                    // { text : '그룹', datafield : 'grpName', width : 130 },
                    // { text : '작업대상', datafield : 'jobTargetInfo', width : 200 },
                    // { text : '종류', datafield : 'devKind2', width: 120 },
                    { text : '관리자', datafield : 'admin', width: 80 },
                    { text : '연락처', datafield : 'contact', width: 100 },
                    { text : '작업등록자', datafield: 'reqUserNm', width: 80 },
                    { text : '성능수집여부', datafield: 'icmpPoll', width: 80, columntype: 'checkbox', filtertype:'checkedlist' },
                    { text : '작업문자안내', datafield: 'isSms', width: 80, columntype: 'checkbox', filtertype:'checkedlist' }
                ]
        }, CtxMenu.COMM, ctxmenuIdx++);
        $jobGrid.on('rowselect', function(event) {
            setTimeout(Main.searchTarget, 100);
        });

        HmGrid.create($targetGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'POST',
                    contenttype: 'application/json',
                    datafields:[
                        { name:'grpName', type:'string' },
                        { name:'devName', type:'string' },
                        { name:'devIp', type:'string' },
                        { name:'devKind2', type:'string' },
                        { name:'model', type:'string' },
                        { name:'vendor', type:'string' },
                        { name:'ifName', type:'string' },
                        { name:'ifAlias', type:'string' },
                        { name:'lineWidth', type:'string' },
                        { name:'targetInfo', type:'string' }
                    ]
                },
                {
                    formatData : function(data) {
                        var jobRow = HmGrid.getRowData($jobGrid);
                        if(jobRow != null) {
                            data.jobType = jobRow.jobType;
                            data.keyNo = jobRow.keyNo;
                        }
                        else {
                            data.jobType = '';
                            data.keyNo = -1;
                        }
                        return JSON.stringify(data);
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '작업 대상');
            },
            columns:
                [
                    { text: '그룹', datafield: 'grpName', width: 150 },
                    { text: '장비', datafield: 'devName', minwidth: 150 },
                    { text: '장비IP', datafield: 'devIp', width: 120 },
                    { text: '장비종류', datafield: 'devKind2', width: 120, filtertype: 'checkedlist' },
                    { text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist' },
                    { text: '제조사', datafield: 'vendor', width: 150, filtertype: 'checkedlist' },
                    { text: '회선', datafield: 'ifName', minwidth: 130 },
                    { text: '회선 별칭', datafield: 'ifAlias', width: 150 },
                    { text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                    { text : '작업대상', datafield : 'targetInfo', hidden: true }
                ]
        }, CtxMenu.COMM);

        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function() {
        Main.search();
    },

    /** 공통 파라미터 */
    getCommParams: function() {
        var params = Master.getGrpTabParams();
        $.extend(params, HmBoxCondition.getPeriodParams());
        if(params.period == 'ALL') {
            params.period = 0;
        }
        return params;
    },

    /** 조회 */
    search: function() {
      /*  Master.refreshCbPeriod($cbPeriod);*/
        HmGrid.updateBoundData($jobGrid, ctxPath + '/main/nms/jobHist/getJobHistList.do' );
    },

    /** 작업대상 조회 */
    searchTarget: function() {
        var row = HmGrid.getRowData($jobGrid);
        if(row != null) {
            var isDev = row.jobType == 'DEV';
            $targetGrid.jqxGrid('beginupdate');
            $targetGrid.jqxGrid(isDev? 'hidecolumn' : 'showcolumn', 'ifName');
            $targetGrid.jqxGrid(isDev? 'hidecolumn' : 'showcolumn', 'ifAlias');
            $targetGrid.jqxGrid(isDev? 'hidecolumn' : 'showcolumn', 'lineWidth');
            $targetGrid.jqxGrid('endupdate');
        }
        HmGrid.updateBoundData($targetGrid, ctxPath + '/main/nms/jobHist/getJobHistTargetList.do');
    },

    /** 달력보기 */
    showScheduler: function() {
        HmUtil.createPopup(ctxPath + '/main/popup/nms/pJobScheduler.do', $('#hForm'), 'pScheduler', screen.availWidth - 200, screen.availHeight - 150);
    },

    /** 작업등록 */
    addJob: function() {
        $.post(ctxPath + '/main/popup/nms/pJobAdd.do',
            null,
            function(result) {
                HmWindow.open($('#pwindow'), '작업등록', result, 760, 695);
            }
        );
    },

    /** 작업 권한 체크 */
    checkJobAuth: function(reqUser) {

        var sAuth = ($('#sAuth').val() || 'User').toUpperCase(),
            sUserId = $('#sUserId').val();

        // system계정이 아니고 작성자가 아니면 편집 불가
        var isAuth = (sAuth != 'SYSTEM'&& sAuth != 'ADMIN' && sUserId != reqUser)? false : true;


        if(!isAuth) {
            alert('권한이 없습니다.');
        }

        return isAuth;

    },

    /** 작업수정 */
    editJob: function() {

        var rowdata = HmGrid.getRowData($jobGrid);
        if(rowdata == null) {
            alert('작업을 선택하세요.');
            return;
        }
        // system계정이 아니고 작성자가 아니면 편집 불가
        if(!Main.checkJobAuth(rowdata.reqUser)) return;

        if(rowdata.jobType == 'DEV') {
            $.post(ctxPath + '/main/popup/nms/pJobEdit.do',
                { jobType: 'DEV', keyNo: rowdata.keyNo, mngNo: rowdata.mngNo },
                function(result) {
                    HmWindow.open($('#pwindow'), '장비 작업수정', result, 760, 695);
                }
            );
        } else if(rowdata.jobType == 'IF') {
            $.post(ctxPath + '/main/popup/nms/pJobEdit.do',
                { jobType: 'IF', keyNo: rowdata.keyNo, mngNo: rowdata.mngNo, ifIdx: rowdata.ifIdx },
                function(result) {
                    HmWindow.open($('#pwindow'), '회선 작업수정', result, 750, 695);
                }
            );
        }
    },

    /** 작업 삭제 */
    delJob: function() {
        var rowdata = HmGrid.getRowData($jobGrid);
        if(rowdata == null) {
            alert('작업을 선택하세요.');
            return;
        }

        // system계정이 아니고 작성자가 아니면 편집 불가
        if(!Main.checkJobAuth(rowdata.reqUser)) return;

        if(!confirm('선택된 작업을 삭제하시겠습니까?')) return;
        if(rowdata.jobType == 'DEV') {
            Server.post('/main/nms/jobHist/delDevJobHist.do', {
                data: {keyNo: rowdata.keyNo},
                success: function (result) {
                    $jobGrid.jqxGrid('deleterow', rowdata.uid);
                    alert(result);
                }
            });
        }
        else if(rowdata.jobType == 'IF') {
            Server.post('/main/nms/jobHist/delIfJobHist.do', {
                data: { keyNo: rowdata.keyNo },
                success: function(result) {
                    $jobGrid.jqxGrid('deleterow', rowdata.uid);
                    alert(result);
                }
            });
        }
    },

    /** 작업 종료 */
    quitJob: function() {
        var rowdata = HmGrid.getRowData($jobGrid);
        if(rowdata == null) {
            alert('작업을 선택하세요.');
            return;
        }
        // system계정이 아니고 작성자가 아니면 편집 불가
        if(!Main.checkJobAuth(rowdata.reqUser)) return;

        if(!confirm('선택된 작업을 종료하시겠습니까?')) return;
        if(rowdata.jobType == 'DEV') {
            Server.post('/main/nms/jobHist/saveDevJobHistQuit.do', {
                data: { keyNo: rowdata.keyNo },
                success: function(result) {
                    Main.search();
                    alert('작업을 종료하였습니다.');
                },
                error: function(result) {
                    alert(result.errorInfo.message);
                }
            });
        }
        else if(rowdata.jobType == 'IF') {
            Server.post('/main/nms/jobHist/saveIfJobHistQuit.do', {
                data: { keyNo: rowdata.keyNo },
                success: function(result) {
                    Main.search();
                    alert('작업을 종료하였습니다.');
                },
                error: function(result) {
                    alert(result.errorInfo.message);
                }
            });
        }
    },

    /** export Excel */
    exportExcel: function(type) {
        if(type == 'job') {
            HmUtil.exportGrid($jobGrid, '작업관리', false);
        }
        else if(type == 'target') {
            var jobData = HmGrid.getRowData($jobGrid);
            if(jobData == null) {
                alert('작업을 선택하세요.');
                return;
            }
            HmUtil.exportGrid($targetGrid, '작업대상_{0}'.substitute(jobData.jobName), false);
        }
    },

    /** =============================
     * 작업관리 검색조건 별도
     ==============================*/
    createPeriodCondition: function($date1, $date2) {
        if($('#reDate').val() == null || $('#reDate').val() ==undefined || $('#reDate').val() =='null'){
            HmDate.create($date1, $date2, HmDate.DAY, 0);
        }else{
            var _reDate = $('#reDate').val();
            var yyyy = _reDate.substr(0,4);
            var mm = parseInt(_reDate.substr(4,2)) - 1;
            var dd = _reDate.substr(6,2);
            var toDate = new Date(yyyy, mm, dd);
            var fromDate = new Date(yyyy, mm, dd);
            fromDate.setHours(0,0,0,0);
            toDate.setHours(23,59,59,59);
            $date1.add($date2).jqxDateTimeInput({ width: 130, height: '21px', formatString: 'yyyy-MM-dd HH:mm', theme: jqxTheme });
            $date1.jqxDateTimeInput('setDate', fromDate);
            $date2.jqxDateTimeInput('setDate', toDate);
        }
        $date1.add($date2).jqxDateTimeInput({ disabled: false });

        //구분 라디오 버튼 클릭 이벤트
        $("input:radio[name=cbPeriod]").click(function(){
            if($("input[name='cbPeriod']:checked").val() == "-1"){//사용자설정
                $('#date1').add( $('#date2')).jqxDateTimeInput({ disabled: false });
            }else{
                Main.radioCbPeriodCondition($("input[name='cbPeriod']:checked"), $('#date1'), $('#date2'));
            }
        });
        Main.radioCbPeriodCondition($("input[name='cbPeriod']:checked"), $('#date1'), $('#date2'));

        /*  $combo.jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
           displayMember: 'label', valueMember: 'value', selectedIndex: 0,
           source: [
               { label: '전체', value: 0 },
               { label: '최근24시간', value: 1 },
               { label: '최근1주일', value: 7 },
               { label: '최근1개월', value: 30 },
               { label: '최근1년', value: 365 },
               { label: '사용자설정', value: -1 }
           ]
       })
           .on('change', function(event) {
               switch(String(event.args.item.value)) {
                   case '-1':
                       $date1.add($date2).jqxDateTimeInput({ disabled: false }); break;
                   default:
                       var toDate = new Date();
                       var fromDate = new Date();
                       fromDate.setDate(fromDate.getDate() - parseInt(event.args.item.value));
                       $date1.jqxDateTimeInput('setDate', fromDate);
                       $date2.jqxDateTimeInput('setDate', toDate);
                       $date1.add($date2).jqxDateTimeInput({ disabled: true });
                       break;
               }
           });*/
    },
    //기간 조건 라디오버튼
    radioCbPeriodCondition: function($combo, $date1, $date2) {
        var toDate = new Date();
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - parseInt($combo.val()));
        $date1.jqxDateTimeInput('setDate', fromDate);
        $date2.jqxDateTimeInput('setDate', toDate);
        $date1.add($date2).jqxDateTimeInput({ disabled: true });
    },
};

function refresh() {
    Main.search();
}

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});