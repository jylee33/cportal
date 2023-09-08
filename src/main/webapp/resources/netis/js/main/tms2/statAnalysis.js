var $leftTab, $grpTree, $ifFlowGrpTree, $dataGrid, $ipGrpTree;

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
        HmBoxCondition.createRadio($('#sTrfType'), [
            {label: 'IP', value: 'IP'},
            {label: 'C클래스', value: 'CCLASS'},
            {label: '프로토콜', value: 'PROTOCOL'},
            {label: 'APP', value: 'APP'},
            {label: 'AS', value: 'AS'},
            {label: 'ISP', value: 'ISP'},
            {label: '업무', value: 'WORK'},
            {label: 'GROUP', value: 'GROUP'},
            {label: 'COUNTRY', value: 'COUNTRY'},
        ]);
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
        // $("#cbTrfType").jqxButtonGroup({ mode: 'radio' }).jqxButtonGroup('setSelection', 0);

		HmGrid.create($dataGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: null,
                    datafields: [
                        { name: 'trfValue1', type: 'string' },
                        { name: 'bps', type: 'number' },
                        { name: 'pps', type: 'number' },
                        { name: 'bytes', type: 'number' },
                        { name: 'pkts', type: 'number' },
                        { name: 'pktsSize', type: 'number' }
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
            { text: 'Bytes', datafield: 'bytes', width: 100, cellsrenderer: HmGrid.unit1024renderer, align: 'center', filtertype: 'number' },
            { text: 'Packets', datafield: 'pkts', width: 100, cellsrenderer: HmGrid.unit1000renderer, align: 'center', filtertype: 'number' },
            { text: 'BPS', datafield: 'bps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, align: 'center', filtertype: 'number' },
            { text: 'PPS', datafield: 'pps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, align: 'center', filtertype: 'number' },
            { text: 'Packet Size', datafield: 'pktsSize', width: 100, cellsalign: 'right', cellsformat: 'n', align: 'center', filtertype: 'number' }
        ];

		var _dynamicCols = [];

		switch(params.trfType) {

			case 'IP':
				_dynamicCols.push({ text: 'IP', datafield: 'trfValue1', width: 130, align: 'center' });
				break;
			case 'CCLASS':
				_dynamicCols.push({ text: 'C클래스', datafield: 'trfValue1', width: 130, align: 'center' });
				break;
			// case 'PROTOCOL':
			// 	_dynamicCols.push({ text: '프로토콜', datafield: 'protocol_nm', width: 120,  filtertype: 'checkedlist', align: 'center' });
			// 	break;
			case 'APP':
				_dynamicCols.push({ text: 'APP', datafield: 'trfValue1', width: 130, align: 'center' });
				break;
            case 'AS':
                _dynamicCols.push({ text: 'AS', datafield: 'trfValue1', width: 130, align: 'center' });
                break;
			case 'ISP':
				_dynamicCols.push({ text: 'ISP', datafield: 'trfValue1', width: 130, align: 'center' });
				break;
			case 'WORK':
				_dynamicCols.push({ text: '업무', datafield: 'trfValue1', width: 130, align: 'center' });
				break;
            case 'GROUP':
                _dynamicCols.push({ text: '그룹', datafield: 'trfValue1', width: 130, align: 'center' });
                break;
            case 'COUNTRY':
                _dynamicCols.push({ text: '국가', datafield: 'trfValue1', width: 130, align: 'center' });
                break;
		}

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
        switch(params.trfType) {
            case 'IP': case 'CCLASS':
                ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>IP상세</span></li>'));
                // ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>출발지 서비스상세</span></li>'));
                break;
        }

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
            case 'IP상세':
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
                        dataType: 'SUMMARY',
                        viewType: 'SRC',
                        ipType: params.trfType,
                        ip: rowdata.trfValue1});
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
            // case '출발지 서비스상세':
            //     try {
            //         var rowidx = HmGrid.getRowIdx($dataGrid, '선택된 데이터가 없습니다.');
            //         if(rowidx === false) return;
            //         var _grpNo = -1, _netNo = -1, _ifInout = '', _itemKind = 'GROUP';
            //         var treeItem = HmTreeGrid.getSelectedItem($grpTree);
            //         if(treeItem !== null) {
            //             _itemKind = treeItem.devKind2;
            //             if(_itemKind == 'GROUP') {
            //                 _grpNo = treeItem.grpNo;
            //             }
            //             else {
            //                 var tmp = treeItem.grpNo.split('_');
            //                 if(tmp != null && tmp.length == 3) {
            //                     _grpNo = tmp[0], _netNo = tmp[1], _ifInout = tmp[2] == 'I'? 'IN' : 'OUT';
            //                 }
            //             }
            //         }
            //         var rowdata = $dataGrid.jqxGrid('getrowdata', rowidx);
            //         var params = {
            //             grpNo: _grpNo,
            //             netNo: _netNo,
            //             itemKind: _itemKind,
            //             viewType: 'SRC',
            //             ip: rowdata.ip
            //         };
            //         HmWindow.create($('#pwindow'), 1100, 650);
            //         $.post(ctxPath + '/main/popup/tms2/pTms2SvcDetail.do',
            //             params,
            //             function(result) {
            //                 HmWindow.open($('#pwindow'), '서비스 상세', result, 1100, 650);
            //             }
            //         );
            //     } catch(e) {}
            //     break;
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
		// var btnIdx = $('#cbTrfType').jqxButtonGroup('getSelection');
		// var findBtn = $('#cbTrfType div').eq(btnIdx);
		var params = {
            inOutCd: $(':input:radio[name=rbgTrfval]:checked').val(),
            trfType: HmBoxCondition.val('sTrfType')
		};
        $.extend(params, HmBoxCondition.getPeriodParams());
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
        // params.trfType = "LargeData";

		return params;
	},
	
	/** 조회 */
	search : function() {
		this.createGrid();
	},

	searchData: function() {
		// service call
		HmGrid.updateBoundData($dataGrid, ctxPath + '/main/tms2/statAnalysis/getStatAnalysisList.do');
	},

	exportExcel: function() {
        HmUtil.exportGrid($dataGrid, '통계분석', false);
		// HmUtil.exportExcel(ctxPath + '/main/tms2/statAnalysis/export.do', Main.getCommParams());
	}

};
