var $grpTree, $facilityGrid, $sensorGrid;
var facilityList = [];
var sensorList = [];
var dtl_mngNo = -1;
var editFaciliTyIds = [];
var editSensorTyIds = [];
var _rowData ;
var facilityIconList = [];
var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid'), $facilityGrid = $('#facilityGrid');
        $sensorGrid = $('#sensorGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;
            case "btnExcel":
                this.exportExcel();
                break;
            case "btnSave":
                this.facilityKindSave();
                break;
            case "btnSensorSave":
                this.sensorKindSave();
                break;
            case "btnCode":
                this.codeSetting();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.search();
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind2: 'RTU'});
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        HmJqxSplitter.create($('#splitterF'), HmJqxSplitter.ORIENTATION_V, [{ size: '65%', collapsible: false }, { size: '35%' }], 'auto', '100%');
        HmJqxSplitter.create($('#splitterS'), HmJqxSplitter.ORIENTATION_V, [{ size: '65%', collapsible: false }, { size: '35%' }], 'auto', '100%');

        Main.facilityIconSet();
        Main.iconSearch();

        HmGrid.create($facilityGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        //Main.validation(rowdata);
                        if(editFaciliTyIds.indexOf(rowid) == -1)
                            editFaciliTyIds.push(rowid);
                        commit(true);
                    },
                },
                {
                    formatData: function (data) {
                        $.extend(data, Master.getDefGrpParams($grpTree));
                        return data;
                    }
                }
            ),
            //editmode : 'selectedcell',
            pagerheight: 27,
            editable: false,
            columns:
                [
                    {text: '그룹명', datafield: 'grpName', minwidth: 120, editable: false},
                    {text: '주장치명', datafield: 'devName', width: 120, editable: false},
                    {text: 'IP', datafield: 'devIp', width: 120, editable: false},
                    {text: '모델', datafield: 'sensorModel', width: 120, editable: false},
                    {text: '설비명', datafield: 'facilityName', width: 120, editable: false },
                    {text: '설비종류', datafield : 'facilityKind', displayfield: 'facilityKindStr' , width: 120, /*columntype: 'dropdownlist',filtertype:'checkedlist',*/
                        cellsrenderer : HmGrid.fmsKindRenderer,
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: facilityList,
                                displayMember: 'codeUsrName', valueMember: 'codeId',
                            });
                        }
                    },
                    {text: '통신인터페이스', datafield: 'test', width: 100, editable: false},
                    {text: 'sensorCnt', datafield: 'sensorCnt', width: 100, editable: false, hidden:true},
                    {text: '센서설정현황', datafield: 'sensorSetCnt', width: 100, editable: false,
                        cellsrenderer: function(row, column, value, rowData) {
                            var sensorCnt = 0;
                            var sensorSetCnt = 0;
                            sensorCnt = $facilityGrid.jqxGrid('getcellvalue', row, "sensorCnt"); //설비에 대한 전체 센서 수
                            sensorSetCnt = value;   //센서종류가 설정된 센서 수

                            var textCnt = sensorSetCnt+' / '+sensorCnt;
                            return "<div style='margin-top: 6px; margin-left: 0px;' class='jqx-grid-cell-middle-align'>" + textCnt + "</div>";

                        }
                    }
                ]
        }, CtxMenu.COMM, "1");

       $facilityGrid.on('rowdoubleclick', function (event) {
           _rowData = event.args.row.bounddata;
           var facilityKind = _rowData.facilityKind
           /*if(facilityKind == null){
               facilityKind = 'NONE'; //설비 설정 없이 센서를 조회 할 경우 사용. 이떄 센서의 콤보박스는 '-' 처리
               alert("설비종류가 설정 후 센서 설정이 가능합니다.");

               $sensorGrid.jqxGrid('clear');
               return;
           }else{
               Main.makeSensorList(facilityKind); //좌측에서 선택된 설비에 해당 하는 센서 콤보 생성
               Main.sensorSearch();
           }*/
           Main.makeSensorList(facilityKind);
           Main.sensorSearch();
        });

       //하단 센서 리스트
        HmGrid.create($sensorGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editSensorTyIds.indexOf(rowid) == -1)
                            editSensorTyIds.push(rowid);
                        commit(true);
                    },
                },
                {
                    formatData: function (data) {
                        if(_rowData !== undefined){
                            data.mngNo = _rowData.mngNo;
                            data.connectType = _rowData.connectType;
                            data.sensorId = _rowData.sensorId;
                        }
                        return data;
                    }
                }
            ),
            editmode : 'selectedcell',
            enabletooltips: false,
            editable: true,
            /*showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '센서 설정');
            },*/
            columns:
                [
                    {text: '설비명', datafield: 'facilityName', width: 150, editable: false},
                    {text: '센서명', datafield: 'sensorName', minwidth: 150, editable: false},
                    {text: '센서종류', datafield : 'sensorKind', displayfield: 'sensorKindStr' , width: 150, columntype: 'dropdownlist',
                        cellsrenderer : HmGrid.fmsKindRenderer,
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: sensorList,
                                displayMember: 'codeUsrName', valueMember: 'codeId',
                            });
                        }
                    },
                    {text: '단위', datafield: '0', width: 80, editable: false},
                ]
        }, CtxMenu.COMM, "2");
    },

    /** init data */
    initData: function () {
        var params = {
            codeType: 'F',
            useFlag: 1
        };
        Server.get('/main/innotube/ItgEquipMgmt/getFmsCodeList.do', {
            data: params,
            success: function(result) {
                facilityList = result;
            }
        });
    },

    selectTree: function () {
        Main.search();
    },

    /** 조회 */
    search: function () {
        HmGrid.updateBoundData($facilityGrid, ctxPath + '/main/innotube/ItgEquip/getStatusList.do');
    },

    sensorSearch:function(){
        HmGrid.updateBoundData($sensorGrid, ctxPath + '/main/innotube/ItgEquipMgmt/getSensorMgmtList.do');
    },

    //선택된 설비에 해당 하는 센서 콤보 생성
    makeSensorList:function(facilityKind){
        var params = {
            codeType: 'S',
            codeRefType: facilityKind
        };

        Server.get('/main/innotube/ItgEquipMgmt/getFmsCodeList.do', {
            data: params,
            success: function(result) {
                if(result.length == 0){
                    sensorList = [{codeUsrName: '-', codeId: 'NONE'}]
                }else{
                    sensorList = result;
                }

            }
        });
    },

    //좌측 설비종류 저장
    facilityKindSave:function () {
        if(editFaciliTyIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editFaciliTyIds, function(idx, value) {
            _list.push($facilityGrid.jqxGrid('getrowdatabyid', value));
        });
        Server.post('/main/innotube/ItgEquipMgmt/editFmsKind.do', {
            data: { fmsKind: 'F' ,list: _list },
            success: function(data) {
                alert(data);
                editFaciliTyIds = [];
                HmGrid.updateBoundData($facilityGrid, ctxPath + '/main/innotube/ItgEquip/getStatusList.do');
            }
        });
    },

    //우측 센서종류 저장
    sensorKindSave: function(){
        if(editSensorTyIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editSensorTyIds, function(idx, value) {
            _list.push($sensorGrid.jqxGrid('getrowdatabyid', value));
        });
        Server.post('/main/innotube/ItgEquipMgmt/editFmsKind.do', {
            data: { fmsKind: 'S' ,list: _list },
            success: function(data) {
                alert(data);
                editSensorTyIds = [];
                HmGrid.updateBoundData($sensorGrid, ctxPath + '/main/innotube/ItgEquip/getStatusList.do');
            }
        });
    },

    codeSetting: function () {
        $.get(ctxPath + '/main/popup/innotube/pItgEquipCode.do', function(result) {
            HmWindow.open($('#pwindow'), '코드 관리', result, 600, 515);
        });
    },

    iconSearch: function(){
        var tmp = [];
        var facilityList = [
            {imageType: 'UPS', imageSrc : 'upsIcon.svg'},
            {imageType: 'HVAC', imageSrc : 'tmsIcon.svg'},
            {imageType: 'TE/HU', imageSrc : 'thermoIcon.svg'},
            {imageType: 'RACK', imageSrc : 'rackIcon.svg'},
            {imageType: 'FIRE', imageSrc : 'fireIcon.svg'},
            {imageType: 'LEAK', imageSrc : 'leakIcon.svg'},
            {imageType: 'DOOR', imageSrc : 'doorIcon.svg'}
        ]




        /*Server.get('/main/innotube/ItgEquipMgmt/getFmsCodeList.do', {
            data: {codeType: 'F'},
            success: function (result) {
                var a = {};
                console.log("result", result)
                $.each(result, function(idx, value) {
                    a.imageType = result.codeId;
                    a.imageSrc = 'B'
                    a.imageName = result.codeUsrName;
                    //result.codeUsrName;
                    //result.codeId

                });
                facilityIconList.push({ list: a });

                //console.log("facilityIconList", facilityIconList)
            }
        })*/


        facilityIconList.push({ list: facilityList });

        $("#facilityIcon").jqxDataTable('updateBoundData');


    },

    facilityIconSet: function () {
        $("#facilityIcon, #sensorIcon").jqxDataTable(
            {
                width: '100%',
                height: '100%',
                source: new $.jqx.dataAdapter({
                    dataType: 'array',
                    localData: facilityIconList
                }),
                columnsHeight: 28,
                sortable: true,
                pageable: false,
                // pageSize: 2,
                // pagerButtonsCount: 5,
                enableHover: false,
                selectionMode: 'none',
                Theme:jqxTheme,
                columns: [
                    {
                        text: '아이콘 이미지 리스트', align: 'left', dataField: 'list',
                        cellsRenderer: function (row, column, value, rowData) {

                            var container = "<div>";
                            for (var i = 0; i < rowData.list.length; i++) {
                                var data = rowData.list[i];
                                var iconNm, usrKind;
                                var item = "<div class='apply' data-usrKind='" + data.imageType + "' style='cursor:pointer; float: left; width: 90px; overflow: hidden; white-space: nowrap; height: 60px;'>";
                                var image = "<div style='margin-left: 25%; margin-bottom: 3px;'>";
                                var imgurl = "/img/"+data.imageSrc;
                                var img = '<img width=40 height=40 style="display: block;" src="' + imgurl + '"/>';

                                image += img;
                                image += "</div>";
                                var info = "<div style='/*margin: 5px; margin-left: 10px; */ margin-left: -10px; margin-bottom: 3px; text-align: center'>";
                                info += "<div>" + data.imageType + "</div>";
                                info += "</div>";
                                item += image;
                                item += info;
                                item += "</div>";
                                container += item;
                            }
                            container += "</div>";
                            return container;
                        }
                    }
                ],
                rendered: function() {
                    try {
                        // $(".apply").jqxButton();
                        $(".apply").click(function (event) {
                            // rowindex = -1;

                            rowindex = $('#facilityGrid').jqxGrid('getselectedrowindex');
                            if (rowindex == -1) {
                                alert('선택된 모델 데이터가 없습니다.');
                                return;
                            }

                            var infoData = $("#facilityGrid").jqxGrid('getrowdata', rowindex);
                            var imgUid = $(event.currentTarget).attr("data-usrKind");
                            infoData.test = imgUid;
                            infoData.facilityKindStr = imgUid;
                            $("#facilityGrid").jqxGrid('setcellvalue', rowindex, "facilityKind", imgUid);
                            $("#facilityGrid").jqxGrid('refreshdata');
                            $('#facilityGrid').jqxGrid('clearselection');
                            $("#facilityGrid").jqxGrid('selectrow', rowindex);
                            $("#facilityGrid").jqxGrid('ensurerowvisible', rowindex);


                        });
                    } catch(e) {}
                }
            });
        $("#facilityIcon").on("rowClick", function(event) {
            event.stopPropagation();
            return false;
        });
    }


};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();

});
