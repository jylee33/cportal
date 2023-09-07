var $ipMgmtGrid;
var isSearchAll = false;
var codeMap = {
    virtlFlagList: [],
    ifNmList: [],
    dplxFlagList: [],
    cableTypeList: [],
    speedList: []
};

var Main = {
    /** variable */
    initVariable: function () {
        $ipMgmtGrid = $('#ipMgmtGrid');
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
            case 'btnSearch':
                this.searchIpMgmt();
                break;
            case 'btnCodeConf':
                this.codeConf();
                break;
            case "btnExcel":
                this.exportExcel();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchIpMgmt();
        }
    },

    /** init design */
    initDesign: function () {
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'VIRTL_FLAG' },
            success: function(result) {
                codeMap.virtlFlagList = result;
            }
        });
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'IF_NM' },
            success: function(result) {
                codeMap.ifNmList = result;
            }
        });
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'DPLX_FLAG' },
            success: function(result) {
                codeMap.dplxFlagList = result;
            }
        });
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'CABLE_TYPE' },
            success: function(result) {
                codeMap.cableTypeList = result;
            }
        });
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'SPEED' },
            success: function(result) {
                codeMap.speedList = result;
            }
        });

        console.log(codeMap);

        HmDate.create($('#p_date1'), $('#p_date2'), 0);

        HmGrid.create($ipMgmtGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'num', type: 'number'},
                        {name: 'ipassetHostNo', type: 'string'},
                        {name: 'confmState', type: 'string'},
                        {name: 'confmUserId', type: 'string'},
                        {name: 'wbSvrLoc', type: 'string'},
                        {name: 'rackNm', type: 'string'},
                        {name: 'wbSvrKind', type: 'string'},
                        {name: 'wbSvrUse', type: 'string'},
                        {name: 'workNm', type: 'string'},
                        {name: 'hostNm', type: 'string'},
                        {name: 'virtlFlag', type: 'string'},
                        {name: 'virtlIdNm', type: 'string'},
                        {name: 'wbIfNm', type: 'string'},
                        {name: 'ifDesc', type: 'string'},
                        {name: 'dplxFlag', type: 'string'},
                        {name: 'activeBackup', type: 'string'},
                        {name: 'ipCnt', type: 'string'},
                        {name: 'ipAddr', type: 'string'},
                        {name: 'subMask', type: 'string'},
                        {name: 'gwAddr', type: 'string'},
                        {name: 'wbCableType', type: 'string'},
                        {name: 'wbSpeed', type: 'string'},
                        {name: 'reqUserId', type: 'string'},
                        {name: 'reqState', type: 'string'}
                    ]
                },
                {
                    formatData: function (data) {
                        data.sIp = $('#sIp').val();
                        data.sDevName = $('#sDevName').val();
                        return data;
                    },
                    loadComplete: function (records) {

                    }
                }
            ),
            selectionmode: 'checkbox',
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '');
            },
            columns:
                [
                    {text: 'HOST_NO', datafield: 'ipassetHostNo', width: 150, hidden: true},
                    {text: '요청번호', datafield: 'num', width: 100, hidden: true},
                    {text: '처리상태', datafield: 'confmState', width: 100},
                    {text: '처리자', datafield: 'confmUserId', width: 100},

                    {text: '서버위치', datafield: 'wbSvrLoc', width: 150, columngroup: 'serverGroup'},
                    {text: '랙명칭', datafield: 'rackNm', width: 140, columngroup: 'serverGroup'},
                    {text: '서버종류', datafield: 'wbSvrKind', width: 220, columngroup: 'serverGroup'},
                    {text: '서버용도', datafield: 'wbSvrUse', width: 130, columngroup: 'serverGroup'},
                    {text: '업무명', datafield: 'workNm', width: 150, columngroup: 'serverGroup'},
                    {text: 'HOSTNAME', datafield: 'hostNm', width: 120, columngroup: 'serverGroup'},
                    {text: '가상화', datafield: 'virtlFlag', width: 120, columngroup: 'serverGroup'},
                    {text: '가상화 구분 ID', datafield: 'virtlIdNm', width: 120, columngroup: 'serverGroup'},
                    {text: 'I/F명', datafield: 'wbIfNm', width: 120, columngroup: 'serverGroup'},
                    {text: 'I/F추가정보', datafield: 'ifDesc', width: 120, columngroup: 'serverGroup'},
                    {text: 'NIC 정보', datafield: 'dplxFlag', width: 120, columngroup: 'serverGroup'},
                    {text: 'Active/Backup', datafield: 'activeBackup', width: 120, columngroup: 'serverGroup'},
                    {text: 'IP 수량', datafield: 'ipCnt', width: 120, columngroup: 'serverGroup'},
                    {text: 'IP 주소', datafield: 'ipAddr', width: 120, columngroup: 'serverGroup'},
                    {text: '서브넷마스크', datafield: 'subMask', width: 120, columngroup: 'serverGroup'},
                    {text: 'Default GW', datafield: 'gwAddr', width: 120, columngroup: 'serverGroup'},
                    {text: '케이블타입', datafield: 'wbCableType', width: 120, columngroup: 'serverGroup'},
                    {text: 'duplex/speed', datafield: 'wbSpeed', width: 120, columngroup: 'serverGroup'},

                    {text: '랙명칭', datafield: 'test16', width: 120, columngroup: 'networkGroup'},
                    {text: 'HOSTNAME', datafield: 'test17', width: 120, columngroup: 'networkGroup'},
                    {text: '스위치IP', datafield: 'test18', width: 120, columngroup: 'networkGroup'},
                    {text: '포트번호', datafield: 'test19', width: 120, columngroup: 'networkGroup'},
                    {text: '기타', datafield: 'test20', width: 120, columngroup: 'networkGroup'},
                    {text: '저장여부', datafield: 'test21', width: 120, columngroup: 'networkGroup'},


                    {text: '신청인', datafield: 'reqUserId', width: 130},
                    {text: '요청날짜', datafield: 'reqState', width: 130},
                    {text: '승인날짜', datafield: 'confmState2', width: 130}
                ],
            columngroups:
                [
                    {text: '서버정보', align: 'center', name: 'serverGroup'},
                    {text: '네트워크정보', align: 'center', name: 'networkGroup'}
                ]
        }, CtxMenu.COMM);

    },

    /** init data */
    initData: function () {
        this.searchIpMgmt();
    },

    /** IP 조회 */
    searchIpMgmt: function () {
        HmGrid.updateBoundData($ipMgmtGrid, ctxPath + '/wooriBank/nms/ipMgmt/getIpMgmtList.do');
    },

    /** export Excel */
    exportExcel: function () {
        HmUtil.exportGrid($ipMgmtGrid, 'IP조회', false);
    },

    codeConf: function () {
        HmUtil.createPopup('/wooriBank/popup/nms/pCodeConf.do', $('#hForm'), 'pCodeConf', 900, 600);
    },
};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});