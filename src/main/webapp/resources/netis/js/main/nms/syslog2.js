var $syslogGrid;
var timer;
var isSearchBtn = false, gridParams = [];
var esDt;
var allResult = [];
var esPageNum=0;
var esFilterData=[];
var filterYMDHMS_FT ='';
var filterLEVEL_VAL ='';
var filterFACILITY_VAL ='';
var filterDEV_NAME ='';
var filterHOST_IP ='';
var filterMSG ='';
var filterGRP_NAME ='';
var isLoadComplete = false;

var syslog_elasticVar = {
        client: null,
        initialize: function () {
        	syslog_elasticVar.client = new elasticsearch.Client({
				protocol: ($('#gEsSslYn').val() || 'N') == 'Y'? 'https' : 'http',
                host: $('#gEsIp').val() + ':' + $('#gEsPort').val(),
                log: 'debug',
            });
        	syslog_elasticVar.client.ping({requestTimeout: 30000}, function (err, resp, status) {
                console.log(status);
            });
        },

        search: function (chartId, processCallback, param, grpList, exceptList) {
            // 차후 몰라서 남김 getDateString Function 사용은 안하는 중
            var getDateString = function (date, point) {
                if (!date instanceof Date) {
                    console.log('Error');
                    return;
                }

                var month = (date.getMonth() + 1);
                month = (month < 10 ? '0' : '') + month;
                return date.getFullYear() + point + month + point + date.getDate();
            };
            if (syslog_elasticVar.client == null) {
                console.log('elastic client is null');
                return;
            }


            var bodyAdd = {};
            // group 처리
            var _grpList = JSON.parse(grpList);
            var addGrpData = "";
            var grpArr = [];
            for(var z=0; z<_grpList.length; z++){
            	var grpNo = _grpList[z].grpNo;
//            	addGrpData += grpNo;
//            	if((z+1)!=_grpList.length){
//            		addGrpData += " ";
//            	}
                grpArr.push(grpNo);
            }
            //grpArr = grpArr.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);


            // 제외메시지 처리
            var _exceptList = JSON.parse(exceptList);
            var exceptArr = [];
            for(var z=0; z<_exceptList.length; z++){
            	var message = _exceptList[z].message;
            	// 특수연산자 \\ 붙이기! [ && || ! ( ) { } [ ] ^ " ~ * ? : \ ]
//            	message = Main.replacExp(message); // 특수 연산자에 안붙여도 데이터 불어와지는거 같아서 주석처리
            	exceptArr.push({
            		multi_match: {
                      query: message,
                      type: "phrase",
                      fields: "MSG"
                    }
            	});
//            	exceptArr.push(message);
            }

            //  "multi_match": {
//            "query": "10.1.1.205 HDA_BMT",
//            "type": "phrase",
//            "fields": "MSG"
//          }

            // sort 처리
            var sortArr = [];
//            this.sortField = null;
//        	this.sortDirection = null;
            if(param.sortField==null){
            	sortArr.push({'YMDHMS': 'desc'});
            }else{
            	var sortDirection = param.sortDirection;
            	var sortField = param.sortField;
            	if(sortField=="YMDHMS_FT") sortField = "YMDHMS";
            	var tmpSort = {};
            	tmpSort[sortField] = sortDirection;
            	sortArr.push(tmpSort);
//            	sortArr[sortField]=sortDirection;
            }

            // var _hostIp = '*';
			// if( (!param.sIp && !filterHOST_IP) ){
            //     _hostIp = '*';
			// }else if( !param.sIp ){
            //     _hostIp = '*'+filterHOST_IP+'*';
			// }else if( !filterHOST_IP){
            //     _hostIp = '*'+param.sIp+'*';
			// }else{
            //     _hostIp = '*'+ param.sIp+' and ' + filterHOST_IP +'*';
			// }
            // console.log(_hostIp);
			//
            // var _devName = '*';
            // if( (!param.sDevName && !filterDEV_NAME) ){
            //     _devName = '*';
            // }else if( !param.sDevName ){
            //     _devName = '*'+filterDEV_NAME+'*';
            // }else if( !filterDEV_NAME){
            //     _devName = '*'+param.sDevName+'*';
            // }else{
            //     _devName = '*'+ param.sDevName+' and ' + filterDEV_NAME +'*';
            // }
            // console.log(_devName);


            gridParams = param;
            syslog_elasticVar.client.search({
                index: param.indexName,
                scroll: '30s',
//                filterPath: ['hits.hits._source.*'], // scroll, total 을 가져오기위해 필터 제거
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    range: {
                                        'YMDHMS': {
                                            gte: param.date1 + param.time1 ,
                                            lte: param.date2 + param.time2
                                        }
                                    }
                                },
//                                {term: {GRP_NO: param.grpNo}},
                                {terms: { GRP_NO: grpArr }},
                               // {wildcard: {MNG_NO: ( (param.itemKind) == 'GROUP' ? '*' : param.grpNo)}},
                                {
                                    query_string: {
                                        default_field: "MNG_NO",
                                        query:  ( (param.itemKind) == 'GROUP' ? '*' : param.grpNo )
                                    }
                                },
								{
                                    query_string: {
                                        default_field: "HOST_IP",
                                        query:   (param.sIp).length>0 ? '*'+param.sIp+'*' : '*'
                                    }
                                },
                                {
                                	query_string: {
                                		default_field: "DEV_NAME",
                                        query:  (param.sDevName).length>0 ? '*'+param.sDevName+'*' : '*'
                                	}
                                },
                                {
                                    query_string: {
                                        default_field: "YMDHMS_FT",
                                        query:  filterYMDHMS_FT.length>0 ? "*"+filterYMDHMS_FT+"*": "*", //"*"+param.sDevName+"*"
                                    }
                                },
                                {
                                    query_string: {
                                        default_field: "LEVEL_VAL",
                                        query:  filterLEVEL_VAL.length>0 ? "*"+filterLEVEL_VAL +"*": "*", //"*"+param.sDevName+"*"
                                    }
                                },
                                {
                                    query_string: {
                                        default_field: "FACILITY_VAL",
                                        query:  filterFACILITY_VAL.length>0 ? "*"+ filterFACILITY_VAL +"*": "*", //"*"+param.sDevName+"*"
                                    }
                                },
                                {
                                    query_string: {
                                        default_field: "MSG",
                                        query:  filterMSG.length>0 ? "*"+filterMSG+"*": "*", //"*"+param.sDevName+"*"
                                    }
                                },
                                {
                                    query_string: {
                                        default_field: "GRP_NAME",
                                        query:  filterGRP_NAME.length>0 ? "*"+filterGRP_NAME+"*": "*", //"*"+param.sDevName+"*"
                                    }
                                },
                            ],
                            must_not: exceptArr,
                            should: [],
							filter: [
								{query_string: {default_field: "HOST_IP", query: filterHOST_IP.length>0 ? "*"+filterHOST_IP+"*": "*" } },
                                {query_string: {default_field: "DEV_NAME", query: filterDEV_NAME.length>0 ? "*"+filterDEV_NAME+"*": "*" } }
							]
                        }
                    },
                    from: 0, size: 100,
                    sort: sortArr,
                    aggs: {}
                }
            }, function getMoreUntilDone(err, resp, stat) {
             	console.log(err, resp, stat);
            	if(resp==null){
            		$('#syslogLoader').jqxLoader('close');
            		return;
            	}
            	if (!resp.hasOwnProperty('hits')) { // 가져온 데이터 없음
            		$('#syslogLoader').jqxLoader('close');
            		return;
            	}

            	var total = resp.hits.total;
            	var result = resp.hits.hits;


        		result.forEach(function(hit) {
					allResult.push(hit._source);
				});

//            	console.log("total:"+resp.hits.total+" , result:"+allResult.length);

            	if ((resp.hits.total > allResult.length) && (Main.syslogPageNum>esPageNum)) {
            		esPageNum++;
            	    // ask elasticsearch for the next set of hits from this search
            		syslog_elasticVar.client.scroll({
            	      scrollId: resp._scroll_id,
            	      scroll: '30s'
            		}, getMoreUntilDone);
            	} else {


            		Main.syslogGridtotalrecords= total;

//            		console.log('every', allResult);

            		esDt = allResult;
                	var list = new Array();

                	// 데이터 존재시 이벤트 정보 조회
                	Server.post('/main/nms/syslog/getTranslateList.do', {
            			data: {},
            			success: function(trans_result) {
//            				console.log(trans_result);

            				Server.post('/main/nms/syslog/getSyslogConfList.do', {
                    			data: {},
                    			success: function(conf_result) {
//                    				console.log(conf_result);

                    				// 바인딩은 마지막 조회한 현재 페이지의 데이터만 넣도록 변경함. - 부하이슈
                    				$.each(result, function(idx, item) {
                                    	var oneDt = item._source;
                                		var msg = oneDt.hasOwnProperty("MSG")?oneDt.MSG:"";

                                		// msg 정보 존재시 사용자 설정 msg로 변경
                                		for (var q=0; q<trans_result.length; q++) {
                                			var trans_msg = trans_result[q].msg;
                                			var trans_userMsg = trans_result[q].userMsg;
                                            if (msg.indexOf(trans_msg)>-1) {
                                            	msg = msg.replace(trans_msg, trans_userMsg);
                                            	oneDt.MSG = msg; // 변경된 메시지로 집어넣음
                                            }
                                        }
                                		// msg에 따른 색상 추가
                        				for(var i=0; i<conf_result.length; i++){
                        					var sysMsg = conf_result[i].sysMsg;
                        					var sysLevel = conf_result[i].sysLevel;
                        					if(msg.indexOf(sysMsg)>-1){
                        						oneDt.sysLevel = sysLevel;
                        					}
                        				}

                                    	list.push(oneDt);
                                	});

//                                	var convertList = JSON.stringify(list);
                                	var source = {
                    				   datatype : "json",
                    				   localdata : list,
                    				   datafields: [
                    	                    { name: 'YMDHMS_FT', type: 'string' },
                    	                    { name: 'LEVEL_VAL', type: 'string' },
                    	                    { name: 'FACILITY_VAL', type: 'string' },
                    	                    { name: 'DEV_NAME', type: 'string' },
                    	                    { name: 'HOST_IP', type: 'string' },
                    	                    { name: 'MSG', type: 'string' },
                    	                    { name: 'GRP_NAME', type: 'string' },
                    	                    { name: "sysLevel", type:"number"}
                    	                ],
                    	                beforeprocessing: function(data) {
                    						if(data != null)
//                    							if(Main.syslogGridtotalrecords == 0)
//                                                    Main.syslogGridtotalrecords = data.resultData.totalrecords;
                    							source.totalrecords = total;
                    					},
                                        sort: function() {
                                            //$syslogGrid.jqxGrid('updatebounddata', 'sort');
                                            //Main.esSort(this);
                                        },
                                        filter: function() {
                                            Main.esFilter(this);
                                            //$syslogGrid.jqxGrid('updatebounddata', 'filter');
                                        }
                    				};

//                    				source.totalrecords = total;

                    				var dataAdapter = new $.jqx.dataAdapter(source);
//                    				console.log("addd..",dataAdapter);
                    				$syslogGrid.jqxGrid({
                    					source: dataAdapter,
                    					virtualmode: true,
                    					rendergridrows: function(params) {
//                    						console.log("render..",dataAdapter);
                    						return dataAdapter.records;
                    					}
                    				});

                    				$('#syslogLoader').jqxLoader('close');
                    			},
                    			error: function(err){
                    				$('#syslogLoader').jqxLoader('close');
                    			}
                    		});

            			},
            			error: function(){
            				$('#syslogLoader').jqxLoader('close');
            			}
            		}); // end Server.post
            	}
            });
        }
};

