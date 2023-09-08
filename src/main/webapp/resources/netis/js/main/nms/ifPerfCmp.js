var $grpTree, $ifPerfCmpChart, $ifGrid, $ifTmpGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#grpTree');
			$ifPerfCmpChart = $('#ifPerfCmpChart');
			$ifGrid = $('#ifGrid');
            $ifTmpGrid = $('#ifTmpGrid');
            this.initCondition();
		},

		initCondition: function() {

			HmBoxCondition.createPeriod('', null, null, 'sPerfCycle');
			/* 2023.05.18 수집주기 제외 결정 ( 1, 3 번테이블만 사용해야함으로 제외 처리 : 강대표님 결정사항) */
			// HmBoxCondition.createRadio($('#sPerfCycle'), HmResource.getResource('cond_perf_cycle'));
			/* --------------------------------------------------------------------------------------*/
			HmBoxCondition.createRadio($('#sSortType'), HmResource.getResource('cond_perf_val'));
			HmBoxCondition.createRadio($('#sInoutType'), HmResource.getResource('cond_inout_type'));

			HmDropDownList.create($('#sItemType'), {
				source: HmResource.getResource('if_itemtype_all'), selectedIndex: 0
			});

			//업무시간
			HmDropDownList.create($('#cbTimeId'), {
				source: HmResource.getResource('perf_work_time_type'), selectedIndex: 0
			});

			// // 수집주기가 5분일경우를 제외하고 Disabled 설정
			// $('#sPerfCycle').change(function(){
			// 	$('#cbTimeId').jqxDropDownList({ disabled: false });
			// 	if (HmBoxCondition.val('sPerfCycle') != '1')  {
			// 		$('#cbTimeId').jqxDropDownList({ disabled: true });
			// 	}
			// })

			//휴일, 공휴일 체크박스
			$('#ckDayOff, #ckHoliday').jqxCheckBox({width: 80, height: 22, checked: false});

		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			case 'btnIfGroupPop': this.ifGroupPop(); break;
			case 'btnIfAdd': this.ifAddTemp(); break;
            case 'btnIfDel': this.ifDelTemp(); break;
			}
		},
		
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
//				Main.searchHist();
			}
		},
		
		/** init design */
		initDesign: function() {
			HmTreeGrid.create($grpTree, HmTree.T_GRP_IF, Main.searchIfList);
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 405, collapsible: false }, { size: '100%' }], '100%', '100%');
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmJqxSplitter.create($('#splitter2'), HmJqxSplitter.ORIENTATION_H, [{ size: '48%', collapsible: false }, { size: '50%' }], 'auto', '100%');

            HmGrid.create($ifGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
                        datafields: [
                            { name: 'mngNo', type: 'number' },
                            { name: 'ifIdx', type: 'number' },
                            { name: 'ifName', type: 'string' },
                            { name: 'ifAlias', type: 'string' },
                            { name: 'lineWidth', type: 'string' },
                            { name: 'status', type: 'string' }
                        ]
                    },
                    {
                        formatData: function(data) {
                            $.extend(data, Main.getCommParams());
                            return data;
                        }
                    }
                ),
                showtoolbar: true,
                rendertoolbar: function(toolbar) {
                    HmGrid.titlerenderer(toolbar, '회선');
                },
                selectionmode: 'checkbox',
                width: '100%',
                columns:
                    [
//				 	{ text : '선택', datafield : 'checkYn', width : 40 },
                    { text : '회선명', datafield : 'ifName', minwidth : 100, cellsrenderer: HmGrid.ifAliasrenderer },
                    // { text : '별칭', datafield : 'ifAlias', width : 90 },
                    { text : '대역폭', datafield : 'lineWidth', width : 80, cellsrenderer: HmGrid.unit1000renderer },
                    { text : '상태', datafield : 'status', width : 80,  cellsrenderer: HmGrid.ifStatusrenderer}
                ]
            });


            HmGrid.create($ifTmpGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
                        datafields: [
                            { name: 'mngNo', type: 'number' },
                            { name: 'ifIdx', type: 'number' },
                            { name: 'ifName', type: 'string' },
                            { name: 'ifAlias', type: 'string' },
                            { name: 'lineWidth', type: 'string' },
                            { name: 'status', type: 'string' }
                        ]
                    },
                    {
                        formatData: function(data) {
                         	return data;
                        }
                    }
                ),
                showtoolbar: true,
                rendertoolbar: function(toolbar) {
                    HmGrid.titlerenderer(toolbar, '사용자 추가 회선');
                },
                selectionmode: 'checkbox',
                width: '100%',
                columns:
                    [
                        { text: '그룹', datafield: 'grpName', width: 150 },
                        { text: '장비명', datafield: 'disDevName', width: 150 },
                        { text: '회선명', datafield: 'ifName', minwidth: 150 },
                        { text: '회선별명', datafield: 'ifAlias', width: 150 },
                        { text: '대역폭', datafield: 'lineWidth', width: 80, cellsrenderer: HmGrid.unit1000renderer }
                ]
            });

			Main.createChart();
		},
		
		/** init data */
		initData: function() {

		},

		/** 차트 생성 */
		createChart: function() {

			var options = HmHighchart.getCommOptions(HmHighchart.TYPE_LINE);
			options.boost= {useGPUTranslations: true};
			options.chart= {
		            zoomType: 'x',
		            resetZoomButton: {
		                position: {
		                    align: 'right', // by default
		                    verticalAlign: 'top', // by default
		                    x: -10,
		                    y: 10
		                },
		                relativeTo: 'chart'
		            }
		        };
			options.xAxis = {
								type: "category",

								// labels: {
								// 	formatter: function () {
								// 		// console.log(" this.value   :   ", Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.value));
								// 		// return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.value);
								// 		// console.log(" this.value   :   ", this.value);
								// 		return this.value;
								// 	},
								// },

			// 			//
			// 					type: 'datetime',
			// 					dateTimeLabelFormats: {
			// 						millisecond: '%H:%M:%S.%L',
			// 						second: '%H:%M:%S',
			// 						minute: '%H:%M',
			// 						hour: '%H:%M',
			// 						day: '%m/%d',
			// 						week: '%b-%d',
			// 						month: '%y-%b',
			// 						year: '%Y'
			// 					}
						};

//			options.yAxis = [
//								{
//									labels: {
////										format: '{value}'+valUnit
//										formatter:function(){
//											var val = this.value;
//											if(val!=null) val = Math.abs(val);
//											if(itemType!='BPSPER')
//												return HmUtil.convertUnit1000(Math.abs(val))+valUnit;
//											else
//												return Math.abs(val)+valUnit;
//										}
//									},
//									title: null
//								}
//							];
			options.legend= { enabled: true };
			options.events = {
								load: function(){
									makeSumSeries(this);
							}
			};
			options.exporting= {
				enabled: true,
				// Custom definition
				menuItemDefinitions: {
					hmViewChartData: {
						onclick: function () {
							HmHighchart.showChartData(this, $(event.currentTarget).text());
						},
						text: '데이터보기'
					},
					hmDownloadPNG: {
						onclick: function() {
							var filename = 'chart_' + $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
							HmUtil.exportHighchart(this, filename);
						},
						text: '다운로드'
					}
				},
				buttons: {
					contextButton: {
						menuItems: ['viewFullscreen', 'hmViewChartData', 'printChart', 'hmDownloadPNG'],
						verticalAlign: 'bottom',
						y: -10
					}
				}
			};

			options.navigation= {
				buttonOptions: {
					enabled: true
				},
				menuItemStyle: {
					padding: '0.3em 1em'
				}
			}

			options.plotOptions = {
				line: {
					lineWidth: 1,
					marker: {
						enabled: false
					},
					connectNulls: true
				},
                series: {
					turboThreshold:5000000,//set it to a larger threshold, it is by default to 1000
                    events: {
                        hide: function () {
                            makeSumSeries(this.chart);
                        },
                        show: function () {
                            makeSumSeries(this.chart);
                        }
                    },
                }
			};
			
			options.series= [{name: 'NONE', data: null, lineWidth: 0.5}];
//			options.tooltip = { formatter : HmHighchart.unit1000TooltipFormatter };
//			var hmOptions = $.extend(true, commOptions, options);
			HmHighchart.create('ifPerfCmpChart', options);
		},


		/** 차트 조회 **/
