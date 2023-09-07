var $lineGrid;
var $grpTree;

var editIds = [];

var Main = {
    /** variable */
    initVariable: function () {
        $lineGrid = $('#lineGrid');
        $grpTree = $('#grpTree');
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
            case "btnSearch":
                this.search();
                break;
            case 'btnEdit':
                this.editLine();
                break;
            case 'btnDel':
                this.delLine();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },


    /** init design */
    initDesign: function () {

        HmJqxSplitter.createTree($('#mainSplitter'));

        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT_GYEONGI, Main.search);

        HmGrid.create($lineGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editIds.indexOf(rowid) == -1)
                            editIds.push(rowid);
                        commit(true);
                    },
                    datafields: [
                        {name: 'educenterCode', type: 'string'},
                        {name: 'grpNo', type: 'number'},
                        {name: 'grpName', type: 'string'},
                        {name: 'mngNo', type: 'number'},
                        {name: 'userDevName', type: 'string'},
                        {name: 'devIp', type: 'string'},

                        {name: 'ifIdx', type: 'number'},
                        {name: 'ifName', type: 'string'},
                        {name: 'ifAlias', type: 'string'},
                        {name: 'lineWidth', type: 'number'},

                        {name: 'userId', type: 'string'},
                        {name: 'regUpd', type: 'string'}

                    ]
                }, {
                    formatData: function (data) {

                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);

                        var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';

                        if (treeItem != null) {
                            _itemKind = treeItem.devKind2;
                            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                            _grpParent = treeItem.grpParent;
                        }

                        $.extend(data, {
                            grpType: 'DEFAULT',
                            grpNo: _grpNo,
                            grpParent: _grpParent,
                            itemKind: _itemKind
                        });

                        return data;
                    },
                    loadComplete: function (records) {
                        editIds = [];
                    }
                }
            ),
            width: '100%',
            editable: true,
            selectionmode: 'multiplerowsextended',
            editmode: 'selectedrow',
            columns: [
                {
                    text: '그룹코드',
                    datafield: 'educenterCode',
                    width: 80,
                    hidden: true,
                    editable: false,
                    cellsalign: 'right'
                },
                {
                    text: '그룹명',
                    datafield: 'grpName',
                    width: '15%',
                    hidden: false,
                    editable: false,
                    cellsalign: 'right'
                },
                {
                    text: '그룹번호',
                    datafield: 'grpNo',
                    width: 80,
                    hidden: true,
                    editable: false,
                    cellsalign: 'right'
                },
                {
                    text: '장비번호',
                    datafield: 'mngNo',
                    width: 80,
                    hidden: true,
                    editable: false,
                    cellsalign: 'right'
                },
                {
                    text: '장비명',
                    datafield: 'userDevName',
                    width: '10%',
                    editable: false, cellsalign: 'right'
                },
                {text: '장비 IP', datafield: 'devIp', width: '10%', editable: false, cellsalign: 'right'},
                {text: '회선 번호', datafield: 'ifIdx', hidden: true, editable: false, cellsalign: 'right'},
                {text: '회선명', datafield: 'ifName', width: '7%', editable: false, cellsalign: 'right'},
                {
                    text: '대역폭',
                    datafield: 'lineWidth',
                    width: '7%',
                    editable: false,
                    cellsalign: 'right',
                    cellsrenderer: HmGrid.unit1000renderer
                },

                {text: '별칭', datafield: 'ifAlias', width: '30%', editable: true, cellsalign: 'right'},
                {text: '담당자(아이디)', datafield: 'userId', width: '10%', editable: false, cellsalign: 'right'},
                {text: '등록일', datafield: 'regUpd', width: '10%', editable: false, cellsalign: 'right'}

            ]
        }, CtxMenu.NONE);


        $lineGrid.on('contextmenu', function () {
            return false;
        }).on('rowclick', function (event) {
            if (event.args.rightclick) {
                $lineGrid.jqxGrid('selectrow', event.args.rowindex);
                var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                if ($(window).height() < (event.args.originalEvent.clientY + $('#ctxmenu').height() + 10)) {
                    posY = $(window).height() - ($('#ctxmenu').height() + 10);
                }
                $('#ctxmenu').jqxMenu('open', posX, posY);
                return false;
            }
        });


        $('#ctxmenu').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999})
            .on('itemclick', function (event) {
                Main.selectCtxmenu(event);
            });

        $lineGrid.on('rowdoubleclick', function (event) {

        });

        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function () {
        // Main.search();
    },

    /** ContextMenu */
    selectCtxmenu: function (event) {
        var val = $(event.args)[0].title;
        if (val == null) return;
        switch (val) {
            // case 'lineView': //필터:
            //     Main.searchLinePath();
            //     break;
            /** 공통 */
            case 'filter': //필터
                $lineGrid.jqxGrid('beginupdate');
                if ($lineGrid.jqxGrid('filterable') === false) {
                    $lineGrid.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    $lineGrid.jqxGrid({showfilterrow: !$lineGrid.jqxGrid('showfilterrow')});
                }, 300);
                $lineGrid.jqxGrid('endupdate');
                break;
            case 'filterReset': //필터초기화
                $lineGrid.jqxGrid('clearfilters');
                break;
            case 'colsMgr': //컬럼관리
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $lineGrid);
                    }
                );
                break;
        }
    },

    search: function () {

        HmGrid.updateBoundData($lineGrid, '/Gyeongischool4/lms/lineMgmt/getImpalaLineList.do')

    },

    /** 수정 */
    editLine: function () {

        HmGrid.endRowEdit($lineGrid);

        if (editIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];

        $.each(editIds, function (idx, value) {
            _list.push($lineGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/Gyeongischool4/lms/lineMgmt/editImpalaLine.do', {
            data: {list: _list },
            success: function (result) {

                Server.post('/Gyeongischool4/lms/lineMgmt/editImpalaSyncLine.do', {
                    data: {list: _list},
                    success: function (result) {
                        alert(result);
                    }
                });
            }

        });

    },


    /** 수정 */
    delLine: function () {

        var rowIdxes = HmGrid.getRowIdxes($lineGrid);
        if (rowIdxes === false) {
            alert('선택된 장비가 없습니다.');
            return;
        }

        if (!confirm('[' + rowIdxes.length + ']건의 장비를 삭제하시겠습니까?')) return;


        var _list = [], _uids = [];

        $.each(rowIdxes, function (idx, value) {
            var tmp = $lineGrid.jqxGrid('getrowdata', value);
            _list.push({mngNo: tmp.mngNo, ifIdx: tmp.ifIdx, educenterCode: tmp.educenterCode});
            _uids.push(tmp.uid);
        });

        Server.post('/Gyeongischool4/lms/lineMgmt/delImpalaLine.do', {
            data: {list: _list},
            success: function (result) {
                $lineGrid.jqxGrid('deleterow', _uids);
                alert('삭제되었습니다.');
            }
        });
    },

    exportExcel: function () {
        HmUtil.exportGrid($lineGrid, '회선정보', false);
    },


};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});