var syslog_Param = function (dayRange) {
	var btnIdx = $('#btnViewType').jqxButtonGroup('getSelection');
	this.viewType = btnIdx == 0? 'HISTORY' : 'REALTIME';

	var params = Main.getDefGrpParams();
//	this.grpList = Main.getTreeGrpList(params);
	//console.debug(params)
	//params.itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
    this.date1 = null;
    this.time1 = null;
    this.date2 = null;
    this.time2 = null;

    this.grpNo = params.grpNo;
    this.grpType = params.grpType;
    this.grpParent = params.grpParent;
    this.itemKind = params.itemKind;

    this.sIp = $('#sIp').val();
    this.sDevName = $('#sDevName').val();

    // sort
    this.sortField = null;
	this.sortDirection = null;
    var sortInfo= $syslogGrid.jqxGrid('getsortinformation');

    if(sortInfo.sortcolumn!=null){
	    var sortdirection = sortInfo.sortdirection.ascending ? "asc" : "desc";
	    var sortColumnDataField = sortInfo.sortcolumn;

    	this.sortField = sortColumnDataField;
    	this.sortDirection = sortdirection;
    }
    //elastic
    this.indexName = 'syslog_0';

    var that = this;
    (function (that, btnIdx) {
        if (btnIdx != 0) { // REALTIME
        	var _time = $('#cbTime').val();
            var pastDate = new Date() - (86400000/_time);
            that.date1 = $.format.date(pastDate, 'yyyyMMdd');
            that.time1 = $.format.date(pastDate, 'HHmm00');
            that.date2 = $.format.date(new Date(), 'yyyyMMdd');
            that.time2 = $.format.date(new Date(), 'HHmm59');
        } else { // HISTORY
            that.date1 = HmDate.getDateStr($('#date1'));
            that.time1 = HmDate.getTimeStr($('#date1'))+"00";
            that.date2 = HmDate.getDateStr($('#date2'));
            that.time2 = HmDate.getTimeStr($('#date2'))+"59";
        }

    })(that, btnIdx)
}

