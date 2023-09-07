var $rptGrid, $rptSvrGrid, $mainTabs;
var timer_dev, timer_if;
var tt;
var Main = {
		/** variable */
		initVariable : function() {
//			$rptGrid = $('#rptGrid');
//            $rptSvrGrid = $('#rptSvrGrid');
            $mainTabs = $('#mainTabs');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch_dev": this.search(); break;
			case "btnExcel_dev": this.exportChart(); break;
            case 'btnCList_dev': this.showChartData(); break;
			case "btnSearch_if": this.search(); break;
			case "btnExcel_if": this.exportChart(); break;
            case 'btnCList_if': this.showChartData(); break;
			}
		},
		
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.search();
			}
		},

		/** init design */
		initDesign : function() {
			$mainTabs.jqxTabs({ width: '100%', height: '100%',
				initTabContent: function(tab) {
					switch(tab) {
					case 0: //장비
						/** ======== 조회조건 설정 START ========= */
						// 기간
						$('#perf_cbPeriod').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
							displayMember: 'label', valueMember: 'value', selectedIndex: 0,
							source: [
							         { label: '24시간', value: 1 },
							         { label: '1주일', value: 7 },
							         { label: '1개월', value: 30 }
					        ]
						})
						// 그룹
						HmDropDownBtn.createTreeGrid($('#ddbGrp_dev'), $('#grpTree_dev'), HmTree.T_GRP_DEF_ALL, 200, 22, 300, 350, Main.searchDevCond);
						
						// 장비
						$('#ddbDev_dev').jqxDropDownButton({ width: 180, height: 22 })
			            .on('open', function(event) {
			                $('#devGrid_dev').css('display', 'block');
			            });
						var nonSelected = '<div style="position: relative; margin-left: 3px; margin-top: 4px;">' + '선택해주세요' + '</div>'; 
			        	$("#ddbDev_dev").jqxDropDownButton('setContent', nonSelected);
			        	
				        HmGrid.create($('#devGrid_dev'), {
				            source: new $.jqx.dataAdapter(
				                {
				                    datatype: 'json',
				                    url: ctxPath + '/dev/getDevList.do'
				                },
				                {
				                    formatData: function(data) {
				                        var grpSelection = $('#grpTree_dev').jqxTreeGrid('getSelection');
				                        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
				                        $.extend(data, {
				                            isAll: false,
				                            grpType: 'DEFAULT',
				                            grpNo: _grpNo
				                        });
				                        return data;
				                    }
				                }
				            ),
				            columns:
				                [
				                    { text: '장비명', datafield: 'disDevName', minwidth: 150 },
				                    { text: '사용자장비명', datafield: 'userDevName', width: 150 },
				                    { text: 'IP', datafield: 'devIp', width: 100 },
				                    { text: '모델', datafield: 'model', width: 90 },
				                    { text: '제조사', datafield: 'vendor', width: 90 }
				                ],
			                width: 600
				        });
				        $('#devGrid_dev').on('rowselect', function(event) {
				            var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
				            if(rowdata!=null){
//				            	console.log(rowdata);
				            	var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.disDevName + '</div>';
				            	$('#ddbDev_dev').jqxDropDownButton('setContent', content);
				            }else{
				            	// 데이터 없을시 표현,
				            	$('#ddbDev_dev').jqxDropDownButton('setContent', nonSelected);
				            }
				        }).on('bindingcomplete', function(event) {
//				            $(this).jqxGrid('selectrow', 0);
				        }).on('rowdoubleclick', function(event){
				            $('#ddbDev_dev').jqxDropDownButton('close');
				        });
						// 성능지표
						var source = [{ label:"CPU", value:1}, { label:"Memory", value:2}, {label:"온도", value:5}];
						$("#searchUnit").jqxDropDownList({width: 90, height: 21, theme: jqxTheme, autoDropDownHeight: true, source : source, selectedIndex:0});
						/** ======== 조회조건 설정 END ========= */
						
						/** ======== 차트관련 셋팅 START ======== */
						$('#prgrsBar_dev').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
						$('#prgrsBar_dev').on('complete', function(event) {
							Main.search();
							$(this).val(0);
						});
						// 새로고침
						$('#refreshCycleCb_dev').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
							source: [
							         { label: 'NONE', value: 0 },
							         { label: '30초', value: 30 },
							         { label: '1분', value: 60 },
							         { label: '2분', value: 120 },
							         { label: '3분', value: 180 },
							         { label: '4분', value: 240 },
							         { label: '5분', value: 300 }
							         ],
					        displayMember: 'label', valueMember: 'value', selectedIndex: 1
						})
						.on('change', function() {
							Main.chgRefreshCycle("refreshCycleCb_dev", "prgrsBar_dev", 0);
						});
						/** ======== 차트관련 셋팅 END ======== */
						
						// 차트 셋팅
						var seriesArray = [{name: '24시간', data: null, lineWidth: 0.5}, {name: '현재', data: null, lineWidth: 0.5}];
						Main.createChart('devChart', seriesArray, '%', 1, HmHighchart.TYPE_AREA);
						
						break;
					case 1: //회선
						
						/** ======== 조회조건 설정 START ========= */
						// 기간
						$('#perf_cbPeriod_if').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
							displayMember: 'label', valueMember: 'value', selectedIndex: 0,
							source: [
							         { label: '24시간', value: 1 },
							         { label: '1주일', value: 7 },
							         { label: '1개월', value: 30 }
					        ]
						})
						// 그룹
						HmDropDownBtn.createTreeGrid($('#ddbGrp_if'), $('#grpTree_if'), HmTree.T_GRP_DEF_ALL, 200, 22, 300, 350, Main.searchDevCond_if);
						// 장비
						$('#ddbDev_if').jqxDropDownButton({ width: 180, height: 22 })
			            .on('open', function(event) {
			                $('#devGrid_if').css('display', 'block');
			            });
						var nonSelected = '<div style="position: relative; margin-left: 3px; margin-top: 4px;">' + '선택해주세요' + '</div>'; 
			        	$("#ddbDev_if").jqxDropDownButton('setContent', nonSelected);
			        	
				        HmGrid.create($('#devGrid_if'), {
				            source: new $.jqx.dataAdapter(
				                {
				                    datatype: 'json',
				                    url: ctxPath + '/dev/getDevList.do'
				                },
				                {
				                    formatData: function(data) {
				                        var grpSelection = $('#grpTree_if').jqxTreeGrid('getSelection');
				                        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
				                        $.extend(data, {
				                            isAll: false,
				                            grpType: 'DEFAULT',
				                            grpNo: _grpNo
				                        });
				                        return data;
				                    }
				                }
				            ),
				            columns:
				                [
				                    { text: '장비명', datafield: 'disDevName', minwidth: 150 },
				                    { text: '사용자장비명', datafield: 'userDevName', width: 150 },
				                    { text: 'IP', datafield: 'devIp', width: 100 },
				                    { text: '모델', datafield: 'model', width: 90 },
				                    { text: '제조사', datafield: 'vendor', width: 90 }
				                ],
			                width: 600
				        });
				        $('#devGrid_if').on('rowselect', function(event) {
				            var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
				            if(rowdata!=null){
//				            	console.log(rowdata);
				            	var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.disDevName + '</div>';
				            	$('#ddbDev_if').jqxDropDownButton('setContent', content);
				            }else{
				            	// 데이터 없을시 표현,
				            	$('#ddbDev_if').jqxDropDownButton('setContent', nonSelected);
				            }
				        }).on('bindingcomplete', function(event) {
				            $(this).jqxGrid('selectrow', 0);
				            Main.searchIfCond();
				        }).on('rowdoubleclick', function(event){
				            $('#ddbDev_if').jqxDropDownButton('close');
				            Main.searchIfCond();
				        });
				        
				        // 회선
						$('#ddbIf_if').jqxDropDownButton({ width: 180, height: 22 })
			            .on('open', function(event) {
			                $('#ifGrid_if').css('display', 'block');
			            });
						var nonSelected = '<div style="position: relative; margin-left: 3px; margin-top: 4px;">' + '선택해주세요' + '</div>'; 
			        	$("#ddbIf_if").jqxDropDownButton('setContent', nonSelected);
			        	
				        HmGrid.create($('#ifGrid_if'), {
				            source: new $.jqx.dataAdapter(
				                {
				                    datatype: 'json',
				                    url: ctxPath + '/line/getLineList.do'
				                },
				                {
				                    formatData: function(data) {
				                        var grpSelection = $('#grpTree_if').jqxTreeGrid('getSelection');
				                        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
				                        var devSelection = $('#devGrid_if').jqxGrid('getselectedrowindex');
				                        var devInfo = $('#devGrid_if').jqxGrid('getrowdata', devSelection);
				                        var _mngNo = -1;
				                        if(devInfo!=null){
				                        	_mngNo = devInfo.mngNo;
				                        }
				                        $.extend(data, {
				                            isAll: false,
				                            grpType: 'DEFAULT',
				                            grpNo: _grpNo,
				                            mngNo: _mngNo
				                        });
				                        return data;
				                    }
				                }
				            ),
				            columns:
				                [
				                	{ text: '회선번호', datafield: 'ifIdx',  pinned: true, width: 80 },
									{ text: '회선명', datafield: 'ifName',  pinned: true, minwidth: 160 },
									{ text: '회선별칭', datafield: 'ifAlias', width: 130 },
									{ text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer }
				                ],
				             width:500
				        });
				        $('#ifGrid_if').on('rowselect', function(event) {
				            var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
				            if(rowdata!=null){
//				            	console.log(rowdata);
				            	var ifAlias = rowdata.ifAlias;
				            	var ifName = rowdata.ifName;
				            	var displayName = ifName;
				            	if(ifAlias!=null && ifAlias!=""){
				            		displayName = ifAlias;
				            	}
				            	var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + displayName + '</div>';
				            	$('#ddbIf_if').jqxDropDownButton('setContent', content);
				            }else{
				            	// 데이터 없을시 표현,
				            	$('#ddbIf_if').jqxDropDownButton('setContent', nonSelected);
				            }
				        }).on('bindingcomplete', function(event) {
				        	$(this).jqxGrid('selectrow', 0);
				        }).on('rowdoubleclick', function(event){
				            $('#ddbIf_if').jqxDropDownButton('close');
				        });
						// 성능지표
						var source = [{ label:"bps", value:'bps'}, { label:"pps", value:'pps'}];
						$("#searchUnit_if").jqxDropDownList({width: 90, height: 21, theme: jqxTheme, autoDropDownHeight: true, source : source, selectedIndex:0});
						/** ======== 조회조건 설정 END ========= */
						
						/** ======== 차트관련 셋팅 START ======== */
						$('#prgrsBar_if').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
						$('#prgrsBar_if').on('complete', function(event) {
							Main.search();
							$(this).val(0);
						});
						// 새로고침
						$('#refreshCycleCb_if').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
							source: [
							         { label: 'NONE', value: 0 },
							         { label: '30초', value: 30 },
							         { label: '1분', value: 60 },
							         { label: '2분', value: 120 },
							         { label: '3분', value: 180 },
							         { label: '4분', value: 240 },
							         { label: '5분', value: 300 }
							         ],
					        displayMember: 'label', valueMember: 'value', selectedIndex: 1
						})
						.on('change', function() {
							Main.chgRefreshCycle("refreshCycleCb_if", "prgrsBar_if", 0);
						});
						/** ======== 차트관련 셋팅 END ======== */
						
						// 차트 셋팅
						var seriesArray = [{name: '24시간', data: null, lineWidth: 0.5}, {name: '현재', data: null, lineWidth: 0.5}];
						Main.createChart('ifChart', seriesArray, '', 1, HmHighchart.TYPE_AREA);
						
						break;
					}
				}
			});
			// 탭 이동시 타이머 초기화
			$mainTabs.on('selected', function (event) {
				var selectedTab = event.args.item;
			    switch(selectedTab){
			    case 0: // 회선->장비
			    	if (timer_if != null) clearInterval(timer_if);
//			    	$('#prgrsBar_if').val(0);
			    	break;
			    case 1: // 장비->회선
			    	if (timer_dev != null) clearInterval(timer_dev);
//			    	$('#prgrsBar_dev').val(0);
			    	break;
			    }
			});
		},

		/** init data */
		initData : function() {
		},
		
		/** 검색조건 > 장비그리드 조회 */
	    searchDevCond: function() {
	    	console.log("searchDevCond"+new Date());
	        HmGrid.updateBoundData($('#devGrid_dev'), ctxPath + '/dev/getDevList.do');
	    },
	    
	    searchDevCond2: function() {
	    	console.log("searchDevCond2"+new Date());
	        HmGrid.updateBoundData($('#devGrid_dev'), ctxPath + '/dev/getDevList.do');
	    },

		/** 검색조건 > 회선 > 장비그리드 조회 */
	    searchDevCond_if: function() {
	        HmGrid.updateBoundData($('#devGrid_if'), ctxPath + '/dev/getDevList.do');
	    },
	    
	    /** 검색조건 > 회선그리드 조회 */
	    searchIfCond: function() {
	        HmGrid.updateBoundData($('#ifGrid_if'), ctxPath + '/line/getLineList.do');
	    },
	    
		/** 새로고침 주기 변경 */
		chgRefreshCycle : function(cycleId, prgrsId, type) {
			var cycle = $('#'+cycleId).val();
			
			if(type==0){//장비
				if (timer_dev != null)
					clearInterval(timer_dev);
				if (cycle > 0) {
					timer_dev = setInterval(function() {
						var curVal = $('#'+prgrsId).val();
						if (curVal < 100)
							curVal += 100 / cycle;
						$('#'+prgrsId).val(curVal);
					}, 1000);
				} else {
					$('#'+prgrsId).val(0);
				}
			}else if(type==1){//회선
				if (timer_if != null)
					clearInterval(timer_dev);
				if (cycle > 0) {
					timer_if = setInterval(function() {
						var curVal = $('#'+prgrsId).val();
						if (curVal < 100)
							curVal += 100 / cycle;
						$('#'+prgrsId).val(curVal);
					}, 1000);
				} else {
					$('#'+prgrsId).val(0);
				}
				
			}
			
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = {};
			
			switch ($mainTabs.val()) {
				case 0: 
					var $devSearchGrid = $('#devGrid_dev');
					var rowIdx = HmGrid.getRowIdx($devSearchGrid, '장비를 선택해주세요.');
			        if(rowIdx === false){
			        	alert("장비를 선택해 주세요.");
			        	return;
			        }
			        var rowdata = $devSearchGrid.jqxGrid('getrowdata', rowIdx);
			        if(rowdata == null){
			        	alert("장비를 선택해 주세요.");
			        	return;
			        }
			        
			        var grpSelection = $('#grpTree_dev').jqxTreeGrid('getSelection');
			        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
			        $.extend(params, {
			        	period: $('#perf_cbPeriod').val(),
			        	grpType: 'DEFAULT',
			        	grpNo: _grpNo,
			            mngNo: rowdata.mngNo,
			            itemType: $("#searchUnit").val(),
			            devName: rowdata.disDevName,
			            devIp: rowdata.devIp,
			        });
					break;
				case 1: 
					var $devSearchGrid = $('#devGrid_if');
					var rowIdx = $('#devGrid_if').jqxGrid('getselectedrowindex');
			        if(rowIdx == -1){
			        	alert("장비를 선택해 주세요.");
			        	return;
			        }
			        var rowdata = $devSearchGrid.jqxGrid('getrowdata', rowIdx);
			        if(rowdata == null){
			        	alert("장비를 선택해 주세요.");
			        	return;
			        }
			        
			        var $ifSearchGrid = $('#ifGrid_if');
					var rowIdx2 = $('#ifGrid_if').jqxGrid('getselectedrowindex');
			        if(rowIdx2 == -1){
			        	alert("회선을 선택해 주세요.");
			        	return;
			        }
			        var rowdata2 = $ifSearchGrid.jqxGrid('getrowdata', rowIdx2);
			        if(rowdata2 == null){
			        	alert("회선을 선택해 주세요.");
			        	return;
			        }
			        
			        var grpSelection = $('#grpTree_if').jqxTreeGrid('getSelection');
			        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
			        
			        var ifName = rowdata2.ifName;
			        var ifAlias = rowdata2.ifAlias;
			        if(ifAlias!=null&&ifAlias!="") ifName= ifAlias;
			        
			        $.extend(params, {
			        	period: $('#perf_cbPeriod_if').val(),
			        	grpType: 'DEFAULT',
			        	grpNo: _grpNo,
			            mngNo: rowdata.mngNo,
			            ifIdx: rowdata2.ifIdx,
			            itemType: $("#searchUnit_if").val(),
			            devName: rowdata.disDevName,
			            devIp: rowdata.devIp,
			            ifName: ifName
			        });
					break;
			}
//			console.log(params);
			
			return params;
		},
		
		createChart: function(elementName, seriesArray, valUnit, itemType, chartType){
			var commOptions = HmHighchart.getCommOptions(chartType);
			var options = {};
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
		            },
		            type: chartType
		        };
			options.title= {
		        text: '',
		        align: 'left',
		        x: 10
		    },
		    options.subtitle= {
		        text: '',
		        align: 'left',
		        x: 10
		    },
			options.xAxis = {
					type: 'datetime',
					dateTimeLabelFormats: {
						millisecond: '%H:%M:%S.%L',
						second: '%H:%M:%S',
						minute: '%H:%M',
						hour: '%H:%M',
						day: '%m/%d',
						week: '%b-%d',
						month: '%y-%b',
						year: '%Y'
					}
			};
			options.yAxis = [
				{
					labels: {
						format: '{value}'+valUnit
					},
					title: null
				}
			];
			options.tooltip = {
				formatter: function(){
					return Main.perfTooltipFormat(this, 'yyyy-MM-dd HH:mm', parseInt(itemType), valUnit);
				}
			};
			options.legend= {enabled: true};
			options.series = seriesArray;
			
			var hmOptions = $.extend(true, commOptions, options);
			
			HmHighchart.create2(elementName, hmOptions);
		},
		
        /** 성능 차트 툴팁 포멧설정*/
		perfTooltipFormat: function(thisVal, dateFormat, $tabType, valUnit){
//			console.log(thisVal, $tabType, valUnit);
			var xVal = thisVal.x;
			var points = thisVal.points;

			var s = '<b>' + $.format.date(new Date(xVal), dateFormat) + '</b>';
			
			$.each(points, function(key, oneDt) {
				var name = oneDt.series.name;
				var yVal = oneDt.y;

				if(yVal!=null) yVal = Math.abs(yVal);
				if($tabType==0||$tabType==1){
//					if(name.indexOf("OUT pps")>-1 || name.indexOf("OUT bps")>-1){
//						if(yVal!=null) yVal = Math.abs(yVal);
//					}
					s += '<br/>' + name + ': ' + HmUtil.convertUnit1000(yVal)+valUnit;
				}
				else if($tabType==2){
					s += '<br/>' + name + ': ' + (yVal)+valUnit;
				}else
					s += '<br/>' + name + ': ' + HmUtil.convertUnit1000(yVal)+valUnit;
			});
			
			return s;
		},
		
		/** 조회 */
		search : function() {
			switch ($mainTabs.val()) {
				case 0: 
					Main.searchChart_dev();
					Main.chgRefreshCycle("refreshCycleCb_dev", "prgrsBar_dev", 0); 
					break;
				case 1: 
					Main.searchChart_if(); 
					Main.chgRefreshCycle("refreshCycleCb_if", "prgrsBar_if", 0); 
					break;
			}
		},
		/** 새로고침 조회 */
		search_ref: function(){
			switch ($mainTabs.val()) {
			case 0: 
				Main.searchChart_dev(); 
				break;
			case 1: Main.searchChart_if(); break;
		}
		},
		/** 장비탭> 차트 조회 */
		searchChart_dev: function(){
			var params = Main.getCommParams();
			
			// 장비명,IP 세팅
			var info = params.devName+"("+params.devIp+")";
			
			Server.get('/main/rpt/perfCompareRpt/getDevPerfCompareChart.do', {
				data: params,
				success: function(result) {
//					console.log(result);
//					tt = result;
					
					var chData = [],chData2 = [];
					
					var chart = $('#devChart').highcharts();
					
					if(result!=null){
//						var chartData= Main.customChartData(result, 0, params.period);
						
						$.each(result["past"], function(idx, item) {
							var date = HmHighchart.change_date(item.ymdhms);
							var val = item.val; 
							if(val != null) val = parseFloat(val);
							switch(params.period){
							case "1":
								date.setDate(date.getDate()+1); // 현재시간과 동일한 시간대로 맞춤
								break;
							case "7": 
								date.setDate(date.getDate()+7); // 현재시간과 동일한 시간대로 맞춤
								break;
							case "30": 
								date.setMonth(date.getMonth()+1); // 현재시간과 동일한 시간대로 맞춤
								break;
							}
							var time = date.getTime();
							chData.push([time,val]);
						});
						
						$.each(result["now"], function(idx, item) {
							var date = HmHighchart.change_date(item.ymdhms);
							var time = date.getTime();
							var val = item.val; 
							if(val != null) val = parseFloat(val);
							chData2.push([time, val]);
						});
						
					}
					

	            	// series 제거
	                var len = chart.series.length;
	                for (var i = len-1; i>=0; i--) {
	                	chart.series[i].remove();
	                }
	                // series 추가
	                var subTxt = "";
	                var new_serie=[];
	                var x_arr=[];
	                switch(params.period){
		                case "1": // 24시간
		                	new_serie = [ { name: "현재" }, { name: "24시간" } ];
		                	subTxt = "24시간";
			            	break;
			            case "7": // 1주일
		                	new_serie = [ { name: "현재" }, { name: "1주일" } ];
		                	subTxt = "1주일";
			            	break;
			            case "30": // 1개월
		                	new_serie = [ { name: "현재" }, { name: "1개월" } ];
		                	subTxt = "1개월";
			            	break;
	                }
	                chart.setTitle({text: info}, {text:subTxt});
	                
	                for (var y = new_serie.length-1; y >= 0; y--) {
                		chart.addSeries(new_serie[y]);
                	}
	                // series 추가 - end 
	                
					chart.series[0].update({data: chData}, false);
					chart.series[1].update({data: chData2}, false);
					
//					console.log(chData, chData2);
					chart.redraw();
					
				}
			});
		},
		
		/** 
		 * 데이터 조회용 데이터 생성
		 */
		customChartData: function(result, $tabType, period){
			var past_dt = result.past;
			var now_dt = result.now;
			var dateArr = [];
			
			for(var i=0; i<past_dt.length; i++){
				var one_dt = past_dt[i];
				var ymdhms = one_dt.ymdhms;
				var date = HmHighchart.change_date(ymdhms);
				switch(period){
				case "1":
					date.setDate(date.getDate()+1); // 현재시간과 동일한 시간대로 맞춤
					break;
				case "7": 
					date.setDate(date.getDate()+7); // 현재시간과 동일한 시간대로 맞춤
					break;
				case "30": 
					date.setMonth(date.getMonth()+1); // 현재시간과 동일한 시간대로 맞춤
					break;
				}
				var time = date.getTime();
				var strDate = HmHighchart.getConvertTime(date,"","","");
				
				var val = one_dt.val!=null?parseFloat(one_dt.val):null;
				var val2 = one_dt.val2!=null?parseFloat(one_dt.val2):null;
				
				switch ($tabType) {
					case 0: 
						dateArr[strDate]={ymdhms: strDate, time: time, past: val};
						break;
					case 1:
						dateArr[strDate]={ymdhms: strDate, time: time, past_in: val, past_out: val2};
						break;
				}
			}
			
			for(var i=0; i<now_dt.length; i++){
				var one_dt = now_dt[i];
				var ymdhms = one_dt.ymdhms;
				var date = HmHighchart.change_date(ymdhms);
				var time = date.getTime();
				
				var val = one_dt.val!=null?parseFloat(one_dt.val):null;
				var val2 = one_dt.val2!=null?parseFloat(one_dt.val2):null;
				
				switch ($tabType) {
					case 0: 
						if(dateArr.hasOwnProperty(ymdhms)){
							dateArr[ymdhms].now = val;
						}else{
							dateArr[ymdhms]={ymdhms: ymdhms, time: time, now: val};
						}
						break;
					case 1:
						if(dateArr.hasOwnProperty(ymdhms)){
							dateArr[ymdhms].time = time;
							dateArr[ymdhms].now_in = val;
							dateArr[ymdhms].now_out = val2;
						}else{
							dateArr[ymdhms]={ymdhms: ymdhms, time: time, now_in: val, now_out: val2};
						}
						break;
				}
			}
			
			var keys = Object.keys(dateArr);
			var tmp=[];
			for(var i=0; i<keys.length; i++){
				var key = keys[i];
				var oneDt = dateArr[key];
				
				switch ($tabType) {
				case 0: 
					if(!oneDt.hasOwnProperty("past")){
						oneDt.past = null;
					}
					if(!oneDt.hasOwnProperty("now")){
						oneDt.now = null;
					}
					break;
				case 1: 
					if(!oneDt.hasOwnProperty("past_in")){
						oneDt.past_in = null;
					}
					if(!oneDt.hasOwnProperty("past_out")){
						oneDt.past_out = null;
					}
					if(!oneDt.hasOwnProperty("now_in")){
						oneDt.now_in = null;
					}
					if(!oneDt.hasOwnProperty("now_out")){
						oneDt.now_out = null;
					}
					break;
				}
				tmp.push(oneDt);
			}
//			console.log("before.",tmp);
			// 정렬
			function custonSort(a, b) { 
				if(a.ymdhms == b.ymdhms){ return 0} return a.ymdhms > b.ymdhms ? 1 : -1; 
			}
			tmp.sort(custonSort);
				
//			console.log(dateArr);
//			console.log("after.", tmp);
			
			return tmp;
		},
		
		/** 
		 * 데이터 조회용 데이터 생성
		 */
		customChartData2: function(chartData, $tabType){
			var series = chartData.series;
			
//			var past_dt = result.past;
//			var now_dt = result.now;
			var dateArr = [];

			for(var i=0; i<series.length; i++){
				var one_seri = series[i];
				var name = one_seri.name;
				var data = one_seri.data;
				var pastFlag = 0; //0:now, 1:past
				var inoutFlag = 0; //0:in, 1:out
				if(name.indexOf("현재")==-1){pastFlag=1;}
//				if(name.indexOf("IN")>-1){pastFlag=1;}
				for(var k=0; k<data.length; k++){
					var oneDt = data[k];
					var x = oneDt.x;
					var y = oneDt.y; //val
					var tmp_date = new Date(x);
					var ymdhms = HmHighchart.getConvertTime(tmp_date,"-"," ",":");
					
					switch ($tabType) {
					case 0: 
						if(dateArr.hasOwnProperty(ymdhms)){
							if(pastFlag==0){
								dateArr[ymdhms].now = y;
							}else{
								dateArr[ymdhms].past = y;
							}
						}else{
							if(pastFlag==0){
								dateArr[ymdhms]={ymdhms: ymdhms, time: x, now: y};
							}else{
								dateArr[ymdhms]={ymdhms: ymdhms, time: x, past: y};
							}
						}
//						if(pastFlag==0){
//							dateArr[x]={ymdhms: ymdhms, time: x, now: y};
//						}else{
//							dateArr[x]={ymdhms: ymdhms, time: x, past: y};
//						}
						break;
					case 1:
						if(dateArr.hasOwnProperty(ymdhms)){
							if(pastFlag==0){
								dateArr[ymdhms].now = y;
							}else{
								dateArr[ymdhms].past = val;
							}
						}else{
							if(pastFlag==0){
								dateArr[ymdhms]={ymdhms: ymdhms, time: x, now: y};
							}else{
								dateArr[ymdhms]={ymdhms: ymdhms, time: x, past: y};
							}
						}
						break;
					}
				}
			}
				
			var keys = Object.keys(dateArr);
			var tmp=[];
			for(var i=0; i<keys.length; i++){
				var key = keys[i];
				var oneDt = dateArr[key];
				
				switch ($tabType) {
				case 0: 
					if(!oneDt.hasOwnProperty("past")){
						oneDt.past = null;
					}
					if(!oneDt.hasOwnProperty("now")){
						oneDt.now = null;
					}
					break;
				case 1: 
					if(!oneDt.hasOwnProperty("past")){
						oneDt.past = null;
					}
					if(!oneDt.hasOwnProperty("now")){
						oneDt.now = null;
					}
//					if(!oneDt.hasOwnProperty("past_in")){
//						oneDt.past_in = null;
//					}
//					if(!oneDt.hasOwnProperty("past_out")){
//						oneDt.past_out = null;
//					}
//					if(!oneDt.hasOwnProperty("now_in")){
//						oneDt.now_in = null;
//					}
//					if(!oneDt.hasOwnProperty("now_out")){
//						oneDt.now_out = null;
//					}
					break;
				}
				tmp.push(oneDt);
			}
//			console.log("before.",tmp);
			// 정렬
			function custonSort(a, b) { 
				if(a.ymdhms == b.ymdhms){ return 0} return a.ymdhms > b.ymdhms ? 1 : -1; 
			}
			tmp.sort(custonSort);
			
			return tmp;
		},
		
	    
		/** 회선탭> 차트 조회 */
		searchChart_if: function(){
			var params = Main.getCommParams();
			
			// 장비명,IP 세팅
			var info = params.devName+"("+params.devIp+") - "+params.ifName;
			
			Server.get('/main/rpt/perfCompareRpt/getIfPerfCompareChart.do', {
				data: params,
				success: function(result) {
//					console.log("ifChart!!!",result);
//					tt = result;
					
					var chData = [],chData2 = [];
					var chart = $('#ifChart').highcharts();
					
					if(result!=null){
//						var chartData= Main.customChartData(result, 0, params.period);
						
						$.each(result["past"], function(idx, item) {
							var date = HmHighchart.change_date(item.ymdhms);
							var val = item.val; 
							if(val != null) val = parseFloat(val);
							switch(params.period){
							case "1":
								date.setDate(date.getDate()+1); // 현재시간과 동일한 시간대로 맞춤
								break;
							case "7": 
								date.setDate(date.getDate()+7); // 현재시간과 동일한 시간대로 맞춤
								break;
							case "30": 
								date.setMonth(date.getMonth()+1); // 현재시간과 동일한 시간대로 맞춤
								break;
							}
							var time = date.getTime();
							chData.push([time,val]);
						});
						
						$.each(result["now"], function(idx, item) {
							var date = HmHighchart.change_date(item.ymdhms);
							var time = date.getTime();
							var val = item.val; 
							if(val != null) val = parseFloat(val);
							chData2.push([time, val]);
						});
						
					}
					
					chart.yAxis[0].update({
						labels: {
							formatter:function(){
								var val = this.value;
								if(val!=null) val = Math.abs(val);
								return HmUtil.convertUnit1000(Math.abs(val));
							}
						},
						title: null
					});

	            	// series 제거
	                var len = chart.series.length;
	                for (var i = len-1; i>=0; i--) {
	                	chart.series[i].remove();
	                }
	                // series 추가
	                var subTxt = "";
	                var new_serie=[];
	                var x_arr=[];
	                switch(params.period){
		                case "1": // 24시간
		                	new_serie = [ { name: "현재" }, { name: "24시간" } ];
		                	subTxt = "24시간";
			            	break;
			            case "7": // 1주일
		                	new_serie = [ { name: "현재" }, { name: "1주일" } ];
		                	subTxt = "1주일";
			            	break;
			            case "30": // 1개월
		                	new_serie = [ { name: "현재" }, { name: "1개월" } ];
		                	subTxt = "1개월";
			            	break;
	                }
	                chart.setTitle({text: info}, {text:subTxt});
	                for (var y = new_serie.length-1; y >= 0; y--) {
                		chart.addSeries(new_serie[y]);
                	}
	                // series 추가 - end 
	                
					chart.series[0].update({data: chData}, false);
					chart.series[1].update({data: chData2}, false);
					
//					console.log(chData, chData2);
					chart.redraw();
					
				}
			});
		},
		
		/** 데이터 조회 */
		showChartData: function() {
			switch ($mainTabs.val()) {
			case 0: 
		        HmWindow.create($('#pwindow'));
		        
		        var chart = $('#devChart').highcharts();
		        var pastName = "";
		        for(var i=0; i<chart.series.length; i++){
		        	var tmp = chart.series[i].name;
		        	if(tmp.indexOf("현재")==-1){pastName=tmp;}
		        }
		        var chartData = Main.customChartData2(chart, 0);
		        var params = {
		            chartData: chartData,
		            cols: [
		                { text: '일시', datafield: 'ymdhms', cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties){
		                        var html = defaulthtml.match(/<([^>]*)>/gi, '');
		                        return html[0] + value.substr(0, 19) + html[1];
		                    } },
		                { text: pastName, datafield: 'past', width: 100 },
		                { text: '현재', datafield: 'now', width: 100 }
		            ]
		        };

		        $.get(ctxPath + '/main/popup/comm/pChartDataList.do', function(result) {
		            HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 700, 600, 'p2window_init', params);
		        });
		        break;
			case 1:
				
				HmWindow.create($('#pwindow'));
		        
		        var chart = $('#ifChart').highcharts();
		        var pastName = "";
		        for(var i=0; i<chart.series.length; i++){
		        	var tmp = chart.series[i].name;
		        	if(tmp.indexOf("현재")==-1){pastName=tmp;}
		        }
		        var chartData = Main.customChartData2(chart, 1);
		        var params = {
		            chartData: chartData,
		            cols: [
		                { text: '일시', datafield: 'ymdhms', cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties){
		                        var html = defaulthtml.match(/<([^>]*)>/gi, '');
		                        return html[0] + value.substr(0, 19) + html[1];
		                    } },
		                { text: pastName, datafield: 'past', width: 100, cellsrenderer: HmGrid.unit1000renderer },
		                { text: '현재', datafield: 'now', width: 100, cellsrenderer: HmGrid.unit1000renderer }
		            ]
		        };

		        $.get(ctxPath + '/main/popup/comm/pChartDataList.do', function(result) {
		            HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 700, 600, 'p2window_init', params);
		        });
				break;
			}
	    },
	    
		/** export 차트 */
		exportChart: function(){
			var params = Main.getCommParams();

			switch ($mainTabs.val()) {
				case 0: 
					var $chart = $('#devChart');
					HmUtil.saveHighchart($chart.highcharts(), Main.exportExcel_dev, params);
					break;
					
				case 1: 
					var $chart = $('#ifChart');
					HmUtil.saveHighchart($chart.highcharts(), Main.exportExcel_if, params);
					break;
			}
		},
		/** export Excel */
		exportExcel_dev: function(params){
			HmUtil.exportExcel(ctxPath + '/main/rpt/perfCompareRpt/export_dev.do', params);
		},
		exportExcel_if: function(params){
			HmUtil.exportExcel(ctxPath + '/main/rpt/perfCompareRpt/export_if.do', params);
		}
		
};

function refresh() {
	Main.search_ref();
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});