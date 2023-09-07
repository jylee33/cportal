/**
 * 랙 팝업 => 상세 및 요약에서 바로보기
 * @param rackNo, rackSlotU
 */
var Rack = {
    SLOT_KIND: {
        SVR: 'SVR',
        BSVR: 'BSVR',
        BLD: 'BLD'
    },
    SECTION: {
        FRONT: 'F',
        BACK: 'B',
        FRONT_LABEL: '앞',
        BACK_LABEL: '뒤'
    },
    rackNo: 0,
    mngNo: 0,
    rackSlotU: 0,
    myDiagram: null,
    go_cellSize: null,
    curNodeData: null,
    rackInfoDiagram: null,

    //style
    padding: 6,
    scale: 0,

    initRack: function (rackNo) {
        Rack.initDesign(rackNo);
        Rack.observe();
    },

    initDesign: function (rackNo) {

        this.rackNo = rackNo;
        this.mngNo = $.isBlank($('#pMngNo').val()) ? dtl_mngNo : $('#pMngNo').val();

        Server.post('/main/env/rackConf/getRackInfo.do', {
            data: {rackNo: Rack.rackNo},
            success: function(result) {
                if(result == null) {
                    alert('Rack 정보가 존재하지 않습니다.');
                    return;
                }
                Rack.rackSlotU = result.rackU;
                $('#p_rackNm').text(result.rackName);
                $('#p_rackName').val(result.rackName);

                Rack.initCss();
                Rack.initDiagram();
                Rack.initData();

            }
        });
    },

    observe: function() {
        $('#pbtnClose').click(function() { self.close(); });
    },

    initData: function() {
        Server.get('/main/popup/rackConf/getRackSlotInfo.do', {
            data: { rackNo: Rack.rackNo },
            success: function(result) {
                if(result == null) result = [];
                $.each(result, function(idx, item) {
                    var _color = 'transparent';
                    if(item.mngNo == 0) _color = HmRackResource.COLOR.Disable;
                    else if((item.evtLevel || 0) > 0){
                        _color = HmRackResource.COLOR['EvtLevel' + item.evtLevel];
                    }
                    if(item.slotKind == Rack.SLOT_KIND.BLD) {
                        $.extend(item, {
                            key: item.uniqKey,
                            group: item.uniqKey.split('_')[0],
                            // color: item.mngNo == 0? HmRackResource.COLOR.Disable : HmRackResource.COLOR.Normal,
                            color: _color,
                            pos: [item.posCol * 20, (item.slotNo * 20) + (item.posRow * 20)].join(' '),
                            category: 'bld'
                        });
                    }
                    else {
                        $.extend(item, {
                            key: item.uniqKey,
                            group: 'G1',
                            // color: item.slotKind != Rack.SLOT_KIND.BSVR && item.mngNo == 0? HmRackResource.COLOR.Disable : HmRackResource.COLOR.Normal,
                            color: _color,
                            pos: [0, item.slotNo * 20].join(' '),
                            isGroup: item.slotKind == Rack.SLOT_KIND.BSVR,
                            category: item.slotKind == Rack.SLOT_KIND.BSVR? 'bsvr' : ''
                        });
                    }

                });
                // background insert
                result.unshift({ key: 'G1', isGroup: true, pos: '0 0', size: '300 1200' });
                Rack.myDiagram.model.nodeDataArray = result;

                var infoResult = JSON.parse(JSON.stringify(result));

                $.each(infoResult, function(i, v){
                    var size = v.size.split(" ");
                    infoResult[i].orgSlotU = v.slotU;
                    if(v.slotKind != Rack.SLOT_KIND.BLD){
                        infoResult[i].size = "470 20";
                        if(v.slotU > 1){
                            var slotNo = Math.floor( v.slotNo + (v.slotU / 2) );
                            infoResult[i].isGroup = false;
                            infoResult[i].slotNo = slotNo;
                            infoResult[i].slotU = 1;
                            infoResult[i].pos = "0 " + (slotNo*20);
                        }
                    }
                });
                // Rack.rackInfoDiagram.model.nodeDataArray = infoResult.filter(function(data){return data.category != 'bld'});
                // result.unshift({ key: 'G1', isGroup: true, pos: '0 0', size: '300 1200' });

                //앞면, 뒷면 랙 데이터 구분
                var frontData = [], backData = [];
                $.each(result, function (idx, item) {
                    if (item.hasOwnProperty('isGroup') && item.key == 'G1') {
                        frontData.push(item);
                        backData.push(item)
                    }
                    item.rackSection === Rack.SECTION.FRONT ?
                        frontData.push(item) : backData.push(item);
                });

                var isSlot = false; // VM 서버에 연동된 장비를 찾기 위한 flag

                var _nodeDataArray = Rack.myDiagram.model.nodeDataArray;
                $.each(_nodeDataArray, function(idx, item) {

                    if(Rack.mngNo == item.mngNo){
                        isSlot = true;

                        Rack.myDiagram.model.nodeDataArray = item.rackSection === Rack.SECTION.FRONT ? frontData : backData;
                        Rack.myDiagram.select(Rack.myDiagram.findNodeForKey(item.key));
                        Rack.myDiagram.allowSelect = false; // 다른 랙 선택 방지
                        Rack.setRackInfo(this, Rack.myDiagram.findNodeForKey(item.key))

                        //앞,뒤 표시
                        item.rackSection === Rack.SECTION.FRONT ?
                            $('#rackSection').text(Rack.SECTION.FRONT_LABEL) : $('#rackSection').text(Rack.SECTION.BACK_LABEL);
                    }
                });

                //VM 서버 랙연동
                if(!isSlot) {
                    Server.get('/main/popup/rackConf/getVmRackInfoNotInSlot.do', {
                        data: {},
                        success: function (result) {
                            if(result.length === 0) return;

                            $.each(result, function (pIdx, pItem) {
                                $.each(_nodeDataArray, function (idx, item) {

                                    if(pItem.mngNo == item.mngNo && Rack.mngNo == pItem.vmMngNo) {

                                        Rack.myDiagram.model.nodeDataArray = item.rackSection === Rack.SECTION.FRONT ? frontData : backData;
                                        Rack.myDiagram.select(Rack.myDiagram.findNodeForKey(item.key));
                                        Rack.myDiagram.allowSelect = false; // 다른 랙 선택 방지

                                        //앞,뒤 표시
                                        item.rackSection === Rack.SECTION.FRONT ?
                                            $('#rackSection').text(Rack.SECTION.FRONT_LABEL) : $('#rackSection').text(Rack.SECTION.BACK_LABEL);

                                    }
                                });

                            })
                        }
                    })
                }
            }
        });
    },

    initCss: function() {
        var rackCss = Rack.getCss();
        //diagram 생성 이후, 재생성 할 경우 에러 발생
        //diagram div 매번 지우고 append 하여 해결
        if(this.myDiagram !== null) { $('.rackBody').empty(); }
        var diagramDiv = '<div id="myDiagramDiv" style="width:'+ rackCss.width +'px; height: 100%;" disabled="true" tabindex="-1"></div>';
        $('.rackBody').append(diagramDiv);

        //Rack 길이에 맞게 div 높이조절
        $('#myDiagramDiv').parent('div:first').height(rackCss.height);

        $('.rackHeader, .rackBody, .rackFoot').width(rackCss.width);

        Rack.padding = rackCss.padding;
        Rack.scale = rackCss.scale;
    },

    /**
     * Rack 영역 알맞게 설정해야 마우스로 이동되지 않기 때문에 생성
     */
    getCss: function () {
        var isWin = $('#isWindow').val();

        var _width = 0, _height = 0, _padding = 0, _scale = 0;

        if(!isWin) { //요약
            if(Rack.rackSlotU < 42) {
                _width = 150; _height = 351; _scale = 0.72; _padding = 4;
            } else {
                _width = 110; _height = 430; _scale = 0.5; _padding = 10;
            }
        } else { //상세
            if(Rack.rackSlotU < 42) {
                _width = 150; _height = 351; _scale = 0.72; _padding = 4;
            } else {
                _width = 143; _height = 559; _scale = 0.65;_padding = 10;
            }
        }

        return {
            width: _width,
            height: _height,
            padding: _padding,
            scale: _scale
        }
    },

    initDiagram: function () {

        go.licenseKey = "2bf842e1b66e58c511895a25406c7efb0bab2d66ce804df45e0317f1ed5c7a042498b87851dadf9081fd49fc1f2890dcd8966079934f0369e761d58c41e1d5abb76520e0175f40dbf10373979daf38b1fa2d21f4c2e727a3c8688ff3eba1dc9943e8f5";
        var $ = go.GraphObject.make;
        this.go_cellSize = new go.Size(20,20);

        this.myDiagram =
            $(go.Diagram, "myDiagramDiv",
                {
                    initialScale: Rack.scale,
                    grid: $(go.Panel, "Grid", //or go.Panel.Grid
                        {
                            gridCellSize: Rack.go_cellSize, margin: 2
                        },
                        $(go.Shape, "LineH", { stroke: "lightgray" }),
                        $(go.Shape, "LineV", { stroke: "lightgray" })
                    ),
                    padding: Rack.padding,
                    // support grid snapping when dragging and when resizing
                    "draggingTool.isGridSnapEnabled": false,
                    "draggingTool.gridSnapCellSpot": go.Spot.Center,
                    "resizingTool.isGridSnapEnabled": false,
                    allowDrop: true,  // handle drag-and-drop from the Palette\
                    "animationManager.isEnabled": false,
                    "undoManager.isEnabled": false,
                    // "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                    mouseDrop: function(e) {
                        // alert("Diagram mouse drop!");
                        e.diagram.currentTool.doCancel();
                    }
                });

        // 기본 서버 템플릿
        var svrNodeTemplate =
            $(go.Node, "Auto",
                {
                    resizable: false, resizeObjectName: "SHAPE", movable: false,
                    // because the gridSnapCellSpot is Center, offset the Node's location
                    // locationSpot: new go.Spot(0, 0, Rack.go_cellSize.width/2, Rack.go_cellSize.height/2),
                    locationSpot: go.Spot.TopLeft,
                    click: Rack.setRackInfo
                },
                // always save/load the point that is the top-left corner of the node, not the location
                new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Picture,
                    new go.Binding('source', 'imgName', Rack.getServerImgUrl)),
                $(go.Shape, 'Rectangle',
                    {
                        name: 'SHAPE', fill: 'white', opacity: 0.8, minSize: Rack.go_cellSize, desiredSize: Rack.go_cellSize
                    },
                    new go.Binding('fill', 'color'),
                    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify))
            );

        // 블레이드(BLD) 템플릿
        var bldNodeTemplate =
            $(go.Node, "Auto",
                {
                    resizable: false, resizeObjectName: "SHAPE", movable: false,
                    // because the gridSnapCellSpot is Center, offset the Node's location
                    locationSpot: go.Spot.TopLeft,
                    selectable: true, movable: false,
                    click: Rack.setRackInfo
                },
                new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Shape, "Rectangle",
                    {
                        name: 'SHAPE', fill: 'white', minSize: Rack.go_cellSize, desiredSize: Rack.go_cellSize
                    },
                    new go.Binding('fill', 'color'),
                    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)),
                $(go.Picture,
                    new go.Binding('source', 'imgName', Rack.getServerImgUrl))
            );

        var groupStroke = "transparent";
        var groupFill = "rgba(192,192,192,0.3)";
        var dropFill = "rgba(128,255,255,0.2)";
        var dropStroke = "red";

        // Accordion용 BSVR 노드 템플릿
        var bsvrNodeTemplate =
            $(go.Node, "Auto",
                {
                    resizable: false, resizeObjectName: 'SHAPE',
                    movable: false, selectable: true,
                    locationSpot: go.Spot.TopLeft
                },
                new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Shape, 'Rectangle',
                    {
                        name: 'SHAPE', fill: 'rgba(60,60,60,0.7)', stroke: 'rgba(60,60,60,1)', strokeWidth: 1
                    }),
                $(go.TextBlock,
                    { alignment: go.Spot.Center, font: 'bold 16px sans-serif', stroke: '#fff' },
                    new go.Binding('text', 'slotU', function(v) { return v + 'U'; }))
            );

        /**
         * Background 그룹 템플릿(G1)
         */
        var groupTemplate =
            $(go.Group,
                {
                    layerName: 'Background',
                    resizable: false, movable: false, selectable: true, deletable: false,
                    locationSpot: go.Spot.TopLeft,
                    width: 200, height: Rack.rackSlotU * 20,
                    mouseDrop: function(e, grp) {

                        /**
                         * G1에 MouseDrop이벤트 발생시...
                         * slotKind가 SVR|BBOX에 한해 MouseDrop을 허용한다.
                         */
                            // drop되는 노드의 장비를 맵핑하기 위한 팝업창 호출
                        var model = Rack.myDiagram.model;
                        model.startTransaction("set pos");
                        for(var it = e.diagram.selection.iterator; it.next();) {
                            var node = it.value;

                            // 블레이드를 추가시 rollback
                            if(node.data.slotKind == Rack.SLOT_KIND.BLD) {
                                grp.diagram.currentTool.doCancel();
                                model.rollbackTransaction();
                                alert('블레이드는 블레이드서버 안에 위치시켜주세요.');
                                return;
                            }

                            //새로운서버를 G1에 추가시 pos 틀어짐 문제가 발생.. .원인파악중 (강제로 x좌표 0으로 맞춤)
                            if(jQuery.inArray(node.data.slotKind, [Rack.SLOT_KIND.SVR, Rack.SLOT_KIND.BSVR]) != -1) {
                                var posY = Math.floor(parseInt(node.data.pos.split(' ')[1]));
                                model.setDataProperty(node.data, 'group', 'G1');
                                model.setDataProperty(node.data, 'pos', '0 ' + posY);
                                model.setDataProperty(node.data, 'slotNo', posY / 20);
                                if(node.data.slotKind == Rack.SLOT_KIND.SVR) model.setDataProperty(node.data, 'color', 'rgba(124,124,124,0.8)'); //SVR인경우 비활성화 컬러 지정
                            }

                            if(node.data.slotKind == Rack.SLOT_KIND.BSVR && (node.data.isInit || false) == false) {
                                var bldList = HmRackResource[node.data.bsvrModel + '_BLD_TMPLT_LIST'];
                                if(bldList != null) {
                                    for(var bsvrIdx = 0; bsvrIdx < bldList.length; bsvrIdx++) {
                                        var tmp = bldList[bsvrIdx];
                                        jQuery.extend(tmp, {
                                            key: node.data.key + '_' + bsvrIdx,
                                            group: node.data.key,
                                            pos: [tmp.x, tmp.y + (node.data.slotNo*20)].join(' ')
                                        });
                                        Rack.myDiagram.model.addNodeData(tmp);
                                    }
                                }
                                node.data.isInit = true;
                            }

                            // BSVR가 아니고 장비가 맵핑되지 않았으면 설정팝업 호출
                            if (node.data.slotKind != Rack.SLOT_KIND.BSVR && !node.data.hasOwnProperty("mngNo")) {
                                Rack.setRackMapping(null, node);
                            }
                        }
                        model.commitTransaction("set pos");
                        Rack.myDiagram.clearSelection();
                    }
                },
                new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, 'Rectangle',
                    {
                        name: 'SHAPE', fill: groupFill, stroke: groupStroke,
                        minSize: new go.Size(Rack.go_cellSize.width*2, Rack.go_cellSize.height*2)
                    },
                    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
                    new go.Binding("fill", "isHighlighted", function(h) { return h ? dropFill : groupFill; }).ofObject(),
                    new go.Binding("stroke", "isHighlighted", function(h) { return h ? dropStroke: groupStroke; }).ofObject())
            );

        function makeCtxButton(text, action, visiblePredicate) {
            return $('ContextMenuButton',
                $(go.TextBlock, text),
                {click: action},
                visiblePredicate? new go.Binding('visible', '', function(o, e) { return o.diagram? visiblePredicate(o, e) : false;}).ofObject() : {});
        }

        var bsvrContextMenu =
            $(go.Adornment, 'Vertical',
                makeCtxButton('블레이드 비활성화', function(e, obj) {
                    var _bldList = Rack.getBlaedList(e.diagram.selection.first().data);
                    for(var idx = 0, n = _bldList.length; idx < n; idx++) {
                        var bldItem = _bldList[idx];
                        var bldNode = e.diagram.findNodeForKey(bldItem.key);
                        bldNode.selectable = false;
                    }
                }),
                makeCtxButton('블레이드 활성화', function(e, obj) {
                    var _bldList = Rack.getBlaedList(e.diagram.selection.first().data);
                    for(var idx = 0, n = _bldList.length; idx < n; idx++) {
                        var bldItem = _bldList[idx];
                        var bldNode = e.diagram.findNodeForKey(bldItem.key);
                        bldNode.selectable = true;
                    }
                }));

        // 블레이드서버(BSVR) 그룹 템플릿
        var bsvrGroupTemplate =
            $(go.Group, 'Auto',
                {
                    layerName: 'Background',
                    resizable: false, resizeObjectName: 'SHAPE',
                    movable: false, selectable: true,
                    locationSpot: go.Spot.TopLeft,
                    // locationSpot: new go.Spot(0, 0, Rack.go_cellSize.width/2, Rack.go_cellSize.height/2),
                    mouseDrop: function(e, grp) {
                        // drop되는 노드의 장비를 맵핑하기 위한 팝업창 호출
                        var model = Rack.myDiagram.model;
                        model.startTransaction("set pos");
                        for(var it = e.diagram.selection.iterator; it.next();) {
                            var node = it.value;
                            if(node.data.slotKind != Rack.SLOT_KIND.BLD) {
                                grp.diagram.currentTool.doCancel();
                                model.rollbackTransaction();
                                alert('블레이드 서버에는 블레이드만 위치시킬수 있습니다.');
                                return;
                            }
                            // model.setDataProperty(node.data, 'pos', '0 ' + node.data.pos.split(' ')[1]);

                            if(node.data.slotKind == Rack.SLOT_KIND.BLD && !node.data.hasOwnProperty('mngNo')) {

                            }

                            // BSVR가 아니고 장비가 맵핑되지 않았으면 설정팝업 호출
                            if (node.data.slotKind != Rack.SLOT_KIND.BSVR && !node.data.hasOwnProperty("mngNo")) {
                                Rack.setRackMapping(null, node);
                            }
                        }
                        model.commitTransaction("set pos");

                        //Add the Parts in the given collection as members of this Group for those Parts for which CommandHandler.isValidMember returns true
                        var ok = grp.addMembers(grp.diagram.selection, true);
                        if (!ok) {
                            grp.diagram.currentTool.doCancel();
                            return;
                        }

                        Rack.myDiagram.clearSelection();
                    },
                    click: Rack.setRackInfo
                },
                new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Shape, 'Rectangle',
                    {
                        name: 'SHAPE', fill: 'rgba(60,60,60,0.7)', stroke: 'rgba(60,60,60,1)', strokeWidth: 1
                    }),
                $(go.Picture,
                    new go.Binding('source', 'imgName', Rack.getServerImgUrl)),
                {
                    contextMenu: bsvrContextMenu
                }
            );

        // set nodeTemplateMap
        var nodeTemplateMap = new go.Map('string', go.Node);
        nodeTemplateMap.add('svr', svrNodeTemplate);
        nodeTemplateMap.add('bld', bldNodeTemplate);
        nodeTemplateMap.add('bsvr', bsvrNodeTemplate);
        nodeTemplateMap.add('', svrNodeTemplate);
        this.myDiagram.nodeTemplateMap = nodeTemplateMap;

        // set groupTemplateMap
        var groupTemplateMap = new go.Map('string', go.Node);
        groupTemplateMap.add('bg', groupTemplate);
        groupTemplateMap.add('bsvr', bsvrGroupTemplate);
        groupTemplateMap.add('', groupTemplate);
        this.myDiagram.groupTemplateMap = groupTemplateMap;

        // decide what kinds of Parts can be added to a Group
        this.myDiagram.commandHandler.memberValidation = function(grp, node) {
            if (grp instanceof go.Group && node instanceof go.Group) return false;  // cannot add Groups to Groups
            // but dropping a Group onto the background is always OK
            return true;
        };


    },

    /* 선택된 서버이미지에 서버정보 맵핑팝업 호출 */
    setRackMapping: function (e, node) {
        var _slotNo = Rack.rackSlotU - (parseInt(node.data.pos.split(' ')[1]) / 20),
            _slotU = parseInt(node.data.size.split(' ')[1]) / 20;
        var _setMngNos = Rack.getSetMngNos();
        $.get(ctxPath + '/main/popup/env/pRackMapping.do', {slotNo: _slotNo, slotU: _slotU},
            function(result) {
                HmWindow.open($('#pwindow'), 'Rack 서버 설정', result, 400, 250, 'pwindow_init', {node: node, setMngNos: _setMngNos});
            }
        );
    },

    /* 선택된 슬롯의 서버정보를 우측 상단에 표시 */
    setRackInfo: function (e, node) {
        Rack.curNodeData = node.data;
    },

    /* 서버 이미지 URL 가져오기(이미지 맵핑) */
    getServerImgUrl: function(key) {
        if(!key) return null;
        // 현대차 예외처리
            return '/img/rack/main/{0}.png'.substitute(key);
    },
    /* 내용없을경우 정보없음 표기 */
    infoRenderer: function(key, flag, cnt) {
        if(!key) return null;

        if(cnt === undefined){
            cnt = 5;
        }
        if(flag){
            return ' ' + HmUtil.substr( key ,cnt) ;
        }else{
            return ' ' + key;
        }
    },
    /* 장비명 아이콘 표기 */
    infoDevNameRenderer: function(devKind1, devKind2) {
        var devKind1 = devKind1.toUpperCase();
        var devKind2 = devKind2.toUpperCase();

        var _iconImg = 'etc.svg';
        switch(devKind2) {
            case 'BACKBONE':
                _iconImg = 'backbone.svg';
                break;
            case 'FIREWALL':
                _iconImg = 'firewall.svg';
                break;
            case 'ROUTER':
                _iconImg = 'router.svg';
                break;
            default:
                if(devKind2.endsWith('SWITCH')) {
                    _iconImg = 'switch.svg';
                }else if(devKind2.toUpperCase().indexOf('WIN')>-1){
                    _iconImg = 'windows.svg'
                }else if(devKind2.toUpperCase().indexOf('LINUX')>-1){
                    _iconImg = 'linux.svg'
                }else if(devKind2.toUpperCase().indexOf('AIX')>-1){
                    _iconImg = 'aix.svg'
                }else if(devKind2.toUpperCase().indexOf('SOLAR')>-1){
                    _iconImg = 'solaris.svg'
                }else if(devKind2.toUpperCase().indexOf('HP')>-1){
                    _iconImg = 'hpux.svg'
                }
                else {
                    _iconImg = (devKind1 == 'SVR') ? 'server.svg' : 'etc.svg';
                }
                break;
        }

        return '/img/tree/v5.0.1/{0}'.substitute(_iconImg);

    },




    getSetMngNos: function() {
        var _nodeDataArray = Rack.myDiagram.model.nodeDataArray;
        var _mngNos = [];
        $.each(_nodeDataArray, function(idx, item) {
            if(item.hasOwnProperty('isGroup') && item.key == 'G1') return;
            if(item.mngNo && item.mngNo != 0) _mngNos.push(item.mngNo);
        });
        return _mngNos;
    },


    /**
     * 블레이드서버 영역안에 속한 블레이드 리스트를 리턴한다.
     * @param bsvrItem
     * @returns {*|void}
     */
    getBlaedList: function(bsvrItem) {
        var _posY = parseInt(bsvrItem.pos.split(' ')[1]),
            _rangeY = [_posY, _posY + (bsvrItem.slotU * 20)];
        var _bldList = Rack.myDiagram.model.nodeDataArray.filter(function(value, index, arr) {
            if(value.slotKind == Rack.SLOT_KIND.BLD) {
                var bldPosY = parseInt(value.pos.split(' ')[1]);
                return bldPosY >= _rangeY[0] && bldPosY <= _rangeY[1];
            }
            return false;
        });
        return _bldList;
    },


    showDetail: function(e, obj) {

        var url;
        switch( obj.part.data.devKind1) {
            case 'SVR':
                url = '/main/popup/sms/pSvrDetail.do';
                break;
            case 'DEV':
                url = '/main/popup/nms/pDevDetail.do';
                break;
            case 'VSVR':
                url = '/main/popup/vsvr/pVsvrDetail.do';
                break;
            default: return false;
        }
        HmUtil.createPopup(url, $('#hForm'), 'pSlotDetail', 1400, 700, {mngNo: obj.part.data.mngNo});
    }
};