var Main = {
		syslogGridtotalrecords : 0,
		syslogPageNum: 0,

		/** variable */
		initVariable : function() {
			$cbPeriod = $('#cbPeriod');
			$syslogGrid = $('#syslogGrid');
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
			case "btnSearch": this.search(); break;
			case "btnConf":	this.confPopup(); break;
			case "btnEvtConf":	this.evtConfPopup(); break;
			case "btnExcel": this.exportExcel(); break;
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
			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));
			//Master.createGrpTab(Main.search, {devKind1: 'DEV'});
            HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.search, { devKind1 : 'DEV' });
			$("#syslogLoader").jqxLoader({ width: 100, height: 60, imagePosition: 'top' });

		//	HmDate.create($('#date1'), $('#date2'), HmDate.HOUR, 1);
			$('#btnViewType').jqxButtonGroup({ mode: 'radio', theme: jqxTheme })
				.on('buttonclick', function(event) {
					Main.chgViewType(event.args.button[0].id);
				});
			$('#btnViewType').jqxButtonGroup('setSelection', 0);

			// input timeProcessBar
			$('#prgrsBar').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
			$('#prgrsBar').on('complete', function(event) {
				$(this).val(0);
				Main.search();
			});
			$('#cbRefreshCycle').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
				source: [
				         { label: 'NONE', value: 0 },
				         { label: '30초', value: 30 },
				         { label: '20초', value: 20 },
				         { label: '10초', value: 10 },
				         { label: '5초', value: 5 }
				         ],
		        displayMember: 'label', valueMember: 'value', selectedIndex: 0
			})
			.on('change', function() {
				Main.chgRefreshCycle();
			});

			$('#cbTime').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
				source: [
				         { label: '최근 30분', value: 48 },
				         { label: '최근 1시간', value: 24 },
				         { label: '최근 1일', value: 1 },
				         ],
		        displayMember: 'label', valueMember: 'value', selectedIndex: 0
			});

			var source = {
					datatype: 'json',
	                datafields: [
	                    { name: 'YMDHMS_FT', type: 'string' },
	                    { name: 'LEVEL_VAL', type: 'string' },
	                    { name: 'FACILITY_VAL', type: 'string' },
	                    { name: 'DEV_NAME', type: 'string' },
	                    { name: 'HOST_IP', type: 'string' },
	                    { name: 'MSG', type: 'string' },
	                    { name: 'GRP_NAME', type: 'string' },
	                    { name: "sysLevel", type:"number"}
	                ],
	                localdata: [],
//					root: 'rows',
//					beforeprocessing: function(data) {
//						if(data != null)
//							if(Main.syslogGridtotalrecords == 0)
//                                Main.syslogGridtotalrecords = data.resultData.totalrecords
//							source.totalrecords = Main.syslogGridtotalrecords;
//					},
					sort: function() {
						//$syslogGrid.jqxGrid('updatebounddata', 'sort');
						Main.esSort(this);
					},
					filter: function() {
                        Main.esFilter(this);
						//$syslogGrid.jqxGrid('updatebounddata', 'filter');
					}
			};
			var adapter = new $.jqx.dataAdapter(source);
			var columns = [];

			if($("#gSysLevelColorFlag").val()=="Y"){
				columns = [
				 	{ text: '발생일시', datafield: 'YMDHMS_FT', width: 160, cellclassname: Main.cellclass },
					{ text: 'Severity', datafield: 'LEVEL_VAL', width: 120, cellclassname: Main.cellclass, cellsalign: 'center', cellsrenderer : HmGrid.syslogLevelrenderer, sortable:false, filtertype: 'checkedlist',
                        createfilterwidget: function(row, value, editor) {
                            var s = [ 'Emergency', 'Alert', 'Critical', 'Error', 'Warning', 'Notice', 'Informational', 'Debug'];
                            editor.jqxDropDownList({ source: s, autoDropDownHeight: true });
                        } },
					{ text: 'Facility', datafield: 'FACILITY_VAL', width: 120, cellclassname: Main.cellclass, sortable:false/*, filtertype: 'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: ['Yes', 'No'], autoDropDownHeight: true });
                        } */},
					{ text: '장비명', datafield: 'DEV_NAME', width: 150, cellclassname: Main.cellclass, sortable:false },
					{ text: 'IP', datafield: 'HOST_IP', width: 120, cellclassname: Main.cellclass, sortable:false },
					{ text: '이벤트명', datafield: 'MSG', minwidth: 300, cellclassname: Main.cellclass, sortable:false },
					{ text: '그룹', datafield: 'GRP_NAME', width: 150	, cellclassname: Main.cellclass, sortable:false },
	                { text: "sysLevel",datafield: "sysLevel", width: 40, hidden: true  }
			    ];
			}else{
				columns = [
				 	{ text: '발생일시', datafield: 'YMDHMS_FT', width: 160, cellclassname: Main.cellclass },
                    { text: 'Severity', datafield: 'LEVEL_VAL', width: 120, cellclassname: Main.cellclass, sortable: false, filtertype: 'checkedlist',
                        createfilterwidget: function (row, value, editor) {
                            var s = [ 'Emergency', 'Alert', 'Critical', 'Error', 'Warning', 'Notice', 'Informational', 'Debug'];
                            editor.jqxDropDownList({source: s, autoDropDownHeight: true});
                        }
                    },
					{ text: 'Facility', datafield: 'FACILITY_VAL', width: 120, cellclassname: Main.cellclass, sortable:false/*, filtertype: 'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: ['Yes', 'No'], autoDropDownHeight: true });
                        } */},
					{ text: '장비명', datafield: 'DEV_NAME', width: 150, cellclassname: Main.cellclass, sortable:false },
					{ text: 'IP', datafield: 'HOST_IP', width: 120, cellclassname: Main.cellclass, sortable:false },
					{ text: '이벤트명', datafield: 'MSG', minwidth: 300, cellclassname: Main.cellclass, sortable:false },
					{ text: '그룹', datafield: 'GRP_NAME', width: 150	, cellclassname: Main.cellclass, sortable:false },
	                { text: "sysLevel",datafield: "sysLevel", width: 40, hidden: true  }
			    ];
			}

			HmGrid.create($syslogGrid, {
				source: adapter,
//				virtualmode: true,
//				rendergridrows: function(params) {
//					console.log("render..",adapter);
//					return adapter.records;
//				},
//                 pagesize : 100,
				columns: columns
			}, CtxMenu.SYSLOG);

			$syslogGrid.on("pagechanged", function (event){
			    // event arguments.
			    var args = event.args;
			    // page number.
			    var pagenum = args.pagenum;
//			    console.log(pagenum+"/"+pagesize);
			    Main.syslogPageNum = pagenum;
			    Main.search(1); // page 변경시 e/s 재조회
			});
			$syslogGrid.on("sort", function (event){
			    Main.search(); // sort 변경시 e/s 재조회
			});
            $syslogGrid.on("filter", function (event){
            	Main.search(); // sort 변경시 e/s 재조회
            });
        },

		/** init data */
		initData : function() {

		},
		selectTree: function() {
			Main.search();
		},

		getTreeGrpList: function(params){
			var url = undefined;
			switch (params.grpType){
				case "DEFAULT":
					url = '/grp/getDefaultGrpTreeList.do';
					break;
				case "SEARCH":
					url = '/grp/getSearchGrpTreeList.do';
					break;
			}
			params.isContainDev = true;


			Server.post(url, {
    			data: params,
    			success: function(result) {
    				console.log(result);

    				var grpArr = result;
    				return grpArr;
    			}
			});

		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Main.getDefGrpParams();
			$.extend(params, {
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2')),
				sIp: $('#sIp').val(),
				sDevName: $('#sDevName').val()
			});
			return params;
		},
		cellclass: function(row, columnfield, value) {
			var cellval = $syslogGrid.jqxGrid('getcellvalue', row, 'sysLevel');
			switch(String(cellval)) {
				case '1': return 'info';
				case '2': return 'warning';
				case '3': return 'minor';
				case '4': return 'major';
				case '5': return 'critical';
				default: return null;
			}
		},

		chgViewType: function(btnId) {
			switch(btnId) {
			case 'HISTORY':
				$('.RType').css('display', 'none');
				$('.HType').css('display', 'block');
				break;
			case 'REALTIME':
				$('.RType').css('display', 'block');
				$('.HType').css('display', 'none');
				break;
			}
		},

		/** 새로고침 주기 변경 */
		chgRefreshCycle : function() {
			var cycle = $('#cbRefreshCycle').val();
			if (timer != null)
				clearInterval(timer);
			if (cycle > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar').val();
					if (curVal < 100)
						curVal += 100 / cycle;
					$('#prgrsBar').val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar').val(0);
			}
		},

		searchDevCond: function() {
//			HmGrid.updateBoundData($('#devGrid'), ctxPath + '/dev/getDevList.do');
		},

		search : function(type) {
			if(!isLoadComplete){
				isLoadComplete = true;
				return false;
			}

			if(type!=1){
				Main.syslogGridtotalrecords = 0 // jqxgrid의 paginginformation 초기화를 위해 호출
				Main.syslogPageNum= 0; // 페이지번호 초기화
				$syslogGrid.jqxGrid("gotopage", 0); // jqxgrid의 paginginformation 초기화를 위해 호출
				$syslogGrid.jqxGrid('clear');
				$('#prgrsBar').val(0);
			}

			esPageNum=0;
			allResult = []; // 초기화
			Master.refreshCbPeriod($cbPeriod);

//			HmGrid.updateBoundData($syslogGrid, ctxPath + '/main/nms/syslog/getSyslogList.do');


			// grp list 조회 후 엘라스틱서치 조회
			var params = Main.getDefGrpParams();
			var url = undefined;

			params.isContainDev = true;

			$('#syslogLoader').jqxLoader('open');

			Server.post('/grp/getGrpLeaf.do', { // grp 리스트 조회
    			data: params,
    			success: function(grp_result) {
    				var chartList = [ new syslog_Param() ];

    				var grpArr = grp_result;
    				var grpList = JSON.stringify(grpArr);

    				var url_except = "/main/nms/syslog/getExceptList.do";
    				Server.post(url_except, { // 제외 메시지 리스트 조회
    					data:{},
    					success: function(except_result){

    						var exceptList = JSON.stringify(except_result);

    	    				syslog_elasticVar.initialize();
    	    	            syslog_elasticVar.search('syslogGrid', function (chartName, data) {
    	    	                if (data == undefined) data = null;
    	    	            }, new syslog_Param(), grpList, exceptList);
    					}
    				});

    			},
    			error: function(err){
    				$('#syslogLoader').jqxLoader('close');
    			}
			});


		},

		/*설정팝업*/
		confPopup: function() {
            var params = {
                evtLevel1Text: $('#sEvtLevel1').val(),
                evtLevel2Text: $('#sEvtLevel2').val(),
                evtLevel3Text: $('#sEvtLevel3').val(),
                evtLevel4Text: $('#sEvtLevel4').val(),
                evtLevel5Text: $('#sEvtLevel5').val()
            };
			HmUtil.createPopup('/main/popup/nms/pSyslogConf.do', $('#hForm'), 'pConf', 720, 480, params);
	    },

	    /*이벤트 설정팝업*/
	    evtConfPopup: function() {
            var params = {
                evtLevel1Text: $('#sEvtLevel1').val(),
                evtLevel2Text: $('#sEvtLevel2').val(),
                evtLevel3Text: $('#sEvtLevel3').val(),
                evtLevel4Text: $('#sEvtLevel4').val(),
                evtLevel5Text: $('#sEvtLevel5').val()
            };
            HmUtil.createPopup('/main/popup/nms/pSyslogEvtConf.do', $('#hForm'), 'pEvtConf', 1000, 650, params);
	    },

		/** export Excel */
		// exportExcel: function() {
		// 	HmUtil.exportExcel(ctxPath + '/main/nms/syslog/export_es.do', gridParams);
		// },
        exportExcel: function() {
            HmUtil.exportGrid($syslogGrid, 'Syslog', true);
        },

		/**특수문자 치환*/
		replacExp: function(val){
			var rtnVal = val;
			var regex = /[&&||!\(\)\{\}\[\]^"~\*\?:\\]/gi;
			if(regex.test(rtnVal)){ // 해당 특수문자 존재시 앞에 \\ 붙여서 넘김
				console.log("before:"+rtnVal);
				rtnVal.replace(/&&/gi, /\\\\&\\\\&/);
				rtnVal.replace(/||/gi, /\\\\|\\\\|/);
				rtnVal.replace(/!/gi, /\\\\!/);
				rtnVal.replace(/\(/gi, /\\\\\(/);
				rtnVal.replace(/\)/gi, /\\\\\)/);
				rtnVal.replace(/\{/gi, /\\\\\{/);
				rtnVal.replace(/\}/gi, /\\\\\}/);
				rtnVal.replace(/\[/gi, /\\\\\[/);
				rtnVal.replace(/\]/gi, /\\\\\]/);
				rtnVal.replace(/^/gi, /\\\\^/);
				rtnVal.replace(/"/gi, /\\\\"/);
				rtnVal.replace(/~/gi, /\\\\~/);
				rtnVal.replace(/\*/gi, /\\\\\*/);
				rtnVal.replace(/\?/gi, /\\\\\?/);
				rtnVal.replace(/:/gi, /\\\\:/);
				rtnVal.replace(/\\/gi, /\\\\\\/);
				console.log("after:"+rtnVal);
				rtnVal = val;
			}
//			console.log((regex.test(rtnVal))+"||val: "+ val+" -> " + rtnVal);
			return rtnVal;
		},

    esSort: function(data) {
    	//var filter = $syslogGrid.jqxGrid('getfilterinformation');
        console.log(data)
    },
    esFilter: function(data) {
        var filter = $syslogGrid.jqxGrid('getfilterinformation');

        filterYMDHMS_FT =''; filterLEVEL_VAL =''; filterFACILITY_VAL =''; filterDEV_NAME =''; filterHOST_IP =''; filterMSG =''; filterGRP_NAME ='';
		$.each(filter, function(i, v){
			var filtercolumn =  v.filtercolumn;
            var filterData =  v.filter.getfilters()[0].value;
            console.log(v.filter.getfilters())
            esFilterData.push(
            { "query_string": { "default_field": "\"" + filtercolumn +"\"", "query": "\"*" + filterData +"\"*" } }
			);
            switch(filtercolumn){
				case 'YMDHMS_FT':
					filterYMDHMS_FT = filterData;
					break;
                case 'LEVEL_VAL':
                    filterLEVEL_VAL = v.filter.getfilters()[0].value;
                    for( i=1; i< v.filter.getfilters().length;i++){
                        filterLEVEL_VAL +=" and " + v.filter.getfilters()[i].value
                    }
                    break;
                case 'FACILITY_VAL':
                    // filterFACILITY_VAL = v.filter.getfilters()[0].value;
                    // for( i=1; i< v.filter.getfilters().length;i++){
                    //     filterFACILITY_VAL +=" and " + v.filter.getfilters()[i].value
                    // }
                    filterFACILITY_VAL= filterData;
                    break;
                case 'DEV_NAME':
                    filterDEV_NAME= filterData;
                    break;
                case 'HOST_IP':
                    filterHOST_IP = filterData;
                    break;
                case 'MSG':
                    filterMSG = filterData;
                    break;
                case 'GRP_NAME':
                    filterGRP_NAME = filterData;
                    break;
			}
		});

         // Main.search();

    },
    /** 기본그룹 트리 파라미터  */
    getDefGrpParams: function($treeGrid) {
        if($treeGrid === undefined && $('#dGrpTreeGrid').length != 0){
            $treeGrid = $('#dGrpTreeGrid');
        }
        var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
        var treeItem = HmTreeGrid.getSelectedItem($treeGrid);
        if(treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : _itemKind == 'IF'? treeItem.grpNo.split('_')[2] : treeItem.grpNo.split('_')[1];
            _grpParent = treeItem.grpParent;
        }

        return {
            grpType: 'DEFAULT',
            grpNo: _grpNo,
            grpParent: _grpParent,
            itemKind: _itemKind
        }
    },
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
