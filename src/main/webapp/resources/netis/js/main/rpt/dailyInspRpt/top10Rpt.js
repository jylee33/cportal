var Top10 = {

    $memGrid: null,
    $cpuGrid: null,
    $trafficGrid: null,

    /** variable */
    initialize: function () {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    initVariable: function () {

        this.$memGrid = $("#memGrid");
        this.$cpuGrid = $("#cpuGrid");
        this.$trafficGrid = $("#trafficGrid");

    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Top10.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearchTop':
                this.search();
                break;

            case 'btnExcelTop':
                this.exportExcel();
                break;
        }
    },


    /** init design */
    initDesign: function () {


        HmJqxSplitter.create($('#mainSplitterTop'), HmJqxSplitter.ORIENTATION_H, [{
            size: '66.7%',
            collapsible: false
        }, {size: '33.3.%'}], 'auto', '100%');

        HmJqxSplitter.create($('#splitterTop'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], 'auto', '100%');

        $('#ckAll').jqxCheckBox()
            .on('change', function (event) {
                var ischecked = event.args.checked;
                try {
                    $('#ckmem, #ckcpu, #cktraffic').jqxCheckBox({checked: ischecked});
                } catch (e) {
                }
            });

        /** 메모리 그리드 */
        HmGrid.create(Top10.$memGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [ // 필터위해 추가
                        {name: 'num', type: 'number'},
                        {name: 'grpName', type: 'string'},
                        {name: 'mngNo', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'latest', type: 'number'},
                        {name: 'bf05', type: 'number'},
                        {name: 'bf10', type: 'number'},
                        {name: 'bf15', type: 'number'},
                        {name: 'bf20', type: 'number'},
                        {name: 'bf25', type: 'number'},
                        {name: 'bf30', type: 'number'},
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, {type: "MEM", itemType: 2})
                        return JSON.stringify(data);
                    },
                    loadComplete: function (records) {
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                Top10.topNToolbarRenderer(toolbar, 'Mem TOP10', 'mem', true);
            },
            columns:
                [
                    {text: '번호', columngroup: 'devInfo', datafield: 'num', width: 200},
                    {text: '그룹', columngroup: 'devInfo', datafield: 'grpName', width: 200},
                    {text: '장비번호', columngroup: 'devInfo', datafield: 'mngNo', width: 150, hidden: true},
                    {
                        text: '장비명',
                        columngroup: 'devInfo',
                        datafield: 'devName',
                        width: 230,
                        cellsrenderer: HmGrid.devNameRenderer
                    },
                    {text: 'IP', columngroup: 'devInfo', datafield: 'devIp', width: 150},
                    {
                        text: '현재',
                        columngroup: 'mem',
                        datafield: 'latest',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '5분전',
                        columngroup: 'mem',
                        datafield: 'bf05',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '10분전',
                        columngroup: 'mem',
                        datafield: 'bf10',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '15분전',
                        columngroup: 'mem',
                        datafield: 'bf15',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '20분전',
                        columngroup: 'mem',
                        datafield: 'bf20',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '25분전',
                        columngroup: 'mem',
                        datafield: 'bf25',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '30분전',
                        columngroup: 'mem',
                        datafield: 'bf30',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                ],
            columngroups:
                [
                    {text: '장비정보', align: 'center', name: 'devInfo'},
                    {text: 'MEMORY(%)', align: 'center', name: 'mem'},
                ]
        }, CtxMenu.DEV);


        /** CPU 그리드 */
        HmGrid.create(Top10.$cpuGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [ // 필터위해 추가
                        {name: 'num', type: 'number'},
                        {name: 'grpName', type: 'string'},
                        {name: 'mngNo', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'latest', type: 'number'},
                        {name: 'bf05', type: 'number'},
                        {name: 'bf10', type: 'number'},
                        {name: 'bf15', type: 'number'},
                        {name: 'bf20', type: 'number'},
                        {name: 'bf25', type: 'number'},
                        {name: 'bf30', type: 'number'},
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, {type: "CPU", itemType: 1})
                        return JSON.stringify(data);
                    },
                    loadComplete: function (records) {
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                Top10.topNToolbarRenderer(toolbar, 'Cpu TOP10', 'cpu', true);
            },

            columns:
                [

                    {text: '번호', columngroup: 'devInfo', datafield: 'num', width: 200},
                    {text: '그룹', columngroup: 'devInfo', datafield: 'grpName', width: 200},
                    {text: '장비번호', columngroup: 'devInfo', datafield: 'mngNo', width: 150, hidden: true},
                    {
                        text: '장비명',
                        columngroup: 'devInfo',
                        datafield: 'devName',
                        width: 230,
                        cellsrenderer: HmGrid.devNameRenderer
                    },
                    {text: 'IP', columngroup: 'devInfo', datafield: 'devIp', width: 150},
                    {
                        text: '현재',
                        columngroup: 'cpu',
                        datafield: 'latest',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '5분전',
                        columngroup: 'cpu',
                        datafield: 'bf05',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '10분전',
                        columngroup: 'cpu',
                        datafield: 'bf10',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '15분전',
                        columngroup: 'cpu',
                        datafield: 'bf15',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '20분전',
                        columngroup: 'cpu',
                        datafield: 'bf20',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '25분전',
                        columngroup: 'cpu',
                        datafield: 'bf25',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '30분전',
                        columngroup: 'cpu',
                        datafield: 'bf30',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                ],
            columngroups:
                [
                    {text: '장비정보', align: 'center', name: 'devInfo'},
                    {text: 'CPU(%)', align: 'center', name: 'cpu'},
                    // { text: 'MEMORY', align: 'center', name: 'mem' },
                    // { text: '온도(℃)', align: 'center', name: 'temp' },
                ]
        }, CtxMenu.DEV);


        /** 메모리 그리드 */
        HmGrid.create(Top10.$trafficGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [ // 필터위해 추가
                        {name: 'num', type: 'number'},
                        {name: 'grpName', type: 'string'},
                        {name: 'mngNo', type: 'number'},
                        {name: 'ifIdx', type: 'number'},
                        {name: 'devName', type: 'string'},
                        {name: 'ifName', type: 'string'},
                        {name: 'latest', type: 'number'},
                        {name: 'bf05', type: 'number'},
                        {name: 'bf10', type: 'number'},
                        {name: 'bf15', type: 'number'},
                        {name: 'bf20', type: 'number'},
                        {name: 'bf25', type: 'number'},
                        {name: 'bf30', type: 'number'}
                    ]
                },
                {
                    formatData: function (data) {
                        return JSON.stringify(data);
                    },
                    loadComplete: function (records) {
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                Top10.topNToolbarRenderer(toolbar, 'Traffic TOP10', 'traffic', true);
            },
            columns:
                [
                    {text: '번호', columngroup: 'devInfo', datafield: 'num', width: 200},
                    {text: '그룹', columngroup: 'devInfo', datafield: 'grpName', width: 200},
                    {text: '장비번호', columngroup: 'devInfo', datafield: 'mngNo', width: 150, hidden: true},
                    {text: '회선번호', columngroup: 'devInfo', datafield: 'ifIdx', width: 150, hidden: true},
                    {
                        text: '장비명',
                        columngroup: 'devInfo',
                        datafield: 'devName',
                        width: 230,
                        cellsrenderer: HmGrid.devNameRenderer, hidden: false
                    },
                    {
                        text: 'Interface',
                        columngroup: 'devInfo',
                        datafield: 'ifName',
                        width: 230,
                        cellsrenderer: HmGrid.devNameRenderer
                    },
                    {text: 'IP', columngroup: 'devInfo', datafield: 'devIp', width: 150, hidden: true},
                    {
                        text: '현재',
                        columngroup: 'traffic',
                        datafield: 'latest',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '5분전',
                        columngroup: 'traffic',
                        datafield: 'bf05',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '10분전',
                        columngroup: 'traffic',
                        datafield: 'bf10',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '15분전',
                        columngroup: 'traffic',
                        datafield: 'bf15',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '20분전',
                        columngroup: 'traffic',
                        datafield: 'bf20',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '25분전',
                        columngroup: 'traffic',
                        datafield: 'bf25',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '30분전',
                        columngroup: 'traffic',
                        datafield: 'bf30',
                        width: 160,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                ],
            columngroups:
                [
                    {text: '장비정보', align: 'center', name: 'devInfo'},
                    {text: 'TRAFFIC(%)', align: 'center', name: 'traffic'},
                ]
        }, CtxMenu.DEV);

    },

    /** init data */
    initData: function () {

    },


    topNToolbarRenderer: function (toolbar, title, type, isChecked) {
        if (isChecked == null) isChecked = false;
        var container = $('<div style="margin: 5px"></div>');
        var span = $('<span style="float: left; font-weight: bold; margin-top: 2px; margin-right: 4px;">' + title + '</span>');
        toolbar.css('background', '#d0d8de');
        toolbar.empty();
        toolbar.append(container);
        container.append(span);
        // 우측 체크박스
        var ckbox = $('<div id="ck' + type + '" style="float: right; margin-right: 2px"></div>');
        ckbox.jqxCheckBox({checked: isChecked});
        container.append(ckbox);
    },


    /** TOP 10 조회 */
    search: function () {

        HmGrid.updateBoundData(Top10.$memGrid, ctxPath + '/main/rpt/dailyInspRpt/getDevPerfInterval.do');
        HmGrid.updateBoundData(Top10.$cpuGrid, ctxPath + '/main/rpt/dailyInspRpt/getDevPerfInterval.do');
        HmGrid.updateBoundData(Top10.$trafficGrid, ctxPath + '/main/rpt/dailyInspRpt/getIfPerfInterval.do');
    },

    exportExcel: function () {

        var value1 = $("#ckmem").jqxCheckBox('val');
        var value2 = $("#ckcpu").jqxCheckBox('val');
        var value3 = $("#cktraffic").jqxCheckBox('val');

        var gridInfos = [
            {chkId: 'mem', gridId: 'memGrid', title: 'TOP10 MEM(%)'},
            {chkId: 'cpu', gridId: 'cpuGrid', title: 'TOP10 CPU(%)'},
            {chkId: 'traffic', gridId: 'trafficGrid', title: 'TOP10 TRAFFIC(%)'}
        ];

        var _gridArr = [], _gridTitleArr = [];


        for (var i = 0; i < gridInfos.length; i++) {
            var checked = $('#ck' + gridInfos[i].chkId).val();

            console.log(checked);

            if (checked) {
                _gridArr.push($('#' + gridInfos[i].gridId));
                _gridTitleArr.push(gridInfos[i].title);
            }
        }

        console.log(_gridTitleArr);
        HmUtil.exportGridList(_gridArr, _gridTitleArr, '장비 성능 TOP 10 ', false);

    }


};