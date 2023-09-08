var $leftTab, $grpTree, $ifFlowGrpTree, $rawdataGrid , $ipGrpTree , $rawdataChart;
var selectedTime = ''; //차트에서 시간 하나를 선택한 상태이면 해당 값을 넣어준다
var cloneToolTip = null , chartUseTooltip;
var timeInterval =  360;
var _constChart;
var protoList , portList , serviceList, asList;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
        $leftTab = $('#leftTab'), $grpTree = $('#grpTree'), $ifFlowGrpTree = $('#ifFlowGrpTree'), $rawdataGrid = $('#rawdataGrid') , $ipGrpTree = $('#ipGrpTree') , $rawdataChart = $('#rawdataChart');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            if(Main.checkIPInput()) Main.search();
        }
    },

    checkIPInput: function(){
        //2023.03.18 IP정규식
        var ipChk = true;
        var ip_format = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
        if( $('#srcIp').val() != "" ){
            if( !ip_format.test( $('#srcIp').val() ) ){
                ipChk = false;
            }
        }
        if( $('#dstIp').val() != "" ){
            if( !ip_format.test( $('#dstIp').val() ) ){
                ipChk = false;
            }
        }
        if(!ipChk){ alert("IP를 형식에 맞게 입력해주세요."); return false; }

        return true;
    },

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': Main.searchChart(); Main.search(); break;
		case 'btnExcel': this.exportExcel(); break;
		}
	},

	/** init design */
	initDesign : function() {
        // HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '14%', collapsible: false }, { size: '86%' }], 'auto', '100%');
        HmJqxSplitter.create($('#hSpiltter'), HmJqxSplitter.ORIENTATION_H, [{ size: '40%', collapsible: false }, { size: '60%' }], 'auto', '100%',{showSplitBar: true});

		var today = new Date();
		today.setMinutes(Math.floor(today.getMinutes() / 5) * 5);
		$('#date2').jqxDateTimeInput({width: 130, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd HH:mm', culture: 'ko-KR'})
            .jqxDateTimeInput('setDate', today);

		// today.setMinutes(today.getMinutes() - 360 );
		today.setMinutes(today.getMinutes() - timeInterval );
        $('#date1').jqxDateTimeInput({width: 130, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd HH:mm', culture: 'ko-KR'})
            .jqxDateTimeInput('setDate', today);

        $('#date1').add($('#date2')).on('valueChanged', function(event) {
            var jsDate = event.args.date;
            var mod = jsDate.getMinutes() % 5;
            if(mod == 1) {
                jsDate.setTime(jsDate.getTime() + (4 * 60 * 1000));
                $(this).jqxDateTimeInput('setDate', jsDate);
            }
            else if(mod == 4) {
                jsDate.setTime(jsDate.getTime() - (4 * 60 * 1000));
                $(this).jqxDateTimeInput('setDate', jsDate);
            }
        });

        $('#date1 , #date2').on('change', function (event)
        {
            selectedTime = '';
        });

        HmDropDownList.create(
            $('#ddbProto'),
            {
                width: 103,
                source: HmResource.getResource('protocol_list2', false),
                selectedIndex: 1,
                checkboxes: true,
                autoDropDownHeight: true,
            });
        $("#ddbProto").jqxDropDownList('checkIndex', 0 );
        $("#ddbProto").jqxDropDownList('checkIndex', 1 );
        $("#ddbProto").jqxDropDownList('checkIndex', 2 );
        // HmDropDownList.create($('#ddbTcpflag'), { width: 300, source: HmResource.getResource('tcpflag_list'), checkboxes: true, autoDropDownHeight: true });

        // 좌측 탭영역
        $leftTab.jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxThemeV1,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmTreeGrid.create($grpTree, HmTree.T_GRP_TMS, Main.selectTree, {isRootSelect: 'true'});
                        break;
                    case 1:
                        HmTreeGrid.create($ifFlowGrpTree, HmTree.T_GRP_TMS_FLOW_IF, Main.selectTree, {isContainDev: 'true'});
                        break;
                    case 2:
                        // HmTreeGrid.create($ipGrpTree, HmTree.T_GRP_IP, Main.selectTree, null , ['grpName']);
                        HmTreeGrid.create($ipGrpTree, HmTree.T_GRP_IP2, Main.selectTree, null , ['grpName']);
                        break;
                }
            }
        });

        this.createChart();
        this.createGrid();
        $('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {
        // Main.searchChart();
        // 최초 진입 시 차트 조회된 데이터 없게 보이게 하고, 로딩바를 넣기위해서 함,,,
        _constChart = $rawdataChart.highcharts();
        var params = Main.getCommParams();
        params.date1 = "00000000000000";
        Server.get('/main/tms3/rawdataFSearch/getRawdataSearchChart.do', {
            data: params,
            success: function (result) {
                console.dir(result);
                if( result == null ){
                    if(_constChart.series[0].data.length > 0 ){
                        _constChart.series[0].remove();
                        _constChart.addSeries({ name: '합계', type: 'column', colorByPoint: true, data: [] });
                        _constChart.showNoData();
                        _constChart.hideLoading();
                    }else{
                        _constChart.hideLoading();
                        _constChart.reflow();
                    }
                }
            }
        });

        //JOIN데이터 조회
        Server.post('/main/tms3/trendAnalysis/getNtCfgPort.do', {
            data: {} ,
            success: function (result) {
                portList = result;
            }
        });
        Server.post('/main/tms3/trendAnalysis/getNtCfgProtocol.do', {
            data: {} ,
            success: function (result) {
                protoList = result;
            }
        });
        Server.post('/main/tms3/trendAnalysis/getNtCfgService.do', {
            data: {} ,
            success: function (result) {
                serviceList = result;
            }
        });
        Server.post('/main/tms3/trendAnalysis/getNtCfgAs.do', {
            data: {} ,
            success: function (result) {
                asList = result;
            }
        });

    },

    createChart : function(){
        HmHighchart.create('rawdataChart', {
            chart: {
                height: 320,
                events : {
                    click : function(event){
                        //차트 재검색 시 툴팁 사라지게 하기
                        const tempChart = $('#rawdataChart').highcharts();
                        if (cloneToolTip) {
                            tempChart.container.firstChild.removeChild(cloneToolTip);
                            cloneToolTip = false;
                        }
                    },
                    load : function(event){
                    },
                    redraw : function(event){
                    },
                    render : function(event){
                    }
                }
            },
            xAxis: {
                categories: [],
                labels: {
                    formatter: function () {
                        var label = this.value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5');
                        return label;
                    }
                }
            },
            yAxis:{
                min: 0,
                title: {
                    text: ''
                },
                opposite: false,
                crosshair: true,
                showLastLabel: true,
                labels: {
                    formatter() {
                        return this.value;
                    }
                }
            },
            legend: {
                floating: true,
                enabled: true,
                align: 'right',
                verticalAlign: 'top',
                layout: 'horizontal',
                itemDistance: 6,
                symbolPadding: 3,
                padding: 6,
                margin: 5,
                itemStyle: {
                    fontSize: '10px'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.key.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5') + '</b><br/>' +
                           '<b>'+ this.series.name + ' : ' +this.point.y+'</b><br/>';
                }
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                chartUseTooltip = $('#rawdataChart').highcharts();

                                if (cloneToolTip) {
                                    chartUseTooltip.container.firstChild.removeChild(cloneToolTip);
                                }
                                cloneToolTip = this.series.chart.tooltip.label.element.cloneNode(true);
                                chartUseTooltip.container.firstChild.appendChild(cloneToolTip);

                                selectedTime = this.category;
                                Main.search();
                            }
                        }
                    }
                }
            },
            series: [{
                name : '합계',
                type: 'column',
                colorByPoint: true, // 막대색상다항성
                data: [],
            }],
            lang: {
                noData: '표시할 데이터가 없습니다',
                loading : '<span><img src="/lib/jqwidgets/styles/images/loader.gif">  로딩중...</span>',
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#303030',
                    fontFamily : '맑은 고딕,Arial,맑은 고딕'
                }
            },
            loading :{
                hideDuration: 2000,
                labelStyle : {fontWeight: "bold", fontSize : "16px", color: "#303030" , fontFamily : "맑은 고딕,Arial,맑은 고딕"},
            }
        },  CtxMenu.COMM, 111);

    },
	/** 그리드 생성 */
	createGrid: function() {
        var source = {
            datatype: 'json',
            root: 'resultData',
            datafields: [
                { name: 'stamp_inserted_date', type: 'string' },
                { name: 'dev_ip', type: 'string' },
                { name: 'iif', type: 'number' },
                { name: 'oif', type: 'number' },
                { name: 'sip', type: 'string' },
                { name: 'dis_sip', type: 'string' },
                { name: 'smk', type: 'number' },
                { name: 'dis_spt', type: 'string' },
                { name: 'dip', type: 'string' },
                { name: 'dis_dip', type: 'string' },
                { name: 'dmk', type: 'number' },
                { name: 'dis_dpt', type: 'string' },
                { name: 'protocol_nm', type: 'string' },
                { name: 'tcp_flags', type: 'number' },
                { name: 'bytes', type: 'number' },
                { name: 'pkts', type: 'number' },
                { name: 'pkts_size', type: 'number' },
                { name: 'sas', type: 'number' },
                { name: 'das', type: 'number' },
                { name: 'sas_name', type: 'string' },
                { name: 'das_name', type: 'string' },
            ],
            beforeprocessing: function(data) {
                if(data != null) {
                    source.totalrecords = (data.resultData != null && data.resultData.length)? data.resultData[0].total_cnt : 0;
                } else {
                    source.totalrecords = 0;
                }
            },
            sort: function() {
                $rawdataGrid.jqxGrid('updatebounddata', 'sort');
            },
            filter: function() {
                $rawdataGrid.jqxGrid('updatebounddata', 'filter');
            }
        };
        var adapter = new $.jqx.dataAdapter(
            source,
            {
                formatData: function(data) {
                    $.extend(data, Main.getCommParams());
                    return data;
                }
            }
        );

        $('#chkBoundaryIn, #chkBoundaryOut').jqxCheckBox({ width: 40, height: 21 , checked: true });

        HmGrid.create($rawdataGrid, {
            source: adapter,
            virtualmode: true,
            height: '100%',
            rendergridrows: function(params) {
                return adapter.records;
            },
            selectionmode: 'multiplerowsextended',
            // pagesize : 10000,
            columns: [
                { text: 'In IfIndex', datafield: 'iif', width: 90, cellsalign: 'right', hidden: true },
                { text: 'Out IfIndex', datafield: 'oif', width: 90, cellsalign: 'right', hidden: true },

                { text: 'Router IP', datafield: 'dev_ip', width: 130 },
                { text: '출발지IP', datafield: 'sip', displayfield: 'dis_sip', width: 130 ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var rData = $rawdataGrid.jqxGrid('getrowdata', row);
                        var siptStr = value;
                        if(value != ""){
                            $.each(serviceList, function (idx, item) {
                                if(item.protocol == 0 ){
                                    if(item.fromIp == value ){
                                        siptStr = value + " (" + item.grpName +")";
                                    }
                                }else{
                                    if(item.protocol == rData.protocol_nm && item.fromIp == value ){
                                        siptStr = value + " (" + item.grpName +")";
                                    }
                                }
                            });
                        }
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-left-align">' + siptStr +'</div>';
                    }
                },
                { text: '출발지Mask', datafield: 'smk', width: 80, cellsalign: 'right', filtertype: 'number' },
                { text: '출발지Port', datafield: 'dis_spt', width: 80, cellsalign: 'right', filtertype: 'number' ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var rData = $rawdataGrid.jqxGrid('getrowdata', row);
                        var sptStr = value;
                        if(value != ""){
                            $.each(portList, function (idx, item) {
                                if(item.protocol == rData.protocol_nm && item.port == value ){
                                    sptStr = value + " (" + item.name +")";
                                }
                            });
                        }
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + sptStr +'</div>';
                    }
                },
                { text: '출발지As', datafield: 'sas', width: 80, cellsalign: 'right' ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var sAsStr = value;
                        if(value != ""){
                            $.each(asList, function (idx, item) {
                                if(item.as_no == value ){
                                    sAsStr = value + " (" + item.name_short +")";
                                }
                            });
                        }
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + sAsStr +'</div>';
                    }},
                { text: '출발지As', datafield: 'sas_name', width: 120, cellsalign: 'right' , hidden: true},
                { text: '목적지IP', datafield: 'dip', displayfield: 'dis_dip', width: 130 ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var rData = $rawdataGrid.jqxGrid('getrowdata', row);
                        var diptStr = value;
                        if(value != ""){
                            $.each(serviceList, function (idx, item) {
                                if(item.protocol == 0 ){
                                    if(item.toIp == value ){
                                        diptStr = value + " (" + item.grpName +")";
                                    }
                                }else{
                                    if(item.protocol == rData.protocol_nm && item.toIp == value ){
                                        diptStr = value + " (" + item.grpName +")";
                                    }
                                }
                            });
                        }
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-left-align">' + diptStr +'</div>';
                    }
                },
                { text: '목적지Mask', datafield: 'dmk', width: 80, cellsalign: 'right', filtertype: 'number' },
                { text: '목적지Port', datafield: 'dis_dpt', width: 80, cellsalign: 'right', filtertype: 'number' ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var rData = $rawdataGrid.jqxGrid('getrowdata', row);
                        var dptStr = value;
                        if(value != ""){
                            $.each(portList, function (idx, item) {
                                if(item.protocol == rData.protocol_nm && item.port == value ){
                                    dptStr = value + " (" + item.name +")";
                                }
                            });
                        }
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + dptStr +'</div>';
                    }
                },
                { text: '목적지As', datafield: 'das', width: 80, cellsalign: 'right' ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var dAsStr = value;
                        if(value != ""){
                            $.each(asList, function (idx, item) {
                                if(item.as_no == value ){
                                    dAsStr = value + " (" + item.name_short +")";
                                }
                            });
                        }
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + dAsStr +'</div>';
                    }
                },
                { text: '목적지As', datafield: 'das_name', width: 120, cellsalign: 'right' , hidden : true },
                { text: 'Protocol', datafield: 'protocol_nm', width: 80 ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var protocolStr = "";
                        $.each(protoList, function (idx, item) {
                            if(item.protocol == value){
                                protocolStr = value + " (" + item.protoName +")";
                            }
                        });
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + protocolStr +'</div>';
                    }
                },
                { text: 'TCP Flags', datafield: 'tcp_flags', width: 120, cellsrenderer: HmGrid.tcpFlagrenderer, hidden:true },
                { text: 'Bytes', datafield: 'bytes', width: 80, cellsrenderer: HmGrid.unit1024rendererUseTms, filtertype: 'number' },
                { text: 'Packets', datafield: 'pkts', width: 80, cellsrenderer: HmGrid.unit1000rendererUseTms, filtertype: 'number' },
                { text: 'Packet Size', datafield: 'pkts_size', width: 80, cellsalign: 'right', filtertype: 'number' }
            ]
        },CtxMenu.COMM, 0);
	},
	
	/** 그룹트리 선택시 */
	selectTree: function() {
		// Main.searchChart();
	},

	getCommParams: function() {
		var params = {
            date: selectedTime,
            date1: $.format.date($('#date1').val('date'), 'yyyyMMddHHmmss'),
            date2: $.format.date($('#date2').val('date'), 'yyyyMMddHHmmss'),
            date1Str: HmDate.getDateStr($('#date1')),
            date2Str: HmDate.getDateStr($('#date2')),
            srcIp: $('#srcIp').val(),
            srcMask: $('#srcMask').val(),
            dstIp: $('#dstIp').val(),
            dstMask: $('#dstMask').val(),
            srcPort: $('#srcPort').val(),
            dstPort: $("#dstPort").val(),
            proto: $('#ddbProto').val(),
            // tcpFlags: _tcpFlags,
            isBoundaryIn: $('#chkBoundaryIn').val()? 1 : 0,
            isBoundaryOut: $('#chkBoundaryOut').val()? 1 : 0,
            timeInterval : timeInterval
		};
        var _grpNo = 0, _mngNo = 0, _ifIdx = 0, _grpType = 'DEFAULT', _itemKind,_subNo;
        switch($leftTab.val()) {
            case 0:
                _grpType = 'DEFAULT';
                var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                if(treeItem != null) {
                    _itemKind = treeItem.devKind2;
                    if(_itemKind == 'GROUP') {
                        _grpNo = treeItem.grpNo;
                    }
                    else if(_itemKind == 'IF') {
                        _grpNo = treeItem.grpNo.split('_')[0];
                        _mngNo = treeItem.grpNo.split('_')[1];
                        _ifIdx = treeItem.grpNo.split('_')[2];
                    }
                    else {
                        _grpNo = treeItem.grpNo.split('_')[0];
                        _mngNo = treeItem.grpNo.split('_')[1];
                    }
                }
                $.extend(params, {
                    grpNo: _grpNo,
                    itemKind: _itemKind,
                    grpType: _grpType,
                    mngNo: _mngNo,
                    ifIdx: _ifIdx
                });
                break;
            case 1:
                _grpType = 'IF_FLOW';
                var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpTree);
                if(treeItem != null) {
                    _itemKind = treeItem.devKind2;
                    if(_itemKind == 'GROUP') {
                        _grpNo = treeItem.grpNo;
                    }
                    else if(_itemKind == 'IF') {
                        _grpNo = treeItem.grpNo.split('_')[0];
                        _mngNo = treeItem.grpNo.split('_')[1];
                        _ifIdx = treeItem.grpNo.split('_')[2];
                    }
                    else {
                        _grpNo = treeItem.grpNo.split('_')[0];
                        _mngNo = treeItem.grpNo.split('_')[1];
                    }
                }
                $.extend(params, {
                    grpNo: _grpNo,
                    itemKind: _itemKind,
                    grpType: _grpType,
                    mngNo: _mngNo,
                    ifIdx: _ifIdx
                });
                break;
            case 2:
                _grpType = 'IP_GROUP';
                var treeItem = HmTreeGrid.getSelectedItem($ipGrpTree);
                if(treeItem != null) {
                    _itemKind = treeItem.devKind2;
                    if(_itemKind == 'GROUP') {
                        _grpNo = treeItem.grpNo;
                    }
                    else if(_itemKind == 'IP') {
                        _grpNo = treeItem.grpNo.split('_')[0];
                        _subNo = treeItem.grpNo.split('_')[1];
                    }
                    else {
                        _grpNo = treeItem.grpNo.split('_')[0];
                        _subNo = treeItem.grpNo.split('_')[1];
                    }
                }
                $.extend(params, {
                    itemKind: _itemKind,
                    grpType: _grpType,
                    grpNo: _grpNo,
                    subNo : _subNo,
                });
                break;
        }

        return params;
	},
	
	/** 조회 */
	search : function() {
        if(selectedTime != ''){
            console.log("selectedTime");
            HmGrid.updateBoundData($rawdataGrid, ctxPath + '/main/tms3/rawdataFSearch/getRawdataAnalysisList.do');
        }
	},
	searchChart : function() {


        if(!HmDate.validation($('#date1'), $('#date2'))) return;
        var timeGap = ($('#date2').val('date').getTime() - $('#date1').val('date').getTime()) / 1000;

        if(timeGap > ( timeInterval * 60)) {
            alert('시간 간격은 '+(timeInterval/60)+'시간 간격만 가능합니다.');
            return false;
        }

        var _chart = $rawdataChart.highcharts();
        $rawdataGrid.jqxGrid('clear');
        _chart.hideNoData();
        _chart.showLoading();

        // var _chart = $('#rawdataChart').highcharts();
        // $rawdataGrid.jqxGrid('clear');
        // _chart.hideNoData();
        // _chart.showLoading();

        Server.get('/main/tms3/rawdataFSearch/getRawdataSearchChart.do', {
            data: Main.getCommParams(),
            success: function (result) {
                if(result.resultList.length > 0 ){
                    var categories = [], userdata = [];
                    result.resultList.forEach(function(item) {
                        categories.push(item[0]);
                    });
                    _chart.xAxis[0].setCategories(categories, false);
                    _chart.series[0].remove(false);
                    _chart.addSeries({ name: '합계', type: 'column', colorByPoint: true, data: result.resultList });
                    _chart.hideLoading();
                    _chart.reflow();
                }else{
                    if(_chart.series[0].data.length > 0 ){
                        _chart.series[0].remove();
                        _chart.addSeries({ name: '합계', type: 'column', colorByPoint: true, data: [] });
                        _chart.hideLoading();
                        _chart.showNoData();
                    }else{
                        _chart.hideLoading();
                        _chart.showNoData();
                        _chart.reflow();
                    }
                }
            }
        });
	},

    /** export Excel */
    exportExcel: function() {
        if(selectedTime != ''){
            var params = Main.getCommParams();
            Main.saveHighchart($rawdataChart.highcharts(), Main.exportExcel_after,params);
        }else{
            alert("선택된 시간이 없습니다.");
        }
    },

    exportExcel_after: function(params) {
        console.dir(params);
        HmUtil.exportExcel(ctxPath + '/main/tms3/rawdataFSearch/export.do', params);
    },

    saveHighchart: function (chart, afterFunc, params) {
        var fname = $.format.date(new Date(), 'yyyyMMddHHmmssSSS') + '.png';
        // chart export size를 조정하여 svg 추출
        var svg = chart.getSVG({
            exporting: {
                sourceWidth: chart.chartWidth,
                sourceHeight: chart.chartHeight
            }
        });
        var canvas = document.createElement('canvas');
        canvg(canvas, svg); //svg -> canvas draw
        var imgData = canvas.toDataURL("image/png"); // png이미지로 변환
        var ch_params = {fname: fname, imgData: imgData};
        Server.post('/file/saveHighchart.do', {
            data: ch_params,
            success: function (result) {
                if (afterFunc != null) {//이미지 저장 후 바로 엑셀 출력시
                    params.imgFile = fname;
                    afterFunc(params);
                }
            }
        });

        return fname;
    },

};


