var $authGrid, $authTreeGrid, parentPage;

var PMain = {
    /** variable */
    initVariable: function () {
        $authGrid = $('#authGrid'), $authTreeGrid = $('#authTreeGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            PMain.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case "btnAdd_auth": this.addTopoAuth(); break;
            case "btnEdit_auth": this.editTopoAuth(); break;
            case "btnDel_auth": this.delTopoAuth(); break;
            case "btnSave_authsub": this.saveTopoAuthGrpSubgrp(); break;
            case "btnClose": $('#pwindow').jqxWindow('close'); break;
        }
    },

    /** init design */
    initDesign: function () {
        HmWindow.create($('#p2window'));

        $('#splitter').jqxSplitter({
            width: '100%',
            height: '100%',
            orientation: 'vertical',
            theme: jqxTheme,
            panels: [{ size: '60%' }, { size: "40%" }]
        });

        //토폴로지 권한설정
        HmGrid.create($authGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/grp/getTopoAuthGrpList.do',
                    datafields: [
                        { name: 'authGrpNo', type: 'int' },
                        { name: 'grpName', type: 'string' },
                        { name: 'userId', type: 'string' },
                        { name: 'userName', type: 'string' },
                        { name: 'editYn', type: 'string' }
                    ]
                }
            ),
            pageable: false,
            width: '99.4%',
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '토폴로지 권한');
            },
            columns:
                [
                    { text : '권한명', datafield : 'grpName', width : '50%', pinned: true },
                    { text : '상속자', datafield : 'userName', width: '30%' },
                    { text : '편집여부', datafield : 'editYn', width: '20%', cellsalign: 'center' }
                ]
        });
        $authGrid.on('rowselect', function(event) {
            var rowData = event.args.row;
            HmTreeGrid.updateData($authTreeGrid, HmTree.T_GRP_TOPO_AUTHCONF, {topoUserId: rowData.userId}, false);
            $authTreeGrid.on('bindingComplete', function(event) {
                var rows = $authTreeGrid.jqxTreeGrid('getRows');
                if(rows != null && rows.length > 0) {
                    for(var j = 0; j < rows.length; j++) {
                        //         $authTreeGrid.jqxTreeGrid('uncheckRow', rows[j].uid);
                        $authTreeGrid.jqxTreeGrid('expandRow', rows[j].uid);
                    }
                }
                $authTreeGrid.off('bindingComplete');
                setTimeout(PMain.setTopoAuthConf(rowData.authGrpNo), 1000);
            });
        });

        HmTreeGrid.create($authTreeGrid, HmTree.T_GRP_TOPO_AUTHCONF, null, {topoUserId: ''});
        // $('#authTreeGrid').jqxTreeGrid({ hierarchicalCheckboxes: true, checkboxes: true, filterable: false }); // 하위목록까지 전부 체크 on
        $authTreeGrid.jqxTreeGrid({ hierarchicalCheckboxes: false, checkboxes: true, filterable: false }); // 하위목록까지 전부 체크 off
    },

    /** init data */
    initData: function () {

    },

    /**
     * 토폴로지 권한그룹
     */
    setTopoAuthConf: function(authGrpNo) {
        Server.get('/grp/getTopoAuthGrpSubgrpList.do', {
            data: {authGrpNo: authGrpNo},
            success: function(result) {
                if(result != null && result.length > 0) {
                    $authTreeGrid.jqxTreeGrid('beginUpdate');
                    $.each(result, function(idx, item) {
                        $authTreeGrid.jqxTreeGrid('checkRow', item.topoGrpNo);
                    });
                    $authTreeGrid.jqxTreeGrid('endUpdate');
                }
            }
        });
    },

    addTopoAuth: function() {

        // $.post(ctxPath + '/main/popup/env/pTopoAuthGrpAdd.do', function(result) {
        //     HmWindow.openFit($('#p2window'), "토폴로지 권한 추가", result, 300, 200,'p2window_init');
        //
        // });

        $.post(ctxPath + '/main/popup/env/pTopoAuthGrpAdd.do',
            function(result) {
                HmWindow.openFit($('#p2window'), '토폴로지 권한 추가', result, 300, 130, 'p2window_init', {parentPage: parentPage});
            }
        );

    },
    
    editTopoAuth: function() {
        var rowdata = HmGrid.getRowData($authGrid);
        if(rowdata == null) {
            alert('권한을 선택해주세요');
            return;
        }
        $.get('/main/popup/env/pTopoAuthGrpEdit.do', function(result) {
            rowdata.parentPage = parentPage;
            HmWindow.openFit($('#p2window'), "토폴로지 권한 수정", result, 300, 200, 'p2window_init', rowdata);
        });
    },

    delTopoAuth: function() {
        var rowdata = HmGrid.getRowData($authGrid);
        if(rowdata == null) {
            alert('권한을 선택해주세요');
            return;
        }
        if(!confirm('토폴로지 권한[' + rowdata.grpName + ']을 삭제하시겠습니까?')) return;
        Server.post('/grp/delTopoAuthGrp.do', {
            data: { authGrpNo: rowdata.authGrpNo },
            success: function(result) {
                $authTreeGrid.jqxTreeGrid('clear');
                $authGrid.jqxGrid('deleterow', rowdata.uid);
                //메인페이지 재조회
                if(parentPage=='userConf'){
                    Main.initData();
                }
                alert('삭제되었습니다.');
            }
        })
    },

    saveTopoAuthGrpSubgrp: function() {
        var rowdata = HmGrid.getRowData($authGrid);
        if(rowdata == null) {
            alert('권한을 선택해주세요');
            return;
        }
        var chkItems = $authTreeGrid.jqxTreeGrid('getCheckedRows');
        var _topoGrpNos = [];
        $.each(chkItems, function(idx, item) {
            _topoGrpNos.push(item.grpNo);
        });

        Server.post('/grp/saveTopoAuthGrpSubgrp.do', {
            data: { authGrpNo: rowdata.authGrpNo, topoGrpNos: _topoGrpNos },
            success: function(data) {
                alert('저장되었습니다.');
            }
        });
    }

};

function addTopoAuthResult(data) {
    $authGrid.jqxGrid('addrow', null, data);
}
function editTopoAuthResult(data) {
    $authGrid.jqxGrid('updaterow', data.uid, data);
}

function pwindow_init(_params) {
    parentPage = _params.parentPage;
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
};
