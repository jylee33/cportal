var $profileGrid, $evtCodeGrid;
var curProfileNo = 0, editRowIds = [];
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;

var Main = {
    /** variable */
    initVariable: function() {
        $profileGrid = $('#profileGrid');
        $evtCodeGrid = $('#evtCodeGrid');
        evtLevel1Text = $("#sEvtLevel1").val();
        evtLevel2Text = $("#sEvtLevel2").val();
        evtLevel3Text = $("#sEvtLevel3").val();
        evtLevel4Text = $("#sEvtLevel4").val();
        evtLevel5Text = $("#sEvtLevel5").val();
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnAdd_profile': this.addProfile(); break;
            case 'btnDel_profile': this.delProfile(); break;
            case 'btnSave_info': this.saveProfileInfo(); break;
            case 'btnSave_limit': this.saveProfileLimit(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmJqxSplitter.createTree($('#splitter'));
        HmJqxSplitter.create($('#rSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 160, collapsible: false }, { size: '100%' }], 'auto', '100%');
        HmGrid.create($profileGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/env/rackProfileMgmt/getProfileList.do'
                }
            ),
            pageable: false,
            ready: function() {
                try {
                    $profileGrid.jqxGrid('selectrow', 0);
                } catch(e) {}
            },
            columns:
                [
                    { text : '프로파일', datafield : 'profileName' }
                ]
        });
        $profileGrid.on('rowselect', function(event) {
            curProfileNo = event.args.row.profileNo;
            Main.searchProfileDetail();
        });

        // 프로파일 정보
        $('#pollInterval').jqxDropDownList({ width: '80px', height: '21px', selectedIndex: 0, autoDropDownHeight: true,
            source: [{label: '30초', value: 30}, {label: '1분', value: 60}, {label: '2분', value: 120}, {label: '3분', value: 180}, {label: '4분', value: 240}, {label: '5분', value: 300}],
            displayMember: 'label', valueMember: 'value'
        });

        HmGrid.create($evtCodeGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editRowIds.indexOf(rowid) == -1)
                            editRowIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function(data) {
                        data.profileNo = curProfileNo;
                        return data;
                    },
                    loadComplete: function(records) {
                        editRowIds = [];
                    }
                }
            ),
            editable: true,
            editmode: 'selectedrow',
            pageable: false,
            columns:
                [
                    { text : '이벤트명', datafield : 'evtName', minwidth : 150 },
                    //{ text : '수집방법', datafield : 'engName', width : 100, editable: false },
                    //{ text : '발생구분', datafield : 'evtType', width : 100, editable: false },
                    { text : evtLevel1Text, columngroup: 'limit', datafield : 'limitValue1', width: 80, cellsalign: 'right', columntype: 'numberinput',
                        initeditor: Main.limitInitEditor
                    },
                    { text : evtLevel2Text, columngroup: 'limit', datafield : 'limitValue2', width : 80, cellsalign: 'right', columntype: 'numberinput',
                        initeditor: Main.limitInitEditor
                    },
                    { text : evtLevel3Text, columngroup: 'limit', datafield : 'limitValue3', width: 80, cellsalign: 'right', columntype: 'numberinput',
                        initeditor: Main.limitInitEditor
                    },
                    { text : evtLevel4Text, columngroup: 'limit', datafield : 'limitValue4', width: 80, cellsalign: 'right', columntype: 'numberinput',
                        initeditor: Main.limitInitEditor
                    },
                    { text : evtLevel5Text, columngroup: 'limit', datafield : 'limitValue5', width: 80, cellsalign: 'right', columntype: 'numberinput',
                        initeditor: Main.limitInitEditor
                    }
                ],
            columngroups: [
                { text: '임계값', align: 'center', name: 'limit' }
            ]
        });
    },

    /** init data */
    initData: function() {

    },

    /** 임계치 */
    limitInitEditor: function(row, cellvalue, editor) {
        editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 9999999999 });
    },

    /** 프로파일 선택 */
    searchProfileDetail: function() {
        Server.get('/main/env/rackProfileMgmt/getProfileInfo.do', {
            data: { profileNo: curProfileNo },
            success: function(result) {
                $.each(result, function(key, value) {
                    try {
                        var obj = $('#' + key);
                        if(obj === undefined) return;
                        obj.val(value);
                    } catch(e) {}
                });
            }
        });

        HmGrid.updateBoundData($evtCodeGrid, ctxPath + '/main/env/rackProfileMgmt/getEvtCodeListByProfile.do');
    },

    /** 프로파일 추가 */
    addProfile: function() {
        HmWindow.create($('#pwindow'), 470, 200, 999);
        $.post(ctxPath + '/main/popup/env/pRackProfileAdd.do',
            function(result) {
                $('#pwindow').jqxWindow({ title : '<h1>프로파일 등록</h1>', content : result, width: 500, height: 205, position : 'center', resizable : false });
                $('#pwindow').jqxWindow('open');
            }
        );
    },

    /** 프로파일 삭제 */
    delProfile: function() {
        var rowIdx = HmGrid.getRowIdx($profileGrid, '프로파일을 선택해주세요.');
        if(rowIdx === false) return;
        var rowdata = $profileGrid.jqxGrid('getrowdata', rowIdx);
        if(rowdata.profileNo == 0) {
            alert('기본 프로파일은 삭제할 수 없습니다.');
            return;
        }
        if(!confirm('[' + rowdata.profileName + '] 프로파일을 삭제하시겠습니까?')) return;
        Server.post('/main/env/rackProfileMgmt/delProfile.do', {
            data: { profileNo: rowdata.profileNo },
            success: function(result) {
                $profileGrid.jqxGrid('deleterow', $profileGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
                $profileGrid.jqxGrid('selectrow', 0);
            }
        });
    },

    /** 프로파일 상세정보 저장 */
    saveProfileInfo: function() {
        var obj = $('#profileForm').serializeObject();
        obj.pollInterval = $('#pollInterval').val();
        if($.isBlank(obj.profileName)) {
            alert('프로파일명을 입력해주세요.');
            $("#profileName").focus();
            return;
        }
        Server.post('/main/env/rackProfileMgmt/editProfile.do', {
            data: obj,
            success: function(result) {
                $('#lastUpdTime').val(result);
                var rowIdx = HmGrid.getRowIdx($profileGrid, '프로파일을 선택해주세요.');
                if(rowIdx !== false) {
                    $profileGrid.jqxGrid('setcellvalue', rowIdx, 'profileName', obj.profileName);
                }
                alert('저장되었습니다.');
            }
        });
    },

    /** 임계치 저장 */
    saveProfileLimit: function() {
        var _list = [];
        $.each(editRowIds, function(idx, value) {
            _list.push($evtCodeGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/rackProfileMgmt/saveEvtCode.do', {
            data: { profileNo: curProfileNo, list: _list},
            success: function(result) {
                $('#lastUpdTime').val(result);
                alert('저장되었습니다.');
                editRowIds = [];
            }
        });
    }
};

function addProfileResult(newdata) {
    $profileGrid.jqxGrid('addrow', null, newdata);
}

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});