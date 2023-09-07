var $leftTab, $grpTree, $ifFlowGrpTree, $rawdataGrid , $ipGrpTree;
var protoList , portList , serviceList, asList;

$(function() {
	Main.initData();
	Main.initVariable();
	Main.observe();
	Main.initDesign();
});

var Main = {
	/** variable */
	initVariable : function() {
        $leftTab = $('#leftTab'), $grpTree = $('#grpTree'), $ifFlowGrpTree = $('#ifFlowGrpTree'), $rawdataGrid = $('#rawdataGrid') , $ipGrpTree = $('#ipGrpTree');
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
        if( $('#srcIp').val() == "" && $('#dstIp').val() == ""){
            $('.pop_tooltip02').jqxTooltip('open');
            $("#srcIp").focus();
            return false;
        }else{
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
        }
        return true;
    },

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': if(Main.checkIPInput()) Main.search(); break;
		case 'btnExcel': this.exportExcel(); break;
		}
	},



	/** init design */
	initDesign : function() {
        // HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '14%', collapsible: false }, { size: '86%' }], 'auto', '100%');
        // HmJqxSplitter.create($('#dataSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 400, collapsible: false }, { size: '50%' }], 'auto', '100%');

		var today = new Date();
		today.setMinutes(Math.floor(today.getMinutes() / 5) * 5);
		$('#date2').jqxDateTimeInput({width: 130, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd HH:mm', culture: 'ko-KR'})
            .jqxDateTimeInput('setDate', today);

		today.setMinutes(today.getMinutes() - 5 );
        $('#date1').jqxDateTimeInput({width: 130, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd HH:mm', culture: 'ko-KR'})
            .jqxDateTimeInput('setDate', today);

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


        this.createGrid();
        // 좌측 탭영역 - 2023.05.16 그룹 클릭 시 조회 금지
        $leftTab.jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxThemeV1,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        // HmTreeGrid.create($grpTree, HmTree.T_GRP_TMS, Main.selectTree, {isRootSelect: 'true'});
                        HmTreeGrid.create($grpTree, HmTree.T_GRP_TMS, null , {isRootSelect: 'true'});
                        break;
                    case 1:
                        // HmTreeGrid.create($ifFlowGrpTree, HmTree.T_GRP_FLOW_IF, Main.selectTree, {isContainDev: 'true'});
                        HmTreeGrid.create($ifFlowGrpTree, HmTree.T_GRP_TMS_FLOW_IF, null , {isContainDev: 'true'});
                        break;
                    case 2:
                        // HmTreeGrid.create($ipGrpTree, HmTree.T_GRP_IP2, Main.selectTree, null , ['grpName']);
                        HmTreeGrid.create($ipGrpTree, HmTree.T_GRP_IP2, null , null , ['grpName']);
                        break;
                }
            }
        });
        // HmTreeGrid.create($grpTree, HmTree.T_GRP_TMS, Main.selectTree, {isRootSelect: true});

        $('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {
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
                console.dir(result);
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
                { text: '출발지As', datafield: 'sas', width: 80, cellsalign: 'right' , hidden: false ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var sAsStr = value;
                        if(value != ""){
                            $.each(asList, function (idx, item) {
                                if(item.asNo == value ){
                                    sAsStr = value + " (" + item.nameShort +")";
                                }
                            });
                        }
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + sAsStr +'</div>';
                    }
                },
                { text: '출발지As', datafield: 'sas_name', width: 120, cellsalign: 'right' , hidden : true },
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
                { text: '목적지As', datafield: 'das', width: 80, cellsalign: 'right' , hidden: false ,
                    cellsrenderer: function (row, column, value, rowData) {
                        var dAsStr = value;
                        if(value != ""){
                            $.each(asList, function (idx, item) {
                                if(item.asNo == value ){
                                    dAsStr = value + " (" + item.nameShort +")";
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
                { text: 'Packet Size', datafield: 'pkts_size', width: 80, cellsalign: 'right', filtertype: 'number' },
            ]
        },CtxMenu.COMM, 0);
	},
	
	/** 그룹트리 선택시 */
	selectTree: function() {
        if(Main.checkIPInput()) Main.search();
	},

	getCommParams: function() {
        // var _checkedFlags = HmDropDownList.getCheckedValues($('#ddbTcpflag'));
        // var _tcpFlags = "";
        // $.each(_checkedFlags, function(idx, value) {
        //     if(_tcpFlags == "") _tcpFlags = 0;
        //     _tcpFlags += value;
        // });

		var params = {
            date1: HmDate.getDateStr($('#date1')),
            time1: HmDate.getTimeStr($('#date1')) + '00',
            date2: HmDate.getDateStr($('#date2')),
            time2: HmDate.getTimeStr($('#date2')) + '00',
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
                console.dir(treeItem);
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

	    if(!HmDate.validation($('#date1'), $('#date2'))) return;

        HmGrid.updateBoundData($rawdataGrid, ctxPath + '/main/tms3/rawdataFAnalysis/getRawdataAnalysisList.do');

	},

    /** export Excel */
    exportExcel: function() {
        if(!HmDate.validation($('#date1'), $('#date2'))) return;
        HmUtil.exportExcel(ctxPath + '/main/tms3/rawdataFAnalysis/export.do', Main.getCommParams());
    }

};


