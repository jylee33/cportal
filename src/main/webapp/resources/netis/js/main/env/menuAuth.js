var MenuAuth = function() {
    this.AUTH_TYPE = 1;
    this.authGrid;
    this.menuTree;
};

MenuAuth.prototype = function() {
    /** variable */
    var initVariable = function() {
        this.authGrid = $('#authGrid');
        this.menuTree = $('#menuTree');
        this.AUTH_TYPE = 1;
    };

    /** add event */
    var observe = function() {
        $('button').bind('click', function(event) { eventControl(event); });
    };

    var eventControl = function(event) {
        var id = event.target.id;
        switch(id) {
            case 'btnAdd_auth': addAuth(); break;
            case 'btnEdit_auth': editAuth(); break;
            case 'btnDel_auth': delAuth(); break;
            case 'btnSave_authRel': saveAuthRel(); break;
        }
	};

    var initDesign = function() {
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 350, min: 150, collapsible: false }, { size: '100%' }], 'auto', '100%');

        var _self = this;
        // 메뉴 권한 설정
        HmTreeGrid.createAuth(this.menuTree, HmTree.T_AUTH_MENU);
        this.menuTree.jqxTreeGrid({ hierarchicalCheckboxes: true, checkboxes: true, filterable: false })
            .on('bindingComplete', function() {
                $(this).jqxTreeGrid('expandAll');
                initMenuAuth(); //checkbox 3state
            });

        HmGrid.create(_self.authGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json',
                    url: ctxPath + '/main/env/auth/getAuthList.do'
                },
                {
                    formatData: function(data) {
                        data.authType = _self.AUTH_TYPE;
                        return JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        editGrpIds = [];
                    }
                }
            ),
            editable: false,
            editmode: 'selectedrow',
            pageable: false,
            // ready: function() {
            //     _self.authGrid.jqxGrid('selectrow', 0);
            // },
            columns:
			[
                { text : '권한', datafield : 'name' },
                { text : '기본', datafield : 'isDef', width: 60, columntype: 'checkbox', editable: false }
			]
        });
        this.authGrid.on('rowselect', function(event) {
            setTimeout(searchMenuAuth, 100);
        });
    };

    var initialize = function() {
        initVariable();
        observe();
        initDesign();
    };

    /* 권한 */
    var addAuth = function() {
        $.post(ctxPath + '/main/popup/env/pAuthAdd.do',{authType: this.AUTH_TYPE},
            function(result) {
                HmWindow.openFit($('#pwindow'), '메뉴권한 추가', result, 300, 130, 'p2window_init', {callbackFn: 'callbackFn_addAuth'});
            }
        );
    };
    var callbackAddAuth = function(data) {
        authGrid.jqxGrid('addrow', null, data, 'last');
    };

    var editAuth = function() {
        var authRow = HmGrid.getRowData(authGrid);
        if(authRow == null) {
            alert('권한을 선택하세요.');
            return;
        }
        if(authRow.isDef == 1) {
            alert('기본 권한은 수정 할 수 없습니다.');
            return;
        }
        $.post(ctxPath + '/main/popup/env/pAuthEdit.do', {authNo: authRow.authNo, name: authRow.name, authType: this.AUTH_TYPE},
            function(result) {
                HmWindow.openFit($('#pwindow'), '메뉴권한 수정', result, 300, 130, 'p2window_init', {callbackFn: 'callbackFn_editAuth'});
            }
        );
    };
    var callbackEditAuth = function(data) {
        var authRow = HmGrid.getRowData(authGrid);
        if(authRow == null) return;

        authGrid.jqxGrid('setcellvaluebyid', authRow.uid, 'name', data.name);
    };

    var delAuth = function() {
        var authRow = HmGrid.getRowData(authGrid);
        if(authRow == null) {
            alert('권한을 선택하세요.');
            return;
        }
        if(authRow.isDef == 1) {
            alert('기본 권한은 삭제 할 수 없습니다.');
            return;
        }
        if(!confirm('[{0}] 권한을 삭제 하시겠습니까?'.substitute(authRow.name))) return;
        Server.post('/main/env/auth/delAuth.do', {
            data: {authType: this.AUTH_TYPE, authNo: authRow.authNo},
            success: function(result) {
                authGrid.jqxGrid('deleterow', authRow.uid);
                authGrid.jqxGrid('selectrow', 0);
                alert('삭제되었습니다.');
            }
        });
    };

    /* 메뉴권한 설정 */
    var initMenuAuth = function() {
        var rows = this.menuTree.jqxTreeGrid('getRows');
        if(rows.length) {
            this.menuTree.jqxTreeGrid('beginUpdate');
            $.each(rows, function(idx, item) {
                menuTree.jqxTreeGrid('uncheckRow', item.uid);
            });
            this.menuTree.jqxTreeGrid('endUpdate');
        }
    };

    var searchMenuAuth = function() {
        var authRow = HmGrid.getRowData(this.authGrid);
        if(authRow == null) return;

        initMenuAuth();

        var _self = this;
        Server.post('/main/env/auth/getAuthRelList.do', {
            data: {authNo: authRow.authNo, authType: this.AUTH_TYPE},
            success: function(result) {
                if(result.length) {
                    _self.menuTree.jqxTreeGrid('beginUpdate');
                    _self.menuTree.jqxTreeGrid({hierarchicalCheckboxes:false});
                    $.each(result, function(idx, item) {
                        _self.menuTree.jqxTreeGrid('checkRow', item.relKeyNo);
                    });
                    _self.menuTree.jqxTreeGrid('endUpdate');
                }
            }
        });
    };

    var saveAuthRel = function() {
        var authRow = HmGrid.getRowData(this.authGrid);
        if(authRow == null) {
            alert('권한을 선택하세요.');
            return;
        }
        var chkItems = this.menuTree.jqxTreeGrid('getCheckedRows');
        var _relKeyNos = [];
        $.each(chkItems, function(idx, item) {
            _relKeyNos.push(item.menuNo);
        });

        Server.post('/main/env/auth/saveAuthRel.do', {
            data: { authType: this.AUTH_TYPE, authNo: authRow.authNo, relKeyNos: _relKeyNos },
            success: function(data) {
                alert('저장되었습니다.');
            }
        });
    };

    return {
        initialize: initialize,
        callbackAddAuth: callbackAddAuth,
        callbackEditAuth: callbackEditAuth
    };

}();

var menuAuth;
$(function () {
    menuAuth = new MenuAuth();
    menuAuth.initialize();
});

function callbackFn_addAuth(data) {
    menuAuth.callbackAddAuth(data);
}

function callbackFn_editAuth(data) {
    menuAuth.callbackEditAuth(data);
}