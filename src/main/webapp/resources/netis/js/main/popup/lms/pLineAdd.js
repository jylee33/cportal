var editAddGridIds =[];
var colsInfo = [];
var clickUpDev = 0;
var clickDownDev = 0;
var clickUpIfu = 0;
var clickUpIfd = 0;
var clickDownIfu = 0;
var clickDownIfd = 0;
var PMain = {
    /** variable */
    initVariable: function() {

    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'pbtnAdd': PMain.btnAdd(); break;
            // case 'pbtnEdit': PMain.btnEdit(); break;
            case 'pbtnClose': PMain.btnClose(); break;
            case 'pbtnAddGrid': PMain.btnAddGrid(); break;
            case 'pbtnDelGrid': PMain.btnDelGrid(); break;
            case 'pbtnDynamicAdd': PMain.btnDynamicAdd(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmWindow.create($('#p2window'), 100, 100);
        HmDropDownBtn.createTreeGrid($('#p_ddbLineGrp'), $('#p_lineGrpTree'), HmTree.T_GRP_LINE, 200, 22, 200, 300);

        HmDropDownBtn.createTreeGrid($('#p_ddbUpGrp'), $('#p_upGrpTree'), HmTree.T_GRP_DEF_ALL, 200, 22, 200, 300, PMain.searchDev);
        HmDropDownBtn.createTreeGrid($('#p_ddbDownGrp'), $('#p_downGrpTree'), HmTree.T_GRP_DEF_ALL, 200, 22, 200, 300, PMain.searchDev);

        $('#p_cbUpDevKind, #p_cbDownDevKind').jqxDropDownList({ source: new $.jqx.dataAdapter({ datatype: 'json', url: ctxPath + '/combo/getSysoidDevKindList.do' }),
            displayMember: 'label', valueMember: 'value', width: 200, height: 22, theme: jqxTheme, selectedIndex: 0 })
            .on('bindingComplete', function (event) {
                switch(event.target.id){
                    case 'p_cbUpDevKind':
                        $('#p_cbUpDevKind').jqxDropDownList('insertAt', '전체', 0 );
                        break;
                    case 'p_cbDownDevKind':
                        $('#p_cbDownDevKind').jqxDropDownList('insertAt', '전체', 0 );
                        break;
                }
            });

        $('#p_ddbUpDev, #p_ddbDownDev').jqxDropDownButton({ width: 200, height: 22, theme: jqxTheme })
            .on('open', function(event) {
                switch(event.target.id){
                    case 'p_ddbUpDev':
                        $('#p_upDevGrid').css('display', 'block');
                        break;
                    case 'p_ddbDownDev':
                        $('#p_downDevGrid').css('display', 'block');
                        break;
                }
            });
        $('#p_ddbUpIfu,#p_ddbUpIfd, #p_ddbDownIfu, #p_ddbDownIfd').jqxDropDownButton({ width: 200, height: 22, theme: jqxTheme })
            .on('open', function(event) {
                switch(event.target.id){
                    case 'p_ddbUpIfu':
                        $('#p_upIfGridu').css('display', 'block');
                        break;
                    case 'p_ddbUpIfd':
                        $('#p_upIfGridd').css('display', 'block');
                        break;
                    case 'p_ddbDownIfu':
                        $('#p_downIfGridu').css('display', 'block');
                        break;
                    case 'p_ddbDownIfd':
                        $('#p_downIfGridd').css('display', 'block');
                        break;
                }
            });

        HmGrid.create($('#p_upDevGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    id: 'mngNo'
                },
                {
                    formatData: function(data) {
                        var grpSelection = $('#p_upGrpTree').jqxTreeGrid('getSelection');
                        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;

                        var item = $('#p_cbUpDevKind').jqxDropDownList('getSelectedItem');
                        if(item != null){
                            if(item.value !='전체')
                                var _devKind2 = item.value;
                        }

                        $.extend(data, {
                            grpNo: _grpNo,
                            devKind2: _devKind2
                        });
                        return data;
                    },
                    loadComplete: function(records) {

                    }
                }
            ),
            columns:
                [
                    { text: '장비종류', datafield: 'devKind2', width: 150 },
                    { text: '장비명', datafield: 'disDevName', width: 150 },
                    { text: 'IP', datafield: 'devIp', width: 120 },
                    { text: '모델', datafield: 'model', width: 130 },
                    { text: '제조사', datafield: 'vendor', width: 130 }
                ],
            width:650
        });

        HmGrid.create($('#p_downDevGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    id: 'mngNo'
                },
                {
                    formatData: function(data) {
                        var grpSelection = $('#p_downGrpTree').jqxTreeGrid('getSelection');
                        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;

                        var item = $('#p_cbDownDevKind').jqxDropDownList('getSelectedItem');
                        if(item != null){
                            if(item.value !='전체')
                                var _devKind2 = item.value;
                        }

                        $.extend(data, {
                            grpNo: _grpNo,
                            devKind2: _devKind2
                        });
                        return data;
                    },
                    loadComplete: function(records) {

                    }
                }
            ),
            columns:
                [
                    { text: '장비종류', datafield: 'devKind2', width: 150 },
                    { text: '장비명', datafield: 'disDevName', width: 150 },
                    { text: 'IP', datafield: 'devIp', width: 120 },
                    { text: '모델', datafield: 'model', width: 130 },
                    { text: '제조사', datafield: 'vendor', width: 130 }
                ],
            width:650
        });

        $('#p_upDevGrid, #p_downDevGrid').on('rowselect', function(event) {
            switch(event.target.id){
                case 'p_upDevGrid':
                    var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
                    var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.disDevName.htmlCharacterUnescapes() + '</div>';
                    $('#p_ddbUpDev').jqxDropDownButton('setContent', content);
                    break;
                case 'p_downDevGrid':
                    var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
                    var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.disDevName.htmlCharacterUnescapes() + '</div>';
                    $('#p_ddbDownDev').jqxDropDownButton('setContent', content);
                    break;
            }
        }).on('bindingcomplete', function(event) {
        }).on('rowclick', function(event){
            var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
            switch(event.target.id){
                case 'p_upDevGrid':
                    clickUpDev = rowdata.mngNo;
                    $('#p_ddbUpDev').jqxDropDownButton('close');
                    break;
                case 'p_downDevGrid':
                    clickDownDev = rowdata.mngNo;
                    $('#p_ddbDownDev').jqxDropDownButton('close');
                    break;
            }

            PMain.searchIf(event);
        });




        HmGrid.create($('#p_upIfGridu'), {
            height: 460,
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'POST'
                },
                {
                    contentType: 'application/json',
                    formatData: function(data) {
                        var _list = [];
                        var rows = $('#addGridList').jqxGrid('getrows');
                        $.each(rows, function(idx, value) {
                            var grid = $('#addGridList').jqxGrid('getrowdata', idx);
                            _list.push({mngNo: grid.upMngNo, ifIdx: grid.upIfIdx});
                            _list.push({mngNo: grid.downMngNo, ifIdx: grid.downIfIdx});
                        });
                        _mngNo = clickUpDev;

                        if(!_list.length){
                            _list.push({ mngNo: -1, ifIdx: -1});
                        }
                        $.extend(data, {
                            mngNo: _mngNo,
                            list: _list
                        });
                        return  JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        p_editIds = [];
                    }
                }
            ),
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    { text : '회선번호', datafield : 'ifIdx', width : 100, editable: false },
                    { text : '회선명', datafield : 'ifName', minwidth : 130, editable: false },
                    { text : '회선별칭', datafield : 'ifAlias', width: 120, editable: false },
                    { text : '사용자회선명', datafield : 'userIfName', width: 130, editable: false }
                ]
        });

        HmGrid.create($('#p_upIfGridd'), {
            height: 460,
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'POST'
                },
                {
                    contentType: 'application/json',
                    formatData: function(data) {
                        var _list = [];
                        var rows = $('#addGridList').jqxGrid('getrows');
                        $.each(rows, function(idx, value) {
                            var grid = $('#addGridList').jqxGrid('getrowdata', idx);
                            _list.push({mngNo: grid.upMngNo, ifIdx: grid.upIfIdx});
                            _list.push({mngNo: grid.downMngNo, ifIdx: grid.downIfIdx});
                        });
                        _mngNo = clickUpDev;

                        if(!_list.length){
                            _list.push({ mngNo: -1, ifIdx: -1});
                        }
                        $.extend(data, {
                            mngNo: _mngNo,
                            list: _list
                        });
                        return  JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        p_editIds = [];
                    }
                }
            ),
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    { text : '회선번호', datafield : 'ifIdx', width : 100, editable: false },
                    { text : '회선명', datafield : 'ifName', minwidth : 130, editable: false },
                    { text : '회선별칭', datafield : 'ifAlias', width: 120, editable: false },
                    { text : '사용자회선명', datafield : 'userIfName', width: 130, editable: false }
                ]
        });


        HmGrid.create($('#p_downIfGridu'), {
            height: 460,
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'POST'
                },
                {
                    contentType: 'application/json',
                    formatData: function(data) {
                        var _list = [];
                        var rows = $('#addGridList').jqxGrid('getrows');
                        $.each(rows, function(idx, value) {
                            var grid = $('#addGridList').jqxGrid('getrowdata', idx);
                            _list.push({mngNo: grid.upMngNo, ifIdx: grid.upIfIdx});
                            _list.push({mngNo: grid.downMngNo, ifIdx: grid.downIfIdx});
                        });
                        _mngNo = clickDownDev;

                        if(!_list.length){
                            _list.push({ mngNo: -1, ifIdx: -1});
                        }
                        $.extend(data, {
                            mngNo: _mngNo,
                            list: _list
                        });
                        return  JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        p_editIds = [];
                    }
                }
            ),
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    { text : '회선번호', datafield : 'ifIdx', width : 100, editable: false },
                    { text : '회선명', datafield : 'ifName', minwidth : 130, editable: false },
                    { text : '회선별칭', datafield : 'ifAlias', width: 120, editable: false },
                    { text : '사용자회선명', datafield : 'userIfName', width: 130, editable: false }
                ]
        });
        HmGrid.create($('#p_downIfGridd'), {
            height: 460,
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'POST'
                },
                {
                    contentType: 'application/json',
                    formatData: function(data) {
                        var _list = [];
                        var rows = $('#addGridList').jqxGrid('getrows');
                        $.each(rows, function(idx, value) {
                            var grid = $('#addGridList').jqxGrid('getrowdata', idx);
                            _list.push({mngNo: grid.upMngNo, ifIdx: grid.upIfIdx});
                            _list.push({mngNo: grid.downMngNo, ifIdx: grid.downIfIdx});
                        });
                        _mngNo = clickDownDev;

                        if(!_list.length){
                            _list.push({ mngNo: -1, ifIdx: -1});
                        }
                        $.extend(data, {
                            mngNo: _mngNo,
                            list: _list
                        });
                        return  JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        p_editIds = [];
                    }
                }
            ),
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    { text : '회선번호', datafield : 'ifIdx', width : 100, editable: false },
                    { text : '회선명', datafield : 'ifName', minwidth : 130, editable: false },
                    { text : '회선별칭', datafield : 'ifAlias', width: 120, editable: false },
                    { text : '사용자회선명', datafield : 'userIfName', width: 130, editable: false }
                ]
        });

        $('#p_upIfGridu, #p_upIfGridd, #p_downIfGridu, #p_downIfGridd').on('rowselect', function(event) {
            switch(event.target.id){
                case 'p_upIfGridu':
                    var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
                    var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.ifName + '</div>';
                    $('#p_ddbUpIfu').jqxDropDownButton('setContent', content);
                    break;
                case 'p_upIfGridd':
                    var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
                    var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.ifName + '</div>';
                    $('#p_ddbUpIfd').jqxDropDownButton('setContent', content);
                    break;
                case 'p_downIfGridu':
                    var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
                    var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.ifName + '</div>';
                    $('#p_ddbDownIfu').jqxDropDownButton('setContent', content);
                    break;
                case 'p_downIfGridd':
                    var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
                    var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.ifName + '</div>';
                    $('#p_ddbDownIfd').jqxDropDownButton('setContent', content);
                    break;
            }
        }).on('bindingcomplete', function(event) {
        }).on('rowclick', function(event){
            var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
            switch(event.target.id){
                case 'p_upIfGridu':
                    clickUpIfu = rowdata.ifIdx;
                    $('#p_ddbUpIfu').jqxDropDownButton('close');
                    break;
                case 'p_upIfGridd':
                    clickUpIfd = rowdata.ifIdx;
                    $('#p_ddbUpIfd').jqxDropDownButton('close');
                    break;
                case 'p_downIfGridu':
                    clickDownIfu = rowdata.ifIdx;
                    $('#p_ddbDownIfu').jqxDropDownButton('close');
                    break;
                case 'p_downIfGridd':
                    clickDownIfd = rowdata.ifIdx;
                    $('#p_ddbDownIfd').jqxDropDownButton('close');
                    break;
            }

            // PMain.searchIf(event);
        });


        HmGrid.create($('#addGridList'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        return data;
                    },
                    loadComplete: function(records) {
                        editAddGridIds = [];
                    }
                }
            ),
            width: '100%',
            height: 200,
            pageable: false,
            editmode: 'selectedrow',
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '장비 연결 정보');
            },
            columns:
                [
                    { text : '상위 그룹번호', columngroup:'up', datafield : 'upGrpNo', minwidth : 60, editable: false ,hidden: true},
                    { text : '상위 그룹', columngroup:'up',datafield : 'upGrpName', minwidth : 60, editable: false },
                    { text : '상위 장비번호', columngroup:'up',datafield : 'upMngNo', minwidth : 60, editable: false ,hidden: true},
                    { text : '상위 장비', columngroup:'up',datafield : 'upDevName', minwidth : 60, editable: false},
                    { text : '상위 회선', columngroup:'up',datafield : 'upIfIdxu', minwidth : 60, editable: false, hidden: true},
                    { text : '하위 회선', columngroup:'up',datafield : 'upIfIdxd',  minwidth : 60, editable: false, hidden: true},
                    { text : '상위 회선', columngroup:'up',datafield : 'disUpIfIdxu',  minwidth : 60, editable: false},
                    { text : '하위 회선', columngroup:'up',datafield : 'disUpIfIdxd',  minwidth : 60, editable: false},
                    { text : '하위 그룹번호', columngroup:'down',datafield : 'downGrpNo', minwidth : 60, editable: false ,hidden: true},
                    { text : '하위 그룹', columngroup:'down',datafield : 'downGrpName', minwidth : 60, editable: false },
                    { text : '하위 장비번호', columngroup:'down',datafield : 'downMngNo', minwidth : 60, editable: false ,hidden: true},
                    { text : '하위 장비', columngroup:'down',datafield : 'downDevName', minwidth : 60, editable: false},
                    { text : '상위회선', columngroup:'down',datafield : 'downIfIdxu', minwidth : 60, editable: false, hidden: true},
                    { text : '하위 회선', columngroup:'down',datafield : 'downIfIdxd', minwidth : 60, editable: false, hidden: true},
                    { text : '상위회선', columngroup:'down',datafield : 'disDownIfIdxu', minwidth : 60, editable: false},
                    { text : '하위 회선', columngroup:'down',datafield : 'disDownIfIdxd', minwidth : 60, editable: false}
                ],columngroups: [
                { text: '상위국', align: 'center', name: 'up' },
                { text: '하위국', align: 'center', name: 'down' }
            ]

        });

        // 	var fixedCols = [];
        // HmGrid.create($('#dynamicGrid'), {
        // 	source : new $.jqx.dataAdapter({
        // 		datatype : 'json',
        // 	}, {
        // 		formatData : function(data) {
        // 			$.extend(data, {
        // 				tableKind : 0
        // 			});
        // 			return data;
        // 		},
        // 	}),
        // 	width : '100%',
        // 	height : 80,
        // 	autorowheight: true,
        // 	autoheight: true,
        // 	columns : fixedCols,
        // 	pageable: false
        // });

    },



    /** init data */
    initData: function() {
        // PMain.searchDynamic();
    },

    searchDev: function(event) {
        switch (event.target.id) {
            case 'p_upGrpTree':
                $('#p_ddbUpDev').jqxDropDownButton('setContent', null);
                $('#p_ddbUpIfu').jqxDropDownButton('setContent', null);
                $('#p_ddbUpIfd').jqxDropDownButton('setContent', null);
                HmGrid.updateBoundData($('#p_upDevGrid'), ctxPath + '/dev/getDevList.do');
                break;
            case 'p_downGrpTree':
                $('#p_ddbDownDev').jqxDropDownButton('setContent', null);
                $('#p_ddbDownIfu').jqxDropDownButton('setContent', null);
                $('#p_ddbDownIfd').jqxDropDownButton('setContent', null);
                HmGrid.updateBoundData($('#p_downDevGrid'), ctxPath + '/dev/getDevList.do');
                break;
        }
    },

    searchIf: function(event) {
        if(event === undefined){
            $('#p_ddbUpIfu').jqxDropDownButton('setContent', null);
            HmGrid.updateBoundData($('#p_upIfGridu'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
            $('#p_ddbUpIfd').jqxDropDownButton('setContent', null);
            HmGrid.updateBoundData($('#p_upIfGridd'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
            $('#p_ddbDownIfu').jqxDropDownButton('setContent', null);
            HmGrid.updateBoundData($('#p_downIfGridu'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
            $('#p_ddbDownIfd').jqxDropDownButton('setContent', null);
            HmGrid.updateBoundData($('#p_downIfGridd'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
            return;
        }
        switch (event.target.id) {
            case 'p_upDevGrid':
                $('#p_ddbUpIfu').jqxDropDownButton('setContent', null);
                $('#p_ddbUpIfd').jqxDropDownButton('setContent', null);
                HmGrid.updateBoundData($('#p_upIfGridu'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
                HmGrid.updateBoundData($('#p_upIfGridd'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
                break;
            case 'p_downDevGrid':
                $('#p_ddbDownIfu').jqxDropDownButton('setContent', null);
                $('#p_ddbDownIfd').jqxDropDownButton('setContent', null);
                HmGrid.updateBoundData($('#p_downIfGridu'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
                HmGrid.updateBoundData($('#p_downIfGridd'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
                break;
            // default:
            //     $('#p_ddbUpIf').jqxDropDownButton('setContent', null);
            //     HmGrid.updateBoundData($('#p_upIfGrid'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
            //     $('#p_ddbDownIf').jqxDropDownButton('setContent', null);
            //     HmGrid.updateBoundData($('#p_downIfGrid'), ctxPath + '/main/lms/lineMgmt/getIfList.do');
            // 	break;

        }



    },


    btnAddGrid: function(){
        var _upGrpNo, _upGrpName, _upMngNo, _upDevName, _upIfIdxu, _upIfIdxd, _disUpIfIdxu, _disUpIfIdxd;
        var _downGrpNo, _downGrpName, _downMngNo, _downDevName, _downIfIdxu, _downIfIdxd, _disDownIfIdxu, _disDownIfIdxd;

        var rows = $('#addGridList').jqxGrid('getrows');
        var rowIdx = $('#addGridList').jqxGrid('getrows').length;

        var p_upGrpTree = $('#p_upGrpTree').jqxTreeGrid('getSelection');
        var p_downGrpTree = $('#p_downGrpTree').jqxTreeGrid('getSelection');
        if( (p_upGrpTree != null && p_upGrpTree.length > 0) || (p_downGrpTree != null && p_downGrpTree.length > 0) ){
//				_grpName = p_grpTree[0].grpName;
//				_grpNo = p_grpTree[0].grpNo;
        }else{
            alert("건물을 선택하세요.");
            return false
        }

        var upDevIdx = HmGrid.getRowIdxes($('#p_upDevGrid'));
        var downDevIdx = HmGrid.getRowIdxes($('#p_downDevGrid'));

        if(upDevIdx === false || downDevIdx === false) {
            alert('장비를 선택하세요.');
            return;
        }else{
            var upDevItem = $('#p_upDevGrid').jqxGrid('getrowdata', upDevIdx);
            var downDevItem = $('#p_downDevGrid').jqxGrid('getrowdata', downDevIdx);
            _upMngNo = upDevItem.mngNo;
            _upDevName = upDevItem.disDevName.htmlCharacterEscapes();
            _upGrpNo = upDevItem.grpNo;
            _upGrpName = upDevItem.grpName.htmlCharacterEscapes();

            _downMngNo = downDevItem.mngNo;
            _downDevName = downDevItem.disDevName.htmlCharacterEscapes();
            _downGrpNo = downDevItem.grpNo;
            _downGrpName = downDevItem.grpName.htmlCharacterEscapes();
        }

        var upIfIdxu = HmGrid.getRowIdxes($('#p_upIfGridu'));
        var upIfIdxd = HmGrid.getRowIdxes($('#p_upIfGridd'));
        var downIfIdxu = HmGrid.getRowIdxes($('#p_downIfGridu'));
        var downIfIdxd = HmGrid.getRowIdxes($('#p_downIfGridd'));
        if(upIfIdxu === false) {
            _upIfIdxu = -1;
        }else{
            var ifItem = $('#p_upIfGridu').jqxGrid('getrowdata', upIfIdxu);
            _upIfIdxu = ifItem.ifIdx;
            _disUpIfIdxu = ifItem.ifName;
        }
        if(upIfIdxd === false) {
            _upIfIdxd = -1;
        }else{
            var ifItem = $('#p_upIfGridd').jqxGrid('getrowdata', upIfIdxd);
            _upIfIdxd = ifItem.ifIdx;
            _disUpIfIdxd = ifItem.ifName;
        }


        if(downIfIdxu === false) {
            _downIfIdxu = -1;
        }else{
            var ifItem = $('#p_downIfGridu').jqxGrid('getrowdata', downIfIdxu);
            _downIfIdxu = ifItem.ifIdx;
            _disDownIfIdxu = ifItem.ifName;
        }
        if(downIfIdxd === false) {
            _downIfIdxd = -1;
        }else{
            var ifItem = $('#p_downIfGridd').jqxGrid('getrowdata', downIfIdxd);
            _downIfIdxd = ifItem.ifIdx;
            _disDownIfIdxd = ifItem.ifName;
        }


        var data = {
            upMngNo: _upMngNo,
            upDevName: _upDevName,
            upGrpNo: _upGrpNo,
            upGrpName: _upGrpName,
            upIfIdxu: _upIfIdxu,
            upIfIdxd: _upIfIdxd,
            disUpIfIdxu: _disUpIfIdxu,
            disUpIfIdxd: _disUpIfIdxd,
            downMngNo: _downMngNo,
            downDevName: _downDevName,
            downGrpNo: _downGrpNo,
            downGrpName: _downGrpName,
            downIfIdxu: _downIfIdxu,
            downIfIdxd: _downIfIdxd,
            disDownIfIdxu: _disDownIfIdxu,
            disDownIfIdxd: _disDownIfIdxd
        }

        $('#addGridList').jqxGrid('addrow', rowIdx, data);
        PMain.searchIf();
    },
// 		btnAddGrid: function(){

//

//
// 			var devIdx = HmGrid.getRowIdxes($('#p_devGrid'));
// 			if(devIdx === false) {
// 				alert('장비를 선택하세요.');
// 				return;
// 			}else{
// 				var devItem = $('#p_devGrid').jqxGrid('getrowdata', devIdx);
// 				_mngNo = devItem.mngNo;
// 				_devName = devItem.devName;
// 				_grpNo = devItem.grpNo;
// 				_grpName = devItem.grpName;
// 			}
//
//
// 			var ifIdx = HmGrid.getRowIdxes($('#p_ifGrid'));
// 			if(ifIdx === false) {
// 				alert('회선을 선택하세요.');
// 				return;
// 			}else{
// 				var ifItem = $('#p_ifGrid').jqxGrid('getrowdata', ifIdx);
// 				_ifIdx = ifItem.ifIdx;
// 			}
//
//
// 			var data = {
// 					grpNo: _grpNo,
// 					grpName: _grpName,
// 					mngNo: _mngNo,
// 					devName: _devName,
// 					ifIdx: _ifIdx
// 			}
//
//
// 			$('#addGridList').jqxGrid('addrow', rowIdx, data);
// //			PMain.searchDev();
// 			PMain.searchIf();
//
// 		},


    btnDelGrid: function(){
        // debugger
        var rowIdx = $('#addGridList').jqxGrid('getrows').length;

        if(rowIdx-1 < 0){
            alert("삭제할 장비가 없습니다.")
            return;
        }else{
            var item = $('#addGridList').jqxGrid('getrowdata', rowIdx-1);
            if(!confirm('[' + item.grpName + ' ' + item.disDevName + ' ' + item.ifIdx+ ']  삭제하시겠습니까?')) return;
            $('#addGridList').jqxGrid('deleterow', item.uid);
        }
    },

    btnAdd: function(){

        var obj = $('#pForm').serializeObject();
        var rows = $('#addGridList').jqxGrid('getrows');
        if(rows.length == 0) {
            alert('추가된 데이터가 없습니다.');
            return;
        }

        if(rows != 0) {
            var _list = [];
            var cnt = 0;
            $.each(rows, function (idx, value) {
                var data = $('#addGridList').jqxGrid('getrowdata', idx);
                if (rows.length > idx) {
                    var sLocKind, eLocKind = '';
                    if(idx == 0){
                        sLocKind = 'S';
                    }
                    if(rows.length-1 == idx){
                        eLocKind ='E';
                    }

                    _list.push({ 'upMngNo': data.upMngNo, 'upIfIdxUp': data.upIfIdxu, 'upIfIdxDown': data.upIfIdxd, 'downMngNo': data.downMngNo, 'downIfIdxUp': data.downIfIdxu, 'downIfIdxDown': data.downIfIdxd, lineCnt: cnt++, sLocKind: sLocKind, eLocKind: eLocKind });
                }
            });
            obj.list = _list;
        }
        obj.lineGrpNo = treeItem = HmTreeGrid.getSelectedItem($('#p_lineGrpTree')).grpNo;
        // var dynamicItem = $('#dynamicGrid').jqxGrid('getrowdata', 0);
        //
        // var dynamicArray = PMain.extractCols();
        //
        // var columnName = '';
        // var columnValue = '';
        //
        // for(i = 0; i<dynamicArray.length; i++){
        // 	if(i < dynamicArray.length-1){
        // 		columnName = columnName + dynamicArray[i].datafield +', ';
        //
        // 		if(dynamicArray[i].columntype == '문자'){
        // 			if(dynamicArray[i].value =='' || dynamicArray[i].value == null ){
        // 				columnValue = columnValue + null +', ';
        // 			}else{
        // 				columnValue = columnValue + '\'' + dynamicArray[i].value + '\'' +', ';
        // 			}
        // 		}else{
        // 			if(dynamicArray[i].value =='' || dynamicArray[i].value == null ){
        // 				columnValue = columnValue +null + ', ';
        // 			}else{
        // 				columnValue = columnValue + dynamicArray[i].value + ', ';
        // 			}
        // 		}
        // 	}else{
        // 		columnName = columnName + dynamicArray[i].datafield;
        // 		if(dynamicArray[i].columntype == '문자'){
        // 			if(dynamicArray[i].value =='' || dynamicArray[i].value == null ){
        // 				columnValue = columnValue + null;
        // 			}else{
        // 				columnValue = columnValue + '\'' + dynamicArray[i].value + '\'';
        // 			}
        // 		}else{
        // 			if(dynamicArray[i].value =='' || dynamicArray[i].value == null ){
        // 				columnValue = columnValue + null;
        // 			}else{
        // 				columnValue = columnValue + dynamicArray[i].value;
        // 			}
        // 		}
        // 	}
        // }
        // obj.columnName = columnName;
        // obj.columnValue = columnValue;


        Server.post('/main/lms/lineMgmt/addLine.do', {
            data : obj,
            success : function(result) {
                alert(result);
                Main.search();
                $('#pbtnClose').click();
            }
        });

    },

    btnClose: function(){
        $('#pwindow').off('click');
        $('.jqx-window-close-button').off('click');
        $('#pwindow').jqxWindow('close');
    },

    // btnDynamicAdd: function(){
    //
    // 	cols = $('#dynamicGrid').jqxGrid("columns").records.length
    // 	var _height = (cols * 55 ) + 50;
    //
    // 	$.post(ctxPath + '/main/popup/lms/pDynamicAdd.do', function(result) {
    // 		HmWindow.open($('#p2window'), '동적컬럼 추가', result, 450, _height, 'p2window_init');
    // 	});
    // },

    searchDynamic: function(){

        Server.get("/main/lms/lineMgmt/getItemList.do", {
            data : {
                tableKind : 0
            },
            success : function(data) {
                var cols = [];
                colsInfo = [];

                $.each(data, function(idx, item) {
                    colsInfo.push({
                        text : item.colCap,
                        datafield : item.colNm,
                        columntype : item.colType,
                        colSize : item.colSize
                    });

                    if(item.colNm !='CONN_SEQ_NO'){
                        if (item.colType == 'NUMBER' || item.colType =='INT') {
                            cols.push({
                                text : item.colCap,
                                datafield : item.colNm,
                                minwidth : 100,
                                cellsalign : 'right',
                                columntype : 'numberinput',
                                colSize : item.colSize,
                                createeditor : function(row, cellvalue, editor) {
                                    var _max = '';
                                    for (var i = 0; i < item.colSize; i++) {
                                        _max += '9';
                                    }
                                    editor.jqxNumberInput({
                                        inputMode : 'simple',
                                        digits : item.colSize,
                                        decimalDigits : 0,
                                        min : 0,
                                        max : parseInt(_max)
                                    });
                                }
                            });
                        } else {
                            cols.push({
                                text : item.colCap,
                                datafield : item.colNm,
                                minwidth : 100,
                                colSize : item.colSize,
//								width : 100,
                                validation : function(cell, value) {
                                    if (value == '')
                                        return true;
                                    if (value.length > item.colSize) {
                                        return {
                                            result : false,
                                            message : item.colSize + '자 이내로 입력하세요.'
                                        };
                                    } else
                                        return true;
                                }
                            });
                        }
                    }
                });

                $('#dynamicGrid').jqxGrid('beginupdate', true);
                $('#dynamicGrid').jqxGrid({
                    columns : cols
                });
                $('#dynamicGrid').jqxGrid('endupdate');

                var rows = $('#dynamicGrid').jqxGrid('getrows');
                if (rows.length < 1) {
                    $('#dynamicGrid').jqxGrid('addrow', 0, {});
                    for (var i = 0; i < cols.length; i++) {
                        $('#dynamicGrid').jqxGrid('setcellvalue', 0, cols[i].datafield, '');
                    }
                }
            }
        });
    },
    extractCols: function() {
        var _paramCols = [];
        var cols = $('#dynamicGrid').jqxGrid("columns");

        for (var i = 0; i < cols.records.length; i++) {
            var value = $('#dynamicGrid').jqxGrid('getcellvalue', 0, cols.records[i].datafield);

            var datafield = cols.records[i].datafield;

            $.each(colsInfo, function(idx,item){
                if(datafield == item.datafield){
                    _paramCols.push({
                        columntype : item.columntype,
                        colSize: item.colSize,
                        datafield : datafield,
                        text : cols.records[i].text,
                        value : value
                    });
                }
            });

        }
        return _paramCols;
    },
    /* 동적컬럼 세팅 */
    gridSet:function(obj) {
        var items = [];
        $.each(obj, function(idx, item) {
            if(item == '' || item == null){
                item = null
            }
            $('#dynamicGrid').jqxGrid('setcellvaluebyid', 0, idx, item);
//				if (item == '') {
//					items.push('\''+ '' + '\'');
//				} else {
//					items.push('\''+ item + '\'');
//				}
        });
//			$('#addedData').val(items.join(','));


    },



};
$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});