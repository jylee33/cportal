var $grpTree, $ifGrid, $rptChart;
var _curIfData = null;
var _timer = null;

var $dataViewGrid;

var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#grpTree'), $ifGrid = $('#ifGrid'), $rptChart = $('#rptChart');
		$dataViewGrid = $('#dataViewGrid');
		this.initCondition();
	},
	initCondition: function() {
		// 기간
		Main.createPeriod('', Main.searchChart, _timer);


        var _curDate = new Date();
        _curDate.setHours(0);
        _curDate.setMinutes(0);
        $('#sDate1').val(_curDate);
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnSearch': this.searchChart(); break;
			case 'btnCList': this.showChartData(); break;
			case 'btnCSave': this.showValueSelectPopup(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmJqxSplitter.createTree($('#mainSplitter'));
		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
		HmJqxSplitter.create($('#subSpliiter'), HmJqxSplitter.ORIENTATION_H, [{ size: '70%', collapsible: false }, { size: '30%' }], 'auto', '100%');
		$('#cbTableCnt').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true, selectedIndex: 0,
			source: [{label: '수집주기', value: 1}, {label: '시간', value: 2}, {label: '일', value: 3}]
		});
		//HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 1);
		$('#cbTimeId').jqxDropDownList({ width: 150, height: 21, theme: jqxTheme, selectedIndex: 0, displayMember: 'memo', valueMember: 'codeId',
			source: new $.jqx.dataAdapter(
					{
						datatype: "json",
						url:  ctxPath +'/main/env/optConf/getWorkTimeConfList.do',
						formatData: function (data) {
							$.extend(data, {isAll:'true'});
							return data;
						}
					}
			)
		});

		HmTreeGrid.create($grpTree, HmTree.T_GRP_IF, Main.selectTree);
		HmGrid.create($ifGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json'
					},
					{
						formatData: function(data) {
							var treeItem = HmTreeGrid.getSelectedItem($grpTree);
							data.grpNo = treeItem == null? -1 : treeItem.grpNo;
							return data;
						},
						loadComplete: function() {
							_curIfData = null;
						}
					}
			),
			pageable: false,
			columns:
			[
				{ text: '장비번호', datafield: 'mngNo', width: 50, hidden: true },
				{ text: '회선번호', datafield: 'ifIdx', width: 50, hidden: true },
				{ text: '장비명', datafield: 'disDevName' },
				{ text: '회선명', datafield: 'ifName' }
			]
		}, CtxMenu.COMM, 1);
		$ifGrid.on('bindingcomplete', function(event) {
			$ifGrid.jqxGrid('addrow', null, {mngNo: -1, ifIdx: -1, ifName: '전체'}, 'first');
			$ifGrid.jqxGrid('selectrow', 0);
		}).on('rowselect', function(event) {
			_curIfData = event.args.row;
			//Main.searchChart();
		});

		var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR, HmChart2.unit1000FormatFn);
		$.extend(settings, {
			seriesGroups: [
								HmChart2.getSeriesGroup($rptChart, HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn,
										HmChart2.getSeries(['maxInbps', 'maxOutbps'], ['IN', 'OUT'], [HmChart2.C_IF_AVG_IN, HmChart2.C_IF_AVG_OUT])
								)
								// HmChart2.getSeriesGroup($rptChart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn,
								// 		HmChart2.getSeries(['maxBps'], ['SUM'])
								// )
						   ]
		});
		$.extend(settings.xAxis, { dataField : 'ymdhms', type : 'date', labels: {
				settings: 'topright',
				angle: 0,
				offset: { x: 0, y: 0 }
			}, baseUnit : HmChart2.XUNIT_HOUR, dateFormat : 'yyyy-MM-dd HH:mm:ss', formatFunction : function(value) {
				return $.format.date(value, 'MM월dd일HH시');
			} });
		HmChart2.create($rptChart, settings);

		$('#cbChartType').jqxDropDownList({ width: 80, height: 21, theme: jqxTheme, autoDropDownHeight: true, selectedIndex: 1,
			source: [{label: '최대', value: 'max'}, {label: '평균', value: 'avg'}, {label: '최소', value: 'min'}, {label: '최대+평균', value: 'max_avg'}, {label: '전체', value: 'all'}]
		})
		.on('change', function(event) {
			Main.chgChartType();
		});

		//하단영역
		HmGrid.create($dataViewGrid, {
			source: new $.jqx.dataAdapter({
				datatype: 'json',
			}),
			pageable: false,
			columns:[
				{ text: '일시', datafield: 'ymdhms', minwidth:130 },
			]
		}, CtxMenu.NONE);

	},

	/** init data */
	initData : function() {

	},

	/** 그룹 트리 선택 */
	selectTree: function() {
		Main.searchIf();
	},

	/** 회선목록 조회 */
	searchIf: function() {
		HmGrid.updateBoundData($ifGrid, ctxPath + '/line/getLineListForIfGrp.do');
	},

	/** 회선 성능 차트 조회 */
	searchChart: function() {
//			var rowdata = HmGrid.getRowData($ifGrid);
		var rowdata = _curIfData;
		if(rowdata == null) {
			rowdata = {mngNo: -1, ifIdx: -1};
		}

		LoadingImg.startLoadingImg($rptChart);

		var params = {
				// date1: _PeriodParam.date1,
				// time1: _PeriodParam.date2,
				// date2: _PeriodParam.time1,
				// time2: _PeriodParam.date2,
				tableCnt: $('#cbTableCnt').val(),
				timeId: $('#cbTimeId').val(),
				grpNo: HmTreeGrid.getSelectedItem($grpTree).grpNo,
				mngNo: rowdata.mngNo,
				ifIdx: rowdata.ifIdx,
		};

		var _PeriodParam = HmBoxCondition.getPeriodParams();

		if(_PeriodParam.period == '0'){
			var _curDate = new Date();
			var _diffDate = new Date();
			var _diffDate = _diffDate.setDate(_curDate.getDate() - 1);
			params.date1 = $.format.date(_diffDate, 'yyyyMMdd');
			params.date2 = $.format.date(_curDate, 'yyyyMMdd');
			params.time1 = $.format.date(_diffDate, 'HHmmss');
			params.time2 = $.format.date(_curDate, 'HHmmss');
		} else {
			params.date1 = _PeriodParam.date1;
			params.date2 = _PeriodParam.date2;
			params.time1 = _PeriodParam.time1 + '00';
			params.time2 = _PeriodParam.time2 + '59';
		}

		Server.get('/main/rpt/ifSumRpt/getIfSumRptChartList.do', {
			data: params,
			success: function(result) {
				$rptChart.jqxChart('source', result);
				$rptChart.jqxChart('update');

				setTimeout(function(){
					Main.showViewGridData();
				}, 300);

				LoadingImg.endLoadingImg();
			}
		});
	},

	/** 차트 기준값 변경 */
	chgChartType: function() {
		var _type = $('#cbChartType').val();
		var _typeText = { max: '최대', avg: '평균', min: '최소' };
		var _seriesGroups;
		switch(_type) {
		case 'max': case 'avg': case 'min':
			var _typeNm = _typeText[_type];
			_seriesGroups = [
								HmChart2.getSeriesGroup($rptChart, HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn,
										HmChart2.getSeries(
												[_type + 'Inbps', _type + 'Outbps'],
												[_typeNm + 'IN', _typeNm + 'OUT'],
												[HmChart2.C_IF_AVG_IN, HmChart2.C_IF_AVG_OUT])
								),
								HmChart2.getSeriesGroup($rptChart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn,
										HmChart2.getSeries([_type + 'Bps'], [_typeNm + 'SUM'])
								)
							 ];
			break;
		case 'max_avg':
			_seriesGroups = [
								HmChart2.getSeriesGroup($rptChart, HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn,
										HmChart2.getSeries(
												['maxInbps', 'maxOutbps', 'avgInbps', 'avgOutbps'],
												['최대IN', '최대OUT', '평균IN', '평균OUT'],
												[HmChart2.C_IF_AVG_IN, HmChart2.C_IF_AVG_OUT, HmChart2.C_IF_MAX_IN, HmChart2.C_IF_MAX_OUT])
								),
								HmChart2.getSeriesGroup($rptChart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn,
										HmChart2.getSeries(['maxBps', 'avgBps'], ['최대SUM', '평균SUM'])
								)
							 ];
			break;
		case 'all':
			_seriesGroups = [
								HmChart2.getSeriesGroup($rptChart, HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn,
										HmChart2.getSeries(
												['maxInbps', 'maxOutbps', 'avgInbps', 'avgOutbps', 'minInbps', 'minOutbps'],
												['최대IN', '최대OUT', '평균IN', '평균OUT', '최소IN', '최소OUT'])
								),
								HmChart2.getSeriesGroup($rptChart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn,
										HmChart2.getSeries(['maxBps', 'avgBps', 'minBps'], ['최대SUM', '평균SUM', '최소SUM'])
								)
							 ];
			break;
		}

		$rptChart.jqxChart('seriesGroups', _seriesGroups);
	},

	showChartData: function() {
		HmWindow.create($('#pwindow'));
		var params = {
				chartData: $rptChart.jqxChart('source')
		};
		params.cols = Main.getColumnInfo();
		$.post(ctxPath + '/main/popup/comm/pChartDataList.do',
				function(result) {
					HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 600, 600, 'p2window_init', params);
				}
		);
	},

    showViewGridData: function(){
        HmWindow.create($('#pwindow'));
        var params = {
            chartData: $rptChart.jqxChart('source')
        };
        params.cols = Main.getColumnInfo();


        Main.remakeViewGrid(params.cols, params.chartData);
	},
	getColumnInfo: function(){
        var cols = [
            { text: '일시', datafield: 'ymdhms', width:130 }
        ];
        switch($('#cbChartType').val()) {
            case 'max':
                cols.push({ text: '최대InBps', datafield: 'maxInbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '최대OutBps', datafield: 'maxOutbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                //cols.push({ text: '최대SUM', datafield: 'maxBps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                break;
            case 'avg':
                cols.push({ text: '평균InBps', datafield: 'avgInbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '평균OutBps', datafield: 'avgOutbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                //cols.push({ text: '평균SUM', datafield: 'avgBps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                break;
            case 'min':
                cols.push({ text: '최소IN', datafield: 'minInbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '최소OUT', datafield: 'minOutbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                //cols.push({ text: '최소SUM', datafield: 'minBps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
                break;
            case 'max_avg':
                cols.push({ text: '최대IN', datafield: 'maxInbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '최대OUT', datafield: 'maxOutbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '평균IN', datafield: 'avgInbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '평균OUT', datafield: 'avgOutbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                //cols.push({ text: '최대SUM', datafield: 'maxBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                //cols.push({ text: '평균SUM', datafield: 'avgBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                break;
            case 'all':
                cols.push({ text: '최대InBps', datafield: 'maxInbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '최대OutBps', datafield: 'maxOutbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '평균InBps', datafield: 'avgInbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                cols.push({ text: '평균OutBps', datafield: 'avgOutbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                //cols.push({ text: '최대SUM', datafield: 'maxBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                //cols.push({ text: '평균SUM', datafield: 'avgBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                //cols.push({ text: '최소SUM', datafield: 'minBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
                break;
        }
        return cols;
	},
	showValueSelectPopup: function(){
        $.post(ctxPath + '/dealive/popup/rpt/pValueSelect.do',
            function(result) {
                HmWindow.open($('#pwindow'), '출력데이터선택', result, 300, 130, 'pwindow_init', null);
            }
        );
	},

	saveChart: function(_VALUE) {

        var _PeriodParam = HmBoxCondition.getPeriodParams();
        if(_PeriodParam.period == '0'){
        	HmUtil.exportChart($rptChart, "Chart.png");
		} else {

			var _params = {};
			_params.chartFileName = HmUtil.saveChart($rptChart);
			_params.cols = Main.getColumnInfo();
			// _params.chartData = $rptChart.jqxChart('source');
			_params.chartData = $dataViewGrid.jqxGrid('getrows');

            _params.timeLabel = $('#cbTimeId').jqxDropDownList('getSelectedItem').label;
			_params.grpName = HmTreeGrid.getSelectedItem($grpTree).grpName;
            _params.date1Label = _PeriodParam.date1.substr(0,4) + '-' + _PeriodParam.date1.substr(4,2) + '-' + _PeriodParam.date1.substr(6,2);
            _params.date2Label = _PeriodParam.date2.substr(0,4) + '-' + _PeriodParam.date2.substr(4,2) + '-' + _PeriodParam.date2.substr(6,2)

			if(_VALUE != undefined && _VALUE != null){
				_params.displayValue = _VALUE;
			}
			HmUtil.exportExcel(ctxPath + '/main/rpt/ifSumRpt/export.do', _params);
		}

	},
	remakeViewGrid: function(_COLS, _DATA){
        //$dataViewGrid.jqxGrid('destroy');
        HmGrid.create($dataViewGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    localdata: _DATA,
                }
            ),
            columns: _COLS,
        }, CtxMenu.NONE);
	},
    createPeriod: function(cid, fn_searchCallback, timer, perfCycleNm) {
        cid = cid || '';
        $("input:radio[name=sPeriod{0}]".substitute(cid)).click(function(event){
            $('#btnCList').show();

            $rptChart.jqxChart('source', null);
            $rptChart.jqxChart('update');

            Main.remakeViewGrid();

        	$('#subSpliiter').jqxSplitter('expand');
            var _val = $(this).val(), _unit = $(this).val().replace(/[0-9\-]/ig, '');
            // value값에 단위가 존재하는 경우 예외처리 (m: minute)

            if(_unit.length) {
                _val = $(this).val().replace(/\D/ig,'');

                // clear timer
                if (timer != null) {
                    clearInterval(timer);
                }
                $(this).closest('div.tab_container').find('section.content1').css('display', 'none');
                $(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
                $('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({ disabled: true });
                if(_unit != 'ALL') {
                    Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
                }
            }
            else { // 0(실시간), -1(기간) 일때...
                if (_val == "0") {
                    $(this).closest('div.tab_container').find('section.content1').css('display', 'inline-block');
                    $(this).closest('div.tab_container').find('section.content2').css('display', 'none');
                    $("input:radio[name='sRef{0}']:last".substitute(cid)).click();
                }
                else {
                    // clear timer
                    if (timer != null) {
                        clearInterval(timer);
                    }
                    $(this).closest('div.tab_container').find('section.content1').css('display', 'none');
                    $(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
                    $('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
                    if (_val != "-1") {
                        Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
                    }
                }
            }
            // 수집주기 radio가 존재하면 기간구분 선택에 따른 수집주기 설정 변경
            if(perfCycleNm !== undefined) {
                var _perfCycle = 2; // default = 2
                if(_val == '1') {
                    _perfCycle = 1;
                }
                else if(_val == '365') {
                    _perfCycle = 3;
                }
                $("input:radio[name={0}][value={1}]".substitute(perfCycleNm, _perfCycle)).click();
            }
        });

        // 실시간 조건
        $("input:radio[name='sRef{0}']".substitute(cid)).click(function() {
        	$('#btnCList').hide();

            $rptChart.jqxChart('source', null);
            $rptChart.jqxChart('update');
            $('#subSpliiter').jqxSplitter('collapse');
            var _val = $(this).val();
            if (timer != null) {
                clearInterval(timer);
            }
            if (_val > 0) {
                timer = setInterval(function() {
                    var curVal = $('#prgrsBar'+cid).val();
                    if (curVal < 100)
                        curVal += 100 / _val;
                    $('#prgrsBar'+cid).val(curVal);
                }, 1000);
            } else {
                $('#prgrsBar'+cid).val(0);
            }
        });
        $('#prgrsBar'+cid).jqxProgressBar({ width : 70, height : 20, theme: jqxTheme, showText : true, animationDuration: 0 })
            .on('complete', function(event) {
                $(this).val(0);
                if(fn_searchCallback != null) {
                    fn_searchCallback();
                }
            });

        // date 조건
        HmDate.create($('#sDate1'+ cid), $('#sDate2'+ cid), HmDate.HOUR, 0);

        // 구분 default = first element
        $("input:radio[name=sPeriod{0}]:first".substitute(cid)).click();
    },
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});