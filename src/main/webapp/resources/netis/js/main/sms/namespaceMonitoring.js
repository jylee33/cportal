var $grpTree, $svrGrid, $podGrid;
var timer;
var dtl_mngNo = -1;
var dtl_devName = '';
var dtl_devKind2 = '';

var Main = {

    /** variable */
    initVariable : function() {
        $grpTree = $('#dGrpTreeGrid');
        $svrGrid = $('#svrGrid');
        $podGrid = $('#podGrid');
        this.initCondition();
    },

    initCondition: function() {
        // radio 조건
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_kub_srch_type'));
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

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '40%', collapsible: false }, { size: '60%' }], 'auto', '100%');
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.search, {devKind1 : 'SVR'});

        /** 클러스터 + 네임스페이스 그리드 그리기 */
        HmGrid.create($svrGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        return data;
                    }
                }
            ),
            columns:
                [
                    { text: '네임스페이스 번호', datafield: 'namespaceNo', width: 50, hidden: true },
                    { text: '클러스터명', datafield: 'clusterNm', width: 180, cellsalign: 'center' },
                    { text: '네임스페이스명', datafield: 'namespaceNm',  width: 180, cellsrenderer: HmGrid.namespaceRenderer },
                    { text: '상태', datafield: 'namespaceStatus', width: 125, cellsalign: 'center' },
                    { text: '사용률', columngroup: 'cpu', datafield: 'inBps', width: 170, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '최소', columngroup: 'cpu', datafield: 'namespaceCpuMin', width: 170, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '전체', columngroup: 'cpu', datafield: 'namespaceCpuMax', width: 170, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '사용률', columngroup: 'mem', datafield: 'fsMaxPer', width: 170, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '최소', columngroup: 'mem', datafield: 'namespaceMemMin', width: 170, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '전체', columngroup: 'mem', datafield: 'namespaceMemMax', width: 170, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '가동시간', datafield: 'podUptime', width: 140, filtertype: 'number', cellsalign: 'center' }
                ],
            columngroups:
                [
                    { text: 'CPU', align: 'center', name: 'cpu'},
                    { text: 'Memory', align: 'center', name: 'mem'}
                ]
        });

        HmGrid.create($podGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData : function(data) {
                        if ($svrGrid.jqxGrid('getselectedrowindex') == -1)
                            return;
                        $.extend(data,
                            { namespaceNo : $svrGrid.jqxGrid('getrowdata', $svrGrid.jqxGrid('getselectedrowindex')).namespaceNo,
                              namespaceNm : $svrGrid.jqxGrid('getrowdata', $svrGrid.jqxGrid('getselectedrowindex')).namespaceNm});
                        return data;
                    },
                    loadComplete : function(record) {
                        if (record.hasOwnProperty('resultData')) {
                            $podGrid.jqxGrid('selectrow', 0);
                        }
                    }
                }
            ),
            columns:
                [
                    { text: '네임스페이스명', datafield: 'namespaceNm' ,  width: 160, cellsalign: 'center' },
                    { text: '명칭', columngroup: 'pod', datafield: 'podNm', width: 200, cellsalign: 'center', cellsrenderer: HmGrid.podRenderer },
                    { text: 'IP', columngroup: 'pod', datafield: 'podIp', width: 200, cellsalign: 'center' },
                    { text: '상태', datafield: 'podStatus', width: 125, filtertype: 'number', cellsalign: 'center' },
                    { text: '사용률', columngroup: 'cpu', datafield: 'outBps', width: 120, cellsformat: "d", cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '최소', columngroup: 'cpu', datafield: 'podCpuMin', width: 120, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '전체', columngroup: 'cpu', datafield: 'podCpuMax', width: 120, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '사용률', columngroup: 'mem', datafield: 'outBps4', width: 120, cellsformat: "d", cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '최소', columngroup: 'mem', datafield: 'podMemMin', width: 120, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '전체', columngroup: 'mem', datafield: 'podMemMax', width: 120, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '재시작횟수', datafield: 'containerRestartCnt', width: 120, filtertype: 'number', cellsalign: 'center' },
                    { text: '가동시간', datafield: 'podUptime', width: 120, filtertype: 'number', cellsalign: 'center' }
                ],
            columngroups:
                [
                    { text: '파드', align: 'center', name: 'pod'},
                    { text: 'CPU', align: 'center', name: 'cpu'},
                    { text: 'MEMORY', align: 'center', name: 'mem'}
                ]
        });

        $('#section').css('display', 'block');
    },

    /** init data */
    initData : function() {

    },

    /** 네임스페이스 모니터링 그리드 조회 */
    search : function() {
        HmGrid.updateBoundData($svrGrid, ctxPath + '/kub/getNamespaceList.do');
    },

    /** export Excel */
    exportExcel: function() {
        HmUtil.exportGrid($svrGrid, "네임스페이스 모니터링", false);
    },

    /** 선택 네임스페이스명 표출 */
    putName: function(){
        $svrGrid.on('rowdoubleclick', function(event){
            HmGrid.updateBoundData($podGrid, ctxPath + "/kub/getPodList.do");

            var rowIdx = event.args.rowindex;
            var rowData = $(this).jqxGrid('getrowdata', rowIdx);
            var namespaceNm = rowData.namespaceNm;
            var clusterNm = rowData.clusterNm;

            $('#namesNmInput').html('선택 네임스페이스 [ ' + clusterNm + ' / ' + namespaceNm + ' ]');
        })
    }
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
    Main.putName();
});
