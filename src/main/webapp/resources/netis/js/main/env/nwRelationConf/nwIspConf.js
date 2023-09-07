var NwIspConf = {
    $dataGrid: null,
    editRowIds: [],

    /** variable */
    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    initVariable: function() {
        this.$dataGrid = $('#nwIsp_dataGrid');
    },

    /** add event */
    observe : function() {
        $('button').bind('click', function(event) { NwIspConf.eventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch_nwIsp': this.searchData(); break;
            case 'btnAdd_nwIsp': this.addData(); break;
            case 'btnSave_nwIsp': this.saveData(); break;
            case 'btnDel_nwIsp': this.delData(); break;
        }
    },

    /** init design */
    initDesign : function() {
        /*	ISP 설정 그리드	*/
        HmGrid.create(this.$dataGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(NwIspConf.editRowIds.indexOf(rowid) == -1)
                            NwIspConf.editRowIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    loadComplete: function(records) {
                        NwIspConf.editRowIds.length = 0;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, 'ISP 목록');
            },
            selectionmode: 'multiplerowsextended',
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    { text: 'ISP NO', datafield: 'ispNo', width: 100, cellsalign: 'right' },
                    { text: 'ISP명', datafield: 'ispName' },
                    { text: '시작IP', datafield: 'fromIp', width: '25%',
                        validation: HmGrid.requireIpValidation
                    },
                    { text: '끝IP', datafield: 'toIp', width: '25%',
                        validation: HmGrid.requireIpValidation
                    }
                ]
        }, CtxMenu.COMM, 'ispData');
    },

    /** init data */
    initData: function() {
        this.searchData();
    },

    /** ISP 설정 */
    searchData: function() {
        HmGrid.updateBoundData(NwIspConf.$dataGrid, ctxPath + '/main/env/nwRelationConf/getIspList.do');
    },

    addData: function() {
        $.post(ctxPath + '/main/popup/env/pNwIspAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), 'ISP 등록', result, 440, 220);
            }
        );
    },

    delData: function() {
        var rowIdxes = HmGrid.getRowIdxes(this.$dataGrid, 'ISP를 선택해주세요.');
        if(rowIdxes === false) return;
        if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
        var _ispNos = [], _uids = [];
        $.each(rowIdxes, function(idx, value) {
            var tmp = NwIspConf.$dataGrid.jqxGrid('getrowdata', value);
            _ispNos.push(tmp.ispNo);
            _uids.push(tmp.uid)
        });

        Server.post('/main/env/nwRelationConf/delIsp.do', {
            data: { ispNos: _ispNos },
            success: function(result) {
                NwIspConf.$dataGrid.jqxGrid('deleterow', _uids);
                alert('삭제되었습니다.');
            }
        });
    },

    saveData: function() {
        HmGrid.endRowEdit(this.$dataGrid);
        if(NwIspConf.editRowIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(NwIspConf.editRowIds, function(idx, value) {
            _list.push(NwIspConf.$dataGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/nwRelationConf/saveIsp.do', {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                NwIspConf.editRowIds.length = 0;
            }
        });
    }
};