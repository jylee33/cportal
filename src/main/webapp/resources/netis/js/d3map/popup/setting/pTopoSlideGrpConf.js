var $authTreeGrid;
var p_params = null;
var PMain = {
    /** variable */
    initVariable: function () {
        $authTreeGrid = $('#authTreeGrid');
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
            case "btnSave": this.saveTopoSlidGrp(); break;
            case "btnClose": $('#pwindow').jqxWindow('close'); break;
        }
    },

    /** init design */
    initDesign: function () {

        var rowData = event.args.row;
        HmTreeGrid.updateData($authTreeGrid, HmTree.T_GRP_TOPO_AUTHCONF, {topoUserId: rowData.userId}, false);
        $authTreeGrid.on('bindingComplete', function(event) {
            var rows = $authTreeGrid.jqxTreeGrid('getRows');
            if(rows != null && rows.length > 0) {
                for(var j = 0; j < rows.length; j++) {

                    $authTreeGrid.jqxTreeGrid('expandRow', rows[j].uid);
                }
            }
            $authTreeGrid.off('bindingComplete');
            setTimeout(PMain.setTopoAuthConf(rowData.authGrpNo), 1000);
        });


       // HmTreeGrid.create($authTreeGrid, HmTree.T_GRP_TOPO_AUTHCONF, null, {topoUserId: ''});

        $authTreeGrid.jqxTreeGrid({ hierarchicalCheckboxes: false, checkboxes: true, filterable: false }); // 하위목록까지 전부 체크 off
    },

    /** init data */
    initData: function () {

    },

    /**
     * 토폴로지 Slide 설정된 그룹 체크 표시
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

    saveTopoSlidGrp: function() {
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

        Server.post('/grp/saveTopoSlidGrp.do', {
            data: { authGrpNo: rowdata.authGrpNo, topoGrpNos: _topoGrpNos },
            success: function(data) {
                alert('저장되었습니다.');
            }
        });
    }

};


function pwindow_init(_params) {
    p_params = _params;
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
};
