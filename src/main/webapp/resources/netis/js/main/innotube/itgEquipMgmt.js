var $grpTree, $facilityGrid, $sensorGrid;
var editFacilityIds = [], editSensorIds = [];
var facilityIconList = [], sensorIconList = [];
var _rowData ;

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid');
        $facilityGrid = $('#facilityGrid');
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

        HmJqxSplitter.create($('#splitterF'), HmJqxSplitter.ORIENTATION_V, [{ size: '70%', collapsible: false }, { size: '30%' }], 'auto', '100%');
        HmJqxSplitter.create($('#splitterS'), HmJqxSplitter.ORIENTATION_V, [{ size: '70%', collapsible: false }, { size: '30%' }], 'auto', '100%');

        Main.createFacilityGrid();
        Main.createSensorGrid();

        Main.facilityIconSet();
        Main.facilityIconSearch();
        Main.sensorIconSet();
    },

    /** init data */
    initData: function () {

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

    createFacilityGrid: function () {
        HmGrid.create($facilityGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        $.extend(data, Master.getDefGrpParams($grpTree));
                        return data;
                    }
                }
            ),
            pagerheight: 27,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '설비목록');
            },
            editable: false,
            sortable: false,
            columns:
                [
                    {text: '그룹명', datafield: 'grpName', minwidth: 120, editable: false},
                    {text: '주장치명', datafield: 'devName', width: 120, editable: false},
                    {text: 'IP', datafield: 'devIp', width: 120, editable: false},
                    {text: '모델', datafield: 'sensorModel', width: 120, editable: false},
                    {text: '설비명', datafield: 'facilityName', width: 120, editable: false },
                    {text: '설비종류', datafield : 'facilityKind', displayfield: 'facilityKindStr' , width: 120, cellsrenderer : HmGrid.fmsKindRenderer,},
                    {text: 'sensorCnt', datafield: 'sensorCnt', width: 100, editable: false, hidden:true},
                    {text: '센서설정현황', datafield: 'sensorSetCnt', width: 100, editable: false,
                        cellsrenderer: function(row, column, value, rowData) {
                            var sensorCnt = $facilityGrid.jqxGrid('getcellvalue', row, "sensorCnt"); //설비에 대한 전체 센서 수
                            var sensorSetCnt = value;   //센서종류가 설정된 센서 수

                            var textCnt = sensorSetCnt+' / '+sensorCnt;
                            return "<div style='margin-top: 6px; margin-left: 0px;' class='jqx-grid-cell-middle-align'>" + textCnt + "</div>";

                        }
                    }
                ]
        }, CtxMenu.COMM, "1");

        $facilityGrid.on('rowclick', function (event) {

            _rowData = event.args.row.bounddata;
            var facilityKind = _rowData.facilityKind;
            var codeSeq = _rowData.facilityCodeSeq; //우측 아이콘 매칭용. name 값 특수문자 이슈로 seq로 대체

            Main.facilityIconSelect(codeSeq);

            //하단 설비에 대한 센서 그리드 조회
            Main.sensorSearch();

            //신규 아이콘 영역
            Main.sensorIconClear(); //기존 아이콘 이미지 초기화
            Main.sensorIconSet(); //센서 이미지 영역 생성
            Main.sensorIconSearch(facilityKind); //설비에 대한 센서 데이터 바인딩
        });
    },

    createSensorGrid: function () {
        HmGrid.create($sensorGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        //미설정 센서 조회 X
                        if(_rowData !== undefined && _rowData.facilityKind !== ''){
                            data.mngNo = _rowData.mngNo;
                            data.connectType = _rowData.connectType;
                            data.sensorId = _rowData.sensorId;
                        }
                        return data;
                    }
                }
            ),
            enabletooltips: false,
            editable: false,
            showtoolbar: true,
            sortable: false,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '센서 목록');
            },
            columns:
                [
                    {text: '설비명', datafield: 'facilityName', width: 150, editable: false},
                    {text: '센서명', datafield: 'sensorName', minwidth: 150, editable: false},
                    {text: '센서종류', datafield : 'sensorKind', displayfield: 'sensorKindStr' , width: 120 },
                    {text: '단위', datafield: 'measureUnit', width: 80, editable: false},
                    {text: '연결 Rack', datafield: 'rackName', width: 120, editable: false},
                ]
        }, CtxMenu.FMS_SENSOR, "2");

        $sensorGrid.on('rowclick', function (event) {
            var _rowData = event.args.row.bounddata;
            var codeSeq = _rowData.sensorCodeSeq; //우측 아이콘 매칭용. name 값 특수문자 이슈로 seq로 대체

            Main.sensorIconSelect(codeSeq);
        });
    },

    //좌측 설비종류 저장
    facilityKindSave:function () {
        if(editFacilityIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        };
        if (!confirm("저장 하시겠습니까? \n설비종류 변경시, 기존 센서 데이터는 모두 초기화 됩니다.") ) return;
        var _list = [];
        $.each(editFacilityIds, function(idx, value) {
            var rowData = $facilityGrid.jqxGrid('getrowdatabyid', value);
            if(rowData.facilityKind == 'ETC'){
                rowData.facilityKind = null;
            }
            _list.push(rowData);
        });

        Server.post('/main/innotube/ItgEquipMgmt/editFmsKind.do', {
            data: { fmsKind: 'F' ,list: _list },
            success: function(data) {
                alert(data);
                editFacilityIds = [];
                Main.iconStyleClear('fc');
                Main.search();
            }
        });
    },

    //우측 센서종류 저장
    sensorKindSave: function(){
        if(editSensorIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editSensorIds, function(idx, value) {
            _list.push($sensorGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/innotube/ItgEquipMgmt/editFmsKind.do', {
            data: { fmsKind: 'S' ,list: _list },
            success: function(data) {
                alert(data);
                editSensorIds = [];

                //센서 저장이후 화면 새고로침 대신 상단 설비 그리드 센서설정현황 카운트 개수 setCell..
                var sensorGridData = $sensorGrid.jqxGrid('getrows');
                var sensorCnt = 0;
                var rowindex = $facilityGrid.jqxGrid('getselectedrowindex');

                $.each(sensorGridData, function (idx, value) {
                    var sensorKindStr = value.sensorKindStr; //sensorKind . null || '' 2가지 종류 이슈로 str로 체크
                    if(sensorKindStr != null){
                        sensorCnt ++;
                    }
                });
                $facilityGrid.jqxGrid('setcellvalue', rowindex, "sensorSetCnt", sensorCnt);
            }
        });
    },

    codeSetting: function () {
        $.get(ctxPath + '/main/popup/innotube/pItgEquipCode.do', function(result) {
            HmWindow.open($('#pwindow'), '코드 관리', result, 600, 515);
        });
    },

    //설비 아이콘 목록. 모든 설비 장비를 가져온다.
    facilityIconSearch: function(){
        var lastData = {
            imageSeq: 0, imageId: '', imageSrc: 'defaultIcon.svg', imageName: '미설정'
        };
        Server.get('/main/innotube/ItgEquipMgmt/getFmsCodeList.do', {
            data: {codeType: 'F', useFlag: 1},
            success: function (result) {
                var tmp = [];
                $.each(result, function(idx, value) {
                    var imageItem = {};
                    var imageId = value.codeId;
                    imageItem.imageSeq = value.codeSeq;
                    imageItem.imageId = imageId;
                    imageItem.imageSrc = imageId.toLowerCase() + '.svg';
                    imageItem.imageName = value.codeUsrName;

                    if(idx % 5 == 0) {
                        tmp = [];
                        facilityIconList.push({ list: tmp });
                    }
                    tmp.push(imageItem);

                });
                tmp.push(lastData);

                $("#facilityIcon").jqxDataTable('updateBoundData');

            }
        })
    },
    
    //설비 아이콘 그림 영역
    facilityIconSet: function () {
        $("#facilityIcon").jqxDataTable({
            width: '100%',
            height: '100%',
            source: new $.jqx.dataAdapter({
                dataType: 'array',
                localData: facilityIconList
            }),
            columnsHeight: 28,
            sortable: true,
            pageable: false,
            enableHover: false,
            selectionMode: 'none',
            Theme:jqxTheme,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '설비설정');
            },
            showHeader: false,
            columns: [
                {
                    text: '아이콘 이미지 리스트', align: 'left', dataField: 'list',
                    cellsRenderer: function (row, column, value, rowData) {
                        var container = '';

                        $.each(rowData.list, function (idx, item) {
                            var imgSrc = '/img/' + item.imageSrc.replace("/",""); //온습도일 경우 문자 처리
                            var imgTitle = item.imageId;
                            if(item.imageId == ''){
                                imgTitle = '미설정';
                            };

                            container += '<div style="height: 68px; text-align: center;" id="facilitySelect_'+item.imageSeq+'" class="fc-box" data-usrKind="'+ item.imageId +'" data-usrKind="'+ item.imageName +'" data-usrKindStr="'+ item.imageName +'" data-codeSeq="'+ item.imageSeq +'">';
                            container += '<div class="fc-title">'+ item.imageName +'</div>';
                            container += '<img class="fc-img" src="'+ imgSrc +'" width=40 height=40 onerror="this.src=\'/img/defaultIcon.svg\'">';
                            container += '<div class="fc-content"></div></div>';
                        });
                        return container;
                    }
                }
            ],
            rendered: function() {
                try {
                    $(".fc-box").click(function (event) {
                        $(".fc-box").attr('style','border-color:transport'); //reset

                        var rowindex = $facilityGrid.jqxGrid('getselectedrowindex');
                        if (rowindex == -1) {
                            alert('선택된 설비가 없습니다.');
                            return;
                        }

                        var imgUid = $(event.currentTarget).attr("data-usrKind"); //실제 설비 kind 값
                        var imgName = $(event.currentTarget).attr("data-usrKindStr"); //kind 한글값
                        var imgStyleId = $(event.currentTarget).attr('id');

                        $facilityGrid.jqxGrid('setcellvalue', rowindex, "facilityKind", imgUid);
                        $facilityGrid.jqxGrid('setcellvalue', rowindex, "facilityKindStr", imgName);

                        $("#"+imgStyleId).css('background', '#5DAAD6'); //selected 배경색 변경

                        if (editFacilityIds.indexOf(rowindex) == -1) editFacilityIds.push(rowindex);

                        $facilityGrid.jqxGrid('clearselection');
                        $facilityGrid.jqxGrid('selectrow', rowindex);
                        $facilityGrid.jqxGrid('ensurerowvisible', rowindex);

                    });
                } catch(e) {}
            }
        });

        $("#facilityIcon").on("rowClick", function(event) {
            event.stopPropagation();
            return false;
        });
        // jqx-table 의 cell padding 값 조정
        $("#facilityIcon").on('bindingComplete', function (event) {
            var tableGridId = 'table' + event.currentTarget.id;
            $('#' + tableGridId).css('padding', '5px 0 0 5px');
            $('#' + tableGridId + ' td').css('padding', '0');
        })
    },

    //센서 아이콘 목록. 선택한 설비에 대한 센서 목록만 조회
    sensorIconSearch: function(facilityKind) {
        var tmp = [];

        facilityKind = facilityKind === '' ? 'ETC' : facilityKind; //센서 아이콘 X

        Server.get('/main/innotube/ItgEquipMgmt/getFmsCodeList.do', {
            data: {codeType: 'S', codeRefType: facilityKind, useFlag: 1},
            success: function (result) {
                $.each(result, function(idx, value) {
                    var imageItem = {};
                    var imageId = value.codeId;
                    imageItem.imageSeq = value.codeSeq;
                    imageItem.imageId = imageId;
                    imageItem.imageSrc = imageId.toLowerCase() + '.svg';
                    imageItem.imageName = value.codeUsrName
                    imageItem.measureUnit = value.measureUnit

                    if(idx % 5 == 0) {
                        tmp = [];
                        sensorIconList.push({ list: tmp });
                    }
                    tmp.push(imageItem)

                });
                $("#sensorIcon").jqxDataTable('updateBoundData');
            }
        })
    },

    sensorIconSet: function () {
        $("#sensorIcon").jqxDataTable({
            width: '100%',
            height: '100%',
            source: new $.jqx.dataAdapter({
                dataType: 'array',
                localData: sensorIconList
            }),
            columnsHeight: 28,
            sortable: true,
            pageable: false,
            enableHover: false,
            selectionMode: 'none',
            Theme:jqxTheme,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '센서설정');
            },
            showHeader: false,
            columns: [
                {
                    text: '아이콘 이미지 리스트', align: 'left', dataField: 'list',
                    cellsRenderer: function (row, column, value, rowData) {
                        var container = '';
                        $.each(rowData.list, function (idx, item) {
                            var imgSrc = '/img/' + item.imageSrc;
                            // var marginTop = 3;
                            if(item.measureUnit == ''){ //단위 존재할 경우 센서명 중앙 정렬. 강제 margin ++
                                // marginTop = 13;
                            }
                            container += '<div style="" id="sensorSelect_'+item.imageSeq+'" class="fs-box" data-usrKind="'+ item.imageId +'" data-usrKind="'+ item.imageName +'" data-usrKindStr="'+ item.imageName +'" data-codeSeq="'+ item.imageSeq +'">';
                            container +=  item.imageName +'<span> '+ item.measureUnit + '</span>';
                            // container += '<div class="fs-content">'+  +'</div>';  //센서 단위
                            container += '</div>';
                        });
                        return container;
                    }
                }
            ],
            rendered: function() {
                try {
                    $(".fs-box").click(function (event) {
                        $(".fs-box").attr('style','border-color:transport'); //reset
                        $(event.currentTarget).attr('style', 'border-color:dodgerblue');//select
                        var rowindex = $sensorGrid.jqxGrid('getselectedrowindex');
                        if (rowindex == -1) {
                            alert('선택된 센서가 없습니다.');
                            return;
                        }

                        var imgUid = $(event.currentTarget).attr("data-usrKind"); //실제 설비 kind 값
                        var imgName = $(event.currentTarget).attr("data-usrKindStr"); //kind 한글값
                        var imgStyleId = $(event.currentTarget).attr('id');

                        $sensorGrid.jqxGrid('setcellvalue', rowindex, "sensorKind", imgUid);
                        $sensorGrid.jqxGrid('setcellvalue', rowindex, "sensorKindStr", imgName);

                        $("#"+imgStyleId).attr('style', 'background:#5DAAD6;color:white;font-weight:bold');

                        if (editSensorIds.indexOf(rowindex) == -1) editSensorIds.push(rowindex);

                        $sensorGrid.jqxGrid('clearselection');
                        $sensorGrid.jqxGrid('selectrow', rowindex);
                        $sensorGrid.jqxGrid('ensurerowvisible', rowindex);
                    });
                } catch(e) {}
            }
        });
        $("#sensorIcon").on("rowClick", function(event) {
            event.stopPropagation();
            return false;
        });

        $("#sensorIcon").on('bindingComplete', function (event) {
            var tableGridId = 'table' + event.currentTarget.id;
            $('#' + tableGridId).css('padding', '5px 0 0 5px');
            $('#' + tableGridId + ' td').css('padding', '0');
        })
    },

    sensorIconClear: function () {
        sensorIconList = [];
        $("#sensorIcon").jqxDataTable('clear');
    },

    facilityIconSelect:function(facilitySeq){
        if(facilitySeq == null){ //기타장비. 설비정류가 null
            facilitySeq = 0;
        }
        Main.iconStyleClear('fc'); // 기존값 초기화
        $("#facilitySelect_"+facilitySeq).css('background', '#5DAAD6');
    },

    sensorIconSelect :function(sensorSeq){
        Main.iconStyleClear('fs');
        $("#sensorSelect_"+sensorSeq).css('background', '#5DAAD6');
    },

    iconStyleClear: function (type) {
        //색 & 보더 초기화
        var className = type; //fc:설비. fs:센서
        $("."+type+'-box').css('background', '');
        $("."+type+'-box').attr('style','border-color:transport'); //reset
    },

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();

});
