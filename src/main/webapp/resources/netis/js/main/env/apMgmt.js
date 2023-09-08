var $grpTree, $devGrid, $apGrid;
var $apGrpTree, $confGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#grpTree'), $devGrid = $('#devGrid'), $apGrid = $('#apGrid');
        $apGrpTree = $('#apGrpTree'), $confGrid = $('#confGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnAdd_grp':
                this.addApGrp();
                break;
            case 'btnEdit_grp':
                this.editApGrp();
                break;
            case 'btnDel_grp':
                this.delApGrp();
                break;
            case 'btn_move':
                this.moveApToConf();
                break;
            case 'btnPoe_conf':
                this.addPoeConf();
                break;
            case 'btnSearch_conf':
                this.searchConf();
                break;
            case 'btnDel_conf':
                this.delConf();
                break;
            case 'btnSave_conf':
                this.saveConf();
                break;
            case 'btnDel_ap':
                this.delAp();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmWindow.create($('#pwindow'), 100, 100);

        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], 'auto', '100%');

        HmJqxSplitter.create($('#tSplitter, #bSplitter'), HmJqxSplitter.ORIENTATION_V, [{
            size: 285,
            min: 150,
            collapsible: false
        }, {size: '100%'}], 'auto', '100%', {showSplitBar: false});

        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEF_ALL, Main.searchDev);

        HmGrid.create($devGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/dev/getDevList.do'
                },
                {
                    formatData: function (data) {
                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                        var _grpNo = 0;
                        if (treeItem !== null) {
                            _grpNo = treeItem.grpNo;
                        }
                        $.extend(data, {
                            grpType: 'AP',
                            grpNo: _grpNo,
                            devKind2: 'AP_CONTROLLER'
                        });
                        return data;
                    }
                }
            ),
            width: '49.5%',
            columns:
                [
                    {text: '컨트롤러명', datafield: 'disDevName', width: '60%'},
                    {text: 'IP', datafield: 'devIp', width: '20%'},
                    {text: '종류', datafield: 'devKind2', width: '20%', filtertype: 'checkedlist'}
                ]
        });

        $devGrid.on('rowdoubleclick', function (event) {

            Main.searchIf();

        });

        HmGrid.create($apGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        var _grpNo = -1, _mngNo = -1;
                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                        if (treeItem !== null) {
                            _grpNo = treeItem.grpNo;
                        }
                        var rowIdx = HmGrid.getRowIdx($devGrid);
                        if (rowIdx !== false) _mngNo = $devGrid.jqxGrid('getrowdata', rowIdx).mngNo;
                        $.extend(data, {
                            grpNo: _grpNo,
                            mngNo: _mngNo
                        });
                        return data;
                    }
                }
            ),
            width: '50%',
            selectionmode: 'multiplerowsextended',
            pagerheight: 27,
            pagerrenderer: HmGrid.pagerrenderer,
            columns:
                [
                    {text: '컨트롤러명', datafield: 'devName', width: '30%'},
                    {text: 'AP명', datafield: 'apName', width: '30%'},
                    {text: 'AP Mac', datafield: 'apMac', width: '20%'},
                    {text: 'AP IP', datafield: 'apIp', width: '20%'}
                ]
        });

        HmTreeGrid.create($apGrpTree, HmTree.T_AP_GRP_DEFAULT, Main.searchConf);

        HmGrid.create($confGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    id: 'apNo'
                },
                {
                    formatData: function (data) {
                        var treeItem = HmTreeGrid.getSelectedItem($apGrpTree);
                        data.grpNo = treeItem !== null ? treeItem.grpNo : -1;
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            editable : true,
            columns:
                [
                    {text: '컨트롤러명', datafield: 'devName', width: '20%', editable : false},
                    {text: 'AP명', datafield: 'apName', width: '20%', editable : false},
                    {text: 'AP Mac', datafield: 'apMac', width: '20%', editable : false},
                    {text: 'AP IP', datafield: 'apIp', width: '20%', editable : false},
                    {text: 'AP 설치 위치', datafield: 'apLocation', width: '20%', editable : true},

                    {text: '위도', datafield: 'lat', width: '10%', editable : true},
                    {text: '경도', datafield: 'lnt', width: '10%', editable : true},

                    {text: 'POE 장비명', datafield: 'poeDevName', width: '14%', editable : false},
                    {text: 'POE IP', datafield: 'poeDevIp', width: '15%', editable : false},
                    {text: 'POE 회선명', datafield: 'poeIfName', width: '15%', editable : false}
                ]
        });

    },

    /** init data */
    initData: function () {

    },

    /** AP그룹 */
    addApGrp: function () {
        var grpSelection = $apGrpTree.jqxTreeGrid('getSelection');
        var treeItem = grpSelection[0];

        $.get(ctxPath + '/main/popup/env/pApGrpAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '그룹 등록', result, 400, 459, 'pwindow_init', treeItem);
        });
    },

    editApGrp: function () {
        var grpSelection = $apGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.level == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
        $.post(ctxPath + '/main/popup/env/pApGrpEdit.do',
            {grpNo: treeItem.grpNo, grpName: treeItem.grpName, grpParent: treeItem.grpParent},
            function (result) {
                HmWindow.open($('#pwindow'), '그룹 수정', result, 400, 459);
//						$('#pwindow').jqxWindow({ width: 400, height: 500, title: '<h1>그룹 수정</h1>', content: result, position: 'center', resizable: false });
//						$('#pwindow').jqxWindow('open');
            }
        );
    },

    delApGrp: function () {
        var grpSelection = $apGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.level == 0) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }
        var treeItem = grpSelection[0];
        if (!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delApGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $apGrpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $apGrpTree.jqxTreeGrid('selectRow', $apGrpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    searchDev: function () {
        HmGrid.updateBoundData($devGrid);
    },

    searchIf: function () {
        HmGrid.updateBoundData($apGrid, ctxPath + '/main/env/apMgmt/getDevApList.do');
    },

    moveApToConf: function () {
        var treeItem = HmTreeGrid.getSelectedItem($apGrpTree);
        if (treeItem === null) {
            alert('AP그룹을 선택해주세요.');
            return;
        }
        var rowIdxes = HmGrid.getRowIdxes($apGrid, 'AP를 선택해주세요.');
        if (rowIdxes === false) return;
        var list = [], newIds = [];
        for (var i = 0; i < rowIdxes.length; i++) {
            var tmp = $apGrid.jqxGrid('getrowdata', rowIdxes[i]);
            var newId = tmp.apNo;
            if ($confGrid.jqxGrid('getrowdatabyid', newId) === undefined) {
                newIds.push(newId);
                list.push({
                    devName: tmp.devName,
                    apName: tmp.apName,
                    apMac: tmp.apMac,
                    apIp: tmp.apIp,
                    apNo: tmp.apNo,
                    grpNo: -1
                });
            }
        }
        $confGrid.jqxGrid('addrow', newIds, list);
    },


    addPoeConf: function () {



        var rowIdxes = HmGrid.getRowIdxes($confGrid);
        if (rowIdxes === false) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var getselectedrowindexes = $confGrid.jqxGrid('getselectedrowindexes');

        var selectedRowData = null;

        if (getselectedrowindexes.length > 0) {
            selectedRowData = $confGrid.jqxGrid('getrowdata', getselectedrowindexes[0]);
        }

        // HmUtil.createPopup('/main/popup/nms/pApConf.do', $('#hForm'), 'pTopoAuthConf', 1200, 600);

        $.get(ctxPath + '/main/popup/env/pApConf.do',
            { apNo:  selectedRowData.apNo},
            function (result) {
                HmWindow.open($('#pwindow'), 'AP 스위치 포트 연결 '+ selectedRowData.apName + "_" + selectedRowData.apIp , result, 1200, 475);
            });


    },

    searchConf: function () {
        HmGrid.updateBoundData($confGrid, ctxPath + '/main/env/apMgmt/getApConfList.do');
    },

    delConf: function () {

        var rowIdxes = HmGrid.getRowIdxes($confGrid);
        if (rowIdxes === false) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        if (!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
        var _apNos = [], _uids = [];
        $.each(rowIdxes, function (idx, value) {
            var rowdata = $confGrid.jqxGrid('getrowdata', value);
            // 로컬메모리에서 추가된 경우 삭제하고 리턴
            if (rowdata.grpNo == -1) {
                $confGrid.jqxGrid('deleterow', rowdata.uid);
            }
            else {
                _apNos.push(rowdata.apNo);
                _uids.push(rowdata.uid);
            }
        });

        if (_apNos.length > 0) {
            Server.post('/main/env/apMgmt/delCfgAp.do', {
                data: {apNos: _apNos},
                success: function (result) {
                    $confGrid.jqxGrid('deleterow', _uids);
                }
            });
        }
    },

    saveConf: function () {
        var treeItem = HmTreeGrid.getSelectedItem($apGrpTree);
        if (treeItem === false) {
            alert('AP그룹을 선택해주세요.');
            return;
        }
        var _grpNo = treeItem.grpNo;
        var _list = $confGrid.jqxGrid('getboundrows');
        if (_list.length == 0) {
            alert('저장할 데이터가 없습니다.');
            return;
        }

        Server.post('/main/env/apMgmt/saveCfgAp.do', {
            data: {grpNo: _grpNo, list: _list},
            success: function (result) {
                HmGrid.updateBoundData($confGrid);
                alert('저장되었습니다.');
            }
        });
    },

    /** AP 삭제 */
    delAp: function () {

        var rowIdxes = HmGrid.getRowIdxes($apGrid);
        if (!rowIdxes) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        if (!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
        var delList = [];
        $.each(rowIdxes, function (idx, value) {
            var rowdata = $apGrid.jqxGrid('getrowdata', value);
            delList.push({mngNo : rowdata.mngNo, apNo : rowdata.apNo});
        });

        if (delList.length > 0) {
            Server.post('/main/env/apMgmt/delAp.do', {
                data: {list: delList},
                success: function (result) {
                    Main.searchIf();
                    Main.searchConf();
                    alert('삭제되었습니다.');
                }
            });
        }
    }

};

function refreshGrp() {
    HmTreeGrid.updateData($apGrpTree, HmTree.T_AP_GRP_DEFAULT);
}

function addGrpResult(addData, type) {
    HmTreeGrid.updateData($apGrpTree, HmTree.T_AP_GRP_DEFAULT);
    $('#pwindow').jqxWindow('close');
}

function editGrpResult(addData, type) {
    HmTreeGrid.updateData($apGrpTree, HmTree.T_AP_GRP_DEFAULT);
    $('#pwindow').jqxWindow('close');
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});