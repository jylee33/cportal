/**
 * TODO 1. cellsrenderer 의  align속성을 column.cellsalign속성으로 적용 (송)
 * @param id
 * @param hmDataAdapter
 * @constructor
 */
var HmJqxGrid = function(id, hmDataAdapter) {
    this.id = id;
    this.grid = $('#' + id);
    this.hmDataAdapter = hmDataAdapter;
};

HmJqxGrid.prototype = function() {

    /**
     * jqxGrid common settings
     */
    var getDefOptions = function() {

        var gridDefault = parseInt($("#gGridDefault").val());

        return {
            width : "100%",
            height : "100%",
            autoheight : false,		/* loading slow */
            autorowheight: false,		/* loading slow */
            theme : jqxTheme,
            pageable : true,
            pagermode: 'simple',
            columnsresize : true,
            showstatusbar : false,
            selectionmode : "singlerow",
            enabletooltips : true,
            columnsheight: 28,
            rowsheight: 28,
            filterrowheight: 30,
            toolbarheight : 30,
            sortable : true,
            altrows: false,
//				filterable: true,  				/* loading slow */
            enablebrowserselection : true,
            showpinnedcolumnbackground: false,
            showsortcolumnbackground : false,
            pagesize : gridDefault,
            pagesizeoptions : [ "1000", "5000", "10000" ],
            localization : getLocalization('kr')
        };
    };

    /**
     * Grid 생성
     * @param options
     * @param ctxmenuType
     * @param ctxmenuIdx
     */
    var create = function(options, ctxmenuType, ctxmenuIdx) {
        options.source = this.hmDataAdapter.adapter;
        options.columns = generateColumns.call(this, options['editable']);
        var defOpts = getDefOptions();
        var _this = this;
        // 그리드 헤더텍스트 정렬을 center로.. 처리
        try {
            $.each(options.columns, function (idx, value) {
                value.align = 'center';
                value.filterdelay = 60000; // key이벤트에 대한 동작을 막기위해 delaytime 설정
            });

            // options.columns.unshift({ text: '#', datafield: '', cellsrenderer: HmGrid.rownumrenderer2, width: 50, pinned: true,
            //     align: 'center', cellsalign: 'right', columntype: 'number', sortable: false, filterable: false });

            // 컬럼관리 설정 적용 (data-cfgpage)
            var iscfgpage = _this.grid.data('cfgpage') == undefined? true : _this.grid.data('cfgpage');
            if(iscfgpage && window.GlobalEnv !== undefined) {
                HmGrid.applyCfgpage(_this.grid, options.columns);
            }
        } catch (e) {}

        $.extend(defOpts, options);
        this.grid.jqxGrid(defOpts);

        setCtxMenu.call(this, ctxmenuType, ctxmenuIdx);
        return this;
    };

    /**
     * ContextMenu 생성
     * @param ctxmenuType
     * @param ctxmenuIdx
     */
    var setCtxMenu = function(ctxmenuType, ctxmenuIdx) {
        if(typeof ctxmenuType === 'undefined') ctxmenuType = CtxMenu.COMM;
        if(typeof ctxmenuIdx === 'undefined') ctxmenuIdx = '';

        CtxMenu.create(this.grid, ctxmenuType, ctxmenuIdx);
    };

    var fnFormatData = function(data) {
        return data;
    };

    /**
     * 타이틀(Toolbar) 표시
     * @param title
     * @param elemId
     */
    var showToolbar = function(title, elemId) {
        this.grid.jqxGrid({
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, title);
                toolbar.css('visibility', 'visible');
            }
        });
    };

    /**
     * call adapter.dataBind
     */
    var dataBind = function() {
        this.grid.jqxGrid('source').dataBind();
    };

    /**
     * set source.url
     * @param url
     */
    var setReqUrl = function(url) {
        var adapter = this.grid.jqxGrid('source');
        if(adapter !== undefined) {
            adapter._source.url = url;
        }
    };

    /**
     * call grid.updatebounddata
     */
    var updateBoundData = function() {
        try {
            var adapter = this.grid.jqxGrid('source');
            if (adapter !== undefined) {
                if (this.grid.jqxGrid('filterable')) {
                    this.grid.jqxGrid('updatebounddata', 'filter');
                }
                else if (this.grid.jqxGrid('groupable')) {
                    this.grid.jqxGrid('updatebounddata', 'data');
                }
                else {
                    this.grid.jqxGrid('updatebounddata');
                }

                // 상태바 표시상태일때 높이조절
                if (this.grid.jqxGrid("showstatusbar")) {
                    var gridId = this.id;
                    setTimeout(function () {
                        HmGrid.setStatusbarHeight(gridId);
                    }, 500);
                }
            }
        } catch(e) {
            console.log('HmJqxGrid.updateBoundData', e);
        }
    };

    /**
     * localdata사용시 데이터 갱신
     * @param data
     */
    var updateLocalData = function(data) {

        this.grid.jqxGrid('source')._source.localdata = data;
        this.grid.jqxGrid('updatebounddata');

    };

    /**
     * 편집중인 컬럼이나 행이 있으면 편집종료
     */
    var endEditMode = function() {
        var _editmode = this.grid.jqxGrid('editmode');
        var rowIdx = this.grid.jqxGrid('getselectedrowindex');
        if(_editmode == 'selectedcell') {
            this.grid.jqxGrid('endcelledit', rowIdx, null, false);
        }
        else {
            this.grid.jqxGrid('endrowedit', rowIdx, false);
        }
    };

    /**
     * editable=true일때, 변경된 rowId 목록을 리턴한다.

    var getEditRowIds = function() {
        endEditMode.call(this);
        return this.hmDataAdapter.getEditRowIds();
    }
     */
    var getEditRows = function() {

        endEditMode.call(this);
        var _rowIds = this.hmDataAdapter.getEditRowIds();
        if(_rowIds.length == 0) return [];
        var _list = [], _grid = this.grid;
        $.each(_rowIds, function(i, v) {
            console.log(parent);
            _list.push(_grid.jqxGrid('getrowdatabyid', v));
        });
        return _list;
    };

    /**
     * editRowIds 목록 제거
     */
    var clearEditRowIds = function() {
        this.hmDataAdapter.clearEditRowIds();
    };

    /**
     * Grouping 활성/비활성
     * //TODO export시 문제...
     * @param bool
     */
    var setGroupable = function(bool) {
        this.grid.jqxGrid('groupable', bool);
    };

    /**
     * Export
     * @param filename
     */
    var download = function(filename) {
        if(typeof filename === 'undefined') {
            filename = 'Grid';
        }
        HmUtil.exportGrid(this.grid, filename + '_' + $.format.date(new Date(), 'yyyyMMddHHmmssSSS'), false);
    };

    // TODO special characters(umlaut) .. 문제 있는듯...
    var print = function() {

        var content = this.grid.jqxGrid('exportdata', 'html');
        var newWindow = window.open('', '', 'width=1000,height=600');
        var doc = newWindow.document.open();
        var pageContent =
            '<!DOCTYPE html>\n' +
            '<html>\n' +
            '<head>\n' +
            '<meta charset="utf-8" />\n' +
            '<title>Print</title>\n' +
            '</head>\n' +
            '<body>\n' + content + '\n</body>\n</html>';
        doc.write(pageContent);
        doc.close();
        newWindow.print();
    };

    var generateColumns = function(editable) {
        var datafields = this.hmDataAdapter.adapter.datafields;
        var columns = [];
        $.each(datafields, function(i, v) {
            if(v.hasOwnProperty('text')) {
                var newCol = {
                    text: v.text,
                    datafield: v.name,
                    width: v.width || 100,
                    hidden: v.hidden || false,
                    editable: v.hasOwnProperty('editable')? v.editable : editable
                };

                for(var key in v) {
                    if($.inArray(key, ['name', 'type', 'text', 'editable']) === -1) {
                        newCol[key] = v[key];
                        if(key.toLowerCase() == 'minwidth') {
                            delete newCol['width'];
                        }
                    }
                }

                // grid.editable==true이고 column.editable==true인 경우 header column의 폰트컬러를 blue로 표시한다.
                if(newCol.editable) {
                    newCol.rendered = function(header) {
                        header.css('color', 'blue');
                    }
                }
                columns.push(newCol);
            }
        });
        console.log(columns);
        return columns;
    };

    function destroy() {
        this.grid.jqxGrid('destroy');
    }


    return {
        create: create,
        showToolbar: showToolbar,
        dataBind: dataBind,
        setReqUrl: setReqUrl,
        updateBoundData: updateBoundData,
        updateLocalData: updateLocalData,
        getEditRows: getEditRows,
        setGroupable: setGroupable,
        download: download,
        print: print,
        generateColumns: generateColumns,
        clearEditRowIds: clearEditRowIds,
        destroy: destroy
    }

}();