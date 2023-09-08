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

            case 'btnExcel':
                this.exportExcel();
                break;

        }
    },


    /** init design */
    initDesign: function () {

        HmJqxSplitter.createTree($('#mainSplitter'));

        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT, Main.search);

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
            editable: false,
            editmode: 'selectedrow',
            columns: [
                {text: '그룹명', datafield: 'grpName', width: '15%',  hidden: false, cellsalign : 'right' },
                {text: '그룹번호', datafield: 'grpNo',   hidden: true, cellsalign : 'right' },

                {text: '장비번호', datafield: 'mngNo',  hidden: true, cellsalign : 'right' },
                {
                    text: '장비명',
                    datafield: 'userDevName',
                    width: '10%',
                    pinned: true, cellsalign : 'right'
                },
                {text: '장비 IP', datafield: 'devIp', width: '10%', cellsalign : 'right' },

                {text: '회선명', datafield: 'ifName', width: '7%', cellsalign : 'right' },
                {text: '대역폭', datafield: 'lineWidth', width: '7%', cellsalign : 'right', cellsrenderer: HmGrid.unit1000renderer },

                {text: '별칭', datafield: 'ifAlias', width: '30%', cellsalign : 'right' },
                {text: '담당자(아이디)', datafield: 'userId', width: '10%', cellsalign : 'right' },
                {text: '등록일', datafield: 'regUpd', width: '10%', cellsalign : 'right' , editable: false}
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

        HmGrid.updateBoundData($lineGrid, '/Gyeongischool4/lms/lineMgmt/getLineList.do')

    },

    exportExcel: function () {
        HmUtil.exportGrid($lineGrid, '회선정보', false);
    }

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});