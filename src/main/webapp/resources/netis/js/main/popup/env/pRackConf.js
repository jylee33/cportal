/**
 * 랙실장도 구성
 * @param rackNo, rackSlotU
 */

var frontData = [], backData = [], delData = [];
var orgSection;
var Rack = {
    SLOT_KIND: {
        DEV: 'DEV',
        SVR: 'SVR',
        BSVR: 'BSVR',
        BLD: 'BLD'
    },
    SECTION: {
        FRONT: 'F',
        BACK: 'B'
    },
    rackNo: 0,
    rackSlotU: 0,
    myDiagram: null,
    go_cellSize: null,
    curNodeData: null,
    rackType: '',

    initVariable: function () {
        orgSection  = Rack.SECTION.FRONT;
    },

    initDesign: function () {
        //rack no
        this.rackNo = $('#pRackNo').val();
        this.rackSlotU = $('#pRackU').val();
        this.initSlotNo();
        this.initDiagram();
        this.initVirtualSvr();
    },

    initCondition: function () {
        var list = $('#pRackType').val() === 'SINGLE' ?
            [{label:'앞면', value:Rack.SECTION.FRONT}] :
            [{label:'앞면', value:Rack.SECTION.FRONT}, {label:'뒷면', value:Rack.SECTION.BACK}]
        ;
        HmBoxCondition.createRadioInput($('#sSrchType'), JSON.parse(JSON.stringify(list)));
        $('#sSrchType_input').hide(); //input 박스 숨김처리
    },

    observe: function () {
        $('#pbtnDetail').click(Rack.showDetail);
        $('#pbtnDel').click(Rack.delSlot);
        $('#pbtnSave').click(Rack.saveRack);
        $('#pbtnClose').click(function () {
            self.close();
        });
        $('#sSrchType0, #sSrchType1').click(Rack.changeType);//앞면, 뒷면 선택
    },

    changeType: function () {
        var rackType = $("input:radio[name={0}]:checked".substitute('sSrchType')).val();
        if(orgSection !== rackType) orgSection = rackType;
        else return;

        if(rackType === Rack.SECTION.FRONT) {
            Rack.setRackData(Rack.SECTION.BACK);
            Rack.myDiagram.model.nodeDataArray = frontData;
        } else {
            Rack.setRackData(Rack.SECTION.FRONT);
            Rack.myDiagram.model.nodeDataArray = backData;
        }
    },

    setRackData: function (_type) {
        var _nodeDataArray = Rack.myDiagram.model.nodeDataArray;
        var _slotData = [];
        $.each(_nodeDataArray, function (idx, item) {
            if (item.hasOwnProperty('isGroup') && item.key == 'G1') return;
            item.slotNo = parseInt(item.pos.split(' ')[1]) / 20;
            item.rackSection = _type;
            if (item.slotKind == Rack.SLOT_KIND.BLD) return;
            else if (item.slotKind == Rack.SLOT_KIND.BSVR) {
                var _bsvrPosY = parseInt(item.pos.split(' ')[1]),
                    _bldList = [],
                    findBldList = Rack.getBlaedList(item);
                $.each(findBldList, function (bldIdx, bldItem) {
                    var _bldPosArr = bldItem.pos.split(' ');
                    _bldList.push({
                        mngNo: bldItem.mngNo,
                        devKind1: bldItem.devKind1 || 'DEV',
                        posRow: (parseInt(_bldPosArr[1]) - _bsvrPosY) / 20,
                        posCol: parseInt(_bldPosArr[0]) / 20,
                        size: bldItem.size,
                        imgName: bldItem.imgName
                    });
                });
                item.bldList = _bldList;
            }

            _slotData.push(item);
        });
        _slotData.unshift({key: 'G1', isGroup: true, pos: '0 0', size: '300 1200'});
        _type === Rack.SECTION.FRONT ? frontData = _slotData : backData = _slotData;
    },

    /**
     * DB로부터 랙설정 정보를 읽어와서 랙구성
     */
    initData: function () {
        Server.get('/main/popup/rackConf/getRackSlotInfo.do', {
            data: {rackNo: Rack.rackNo},
            success: function (result) {
                if (result == null) result = [];
                $.each(result, function (idx, item) {
                    if (item.slotKind == Rack.SLOT_KIND.BLD) {
                        $.extend(item, {
                            key: item.uniqKey,
                            group: item.uniqKey.split('_')[0],
                            color: item.mngNo == 0 ? HmRackResource.COLOR.Disable : HmRackResource.COLOR.Normal,
                            pos: [item.posCol * 20, (item.slotNo * 20) + (item.posRow * 20)].join(' '),
                            category: 'bld'
                        });
                    }
                    else {
                        $.extend(item, {
                            key: item.uniqKey,
                            group: 'G1',
                            color: item.slotKind != Rack.SLOT_KIND.BSVR && item.mngNo == 0 ? HmRackResource.COLOR.Disable : HmRackResource.COLOR.Normal,
                            pos: [0, item.slotNo * 20].join(' '),
                            isGroup: item.slotKind == Rack.SLOT_KIND.BSVR,
                            category: item.slotKind == Rack.SLOT_KIND.BSVR ? 'bsvr' : ''
                        });
                    }
                });

                //앞면, 뒷면 랙 데이터 구분
                $.each(result, function (idx, item) {
                    item.rackSection === Rack.SECTION.FRONT ?
                        frontData.push(item) : backData.push(item);
                });
                //background insert
                frontData.unshift({key: 'G1', isGroup: true, pos: '0 0', size: '300 1200'});
                backData.unshift({key: 'G1', isGroup: true, pos: '0 0', size: '300 1200'});

                Rack.myDiagram.model.nodeDataArray = frontData;
                Rack.rackType = result.rackType; //단면 or 양면
            }
        });
    },

    /**
     * 랙 전체Unit에 따른 no 표시 및 랙 div 높이조절
     * @param slotU
     */
    initSlotNo: function (slotU) {
        $('#myDiagramDiv').parent('div:first').height(this.rackSlotU * 20 + 10); //div 높이조절
        var ul = $('#slotNumberUL');
        for (var i = this.rackSlotU; i >= 1; i--) {
            ul.append($('<li></li>', {text: i}));
        }
    },

    /**
     * GoJS Diagram 초기화
     */
    initDiagram: function () {
        go.licenseKey = "2bf842e1b66e58c511895a25406c7efb0bab2d66ce804df45e0317f1ed5c7a042498b87851dadf9081fd49fc1f2890dcd8966079934f0369e761d58c41e1d5abb76520e0175f40dbf10373979daf38b1fa2d21f4c2e727a3c8688ff3eba1dc9943e8f5";
        var $ = go.GraphObject.make;

        this.go_cellSize = new go.Size(20, 20);
        this.myDiagram =
            $(go.Diagram, "myDiagramDiv",
                {
                    grid: $(go.Panel, "Grid", //or go.Panel.Grid
                        {
                            gridCellSize: Rack.go_cellSize, margin: 2
                        },
                        $(go.Shape, "LineH", {stroke: "lightgray"}),
                        $(go.Shape, "LineV", {stroke: "lightgray"})
                    ),
                    // padding: 0,
                    // support grid snapping when dragging and when resizing
                    "draggingTool.isGridSnapEnabled": true,
                    "draggingTool.gridSnapCellSpot": go.Spot.Center,
                    "resizingTool.isGridSnapEnabled": true,
                    allowDrop: true,  // handle drag-and-drop from the Palette\
                    "animationManager.isEnabled": false,
                    "undoManager.isEnabled": true,
                    mouseDrop: function (e) {
                        // alert("Diagram mouse drop!");
                        e.diagram.currentTool.doCancel();
                    }
                });

        // tooltip
        var tooltiptemplate =
            $('ToolTip',
                {'Border.fill': 'whitesmoke', 'Border.stroke': 'black'},
                $(go.TextBlock,
                    {
                        margin: 5
                    },
                    new go.Binding('text', '', function (d) {
                        return d.imgName != null ? d.imgName.substring(d.imgName.indexOf('U') + 1) : null;
                    })
                )
            );

        // 기본 서버 템플릿
        var svrNodeTemplate =
            $(go.Node, "Auto",
                {dragComputation: Rack.avoidNodeOverlap, toolTip: tooltiptemplate},
                {
                    resizable: false, resizeObjectName: "SHAPE",
                    // because the gridSnapCellSpot is Center, offset the Node's location
                    // locationSpot: new go.Spot(0, 0, Rack.go_cellSize.width/2, Rack.go_cellSize.height/2),
                    locationSpot: go.Spot.TopLeft,
                    doubleClick: Rack.setRackMapping,
                    click: Rack.setRackInfo
                },
                // always save/load the point that is the top-left corner of the node, not the location
                new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Picture,
                    new go.Binding('source', 'imgName', Rack.getServerImgUrl)),
                $(go.Shape, 'Rectangle',
                    {
                        name: 'SHAPE',
                        fill: 'white',
                        opacity: 0.8,
                        minSize: Rack.go_cellSize,
                        desiredSize: Rack.go_cellSize
                    },
                    new go.Binding('fill', 'color'),
                    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify))
            );

        // 블레이드(BLD) 템플릿
        var bldNodeTemplate =
            $(go.Node, "Auto",
                {dragComputation: Rack.avoidNodeOverlap},
                {
                    resizable: false, resizeObjectName: "SHAPE",
                    // because the gridSnapCellSpot is Center, offset the Node's location
                    locationSpot: go.Spot.TopLeft,
                    selectable: true, movable: false,
                    doubleClick: Rack.setRackMapping,
                    click: Rack.setRackInfo,
                    contextClick: function (e, obj) {
                        if (obj.selectable == false) {
                            var groupKey = obj.data.group;
                            var groupNode = e.diagram.findNodeForKey(groupKey);
                            e.diagram.commandHandler.showContextMenu(groupNode);
                        }
                    }
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
                {dragComputation: Rack.avoidNodeOverlap},
                {
                    resizable: false, resizeObjectName: 'SHAPE',
                    movable: true, selectable: true,
                    locationSpot: go.Spot.TopLeft
                },
                new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Shape, 'Rectangle',
                    {
                        name: 'SHAPE', fill: 'rgba(60,60,60,0.7)', stroke: 'rgba(60,60,60,1)', strokeWidth: 1
                    }),
                $(go.TextBlock,
                    {alignment: go.Spot.Center, font: 'bold 16px sans-serif', stroke: '#fff'},
                    new go.Binding('text', 'slotU', function (v) {
                        return v + 'U';
                    }))
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
                    mouseDrop: function (e, grp) {
                        // var ok = grp.addMembers(grp.diagram.selection, true);
                        // console.log("ok > " + ok);
                        // if (!ok) {
                        //     grp.diagram.currentTool.doCancel();
                        //     return;
                        // }

                        /**
                         * G1에 MouseDrop이벤트 발생시...
                         * slotKind가 SVR|BBOX에 한해 MouseDrop을 허용한다.
                         */
                            // drop되는 노드의 장비를 맵핑하기 위한 팝업창 호출
                        var model = Rack.myDiagram.model;
                        model.startTransaction("set pos");
                        for (var it = e.diagram.selection.iterator; it.next();) {
                            var node = it.value;
                            console.group("bg mouseDrop node...");
                            console.log(node);
                            console.groupEnd();

                            // 블레이드를 추가시 rollback
                            // if(node.data.slotKind == Rack.SLOT_KIND.BLD) {
                            //     grp.diagram.currentTool.doCancel();
                            //     model.rollbackTransaction();
                            //     alert('블레이드는 블레이드서버 안에 위치시켜주세요.');
                            //     return;
                            // }

                            //새로운서버를 G1에 추가시 pos 틀어짐 문제가 발생.. .원인파악중 (강제로 x좌표 0으로 맞춤)
                            if (jQuery.inArray(node.data.slotKind, [Rack.SLOT_KIND.DEV, Rack.SLOT_KIND.SVR, Rack.SLOT_KIND.BSVR]) != -1) {
                                var posY = Math.floor(parseInt(node.data.pos.split(' ')[1]));
                                model.setDataProperty(node.data, 'group', 'G1');
                                model.setDataProperty(node.data, 'pos', '0 ' + posY);
                                model.setDataProperty(node.data, 'slotNo', posY / 20);
                                if (jQuery.inArray(node.data.slotKind, [Rack.SLOT_KIND.DEV, Rack.SLOT_KIND.SVR]) != -1)
                                    model.setDataProperty(node.data, 'color', HmRackResource.COLOR.Disable); //DEV|SVR인경우 비활성화 컬러 지정
                            }

                            if (node.data.slotKind == Rack.SLOT_KIND.BSVR && (node.data.isInit || false) == false) {
                                var tmpList = HmRackResource[node.data.bsvrModel + '_BLD_TMPLT_LIST'];
                                if (tmpList != null) {
                                    var bldList = JSON.parse(JSON.stringify(tmpList)); // 참조없는 배열복사(참조주소로 인한 버그발생하여 추가...)
                                    for (var bsvrIdx = 0; bsvrIdx < bldList.length; bsvrIdx++) {
                                        var tmp = bldList[bsvrIdx];
                                        jQuery.extend(tmp, {
                                            key: node.data.key + '_' + bsvrIdx,
                                            group: node.data.key,
                                            pos: [tmp.x, tmp.y + (node.data.slotNo * 20)].join(' ')
                                        });
                                        console.log(tmp);
                                        Rack.myDiagram.model.addNodeData(tmp);
                                    }
                                }

                                // for(var bsvrIdx = 0; bsvrIdx < 16; bsvrIdx++) {
                                //     var item = {
                                //         key: node.data.key+"_"+bsvrIdx,
                                //         group: node.data.key,
                                //         color: 'rgba(e3, e3, e3, .2)',
                                //         pos: [bsvrIdx%8 * 25, (node.data.slotNo * 20)+(bsvrIdx>=8? 85: 0)].join(' '),
                                //         size: "25 85",
                                //         slotKind: 'BLD',
                                //         category: 'bld'
                                //     };
                                //     Rack.myDiagram.model.addNodeData(item);
                                // }
                                node.data.isInit = true;
                                // Rack.myDiagram.model.nodeDataArray.push(item);
                            }

                            // BSVR가 아니고 장비가 맵핑되지 않았으면 설정팝업 호출
                            if (node.data.slotKind != Rack.SLOT_KIND.BSVR && !node.data.hasOwnProperty("mngNo")) {
                                Rack.setRackMapping(null, node);
                            }
                        }
                        model.commitTransaction("set pos");
                        Rack.myDiagram.clearSelection();
                        console.log('end G1 mouseDrop');
                    }
                },
                new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, 'Rectangle',
                    {
                        name: 'SHAPE', fill: groupFill, stroke: groupStroke,
                        minSize: new go.Size(Rack.go_cellSize.width * 2, Rack.go_cellSize.height * 2)
                    },
                    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
                    new go.Binding("fill", "isHighlighted", function (h) {
                        return h ? dropFill : groupFill;
                    }).ofObject(),
                    new go.Binding("stroke", "isHighlighted", function (h) {
                        return h ? dropStroke : groupStroke;
                    }).ofObject())
            );

        function makeCtxButton(text, action, visiblePredicate) {
            return $('ContextMenuButton',
                $(go.TextBlock, text),
                {click: action},
                visiblePredicate ? new go.Binding('visible', '', function (o, e) {
                    return o.diagram ? visiblePredicate(o, e) : false;
                }).ofObject() : {});
        }

        var bsvrContextMenu =
            $(go.Adornment, 'Vertical',
                makeCtxButton('블레이드 비활성화', function (e, obj) {
                    var _bldList = Rack.getBlaedList(e.diagram.selection.first().data);
                    for (var idx = 0, n = _bldList.length; idx < n; idx++) {
                        var bldItem = _bldList[idx];
                        var bldNode = e.diagram.findNodeForKey(bldItem.key);
                        bldNode.selectable = false;
                    }
                }),
                makeCtxButton('블레이드 활성화', function (e, obj) {
                    var _bldList = Rack.getBlaedList(e.diagram.selection.first().data);
                    for (var idx = 0, n = _bldList.length; idx < n; idx++) {
                        var bldItem = _bldList[idx];
                        var bldNode = e.diagram.findNodeForKey(bldItem.key);
                        bldNode.selectable = true;
                    }
                }));

        // 블레이드서버(BSVR) 그룹 템플릿
        var bsvrGroupTemplate =
            $(go.Group, 'Auto',
                {dragComputation: Rack.avoidNodeOverlap},
                {
                    layerName: 'Background',
                    resizable: false, resizeObjectName: 'SHAPE',
                    movable: true, selectable: true,
                    locationSpot: go.Spot.TopLeft,
                    // locationSpot: new go.Spot(0, 0, Rack.go_cellSize.width/2, Rack.go_cellSize.height/2),
                    mouseDrop: function (e, grp) {
                        // drop되는 노드의 장비를 맵핑하기 위한 팝업창 호출
                        var model = Rack.myDiagram.model;
                        model.startTransaction("set pos");
                        for (var it = e.diagram.selection.iterator; it.next();) {
                            var node = it.value;
                            if (node.data.slotKind != Rack.SLOT_KIND.BLD) {
                                grp.diagram.currentTool.doCancel();
                                model.rollbackTransaction();
                                alert('블레이드 서버에는 블레이드만 위치시킬수 있습니다.');
                                return;
                            }
                            console.log(node);
                            // model.setDataProperty(node.data, 'pos', '0 ' + node.data.pos.split(' ')[1]);

                            if (node.data.slotKind == Rack.SLOT_KIND.BLD && !node.data.hasOwnProperty('mngNo')) {

                            }

                            // BSVR가 아니고 장비가 맵핑되지 않았으면 설정팝업 호출
                            if (node.data.slotKind != Rack.SLOT_KIND.BSVR && !node.data.hasOwnProperty("mngNo")) {
                                Rack.setRackMapping(null, node);
                            }
                        }
                        model.commitTransaction("set pos");

                        //Add the Parts in the given collection as members of this Group for those Parts for which CommandHandler.isValidMember returns true
                        var ok = grp.addMembers(grp.diagram.selection, true);
                        console.log("ok > " + ok);
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
                // new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
                // new go.Binding("fill", "isHighlighted", function(h) { return h ? dropFill : groupFill; }).ofObject(),
                // new go.Binding("stroke", "isHighlighted", function(h) { return h ? dropStroke: groupStroke; }).ofObject())
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
        this.myDiagram.commandHandler.memberValidation = function (grp, node) {
            if (grp instanceof go.Group && node instanceof go.Group) return false;  // cannot add Groups to Groups
            // but dropping a Group onto the background is always OK
            return true;
        };

        this.initServerPalette($);


    },

    /* 선택된 서버이미지에 서버정보 맵핑팝업 호출 */
    setRackMapping: function (e, node) {
        var _slotNo = Rack.rackSlotU - (parseInt(node.data.pos.split(' ')[1]) / 20);
        var _slotU = parseInt(node.data.size.split(' ')[1]) / 20;
        if (_slotU > 1) {
            _slotNo = _slotNo - _slotU + 1
        }
        var _setMngNos = Rack.getSetMngNos();
        $.get(ctxPath + '/main/popup/env/pRackMapping.do', {slotNo: _slotNo, slotU: _slotU},
            function (result) {
                HmWindow.open($('#pwindow'), 'Rack 장비/서버 설정', result, 400, 215, 'pwindow_init', {
                    node: node,
                    setMngNos: _setMngNos
                });
            }
        );
    },

    /* 선택된 슬롯의 서버정보를 우측 상단에 표시
     *   DEV|SVR|BSVR|BLD
     *       BLD일때는 표시정보를 달리할 필요가 있어보임.
     **/
    setRackInfo: function (e, node) {
        try {
            var _data = node.data;
            Rack.curNodeData = _data;

            if (_data.mngNo && _data.mngNo != 0) {
                if (_data.slotKind == Rack.SLOT_KIND.BLD) {



                    $('#p_slotU').val('-');
                }
                else {
                    $('#p_slotU').val('{0} ({1}U)'.substitute(Rack.rackSlotU - _data.slotNo - _data.slotU + 1, _data.slotU));
                }
                $('#p_slotName').val(_data.slotName);
                $('#p_slotIp').val(_data.slotIp);
                $('#p_slotKind').val(_data.devKind1);
                $('#p_devKind2').val(_data.devKind2);
            }
            else {
                $('#p_slotU, #p_slotName, #p_slotIp, #p_slotKind, #p_devKind2').val('-');
            }
            Rack.getVirtualSvr();
        } catch (e) {}
    },

    /* 서버 이미지 URL 가져오기(이미지 맵핑) */
    getServerImgUrl: function (key) {
        if (!key) return null;
        return '/img/rack/main/{0}.png'.substitute(key);
    },

    initServerPalette: function ($) {

        var template = {};
        var seaNet = {
            ALCATEL_SWITCH: {
                name: 'Alcatel_Switch',
                list: ['1ARUBAR3400_1U',  '11MSPP_11U', '20MSPP_1660SM_20U', '1OAW-4504XM_1U', '1OS6250-24_1U', '1OS6350-24_1U', '1OS6450-10_1U', '1OS6450-24_1U', '1OS6850E-24_1U', '1OS6860-24_1U', '12OS9700E_12U']
            },
            BROCADE: {name: 'Brocade', list: ['1FWS_624G_1U', '8SX800_8U']},
            CISCO_NECUS: {name: 'Cisco_Necus', list: ['1NK-C3172TQ-10GT_1u']},
            CISCO_SWITCH: {
                name: 'Cisco_Switch',
                list: ['16D_16U', '1D-8T_1U', '1D-12S_1U','1D-24PC_1U', '1D-24S_1U', '1D-24S-A_1U', '1D-24TS', '1D-24TS_1U',
                    '1D-48T_1U', '1D-48TA_1U', '1DC-24TS_1U', '1DG-24PS_1U', '1DL-24P_1U', '1DL-24T_1U', '1DL-48T_1U', '1DNAC_ISA_1U', '1DT-24_1U',
                    '1DX-24T_1U', '1DX-24TS_1U', '1SDWAN_1U', '1DNAC_ISA_1U', '2Router_C3640_2U', '10D-XL']
            },
            DASAN: {name: 'Dasan', list: ['1DV_1U', '1DVG_1U']},

            FORTOGATE: {
                name: 'FortoGate',
                list: ['1IPS_FG-300C_1U', '1UTM_FG-30E_1U', '1UTM_FG-60E_1U', '1UTM_FG-80E_1U', '1UTM_FG201E_1U', '2UTM_FG1000C_2U']
            },

            HANDREAMNET: {name: 'HANDREAMNET', list: ['1HN1028G_1U', '1SG128G_1U']},

            HP_3COM: {
                name: 'Hp_3Com',
                list: ['1HP 2530-24G_1U', '1HP 5510-24G_1U', '1HP1820-2G_1U', '1ProCurve 2510G-24_1U', '1PROCURVE 6200YL-24G_1U', '8ProCurve 8206zl_8U']
            },

            IP: {name: 'Ip', list: ['1IP1', '1IP1_1U', '1IP2_', '1IP2_1U']},

            JUNIPER: {
                name: 'Juniper',
                list: ['1SSLVPN_SA_4500_1U', '1UTM_SSG550M_1U', '1VPN_NS208_1U', '1VPN_SSG5SH_1U']
            },

            PIOLINK: {name: 'Piolink', list: ['2L_PAS-5016_2U', '2L_PAS-K2424_2U']},
            MONITORLAB: {name: 'MonitorLab', list: ['2WISG-500_2u']},
            SONICWALL: {name: 'SonicWall', list: ['1NSA-3600', '1NSA-4600', '1TZ600_1u']},
            SECUREWAY: {name: 'SecureWay', list: ['1SSLVPN_Secuway_u1000_1U']},
            ALTEON: {name: 'Alteon', list: ['1L_ALTEON4408_1U']},
        };


        var template_basic = {


            L7_A10: {name: 'L7SWITCH(A10)', list: ['1UAX1000-11', '1UTH930', '1UTH1030S', '1UTH3030S']},
            SW_CISCONEXUS: {
                name: 'Switch(Cisco Nexus)',
                list: ['1UN2K-2232PP-10GE', '1UN2K-C2224TP-1GE', '1UN2K-C2248TP-E-1GE', '1UN2K-C2348TQ-10G-E', '1UN3K-C3048TP-1GE',
                    '1UN3K-C3064PQ-10GX', '1UN5K-5548UP', '1UN5K-5672UP', '1UN6K-C6001-64P', '2UN5K-C5596UP',
                    '7UN7K-7004', '10UC6807-XL', '14UN7K-C7009', '21UN7K-C7010']
            },
            SW_HUAWEI: {name: "Switch(Huawei)", list: ['1US5700-28P-LI-AC', '1US5720-52P-LI-AC']},
            SW_HP: {
                name: 'Switch(HP)',
                list: ['1UA3100-24_v2_EI', '1UA3100-48_v1', '1UA3600-24_v1', '1UA3600-48_v2_SI', '1UA5120-24G_SI',
                    '1UA5120-48G_SI', '1UA5500-24G-SFP_EI', '1US5500-28F-EI']
            },
            SW_CISCO: {
                name: 'Switch(Cisco)',
                list: ['1UC9500-16X', '1UWS-C2950C-24', '1UWS-C2960-24TC-L', '1UWS-C2960-48TC-L', '1UWS-C2960X-24TS-L',
                    '1UWS-C2960X-48TS-L', '1UWS-C3508G-XL', '1UWS-C3548-XL-EN', '1UWS-C3550-24-SMI', '1UWS-C3550-48-SMI', '1UWS-C3560-24TS-E',
                    '1UWS-C3560-48TS', '1UWS-C3560G-24TS-E', '1UWS-C3560G-48TS-E', '1UWS-C3560X-24T-L', '1UWS-C3560X-48T-L', '1UWS-C3650-24TS-L',
                    '1UWS-C3650-48TS-L', '1UWS-C3750G-24TS', '1UWS-C3750G-48TS-E', '1UWS-C3850-24S', '1UWS-C3850-48T-S', '1UWS-C4500X-16',
                    '1UWS-C4500X-32', '7UWS-C4503-E', '10UWS-C4506', '11UWS-C4507R-E', '11UWS-C6506-E', '14UWS-C6509-E', '19UWS-C6513']
            },
            FW_PALOALTO: {
                name: 'Firewall(Paloalto)',
                list: ['1UM-100', '1UPA-850', '1UPA-3060', '2UPA-5050', '2UPA-5060', '3UPA-5220', '3UPA-5250']
            },
            FW_FORTINET: {
                name: 'Firewall(Fortinet)',
                list: ['1UFortiManager-300D', '1UFotiAnalyzer-3000E', '3UFortigate-3600C']
            },
            FW_CISCO: {
                name: 'Firewall(Cisco)',
                list: ['1UASA-5515', '1UASA-5520', '1UASA-5525', '1UASA-5550', '1UASA5555', '1UAX2500', '2UASA5585', '4UASA-5580-40']
            },
            ROUTER_CISCO: {
                name: 'Router(Cisco)',
                list: ['1UCISCO1921_K9', '1UISR4431', '2UASR-9001', '3UCISCO3945', '6UASR-1006']
            },
            AP_CISCO: {name: 'AP(Cisco)', list: ['1UAIR-CT2504-K9', '1UAIR-CT5508-K9', '1UAIR-CT5520-K9']},
            MGW_AVAYA: {name: 'MediaGateway(Avaya)', list: ['4UG450', '16UG650']},
            // 서버
            SVR_HP: {
                name: 'Server(HP)',
                type: Rack.SLOT_KIND.SVR,
                list: ['4UML350-G10', '1UDL360P-G7', '2UDL380-G10', '2UDL560-G10']
            },
            ETC: {
                name: 'Etc',
                list: ['1UPRIME-NCS-APL-K9', '2UPIX525', '1UDL360P-G7', '1BIGip-1U', '3ewalker_v7_3U', '1network_TAP_CT1000_1U']
            },

        };

        if (jQuery("#gSiteName").val() == "seanet") {
            // jQuery.extend(template, seaNet);
            template = Object.assign({}, seaNet, template_basic);
        } else {
            template = Object.assign({}, template_basic);
        }

        // div create
        var $frag = jQuery(document.createDocumentFragment());
        for (var p in template) {
            var div1 = jQuery('<div></div>', {text: template[p].name});
            var div2 = jQuery('<div></div>', {style: 'overflow: hidden;'})
                .append(jQuery('<div></div>', {id: 'palette' + p, style: 'width: 100%; height: 450px'}));
            $frag.append(div1);
            $frag.append(div2);
        }
        jQuery('#accordion').prepend($frag);

        for (var p in template) {
            var palette =
                $(go.Palette, "palette" + p, {
                    nodeTemplate: Rack.myDiagram.nodeTemplateMap.get("svr"),
                    groupTemplate: Rack.myDiagram.groupTemplateMap.get("bg"),
                    layout: $(go.GridLayout, {sorting: go.GridLayout.Forward})
                });
            var modelList = [];
            var modelData = template[p].list;
            var type = template[p].type;
            for (var i = 0, n = modelData.length; i < n; i++) {

                var _slotU = parseInt(modelData[i].replace(/\D/, ''));

                // console.log("MODEL : " + modelData[i] + " , slot : " + _slotU);

                modelList.push({
                    key: modelData[i],
                    color: 'transparent',
                    size: '200 ' + (_slotU * 20),
                    imgName: 'Obj_' + modelData[i],
                    slotKind: type !== undefined ? (type || Rack.SLOT_KIND.DEV) : Rack.SLOT_KIND.DEV,
                    slotU: _slotU
                });
            }
            palette.model = new go.GraphLinksModel(modelList);
        }

        var paletteDev =
            $(go.Palette, "paletteDev",
                {
                    nodeTemplate: Rack.myDiagram.nodeTemplateMap.get("svr"),
                    groupTemplate: Rack.myDiagram.groupTemplateMap.get("bg"),
                    layout: $(go.GridLayout, {sorting: go.GridLayout.Forward})
                });

        var devModelArr = [
            '1UPowerStrip', '1USwitch', '1UUnknown', '2USwitch', '3U', '4URouter'
        ];
        var devModelList = [];
        for (var i = 0, n = devModelArr.length; i < n; i++) {
            var _slotU = parseInt(devModelArr[i].replace(/\D/, ''));
            devModelList.push({
                key: devModelArr[i],
                color: 'transparent',
                size: '200 ' + (_slotU * 20),
                imgName: 'Obj_' + devModelArr[i],
                slotKind: Rack.SLOT_KIND.DEV,
                slotU: _slotU
            })
        }
        paletteDev.model = new go.GraphLinksModel(devModelList);

        var paletteSvr =
            $(go.Palette, "paletteSvr",
                {
                    nodeTemplate: Rack.myDiagram.nodeTemplateMap.get("svr"),
                    groupTemplate: Rack.myDiagram.groupTemplateMap.get("bg"),
                    layout: $(go.GridLayout, {sorting: go.GridLayout.Forward})
                });

        var svrModelArr = [
            '1UUnknown', '1UServer', '2UServer', '4UServer', '4UServer2',
            '5U', '6U', '7U', '8U', '9U', '10U', '11U', '12U'
        ];
        var svrModelList = [];
        for (var i = 0, n = svrModelArr.length; i < n; i++) {
            var _slotU = parseInt(svrModelArr[i].replace(/\D/, ''));
            svrModelList.push({
                key: svrModelArr[i],
                color: 'transparent',
                size: '200 ' + (_slotU * 20),
                imgName: 'Obj_' + svrModelArr[i],
                slotKind: Rack.SLOT_KIND.SVR,
                slotU: _slotU
            })
        }
        paletteSvr.model = new go.GraphLinksModel(svrModelList);

        // BSVR
        var paletteBsvr =
            $(go.Palette, "paletteBsvr",
                {
                    nodeTemplate: Rack.myDiagram.nodeTemplateMap.get("bsvr"),
                    groupTemplate: Rack.myDiagram.groupTemplateMap.get("bsvr"),
                    layout: $(go.GridLayout, {sorting: go.GridLayout.Forward})
                });
        paletteBsvr.model = new go.GraphLinksModel(HmRackResource.BSVR_TMPLT_LIST);


        jQuery('#accordion').jqxNavigationBar({
            width: '100%', height: 'auto', theme: jqxTheme, expandMode: 'single',
            initContent: function (index) {
                // if(index == 0) paletteSvr.requestUpdate();
                // else if(index == 1) paletteBsvr.requestUpdate();
            }
        });
    },

    /* Node간 Overlap 방지 */
    avoidNodeOverlap: function (node, pt, gridpt) {
        if (node.diagram instanceof go.Palette) return gridpt;

        // this assumes each node is fully rectangular
        var bnds = node.actualBounds,
            loc = node.location,
            isGroup = node instanceof go.Group;

        var r = new go.Rect(
            gridpt.x - (loc.x - bnds.x) - (node.data.slotKind == Rack.SLOT_KIND.BLD ? 10 : 0),
            gridpt.y - (loc.y - bnds.y) - 10,
            bnds.width - 1,
            bnds.height - 2 //블레이드서버는 stroke때문에 1px 추가됨
        );
        // console.log('pt: ' + pt + ' / gridpt: ' + gridpt + ' / bnds: ' + bnds + ' / loc: ' + loc);
        // console.log(r);
        // maybe inflate R if you want some space between the node and any other nodes
        r.inflate(-0.5, -0.5); // by default, deflate to avoid edge overlaps with "exact" fits
        // when dragging a node from another Diagram, choose an unoccupied area
        if (!(node.diagram.currentTool instanceof go.DraggingTool) &&
            (!node._temp || !node.layer.isTemporary)) {  // in Temporary Layer during external drag-and-drop
            node._temp = true;  // flag to avoid repeated searches during external drag-and-drop
            while (!Rack.isUnoccupied(r, node)) {
                r.x += 10;  // note that this is an unimaginative search algorithm --
                r.y += 10;  // you can improve the search here to be more appropriate for your app
            }
            r.inflate(0.5, 0.5);  // restore to actual size
            // return the proposed new location point
            return new go.Point(r.x - (loc.x - bnds.x), r.y - (loc.y - bnds.y));
        }
        if (Rack.isUnoccupied(r, node)) {
            // console.log(node);
            // if(node instanceof go.Group) {
            //     gridpt.x = 10;
            // }
            // else {
            gridpt.x -= 10, gridpt.y -= 10;
            if (gridpt.x < 0) gridpt.x = 0;

            // BLD|BSVR 경우, Y축이 G1영역을 벗어나면 가장 아래 슬롯으로 고정(영역을 벗어나지 않도록...)
            if (node.data.slotKind == Rack.SLOT_KIND.BLD || node.data.slotKind == Rack.SLOT_KIND.BSVR) {
                var nodeH = parseInt(node.data.size.split(' ')[1]);
                if ((gridpt.y + nodeH) > (Rack.rackSlotU * 20)) {
                    gridpt.y = Rack.rackSlotU * 20 - nodeH;
                }
            }
            // BLD 경우, BSVR(블레이드서버)영역을 벗어나는지 체크
            else if (node.data.slotKind == Rack.SLOT_KIND.BLD && node.data.hasOwnProperty('group')) {
                var bboxData = node.diagram.findNodeForKey(node.data.group).data,
                    sy = parseInt(bboxData.pos.split(' ')[1]),
                    ey = sy + parseInt(bboxData.size.split(' ')[1]);
                if (gridpt.y < sy) gridpt.y = sy;
                else if (gridpt.y > ey) gridpt.y = ey - parseInt(node.data.size.split(' ')[1]);
            }
            // console.log(gridpt);
            // }
            return gridpt;
        }  // OK

        return loc;  // give up -- don't allow the node to be moved to the new location
    },

    // R is a Rect in document coordinates
    // NODE is the Node being moved -- ignore when looking for Parts intersecting the Rect
    isUnoccupied: function (r, node) {
        var diagram = node.diagram;
        // nested function used by Layer.findObjectsIn, below
        // only consider Parts, and ignore the given Node and any Links
        function navig(obj) {
            var part = obj.part;
            if (part === node) return null;
            if (part instanceof go.Link) return null;
            else if (part instanceof go.Group) {
                if (part.data.key == 'G1') {
                    // if(node.data.slotKind == Rack.SLOT_KIND.BSVR && node.data.hasOwnProperty("group")) return part;
                    // else return null;
                    return null;
                } //overlap아이템이 background group인 경우
                else if (node.data.slotKind == Rack.SLOT_KIND.BLD && part.data.slotKind == Rack.SLOT_KIND.BSVR
                    && node.data.group == part.data.key) {
                    return null;
                }
                else {
                    if (!node.data.hasOwnProperty('group')) return null; //이동하는 node에 group정보가 없는경우(palatte -> bg dragging)
                }
            }

            if (node instanceof go.Group) { //이동하는 아이템이 BSVR이고 overlap되는 node가 그룹에 속한 BLD인 경우
                if (part instanceof go.Node) {
                    if (part.data.group == node.data.key) return null; //bsvr 에 속한 bld
                }
            }
            else if (node instanceof go.Node) { //이동하는 서버가 bsvr인경우
                if (node.data.slotKind == Rack.SLOT_KIND.BLD && part.data.slotKind == Rack.SLOT_KIND.BSVR) return null;
            }

            // console.log("overlap part...");
            // console.log(part);

            return part;
        }

        var lit = diagram.layers;
        while (lit.next()) {
            var lay = lit.value;
            if (lay.isTemporary) continue;
            var count = lay.findObjectsIn(r, navig, null, true).count;
            if (count > 0) return false;
        }
        return true;
    },

    /** 슬롯 삭제 */
    delSlot: function () {
        var _selection = Rack.myDiagram.selection;
        if (_selection.count == 0) {
            alert('삭제할 슬롯을 선택해주세요.');
            return;
        }
        // slotKind = BLD인 노드는 삭제하지 않도록 선택노드를 재정의한다.
        var _newselection = [];
        for (var it = _selection.iterator; it.next();) {
            var node = it.value;
            if (node.data.slotKind != Rack.SLOT_KIND.BLD) {
                _newselection.push(node);
            }
        }
        Rack.myDiagram.selectCollection(_newselection);
        Rack.myDiagram.commandHandler.deleteSelection();

        if(Rack.curNodeData.devKind1 === 'VSVR') {
            delData.push(Rack.curNodeData);
            Rack.curNodeData = null;
            Rack.getVirtualSvr();
        }

        //Rack 실장정보 값 초기화
        $('.p_inputTxt.slotInfo').val('');
    },

    getSetMngNos: function () {
        // var _nodeDataArray = Rack.myDiagram.model.nodeDataArray;
        var _nodeDataArray = [];
        Array.prototype.push.apply(_nodeDataArray, frontData);
        Array.prototype.push.apply(_nodeDataArray, backData);

        var _mngNos = [];
        $.each(_nodeDataArray, function (idx, item) {
            if (item.hasOwnProperty('isGroup') && item.key == 'G1') return;
            if (item.mngNo && item.mngNo != 0) _mngNos.push(item.mngNo);
        });
        return _mngNos;
    },

    /** 랙 구성도 저장 */
    saveRack: function () {
        var rackType = $("input:radio[name={0}]:checked".substitute('sSrchType')).val();
        Rack.setRackData(rackType); // 마지막으로 변경한 값까지 저장

        var _slotData = [];
        frontData.shift();
        backData.shift();
        Array.prototype.push.apply(_slotData, frontData);
        Array.prototype.push.apply(_slotData, backData);

        var deletedVmData = [];
        $.each(delData, function (idx, item) {
            deletedVmData.push({ rackMngNo: item.mngNo });
        });

        Server.post('/main/popup/rackConf/saveRackSlotInfo.do', {
            data: {rackNo: Rack.rackNo, slotList: _slotData, list: deletedVmData },
            success: function (result) {
                alert("저장되었습니다.");
                window.opener.Main.searchRack();
                self.close();
            }
        });
    },

    /**
     * 블레이드서버 영역안에 속한 블레이드 리스트를 리턴한다.
     * @param bsvrItem
     * @returns {*|void}
     */
    getBlaedList: function (bsvrItem) {
        var _posY = parseInt(bsvrItem.pos.split(' ')[1]),
            _rangeY = [_posY, _posY + (bsvrItem.slotU * 20)];
        var _bldList = Rack.myDiagram.model.nodeDataArray.filter(function (value, index, arr) {
            if (value.slotKind == Rack.SLOT_KIND.BLD) {
                var bldPosY = parseInt(value.pos.split(' ')[1]);
                return bldPosY >= _rangeY[0] && bldPosY <= _rangeY[1];
            }
            return false;
        });
        return _bldList;
    },

    showDetail: function () {
        if (Rack.curNodeData == null || (Rack.curNodeData.mngNo || 0) == 0) {
            alert('선택된 서버가 없습니다.');
            return;
        }

        var url;

        switch (Rack.curNodeData.devKind1) {
            case 'SVR':
                url = '/main/popup/sms/pSvrDetail.do';
                break;
            case 'DEV':
                url = '/main/popup/nms/pDevDetail.do';
                break;
            case 'VSVR':
                url = '/main/popup/vsvr/pVsvrDetail.do';
                break;
        }
        HmUtil.createPopup(url, $('#hForm'), 'pSlotDetail', 1400, 700, {mngNo: Rack.curNodeData.mngNo});
    },

    /*========================================================*
     *  VM 서버 설정정보
    /*========================================================*/

    getVirtualSvr:function () {
        HmGrid.updateBoundData($('#p_virtualSvrGrid'), '/main/popup/rackConf/getRackVirtualSvrInfo.do')
    },

    initVirtualSvr: function () {
        var VM_KIND = {
            AUTO: { label: '자동', value: 0 },
            PSV: { label: '수동', value: 1 }
        };
        HmGrid.create($('#p_virtualSvrGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        if(Rack.curNodeData !== null) {
                            data.rackMngNo = Rack.curNodeData.mngNo;
                        }
                        return data;
                    }
                }
            ),
            height: '615px',
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, 'VM 서버 설정정보');
            },

            columns:
                [
                    { text: '그룹', datafield: 'grpName', width: 110 },
                    { text: '장비명', datafield: 'disDevName', minwidth: 100 },
                    { text: '종류', datafield: 'devKind2', width: 100 },
                    { text: 'IP', datafield: 'devIp', width: 100 },
                    { text: '등록구분', datafield: 'kind', width: 70, hidden: true,
                        cellsrenderer: function (row, column, value) {
                            var txt = value === VM_KIND.AUTO.value ? VM_KIND.AUTO.label : VM_KIND.PSV.label;
                            return '<div style="margin: 6.5px; text-align: center">' + txt + '</div>';
                        }
                    },
                ]
        });

        //추가
        $('#pbtnAdd_vsvr').on('click', function () {
            if(Rack.curNodeData === null) {
                alert('Rack 슬롯을 선택해주세요.');
                return;
            }
            if(!(Rack.curNodeData.devKind1 === 'SVR' || Rack.curNodeData.devKind1 === 'VSVR')) {
                alert('서버 또는 가상서버일 경우 가능합니다.');
                return;
            }
            $.get(ctxPath + '/main/popup/env/pRackVirtualDev.do', function(result) {
                var params = {};
                params.setMngNos = Rack.getSetMngNos();
                params.mngNo = Rack.curNodeData.mngNo;
                HmWindow.openFit($('#pwindow'), 'VM 서버 설정', result, 700, 500, 'pwindow_init', params);
            });
        });

        //삭제
        $('#pbtnDel_vsvr').on('click', function () {
            var row = HmGrid.getRowData($('#p_virtualSvrGrid'));
            if(row === null) {
                alert('VM 서버 설정정보를 선택해주세요.');
                return;
            }
            if(row.kind === VM_KIND.AUTO.value) {
                alert('수동으로 등록된 VM 만 삭제가능합니다.');
                return;
            }
            if(!confirm('해당 VM 서버를 삭제하시겠습니까?')) return;

            Server.post('/main/popup/rackConf/delRackVmDev.do', {
                data: { rackMngNo: Rack.curNodeData.mngNo, mngNo : row.mngNo },
                success: function (msg) {
                    alert(msg);
                    Rack.getVirtualSvr();
                }
            })
        });
    }

};


