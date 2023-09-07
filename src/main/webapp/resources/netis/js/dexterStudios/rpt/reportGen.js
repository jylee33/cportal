var $treeGrid;
var Main = {
    /** variable */
    initVariable: function() {
        $treeGrid = $('#dGrpTreeGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnExcel': this.generateRpt(); break;
        }
    },

    /** init design */
    initDesign: function() {
        // 보고서 유형
        HmDropDownList.create($('#sRptType'), {
            source: [
                {label: '네트워크 점검보고서', value: 'nmsRpt'},
                {label: '네트워크 점검보고서(약식)', value: 'nmsShortRpt'},
                {label: '서버 점검보고서', value: 'smsRpt'},
                {label: '서버 점검보고서(약식)', value: 'smsShortRpt'}
            ], width: 250, selectedIndex: 0
        });
        Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));
        HmTreeGrid.create($treeGrid, HmTree.T_GRP_DEFAULT);

        $('#sRptType').on('change', function(event) {
            var rptType = $(this).val();
            if( rptType == 'nmsShortRpt') {
                $('#dailyPeriod').show();
                $('#monthlyPeriod').hide();
                $treeGrid.jqxTreeGrid('source')._options.formatData = function(data) { $.extend(data, {devKind1: 'DEV'}); return data; };
                $treeGrid.jqxTreeGrid('updateBoundData');
                Main.openTreeNode();
            }else if(rptType == 'nmsRpt'){
                $('#monthlyPeriod').show();
                $('#dailyPeriod').hide();
                $('#sDate').jqxDateTimeInput({width: 120, height: '21px', formatString: 'yyyy-MM', theme: jqxTheme, culture: 'ko-KR', views: ["year", "decade"]});
                $treeGrid.jqxTreeGrid('source')._options.formatData = function(data) { $.extend(data, {devKind1: 'DEV'}); return data; };
                $treeGrid.jqxTreeGrid('updateBoundData');
                Main.openTreeNode();
            }else if( rptType == 'smsRpt'){
                $('#monthlyPeriod').show();
                $('#dailyPeriod').hide();
                $('#sDate').jqxDateTimeInput({width: 120, height: '21px', formatString: 'yyyy-MM', theme: jqxTheme, culture: 'ko-KR', views: ["year", "decade"]});
                $treeGrid.jqxTreeGrid('source')._options.formatData = function(data) { $.extend(data, {devKind1: 'SVR', isContainDev: true}); return data; };
                $treeGrid.jqxTreeGrid('updateBoundData');
                Main.openTreeNode();
            }else {
                $('#monthlyPeriod').hide();
                $('#dailyPeriod').show();
                $treeGrid.jqxTreeGrid('source')._options.formatData = function(data) { $.extend(data, {devKind1: 'SVR'}); return data; };
                $treeGrid.jqxTreeGrid('updateBoundData');
                Main.openTreeNode();
            }

        });
        $('#sDate').jqxDateTimeInput({width: 120, height: '21px', formatString: 'yyyy-MM', theme: jqxTheme, culture: 'ko-KR', views: ["year", "month", "decade"]}).val(new Date());


    },

    /** init data */
    initData: function() {

    },
    openTreeNode: function(){

        $treeGrid.on('bindingComplete', function(event) {
                var rows = $treeGrid.jqxTreeGrid('getRows');
                if (rows != null && rows.length > 0) {
                    $treeGrid.jqxTreeGrid('expandRow', $treeGrid.jqxTreeGrid('getKey', rows[0]));
                    var _uid = $treeGrid.jqxTreeGrid('getKey', rows[0]);
                    $treeGrid.jqxTreeGrid('selectRow', _uid);
                }
            $treeGrid.off('bindingComplete');
        });



    },
    generateRpt: function() {
        var grpItem = HmTreeGrid.getSelectedItem($treeGrid);
        if(grpItem == null) {
            alert('보고서를 생성할 그룹을 선택하세요.');
            return;
        }

        var params = {
            rptType: $('#sRptType').val(),
            grpNo: grpItem.grpNo,
            tableCnt: $('#dailyPeriod').val()
        };

        if($('#sRptType').val() == 'smsRpt'){
            if(grpItem.devIp != "" && grpItem.leaf ==true){
                params.grpNo = grpItem.grpNo.split('_')[0];
                params.mngNo = grpItem.grpNo.split('_')[1];
            }else{
                alert('보고서를 생성할 장비를 선택하세요.');
                return false;
            }
        }
        if($('#sRptType').val() == 'nmsRpt' || $('#sRptType').val() == 'smsRpt' ){
            params.fromYmdhms = $.format.date($('#sDate').jqxDateTimeInput('getDate'), 'yyyyMM01000000')
            params.toYmdhms = $.format.date($('#sDate').jqxDateTimeInput('getDate'), 'yyyyMM31235959')
            params.tableCnt = 3;
        }else{
            params.fromYmdhms = $.format.date($('#date1').jqxDateTimeInput('getDate'), 'yyyyMMddHHmmss')
            params.toYmdhms = $.format.date($('#date2').jqxDateTimeInput('getDate'), 'yyyyMMddHHmmss')
        }
        HmUtil.showLoader("보고서를 생성중입니다.");
        Server.post('/dexterStudios/rpt/reportGen/generate.do', {
            data: params,
            success: function(result) {
                HmUtil.hideLoader();
                console.log('file = ' + result);
                var paramsIn = {
                    filePath: result.trim(),
                    fileName: $('#sRptType').jqxDropDownList('getSelectedItem').label
                };
                $('#hForm').empty();
                if(paramsIn !== undefined) {
                    $.each(paramsIn, function(key, value) {
                        $('<input />', { type: 'hidden', id: key, name: key, value: value }).appendTo($('#hForm'));
                    });
                }
                $('#hForm').attr('action', ctxPath + '/file/ozFileDown.do');
                $('#hForm').attr('method', 'post');
                $('#hForm').attr('target', 'hFrame');
                $('#hForm').submit();
            },
            error: function() {
                HmUtil.hideLoader();
                alert('처리 중 에러가 발생하였습니다.');
            }
        });
    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});