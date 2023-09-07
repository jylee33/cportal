var ctxmenuIdx = 1;
var $grpTree, $isdnGrid, $sipGrid;
var _curTrunkRowdata= null;

var Main = {

    /** variable */
    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid');
        $isdnGrid = $('#isdnGrid');
        $sipGrid = $('#sipGrid');
        this.initCondition();
    },
    initCondition: function() {
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
    },
    /** add event */
    observe: function () {
        $('button').bind('click', Main.eventControl);
        $('#tabs').on('tabclick', Main.tabClickEvt);
        $('.searchBox').keypress(function (e) {
            if (e.keyCode == 13) Main.searchTrunk();
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                Main.searchTrunk();
                break;
            case 'btnExcel':
                Main.exportExcel();
                break;
        }
    },

    tabClickEvt: function (event) {
        Main.searchTrunk();
        $('#subContents').empty();
        var conDiv = document.getElementById('subContents');
        var subDiv = document.createElement('div');

        switch (event.args.item) {
            case 0:
                subDiv.setAttribute('id', 'subInfo');
                subDiv.setAttribute('class', 'inner_box');
                conDiv.appendChild(subDiv);

                var stateLegend = document.createElement('div');
                stateLegend.setAttribute('class', 'lineTitle');
                stateLegend.innerHTML = 'Trunk 멤버 상태';
                subDiv.appendChild(stateLegend);

                var ulContain = document.createElement('ul');
                ulContain.setAttribute('class', 'evtTable');
                ulContain.setAttribute('style', '');//width: 340px;
                subDiv.appendChild(ulContain);

                var li1 = document.createElement('li');
                li1.setAttribute('class', 'index');
                li1.innerHTML = '범례';
                ulContain.appendChild(li1);

                var li2 = document.createElement('li');
                li2.setAttribute('class', 'box evt1');
                li2.setAttribute('style', 'margin-left: 10px;');
                ulContain.appendChild(li2);
                var li3 = document.createElement('li');
                li3.setAttribute('class', 'iptEvtName');
                li3.setAttribute('style', 'color: black;');
                li3.innerHTML = 'OOS/FE-idle';
                ulContain.appendChild(li3);

                var li4 = document.createElement('li');
                li4.setAttribute('class', 'box evt2');
                li4.setAttribute('style', 'margin-left: 10px;');
                ulContain.appendChild(li4);
                var li5 = document.createElement('li');
                li5.setAttribute('class', 'iptEvtName');
                li5.setAttribute('style', 'color: black;');
                li5.innerHTML = 'IDLE';
                ulContain.appendChild(li5);

                var li6 = document.createElement('li');
                li6.setAttribute('class', 'box evt3');
                li6.setAttribute('style', 'margin-left: 10px;');
                ulContain.appendChild(li6);
                var li7 = document.createElement('li');
                li7.setAttribute('class', 'iptEvtName');
                li7.setAttribute('style', 'color: black;');
                li7.innerHTML = 'Out-ofService-NE';
                ulContain.appendChild(li7);

                var li8 = document.createElement('li');
                li8.setAttribute('class', 'box evt4');
                li8.setAttribute('style', 'margin-left: 10px;');
                ulContain.appendChild(li8);
                var li9 = document.createElement('li');
                li9.setAttribute('class', 'iptEvtName');
                li9.setAttribute('style', 'color: black;');
                li9.innerHTML = 'ACTIVE';
                ulContain.appendChild(li9);

                break;
            case 1:
                subDiv.setAttribute('id', 'subGid');
                conDiv.appendChild(subDiv);
                HmGrid.create($('#subGid'), {
                    source: new $.jqx.dataAdapter(
                        {
                            datatype: 'json'
                        },
                        {
                            formatData: function (data) {
                                data.mngNo = _curTrunkRowdata == null ? 0 :  _curTrunkRowdata.mngNo;
                                data.trnNo = _curTrunkRowdata == null ? 0 : _curTrunkRowdata.trnNo;
                                return data;
                            }
                        }
                    ),
                    columns:
                        [
                            {text: '멤버 번호', datafield: 'memNo', width: 150},
                            {text: '할당 포트', datafield: 'portNo', minWidth: 150},
                            {text: '서비스 상태', datafield: 'svcStat', width: 150},
                            {text: '포트 Busy 상태', datafield: 'busyStat', width: 150}
                        ]
                }, CtxMenu.COMM, ctxmenuIdx++);
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind2: 'PBX'});

        var commonSet = {
            columns:
                [
                    {text: 'Trunk 번호', datafield: 'trnNo', width: 120},
                    {text: 'Trunk 이름', datafield: 'trnName', minWidth: 120},
                    {text: 'Trunk Access 번호', datafield: 'tacNo', width: 120},
                    {text: 'Trunk 통신방식', datafield: 'trnType', width: 120},
                    {text: '멤버 수', datafield: 'memCnt', width: 120},
                    {text: 'IN', datafield: 'inUseMemCnt', columngroup: 'useMemCnt', width: 120},
                    {text: 'OUT', datafield: 'outUseMemCnt', columngroup: 'useMemCnt', width: 120},
                    {text: 'TOTAL', datafield: 'allTotalCnt', columngroup: 'useMemCnt', width: 120},
                    {text: 'Tenant', datafield: 'trnTn', width: 80},
                    {text: 'COR', datafield: 'trnCor', width: 80},
                    {text: 'CDR', datafield: 'trnCdr', width: 80},
                    {text: 'Meas', datafield: 'trnMeas', width: 80}
                ],
            columngroups:
                [
                    {text: '사용 멤버 수', align: 'center', name: 'useMemCnt'}
                ]
        };

        $('#tabs').jqxTabs({
            width: '100%', height: '100%', scrollable: true, theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        var options = {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                },
                                {
                                    formatData: function(data) {
                                        $.extend(data, Main.getCommParams());
                                        data.trnType = 'isdn';
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        _curTrunkRowdata = null;
                                    }
                                }
                            )
                        };
                        $.extend(options, commonSet);
                        HmGrid.create($isdnGrid, options, CtxMenu.COMM, ctxmenuIdx++);

                        $isdnGrid.on('rowselect', function (event) {
                            _curTrunkRowdata = event.args.row;
                            event.args.item = 0;
                            Main.tabClickEvt(event);
                            Main.searchISDNSub(event.args.row.mngNo, event.args.row.trnNo);
                        });
                        break;
                    case 1:
                        var options = {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                },
                                {
                                    formatData: function(data) {
                                        $.extend(data, Main.getCommParams());
                                        data.trnType = 'sip';
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        _curTrunkRowdata = null;
                                    }
                                }
                            )
                        };
                        $.extend(options, commonSet);
                        HmGrid.create($sipGrid, options, CtxMenu.COMM, ctxmenuIdx++);

                        $sipGrid.on('rowselect', function (event) {
                            _curTrunkRowdata = event.args.row;
                            event.args.item = 1;
                            Main.tabClickEvt(event);
                            Main.searchTrunkStat();
                        });
                        Main.searchTrunk();
                        break;
                }
            }
        });
    },

    /** init data */
    initData: function () {

    },

    /** 트리선택 */
    selectTree: function () {
        Main.searchTrunk();
    },

    /** 공통 파라미터 */
    getCommParams: function () {
        var params = Master.getDefGrpParams($grpTree);
        $.extend(params,HmBoxCondition.getSrchParams());
        return params;
    },

    /** 장비 조회 */
    searchTrunk: function () {
        var targetGrid = $isdnGrid;
        if ($('#tabs').jqxTabs('selectedItem') == 0)
            targetGrid = $isdnGrid;
        else if ($('#tabs').jqxTabs('selectedItem') == 1)
            targetGrid = $sipGrid;

        HmGrid.updateBoundData(targetGrid, ctxPath + '/main/ipt/avayaTrunkMonitor/getIptAvayaTrunkList.do');
    },

    /** 상세 조회 */
    searchTrunkStat: function () {
        if ($('#subGid').length > 0)
            HmGrid.updateBoundData($('#subGid'), ctxPath + '/main/ipt/avayaTrunkMonitor/getIptAvayaTrunkStatList.do');
    },

    searchISDNSub: function (mngNo, trnNo) {
        if (mngNo === undefined || trnNo === undefined)
            return;

        $.post(ctxPath + "/main/ipt/avayaTrunkMonitor/getIptAvayaTrunkStatISDNList.do", {mngNo: mngNo, trnNo: trnNo}).done(function (data) {
            if (data.hasError) {
                alert('에러가 발생하였습니다.');
                return;
            }
            var getData = data.resultData;
            for (var i = 0; i < getData.length; i++) {

                var template = "<table style='height: 40px;; visibility: visible; margin-bottom: 10px; border: 1px solid #939393;'>" +
                    "<tr>" +
                    "<td style='margin-right: 12px; min-width: 180px; border-right: 2px solid #ffffff; text-align: center; background: #f5f5f5;'>" +
                    "<div style='font-size: 13px; color: #6991ab; font-weight: bold; width: 100%;'>" + getData[i].list[i].portNoFirst + "</div>"
                    + "</td>";
                for (var j = 0; j < getData[i].list.length; j++) {
                    var stateText = getData[i].list[j].svcStat;
                    var className;
                    switch (stateText) {
                        case 'in-service/idle':
                            className = 'idleTm';
                            break;
                        case 'in-service/active':
                            className = 'active';
                            break;
                        case 'OOS/FE-idle':
                            className = 'feIdle';
                            break;
                        case 'Out-of-Service-NE':
                            className = 'serviceNE';
                            break;
                        default:
                            break;
                    }
                    template += "<td class='tdRow1 " + className + "'>" + getData[i].list[j].portNoSecond + "</td>";
                    if (j - 1 == getData[i].list.length)
                        template += "</tr></table>";
                }
                $('#subInfo').append(template);
            }
        });
    },

    /** Excel export */
    exportExcel: function () {
        var targetGrid = $('#tabs').val() == 0? $isdnGrid : $sipGrid;
        HmUtil.exportGrid(targetGrid, 'Trunk 모니터링', false);
    }
};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});