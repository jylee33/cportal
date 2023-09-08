var $grpTree, $grpGrid;
var editGrpIds = [];


var Main = {

    /** variable */
    initVariable: function () {
        $grpTree = $('#grpTree'), $grpGrid = $('#grpGrid');
        this.initCondition();
    },

    initCondition: function () {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_neis_srch_type'));

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
            case 'btnSearch_dev':
                this.searchGrp();
                break;

            case 'btnDel_dev':

                this.delGrp();
                break;

            case 'btnSave_dev':
                this.saveGrp();
                break;
            case 'btnExcel_dev':
                this.exportExcel_grp();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
        }
    },

    /** init design */
    initDesign: function () {

        //검색바 호출.
        Master.createSearchBar1('', '', $("#srchBox"));

        HmWindow.create($('#pwindow'), 100, 100, 999);

        HmJqxSplitter.createTree($('#mainSplitter'));


        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT_GYEONGI, Main.searchGrp);


        HmGrid.create($grpGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editGrpIds.indexOf(rowid) == -1)
                            editGrpIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function (data) {

                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);

                        console.log(treeItem);
                        if (treeItem != null && treeItem != undefined) {
                            var grpNo = treeItem.grpNo;
                            var level = treeItem.level;
                            var educenterNo = grpNo.substr(grpNo.lastIndexOf("_") + 1, grpNo.length);
                            var educenterCode = grpNo.substr(0, grpNo.lastIndexOf("_"));
                            $.extend(data, HmBoxCondition.getCamelCaseSrchParams());
                            $.extend(data, {
                                level: level,
                                grpNo: grpNo,
                                educenterNo: educenterNo,
                                educenterCode: educenterCode,
                            });
                        }
                        return data;
                    },
                    loadComplete: function (records) {
                        editGrpIds = [];
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            editable: true,
            columns: [
                {
                    text: '그룹번호',
                    datafield: 'grpNo',
                    width: 100,
                    hidden: true,
                    editable: false
                },
                {text: '지원청 코드', datafield: 'educenterCode', width: '16.6%', editable: false, hidden: true},
                {text: '지원청', datafield: 'educenterName', width: '20%', editable: false},
                {text: '그룹명', datafield: 'grpName', width: '20%', editable: false},
                {text: 'NEIS 코드', datafield: 'grpCode', width: '20%', editable: true},
                {text: '전용회선 번호', datafield: 'grpKey', width: '20%', editable: true},
                {text: '메모', datafield: 'memo', width: '20%', editable: true},
            ],
        }, CtxMenu.COMM);

    },

    /** init data */
    initData: function () {

    },

    exportExcel_grp: function () {
        HmUtil.exportGrid($grpGrid, '전용 회선 정보', false);
    },

    /** 회선 */
    searchGrp: function () {
        HmGrid.updateBoundData($grpGrid, ctxPath + '/gyeongischool4/env/neisMgmt/getNeisMgmtList.do');
    },

    saveGrp: function () {

        HmGrid.endRowEdit($grpGrid);

        if (editGrpIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];
        $.each(editGrpIds, function (idx, value) {
            _list.push($grpGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/gyeongischool4/env/neisMgmt/saveNeisList.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                Main.searchGrp();
            }
        });

    },

    /** 회선 */
    delGrp: function () {

        var rowIdxes = HmGrid.getRowIdxes($grpGrid);

        if (rowIdxes === false) {
            alert('선택된 그룹이 없습니다.');
            return;
        }

        if (!confirm('[' + rowIdxes.length + ']건의 그룹을 삭제하시겠습니까?')) return;

        var _grpNos = [], _uids = [];

        $.each(rowIdxes, function (idx, value) {

            var tmp = $grpGrid.jqxGrid('getrowdata', value);

            _grpNos.push({
                grpCode: tmp.grpCode.replace(" ",""),
                grpNo: tmp.grpNo,
                educenterCode: tmp.educenterCode
            });
            _uids.push(tmp.uid);

        });

        Server.post('/gyeongischool4/env/neisMgmt/delNeisList.do', {
            data: {grpNos: _grpNos},
            success: function (result) {
                $grpGrid.jqxGrid('deleterow', _uids);
                alert('삭제되었습니다.');
            }
        });



    },


};

function refreshNeis() {
    HmGrid.updateBoundData($grpGrid);
}

function refreshGrp() {
    HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT_GYEONGI);
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});