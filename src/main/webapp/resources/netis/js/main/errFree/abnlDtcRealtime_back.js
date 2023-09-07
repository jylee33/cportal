var $realTimeGrid, params, timer, category, searchText, self;
var pagenum = 0;
var searchCategory = [
    {label: '그룹명', value: 'grpName'}
    // , {label: '상태', value: 'active'}
    // , {label: '이벤트ID', value: 'eventId'}
    // , {label: '취약층', value: 'layer'}
];
var Main = {
    initVariable : function() {
        self = $realTimeGrid;
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
        /*HmGrid.create($realTimeGrid, {
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
            autoHeight: true,
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
        });*/

        Server_external.get("http://10.1.3.210:8089/event/period/"+ params.timeYesterday + "/" + params.timeToday, {
            data: {
                pageIndex: pagenum,
                pageSize: $('#gGridDefault').val()
            },
            success: function (result) {
                var data = result.data;
                var total = data.total;

                var pagerOptions = {
                    pageSize: 3, // Number of items per page
                    pagerMode: 'advanced', // Set to 'simple' for basic paging
                    buttonsCount: 5 // Number of visible pager buttons
                };

                var self = this;
                var customDataAdapter = new $.jqx.dataAdapter([]);

                $realTimeGrid.jqxGrid({
                    source: customDataAdapter,
                    width: '100%',
                    pageable: true,
                    pagerMode: pagerOptions.pagerMode,
                    pagesize: pagerOptions.pageSize,
                    pagerButtonsCount: pagerOptions.buttonsCount,
                    pagerRenderer: function () {
                        var element = $("<div style='margin-left: 10px; margin-top: 5px; width: 100%; height: 100%;'></div>");
                        var datainfo = $realTimeGrid.jqxGrid('getdatainformation');
                        datainfo.rowscount = total;
                        var paginginfo = datainfo.paginginformation;
                        paginginfo.pagescount = Math.round(datainfo.rowscount/pagerOptions.pageSize);

                        var firstButton = $("<div style='padding: 0px; float: left;'><div style='width: 20px; height: 20px;'></div></div>");
                        firstButton.find('div').addClass('jqx-icon-arrow-first');
                        firstButton.width(20);
                        firstButton.jqxButton({
                            theme: 'themes'
                        });
                        var leftButton = $("<div style='padding: 0px; margin: 0px 3px; float: left;'><div style=' width: 20px; height: 20px;margin-left:-1px;'></div></div>");
                        leftButton.find('div').addClass('jqx-icon-arrow-left');
                        leftButton.width(20);
                        leftButton.jqxButton({
                            theme: 'themes'
                        });
                        var rightButton = $("<div style='padding: 0px; margin: 0px 3px; float: left;'><div style=' width: 20px; height: 20px;margin-left:-1px;'></div></div>");
                        rightButton.find('div').addClass('jqx-icon-arrow-right');
                        rightButton.width(20);
                        rightButton.jqxButton({
                            theme: 'themes'
                        });
                        var lastButton = $("<div style='padding: 0px; float: left;'><div style='width: 20px; height: 20px;'></div></div>");
                        lastButton.find('div').addClass('jqx-icon-arrow-last');
                        lastButton.width(20);
                        lastButton.jqxButton({
                            theme: 'themes'
                        });
                        firstButton.appendTo(element);
                        leftButton.appendTo(element);

                        // Add page number buttons
                        var pageNumberContainer = $("<div class='jqx-grid-pager-number-box' style='margin-top: -1px; float: left'></div>");
                        for (var i = 0; i < paginginfo.pagescount; i++) {
                            var pageNumberButton = $("<a style='padding: 2px 6px; border-radius: 10px'></a>");
                            pageNumberButton.text(i + 1);
                            pageNumberButton.addClass('jqx-grid-pager-number-box');
                            pageNumberButton.width(30);
                            pageNumberButton.jqxButton({
                                theme: 'themes'
                            });
                            pageNumberButton.appendTo(pageNumberContainer);

                            var label = $("<div style='margin-left: 20px; margin-top: -1px; font-weight: normal; float: left;'></div>");
                            label.text("1-" + paginginfo.pagesize + ' of ' + datainfo.rowscount);

                            self.label = label;
                            var handleStates = function (event, button, className, add) {
                                button.on(event, function () {
                                    if (add == true) {
                                        button.find('div').addClass(className);
                                    } else button.find('div').removeClass(className);
                                });
                            };

                            pageNumberButton.on('click', function() {
                                var pageNumber = $(this).text();
                                console.log('Page number ' + pageNumber + ' clicked');
                                console.log("paginginfo",paginginfo);
                                //if (마지막 페이지번호이면 datainfo.rowscount)
                                label.text((paginginfo.pagesize+(1+pageNumber)) + "-" + (paginginfo.pagesize*pageNumber) + ' of ' + datainfo.rowscount);

                                var otherElements = $('.jqx-fill-state-pressed-ui-hamon').not($(this));

                                $(this).addClass('jqx-fill-state-pressed-ui-hamon');
                                otherElements.removeClass('jqx-fill-state-pressed-ui-hamon');
                            });

                            handleStates('mouseenter', pageNumberButton, 'jqx-grid-pager-number-hover', true);
                            handleStates('mouseleave', pageNumberButton, 'jqx-grid-pager-number-hover', false);
                            handleStates('mousedown', pageNumberButton, 'jqx-grid-pager-number-active', true);
                            handleStates('mouseup', pageNumberButton, 'jqx-grid-pager-number-active', false);
                        }
                        pageNumberContainer.appendTo(element);
                        rightButton.appendTo(element);
                        lastButton.appendTo(element);
                        label.appendTo(element);

                        firstButton.click(function () {
                            $realTimeGrid.jqxGrid('gotopage',0);
                        });
                        rightButton.click(function () {
                            $realTimeGrid.jqxGrid('gotonextpage');
                        });
                        leftButton.click(function () {
                            $realTimeGrid.jqxGrid('gotoprevpage');
                        });
                        lastButton.click(function () {
                            $realTimeGrid.jqxGrid('gotopage',datainfo.rowscount-1);
                        });

                        return element;
                    }
                });
            }
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
        Server_external.get("http://10.1.3.210:8089/event/period/"+ params.timeYesterday + "/" + params.timeToday, {
                    data: {
                        pageIndex: pagenum,
                        pageSize: $('#gGridDefault').val()
                    },
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
    SelectPage: function() {

        var paginginformation = $realTimeGrid.jqxGrid('getpaginginformation');
        var selectedrowindexes = $realTimeGrid.jqxGrid('selectedrowindexes').slice();
        var getdisplayrows = $realTimeGrid.jqxGrid('getdisplayrows');


        /* get only the rowdata */
        var arrRows = [];
        for (var i = 0; i < getdisplayrows.length; i++) {
            if (getdisplayrows[i].boundindex != undefined) {
                arrRows.push(getdisplayrows[i]);
            }
        }

        /* now we select items on page */
        var rowsindex = 0;
        var b = true;//이게뭐지??

        for (var k = 0; k < paginginformation.pagescount; k++) {
            if (k == paginginformation.pagenum) {
                for (var o = rowsindex; o < (rowsindex + paginginformation.pagesize); o++) {
                    if (o < arrRows.length) {
                        if (b) {
                            if ($.inArray($realTimeGrid.jqxGrid('getrowboundindexbyid', arrRows[o].uid), selectedrowindexes) < 0) {
                                $realTimeGrid.jqxGrid('selectrow', $realTimeGrid.jqxGrid('getrowboundindexbyid', arrRows[o].uid));
                            }
                        } else {
                            $realTimeGrid.jqxGrid('unselectrow', $realTimeGrid.jqxGrid('getrowboundindexbyid', arrRows[o].uid));
                        }
                    }
                }
            }
            rowsindex = rowsindex + paginginformation.pagesize;
        }
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

function pagerrenderer() {
    console.log("pagerrenderer");
    var element = $("<div style='margin-left: 10px; margin-top: 11px; width: 100%; height: 100%;'></div>");
    var datainfo = $realTimeGrid.jqxGrid('getdatainformation');
    var paginginfo = datainfo.paginginformation;
    var leftButton = $("<div style='padding: 0px; float: left;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
    leftButton.find('div').addClass('jqx-icon-arrow-left');
    leftButton.width(36);
    // leftButton.jqxButton({ theme: theme });
    var rightButton = $("<div style='padding: 0px; margin: 0px 3px; float: left;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
    rightButton.find('div').addClass('jqx-icon-arrow-right');
    rightButton.width(36);
    // rightButton.jqxButton({ theme: theme });
    leftButton.appendTo(element);
    rightButton.appendTo(element);
    var label = $("<div style='font-size: 11px; margin: 2px 3px; margin-top:-5px; font-weight: bold; float: left;'></div>");
    label.text("1-" + paginginfo.pagesize + ' of ' + datainfo.rowscount);
    label.appendTo(element);
    self.label = label;

    // update buttons states.
    var handleStates = function (event, button, className, add) {
        button.on(event, function () {
            if (add == true) {
                button.find('div').addClass(className);
            }
            else button.find('div').removeClass(className);
        });
    };
    if (theme != '') {
        handleStates('mousedown', rightButton, 'jqx-icon-arrow-right-selected-' + theme, true);
        handleStates('mouseup', rightButton, 'jqx-icon-arrow-right-selected-' + theme, false);
        handleStates('mousedown', leftButton, 'jqx-icon-arrow-left-selected-' + theme, true);
        handleStates('mouseup', leftButton, 'jqx-icon-arrow-left-selected-' + theme, false);
        handleStates('mouseenter', rightButton, 'jqx-icon-arrow-right-hover-' + theme, true);
        handleStates('mouseleave', rightButton, 'jqx-icon-arrow-right-hover-' + theme, false);
        handleStates('mouseenter', leftButton, 'jqx-icon-arrow-left-hover-' + theme, true);
        handleStates('mouseleave', leftButton, 'jqx-icon-arrow-left-hover-' + theme, false);
    }
    rightButton.click(function () {
        $realTimeGrid.jqxGrid('gotonextpage');
    });
    leftButton.click(function () {
        $realTimeGrid.jqxGrid('gotoprevpage');
    });
    return element;
}

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