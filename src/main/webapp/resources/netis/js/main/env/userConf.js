var $userGrid, isAdmin = false;
var editUserIds = [];
var userId;
var userName;
var authGrpList = [], mapInheritList = [], topoAuthGrpList = [], menuAuthList = [], userUseFlagList = [];
var Main = {
    /** variable */
    initVariable: function() {
        var auth= $('#sAuth').val().toUpperCase();
        if(auth == 'SYSTEM' || auth == 'ADMIN') isAdmin = true;
        $userGrid = $('#userGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case "btnPasswordEdit": this.passwordEdit(); break;
            case "btnPAuthEdit": this.authEdit(); break;
            case "btnAuthGrpEdit": this.authGrpEdit(); break;
            case "btnSearch": this.searchUser(); break;
            case "btnAdd":	this.addUser(); break;
            case "btnSave": this.saveUser(); break;
            case "btnDel": this.delUser(); break;
            case "btnMenuAuth": this.menuAuth(); break;

            // case "btnTest": this.test(); break;

            case "btnTopoAuth": this.topoAuthConf(); break;
            case "btnExcel": this.exportExcel(); break;
            case 'btnPwdReset': this.resetPwd(); break;
        }
    },

    /** init design */
    initDesign: function() {

        HmWindow.create($('#pwindow'), 100, 100);

        HmGrid.create($userGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editUserIds.indexOf(rowid) == -1)
                            editUserIds.push(rowid);
                        commit(true);
                    },
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
                        { name: 'loginDate', type: 'string' },
                        { name: 'notiCnt', type: 'int' }
                    ]
                },
                {
                    beforeLoadComplete: function(records) {
                        if(records != null) {
                            $.each(records, function(idx, value) {
                                if(value.topoAuthGrpNo == 0) { //토폴로지권한 미설정표시
                                    value.topoAuthGrpNm = $i18n.map["com.word.noSet"];//미설정
                                }
                            });
                        }
                        return records;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            enabletooltips: false,
            editable: true,
            editmode : 'selectedcell',
            columns:
                [
                    { text : $i18n.map["com.word.id"], datafield : 'userId', minwidth : 120, editable: false, pinned: true },//아이디
                    { text : $i18n.map["com.word.name"], datafield : 'userName', width: 120, pinned: true },//이름
                    { text : $i18n.map["com.word.dept"], datafield : 'deptName', width : 200 },//부서
                    { text : $i18n.map["com.word.cellPhone"], datafield : 'cellTel', width : 120,//휴대폰
                        validation: function(cell, value) {
                            if(!$.isBlank(value)) {
                                if(/[^0-9\-]/.test(value)) {
                                    return { result: false, message: '숫자와 특수문자[-]만 입력가능합니다.' };
                                }
                            }
                            return true;
                        }
                    },
                    { text : 'E-Mail', datafield : 'email', width: 160 ,
                        validation: function (cell, value) {
                            if(!$.isBlank(value)) {
                                if (!$.validateEmail(value)) {
                                    return {result: false, message: ' E-Mail 형식이 유효하지 않습니다.'};
                                }
                            }
                            return true;
                        }
                    },
                    { text : $i18n.map["com.word.connectIp"], datafield : 'userPcIp',  width: 100,//접속IP
                        validation: function(cell, value) {
                            if(!$.isBlank(value)){
                                value = value.replace(/ /gi, '');
                                var valueSplit = value.split(',');
                                for (var i in valueSplit) {
                                    if (!$.validateIp(valueSplit[i])) {
                                        return {result: false, message: valueSplit[i] + ' IP형식이 유효하지 않습니다.'};
                                    }
                                }
                            }
                            return true;
                        },
                        cellsrenderer: function (row, datafield, value, data) {
                            var valueReplaceSpace = value.replace(/\s/gi, '');
                            return '<div style="margin-top: 6.5px" class="jqx-center-align">' + valueReplaceSpace + '</div>';
                        }
                    },
                    { text : $i18n.map["com.word.accountStatus"], datafield : 'useFlag', displayfield: 'useFlagStr', width: 80, cellsrenderer : HmGrid.userUseFlagRenderer,//계정상태
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
                    { text : 'isRecv', datafield : 'isRecv', hidden: true},
                    { text : $i18n.map["com.word.textRecvStatus"], datafield : 'isRecvStr', width: 80, editable: false, filtertype:'checkedlist', cellsalign: 'center', cellsrenderer : HmGrid.userIsRecvRenderer},//문자수신여부
                    { text : '최근접속이력', datafield : 'loginDate', width: 120, editable: false, cellsalign: 'center'},
                    // { text : 'auth', datafield : 'auth', hidden: true},
                    { text : $i18n.map["com.word.userAuth"], datafield : 'auth', displayfield : 'authStr', width: 100, editable: true, filtertype:'checkedlist', cellsalign: 'center', cellsrenderer : HmGrid.userAuthRenderer //사용자등급
                        , columntype: 'dropdownlist',
                        createeditor: function(row, value, editor) {
                            var userAuth = [
                                // { label: $i18n.map["com.auth.system"],	value: 'SYSTEM' }, // 시스템관리자 // 시스템관리자로 변경하면 다시 변경할 수 없음
                                { label: $i18n.map["com.auth.admin"],	value: 'Admin' },   // 최고관리자
                                { label: $i18n.map["com.auth.muser"],	value: 'MUser' },   // 관리자
                                { label: $i18n.map["com.auth.user"],	value: 'User' } // 사용자
                            ];
                            editor.jqxDropDownList({ source: userAuth, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
                        },
                        cellbeginedit: function (row, datafield, columntype) {
                            var auth = $userGrid.jqxGrid('getcellvalue', row, "auth");
                            if (auth != 'System'){
                                return true
                            }else{
                                alert($i18n.map["msg.userConf.authChange"]);


                                return false
                            }
                        }
                    },
                    { text : $i18n.map["com.word.authGrp"], columngroup: 'auth', datafield : 'authGrpNo', displayfield: 'authGrpName',  width: 140, columntype: 'dropdownlist',filtertype:'checkedlist',//권한그룹
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: authGrpList, displayMember: 'label', valueMember: 'value', filterable: true });
                        }
                    },
                    { text : $i18n.map["com.word.topologyGrp"], columngroup: 'auth', datafield : 'topoAuthGrpNo', displayfield: 'topoAuthGrpNm', width: 140, columntype: 'dropdownlist',filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: topoAuthGrpList, displayMember: 'grpName', valueMember: 'authGrpNo', filterable: true });
                        }
                    },
                    { text : $i18n.map["com.word.menuGrp"], columngroup: 'auth', datafield : 'menuAuthNo', displayfield: 'menuAuthNm', width: 140, columntype: 'dropdownlist',filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: menuAuthList, displayMember: 'name', valueMember: 'authNo', filterable: true });
                        }
                    },
                    { text : '일일발송제한<span class="pop_tooltip01"></span>', datafield : 'notiCnt', width : 165, cellsalign: 'right',
                        validation: function(cell, value) {
                            if(!$.isBlank(value)) {
                                if(/[^0-9]/.test(value)) {
                                    return { result: false, message: '숫자만 입력가능합니다.' };
                                }
                                if(value > 10000) {
                                    return { result: false, message: '일일발송제한 건수는 최대 10,000까지 입력 가능합니다.' };
                                }
                            }
                            return true;
                        }
                    },
                    { text : 'SMS', columngroup: 'recv', datafield : 'isRecvSms', width: 60 , columntype: 'checkbox' },
                    { text : 'Mail', columngroup: 'recv', datafield : 'isRecvEmail', width: 60 , columntype: 'checkbox' }
                ],
            columngroups: [
                {text: $i18n.map["com.word.authSetting"], align: 'center', name: 'auth'},
                {text: $i18n.map["com.word.recvSetting"], align: 'center', name: 'recv'}
            ]
        } , CtxMenu.USER_CONF_BATCH_SET );
        $userGrid.on('celldoubleclick', function (event) {
            // 사용자등급 변경(팝업버전)
            // var rowIdx = HmGrid.getRowIdx($userGrid);
            // var auth=$userGrid.jqxGrid('getcellvalue', rowIdx, "auth");
            // if(event.args.datafield=='auth' && $('#auth').val()=='SYSTEM'){
            //     if(auth =='System'){
            //         $userGrid.jqxGrid('setcolumnproperty', 'auth', 'editable', false);
            //         alert($.i18n.map["msg.userConf.authChange"]);
            //     }else{
            //         // $.post(ctxPath + '/main/popup/env/pUserAuthEdit.do' ,function(result) {
            //         //     HmWindow.open($('#pwindow'), '사용자 등급 변경', result, 300, 150, 'pwindow_init', HmGrid.getRowData($userGrid, rowIdx).userId);
            //         // });
            //         $userGrid.jqxGrid('setcolumnproperty', 'auth', 'editable', true);
            //     }
            // }

            if(event.args.datafield=='useFlag' && $('#auth').val()=='SYSTEM'){
                if(auth =='System'){
                    $userGrid.jqxGrid('setcolumnproperty', 'useFlag', 'editable', false);
                    alert("계정상태를 변경할 수 없습니다.");
                }else{
                    $userGrid.jqxGrid('setcolumnproperty', 'useFlag', 'editable', true);
                }
            }
        });
        $userGrid.on('cellclick', function (event) {
            var thisColumn = event.args.column.datafield;
            if (thisColumn == 'userId' || thisColumn == 'loginDate') {
                $userGrid.jqxGrid('endcelledit', null, "auth", false);
                $userGrid.jqxGrid('endcelledit', null, "useFlag", false);
            }
        });
        $userGrid.on('bindingcomplete', function () {
            $(".pop_tooltip01").jqxTooltip({
                content: '<b>일일발송제한 건수는</b><br /><b> 최대 10,000까지 </b><br /><b>입력 가능합니다.</b>',
                position: 'left',
                name: 'groupTooltip',
                theme: ''
            });
        })
    },

    /** init data */
    initData: function() {
        Server.get('/combo/getAuthGrpCombo.do', {
            success: function(result) {
                authGrpList = result;
            }
        });
        Server.get('/grp/getTopoAuthGrpList.do', {
            success: function(result) {
                result.unshift({ authGrpNo: 0, grpName: '미설정' });
                topoAuthGrpList = result;
            }
        });
        Server.get('/combo/getMapInheritCombo.do', {
            success: function(result) {
                mapInheritList = result;
            }
        });
        Server.post('/main/env/auth/getAuthList.do', {
            data: {authType: 1},
            success: function(result) {
                result.unshift({authNo: 0, name: '미설정'});
                menuAuthList = result;
            }
        });
        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'USER_USE_FLAG'},
            success: function(result) {
                userUseFlagList = result;
            }
        });
        Main.searchUser();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchUser: function() {
        HmGrid.updateBoundData($userGrid, ctxPath + '/main/env/userConf/userList.do');
    },

    passwordEdit: function() {
        var rowIdx = HmGrid.getRowIdx($userGrid);
        if(rowIdx === false) {
            alert('선택된 사용자가 없습니다.');
            return;
        }
        userId=$userGrid.jqxGrid('getcellvalue', rowIdx, "userId");
        $.post(ctxPath + '/main/popup/env/pUserConfPasswordEdit.do' ,function(result) {
            HmWindow.openFit($('#pwindow'), '비밀번호 변경', result, 300, 150, 'pwindow_init', {userId: userId});
        });
    },

    // 비밀번호 초기화
    resetPwd: function() {
        var rowdata = HmGrid.getRowData($userGrid);

        if(rowdata == null) {
            alert('선택된 사용자가 없습니다.');
            return;
        }

        if(rowdata.auth.toUpperCase() === 'SYSTEM') {
            alert('시스템 권한은 비밀번호 초기화 기능을 사용할 수 없습니다.');
            return;
        }

        if(!confirm('{0} ({1}) 사용자의 비밀번호를 초기화 하시겠습니까?'.substitute(rowdata.userName, rowdata.userId))) return;

        Server.post('/main/env/userConf/editResetPwd.do', {
            data: {userId: rowdata.userId},
            success: function(result) {
                alert('비밀번호가 초기화 되었습니다.');
            }
        });
    },

    authEdit: function() {
        var rowIdx = HmGrid.getRowIdx($userGrid);
        if(rowIdx === false) {
            alert('선택된 사용자가 없습니다.');
            return;
        }
        var auth=$userGrid.jqxGrid('getcellvalue', rowIdx, "auth");
        if(auth =='System'){
            alert("사용자 등급을 변경할 수 없습니다.");
        }else{
            $.post(ctxPath + '/main/popup/env/pUserAuthEdit.do' ,function(result) {
                HmWindow.open($('#pwindow'), '사용자 등급 변경', result, 300, 120, 'pwindow_init', HmGrid.getRowData($userGrid, rowIdx).userId);
            });
        }
    },


    authGrpEdit: function() {
        if(!isAdmin) {
            alert("권한 그룹을 변경할 수 없습니다.");
            return
        }

        $.post(ctxPath + '/main/popup/env/pAuthGrpConf.do' ,function(result) {
            HmWindow.openFit($('#pwindow'), '권한 그룹', result, 1100, 700, 'pwindow_init', {parentPage: 'userConf'});
        });
    },

    menuAuth: function(){
        if(!isAdmin) {
            alert("메뉴 권한을 변경할 수 없습니다.");
            return
        }
        $.post(ctxPath + '/main/popup/env/pMenuAuth.do' ,function(result) {
            HmWindow.openFit($('#pwindow'), '메뉴권한설정', result, 900, 700, 'pwindow_init', {parentPage: 'userConf'});
        });
    },


    addUser: function() {

        $.get(ctxPath + '/main/popup/env/pUserConfAdd.do', function(result) {
            HmWindow.openFit($('#pwindow'), '사용자 등록', result, 600, 373);
        });

    },

    saveUser: function() {

        var result = HmGrid.endCellEdit($userGrid);
        if(result === false) return;

        if(editUserIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        var _row = null, _data = null;
        $.each(editUserIds, function(idx, value) {
            _row = $userGrid.jqxGrid('getrowdatabyid', value);
            _cloneData = _.cloneDeep(_row);
            _cloneData.userPcIp = _cloneData.userPcIp?.replace(/ /gi, "");//null체크

            _cloneData.userName = btoa(encodeURIComponent(_cloneData.userName));
            _cloneData.cellTel = btoa(_cloneData.cellTel);
            _list.push(_cloneData);
        });
        // IP 공백 제거
        //_list.forEach(value => value["userPcIp"] = value["userPcIp"].replace(/\s/gi, ''));

        Server.post('/main/env/userConf/editUser.do', {
            data: { list: _list },
            success: function(data) {
                alert(data);
                editUserIds = [];
            }
        });
    },

    delUser: function() {
        var rowIdx = HmGrid.getRowIdx($userGrid, '선택된 사용자가 없습니다.');
        if(rowIdx === false) return;
        var auth=$userGrid.jqxGrid('getcellvalue', rowIdx, "auth");

        if(auth =='System'){
            alert("System 등급 사용자는 삭제할 수 없습니다.");
        }else{
            if(!confirm('선택된 사용자를 삭제하시겠습니까?')) return;
            userId=$userGrid.jqxGrid('getcellvalue', rowIdx, "userId");
            userName=$userGrid.jqxGrid('getcellvalue', rowIdx, "userName");
            Server.get('/main/env/userConf/delUser.do', {
                data: { userId: userId, userName: userName },
                success: function(data) {
                    $userGrid.jqxGrid('deleterow', $userGrid.jqxGrid('getrowid', rowIdx));
                    alert(data);
                }
            });
        }

    },

    topoAuthConf: function() {

        // HmUtil.createPopup('/main/popup/env/pTopoAuthConf.do', $('#hForm'), 'pTopoAuthConf', 800, 600);

        $.post(ctxPath + '/main/popup/env/pTopoAuthConf.do' ,function(result) {
            HmWindow.open($('#pwindow'), '토폴로지 권한 설정', result, 800, 600, 'pwindow_init', {parentPage: 'userConf'});
        });

    },
    /** export Excel */
    exportExcel: function() {
        HmUtil.exportGrid($userGrid, '사용자 설정', false);
    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});