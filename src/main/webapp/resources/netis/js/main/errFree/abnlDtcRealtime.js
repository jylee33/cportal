var $realTimeGrid, params, timer, category, searchText;
var test;
var pagenum = 0;
var searchCategory = [
    {label: '그룹명', value: 'grpName'}
    // , {label: '상태', value: 'active'}
    // , {label: '이벤트ID', value: 'eventId'}
    // , {label: '취약층', value: 'layer'}
];
var Main = {
    initVariable : function() {
        $realTimeGrid = $('#realTimeGrid');
        params = pAbnlDtcRealTimeChart.getCommParams();
        this.initCondition();
    },
    initCondition: function() {
        HmBoxCondition.createPeriod('_pClient', Main.search, timer);
        HmBoxCondition.createRadioInput($('#sSrchType'), searchCategory);
        $("input[name=sRef_pClient]").eq(1).click();
        $("input[name=sSrchType]").eq(0).click();
    },
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.search(); break;
            case 'btnExcel': this.exportExcel(); break;
        }
    },
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.search();
        }
    },
    initDesign: function() {
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%',collapsible: false }, { size: '50%' }], 'auto', '95%');
        pAbnlDtcRealTimeChart.initDesign();
        HmGrid.create($realTimeGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        $.extend(data, Master.getGrpTabParams());
                        return JSON.stringify(data);
                    }
                }
            ),
            // pageSize: 10,
            width: '100%',
            columns:
                [
                    { text: '상태', datafield: 'active', width: '5%', cellsalign: 'center'},
                    { text: '이벤트ID', datafield: 'eventId', width: '8%' , cellsalign: 'center'},
                    { text: '그룹명', datafield: 'grpName', minwidth: '10%' , cellsalign: 'center'},
                    { text: '발생 일시', datafield: 'ymdhms', width: '12%' , cellsalign: 'center'},
                    { text: '지속 시간(초)', datafield: 'ctSec', width: '8%' , cellsalign: 'center'},
                    { text: '종료 일시', datafield: 'endDt', minwidth: '12%' , cellsalign: 'center'},
                    { text: '취약층', datafield: 'layer', width: '5%' , cellsalign: 'center'},
                    { text: '취약 요인(TOP3)', datafield: 'features', width: '40%', cellsalign: 'left'}
                ]
        });
        $realTimeGrid.on("bindingcomplete", function (e) {
            $realTimeGrid.on('pagechanged', function (event) {
                var args = event.args;
                pagenum = args.pagenum;
                console.log("현재 페이지 번호:" + pagenum);

                var grid = $realTimeGrid.jqxGrid('getInstance');
                var currentPageIndex  = grid.getpaginginformation().pagenum;
                console.log("currentPageIndex",currentPageIndex);

                var datainfo = $realTimeGrid.jqxGrid('getdatainformation');
                var paginginfo = datainfo.paginginformation;
                var pagernumber = $realTimeGrid.find('div.jqx-grid-pager-number-box');
                pagernumber.empty();
                var sPageNo = Math.floor(paginginfo.pagenum / 5) * 5,
                    ePageNo = Math.floor(Math.min(sPageNo + 5, paginginfo.pagescount));
                for (var i = sPageNo + 1; i <= ePageNo; i++) {
                    var no = $("<a></a>", {
                        text: i,
                        class: 'jqx-grid-pager-number jqx-grid-pager-number-' + jqxTheme,
                        tabindex: -1,
                        href: "javascript:;",
                        'data-page': i,
                        style: 'padding: 2px 6px; border-radius: 10px'
                    });
                    if (i == (paginginfo.pagenum + 1)) {
                        no.addClass('jqx-fill-state-pressed-ui-hamon');
                    }
                    no.appendTo(pagernumber);
                }

                var pagerno = pagernumber.find('a.jqx-grid-pager-number');
                $.each(pagerno, function (idx, item) {
                    if(item.className.indexOf('jqx-fill-state-pressed-ui-hamon') != -1){
                        console.log("클릭한 페이지" + idx);
                    }
                });

                if (pagerno) {
                    pagerno.off('click').on('click', function (event) {
                        var target = $(event.currentTarget);
                        var pageno = target.attr('data-page');
                        $realTimeGrid.jqxGrid('gotopage', pageno - 1);
                    }).off('mouseenter').on('mouseenter', function (event) {
                        var target = $(event.currentTarget);
                        target.addClass('jqx-fill-state-hover-ui-hamon');
                    }).off('mouseleave').on('mouseleave', function (event) {
                        var target = $(event.currentTarget);
                        target.removeClass('jqx-fill-state-hover-ui-hamon');
                    });
                }
            });
        });
    },
    initData: function(){
        pAbnlDtcRealTimeChart.initData();
        Main.searchGrid();
    },
    search: function(){
        $realTimeGrid.jqxGrid('clearfilters');
        category = $('input[name="sSrchType"]:checked').val();
        searchText = $('#sSrchType_input').val();
        if (searchText != '') {
            addfilter(category,searchText);
        }

        pAbnlDtcRealTimeChart.searchAll();
        Main.searchGrid();
    },
    searchGrid: function(){
        // Server_external.get("http://10.1.3.210:8089/event/period/"+ params.timeYesterday + "/" + params.timeToday, {
        Server_external.get("http://10.1.3.210:8089/event/period/20230614000000/20230615235959", {
            data: {
                // pageIndex: pagenum,
                // pageSize: $('#gGridDefault').val()
            }
            ,
            success: function (result) {
                var list =result.data.list;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].active == 'true') {
                        list[i].active = 'active';
                    } else {
                        list[i].active = 'inactive';
                    }
                    var split = list[i].features.split(',');
                    var ymdhms = list[i].ymdhms.toString();
                    var replace = ymdhms.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');

                    var temp = [];
                    for (var k = 0; k < 3; k++) {
                        temp[k] = split[k];
                    }
                    list[i].features = temp;
                    list[i].ymdhms = replace;
                }
                HmGrid.setLocalData($realTimeGrid, list);
            }
        });
    },
    exportExcel: function() {
        HmUtil.exportGrid($realTimeGrid, "실시간이상탐지", false);
    }
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

function addfilter(category,searchText) {
    var filtergroup = new $.jqx.filter();
    var filter_or_operator = 1;
    var filtervalue = searchText;
    var filtercondition = 'contains';
    var filter1 = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);

    filtergroup.addfilter(filter_or_operator, filter1);

    $realTimeGrid.jqxGrid('addfilter', category, filtergroup);
    $realTimeGrid.jqxGrid('applyfilters');
}