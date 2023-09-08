(function () {
    'use strict';
    var generateRpt = {
        message: {emptyRptName: '보고서 명을 입력하세요.', emptyRptId: '보고서를 선택하세요.', failed: '작업을 실패하였습니다.'},
        rptList: null,
        contentList: null,
        rptId: null,
        init: function () {
            generateRpt.rptList = $('#rptList');
            generateRpt.contentList = $('#contentList');
            generateRpt.draw();
            generateRpt.addEventListener();
        },
        draw: function () {
            $('#mainSplitter').jqxSplitter({width: '99.8%', height: '99.8%', panels: [{size: 300}]});
            let rptListBoxSource = new $.jqx.dataAdapter({
                datatype: 'json',
                url: '/code/getCodeListByCodeKind.do',
                data: {codeKind: 'GENERATE_RPT_NAME'}
            });
            generateRpt.rptList.jqxListBox({
                source: rptListBoxSource,
                displayMember: 'codeValue1',
                valueMember: 'codeId',
                width: '100%',
                height: '100%'
            });
            HmWindow.create($('#rptWindow'), 262, 70);

            //글로벌 설정
            $('#rptGenerateCycleCombo').jqxComboBox({
                source: [
                    {displayValue: '선택하세요', value: ''},
                    {displayValue: '일별', value: 'D'},
                    {displayValue: '주별', value: 'W'},
                    {displayValue: '월별', value: 'M'}
                ],
                width: 120,
                height: 15,
                displayMember: 'displayValue',
                valueMember: 'value',
                selectedIndex: 0
            });
            $('#rptFileTypeCombo').jqxComboBox({
                source: [
                    {displayValue: '선택하세요', value: ''},
                    {displayValue: 'PDF', value: 'PDF'}
                    // {displayValue: 'EXCEL', value: 'XLS'}
                ],
                width: 120,
                height: 15,
                displayMember: 'displayValue',
                valueMember: 'value',
                selectedIndex: 0
            });
            $('#rptFileNameInput').jqxInput({width: 200});
            // $('#rptFilePathInput').jqxInput({width: 200});
            $('#rptTopNCombo').jqxComboBox({
                source: [
                    {displayValue: '선택하세요', value: ''},
                    {displayValue: '10', value: '10'},
                    {displayValue: '20', value: '20'},
                    {displayValue: '30', value: '30'}
                ],
                width: 120,
                height: 15,
                displayMember: 'displayValue',
                valueMember: 'value',
                selectedIndex: 0
            });

            // DB 에 넣든 여기다 하든 뭐 어케 하것지
            let contentData = [
                //
                {rptNo: 1, parentRptNo: null, name: 'Network 운영 현황'},
                {rptNo: 101, parentRptNo: 1, name: '구성현황'},
                {rptNo: 102, parentRptNo: 1, name: '장애 조치 현황'},
                {rptNo: 103, parentRptNo: 1, name: '회선 Error(CRC, Discard 포함) 패킷 발생 현황'},
                {rptNo: 104, parentRptNo: 1, name: '주요 장비 현황 (주요장비그룹)'},
                {rptNo: 105, parentRptNo: 1, name: '주요 회선 현황 (주요회선그룹)'},
                {rptNo: 106, parentRptNo: 1, name: '작업 현황'},
                //
                {rptNo: 2, parentRptNo: null, name: '장비 성능 정보'},
                {rptNo: 201, parentRptNo: 2, name: 'CPU TOP'},
                {rptNo: 202, parentRptNo: 2, name: 'Memory TOP'},
                {rptNo: 203, parentRptNo: 2, name: '장비 온도 TOP'},
                {rptNo: 204, parentRptNo: 2, name: '응답 시간 TOP'},
                //
                {rptNo: 3, parentRptNo: null, name: '회선 성능 정보'},
                {rptNo: 301, parentRptNo: 3, name: 'INPUT 사용량 / 패킷량 TOP'},
                {rptNo: 302, parentRptNo: 3, name: 'OUTPUT 사용량 / 패킷량 TOP'},
                {rptNo: 303, parentRptNo: 3, name: 'Error(CRC, Discard 포함) 발생 회선 TOP'},
                {rptNo: 304, parentRptNo: 3, name: 'Small 패킷 발생 회선 TOP'},
                {rptNo: 305, parentRptNo: 3, name: 'Big 패킷 발생 회선 TOP'},
                {rptNo: 306, parentRptNo: 3, name: '회선 그룹 사용량 TOP'},
                //
                {rptNo: 4, parentRptNo: null, name: '장애 현황'},
                {rptNo: 401, parentRptNo: 4, name: '장애 등급별 발생 현황'},
                {rptNo: 402, parentRptNo: 4, name: '장애 TTS 현황'}
            ];
            let contentSource = {
                dataType: 'json',
                hierarchy: {
                    keyDataField: {name: 'rptNo'},
                    parentDataField: {name: 'parentRptNo'}
                },
                id: 'rptNo',
                localData: contentData
            }

            $('#contentList').jqxTreeGrid({
                source: new $.jqx.dataAdapter(contentSource),
                width: '100%',
                height: '100%',
                checkboxes: true,
                hierarchicalCheckboxes: true,
                localization : getLocalization('kr'),
                columns: [
                    {text: '보고서 이름', dataField: 'name'}
                ]
            });
            $("#contentList").jqxTreeGrid('expandAll');
            //expandAll 버그인듯.. expandAll을 하면 하위 객체에 대해 반선택이 되어짐.
            $("#contentList").jqxTreeGrid('getRows').forEach(function (a) {
                $("#contentList").jqxTreeGrid('uncheckRow', a.rptNo);
            });
        },
        addEventListener: function () {
            $(document).on('click', 'button', generateRpt.buttonEventHandlers);
            generateRpt.rptList.on('change', generateRpt.rptListEventHandlers).on('unselect', generateRpt.rptListEventHandlers);
        },
        buttonEventHandlers: function (event) {
            let id = event.currentTarget.id;
            switch (id) {
                case "addRpt":
                    $('#rptWindow').jqxWindow({
                        title: '<h1>보고서명 등록</h1>',
                        content: '<input id="inputRptName" type="text"/> <button id="addRptNamePopup" class="p_btnPlus"/>'
                    });
                    $('#rptWindow').jqxWindow('open');
                    break;
                case 'adjRpt':
                    if (!thisPageValidation.rptId(generateRpt.rptId)) {
                        return;
                    }
                    $('#rptWindow').jqxWindow({
                        title: '<h1>보고서명 수정</h1>',
                        content: '<input id="inputRptName" type="text"/> <button id="adjRptNamePopup" class="p_btnAdj"/>'
                    });
                    $('#rptWindow').jqxWindow('open');
                    break;
                case 'delRpt':
                    if (!thisPageValidation.rptId(generateRpt.rptId)) {
                        return;
                    }
                    $('#rptWindow').jqxWindow({
                        title: '<h1>보고서명 삭제</h1>',
                        content: '<div style="text-align: center;"><button id="delRptNamePopup" class="p_btnConfirm"/><button id="delCancelRptNamePopup" class="p_btnCancel" style="margin-left: 5px;"/></div>'
                    });
                    $('#rptWindow').jqxWindow('open');
                    break;
                case 'saveRpt':
                    if (!thisPageValidation.rptId(generateRpt.rptId)) {
                        return;
                    }
                    generateRpt.saveInfoProcess();
                    break;
                case 'addRptNamePopup':
                    generateRptPopup.addRptName($('#inputRptName').val());
                    break;
                case 'adjRptNamePopup':
                    generateRptPopup.adjRptName(generateRpt.rptId, $('#inputRptName').val());
                    break;
                case 'delRptNamePopup':
                    generateRptPopup.delRptName(generateRpt.rptId);
                    break;
                case 'delCancelRptNamePopup':
                    $('#rptWindow').jqxWindow('close');
                    break;
                default:
                    console.log(id);
            }
        },
        rptListEventHandlers: function (event) {
            if (event.type === 'unselect') {
                generateRpt.rptId = null;
            } else if (event.type == 'change') {
                generateRpt.rptId = event.args.item.originalItem.codeId;
                generateRpt.getInfoProcess(generateRpt.rptId);
            }
        },
        setDefaultValueInfo: function () {
            document.querySelectorAll('[data-type="globalParam"]').forEach(function (a) {
                $('#' + a.id).val('');
            });
            //귀찮아
            generateRpt.contentList.jqxTreeGrid('uncheckRow', 1);
            generateRpt.contentList.jqxTreeGrid('uncheckRow', 2);
            generateRpt.contentList.jqxTreeGrid('uncheckRow', 3);
            generateRpt.contentList.jqxTreeGrid('uncheckRow', 4);
        },
        getInfoProcess: function (rptId) {
            $.get('/main/rpt/generateRpt/getRptInfo.do', {rptId: rptId}, function (data) {
                if (data === undefined || data.length == 0) {
                    generateRpt.setDefaultValueInfo();
                }
                data.forEach(function (a) {
                    if (a.codeId.indexOf('LIST_') >= 0) {
                        if (a.codeValue2 != null){
                            generateRpt.contentList.jqxTreeGrid('checkRow', a.codeId.replace(/\D/g, ''));
                        }
                    } else {
                        try {
                            $('#' + a.codeId).val(a.codeValue1);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });

            });
        },
        getUniqueObjectArray: function (array, key) {
            var tempArray = [];
            var resultArray = [];
            for(var i = 0; i < array.length; i++) {
                var item = array[i]
                if(tempArray.includes(item[key])) {
                    continue;
                } else {
                    resultArray.push(item);
                    tempArray.push(item[key]);
                }
            }
            return resultArray;
        },
        saveInfoProcess: function () {
            let globalParam = [];
            document.querySelectorAll('[data-type="globalParam"]').forEach(function (a) {
                globalParam.push({
                    codeId: a.id,
                    codeValue1: $('#' + a.id).val()
                });
            });

            let contentParam = [];
            generateRpt.contentList.jqxTreeGrid('getCheckedRows').forEach(function (a) {
                contentParam.push({rptNo: a.rptNo, parentRptNo: a.parentRptNo, name: a.name});
                if(a.parent != null){
                    contentParam.push({rptNo: a.parent.rptNo, parentRptNo: a.parent.parentRptNo, name: a.parent.name});
                }
            });
            contentParam.sort(function (a, b) {
                return a.rptNo - b.rptNo
            });
            let duplicateContentParam = generateRpt.getUniqueObjectArray(contentParam, 'rptNo');
            let index = 1;
            let parentRptNo = null;
            $.each(duplicateContentParam, function(i, o){
                if(o.parentRptNo == null){
                    o["index"] = o.rptNo.toString();
                }
                else{
                    if(parentRptNo !== o.parentRptNo)
                        index = 1;
                    o["index"] = o.parentRptNo + '.' + index++;
                    parentRptNo = o.parentRptNo;
                }
            });
            $.ajax({
                type: 'POST',
                url: '/main/rpt/generateRpt/addRptInfo.do',
                dataType: 'json',
                data: JSON.stringify({rptId: generateRpt.rptId, globalList: globalParam, contentList: duplicateContentParam}),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    alert(data);
                },
                error: function (error) {
                    console.log(error);
                    alert(generateRpt.message.failed);
                }
            });
        }
    };

    var generateRptPopup = {
        addRptName: function (rptName) {
            if (!thisPageValidation.rptName(rptName)) {
                return;
            }
            generateRptPopup.postRptListProcess('/main/rpt/generateRpt/addRptName.do', {rptName: rptName});
        },
        adjRptName: function (rptId, rptName) {
            if (!thisPageValidation.rptId(rptId) && !thisPageValidation.rptName(rptName)) {
                return;
            }
            generateRptPopup.postRptListProcess('/main/rpt/generateRpt/adjRptName.do', {
                rptId: rptId,
                rptName: rptName
            });
        },
        delRptName: function (rptId) {
            if (!thisPageValidation.rptId(rptId)) {
                return;
            }
            generateRptPopup.postRptListProcess('/main/rpt/generateRpt/delRptName.do', {rptId: rptId});
        },
        postRptListProcess: function (url, param) {
            $.post(url, param, function (result) {
                generateRpt.rptList.jqxListBox('refresh');
                generateRpt.rptList.jqxListBox('clearSelection');
                alert(result);
                $('#rptWindow').jqxWindow('close');
            }).fail(function (e) {
                alert(generateRpt.message.failed);
            });
        }
    };

    var thisPageValidation = {
        rptName: function (rptName) {
            if (rptName.length == 0) {
                alert(generateRpt.message.emptyRptName);
                return false;
            }
            return true;
        },
        rptId: function (rptId) {
            if (rptId === null || rptId === undefined) {
                alert(generateRpt.message.emptyRptId);
                return false;
            }
            return true;
        }
    };
    generateRpt.init();
})();