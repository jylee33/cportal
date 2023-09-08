var $devListGrid;
var ctxmenuIdx = 1;
var selectedRow = 0;

var pMain = {
        /** variable */
        initVariable : function() {
            $devListGrid = $('#p_devListGrid');
        },

        /** add event */
        observe : function() {
            $('button').bind('click', function(event) { pMain.eventControl(event); });
        },

        /** event handler */
        eventControl : function(event) {
            var curTarget = event.currentTarget;
            switch (curTarget.id) {
                case 'pbtnMove': this.moveContents(); break;
                case 'pbtnClose': this.boardClose(); break;
                case 'pbtnSearch' : this.searchDevFind(); break;
            }
        },

        /** init design */
        initDesign : function() {

            HmGrid.create($devListGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
                        datafields: [	// 필터기능이 정상동작을 안해서 추가함!
                            { name: 'grpNo', type: 'string' },
                            { name: 'itemNo', type: 'string' },
                            { name: 'grpName', type: 'string' },
                            { name: 'devName', type: 'string' },
                            { name: 'userDevName', type: 'string' },
                            { name: 'devKind2', type: 'string' },
                            { name: 'devIp', type: 'string' },
                            { name: 'evtLevel', type: 'string' }
                        ]
                    },
                    {
                        formatData: function(data) {
                            $.extend(data, {
                                sGrpName: $('#p_grpName').val(),
                                sIp: $('#p_IPAddress').val(),
                                sDevName: $('#p_devName').val()
                            });
                            return data;
                        }
                    }
                ),
                columns:
                    [
                        { text : '그룹번호', datafield: 'grpNo', width: 80, pinned: true, hidden: true },
                        { text : '장비번호', datafield: 'itemNo', width: 80, pinned: true, hidden: true },
                        { text : '그룹명', datafield: 'grpName', minwidth : 130, pinned: true },
                        { text : '장비명', datafield: 'devName', minwidth : 150, pinned: true },
                        { text : '사용자장비명', datafield: 'userDevName', minwidth : 150, pinned: true },
                        { text: '장비IP', datafield: 'devIp', width: 120 },
                        { text: '종류', datafield: 'devKind2', width: 100 },
                        { text: '상태', datafield: 'evtLevel', width: 100, cellsrenderer: function (row, column, value, rowData) {
                            var _StrEvtLevel;

                            switch (value){
                                case 0:
                                    _StrEvtLevel = "장애";
                                    break;
                                case 1:
                                    _StrEvtLevel = "정상";
                                    break;
                                default:
                                    _StrEvtLevel = "미표기";
                                    break;
                            }
                            return "<div style='margin-top: 5px; margin-left: 5px;'><span>" + _StrEvtLevel+ "</span></div>";
                        }}
                    ]
            }, CtxMenu.NONE, ctxmenuIdx++);

            this.searchDevFind();
        },

        /** init data */
        initData : function() {
            $devListGrid.on('rowdoubleclick', function(event) {
                pMain.moveDevFind(event);
            }).on('rowclick', function(event) {
                selectedRow=event.args.row.bounddata.grpNo;
            });
        },

        searchDevFind : function () {
            HmGrid.updateBoundData($devListGrid, ctxPath + '/d3map/popup/search/getDevFindList.do');
        },

        moveDevFind : function (event) {
            opener.D3Topology.vars.curGrpNo = event.args.row.bounddata.grpNo;
            opener.D3Topology.search();

            this.boardClose();
        },

        moveContents : function () {
            if(selectedRow==0){
                selectedRow=0;
                alert("장비를 선택해주세요");
            }else{
                opener.D3Topology.vars.curGrpNo = selectedRow;
                selectedRow=0;
                opener.D3Topology.search();
                this.boardClose();
            }
        },

        boardClose : function () {
            window.close();
        }
};


$(function() {
    pMain.initVariable();
    pMain.observe();
    pMain.initDesign();
    pMain.initData();
});
