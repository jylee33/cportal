/**
 * Created by Leeyouje on 2019-02-19.
 */
var $custAssetList, $assetGrid;

var assetId = '';
var colCodeList = [];

var Main = {
    /** variable */
    initVariable: function () {
        $custAssetList = $('#custAssetList');
        $assetGrid = $('#assetGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        //$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnAdd':
                this.addCustAssetData();
                break;
            case 'btnMultiAdd':
                this.addCustAssetMulti();
                break;
            case 'btnDel':
                this.delCustAssetData();
                break;
            case 'btnSave':
                this.saveAsset();
                break;
            case 'btnEdit':
                this.editCustAssetData();
                break;
            case 'btnSearch':
                this.searchCustAssetData();
                break;
            case 'btnSetting':
                this.custAssetSetting();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },
    initDesign: function () {

        $('#ctxmenu_custAsset').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                Main.selectCtxmenu(event);
            });

    },
    initData: function () {
        //자산 리스트 표현
        $custAssetList.jqxDropDownList({
            source: new $.jqx.dataAdapter({
                datatype: 'json',
                url: ctxPath + '/main/nms/custAssetMgmt/getCustAssetList.do'
            }),
            placeHolder: '-',
            width: 150, height: 22,
            displayMember: "assetNm",
            valueMember: "assetId",
            selectedIndex: 0,
            theme: jqxTheme
        }).on('bindingComplete', function (event) {
            var _ASSET_ID = $custAssetList.val();
            if (_ASSET_ID != '-') {
                assetId = _ASSET_ID;
                Main.createGrid(_ASSET_ID);
            }
        }).on('change', function () {

            $assetGrid.jqxGrid('destroy');
            $('#parentGridTarget').append('<div id="assetGrid"></div>');

            $assetGrid = $('#assetGrid');

            var _ASSET_ID = $custAssetList.val();
            assetId = _ASSET_ID;
            Main.createGrid(_ASSET_ID);
        });
    },
    createGrid: function (_ASSET_ID) {

        colCodeList = [];

        Server.get(ctxPath + '/main/nms/custAssetMgmt/getCustAssetColList.do', {
            data: {assetId: _ASSET_ID},
            success: function (result) {
                console.log(result);

                var _COLS = Main.createDynamicCol(result);

                var _CUST_ASSET_ADAPTER = new $.jqx.dataAdapter({
                        datatype: 'json',
                        url: ctxPath + '/main/nms/custAssetMgmt/getCustAssetData.do'
                    },
                    {
                        formatData: function (data) {
                            data.assetId = _ASSET_ID;
                            return data;
                        }//formatData
                    }
                );//source

                HmGrid.create($assetGrid, {
                    source: _CUST_ASSET_ADAPTER,
                    columns: _COLS
                }, CtxMenu.NONE);

                $assetGrid.on('contextmenu', function (event) {
                    return false;
                }).on('rowclick', function (event) {
                    if (event.args.rightclick) {
                        $assetGrid.jqxGrid('selectrow', event.args.rowindex);
                        var rowIdxes = HmGrid.getRowIdxes($assetGrid, '자산을 선택해주세요.');

                        var scrollTop = $(window).scrollTop();
                        var scrollLeft = $(window).scrollLeft();
                        $('#ctxmenu_custAsset').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                            parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                        return false;
                    }
                });


            }//success
        });//Server.post
    },
    getColumnList: function (_ASSET_ID) {
        Server.get(ctxPath + '/main/nms/custAssetMgmt/getCustAssetColList.do', {
            data: {assetId: _ASSET_ID},
            success: function (result) {
                return result;
            }//success
        });//Server.post
    },
    createDynamicCol: function (_COL_DATA) {

        var _COLS = [];//_COLS

        _COLS.push({
            text: 'seq',
            datafield: 'SEQ',
            hidden: true
        });

        console.log(_COL_DATA);

        for (var i = 0; i < _COL_DATA.length; i++) {
            var _ITEM = _COL_DATA[i];

            var _COL_OBJ = {
                text: _ITEM.colCap,
                datafield: 'P_' + _ITEM.colName,
                cellsalign: 'center',
                minwidth: 150
            };

            if (_ITEM.colType == 'CODE') {
                // $.extend(_COL_OBJ, {displayfield: 'DIS_P_'+_ITEM.colName});
                $.extend(_COL_OBJ, {displayfield: 'DIS_' + _ITEM.colName});
                /*  colCodeList[assetId + '_P_' + _ITEM.colName] = _ITEM.codeList;

                  _COL_OBJ.cellsRenderer = function(row, columnfield, value, defaulthtml, columnproperties){
                      var _COL_NAME = columnproperties.datafield;
                      var _COMPARE_LIST = colCodeList[assetId + '_' + _COL_NAME];

                      var newVal = value;
                      for(var i = 0 ; i < _COMPARE_LIST.length ; i++){
                          if(_COMPARE_LIST[i].codeId == value){
                              newVal = _COMPARE_LIST[i].codeValue1;
                          }
                      }//for end(i)
                      return '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 4px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">' + newVal + '</div>';
                  }*/
            }
            _COLS.push(_COL_OBJ);//_COLS.push
        }//for end(i)

        //공통부분
        _COLS.push({
                text: '수정자',
                datafield: 'REG_USER_ID',
                displayfield: 'REG_USER_NM',
                cellsalign: 'center',
                minwidth: 150
            },
            {
                text: '수정일시',
                datafield: 'LAST_UPD_TIME',
                minwidth: 150,
                cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                    var _YYYY = value.substring(0, 4);
                    var _MM = value.substring(4, 6);
                    var _DD = value.substring(6, 8);
                    var _HH = value.substring(8, 10);
                    var _mm = value.substring(10, 12);
                    var _SS = value.substring(12, 14);

                    var _FORMATED_DATE = _YYYY + '-' + _MM + '-' + _DD + ' ' + _HH + ':' + _mm + ':' + _SS;
                    return '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 4px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">' + _FORMATED_DATE + '</div>';
                }
            });

        return _COLS;
    },
    searchCustAssetData: function () {
        HmGrid.updateBoundData($assetGrid, ctxPath + '/main/nms/custAssetMgmt/getCustAssetData.do');
    },

    addCustAssetData: function () {
        if (assetId != null && assetId != '') {
            var _PARAMS = {
                assetId: assetId,
                assetTableName: 'CM_CUST_ASSET_' + assetId
            }
            $.get(ctxPath + '/main/popup/nms/pCustAssetDataAdd.do', _PARAMS,
                function (result) {
                    HmWindow.open($('#pwindow'), '데이터추가', result, 300, 500);
                }
            );
        } else if (assetId == '-') {
            alert("자산을 등록해주세요");
        } else {
            alert('항목을 선택해 주세요');
        }
    },
    delCustAssetData: function () {
        var _IDX = $assetGrid.jqxGrid('getselectedrowindex');
        if (_IDX != undefined && _IDX != -1) {

            if (confirm('삭제 하시겠습니까?')) {
                var _ROW_ID = $assetGrid.jqxGrid('getrowid', _IDX);

                var _ROW_DATA = $assetGrid.jqxGrid('getrowdata', _IDX);

                var _SEQ = _ROW_DATA.SEQ;

                Server.post(ctxPath + '/main/nms/custAssetMgmt/delCustAssetData.do', {
                    data: {assetId: assetId, seq: _SEQ},
                    success: function (result) {
                        alert('삭제되었습니다.');
                        $assetGrid.jqxGrid('deleterow', _ROW_ID);
                    }//success
                })
            }
        } else {
            alert("삭제할 항목을 선택해 주세요");
        }
    },
    editCustAssetData: function () {
        var _IDX = $assetGrid.jqxGrid('getselectedrowindex');
        if (_IDX != undefined && _IDX != -1) {
            var _ROW_ID = $assetGrid.jqxGrid('getrowid', _IDX);
            var _ROW_DATA = $assetGrid.jqxGrid('getrowdata', _IDX);
            var _SEQ = _ROW_DATA.SEQ;

            var _PARAM = _ROW_DATA;
            _PARAM.gridRowId = _ROW_ID;
            _PARAM.assetId = assetId;

            $.get(ctxPath + '/main/popup/nms/pCustAssetDataEdit.do', _PARAM,
                function (result) {
                    HmWindow.open($('#pwindow'), '데이터수정', result, 300, 500);
                }
            );
        } else {
            alert("수정할 항목을 선택해 주세요");
        }
    },
    custAssetSetting: function () {
        url = ctxPath + '/main/popup/nms/pCustAssetMgmtSetting.do';
        HmUtil.createPopup(url, $('#hForm'), '설정', 1300, 700, null);
    },
    addCustAssetMulti: function () {
        url = ctxPath + '/main/popup/nms/pCustAssetDataMultiAdd.do';

        if (assetId == "-") {
            alert("자산이 등롣되지 않았습니다.");
            return;
        }

        var params = {
            assetId: assetId,
            assetNm: $custAssetList.jqxDropDownList('getSelectedItem').label
        };

        HmUtil.createPopup(url, $('#hForm'), '자산데이터 멀티 추가', 1300, 700, params);
    },
    exportExcel: function () {
        // var _VAL = $custAssetList.jqxDropDownList('getSelectedItem');
        // if(_VAL == undefined || _VAL == null){
        //     alert("자산이 등롣되지 않았습니다.");
        //     return ;
        // }
        // var _ASSET_NM = _VAL.label;
        //
        // var params = {
        //     assetId: assetId,
        //     assetNm: _ASSET_NM
        // };//params
        //
        // HmUtil.exportExcel(ctxPath + '/main/nms/custAssetMgmt/export.do', params);
        HmUtil.exportGrid($assetGrid, '자산정보', false);
    },//exportExcel

    /** ContextMenu */
    selectCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'cm_filter':
                $assetGrid.jqxGrid('beginupdate');
                if ($assetGrid.jqxGrid('filterable') === false) {
                    $assetGrid.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    $assetGrid.jqxGrid({showfilterrow: !$assetGrid.jqxGrid('showfilterrow')});
                }, 300);
                $assetGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $assetGrid.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $assetGrid);
                    }
                );
                break;
        }
    }

};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});