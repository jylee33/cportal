var NwCountryConf = {

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
        this.$dataGrid = $('#nwCountry_dataGrid');
    },

    /** add event */
    observe : function() {
        $('button').bind('click', function(event) { NwCountryConf.eventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch_nwCountry': this.searchData(); break;
            case 'btnAdd_nwCountry': this.addData(); break;
            case 'btnSave_nwCountry': this.saveData(); break;
            case 'btnDel_nwCountry': this.delData(); break;
        }
    },

    /** init design */
    initDesign : function() {
        /*	Country 설정 그리드	*/
        HmGrid.create(this.$dataGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(NwCountryConf.editRowIds.indexOf(rowid) == -1)
                            NwCountryConf.editRowIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    loadComplete: function(records) {
                        NwCountryConf.editRowIds.length = 0;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '국가 목록');
            },
            selectionmode: 'multiplerowsextended',
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    { text: '국가명',	datafield: 'nameLong', width: '35%' },
                    { text: '국가명 약어', datafield: 'nameShort', width: '15%',
                        validation: function(cell, value) {
                            if(value.toString().byteLen() > 2) {
                                return { result: false, message: ' 국가명 약어는 한글1자(2byte)로 입력해주세요.' };
                            }
                            return true;
                        }
                    },
                    { text: '시작IP', datafield: 'fromIp', width: '25%', editable: false,
                        validation: HmGrid.requireIpValidation
                    },
                    { text: '끝IP', datafield: 'toIp', width: '25%', editable: false,
                        validation: HmGrid.requireIpValidation
                    }
                ]
        }, CtxMenu.COMM, 'countryData');
    },

    /** init data */
    initData: function() {
        this.searchData();
    },

    /** Country 설정 */
    searchData: function() {
        HmGrid.updateBoundData(NwCountryConf.$dataGrid, ctxPath + '/main/env/nwRelationConf/getCountryList.do');
    },

    addData: function() {
        $.post(ctxPath + '/main/popup/env/pNwCountryAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), '국가 등록', result, 450, 240);
            }
        );
    },

    delData: function() {
        var rowIdxes = HmGrid.getRowIdxes(this.$dataGrid, '국가를 선택해주세요.');
        if(rowIdxes === false) return;
        if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
        var _list = [], _uids = [];
        $.each(rowIdxes, function(idx, value) {
            var tmp = NwCountryConf.$dataGrid.jqxGrid('getrowdata', value);
            _list.push({fromIpNo: tmp.fromIpNo, toIpNo: tmp.toIpNo});
            _uids.push(tmp.uid)
        });

        Server.post('/main/env/nwRelationConf/delCountry.do', {
            data: { list: _list },
            success: function(result) {
                NwCountryConf.$dataGrid.jqxGrid('deleterow', _uids);
                alert('삭제되었습니다.');
            }
        });
    },

    saveData: function() {
        HmGrid.endRowEdit(this.$dataGrid);
        if(NwCountryConf.editRowIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(NwCountryConf.editRowIds, function(idx, value) {
            _list.push(NwCountryConf.$dataGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/nwRelationConf/saveCountry.do', {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                NwCountryConf.editRowIds.length = 0;
            }
        });
    }
};