var $subIp_grpTree , $trafficStatGrid , $rtEvtStatGrid , $rtEvtGrid;
var selectMngNo = 0 , selectGrpNo = 1  , selectParentGrpNo = 0 ;
var lastWeekChk = false, lastDayChk = false;
var isEqual = false , trfParams = null;
var visibleId = '#divTOTAL';
var rtTimer = null;

var Main = {
    /** variable */
    initVariable: function () {
        $subIp_grpTree = $('#subIp_grpTree');
        $trafficStatGrid = $('#trafficStatGrid');
        $rtEvtStatGrid = $('#rtEvtStatGrid');
        $rtEvtGrid = $('#rtEvtGrid');
        this.initCondition();
    },

    initCondition: function () {
        // search condition

    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
        });
        $('#dtTOTALYesterday, #dtAllLastweek').bind('change', function(event) {
            var target = event.currentTarget;
            if(target.checked) {
                if(target.id == 'dtTOTALYesterday') {
                    $("#dtAllLastweek").prop('checked', false);
                }
                else if(target.id == 'dtAllLastweek') {
                    $("#dtTOTALYesterday").prop('checked', false);
                }
            }
            lastDayChk = $("#dtTOTALYesterday").is(':checked');
            lastWeekChk = $("#dtAllLastweek").is(':checked');
            // Main.search();
        });

        $("input[name='dtCondition']").bind('change', function(event){
           // Main.search();
        });

    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            // Main.search();
        }
    },

    /** init design */
    initDesign: function () {
        //검색바 호출.
        $('#section').css('display', 'block');
        // Master.createSearchBar1('', '', $("#srchBox"));

        // HmWindow.create($('#pwindow'), 600, 400);
        // HmTreeGrid.create($subIp_grpTree, HmTree./*T_GRP_DEF_ALL*/T_GRP_IP, null , {}, ['grpName']);
        HmTreeGrid.create($subIp_grpTree, HmTree./*T_GRP_DEF_ALL*/T_GRP_IP2, null , {}, ['grpName']);
        HmJqxSplitter.createTree($('#mainSplitter'));

        HmJqxSplitter.create($('#rightSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: "40%" }, { size: '60%' }], '100%', '100%', {showSplitBar: true});
        HmJqxSplitter.create($('#midSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: "50%" }, { size: '50%' }], '100%', '100%', {showSplitBar: true});
        HmJqxSplitter.create($('#staticSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: "50%" }, { size: '50%' }], '100%', '100%', {showSplitBar: true});

        // $('div[name=tfStandard]').jqxRadioButton({ width: 75, height: 21 });

        $('#prgrsBar').jqxProgressBar({ width : 100, height : 21, theme : jqxTheme, showText : true, animationDuration: 0 });
        // $('#prgrsBar').on('complete', function(event) {
        //     Main.search();
        //     $(this).val(0);
        // });

        $('#cbTimeBar').jqxDropDownList(
            {
                width : 100,
                height : 21,
                theme : jqxTheme,
                autoDropDownHeight : true,
                source : [
                    { label : '1시간', value : 1 },
                    { label : '2시간', value : 2 },
                ], displayMember : 'label', valueMember : 'value', selectedIndex : 0 }).on('change', function() {
            Main.chgTimeBar();
        });

        $('input[name=reCycle]').on('click', function(event){
            // Main.search();
        });


        $('input[name=tfStandard]').on('click', function(event){
            var targetId = event.target.id;

            //1.상세조건 컨트롤
            var selectStandard = event.target.defaultValue;
            var viewId = "#div"+selectStandard+"";
            $("div[name=divDT]").css('display', 'none');
            $(viewId).css('display', 'block');
            visibleId = viewId;

            //2. 상세조건 div 보이면서 첫번째 항목 선택 하도록 함 (총량일때는 선택 없음)
            if(targetId != "tfStandardTOTAL"){
                $(viewId).find("input[name='dtCondition']").first().prop('checked', true);
            }

           //3. 조건들로 그래프 + 통계 조회
           //  Main.search();

        });

        $('#section').css('display', 'block');

    },

    /** init data */
    initData: function () {

        // Server.get('/main/tms2/tmsEvtConf/getSubnetList.do', {
        //     data: {},
        //     success: function (result) {
        //         if(result != null) {
        //             setTimeout(function(){ // 텀을 줌 - 트리에 반영되고 IP 가 매핑되야 하기 때문에
        //                 $.each(result, function(idx, item) {
        //                     $subIp_grpTree.jqxTreeGrid('addRow', item.subNo+'|'+item.ip , { grpNo: item.subNo, grpName: item.ip }, 'last' , item.subGrpNo );
        //                     // $subIp_grpTree.jqxTreeGrid('addRow', null , { grpNo: item.subNo, grpName: item.ip }, null , item.subGrpNo );
        //                 });
        //             }, 100);
        //         }
        //     }
        // });

        $subIp_grpTree.on('rowClick',
        function (event)
        {

            //HmTreeGrid.getSelectedItem($grpTree);
            selectMngNo = 0 , selectGrpNo = 1  , selectParentGrpNo = 0 ;
            var args = event.args;
            var row = args.row;
            var key = args.key;

            // console.dir(row);
            // console.dir(key);

            if(row.grpNo == 1 && ( row.parent == null || row.parent == undefined ) ){
                selectGrpNo = Number(row.grpNo);
                selectParentGrpNo = 0;
                // Main.searchEvt();
            }else{
                selectParentGrpNo = row.parent.grpNo;
                selectGrpNo = row.grpNo;
                if(key.includes("_")){
                    const rowArr = row.grpNo.split("_");
                    selectParentGrpNo = Number(rowArr[0]);
                    selectGrpNo = Number(rowArr[0]);
                    selectMngNo = '';
                    selectMngNo = Number(rowArr[1]);
                }
            }
            // console.log("selectParentGrpNo:"+selectParentGrpNo); // 선택한 값의 부모, 즉 그룹넘버
            // console.log("selectGrpNo:"+selectGrpNo); // 선택한 값
            // console.log("selectMngNo:"+selectMngNo);

        });

        // Server.get('/main/tms2/tmsEvtConf/getTmsCodeList.do', {
        //     data: {
        //         codeKind : 'TMS_EVT_RULE_PROTOCOL'
        //     },
        //     success: function(result) {
        //         $.each(result, function (idx, item) {
        //             console.log( "item codeId , codeValue1 사용 해서 radio button 만들기 ");
        //             console.dir(item);
        //         });
        //     }
        // });

    },


    search: function () {
        isEqual = false;
        TrfAnalysis.initDesign(); //그래프 초기화
        Main.clearTimer(); //타임머 초기화
        Main.refreshMon(isEqual); //검색 후
        Main.startTimer(); //타이머 시작
        isEqual = true;
    },

    refreshMon : function(isEqual){
        var params = Main.getCommParams();
        trfParams = params;
        if(typeof TrfAnalysis !== 'undefined' && TrfAnalysis) { //트래픽 추이
            TrfAnalysis.search( params ,  isEqual );
        }
        if(typeof TrfStat !== 'undefined' && TrfStat) { //트래픽 통계
            TrfStat.search(params);
        }
        if(typeof RtEvt !== 'undefined' && RtEvt) { //실시간 이벤트
            RtEvt.search(params);
        }
        if(typeof RtEvtStat !== 'undefined' && RtEvtStat) { //실시간 이벤트 통계
            RtEvtStat.search(params);
        }

    },

    // /** 새로고침 주기 변경 */
    // chgRefreshCycle : function() {
    //     var cycle = $('#cbRefreshCycle').val();
    //     if (timer != null)
    //         clearInterval(timer);
    //     if (cycle > 0) {
    //         timer = setInterval(function() {
    //             var curVal = $('#prgrsBar').val();
    //             if (curVal < 100)
    //                 curVal += 100 / cycle;
    //             $('#prgrsBar').val(curVal);
    //         }, 1000);
    //     } else {
    //         $('#prgrsBar').val(0);
    //     }
    // },

    chgTimeBar: function(){
        //그래프의 x 축 변경,,
        // 현재 기준으로 2시간 전인지 이런거

    },

    /** 공통 파라미터 */
    getCommParams: function() {

        var _date1, _date2, _time1, _time2;
        var pastDate = new Date();
        var nowDate  = new Date();
        pastDate.setHours(pastDate.getHours() - $('#cbTimeBar').val() );
        pastDate.setMinutes(pastDate.getMinutes() - 1 );
        nowDate.setMinutes(nowDate.getMinutes() - 1 );

        _date1 = $.format.date(pastDate, 'yyyyMMdd');
        _time1 = $.format.date(pastDate, 'HHmm00');

        _date2 = $.format.date(nowDate, 'yyyyMMdd');
        _time2 = $.format.date(nowDate, 'HHmm59');

        // console.dir($('input[name=tfSD]:checked').val());


        var params = {
            'grpNo' : selectMngNo != 0 ? selectParentGrpNo : selectGrpNo ,
            'mngNo' : selectMngNo != 0 ? selectMngNo : 0 ,
            'cbTimeBar' : $('#cbTimeBar').val(),
            'reCycle'  : $('input[name=reCycle]:checked').val(),
            // 'tfInOut'  : $('input[name=tfInOut]:checked').val(),
            'tfSD'  : $('input[name=tfSD]:checked').val(),
            'tfStandard'  : $('input[name=tfStandard]:checked').val(),
            'dtCondition' : $(visibleId).find("input[name='dtCondition']:checked").val(),
            'date1' : _date1 ,
            'date2' : _date2 ,
            'time1' : _time1 ,
            'time2' : _time2 ,
        };
        return params;
    },

    startTimer: function() {
        if(rtTimer != null) return;
        rtTimer = setInterval('Main.refreshMon(isEqual);', $('input[name=reCycle]:checked').val() );
    },

    clearTimer: function() {
        if(rtTimer != null) {
            clearInterval(rtTimer);
            rtTimer = null;
        }
    },

};


$(function () {
    Main.clearTimer();
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});
