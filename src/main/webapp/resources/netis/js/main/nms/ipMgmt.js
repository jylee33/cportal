var $grpTree, $subnetGrid, $ipGrid;
var isSearchAll = false;

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid'), $subnetGrid = $('#subnetGrid'), $ipGrid = $('#ipGrid');
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
                this.searchSubnet();
                break;
            case 'btnEdit_net':
                this.editNetwork();
                break;
            case 'btnAdd_net':
                this.addNetwork();
                break;
            case 'btnSearch_ip':
                this.searchIp();
                break;
            case 'btnSearchAll_ip':
                this.searchIpAll();
                break;
            case 'btnEdit_ip':
                this.editIp();
                break;
            case "btnExcel":
                this.exportExcel();
                break;
            case "btnExcel_ip":
                this.exportExcel_ip();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchSubnet();
        }
    },

    /** init design */
    initDesign: function () {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], '100%', '100%');
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT, Main.selectTree);

        HmGrid.create($subnetGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'subName', type: 'string'},
                        {name: 'network', type: 'string'},
                        {name: 'networkRange', type: 'string'},
                        {name: 'grpName', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'devKind2', type: 'string'},
                        {name: 'vendor', type: 'string'},
                        {name: 'model', type: 'string'},
                        {name: 'totalHost', type: 'number'},
                        {name: 'ipCount', type: 'number'},
                        {name: 'scanDate', type: 'string'},
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, Master.getDefGrpParams($grpTree), HmBoxCondition.getSrchParams());
                        return data;
                    },
                    loadComplete: function (records) {
                        $('#titleIpGrid').text('');
                        $ipGrid.jqxGrid('clear');
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '');
            },
            columns:
                [
                    {text: '네트워크명', datafield: 'subName', width: 150},
                    {text: '네트워크 ID', datafield: 'network', width: 140},
                    {text: '네트워크 범위', datafield: 'networkRange', width: 220},
                    {text: '소속그룹', datafield: 'grpName', width: 130},
                    {text: '장비명', datafield: 'devName', width: 150},
                    {text: '장비IP', datafield: 'devIp', width: 120},
                    {text: '장비종류', datafield: 'devKind2', width: 130},
                    {text: '제조사', datafield: 'vendor', width: 130},
                    {text: '모델', datafield: 'model', width: 130},
                    {text: '총 Host', datafield: 'totalHost', width: 100, cellsalign: 'right', cellsformat: 'n'},
                    {text: 'Alive 수', datafield: 'ipCount', width: 100, cellsalign: 'right', cellsformat: 'n'},
                    {text: '스캔일시', datafield: 'scanDate', width: 150}
                ]
        }, CtxMenu.COMM, 'SUBNET');
        $subnetGrid.on('rowdoubleclick', function (event) {
            Main.searchIp();
        });

        HmGrid.create($ipGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'hostIp', type: 'string'},
                        {name: 'hostName', type: 'string'},
                        {name: 'hostMac', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'userIfNamePollStr', type: 'string'},
                        {name: 'ifName', type: 'string'},
                        {name: 'statusStr', type: 'string'},
                        {name: 'userGroup', type: 'string'},
                        {name: 'userName', type: 'string'},
                        {name: 'userTel', type: 'string'},
                        {name: 'memo', type: 'string'},
                        {name: 'lastUpd', type: 'string'},
                    ]
                },
                {
                    formatData: function (data) {

                        if (isSearchAll == false) {
                            var rowdata = HmGrid.getRowData($subnetGrid);
                            var fromTo = rowdata.networkRange.split('~');
                            if (rowdata != null) {
                                data.ipFromNo = fromTo[0];
                                data.ipToNo = fromTo[1];
                            }
                        }

                        return data;

                    }

                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '', 'titleIpGrid');
            },
            pagerheight: 27,
            pagerrenderer: HmGrid.pagerrenderer,
            columns:
                [
                    {text: '호스트IP', datafield: 'hostIp', width: 120},
                    {text: '호스트명', datafield: 'hostName', width: 140},
                    {text: 'MAC', datafield: 'hostMac', width: 140},
                    {text: '장비명', datafield: 'devName', width: 150},
                    {text: '장비IP', datafield: 'devIp', width: 100},
                    {text: '회선유형', datafield: 'userIfNamePollStr', width: 100},
                    {text: '회선명', datafield: 'ifName', width: 150},
                    {text: '운영상태', datafield: 'statusStr', width: 80},
                    {text: '부서명', datafield: 'userGroup', width: 120},
                    {text: '사용자', datafield: 'userName', width: 100},
                    {text: '연락처', datafield: 'userTel', width: 100},
                    {text: '메모', datafield: 'memo', minwidth: 150},
                    {text: '일시', datafield: 'lastUpd', width: 130}
                ]
        }, CtxMenu.COMM, 'IP');
    },

    /** init data */
    initData: function () {

    },

    /** 그룹트리 선택 */
    selectTree: function () {
        Main.searchSubnet();
    },

    /** 네트워크 조회 */
    searchSubnet: function () {
        HmGrid.updateBoundData($subnetGrid, ctxPath + '/main/nms/ipMgmt/getIpMgmtSubnetList.do');
    },

    /** 네트워크 수정 */
    editNetwork: function () {
        var rowdata = HmGrid.getRowData($subnetGrid);
        if (rowdata == null) {
            alert('데이터를 선택해주세요.');
            return;
        }
        $.post(ctxPath + '/main/popup/nms/pNetworkEdit.do', function (result) {
            HmWindow.open($('#pwindow'), '네트워크 수정', result, 320, 120, 'pwindow_init', rowdata);
        });
    },

    /** 네트워크 추가 */
    addNetwork: function () {
        $.post(ctxPath + '/main/popup/nms/pNetworkAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '네트워크 추가', result, 320, 180);
        });
    },

    /** 네트워크 범위 조회 */
    searchIp: function () {

        isSearchAll = false;
        var rowdata = HmGrid.getRowData($subnetGrid);
        if (rowdata == null) return;
        $('#titleIpGrid').text('범위 [' + rowdata.networkRange + ']');

        HmGrid.updateBoundData($ipGrid, ctxPath + '/main/nms/ipMgmt/getIpMgmtIpList.do');

    },

    searchIpAll: function () {
        isSearchAll = true;
        $('#titleIpGrid').text('범위 [전체]');
        HmGrid.updateBoundData($ipGrid, ctxPath + '/main/nms/ipMgmt/getIpMgmtIpList.do');
    },

    editIp: function () {
        var rowdata = HmGrid.getRowData($ipGrid);
        if (rowdata == null) {
            alert('데이터를 선택해주세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/nms/pIpMgmtIpEdit.do',
            {hostIp: rowdata.hostIp},
            function (result) {
                HmWindow.open($('#pwindow'), 'IP정보 수정', result, 450, 340);
            }
        );
    },

    /** export Excel */
    exportExcel: function () {
        HmUtil.exportGrid($subnetGrid, 'IP관리', false);
//			var params = Master.getDefGrpParams($grpTree);
//			params.sIp = $('#sIp').val();
//			params.sDevName = $('#sDevName').val();
//			
//			HmUtil.exportExcel(ctxPath + '/main/nms/ipMgmt/export.do', params);
    },

    exportExcel_ip: function () {
        HmUtil.exportGrid($ipGrid, 'IP관리_IP리스트', false);
//			var params = Master.getDefGrpParams($grpTree);
//			if(isSearchAll == false) {
//				var rowdata = HmGrid.getRowData($subnetGrid);
//				if(rowdata != null) {
//					params.ipFromNo = rowdata.ipFromNo;
//					params.ipToNo = rowdata.ipToNo;
//				}
//			}
//			
//			HmUtil.exportExcel(ctxPath + '/main/nms/ipMgmt/exportIp.do', params);
    }

};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});