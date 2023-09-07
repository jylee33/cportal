var $dtlTab;
var $configGrid, $translateGrid, $exceptGrid;
var editConfNos = [];
var editTanslateNos = [];
var isEditTranslate = false;
var editExceptNos = [];

var PMain = {

    /** variable */
    initVariable: function () {

        $dtlTab = $('#dtlTab');
        //$configGrid = $('#configGrid'),
        $translateGrid = $('#translateGrid');
        $exceptGrid = $('#exceptGrid');

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
            // 등급 설정
            case "btnReg_conf":
                this.addConf();
                break;
            case 'btnDel_conf':
                this.delConf();
                break;
            case 'btnSave_conf':
                this.saveConf();
                break;

            // 해석 메시지
            case "btnReg_translate":
                this.addTranslate();
                break;
            case "btnDel_translate":
                this.delTranslate();
                break;
            case "btnSave_translate":
                this.saveTranslate();
                break;
            case "btnUp":
                this.rankUp();
                break;
            case "btnDown":
                this.rankDown();
                break;

            // 제외 메시지
            case "btnReg_except":
                this.addExcept();
                break;
            case "btnDel_except":
                this.delExcept();
                break;
            case "btnSave_except":
                this.saveExcept();
                break;
            case 'btnClose':
                //self.close();
                $('#pwindow').jqxWindow('close');
                break;
        }
        // event.preventDefault();
    },

    /** init design */
    initDesign: function () {
        HmWindow.create($('#pwindow2'), 100, 100);
        /** 탭 그리기 */
        $("#dtlTab").jqxTabs(
            {
                width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
                initTabContent: function (tab) {
                    switch (tab) {
                        case 0: // 등급 설정

                            Server.get('/main/nms/syslog/getSyslogConfList.do', {
                                data: null,
                                success: function (result) {
                                    for (var i = 0; i < result.length; i++) {
                                        (function (index) {
                                            var _item = result[index];
                                            $('#sysConfTable').append(`
                                                <tr data-sys-no="${_item.sysNo}" data-is-new="N">
                                                    <td class="txtCenter">
                                                        <div id="selectChk_${_item.sysNo}" name="selectChkList" style="margin:auto"></div>
                                                    </td>
                                                    <td class="txtCenter">
                                                        <input type="text" id="sysMsg_${_item.sysNo}" class="p_inputTxt" value="${_item.sysMsg}">
                                                    </td>
                                                    <td class="txtCenter">                                                       
                                                        <input id="sysColor_${_item.sysNo}">
                                                    </td>
                                                    <td class="txtCenter">
                                                        <div id="useFlag_${_item.sysNo}" style="margin: auto"></div>
                                                    </td>
                                                </tr>
                                            `);

                                            $('#selectChk_' + _item.sysNo).jqxCheckBox({
                                                width: 21,
                                                height: 21,
                                                checked: false
                                            }).on('change', function () {
                                                if ($(this).val()) {
                                                    $(this).parent().parent().css('background', 'lightgray');
                                                } else {
                                                    $(this).parent().parent().css('background', '');
                                                }
                                            });
                                            $('#useFlag_' + _item.sysNo).jqxCheckBox({
                                                width: 21,
                                                height: 21,
                                                checked: (_item.useFlag == 1)
                                            });

                                            $("#sysColor_" + _item.sysNo).spectrum();
                                            $("#sysColor_" + _item.sysNo).spectrum("set", result[index].sysColor || "#ffaabb" );

                                        }(i))
                                    }
                                }//success
                            });//Server.get

                            // HmGrid.create($configGrid, {
                            //     source: new $.jqx.dataAdapter({
                            //         datatype: 'json',
                            //         updaterow: function (rowid, rowdata, commit) {
                            //             if (editConfNos.indexOf(rowid) == -1)
                            //                 editConfNos.push(rowid);
                            //             commit(true);
                            //         },
                            //         url: ctxPath + '/main/nms/syslog/getSyslogConfList.do',
                            //         datafields: [
                            //             {name: 'sysNo', type: 'int'},
                            //             {name: 'sysMsg', type: 'string'},
                            //             {name: 'sysLevel', type: 'int'},
                            //             {name: 'sysLevelStr', type: 'string'}
                            //         ]
                            //     }),
                            //     height: 300,
                            //     editable: true,
                            //     editmode: 'selectedrow',
                            //     columns: [
                            //         {text: '번호', datafield: 'sysNo', hidden: true}, {
                            //             text: '포함 메시지 문구',
                            //             datafield: 'sysMsg'
                            //         },
                            //         {
                            //             text: '표현등급',
                            //             datafield: 'sysLevel',
                            //             displayfield: 'sysLevelStr',
                            //             width: 150,
                            //             columntype: 'dropdownlist',
                            //             createeditor: function (row, value, editor) {
                            //                 var s = HmResource.getResource('evt_level_list');
                            //                 editor.jqxDropDownList({
                            //                     source: s,
                            //                     autoDropDownHeight: true,
                            //                     enableBrowserBoundsDetection: true
                            //                 });
                            //             }
                            //         }
                            //     ]
                            // });
                            break;

                        case 1: // 해석 메시지
                            HmGrid.create($translateGrid, {
                                source: new $.jqx.dataAdapter({
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editTanslateNos.indexOf(rowid) == -1)
                                            editTanslateNos.push(rowid);
                                        commit(true);
                                    },
                                    url: ctxPath + '/main/nms/syslog/getTranslateList.do'
                                }),
                                height: "91%",
                                editable: true,
                                editmode: 'selectedrow',
                                columns: [
                                    {text: '순번', cellsrenderer: HmGrid.rownumrenderer, editable: false, width: 40},
                                    {text: '원본 문구', datafield: 'msg', editable: true},
                                    {text: '해석 문구', datafield: 'userMsg', editable: true},
                                    {text: 'FLAG', datafield: 'flag', editable: false, hidden: true}
                                ]
                            });
                            break;
                        case 2: // 제외 메시지
                            HmGrid.create($exceptGrid, {
                                source: new $.jqx.dataAdapter({
                                    datatype: 'json', updaterow: function (rowid, rowdata, commit) {
                                        if (editExceptNos.indexOf(rowid) == -1)
                                            editExceptNos.push(rowid);
                                        commit(true);
                                    },
                                    url: ctxPath + '/main/nms/syslog/getExceptList.do'
                                }),
                                height: "91%",
                                editable: false,
                                editmode: 'selectedrow',
                                columns: [
                                    {text: '번호', datafield: 'seqNo', hidden: true, width: 40},
                                    {text: 'severity', datafield: 'severityCond' , width:300,
                                        cellsRenderer: function (row, column, value, rowData) {
                                            var val = value;
                                            var splitVal = val.split(',')
                                            var severityStr = '';

                                            for(var i in splitVal){
                                                if(splitVal[i] == 0){
                                                    severityStr += 'emergency'
                                                }else if(splitVal[i] == 1){
                                                    severityStr += 'alert'
                                                }else if(splitVal[i] == 2){
                                                    severityStr += 'critical'
                                                }else if(splitVal[i] == 3){
                                                    severityStr += 'error'
                                                }else if(splitVal[i] == 4){
                                                    severityStr += 'warming'
                                                }else if(splitVal[i] == 5){
                                                    severityStr += 'notice'
                                                }else if(splitVal[i] == 6){
                                                    severityStr += 'informational'
                                                }else if(splitVal[i] == 7){
                                                    severityStr += 'debug'
                                                }else{}

                                                if(i < splitVal.length -1){
                                                    severityStr += ', '
                                                }
                                            }
                                            return '<div style="margin-top: 6px" class="jqx-grid-cell-left-align">' + severityStr + '</div>';
                                        }
                                    },
                                    {text: '제외 문구', datafield: 'exMsg' , minwidth:100}
                                ]
                            });
                            break;
                    }

                }
            }).on('selected', function (event) {
            PMain.searchDtlInfo();
        });
    },
    getTextElementByColor: function (color) {
        if (color == 'transparent' || color.hex == "") {
            return $("<div style='text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;'>transparent</div>");
        }
        var element = $("<div style='text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;'>#" + color.hex + "</div>");
        var nThreshold = 105;
        var bgDelta = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
        var foreColor = (255 - bgDelta < nThreshold) ? 'Black' : 'White';
        element.css('color', foreColor);
        element.css('background', "#" + color.hex);
        element.addClass('jqx-rc-all');
        return element;
    },

    /** init data */
    initData: function () {

    },

    /** 상세정보 */
    searchDtlInfo: function () {
        switch ($dtlTab.val()) {
            case 0:
                this.searchConf();
                break;
            case 1:
                this.searchtTranslate();
                break;
            case 2:
                this.searchExcept();
                break;
        }
    },

    searchConf: function () {
        //HmGrid.updateBoundData($configGrid, ctxPath + '/main/nms/syslog/getSyslogConfList.do');
    },

    searchtTranslate: function () {
        HmGrid.updateBoundData($translateGrid, ctxPath + '/main/nms/syslog/getTranslateList.do');
    },

    searchExcept: function () {
        HmGrid.updateBoundData($exceptGrid, ctxPath + '/main/nms/syslog/getExceptList.do');
    },

    addConf: function () {
        // $.post(ctxPath + '/main/popup/nms/pSyslogConfAdd.do', function (result) {
        //     HmWindow.openFit($('#pwindow'), 'Syslog 등급 설정 추가', result, 500, 310, 'pwindow_init');
        // });

        var $lastTr = $('#sysConfTable > tr:last');
        var _lastSysNo = parseInt($lastTr.data('sysNo') || 0);
        var _newSysNo = _lastSysNo + 1;

        if ($('#sysMsg_' + _lastSysNo).length > 0 && $('#sysMsg_' + _lastSysNo).val().length == 0) {
            alert('표현문자 입력은 완료해주세요');
            $('#sysMsg_' + _lastSysNo).focus();
            return;
        }

        $('#sysConfTable').append(`
            <tr data-sys-no="${_newSysNo}" data-is-new="Y">
                <td class="txtCenter">
                    <div id="selectChk_${_newSysNo}" name="selectChkList" style="margin:auto"></div>
                </td>
                <td class="txtCenter">
                    <input type="text" id="sysMsg_${_newSysNo}" class="p_inputTxt">
                </td>
                <td class="txtCenter">
                    <input id="sysColor_${_newSysNo}">
                </td>
                <td class="txtCenter">
                    <div id="useFlag_${_newSysNo}" style="margin: auto"></div>
                </td>
            </tr>
        `);

        $('#selectChk_' + _newSysNo).jqxCheckBox({width: 21, height: 21, checked: false}).on('change', function () {
            if ($(this).val()) {
                $(this).parent().parent().css('background', 'lightgray');
            } else {
                $(this).parent().parent().css('background', '');
            }
        });
        $('#useFlag_' + _newSysNo).jqxCheckBox({width: 21, height: 21, checked: true});

        $("#sysColor_" + _newSysNo).spectrum();
        $("#sysColor_" + _newSysNo).spectrum("set", "#ffaabb");

    },

    delConf: function () {


        var _delList = [];

        $.each($('#sysConfTable > tr'), function (i, el) {
            var _sysNo = $(el).data('sysNo');
            var _isNew = $(el).data('isNew');
            var _selectChk = $('#selectChk_' + _sysNo).val();
            if (_selectChk) {
                if (_isNew == 'N') {
                    _delList.push({sysNo: _sysNo});
                } else {
                    el.remove();
                }
            }
        });//$.each()

        if (_delList.length == 0) return;
        Server.post('/main/nms/syslog/delSyslogConf.do', {
            data: {delList: _delList}, success: function (data) {
                alert("삭제되었습니다.");
                var _trList = $('#sysConfTable > tr');
                $.each(_trList, function (i, el) {
                    var _sysNo = $(el).data('sysNo');
                    var _selectChk = $('#selectChk_' + _sysNo).val();
                    if (_selectChk) {
                        $(el).remove();
                    }
                })
                //editConfNos = [];
            }
        });

        // var rowIdx = HmGrid.getRowIdxes($configGrid, '데이터를 선택해주세요.');
        //
        // if (rowIdx === false)
        //     return;
        // if (!confirm('선택된 데이터를 삭제하시겠습니까?'))
        //     return;
        //
        // var _sysNo = $configGrid.jqxGrid('getcellvalue', rowIdx, "sysNo");
        //
        // Server.post('/main/nms/syslog/delSyslogConf.do', {
        //     data: {sysNo: _sysNo}, success: function (result) {
        //         $configGrid.jqxGrid('deleterow', $configGrid.jqxGrid('getrowid', rowIdx));
        //         alert('삭제되었습니다.');
        //     }
        // });

    },

    saveConf: function () {

        var _addList = [];
        var _editList = [];
        var _dupFlag = false;

        $.each($('#sysConfTable > tr'), function (i, el) {

            var _flg = false;
            $.each($('#sysConfTable > tr').not(':eq(' + i + ')'), function (j, el2) {
                if ($('#sysMsg_' + $(el).data('sysNo')).val() == $('#sysMsg_' + $(el2).data('sysNo')).val()) {
                    _flg = true;
                }
            });

            if (_flg) {
                alert('중복된 표현문자가 존재합니다.');
                _dupFlag = true;
                return false;
            } else {
                var _sysNo = $(el).data('sysNo');
                var _isNew = $(el).data('isNew');
                if (_isNew == 'Y') {


                    _addList.push({
                        sysMsg: $('#sysMsg_' + _sysNo).val(),
                        sysColor: '#' + $('#sysColor_' + _sysNo).spectrum("get").toHex(),
                        useFlag: $('#useFlag_' + _sysNo).val() ? 1 : 0
                    })

                } else {

                    _editList.push({
                        sysNo: _sysNo,
                        sysMsg: $('#sysMsg_' + _sysNo).val(),
                        sysColor: '#' + $('#sysColor_' + _sysNo).spectrum("get").toHex(),
                        useFlag: $('#useFlag_' + _sysNo).val() ? 1 : 0
                    })
                }
            }
        });//$.each

        if(_dupFlag) return;

        if (!PMain.validationConfCheck(_addList)) {
            alert('표현 문자 미입력 항목이 존재합니다. 확인해주세요.');
            return;
        }

        if (!PMain.validationConfCheck(_editList)) {
            alert('표현 문자 미입력 항목이 존재합니다. 확인해주세요.');
            return;
        }

        if (_addList.length <= 0) {
            alert('저장할 데이터가 없습니다. 확인해주세요.');
            return;
        }

        Server.post('/main/nms/syslog/saveSyslogConf.do', {
            data: {addList: _addList, editList: _editList}, success: function (data) {
                alert("저장되었습니다.");
                var _trList = $('#sysConfTable > tr');
                $.each(_trList, function (i, el) {
                    $(el).data('isNew', 'N');
                })
                //editConfNos = [];
            }
        });

        // HmGrid.endRowEdit($configGrid);
        // if (editConfNos.length == 0) {
        //     alert('변경된 데이터가 없습니다.');
        //     return;
        // }
        // var _list = [];
        // $.each(editConfNos, function (idx, value) {
        //     _list.push($configGrid.jqxGrid('getrowdatabyid', value));
        // });
        // Server.post('/main/nms/syslog/saveSyslogConf.do', {
        //     data: {list: _list}, success: function (data) {
        //         alert("저장되었습니다.");
        //         editConfNos = [];
        //     }
        // });
    },

    validationConfCheck: function (dataList) {
        for (var i = 0; i < dataList.length; i++) {
            if (dataList[i].sysMsg == '') {
                return false;
            }
        }
        return true
    },

    addTranslate: function () {
        $.post(ctxPath + '/main/popup/nms/pSyslogTranslateAdd.do', function (result) {
            HmWindow.openFit($('#pwindow2'), 'Syslog 해석 문구 추가', result, 400, 270, 'pwindow2_init');
        });
    },

    delTranslate: function () {
        var rowIdx = HmGrid.getRowIdxes($translateGrid, '데이터를 선택해주세요.');
        if (rowIdx === false)
            return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?'))
            return;

        var _seqNo = $translateGrid.jqxGrid('getcellvalue', rowIdx, "seqNo");
        Server.post('/main/nms/syslog/delSyslogTranslate.do', {
            data: {seqNo: _seqNo}, success: function (result) {
                $translateGrid.jqxGrid('deleterow', $translateGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },

    saveTranslate: function () {
        HmGrid.endRowEdit($translateGrid);
        if (editTanslateNos.length == 0 && isEditTranslate == false) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        var rows = $translateGrid.jqxGrid('getboundrows');
        $.each(rows, function (idx, value) {
            value.rank = idx + 1;
            _list.push(value);
        });
        Server.post('/main/nms/syslog/saveSyslogTranslate.do', {
            data: {list: _list}, success: function (data) {
                alert("저장되었습니다.");
                editTanslateNos = [];
            }
        });
    },

    rankUp: function () {
        var rowindex = $translateGrid.jqxGrid('getselectedrowindex');
        if (rowindex != 0) {
            var rows = $translateGrid.jqxGrid('getboundrows');
            var rowdata = $translateGrid.jqxGrid('getrowdata', rowindex);
            rows.splice(rowindex, 1);
            rows.splice(rowindex - 1, 0, rowdata);
            $translateGrid.jqxGrid('refreshdata');
            $translateGrid.jqxGrid('selectrow', rowindex - 1);
            isEditTranslate = true;
        }

    },

    rankDown: function () {
        var rowindex = $translateGrid.jqxGrid('getselectedrowindex');
        var rows = $translateGrid.jqxGrid('getboundrows');
        var rowdata = $translateGrid.jqxGrid('getrowdata', rowindex);
        if (rowindex < (rows.length - 1)) {
            rows.splice(rowindex, 1);
            rows.splice(rowindex + 1, 0, rowdata);
            $translateGrid.jqxGrid('refreshdata');
            $translateGrid.jqxGrid('selectrow', rowindex + 1);
            isEditTranslate = true;
        }
    },

    addExcept: function () {
        $.post(ctxPath + '/main/popup/nms/pSyslogExceptAdd.do', function (result) {
            HmWindow.openFit($('#pwindow2'), 'Syslog 제외 문구 추가', result, 350, 120, 'pwindow2_init');
        });
    },

    delExcept: function () {
        var rowIdx = HmGrid.getRowIdxes($exceptGrid, '데이터를 선택해주세요.');
        if (rowIdx === false)
            return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?'))
            return;

        var exceptNo = $exceptGrid.jqxGrid('getcellvalue', rowIdx, "exceptNo");
        Server.post('/main/nms/syslog/delSyslogExcept.do', {
            data: {exceptNo: exceptNo}, success: function (result) {
                $exceptGrid.jqxGrid('deleterow', $exceptGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },

    saveExcept: function () {
        HmGrid.endRowEdit($exceptGrid);
        if (editExceptNos.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        var rows = $exceptGrid.jqxGrid('getboundrows');
        $.each(editExceptNos, function (idx, value) {
            _list.push($exceptGrid.jqxGrid('getrowdatabyid', value));
        });
        Server.post('/main/nms/syslog/saveSyslogExcept.do', {
            data: {list: _list}, success: function (data) {
                alert("저장되었습니다.");
                editExceptNos = [];
            }
        });
    }
};

//# sourceURL=pSyslogConf.js
//
// $(function () {
//     PMain.initVariable();
//     PMain.observe();
//     PMain.initDesign();
//     PMain.initData();
// });
