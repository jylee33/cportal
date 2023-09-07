var $grpTree, $devAssetGrid;
var editIds = [], addIds = [];
var ctxIdxs = 0;

var Main = {
    /** variable */
    initVariable : function() {
        $grpTree = $('#dGrpTreeGrid');
		$devAssetGrid = $('#devAssetGrid');
    },

    /** add event */
    observe : function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnConf': this.showItemConf(); break;
            case 'btnAdd': this.addAsset(); break;
            case 'btnDel': this.delAsset(); break;
            case 'btnSave': this.saveAsset(); break;
            case 'btnSearch': this.searchAsset(); break;
            case 'btnExcel': this.exportExcel(); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.searchAsset();
        }
    },

    /** init design */
    initDesign : function() {
        $('#section').css('display', 'block');
        //검색바 호출.
        Master.createSearchBar1('','',$("#srchBox"));

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmWindow.create($('#pwindow'), 100, 100);
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree);

        Main.createGrid();
    },

    /** init data */
    initData: function() {
        /*
         DEV, AP 구분하는 탭을 제거했지만
         설정 팝업에 있는 버튼이 dtlTab 값에 따라 분기처리 되어있기 때문에 수동으로 설정해줌
         */
        $('#dtlTab').val(0);
    },

    createGrid: function () {
        HmGrid.create($devAssetGrid, {
            source : new $.jqx.dataAdapter(
                {
                    datatype : 'json',
                    updaterow : function(rowid, rowdata, commit) {
                        if (rowdata.DEV10_FLAG == 2 && rowdata.MNG_NO === null)
                            return;
                        if (editIds.indexOf(rowid) == -1)
                            editIds.push(rowid);
                        commit(true);
                    },
                    addrow: function(rowid, rowdata, position, commit) {
                        addIds.push(rowid);
                        commit(true);
                        setTimeout("Main.addrowResult(" + rowid + ");", 100);
                    }
                },
                {
                    formatData : function(data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    loadComplete : function(records) {
                        editIds = [], addIds = [];
                    }
                }
            ),
            selectionmode : 'singlerow',
            editable : true,
            editmode : 'selectedcell',
            columns : fixedCols
        }, CtxMenu.DEV10, ctxIdxs++);
    },

    getCommParams: function() {

        var params = Master.getDefGrpParams();
        params.sIp = Master.getSrchIp();
        params.sDevName = Master.getSrchDevName();

        return params;
    },

    selectTree: function() {
        Main.searchAsset();
    },

    /** 자산 조회 */
    searchAsset: function() {

        Server.get('/main/nms/assetInfo/getAssetItemList.do', {
            success : function(data) {
                var cols = fixedCols.slice(0);
                var codeList = {};

                $.each(data, function(idx, item) {
                    if (item.colType == 'NUMBER' || item.colType == 'INT') { //NUMBER 컬럼
                        cols.push(
                            {
                                text: item.colCap,
                                datafield: item.colNm,
                                width: 100,
                                align: 'center',
                                cellsalign: 'right',
                                columntype: 'numberinput',
                                createeditor: function (row, cellvalue, editor) {
                                    var _max = '';
                                    for (var i = 0; i < item.colSize; i++) {
                                        _max += '9';


                                    }
                                    editor.jqxNumberInput(
                                        {
                                            inputMode: 'simple',
                                            digits: item.colSize,
                                            decimalDigits: 0,
                                            min: 0,
                                            max: parseInt(_max)
                                        });
                                }
                            });
                    } else if(item.colType == 'CODE') { //CODE 컬럼
                        codeList['ASSET_' + item.colNm] = [{codeId: -1, codeValue1: '미설정'}];
                        cols.push( {
                            text: item.colCap, datafield: item.colNm, displayfield: 'DIS_ASSET_' + item.colNm, width: 100, align: 'center', columntype: 'dropdownlist',
                            createeditor: function(row, value, editor) {
                                editor.jqxDropDownList( {
                                    source: codeList['ASSET_' + item.colNm],
                                    valueMember: 'codeId', displayMember: 'codeValue1', theme: jqxTheme
                                });
                            }
                        });
                        // 코드성컬럼의 코드정보를 조회하여 바인딩한다.
                        Server.get('/code/getCodeListByCodeKind.do', {
                            data: { codeKind: 'ASSET_{0}'.substitute(item.colNm), useFlag: 1 },
                            success: function(codeResult) {
                                if(codeResult.length) {
                                    $.each(codeResult, function(idx, value) {
                                        codeList[codeResult[0].codeKind].push(value);
                                    });
                                }
                            }
                        });
                    } else { //VARCHAR 컬럼
                        cols.push(
                            {
                                text : item.colCap,
                                datafield : item.colNm,
                                width : 100,
                                align: 'center',
                                validation : function(cell, value) {
                                    if (value == '')
                                        return true;
                                    if (value.length > item.colSize) {
                                        return {
                                            result : false,
                                            message : item.colSize + '자 이내로 입력하세요.' };
                                    } else
                                        return true;
                                }

                            });
                    }
                });

                $devAssetGrid.jqxGrid('beginupdate', true);
                $devAssetGrid.jqxGrid({ columns : cols });
                $devAssetGrid.jqxGrid('endupdate');

                // 데이터 갱신
                HmGrid.updateBoundData($devAssetGrid, ctxPath + "/main/nms/assetInfo/getAssetInfoList.do");
            }
        });
    },

    /** 항목설정 */
    showItemConf : function() {
        $.get(ctxPath + '/main/popup/nms/pAssetItemConf.do',
            function(result) {
                HmWindow.open($('#pwindow'), '자산 항목 관리', result, 800, 600);
            }
        );
    },

    /** 자산 추가 */
    addAsset : function() {
        var treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
        if(treeItem === null || treeItem.devKind2 !== 'GROUP') {
            alert('그룹을 선택해주세요.');
            return;
        }

        if (addIds.length > 0) {
            // 수동추가시..
            var lastData = $devAssetGrid.jqxGrid('getrowdatabyid', addIds[addIds.length - 1]);
            if (lastData.GRP_NO == 0 || $.isBlank(lastData.DEV_NAME) || $.isBlank(lastData.DEV_IP))
                return;
        }

        //그룹에 붙은 괄호+숫자 제거
        var grpName = Hlpr.sliceCharBeforeStr(treeItem.grpName, '(');

        $devAssetGrid.jqxGrid('addrow', null, {
            DEV10_FLAG: 2, DEV10_FLAG_STR: '수동',
            GRP_NO: treeItem.grpNo,
            GRP_NAME: grpName,
            MNG_NO: null, DEV_NAME: null,
            DEV_IP: null, DEV_KIND1: null
        });
    },

    addrowResult: function(rowid) {
        // 그룹 미선택 에러를 표시하기 위한 코드
        $devAssetGrid.jqxGrid('begincelledit', rowid, 'DEV_NAME');
        $devAssetGrid.jqxGrid('endcelledit', rowid, 'DEV_NAME', false);
        // 추가된 Row로 스크롤 이동
        $devAssetGrid.jqxGrid('removesort');
        var rowidx = $devAssetGrid.jqxGrid('getrowboundindexbyid', rowid);
        $devAssetGrid.jqxGrid('ensurerowvisible', rowidx);
    },

    /** 자산정보 삭제 */
    delAsset : function() {

        var rowIdx = HmGrid.getRowIdx($devAssetGrid, '데이터를 선택해주세요.');

        if (rowIdx === false) return;

        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowdata = $devAssetGrid.jqxGrid('getrowdata', rowIdx);

        // 추가된 컬럼이면 로컬에서 삭제
        if (addIds.indexOf(rowdata.uid) !== -1 && rowdata.MNG_NO === undefined) {
            $devAssetGrid.jqxGrid('deleterow', rowdata.uid);
            delete addIds[addIds.indexOf(rowdata.uid)];
            return;
        }

        // DB데이터 삭제
        Server.post('/main/nms/assetInfo/delAssetInfo.do', {
            data : rowdata,
            success : function(result) {
                $devAssetGrid.jqxGrid('deleterow', rowdata.uid);
                alert(result);
            }
        });

    },

    /** 자산정보 저장 */
    saveAsset : function() {

        if (editIds.length == 0 && addIds.length == 0) {
            alert('변경된 내용이 존재하지 않습니다.');
            return;
        }

        var isValid = true, _delCols = ['DEV_KIND1'];
        var _list = [];

        $.each(editIds, function(idx, value) {
            var tmp = $devAssetGrid.jqxGrid('getrowdatabyid', value);

            if (tmp !== undefined) {
                $.each(_delCols, function(idx, delKey) {
                    delete tmp[delKey];
                });
                _list.push(tmp);
            }
        });

        $.each(addIds, function(idx, value) {
            var tmp = $devAssetGrid.jqxGrid('getrowdatabyid', value);

            if (tmp !== undefined) {
                $.each(_delCols, function(idx, delKey) {
                    delete tmp[delKey];
                });
                _list.push(tmp);
            }
        });
        if(_list.length == 0) {
            alert('저장할 데이터가 없습니다.');
            return;
        }

        $.each(_list, function(idx, item) {
            if($.isBlank(item.DEV_NAME)) {
                isValid = false;
                alert('장비명을 입력해주세요.');
                return;
            }
            if($.isBlank(item.DEV_IP)) {
                isValid = false;
                alert('장비IP를 입력해주세요.');
                return;
            }
            if(!$.validateIp(item.DEV_IP)) {
                isValid = false;
                alert('장비IP를 확인해주세요.');
                return;
            }
        });

        if(isValid == false) return;

        Server.post('/main/nms/assetInfo/saveAssetInfo.do', {
            data :  { list : _list },
            success : function(data) {
                editIds = [], addIds = [];
                alert(data);
            }
        });
    },

    exportExcel: function() {
        HmUtil.exportGrid($devAssetGrid, '장비자산정보', false);
    }
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

var fixedCols = [
    { text : '관리형태', datafield : 'DEV10_FLAG_STR', width : 65, editable : false, cellsalign: 'center',  filtertype: 'checkedlist',
        cellsrenderer: function (row, datafield, value, defaultHTML) {
            if(value == null) return;
            var _color = '#d4d4d4';
            switch(value.toString().toUpperCase()) {
                case "등록":
                    _color = '#69B2E4'; break;
                case "삭제":
                    _color = '#d4d4d4'; break;
                case "수동":
                    _color = '#97dd90'; break;
                default: return ;
            }
            var div = $('<div></div>', {
                class: 'jqx-center-align evtName evt',
                style: 'background: {0}'.substitute(_color),
                text: value
            });
            return div[0].outerHTML;
        }
    },
    { text : '타입', datafield : 'DEV_KIND1', editable : false, hidden: true },
    { text : '그룹', datafield : 'GRP_NO', displayfield : 'GRP_NAME', width : 200, columntype : 'dropdownlist', editable: false,
        validation : function(cell, value) {
            if (value == 0 || value == null) {
                return { result : false, message : '그룹을 선택해주세요.' };
            }
            return true;
        }
    },
    { text : '장비명', datafield : 'DEV_NAME', width : 200,
        validation: function(cell, value) {
            if($.isBlank(value)) {
                return { result: false, message: '장비명을 입력해주세요.' };
            }
            return true;
        }
    },
    { text : '장비IP', datafield : 'DEV_IP', width : 120,
        validation: function(cell, value) {
            if($.isBlank(value)) {
                return { result: false, message: '장비IP를 입력해주세요.' };
            }
            if(!$.validateIp(value)) {
                return { result: false, message: '장비IP를 확인해주세요.' };
            }
            return true;
        }
    }
];