var $portGrid, $svrGrid;
var selectedPortIdx = 0;

var Main = {
    /** variable */
    initVariable: function () {
        $portGrid = $('#portGrid');
        $svrGrid = $('#svrGrid')
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnAdd_tcp':
                this.addPort();
                break;
            case 'btnEdit_tcp':
                this.editPort();
                break;
            case 'btnDel_tcp':
                this.delPort();
                break;
			case 'btnAdd_svr':
				this.addSvr();
				break;
            case 'btnDel_svr':
            	this.delSvr();
                break;

        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{
            size: 350,
            min: 150,
            collapsible: false
        }, {size: '100%'}], 'auto', '100%');


        HmWindow.create($('#pwindow'), 100, 100);

        Main.initTcpGrid();
        // Main.initSvrGrid();
    },


    /** init data */
    initData: function () {
        Main.searchPort();
    },

    searchPort: function () {
		HmGrid.updateBoundData($portGrid, '/main/sms/tcpConn/getTcpPortList.do')
    },

    searchSvr: function () {
        HmGrid.updateBoundData($svrGrid, '/main/sms/tcpConn/getTcpPortSvrList.do')
    },

	initTcpGrid: function () {
        HmGrid.create($portGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name: 'tcpPortNo', type: 'number' },
                        { name: 'portName', type: 'number' },
                        { name: 'port', type: 'string' },
                        { name: 'sortIdx', type: 'string' }
                    ]
                },
            ),
            columns:
                [
                    {text: '포트명', datafield: 'portName', minwidth:100},
                    {text: '포트번호', datafield: 'port', width:120, cellsalign: 'center'},
                    {text: '순서', datafield: 'sortIdx', width: 70, cellsalign: 'right'},
                ]
        });

        $portGrid.on('bindingcomplete', function () {
            $portGrid.jqxGrid({ selectedrowindex : 0 });
            Main.initSvrGrid()
        });

        $portGrid.on('rowclick', function (event) {
            selectedPortIdx = event.args.rowindex;
			Main.searchSvr();
        });
    },

	initSvrGrid: function () {

        HmGrid.create($svrGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: '/main/sms/tcpConn/getTcpPortSvrList.do'
                },
                {
                    formatData: function(data) {
                        var portData = HmGrid.getRowData($portGrid, selectedPortIdx);
                        if(portData) {
                            data.tcpPortNo = portData.tcpPortNo;
                        }

                        return data;
                    }
                }
            ),
            columns:
                [
                    {text: '그룹명', datafield: 'grpName', minwidth:100},
                    {text: '서버명', datafield: 'devName', width:300},
                    {text: '대표IP', datafield: 'devIp', width:200},
                    {text: '종류', datafield: 'devKind2', width:200},
                    {text: '모델', datafield: 'model', width:200},
                    {text: '제조사', datafield: 'vendor', width:200},
                ]
        });
    },

	addPort: function () {
        $.get(ctxPath + '/main/popup/sms/pTcpPortAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '포트 등록', result, 300, 180, 'pwindow_init', {});
        });
    },

    editPort: function () {
		var rowIdx = HmGrid.getRowIdx($portGrid, '포트를 선택해주세요.');
		if(rowIdx === false) return;

		var rowData = HmGrid.getRowData($portGrid, rowIdx);

        $.get(ctxPath + '/main/popup/sms/pTcpPortEdit.do', function (result) {
            HmWindow.openFit($('#pwindow'), '포트 수정', result, 300, 180, 'pwindow_init', rowData);
        });
    },

    delPort: function () {
        var rowIdx = HmGrid.getRowIdx($portGrid, '포트를 선택해주세요.');
        if(rowIdx === false) return;

        if(!confirm('해당 포트를 삭제하시겠습니까?')) return;

        var rowData = HmGrid.getRowData($portGrid, rowIdx);

        Server.post('/main/sms/tcpConn/delTcpPort.do', {
            data: rowData,
            success: function (msg) {
                alert(msg);
                Main.searchPort();
            }
        });
    },

    addSvr: function () {
        var portIdx = HmGrid.getRowIdx($portGrid, '포트를 선택해주세요.');
        if(portIdx === false) return;

        var portData = HmGrid.getRowData($portGrid, portIdx);

        $.get(ctxPath + '/main/popup/sms/pTcpPortSvrAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '서버 추가', result, 450, 477, 'pwindow_init', portData);
        });
    },

    delSvr: function () {
        var rowIdx = HmGrid.getRowIdx($svrGrid, '서버를 선택해주세요.');
        if(rowIdx === false) return;

        if(!confirm('해당 서버를 삭제하시겠습니까?')) return;

        var rowData = HmGrid.getRowData($svrGrid, rowIdx);
        var portData = HmGrid.getRowData($portGrid, selectedPortIdx);

        Server.post('/main/sms/tcpConn/delTcpPortSvr.do', {
            data: { tcpPortNo: portData.tcpPortNo, mngNo: rowData.mngNo },
            success: function (msg) {
                alert(msg);
                Main.searchSvr();
            }
        });
    },


};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});