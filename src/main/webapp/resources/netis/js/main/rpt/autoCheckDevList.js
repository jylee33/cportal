var $tab_1, $tab_2;
//var date1; var date2;
var date3; //일별점검의 날짜
var date1; //주간점검의 시작일
var date2; //죽나점검의 종료일

var tabType = 'day';
var Main = {
    /** variable */
    initVariable: function () {
    	$tab_1 = $('#tab_1'), $tab_2 = $('#tab_2'); 
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $tab_2.on("bindingcomplete", function (event) {
        	$tab_1.jqxGrid('clear');
        });
    },

    /** event handler */ 
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
        	case 'btnAdd_dev'	: Main.addDev(); break;
        	case 'btnSearch_dev': Main.serachDev(); break;
        	case 'btnExcel_dev'	: Main.exportExcel(); break;
        }
    },

    /** init design */
    initDesign: function () {
    	$('#mainTabs').jqxTabs({
            height: '100%',
            initTabContent: function(tab){
                switch(tab){
                	case 0: 
                		$("#tab_1").show();
                    	$("#tab_2").hide();
                		Main.tab_1();
                		break;
                }
            }
        })
        .on('selected', function(event) {
        	Main.chgGrpTab(event.args.item);
		})
        HmWindow.create($('#pwindow'), 100, 100);

    },
    //tab선택
    chgGrpTab: function(tab) {
		switch(tab) {
			case 0: 
				Main.tab_1(); 
				tabType = 'day';
				break;
			case 1: 
				Main.tab_2();
				tabType = 'montly';
				break;
					
		}
	},
    /** init data */
    initData: function () {
    	//기본 데이터 세팅
    	//tab1 : 일간점검 -> 기본세팅일자는 오늘
    	var minDate = new Date();
		minDate.setDate(minDate.getDate() - 7);
		
		var mixDate = new Date();
		mixDate.setDate(mixDate.getDate() + 7);
		
    	$('#date3').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme , /*min: minDate,*/ max: mixDate, culture: 'ko-KR'});
    	
    	var today = new Date();
    	today.setDate(today.getDate());
		$('#date3').jqxDateTimeInput('setDate', today);
    	
    	date3 = HmDate.getDateStr($("#date3"));
    	
    	//tab2시작 : 주간점검 -> 기본세팅일자 일주전~오늘
    	var minDate_tab2 = new Date();
    	minDate_tab2.setDate(minDate_tab2.getDate() - 8);
		
		var mixDate_tab2 = new Date();
		mixDate_tab2.setDate(mixDate_tab2.getDate() + 8);
		
		var todayDate_tab2 = new Date();
		todayDate_tab2.setDate(todayDate_tab2.getDate());
		
		$('#date1').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme,  max: todayDate_tab2, culture: 'ko-KR'});
		$('#date2').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme, culture: 'ko-KR'});
		var now = new Date();
		now.setDate(now.getDate()-7);
		$('#date1').jqxDateTimeInput('setDate', now);
		
    	date1 = HmDate.getDateStr($("#date1"));
    	date2 = HmDate.getDateStr($("#date2"));
    },
    
    tab_1 : function () {
    	/*var minDate = new Date();
		minDate.setDate(minDate.getDate() - 7);
		
		var mixDate = new Date();
		mixDate.setDate(mixDate.getDate() + 7);
		
    	$('#date3').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme , min: minDate, max: mixDate});
    	
    	var today = new Date();
    	today.setDate(today.getDate());
		$('#date3').jqxDateTimeInput('setDate', today);
    	
    	//var date1 = HmDate.getDateStr($("#date1"));
    	//var date2 = HmDate.getDateStr($("#date2"));
    	var date3 = HmDate.getDateStr($("#date3"));*/
    	
    	/*$('#date3').on('close', function (event) {
    		 var date = event.args.date;
             var settingDay = new Date();
             settingDay.setDate(date.getDate() + 7);
             $('#date3').jqxDateTimeInput('setDate', date);
    	});*/
    	
    	$("#tab_1").show();
    	$("#tab_2").hide();
    	
    	$("#date1").hide();
    	$("#date2").hide();
    	
    	$("#date3").show();
    	
    	var adp = new $.jqx.dataAdapter({
            datatype: 'json',
            datafields:[
            	 	{ name: 'grpName', type: 'string'},
            	 	{ name: 'disDevName', type: 'string'},
            	 	{ name: 'cpuState', type: 'string'},
            	 	{ name : 'memoryState', type: 'string' },
            	 	{ name: 'isChangeCnt', type: 'string'},
            	 	{ name: 'pingCnt', type: 'string'}
            ],
            url: ctxPath + '/main/rpt/autoCheckDev/getAutoCheckDevList.do',
            //url: ctxPath + '/main/nms/devStatus/getDevStatusList.do',
            data: { autoCheckYn: 'Y', dateType: 'day' , date1: date3}
        },
        {
            formatData: function(data) {
                $.extend(data, {
                	
                });
                return data;
            }
        });
    	
    	HmGrid.create($tab_1, {
            source: adp,
            pageable : false,
            columns: [
                { text : '대상장비', datafield: 'disDevName', width: '20%' },
                { text : 'CPU상태', datafield: 'cpuState', width: '20%' },
                { text : '메모리상태', datafield: 'memoryState', width: '20%' },
                { text : 'config변경여부', datafield : 'isChangeCnt', width: '20%',
					cellsrenderer: function(row, column, value, rowData){
						return '<div class="jqx-grid-cell-left-align" style="margin-top: 2.5px;">'+ value +' 회 변경' +'</div>';
					}
					
				},
				{ text : '통신장애수', datafield : 'pingCnt', width: '20%',
					cellsrenderer: function(row, column, value, rowData){
						return '<div class="jqx-grid-cell-left-align" style="margin-top: 2.5px;">'+ value +' 건' +'</div>';
					}
					
				}
            ]
    	});
    },
    
    tab_2 : function () {
    	/*var minDate = new Date();
		minDate.setDate(minDate.getDate() - 8);
		
		var mixDate = new Date();
		mixDate.setDate(mixDate.getDate() + 8);
		
		var todayDate = new Date();
		todayDate.setDate(todayDate.getDate());
		
		$('#date1').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme,  max: todayDate});
		$('#date2').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme,  min:minDate , max: todayDate});
		var now = new Date();
		now.setDate(now.getDate()-7);
		$('#date1').jqxDateTimeInput('setDate', now);
		
    	var date1 = HmDate.getDateStr($("#date1"));
    	var date2 = HmDate.getDateStr($("#date2"));*/
    	
    	/*$('#date1').on('close', function (event) {
            var date = event.args.date;
            var settingDay = new Date();
            settingDay.setDate(date.getDate() + 7);
            console.log(settingDay+ "   "+ todayDate);
            
            if(settingDay > todayDate){ //세팅이 더 클 경우
            	$('#date2').jqxDateTimeInput('setDate', todayDate);
            }else{ //세팅 날짜가 더 적을경우 
            	$('#date2').jqxDateTimeInput('setDate', settingDay);
            }
            //$('#date2').jqxDateTimeInput('setDate', settingDay);
    	});
    	
    	$('#date2').on('close', function (event) {
            var date = event.args.date;
            var settingDay = new Date();
            settingDay.setDate(date.getDate() -7);
            console.log("종료!"+settingDay)
            $('#date1').jqxDateTimeInput('setDate', settingDay);
            
    	});*/
    	
    	$("#tab_2").show();
    	$("#tab_1").hide();
    	
    	$("#date1").show();
    	$("#date2").show();
    	$("#date3").hide();

    	
    	var adp = new $.jqx.dataAdapter({
            datatype: 'json',
            datafields:[
            	 	{ name: 'grpName', type: 'string'},
            	 	{ name: 'disDevName', type: 'string'},
            	 	{ name: 'cpuState', type: 'string'},
            	 	{ name : 'memoryState', type: 'string' },
            	 	{ name: 'isChangeCnt', type: 'string'},
            	 	{ name: 'pingCnt', type: 'string'}
            ],
            url: ctxPath + '/main/rpt/autoCheckDev/getAutoCheckDevList.do',
            data: { autoCheckYn: 'Y', dateType: 'montly' , date1: date1, date2: date2}
        },
        {
            formatData: function(data) {
                $.extend(data, {

                });
                return data;
            }
        });
    	
    	HmGrid.create($tab_2, {
            source: adp,
            pageable : false,
            columns: [
            	{ text : '대상장비', datafield: 'disDevName', width: '20%' },
                { text : 'CPU상태', datafield: 'cpuState', width: '20%' },
                { text : '메모리상태', datafield: 'memoryState', width: '20%' },
                { text : 'config변경여부', datafield : 'isChangeCnt', width: '20%',
					cellsrenderer: function(row, column, value, rowData){
						return '<div class="jqx-grid-cell-left-align" style="margin-top: 2.5px;">'+ value +' 회 변경' +'</div>';
					}
					
				},
				{ text : '통신장애수', datafield : 'pingCnt', width: '20%',
					cellsrenderer: function(row, column, value, rowData){
						return '<div class="jqx-grid-cell-left-align" style="margin-top: 2.5px;">'+ value +' 건' +'</div>';
					}
					
				}
            ]
    	});
    },
    
    addDev: function () {
    	HmUtil.createPopup('/main/popup/rpt/autoCheckDevSetting.do', $('#hForm'), 'pScanMultiAdd', 1500, 850);
    },
    
    refresh: function(){
    	Main.tab_1();
    },
    
    serachDev: function(){
    	if(tabType == 'day'){
    		Main.tab_1();
    	}else{
    		Main.tab_2();
    	}
    	
    },
    
    exportExcel: function(){
    	var dateType = '';
    	if(tabType == 'day'){
    		var params = {
    				date1: date3,
					autoCheckYn : 'Y',
					dateType 	: 'day'
			};
    		
    	}else{
			var params = {
					date1: date1, 
					date2: date2,
					autoCheckYn : 'Y',
					dateType 	: 'montly'
			};
    	};
		HmUtil.exportExcel(ctxPath + '/main/rpt/autoCheckDev/export.do', params);
    }

};


