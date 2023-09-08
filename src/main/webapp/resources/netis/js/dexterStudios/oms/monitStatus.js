var timer;
var ctxmenuIdx = 1;
var $grpTree;
var $nmsGrid, $smsGrid, $vmGrid;
var panelTop = [{ size: '30%' }, { size: '70%' }];
var panelBottom = [{ size: '50%' }, { size: '50%' }];

var Main = {
    /** variable */
    initVariable: function() {
        $grpTree = $('#dGrpTreeGrid');
        $nmsGrid = $('#nmsGrid'), $smsGrid = $('#smsGrid'), $vmGrid = $('#vmGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
        $('#chkNetworkView, #chkSvrView, #chkVmView').bind("change", function (event) { Main.eventControl(event) });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case "btnSearch": this.search(); break;
            case "btnSortIdxSet": this.sortIdxSet(); break;
            case "btnExcel": this.exportExcel(); break;
            case "chkNetworkView": this.chgView(event); break;
            case "chkSvrView": this.chgView(event); break;
            case "chkVmView": this.chgView(event); break;
        }
    },

    /** init design */
    initDesign: function() {

        $('#prgrsBar').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
        $('#prgrsBar').on('complete', function(event) {
            Main.search();
            $(this).val(0);
        });
        $('#refreshCycleCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            source: [
                { label: 'None', value: 0 },
                { label: '10초', value: 10 },
                { label: '20초', value: 20 },
                { label: '30초', value: 30 }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        }).on('change', function() {
            Main.chgRefreshCycle();
        });

        $('#mainSplitter').jqxSplitter({ width: '99.8%', height: '99.8%', orientation: 'vertical', theme: jqxTheme, panels: [{ size: 254, collapsible: true }, { size: '100%' }] });
        $('#splitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', splitBarSize:0.5, theme: jqxTheme,  panels: panelTop});
        $('#vSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', splitBarSize:0.5, theme: jqxTheme, panels: panelBottom });
        // HmTreeGrid.create($grpTree, HmTree.T_GRP_DEF_ALL, Main.search);
        Master.createGrpTab2(Main.search);
        HmWindow.create($('#pwindow'), 100, 100);


        /** 서버현황 그리드 그리기 */
        HmGrid.create($smsGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        var params = Master.getGrpTabParams();
                        $.extend(data, params);
                        return data;
                    },
                    loadComplete: function(records) {
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '서버 모니터링');
            },
            columns:
                [
                    { text: '서버번호', datafield: 'mngNo', width: 80, hidden: true },
                    { text: '그룹명', datafield: 'grpName', width: 150, pinned: true },
                    { text: '서버명', datafield: 'name', displayfield: 'disDevName', minwidth: 200, pinned: true, cellsrenderer: HmGrid.devNameRenderer },
                    { text: 'IP', datafield: 'devIp', width: 100, pinned: true },
                    { text: '타입', datafield: 'devKind1', hidden: true },
                    { text: '종류', datafield: 'devKind2', width: 90 },
                    { text: 'CPU', datafield: 'cpuPer' ,  width: 90, cellsrenderer: HmGrid.progressbarrenderer, filtertype: "number" },
                    { text: 'Memory', datafield: 'memPer', width: 100, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number'  },
                    { text: 'In',  columngroup: 'bps',datafield: 'inBps', width: 90, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
                    { text: 'Out',  columngroup: 'bps',datafield: 'outBps', width: 90, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
                    { text: '최대',  columngroup: 'fileSystem',datafield: 'fsMaxPer', width: 90, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number' },
                    { text: '평균',  columngroup: 'fileSystem',datafield: 'fsAvgPer', width: 90, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number' },
                    { text: '프로세스(수)',  datafield: 'procCnt', width: 90, filtertype: 'number', cellsalign: 'right' },
                    { text: '제조사',  datafield: 'vendor', width: 120, cellsalign: 'left' },
                    { text: '모델',  datafield: 'model', width: 120, cellsalign: 'left' },
                    { text: '시리얼', datafield: 'machine_serial', width: 130 },
                    { text: '비고', datafield: 'svrDesc', width: 130 }
                ],
            columngroups:
                [
                    { text: '파일시스템', align: 'center', name: 'fileSystem'},
                    { text: 'bps', align: 'center', name: 'bps'}
                ]
        }, CtxMenu.SVR, 0);


        /** nms 그리드 */
            HmGrid.create($nmsGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json'
                        /*,id: 'mngNo'*/
                    },
                    {
                        formatData: function(data) {
                            // $.extend(data, Main.getCommParams());
                            return data;
                        }
                    }
                ),
                pagerheight: 27,
                showtoolbar: true,
                rendertoolbar: function(toolbar) {
                    HmGrid.titlerenderer(toolbar, '회선 모니터링');
                },
                pagerrenderer : HmGrid.pagerrenderer,
                columns:
                    [
                        { text: '회선그룹명', datafield: 'grpName',  width: 150 },
                        { text: '장비명', datafield: 'disDevName',  width: 150, cellsrenderer: HmGrid.devNameRenderer  },
                        { text: '장비IP', datafield: 'devIp',  width: 120 },
                        { text: '회선명', datafield: 'ifName',  minwidth: 150, cellsrenderer: HmGrid.ifNameRenderer  },
                        { text: '별칭', datafield: 'ifAlias',  width: 120 },
                        { text: '대역폭', datafield: 'lineWidth',  width: 120 , cellsrenderer: HmGrid.unit1000renderer},
                        { text: '상태', datafield: 'status',  width: 120 },
                        { text: 'In', datafield: 'avgInbps',  columngroup: 'bps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                        { text: 'Out', datafield: 'avgOutbps',  columngroup: 'bps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                        { text: 'In', datafield: 'avgInpps',  columngroup: 'pps',  width: 100, cellsrenderer: HmGrid.unit1000renderer },
                        { text: 'Out', datafield: 'avgOutpps',  columngroup: 'pps', width: 100, cellsrenderer: HmGrid.unit1000renderer }
                    ],
                columngroups:[
                    { text: 'BPS', align: 'center', name: 'bps' },
                    { text: 'PPS', align: 'center', name: 'pps' }
                ]
            }, CtxMenu.IF, '17')

        /** vm 그리드 */
        HmGrid.create($vmGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    }
                }
            ),
            pagerrenderer : HmGrid.pagerrenderer,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, 'VM 모니터링');
            },
            columns:
                [
                    { text: '서버번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true },
                    { text: '그룹명', datafield: 'grpName', width: 300, pinned: true },
                    { text: '호스트명', datafield: 'devName', minwidth : 150, pinned: true },
                    { text: 'IP', datafield: 'devIp', width: 120 },
                    { text: '종류', datafield: 'devKind2', width: 100 },
                    { text: '모델', datafield: 'model', width: 150 },
                    { text: '제조사', datafield: 'vendor', width: 130 },
                    { text: 'CPU', datafield: 'cpuPer' ,  width: 90, cellsrenderer: HmGrid.progressbarrenderer, filtertype: "number" },
                    { text: 'Memory', datafield: 'memPer', width: 100, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number'  },
                    { text: 'In',  columngroup: 'bps',datafield: 'inBps', width: 90, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
                    { text: 'Out',  columngroup: 'bps',datafield: 'outBps', width: 90, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' }
                ],
                columngroups:
                    [
                        {text: 'BPS', align: 'center', name: 'bps'}
                    ]
        }, CtxMenu.DEV, 'vm');
        },

    /** init data */
    initData: function() {
        Main.chgRefreshCycle();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    sortIdxSet: function(){
        $.post(ctxPath + '/dexterStudios/popup/oms/pSortSet.do',
            function(result) {
                HmWindow.open($('#pwindow'), '정렬 순서 설정', result, 600, 430, 'pwindow_init');
            }
        );
    },

    search: function() {
        HmGrid.updateBoundData($nmsGrid, ctxPath + '/dexterStudios/oms/monitStatus/getIfGrpStatusList.do');
        HmGrid.updateBoundData($smsGrid, ctxPath + '/dexterStudios/oms/monitStatus/getSmsStatusList.do');
        HmGrid.updateBoundData($vmGrid, ctxPath + '/dexterStudios/oms/monitStatus/getVmStatusList.do');
    },
    getCommParams: function() {
        var params = Master.getDefGrpParams($grpTree);
        return params;
    },
    chgView: function(event){

        var curTarget = event.currentTarget;
        var svrChecked = $('#chkSvrView').is(':checked');
        var networkChecked = $('#chkNetworkView').is(':checked');
        var vmChecked = $('#chkVmView').is(':checked');

        if(svrChecked && networkChecked && vmChecked){
            panelTop[0].size = '30%';
            panelTop[1].size = '70%';
            panelTop[0].collapsible = true;
            panelTop[1].collapsible = false;
            $('#splitter').jqxSplitter({panels: panelTop});
            $('#splitter').jqxSplitter('expand');
            panelBottom[0].size = '50%';
            panelBottom[1].size = '50%';
            panelBottom[0].collapsible = true;
            panelBottom[1].collapsible = false;
            $('#vSplitter').jqxSplitter({panels: panelBottom});
            $('#vSplitter').jqxSplitter('expand');
        }
        if( svrChecked && networkChecked && !vmChecked){
            panelTop[0].size = '50%';
            panelTop[1].size = '50%';
            panelTop[0].collapsible = true;
            panelTop[1].collapsible = false;
            $('#splitter').jqxSplitter({panels: panelTop});
            $('#splitter').jqxSplitter('expand');
            panelBottom[0].size = '50%';
            panelBottom[1].size = '50%';
            panelBottom[0].collapsible = false;
            panelBottom[1].collapsible = true;
            $('#vSplitter').jqxSplitter({panels: panelBottom});
            $('#vSplitter').jqxSplitter('collapse');
        }
        if(svrChecked && !networkChecked  && !vmChecked){
            panelTop[0].size = '100%';
            panelTop[1].size = '0%';
            panelTop[0].collapsible = false;
            panelTop[1].collapsible = true;
            $('#splitter').jqxSplitter({panels: panelTop});
            $('#splitter').jqxSplitter('collapse');
        }
        if(svrChecked && !networkChecked && vmChecked){
            panelTop[0].size = '50%';
            panelTop[1].size = '50%';
            panelTop[0].collapsible = false;
            panelTop[1].collapsible = true;
            $('#splitter').jqxSplitter({panels: panelTop});
            $('#splitter').jqxSplitter('expand');
            panelBottom[0].size = '0%';
            panelBottom[1].size = '100%';
            panelBottom[0].collapsible = true;
            panelBottom[1].collapsible = false;
            $('#vSplitter').jqxSplitter({panels: panelBottom});
            $('#vSplitter').jqxSplitter('collapse');
        }

        if(!svrChecked && networkChecked && vmChecked){
            panelTop[0].size = '0%';
            panelTop[1].size = '100%';
            panelTop[0].collapsible = true;
            panelTop[1].collapsible = false;
            $('#splitter').jqxSplitter({panels: panelTop});
            $('#splitter').jqxSplitter('collapse');
            panelBottom[0].size = '50%';
            panelBottom[1].size = '50%';
            panelBottom[0].collapsible = true;
            panelBottom[1].collapsible = false;
            $('#vSplitter').jqxSplitter({panels: panelBottom});
            $('#vSplitter').jqxSplitter('expand');
        }
        if(!svrChecked && networkChecked && !vmChecked){
            panelTop[0].size = '0%';
            panelTop[1].size = '100%';
            panelTop[0].collapsible = true;
            panelTop[1].collapsible = false;
            $('#splitter').jqxSplitter({panels: panelTop});
            $('#splitter').jqxSplitter('collapse');
            panelBottom[0].size = '100%';
            panelBottom[1].size = '0%';
            panelBottom[0].collapsible = false;
            panelBottom[1].collapsible = true;
            $('#vSplitter').jqxSplitter({panels: panelBottom});
            $('#vSplitter').jqxSplitter('collapse');
        }


        if(!svrChecked && !networkChecked && vmChecked){
            panelTop[0].size = '0%';
            panelTop[1].size = '100%';
            panelTop[0].collapsible = true;
            panelTop[1].collapsible = false;
            $('#splitter').jqxSplitter({panels: panelTop});
            $('#splitter').jqxSplitter('collapse');
            panelBottom[0].size = '0%';
            panelBottom[1].size = '100%';
            panelBottom[0].collapsible = true;
            panelBottom[1].collapsible = false;
            $('#vSplitter').jqxSplitter({panels: panelBottom});
            $('#vSplitter').jqxSplitter('collapse');
        }
        if(!networkChecked && !svrChecked && !vmChecked){

        }

    },
    /** 새로고침 주기 변경 */
    chgRefreshCycle: function () {
        var cycle = $('#refreshCycleCb').val();
        if (timer != null)
            clearInterval(timer);
        if (cycle > 0) {
            timer = setInterval(function () {
                var curVal = $('#prgrsBar').val();
                if (curVal < 100)
                    curVal += 100 / cycle;
                $('#prgrsBar').val(curVal);
            }, 1000);
        } else {
            $('#prgrsBar').val(0);
        }
    },
    
    /** export Excel */
    exportExcel: function() {
        // HmUtil.exportGrid($maintGrid, '유지보수 업체 연락처', false);
    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});