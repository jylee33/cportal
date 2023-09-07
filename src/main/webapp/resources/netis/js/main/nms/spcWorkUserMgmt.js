var $userGrid;
var _addIndexes = [];
var _editIndexes = [];
var _delIndexes = [];

var Main = {
    /** variable */
    initVariable: function() {
		$userGrid = $('#userGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch':
                Main.search();
                break;
			case 'btnAdd':
				Main.addUser();
				break;
            case 'btnSave':
                Main.saveUser();
                break;
            case 'btnDel':
                Main.delUser();
                break;

        }
    },

    /** init design */
    initDesign: function() {
     	HmGrid.create($userGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    addrow: function (rowid, rowdata, position, commit) {
                        _addIndexes.push(rowid);
                        commit(true)
                    },
                    updaterow: function (rowid, rowdata, commit) {
                        if(_editIndexes.indexOf(rowid) === -1 && !$.isBlank(rowdata.seqNo)) {
                            _editIndexes.push(rowid);
                        }
					    commit(true);
					},
                    deleterow: function (rowid, commit) {
                        _delIndexes.push(rowid);
                        commit(true)
                    }
                },
                {
                    formatData: function(data) {
                        return data;
                    }
                }
            ),
            editable: true,
            selectionmode: 'singlerow',
            columns: [
                { text: '이름', datafield: 'userName', width: 100, cellsalign: 'center' },
                { text: '유선', datafield: 'officeTel', width: 150, cellsalign: 'center' },
                { text: '핸드폰', datafield: 'cellTel', width: 150, cellsalign: 'center' },
                { text: '업무', datafield: 'work', width: 350, cellsalign: 'left' },
                { text: '직책', datafield: 'posName', width: 100, cellsalign: 'left' },
                { text: 'E-mail', datafield: 'email', width: 250, cellsalign: 'left' },
                { text: '회사명', datafield: 'deptName', width: 200, cellsalign: 'left' },
                { text: '메모', datafield: 'memo', minwidth: 80, cellsalign: 'left' }

            ]
        }, CtxMenu.COMM);
    },

    /** init data */
    initData: function() {
        Main.search();
    },

    search: function() {
        HmGrid.updateBoundData($userGrid,'/main/nms/spcWorkUserMgmt/getSpcWorkUserList.do');
    },

	addUser: function () {
        $userGrid.jqxGrid('addrow', null, {}, 'first');
    },

    saveUser: function () {
        if(!this.validation()) return;

        var params = {};

        params.addList = Main.getAddUserList();
        params.editList = Main.getEditUserList();
        params.addSize = params.addList.length;
        params.editSize = params.editList.length;

        if(params.addSize <= 0 && params.editSize <= 0) {
            alert('저장할 데이터가 없습니다.');
            return;
        }

        Server.post('/main/nms/spcWorkUserMgmt/saveSpcWorkUser.do', {
            data: params,
            success: function (message) {
                alert(message);

                Main.search();
                Main.clearList();
            }
        })
    },

    delUser: function () {
        var rowIdx = HmGrid.getRowIdx($userGrid, '사용자를 선택해주세요.');
        if(rowIdx === false) return;

        var rowData = HmGrid.getRowData($userGrid, rowIdx);
        if($.isBlank(rowData.seqNo)) {
            $userGrid.jqxGrid('deleterow', rowData.uid);
            return;
        }

        if(_addIndexes.length > 0 || _editIndexes.length > 0) {
            alert('기존 데이터는 진행 중인 작업 저장 후, 삭제해주세요.');
            return;
        }

        if(!confirm('사용자를 삭제하시겠습니까?')) return;

        Server.post('/main/nms/spcWorkUserMgmt/delSpcWorkUser.do', {
            data: { seqNo: rowData.seqNo },
            success: function (message) {
                alert(message);
                Main.search();
            }
        })
    },

    validation: function () {
        var valid = true;
        var rows = $userGrid.jqxGrid('getboundrows');

        $.each(rows, function (idx, item) {
            if($.isBlank(item.userName)) {
                alert('사용자 이름을 입력해주세요.');
                valid = false;
                return false;
            }
        });

        return valid;
    },

    getAddUserList: function () {
        var list = [];
        // 삭제된 항목 제거
        var filterList = _addIndexes.filter(function (data) {
            return _delIndexes.indexOf(data) === -1;
        });

        $.each(filterList, function (idx, rowId) {
            var rowIdx = $userGrid.jqxGrid('getrowboundindexbyid', rowId);
            var rowData = HmGrid.getRowData($userGrid, rowIdx);
            list.push(rowData);
        });

        return list;
    },

    getEditUserList: function () {
        var list = [];
        $.each(_editIndexes, function (idx, rowId) {
            var rowIdx = $userGrid.jqxGrid('getrowboundindexbyid', rowId);
            var rowData = HmGrid.getRowData($userGrid, rowIdx);
            list.push(rowData);
        });
        return list;
    },

    clearList: function () {
        _addIndexes = [];
        _editIndexes = [];
        _delIndexes = [];
    }
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});