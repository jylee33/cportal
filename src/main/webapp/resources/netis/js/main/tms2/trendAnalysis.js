var  $leftTab, $grpTree, $ifFlowGrpTree, $dataGrid, $ipGrpTree;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
        $leftTab = $('#leftTab'), $grpTree = $('#grpTree'), $ifFlowGrpTree = $('#ifFlowGrpTree'), $dataGrid = $('#dataGrid'), $ipGrpTree = $('#ipGrpTree');
        HmBoxCondition.createTmsPeriod();
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': this.search(); break;
		case 'btnExcel': this.exportExcel(); break;
		}
	},

	/** init design */
	initDesign : function() {
        // HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '14%', collapsible: false }, { size: '86%' }], 'auto', '100%');
		// HmTreeGrid.create($grpTree, HmTree.T_GRP_TMS, Main.selectTree, {isRootSelect: true});

        // 좌측 탭영역
        $leftTab.jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxThemeV1,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmTreeGrid.create($grpTree, HmTree.T_GRP_TMS, Main.searchDev, {isRootSelect: 'true'});
                        break;
                    case 1:
                        HmTreeGrid.create($ifFlowGrpTree, HmTree.T_GRP_FLOW_IF, Main.searchDev, {isContainDev: 'true'});
                        break;
                    case 2:
                        HmTreeGrid.create($ipGrpTree, HmTree.T_GRP_IP2, Main.selectTree, null , ['grpName']);
                        break;
                }
            }
        });

        $('input:radio[name=rbgTrfval]:first').add($('input:radio[name=rbgOrderby]:first')).attr('checked', 'checked');
		HmDropDownList.create($('#cbTopCnt'), {
			source: [500, 1000, 2000], width: 60, selectedIndex: 0
		});
        HmGrid.create($dataGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: null,
                    datafields: [
                        { name: 'sip', type: 'string' },
                        { name: 'dis_sip', type: 'string' },
                        { name: 'dip', type: 'string' },
                        { name: 'dis_dip', type: 'string' },
                        { name: 'protocol_nm', type: 'string' },
                        { name: 'dis_spt', type: 'string' },
                        { name: 'dis_dpt', type: 'string' },
                        { name: 'tcp_flags', type: 'string' },
                        { name: 'dis_tcp_flags', type: 'string' },
                        { name: 'bps', type: 'number' },
                        { name: 'pps', type: 'number' },
                        { name: 'bytes', type: 'number' },
                        { name: 'pkts', type: 'number' },
                        { name: 'pkt_size', type: 'number' }
                    ]
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended'
        }, CtxMenu.NONE);

        this.createGrid();

        $('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {
		
	},

	/** 그리드 생성 */
	createGrid: function() {
        var params = this.getCommParams();
		var _fixedCols = [
            { text: 'BPS', datafield: 'bps', width: 100, align: 'center', cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
            { text: 'PPS', datafield: 'pps', width: 100, align: 'center', cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
            { text: 'Bytes', datafield: 'bytes', width: 100, align: 'center', cellsrenderer: HmGrid.unit1024renderer, filtertype: 'number' },
            { text: 'Packets', datafield: 'pkts', width: 100, align: 'center', cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
            { text: 'Packet Size', datafield: 'pkt_size', width: 100, align: 'center', cellsalign: 'right', cellsformat: 'n', hidden: true, filtertype: 'number' }
        ];
        var _dynamicCols = [];
        $.each(params.topCond.split(','), function(idx, item) {
            switch(item) {
                case 'SIP':
                    _dynamicCols.push({ text: '출발지 IP', datafield: 'sip', displayfield:'dis_sip', width: 130, align: 'center' });
                    break;
                case 'DIP':
                    _dynamicCols.push({ text: '목적지 IP', datafield: 'dip', displayfield:'dis_dip', width: 130, align: 'center' });
                    break;
                case 'PROTO':
                    _dynamicCols.push({ text: '프로토콜', datafield: 'protocol_nm', width: 120, align: 'center',  filtertype: 'checkedlist' });
                    break;
                case 'SPT':
                    _dynamicCols.push({ text: '출발지 PORT', datafield: 'dis_spt', width: 120, align: 'center' });
                    break;
                case 'DPT':
                    _dynamicCols.push({ text: '목적지 PORT', datafield: 'dis_dpt', width: 120, align: 'center' });
                    break;
                case 'TCP_FLAGS':
                    _dynamicCols.push({ text: 'TCP Flag', datafield: 'tcp_flags', displayfield: 'dis_tcp_flags', width: 120, align: 'center', filtertype: 'checkedlist' });
                    break;
            }
        });
        // _dynamicCols.push({ text: 'Boundary', datafield: 'in_out_cd', displayfield: 'dis_in_out_cd', width: 100, align: 'center', filtertype: 'checkedlist' });
        _dynamicCols.unshift({ text: 'No.', width: 50, align: 'center', datafield: '', columntype: 'number', filterable: false, cellsrenderer: HmGrid.rownumrenderer });

        $dataGrid.jqxGrid('beginupdate', true);
        $dataGrid.jqxGrid({ columns: $.merge(_dynamicCols, _fixedCols) });
        $dataGrid.jqxGrid('endupdate');
        $dataGrid.off('bindingcomplete').on('bindingcomplete', function(event) {
            try {
                $dataGrid.jqxGrid('refreshfilterrow');
            } catch(e) {}
        });

        setTimeout(Main.searchData, 1000);
        Main.createCtxmenu($dataGrid);
	},
    /** ContextMenu */
    createCtxmenu: function(grid) {
        if($('#ctxmenu_tms2').length > 0){
            $('#ctxmenu_tms2').jqxMenu('destroy');
        }
        var menu = $('<div id="ctxmenu_tms2"></div>');
        var ul = $('<ul></ul>');

        var params = this.getCommParams();
        $.each(params.topCond.split(','), function(idx, item) {
            console.log(item)
            switch(item) {
                case 'SIP':
                    ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>출발지 IP상세</span></li>'));
                    // ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>출발지 서비스상세</span></li>'));
                    break;
                case 'DIP':
                    ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>목적지 IP상세</span></li>'));
                    // ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>목적지 서비스상세</span></li>'));
                    break;
            }
        });
        var li = $('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/op_tool.png"><span>도구</span></li>');
        li.append($('<ul><li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/filter.png"><span>필터</span></li>' +
            '<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/filter_reset.png"><span>필터초기화</span></li></ul>'));
        ul.append(li);
        menu.append(ul).appendTo('body');

        grid.on('contextmenu', function(event) {
            return false;
        })
            .on('rowclick', function(event) {
                if(event.args.rightclick) {
                    grid.jqxGrid('selectrow', event.args.rowindex);
                    var scrollTop = $(window).scrollTop();
                    var scrollLeft = $(window).scrollLeft();
                    $('#ctxmenu_tms2').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                        parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                    return false;
                }
            });
        menu.jqxMenu({ width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme })
            .on('itemclick', function(event) {
                Main.selectCtxmenu(event);
            });
    },
    selectCtxmenu: function(event) {
        var ctxmenuId = event.currentTarget.id;
        var params = this.getCommParams();
        switch($.trim($(event.args).text())) {
            case '출발지 IP상세':
                try {
                    var rowidx = HmGrid.getRowIdx($dataGrid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var _grpNo = -1, _netNo = -1, _ifInout = '', _itemKind = 'GROUP';
                    var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                    if(treeItem !== null) {
                        _itemKind = treeItem.devKind2;
                        if(_itemKind == 'GROUP') {
                            _grpNo = treeItem.grpNo;
                        }
                        else {
                            var tmp = treeItem.grpNo.split('_');
                            if(tmp != null && tmp.length == 3) {
                                _grpNo = tmp[0], _netNo = tmp[1], _ifInout = tmp[2] == 'I'? 'IN' : 'OUT';
                            }
                        }
                    }
                    // getCommParams
                    var rowdata = $dataGrid.jqxGrid('getrowdata', rowidx);

                    $.extend(params, {
                        grpNo: _grpNo,
                        netNo: _netNo,
                        itemKind: _itemKind,
                        viewType: 'SRC',
                        dataType: 'RAW',
                        ip: rowdata.sip});
                    /*
                    HmWindow.create($('#pwindow'), 1100, 700);
                    $.post(ctxPath + '/main/popup/tms2/pTms2IpDetail.do',
                        params,
                        function(result) {
                            HmWindow.open($('#pwindow'), 'IP 상세', result, 1100, 400);
                        }
                    );
                     */
                    HmUtil.createPopup('/main/popup/tms2/pTms2IpDetail.do', $('#hForm'), 'pTms2IpDetail', 1000, 700, params);
                } catch(e) {}
                break;
            case '목적지 IP상세':
                try {
                    var rowidx = HmGrid.getRowIdx($dataGrid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var _grpNo = -1, _netNo = -1, _ifInout = '', _itemKind = 'GROUP';
                    var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                    if(treeItem !== null) {
                        _itemKind = treeItem.devKind2;
                        if(_itemKind == 'GROUP') {
                            _grpNo = treeItem.grpNo;
                        }
                        else {
                            var tmp = treeItem.grpNo.split('_');
                            if(tmp != null && tmp.length == 3) {
                                _grpNo = tmp[0], _netNo = tmp[1], _ifInout = tmp[2] == 'I'? 'IN' : 'OUT';
                            }
                        }
                    }
                    var rowdata = $dataGrid.jqxGrid('getrowdata', rowidx);
                    $.extend(params, {
                        grpNo: _grpNo,
                        netNo: _netNo,
                        itemKind: _itemKind,
                        viewType: 'DST',
                        dataType: 'RAW',
                        ip: rowdata.dip});
                    /*
                    HmWindow.create($('#pwindow'), 1100, 700);
                    $.post(ctxPath + '/main/popup/tms2/pTms2IpDetail.do',
                        params,
                        function(result) {
                            HmWindow.open($('#pwindow'), 'IP 상세', result, 1100, 400);
                        }
                    );
                    */
                    HmUtil.createPopup('/main/popup/tms2/pTms2IpDetail.do', $('#hForm'), 'pTms2IpDetail', 1000, 700, params);
                } catch(e) {}
                break;
            case '필터':
                $dataGrid.jqxGrid('beginupdate');
                if($dataGrid.jqxGrid('filterable') === false) {
                    $dataGrid.jqxGrid({ filterable: true });
                }
                setTimeout(function() {
                    $dataGrid.jqxGrid({showfilterrow: !$dataGrid.jqxGrid('showfilterrow')});
                }, 300);
                $dataGrid.jqxGrid('endupdate');
                break;
            case '필터초기화':
                $dataGrid.jqxGrid('clearfilters');
                break;
        }
    },
	/** 그룹트리 선택시 */
	selectTree: function() {
		Main.search();
	},
	
	getCommParams: function() {
		var params = {
            inOutCd: $(':input:radio[name=rbgTrfval]:checked').val(),
            orderby: $(':input:radio[name=rbgOrderby]:checked').val(),
            topCnt: $('#cbTopCnt').val()
		};
        $.extend(params, HmBoxCondition.getPeriodParams());
        var _topcond = [];
        $('input:checkbox[name=chkTop]').each(function() {
            if(this.checked) _topcond.push(this.value);

            switch(this.id) {
				case 'chkTop_DIP': params.isContainDIP = this.checked? 1 : 0; break;
                case 'chkTop_SIP': params.isContainSIP = this.checked? 1 : 0; break;
                case 'chkTop_PROTO': params.isContainPROTO = this.checked? 1 : 0; break;
                case 'chkTop_SPT': params.isContainSPT = this.checked? 1 : 0; break;
                case 'chkTop_DPT': params.isContainDPT = this.checked? 1 : 0; break;
			}
        });
        params.topCond = _topcond.join(',');

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
		// if(!HmDate.validation($('#date1'), $('#date2'))) return;
		this.createGrid();
	},

	searchData: function() {
		HmGrid.updateBoundData($dataGrid, ctxPath + '/main/tms2/trendAnalysis/getTrendAnalysisList.do');
	},

	exportExcel: function() {
	    HmUtil.exportGrid($dataGrid, '트랜드분석', false);
		// HmUtil.exportExcel(ctxPath + '/main/tms2/trendAnalysis/export.do', Main.getCommParams());
	}

};
