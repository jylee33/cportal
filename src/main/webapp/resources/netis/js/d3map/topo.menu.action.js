/**
 * 토폴로지 컨텍스트 메뉴 Action
 */
var popup = null;
var netisWebUrl = (window.location.protocol + "//" + window.location.host) !== $('#gNetisWebUrl').val() ? $('#gNetisWebUrl').val() : "";

var topo_menu_action = {
    /** 최상위그룹 */
    gotoTop: function (elm, d, i, objTopo) {
        if (objTopo.getIsShareGroupRoot()) {
            objTopo.clearArray();
            alert("최상위 그룹입니다.");
            return;
        }
        else {
            if (objTopo.vars.curGrpNo == objTopo.vars.topGrpNo) {
                objTopo.clearArray();
                alert("최상위 그룹입니다.");
                return;
            }
            else {

                if (objTopo.getAccountGroups()) {
                    objTopo.vars.isShareGroupNo = null;
                    // objTopo.search();
                }
                else {
                    objTopo.vars.curGrpNo = objTopo.vars.topGrpNo;
                    // objTopo.chgGrp.call(objTopo);
                }
                objTopo.chgGrp.call(objTopo);
            }
        }
    },

    /** 상위그룹 */
    gotoUp: function (elm, d, i, objTopo) {
        if (objTopo.getIsShareGroupRoot()) {
            alert("최상위 그룹입니다.");
            objTopo.clearArray();
            return;
        } else {
            if (objTopo.vars.curGrpNo == objTopo.vars.topGrpNo) {
                alert("최상위 그룹입니다.");
                objTopo.clearArray();
                return;
            }

        }

        if ( !objTopo.getIsShareGroupRoot() && objTopo.getAccountGroups() ) {
            // 상속 계정이며 권한 그룹이 2개 이상인경우
            let parentGrpNo = objTopo.vars.isGrpMoveHistory.pop();
            if (parentGrpNo) {
                // 그룹코드가 있는 경우
                objTopo.vars.isShareGroupNo = objTopo.vars.curGrpNo = parentGrpNo;
                // objTopo.chgGrp.call(objTopo);
            }
            else {
                // 그룹코드가 없는 경우 (최상위)
                objTopo.vars.isShareGroupNo = null;
            }
            objTopo.chgGrp.call(objTopo);
        }
        else {
            Server.get("/d3map/topo/getParentGrpNo.do", {
                data: {grpNo: objTopo.vars.curGrpNo, userId: objTopo.vars.sessUserId},
                success: function (result) {

                    if (objTopo.vars.isShareAccount == 1 && objTopo.vars.topoTopCnt > 1) {

                        objTopo.vars.isShareGroupNo = null;
                        objTopo.search();
                    }
                    else {
                        objTopo.vars.curGrpNo = result;
                        objTopo.chgGrp.call(objTopo);
                    }
                }
            });
        }

    },

    /** 모드변경 > 조회모드 */
    modechg_search: function (elm, d, i, objTopo) {

        objTopo.vars.mapMode = TopoConst.mapMode.SEARCH;
        try {
            $('#mapMode_search').css('visibility', 'visible');
            $('#mapMode_manage').css('visibility', 'hidden');
            $('input:radio[name=map_mode][value="0"]').prop('checked', true);
        } catch (e) {
        }
        // objTopo.vars.svgGroup.selectAll("g.node.point").style("display", "none");
        // objTopo.vars.svg.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
        // objTopo.vars.svgGroup.selectAll("g.shape image").style("display", "none");
        // objTopo.vars.svgGroup.selectAll("g.shape rect.shapeselection").style("display", "none");
        //objTopo.vars.isChangeTopo = true;
        objTopo.vars.isModeChg = true;
        objTopo.checkAlignEdit(undefined);
        //     objTopo.modeConditionSet(objTopo);
    },

    /** 모드변경 > 관리모드 */
    modechg_manage: function (elm, d, i, objTopo) {
        objTopo.vars.mapMode = TopoConst.mapMode.MANAGE;
        try {
            $('#mapMode_search').css('visibility', 'hidden');
            $('#mapMode_manage').css('visibility', 'visible');
            $('input:radio[name=map_mode][value="1"]').prop('checked', true);
        } catch (e) {
        }
        // objTopo.vars.svgGroup.selectAll("g.node.point").style("display", "block");
        // objTopo.vars.svgGroup.selectAll("g.shape image").style("display", "block");
        //objTopo.vars.isChangeTopo = true;
        objTopo.modeConditionSet(objTopo);
    },

    /** 장비찾기 */
    findDev: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/search/pDevFind.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '장비찾기', result, 980, 620, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 그룹이동 */
    moveGrp: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pGrpMove.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '그룹이동', result, 540, 620, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 그룹복사 (장비 및 회선 제외)*/
    copyGrp: function (elm, d, i, objTopo) {

        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pCopyGrp.do',
            function (result) {
                $('#pwindow').jqxWindow({isModal: true});
                HmWindow.openFit($('#pwindow'), '그룹복사', result, 540, 620, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 장비복사 */
    copyDev: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pCopyDev.do',
            function (result) {
                $('#pwindow').jqxWindow({isModal: true});
                HmWindow.openFit($('#pwindow'), '장비복사', result, 540, 620, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 그리기 복사 (도형, 텍스트 복사) */
    copyDraw: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pCopyDraw.do',
            function (result) {
                $('#pwindow').jqxWindow({isModal: true});
                HmWindow.openFit($('#pwindow'), '그리기도구복사', result, 540, 620, 'pwindow_init', {
                    data: d,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 그룹들어가기(==더블클릭 이동) */
    chgGrp: function (elm, d, i, objTopo) {

        console.log(objTopo);

        if (d != null && d.devKind1 == "GRP") {
            objTopo.vars.curGrpNo = d.mngNo;
            objTopo.vars.curGrpNm = d.itemName;
            objTopo.chgGrp.call(objTopo);
        }

    },


    /** 그룹이벤트현황 */
    view_grpEventList: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/search/pGrpErrView.do',
            function (result) {
                HmWindow.open($('#pwindow'), '[{0}] 그룹 이벤트현황'.substitute(d.itemName), result, 450, 375, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 메모 */
    memo: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pMemoView.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '메모', result, 295, 215, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 보기 > 장비구성 */
    view_devCpst: function (elm, d, i, objTopo) {
        var params = {mngNo: d.mngNo, grpNo: d.grpNo};
        HmWindow.close($('#pwindow'));
        $.post('/main/popup/nms/pDevCpst.do',
            params,
            function (result) {
                HmWindow.openFit($('#pwindow'), '장비구성정보', result, 900, 550);
            }
        );
    },

    /** 그룹보기 */
    view_grp: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/search/pGrpView.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '그룹보기', result, 500, 600, 'pwindow_init', {objTopo: objTopo});
            }
        );
    },
    /** GIS 보기 */
    view_gis: function (elm, d, i, objTopo) {
        try {
            var prefix = objTopo.hasOwnProperty('objId') ? objTopo.objId + '_' : '';
            $('#' + prefix + 'mapCanvas').css('display', 'none');
            $('#' + prefix + 'gisCanvas').css('display', 'inline-block');
            $('input:radio[name=map_viewType][value="gis"]').prop('checked', true);
        } catch (e) {
        }
        if (objTopo.objGis == null) {
            objTopo.objGis = new HmGis(prefix + 'gisCanvas', this);
            objTopo.objGis.initialize();
        }

        objTopo.vars.viewType = TopoConst.viewType.GIS;
        objTopo.objGis.chgGrp(objTopo);
    },

    /** 토폴로지 보기 */
    view_topo: function (objGis) {

        try {
            var prefix = objGis.canvasId.replace('gisCanvas', '');
            $('#' + prefix + 'mapCanvas').css('display', 'inline-block');
            $('#' + prefix + 'gisCanvas').css('display', 'none');
            $('input:radio[name=map_viewType][value="topo"]').prop('checked', true);
        } catch (e) {

        }

        objGis.objTopo.vars.curGrpNo = objGis.vars.curGrpNo;
        objGis.objTopo.vars.viewType = TopoConst.viewType.TOPO;
        objGis.objTopo.chgGrp.call(objGis.objTopo, true);

    },

    /** 보기 > 장비상세 */
    view_devDetail: function (elm, d, i, objTopo) {
        // 대시보드 토폴로지맵 용
        // HmUtil.createPopup(netisWebUrl + '/main/popup/nms/pDevDetail.do', $('#hForm'), 'pDevDetail', 1300, 700, {mngNo: d.mngNo});
        HmUtil.createPopup('/main/popup/nms/pDevDetail.do', $('#hForm'), 'pDevDetail', 1400, 700, {mngNo: d.mngNo});
    },

    /** 보기 > 서버상세 */
    view_svrDetail: function (elm, d, i, objTopo) {
        HmUtil.createPopup('/main/popup/sms/pSvrDetail.do', $('#hForm'), 'pSvrDetail', 1300, 700, {mngNo: d.mngNo});
    },

    /** 보기 > Rack정보 */
    view_rackInfo: function (elm, d, i, objTopo) {
        var params = {mngNo: d.mngNo, grpNo: d.grpNo, rackNo: d.mngNo, initArea: 'rack'};

        $.get('/main/env/rackConf/getRackConfList.do', params,
            function (data) {
                HmUtil.createPopup('/main/popup/rack/pRackInfo.do', $('#hForm'), 'pRackConf', 764, 700, data.resultData[0]);
            }
        );
    },

    /** 보기 > AP상세 */
    view_apDetail: function (elm, d, i, objTopo) {
        var params = {
            apNo: d.mngNo
        };
        HmUtil.createPopup('/main/popup/nms/pApDetail.do', $('#hForm'), 'pApDetail', 1200, 660, params);
    },

    /** 보기 > Client현황 */
    view_apClientStatus: function (elm, d, i, objTopo) {
        var params = {
            apNo: d.mngNo
        };
        HmUtil.createPopup('/main/popup/nms/pApClientStatus.do', $('#hForm'), 'pApClientStatus', 1200, 760, params);
    },


    /** 보기 > AP 리셋 기능 */
    apResetStart: function (elm, d, i, objTopo) {

        console.log(d.mngNo);


        var params = {
            mngNos: 0,
            ifNos: 0
        };

        if (!confirm('AP 리셋을 실행 하시겠습니까?')) return;

        Server.get('/main/popup/apDetail/getSummary_basicInfo.do', {
            data: {apNo: d.mngNo},
            success: function (result) {

                params.mngNos = result.poeMngNo
                params.ifNos = result.poeIfNo

                console.log(result);

                if (params.mngNos != 0 && params.ifNos != 0) {

                    var loader = $('#comLoader');

                    if (loader.length <= 0) {
                        loader = $('<div id="comLoader" style="z-index: 100000"></div>');
                        loader.appendTo('body');
                    }

                    loader.jqxLoader({
                        isModal: false,
                        width: 330,
                        height: 80,
                        theme: jqxTheme,
                        text: 'Ap 리셋 중입니다. 잠시만 기다려주세요.'
                    });

                    loader.jqxLoader('open');

                    Server.post('/main/env/devMgmt/execApResetEngine.do', {
                        data: params,
                        success: function (result, send_data) {
                            loader.jqxLoader('close');
                            alert(result);
                        },
                        error: function () {
                            loader.jqxLoader('close');
                        }
                    });
                } else {
                    alert("AP 컨트롤러에 설정된 장비 번호가 없습니다.");
                }
            }
        });

    },

    /** 보기 > 회선보기 */
    view_ifView: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        HmWindow.createNewWindow('pwindow');
        $.post('/d3map/popup/search/pLinkView.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '폴링회선보기', result, 740, 400, 'pwindow_init', {
                    objTopo: objTopo,
                    linkNo: d.linkNo
                });
            }
        );
    },

    /** 보기 > WAS상세 */
    view_wasDetail: function (elm, d, i, objTopo) {

        var params = {wasNo: d.mngNo};

        $.get('/main/env/svrMgmt/getSvrWasInfo.do', params,
            function (data) {
                // HmUtil.createPopup('/main/popup/rack/pRackInfo.do', $('#hForm'), 'pRackConf', 800, 700, data.resultData[0]);
                HmUtil.createPopup('/main/popup/sms/pWasDetail.do', $('#hForm'), 'pWasDetail', 1300, 700, data.resultData);
            }
        );

    },

    /** 보기 > DBMS상세 */
    view_dbmsDetail: function (elm, d, i, objTopo) {
        var params = {dbmsNo: d.mngNo};

        $.get('/main/env/svrMgmt/getSvrDbmsInfo.do', params,
            function (data) {
                var dbmsInfo = data.resultData;
                var url = '';
                switch (dbmsInfo.dbmsKind) {
                    case 'ORACLE':
                        url = '/main/popup/sms/pDbmsOracleDetail.do';
                        break;
                    case 'MYSQL':
                        url = '/main/popup/sms/pDbmsMysqlDetail.do';
                        break;
                }
                HmUtil.createPopup(url, $('#hForm'), 'pDbmsDetail' + rowdata.dbmsNo, 1300, 700, dbmsInfo);
            }
        );
    },

    /** 초기화 > 맵초기화 */
    init_map: function (elm, d, i, objTopo) {
        // 상속계정은 맵초기화 기능을 사용하지 못하도록 예외처리
        Server.post('/d3map/popup/setting/mapInit/getMapInitAuth.do', {
            data: {},
            success: function (result) {
                if (result == 1) {
                    alert('상속계정은 맵 초기화 권한이 없습니다.');
                    return;
                }

                if (confirm("모든 아이템이 지워지고 기본 그룹의 아이템이 등록됩니다.\n맵 초기화를 진행하시겠습니까?") == true) {
                    $.post('/d3map/popup/setting/mapInit/saveMapInit.do',
                        function (result) {
                            objTopo.search.call(objTopo);
                            if (confirm("맵 초기화 작업이 완료되었습니다. 위치 초기화를 진행하시겠습니까?")) {
                                topo_menu_action.init_pos(elm, d, i, objTopo);
                            }
                        }
                    );
                }
            }
        });
    },

    /** 초기화 > 위치초기화 */
    init_pos: function (elm, d, i, objTopo) {
        var xgap = Math.ceil(960 / 17),
            ygap = Math.ceil(680 / 15),
            rowMaxCnt = 17;

        var itemList = objTopo.vars.svg.selectAll("g.node").data(),
            itemCnt = itemList.length;

        for (var i = 0; i < itemCnt; i++) {
            var item = itemList[i],
                row = Math.floor(i / rowMaxCnt);
            if (row > 14) row = 15;
            var newPoint = objTopo.convertMapLocation.call(objTopo, [(Math.floor(i % rowMaxCnt) * xgap) + 40, (row * ygap) + 30]),
                scale = TopoUtil.getItemScale(item.itemSize);

            item.x = newPoint[0],
                item.y = newPoint[1] + 30, // + 30의 경우 토폴로지맵 좌상단 현재 그룹명칭에 장비가 가려지는 현상을 피하기 위함
                item.cx = item.x + ((55 - (55 * scale)) / 2) + (55 * scale / 2),
                item.cy = item.y + (55 * scale / 2);
        }

        objTopo.tick.call(objTopo);
    },

    /** 정렬 > 왼쪽맞춤 */
    align_vertical_left: function (elm, d, i, objTopo) {

        var xVal = 0, cxVal = 0;
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();

        /* node 정렬 */
        $.each(_selectedNodes, function (idx, value) {
            if (idx == 0) {
                xVal = value.x;
                cxVal = value.cx;
            } else {
                if (value.cx < cxVal) {
                    xVal = value.x;
                    cxVal = value.cx;
                }
            }
        });


        $.each(_selectedNodes, function (idx, value) {
            value.x = xVal;
            value.cx = cxVal;
        });

        /* shape 정렬 */
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        $.each(_selectedShapes, function (idx, value) {
            if (idx == 0) {
                xVal = value.posX;
            } else {
                if (value.posX < xVal) {
                    xVal = value.posX;
                }
            }
        });

        $.each(_selectedShapes, function (idx, value) {
            value.posX = xVal;
        });

        objTopo.tick.call(objTopo);
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();

    },

    /** 정렬 > 가운데맞춤 (세로로 가운데) */
    align_vertical_center: function (elm, d, i, objTopo) {

        var minX = 0, maxX = 0, minCx = 0, maxCx = 0, calX = 0, minVx = 0, maxVx = 0;
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        /* node 정렬 */
        $.each(_selectedNodes, function (idx, value) {

            if (idx == 0) {
                minX = value.x;
                maxX = value.x;
                minCx = value.cx;
                maxCx = value.cx;
            } else {
                if (value.cx < minCx) {
                    minX = value.x;
                    minCx = value.cx;
                }
                if (value.cx > maxCx) {
                    maxX = value.x;
                    maxCx = value.cx;
                }
            }
        });

        calX = (maxCx - minCx) / 2;
        /* node 정렬 */
        $.each(_selectedNodes, function (idx, value) {
            if (value.devKind1 != 'POINT') {
                var scale = TopoUtil.getItemScale(value.itemSize);
                value.xpoint = value.x = minX + calX;// + ((55 - (55 * scale)) / 2);// - (55 * scale / 2);
                value.cx = minCx + calX;// + ((55 - (55 * scale)) / 2);// - (55 * scale / 2);
            }
            TopoItem.setCenterLoc(value);
        });

        /* shape 정렬 */
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        $.each(_selectedShapes, function (idx, value) {
            if (idx == 0) {
                minX = value.posX;
                maxX = value.posX;
            } else {
                if (value.posX < minX) {
                    minX = value.posX;
                }
                if (value.posX > maxX) {
                    maxX = value.posX;
                }
            }
        });

        calX = (maxX - minX) / 2;
        $.each(_selectedShapes, function (idx, value) {
            value.posX = minX + calX - (value.width / 2);// - (value.bbox.width / 2);
        });

        objTopo.tick.call(objTopo);
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();

    },

    /** 정렬 > 오른쪽맞춤 */
    align_vertical_right: function (elm, d, i, objTopo) {
        var xVal = 0, cxVal = 0;
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        /* node 정렬 */
        $.each(_selectedNodes, function (idx, value) {
            if (idx == 0) {
                xVal = value.x;
                cxVal = value.cx;
            } else {
                if (value.cx > cxVal) {
                    xVal = value.x;
                    cxVal = value.cx;
                }
            }
        });

        $.each(_selectedNodes, function (idx, value) {
            value.x = xVal;
            value.cx = cxVal;
        });

        /* shape 정렬 */
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        $.each(_selectedShapes, function (idx, value) {
            if (idx == 0) {
                xVal = value.posX;
            } else {
                if (value.posX > xVal) {
                    xVal = value.posX;
                }
            }
        });

        $.each(_selectedShapes, function (idx, value) {
            value.posX = xVal;
        });

        objTopo.tick.call(objTopo);
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();

    },

    /** 정렬 > 위쪽맞춤 */
    align_horizontal_top: function (elm, d, i, objTopo) {
        var yVal = 0, cyVal = 0;
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        /* node 정렬 */
        $.each(_selectedNodes, function (idx, value) {
            if (idx == 0) {
                yVal = value.y;
                cyVal = value.cy;
            } else {
                if (value.cy < cyVal) {
                    yVal = value.y;
                    cyVal = value.cy;
                }
            }
        });

        $.each(_selectedNodes, function (idx, value) {
            value.y = yVal;
            value.cy = cyVal;
        });

        /* shape 정렬 */
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        $.each(_selectedShapes, function (idx, value) {
            if (idx == 0) {
                yVal = value.posY;
            } else {
                if (value.posY < yVal) {
                    yVal = value.posY;
                }
            }
        });

        $.each(_selectedShapes, function (idx, value) {
            value.posY = yVal;
        });

        objTopo.tick.call(objTopo);
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();

    },

    /** 정렬 > 중간맞춤 (가로로) */
    align_horizontal_middle: function (elm, d, i, objTopo) {

        var minY = 0, maxY = 0, minCy = 0, maxCy = 0, minVy = 0, maxVy = 0, calY = 0;
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        /* node 정렬 */
        $.each(_selectedNodes, function (idx, value) {

            if (idx == 0) {
                minCy = value.cy;
                maxCy = value.cy;
                minY = value.y;
                maxY = value.y;
            } else {
                if (value.cy < minCy) {
                    minCy = value.cy;
                    minY = value.y;
                }
                if (value.cy > maxCy) {
                    maxCy = value.cy;
                    maxY = value.y;
                }
            }
        });

        calY = (maxCy - minCy) / 2;
        /* node 정렬 */
        $.each(_selectedNodes, function (idx, value) {
            if (value.devKind1 != 'POINT') {
                value.ypoint = value.y = minY + calY;// + (55 * TopoUtil.getItemScale(value.itemSize) / 2);
                value.cy = minCy + calY;// + (55 * TopoUtil.getItemScale(value.itemSize) / 2);
                TopoItem.setCenterLoc(value);
            }
        });

        /* shape 정렬 */
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        $.each(_selectedShapes, function (idx, value) {
            if (idx == 0) {
                minY = value.posY;
                maxY = value.posY;
            } else {
                if (value.posY < minY) {
                    minY = value.posY;
                }
                if (value.posY > maxY) {
                    maxY = value.posY;
                }
            }
        });

        calY = (maxY - minY) / 2;
        $.each(_selectedShapes, function (idx, value) {
            value.posY = minY + calY - (value.height / 2);//- (value.bbox.height / 2);
        });

        objTopo.tick.call(objTopo);
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();

    },

    /** 정렬 > 아래쪽맞춤 */
    align_horizontal_bottom: function (elm, d, i, objTopo) {
        var yVal = 0, cyVal = 0;
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        /* node 정렬 */
        $.each(_selectedNodes, function (idx, value) {
            if (idx == 0) {
                yVal = value.y;
                cyVal = value.cy;
            } else {
                if (value.cy > cyVal) {
                    yVal = value.y;
                    cyVal = value.cy;
                }
            }
        });

        $.each(_selectedNodes, function (idx, value) {
            value.y = yVal;
            value.cy = cyVal;
        });

        /* shape 정렬 */
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        $.each(_selectedShapes, function (idx, value) {
            if (idx == 0) {
                yVal = value.posY;
            } else {
                if (value.y > yVal) {
                    yVal = value.posY;
                }
            }
        });

        $.each(_selectedShapes, function (idx, value) {
            value.posY = yVal;
        });

        objTopo.tick.call(objTopo);
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();

    },

    /** 정렬 > 가로간격동일 */
    align_horizontalDivision: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        if (_selectedNodes.length > 0) {
            _selectedNodes.sort(function (a, b) {
                return a.cx < b.cx ? -1 : a.cx > b.cx ? 1 : 0;
            });

            var minX = _selectedNodes[0].cx;
            var maxX = _selectedNodes[_selectedNodes.length - 1].cx;
            var sumX = maxX - minX;
            var avgX = sumX / (_selectedNodes.length - 1);
            var scale = TopoUtil.getItemScale(_selectedNodes[0].itemSize);

            $.each(_selectedNodes, function (idx, value) {
                if (idx != 0 && idx != (_selectedNodes.length - 1) && avgX > 0) {
                    _selectedNodes[idx].xpoint = _selectedNodes[0].xpoint + (avgX * idx);
                    _selectedNodes[idx].x = _selectedNodes[0].xpoint + (avgX * idx ) ;
                    _selectedNodes[idx].vx = 0;
                    _selectedNodes[idx].cx = _selectedNodes[0].cx + (avgX * idx);
                }
            });
        }

        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes.length > 0) {
            _selectedShapes.sort(function (a, b) {
                return a.posX < b.posX ? -1 : a.posX > b.posX ? 1 : 0;
            });

            minX = _selectedShapes[0].posX;
            maxX = _selectedShapes[_selectedShapes.length - 1].posX;
            sumX = maxX - minX;
            avgX = sumX / (_selectedShapes.length - 1);

            $.each(_selectedShapes, function (idx, value) {
                if (idx != 0 && idx != (_selectedShapes.length - 1)) {

                    _selectedShapes[idx].posX = _selectedShapes[0].posX + (avgX * idx);
                }
            });
        }

        objTopo.tick.call(objTopo);
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();
    },

    /** 정렬 > 세로간격동일 */
    align_verticalDivision: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        if (_selectedNodes.length > 0) {
            _selectedNodes.sort(function (a, b) {
                return a.cy < b.cy ? -1 : a.cy > b.cy ? 1 : 0;
            });

            var minY = _selectedNodes[0].cy;
            var maxY = _selectedNodes[_selectedNodes.length - 1].cy;
            var sumY = maxY - minY;
            var avgY = sumY / (_selectedNodes.length - 1);
            var scale = TopoUtil.getItemScale(_selectedNodes[0].itemSize);

            $.each(_selectedNodes, function (idx, value) {
                if (idx != 0 && idx != (_selectedNodes.length - 1) && avgY > 0) {
                    _selectedNodes[idx].ypoint = _selectedNodes[0].ypoint + (avgY * idx);
                    _selectedNodes[idx].y = _selectedNodes[0].ypoint + (avgY * idx);
                    _selectedNodes[idx].vy = 0;
                    _selectedNodes[idx].cy = _selectedNodes[0].cy + (avgY * idx);// + itemHeight;
                }
            });
        }

        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes.length > 0) {
            _selectedShapes.sort(function (a, b) {
                return a.posY < b.posY ? -1 : a.posY > b.posY ? 1 : 0;
            });

            minY = _selectedShapes[0].posY;
            maxY = _selectedShapes[_selectedShapes.length - 1].posY;
            sumY = maxY - minY;
            avgY = sumY / (_selectedShapes.length - 1);

            $.each(_selectedShapes, function (idx, value) {
                if (idx != 0 && idx != (_selectedShapes.length - 1)) {

                    _selectedShapes[idx].posY = _selectedShapes[0].posY + (avgY * idx);
                }
            });
        }


        objTopo.tick.call(objTopo);
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();
    },

    /** 추가 > 그룹 */
    add_grp: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pGrpAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '그룹 추가', result, 300, 180, 'pwindow_init', {objTopo: objTopo});
            }
        );
    },

    /** 추가 > 등록그룹 */
    add_regGrp: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pRegGrpAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '등록 그룹 추가', result, 350, 600, 'pwindow_init', {objTopo: objTopo});
            }
        );
    },

    /** 추가 > 등록장비 */
    add_regDev: function (elm, d, i, objTopo) {
        var params = {grpNo: objTopo.vars.curGrpNo, objTopo: objTopo};
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pRegItemAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '등록장비 추가', result, 1200, 620, 'pwindow_init', params);
            }
        );
    },

    /** 추가 > 등록서버 */
    add_regSvr: function (elm, d, i, objTopo) {
        var params = {objTopo: objTopo};
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pRegSvrAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '등록서버 추가', result, 1200, 620, 'pwindow_init', params);
            }
        );
    },

    /** 추가 > 등록센서 */
    add_regSensor: function (elm, d, i, objTopo) {
        var params = {objTopo: objTopo};
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pRegSensorAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '등록센서 추가', result, 1200, 620, 'pwindow_init', params);
            }
        );
    },

    /** 추가 > 등록Rack */
    add_regRack: function (elm, d, i, objTopo) {
        var params = {objTopo: objTopo};
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pRegRackAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '등록RACK 추가', result, 1200, 620, 'pwindow_init', params);
            }
        );
    },

    /** 추가 > 등록AP */
    add_regAp: function (elm, d, i, objTopo) {
        var params = {grpNo: objTopo.vars.curGrpNo, objTopo: objTopo};
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pRegApAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '등록AP 추가', result, 1200, 620, 'pwindow_init', params);
            }
        );
    },
    /** 추가 > 등록Was */
    add_regWas: function (elm, d, i, objTopo) {
        var params = {grpNo: objTopo.vars.curGrpNo, objTopo: objTopo};
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pRegWasAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '등록Was 추가', result, 1200, 620, 'pwindow_init', params);
            }
        );
    },
    /** 추가 > 등록Dbms */
    add_regDbms: function (elm, d, i, objTopo) {
        var params = {grpNo: objTopo.vars.curGrpNo, objTopo: objTopo};
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pRegDbmsAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '등록DBMS 추가', result, 1200, 620, 'pwindow_init', params);
            }
        );
    },

    /** 추가 > 임의장비 */
    add_etcDev: function (elm, d, i, objTopo) {
        var params = {grpNo: objTopo.vars.curGrpNo};
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pEtcItemAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '임의장비 추가', result, 300, 174, 'pwindow_init', {
                    data: params,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 추가 > 회선 */
    add_link: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        var _icon1 = _selectedNodes.filter(function (d) {
            return d.id == objTopo.vars.selectItemNode[0];
        });
        var _icon2 = _selectedNodes.filter(function (d) {
            return d.id == objTopo.vars.selectItemNode[1];
        });
        var params = {
            grpNo: _icon1[0].grpNo,
            itemNo1: _icon1[0].itemNo,
            itemNo2: _icon2[0].itemNo,
            x1: _icon1[0].cx,
            y1: _icon1[0].cy,
            x2: _icon2[0].cx,
            y2: _icon2[0].cy,
            itemName1: _icon1[0].itemName,
            itemName2: _icon2[0].itemName
        };

        $.post('/d3map/popup/setting/pLineAdd.do',
            function (result) {
                HmWindow.open($('#pwindow'), '회선추가', result, 560, 490, 'pwindow_init', {
                    data: params,
                    objTopo: objTopo
                });
            }
        );
    },

    /** Image관리 > 모델별 이미지 관리 */
    chgImg_byModel: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post("/d3map/popup/setting/pImgByModel.do", function (result) {
            HmWindow.openFit($('#pwindow'), "모델별 이미지 관리", result, 1125, 600, "pwindow_init", {objTopo: objTopo});
        });
    },

    /** Image관리 > 배경이미지 관리 */
    mgmtImg_bg: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post("/d3map/popup/setting/pBgImgMgmt.do", function (result) {
            HmWindow.openFit($('#pwindow'), "배경 이미지 관리", result, 800, 600, "pwindow_init", {
                objTopo: objTopo,
                limitCnt: 1,
                sendParam: {imgKind2: "BG"}
            });
        });
    },

    /** Image관리 > 아이콘이미지 관리 */
    mgmtImg_icon: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post("/d3map/popup/setting/pIconImgMgmt.do", function (result) {
            HmWindow.openFit($('#pwindow'), "아이콘 이미지 관리", result, 800, 600, "pwindow_init", {
                objTopo: objTopo,
                limitCnt: 1,
                sendParam: {imgKind2: "IMG"}
            });
        });
    },

    /** 회선 > 포인트추가 */
    addPoint: function (elm, d, i, objTopo) {
        if (confirm("포인트를 추가하시겠습니까?") != true) return;

        var _ptIdx = 0;
        _ptIdx = d.point3 == 0 ? 3 : 0;
        _ptIdx = d.point2 == 0 ? 2 : _ptIdx;
        _ptIdx = d.point1 == 0 ? 1 : _ptIdx;

        if (_ptIdx == 0) {
            alert("포인트를 더 이상 추가하실수 없습니다.");
            return;
        }
        var _source = objTopo.convertSaveLocation.call(objTopo, [d.source.x , d.source.y]);
        var _target = objTopo.convertSaveLocation.call(objTopo, [d.target.x , d.target.y]);
        var _xpoint = _source[0] > _target[0] ? _target[0] + Math.abs((_target[0] - _source[0]) / 2) : _source[0] + Math.abs((_target[0] - _source[0]) / 2);
        var _ypoint = _source[1] > _target[1] ? _target[1] + Math.abs((_target[1] - _source[1]) / 2) : _source[1] + Math.abs((_target[1] - _source[1]) / 2);

        var addParam = {
            ptIdx: _ptIdx,
            linkNo: d.linkNo,
            grpNo: objTopo.vars.curGrpNo,
            xpoint: _xpoint,
            ypoint: _ypoint
        };

        Server.post('/d3map/popup/setting/pointAdd/addPointItem.do', {
            data: addParam,
            success: function (result) {
                objTopo.addItemTick.call(objTopo, result);

                alert('추가되었습니다.');
            }
        });
    },

    /** 폴링 > 회선폴링 */
    polling_link: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pLinkPollingAdd.do',
            function (result) {
                HmWindow.open($('#pwindow'), '회선 폴링 설정', result, 1200, 875, 'pwindow_init', {
                    data: d,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 폴링 > 멀티회선폴링 */
    polling_multiLink: function (elm, d, i, objTopo) {

        if (objTopo.vars.selectPathLink.length <= 1) {
            objTopo.vars.selectPathLink = [], objTopo.vars.selectPathLink.push(d);
        }

        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pMultiLinkPollingAdd.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '멀티회선 폴링 설정', result, 1200, 660, 'pwindow_init', {
                    data: objTopo.vars.selectPathLink,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 변경 > 배경이미지 */
    chg_bgImg: function (elm, d, i, objTopo) {
        var params = {grpNo: objTopo.vars.curGrpNo};
        $.post('/d3map/popup/setting/pBgImgChg.do',
            function (result) {
                HmWindow.open($('#pwindow'), '배경 이미지 변경', result, 800, 577, 'pwindow_init', {
                    data: params,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 변경 > 아이콘 정보 변경 */
    chg_iconInfo: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data().filter(function (d) {
            return d.devKind1 != "POINT";
        });
        if (_selectedNodes.length == 0) {
            _selectedNodes.push(d);
        }
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pItemInfoEdit.do', {devKind1: _selectedNodes[0].devKind1, nodelength: _selectedNodes.length},
            function (result) {
                HmWindow.openFit($('#pwindow'), '아이콘정보변경', result, 295, 166, 'pwindow_init', {
                    nodes: _selectedNodes,
                    // data: d,
                    objTopo: objTopo
                });
            }
        );
    },

    /** URL 설정 > URL 탬플릿 설정*/
    url_templet_set: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pSetUrlTemplet.do', {},
            function (result) {
                HmWindow.openFit($('#pwindow'), 'URL탬플릿설정', result, 1400, 500, 'pwindow_init', {
                    data: d,
                    objTopo: objTopo
                });
            }
        );
    },

    /** URL 설정 > URL 탬플릿 지정*/
    url_templet_add: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pAddUrlTemplet.do', {},
            function (result) {
                HmWindow.openFit($('#pwindow'), 'URL탬플릿지정', result, 1200, 200, 'pwindow_init', {mngNo: d.mngNo});
            }
        );
    },


    /** 변경 > 아이콘이미지 */
    chg_iconImg: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data().filter(function (d) {
            return d.devKind1 != "POINT";
        });
        if (_selectedNodes.length == 0) {
            _selectedNodes.push(d);
        }
        HmWindow.close($('#pwindow'));
        $.post("/d3map/popup/setting/pIconImgChg.do", function (result) {
            HmWindow.openFit($('#pwindow'), "아이콘 이미지 변경", result, 800, 600, "pwindow_init", {
                nodes: _selectedNodes,
                objTopo: objTopo
            });
        });
    },

    /** 변경 > 별칭 */
    chg_alias: function (elm, d, i, objTopo) {
        $.post('/d3map/popup/setting/pItemAliasEdit.do',
            function (result) {
                HmWindow.open($('#pwindow'), '별칭 변경', result, 295, 146, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 변경 > 아이콘크기 */
    chg_iconSize: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        if (_selectedNodes.length == 0) {
            _selectedNodes.push(d);
        }
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pItemSizeEdit.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '아이콘크기 변경', result, 295, 146, 'pwindow_init', {
                    nodes: _selectedNodes,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 변경 > 폰트크기 */
    chg_fontSize: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        if (_selectedNodes.length == 0) {
            _selectedNodes.push(d);
        }
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pItemFontSizeEdit.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '폰트크기 변경', result, 295, 146, 'pwindow_init', {
                    nodes: _selectedNodes,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 변경 > 명칭위치변경 */
    chg_labelPosition: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        if (_selectedNodes.length == 0) {
            _selectedNodes.push(d);
        }
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pItemLabelPositionEdit.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '명칭위치 변경', result, 295, 146, 'pwindow_init', {
                    nodes: _selectedNodes,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 변경 > 타입 */
    chg_iconType: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pItemTypeEdit.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '타입 변경', result, 295, 146, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 변경 > 그룹명 */
    chg_grpNm: function (elm, d, i, objTopo) {
        $.post('/d3map/popup/setting/pGrpNameEdit.do',
            function (result) {
                HmWindow.open($('#pwindow'), '그룹명 변경', result, 295, 146, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 변경 > 임의장비속성 */
    chg_etcDevAttr: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pEtcItemEdit.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '임의장비속성변경', result, 300, 200, 'pwindow_init', {
                    data: d,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 명칭표시 > On */
    chg_itemNmOn: function (elm, d, i, objTopo) {
        if (d.devKind1 != 'GRP') {
            alert('선택된 아이템은 그룹이 아닙니다.');
            return;
        }
        if (!confirm('[{0}] 그룹의 명칭 표시를 ON 하시겠습니까?'.substitute(d.itemName))) return;
        Server.post('/d3map/popup/setting/itemSetting/editItemShowLabelForGrp.do', {
            data: {mngNo: d.mngNo, showLabel: 1},
            success: function (result) {
                // d.showLabel = 1;
                // var node = objTopo.vars.svg.select("#g" + d.itemNo);
                // if(node != null) {
                //     node.selectAll('text.nodetext,rect.text_bg').style('visibility', 'visible');
                // }
                alert('명칭 표시를 ON으로 설정하였습니다.');
            }
        });
    },

    /** 명칭표시 > Off */
    chg_itemNmOff: function (elm, d, i, objTopo) {
        if (!confirm('[{0}] 그룹의 명칭 표시를 OFF 하시겠습니까?'.substitute(d.itemName))) return;
        Server.post('/d3map/popup/setting/itemSetting/editItemShowLabelForGrp.do', {
            data: {mngNo: d.mngNo, showLabel: 0},
            success: function (result) {
                // d.showLabel = 0;
                // var node = objTopo.vars.svg.select("#g" + d.itemNo);
                // if(node != null) {
                //     node.selectAll('text.nodetext,rect.text_bg').style('visibility', 'hidden');
                // }
                alert('명칭 표시를 OFF로 설정하였습니다.');
            }
        });
    },

    /** 변경 > 회선스타일 */
    chg_linkStyle: function (elm, d, i, objTopo) {

        var sNode, dNode;
        $.each(objTopo.vars.links, function (idx, value) {
            if (value.source.id == "g" + d.itemNo1) {
                sNode = value.source;
            }
            if (value.target.id == "g" + d.itemNo2) {
                dNode = value.target;
            }
        });

        if (objTopo.vars.selectPathLink.length <= 1) {
            objTopo.vars.selectPathLink = [], objTopo.vars.selectPathLink.push(d);
        }

        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pLineStyle.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '회선스타일 변경', result, 580, 300, 'pwindow_init', {
                    obj: elm,
                    data: objTopo.vars.selectPathLink,
                    sNode: sNode,
                    dNode: dNode,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 회선 > 곡선편집 */
    link_editCurveBegin: function (elm, d, i, objTopo) {
        if (d.lineType != TopoConst.lineType.curve) {
            alert("곡선만 편집이 가능합니다.");
            return;
        }
        objTopo.vars.mapMode = TopoConst.mapMode.LINE_EDIT;
        var path_d = $(elm).attr("d");
        var arr = path_d.split(" ");
        // var xy1Arr = arr[1].replace("C","").split(",");
        // var xy2Arr = arr[2].split(",");

        var x1 = parseFloat(arr[4]), y1 = parseFloat(arr[5]), x2 = parseFloat(arr[6]), y2 = parseFloat(arr[7]);
        var svgGroup = objTopo.vars.svg.select(".svgGroup");
        var data = [
            {x: x1, y: y1, type: 'source', node: d.source},
            {x: x2, y: y2, type: 'target', node: d.target}
        ];
        //bezier curve 좌표 circle 추가
        svgGroup.selectAll("circle.bezier")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "bezier")
            .attr("cx", function (d) {
                return d.x;
            }).attr("cy", function (d) {
            return d.y;
        })
            .attr("r", 10)
            .attr("stroke", "purple")
            .call(d3.drag()
                .on("start", circle_dragstart)
                .on("drag", circle_dragmove)
                .on("end", circle_dragend)
            )
            .on("mouseover", function (d) {
                var isSelected = d3.select(this).classed("circleactive");
                d3.selectAll("circle.bezier").attr("fill", "").classed("circleactive", false);
                d3.select(this).attr("fill", "red").classed("circleactive", true);
            })
            .on('mouseleave', function (d) {
                if (!_isDragging)
                    d3.selectAll("circle.bezier").attr("fill", "").classed("circleactive", false);
            });
        // node to bezier curve 편집용 link 추가(점선)
        svgGroup.selectAll("line.linkedit")
            .data(data)
            .enter()
            .append("line")
            .attr("class", "linkedit")
            .attr("x1", function (d) {
                return d.node.cx;
            })
            .attr("y1", function (d) {
                return d.node.cy;
            })
            .attr("x2", function (d) {
                return d.x;
            })
            .attr("y2", function (d) {
                return d.y;
            })
            .style("stroke-width", 1)
            .style("stroke", "#fffc00")
            .style("stroke-dasharray", ("6,3"));

        // circle drag and drop 이벤트 핸들러
        var _isDragging = false;

        function circle_dragstart(d) {
            _isDragging = true;
        }

        function circle_dragmove(d) {
            var _selectedCircle = objTopo.vars.svg.selectAll("circle.circleactive").data();
            // console.log(d3.event);
            for (var i = 0; i < _selectedCircle.length; i++) {
                var _d = _selectedCircle[i];
                // console.log(_d);
                _d.x += d3.event.dx;
                _d.y += d3.event.dy;
            }

            // circle 이동
            var circle = objTopo.vars.svg.selectAll("circle.circleactive");
            circle.attr("cx", d.x).attr("cy", d.y);

            // path "d" attribute update
            var path_darr = $(elm).attr("d").split(" "); //M 854.577 398.068 C 864.577 864.577 500 500 405.962 752.311
            var _data = circle.data()[0];
            // console.log(_data);
            if (_data.type == "source") {
                path_darr[4] = _data.x, path_darr[5] = _data.y;
            } else if (_data.type == "target") {
                path_darr[6] = _data.x, path_darr[7] = _data.y;
            }
            // console.log(path_darr.join(" "));
            $(elm).attr("d", path_darr.join(" "));

            // 편집 line update
            var line = objTopo.vars.svg.selectAll("line.linkedit");
            line.attr("x1", function (d) {
                return d.node.cx;
            }).attr("y1", function (d) {
                return d.node.cy;
            })
                .attr("x2", function (d) {
                    return d.x;
                }).attr("y2", function (d) {
                return d.y;
            });

            // circle.attr("transform", function(d) {
            //     return "translate(" + d.x + " , " + d.y + ")";
            // });
            // var circleData = circle.data()[0];
            // var newX = circleData.x, newY = circleData.y;
            // var path_d = $(elm).attr("d");
            // var arr = path_d.split(" ");
            // arr[5] = newX, arr[6] = newY;
            // $(elm).attr("d", arr.join(" "));
        }

        function circle_dragend(d2) {
            _isDragging = false;
            if (d2.x >= objTopo.vars.stageW)
                d2.x = objTopo.vars.stageW - 55;

            if (d2.y >= objTopo.vars.stageH)
                d2.y = objTopo.vars.stageH - 55;

            if (d2.x < 0)
                d2.x = 0;

            if (d2.y < 0)
                d2.y = 0;


            var _selectedCircle = objTopo.vars.svg.selectAll("circle.circleactive").data();
            if (_selectedCircle.length > 0) {
                for (var i = 0; i < _selectedCircle.length; i++) {
                    var g = _selectedCircle[i];

                    if (g.x >= objTopo.vars.stageW)
                        g.x = objTopo.vars.stageW - 55;

                    if (g.y >= objTopo.vars.stageH)
                        g.y = objTopo.vars.stageH - 55;

                    if (g.x < 0)
                        g.x = 0;

                    if (g.y < 0)
                        g.y = 0;


                    if (g.type == "source") {
                        d.sx = g.x;
                        d.sy = g.y;
                    } else if (g.type == "target") {
                        d.tx = g.x;
                        d.ty = g.y;
                    }
                }
            }

            var circle = objTopo.vars.svg.selectAll("circle.bezier").data();
            circle.forEach(function (item) {
                if (item.type == "source") {
                    d.curveX1 = item.x;
                    d.curveY1 = item.y;
                } else if (item.type == "target") {
                    d.curveX2 = item.x;
                    d.curveY2 = item.y;
                }
            });
        }
    },

    /** 회선 > 곡선편집종료 */
    link_editCurveEnd: function (elm, d, i, objTopo) {
        objTopo.vars.mapMode = TopoConst.mapMode.MANAGE;

        var svgGroup = objTopo.vars.svg.select(".svgGroup");
        svgGroup.selectAll("circle.bezier").remove();
        svgGroup.selectAll("line.linkedit").remove();
    },

    /** 삭제 > 아이콘 */
    del_icon: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();

        if (_selectedNodes.length == 0) {
            if (confirm("해당 아이템을 삭제하시겠습니까?") != true) return;
            Server.post('/d3map/popup/setting/itemDel/delItem.do', {
                data: d,
                success: function (result) {
                    objTopo.vars.isChangeTopo = true;
                    objTopo.delItemTick.call(objTopo, d, "d");
                    alert('삭제되었습니다.');
                }
            });
        } else {
            if (confirm("선택한 아이템을 삭제하시겠습니까?") != true) return;
            Server.post('/d3map/popup/setting/itemDel/delItem.do', {
                data: _selectedNodes[0],
                success: function (result) {
                    alert('삭제되었습니다.');

                    objTopo.delItemTick.call(objTopo, _selectedNodes[0], "d");
                }
            });
        }
    },

    /** 삭제 > 다중아이콘 */
    del_multiIcon: function (elm, d, i, objTopo) {
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();

        if (confirm("선택한 아이템들을 삭제하시겠습니까?") != true) return;

        var addParams = {
            isMulti: true,
            delItemList: _selectedNodes
        };

        Server.post('/d3map/popup/setting/itemDel/delItem.do', {
            data: addParams,
            success: function (result) {
                objTopo.vars.isChangeTopo = true;
                objTopo.delItemTick.call(objTopo, _selectedNodes, "multi");
                alert('삭제되었습니다.');
            }
        });
    },

    /** 삭제 > 회선 */
    del_link: function (elm, d, i, objTopo) {
        if (confirm("선택한 회선을 삭제하시겠습니까?") != true) return;
        // var _selectedLinks = [];
        // if (objTopo.vars.selectPathLink.length > 1)
        //     _selectedLinks = objTopo.vars.selectPathLink;
        // else
        //     _selectedLinks = [{linkNo: d.linkNo, point1: d.point1, point2: d.point2, point3: d.point3}];
        //
        // var addParams = {
        //     isMulti: true,
        //     delLinkList: _selectedLinks
        // };

        if (objTopo.vars.selectPathLink.length > 1) {
            Server.post('/d3map/popup/setting/itemDel/delLinkMulti.do', {
                data: {delLinkList: objTopo.vars.selectPathLink},
                success: function (result) {
                    objTopo.vars.isChangeTopo = true;
                    objTopo.vars.isChgLinkLablePosition = true;
                    objTopo.search();
                    alert('삭제되었습니다.');
                }
            });

        } else {
            Server.post('/d3map/popup/setting/itemDel/delLink.do', {

                data: {linkNo: d.linkNo, point1: d.point1, point2: d.point2, point3: d.point3},
                success: function (result) {
                    var _delIds = [];
                    if (d.point1 != 0) _delIds.push("g" + d.point1);
                    if (d.point2 != 0) _delIds.push("g" + d.point2);
                    if (d.point3 != 0) _delIds.push("g" + d.point3);

                    // delete point
                    if (_delIds.length > 0) {
                        for (var i = objTopo.vars.nodes.length - 1; i >= 0; i--) {
                            var node = objTopo.vars.nodes[i];
                            if ($.inArray(node.id, _delIds) != -1) {
                                objTopo.vars.nodes.splice(i, 1);
                            }
                        }
                    }

                    // delete link
                    for (var j = objTopo.vars.links.length - 1; j >= 0; j--) {
                        var link = objTopo.vars.links[j];
                        if ($.inArray(link.linkNo, [d.linkNo]) != -1) {
                            objTopo.vars.links.splice(j, 1);
                        }
                    }

                    // refresh node
                    if (_delIds.length > 0) {
                        objTopo.vars.simulation.nodes(objTopo.vars.nodes);
                        TopoItem.callRefresh(objTopo);
                    }

                    // refresh link
                    objTopo.vars.simulation.force("link").links(objTopo.vars.links);
                    var retValue = TopoLink.callRefresh(objTopo);
                    if (retValue) TopoLinkLabel.callRefresh(objTopo);


                    objTopo.tick.call(objTopo);
                    objTopo.createImageFlow();
                    alert('삭제되었습니다.');
                }
            });

        }


    },

    /** 변경 > spline 스타일 */
    chg_splineStyle: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pSplineStyle.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '선 스타일 변경', result, 600, 300, 'pwindow_init', {
                    obj: elm,
                    data: d,
                    objTopo: objTopo
                });
            }
        );
    },

    /** 포인트추가 > spline */
    add_splinePoint: function (elm, d, i, objTopo) {
        if (confirm("포인트를 추가하시겠습니까?") != true) return;

        points = JSON.parse(d.splineConf);

        if (points.splinePoint.length == 100) {
            alert("포인트를 더 이상 추가하실수 없습니다.");
            return;
        }

        var splinePath = objTopo.vars.svg.selectAll("path.spline").filter(function (l, i) {
            return l.splineNo == d.splineNo;
        }).node();

        var p = splinePath.getPointAtLength(0.05 * splinePath.getTotalLength()); //circle add point
        var addPoint = [Math.floor(p.x), Math.floor(p.y)];
        points.splinePoint.splice(1, 0, addPoint);

        // points.splinePoint.push(objTopo.vars.mousePosition);
        // points.splinePoint.sort();

        TopoSpline.updateSplinePath(d, points, d.splineNo);
        objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
    },

    /** 포인트삭제 > spline */
    del_splinePoint: function (elm, d, i, objTopo) {
        if (confirm("포인트를 삭제하시겠습니까?") != true) return;

        var delPoint = objTopo.vars.svg.selectAll('circle.splinePoints.splinePointSelected').datum();

        var splineNo = parseInt(objTopo.vars.svg.selectAll('circle.splinePoints.splinePointSelected').attr("data-splineNo"));

        var splinePath = objTopo.vars.svg.selectAll("path.spline").filter(function (l, i) {
            return l.splineNo == splineNo;
        });

        var points = JSON.parse(splinePath.data()[0].splineConf);

        // points.splinePoint.forEach(function (datum, index) {
        //     datum[0] += evt.dx;
        //     datum[1] += evt.dy;
        // });

        if (points.splinePoint.length == 2) {
            alert("포인트를 더 이상 삭제하실수 없습니다.");
            return;
        }

        for (i=0; i<points.splinePoint.length; i++ ) {
            var arr = points.splinePoint[i];
            if (arr[0] == delPoint[0] && arr[1] == delPoint[1]) {
                points.splinePoint.splice(i, 1);
                break;
                //i--;
            }
        }

        TopoSpline.updateSplinePath(splinePath.data()[0], points, splineNo);
        objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
    },

    /** 삭제 > spline */
    del_splineTool: function (elm, d, i, objTopo) {
        if (!confirm('그리기도구를 삭제하시겠습니까?')) return;

        var _selectedSpline = [];
        _selectedSpline.push(d);

        var addParams = {
            delItemList: _selectedSpline
        };

        //delDrawTool
        Server.post('/d3map/popup/setting/drawTool/delSplineTool.do', {
            data: addParams,
            success: function () {
                objTopo.delSplineTick.call(objTopo, _selectedSpline);
                alert('삭제되었습니다.');
            }
        })
    },

    /** 삭제 > 포인트 */
    del_point: function (elm, d, i, objTopo) {
        if (confirm("선택한 포인트를 삭제하시겠습니까?") != true) return;

        Server.post('/d3map/popup/setting/itemDel/delPoint.do', {
            data: d,
            success: function (result) {
                alert('삭제되었습니다.');

                objTopo.delItemTick.call(objTopo, d, "d");
            }
        });
    },

    /** 환경설정 */
    save_envSetting: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pEnvSetting.do',
            function (result) {
                /** HmWindow.openFit에서 HmWindow.open으로 변경 */
                HmWindow.open($('#pwindow'), '환경설정', result, 1430, 560, null, {objTopo: objTopo});

            }
        );
    },

    /** 맵저장 */
    save_map: function (elm, d, i, objTopo) {
        var svgGroup = objTopo.vars.svg.select(".svgGroup");
        var links = svgGroup.selectAll("path.link").data();
        var items = svgGroup.selectAll("g.node").data();
        var linkData = [], itemData = [], linkLabelData = [];
        links.forEach(function (item) {
            if (item.lineType == "2") {
                var obj = {
                    linkNo: item.linkNo,
                    lineType: item.lineType,
                    curveX1: item.curveX1.toFixed(2),
                    curveY1: item.curveY1.toFixed(2),
                    curveX2: item.curveX2.toFixed(2),
                    curveY2: item.curveY2.toFixed(2)
                };
                linkData.push(obj);
            }
        });
        items.forEach(function (item) {
            var pos = objTopo.convertSaveLocation.call(objTopo, [item.x, item.y]);
            itemData.push({itemNo: item.itemNo, xpoint: pos[0], ypoint: pos[1]});
        });

        /* 회선 명칭 이동하였을 경우 장비 회선명칭 위치 저장 */
        if (objTopo.vars.isChgLinkLablePosition) objTopo.vars.isChgLinkLablePosition = false;

        linkLabelData = TopoLinkLabel.getMapPos(objTopo);

        /**
         * 그리기도구 저장 로직 추가
         * 2020.10.30   by jjung
         */
        var drawData = TopoDraw.getMapPos(objTopo);

        /**
         * 그리기도구 중 라인 저장 로직 추가
         * 2022.06.03   jyl
         */
        var splineData = TopoSpline.getMapPos(objTopo);

        /* 시계 저장 로직 추가 2022.05.10  jyLim */
        var digitClockConf = TopoDigitalClock.getDigitClockEnvInfo(objTopo);

        Server.post('/d3map/popup/setting/modeSetting/saveMapPosition.do', {
            data: {linkList: linkData,
                itemList: itemData,
                drawList: drawData,
                digitClockConf: digitClockConf,
                splineList: splineData,
                linkLabelList: linkLabelData
            },
            success: function (result) {
                if (!d) alert("저장되었습니다.");
                objTopo.modeConditionSet(objTopo);
                objTopo.vars.isMove = false;
                objTopo.vars.isChangeTopo = true;
                return true;
            }
        });

    },

    /** 이미지 저장(스샷) */
    save_screenshot: function (elm, d, i, objTopo) {
        /**
         * 중요
         *  이미지 export 데이터생성시 image/png 타입으로 생성하면 전송데이터가 너무 방대하여 postSize를 초과하는 문제가 발생할수 있음.
         *  이로인해 서버에 데이터 전송이 되지 않아 image/jpeg 타입으로 생성하여 데이터량을 줄여 jpg 파일로 이미지 저장을 진행한다.
         *  2018.04.04 by jjung
         * @type {string}
         */

        var agent = navigator.userAgent.toLowerCase(),
            appVer = navigator.appVersion.toLowerCase(),
            isIE = agent.indexOf("msie") !== -1 || appVer.indexOf("trident/") > 0;

        // IE Browser Export
        if (isIE) { // TODO 보안이슈로 동작하지 않음!!! (canvas.toDataURL() -> security error)

            // var svg = document.querySelector("#mapCanvas");
            // var svg = $("#mapCanvas");

            // try {
            //      html2canvas(svg, {
            //          }).then(function (canvas) {
            //              console.log(canvas);
            //              var base64image = canvas.toDataURL("image/png");
            //              // triggerDownload(base64image);
            //
            //              var params = {fname: 'topology', imgData: base64image};
            //              var frm = $('#hForm');
            //              frm.empty();
            //              if (params !== undefined && params !== null) {
            //                  $.each(params, function (key, value) {
            //                      $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
            //                  });
            //              }
            //              frm.attr('method', 'POST');
            //              frm.attr('target', 'hFrame');
            //              frm.attr('action', '/file/exportImage.do');
            //              frm.submit();
            //              frm.empty();
            //          });
            //  } catch (e) {
            //      alert(e);
            //  }

            var svg = objTopo.vars.svg.node();
            svg.toDataURL("image/jpeg", {
                renderer: "canvg",
                callback: function (data) {
                    var params = {fname: 'topology', imgData: data};
                    var frm = $('#hForm');
                    frm.empty();
                    if (params !== undefined && params !== null) {
                        $.each(params, function (key, value) {
                            // console.log(key + " - " + value);
                            $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
                        });
                    }

                    frm.attr('method', 'POST');
                    frm.attr('target', 'hFrame');
                    frm.attr('action', '/file/exportImage.do');
                    frm.submit();
                    frm.empty();
                }
            });
        } else {
            // chrome export
            var svg = document.querySelector("#mapCanvas");
            if (svg == null) { //layout에 삽입된 경우 객체 조회
                svg = document.querySelector('#' + objTopo.vars.mapCanvas.parent().closest('div').attr('id') + ' > div[name=mapCanvas]');
            }
            try {
                html2canvas(svg, {
                    // foreignObjectRendering: true,
                    // logging: true,
                    // allowTaint: true,
                    // useCORS: false,
                    // crossOrigin: true
                    // taintTest: false,
                }).then(function (canvas) {
                    var base64image = canvas.toDataURL("image/jpeg");
                    // triggerDownload(base64image);
                    // alert(base64image.length);
                    var params = {fname: 'topology', imgData: base64image};
                    var frm = $('#hForm');
                    frm.empty();
                    if (params !== undefined && params !== null) {
                        $.each(params, function (key, value) {
                            $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
                        });
                    }
                    frm.attr('method', 'POST');
                    frm.attr('target', 'hFrame');
                    frm.attr('action', '/file/exportImage.do');
                    frm.submit();
                    frm.empty();
                });
            } catch (e) {
                alert(e);
            }
        }

        // not use
        function triggerDownload(imgURI) {
            var a = document.createElement('a');
            a.download = "D3Topology.png";
            a.href = imgURI;
            a.click();
        }

        function getSVGString(svgNode) {
            svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
            var cssStyleText = getCSSStyles(svgNode);
            appendCSS(cssStyleText, svgNode);

            var serializer = new XMLSerializer();
            var svgString = serializer.serializeToString(svgNode);
            svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
            svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

            return svgString;

            function getCSSStyles(parentElement) {
                var selectorTextArr = [];

                // Add Parent element Id and Classes to the list
                selectorTextArr.push('#' + parentElement.id);
                if (parentElement.classList != null)
                    for (var c = 0; c < parentElement.classList.length; c++)
                        if (!contains('.' + parentElement.classList[c], selectorTextArr))
                            selectorTextArr.push('.' + parentElement.classList[c]);

                // Add Children element Ids and Classes to the list
                var nodes = parentElement.getElementsByTagName("*");
                for (var i = 0; i < nodes.length; i++) {
                    var id = nodes[i].id;
                    if (!contains('#' + id, selectorTextArr))
                        selectorTextArr.push('#' + id);

                    var classes = nodes[i].classList;
                    if (classes != null)
                        for (var c = 0; c < classes.length; c++)
                            if (!contains('.' + classes[c], selectorTextArr))
                                selectorTextArr.push('.' + classes[c]);
                }

                // Extract CSS Rules
                var extractedCSSText = "";
                for (var i = 0; i < document.styleSheets.length; i++) {
                    var s = document.styleSheets[i];

                    try {
                        if (!s.cssRules) continue;
                    } catch (e) {
                        if (e.name !== 'SecurityError') throw e; // for Firefox
                        continue;
                    }

                    var cssRules = s.cssRules;
                    for (var r = 0; r < cssRules.length; r++) {
                        if (contains(cssRules[r].selectorText, selectorTextArr))
                            extractedCSSText += cssRules[r].cssText;
                    }
                }


                return extractedCSSText;

                function contains(str, arr) {
                    return arr.indexOf(str) === -1 ? false : true;
                }

            }

            function appendCSS(cssText, element) {
                var styleElement = document.createElement("style");
                styleElement.setAttribute("type", "text/css");
                styleElement.innerHTML = cssText;
                console.log(element);
                var refNode = element.hasChildNodes() ? element.childNodes[0] : null;
                element.insertBefore(styleElement, refNode);
            }
        }

        function svgString2Image(svgString, width, height, format, callback) {
            var format = format ? format : 'png';

            var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            var image = new Image();
            image.onload = function () {
                context.clearRect(0, 0, width, height);
                context.drawImage(image, 0, 0, width, height);

                canvas.toBlob(function (blob) {
                    var filesize = Math.round(blob.length / 1024) + ' KB';
                    if (callback) callback(blob, filesize);
                });


            };

            image.src = imgsrc;
        }
    },

    /** 토폴로지 Import */
    importMap: function (elm, d, i, objTopo) {
        if (!confirm("[주의] 현재 구성되어 있는 토폴로지는 삭제되고 업로드되는 파일로 재구성됩니다. 계속 진행하시겠습니까?")) return;

        var params = {
            limitCnt: 1, accept: ".xml", ableFileType: ["XML"],
            uploadUrl: ctxPath + '/d3map/popup/setting/dump/saveImportTopology.do',
            callbackFn: function () {
                location.reload();
            }
        };
        $.post("/d3map/popup/setting/pFileUpload.do", function (result) {
            HmWindow.open($('#pwindow'), "토폴로지 Import", result, 400, 250, "pwindow_init", params);
        });
    },

    /** 토폴로지 Export */
    exportMap: function (elm, d, i, objTopo) {
        Server.get('/d3map/popup/setting/dump/exportTopology.do', {
            success: function (result) {
                HmUtil.fileDown({filePath: result.filePath, fileName: result.fileName, fileExt: ".xml"});
            },
            error: function (result) {
                alert(result.errorInfo.message);
            }
        });
    },

    /** 운영도구 */
    tool_ping: function (elm, d, i, objTopo) {
        var siteName = $('#gSiteName').val();
        // if(siteName == 'KTnG'){
        //     ActiveX.ping(d.mngNo);
        // } else {
        //     ActiveX.ping(d.devIp);
        // }
        if (siteName == 'KTnG') {
            var params = {mngNo: d.mngNo || 0};
        } else {
            var params = {devIp: d.devIp || 0};
        }
        HmUtil.showPingPopup(params);
    },

    tool_tracert: function (elm, d, i, objTopo) {
        var params = {mngNo: d.mngNo};
        HmUtil.showTracertPopup(params);
    },

    tool_telnet: function (elm, d, i, objTopo) {
        ActiveX.telnet(d.devIp);
    },

    tool_ssh: function (elm, d, i, objTopo) {
        // ActiveX.ssh(d.devIp);
        if (Extensions.isSupport()) {
            Extensions.ssh(d.devIp, d.mngNo);
        } else {
            ActiveX.ssh(d.devIp);
        }
    },

    tool_http: function (elm, d, i, objTopo) {
        ActiveX.http(d.devIp);
    },

    tool_https: function (elm, d, i, objTopo) {
        ActiveX.https(d.devIp);
    },
    url_template_call: function (elm, d, i, objTopo) {
        Server.post('/d3map/popup/setting/itemSetting/getDevUrlTempleteList.do', {
            data: {mngNo: d.mngNo, codeId: this.codeId},
            success: function (result) {
                if (result.length > 0) {
                    var url = result[0].codeValue1 + "://" + result[0].codeValue2 + result[0].codeValue3 + result[0].codeValue4
                        + result[0].codeValue5 + result[0].codeValue6 + result[0].codeValue7 + result[0].codeValue8;
                    window.open(url, '_blank');
                } else {
                    alert("등록된 URL이 없습니다.");
                }
            }
        });
    },

    dumpToXML: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post("/d3map/popup/setting/pTopoBackup.do", function (result) {
            HmWindow.openFit($('#pwindow'), "토폴로지 Backup", result, 400, 300, "pwindow_init", {objTopo: objTopo});
        });
    },

    restoreFromDumpXML: function (elm, d, i, objTopo) {
        $.post("/d3map/popup/setting/pTopoRestore.do", function (result) {
            HmWindow.open($('#pwindow'), "토폴로지 Restore", result, 650, 500, "pwindow_init", {objTopo: objTopo});
        });
    },

    restoreHist: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post("/d3map/popup/setting/pTopoRestoreHist.do", function (result) {
            HmWindow.openFit($('#pwindow'), "토폴로지 복원이력", result, 800, 600, "pwindow_init");
        });
    },

    /* 그리기 도구 */
    add_shapeRectangle: function (elm, d, i, objTopo) {
        topo_menu_action.drawShape(objTopo, {devKind1: 'DRAW_SHAPE', devKind2: 'RECT'});
    },
    add_shapeRoundedRectangle: function (elm, d, i, objTopo) {
        topo_menu_action.drawShape(objTopo, {devKind1: 'DRAW_SHAPE', devKind2: 'RECT', cornerRadius: 20});
    },
    add_shapeCircle: function (elm, d, i, objTopo) {
        topo_menu_action.drawShape(objTopo, {devKind1: 'DRAW_SHAPE', devKind2: 'ELLIPSE'});
    },
    add_splinePath: function (elm, d, i, objTopo) {
        topo_menu_action.drawSpline(objTopo, {devKind1: 'DRAW_LINE', devKind2: 'SPLINE'});
    },
    add_shapeText: function (elm, d, i, objTopo) {
        topo_menu_action.drawShape(objTopo, {devKind1: 'DRAW_TEXT', devKind2: 'TEXT'});
    },
    add_shapeTextArea: function (elm, d, i, objTopo) {
        topo_menu_action.drawShape(objTopo, {devKind1: 'DRAW_TEXT_AREA', devKind2: 'TEXT'});
    },
    add_shapeImage: function (elm, d, i, objTopo) {
        topo_menu_action.drawShape(objTopo, {devKind1: 'DRAW_IMAGE', devKind2: 'IMAGE'});
    },



    drawShape: function (objTopo, options) {
        var drawConf = null;

        if (options.devKind1 === 'DRAW_SHAPE') {
            drawConf = JSON.stringify({
                drawText: '',
                fontSize: 20,
                fontWeight: '1',
                fillColor: '#000000',
                fillOpacity: 1,
                textHorizontal: 'start',
                textVertical: 'top',
                positionHorizontal: 0,
                positionVertical: 0
            });
        }
        var addData = {
            grpNo: objTopo.vars.curGrpNo,
            id: 'draw0',
            posX: 200,
            posY: 200,
            width: 100,
            height: 100,
            fillColor: d3.schemeCategory20[0],
            fillOpacity: options.devKind2 == 'TEXT' ? 1 : 0.7,
            strokeColor: d3.schemeCategory20[1],
            strokeOpacity: options.devKind2 == 'TEXT' ? 0 : 1,
            strokeWidth: 1,
            cornerRadius: 0,
            drawConf: drawConf,
        };

        if (options != null) {
            $.extend(addData, options);
        }

        Server.post('/d3map/popup/setting/drawTool/addDrawTool.do', {
            data: addData,
            success: function (result) {
                result.id = 'draw{0}'.substitute(result.drawNo);
                refreshDraw(result);
            }
        });

        // 추가된 도형을 UI에 표현
        function refreshDraw(data) {
            var shape_call = objTopo.createShapeDrags(objTopo, objTopo.shapeDragstart, objTopo.shapeDragmove, objTopo.shapeDragend);
            var orgdata = objTopo.vars.svg.select("g.grp_object").selectAll("g.shape").data();
            orgdata.push(data);
            TopoDraw.refresh(objTopo, objTopo.vars.svg, orgdata, shape_call, objTopo.createBBox);
            TopoRotate.shapeRotatorReDraw(objTopo);
        }
    },

    drawSpline: function (objTopo, options) {

        var width = objTopo.vars.width;
        var height = objTopo.vars.height;
        var pointsCnt = 2;
        var points = d3.range(1, pointsCnt + 1).map(function(i) {
            return [i * width / 5, height / 10];
        });

        var lineGenerator = d3.line().curve(d3.curveLinear);
        var lineString = lineGenerator(points.slice(0, points.length));

        var addData = {
            grpNo: objTopo.vars.curGrpNo,
            id: 'spline0',
            splineType: 'curveLinear',
            splineString: lineString,
            pointsCnt: pointsCnt,
            splineSize: 2,
            splineStyle: '',
            splineColor: '#A3A3A3',
            splineConf: JSON.stringify({
                splinePoint: points,
                splineFlowEffect: 'None',
                splineFlowEffectSpeed: 0,
                splineFlowEffectCount: 0,
                splineFlowEffectColor: '#FF0000',
                splineLabel: '0',
                splineLabelText: '',
                splineLabelFontSize: 11,
                splineLabelColor: '#a3a3a3',
                startMarker: 'none',
                endMarker: 'none'
            })

        };

        Server.post('/d3map/popup/setting/drawTool/addSplineTool.do', {
            data: addData,
            success: function (result) {
                result.id = 'draw{0}'.substitute(result.splineNo);
                refreshDraw(result);
            }
        });


        // 추가된 spline 을 UI에 표현
        function refreshDraw(data) {
            // var shape_call = objTopo.createShapeDrags(objTopo, objTopo.shapeDragstart, objTopo.shapeDragmove, objTopo.shapeDragend);
            var orgdata = objTopo.vars.svgGroup.selectAll("path.spline").data();
            orgdata.push(data);
            TopoSpline.refresh(objTopo, objTopo.vars.svg, orgdata);
        }




        // var lineType = "curveLinear"; // d3.line().curve(d3["curveLinear"]);
        //
        // TopoSpline.addLine(objTopo, lineType, points);


    },

    del_drawTool: function (elm, d, i, objTopo) {
        if (!confirm('그리기도구를 삭제하시겠습니까?')) return;

        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes.length == 0) {
            _selectedShapes.push(d);
        }

        var addParams = {
            isMulti: _selectedShapes.length > 1 ? true : false,
            delItemList: _selectedShapes
        };

        Server.post('/d3map/popup/setting/drawTool/delDrawTool.do', {
            data: addParams,
            success: function () {
                objTopo.delDrawTick.call(objTopo, _selectedShapes, "multi");
                alert('삭제되었습니다.');
            }
        })
    },

    drawShape__: function (elm, d, i, objTopo) {
        var orgdata = objTopo.vars.svgGroup.selectAll("g.shape").data();
        console.log(orgdata);
        if (orgdata.length > 0) {
            orgdata.push({transX: 1000, transY: 300});
        } else {
            for (var i = 1; i <= 3; i++) {
                orgdata.push({
                    devKind1: "DRAW_SHAPE",
                    id: 's' + i,
                    posX: 300 * i,
                    posY: 300,
                    width: Math.floor(Math.random() * (600 - 100 + 1) + 100),
                    height: Math.floor(Math.random() * (600 - 100 + 1) + 100),
                    fillColor: d3.schemeCategory20[Math.floor(Math.random() * 11)],
                    fillOpacity: Math.random().toFixed(1),
                    strokeColor: d3.schemeCategory20[Math.floor(Math.random() * 11)],
                    strokeOpacity: Math.random().toFixed(1),
                    strokeWidth: Math.random() * 10,
                    cornerRadius: Math.floor(Math.random() * (10 - 0 + 1) + 0),
                });
            }
        }
        rectgrp = objTopo.vars.svgGroup.selectAll("g.shape")
            .data(orgdata)
            .enter()
            .insert("g", "path.link")
            .attr("id", function (d) {
                return d.id;
            })
            .classed("shape", true)
            .attr("transform", function (d) {
                return "translate({0}, {1})".substitute(d.posX, d.posY);
            })
            // .style("cursor", "move")
            .call(d3.drag()// call specific function when circle is dragged
                .on("drag", function (d) {
                    console.log("dragged", d3.event.sourceEvent);
                    var dx = d3.event.sourceEvent.offsetX,
                        dy = d3.event.sourceEvent.offsetY;

                    var dragTarget = d3.select(this);
                    console.log(d3.event.dx, d3.event.dy, dx, dy, d3.select(this).attr("x"));

                    d.posX += d3.event.dx;
                    d.posY += d3.event.dy;
                    d3.select(this)
                        .attr("transform", function (d) {
                            return "translate({0},{1})".substitute(d.posX, d.posY);
                        });
                }))
            .on("click", function (d) {
                console.log("shape clicked");
                objTopo.vars.svgGroup.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").attr("display", "none");
                d3.select(this).classed("shapeactive", true).select("rect.shapeselection").attr("display", "block");
                try {
                    pwindow_initset();
                } catch (e) {

                }

            });

        rectgrp.append("rect")
            .attr("width", function (d) {
                return d.width + 20;
            }).attr("height", function (d) {
            return d.height + 20;
        })
            .classed("shapeselection", true)
            .attr("fill", "transparent")
            .attr("stroke", "#ff0000")
            .attr("stroke-width", 3)
            .style("stroke-dasharray", "5,5")
            .attr("display", "none");

        rectgrp.append("rect")
            .attr("class", "shape")
            .attr("x", 10).attr("y", 10)
            .attr("width", function (d) {
                return d.width;
            })
            .attr("height", function (d) {
                return d.height;
            })
            .attr("fill", function (d) {
                return d.fillColor;
            })
            .style("fill-opacity", function (d) {
                return d.fillOpacity;
            })
            .attr("stroke", function (d) {
                return d.strokeColor;
            })
            .style("stroke-opacity", function (d) {
                return d.strokeOpacity;
            })
            .style("stroke-width", function (d) {
                return d.strokeWidth;
            });

        rectgrp.append("image")
            .attr("xlink:href", "/img/resizeBR.png")
            .attr("x", function (d) {
                return d.width - 10;
            })
            .attr("y", function (d) {
                return d.height - 10;
            })
            .attr("width", 20)
            .attr("height", 20)
            .call(d3.drag()
                .on("drag", function (d) {
                    var dx = d3.event.dx, dy = d3.event.dy;
                    var dragTarget = d3.select(this.parentNode).selectAll("rect");
                    dragTarget
                        .attr("width", function (d) {
                            return parseInt(d3.select(this).attr("width")) + d3.event.dx;
                        })
                        .attr("height", function (d) {
                            return parseInt(d3.select(this).attr("height")) + d3.event.dy;
                        });
                    d3.select(this)
                        .attr("x", function (d) {
                            return parseInt(d3.select(this).attr("x")) + d3.event.dx;
                        })
                        .attr("y", function (d) {
                            return parseInt(d3.select(this).attr("y")) + d3.event.dy;
                        });
                }));


        // Text append
        var textgrp = objTopo.vars.svgGroup.selectAll("g.drawText")
            .data([{
                id: "t1",
                devKind1: "DRAW_TEXT",
                textContent: "jjung SVG",
                posX: 150,
                posY: 100,
                textSize: 40,
                textColor: '#ffff00'
            }])
            .enter()
            .insert("g", "path.link")
            .attr("id", function (d) {
                return d.id;
            })
            .classed("drawText", true)
            .attr("transform", function (d) {
                return "translate({0},{1})".substitute(d.posX, d.posY);
            })
            .call(d3.drag()// call specific function when circle is dragged
                .on("drag", function (d) {
                    console.log("dragged", d3.event.sourceEvent);
                    var dx = d3.event.sourceEvent.offsetX,
                        dy = d3.event.sourceEvent.offsetY;

                    var dragTarget = d3.select(this);
                    console.log(d3.event.dx, d3.event.dy, dx, dy, d3.select(this).attr("x"));

                    d.posX += d3.event.dx;
                    d.posY += d3.event.dy;
                    d3.select(this)
                        .attr("transform", function (d) {
                            return "translate({0},{1})".substitute(d.posX, d.posY);
                        });
                }));
        textgrp.append("text")
            .classed("drawText", true)
            // .attr("x", function(d) { return d.posX; })
            // .attr("y", function(d) { return d.posY; })
            .attr("font-size", function (d) {
                return d.textSize;
            })
            .attr("text-anchor", "middle")
            .attr("fill", function (d) {
                return d.textColor;
            })
            .text(function (d) {
                return d.textContent;
            })
            .call(objTopo.createBBox);
        // .call(d3.drag()
        //     .on("drag", function(d) {
        //         var dx = d3.event.dx, dy = d3.event.dy;
        //         d.posX =
        //         d3.select(this.parentNode)
        //             .attr("transform", function(d) { return })
        //             .attr("x", function(d) { return parseInt(d3.select(this).attr("x")) + d3.event.dx; })
        //             .attr("y", function(d) { return parseInt(d3.select(this).attr("y")) + d3.event.dy; });
        //     }));
        textgrp.selectInsert("rect", "text.drawText")
            .attr("width", function (d) {
                return d.bbox.width;
            })
            .attr("height", function (d) {
                return d.bbox.height;
            })
            .attr("x", function (d) {
                return d.bbox.x;
            }).attr("y", function (d) {
            return d.bbox.y;
        })
            .classed("shapeselection", true)
            .attr("fill", "transparent")
            .attr("stroke", "#ff0000")
            .attr("stroke-width", 3)
            .style("stroke-dasharray", "5,5")
            .attr("display", "block");
    },

    /* 도형 스타일 */
    showDrawShapeTool: function (elm, d, i, objTopo) {

        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes.length == 0) {
            _selectedShapes.push(d);
        }

        $.post(ctxPath + '/d3map/popup/setting/pDrawTool.do', function (result) {
            if (popup) {
                HmWindow.close($('#pTool'));
            } else {
                popup = HmWindow.createNewWindow('pTool');
            }
            $('#pTool').jqxWindow({isModal: true});
            HmWindow.openFit($('#pTool'), '도형 스타일', result, 560, 600, 'pwindow_init', {
                nodes: _selectedShapes,
                objTopo: objTopo,
                nodeType: "shape"
            });
        });
    },

    /* 도형텍스트 */
    drawShapeText: function (elm, d, i, objTopo) {

        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes.length == 0) {
            _selectedShapes.push(d);
        }

        $.post(ctxPath + '/d3map/popup/setting/pDrawShapeText.do', function (result) {
            if (popup) {
                HmWindow.close($('#pTool'));
            } else {
                popup = HmWindow.createNewWindow('pTool');
            }
            $('#pTool').jqxWindow({isModal: true});
            HmWindow.openFit($('#pTool'), '도형 텍스트', result, 560, 400, 'pwindow_init', {
                nodes: _selectedShapes,
                objTopo: objTopo,
                nodeType: "shape"
            });
        });
    },

    /*  Text 스타일 */
    showDrawTextTool: function (elm, d, i, objTopo) {
        //var _node = d3.select("g#{0}".substitute(d.id));
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes.length == 0) {
            _selectedShapes.push(d);
        }
        $.post(ctxPath + '/d3map/popup/setting/pDrawTextTool.do', function (result) {
            if (popup) {
                HmWindow.close($('#pTool'));
            } else {
                popup = HmWindow.createNewWindow('pTool');
            }
            $('#pTool').jqxWindow({isModal: true});
            HmWindow.openFit($('#pTool'), '텍스트 스타일', result, 500, 370, 'pwindow_init', {
                nodes: _selectedShapes,
                objTopo: objTopo,
                nodeType: "text"//,
                //node: _node.select("text")
            });
        });
    },

    /* TextArea 스타일 */
    showDrawTextAreaTool: function (elm, d, i, objTopo) {
        // var _node = d3.select("g#{0}".substitute(d.id));
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes.length == 0) {
            _selectedShapes.push(d);
        }
        $.post(ctxPath + '/d3map/popup/setting/pDrawTextAreaTool.do', function (result) {
            if (popup) {
                HmWindow.close($('#pTool'));
            } else {
                popup = HmWindow.createNewWindow('pTool');
            }
            $('#pTool').jqxWindow({isModal: true});
            HmWindow.openFit($('#pTool'), '텍스트 스타일', result, 560, 350, 'pwindow_init', {
                objTopo: objTopo,
                nodeType: "text",
                nodes: _selectedShapes,
                // node: _node.select("text")
            });
        });
    },

    /**
     * 2020.10.30 일 기준으로 [저장]기능에 통합
     * by jjung
     */
    // save_drawTool: function(elm, d, i, objTopo) {
    //     var _drawList = TopoDraw.getMapPos(objTopo);
    //     if(_drawList == null || _drawList.length == 0) {
    //         alert('저장할 데이터가 없습니다.');
    //         return;
    //     }
    //     Server.post('/d3map/popup/setting/drawTool/saveMapPosition.do', {
    //         data: {drawList: _drawList},
    //         success: function(result) {
    //             alert('저장되었습니다.');
    //         }
    //     });
    // },

    saveDrawMap: function (elm, d, i, objTopo) {
        var list = TopoDraw.getMapPos(objTopo);
        return list;
    },

    // 그리기도구 > 앞으로 가져오기
    moveToFront: function (elm, d, i, objTopo) {
        /* node  */
        var _node = null, _nextNode = null;
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        $.each(_selectedNodes, function (idx, value) {
            _node = d3.select("g#{0}".substitute(value.id)).node();
            _nextNode = _node.nextSibling;
            if (_nextNode == null) return;
            _node.parentNode.insertBefore(_nextNode, _node);
        });

        /* shape  */
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        $.each(_selectedShapes, function (idx, value) {
            _node = d3.select("g#{0}".substitute(value.id)).node();
            _nextNode = _node.nextSibling;
            if (_nextNode == null) return;
            _node.parentNode.insertBefore(_nextNode, _node);
        });

    },

    // 그리기도구 > 뒤로 보내기
    moveToBack: function (elm, d, i, objTopo) {
        // var _node = d3.select("g#{0}".substitute(d.id)).node();
        // var _prevNode = _node.previousSibling;
        // if (_prevNode == null) return;
        // _node.parentNode.insertBefore(_node, _prevNode);

        /* node  */
        var _node = null, _prevNode = null;
        var _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        $.each(_selectedNodes, function (idx, value) {
            _node = d3.select("g#{0}".substitute(value.id)).node();
            _prevNode = _node.previousSibling;
            if (_prevNode == null) return;
            _node.parentNode.insertBefore(_node, _prevNode);
        });

        /* shape  */
        var _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        $.each(_selectedShapes, function (idx, value) {
            _node = d3.select("g#{0}".substitute(value.id)).node();
            _prevNode = _node.previousSibling;
            if (_prevNode == null) return;
            _node.parentNode.insertBefore(_node, _prevNode);
        });


    },

    // 그리기도구 > 맨 앞으로 가져오기
    bringToFront: function (elm, d, i, objTopo) {
        // var _node = d3.select("g#{0}".substitute(d.id));
        // _node.raise();
        $.each(objTopo.vars.svg.selectAll("g.node rect.nodeactive").nodes(), function (idx, value) {
            d3.select(value).raise();
        });

        $.each(objTopo.vars.svg.selectAll("g.shape.shapeactive").nodes(), function (idx, value) {
            d3.select(value).raise();
        });

    },

    // 그리기도구 > 맨 뒤로 보내기
    bringToBack: function (elm, d, i, objTopo) {
        // var _node = d3.select("g#{0}".substitute(d.id));
        // _node.lower();

        $.each(objTopo.vars.svg.selectAll("g.node rect.nodeactive").nodes(), function (idx, value) {
            d3.select(value).lower();
        });

        $.each(objTopo.vars.svg.selectAll("g.shape.shapeactive").nodes(), function (idx, value) {
            d3.select(value).lower();
        });
    },

    /*
        디지털 시계 보기/숨기기
     */
    view_digitClock: function (elm, d, i, objTopo) {
        // debugger
        // var viewVal = objTopo.vars.isViewClock ? "block" : "none";
        objTopo.vars.isViewClock = !objTopo.vars.isViewClock;

        if (objTopo.vars.isViewClock)  $(".clockOnOff").children("img").attr("src", '../../img/d3/menu/navi/topoNav33.svg')
        else $(".clockOnOff").children("img").attr("src", '../../img/d3/menu/navi/topoNav10.svg')

        objTopo.vars.svgGroup.select("g.grp_clock").style("display", objTopo.vars.isViewClock ? "block" : "none" );
        objTopo.vars.svgGroup.select(".clockBackground").style("display", objTopo.vars.isViewClock ? "block" : "none" );

    },

    /** 디지털시계 스타일 */
    chg_digitClock: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pDigitClockStyle.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '디지털시계 스타일 변경', result, 380, 150, 'pwindow_init', {
                    obj: elm,
                    data: TopoConst.digitClockSetting,
                    objTopo: objTopo
                });
            }
        );
    },

    /* sound On / Off */
    soundOnOff: function(elm, d, i, objTopo) {

        objTopo.vars.isSoundOnOff = !objTopo.vars.isSoundOnOff;

        if (objTopo.vars.isSoundOnOff) {
            // sound ON
            $(".soundOnOff").children("img").attr("src", '../../img/d3/menu/navi/topoNav32.svg')
        }
        else {
            // Sound OFF
            objTopo.clearAudioInterval();
            //D3Topology.audio = null;
            $(".soundOnOff").children("img").attr("src", '../../img/d3/menu/navi/topoNav31.svg')
        }
        objTopo.playSound(objTopo);

    },

    /* 눈금자 */
    view_gridaxis: function (elm, d, i, objTopo) {
        objTopo.vars.isViewGridAxis = !objTopo.vars.isViewGridAxis;
        var viewMode = objTopo.vars.isViewGridAxis ? "block" : "none";
        objTopo.vars.svgGroup.selectAll(".axis").style("display", viewMode);
    },

    /* 눈금선 */
    view_gridline: function (elm, d, i, objTopo) {
        objTopo.vars.isViewGridLine = !objTopo.vars.isViewGridLine;
        var viewMode = objTopo.vars.isViewGridLine ? "block" : "none";
        objTopo.vars.svgGroup.selectAll(".axis-grid").style("display", viewMode);
    },

    /* 안내선 */
    view_helpLine: function (elm, d, i, objTopo) {
        objTopo.vars.isViewHelpLine = !objTopo.vars.isViewHelpLine;
        var viewMode = objTopo.vars.isViewHelpLine ? "block" : "none";
        objTopo.vars.svgGroup.selectAll(".helpline").style("display", viewMode);
    },

    /* 안내선 세로 추가 */
    add_vHelpline: function (elm, d, i, objTopo) {
        TopoHelpLine.add_vHelpline(objTopo);
    },

    /* 안내선 가로 추가 */
    add_hHelpline: function (elm, d, i, objTopo) {
        TopoHelpLine.add_hHelpline(objTopo);
    },

    /* 안내선 색상 변경 */
    chg_helpLine_color: function (elm, d, i, objTopo) {

    },

    /* 안내선 삭제 */
    del_helpLine: function (elm, d, i, objTopo) {
        d3.select(elm).remove();
    },


    /* 장비 자동 등록 및 자동 배치 (실측 상면 정보 엑셀 정보 Import) */
    autoItemArrangement: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pAutoItemArrangement.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '장비자동배치', result, 1000, 500, 'pwindow_init', {
                    obj: elm,
                    data: d,
                    objTopo: objTopo
                });
            }
        );
    },

    /* 회선자동연결 조회 */
    autoLinkRelation: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pAutoLinkRelation.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '회선자동연결', result, 1000, 500, 'pwindow_init', {
                    obj: elm,
                    data: d,
                    objTopo: objTopo
                });
            }
        );
    },

    /* 슬라이드쇼 그룹 설정 */
    slideGrpSet: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/setting/pSlideSetting.do',
            function (result) {
                HmWindow.open($('#pwindow'), '슬라이드 그룹 설정', result, 522, 570, 'pwindow_init', {
                    obj: elm,
                    data: d,
                    objTopo: objTopo
                });
            }
        );

    }

};
