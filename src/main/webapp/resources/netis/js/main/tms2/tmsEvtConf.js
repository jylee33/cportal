var $subIp_grpTree, $evtGrid, selectSubIp = 0  , selectSubIpGrpNo = 0 ;

var Main = {
    /** variable */
    initVariable: function () {
        $subIp_grpTree = $('#subIp_grpTree'), $evtGrid = $('#evtGrid');
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
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnEdit':
                this.editEvt();
                break;
            case 'btnEvtTotal' :
                this.manageTotal();
                break;
            case 'btnDel':
                this.delEvt();
                break;
            case 'btnSearch':
                this.searchEvt();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchRack();
        }
    },

    /** init design */
    initDesign: function () {
        //검색바 호출.
        $('#section').css('display', 'block');
        Master.createSearchBar1('', '', $("#srchBox"));

        // HmWindow.create($('#pwindow'), 600, 400);
        HmTreeGrid.create($subIp_grpTree, HmTree./*T_GRP_DEF_ALL*/T_GRP_IP, null , {}, ['grpName']);

        HmJqxSplitter.createTree($('#mainSplitter'));


        $('#mainTabs').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function(tab) {
                switch(tab) {
                    case 0:
                        HmGrid.create($evtGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/tms2/tmsEvtConf/getTmsEvtRuleUserList.do',
                                    datafields:[ // 필터위해 추가
                                        { name: '', type: 'number' },
                                        { name:'idxSeq', type:'int' },
                                        { name:'grpNo', type:'int' },
                                        { name:'blockNo', type:'int' },
                                        { name:'profileNo', type:'int' },

                                        { name:'ip', type:'string' },
                                        { name:'evtName', type:'string' },
                                        { name:'userEvtNm', type:'string' },
                                        { name:'evtLevel', type:'string' },
                                        { name:'evtLevelStr', type:'string' },
                                        { name:'evtDesc', type:'string' },

                                        { name:'evtUseYn', type:'string' },
                                        { name:'evtUseYnStr', type:'string' },

                                        { name:'pfUnitCd', type:'string' },
                                        { name:'inOutCd', type:'string' },
                                        { name:'atkIpCnt', type:'string' },

                                        { name:'tcpFlag', type:'string' },
                                        { name:'tcpFlagStr', type:'string' },
                                        { name:'tcpFlagInc', type:'int' },

                                        { name:'protocol', type:'string' },
                                        { name:'protocolStr', type:'string' },
                                        { name:'protocolInc', type:'int' },

                                        { name:'srcPort', type:'string' },
                                        { name:'srcPortInc', type:'int' },
                                        { name:'dstPort', type:'string' },
                                        { name:'dstPortInc', type:'int' },

                                        { name:'minValue', type:'string' },
                                        { name:'flowCnt', type:'string' },

                                        { name:'evtVc', type:'string' },

                                    ]
                                },
                                {
                                    formatData: function(data) {
                                        $.extend(data, {
                                            grpNo : selectSubIpGrpNo,
                                            blockNo : selectSubIp,
                                        });
                                        return data;
                                    },
                                }
                            ),
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
                            rowsheight : 37,
                            columns:
                                [
                                    {
                                        text: '#', sortable: false, filterable: false, editable: false,
                                        groupable: false, draggable: false, resizable: false,
                                        datafield: '', columntype: 'number', width: 35,
                                        cellsrenderer: function (row, column, value) {
                                            return "<div style='margin-top:11px;text-align: center;'>" + (value + 1) + "</div>";
                                        }
                                    },
                                    { text : 'idxSeq',  datafield: 'idxSeq', width: 50 , hidden:true },
                                    { text : 'IP',  datafield: 'ip', width: 100 , cellsalign: 'center' },
                                    { text : '이벤트명',  datafield: 'evtName', width: 150 , cellsalign: 'center' },
                                    // { text : '사용자이벤트명',  datafield: 'userEvtNm', width: 150 , cellsalign: 'center' },
                                    { text : '트래픽 구분', datafield: 'inOutCd', width: 100, cellsalign: 'center' },
                                    { text : '이벤트 분류', datafield: 'evtVc', width: 100 , cellsalign: 'center' },
                                    { text : '단위', datafield: 'pfUnitCd', width: 100 , cellsalign: 'center' },
                                    { text : '최소 임계값', datafield: 'minValue', width: 100 , cellsalign: 'center' },
                                    { text : '공격 IP 개수', datafield: 'atkIpCnt', width: 100 , cellsalign: 'center' },
                                    { text : '프로토콜', datafield: 'protocolStr', displayfield: 'protocolInc', width: 100 , cellsalign: 'center' },
                                    { text : '출발지 PORT', datafield: 'srcPort', displayfield: 'srcPortInc', width: 100  , cellsalign: 'center' },
                                    { text : '목적지 PORT', datafield: 'dstPort', displayfield: 'dstPortInc', width: 100 , cellsalign: 'center' },
                                    { text : '동일 flow 수', datafield: 'flowCnt', width: 100 , cellsalign: 'center' },
                                    { text : '임계치 레벨', datafield: 'evtLevelStr', width: 100 , cellsalign: 'center' },
                                    { text : 'TCP Flags', datafield: 'tcpFlagStr', displayfield: 'tcpFlagInc', width: 150 , cellsalign: 'center' },
                                    { text : '사용', datafield: 'evtUseYnStr', width: 100, hidden: false , cellsalign: 'center' ,columntype: 'checkbox' },
                                    { text : '이벤트 설명', datafield: 'evtDesc'},
                                ],

                        }, CtxMenu.COMM);
                        $('#evtType').val('SAME_FLOW');
                        break;
                    case 1:
                        $('#evtType').val('STUDY');
                        break;
                }
            }
        }).on('selected', function(event) {
            // Main.search();
        });


    },

    /** init data */
    initData: function () {
        Server.get('/main/tms2/tmsEvtConf/getSubnetList.do', {
            data: {},
            success: function (result) {
                if(result != null) {
                    setTimeout(function(){ // 텀을 줌 - 트리에 반영되고 IP 가 매핑되야 하기 때문에
                        $.each(result, function(idx, item) {
                            $subIp_grpTree.jqxTreeGrid('addRow', item.subNo+'|'+item.ip , { grpNo: item.subNo, grpName: item.ip }, 'last' , item.subGrpNo );
                            // $subIp_grpTree.jqxTreeGrid('addRow', null , { grpNo: item.subNo, grpName: item.ip }, null , item.subGrpNo );
                        });
                    }, 100);
                }
            }
        });

        $subIp_grpTree.on('rowClick',
        function (event)
        {
            var args = event.args;
            var row = args.row;
            var key = args.key;

            // console.log("rowww")
            // console.dir(row);
            // console.log("keyyy")
            // console.dir(key);

            if(row.grpNo == 1 && ( row.parent == null || row.parent == undefined ) ){
                selectSubIp = 0;
                selectSubIpGrpNo = 0;
                Main.searchEvt();
            }else{
                selectSubIp = row.grpNo;
                selectSubIpGrpNo = row.parent.grpNo;
                if(key.includes("|")){
                    Main.searchEvt();
                }
            }
        });

    },

    searchEvt: function () {
        HmGrid.updateBoundData($evtGrid);
    },

    editEvt: function () {

        var rowIdxes = HmGrid.getRowIdxes($evtGrid, '이벤트를 선택해주세요.');
        if (rowIdxes === false) return;

        if(rowIdxes.length>1){
            alert('이벤트를 하나만 선택해주세요.');
            return false;
        }

        var rowdata = $evtGrid.jqxGrid('getrowdata', rowIdxes[0]);

        var params = {

            idxSeq : rowdata.idxSeq,
            evtVc : rowdata.evtVc,
            grpNo : rowdata.grpNo,
            blockNo : rowdata.blockNo,
            profileNo : rowdata.profileNo,
            // evtType : rowdata.evtType,
            evtName : rowdata.evtName,
            userEvtNm : rowdata.userEvtNm,
            evtLevel : rowdata.evtLevel,
            evtDesc : rowdata.evtDesc,
            evtUseYn : rowdata.evtUseYn,
            pfUnitCd : rowdata.pfUnitCd,
            inOutCd : rowdata.inOutCd,
            atkIpCnt : rowdata.atkIpCnt,
            tcpFlagStr : rowdata.tcpFlagStr,
            tcpFlagInc : rowdata.tcpFlagInc,
            protocol : rowdata.protocol,
            protocolStr : rowdata.protocolStr,
            protocolInc : rowdata.protocolInc,
            srcPort : rowdata.srcPort,
            srcPortInc : rowdata.srcPortInc,
            dstPort : rowdata.dstPort,
            dstPortInc : rowdata.dstPortInc,
            minValue : rowdata.minValue,
            flowCnt : rowdata.flowCnt,
        };

        $.post(ctxPath + '/main/popup/tms2/pEvtRuleUserEdit.do',
            params,
            function (result) {
                HmWindow.openFit($('#pwindow'), '이벤트 수정' , result, 600, 600 , 'pwindow_init');
            }
        );

    },

    delEvt: function () {

        var rowIdxes = HmGrid.getRowIdxes($evtGrid, '이벤트를 선택해주세요.');
        if (rowIdxes === false) return;

        var delList = [];
        $.each(rowIdxes, function (idx, item) {
            var rowdata  = $evtGrid.jqxGrid('getrowdata', item);
            delList.push(rowdata.idxSeq);
        });

        if(!confirm('선택한 항목을 삭제 하시겠습니까?')) return;

        Server.post('/main/tms2/tmsEvtConf/delEvtRuleUser.do', {
            data: { delList : delList }, success: function (result) {
                if(result == 1){
                    alert("삭제되었습니다.");
                    Main.searchEvt();
                }
            }
        });

    },

    manageTotal: function () {
        var params = {
        };
        HmUtil.createPopup('/main/popup/tms2/pTmsEvtRule.do', $('#hForm'), 'pTmsEvtRule', 1580, 700 , params);

    },

};

function grpResult() {
    // HmTreeGrid.updateData($grpTree, HmTree.T_GRP_SERVER);
}

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});