$(function () {
    Main.initVariable();
    Main.initData();
    Main.initDesign();
    Main.observe();
    
    $('#date3').on('close', function (event) {
		var date = event.args.date;
        var settingDay = new Date();
        settingDay.setDate(date.getDate() + 7);
        $('#date3').jqxDateTimeInput('setDate', date);
        date3 = HmDate.getDateStr($("#date3"));
	});
    
    $('#date1').on('close', function (event) {
        var date = event.args.date;
        var settingDay = new Date();
        var setDay = event.args.date;
        setDay.setDate(date.getDate() + 7);
        
        var todayDate = new Date();
		todayDate.setDate(todayDate.getDate());
		
		var minDate = new Date();
    	minDate.setDate(minDate.getDate() - 7); 
    	console.log("선택: "+date  +"    "+settingDay+ "   "+ todayDate +"::::::"+ setDay)
        if(setDay >= todayDate){ //세팅일이 더 클 경우 종료일은 오늘
        	//$('#date2').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme,  /*min:minDate,*/ max: todayDate});
        	$('#date2').jqxDateTimeInput('setDate', todayDate);
        	$('#date1').jqxDateTimeInput('setDate', date);
        	
        	date1 = HmDate.getDateStr($("#date1"));
        	date2 = HmDate.getDateStr($("#date2"));
        }else{ //세팅 날짜가 더 적을경우 종료일은 일주일 후
        	//min현재 선택값,  max 오늘까지
        	//$('#date2').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme,  min:date , max: todayDate});
        	//$('#date1').jqxDateTimeInput('setDate', date);
        	$('#date2').jqxDateTimeInput('setDate', date);
        	
        	//date1 = HmDate.getDateStr($("#date1"));
        	date2 = HmDate.getDateStr($("#date2"));
        }
	});
	
	$('#date2').on('close', function (event) {
        var date = event.args.date;
        var settingDay = new Date();
        date.setDate(date.getDate() -7);
        $('#date1').jqxDateTimeInput('setDate', date);
        date1 = HmDate.getDateStr($("#date1"));
        
	});
});