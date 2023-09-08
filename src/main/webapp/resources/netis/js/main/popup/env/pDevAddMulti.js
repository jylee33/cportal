var $p_grid;

var grpList = [], profileList = [];

var codeMap = {
    devKindList: [],
    vendorList: [],
    vendorModelList: []
};


$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});


var PMain = {
    /** Initialize */
    initVariable: function () {
        $p_grid = $('#p_grid');
    },

    /** Event Object */
    observe: function () {
        $("button").bind("click", function (event) {
            PMain.eventControl(event);
        });
    },

    /** Event Control Function */
    eventControl: function (event) {
        switch (event.currentTarget.id) {
            case 'pbtnSave':
                this.save();
                break;
            case 'pbtnExcelUpload':
                this.uploadExcel();
                break;
            case 'pbtnTempDown':
                this.downTemplate();
                break;
        }
    },
    /** Init Design */
    initDesign: function () {

        HmWindow.create($('#pwindow'));

        $("#devAddMultiLoader").jqxLoader({text: "", isModal: true, width: 60, height: 36, imagePosition: 'top'});

        $('#p_cbPollGrp').jqxDropDownList(
            {
                displayMember: 'codeValue1',
                source: HmDropDownList.getSourceByUrl('/code/getCodeListByCodeKind.do', {
                    codeKind: 'POLL_GRP_NO',
                    useFlag: 1
                }),
                valueMember: 'codeId', width: 180, height: 22,
                theme: jqxTheme, selectedIndex: 0
            });

        var datafields = [{no: 1}];

        var source =
            {
                unboundmode: true,
                totalrecords: 1000,
                datafields: [
                    {name: 'validYn'},

                    {name: 'devName'},
                    {name: 'userDevName'},
                    {name: 'devIp'},
                    {name: 'devKind2'},
                    {name: 'vendor'},
                    {name: 'model'},
                    {name: 'grpName'},
                    // {name: 'profileName'},
                    {name: 'profileNm'},
                    {name: 'perfPoll'},
                    {name: 'cfgPoll'},
                    {name: 'icmpPoll'},
                    {name: 'icmpPollStr'},
                    {name: 'arpPoll'},

                    {name: 'snmpVer'},
                    {name: 'snmpVerStr'},

                    {name: 'userId'},
                    {name: 'loginPwd'},
                    {name: 'enPwd'},
                    {name: 'community'},
                    {name: 'setCommunity'},

                    // {name: 'confMode'},
                    {name: 'connType'},
                    {name: 'port'},
                    {name: 'confModeStr'},

                    {name: 'snmpSecurityLevel'},
                    {name: 'snmpSecurityLevelStr'},


                    {name: 'snmpUserId'},
                    {name: 'snmpAuthType'},
                    {name: 'snmpAuthTypeStr'},


                    {name: 'snmpAuthKey'},
                    {name: 'snmpEncryptType'},
                    {name: 'snmpEncryptTypeStr'},
                    {name: 'snmpEncryptKey'}
                ],
                updaterow: function (rowid, rowdata, commit) {
                    PMain.validation(rowdata);
                    commit();
                }
            };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $p_grid.jqxGrid({
            source: dataAdapter,
            width: '100%',
            height: '100%',
            editable: true,
            columnsresize: true,
            selectionmode: 'multiplecellsadvanced',
            columns: [
                {
                    text: 'No', datafield: 'validYn', width: 60, pinned: true,
                    editable: false,
                    cellsrenderer: HmGrid.rownumrenderer,
                    cellclassname: function (row, columnfield, value) {
                        return value == 'Y' ? 'valid' : 'invalid';
                    },
                    align: 'center'
                },
                {text: '장비IP', datafield: 'devIp', width: 100, cellclassname: 'required', align: 'center', rendered : HmGrid.changeTitleColor},
//                {text: '장비명', datafield: 'devName', width: 100, cellclassname: 'required', align: 'center'},
                {text: '사용자장비명', datafield: 'userDevName', width: 100, align: 'center', rendered : HmGrid.changeTitleColor
                },

                // {text: '장비종류', datafield: 'devKind2', width: 100, align: 'center'},
                {
                    datafield: 'devKind2',
                    displayfield: 'devKind2',
                    text: '장비종류',
                    width: 100,
                    align: 'center',
                    columntype: 'dropdownlist',
                    createeditor: function (row, value, editor) {
                        editor.jqxDropDownList({
                            source: codeMap.devKindList,
                            dropDownWidth: 150,
                            displayMember: 'label',
                            valueMember: 'value'
                        });
                    },
                    rendered : HmGrid.changeTitleColor
                },
                // {text: '제조사', datafield: 'vendor', width: 100, align: 'center'},
                // {text: '모델', datafield: 'model', width: 100, align: 'center'},

                {
                    datafield: 'vendor', type: 'string', text: '제조사', columntype: 'dropdownlist', width: 100,
                    align: 'center',
                    createeditor: function (row, value, editor) {
                        editor.jqxDropDownList({
                            source: codeMap.vendorList,
                            dropDownWidth: 150,
                            displayMember: 'label',
                            valueMember: 'value'
                        });
                    },
                    rendered : HmGrid.changeTitleColor
                },
                {
                    datafield: 'model', type: 'string', text: '모델', columntype: 'dropdownlist', width: 100,
                    align: 'center',
                    createeditor: function (row, value, editor) {

                        editor.jqxDropDownList({
                            source: codeMap.vendorModelList,
                            dropDownWidth: 150,
                            displayMember: 'label',
                            valueMember: 'value'
                        });

                    }, filtertype: 'checkedlist', rendered : HmGrid.changeTitleColor
                },

                // {text: '소속그룹명', datafield: 'grpName', width: 100, align: 'center'},

                {
                    text: '소속그룹', datafield: 'grpNo', displayfield: 'grpName', width: 150, columntype: 'dropdownlist',
                    align: 'center',
                    createeditor: function (row, value, editor) {
                        editor.jqxDropDownList({
                            source: grpList,
                            displayMember: 'grpName',
                            valueMember: 'grpNo',
                            dropDownHeight: 250
                        });
                    }
                },


                // {text: '프로파일명', datafield: 'profileName', width: 100, align: 'center'},
                {
                    text: '프로파일명',
                    datafield: 'profileNo',
                    // displayfield: 'profileName',
                    displayfield: 'profileNm',
                    width: 100,
                    columntype: 'dropdownlist',
                    align: 'center',
                    rendered : HmGrid.changeTitleColor,
                    createeditor: function (row, value, editor) {
                        editor.jqxDropDownList({
                            source: profileList,
                            autoDropDownHeight: true,
                            displayMember: 'profileNm',
                            valueMember: 'profileNo'
                        });
                    }
                },

                {text: '성능수집', datafield: 'perfPoll', width: 150, align: 'center', columntype: 'checkbox', rendered : HmGrid.changeTitleColor},

                {
                    text: '헬스체크',
                    datafield: 'icmpPoll',
                    displayfield: 'icmpPollStr',
                    width: 100,
                    columntype: 'dropdownlist',
                    align: 'center',
                    createeditor: function (row, value, editor) {
                        var s = [
                            {label: 'NONE', value: 0},
                            {label: 'Both', value: 3},
                            {label: 'ICMP', value: 1},
                            {label: 'SNMP', value: 2}
                        ];
                        editor.jqxDropDownList({
                            source: s,
                            autoDropDownHeight: true,
                            displayMember: 'label',
                            valueMember: 'value'
                        })
                    },rendered : HmGrid.changeTitleColor
                },

                // {
                //     text: '헬스체크[0:NONE,1:ICMP,2:SNMP,3:Both]',
                //     datafield: 'icmpPoll',
                //     width: 240,
                //     align: 'center',
                //     type: 'number',
                //     columntype: 'dropdownlist',
                //     filtertype: 'list',
                //     createeditor: function (row, value, editor) {
                //         editor.jqxDropDownList({
                //             source: HmResource.getResource('icmp_poll_list'),
                //             autoDropDownHeight: true
                //         });
                //     }
                // },
                {text: 'IP관리', datafield: 'arpPoll', width: 150, align: 'center', columntype: 'checkbox', rendered : HmGrid.changeTitleColor},

                {
                    text: 'Config Backup',
                    datafield: 'cfgPoll',
                    width: 200,
                    align: 'center',
                    columntype: 'checkbox',
                    rendered : HmGrid.changeTitleColor
                },

                {
                    text: 'Connect Mode',
                    datafield: 'connType',
                    displayfield: 'confModeStr',
                    width: 130,
                    columntype: 'dropdownlist',
                    align: 'center',
                    createeditor: function (row, value, editor) {
                        var s = [
                            {label: 'SSH', value: 'SSH'},
                            {label: 'TELNET', value: 'TELNET'}
                        ];
                        editor.jqxDropDownList({
                            source: s,
                            autoDropDownHeight: true,
                            displayMember: 'label',
                            valueMember: 'value',
                            selectedIndex: 0
                        });
                    }
                },

                {text: '포트', datafield: 'port', width: 100, align: 'center'},
                {text: '사용자 아이디', datafield: 'userId', width: 100, align: 'center'},
                {text: '로그인 포맷', datafield: 'loginFormat', width: 100, align: 'center'},
                {text: '패스워드', datafield: 'loginPwd', width: 100, align: 'center'},
                {text: '패스워드 포맷', datafield: 'pwdFormat', width: 100, align: 'center'},
                {text: '2차인증 진입 명령어', datafield: 'enStr', width: 120, align: 'center'},
                {text: '2차인증 패스워드', datafield: 'enPwd', width: 120, align: 'center'},
                {text: '2차인증 패스워드 포맷', datafield: 'enPwdExpectStr', width: 130, align: 'center'},


                // {text: 'SNMPVer[1:Ver1,2:Ver2,3:Ver3]', datafield: 'snmpVer', width: 180, align: 'center'},
                {
                    text: 'SNMPVer',
                    datafield: 'snmpVer',
                    displayfield: 'snmpVerStr',
                    width: 200,
                    columntype: 'dropdownlist',
                    align: 'center',

                    createeditor: function (row, value, editor) {
                        var s = [
                            {label: 'Ver1', value: 1},
                            {label: 'Ver2', value: 2},
                            {label: 'Ver3', value: 3}
                        ];
                        editor.jqxDropDownList({
                            source: s,
                            autoDropDownHeight: true,
                            displayMember: 'label',
                            valueMember: 'value'
                        });
                    }
                },

                {text: 'isEnable', datafield: 'isEnable', width: 110, align: 'center', hidden: true},

                {text: 'RO Community', datafield: 'community', width: 100, align: 'center'},

                {text: 'RW Community', datafield: 'setCommunity', width: 100, align: 'center'},

                // {text: 'Connect Mode[Telnet, SSH]', datafield: 'confMode', width: 200, align: 'center'},

                {text: 'SNMPUserID', datafield: 'snmpUserId', width: 100, align: 'center'},
                // {
                //     text: 'SNMPSecurityLevel[0:NoAuthNoPriv, 1:AuthNoPriv, 2: AuthPriv]',
                //     datafield: 'snmpSecurityLevel',
                //     width: 300, align: 'center'
                // },
                {
                    text: 'SNMPSecurityLevel',
                    datafield: 'snmpSecurityLevel',
                    displayfield: 'snmpSecurityLevelStr',
                    width: 150,
                    columntype: 'dropdownlist',
                    width: 300,
                    align: 'center',
                    createeditor: function (row, value, editor) {
                        var s = [
                            {label: 'NoAuthNoPriv', value: 0},
                            {label: 'AuthNoPriv', value: 1},
                            {label: 'AuthPriv', value: 2}
                        ];
                        editor.jqxDropDownList({
                            source: s,
                            autoDropDownHeight: true,
                            displayMember: 'label',
                            valueMember: 'value'
                        });
                    }
                },
                // {text: 'SNMPAuthType[1:SHA, 2:MD5]', datafield: 'snmpAuthType', width: 200, align: 'center'},
                {
                    text: 'SNMPAuthType',
                    datafield: 'snmpAuthType',
                    displayfield: 'snmpAuthTypeStr',
                    width: 100,
                    columntype: 'dropdownlist',
                    width: 200,
                    align: 'center',

                    createeditor: function (row, value, editor) {
                        var s = [
                            {label: 'SHA', value: 1},
                            {label: 'MD5', value: 2}
                        ];
                        editor.jqxDropDownList({
                            source: s,
                            autoDropDownHeight: true,
                            displayMember: 'label',
                            valueMember: 'value',
                            selectedIndex: 0
                        });
                    }
                },

                {text: 'SNMPAuthKey', datafield: 'snmpAuthKey', width: 100, align: 'center'},
                // {
                //     text: 'SNMPEncryptType[1:AES, 2:DES, 3: AES192, 4: AES256]',
                //     datafield: 'snmpEncryptType',
                //     width: 200,
                //     align: 'center'
                // },
                {
                    text: 'SNMPEncryptType',
                    datafield: 'snmpEncryptType',
                    displayfield: 'snmpEncryptTypeStr',
                    width: 200,
                    columntype: 'dropdownlist',
                    align: 'center',
                    createeditor: function (row, value, editor) {

                        var s = [
                            {label: 'AES', value: 1},
                            {label: 'DES', value: 2},
                            {label: 'AES192', value: 3},
                            {label: 'AES256', value: 4}
                        ];

                        editor.jqxDropDownList({
                            source: s,
                            autoDropDownHeight: true,
                            displayMember: 'label',
                            valueMember: 'value'
                        });

                    }
                },

                {text: 'SNMPEncryptKey', datafield: 'snmpEncryptKey', width: 120, align: 'center'}
            ]
        });

        HmDropDownBtn.createTreeGrid($('#p_ddbGrp'), $('#p_grpTreeGrid'), HmTree.T_GRP_DEFAULT, 220, 22, 300, 350);
    },

    /** Init Data */
    initData: function () {

        Server.get('/grp/getDefaultGrpTreeListAll.do', {
            success: function (result) {
                grpList = result;
            }
        });

        // Server.post('/main/nms/alarmMgmt/getProfileList.do', {
        //     success: function (result) {
        //         profileList = result;
        //     }
        // });
        Server.post('/main/nms/alarmMgmt2/getSystemCdProfileList.do', {
            data: { devKind1 : 'DEV'} ,
            success: function (result) {
                profileList = result;
            }
        });

        Server.post('/combo/getSysoidVendorList.do', {
            success: function (result) {
                codeMap.vendorList = result;
            }
        });
        Server.post('/combo/getSysoidModelList.do', {
            success: function (result) {
                codeMap.vendorModelList = result;
            }
        });
        Server.post('/combo/getSysoidDevKindList.do', {
            success: function (result) {
                codeMap.devKindList = result;
            }
        });


    },

    validation_comboData: function (data) {

        if (!$.isBlank(data.snmpVer)) { // SNMPVer [ 1:Ver1, 2:Ver2, 3:Ver3 ]
            var chkDt = data.snmpVer;

            var chkArr = ['1', '2', '3'];
            var chkStr = ['Ver1', 'Ver2', 'Ver3'];

            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    data.snmpVerStr = chkStr[i];
                    break;
                }
            }
        }

        if (!$.isBlank(data.icmpPoll)) { // 헬스체크 [ 0:NONE, 1:ICMP, 2:SNMP, 3:BOTH ]
            var chkDt = data.icmpPoll;

            var chkArr = ['0', '1', '2', '3'];
            var chkStr = ['NONE', 'ICMP', 'SNMP', 'BOTH'];

            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    data.icmpPollStr = chkStr[i];
                    break;
                }
            }
        }


        if (!$.isBlank(data.connType)) { // Connect Mode [ 'SSH','TELNET']
            var chkDt = data.connType;

            var chkArr = ['SSH', 'TELNET'];

            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    data.confModeStr = chkArr[i];
                    break;
                }
            }
        }


        if (!$.isBlank(data.snmpSecurityLevel)) { // SNMPSecurityLevel[0:NoAuthNoPriv, 1:AuthNoPriv, 2: AuthPriv]
            var chkDt = data.snmpSecurityLevel;

            var chkArr = ['0', '1', '2'];
            var chkStr = ['NoAuthNoPriv', 'AuthNoPriv', 'AuthPriv'];

            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    data.snmpSecurityLevelStr = chkStr[i];
                    break;
                }
            }
        }

        if (!$.isBlank(data.snmpAuthType)) { // SNMPAuthType[1:SHA, 2:MD5]
            var chkDt = data.snmpAuthType;

            var chkArr = ['1', '2'];
            var chkStr = ['SHA', 'MD5'];

            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    data.snmpAuthTypeStr = chkStr[i];
                    break;
                }
            }
        }

        if (!$.isBlank(data.snmpEncryptType)) { // SNMPEncryptType [1:AES, 2:DES, 3: AES192, 4: AES256]
            var chkDt = data.snmpEncryptType;

            var chkArr = ['1', '2', '3', '4'];
            var chkStr = ['AES', 'DES', 'AES192', 'AES256'];

            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    data.snmpEncryptTypeStr = chkStr[i];
                    break;
                }
            }
        }


    },

    /**
     * 18.06.07]다중 추가시 설정된 입력값을 제대로 적었는지 확인하는 용
     * 해당 값들은 필수가 아니기 때문에 값이 들어가 있을 때만 체크함.
     */
    validation_set: function (data) {


        if (!$.isBlank(data.perfPoll)) { // 성능수집[0:해제, 1:설정]
            var chkFlag = 0;
            var chkDt = data.perfPoll;
            var chkArr = ['0', '1'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }

        if (!$.isBlank(data.cfgPoll)) { // Config Backup[0:해제, 1:설정]
            var chkFlag = 0;
            var chkDt = data.cfgPoll;
            var chkArr = ['0', '1'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }

        if (!$.isBlank(data.icmpPoll)) { // 헬스체크[0:NONE,1:ICMP,2:SNMP,3:Both]
            var chkFlag = 0;
            var chkDt = data.icmpPoll;
            var chkArr = ['0', '1', '2', '3'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }

        if (!$.isBlank(data.arpPoll)) {// IP관리[0:해제, 1:설정]
            var chkFlag = 0;
            var chkDt = data.arpPoll;
            var chkArr = ['0', '1'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }

        if (!$.isBlank(data.snmpVer)) {// SNMPVer[1:Ver1,2:Ver2,3:Ver3]
            var chkFlag = 0;
            var chkDt = data.snmpVer;
            var chkArr = ['1', '2', '3'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }

        if (!$.isBlank(data.connType)) {// Connect Mode[TELNET, SSH]
            var chkFlag = 0;
            var chkDt = data.connType;
            var chkArr = ['TELNET', 'SSH'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }

        if (!$.isBlank(data.snmpSecurityLevel)) {// SNMPSecurityLevel[0:NoAuthNoPriv, 1:AuthNoPriv, 2: AuthPriv]
            var chkFlag = 0;
            var chkDt = data.snmpSecurityLevel;
            var chkArr = ['0', '1', '2'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }

        if (!$.isBlank(data.snmpAuthType)) {// SNMPAuthType[1:SHA, 2:MD5]
            var chkFlag = 0;
            var chkDt = data.snmpAuthType;
            var chkArr = ['1', '2'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }


        if (!$.isBlank(data.snmpEncryptType)) {// SNMPEncryptType[1:AES, 2:DES, 3: AES192, 4: AES256]
            var chkFlag = 0;
            var chkDt = data.snmpEncryptType;
            var chkArr = ['1', '2', '3', '4'];
            for (var i = 0; i < chkArr.length; i++) {
                if (chkArr[i] == chkDt) {
                    chkFlag = 1;
                    break;
                }
            }
            if (chkFlag == 0) {
                return 0;
            }
        }
        return 1;
    },
    validation: function (data, type) { // 18.06.05]  type 추가(엑셀업로드시 validation할때 사용)
        var orgValidYn = data.validYn;
        try {
            if ($.isBlank(data.devIp)) {
                data.validYn = 'N';
            } // check required
            else {
                if (!$.validateIp(data.devIp)) {
                    data.validYn = 'N';
                }
                else {
                    // 18.06.07] 값존재시 제대로 값 넣었는지 체크
                    var setFlag = PMain.validation_set(data);

                    if (setFlag == 0) {
                        data.validYn = 'N';

                    } else {
                        // 18.06.07] 헬스체크가 2,3, 일때 snmpVer 없으면 N
                        if (!$.isBlank(data.icmpPoll)) {

                            if ((data.icmpPoll == 2 || data.icmpPoll == 3) && $.isBlank(data.snmpVer) == true) {
                                setFlag = 0;
                                data.validYn = 'N';
                            }

                        }
                        if (setFlag != 0) {
                            if (data.snmpVer == 3) {
                                if ($.isBlank(data.snmpUserId)) {
                                    data.validYn = 'N';
                                }
                                else {
                                    if (data.snmpSecurityLevel == 1) {
                                        if ($.isBlank(data.snmpAuthKey)) {
                                            data.validYn = 'N';
                                        }
                                        else {
                                            data.validYn = 'Y';
                                        }
                                    }
                                    else if (data.snmpSecurityLevel == 2) {
                                        if ($.isBlank(data.snmpEncryptKey)) {
                                            data.validYn = 'N';
                                        }
                                        else {
                                            data.validYn = 'Y';
                                        }
                                    }
                                    else {
                                        data.validYn = 'Y';
                                    }
                                }
                            } // check snmp3
                            else if (data.snmpVer == 1 || data.snmpVer == 2) {
                                if ($.isBlank(data.community)) {
                                    data.validYn = 'N';
                                } else
                                    data.validYn = 'Y';
                            } // check snmp1, snmp2
                            else {
                                data.validYn = 'Y';
                            }
                        }
                    }
                }
            }
            if (orgValidYn != data.validYn) {
                if (type == null || type != 1)
                    $p_grid.jqxGrid('refreshdata');
            }
        } catch (e) {
            alert(e);
        }
    },

    save: function () {

        HmGrid.endRowEdit($p_grid);

        $('#devAddMultiLoader').jqxLoader('open');

        var rows = $p_grid.jqxGrid('getrows');
        var _list = [], _rowIds = [];
        $.each(rows, function (idx, value) {
            if (value.validYn == 'Y') {
                _list.push(value);
                _rowIds.push(value.uid);
            }
        });


        if (_list.length == 0) {
            alert('유효성검사를 통과한 데이터가 없습니다.');
            $('#devAddMultiLoader').jqxLoader('close');
            return;
        }
        else {
            var pollGrpItem = $('#p_cbPollGrp').jqxDropDownList('getSelectedItem');
            if (pollGrpItem == null) {
                alert('수집기를 선택하세요.');
                return;
            }
            var _pollGrpNo = pollGrpItem.originalItem.codeId,
                _netPollGrpNo = pollGrpItem.originalItem.codeValue4 || 0;

            $.each(_list, function (idx, value) {
                if (isNaN(value.perfPoll) || !value.perfPoll) value.perfPoll = 0;
                if (isNaN(value.cfgPoll) || !value.cfgPoll) value.cfgPoll = 0;
                if (isNaN(value.icmpPoll) || !value.icmpPoll) value.icmpPoll = 0;
                if (isNaN(value.arpPoll) || !value.arpPoll) value.arpPoll = 0;
                if (isNaN(value.snmpVer)) value.snmpVer = '';
                if (isNaN(value.snmpSecurityLevel)) value.snmpSecurityLevel = '';
                if (isNaN(value.snmpAuthType)) value.snmpAuthType = '';
                if (isNaN(value.snmpEncryptType)) value.snmpEncryptType = '';

                //Config Backup 체크할 경우에만, 텔넷정보 저장
                if(value.cfgPoll === 0) value.isTelnet = 0;
                else value.isTelnet = 1;

                value.port = Number(value.port)

                value.pollGrpNo = _pollGrpNo;
                value.netPollGrpNo = _netPollGrpNo;
            });
        }

        var _topGrpNo = 1;
        var treeItem = HmTreeGrid.getSelectedItem($('#p_grpTreeGrid'));
        if (treeItem != null) {
            _topGrpNo = treeItem.grpNo;
        }


        Server.post('/dev/addMultiDev.do', {
            data: {list: _list, topGrpNo: _topGrpNo},
            success: function (result) {
                $('#devAddMultiLoader').jqxLoader('close');
                if (result.msg == "SUCCESS") {
                    $p_grid.jqxGrid('deleterow', _rowIds);

                    var _runList = {};
                    _runList[_topGrpNo + ""] = result.mngNos.split(',').map(Number);

                    var _paramObj = {
                        MSG_SEND: "WEB",//데이터전달위치
                        MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
                        RUN_LIST: _runList,
                        DETAIL_INFO: {},//RUN_LIST에서 추가로 사용할 값
                        MSG_BYPASS: 1,
                        MSG_STATUS: "START",//START,END
                        MSG_CYCLE: 0,//초단위 주기적 실행
                        RTN_FLAG: 0,//0:결과과정 전달안함
                        RTN_ID: "",//cupid user id
                        RTN_TARGET: "",//cupid guid
                        RTN_GUID: ""//cupid sessionId
                    }

                    window.opener.addDevResult();

                    ServerRest.cupidRest({
                        _REST_PATH: '/nms/perf/chgmgr',
                        _REST_PARAM: _paramObj,
                        _CALLBACK: function(DATA){
                            alert('저장되었습니다.');
                        }
                        //_CALLBACK
                    });

                } else {
                    alert(result.msg);
                }
            },
            error: function (err) {
                $('#devAddMultiLoader').jqxLoader('close');
            }
        });
    },

    /** 엑셀 업로드 */
    uploadExcel: function () {

        $.post(ctxPath + '/main/popup/env/pDevAddMultiExcel.do', function (result) {
            HmWindow.open($('#pwindow'), '엑셀 업로드', result, 480, 125, 'pwindow_init');
        });

    },
    /** 템플릿 다운로드 */
    downTemplate: function () {
        var url = ctxPath + '/export/NETIS_DEV_FORMAT.xlsx';
        window.open(url);
    }

};
