var $lineGrid;
var $grpTree;

var editIds = [];

var fixedCols = [
    { text: '순번', datafield: 'SEQ_NO', minwidth: 60, cellsalign: 'right', pinned: true, editable: false, cellsalign: 'center' },
    { text: '상위 그룹명', datafield: 'UP_GRP_NAME', width: 180, pinned: true, editable: false, cellsalign: 'center' },
    { text: '상위 장비명', datafield: 'UP_DEV_NAME', minwidth: 150, pinned: true, cellsalign: 'center' },
    { text: '상위 IP', datafield: 'UP_DEV_IP', width: 100, pinned: true, cellsalign: 'center' },
    { text: '상위 링크', datafield: 'UP_IF_IDX_UP_NAME', minwidth: 80, pinned: true, cellsalign: 'center' },
    { text: '하위 링크', datafield: 'UP_IF_IDX_DOWN_NAME', minwidth: 80, pinned: true, cellsalign: 'center' },
    { text: '하위 그룹명', datafield: 'DOWN_GRP_NAME', width: 180, pinned: true, editable: false, cellsalign: 'center' },
    { text: '하위 장비명', datafield: 'DOWN_DEV_NAME', minwidth: 150, pinned: true, cellsalign: 'center' },
    { text: '하위 IP', datafield: 'DOWN_DEV_IP', width: 100, pinned: true, cellsalign: 'center' },
    { text: '상위 링크', datafield: 'DOWN_IF_IDX_UP_NAME',  minwidth: 80, pinned: true, cellsalign: 'center' },
    { text: '하위 링크', datafield: 'DOWN_IF_IDX_DOWN_NAME', minwidth: 80, pinned: true, cellsalign: 'center' }
];
var Main = {
    /** variable */
    initVariable: function() {
        $lineGrid = $('#lineGrid');
        $grpTree = $('#grpTree');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            // group
            case 'btnAdd_grp': this.addGrp(); break;
            case 'btnEdit_grp': this.editGrp(); break;
            case 'btnDel_grp': this.delGrp(); break;
            case "btnSearch": this.search();	break;
            case 'btnAdd': this.addLine(); break;
            case 'btnEdit': this.editLine(); break;
            case 'btnDel': this.delLine(); break;
            // case 'btnDynamicAdd': this.DynamicAdd(); break;
            // case 'btnDynamicSet': this.DynamicSet(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmTreeGrid.create($grpTree, HmTree.T_GRP_LINE, Main.search );
        HmGrid.create($lineGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editIds.indexOf(rowid) == -1)
                            editIds.push(rowid);
                        commit(true);
                    },
                    datafields:[
                        {name:'SEQ_NO', type:'string'},
                        {name:'UP_GRP_NAME', type:'string'},
                        {name:'UP_DEV_NAME', type:'string'},
                        {name:'UP_DEV_IP', type:'string'},
                        {name:'UP_IF_IDX_UP_NAME', type:'string'},
                        {name:'UP_IF_IDX_DOWN_NAME', type:'string'},
                        {name:'DOWN_GRP_NAME', type:'string'},
                        {name:'DOWN_DEV_NAME', type:'string'},
                        {name:'DOWN_DEV_IP', type:'string'},
                        {name:'DOWN_IF_IDX_UP_NAME',type:'string'},
                        {name:'DOWN_IF_IDX_DOWN_NAME', type:'string'},
                        {name:'X_VAL1', type:'string'},
                    ]
                },  {
                    formatData: function(data) {
                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                        var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
                        if(treeItem != null) {
                            _itemKind = treeItem.devKind2;
                            _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                            _grpParent = treeItem.grpParent;
                        }

                        $.extend(data, { grpNo: _grpNo,
                            grpParent: _grpParent,
                            itemKind: _itemKind});
                        return data;
                    },
                    loadComplete: function(records) {
                        editIds = [];
                    }
                }
            ),
            width: '100%',
            editable: false,
            editmode: 'selectedrow',
            columns: fixedCols
        }, CtxMenu.NONE);


        $lineGrid.on('contextmenu', function () {
            return false;
        }).on('rowclick', function(event) {
            if(event.args.rightclick) {
                $lineGrid.jqxGrid('selectrow', event.args.rowindex);
                var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                if($(window).height() < (event.args.originalEvent.clientY + $('#ctxmenu').height() + 10)) {
                    posY = $(window).height() - ($('#ctxmenu').height() + 10);
                }
                $('#ctxmenu').jqxMenu('open', posX, posY);
                return false;
            }
        });
        $('#ctxmenu').jqxMenu({ width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999 })
            .on('itemclick', function(event) {
                Main.selectCtxmenu(event);
            });


        $lineGrid.on('rowdoubleclick', function(event) {
            Main.searchLinePath();
        });

        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function() {
        // Main.search();
    },
    /** ContextMenu */
    selectCtxmenu: function(event) {
        var val = $(event.args)[0].title;
        if(val == null) return;
        switch(val) {
            case 'lineView': //필터:
                Main.searchLinePath();
                break;
            /** 공통 */
            case 'filter': //필터
                $lineGrid.jqxGrid('beginupdate');
                if($lineGrid.jqxGrid('filterable') === false) {
                    $lineGrid.jqxGrid({ filterable: true });
                }
                setTimeout(function() {
                    $lineGrid.jqxGrid({showfilterrow: !$lineGrid.jqxGrid('showfilterrow')});
                }, 300);
                $lineGrid.jqxGrid('endupdate');
                break;
            case 'filterReset': //필터초기화
                $lineGrid.jqxGrid('clearfilters');
                break;
            case 'colsMgr': //컬럼관리
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function(result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $lineGrid);
                    }
                );
                break;
        }
    },

    search: function() {
        Server.get("/main/lms/lineMgmt/getItemList.do", {
            data : {
                tableKind : 0
            },
            success : function(data) {
                var cols = fixedCols.slice(0);
                $.each(data, function(idx, item) {
                    if(item.colNm != 'CONN_SEQ_NO'){
                        if (item.colType == 'NUMBER') {
                            cols.push(
                                {
                                    text : item.colCap,
                                    datafield : item.colNm,
                                    width : 100,
                                });
                        } else {
                            cols.push(
                                {
                                    text : item.colCap,
                                    datafield : item.colNm,
                                    width : 100
                                });
                        }
                    }
                });

                $lineGrid.jqxGrid('beginupdate', true);
                $lineGrid.jqxGrid({ columns : cols });
                $lineGrid.jqxGrid('endupdate');

                HmGrid.updateBoundData($lineGrid, ctxPath + '/main/lms/lineMgmt/getLineList.do');
            }
        });

    },

    /** 추가 */
    addLine: function() {
        HmWindow.create($('#pwindow'), 100, 100);
        $.post(ctxPath + '/main/popup/lms/pLineAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), '선번 등록', result, 800, 551);
//						$('#pwindow').jqxWindow({ width: 600, height: 580, title: '<h1>선번 추가</h1>', content: result, position: 'center', resizable: false });
//						$('#pwindow').jqxWindow('open');
            }
        );
    },
    /** 수정 */
    editLine: function(){
        HmWindow.create($('#pwindow'), 100, 100);
        var rowIdx = HmGrid.getRowIdx($lineGrid, '선번을 선택해주세요.');
        if(rowIdx === false) return;
        var rowdata = $lineGrid.jqxGrid('getrowdata', rowIdx);


        $.post(ctxPath + '/main/popup/lms/pLineEdit.do',
            {seqNo: rowdata.SEQ_NO},
            function(result) {
                HmWindow.open($('#pwindow'), '선번 수정', result, 800, 551);
            });
    },
    /** 삭제 */
    delLine: function(){

        var rowIdxes = HmGrid.getRowIdxes($lineGrid);
        if(rowIdxes === false) {
            alert('선번을 선택해주세요.');
            return;
        }
        var item = $lineGrid.jqxGrid('getrowdata', rowIdxes);

        if(!confirm('[' + item.SEQ_NO + '] 번 선번을 삭제하시겠습니까?')) return;

        Server.post('/main/lms/lineMgmt/delLine.do', {
            data: {connSeqNo: item.SEQ_NO},
            success: function(result) {
                $lineGrid.jqxGrid('deleterow', item.uid);
                alert('삭제되었습니다.');
                Main.search();
            }
        });

    },

    /** 추가 */
    // DynamicSet: function() {
    // 	HmWindow.create($('#pwindow'), 100, 100);
    // 	$.post(ctxPath + '/main/popup/lms/pDynamicItem.do',
    // 			function(result) {
    // 		HmWindow.open($('#pwindow'), '동적컬럼 설정', result, 460, 320);
    // 	}
    // 	);
    // },

    searchLinePath: function(){
        // HmWindow.create($('#pwindow'), 100, 100);
        var rowIdx = HmGrid.getRowIdx($lineGrid, '선번을 선택해주세요.');
        if(rowIdx === false) return;
        var rowdata = $lineGrid.jqxGrid('getrowdata', rowIdx);

        $.post(ctxPath + '/main/popup/lms/pSearchLinePath.do', {
                seqNo: rowdata.SEQ_NO
            },
            function(result) {
                HmWindow.open($('#pwindow'), '경로 보기', result, 370, 530, 'pwindow_init', {});
            }
        );
    },

    /** 그룹관리 */
    addGrp: function() {
        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
        var _grpParent = 1;
        if(treeItem.devKind2 == 'GROUP') _grpParent = treeItem.grpNo;
        else _grpParent = treeItem.grpParent;

        $.get(ctxPath + '/main/popup/env/pLineGrpAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '그룹 등록', result, 400, 492, 'pwindow_init', _grpParent);
        });
    },

    editGrp: function() {
        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if(treeItem.devKind2 != 'GROUP') {
            alert('장비는 수정할 수 없습니다.');
            return;
        }
        if(treeItem.grpParent == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
        $.post(ctxPath + '/main/popup/env/pLineGrpEdit.do',
            { grpNo: treeItem.grpNo, grpName: treeItem.grpName.substr(0, treeItem.grpName.lastIndexOf('(')), grpParent: treeItem.grpParent, grpCode: treeItem.grpCode },
            function(result) {
                HmWindow.open($('#pwindow'), '그룹 수정', result, 400, 492);
            }
        );
    },

    delGrp: function() {
        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if(treeItem.devKind2 != 'GROUP') {
            alert('장비는 삭제할 수 없습니다.');
            return;
        }
        if(treeItem.grpParent == 0) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }
        var treeItem = grpSelection[0];
        if(!confirm('[' + treeItem.grpName.substr(0, treeItem.grpName.lastIndexOf('(')) + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delLineGrp.do', {
            data: { grpNo: treeItem.grpNo },
            success: function(result) {
                $grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $grpTree.jqxTreeGrid('selectRow', $grpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    }

};
function addGrpResult(addData, type) {
    HmTreeGrid.updateData($grpTree, HmTree.T_GRP_LINE);
    $('#pwindow').jqxWindow('close');
}
function editGrpResult(addData, type) {
    HmTreeGrid.updateData($grpTree, HmTree.T_GRP_LINE);
    $('#pwindow').jqxWindow('close');
}

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});