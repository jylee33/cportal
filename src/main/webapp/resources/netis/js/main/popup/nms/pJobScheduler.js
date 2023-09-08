var $p_scheduler, timer;
var p_source =
    {
        dataType: 'json',
        dataFields: [
            { name: 'keyNo', type: 'long' },
            { name: 'regDate', type: 'string', format: 'yyyy-MM-dd HH:mm:ss' },
            { name: 'fromYmdhms', type: 'date', format: 'yyyy-MM-dd HH:mm' },
            { name: 'toYmdhms', type: 'date', format: 'yyyy-MM-dd HH:mm' },
            { name: 'jobName', type: 'string' },
            { name: 'jobContent', type: 'string' },
            { name: 'admin', type: 'string' },
            { name: 'contact', type: 'string' },
            { name: 'jobFlag', type: 'int' },
            { name: 'jobLevelStr', type: 'string' },
            { name: 'tooltip', type: 'string' },
            { name: 'jobType', type: 'string' },
            { name: 'uniqKey', type: 'string' },
            { name: 'reqUser', type: 'string' }
        ],
        id: 'uniqKey',
        url: ctxPath + '/main/nms/jobScheduler/getJobListAll.do'
    };

$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    /** variable */
    initVariable: function () {
        $p_scheduler = $('#p_scheduler');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'pbtnExcelAll': this.exportExcel(); break;
            case 'btnClose': self.close(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmWindow.create($('#pwindow'), 100, 100, 400);
        $('#p_prgrsBar').jqxProgressBar({ width : 120, height : 20, theme: jqxTheme, showText : true, animationDuration: 0  });
        $('#p_prgrsBar').on('complete', function(event) {
            PMain.search();
            $(this).val(0);
        });
        $('#p_refreshCycleCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            source: [
                { label: 'NONE', value: 0 },
                { label: '30분', value: 1800 },
                { label: '20분', value: 1200 },
                { label: '10분', value: 600 }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 3
        })
            .on('change', function() {
                PMain.chgRefreshCycle();
            });

        $p_scheduler.jqxScheduler({
            date: new $.jqx.date('todayDate'),
            width: '100%',
            height: '93%',
            theme: jqxTheme,
            source: new $.jqx.dataAdapter(p_source),
            view: 'monthView',
            showLegend: true,
            editDialog: false,
            contextMenu: true,
            toolBarRangeFormat: 'yyyy년 MM월 dd일',
            dayNameFormat: 'abbr',
            editDialogDateTimeFormatString: 'yyyy-MM-dd HH:mm',
            editDialogDateFormatString: 'yyyy-MM-dd',
            appointmentDataFields: {
                from: 'fromYmdhms',
                to: 'toYmdhms',
                id: 'uniqKey',
                description: 'jobContent',
                location: 'contact',
                subject: 'jobName',
                resourceId: 'jobType',
                style: 'style',
                tooltip: 'tooltip'
            },
            // resources: {
            // 	colorScheme: 'scheme02',
            // 	dataField: 'jobType',
            // 	source: new $.jqx.dataAdapter(p_source)
            // },
            views: [
                { type: 'weekView' },
                { type: 'monthView' }
            ],
            renderAppointment: function(data) {
                var appointment = data.appointment;
                var originalData = appointment.originalData;
                var img = '', backColor = '', borderColor = '';
                switch(originalData.jobLevelStr) {
                    case '높음': backColor = '#D47FFF'; borderColor = '#D47FFF'; break;
                    case '보통': backColor = '#97DD90'; borderColor = '#6DCF66'; break;
                    case '낮음': backColor = '#FED171'; borderColor = '#FCC03A'; break;
                    case '프로젝트': backColor = '#2AE3F4'; borderColor = '#1DD2E2'; break;
                    default: backColor = '#FFFFFF'; borderColor = '#FFFFFF'; break;
                }
                data.html = '<div style="color: #333">[' + $.format.date(originalData.fromYmdhms, 'HH:mm') + ' ~ ' + $.format.date(originalData.toYmdhms, 'HH:mm') + '] ' + appointment.subject + '</div>';
                data.background = backColor;
                data.borderColor = borderColor;

                return data;
            },

            contextMenuCreate: function(menu, settings) {
                var source = settings.source;
                var source = [
                    { label: '장비 작업 추가', id: 'devadd' },
                    { label: '회선 작업 추가', id: 'ifadd' },
                    { label: '작업 수정', id: 'edit' },
                    { label: '작업 삭제', id: 'delete' }
                ];
                settings.source.length = 0;
                settings.source = source;
                menu.width = 300;
            },

            contextMenuOpen: function(menu, appointment, event) {
                if(!appointment) {
                    menu.jqxMenu('hideItem', 'edit');
                    menu.jqxMenu('hideItem', 'delete');
                    menu.jqxMenu('showItem', 'devadd');
                    menu.jqxMenu('showItem', 'ifadd');
                }
                else {
                    menu.jqxMenu('showItem', 'edit');
                    menu.jqxMenu('showItem', 'delete');
                    menu.jqxMenu('hideItem', 'devadd');
                    menu.jqxMenu('hideItem', 'ifadd');
                }
            },

            contextMenuItemClick: function(menu, appointment, event) {
                switch(event.args.id) {
                    case 'devadd':
                        PMain.addJob('DEV', appointment);
                        break;
                    case 'ifadd':
                        PMain.addJob('IF', appointment);
                        break;
                    case 'edit':
                        PMain.editJob(appointment.originalData);
                        break;
                    case 'delete':
                        PMain.delJob(appointment.originalData, appointment.id);
                }
            },
            localization: {
                firstDay: 0,
                days: {
                    names: ["일", "월", "화", "수", "목", "금", "토"],
                    namesAbbr: ["일", "월", "화", "수", "목", "금", "토"],
                    namesShort: ["일", "월", "화", "수", "목", "금", "토"]
                },
                months: {
                    names: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", ""],
                    namesAbbr: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", ""]
                }
            },
        })
            .on('appointmentDoubleClick', function(event) {
                // 작업 상세view
                var appointment = event.args.appointment;
                PMain.showJobInfo(appointment.originalData);
            });
    },

    /** init data */
    initData: function() {
        PMain.chgRefreshCycle();
    },

    /** 새로고침 주기 변경 */
    chgRefreshCycle : function() {
        var cycle = $('#p_refreshCycleCb').val();
        if (timer != null)
            clearInterval(timer);
        if (cycle > 0) {
            timer = setInterval(function() {
                var curVal = $('#p_prgrsBar').val();
                if (curVal < 100)
                    curVal += 100 / cycle;
                $('#p_prgrsBar').val(curVal);
            }, 1000);
        } else {
            $('#p_prgrsBar').val(0);
        }
    },

    /** 조회 */
    search: function() {
        $p_scheduler.jqxScheduler({ source: new $.jqx.dataAdapter(p_source) });
    },

    /** 작업정보 보기 */
    showJobInfo: function(jobData) {
        $.post(ctxPath + '/main/popup/nms/pJobDetail.do',
            {jobType: jobData.jobType, keyNo: jobData.keyNo},
            function(result) {
                HmWindow.open($('#pwindow'), '작업 상세', result, 750, 660, 'pwindow_init', jobData);
            }
        );
    },

    /** 작업등록 */
    addJob: function(jobKind, appointment) {
        var selection = $p_scheduler.jqxScheduler('getSelection');
        var params = {
            from: selection.from.toString(),
            to: selection.to.toString()
        };

        switch(jobKind) {
            case 'DEV':
                params.jobType = 'DEV';
                $.post(ctxPath + '/main/popup/nms/pJobAdd.do',
                    params,
                    function(result) {
                        HmWindow.openFit($('#pwindow'), '장비 작업등록', result, 750, 660);
                    }
                );
                break;
            case 'IF':
                params.jobType = 'IF';
                $.post(ctxPath + '/main/popup/nms/pJobAdd.do',
                    params,
                    function(result) {
                        HmWindow.openFit($('#pwindow'), '회선 작업등록', result, 750, 660);
                    }
                );
                break;
        }
    },

    /** 작업 권한 체크 */
    checkJobAuth: function(reqUser) {
        var sAuth = ($('#sAuth').val() || 'User').toUpperCase(),
            sUserId = $('#sUserId').val();

        // system계정이 아니고 작성자가 아니면 편집 불가
        var isAuth = (sAuth != 'SYSTEM' && sUserId != reqUser)? false : true;
        if(!isAuth) {
            alert('권한이 없습니다.');
        }
        return isAuth;

    },

    /** 작업 수정 */
    editJob: function(jobData) {
        if(!PMain.checkJobAuth(jobData.reqUser)) return;

        switch(jobData.jobType) {
            case 'DEV':
                $.post(ctxPath + '/main/popup/nms/pJobEdit.do',
                    { jobType: 'DEV', keyNo: jobData.keyNo, mngNo: jobData.mngNo },
                    function(result) {
                        HmWindow.open($('#pwindow'), '장비 작업수정', result, 750, 675);
                    }
                );
                break;
            case 'IF':
                $.post(ctxPath + '/main/popup/nms/pJobEdit.do',
                    { jobType: 'IF', keyNo: jobData.keyNo, mngNo: jobData.mngNo, ifIdx: jobData.ifIdx },
                    function(result) {
                        HmWindow.open($('#pwindow'), '회선 작업수정', result, 750, 675);
                    }
                );
                break;
        }
    },

    /** 작업 삭제 */
    delJob: function(jobData, id) {
        if(!PMain.checkJobAuth(jobData.reqUser)) return;

        if(!confirm('선택된 작업을 삭제하시겠습니까?')) return;
        switch(jobData.jobType) {
            case 'DEV':
                Server.post('/main/nms/jobHist/delDevJobHist.do', {
                    data: { keyNo: jobData.keyNo },
                    success: function(result) {
                        $p_scheduler.jqxScheduler('deleteAppointment', id);
                        alert(result);
                    }
                });
                break;
            case 'IF':
                Server.post('/main/nms/jobHist/delIfJobHist.do', {
                    data: { keyNo: jobData.keyNo },
                    success: function(result) {
                        $p_scheduler.jqxScheduler('deleteAppointment', id);
                        alert(result);
                    }
                });
                break;
        }
    },

    /** export excel */
    exportExcel: function() {
        var dateArr = $('div.jqx-scheduler-toolbar-details').text().split('-');
        if(dateArr.length < 2) return;
        var params = {
            date1: dateArr[0].replace(/\D/g, '') + '000000',
            date2: dateArr[1].replace(/\D/g, '') + '235959'
        };

        HmUtil.exportExcel(ctxPath + '/main/nms/jobScheduler/exportAll.do', params);
    }

};

function refresh() {
    PMain.search();
}