HmRackResource = {

    BSVR_TMPLT_LIST: [
        {key: 'BSVR4', bsvrModel: null, color: '#3ebec6', size: '200 ' + (4*20), slotKind: Rack.SLOT_KIND.BSVR, slotU: 4, category: 'bsvr', isGroup: 1},
        {key: 'BSVR10', bsvrModel: 'HP_C7000', color: '#3ebec6', size: '200 ' + (10*20), slotKind: Rack.SLOT_KIND.BSVR, slotU: 10, category: 'bsvr', isGroup: 1, imgName: 'hp_c7000'}
    ],

    HP_C7000_BLD_TMPLT_LIST: [
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 0, y: 0, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 25, y: 0, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 50, y: 0, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 75, y: 0, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 100, y: 0, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 125, y: 0, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 150, y: 0, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 175, y: 0, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 0, y: 85, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 25, y: 85, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 50, y: 85, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 75, y: 85, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 100, y: 85, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 125, y: 85, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 150, y: 85, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'},
        {key: null, group: null, color: 'rgba(e3, e3, e3, 0.4)', x: 175, y: 85, size: '25 85', slotKind: Rack.SLOT_KIND.BLD, category: 'bld'}
    ],

    COLOR: {
        Disable: 'rgba(124,124,124,0.7)',
        Normal: 'transparent',
        EvtLevel1: 'rgba(20,20,160,0.7)',
        EvtLevel2: 'rgba(254,238,36,0.7)',
        EvtLevel3: 'rgba(255,205,0,0.7)',
        EvtLevel4: 'rgba(255,154,0,0.7)',
        EvtLevel5: 'rgba(246,68,49,0.7)'
    }

};