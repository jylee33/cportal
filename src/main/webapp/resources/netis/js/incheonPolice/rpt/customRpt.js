var Main = {
	/** variable */
	initVariable : function() {},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportData(); break;
			case 'btnPageSetting': this.pageSetting(); break;
		}//switch(curTarget.id)
	},

	/** init design */
	initDesign : function() {

        HmWindow.create($('#pwindow'), 100, 100, 999);

		$('#date1, #date2').jqxDateTimeInput({
			width: 120, height: 20, theme: jqxTheme, formatString: HmDate.FS_SHORT, culture: 'ko-KR',
			enableBrowserBoundsDetection: true, value: new Date()
		});
	},

	/** init data */
	initData: function() {
		Main.search();
	},
	search: function() {
		var _date1 = $('#date1').val();
		var _date2 = $('#date2').val();
		$('#l_date').text( _date1 + ' ~ ' + _date2 );

        Server.post('/incheonPolice/rpt/customRpt/getCustomRptData.do',{
            data: {date1: _date1.replace(/-/gi, ""), date2: _date2.replace(/-/gi, "")},
            success: function(result){
                console.log('custom_RPT_data_result', result);
                //title 적용
                for(var i = 0 ; i < result.titleList.length; i++){
                    $('#title_'+result.titleList[i].titleNo).text(result.titleList[i].titleNm);
                }//for end(i)

                //sub title 적용
                for(var i = 0 ; i < result.subTitleList.length; i++){
                    var _item = result.subTitleList[i];
                    $('#subTitle_' + _item.titleNo + '_' + _item.subNo).text(_item.subNm);
                }//for end(i)

                //sub title detail 적용
                for(var i = 0 ; i < result.subTitleDetailList.length; i++){
                    var _item = result.subTitleDetailList[i];
                    $('#subTitleDetail_' + _item.titleNo + '_' + _item.subNo + '_' + _item.indexNo + '_nm').text(_item.indexNm);
                    if(_item.inOut == 'IN'){
                    	$('#subTitleDetail_' + _item.titleNo + '_' + _item.subNo + '_' + _item.indexNo + '_data').text(_item.maxInbps + '(' + _item.maxInbpsPer + ')');
					} else {
                    	$('#subTitleDetail_' + _item.titleNo + '_' + _item.subNo + '_' + _item.indexNo + '_data').text(_item.maxOutbps + '(' + _item.maxOutbpsPer + ')');
					}
                }//for end(i)
            }//success
        });//Server.post
	},

	exportData: function(){
        var _excelParam = {
        	fileName: $('#navMenuNm').text(),
        	date1: $('#date1').val().replace(/-/gi, ""),
        	date2: $('#date2').val().replace(/-/gi, ""),
            l_date: $('#l_date').text()
		}

        // HmUtil.exportExcel(ctxPath + '/main/rpt/dailyDevRpt/export.do', params)
        HmUtil.exportExcel(ctxPath + '/incheonPolice/rpt/customRpt/export.do', _excelParam)
	},
    pageSetting: function(){
        //HmWindow.createNewWindow('pwindow');

        $.post(ctxPath + '/incheonPolice/popup/rpt/pCustomPageSetting.do',
            null,
            function(result) {
                HmWindow.open($('#pwindow'), '보고서 셋팅', result, 1500, 720);
            }
        );
    }
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});