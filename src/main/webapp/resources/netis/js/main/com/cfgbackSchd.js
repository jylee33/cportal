var $schdGrid, $devGrid;

var Main = {
    /** variable */
    initVariable: function() {
        $schdGrid = $('#schdGrid'), $devGrid = $('#devGrid');
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
            case 'btnAdd': this.addSchd(); break;
            case 'btnEdit': this.editSchd(); break;
            case 'btnDel': this.delSchd(); break;
            case 'btnAdd_dev': this.addDev(); break;
            case 'btnSave_dev': this.saveDev(); break;
            case 'btnDel_dev': this.delDev(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        HmGrid.create($schdGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    // contenttype: 'application/json',
                    // datafields:[
                    //     { name:'cfgbackSchdNo', type:'string' },
                    //     { name:'cfgbackSchdType', type:'string' },
                    //     { name:'cronType', type:'string' },
                    //     { name:'cfgbackSchdNm', type:'string' },
                        // { name:'command', type:'string' },
                        // { name:'moreFormat', type:'string' },
                        // { name:'commandDesc', type:'string' },
                        // { name:'modifyDate', type:'string' },
                        // { name:'withoutPauseCommand', type:'string' },
                    // ]
                },
                {
                    formatData: function(data) {
                        var sCfgbackSchdNm = $('#sCfgbackSchdNm').val();
                        if(sCfgbackSchdNm.length != 0)
                            data.sCfgbackSchdNm = sCfgbackSchdNm;
                        return data;
                    }
                }
            ),
            selectionmode: 'singleRow',
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '주기 설정');
            },
            columns: [
                { text: 'cfgbackSchdNo', datafield: 'cfgbackSchdNo', hidden: true},
                { text: 'cfgbackSchdType', datafield: 'cfgbackSchdType', hidden: true},
                { text: 'cronType', datafield: 'cronType', hidden: true},
                { text: '명령어 실행 작업명', datafield: 'cfgbackSchdNm', width: 200},
                { text: '활성화', datafield: 'useFlag', hidden: true},
                { text: '사용여부', datafield: 'useFlagStr', width: 90, cellsalign: 'center'},
                //{ text: '실행상태', datafield: 'runFlagStr', width: 100, cellsalign: 'center'},
                { text: '마지막실행일자', datafield: 'lastRunDtmStr', width: 110, cellsalign: 'center'},
                { text: '주기구분', datafield: 'cronTypeStr', width: 120, cellsalign: 'center'},
                { text: '요일', datafield: 'cronWeekStr', width: 150, cellsalign: 'center'},
                { text: '실행시간', datafield: 'execTimeStr', width: 150, cellsalign: 'right'},
                { text: '스케줄 구분', datafield: 'groupTypeStr', width: 100, cellsalign: 'center'},
                { text: '템플릿', datafield: 'tmplNm', width: 100, cellsalign: 'center'},
                //{ text: '대상장비수', datafield: 'devCnt', width: 150, cellsrenderer: HmGrid.commaNumrenderer },
                { text: '수정자', datafield: 'userName', width: 100, cellsalign: 'center'},
                { text: '설명', datafield: 'memo', minwidth: 150, cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                    var _class = 'jqx-right-align';
                    if(columnproperties.cellsalign !== undefined){
                        _class = 'jqx-'+ columnproperties.cellsalign  + '-align';
                    }
                    return "<div style='margin-top: 7px; margin-right: 5px' class='"+_class+"'>" + value +"</div>";
                }},
            ]
        });

        //btn hide default setting
        $('#btnAdd_dev').hide();
        $('#btnSave_dev').hide();
        $('#btnDel_dev').hide();

        $schdGrid.on('rowdoubleclick', function(event){

            setTimeout(Main.searchDev, 100);

            //btn hide or show
            $('#btnAdd_dev').hide();
            $('#btnSave_dev').hide();
            $('#btnDel_dev').hide();
            if (HmGrid.getRowData($schdGrid).groupType == 1){
                $('#btnAdd_dev').show();
                //$('#btnSave_dev').show();
                $('#btnDel_dev').show();
            }
        });

        HmGrid.create($devGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    // datafields:[
                    //     { name:'mngNo', type:'string' },
                    //     { name:'disDevName', type:'string' },
                    //     { name:'devIp', type:'string' },
                    //     { name:'devKind2', type:'string' },
                    //     { name:'vendor', type:'string' },
                    //     { name:'model', type:'string' },
                    //     // { name:'commandDesc', type:'string' },
                    //     // { name:'modifyDate', type:'string' },
                    //     // { name:'withoutPauseCommand', type:'string' },
                    // ]
                },
                {
                    formatData: function(data) {
                        var schddata = HmGrid.getRowData($schdGrid);
                        if (schddata != null) {
                            data.tmplNo = schddata.tmplNo;
                            data.grpType = schddata.groupType;
                            data.jobNo = schddata.jobNo;
                        }
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '대상장비 설정');
            },
            editmode: 'selectedrow',
            columns: [
                { text: '장비번호', datafield: 'mngNo', hidden: true},
                { text: '장비명', datafield: 'disDevName', minwidth: 120, cellsalign: 'center'},
                { text: '장비IP', datafield: 'devIp', width: 200, cellsalign: 'center'},
                { text: '장비종류', datafield: 'devKind2', width: 150, cellsalign: 'center'},
                { text: '제조사', datafield: 'vendor', width: 180, cellsalign: 'center'},
                { text: '모델', datafield: 'model', width: 180, cellsalign: 'center'},
                { text: '장비위치', datafield: 'devLocation', width: 180, cellsalign: 'center'},
                { text: 'tmplNo', datafield: 'tmplNo', hidden: true},
                { text: 'ConfigBackup 템플릿', datafield: 'tmplNm', width: 120, cellsalign: 'center'}
            ]
        });
    },

    /** init data */
    initData: function() {
        this.search();
    },

    addSchd: function() {
        $.post(ctxPath + '/main/popup/com/pCfgbackSchdAdd.do', function(result) {
             HmWindow.open($('#pwindow'), '스케줄 추가', result, 560, 370, 'pwindow_init', {});
        });
    },

    editSchd: function() {
        var rowData = HmGrid.getRowData($schdGrid);
        if(rowData == null){
            alert('스케줄을 선택하세요.');
            return;
        }
        $.post(ctxPath + '/main/popup/com/pCfgbackSchdEdit.do',
            rowData,
            function(result) {
                HmWindow.openFit($('#pwindow'), "스케줄 수정", result, 560, 370, 'pwindow_init', rowData);
            }
        );
    },

    delSchd: function() {
        var _data = HmGrid.getRowData($schdGrid);
        if(_data == null){
            alert("삭제할 스케줄을 선택해주세요");
            return ;
        }
        var _dataList = [];
        _dataList.push(_data);

        if(_dataList == null) return;

        if(!confirm('Config점검을 삭제하시겠습니까?')) return;
        var _cronList = [];
        var _reserveList = [];
        if(_dataList.cfgbackSchdType == 'crontab'){
            _cronList.push(_dataList.cfgbackSchdNo);
        } else {
            _reserveList.push(_dataList.cfgbackSchdNo);
        }
        var _restPparam = {};
        if(_cronList.length != 0){
            _restPparam.CRON = {
                DELETE: _cronList
            }
        }
        if(_reserveList.length != 0){
            _restPparam.RESERVATION = {
                DELETE: _reserveList
            }
        }

        Server.post('/main/com/cfgbackSchd/delCfgbackSchdList.do', {
            data: {dataList: _dataList},
            success: function(result){
                ServerRest.reqCronTab(_restPparam);
                //alert('삭제되었습니다.');
                alert($i18n.map['msg.del.ok']);
                Main.search();
                $devGrid.jqxGrid('clear');
                $('#pbtnClose').click();
            }//success()
        });//Server.post();
    },

    /** 조회 */
    search: function() {
        HmGrid.updateBoundData($schdGrid, ctxPath + '/main/com/cfgbackSchd/getCfgbackSchdList.do');
    },

    searchDev: function() {
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/com/cfgbackSchd/getCfgbackDevList.do');
    },

    addDev: function () {
        var params = {
            callbackFn: 'pwindow_DevResult'
        };
        HmUtil.createPopup(ctxPath + '/main/popup/com/pCfgbackDevAdd.do', $('#hForm'), 'pCfgbackDevAdd', 1000, 600, params);
    },

    saveDev: function () {
        var _dataList = $devGrid.jqxGrid('getrows');
        if(_dataList == null) return;
        //if(!confirm('[' + _dataList.length +']개의 장비설정을 저장하시겠습니까?')) return;
        var _schdData = HmGrid.getRowData($schdGrid);

        Server.post('/main/com/cfgbackSchd/saveCfgbackDevList.do', {
            data: {dataList: _dataList, jobNo: _schdData.jobNo},
            success: function(result){
                if(_schdData.useFlag == 1){
                    var _restParam = {};
                    if(_schdData.cfgbackSchdType == 'crontab'){
                        _restParam.CRON = {
                            MODIFY: [_schdData.cronNo]
                        };
                    } else {
                        _restParam.RESERVATION = {
                            MODIFY: [_schdData.reserveNo]
                        };
                    }
                    ServerRest.reqCronTab(_restParam);
                }
                //alert('저장되었습니다.');
                Main.searchDev();
            }//success()
        });//Server.post();
    },

    delDev: function () {
        var _delRowId = $devGrid.jqxGrid('getrowid', $devGrid.jqxGrid('getselectedrowindex'));

        if (_delRowId == null){
            //alert('삭제할 장비를 선택하세요.');
            return;
        } else {
            $devGrid.jqxGrid('deleterow', _delRowId);
            setTimeout(function(){
                Main.saveDev()
            })
        }

        // if (confirm('삭제하시겠습니까?')){
        //     $devGrid.jqxGrid('deleterow', _delRowId);
        // }
    }
};

//callback fn
function pwindow_DevResult(list) {
    var addList = [];
    var _dataList = $devGrid.jqxGrid('getrows');
    var pass=1;

    $.each(list, function(idx, item) {
        pass=1;
        for (var i=0; i < _dataList.length; i++){
            console.log('mngno', list.mngNo, _dataList[i].mngNo);
            if (item.mngNo == _dataList[i].mngNo){
                pass = 0;
                console.log('cut');
                return;
            }
        }

        if (pass) {
            addList.push(
                {
                    mngNo: item.mngNo,
                    disDevName: item.disDevName,
                    devIp: item.devIp,
                    devKind2: item.devKind2,
                    model: item.model,
                    vendor: item.vendor,
                    devLocation: item.devLocation,
                    tmplNo: item.tmplNo,
                    tmplNm: item.tmplNm
                });
        }
    });

    $devGrid.jqxGrid('addrow', null, addList);

    setTimeout(function(){
        Main.saveDev();
    })
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});