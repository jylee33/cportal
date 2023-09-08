var $sysoidGrid, $unRegSysoidGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $sysoidGrid = $('#sysoidGrid');
        $unRegSysoidGrid = $('#unRegSysoidGrid');
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
            case 'btnAdd':
                this.add();
                break;
            case 'btnEdit':
                this.edit();
                break;
            case 'btnDel':
                this.del();
                break;
            case 'btnSearch':
                this.search();
                break;
            case 'btnSet':
                this.setCode();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 254, collapsible: true }, { size: '100%' }], 'auto', '100%');
        HmWindow.create($('#pwindow'), 100, 100);


        HmGrid.create($unRegSysoidGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'sysoid', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'vendor', type: 'string'},
                        {name: 'model', type: 'string'}
                    ]
                }
            ),
            editable: false,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '미등록 Sysoid');
            },
            columns:
                [
                    {text: 'SYS OID', datafield: 'sysoid', width: 300},
                    {text: '사용자장비명', datafield: 'devName', width: 300},
                    {text: '장비IP', datafield: 'devIp', width: 200},
                    {text: '제조사', datafield: 'vendor', width: 200, filtertype: 'checkedlist'},
                    {text: '모델', datafield: 'model', minwidth: 300, filtertype: 'checkedlist'}
                ]
        }, CtxMenu.COMM);
        $unRegSysoidGrid.on('rowclick', function(event) {
            var args = event.args;
            var rowBoundIndex = args.rowindex;
            var selIdx = $unRegSysoidGrid.jqxGrid('getselectedrowindex');

            if(rowBoundIndex == selIdx){
                $unRegSysoidGrid.jqxGrid('clearselection');
            setTimeout(function () { $unRegSysoidGrid.jqxGrid('unselectrow', rowBoundIndex); }, 100);
            }
        });

        HmGrid.create($sysoidGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'sysoid', type: 'string'},
                        {name: 'devKind', type: 'string'},
                        {name: 'vendor', type: 'string'},
                        {name: 'tmplNo', type: 'number'},
                        {name: 'model', type: 'string'},
                        {name: 'tmplNm', type: 'string'}
                    ]
                }
            ),
            editable: false,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, 'Sysoid');
            },
            columns:
                [
                    {text: 'SYSOID', datafield: 'sysoid', width: 300},
                    {text: '장비종류', datafield: 'devKind', width: 200, filtertype:'checkedlist'},
                    {text: '제조사', datafield: 'vendor', width: 200, filtertype: 'checkedlist'},
                    {text: '모델', datafield: 'model', minwidth: 300, filtertype: 'checkedlist'},
                    {text: '템플릿', datafield: 'tmplNo', displayfield: 'tmplNm', width: 200}
                ]
        }, CtxMenu.COMM);

    },


    /** init data */
    initData: function () {
        Main.search();
    },
    search: function() {
        HmGrid.updateBoundData($unRegSysoidGrid, ctxPath + '/main/com/sysoidMgmt/getUnRegSysoidList.do');
        HmGrid.updateBoundData($sysoidGrid, ctxPath + '/main/com/sysoidMgmt/getSysoidList.do');
    },

	add: function() {

        var params = {};
        if ($unRegSysoidGrid.jqxGrid('getselectedrowindex') > -1) {
            var rowIdx = HmGrid.getRowIdx($unRegSysoidGrid);
            if(rowIdx === false) return;
            var rowdata = $unRegSysoidGrid.jqxGrid('getrowdata', rowIdx);
            params = {sysoid: rowdata.sysoid}
        }
			$.post(ctxPath + '/main/popup/env/pSysoidAdd.do',
					function(result) {
						HmWindow.openFit($('#pwindow'), 'SYSOID 추가', result, 350, 241, 'pwindow_init', params);
					}
			);
		},

		edit: function() {

			var rowIdx = HmGrid.getRowIdx($sysoidGrid, 'SYSOID를 선택해주세요.');

			if(rowIdx === false) return;
			var rowdata = $sysoidGrid.jqxGrid('getrowdata', rowIdx);
			$.post(ctxPath + '/main/popup/env/pSysoidEdit.do',
                function(result) {
                    HmWindow.openFit($('#pwindow'), 'SYSOID 수정', result, 350, 241, 'pwindow_init', rowdata);
                }
			);
		},

		del: function() {
			var rowIdx = HmGrid.getRowIdx($sysoidGrid, 'SYSOID를 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $sysoidGrid.jqxGrid('getrowdata', rowIdx);
			if(!confirm('[' + rowdata.sysoid + '] 를 삭제하시겠습니까?')) return;
			Server.post('/main/com/sysoidMgmt/delSysoid.do', {
				data: { sysoid: rowdata.sysoid },
				success: function(result) {
					$sysoidGrid.jqxGrid('deleterow', rowdata.uid);
                    HmGrid.updateBoundData($unRegSysoidGrid, ctxPath + '/main/com/sysoidMgmt/getUnRegSysoidList.do');
					alert(result);
				}
			});
		},

        setCode: function(){
            $.post(ctxPath + '/main/popup/com/pSysoidCodeSetting.do',
                function (result) {
                    HmWindow.open($('#pwindow'), '코드 관리', result, 400, 400, 'pwindow_init');
                }
            );
        },

};



$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});