var $grpTree, $podGrid, $podGrid2;
var timer;
var dtl_mngNo = -1;
var dtl_devName = '';
var dtl_devKind2 = '';

var Main = {

    /** variable */
    initVariable : function() {
        $grpTree = $('#dGrpTreeGrid');
        $podGrid = $('#podGrid');
        $podGrid2 = $('#podGrid2');
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
            case "btnSearch2": this.search(); break;
            case "btnExcel2": this.exportExcel2(); break;
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

        /** 파드 모니터링 그리드 그리기 */
        HmGrid.create($podGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData : function(data) {
                        if ($podGrid.jqxGrid('getselectedrowindex') == -1)
                            return;
                        $.extend(data,
                            { namespaceNo : $podGrid.jqxGrid('getrowdata', $podGrid.jqxGrid('getselectedrowindex')).namespaceNo,
                              namespaceNm : $podGrid.jqxGrid('getrowdata', $podGrid.jqxGrid('getselectedrowindex')).namespaceNm });
                        console.log(data);
                        return data;
                    },
                    loadComplete : function(record) {
                        if (record.hasOwnProperty('resultData')) {
                            $podGrid2.jqxGrid('selectrow', 0);
                        }
                    }
                }
            ),
            columns:
                [
                    { text: '네임스페이스 번호', datafield: 'namespaceNo', width: 50, hidden: true },
                    { text: '네임스페이스명', datafield: 'namespaceNm' ,  width: 160, cellsalign: 'center', cellsrenderer: HmGrid.namespaceRenderer },
                    { text: '명칭', columngroup: 'pod', datafield: 'podNm', width: 200, cellsalign: 'center', cellsrenderer: HmGrid.podRenderer },
                    { text: 'IP', columngroup: 'pod', datafield: 'podIp', width: 200, cellsalign: 'center' },
                    { text: '상태', datafield: 'podStatus', width: 115, filtertype: 'number', cellsalign: 'center' },
                    { text: '사용률', columngroup: 'cpu', datafield: 'outBps', width: 120, cellsformat: "d", cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '최소', columngroup: 'cpu', datafield: 'podCpuMin', width: 120, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '전체', columngroup: 'cpu', datafield: 'podCpuMax', width: 120, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '사용률', columngroup: 'mem', datafield: 'outBps4', width: 120, cellsformat: "d", cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '최소', columngroup: 'mem', datafield: 'podMemMin', width: 120, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '전체', columngroup: 'mem', datafield: 'podMemMax', width: 120, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '재시작횟수', datafield: 'containerRestartCnt', width: 115, filtertype: 'number', cellsalign: 'center' },
                    { text: '가동시간', datafield: 'podUptime', width: 117, filtertype: 'number', cellsalign: 'center' }
                ],
            columngroups:
                [
                    { text: '파드', align: 'center', name: 'pod'},
                    { text: 'CPU', align: 'center', name: 'cpu'},
                    { text: 'MEMORY', align: 'center', name: 'mem'}
                ]
        });

        HmGrid.create($podGrid2, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData : function(data) {
                        if ($podGrid.jqxGrid('getselectedrowindex') == -1)
                            return;
                        $.extend(data,
                            { podNo : $podGrid.jqxGrid('getrowdata', $podGrid.jqxGrid('getselectedrowindex')).podNo });
                        return data;
                    },
                    loadComplete : function(record) {
                        if (record.hasOwnProperty('resultData')) {
                            $podGrid2.jqxGrid('selectrow', 0);
                        }
                    }
                }
            ),
            columns:
                [
                    { text: '파드 번호', datafield: 'podNo', width: 180, hidden: true },
                    { text: '파드명', datafield: 'podNm', width: 180, cellsalign: 'center' },
                    { text: '컨테이너명', datafield: 'containerNm', width: 180, cellsalign: 'center' },
                    { text: '상태', datafield: 'containerStatus', width: 150, cellsalign: 'center' },
                    { text: '사용률', columngroup: 'cpu', datafield: 'outBps', width: 150, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '최소', columngroup: 'cpu', datafield: 'containerCpuMin', width: 150, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '전체', columngroup: 'cpu', datafield: 'containerCpuMax', width: 150, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '사용률', columngroup: 'mem', datafield: 'outBps4', width: 150, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '최소', columngroup: 'mem', datafield: 'containerMemMin', width: 150, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '전체', columngroup: 'mem', datafield: 'containerMemMax', width: 150, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number', cellsalign: 'center' },
                    { text: '재시작횟수', datafield: 'containerRestartCnt', width: 100, filtertype: 'number', cellsalign: 'center' },
                    { text: '가동시간', datafield: 'podUptime', width: 135, filtertype: 'number', cellsalign: 'center' }
                ],
            columngroups:
                [
                    { text: 'CPU', align: 'center', name: 'cpu'},
                    { text: 'MEMORY', align: 'center', name: 'mem'}
                ]
        });
        $podGrid.on('rowdoubleclick', function(event) {
            HmGrid.updateBoundData($podGrid2, ctxPath + '/kub/getContainerList.do');
        });

        $('#section').css('display', 'block');
    },

    /** init data */
    initData : function() {

    },

    /** 파드모니터링 그리드 조회 */
    search : function() {
        HmGrid.updateBoundData($podGrid, ctxPath + '/kub/getPodList.do');
    },


    /** 컨테이너 현황 그리드 조회 */
    searchDtlInfo: function() {
        HmGrid.updateBoundData($podGrid2, ctxPath + '/kub/getContainerList.do')
    },

    /** export Excel */
    exportExcel: function() {
        HmUtil.exportGrid($podGrid, "파드 상세정보", false);
    },

    exportExcel2: function() {
        HmUtil.exportGrid($podGrid2, "컨테이너 상세정보", false);
    },

    /** 선택 파드명 표출 */
    putName: function(){
        $podGrid.on('rowdoubleclick', function(event){
            HmGrid.updateBoundData($podGrid2, ctxPath + "/kub/getPodList.do");

            var rowIdx = event.args.rowindex;
            var rowData = $(this).jqxGrid('getrowdata', rowIdx);
            var namespaceNm = rowData.namespaceNm;
            var podNm = rowData.podNm;

            $('#namesNmInput').html('선택 파드 [ ' + namespaceNm + ' / ' + podNm + ' ]');
        });
    }

};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
    Main.putName();
});
