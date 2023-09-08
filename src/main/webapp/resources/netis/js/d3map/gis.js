/**
 * GIS 토폴로지
 * 주의!!!!
 *  관련 함수를 호출할 경우 호출함수의 this가  HmGis가 되도록 호출하여야함.
 */
var HmGis = function (canvasId, objTopo) {

    this.canvasId = canvasId;
    this.gisCanvas = $('#' + canvasId);
    this.objTopo = objTopo;

    this.vars = {
        map: null,
        mcg: null,
        ctxmenuObj: null,
        isDrag: false,
        topGrpNo: 1,
        curGrpNo: 1,
        topoTopCnt: 1,
        sessUserId: $('#sUserId').val(),
        mapMode: TopoConst.mapMode.SEARCH,
        gisCanvas: null,
        curGrpNm: '전체'
    };
};

HmGis.prototype = function () {

    /**
     * 토폴로지 초기화
     */
    function initialize() {
        // HmGis.vars.curGrpNo = HmGis.vars.topGrpNo = 29;
        // this.vars.gisCanvas = $('#gisCanvas');

        addEventListener();
        createMap.call(this);

        HmWindow.createNewWindow('pwindow');
        $('#pwindow').jqxWindow({modalZIndex: 999});
    }

    /**
     * 이벤트 등록
     */
    function addEventListener() {
        $('#ckIsVibileTitle').on('change', function (event) {
            var _checked = $(this).prop('checked');
            $('.markerTitle').css('display', _checked ? 'block' : 'none');
        });
    }

    function createMap() {
        var _this = this;
        // 서울 위경도 37.5648188,126.9119496, 11

        var gisUrl = "";

        if ($("#gSiteName").val() == "GyeongGidoOfficeEdu") { //폐쇄망. (경기도 교육청)
            gisUrl = window.location.protocol + "//" + window.location.hostname + ":8844/1407893838/{z}/{x}/{y}";
        } else { // 패키지.
            gisUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }


        var tileLayer = L.tileLayer(gisUrl, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        _this.vars.map = L.map(_this.canvasId, {
            center: [37.5648188, 126.9119496],
            zoom: 11,
            layers: [tileLayer],
            attributionControl: false,
            kind: 'map'
        });

        _this.vars.map.on('contextmenu', function (event) {
            showCtxmenu.call(_this, event);
        });

        if ($('#ctxmenu').length == 0) {
            $('body').append($('<div></div>', {id: 'ctxmenu'}));
        }
        $('#ctxmenu').jqxMenu({width: 140, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999})
            .on('itemclick', function (event) {
                itemClick.call(_this, $(event.args).children(':first-child')[0].id, event);
            });

    }

    function chgGrp(objTopo) {
        this.objTopo = objTopo;
        this.vars.curGrpNo = objTopo.vars.curGrpNo;
        this.vars.topGrpNo = objTopo.vars.topGrpNo;
        this.vars.mapMode = TopoConst.mapMode.SEARCH;
        if (this.vars.map == null) {
            initialize();
        }
        searchGroup.call(this, true);
    }

    function search() {
        if (this.vars.map == null) {
            initialize();
        }
        if (this.vars.mapMode == TopoConst.mapMode.SEARCH) {
            searchItem.call(this);
        }
    }

    function showCtxmenu(event) {
        var _this = this;
        var _target = $(event.target)[0];
        var posX = parseInt(event.originalEvent.clientX) + 5 + $(window).scrollLeft();
        var posY = parseInt(event.originalEvent.clientY) + 5 + $(window).scrollTop();
        if ($(window).height() < (event.originalEvent.clientY + $('#ctxmenu').height() + 10)) {
            posY = $(window).height() - ($('#ctxmenu').height() + 10);
        }

        var _s = gis_menu.getMenuList(_target, _this.vars.mapMode);
        if (_s.length > 0) {
            /* 토폴로지 > GIS 로 이동한 경우에만 토폴로지이동 메뉴 활성화 */
            if (_this.objTopo == null && _target instanceof L.Map) {
                for (var x = _s.length - 1; x >= 0; x--) {
                    var _mnId = $(_s[x].html).attr('id');
                    if (_mnId == 'cm_view_topology') {
                        delete _s[x];
                    }
                }
            }
            try {
                if (_target instanceof L.Map) {
                    _target.options.clickLatlng = event.latlng;
                }
            } catch (e) {
            }
            _this.vars.ctxmenuObj = _target;
            //TODO contextmenu 하단 잘리는 현상이 발생하여 height값 계산!! 왜 잘릴까?
            $('#ctxmenu').jqxMenu({source: _s, height: (26.2 * _s.length + 4) + 'px'});
            $('#ctxmenu').jqxMenu('open', posX, posY);
        }
        return false;
    }

    /** 그룹 조회 */
    function searchGroup(isChgView) {

        var _this = this;
        if (isChgView === undefined) {
            isChgView = false;
        }

        Server.post('/d3map/gisTopo/getGroupInfo.do', {
            data: {grpNo: _this.vars.curGrpNo},
            success: function (result) {


                console.log("getGroupInfo : " + result.viewType);


                if (result.viewType == 'GIS' || result.viewType == undefined || result.viewType == null) {
                    // set gisview
                    var _lat = result.gisLat || 37.5648188, _lnt = result.gisLnt || 126.9119496,
                        _zoom = result.gisZoom || 11;
                    // console.log(_lat, _lnt, _zoom, result);
                    _this.vars.map.setView(L.latLng(_lat, _lnt), _zoom);
                    $('#map_curGrpNm').text(result.grpName);

                    searchItem.call(_this);
                }
                else {
                    topo_menu_action.view_topo(_this);
                }

                // if (isChgView) {
                //     // set gisview
                //     var _lat = result.gisLat || 37.5648188, _lnt = result.gisLnt || 126.9119496,
                //         _zoom = result.gisZoom || 11;
                //     // console.log(_lat, _lnt, _zoom, result);
                //     _this.vars.map.setView(L.latLng(_lat, _lnt), _zoom);
                //     $('#map_curGrpNm').text(result.grpName);
                //
                //     searchItem.call(_this);
                // }
                // else {
                //     if (result.viewType == 'GIS') {
                //         // set gisview
                //         var _lat = result.gisLat || 37.5648188, _lnt = result.gisLnt || 126.9119496,
                //             _zoom = result.gisZoom || 11;
                //         // console.log(_lat, _lnt, _zoom, result);
                //         _this.vars.map.setView(L.latLng(_lat, _lnt), _zoom);
                //         $('#map_curGrpNm').text(result.grpName);
                //
                //         searchItem.call(_this);
                //     }
                //     else {
                //         topo_menu_action.view_topo(_this);
                //     }
                // }
            }
        });
    }

    /** 아이템 조회 */
    function searchItem() {

        var _this = this;

        Server.post("/d3map/gisTopo/getGisItemList.do", {
            data: {grpNo: _this.vars.curGrpNo},
            success: function (result) {

                // remove markerClusterGroup
                if (_this.vars.mcg != null) {
                    _this.vars.map.removeLayer(_this.vars.mcg);
                }

                var mcg = L.markerClusterGroup({
                    chunkedLoading: true,
                    iconCreateFunction: function (cluster) {

                        var childCount = cluster.getChildCount();
                        var markers2 = cluster.getAllChildMarkers();
                        var c = ' marker-cluster-green';
                        return new L.DivIcon({
                            html: '<div><span>' + childCount + '</span></div>',
                            className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
                        });

                    }
                });
                /**
                 * markerClusterGroup spiderfied 이벤트 발생시 gis mapMode에 따른 marker객체의 draggable 속성 제어
                 */
                mcg.on('spiderfied', function (event) {
                    $.each(event.markers, function (i, m) {
                        if (m.dragging) {
                            if (_this.vars.mapMode == TopoConst.mapMode.MANAGE) {
                                m.dragging.enable();
                            }
                            else {
                                m.dragging.disable();
                            }
                        }
                    });
                });

                for (var i = 0; i < result.length; i++) {
                    var data = result[i];
                    var marker = L.marker(L.latLng(data.lat, data.lnt), $.extend({
                        title: data.itemAlias || data.itemName,
                        kind: 'marker',
                        draggable: false,
                        icon: L.divIcon({className: 'my-div-icon', html: getIconHtml(data)}),
                        iconSize: [50, 50]
                    }, data)).bindPopup(function (layer) {
                        var _d = layer.options;
                        // console.log(_d);
                        var _ipInfo = '';
                        if (_d.devKind1 != 'GRP') {
                            if (_d.devKind2 == 'AP') {
                                _ipInfo = _d.devIp.isIPv4() ? 'IP: ' + _d.devIp : 'MAC: ' + _d.devIp;
                            }
                            else {
                                _ipInfo = 'IP: ' + _d.devIp;
                            }
                        }
                        return '<ul>' +
                            '<li>표시명: {0}</li>'.substitute(_d.itemAlias || _d.itemName) +
                            '<li>{0}</li>'.substitute(_ipInfo) +
                            '<li>종류: {0}</li>'.substitute(_d.devKind2) +
                            '</ul>';
                    });
                    marker.on('dblclick', function (event) {
                        // console.log('marker dbclick', event);
                        var _target = event.sourceTarget;
                        if (_target.options.devKind1 == 'GRP') {
                            _this.vars.curGrpNo = _target.options.mngNo;
                            searchGroup.call(_this, false);
                        }
                    }).on('contextmenu', function (event) {
                        showCtxmenu.call(_this, event);
                    });
                    mcg.addLayer(marker);
                }
                _this.vars.map.addLayer(mcg);
                _this.vars.mcg = mcg;
            }
        });

        // get icon imageUrl
        function getIconImg(devKind1, devKind2) {
            var _prefix = '/img/d3/micons/';
            return _prefix + devKind2 + '.PNG';
        }

        function getIconImg_tree(devKind1, devKind2) {
            var _prefix = '/img/tree/v5.0.1';
            devKind2 = devKind2.toLowerCase();
            if (devKind1 == 'GRP') {
                return _prefix + '/group.svg';
            }
            else if (devKind1 == 'DEV' && devKind2.endsWith('switch')) {
                return _prefix + '/switch.svg';
            }
            else {
                return _prefix + '/{0}.svg'.substitute(devKind2);
            }
        }

        // get marker.divIcon html
        function getIconHtml(data) {
            var div = $('<div></div>');
            var _bg = 'transparent';
            var _evtLvl = [null, null, 'info', 'warning', 'minor', 'major', 'critical'][data.evtLevel];
            if (_evtLvl != null) {
                _bg = 'url(/img/{0}Circle.svg) no-repeat 0 0;'.substitute(_evtLvl);
            }
            div
                .append($('<div></div>', {
                    style: 'position: absolute; width: 40px; height: 40px; background: ' + _bg + ' background-size: 40px'
                }))
                .append($('<img/>', {
                    src: getIconImg(data.devKind1, data.devKind2),
                    style: 'width: 25px; height: 25px; position: relative; margin: 8px',
                    onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
                }))
                .append($('<div></div>', {
                    class: 'markerTitle',
                    text: (data.itemAlias || data.itemName).replace(/\_/ig, ' ')
                }));
            return div[0].outerHTML;

        }
    }

    function itemClick(mnId, event) {
        var _this = this;
        console.log("itemClick", mnId, event, _this.vars.ctxmenuObj);
        var _mngNo = _this.vars.ctxmenuObj.options.mngNo;
        switch (mnId) {
            case 'cm_goto_top':
                if (_this.vars.topGrpNo == _this.vars.curGrpNo) {
                    alert('최상위그룹입니다.');
                }
                else {
                    _this.vars.curGrpNo = _this.vars.topGrpNo;
                    searchGroup.call(_this);
                }
                break;
            case 'cm_goto_up':
                Server.get("/d3map/topo/getParentGrpNo.do", {
                    data: {grpNo: _this.vars.curGrpNo},
                    success: function (result) {
                        _this.vars.curGrpNo = result;
                        searchGroup.call(_this);
                    }
                });
                break;
            case 'cm_mode_search':
                _this.vars.mapMode = TopoConst.mapMode.SEARCH;
                _this.vars.map.eachLayer(function (layer) {
                    if (layer instanceof L.MarkerClusterGroup) {
                        layer.eachLayer(function (layer2) {
                            if (layer2.dragging) {
                                layer2.dragging.disable();
                            }
                        });
                    }
                });
                break;
            case 'cm_mode_manage':
                if (TopoConst.envSetting.topoEditYn == 'N') {
                    alert("편집 권한이 없습니다.");
                    return false;
                }
                _this.vars.mapMode = TopoConst.mapMode.MANAGE;
                _this.vars.map.eachLayer(function (layer) {
                    if (layer instanceof L.MarkerClusterGroup) {
                        layer.eachLayer(function (layer2) {
                            if (layer2.dragging) {
                                layer2.dragging.enable();
                            }
                        });
                    }
                });
                break;
            case 'cm_add_dev':
                $.post('/d3map/popup/gis/pGisItemAdd.do',
                    function (result) {
                        HmWindow.openFit($('#pwindow'), '추가', result, 1200, 620, 'pwindow_init', {grpNo: _this.vars.curGrpNo});
                    }
                );
                break;
            case 'cm_add_grp':
                var params = {objGis: _this, latlng: _this.vars.ctxmenuObj.options.clickLatlng};
                $.post('/d3map/popup/setting/pGisGrpAdd.do',
                    function (result) {
                        HmWindow.openFit($('#pwindow'), '그룹 추가', result, 300, 180, 'pwindow_init', params);
                    }
                );
                break;
            case 'cm_cfg_latlng':
                var markerList = [];
                _this.vars.map.eachLayer(function (layer) {
                    // MarkerClusterGroup.eachLayer -> all markers (tileLayer, markerPane등 제외)
                    if (layer instanceof L.MarkerClusterGroup) {
                        // console.log("instanceof L.MarkerClusterGroup");
                        layer.eachLayer(function (layer2) {
                            var _latlng = layer2.getLatLng();
                            var _d = layer2.options;
                            markerList.push({
                                itemNo: _d.itemNo,
                                mngNo: _d.mngNo,
                                itemName: _d.title,
                                devKind1: _d.devKind1,
                                devKind2: _d.devKind2,
                                lat: _latlng.lat,
                                lnt: _latlng.lng
                            });
                        });
                    }
                });
                // console.log('markerList', markerList);
                var params = {
                    grpNo: _this.vars.curGrpNo,
                    markerList: markerList,
                    objGis: _this
                };
                $.post('/d3map/popup/gis/pGisLatLngCfg.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '위경도 설정', result, 800, 620, 'pwindow_init', params);
                    });
                break;
            case 'cm_save_item':
                var markerList = [];
                _this.vars.map.eachLayer(function (layer) {
                    if (layer.options.kind == 'marker') {
                        var _latlng = layer.getLatLng();
                        var _d = layer.options;
                        markerList.push({
                            itemNo: _d.itemNo,
                            mngNo: _d.mngNo,
                            devKind1: _d.devKind1,
                            devKind2: _d.devKind2,
                            lat: _latlng.lat,
                            lnt: _latlng.lng
                        });
                    }
                });
                // console.log('markerList', markerList);
                Server.post('/d3map/gisTopo/saveItemLatLnt.do', {
                    data: {list: markerList},
                    success: function (result) {
                        alert('저장되었습니다.');
                    }
                });
                break;
            case 'cm_save_group':
                var _center = _this.vars.map.getCenter(),
                    _zoom = _this.vars.map.getZoom();

                Server.post('/d3map/gisTopo/saveGroupLatLnt.do', {
                    data: {
                        grpNo: _this.vars.curGrpNo,
                        zoom: _zoom,
                        lat: _center.lat,
                        lnt: _center.lng
                    },
                    success: function () {
                        alert('저장되었습니다.');
                    }
                });
                break;
            case 'cm_view_topology':
                viewTopo.call(_this);
                break;

            // DEV
            case 'cm_dtl_dev':
                HmUtil.createPopup('/main/popup/nms/pDevDetail.do', $('#hForm'), 'pDevDetail', 1400, 700, {mngNo: _mngNo});
                break;
            // SVR
            case 'cm_dtl_svr':
                HmUtil.createPopup('/main/popup/sms/pSvrDetail.do', $('#hForm'), 'pSvrDetail', 1300, 700, {mngNo: _mngNo});
                break;
            // AP
            case 'cm_dtl_ap':
                HmUtil.createPopup('/main/popup/nms/pApDetail.do', $('#hForm'), 'pApDetail', 1200, 660, {apNo: _mngNo});
                break;
        }
    }

    function viewTopo() {
        if (topo_menu_action !== undefined) {
            topo_menu_action.view_topo(this);
        }
        else {
            this.objTopo.vars.curGrpNo = this.vars.curGrpNo;
            $('#mapCanvas').css('display', 'inline-block');
            $('#gisCanvas').css('display', 'none');
            this.objTopo.vars.isChgViewType = true;
            this.objTopo.chgGrp.call(this.objTopo);
        }
    }

    return {
        initialize: initialize,
        chgGrp: chgGrp,
        search: search,
        searchItem: searchItem,
        viewTopo: viewTopo
    };
}();