$(function () {
    Rack.initCondition();
    Rack.observe();
    Rack.initDesign();
    Rack.initData();
});


HmRackResource = {

    BSVR_TMPLT_LIST: [
        // {key: 'BSVR4', bsvrModel: null, color: '#3ebec6', size: '200 ' + (4*20), slotKind: Rack.SLOT_KIND.BSVR, slotU: 4, category: 'bsvr', isGroup: 1},
        {
            key: 'BSVR10',
            bsvrModel: 'HP_C7000',
            color: '#3ebec6',
            size: '200 ' + (10 * 20),
            slotKind: Rack.SLOT_KIND.BSVR,
            slotU: 10,
            category: 'bsvr',
            isGroup: true,
            imgName: 'hp_c7000'
        }
    ],

    HP_C7000_BLD_TMPLT_LIST: [
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 0,
            y: 0,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 25,
            y: 0,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 50,
            y: 0,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 75,
            y: 0,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 100,
            y: 0,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 125,
            y: 0,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 150,
            y: 0,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 175,
            y: 0,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 0,
            y: 85,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 25,
            y: 85,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 50,
            y: 85,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 75,
            y: 85,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 100,
            y: 85,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 125,
            y: 85,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 150,
            y: 85,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        },
        {
            key: null,
            group: null,
            color: 'rgba(e3, e3, e3, 0.4)',
            x: 175,
            y: 85,
            size: '25 85',
            slotKind: Rack.SLOT_KIND.BLD,
            category: 'bld'
        }
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
