var $multiGrid;
var $resultExcel = [], $tabNameList = [], exp, selectTabItem, excelChangeEvent;
var typeIdList = [] , netTypeList = [] , useYnList = [] , ipPurposeList = [];
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
        $('#popupTitle')[0].innerText = ('IP DB 엑셀 업로드').concat('');

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
                        { name: 'netIp', type: 'string' },
                        { name: 'netMask', type: 'String' },
                        { name: 'purpose', type: 'String' },
                        { name: 'netName', type: 'string' },
                        { name: 'modelName', type: 'string' },
                        { name: 'useYn', type: 'int' },
                        { name: 'useYnStr', type: 'string' },
                        { name: 'ipPurpose', type: 'int' },
                        { name: 'ipPurposeStr', type: 'string' },
                        { name: 'osName', type: 'string' },
                        { name: 'useDept', type: 'string' },
                        { name: 'userName', type: 'string' },
                        { name: 'useStart', type: 'string' },
                        { name: 'useEnd', type: 'string' },
                        { name: 'applyDate', type: 'string' },
                        { name: 'comments', type: 'string' },
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

                    { text : '분류', width : 160 , datafield: 'typeId', displayfield: 'typeIdStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: typeIdList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 150 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '망구분', width : 180 , datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: netTypeList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 170 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },

                    { text : '아이피 *', width : 160 , datafield: 'netIp', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : 'PREFIX(MASK BIT) *', width : 160 , datafield: 'netMask', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '용도(부서)', width : 160 , datafield: 'purpose', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '장비명(사용자)', width : 160 , datafield: 'netName', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '모델명', width : 160 , datafield: 'modelName', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : '사용여부', width : 150 , datafield: 'useYn' , displayfield: 'useYnStr' ,  cellsalign: 'center' , columngroup: 'slb' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            editor.jqxDropDownList({ source: useYnList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 140 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : 'IP 용도', width : 200 , datafield: 'ipPurpose' , displayfield: 'ipPurposeStr' ,  cellsalign: 'center' , columngroup: 'slb' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            if(ipPurposeList.length > 20 ){
                                editor.jqxDropDownList({ source: ipPurposeList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , dropDownHeight: 250, autoDropDownHeight: false , dropDownWidth : 195 });
                            }else{
                                editor.jqxDropDownList({ source: ipPurposeList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 100 });
                            }

                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },
                    { text : 'OS', width : 160 , datafield: 'osName', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '사용부서', width : 160 , datafield: 'useDept', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '사용자', width : 160 , datafield: 'userName', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '사용 시작일', width : 160 , datafield: 'useStart', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '사용 만료일', width : 160 , datafield: 'useEnd', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '승인일자', width : 160 , datafield: 'applyDate', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            // if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '비고', width : 160 , datafield: 'comments', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return ''; }
                        }
                    },

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



                    if($.isBlank(d.ipPurpose) == false){
                        var tempIpPurposeStr = d.ipPurpose;
                        var findVal = ipPurposeList.find(v => v.label === tempIpPurposeStr);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.ipPurpose = ipPurposeList[0].value;
                            d.ipPurposeStr = ipPurposeList[0].label;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.ipPurpose = findVal.value;
                            d.ipPurposeStr = findVal.label;
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
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'netIp', data[idx].netIp );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'netMask', data[idx].netMask );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'purpose', data[idx].purpose );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'netName', data[idx].netName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'modelName', data[idx].modelName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'useYn', data[idx].useYn );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'useYnStr', data[idx].useYnStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'ipPurpose', data[idx].ipPurpose );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'ipPurposeStr', data[idx].ipPurposeStr );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'osName', data[idx].osName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'useDept', data[idx].useDept );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'userName', data[idx].userName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'useStart', data[idx].useStart );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'useEnd', data[idx].useEnd );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'applyDate', data[idx].applyDate );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'comments', data[idx].comments );

                    rows = $multiGrid.jqxGrid('getrows');
                });

            }
            , 500);
    },


    getCodeAll : function(){

        Server.get('/nec/nms/ipManage/getIpCodeListAll.do', {
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
                        useYnList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
                    }
                    if(item.codeType == 4){
                        ipPurposeList.push({ label: item.selText , value: item.selValue , menuSeq : item.menuSeq });
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
            if($.isBlank(d.netIp)===true || $.isBlank(d.netMask)===true){
                chkValid = false;
            }

            if(d.typeId == ''){ d.typeId = 0 ; }
            if(d.netType == ''){ d.netType = 0 ; }
            if(d.useYn == ''){ d.useYn = 0 ; }
            if(d.ipPurpose == ''){ d.ipPurpose = 0 ; }
        });

        if(chkValid === false) {
            alert('필수 항목 중 빈 값이 있습니다. 데이터를 확인해주세요.');
            return false;
        }
        else{
            Server.post('/nec/nms/ipManage/saveMultiList.do', {
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
        var url = ctxPath+'/export/IP_DB_FORMAT_ver1.xlsx';
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=url;
        link.click();
    },

    close : function() {
        self.close();
    },


};
