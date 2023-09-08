var $apGrid, $schdulerGrid;
var timer;

var schedulerCombo = [];

var _columns = [
    {text: '그룹명', datafield: 'grpName', width: '50%', pinned: true},
    {text: '스케줄러 그룹', datafield: 'schName', width: '50%', pinned: true},
    {text: '스케줄러 번호', datafield: 'schNo', width: 150, pinned: true, hidden: true},
];

var Main = {

    /** variable */
    initVariable: function () {

        $apGrid = $('#apGrid');
        $schdulerGrid = $("#schdulerGrid");

        this.initCondition();

    },

    initCondition: function () {

    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('#ckAllSet').bind('change', function (event) {
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

            case "btnSearch":
                Main.search();
                break;

            case "btnSetup":
                Main.setting();
                break;

            case "btnSave":
                Main.save();
                break;

            case "btnPlay":
                Main.registerSchedule();
                break;


        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.search();
        }
    },


    /** init design */
    initDesign: function () {

        //검색바 호출.
        Master.createSearchBar1('', '', $("#srchBox"));

        HmJqxSplitter.createTree($('#mainSplitter'));

        Master.createApGrpTab(Main.selectTree);

        HmGrid.create($apGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'userDevName', type: 'string'},
                        {name: 'grpName', type: 'string'},
                        {name: 'apNo', type: 'number'},
                        {name: 'apIdx', type: 'number'},
                        {name: 'apMac', type: 'string'},
                        {name: 'apIp', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'apName', type: 'string'},
                        {name: 'apVer', type: 'string'},
                        {name: 'apModel', type: 'string'},
                        {name: 'apType', type: 'string'},
                        {name: 'apVendor', type: 'string'},
                        {name: 'apSerial', type: 'string'},
                        {name: 'apUptime', type: 'number'},
                        {name: 'apLocation', type: 'string'},
                        {name: 'apStatus', type: 'string'},
                        {name: 'poeMngNo', type: 'number'},
                        {name: 'poeIfNo', type: 'number'},
                        {name: 'schedulerGrpNo', type: 'string'},
                        {name: 'schedulerGrpNm', type: 'string'},
                        {name: 'zoneId', type: 'number'},
                        {name: 'groupId', type: 'number'}
                    ]
                },
                {
                    formatData: function (data) {

                        console.log("COMM PARAMS : " + Main.getCommParams());

                        $.extend(data, Main.getCommParams());
                        $.extend(data, Master.getApGrpParams());
                        return data;

                    }, beforeLoadComplete: function (records) {
                        var upCnt = 0;
                        var totalCnt = 0;
                        if (records) {
                            totalCnt = records.length;
                            $.each(records, function (i, v) {
                                if (v.apStatus == 'UP')
                                    upCnt++;
                            });
                        }
                        $('#apCnt').html('AP 상태 : <span class="point">' + upCnt + '</span> / <span class="black">' + totalCnt + '</span> ( <span class="point">UP</span> / <span class="black">전체</span> )');
                        return records;
                    }
                }
            ),
            editable: true,
            selectionmode: 'checkbox',
            ready: function () {
            },
            columns:
                [
                    {text: 'AP 번호', datafield: 'apNo', width: 100, hidden: true, editable: false},
                    {
                        text: '구분',
                        datafield: 'userDevName',
                        width: '10%',
                        pinned: true,
                    },
                    {text: 'AP IDX', datafield: 'apIdx', width: '15%', hidden: true, editable: false},
                    {
                        text: 'AP 명',
                        datafield: 'apName',
                        width: '15%',
                        pinned: true,
                        cellsrenderer: HmGrid.apNameRenderer, editable: false
                    },
                    {
                        text: 'AP MODEL',
                        datafield: 'apModel',
                        width: '10%',
                    },
                    {
                        text: '제조사',
                        datafield: 'apVendor',
                        width: '10%',
                    },
                    {text: 'AP Mac', datafield: 'apMac', width: '20%', pinned: false, editable: false},
                    {text: 'AP IP', datafield: 'apIp', width: '15%', pinned: false, editable: false},
                    {text: 'DEV IP', datafield: 'devIp', width: '15%', pinned: false, editable: false},
                    {text: 'AP 시리얼 번호', datafield: 'apSerial', width: '20%', hidden: true, editable: false},
                    {
                        text: "AP 상태",
                        datafield: "apStatus",
                        width: 80,
                        cellsrenderer: HmGrid.apStatusrenderer,
                        filtertype: 'checkedlist', editable: false
                    },
                    {text: "AP 설치 위치", datafield: "apLocation", width: 120, hidden: true},
                    {
                        text: '스케줄러 설정',
                        datafield: 'schedulerGrpNo',
                        displayfield: 'schedulerGrpNm',
                        width: 100,
                        columntype: 'dropdownlist',
                        cellsalign: 'center',
                        createeditor: function (row, value, editor) {

                            console.log("COMBO  : " + JSON.stringify(schedulerCombo));

                            editor.jqxDropDownList({
                                source: schedulerCombo,
                                autoDropDownHeight: true,
                                displayMember: 'label',
                                valueMember: 'value'
                            });

                        }

                    },
                    {
                        text: "AP 구동시간",
                        datafield: "apUptime",
                        width: 140,
                        cellsrenderer: HmGrid.cTimerenderer,
                        editable: false,
                    },
                    {text: "ZONE ID", datafield: "zoneId", width: 120, hidden: true},
                    {text: "GROUP ID", datafield: "groupId", width: 120, hidden: true}
                ]
        }, CtxMenu.COMM);

    },

    /** init data */
    initData: function () {

        Server.post("/scheduler/getSchedulerCombo.do", {
            data: {},
            success: function (result) {
                schedulerCombo = result;
            }
        });

    },

    /** 그룹트리 선택이벤트 */
    selectTree: function () {
        Main.search();
    },

    /** 조회 */
    search: function () {

        Server.post("/scheduler/getSchedulerCombo.do", {
            data: {},
            success: function (result) {
                schedulerCombo = result;
            }
        });


        var params = Master.getApGrpParams();
        if (params.grpType == 'FILTER') {
            if (params.filterFlag) {
                Main.searchAp();
            } else {
                alert('선택된 필터가 없습니다.');
                $('#apCnt').html('AP 상태 : <span class="point">0</span> / <span class="black">0</span> ( <span class="point">UP</span> / <span class="black">전체</span> )');
                $apGrid.jqxGrid('clear');
            }
        } else {
            Main.searchAp();
        }

    },


    searchAp: function () {
        HmGrid.updateBoundData($apGrid, ctxPath + '/scheduler/getApSchedulerList.do');
    },


    setting: function () {
        $.get(ctxPath + '/main/popup/env/pApScheduler.do',
            function (result) {
                HmWindow.open($('#pwindow'), "AP 스케줄러 정책 설정", result, 800, 500);
            });
    },


    save: function () {

        var rowIdxes = HmGrid.getRowIdxes($apGrid, '선택한 AP 정보가 없습니다.');

        if (rowIdxes === false) return;

        var rowDatas = HmGrid.getRowDataList($apGrid, rowIdxes);

        var _list = [];

        for (var i = 0; i < rowDatas.length; i++) {
            _list.push({
                schedulerGrpNo: rowDatas[i].schedulerGrpNo,
                apNo: rowDatas[i].apNo
            })
        }

        Server.post("/scheduler/saveApSchedulerSet.do", {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                HmGrid.updateBoundData($apGrid, ctxPath + '/scheduler/getApSchedulerList.do');
            }
        });

    },


    registerSchedule: function () {

        var rowIdxes = HmGrid.getRowIdxes($apGrid, '선택한 AP 정보가 없습니다.');
        var rowDatas = HmGrid.getRowDataList($apGrid, rowIdxes);

        var _list = [];

        for (var i = 0; i < rowDatas.length; i++) {

            if (rowDatas[i].schedulerGrpNo != null) {
                _list.push({
                    vendorKind: rowDatas[i].userDevName,
                    schedulerGrpNo: rowDatas[i].schedulerGrpNo,
                    apNo: rowDatas[i].apIdx,
                    apMac: rowDatas[i].apMac,
                    devIp: rowDatas[i].devIp,
                    zoneId: rowDatas[i].zoneId,
                    groupId: rowDatas[i].groupId,
                });
            }
        }

        console.log(JSON.stringify(_list));

        Server.post("/scheduler/registryScheduler.do", {
            data: {list: _list},
            success: function (result) {
                alert(result);
            }
        });

    },

    getCommParams: function () {

        var params = {};

        params.sIp = Master.getSrchIp();
        params.sDevName = Master.getSrchDevName();
        params.sVendor = Master.getSrchVendor();
        params.sModel = Master.getSrchModel();

        return params;

    }

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});