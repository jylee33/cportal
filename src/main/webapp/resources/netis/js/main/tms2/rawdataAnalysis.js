var $leftTab, $grpTree, $ifFlowGrpTree, $rawdataGrid , $ipGrpTree;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
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


        this.createGrid();
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
        // HmTreeGrid.create($grpTree, HmTree.T_GRP_TMS, Main.selectTree, {isRootSelect: true});

        $('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {
		
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
	    var timeGap = ($('#date2').val('date').getTime() - $('#date1').val('date').getTime()) / 1000;
	    if(timeGap > (10 * 60)) {
	        alert('RAWDATA는 기간이 10분이내만 조회 가능합니다.');
            return;
        }

        HmGrid.updateBoundData($rawdataGrid, ctxPath + '/main/tms2/rawdataAnalysis/getRawdataAnalysisList.do');

	},

    /** export Excel */
    exportExcel: function() {
        if(!HmDate.validation($('#date1'), $('#date2'))) return;
        var timeGap = ($('#date2').val('date').getTime() - $('#date1').val('date').getTime()) / 1000;
        if(timeGap >= (10 * 60)) {
            alert('RAWDATA는 기간이 10분이내만 조회 가능합니다.');
            return;
        }
        HmUtil.exportExcel(ctxPath + '/main/tms2/rawdataAnalysis/export.do', Main.getCommParams());
    }

};


