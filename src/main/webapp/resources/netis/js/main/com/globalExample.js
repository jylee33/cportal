var $engGrid;
var timer;

var Main = {
    /** variable */
    initVariable: function () {
        $engGrid = $('#engGrid');
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
            case 'btnSearch':
                this.search();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        HmBoxCondition.createPeriod('', null, timer);
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));

        HmGrid.create($engGrid, {
            width: '90%',
            height: 350,
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
                        { name: 'loginDate', type: 'string' },
                        { name: 'notiCnt', type: 'int' }
                    ]
                }
            ),
            enabletooltips: false,
            editable: false,
            editmode : 'selectedcell',
            columns:
                [
                    { text : $i18n.map["com.word.id"], datafield : 'userId', minwidth : 120, editable: false, pinned: true },
                    { text : $i18n.map["com.word.name"], datafield : 'userName', width: 120, pinned: true },
                    { text : $i18n.map["com.word.dept"], datafield : 'deptName', width : 200 },
                    { text : $i18n.map["com.word.cellPhone"], datafield : 'cellTel', width : 120,
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
                    { text : $i18n.map["com.word.connectIp"], datafield : 'userPcIp',  width: 100,
                        validation: function(cell, value) {
                            if(!$.isBlank(value)){
                                if(!$.validateIp(value)) {
                                    return { result: false, message: 'IP형식이 유효하지 않습니다.' };
                                }
                            }
                            return true;
                        }
                    },
                    { text : $i18n.map["com.word.accountStatus"], datafield : 'useFlag', displayfield: 'useFlagStr', width: 80, cellsrenderer : HmGrid.userUseFlagRenderer,
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
                    { text : $i18n.map["com.word.textRecvStatus"], datafield : 'isRecvStr', width: 80, editable: false, filtertype:'checkedlist', cellsalign: 'center', cellsrenderer : HmGrid.userIsRecvRenderer},
                    { text : '최근접속이력', datafield : 'loginDate', width: 120, editable: false, cellsalign: 'center'},
                    { text : 'auth', datafield : 'auth', hidden: true},
                    { text : $i18n.map["com.word.userAuth"], datafield : 'authStr', width: 100, editable: false, filtertype:'checkedlist', cellsalign: 'center', cellsrenderer : HmGrid.userAuthRenderer },
                    { text : $i18n.map["com.word.authGrp"], columngroup: 'auth', datafield : 'authGrpNo', displayfield: 'authGrpName',  width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: authGrpList, displayMember: 'label', valueMember: 'value', filterable: true });
                        }
                    },
                    { text : $i18n.map["com.word.topologyGrp"], columngroup: 'auth', datafield : 'topoAuthGrpNo', displayfield: 'topoAuthGrpNm', width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: topoAuthGrpList, displayMember: 'grpName', valueMember: 'authGrpNo', filterable: true });
                        }
                    },
                    { text : $i18n.map["com.word.menuGrp"], columngroup: 'auth', datafield : 'menuAuthNo', displayfield: 'menuAuthNm', width: 150, columntype: 'dropdownlist',filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: menuAuthList, displayMember: 'name', valueMember: 'authNo', filterable: true });
                        }
                    },
                    { text : $i18n.map["com.word.textSndDisable"], datafield : 'notiCnt', width : 120, cellsalign: 'right',
                        validation: function(cell, value) {
                            if(!$.isBlank(value)) {
                                if(/[^0-9]/.test(value)) {
                                    return { result: false, message: '숫자만 입력가능합니다.' };
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
        });

    },

    /** init data */
    initData: function () {
        Main.search();
    },
    search: function() {
        HmGrid.updateBoundData($userGrid, ctxPath + '/main/env/userConf/userList.do');
    }
}



$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});