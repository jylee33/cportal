var $leftTab, $grpTree, $ifFlowGrpTree, $rawdataGrid , $ipGrpTree , $rawdataChart;
var selectedTime = '';
var cloneToolTip = null , chartUseTooltip;
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
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
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
		case 'btnSearch': if(Main.checkIPInput()) Main.searchChart(); break;
		case 'btnExcel': this.exportExcel(); break;
		}
	},

	/** init design */
	initDesign : function() {
        // HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '14%', collapsible: false }, { size: '86%' }], 'auto', '100%');
        HmJqxSplitter.create($('#hSpiltter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%',{showSplitBar: true});

		var today = new Date();
		today.setMinutes(Math.floor(today.getMinutes() / 5) * 5);
		$('#date2').jqxDateTimeInput({width: 130, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd HH:mm', culture: 'ko-KR'})
            .jqxDateTimeInput('setDate', today);

		today.setMinutes(today.getMinutes() - 5 );
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

        HmDropDownList.create(
            $('#ddbProto'),
            {
                width: 103,
                source: HmResource.getResource('protocol_list2', false),
                selectedIndex: 1,
                checkboxes: true,
                autoDropDownHeight: true,
            });
        $("#ddbProto").jqxDropDownList('checkIndex', 1 );
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
                        HmTreeGrid.create($ifFlowGrpTree, HmTree.T_GRP_FLOW_IF, Main.selectTree, {isContainDev: 'true'});
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

	},

    createChart : function(){

        var chart = HmHighchart.create('rawdataChart', {
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
            }]
        },  CtxMenu.COMM, 111);


    },
	/** 그리드 생성 */
	createGrid: function() {
        var source = {
            datatype: 'json',
            root: 'resultData',
            datafields: [
                { name: 'dev_ip', type: 'string' },
                { name: 'iif', type: 'number' },
                { name: 'oif', type: 'number' },
                // { name: 'in_out_cd', type: 'string' },
                // { name: 'dis_in_out_cd', type: 'string' },
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
                { name: 'das', type: 'number' }
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

        $('#chkBoundaryIn, #chkBoundaryOut').jqxCheckBox({ width: 40, height: 21 });

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
                { text: 'Router IP', datafield: 'dev_ip', width: 130 },
                { text: 'In IfIndex', datafield: 'iif', width: 90, cellsalign: 'right', hidden: true },
                { text: 'Out IfIndex', datafield: 'oif', width: 90, cellsalign: 'right', hidden: true },
                // { text: 'Boundary', datafield: 'in_out_cd', displayfield: 'dis_in_out_cd', width: 80, filtertype: 'checkedlist', cellsalign: 'center'  },
                { text: '출발지IP', datafield: 'sip', displayfield: 'dis_sip', width: 130 },
                { text: '출발지Mask', datafield: 'smk', width: 80, cellsalign: 'right', filtertype: 'number' },
                { text: '출발지Port', datafield: 'dis_spt', width: 80, cellsalign: 'right', filtertype: 'number' },
                { text: '출발지As', datafield: 'sas', width: 80, cellsalign: 'right' },
                { text: '목적지IP', datafield: 'dip', displayfield: 'dis_dip', width: 130 },
                { text: '목적지Mask', datafield: 'dmk', width: 80, cellsalign: 'right', filtertype: 'number' },
                { text: '목적지Port', datafield: 'dis_dpt', width: 80, cellsalign: 'right', filtertype: 'number' },
                { text: '목적지As', datafield: 'das', width: 80, cellsalign: 'right' },
                { text: 'Protocol', datafield: 'protocol_nm', width: 80 },
                { text: 'TCP Flags', datafield: 'tcp_flags', width: 120, cellsrenderer: HmGrid.tcpFlagrenderer, hidden:true },
                { text: 'Bytes', datafield: 'bytes', width: 80, cellsrenderer: HmGrid.unit1024renderer, filtertype: 'number' },
                { text: 'Packets', datafield: 'pkts', width: 80, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
                { text: 'Packet Size', datafield: 'pkts_size', width: 80, cellsalign: 'right', filtertype: 'number' }
            ]
        },CtxMenu.COMM, 0);
	},
	
	/** 그룹트리 선택시 */
	selectTree: function() {
		Main.searchChart();
	},

	getCommParams: function() {
		var params = {
            date: selectedTime,
            srcIp: $('#srcIp').val(),
            srcMask: $('#srcMask').val(),
            dstIp: $('#dstIp').val(),
            dstMask: $('#dstMask').val(),
            srcPort: $('#srcPort').val(),
            dstPort: $("#dstPort").val(),
            proto: $('#ddbProto').val(),
            // tcpFlags: _tcpFlags,
            isBoundaryIn: $('#chkBoundaryIn').val()? 1 : 0,
            isBoundaryOut: $('#chkBoundaryOut').val()? 1 : 0
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
            HmGrid.updateBoundData($rawdataGrid, ctxPath + '/main/tms2/rawdataSearch/getRawdataAnalysisList.do');
        }
	},
	searchChart : function() {
        var _chart = $('#rawdataChart').highcharts();
        $rawdataGrid.jqxGrid('clear');
        _chart.hideNoData();
        _chart.showLoading();
        Server.get('/main/tms2/rawdataSearch/getRawdataSearchChart.do', {
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
                        _chart.showNoData();
                        _chart.hideLoading();
                    }else{
                        _chart.hideLoading();
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
        HmUtil.exportExcel(ctxPath + '/main/tms2/rawdataSearch/export.do', params);
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


