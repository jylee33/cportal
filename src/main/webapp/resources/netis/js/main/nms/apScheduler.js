var $schedulerGrid;
var timer;
var _columns = [
    {text: '그룹명', datafield: 'grpName', width: '50%', pinned: true},
    {text: '스케줄러 그룹', datafield: 'schName', width: '50%', pinned: true},
    {text: '스케줄러 번호', datafield: 'schNo', width: 150, pinned: true, hidden: true},
];

var Main = {

    /** variable */
    initVariable: function () {
        $schedulerGrid = $('#schedulerGrid');
        this.initCondition();
    },

    initCondition: function () {

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

        HmJqxSplitter.createTree($('#mainSplitter'));

        HmJqxSplitter.create($('#tSplitter'), HmJqxSplitter.ORIENTATION_V, [{size: "30%"}, {size: '70%'}], '100%', '100%', {showSplitBar: false});

        Master.createApGrpTab(Main.selectTree);

        HmGrid.create($schedulerGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'grpName', type: 'string'},
                        {name: 'schName', type: 'string'},
                        {name: 'schNo', type: 'number'},
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, Master.getApGrpParams());
                        return data;
                    }
                }
            ),
            columns: _columns
        }, CtxMenu.NONE);


        $('div[id^="ckDay"]').jqxCheckBox({width: 50, height: 25});

        HmDate.create($("#date1"), $("#date2"), HmDate.DAY, 1, HmDate.FS_SHORT);

        $('#time1, #time2').jqxDateTimeInput({
            width: 30,
            height: 21,
            theme: jqxTheme,
            formatString: 'HH',
            textAlign: 'center',
            showCalendarButton: false,
            disabled: true
        });
        $('#time2').val('23');


    },

    /** init data */
    initData: function () {

    },

    /** 그룹트리 선택이벤트 */
    selectTree: function () {
        Main.search();
    },

    /** 조회 */
    search: function () {

        var params = Master.getApGrpParams();
        if (params.grpType == 'FILTER') {
            if (params.filterFlag) {
            } else {
                alert('선택된 필터가 없습니다.');
                $schedulerGrid.jqxGrid('clear');
            }
        } else {
        }
    },


};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});