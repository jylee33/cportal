var Main = {
    widgetMenuList: [],
    widgetMenuList2: [],
    webSiteList: [],
    webSiteName: '',
    firstPageSettingValue1: '',
    comCodeResult: [],

    /** variable */
    initVariable: function () {

        Server.post('/engineer/popup/getWidgetMenuList.do', {
            // data: {inMenu: true},
            data: {temp: true},
            success: function (result) {
                $.each(result, function (idx, item) {
                    Main.widgetMenuList.push(item);
                    Main.widgetMenuList2.push(item);
                });
                var guid = $("#gFirstPageGuid").val();
                var pageNo = $("#gFirstPageGrpType").val();
                var pageName = $("#gFirstPageGrpName").val();
                Main.initDashUrlTemplate(0);
                $("#MAIN_PAGE_GUID").val(guid);
                $("#MAIN_PAGE_NO").val(pageNo);
                $("#MAIN_PAGE_NAME").val(pageName);
            }
        });
        Server.get('/combo/getSiteEnumList.do', {
            success: function (result) {
                if (result != null) {
                    $.each(result, function (idx, item) {
                        Main.webSiteList.push(item);
                    });
                    $('#WEB_SITE_NAME').jqxComboBox({source: Main.webSiteList, width: 100, height: 21, selectedIndex: 0});
                    if(Main.webSiteName != ''){
                        $('#WEB_SITE_NAME').val(Main.webSiteName)
                    }
                }
            }
        });
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
            case 'btnSaveSiteName':
                this.saveSiteName();
                break;

            case 'btnRefresh':
                this.search();
                break;
            case 'btnSave':
                this.save();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        // checkbox
        $('div[data-type="checkbox"]').jqxCheckBox({width: 50, height: 21});

        // combobox
        //$('#WEB_SITE_NAME').jqxComboBox({width: 100, height: 21, selectedIndex: 0});
        // $('#TOPO_AUTH_TABLE').jqxComboBox({width: 100, height: 21, source: ['TM', 'TOPO'], selectedIndex: 0, autoDropDownHeight: true});
        $('#EVTHIST_BASEDATE').jqxComboBox({
            width: 100,
            height: 21,
            source: [{label: '발생일시', value: 'START'}, {label: '종료일시', value: 'END'}],
            selectedIndex: 0,
            autoDropDownHeight: true
        });
        $('#DELEGATE_OS_TYPE').jqxComboBox({
            width: 100,
            height: 21,
            source: [{label: 'linux', value: 'lin'}, {label: 'windows', value: 'win'}],
            selectedIndex: 0,
            autoDropDownHeight: true
        });
        $('#DELEGATE_LANG_TYPE').jqxComboBox({
            width: 100,
            height: 21,
            source: ['c', 'pyt'],
            selectedIndex: 0,
            autoDropDownHeight: true
        });
        // $('#DEV_THRESHOLD').jqxComboBox({
        //     width: 100,
        //     height: 21,
        //     source: HmResource.getResource('evt_level_list'),
        //     selectedIndex: 0,
        //     autoDropDownHeight: true
        // });
        // $('#IF_THRESHOLD').jqxComboBox({
        //     width: 100,
        //     height: 21,
        //     source: HmResource.getResource('evt_level_list'),
        //     selectedIndex: 0,
        //     autoDropDownHeight: true
        // });

        // $('#ELASTIC_SEARCH_HOSTNAME_YN').jqxComboBox({
        //     width: 100, height: 21,
        //     source: [{label: '자동', value: 'Y'}, {label: '수동', value: 'N'}],
        //     selectedIndex: 0, autoDropDownHeight: true
        // })
        //     .on('change', function (event) {
        //         if (event.args.item.value == 'Y') {
        //             $('#ELASTIC_SEARCH_IP').val('');
        //             $('#ELASTIC_SEARCH_IP').attr('readonly', 'readonly');
        //         } else {
        //             $('#ELASTIC_SEARCH_IP').removeAttr('readonly');
        //         }
        //     });

        $('#SSH_RELAY_SERVER_HOSTNAME_YN').jqxComboBox({
            width: 100, height: 21,
            source: [{label: '자동', value: 'Y'}, {label: '수동', value: 'N'}],
            selectedIndex: 0, autoDropDownHeight: true
        })
            .on('change', function (event) {
                if (event.args.item.value == 'Y') {
                    $('#SSH_RELAY_SERVER_IP').val('');
                    $('#SSH_RELAY_SERVER_IP').attr('readonly', 'readonly');
                } else {
                    $('#SSH_RELAY_SERVER_IP').removeAttr('readonly');
                }
            });
        // dashboard
        //Main.initDashUrlTemplate(0);
        Main.initMainPage();
    },

    /** init data */
    initData: function () {
        this.search();
    },


    search: function () {
        // 새로고침시 체크박스 모두 해제
        $('div[data-type="checkbox"]').jqxCheckBox('uncheck');

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'WEB_CONF'},
            success: function (result) {
                var _dashportList = [];
                Main.comCodeResult = result;
                $.each(result, function (idx, value) {
                    try {
                        switch (value.codeId) {
                            case 'TOPO_AUTH_USE':
                            case "APP_SEC_UNIT_POPUP_YN":
                            case "CUPID_USE":
                            //case "SYSLOG_LEVEL_COLOR_USE":
                            case "CUPID_SEC_UNIT_USE":
                            // case "ELASTIC_SEARCH_USE":
                            case "ELASTIC_SEARCH_SSL_YN":
                            case 'STARCELL_USE':
                            case 'SSH_RELAY_SERVER_USE':
                                $('#' + value.codeId).val(value.codeValue1 == 'Y');
                                break;
                            // case "ELASTIC_SEARCH_IP" :
                            //     $('#ELASTIC_SEARCH_IP').val(value.codeValue1);
                            //     $('#ELASTIC_SEARCH_HOSTNAME_YN').val(value.codeValue2);
                            //     break;
                            case "SSH_RELAY_SERVER_IP" :
                                $('#SSH_RELAY_SERVER_IP').val(value.codeValue1);
                                $('#SSH_RELAY_SERVER_HOSTNAME_YN').val(value.codeValue2);
                                break;
                            case "DELEGATE_OS_TYPE" :
                                $('#DELEGATE_OS_TYPE').val(value.codeValue1);
                                $('#ENG_DIR').val(value.codeValue2);
                                $('#SMS_ENG_DIR').val(value.codeValue3);
                                break;
                            case "FIRST_PAGE_SETTING" :
                                //Main.initMainDash();
                                //var findVer = value.codeValue1.search("Ver") > -1 ? "Standard" : value.codeValue1;

                                var findVer = "Standard";
                                if (value.useFlag == "0") findVer = value.codeValue1.search("Ver") > -1 ? "Standard" : "None";

                                //Main.firstPageSettingValue1 = value.codeValue1;
                                $('#FIRST_PAGE_TYPE').val(findVer);

                                if (value.useFlag == 1) $("#FIRST_PAGE_USE").val(true);
                                else $("#FIRST_PAGE_USE").val(false);
                               // $('#FIRST_PAGE_WIDGET').val(value.codeValue2);
                               //  if (value.codeValue4 != 'MAIN' && value.codeValue4 != 'WidGet'){
                               //      $("#FIRST_PAGE_USE").val(true)
                               //  }
                                break;
                            case "ENCRYPTION_FLAG" :
                                // $('#ENCRYPTION_FLAG').val(value.codeValue1 == 'Y');
                                $('#ENCRYPTION_FLAG').val($("#gEncryptionFlag").val() == 'Y');
                                break;
                            default:
                                if (value.codeId.indexOf('DASH_PORT') !== -1 && value.codeId !== 'DASH_PORT') {
                                    _dashportList.push(value);
                                }
                                else
                                    $('#' + value.codeId).val(value.codeValue1);
                                if(value.codeId == 'WEB_SITE_NAME'){
                                    Main.webSiteName = value.codeValue1;
                                }
                                break;
                        }
                    } catch (e) {
                    }
                });
                if (_dashportList.length) {
                    var _dashTd = $('#dashTd');
                    if (_dashportList.length > 1) {
                        for (var i = 1, n = _dashportList.length; i < n; i++) {
                            Main.addDashUrlTemplate();
                        }
                    }
                    for (var i = 0, n = _dashportList.length; i < n; i++) {
                        var _codeData = _dashportList[i],
                            _codeIdx = _codeData.codeId.replace(/\D/ig, '');
                        $('div[name=DASH_TYPE]:eq(' + _codeIdx + ')').val(_codeData.codeValue1);
                        if (_codeData.codeValue1 === 'URL') {
                            $('input[name=DASH_PORT]:eq(' + _codeIdx + ')').val(_codeData.codeValue2);
                            $('input[name=DASH_TEXT]:eq(' + _codeIdx + ')').val(_codeData.codeValue3).prop('disabled', false);
                        }
                        else {
                            $('div[name=DASH_WIDGET]:eq(' + _codeIdx + ')').val(_codeData.codeValue2);
                            $('input[name=DASH_TEXT]:eq(' + _codeIdx + ')').prop('disabled', true);
                        }
                    }
                }
            }
        });
    },

    saveSiteName: function () {

        var obj = $("#SITE_NAME").val();
        console.dir(obj);

        Server.post('/engineer/codeConf/saveSiteName.do', {
            data: {codeValue1: obj},
            success: function (result) {
                alert(result);
            }
        });

    },

    save: function () {
        // 18.06.20] validation
        var obj = $('#UPLOAD_SIZE_LIMIT');
        if (!obj.val().isBlank()) {// 값이 들어가있을때 체크
            if (!obj.val().isNum()) {
                alert('업로드 용량제한은 숫자만 입력가능합니다.');
                obj.focus();
                return;
            }
        }
        obj = $('#CUPID_PORT');
        if (!obj.val().isBlank()) {// 값이 들어가있을때 체크
            if (!obj.val().isNum()) {
                alert('Cupid 접속 포트는 숫자만 입력가능합니다.');
                obj.focus();
                return;
            }
        }
        // obj = $('#ELASTIC_SEARCH_PORT');
        // if (!obj.val().isBlank()) {// 값이 들어가있을때 체크
        //     if (!obj.val().isNum()) {
        //         alert('ElasticSearch 접속 포트는 숫자만 입력가능합니다.');
        //         obj.focus();
        //         return;
        //     }
        // }

        // [data-type] attribute를 가지오 있는 엘리먼트를 찾아 저장목록 생성
        var elements = $('.tbl_zone').children().find('[data-type]');
        if (elements.length == 0) {
            alert('저장할 데이터가 없습니다.');
            return;
        }

        var _list = [];
        $.each(elements, function (idx, item) {
            var _obj = $(item), _dataType = _obj.attr('data-type');
            var _value = null;
            switch (_dataType) {
                case 'html':
                    _value = _obj.text().trim();
                    break;
                case 'checkbox':
                    _value = _obj.val() ? 'Y' : 'N';
                    break;
                default:
                    _value = (_obj.val()).toString();
            }

            if (_obj.attr('id') == 'DELEGATE_OS_TYPE' || _obj.attr('id') == 'ENG_DIR' || _obj.attr('id') == 'SMS_ENG_DIR') return;

            if (_obj.attr('id') == 'ELASTIC_SEARCH_IP') return;
            if (_obj.attr('id') == 'SSH_RELAY_SERVER_IP') return;

            _list.push({codeId: _obj.attr('id'), codeValue1: _value, useFlag: 1});
        });


        _list.push({
            codeId: 'DELEGATE_OS_TYPE',
            codeValue1: $('#DELEGATE_OS_TYPE').val(),
            codeValue2: $('#ENG_DIR').val().toString(),
            codeValue3: $('#SMS_ENG_DIR').val().toString(),
            useFlag: 1
        });
        // _list.push({
        //     codeId: 'ELASTIC_SEARCH_IP',
        //     //codeValue1: $('#ELASTIC_SEARCH_IP').val(),
        //     codeValue1: '',
        //     codeValue2: $('#ELASTIC_SEARCH_HOSTNAME_YN').val().toString(),
        //     useFlag: 1
        // });
        _list.push({
            codeId: 'SSH_RELAY_SERVER_IP',
            //codeValue1: $('#SSH_RELAY_SERVER_IP').val(),
            codeValue1: '',
            codeValue2: $('#SSH_RELAY_SERVER_HOSTNAME_YN').val().toString(),
            useFlag: 1
        });

        if ($("#FIRST_PAGE_USE").val()) {
            _list.push({
                codeId: 'FIRST_PAGE_SETTING',
                codeValue1: $('#gFirstPageType').val().toString(),
                codeValue2: $('#MAIN_PAGE_GUID').val().toString(),
                // codeValue3: 'NONE',
                codeValue3: $('#MAIN_PAGE_NO').val().toString(),
                codeValue4: $('#MAIN_PAGE_NAME').val().toString(),
                useFlag: 1
            });
        }else {

            if ( $('#FIRST_PAGE_TYPE').val() == 'Standard' ) {
                _list.push({
                    codeId: 'FIRST_PAGE_SETTING',
                    codeValue1: $('#gFirstPageType').val().toString(),
                    codeValue2: 'MAIN',
                    codeValue3: 'MAIN',
                    codeValue4: 'MAIN',
                    useFlag: 0
                });
            } else if ( $('#FIRST_PAGE_TYPE').val() == 'None' ) {
                _list.push({
                    codeId: 'FIRST_PAGE_SETTING',
                    codeValue1: $('#FIRST_PAGE_TYPE').val(),
                    codeValue2: 'MAIN',
                    codeValue3: 'MAIN',
                    codeValue4: 'MAIN',
                    useFlag: 0
                });
            } else {
                // $('#FIRST_PAGE_TYPE').val() == 'Widget' 이면
                var _mainDashItem = $('#FIRST_PAGE_WIDGET').jqxDropDownList('getSelectedItem').originalItem;
                _list.push({
                    codeId: 'FIRST_PAGE_SETTING',
                    codeValue1: $('#gFirstPageType').val().toString(), // $('#gFirstPageType').val().indexOf("Ver") > -1 ? 'Ver58' : ' ',
                    codeValue2: _mainDashItem.guid,
                    codeValue3: 'NONE',//_mainDashItem.grpType,
                    codeValue4: 'WidGet',
                    useFlag: 0
                });
            }
        }

        // dashboard
        var _dashUrlList = [];
        var _dashTd = $('#dashTd'),
            _children = _dashTd.children(),
            _dbIdx = 0;

        $.each(_children, function (index, element) {
            var _type = $(element).find('[name=DASH_TYPE]').val();
            if (_type === 'URL') {
                _list.push({
                    codeId: 'DASH_PORT{0}'.substitute(_dbIdx),
                    codeValue1: _type,
                    codeValue2: $(element).find('[name=DASH_PORT]').val(),
                    codeValue3: $(element).find('[name=DASH_TEXT]').val(),
                    useFlag: 1
                });
                _dbIdx++;
            }
            else if (_type == 'Widget') {

                var _item = $(element).find('[name=DASH_WIDGET]').jqxDropDownList('getSelectedItem')[0].originalItem;

                _list.push({
                    codeId: 'DASH_PORT{0}'.substitute(_dbIdx),
                    codeValue1: _type,
                    codeValue2: _item.guid,
                    codeValue3: _item.menuNo, //'NONE',//_item.grpType,
                    codeValue4: _item.condType,
                    useFlag: 1

                });
                _dbIdx++;
            }
            else {
            }
        });

        // // AppGlobal에 등록하지 않는 키 삭제
        var _idx = -1;
        $.each(_list, function (idx, el) {
            if(el.codeId == "FIRST_PAGE_USE"){
                _idx = idx;

            }
        });
        _list.splice(_idx, 1);

        for (var i = 0; i < Main.comCodeResult.length; i++) {
            for (var j = 0; j < _list.length; j++) {
                var listConf = _list[j];
                if (Main.comCodeResult[i].codeId == listConf.codeId) {
                    $.extend(Main.comCodeResult[i], listConf);
                    break;
                }
            }
        }

        console.dir(Main.comCodeResult); // _list check

        Server.post('/code/saveCodeInfo.do', {
            data: {codeKind: 'WEB_CONF', list: Main.comCodeResult},
            success: function (result) {
                alert(result);
            }
        });

    },

    // dashboard template
    addDashUrlTemplate: function () {

        var _newChild = $('<div></div>', {
            style: "clear: both"
        });

        var _template = '<div name="DASH_TYPE" style="float: left;margin-top:5px;"></div>' +
            '<div style="float: left;margin-top:5px;">' +
            '<span style="float: left; line-height: 22px; width: 60px; text-align: center">표시명</span>' +
            '<span style="float: left;"><input type="text" name="DASH_TEXT" style="width:120px; float: left" value="대시보드"/></span>' +
            '</div>' +
            '<div style="float: left; width: 500px; display: none;margin-top:5px;"><input type="text" name="DASH_PORT" value="localhost:8082"/></div>' +
            '<div name="DASH_WIDGET" style="float: left; display: none;margin-top:5px;"></div>' +
            '<div style="float: left; margin-left: 10px;margin-top:5px;">' +
            '<button name="pbtnAdd_dash" class="whiteBtn btn_ico_07" style="margin-right: 5px;" onclick="Main.addDashUrlTemplate()"/>' +
            '<button name="pbtnDel_dash" class="whiteBtn btn_ico_77" onclick="Main.delDashUrlTemplate(event)"/>' +
            '</div>';
        _newChild.html(_template.substitute(2));

        var _dashTd = $('#dashTd'),
            _childCnt = _dashTd.children().length;

        _newChild.appendTo(_dashTd);
        this.initDashUrlTemplate(_childCnt);
    },

    addMainUrlTemplate: function() {
        $.post(ctxPath + '/engineer/popup/pMainPageSelect.do' ,function(result) {
            HmWindow.openFit($('#pwindow'), '시작페이지 설정', result, 350, 425, 'pwindow_init');
        });
    },

    delDashUrlTemplate: function (event) {
        var _btn = event.target;
        $(_btn).parent().parent().remove();
    },

    initDashUrlTemplate: function (index) {
        $('div[name=DASH_TYPE]:eq(' + index + ')').jqxComboBox({
            width: 100,
            height: 21,
            source: ['None', 'URL', 'Widget'],
            autoDropDownHeight: true,
            selectedIndex: 0
        })
            .on('change', function (event) {
                var idx = $('#dashTd').children().index($(this).parent());
                var item = event.args.item;
                var data = item.originalItem;
                if (data === 'URL') {
                    $('input[name=DASH_PORT]:eq(' + idx + ')').parent().show();
                    $('div[name=DASH_WIDGET]:eq(' + idx + ')').hide();
                    $('input[name=DASH_TEXT]:eq(' + idx + ')').prop('disabled', false);
                }
                else {
                    $('input[name=DASH_PORT]:eq(' + idx + ')').parent().hide();
                    $('div[name=DASH_WIDGET]:eq(' + idx + ')').show();
                    $('input[name=DASH_TEXT]:eq(' + idx + ')').prop('disabled', true);
                }
            });

        $('div[name=DASH_WIDGET]:eq(' + index + ')').jqxDropDownList({
            width: 200, height: 21,
            source: new $.jqx.dataAdapter({
                datatype: 'json',
                localdata: Main.widgetMenuList
            }),
            displayMember: 'menuName',
            valueMember: 'guid',
            selectedIndex: 0, autoDropDownHeight: false
        });
    },

    initMainPage: function () {
        //2022.02.08 기존 메인페이지 타입None,Layout 2종류에서 3종류로 변경
        //Ver56~... 으로 기존 None 메인 유지하면서 신규 업그레이드 버전 추가용
        //해당 선택 값으로 Url 및 view 파일 load

        $('div[name=FIRST_PAGE_TYPE]').jqxComboBox({
            width: 100,
            height: 21,
            source: HmResource.first_page_ver,
            autoDropDownHeight: true,
            selectedIndex: 0
        })
            /*
            .on('change', function (event) {
                var item = event.args.item;
                var data = item.originalItem;
                if (data != 'Layout') {
                    $('div[name=FIRST_PAGE_WIDGET]').hide();

                    //Layout이 아닐경우 GUID, menuNo, menuName 값을 MAIN으로 변경
                    $('#MAIN_PAGE_GUID').val('MAIN');
                    $('#MAIN_PAGE_NO').val('MAIN');
                }
                else {
                    $('div[name=FIRST_PAGE_WIDGET]').show();
                }

                $('#MAIN_PAGE_NAME').val("MAIN");
                $("#FIRST_PAGE_USE").val(false);

                //None, Widget 아닐 경우, "시작페이지 설정"항목 on/off
                if (data != 'None' && data != 'Widget') {
                    $('#FIRST_PAGE_USE').jqxCheckBox('enable');
                }
                else {
                    $('#FIRST_PAGE_USE').jqxCheckBox('disable');
                }

            })
            */
            ;

        /*
        $('div[name=FIRST_PAGE_WIDGET]').jqxDropDownList({
            width: 200, height: 21,
            source: new $.jqx.dataAdapter({
                type: 'POST',
                datatype: 'json',
                contenttype: 'application/json;charset=utf8',
                url: ctxPath + '/engineer/popup/getWidgetMenuList.do',

                formatData: function (data) {
                    // $.extend(data, {
                    //     inMenu: true
                    // });
                    return data;
                }
            }),
            displayMember: 'menuName',
            valueMember: 'guid',
            selectedIndex: 0, autoDropDownHeight: true
        });
        */

        $("#FIRST_PAGE_USE")
            .change(function () {
                if ($("#FIRST_PAGE_USE").val()){
                    if ($("#gFirstPageGrpName").val() != "MAIN"
                        && $("#gFirstPageGrpName").val() != "WidGet"
                        && $("#gFirstPageGuid").val() != "MAIN"
                        && $("#gFirstPageGrpType").val() != "MAIN"
                        && $("#MAIN_PAGE_NO").val() != "NONE"){
                        $('#MAIN_PAGE_NAME').val($("#gFirstPageGrpName").val());
                    } else {
                        $('#MAIN_PAGE_NAME').val("MAIN");
                    }
                    $('#btnFirstPage').show();
                } else {
                    $('#MAIN_PAGE_NAME').val("MAIN");
                    $('#btnFirstPage').hide();
                }
            });
    }
};
//sourceURL=sysConf.js

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});


