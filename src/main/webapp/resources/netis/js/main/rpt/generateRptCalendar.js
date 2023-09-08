(function () {
    'use strict';

    function generateRptCalendar() {
        let calendarObj = $('#calendar');
        let calendarFileArray = [];

        function init() {
            drawCalendar(null);
            addEventListiner();
        };

        function getFirstDate() {
            let calendarDate = $('#calendar').jqxScheduler('date');
            let calendarDateObject = new Date(calendarDate.year(), calendarDate.month(), calendarDate.day());
            return new Date(calendarDateObject.getFullYear(), calendarDateObject.getMonth(), 1);
        };

        function getLastDate() {
            let calendarDate = $('#calendar').jqxScheduler('date');
            let calendarDateObject = new Date(calendarDate.year(), calendarDate.month(), calendarDate.day());
            return new Date(calendarDateObject.getFullYear(), calendarDateObject.getMonth() + 1, 0);
        };

        function drawCalendar(data) {
            var source = {
                datatype: 'json',
                datafields: [
                    {name: 'allDay', type: 'bool'},
                    {name: 'seq', type: 'number'},
                    {name: 'start', type: 'date'},
                    {name: 'end', type: 'date'},
                    {name: 'description', type: 'string'},
                    {name: 'filePath', type: 'string'},
                    {name: 'fileName', type: 'string'},
                    {name: 'fileCycleType', type: 'string'},
                    {name: 'fileCycleTypeCode', type: 'string'},
                    {name: 'download', type: 'string'},
                    {name: 'readOnly', type: 'bool'},
                    {name: 'draggable', type: 'bool'},
                    {name: 'resizable', type: 'bool'}
                ],
                id: 'seq',
                url: '/main/rpt/generateRptCalendar/getCalendarContents.do'
            };

            var adapter = new $.jqx.dataAdapter(source, {
                formatData: function (data) {
                    $.extend(data, {
                        // startDate: $.format.date(getFirstDate(), 'yyyy-MM-dd'),
                        // endDate: $.format.date(getLastDate(), 'yyyy-MM-dd')
                        startDate: '2018-04-01',
                        endDate: '2018-04-30'
                    });
                    return data;
                },
                downloadComplete: function (edata, textStatus, jqXHR) {
                    edata.forEach(function (a) {
                        calendarFileArray.push({
                            allDay: true,
                            seq: a.SEQ,
                            start: new Date(a.GEN_DATE),
                            end: new Date(a.GEN_DATE),
                            description: null,
                            download: a.DOWNLOAD,
                            filePath: a.PATH,
                            fileName: a.NAME,
                            fileCycleType: a.CYCLE_TYPE_STR,
                            fileCycleTypeCode: a.CYCLE_TYPE,
                            readOnly: true,
                            draggable: false,
                            resizable: false
                        });
                    });
                    return calendarFileArray;
                }
            });

            calendarObj.jqxScheduler({
                date: new $.jqx.date('todayDate'),
                source: adapter,
                width: '99.8%',
                height: '99.8%',
                toolBarRangeFormat: 'yyyy년 MM월 dd일',
                toolBarRangeFormatAbbr: 'yyyy년 MM월 dd일',
                view: 'monthView',
                enableHover: false,
                editDialog: false,
                showLegend: false,
                contextMenu: false,
                appointmentTooltips: false,
                localization: getLocalization(),
                views:
                    [
                        {type: 'monthView', monthRowAutoHeight: true}
                    ],
                appointmentDataFields:
                    {
                        allDay: 'allDay',
                        from: 'start',
                        to: 'end',
                        id: 'seq',
                        description: 'description',
                        filePath: 'filePath',
                        fileName: 'fileName',
                        fileCycleType: 'fileCycleType',
                        fileCycleTypeCode: 'fileCycleTypeCode',
                        download: 'download',
                        readOnly: 'readOnly',
                        draggable: 'draggable',
                        resizable: 'resizable'
                    },
                renderAppointment: function (data) {
                    data.html = '[' + data.appointment.fileCycleType + '] ' + data.appointment.fileName;
                    if (data.appointment.fileCycleTypeCode === 'D')
                        data.background = 'rgba(1, 125, 215, 0.7)';
                    if (data.appointment.fileCycleTypeCode === 'W')
                        data.background = 'rgba(48, 2, 215, 0.7)';
                    if (data.appointment.fileCycleTypeCode === 'M')
                        data.background = 'rgba(48, 125, 3, 0.7)';
                    if (data.appointment.fileCycleTypeCode === 'Y')
                        data.background = 'rgba(123, 4, 215, 0.7)';
                    return data;
                }
            });
        };

        function addEventListiner() {
            $('#btnSearch').on('click', btnActionEventHandler);
            $('#calendar').on('appointmentDoubleClick', appointmentDoubleClickEventHandler);
        };

        function appointmentDoubleClickEventHandler(event) {
            let data = event.args.appointment;
            let dd = data.originalData;

            var a = document.createElement('a');
            a.href = encodeURI('http://' + dd.download + dd.seq);
            a.target = '_blank';
            a.download = dd.fileName;
            a.click();
        };

        function btnActionEventHandler(event) {
            let id = event.currentTarget.id;
            switch (id) {
                case 'btnSearch':
                    break;
                default:
                    console.log(id);
            }
        };

        return {init: init}
    };
    new generateRptCalendar().init();
})();