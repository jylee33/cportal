var $codeTab;
var $fCodeGrid;
var $sCodeGrid;
var $fCodeList;
var addIndexes;
var editIndexes;

var PMain = {
    /** variable */
    initVariable: function () {
        $codeTab = $('#dtlTab');
        $fCodeGrid = $('#facilityCodeGrid');
        $fCodeList = $('#facilityCodeList');
        $sCodeGrid = $('#sensorCodeGrid');
        addIndexes = [];
        editIndexes = [];
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
            case 'btnSave_fCode':
            case 'btnSave_sCode':
                this.saveFmsCode();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        this.createTab();
        this.createGrid($fCodeGrid);
        this.createGrid($sCodeGrid);

        this.createFCodeList(); //센서탭 설비 목록
    },

    /** init data */
    initData: function () {
        this.search();
    },

    search: function () {
        $codeTab.jqxTabs('val') === 0 ? this.searchFacility() : this.searchSensor();
    },

    searchFacility: function () {
        HmGrid.updateBoundData($fCodeGrid, '/main/innotube/ItgEquipMgmt/getFmsCodeList.do')
    },

    searchSensor: function () {
        HmGrid.updateBoundData($sCodeGrid, '/main/innotube/ItgEquipMgmt/getFmsCodeList.do')
    },

    /* =======================================================
     *  버튼 제어
     * ======================================================= */
    addFacilityCode: function () {
        $fCodeGrid.jqxGrid('addrow', $fCodeGrid.jqxGrid('getrows').length, {});
    },

    saveFmsCode: function () {
        var _$grid = $codeTab.jqxTabs('val') === 0 ? $fCodeGrid : $sCodeGrid;
        var _list = this.getRowList(_$grid, editIndexes);

        if(_list.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        Server.post('/main/innotube/ItgEquipMgmt/saveFmsCode.do', {
            data: {list: _list},
            success: function (msg) {
                alert(msg);
                PMain.search();
                PMain.clearIndexes();
            }
        })
    },

    /* =======================================================
     *  편의 함수
     * ======================================================= */
    createTab: function () {
        $codeTab.jqxTabs({width: '100%', height: '100%', theme : 'ui-hamon-v1-tab-top',});
        $codeTab.on('selected', function (event) {

            var selectedTab = event.args.item;
            if (selectedTab === 1) PMain.getFCodeList();

            PMain.search();
            PMain.clearIndexes();
        });
    },

    createGrid: function ($grid) {
        HmGrid.create($grid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    addrow: function (rowid, rowdata, position, commit) {
                        addIndexes.push(rowid);
                        commit(true);
                    },
                    updaterow: function (rowid, rowdata, commit) {
                        if (!$.isEmpty(rowdata.codeId)) {
                            editIndexes.push(rowid);
                        }
                        commit(true);
                    }
                },
                {
                    formatData: function () {
                        return PMain.getParams();
                    }
                }
            ),
            editable: true,
            columns: [
                {text: '명칭', datafield: 'codeName', width: 150, editable: false},
                {text: '사용자표시명', datafield: 'codeUsrName', minwidth: 150},
                {text: '사용여부', datafield: 'useFlag', width: 60, columntype: 'checkbox', filterable: false},
                {text: '표시순서', datafield: 'sortIdx', width: 60, cellsalign: 'center', filterable: false}
            ]
        }, CtxMenu.NONE);
    },

    createFCodeList: function () {
        $fCodeList.jqxDropDownList({
            autoDropDownHeight: true, displayMember: 'codeUsrName', valueMember: 'codeId',
            theme: jqxTheme, height: 22, width: 120, selectedIndex: 0
        }).on('select', function () {
            PMain.search();
            PMain.clearIndexes();
        })
    },

    getFCodeList: function () {
        Server.get('/main/innotube/ItgEquipMgmt/getFmsCodeList.do', {
            data: {codeType: 'F'},
            success: function (result) {
                $fCodeList.jqxDropDownList({source: result})
            }
        })
    },

    getParams: function () {
        var params = {};
        var tabIdx = $codeTab.jqxTabs('val');

        params.codeType = tabIdx === 0 ? 'F' : 'S';
        if (tabIdx === 1) params.codeRefType = $fCodeList.val();

        return params;
    },

    getRowList: function ($grid, list) {
        var _list = [];
        $.each(list, function (idx, item) {
            var row = HmGrid.getRowData($grid, item);
            _list.push(row);
        });
        return _list;
    },

    clearIndexes: function () {
        addIndexes = [];
        editIndexes = [];
    }
};

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});