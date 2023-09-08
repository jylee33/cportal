var $complainGrid, isAdmin = false;
var Main = {
    /** variable */
    initVariable: function() {
        var auth= $('#sAuth').val().toUpperCase();
        if(auth == 'SYSTEM' || auth == 'ADMIN') isAdmin = true;
        $complainGrid = $('#complainGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case "btnSearch": this.searchUser(); break;
            case "btnAdd":	this.addComplain(); break;
            case "btnEdit":	this.editComplain(); break;
            case "btnDel": this.delComplain(); break;
            case "btnExcel": this.exportExcel(); break;
        }
    },

    /** init design */
    initDesign: function() {
        console.log('initDesign');
        HmWindow.create($('#pwindow'), 100, 100);

        HmGrid.create($complainGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name: 'userId', type: 'string' },
                        // { name: 'password', type: 'string' },
                        { name: 'userName', type: 'string' },
                        { name: 'deptName', type: 'string' },
                        { name: 'posName', type: 'string' },
                        { name: 'officeTel', type: 'string' },
                        { name: 'cellTel', type: 'string' },
                        { name: 'email', type: 'string' },
                        { name: 'userPcIp', type: 'string' },
                        { name: 'authGrpNo', type: 'int' },
                        { name: 'authGrpName', type: 'string' },
                        { name: 'auth', type: 'string' },
                        { name: 'authStr', type: 'string' },
                        { name: 'useFlag', type: 'int' },
                        { name: 'useFlagStr', type: 'string' },
                        { name: 'minorPoll', type: 'int' },
                        { name: 'majorPoll', type: 'int' },
                        { name: 'criticalPoll', type: 'int' },
                        { name: 'isRecvSms', type: 'int' },
                        { name: 'isRecvEmail', type: 'int' },
                        { name: 'parentId', type: 'string' },
                        { name: 'parentNm', type: 'string' },
                        { name: 'topoAuthGrpNo', type: 'int' },
                        { name: 'topoAuthGrpNm', type: 'string' },
                        { name: 'menuAuthNo', type: 'int' },
                        { name: 'menuAuthNm', type: 'string' },
                        { name: 'isRecv', type: 'string' },
                        { name: 'isRecvStr', type: 'string' },
                        { name: 'loginDate', type: 'string' }
                    ]
                },
                {
                    beforeLoadComplete: function(records) {
                        if(records != null) {
                            $.each(records, function(idx, value) {
                                if(value.topoAuthGrpNo == 0) { //토폴로지권한 미설정표시
                                    value.topoAuthGrpNm = '미설정';
                                }
                            });
                        }
                        return records;
                    }
                }
            ),
            editable: true,
            editmode : 'selectedcell',
            columns:
                [
                    { text : '아이디', datafield : 'userId', minwidth : 120, editable: false, pinned: true },
                    { text : '이름', datafield : 'userName', width: 120, pinned: true },
                    { text : '소속', datafield : 'deptName', width : 200 },
                    { text : '휴대폰', datafield : 'cellTel', width : 120,
                        validation: function(cell, value) {
                            if(!$.isBlank(value)) {
                                if(/[^0-9\-]/.test(value)) {
                                    return { result: false, message: '숫자와 특수문자[-]만 입력가능합니다.' };
                                }
                            }
                            return true;
                        }
                    },
                    { text : 'E-Mail', datafield : 'email', width: 160 },
                    { text : '접속IP', datafield : 'userPcIp',  width: 100,
                        validation: function(cell, value) {
                            if(!$.isBlank(value)){
                                if(!$.validateIp(value)) {
                                    return { result: false, message: 'IP형식이 유효하지 않습니다.' };
                                }
                            }
                            return true;
                        }
                    },
                    { text : '계정상태', datafield : 'useFlag', displayfield: 'useFlagStr', width: 100, cellsrenderer : HmGrid.userUseFlagRenderer,
                        columntype: 'dropdownlist', editable: false , cellsalign: 'center', filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            // var s = [
                            //     { label: '대기',	value: 2 },
                            //     { label: '승인',	value: 1 },
                            //     { label: '휴면',	value: 0 },
                            //     { label: '문자',	value: 3 }
                            // ];
                            editor.jqxDropDownList({ source: userUseFlagList, autoDropDownHeight: true, displayMember: 'codeValue1', valueMember: 'codeId' });
                        }
                    },
                    { text : '문자수신여부', datafield : 'isRecv', hidden: true},
                    { text : '문자수신여부', datafield : 'isRecvStr', width: 100, editable: false, cellsalign: 'center', cellsrenderer : HmGrid.userIsRecvRenderer},
                    { text : '최근접속이력', datafield : 'loginDate', width: 160, editable: false, cellsalign: 'center'},
                    { text : '사용자등급', datafield : 'auth', hidden: true},
                    { text : '사용자등급', datafield : 'authStr', width: 100, editable: false, cellsalign: 'center', cellsrenderer : HmGrid.userAuthRenderer },
                    { text : '그룹권한', columngroup: 'auth', datafield : 'authGrpNo', displayfield: 'authGrpName',  width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: authGrpList, displayMember: 'label', valueMember: 'value', filterable: true });
                        }
                    },
                    { text : '토폴로지권한', columngroup: 'auth', datafield : 'topoAuthGrpNo', displayfield: 'topoAuthGrpNm', width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: topoAuthGrpList, displayMember: 'grpName', valueMember: 'authGrpNo', filterable: true });
                        }
                    },
                    { text : '메뉴권한', columngroup: 'auth', datafield : 'menuAuthNo', displayfield: 'menuAuthNm', width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: menuAuthList, displayMember: 'name', valueMember: 'authNo', filterable: true });
                        }
                    },
                    { text : 'SMS', columngroup: 'recv', datafield : 'isRecvSms', width: 60 , columntype: 'checkbox' },
                    { text : 'Mail', columngroup: 'recv', datafield : 'isRecvEmail', width: 60 , columntype: 'checkbox' }
                ],
            columngroups: [
                {text: '권한설정', align: 'center', name: 'auth'},
                {text: '수신설정', align: 'center', name: 'recv'}
            ]
        });

        // HmGrid.create($userGrid, {
        //     source: new $.jqx.dataAdapter(
        //         {
        //             datatype: 'json',
        //             updaterow: function(rowid, rowdata, commit) {
        //                 if(editUserIds.indexOf(rowid) == -1)
        //                     editUserIds.push(rowid);
        //                 commit(true);
        //             },
        //             datafields: [
        //                 { name: 'userId', type: 'string' },
        //                 // { name: 'password', type: 'string' },
        //                 { name: 'userName', type: 'string' },
        //                 { name: 'deptName', type: 'string' },
        //                 { name: 'posName', type: 'string' },
        //                 { name: 'officeTel', type: 'string' },
        //                 { name: 'cellTel', type: 'string' },
        //                 { name: 'email', type: 'string' },
        //                 { name: 'userPcIp', type: 'string' },
        //                 { name: 'authGrpNo', type: 'int' },
        //                 { name: 'authGrpName', type: 'string' },
        //                 { name: 'auth', type: 'string' },
        //                 { name: 'useFlag', type: 'int' },
        //                 { name: 'useFlagStr', type: 'string' },
        //                 { name: 'minorPoll', type: 'int' },
        //                 { name: 'majorPoll', type: 'int' },
        //                 { name: 'criticalPoll', type: 'int' },
        //                 { name: 'isRecvSms', type: 'int' },
        //                 { name: 'isRecvEmail', type: 'int' },
        //                 { name: 'parentId', type: 'string' },
        //                 { name: 'parentNm', type: 'string' },
        //                 { name: 'topoAuthGrpNo', type: 'int' },
        //                 { name: 'topoAuthGrpNm', type: 'string' },
        //                 { name: 'menuAuthNo', type: 'int' },
        //                 { name: 'menuAuthNm', type: 'string' },
        //                 { name: 'isRecv', type: 'string' },
        //                 { name: 'loginDate', type: 'string' }
        //             ]
        //         },
        //         {
        //             beforeLoadComplete: function(records) {
        //                 if(records != null) {
        //                     $.each(records, function(idx, value) {
        //                         if(value.topoAuthGrpNo == 0) { //토폴로지권한 미설정표시
        //                             value.topoAuthGrpNm = '미설정';
        //                         }
        //                     });
        //                 }
        //                 return records;
        //             }
        //         }
        //     ),
        //     editable: true,
        //     editmode : 'selectedcell',
        //     columns:
        //         [
        //             { text : '아이디', datafield : 'userId', minwidth : 120, editable: false, pinned: true },
        //             { text : '이름', datafield : 'userName', width: 120, pinned: true },
        //             { text : '소속', datafield : 'deptName', width : 200 },
        //             { text : '휴대폰', datafield : 'cellTel', width : 120,
        //                 validation: function(cell, value) {
        //                     if(!$.isBlank(value)) {
        //                         if(/[^0-9\-]/.test(value)) {
        //                             return { result: false, message: '숫자와 특수문자[-]만 입력가능합니다.' };
        //                         }
        //                     }
        //                     return true;
        //                 }
        //             },
        //             { text : 'E-Mail', datafield : 'email', width: 160 },
        //             { text : '접속IP', datafield : 'userPcIp',  width: 100,
        //                 validation: function(cell, value) {
        //                     if(!$.isBlank(value)){
        //                         if(!$.validateIp(value)) {
        //                             return { result: false, message: 'IP형식이 유효하지 않습니다.' };
        //                         }
        //                     }
        //                     return true;
        //                 }
        //             },
        //             { text : '계정상태', datafield : 'useFlag', displayfield: 'useFlagStr', width: 100, cellsrenderer : HmGrid.userUseFlagRenderer,
        //                 columntype: 'dropdownlist', editable: false , cellsalign: 'center', filtertype:'checkedlist',
        //                 createeditor: function(row, value, editor) {
        //                     // var s = [
        //                     //     { label: '대기',	value: 2 },
        //                     //     { label: '승인',	value: 1 },
        //                     //     { label: '휴면',	value: 0 },
        //                     //     { label: '문자',	value: 3 }
        //                     // ];
        //                     editor.jqxDropDownList({ source: userUseFlagList, autoDropDownHeight: true, displayMember: 'codeValue1', valueMember: 'codeId' });
        //                 }
        //             },
        //             { text : '문자수신여부', datafield : 'isRecv', width: 100, editable: false, cellsalign: 'center', cellsrenderer : HmGrid.userIsRecvRenderer},
        //             { text : '최근접속이력', datafield : 'loginDate', width: 160, editable: false, cellsalign: 'center'},
        //             { text : '사용자등급', datafield : 'auth', width: 100, editable: false, cellsalign: 'center', cellsrenderer : HmGrid.userAuthRenderer },
        //             { text : '그룹권한', columngroup: 'auth', datafield : 'authGrpNo', displayfield: 'authGrpName',  width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
        //                 createeditor: function(row, value, editor) {
        //                     editor.jqxDropDownList({ source: authGrpList, displayMember: 'label', valueMember: 'value', filterable: true });
        //                 }
        //             },
        //             { text : '토폴로지권한', columngroup: 'auth', datafield : 'topoAuthGrpNo', displayfield: 'topoAuthGrpNm', width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
        //                 createeditor: function(row, value, editor) {
        //                     editor.jqxDropDownList({ source: topoAuthGrpList, displayMember: 'grpName', valueMember: 'authGrpNo', filterable: true });
        //                 }
        //             },
        //             { text : '메뉴권한', columngroup: 'auth', datafield : 'menuAuthNo', displayfield: 'menuAuthNm', width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
        //                 createeditor: function(row, value, editor) {
        //                     editor.jqxDropDownList({ source: menuAuthList, displayMember: 'name', valueMember: 'authNo', filterable: true });
        //                 }
        //             },
        //             { text : 'SMS', columngroup: 'recv', datafield : 'isRecvSms', width: 60 , columntype: 'checkbox' },
        //             { text : 'Mail', columngroup: 'recv', datafield : 'isRecvEmail', width: 60 , columntype: 'checkbox' }
        //         ],
        //     columngroups: [
        //         {text: '권한설정', align: 'center', name: 'auth'},
        //         {text: '수신설정', align: 'center', name: 'recv'}
        //     ]
        // });
        // $userGrid.on('celldoubleclick', function (event) {
        //     var rowIdx = HmGrid.getRowIdx($userGrid);
        //     var auth=$userGrid.jqxGrid('getcellvalue', rowIdx, "auth");
        //     if(event.args.datafield=='auth' && $('#auth').val()=='SYSTEM'){
        //         if(auth =='System'){
        //             alert("사용자 등급을 변경할 수 없습니다.");
        //         }else{
        //             $.post(ctxPath + '/main/popup/env/pUserAuthEdit.do' ,function(result) {
        //                 HmWindow.open($('#pwindow'), '사용자 등급 변경', result, 300, 150, 'pwindow_init', HmGrid.getRowData($userGrid, rowIdx).userId);
        //             });
        //         }
        //     }
        //
        //     if(event.args.datafield=='useFlag' && $('#auth').val()=='SYSTEM'){
        //         if(auth =='System'){
        //             $userGrid.jqxGrid('setcolumnproperty', 'useFlag', 'editable', false);
        //             alert("계정상태를 변경할 수 없습니다.");
        //         }else{
        //             $userGrid.jqxGrid('setcolumnproperty', 'useFlag', 'editable', true);
        //         }
        //     }
        // });
    },

    /** init data */
    initData: function() {
        console.log('initData')
        // Server.get('/combo/getAuthGrpCombo.do', {
        //     success: function(result) {
        //         authGrpList = result;
        //     }
        // });
        // Server.get('/grp/getTopoAuthGrpList.do', {
        //     success: function(result) {
        //         result.unshift({ authGrpNo: 0, grpName: '미설정' });
        //         topoAuthGrpList = result;
        //     }
        // });
        // Server.get('/combo/getMapInheritCombo.do', {
        //     success: function(result) {
        //         mapInheritList = result;
        //     }
        // });
        // Server.post('/main/env/auth/getAuthList.do', {
        //     data: {authType: 1},
        //     success: function(result) {
        //         result.unshift({authNo: 0, name: '미설정'});
        //         menuAuthList = result;
        //     }
        // });
        // Server.get('/code/getCodeListByCodeKind.do', {
        //     data: {codeKind: 'USER_USE_FLAG'},
        //     success: function(result) {
        //         userUseFlagList = result;
        //     }
        // });
        // Main.searchComplain();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchComplain: function() {
        alert("searchComplain")
        //HmGrid.updateBoundData($userGrid, ctxPath + '/main/env/userConf/userList.do');
    },

    addComplain: function() {
        alert('addComplain');
        // $.get(ctxPath + '/main/popup/env/pUserConfAdd.do', function(result) {
        //     HmWindow.openFit($('#pwindow'), '사용자 등록', result, 600, 300);
        // });
    },

    editComplain: function(){
        alert('editConplain');
        // if($('#auth').val()=='SYSTEM'){
        //     if(auth =='System'){
        //         $userGrid.jqxGrid('setcolumnproperty', 'useFlag', 'editable', false);
        //         alert("계정상태를 변경할 수 없습니다.");
        //     }else{
        //         $userGrid.jqxGrid('setcolumnproperty', 'useFlag', 'editable', true);
        //     }
        // }
    },

    delComplain: function() {
        alert('delComplain')
        // var rowIdx = HmGrid.getRowIdx($userGrid, '선택된 사용자가 없습니다.');
        // if(rowIdx === false) return;
        // var auth=$userGrid.jqxGrid('getcellvalue', rowIdx, "auth");
        // if(auth =='System'){
        //     alert("System 등급 사용자는 삭제할 수 없습니다.");
        // }else{
        //     if(!confirm('선택된 사용자를 삭제하시겠습니까?')) return;
        //     userId=$userGrid.jqxGrid('getcellvalue', rowIdx, "userId");
        //     userName=$userGrid.jqxGrid('getcellvalue', rowIdx, "userName");
        //     Server.get('/main/env/userConf/delUser.do', {
        //         data: { userId: userId, userName: userName },
        //         success: function(data) {
        //             $userGrid.jqxGrid('deleterow', $userGrid.jqxGrid('getrowid', rowIdx));
        //             alert(data);
        //         }
        //     });
        // }
    },

    /** export Excel */
    exportExcel: function() {
        alert("export excel");
        //HmUtil.exportGrid($complainGrid, '민원장애관리', false);
    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});