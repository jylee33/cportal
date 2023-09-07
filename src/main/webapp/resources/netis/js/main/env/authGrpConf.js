var $authGrpGrid;
var $authRecvGrid;
var editGrpIds = [];
var $evtGrid, $exmenuGrid, $authGrpTree, $authRackGrpTree, $authApGrpTree;
var _grpNo = 0;
var Main = {
    /** variable */
    initVariable: function() {
        $authGrpGrid = $('#authGrpGrid');
        $authRecvGrid = $('#authRecvGrid');
        $evtGrid = $('#evtGrid'), $exmenuGrid = $('#exmenuGrid'), $authGrpTree = $('#authGrpTree'), $authRackGrpTree = $('#authRackGrpTree');
        $authApGrpTree = $('#authApGrpTree');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnAdd_grp': this.addAuthGrp(); break;
            case 'btnDel_grp': this.delAuthGrp(); break;
            case 'btnSave_grp': this.saveAuthGrp(); break;
            case 'btnSave_acGrp': this.saveAuthConfGrp(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmWindow.create($('#p2window'), 100, 100);

        HmGrid.create($authGrpGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/grp/getAuthGrpList.do',
                    // updaterow: function(rowid, rowdata, commit) {
                    // 	if(editGrpIds.indexOf(rowid) == -1)
                    // 		editGrpIds.push(rowid);
                    // 	commit(true);
                    // },
                    addrow: function(rowid, rowdata, commit) {
                        Server.post('/grp/addAuthGrp.do', {
                            data: rowdata,
                            success: function() {
                                HmGrid.updateBoundData($authGrpGrid);
                                $('#p2window').jqxWindow('close');
                                alert('추가되었습니다.');
                            }
                        });
                        commit(true);
                    }
                },
                {
                    loadComplete: function(records) {
                        editGrpIds = [];
                    }
                }
            ),
            editable: false,
            editmode: 'selectedrow',
            pageable: false,
            ready: function() {
                $authGrpGrid.jqxGrid('selectrow', 0);
                setTimeout('Main.search();', 200);
            },
            columns:
                [
                    { text : '그룹명', datafield : 'grpName' }
                ]
        });
        $authGrpGrid.on('rowselect', function(event) {
            _grpNo = event.args.row.grpNo;
            Main.search();
        });

        $('#mainTabs').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function(tab) {
                switch(tab) {
                    case 0:
                        HmJqxSplitter.create($('#authGrpSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
                        HmJqxSplitter.create($('#authGrpSplitterSub'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

                        HmTreeGrid.create($authGrpTree, HmTree.T_GRP_AUTHCONF);
                        $authGrpTree.jqxTreeGrid({ hierarchicalCheckboxes: true, checkboxes: true, filterable: false, height: "95%" });

                        HmTreeGrid.create($authRackGrpTree, HmTree.T_GRP_AUTH_RACK_CONF);
                        $authRackGrpTree.jqxTreeGrid({ hierarchicalCheckboxes: true, checkboxes: true, filterable: false, height: "95%" });

                        HmTreeGrid.create($authApGrpTree, HmTree.T_GRP_AUTH_AP_CONF);
                        $authApGrpTree.jqxTreeGrid({ hierarchicalCheckboxes: true, checkboxes: true, filterable: false, height: "95%" });

                        setTimeout('Main.search();', 200);
                        break;
                    case 1:
                        HmGrid.create($authRecvGrid, {
                            source: new $.jqx.dataAdapter({
                                    datatype: 'json',
                                    url: ctxPath + '/main/com/recvGrpMgmt/getRecvGrpList.do',
                                    id: 'recvGrpNo'
                                },
                                {
                                    formatData: function(data) {
                                        return data;
                                    }
                                }
                            ),
                            height: '100%',
                            pageable: false,
                            selectionmode: 'checkbox',
                            columns: [
                                { text : '그룹번호', datafield : 'recvGrpNo', hidden: true },
                                { text : '수신자 그룹명', datafield : 'recvGrpName' },
                            ]
                        });

                        setTimeout('Main.search();', 200);
                        break;
                }
            }
        }).on('selected',function(event){
            Main.search();
        });
    },

    /** init data */
    initData: function() {

    },

    /** 권한그룹 */
    addAuthGrp: function() {
        $.get(ctxPath + '/main/popup/env/pAuthGrpAdd.do', function(result) {
            HmWindow.openFit($('#p2window'), '권한그룹 등록', result, 300, 120);
            // $('#p2window').jqxWindow({ width: 300, height: 120, title: '<h1>권한그룹 등록</h1>', content: result, position: 'center', resizable: false });
            // $('#p2window').jqxWindow('open');
        });
    },

    delAuthGrp: function() {
        var rowIdx = HmGrid.getRowIdx($authGrpGrid, '데이터를 선택해주세요.');
        if(rowIdx === false) return;
        if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowdata = $authGrpGrid.jqxGrid('getrowdata', rowIdx);
        Server.post('/grp/delAuthGrp.do', {
            data: rowdata,
            success: function(result) {
                $authGrpGrid.jqxGrid('deleterow', $authGrpGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },

    saveAuthGrp: function() {
        var rowIdx = HmGrid.getRowIdx($authGrpGrid, '데이터를 선택해주세요.');
        if(rowIdx === false) return;

        var rowdata = $authGrpGrid.jqxGrid('getrowdata', rowIdx);


        $.post(ctxPath + '/main/popup/env/pAuthGrpEdit.do',
            { grpNo: rowdata.grpNo, grpName: rowdata.grpName },
            function(result) {
                HmWindow.openFit($('#p2window'), '권한그룹 수정', result, 300, 120);
                // HmWindow.open($('#pwindow'), '권한그룹 수정', result, 300, 120);
                // $('#p2window').jqxWindow({ width: 300, height: 120, title: '<h1>권한그룹 수정</h1>', content: result, position: 'center', resizable: false });
                // $('#p2window').jqxWindow('open');
            }
        );
    },

    /** 조회 */
    search: function() {
        var rowIdx = HmGrid.getRowIdx($authGrpGrid);
        if(rowIdx === false) return;
        var params = {
            authGrpNo: _grpNo
        };
        switch($('#mainTabs').val()) {
            case 0:
                var rows = $authGrpTree.jqxTreeGrid('getRows');
                if(rows != null) {
                    try {
                        $authGrpTree.jqxTreeGrid('beginUpdate');
                        $authGrpTree.jqxTreeGrid('uncheckRow', rows[0].uid);
                        $authGrpTree.jqxTreeGrid('endUpdate');
                    } catch(e) {}
                }
                rows = $authRackGrpTree.jqxTreeGrid('getRows');
                if(rows != null) {
                    try {
                        $authRackGrpTree.jqxTreeGrid('beginUpdate');
                        $authRackGrpTree.jqxTreeGrid('uncheckRow', rows[0].uid);
                        $authRackGrpTree.jqxTreeGrid('endUpdate');
                    } catch(e) {}
                }
                rows = $authApGrpTree.jqxTreeGrid('getRows');
                if(rows != null) {
                    try {
                        $authApGrpTree.jqxTreeGrid('beginUpdate');
                        $authApGrpTree.jqxTreeGrid('uncheckRow', rows[0].uid);
                        $authApGrpTree.jqxTreeGrid('endUpdate');
                    } catch(e) {}
                }
                Server.get('/main/env/authGrpConf/getAuthConfGrpList.do', {
                    data: params,
                    success: function(data) {
                        if(data != null) {
                            $authGrpTree.jqxTreeGrid('beginUpdate');
                            $authRackGrpTree.jqxTreeGrid('beginUpdate');
                            $authApGrpTree.jqxTreeGrid('beginUpdate');
                            $.each(data, function(idx, value) {
                                $authGrpTree.jqxTreeGrid('checkRow', value.ntGrpNo);
                                $authRackGrpTree.jqxTreeGrid('checkRow', value.ntGrpNo);
                                $authApGrpTree.jqxTreeGrid('checkRow', value.ntGrpNo);
                            });
                            $authGrpTree.jqxTreeGrid('endUpdate');
                            $authRackGrpTree.jqxTreeGrid('endUpdate');
                            $authApGrpTree.jqxTreeGrid('endUpdate');
                        }
                    }
                });
                $authGrpTree.jqxTreeGrid('endUpdate');
                $authRackGrpTree.jqxTreeGrid('endUpdate');
                $authApGrpTree.jqxTreeGrid('endUpdate');
                break;
            case 1:
                Server.get('/main/env/authGrpConf/getAuthConfRecvGrpList.do', {
                    data: params,
                    success: function(data) {
                        $authRecvGrid.jqxGrid('clearselection');
                        if(data != null) {
                            $.each(data, function(idx, value) {
                                var rd = $authRecvGrid.jqxGrid('getrowdatabyid', value.ntGrpNo);
                                $authRecvGrid.jqxGrid('selectrow', rd.boundindex);
                            });
                        }
                    }
                });

                break;
        }
    },

    saveAuthConfGrp: function() {
        var rowIdx = HmGrid.getRowIdx($authGrpGrid, '권한을 선택해주세요.');
        if(rowIdx === false) return;
        var _authGrpNo = _grpNo;

        switch($('#mainTabs').val()) {
            case 0:
                var chkItems = $authGrpTree.jqxTreeGrid('getCheckedRows');
                chkItems = chkItems.concat($authRackGrpTree.jqxTreeGrid('getCheckedRows'));
                chkItems = chkItems.concat($authApGrpTree.jqxTreeGrid('getCheckedRows'));
                var _ntGrpNos = [];
                $.each(chkItems, function (idx, item) {
                    _ntGrpNos.push(item.grpNo);
                });

                Server.post('/main/env/authGrpConf/saveAuthConfGrp.do', {
                    data: {authGrpNo: _authGrpNo, ntGrpNos: _ntGrpNos},
                    success: function (data) {
                        alert('저장되었습니다.');
                    }
                });
                break;
            case 1:
                var idxes = $authRecvGrid.jqxGrid('getselectedrowindexes');
                var _recvGrpNos = [];
                $.each(idxes, function (idx, value) {
                    var item = $authRecvGrid.jqxGrid('getrowdata', value);
                    console.log(item);
                    _recvGrpNos.push(item.recvGrpNo);
                });

                Server.post('/main/env/authGrpConf/saveAuthConfRecvGrp.do', {
                    data: {authGrpNo: _authGrpNo, recvGrpNos: _recvGrpNos},
                    success: function (data) {
                        alert('저장되었습니다.');
                    }
                });
                break;
        }
    }
};

function addGrpResult(addData) {
    $authGrpGrid.jqxGrid('addrow', null, addData);
}
function editGrpResult() {
    $authGrpGrid.jqxGrid('updatebounddata');
}
$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});