//		searchChart: function(params) {
//			
//		},
		
		
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			var treeItem = HmTreeGrid.getSelectedItem($grpTree);
			$.extend(params, {
				grpNo: treeItem !== null? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0,
				sortType: HmBoxCondition.val('sSortType'),
				itemType: $('#sItemType').val(),
				disItemType: $('#sItemType').val(),
				inoutType: HmBoxCondition.val('sInoutType'),
                // perfCycle: HmBoxCondition.val('sPerfCycle'),
				// timeId: HmBoxCondition.val('sPerfCycle') == '1' ? parseInt($('#cbTimeId').val()) : 0,
				timeId: $('#cbTimeId').val(),
				isDayOff: $('#ckDayOff').val() ? 1 : 0,
				isHoliday: $('#ckHoliday').val() ? 1 : 0,
			}, HmBoxCondition.getPeriodParams());
			return params;
		},

		/** export Excel */
		exportExcel: function() {
			var params = Main.getCommParams();
//			HmUtil.exportExcel(ctxPath + '/main/nms/configMgmt/export.do', params);
		},
		searchIfList: function(){
			HmGrid.updateBoundData($ifGrid, ctxPath + '/main/nms/ifPerfCmp/getIfList.do' );
		},
		/** 차트 조회 */
		search: function(){
            var params = Main.getCommParams();

			var rowIdxes = HmGrid.getRowIdxes($ifGrid);


			var _mngInfos =[];
			$.each(rowIdxes, function(idx,value){
				_mngInfos.push({mngNo: $ifGrid.jqxGrid('getrowdata', value).mngNo, ifIdx:$ifGrid.jqxGrid('getrowdata', value).ifIdx , ifName: $ifGrid.jqxGrid('getrowdata', value).ifName});
			});


            var rowIdxes = HmGrid.getRowIdxes($ifTmpGrid);

            var _tmpInfos =[];
            $.each(rowIdxes, function(idx,value){
                _tmpInfos.push({mngNo: $ifTmpGrid.jqxGrid('getrowdata', value).mngNo, ifIdx:$ifTmpGrid.jqxGrid('getrowdata', value).ifIdx , ifName: $ifTmpGrid.jqxGrid('getrowdata', value).ifName});
            });

            _mngInfos = _mngInfos.concat(_tmpInfos);
            $.extend(params, {mngInfos: _mngInfos });


            if(!(params.mngInfos).length){
                alert('선택된 데이터가 없습니다.')
            }

			var ifchart =  $ifPerfCmpChart.highcharts();

			try{
				ifchart.hideNoData();
				ifchart.showLoading();
			}catch(err){}



			Server.post('/main/nms/ifPerfCmp/getIfPerfChartList.do', {
				data: params,
				success: function(result) {
					console.log(result);
					Main.searchChartResult(result, _mngInfos);
					ifchart.hideLoading();
				}
			});
			
		},

		searchChartResult: function(result, mngInfos){

			var ifPerfCmpChart = $ifPerfCmpChart.highcharts();
			var chk = 0;
			
			try{
				ifPerfCmpChart.hideNoData();
			}catch(err){}
			
			var len = ifPerfCmpChart.series.length;
			for (var i = len-1; i>=0; i--) {
				ifPerfCmpChart.series[i].remove();
	        }

		/*	var _itemType = $('#cbItemType').jqxDropDownList('getSelectedItem');*/

			var _itemType =	$("#sItemType").val();

			var _label = null, _unit = null;
			switch (_itemType) {
			case 'BPS':
				_label = 'BPS';
				_unit = '';
				break;
			case 'BPSPER':
				_label = 'BPS(%)';
				_unit = '%';
				break;
			case 'PPS':
				_label = 'PPS';
				_unit = '';
				break;
			case 'ERR':
				_label = 'ERROR';
				_unit = '';
				break;
			case 'CRC':
				_label = 'CRC';
				_unit = '';
				break;
			case 'COLLISION':
				_label = 'COLLISION';
				_unit = '';
				break;
			default:
				return;
			}
			
			ifPerfCmpChart.yAxis[0].axisTitle.attr({
		        text: _label
		    });
			ifPerfCmpChart.tooltip.options.formatter = function() {
		        var xyArr=[], ymd;
		        $.each(this.points,function(){

		        	//if(xyArr.length == 0) ymd = $.format.date(this.x, 'yyyy-MM-dd HH:mm:ss');
					if(xyArr.length == 0) ymd = this.key;
		        	if (this.series.name == '합계') {
						xyArr.unshift(this.series.name +' : ' + Main.tooltipFormatFn(_label, _unit, this.y))
					} else {
						xyArr.push(this.series.name +' : ' + Main.tooltipFormatFn(_label, _unit, this.y));
					}
		        });
				xyArr.unshift(ymd);
		        return xyArr.join('<br/>');
		    };
			
			
			var seriesCnt = mngInfos.length;
			for(var i = 0; i <seriesCnt; i++){
//				ifPerfCmpChart.addSeries({ name: 'new' }, false);
				ifPerfCmpChart.addSeries({ name: mngInfos[i].ifName }, false);
			}
            	ifPerfCmpChart.addSeries({ name: '합계',  visible: false}, false);
			
			$.each(result, function(idx, value){
				var chartData = [];

				var mngInfo = mngInfos.filter(function(item){
					return idx == item.mngNo+'|'+item.ifIdx;   // 장비번호 | 회선번호  서버스단에서 넘겨받음
				});
				// debugger
				$.each(value, function(i,v){
					// console.log("v.date ==> ", Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', v.date));
					// chartData.push([v.ymdhms, parseInt(v.val)]);
					chartData.push([Highcharts.dateFormat('%Y-%m-%d %H:%M', v.date), parseInt(v.val)]);
				});

				ifPerfCmpChart.series[chk].update({ name: mngInfo[0].ifName.replace(/\</g,'&lt;').replace(/\>/g,'&gt;'),  data: chartData });
				chk++;
			});
			
			ifPerfCmpChart.redraw();
		},
		
		tooltipFormatFn: function(label, unit, value){
			var rVal = null;
			switch (label) {
			case 'BPS':
				rVal = HmUtil.convertUnit1000(value, true) + unit;
				break;
			case 'BPSPER':
				rVal = value + unit;
				break;
			case 'PPS':
				rVal = HmUtil.convertUnit1000(value, true) + unit;
				break;
			case 'ERR': case 'CRC': case 'COLLISION':
				rVal = value + unit;
				break;
			default:
				return;
			}
			return rVal;
			
		},

    	ifGroupPop: function(){
            // HmWindow.create($('#pwindow'), 500, 500, 999);
            // $.post(ctxPath + '/main/popup/nms/pIfGroupMgmt.do',
            //     function(result) {
            //         HmWindow.open($('#pwindow'), '회선그룹 설정', result, 500, 395);
            //     }
            // );
            HmUtil.createPopup('/main/popup/nms/pIfGroupMgmt.do', $('#hForm'), ' pIfGroup', 1300, 700);
		},

		ifAddTemp: function(){
            HmWindow.create($('#pwindow'), 770, 440, 999);
            $.post(ctxPath + '/main/popup/nms/pIfAddTemp.do',
                function(result) {
                    HmWindow.open($('#pwindow'), '회선 가져오기', result, 770, 440, 'pwindow_init');
                }
            );
		},
		ifDelTemp: function(){
            var rowIdxes = HmGrid.getRowIdxes($ifTmpGrid, '선택된 데이터가 없습니다.');
            if(rowIdxes === false) return;

            var _uids = [];
            $.each(rowIdxes, function(idx,value){
                var tmp = $ifTmpGrid.jqxGrid('getrowdata', value);
                _uids.push(tmp.uid);
            });

            $ifTmpGrid.jqxGrid('deleterow', _uids);
            $ifTmpGrid.jqxGrid('clearselection');
		}
};

function makeSumSeries(chart) {
		var series = chart.series,
			each = Highcharts.each,
			sum;
		series[series.length - 1].update({
			data: []
		}, false);

		var pointCnt = 0;

		var maxSeriesIdx = 0;
		var xDataTotal = [];
		each(series, function(v, i){
			if (xDataTotal.length < v.data.length) xDataTotal = $.extend(xDataTotal, v.xData)
        });
		for (var i = 0; i < xDataTotal.length; i++) {
			sum = 0;
			each(series, function (p, k) {
				if (p.name !== '합계' && p.visible === true) {
					each(p.data, function (ob, j) {
						if (ob.x === xDataTotal[i]) {
							if (!isNaN( ob.y )) {
								sum += ob.y;
							}
						}
					});
				}
			});
			series[series.length - 1].addPoint({
				y: parseInt(sum),
				x: xDataTotal[i]
			}, false);
		}
		chart.redraw();
	}

	function refreshGrpCmp() {
		HmTreeGrid.updateData($grpTree, HmTree.T_GRP_IF);
	}
	function refreshIfCmp() {
		Main.searchIfList();
    }
$(function() {
	Main.initVariable();
	Main.observe();
	$('#section').css('display', 'block');
	Main.initDesign();
	Main.initData();
});