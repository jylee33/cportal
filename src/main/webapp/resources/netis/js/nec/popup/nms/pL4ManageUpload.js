var $multiGrid;
var $resultExcel = [], $tabNameList = [], exp, selectTabItem, excelChangeEvent;
var netTypeList = [] , hostNameList = [] , serverParmList = []  , useYnList = [];
var codeList = [] , codeListAll = [];


$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initData();
    PMain.initDesign();
});

var PMain = {
    /** Initialize */
    initVariable: function () {
        $multiGrid = $('#multiGrid');
    },

    /** Event Object */
    observe: function () {
        $("button").bind("click", function (event) {
            PMain.eventControl(event);
        });
    },

    /** Event Control Function */
    eventControl: function (event) {
        switch (event.currentTarget.id) {
            case 'pbtnAdd':
                this.addRow();
                break;
            case 'pbtnSave':
                this.saveMultiList();
                break;
            case 'pbtnDel':
                this.delRow();
                break;
            case 'pbtnDownTmpl':
                this.downTmpl();
                break;
        }
    },


    /** Init Design */
    initDesign: function () {
        // 타이틀 수정
        $('#popupTitle')[0].innerText = ('L4 엑셀 업로드').concat('');

        //파일업로더 설정
        $("#fileUpLoader").jqxLoader({ text: "", isModal: true, width: 60, height: 36, imagePosition: 'top' });

        //시작줄, 끝줄 번호 설정
        $("#startRow, #endRow").jqxInput({placeHolder: "", height: 22, width: 50});

        $("#startRow, #endRow").on('change', function(e){
            // if($.isBlank($('#excelFile').val()) === false && $.isBlank($('#tabNameDropDownList').val()) === false){
            //     exp.setRowNum($('#startRow').val(), $('#endRow').val());
            //     PMain.setBindingGrid();
            // }
        });

        var excelColumns = [];

        //데이터 그리드 생성
        HmGrid.create($multiGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name: 'netType', type: 'int' },
                        { name: 'netTypeStr', type: 'String' },
                        { name: 'fcdbSeq', type: 'int' },
                        { name: 'hostname', type: 'String' },
                        { name: 'l4Vip', type: 'string' },
                        { name: 'vipPurpose', type: 'String' },
                        { name: 'realPort', type: 'String' },
                        { name: 'protocol', type: 'string' },
                        { name: 'lbMethod', type: 'string' },
                        { name: 'health', type: 'String' },
                        { name: 'stickyTime', type: 'string' },
                        { name: 'serverParm', type: 'int' },
                        { name: 'serverParmStr', type: 'string' },
                        { name: 'useDept', type: 'string' },
                        { name: 'manager', type: 'string' },
                        { name: 'dbConnInfo', type: 'string' },
                        { name: 'firewallPolicy', type: 'string' },
                        { name: 'networkConnPolicy', type: 'string' },
                        { name: 'comments', type: 'string' },
                        { name: 'slbName', type: 'string' },
                        { name: 'vipPort', type: 'string' },
                        { name: 'realIp', type: 'string' },
                        { name: 'serverPurpose', type: 'string' },
                        { name: 'serverHostname', type: 'string' },
                        { name: 'useYn', type: 'int' },
                        { name: 'useYnStr', type: 'string' },
                    ]
                },
                {
                    formatData: function (data) {
                        return data;
                    },
                    loadComplete: function (records) {
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            pagerheight: 32,
            editable: true,
            editmode : 'selectedcell',
            columns:
                [

                    { text : '망구분', width : 180 , datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: netTypeList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 170 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : 'Hostname', width : 160 , datafield: 'fcdbSeq', displayfield: 'hostname' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: hostNameList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 150 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : 'L4 VIP *', width : 160 , datafield: 'l4Vip', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'VIP 용도', width : 160 , datafield: 'vipPurpose', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'Real Port', width : 160 , datafield: 'realPort', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'Protocol', width : 160 , datafield: 'protocol', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'LB Method *', width : 160 , datafield: 'lbMethod', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'Health', width : 160 , datafield: 'health', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'Sticky Time *', width : 160 , datafield: 'stickyTime', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '서버팜 용도 *', width : 160 , datafield: 'serverParm' , displayfield: 'serverParmStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: serverParmList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 150 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '사용부서', width : 160 , datafield: 'useDept', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '담당자', width : 160 , datafield: 'manager', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'DB연동정보', width : 160 , datafield: 'dbConnInfo', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '방화벽정책', width : 160 , datafield: 'firewallPolicy', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '망연계정책', width : 160 , datafield: 'networkConnPolicy', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '비고', width : 160 , datafield: 'comments', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'SLB Name *', width : 160 , datafield: 'slbName', cellsalign: 'center' , columngroup: 'slb'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'VIP Port', width : 160 , datafield: 'vipPort', cellsalign: 'center' , columngroup: 'slb'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'Real IP', width : 160 , datafield: 'realIp', cellsalign: 'center' , columngroup: 'slb'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '서버 용도', width : 160 , datafield: 'serverPurpose', cellsalign: 'center' , columngroup: 'slb'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '서버 Hostname', width : 160 , datafield: 'serverHostname', cellsalign: 'center' , columngroup: 'slb'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '사용여부 *', width : 150 , datafield: 'useYn' , displayfield: 'useYnStr' ,  cellsalign: 'center' , columngroup: 'slb' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: useYnList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 100 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    // { text : '(공란)', width : 50 , datafield: 'temp', cellsalign: 'center'},
                 ],
            columngroups: [
                {text: 'SLB설정항목', align: 'center', name: 'slb'},
            ]
        }, CtxMenu.NONE);

        //그리드 컬럼을 엑셀 컬럼으로 동일하게 세팅할 수 있도록 값을 넣어줌
        if(excelColumns == null || excelColumns.length == 0){
            excelColumns = $multiGrid.jqxGrid('columns').records;
        };
        //위에서 추출한 값(컬럼) 정리
        $tabNameList = excelColumns.map(function(d){
            return d.datafield;
        });

        $('#excelFile').on('click', function (e){
            if($('#startRow').val() == '' || $('#endRow').val() == ''){
                //시작번호, 끝번호가 비어있으면 사용자에게 경고문구
                alert('엑셀을 선택하기 전에 시작 Row 번호, 끝 Row 번호가 입력되어야 합니다.');
                e.preventDefault();
            }
            else{
                //시작번호, 끝번호가 존재한 채로 사용자가 '찾아보기'버튼을 누른 경우
                // PMain.setGridDataAndUrlNull($multiGrid, null);
                // $multiGrid.jqxGrid('updateBoundData');

                var params = {
                    startRow : $('#startRow').val(),
                    endRow : $('#endRow').val(),
                    cellName : $tabNameList,
                    result : $resultExcel,
                    selectTabItem : selectTabItem,
                    excelChangeEvent : excelChangeEvent
                }

                exp = new ExcelParse(params);

                $('#excelFile').unbind('change');
                $('#excelFile').on('change',function(e){
                    exp.handleFile(e);

                    var tabNameList = [];

                    setTimeout(function() {
                            if(exp != null) tabNameList = exp.getTabNameList();
                            //표현 컬럼 사이즈 콤보박스
                            // console.log("tabNameList:: "+tabNameList);

                            if($('#tabNameDropDownList').jqxDropDownList('source') === undefined){
                                $('#tabNameDropDownList').jqxDropDownList({
                                    source : tabNameList,
                                    width:150, height:22,
                                    autoDropDownHeight: true, placeHolder:'탭명을 선택해주세요.'
                                }).on('change', function(e){
                                    PMain.setBindingGrid();
                                });
                            }
                            else {
                                $('#tabNameDropDownList').jqxDropDownList({
                                    source : tabNameList,
                                    width:150, height:22,
                                    autoDropDownHeight: true, placeHolder:'탭명을 선택해주세요.'
                                });
                            }

                        },500);
                });
            }
        });

    },

    /** Init Data */
    initData: function () {
        PMain.getCodeAll();
        PMain.getSelHostname();
    },

    setGridDataAndUrlNull : function($grid, $list){
        var source = $grid.jqxGrid('source');
        source._source.localdata = $list;
        source._source.url = null;
        $grid.jqxGrid('source', source);
    },

    setBindingGrid: function(){
        // console.log("---------엑셀 데이터 그리드에 바인딩하기---------");
        exp.setTabName($('#tabNameDropDownList').val());

        ExcelParse.prototype.handleFile(exp.getExcelChangeEvent());

        setTimeout(function() {
                var data = exp.getList();

                //엑셀 데이터로 다른 값 세팅,,
                data = data.map(function(d){

                    if($.isBlank(d.netType) == false){
                        var tempNetTypeStr = d.netType;
                        var findVal = netTypeList.find(v => v.label === tempNetTypeStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.netType = netTypeList[0].value;
                            d.netTypeStr = netTypeList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.netType = findVal.value;
                            d.netTypeStr = findVal.label;
                        }
                    }

                    if($.isBlank(d.fcdbSeq) == false){
                        var tempFcdbSeqStr = d.fcdbSeq;
                        var findVal = hostNameList.find(v => v.label === tempFcdbSeqStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.fcdbSeq = hostNameList[0].value;
                            d.hostname = hostNameList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.fcdbSeq = findVal.value;
                            d.hostname = findVal.label;
                        }

                    }

                    if($.isBlank(d.serverParm) == false){
                        var tempServerParmStr = d.serverParm;
                        var findVal = serverParmList.find(v => v.label === tempServerParmStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.serverParm = serverParmList[0].value;
                            d.serverParmStr = serverParmList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.serverParm = findVal.value;
                            d.serverParmStr = findVal.label;
                        }
                    }

                    if($.isBlank(d.useYn) == false){
                        var tempUseYnStr = d.useYn;
                        var findVal = useYnList.find(v => v.label === tempUseYnStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.useYn = useYnList[0].value;
                            d.useYnStr = useYnList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.useYn = findVal.value;
                            d.useYnStr = findVal.label;
                        }

                    }

                    return d;
                });

                //each 로 돌리면서 값 세팅
                $.each(data,function(idx,item){
                    $multiGrid.jqxGrid('addrow', null, {} );
                    var rows = $multiGrid.jqxGrid('getrows');
                    var tempUID = rows[rows.length - 1].uid;
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'netType', data[idx].netType );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'netTypeStr', data[idx].netTypeStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'fcdbSeq', data[idx].fcdbSeq );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'hostname', data[idx].hostname );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'l4Vip', data[idx].l4Vip );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'vipPurpose', data[idx].vipPurpose );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'realPort', data[idx].realPort );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'protocol', data[idx].protocol );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'lbMethod', data[idx].lbMethod );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'health', data[idx].health );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'stickyTime', data[idx].stickyTime );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'serverParm', data[idx].serverParm );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'serverParmStr', data[idx].serverParmStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'useDept', data[idx].useDept );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'manager', data[idx].manager );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'dbConnInfo', data[idx].dbConnInfo );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'firewallPolicy', data[idx].firewallPolicy );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'networkConnPolicy', data[idx].networkConnPolicy );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'comments', data[idx].comments );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'slbName', data[idx].slbName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'vipPort', data[idx].vipPort );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'realIp', data[idx].realIp );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'serverPurpose', data[idx].serverPurpose );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'serverHostname', data[idx].serverHostname );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'useYn', data[idx].useYn );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'useYnStr', data[idx].useYnStr );

                    rows = $multiGrid.jqxGrid('getrows');
                });
            
            }
            , 500);
    },


    getCodeAll : function(){

        Server.get('/nec/nms/l4Manage/getL4CodeListAll.do', {
            data: {
                menuSeq : $('#menuSeq').val(),
            },
            success: function(result) {

                $.each(result,function(idx,item){

                    if(item.codeType == 1){
                        netTypeList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                    if(item.codeType == 2){
                        serverParmList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                    if(item.codeType == 3){
                        useYnList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                });
            }
        });

    },

    getSelHostname : function(){
        Server.get('/nec/nms/l4Manage/getL4HostnameList.do', {
            data: {
                menuSeq : 2,
                codeType : 6,
            },
            success: function(result) {

                $.each(result,function(idx,item){
                    hostNameList.push({ label: item.hostName , value: item.fcdbSeq , menuSeq : 2 });
                });
            }
        });
    },

    addRow: function(){
        $multiGrid.jqxGrid('addrow', null, {} );
    },


    delRow: function(){
        var rowindexes = $multiGrid.jqxGrid('getselectedrowindexes');
        if(rowindexes.length == 0) {
            alert('삭제할 데이터를 선택하세요.');
            return;
        }
        var delList = [];
        $.each(rowindexes, function(idx, index) {
            var id = $multiGrid.jqxGrid('getrowid', index);
            delList.push(id);
        });
        $.each(delList, function(idx, item) {
            $multiGrid.jqxGrid('deleterow', item);
        });
    },

    saveMultiList : function(){
        var _itemList = $multiGrid.jqxGrid('getboundrows');

        if(_itemList.length < 1){
            alert('저장할 데이터가 없습니다.');
            return;
        }

        var data = $multiGrid.jqxGrid('getrows');
        var chkValid = true;
        data.map(function(d){
            //필수 값이 없으면 저장 불가
            if($.isBlank(d.l4Vip)===true || $.isBlank(d.lbMethod)===true || $.isBlank(d.stickyTime)===true || $.isBlank(d.serverParm)===true || $.isBlank(d.slbName)===true || $.isBlank(d.useYn)===true ){
                chkValid = false;
            }
            if(d.netType == ''){ d.netType = 0 ; }
            if(d.fcdbSeq == ''){ d.fcdbSeq = 0 ; }
        });
        // console.dir(data);

        if(chkValid === false) {
            alert('필수 항목 중 빈 값이 있습니다. 데이터를 확인해주세요.');
            return false;
        }
        else{
            Server.post('/nec/nms/l4Manage/saveMultiList.do', {
                data: {list : _itemList},
                success: function(result) {
                    if(result==1){
                        alert("저장되었습니다.");
                        PMain.close();
                        opener.parent.Main.search();
                    }
                }
            });
        }

    },

    downTmpl : function() {
        var url = ctxPath+'/export/L4_FORMAT_ver2.xlsx';
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=url;
        link.click();
    },

    close : function() {
        self.close();
    },


};
