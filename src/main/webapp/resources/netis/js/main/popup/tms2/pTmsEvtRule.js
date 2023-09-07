var $ruleGrid;

var PMain = {
    /** variable */
    initVariable: function () {
        $ruleGrid = $("#ruleGrid_t");
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            PMain.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'pbtnAdd':
                this.addEvtRule();
                break;
            case 'pbtnEdit' :
                this.editEvtRule();
                break;
            case 'pbtnDel':
                this.delEvtRule();
                break;
            case 'pbtnUser':
                this.addEvtRuleToUser();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        HmGrid.create($ruleGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    url: ctxPath + '/main/tms2/tmsEvtConf/getTmsEvtRuleList.do',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [ // 필터위해 추가
                        {name: 'evtSeq', type: 'number'},
                        {name: 'evtNm', type: 'string'},
                        {name: 'userEvtNm', type: 'string'},
                        {name: 'inOutCd', type: 'string'},
                        {name: 'evtVc', type: 'string'},
                        {name: 'pfUnitCd', type: 'string'},
                        {name: 'minValue', type: 'string'},
                        {name: 'atkIpCnt', type: 'string'},
                        {name: 'protocol', type: 'int'},
                        {name: 'protocolStr', type: 'string'},
                        {name: 'protocolInc', type: 'int'},
                        {name: 'srcPort', type: 'string'},
                        {name: 'srcPortInc', type: 'int'},
                        {name: 'dstPort', type: 'string'},
                        {name: 'dstPortInc', type: 'int'},
                        {name: 'flowCnt', type: 'string'},
                        {name: 'evtLevel', type: 'string'},
                        {name: 'evtLevelStr', type: 'string'},
                        {name: 'tcpFlag', type: 'string'},
                        {name: 'tcpFlagStr', type: 'string'},
                        {name: 'tcpFlagInc', type: 'int'},
                        {name: 'useYn', type: 'string'},
                        {name: 'useYnStr', type: 'bool'},
                        {name: 'evtDesc', type: 'string'},

                    ]
                },
                {
                    formatData: function (data) {
                        // $.extend(data, Master.getGrpTabParams(), HmBoxCondition.getPeriodParams(),
                        //     HmBoxCondition.getSrchParams(), {mngNo: -1});
                        return JSON.stringify(data);
                    },
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns:
                [
                    {text: 'evtSeq', datafield: 'evtSeq', width: 50, hidden: true, cellsalign: 'center'},
                    {text: '이벤트명', datafield: 'evtNm', width: 120, cellsalign: 'center'},
                    {text: '사용자 이벤트명', datafield: 'userEvtNm', width: 150, hidden: false, cellsalign: 'center'},
                    {text: '트래픽 구분', datafield: 'inOutCd', width: 90, hidden: false, cellsalign: 'center'},
                    {text: '이벤트 분류', datafield: 'evtVc', width: 90, hidden: false, cellsalign: 'center'},
                    {text: '단위', datafield: 'pfUnitCd', width: 80, hidden: false, cellsalign: 'center'},
                    {text: '최소 임계값', datafield: 'minValue', width: 90, hidden: false, cellsalign: 'center'},
                    {text: '공격 IP 개수', datafield: 'atkIpCnt', width: 90, hidden: false, cellsalign: 'center'},
                    {text: '프로토콜', datafield: 'protocolStr', displayfield: 'protocolInc', width: 80, hidden: false, cellsalign: 'center'},
                    {text: '출발지 PORT', datafield: 'srcPort', displayfield: 'srcPortInc', width: 90, hidden: false, cellsalign: 'center'},
                    {text: '목적지 PORT', datafield: 'dstPort', displayfield: 'dstPortInc', width: 90, hidden: false, cellsalign: 'center'},
                    {text: '동일 flow 수', datafield: 'flowCnt', width: 90, hidden: false, cellsalign: 'center'},
                    {text: '임계치 레벨', datafield: 'evtLevelStr', width: 80, hidden: false, cellsalign: 'center'},
                    {text: 'TCP Flags', datafield: 'tcpFlagStr', displayfield: 'tcpFlagInc', width: 150, hidden: false, cellsalign: 'center'},
                    {
                        text: '사용',
                        datafield: 'useYnStr',
                        width: 70,
                        hidden: false,
                        cellsalign: 'center',
                        columntype: 'checkbox'
                    },
                    {text: '이벤트 설명', datafield: 'evtDesc', hidden: false, cellsalign: 'center'},
                ],

        }, CtxMenu.COMM);

    },

    /** init data */
    initData: function () {

    },

    search: function () {
        HmGrid.updateBoundData($ruleGrid, ctxPath + '/main/tms2/tmsEvtConf/getTmsEvtRuleUserList.do');
    },

    addEvtRule: function () {

        $.get(ctxPath + '/main/popup/tms2/pEvtRuleAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '이벤트 추가', result, 600, 510, 'pwindow_init');
        });

    },

    editEvtRule: function () {

        var rowIdxes = HmGrid.getRowIdxes($ruleGrid, '이벤트를 선택해주세요.');
        if (rowIdxes === false) return;

        if (rowIdxes.length > 1) {
            alert('이벤트를 하나만 선택해주세요.');
            return false;
        }

        var rowdata = $ruleGrid.jqxGrid('getrowdata', rowIdxes[0]);

        var params = {
            evtSeq: rowdata.evtSeq,
            evtNm: rowdata.evtNm,
            userEvtNm: rowdata.userEvtNm,
            inOutCd: rowdata.inOutCd,
            evtVc: rowdata.evtVc,
            pfUnitCd: rowdata.pfUnitCd,
            minValue: rowdata.minValue,
            atkIpCnt: rowdata.atkIpCnt,
            protocol: rowdata.protocol,
            protocolInc: rowdata.protocolInc,
            srcPort: rowdata.srcPort,
            srcPortInc: rowdata.srcPortInc,
            dstPort: rowdata.dstPort,
            dstPortInc: rowdata.dstPortInc,
            flowCnt: rowdata.flowCnt,
            evtLevel: rowdata.evtLevel,
            tcpFlagStr: rowdata.tcpFlagStr,
            tcpFlagInc: rowdata.tcpFlagInc,
            useYn: rowdata.useYn,
            evtDesc: rowdata.evtDesc,
        };


        $.post(ctxPath + '/main/popup/tms2/pEvtRuleEdit.do',
            params,
            function (result) {
                HmWindow.openFit($('#pwindow'), '이벤트 수정', result, 600, 510, 'pwindow_init');
            }
        );

    },

    delEvtRule: function () {

        var rowIdxes = HmGrid.getRowIdxes($ruleGrid, '이벤트를 선택해주세요.');
        if (rowIdxes === false) return;

        var delList = [];
        $.each(rowIdxes, function (idx, item) {
            var rowdata = $ruleGrid.jqxGrid('getrowdata', item);
            delList.push(rowdata.evtSeq);
        });

        if (!confirm('선택한 항목을 삭제 하시겠습니까?')) return;

        Server.post('/main/tms2/tmsEvtConf/delEvtRule.do', {
            data: {delList: delList}, success: function (result) {
                if (result == 1) {
                    alert("삭제되었습니다.");
                    PMain.search();
                    $('#pwindow').jqxWindow('close');
                }
            }
        });

    },

    addEvtRuleToUser: function () {

        var rowIdxe = HmGrid.getRowIdxes($ruleGrid);
        if (rowIdxe !== false)
        {
            var rowdata = $ruleGrid.jqxGrid('getrowdata', rowIdxe);
            $.post(ctxPath + '/main/popup/tms2/pEvtRuleUser.do', rowdata , function (result) {
                HmWindow.open($('#pwindow'), '이벤트 적용', result, 700, 575, 'pwindow_init' , rowdata);
            });

        }else{

            $.get(ctxPath + '/main/popup/tms2/pEvtRuleUser.do', function (result) {
                HmWindow.open($('#pwindow'), '이벤트 적용', result, 700, 575, 'pwindow_init' );
            });

        }

    }
};

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});
