var $grpTree, $grid;
var $fKindGrid;

var dtl_mngNo = -1;
var facilityKind;

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid'), $grid = $('#grid');
        $fKindGrid = $('#facilityKindGrid');
        facilityKind = 'ALL';
    },

    initCondition: function () {
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('fms_itg_equip_type'));
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });

        $('#sSrchType').keypress(function (e) {
            if(event.keyCode == 13) {
                Main.searchStatus();
            }
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.searchStatus();
                break;
            case "btnExcel":
                this.exportExcel();
                break;
            case 'btnCList':
                this.showChartData();
                break;
            case 'btnCSave':
                this.saveChart();
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

        this.initCondition();

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{size: '50%', collapsible: false}, {size: '50%'}], 'auto', '100%');
        HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_V, [{size: '30%', collapsible: false}, {size: '70%'}], 'auto', '100%');

        Main.createKindGrid();
        Main.createStatusGrid();

        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind2: 'RTU'});
    },

    /** init data */
    initData: function () {

    },

    selectTree: function () {
        Main.searchKind();
    },

    /** 해당 그룹의 설비종류 조회 */
    searchKind: function () {
        var imageArr = [];
        var facilityIconList = [];

        Server.get('/main/innotube/ItgEquip/getFacilityKindList.do', {
            data: Master.getDefGrpParams($grpTree),
            success: function (result) {
                // for(var i = 0; i < 2; i++) {
                $.each(result, function(idx, item) {
                    var imageItem = {};
                    var imageId = item.facilityKind;
                    imageItem.imageId = imageId;
                    imageItem.imageSrc = imageId.toLowerCase() + '.svg';
                    imageItem.imageName = item.facilityName;
                    imageItem.total = item.total;
                    imageItem.evtTotal = item.evtTotal;
                    imageItem.sensorEvtLevel = item.sensorEvtLevel;
                    if(idx % 5 == 0) {
                        imageArr = [];
                        facilityIconList.push({ list: imageArr });
                    }
                    imageArr.push(imageItem)
                });

                //if(result.length !== 0) facilityIconList.push({ list: imageArr });
// }
                $fKindGrid.jqxDataTable('source')._source.localdata = facilityIconList;
                $fKindGrid.jqxDataTable('updateBoundData');
            }
        });
    },

    /** 해당 설비종류의 설비 목록 조회 */
    searchStatus: function () {
        HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/ItgEquip/getStatusList.do');
    },

    /** export Excel */
    exportExcel: function () {
        HmUtil.exportGrid($grid, '센서현황', false);
    },

    createKindGrid: function () {
        $fKindGrid.jqxDataTable({
            width: '100%',
            height: '100%',
            source: new $.jqx.dataAdapter({
                dataType: 'array',
            }),
            columnsHeight: 40,
            sortable: true,
            pageable: false,
            enableHover: false,
            selectionMode: 'none',
            Theme:jqxTheme,
            showHeader: false,
            showToolbar: true,
            rendertoolbar: function(toolbar) {
                Main.renderToolbar(toolbar)
            },
            columns: [
                {
                    text: '아이콘 이미지 리스트', align: 'left', dataField: 'list',
                    cellsRenderer: function (row, column, value, rowData) {
                        var container = '';
                        $.each(rowData.list, function (idx, item) {
                            var imgSrc = '/img/' + item.imageSrc.replace("/",""); //온습도일 경우 문자 처리
                            var evtState = item.evtTotal > 0 ? item.evtTotal : '정상';
                            if(item.imageId === 'Z_UNK') evtState = '-';

                            var titleColor = item.sensorEvtLevel > 0 ? HmUtil.getEvtLevelColor(item.sensorEvtLevel) : '';
                            var txtColor = titleColor !== '' ? 'white' : 'black';

                            container += '<div id="idx_'+ idx +'" class="fc-box" data-usrKind="'+ item.imageId +'">';
                            container += '<div class="fc-title" style="background: '+ titleColor +'; color: '+ txtColor +'; font-weight: bold;">'+ evtState +'</div>';
                            container += '<img class="fc-img" src="'+ imgSrc +'" width=28 height=28 onerror="this.src=\'/img/defaultIcon.svg\'">';
                            container += '<div id="'+ item.imageId +'" class="fc-cont"><div class="fc-content" style="font-weight: bold;">'+ item.imageName + '</span></div>';
                            container += '<div style="font-weight: bold;"><span>('+ item.total +')</span></div></div></div>'
                        });

                        return container;
                    }
                }
            ],
            rendered: function() {
                try {
                    $(".fc-box").click(function (event) {
                        facilityKind = $(event.currentTarget).attr("data-usrKind"); //실제 설비 kind 값
                        if(facilityKind == 'TE/HU') facilityKind = facilityKind.replace("/","");

                        //reset
                        $(".fc-box").attr('style','border-color:transport');
                        $('.fc-cont').attr('style', 'color:black;');
                        //select
                        $(event.currentTarget).attr('style', 'background:#5DAAD6');
                        $('#' + facilityKind).attr('style', 'color:white;font-weight:bold');

                        Main.searchStatus();
                    });
                } catch(e) {}
            }
        });

        // jqx-table 의 cell padding 값 조정
        $fKindGrid.on('bindingComplete', function (event) {
            var tableGridId = 'table' + event.currentTarget.id;
            $('#' + tableGridId).css('padding', '10px 0 0 6px');
            $('#' + tableGridId + ' td').css('padding', '0');

            //전체 조회
            $('#idx_0').attr('style', 'background:#5DAAD6');
            $('#ALL').attr('style', 'color:white;font-weight:bold');
            Main.searchStatus();
        })
    },

    createStatusGrid: function () {
        HmGrid.create($grid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        $.extend(data, Master.getDefGrpParams($grpTree));
                        $.extend(data, Main.getSearchParams());
                        if(facilityKind == 'TEHU') facilityKind = 'TE/HU'; // 슬러시 문자 jquery 라이브러리 이슈로 치환
                        data.facilityKind = facilityKind;
                        data.sortby = 'kind';

                        return data;
                    }
                }
            ),
            pageable : false,
            columns:
                [
                    {text: '그룹명', datafield: 'grpName', width: 120},
                    {text: '주장치명', datafield: 'devName', minwidth: 150},
                    {text: 'IP', datafield: 'devIp', width: 100, cellsalign: 'center'},
                    {text: '설비종류', datafield: 'facilityKind', width: 120, cellsrenderer: HmGrid.fmsKindRenderer},
                    {text: '설비명', datafield: 'facilityName', width: 180},
                    {text: '모델', datafield: 'sensorModel', width: 120},
                    {
                        text: '장애등급',
                        datafield: 'evtLevel',
                        width: 80,
                        cellsrenderer: HmGrid.evtLevelrenderer,
                        cellsalign: 'center'
                    },
                    {text: '수집일시', datafield: 'lastUdt', width: 130, cellsalign: 'center'}
                ]
        }, CtxMenu.COMM);

        $grid.on('bindingcomplete', function (event) {
            $grid.jqxGrid('selectrow', 0);
        });

        $grid.on('rowselect', function (event) {
            var row = event.args.row;
            if(!row) return;

            dtl_mngNo = row.mngNo;

            $("#summarySensorId").val(row.sensorId);
            $("#summaryMngNo").val(row.mngNo);
            $("#summaryFacilityKind").val(row.facilityKind);
            $("#summaryConnectType").val(row.connectType);
            $("#summaryGrpNo").val(row.grpNo);

            switch($dtlTab.val()) {//탭구분 조회
                case 0 : pSummary.drawSummary(row); break; // pItgSummaryDtl.jsp 요약 페이지
                case 1 : pPerf.search(); break;
                case 2 : pEvtInfo.search(); break;
            }
        });
    },

    getSearchParams: function() {
        //검색
        var radioNm = 'sSrchType';
		var _searchType = $("input:radio[name={0}]:checked".substitute(radioNm)).val();
		var _keyword = $('#{0}_input'.substitute(radioNm)).val();

		return {
		    searchType: _searchType,
            keyword: _keyword,
		};
	},

    renderToolbar: function (toolbar) {
        var html = '';
        html += '<div >'
        html += '<div class="pertTitle"> 설비목록</div>'

        toolbar.css('background', '#d0d8de');
        toolbar.empty();
        toolbar.append(html);

        var gridId = toolbar.attr('id');
        $('#' + gridId).css('height', '28px')
    }
};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

function setSensorImage($imageId, imageName) {
    var path =  '/img/{0}.svg'.substitute(imageName);
    $imageId.attr('src', path)
}

function setSensorCircleColor(status, $circleId) {
    //요약 중앙 이미지 배경색 evt 등급 색상으로 변경
    var bgColor = '';
    if(status == 0){
        bgColor = $('#gEvtNormal').val();
    }else if(status == 1){
        bgColor = $('#gEvtInfo').val();
    }else if(status == 2){
        bgColor = $('#gEvtWarning').val();
    }else if(status == 3){
        bgColor = $('#gEvtMinor').val();
    }else if(status == 4){
        bgColor = $('#gEvtMajor').val();
    }else if(status == 5){
        bgColor = $('#gEvtCritical').val();
    }else{
        bgColor = '#6ebf67' //evt 없는 경우 level = 0, 정상, 녹색
    }
    $circleId = $circleId === undefined ? $('#centerCircle') : $circleId;
    $circleId.css('background', bgColor);
}