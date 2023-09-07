var $dtlTab;
var $slaGrid, $inetGrid;
var editSlaIds = [], editinetIds = [];
var Main = {
    /** variable */
    initVariable: function () {
        $dtlTab = $("#dtlTab");
        $slaGrid = $('#slaGrid');
        $inetGrid = $("#inetGrid");
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

            case 'btnSearch':
                this.searchSLA();
                break;

            case 'btnAdd':
                this.addQcSet();
                break;

            case 'btnSave':
                this.editSLA();
                break;

            case 'btnDel':
                this.delSla();
                break;

        }
    },

    /** init design */
    initDesign: function () {

        $('#mainSplitter').jqxSplitter({
            width: '99.8%',
            height: '99.8%',
            orientation: 'vertical',
            theme: jqxTheme,
            panels: [
                {size: 254, collapsible: true},
                {size: '100%'}]
        });

        $('#dGrpTreeGrid').on('bindingComplete', function () {
            try {
                $('#dGrpTreeGrid').jqxTreeGrid('setCellValue', 1, 'grpName', '인터넷서비스');
            } catch (e) {
            }
        });

        $dtlTab.jqxTabs({
            width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:

                        HmGrid.create($inetGrid, {
                            selectionmode: 'multiplerowsextended',
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        $.extend(data, {
                                            qcFlag: 0
                                        });
                                        return data;
                                    },
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editinetIds.indexOf(rowid) == -1) {
                                            editinetIds.push(rowid);
                                        }
                                        commit();
                                    }
                                },
                                {
                                    loadComplete: function (records) {
                                        editinetIds = [];
                                    }
                                }
                            ),
                            editable: true,
                            columns:
                                [
                                    {text: 'SEQ', datafield: 'qcNo', editable: false, hidden: true},
                                    {text: '그룹', datafield: 'grpNo', editable: false, hidden: true},
                                    {text: '그룹명', datafield: 'grpName', editable: false},
                                    {text: '이용기관', datafield: 'agncCd', editable: false},
                                    {text: 'IP', datafield: 'ip', editable: true},
                                    {
                                        text: '서비스대상',
                                        datafield: 'flag',
                                        cellsalign: 'center',
                                        editable: false,
                                        hidden: true
                                    },
                                    {
                                        text: '설명',
                                        datafield: 'desc',
                                        cellsalign: 'center',
                                        editable: false,
                                    },
                                ]
                        }, CtxMenu.NONE);
                        break;

                    case 1:

                        HmGrid.create($slaGrid, {
                            selectionmode: 'multiplerowsextended',
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        $.extend(data, {
                                            qcFlag: 1
                                        });
                                        return data;
                                    },
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editSlaIds.indexOf(rowid) == -1) {
                                            editSlaIds.push(rowid);
                                        }
                                        commit();
                                    }
                                },
                                {
                                    loadComplete: function (records) {
                                        editSlaIds = [];
                                    }
                                }
                            ),
                            editable: true,
                            columns:
                                [
                                    {text: 'SEQ', datafield: 'qcNo', editable: false, hidden: true},
                                    {text: '그룹', datafield: 'grpNo', editable: false, hidden: true},
                                    {text: '그룹명', datafield: 'grpName', editable: false},
                                    {text: '이용기관', datafield: 'agncCd', editable: false},
                                    {text: 'IP', datafield: 'ip', editable: true},
                                    {
                                        text: '서비스대상',
                                        datafield: 'flag',
                                        cellsalign: 'center',
                                        editable: false,
                                        hidden: true
                                    },
                                    {
                                        text: '설명',
                                        datafield: 'desc',
                                        cellsalign: 'center',
                                        editable: false,
                                    },
                                ]
                        }, CtxMenu.NONE);

                        break;
                }
            }
        });


        Master.createGrpTab2(Main.searchSLA);

    },

    /** init data */
    initData: function () {
    },

    getCommParams: function () {
        var params = Master.getGrpTabParams();
        return params;
    },

    /** 조회 */
    searchSLA: function () {


        switch ($dtlTab.val()) {
            case 0:
                HmGrid.updateBoundData($inetGrid, ctxPath + '/main/sla/qcMgmt/getQcMgmtList.do');
                break;
            case 1:
                HmGrid.updateBoundData($slaGrid, ctxPath + '/main/sla/qcMgmt/getQcMgmtList.do');
                break;
        }

    },


    /** 장애이력에서 잘못 체크한 항목을 삭제하기 위함  */
    delSla: function () {
        var rowData = null;

        if ($("#dtlTab").val()) {
            rowData = $slaGrid.jqxGrid('getrows');
        } else {
            rowData = $inetGrid.jqxGrid('getrows');
        }

        if (rowData.length == 0) {
            alert('삭제할 SLA를 선택해 주세요.');
            return;
        }

        if (!confirm('정말 삭제하시겠습니까? 입력한 데이터는 모두 삭제됩니다.')) return;

        var _list = [];


        for (var key in rowData) {

            _list.push({
                qcNo: rowData[key].qcNo
            })

        }


        Server.post('/main/sla/qcMgmt/delSlaQc.do', {
            data: {list: _list},
            success: function (result) {
                Main.searchSLA();
                alert('삭제되었습니다.');
            }
        });

    },


    addQcSet: function () {

        $.post(ctxPath + '/main/popup/sla/pQcSetAdd.do', null,
            function (result) {
                HmWindow.open($('#pwindow'), '품질 측정 설정', result, 400, 550);
            }
        );

    },


    editSLA: function () {

        var _list = [];

        switch ($("#dtlTab").val()) {

            case 0:

                if (editinetIds.length == 0) {
                    alert('변경된 데이터가 없습니다.');
                    return;
                }

                $.each(editinetIds, function (idx, value) {
                    var rowData = $inetGrid.jqxGrid('getrowdatabyid', value);
                    var params = {
                        qcNo: rowData.qcNo,
                        ip: rowData.ip,
                        desc: rowData.desc
                    };
                    _list.push(params);
                });

                break;

            case 1:

                if (editSlaIds.length == 0) {
                    alert('변경된 데이터가 없습니다.');
                    return;
                }

                $.each(editSlaIds, function (idx, value) {
                    var rowData = $slaGrid.jqxGrid('getrowdatabyid', value);

                    var params = {
                        qcNo: rowData.qcNo,
                        ip: rowData.ip,
                        desc: rowData.desc
                    };
                    _list.push(params);
                });
                break;
        }


        Server.post('/main/sla/qcMgmt/saveSlaQc.do', {
            data: {list: _list},
            success: function (data) {
                alert('저장되었습니다.');
                if ($("#dtlTab").val() == 0) {
                    editinetIds = [];
                } else {
                    editSlaIds = [];
                }
            }
        });
    },

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});