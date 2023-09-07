var $multiGrid;
var $resultExcel = [], $tabNameList = [], exp, selectTabItem, excelChangeEvent;
var menuList = [];
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
        $('#popupTitle')[0].innerText = ('코드관리 엑셀 업로드').concat('');

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
                        { name: 'menuSeq', type: 'int' },
                        { name: 'menuName', type: 'string' },
                        { name: 'codeType', type: 'int' },
                        { name: 'codeName', type: 'string' },
                        { name: 'selText', type: 'string' },
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
                    { text : '메뉴', width : 300 , datafield: 'menuSeq', displayfield: 'menuName' ,  cellsalign: 'center' ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        createeditor: function(row, value, editor) {
                            //메뉴 목록 설정
                            editor.jqxDropDownList({ source: menuList , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 299 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '코드분류', width : 300 , datafield: 'codeType', displayfield: 'codeName' , cellsalign: 'center'  ,  columntype: 'dropdownlist' , filtertype:'checkedlist',
                        initeditor : function(row, cellvalue, editor, celltext , cellwidth, cellheight){
                            //menuSeq 값에 따라서 코드분류의 dropdownlist 목록을 설정해줌
                            var menuSeq = $multiGrid.jqxGrid('getcellvalue' , row , 'menuSeq');
                            var source = [];
                            $.each(codeListAll,function(idx,item){
                                if(item.menuSeq == menuSeq ){
                                    source.push({ label: item.label , value: item.value });
                                }
                            });
                            // codeListAll 로 해당되는 값 목록 만들어서 source 에 넣어주기
                            editor.jqxDropDownList({ source: source , displayMember: 'label', valueMember: 'value', filterable: false , selectedIndex: 0 , autoDropDownHeight: true , dropDownWidth : 299 });
                        },
                        cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
                        }
                    },
                    { text : '코드명', datafield: 'selText', cellsalign: 'center'
                        , cellclassname: function(row, columnfield, value){
                            if(value == undefined || value == ''){ return 'yellowBg2'; }
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
        PMain.getMenuType();
        PMain.getCodeTypeAll();
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
                data = data.map(function(d){

                    var tempMenuSeq = 0;
                    var tempCodeType = 0;

                    if($.isBlank(d.menuSeq) == false){
                        // datafield 에는 menuSeq 가 쓰이고 displayfield 에는 menuName이 쓰였기 때문에
                        // 찾는건 menuSeq 로 찾고 list에서는 menuName으로 찾아야한다.
                        var tempMenuName = d.menuSeq;
                        tempMenuName = $.trim(tempMenuName);
                        var findVal = menuList.find(v => v.label === tempMenuName);

                        if(findVal == undefined){
                            //값이 없을 경우 첫번째 값 매칭
                            d.menuSeq = menuList[0].value;
                            d.menuName = menuList[0].label;

                            tempMenuSeq = menuList[0].value;
                        }else{
                            //값이 있을 경우 해당 값 선택해서 넣어줌
                            d.menuSeq = findVal.value;
                            d.menuName = findVal.label;

                            tempMenuSeq = findVal.value;
                        }

                        //---------------------codeType-----------------
                        if($.isBlank(d.codeType) == false){
                            // datafield 에는 codeType 가 쓰이고 displayfield 에는 codeName이 쓰였기 때문에
                            // 찾는건 codeType 로 찾고 list에서는 codeName 으로 찾아야한다.
                            var tempCodeName = d.codeType;
                            tempCodeName = $.trim(tempCodeName);

                            var findVal = codeListAll.find(v => v.label === tempCodeName && v.menuSeq === tempMenuSeq );

                            if(findVal == undefined){

                                //값이 없을 경우 첫번째 값 매칭
                                $.each(codeListAll,function(idx,item){
                                    if(item.menuSeq == tempMenuSeq){
                                        d.codeType = item.value;
                                        d.codeName = item.label;

                                        tempCodeType = item.value;
                                        return false;
                                    }
                                });
                            }else{
                                //값이 있을 경우 해당 값 선택해서 넣어줌
                                d.codeType = findVal.value;
                                d.codeName = findVal.label;

                                tempCodeType = findVal.value;
                            }
                        }

                    }

                    if($.isBlank(d.selText) == false){
                        // datafield 에는 menuSeq 가 쓰이고 displayfield 에는 menuName이 쓰였기 때문에
                        // 찾는건 menuSeq 로 찾고 list에서는 menuName으로 찾아야한다.
                        var tempSelText = d.selText;
                        tempSelText = $.trim(tempSelText);
                        d.selText = tempSelText;
                    }

                    return d;
                });

                //each 로 돌리면서 값 세팅
                $.each(data,function(idx,item){
                    $multiGrid.jqxGrid('addrow', null, {} );
                    var rows = $multiGrid.jqxGrid('getrows');
                    var tempUID = rows[rows.length - 1].uid;
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'menuSeq', data[idx].menuSeq );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'menuName', data[idx].menuName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'codeType', data[idx].codeType );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'codeName', data[idx].codeName );
                    $multiGrid.jqxGrid('setcellvalue', tempUID, 'selText', data[idx].selText );

                    rows = $multiGrid.jqxGrid('getrows');
                });
            
            }
            , 500);
    },

    getMenuType : function(){
        Server.post('/nec/nms/utilCode/getMenuTypeList.do', {
            data: {},
            success: function(result) {
                $.each(result,function(idx,item){
                    menuList.push({ label: item.menuName , value: item.menuSeq });
                });
            }
        });
    },

    getCodeType : function(menuSeq){
        Server.get('/nec/nms/utilCode/getCodeTypeList.do', {
            data: {menuSeq : menuSeq},
            success: function(result) {
                $.each(result,function(idx,item){
                    codeList.push({ label: item.codeName , value: item.codeType });
                });
            }
        });
    },

    getCodeTypeAll : function(){
        Server.get('/nec/nms/utilCode/getCodeTypeListAll.do', {
            data: {},
            success: function(result) {
                $.each(result,function(idx,item){
                    codeListAll.push({ label: item.codeName , value: item.codeType , menuSeq : item.menuSeq });
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
            if($.isBlank(d.menuSeq)===true || $.isBlank(d.codeType)===true || $.isBlank(d.selText)===true){
                chkValid = false;
            }
        });

        if(chkValid === false) {
            alert('필수 항목 중 빈 값이 있습니다. 데이터를 확인해주세요.');
            return false;
        }
        else{
            Server.post('/nec/nms/utilCode/saveMultiList.do', {
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
        var url = ctxPath+'/export/CODE_FORMAT_ver1.xlsx';
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=url;
        link.click();
    },

    close : function() {
        self.close();
    },


};
