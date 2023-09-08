var $privacyGrid, $privacyAgreeGrid;

var Main = {
    /** variable */
    initVariable: function() {
        $privacyGrid = $('#privacyGrid');
        $privacyAgreeGrid = $('#privacyAgreeGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.search(); break;
            case 'btnAdd': this.add(); break;
            case 'btnEdit': this.edit(); break;
            case 'btnDel': this.del(); break;
        }
    },

    /** init design */
    initDesign: function() {
        $('#mainTabs').jqxTabs({
            width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmGrid.create($privacyGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/com/privacyPolicy/getPrivacyPolicyList.do'
                                },
                                {
                                    formatData: function(data) {
                                        data.policyType = 0;
                                        return data;
                                    }
                                }
                            ),
                            pageable: false,
                            columns: [
                                {text: '제목', datafield: 'title', minwidth: 80 },
                                {text: '작성자', datafield: 'regUser', displayfield: 'disRegUser', width: 120 },
                                {text: '작성일시', datafield: 'regDate', width: 160}
                            ]
                        });
                        $privacyGrid.on('rowdoubleclick', function(event) {
                            var rowIdx = event.args.rowindex;
                            var item = $privacyGrid.jqxGrid('getrowdata', rowIdx);
                            Main.popContents(item);
                        });
                        break;
                    case 1:
                        HmGrid.create($privacyAgreeGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/com/privacyPolicy/getPrivacyPolicyList.do'
                                },
                                {
                                    formatData: function(data) {
                                        data.policyType = 1;
                                        return data;
                                    }
                                }
                            ),
                            pageable: false,
                            columns: [
                                {text: '제목', datafield: 'title', minwidth: 80 },
                                {text: '작성자', datafield: 'regUser', displayfield: 'disRegUser', width: 120 },
                                {text: '작성일시', datafield: 'regDate', width: 160}
                            ]
                        });
                        $privacyAgreeGrid.on('rowdoubleclick', function(event) {
                            var rowIdx = event.args.rowindex;
                            var item = $privacyAgreeGrid.jqxGrid('getrowdata', rowIdx);
                            Main.popContents(item);
                        });
                        break;
                }
            }
        });


    },

    /** init data */
    initData: function() {
        this.search();
    },

    search: function() {
        switch($('#mainTabs').val()) {
            case 0:
                HmGrid.updateBoundData($privacyGrid, ctxPath + '/main/com/privacyPolicy/getPrivacyPolicyList.do');
                break;
            case 1:
                HmGrid.updateBoundData($privacyAgreeGrid, ctxPath + '/main/com/privacyPolicy/getPrivacyPolicyList.do');
                break;
        }
    },
    popContents: function(data){

        $.post(ctxPath + '/main/popup/com/pPrivacyPolicyDetail.do', function(result) {
            HmWindow.open($('#pwindow'), data.policyType == 0 ? '처리지침': '동의서', result, 600, 600, 'pwindow_init', data );
        });
    },
    add: function(){
        // var type = $('#mainTabs').val()
        var params = {policyType: $('#mainTabs').val()};
        $.post(ctxPath + '/main/popup/com/pPrivacyPolicyAdd.do', params, function(result) {
            HmWindow.open($('#pwindow'), '추가', result, 550, 550, 'pwindow_init', params );
        });
    },
    edit: function(){
        var rowdata;
        var type;
        switch($('#mainTabs').val()) {
            case 0:
                type = '처리지침을';
                var rowIdx = HmGrid.getRowIdx($privacyGrid, type + ' 선택해주세요.');
                if(rowIdx === false) return;
                rowdata = $privacyGrid.jqxGrid('getrowdata', rowIdx);
                break;
            case 1:
                type = '동의서를';
                var rowIdx = HmGrid.getRowIdx($privacyAgreeGrid, type + ' 선택해주세요.');
                if(rowIdx === false) return;
                rowdata = $privacyAgreeGrid.jqxGrid('getrowdata', rowIdx);
                break;
        }

        var params = {
            policyNo: rowdata.policyNo,
            policyType: rowdata.policyType,
            title: rowdata.title,
            content: rowdata.content
        };

        $.post(ctxPath + '/main/popup/com/pPrivacyPolicyEdit.do', params, function(result) {
            HmWindow.open($('#pwindow'), '수정', result, 550, 550, 'pwindow_init', params );
        });
    },
    del: function(){
        var rowdata;
        var type;
        switch($('#mainTabs').val()) {
            case 0:
                type = '처리지침을';
                var rowIdx = HmGrid.getRowIdx($privacyGrid, type + ' 선택해주세요.');
                if(rowIdx === false) return;
                rowdata = $privacyGrid.jqxGrid('getrowdata', rowIdx);
                if(!confirm('[' + rowdata.title + '] 처리지침을 삭제하시겠습니까?')) return;
                break;
            case 1:
                type = '동의서를';
                var rowIdx = HmGrid.getRowIdx($privacyAgreeGrid, type + ' 선택해주세요.');
                if(rowIdx === false) return;
                rowdata = $privacyAgreeGrid.jqxGrid('getrowdata', rowIdx);
                if(!confirm('[' + rowdata.title + '] 처리지침을 삭제하시겠습니까?')) return;
                break;
        }
        Server.post('/main/com/privacyPolicy/delPrivacyPolicy.do', {
            data: { policyNo: rowdata.policyNo },
            success: function(result) {
                $privacyGrid.jqxGrid('deleterow', rowdata.uid);
                alert(result);
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