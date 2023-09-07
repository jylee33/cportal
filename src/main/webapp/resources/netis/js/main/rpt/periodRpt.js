(function () {
    'use strict';
    var periodRpt = {
        message: {emptyRptName: '보고서 명을 입력하세요.', emptyRptId: '보고서를 선택하세요.', failed: '작업을 실패하였습니다.'},
        contentList: null,
        rptId: null,
        init: function () {
            periodRpt.contentList = $('#contentList');
            periodRpt.draw();
            periodRpt.addEventListener();
        },
        draw: function () {
            HmWindow.create($('#rptWindow'), 262, 70);
            //글로벌 설정
            $('#rptDateRange').jqxDateTimeInput({
                culture: 'ko-KR',
                formatString: 'yyyy-MM-dd',
                selectionMode: 'range',
                height: '30px'
            });
            $('#rptTopNCombo').jqxComboBox({
                source: [
                    {displayValue: '10', value: '10'},
                    {displayValue: '20', value: '20'},
                    {displayValue: '30', value: '30'}
                ],
                width: 120,
                height: '30px',
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
            };

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
            $(document).on('click', 'button', periodRpt.buttonEventHandlers);
        },
        buttonEventHandlers: function (event) {
            let id = event.currentTarget.id;
            switch (id) {
                case 'viewBtn':
                    periodRpt.saveInfoProcess();
                    break;
                default:
                    console.log(id);
            }
        },
        rptListEventHandlers: function (event) {
            if (event.type === 'unselect') {
                periodRpt.rptId = null;
            } else if (event.type == 'change') {
                periodRpt.rptId = event.args.item.originalItem.codeId;
                periodRpt.getInfoProcess(periodRpt.rptId);
            }
        },
        setDefaultValueInfo: function () {
            document.querySelectorAll('[data-type="globalParam"]').forEach(function (a) {
                $('#' + a.id).val('');
            });
            //귀찮아
            periodRpt.contentList.jqxTreeGrid('uncheckRow', 1);
            periodRpt.contentList.jqxTreeGrid('uncheckRow', 2);
            periodRpt.contentList.jqxTreeGrid('uncheckRow', 3);
            periodRpt.contentList.jqxTreeGrid('uncheckRow', 4);
        },
        getInfoProcess: function (rptId) {
            $.get('/main/rpt/periodRpt/getRptInfo.do', {rptId: rptId}, function (data) {
                if (data === undefined || data.length == 0) {
                    periodRpt.setDefaultValueInfo();
                }
                data.forEach(function (a) {
                    if (a.codeId.indexOf('LIST_') >= 0) {
                        if (a.codeValue2 != null) {
                            periodRpt.contentList.jqxTreeGrid('checkRow', a.codeId.replace(/\D/g, ''));
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
            let tempArray = [];
            let resultArray = [];
            for (var i = 0; i < array.length; i++) {
                let item = array[i]
                // if (tempArray.includes(item[key])) {
                if (tempArray.indexOf(item[key]) > -1) {
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
            let tempGlobalParam = document.querySelectorAll('[data-type="globalParam"]');
            $.each(tempGlobalParam, function (i, a) {
                globalParam.push({
                    codeId: a.id,
                    codeValue1: $('#' + a.id).val()
                });
            });

            let contentParam = [];
            let tmpContentParam = $('#contentList').jqxTreeGrid('getCheckedRows');
            $.each(tmpContentParam, function (i, a) {
                contentParam.push({rptNo: a.rptNo, parentRptNo: a.parentRptNo, name: a.name});
                if (a.parent != null) {
                    contentParam.push({rptNo: a.parent.rptNo, parentRptNo: a.parent.parentRptNo, name: a.parent.name});
                }
            });
            contentParam.sort(function (a, b) {
                return a.rptNo - b.rptNo
            });
            let duplicateContentParam = periodRpt.getUniqueObjectArray(contentParam, 'rptNo');
            let index = 1;
            let parentRptNo = null;
            $.each(duplicateContentParam, function (i, o) {
                if (o.parentRptNo == null) {
                    o["index"] = o.rptNo.toString();
                }
                else {
                    if (parentRptNo !== o.parentRptNo)
                        index = 1;
                    o["index"] = o.parentRptNo + '.' + index++;
                    parentRptNo = o.parentRptNo;
                }
            });
            $.ajax({
                type: 'POST',
                url: '/main/rpt/periodRpt/addCustomPeriodRptInfo.do',
                dataType: 'json',
                data: JSON.stringify({rptId: 0, globalList: globalParam, contentList: duplicateContentParam}),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    periodRpt.callReportViewer(data);
                },
                error: function (error) {
                    console.log(error);
                    alert('Failed');
                }
            });
        },
        callReportViewer: function (rptId) {
            let params = {
                restServerIp: window.location.hostname,
                restServerPort: $('#gBirtServerPort').val(),
                rptId: rptId,
                title: '기간'
            };
            params.exportName = encodeURI(encodeURIComponent(params.date + '_' + params.title));
            let url = 'http://' + window.location.hostname + ':' + window.location.port
                + '/birt/frameset?__report=GenerateReport.rptdesign&' + $.param(params);
            window.open(url, params.reportName, 'width=1000,height=850,left=' + parseInt((screen.availWidth / 2) - (1000 / 2)) + ',top=' + parseInt((screen.availHeight / 2) - (850 / 2)) + ',resizable=yes,scrollbars=yes,status=no');
        }
    };

    periodRpt.init();
})();