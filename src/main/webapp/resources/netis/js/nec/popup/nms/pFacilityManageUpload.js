var $multiGrid;
var $resultExcel = [], $tabNameList = [], exp, selectTabItem, excelChangeEvent;
var typeIdList = [] , netTypeList = [] , areaNameList = [] , layerList = [] , mTypeList = [] , historyManageList = [];
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
        $('#popupTitle')[0].innerText = ('시설DB 엑셀 업로드').concat('');

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
                        { name: 'typeId', type: 'int' },
                        { name: 'typeIdStr', type: 'String' },
                        { name: 'netType', type: 'int' },
                        { name: 'netTypeStr', type: 'String' },
                        { name: 'areaName', type: 'int' },
                        { name: 'areaNameStr', type: 'String' },
                        { name: 'hostName', type: 'string' },
                        { name: 'layer', type: 'int' },
                        { name: 'layerStr', type: 'String' },
                        { name: 'purpose', type: 'string' },
                        { name: 'mType', type: 'int' },
                        { name: 'mTypeStr', type: 'String' },
                        { name: 'vendorName', type: 'string' },
                        { name: 'commIp', type: 'string' },
                        { name: 'manageIp', type: 'string' },
                        { name: 'connType', type: 'string' },
                        { name: 'manageCoupFl', type: 'int' },
                        { name: 'manageCoupFlStr', type: 'String' },
                        { name: 'tacacsConnFl', type: 'int' },
                        { name: 'tacacsConnFlStr', type: 'String' },
                        { name: 'tacacsManageFl', type: 'int' },
                        { name: 'tacacsManageFlStr', type: 'String' },
                        { name: 'directConnFl', type: 'int' },
                        { name: 'directConnFlStr', type: 'String' },
                        { name: 'directManageFl', type: 'int' },
                        { name: 'directManageFlStr', type: 'String' },
                        { name: 'syslogFl', type: 'int' },
                        { name: 'syslogFlStr', type: 'String' },
                        { name: 'commerceTitle', type: 'string' },
                        { name: 'installDate', type: 'string' },
                        { name: 'warrantyExpire', type: 'string' },
                        { name: 'serialNo', type: 'string' },
                        { name: 'durableYears', type: 'string' },
                        { name: 'historyManage', type: 'int' },
                        { name: 'historyManageStr', type: 'String' },
                        { name: 'manager', type: 'string' },
                        { name: 'comments', type: 'string' },
                        { name: 'manageCorp', type: 'string' },
                        { name: 'manageName', type: 'string' },
                        { name: 'managePhone', type: 'string' },
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
                    { text : '분류 *', width : 150 , datafield: 'typeId', displayfield: 'typeIdStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            if(typeIdList.length >20){
                                editor.jqxDropDownList({ source: typeIdList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: false , dropDownWidth : 200 , dropDownHeight: 300});
                            }else{
                                editor.jqxDropDownList({ source: typeIdList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 150 });
                            }

                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '망구분 *', width : 160 , datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            if(netTypeList.length >20){
                                editor.jqxDropDownList({ source: netTypeList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: false , dropDownWidth : 200 , dropDownHeight: 300});
                            }else{
                                editor.jqxDropDownList({ source: netTypeList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 150 });
                            }
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '지역 *', width : 200 , datafield: 'areaName', displayfield: 'areaNameStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            if(areaNameList.length >20){
                                editor.jqxDropDownList({ source: areaNameList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: false , dropDownWidth : 200 , dropDownHeight: 300});
                            }else{
                                editor.jqxDropDownList({ source: areaNameList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 200 });
                            }
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'Hostname *', width : 160 , datafield: 'hostName', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'Layer', width : 100 , datafield: 'layer', displayfield: 'layerStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            if(layerList.length >20){
                                editor.jqxDropDownList({ source: layerList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: false , dropDownWidth : 200 , dropDownHeight: 300});
                            }else{
                                editor.jqxDropDownList({ source: layerList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 200 });
                            }
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '용도', width : 160 , datafield: 'purpose', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '장비종류 *', width : 160 , datafield: 'mType', displayfield: 'mTypeStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            if( mTypeList.length > 20 ){
                                editor.jqxDropDownList({ source: mTypeList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: false , dropDownWidth : 160 , dropDownHeight: 300});
                            }else{
                                editor.jqxDropDownList({ source: mTypeList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 160 });
                            }

                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '제조사', width : 160 , datafield: 'vendorName', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    //
                    { text : '통신 IP', width : 160 , datafield: 'commIp', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },

                    { text : '관리망 IP', width : 160 , datafield: 'manageIp', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '접속방법', width : 160 , datafield: 'connType', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '관리망 연동', width : 160 , datafield: 'manageCoupFl', cellsalign: 'center' , columntype: 'checkbox'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '통신', width : 160 , datafield: 'tacacsConnFl', cellsalign: 'center' , columngroup: 'tacacs' , columntype: 'checkbox'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '관리', width : 160 , datafield: 'tacacsManageFl', cellsalign: 'center' , columngroup: 'tacacs' , columntype: 'checkbox'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '통신', width : 160 , datafield: 'directConnFl', cellsalign: 'center' , columngroup: 'direct' , columntype: 'checkbox'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '관리', width : 160 , datafield: 'directManageFl', cellsalign: 'center' , columngroup: 'direct' , columntype: 'checkbox'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : 'Syslog 수집', width : 160 , datafield: 'syslogFl', cellsalign: 'center' , columntype: 'checkbox'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },

                    { text : '사업명', width : 160 , datafield: 'commerceTitle', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '도입일 *', width : 160 , datafield: 'installDate', cellsalign: 'center' , cellsformat: 'yyyy-MM-dd HH:mm'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'Warranty 만기일', width : 160 , datafield: 'warrantyExpire', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : 'Serial No', width : 160 , datafield: 'serialNo', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '내용연수', width : 160 , datafield: 'durableYears', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },

                    { text : '이력관리 *', width : 160 , datafield: 'historyManage', displayfield: 'historyManageStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: historyManageList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 160 });

                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '직원담당자 *', width : 160 , datafield: 'manager', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '비고', width : 160 , datafield: 'comments', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '회사', width : 160 , datafield: 'manageCorp', cellsalign: 'center', columngroup: 'manage'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '담당자', width : 160 , datafield: 'manageName', cellsalign: 'center' , columngroup: 'manage'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '전화번호', width : 160 , datafield: 'managePhone', cellsalign: 'center'  , columngroup: 'manage'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },

                 ],
                columngroups: [
                    {text: 'TACACS 계정접속', align: 'center', name: 'tacacs'},
                    {text: '직접접속', align: 'center', name: 'direct'},
                    {text: '유지보수', align: 'center', name: 'manage'},
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

                    if($.isBlank(d.typeId) == false){
                        var tempTypeIdStr = d.typeId;
                        var findVal = typeIdList.find(v => v.label === tempTypeIdStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.typeId = typeIdList[0].value;
                            d.typeIdStr = typeIdList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.typeId = findVal.value;
                            d.typeIdStr = findVal.label;
                        }
                    }

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

                    if($.isBlank(d.areaName) == false){
                        var tempAreaNameStr = d.areaName;
                        var findVal = areaNameList.find(v => v.label === tempAreaNameStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.areaName = areaNameList[0].value;
                            d.areaNameStr = areaNameList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.areaName = findVal.value;
                            d.areaNameStr = findVal.label;
                        }

                    }

                    if($.isBlank(d.layer) == false){
                        var tempLayerStr = d.layer;
                        var findVal = layerList.find(v => v.label === tempLayerStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.layer = layerList[0].value;
                            d.layerStr = layerList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.layer = findVal.value;
                            d.layerStr = findVal.label;
                        }
                    }

                    if($.isBlank(d.mType) == false){
                        var tempMTypeStr = d.mType;
                        var findVal = mTypeList.find(v => v.label === tempMTypeStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.mType = mTypeList[0].value;
                            d.mTypeStr = mTypeList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.mType = findVal.value;
                            d.mTypeStr = findVal.label;
                        }

                    }

                    if($.isBlank(d.manageCoupFl) == false){
                        if(d.manageCoupFl=='O'||d.manageCoupFl=='Y'||d.manageCoupFl=='T'){
                            d.manageCoupFl = true;
                        }else{
                            d.manageCoupFl = false;
                        }
                    }
                    if($.isBlank(d.tacacsConnFl) == false){
                        if(d.tacacsConnFl=='O'||d.tacacsConnFl=='Y'||d.tacacsConnFl=='T'){
                            d.tacacsConnFl = true;
                        }else{
                            d.tacacsConnFl = false;
                        }
                    }
                    if($.isBlank(d.tacacsManageFl) == false){
                        if(d.tacacsManageFl=='O'||d.tacacsManageFl=='Y'||d.tacacsManageFl=='T'){
                            d.tacacsManageFl = true;
                        }else{
                            d.tacacsManageFl = false;
                        }
                    }
                    if($.isBlank(d.directConnFl) == false){
                        if(d.directConnFl=='O'||d.directConnFl=='Y'||d.directConnFl=='T'){
                            d.directConnFl = true;
                        }else{
                            d.directConnFl = false;
                        }
                    }
                    if($.isBlank(d.directManageFl) == false){
                        if(d.directManageFl=='O'||d.directManageFl=='Y'||d.directManageFl=='T'){
                            d.directManageFl = true;
                        }else{
                            d.directManageFl = false;
                        }
                    }
                    if($.isBlank(d.syslogFl) == false){
                        if(d.syslogFl=='O'||d.syslogFl=='Y'||d.syslogFl=='T'){
                            d.syslogFl = true;
                        }else{
                            d.syslogFl = false;
                        }
                    }

                    if($.isBlank(d.installDate) == false){
                        var dateStr = new Date(d.installDate);
                        d.installDate = $.format.date(new Date(d.installDate), 'yyyy-MM-dd HH:mm');
                    }

                    if($.isBlank(d.warrantyExpire) == false){
                        var dateStr = new Date(d.warrantyExpire);
                        d.warrantyExpire = $.format.date(new Date(d.warrantyExpire), 'yyyy-MM-dd HH:mm');
                    }


                    if($.isBlank(d.historyManage) == false){
                        var tempHistoryManageStr = d.historyManage;
                        var findVal = historyManageList.find(v => v.label === tempHistoryManageStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.historyManage = historyManageList[0].value;
                            d.historyManageStr = historyManageList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.historyManage = findVal.value;
                            d.historyManageStr = findVal.label;
                        }
                    }

                    return d;
                });

                //each 로 돌리면서 값 세팅
                $.each(data,function(idx,item){
                    $multiGrid.jqxGrid('addrow', null, {} );
                    var rows = $multiGrid.jqxGrid('getrows');
                    var tempUID = rows[rows.length - 1].uid;
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'typeId', data[idx].typeId );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'typeIdStr', data[idx].typeIdStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'netType', data[idx].netType );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'netTypeStr', data[idx].netTypeStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'areaName', data[idx].areaName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'areaNameStr', data[idx].areaNameStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'hostName', data[idx].hostName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'layer', data[idx].layer );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'layerStr', data[idx].layerStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'purpose', data[idx].purpose );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'mType', data[idx].mType );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'mTypeStr', data[idx].mTypeStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'vendorName', data[idx].vendorName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'commIp', data[idx].commIp );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'manageIp', data[idx].manageIp );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'connType', data[idx].connType );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'manageCoupFl', data[idx].manageCoupFl );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'tacacsConnFl', data[idx].tacacsConnFl );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'tacacsManageFl', data[idx].tacacsManageFl );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'directConnFl', data[idx].directConnFl );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'directManageFl', data[idx].directManageFl );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'syslogFl', data[idx].syslogFl );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'commerceTitle', data[idx].commerceTitle );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'installDate', data[idx].installDate );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'warrantyExpire', data[idx].warrantyExpire );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'serialNo', data[idx].serialNo );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'durableYears', data[idx].durableYears );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'historyManage', data[idx].historyManage );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'historyManageStr', data[idx].historyManageStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'manager', data[idx].manager );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'comments', data[idx].comments );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'manageCorp', data[idx].manageCorp );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'manageName', data[idx].manageName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'managePhone', data[idx].managePhone );

                    rows = $multiGrid.jqxGrid('getrows');
                });
            
            }
            , 500);
    },


    getCodeAll : function(){

        Server.get('/nec/nms/facilityManage/getFacilityCodeListAll.do', {
            data: {
                menuSeq : $('#menuSeq').val(),
            },
            success: function(result) {

                $.each(result,function(idx,item){

                    if(item.codeType == 1){
                        typeIdList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                    if(item.codeType == 2){
                        netTypeList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                    if(item.codeType == 3){
                        areaNameList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                    if(item.codeType == 6){
                        layerList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                    if(item.codeType == 4){
                        mTypeList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                    if(item.codeType == 5){
                        historyManageList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }


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
            if($.isBlank(d.typeId)===true || $.isBlank(d.netType)===true || $.isBlank(d.areaName)===true || $.isBlank(d.mType)===true || $.isBlank(d.installDate)===true || $.isBlank(d.historyManage)===true ){
                chkValid = false;
            }

            if(d.layer == '') { d.layer = 0 }

            if(d.manageCoupFl == true){
                d.manageCoupFl = 1;
            }else{
                d.manageCoupFl = 0;
            }
            if(d.tacacsConnFl == true){
                d.tacacsConnFl = 1;
            }else{
                d.tacacsConnFl = 0;
            }
            if(d.tacacsManageFl == true){
                d.tacacsManageFl = 1;
            }else{
                d.tacacsManageFl = 0;
            }
            if(d.directConnFl == true){
                d.directConnFl = 1;
            }else{
                d.directConnFl = 0;
            }
            if(d.directManageFl == true){
                d.directManageFl = 1;
            }else{
                d.directManageFl = 0;
            }
            if(d.syslogFl == true){
                d.syslogFl = 1;
            }else{
                d.syslogFl = 0;
            }
        });

        if(chkValid === false) {
            alert('필수 항목 중 빈 값이 있습니다. 데이터를 확인해주세요.');
            return false;
        }
        else{
            Server.post('/nec/nms/facilityManage/saveMultiList.do', {
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
        var url = ctxPath+'/export/FCDB_FORMAT_ver1.xlsx';
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=url;
        link.click();
    },

    close : function() {
        self.close();
    },


};
