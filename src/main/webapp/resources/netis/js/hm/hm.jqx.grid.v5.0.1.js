var nextWeek = [];
var HmGrid = {


    //  2022-07-04 이근호
    // columnType: custom 의 createWidget일 경우에 사용
    // initWidget 함수도 정의 필요

    createCheckBox: function (row, column, value, cellElement) {

        var chbId = this.owner.element.id + "_Chb_";
        var gridId = this.owner.element.id;

        var buttonDiv = $("<label  style='margin-top: 7px ' class='chkSlider' for='" + chbId + row.boundindex + "'>"
            + "<input type='checkbox' id='" + chbId + row.boundindex + "'/>"
            + "<div class='chkSliderBg round'></div>" + "</label>");

        // console.log($(cellElement));

        $(cellElement).append(buttonDiv);
        $(cellElement).addClass('jqx-center-align');

        $("#" + chbId + row.boundindex).on('click', function (event) {
            $("#" + gridId).jqxGrid('setcellvalue', row.boundindex, column, event.originalEvent.target.checked ? 1 : 0);
        });

        if (value == 1) {
            $("#" + chbId + row.boundindex).prop('checked', true);
        } else {
            $("#" + chbId + row.boundindex).prop('checked', false);
        }

    },


    changeTitleColor : function(header){
        header.css('color', '#0000FF');
    },


    fmsKindRenderer: function (row, column, value, defaultHTML) {
        var _gridId = this.owner.element.id;
        var fmsKind = $('#' + _gridId).jqxGrid('getcellvalue', row, column);
        var fmsImage = 'defaultIcon.svg';

        switch (fmsKind) {
            case 'UPS':
                fmsImage = 'ups.svg';
                break;
            case 'HVAC':
                fmsImage = 'hvac.svg';
                break;
            case 'TE/HU':
                fmsImage = 'tehu.svg';
                break;
            case 'RACK':
                fmsImage = 'rack.svg';
                break;
            case 'FIRE':
                fmsImage = 'fire.svg';
                break;
            case 'LEAK':
                fmsImage = 'leak.svg';
                break;
            case 'DOOR':
                fmsImage = 'door.svg';
                break;
            case 'GAS':
                fmsImage = 'gas.svg';
                break;
            case 'GEN':
                fmsImage = 'gen.svg';
                break;
            case 'IVT':
                fmsImage = 'ivt.svg';
                break;
            case 'PDU':
                fmsImage = 'pdu.svg';
                break;
            case 'PM':
                fmsImage = 'pm.svg';
                break;
            case 'RECT':
                fmsImage = 'rect.svg';
                break;
            case 'STS':
                fmsImage = 'sts.svg';
                break;
            case 'SOBANG':
                fmsImage = 'sobang.svg';
                break;
            case 'BMS':
                fmsImage = 'bms.svg';
                break;
        }

        if (value == null) return;
        var _viewText = value;
        var _class = '';
        var div = '';

        if (value == '') { //kind값이 없는 경우 미설정 문구
            _class = 'lockoutAccount';
            _viewText = '미설정'
            div = $('<div></div>', {
                class: 'jqx-center-align userConfCell userConf {0}'.substitute(_class),
                text: _viewText
            });
        } else {
            div = $('<div></div>', {
                style: 'margin: 6px 2px 0 5px',
                class: 'jqx-left-align'
            });

            //이미지 아이콘 붙이는 기준은 설비일 경우만. 센서의 경우는 아이콘 미적용
            //현재 아이콘 자체가 설비기준으로만 작업 되어있음. 센서는 적용 여부 미확인
            if (column == 'facilityKind') {
                div.append($('<img />', {
                    src: '/img/' + fmsImage,
                    style: 'width: 20px; height: 20px;',
                    onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
                }));
            }

            div.append($('<span></span>', {
                text: _viewText,
                style: 'padding-left: 5px;'
            }));

        }


        return div[0].outerHTML;
    },
    /** get jqxGrid default options */
    getDefaultOptions: function ($grid) {

        var gridDefault = parseInt($("#gGridDefault").val() ?? 10);

        return {
            width: "100%",
            height: "100%",
            autoheight: false, /* loading slow */
            autorowheight: false, /* loading slow */
            theme: jqxTheme,
            pageable: true,
            pagermode: 'simple',
            columnsresize: true,
            showstatusbar: false,
            selectionmode: "singlerow",
            enabletooltips: true,
            columnsheight: 28,
            rowsheight: 28,
            filterrowheight: 30,
            toolbarheight: 30,
            sortable: true,
            altrows: false,
//				filterable: true,  				/* loading slow */
            enablebrowserselection: true,
            showpinnedcolumnbackground: false,
            showsortcolumnbackground: false,
            pagerheight: 27,    // pagerbar height
            pagerrenderer: HmGrid.pagerrenderer,
            pagesize: gridDefault,
            pagesizeoptions: ["1000", "5000", "10000"],
            localization: getLocalization('kr')
        };
    },

    /** custom pager
     * 2020.03.30
     *    작업중 by jjung
     **/
    pagerrenderer: function () {

        var _grid = $('#' + this.element.id);
        var element = $("<div style='margin-left: 10px; margin-top: 3px; width: 100%; height: 100%;'></div>");
        var datainfo = _grid.jqxGrid('getdatainformation');
        var paginginfo = datainfo.paginginformation;

        var firstButton = $("<div style='padding: 0px; float: left;'><div style=' width: 20px; height: 20px;'></div></div>");
        firstButton.find('div').addClass('jqx-icon-arrow-first');
        firstButton.jqxButton({theme: jqxTheme});

        var leftButton = $("<div style='padding: 0px; margin: 0px 3px; float: left;'><div style=' width: 20px; height: 20px;margin-left:-1px;'></div></div>");
        leftButton.find('div').addClass('jqx-icon-arrow-left');
        leftButton.jqxButton({theme: jqxTheme});

        var rightButton = $("<div style='padding: 0px; margin: 0px 3px; float: left;'><div style='width: 20px; height: 20px;margin-right:-1px'></div></div>");
        rightButton.find('div').addClass('jqx-icon-arrow-right');
        rightButton.jqxButton({theme: jqxTheme});

        var lastButton = $("<div style='padding: 0px; float: left;'><div style='width: 20px; height: 20px;'></div></div>");
        lastButton.find('div').addClass('jqx-icon-arrow-last');
        lastButton.jqxButton({theme: jqxTheme});

        var pagernumber = $("<div style='margin-top: -1px; float: left' class='jqx-grid-pager-number-box'></div>");
        var sPageNo = Math.floor(paginginfo.pagenum / 5) * 5,
            ePageNo = Math.floor(Math.min(sPageNo + 5, paginginfo.pagescount));

        for (var i = sPageNo + 1; i <= ePageNo; i++) {

            var no = $("<a></a>", {
                text: i,
                class: 'jqx-grid-pager-number jqx-grid-pager-number-' + jqxTheme,
                tabindex: -1,
                href: "javascript:;",
                'data-page': i,
                style: 'padding: 2px 6px; border-radius: 10px'
            });

            //if(i == sPageNo+1) {

            if (i == (paginginfo.pagenum + 1)) {
                no.addClass('jqx-fill-state-pressed-ui-hamon');
            }
            no.appendTo(pagernumber);
        }

        firstButton.appendTo(element);
        leftButton.appendTo(element);
        pagernumber.appendTo(element);
        rightButton.appendTo(element);
        lastButton.appendTo(element);

        // display (server paging)
        //var addedLabel = _grid.jqxGrid('virtualMode') ? '   (Server Paging)' : '';
        var addedLabel = '';
        var label = $("<div style='margin-left: 20px; margin-top: -1px; font-weight: normal; float: left;' class='jqx-grid-pager-label'></div>");
        label.text("1-" + Math.min(paginginfo.pagesize, datainfo.rowscount) + ' of ' + datainfo.rowscount + addedLabel);
        label.appendTo(element);

        var customBtnBox = $("<div style='position: absolute; right: 0; margin-right: 10px'></div>");
        customBtnBox.appendTo(element);

        var filterButton = $("<div style='padding: 0; float: left;'><div style='width:13px;margin: 0px 4px; height: 20px; text-indent: 12px; line-height: 20px; background-position: left;'></div></div>");//필터
        filterButton.find('div').addClass('jqx-icon-search');
        filterButton.jqxButton({theme: jqxTheme});
        filterButton.appendTo(customBtnBox);
        var cancelButton = $("<div style='width:21px;padding: 0; margin-left: 3px; float: left;'><div style='margin: 0px 4px; height: 20px; text-indent: 14px; line" +
            "-height: 20px; background-position: center;'></div></div>");
        cancelButton.find('div').addClass('jqx-icon-clear');
        cancelButton.jqxButton({theme: jqxTheme});
        cancelButton.appendTo(customBtnBox);

        var pagerno = pagernumber.find('a.jqx-grid-pager-number');

        if (pagerno) {
            pagerno.off('click').on('click', function (event) {
                var target = $(event.currentTarget);
                var pageno = target.attr('data-page');
                _grid.jqxGrid('gotopage', pageno - 1);
            })
        }

        // update buttons states.
        // var handleStates = function (event, button, className, add) {
        // 	button.on(event, function () {
        // 		if (add == true) {
        // 			button.find('div').addClass(className);
        // 		}
        // 		else button.find('div').removeClass(className);
        // 	});
        // }
        // if (jqxTheme != '') {
        // 	handleStates('mousedown', rightButton, 'jqx-icon-arrow-right-selected-' + jqxTheme, true);
        // 	handleStates('mouseup', rightButton, 'jqx-icon-arrow-right-selected-' + jqxTheme, false);
        // 	handleStates('mousedown', leftButton, 'jqx-icon-arrow-left-selected-' + jqxTheme, true);
        // 	handleStates('mouseup', leftButton, 'jqx-icon-arrow-left-selected-' + jqxTheme, false);
        //
        // 	handleStates('mouseenter', rightButton, 'jqx-icon-arrow-right-hover-' + jqxTheme, true);
        // 	handleStates('mouseleave', rightButton, 'jqx-icon-arrow-right-hover-' + jqxTheme, false);
        // 	handleStates('mouseenter', leftButton, 'jqx-icon-arrow-left-hover-' + jqxTheme, true);
        // 	handleStates('mouseleave', leftButton, 'jqx-icon-arrow-left-hover-' + jqxTheme, false);
        // }

        firstButton.off('click').on('click', function () {
            _grid.jqxGrid('gotopage', 0);
        });
        rightButton.off('click').on('click', function () {
            _grid.jqxGrid('gotonextpage');
        });

        leftButton.off('click').on('click', function () {
            _grid.jqxGrid('gotoprevpage');
        });
        lastButton.off('click').on('click', function () {
            _grid.jqxGrid('gotopage', paginginfo.pagescount - 1);
        });


        filterButton.off('click').on('click', function () {
            HmGrid.toggleFilterrow(_grid);
        });
        cancelButton.off('click').on('click', function (event) {
            /*if(_grid.jqxGrid('filterable') === false) return;

            var _isfilterrow = _grid.jqxGrid('showfilterrow');
            if(_isfilterrow === false) {
                _grid.jqxGrid({showfilterrow: true, filterrowheight: 0});
                setTimeout(function() {
                    _grid.jqxGrid('clearfilters');
                    _grid.jqxGrid({showfilterrow: false, filterrowheight: 30});
                }, 100);
            }
            else {
                _grid.jqxGrid('clearfilters');
            }
            */
            try {
                _grid.jqxGrid('clearfilters');
                //setTimeout(function() {
                //	_grid.jqxGrid('applyfilters');
                //}, 300);
            } catch (e) {
                console.log(e);
            }
        });

        /**
         * virtualMode: true 일때는 pagechanged 이벤트 처리가 불필요.. pagerrenderer를 호출함.
         * 2020.07.01    by jjung
         */
        if (!_grid.jqxGrid('virtualMode')) {
            _grid.off('pagechanged').on('pagechanged', function (event) {
                //console.log('pagechange', event.currentTarget);
                HmGrid.pagechanged.call(_grid);
            });
            _grid.off('filter').on('filter', function (event) {
                //console.log('filter', event);
                var filterInfor = $(this).jqxGrid('getfilterinformation');
                //console.log('filterInfor', filterInfor);
                HmGrid.pagechanged.call(_grid);
            });
        }

        //console.log('element', element);
        return element;
    },

    pagechanged: function () {
        var _grid = $(this);
        var datainfo = $(this).jqxGrid('getdatainformation');
        var paginginfo = datainfo.paginginformation;
        var pagernumber = $(this).find('div.jqx-grid-pager-number-box');
        pagernumber.empty();
        var sPageNo = Math.floor(paginginfo.pagenum / 5) * 5,
            ePageNo = Math.floor(Math.min(sPageNo + 5, paginginfo.pagescount));
        for (var i = sPageNo + 1; i <= ePageNo; i++) {
            var no = $("<a></a>", {
                text: i,
                class: 'jqx-grid-pager-number jqx-grid-pager-number-' + jqxTheme,
                tabindex: -1,
                href: "javascript:;",
                'data-page': i,
                style: 'padding: 2px 6px; border-radius: 10px'
            });
            if (i == (paginginfo.pagenum + 1)) {
                no.addClass('jqx-fill-state-pressed-ui-hamon');
            }
            no.appendTo(pagernumber);
        }

        var pagerno = pagernumber.find('a.jqx-grid-pager-number');
        if (pagerno) {
            pagerno.off('click').on('click', function (event) {
                var target = $(event.currentTarget);
                var pageno = target.attr('data-page');
                _grid.jqxGrid('gotopage', pageno - 1);
            }).off('mouseenter').on('mouseenter', function (event) {
                var target = $(event.currentTarget);
                target.addClass('jqx-fill-state-hover-ui-hamon');
            }).off('mouseleave').on('mouseleave', function (event) {
                var target = $(event.currentTarget);
                target.removeClass('jqx-fill-state-hover-ui-hamon');
            });
        }

        $(this).find('.jqx-grid-pager-label').text(1 + paginginfo.pagenum * paginginfo.pagesize + '-' + Math.min(datainfo.rowscount, (paginginfo.pagenum + 1) * paginginfo.pagesize) + ' of ' + datainfo.rowscount);
        console.log($(this).find('.jqx-grid-pager-label').text());
    },

    /** create jqxGrid */
    create: function ($grid, options, ctxmenuType, ctxmenuIdx) {
        var defOpts = this.getDefaultOptions($grid);
        // 그리드 헤더텍스트 정렬을 center로.. 처리
        try {
            var _filterdelay = options.hasOwnProperty('pagerrenderer') ? 24 * 60 * 60 * 1000 : 60 * 1000;
            $.each(options.columns, function (idx, value) {
                value.align = 'center';
                value.filterdelay = _filterdelay; // key이벤트에 대한 동작을 막기위해 delaytime 설정

                //회선별칭의 경우 렌더러 적용
                if (value.datafield == 'ifAlias') {
                    value.cellsrenderer = HmGrid.ifAliasrenderer;
                }
            });
        } catch (e) {
        }
        // 컬럼관리 설정 적용 (data-cfgpage)
        var iscfgpage = $grid.data('cfgpage') == undefined ? true : $grid.data('cfgpage');
        if (iscfgpage && window.GlobalEnv !== undefined) {
            this.applyCfgpage($grid, options.columns);
        }
        $.extend(defOpts, options);
        $grid.jqxGrid(defOpts);
        if (ctxmenuType === undefined) ctxmenuType = CtxMenu.COMM;
        if (ctxmenuIdx === undefined) ctxmenuIdx = '';
        CtxMenu.create($grid, ctxmenuType, ctxmenuIdx);
    },

    applyCfgpage: function ($grid, columns) {
        if (columns === undefined) return;
        var _gridId = $grid.attr('id');
        var _cfgList = null;
        if (GlobalEnv.cfgpage) {
            $.each(GlobalEnv.cfgpage, function (i, v) {
                if (v.gridId == _gridId) {
                    _cfgList = v.cfgList;
                }
            });
        }
        if (_cfgList != null && _cfgList.length) {
            $.each(_cfgList, function (i, v) {
                var _isExist = false;
                for (var k = 0; k < columns.length; k++) {
                    if (columns[k].datafield == v.colDatafield) {
                        $.extend(columns[k], {
                            text: v.colText || columns[k].text,
                            orgText: columns[k].text,
                            colText: v.colText,
                            colSortIdx: v.colSortIdx,
                            hidden: v.colDispFlag == 0
                        });
                        _isExist = true;
                        break;
                    }
                }
            });
        }
        columns.sort(function (a, b) {
            if (!a.hasOwnProperty('colSortIdx')) {
                a.colSortIdx = 999;
            }
            if (!b.hasOwnProperty('colSortIdx')) {
                b.colSortIdx = 999;
            }
            return a.colSortIdx - b.colSortIdx;
        });
    },

    /** data refresh */
    updateBoundData: function ($grid, reqUrl) {

        var adapter = $grid.jqxGrid("source");

        if (adapter !== undefined) {

            if ($grid.jqxGrid('getselectedrowindex') > -1 && $grid.jqxGrid('columns').records !== undefined) {
                $grid.jqxGrid('clearselection');
            }

            if (adapter._source.url == null || adapter._source.url == "")
                adapter._source.url = reqUrl;

            if ($grid.jqxGrid('filterable')) {
                $grid.jqxGrid("updatebounddata", "filter");
            } else if ($grid.jqxGrid('groupable')) {
                $grid.jqxGrid("updatebounddata", "data");
            } else {
                $grid.jqxGrid("updatebounddata");
            }

            // 상태바 표시상태일때 높이조절
            if ($grid.jqxGrid("showstatusbar") == true) {
                var gridId = $grid.attr("id");
                setTimeout('HmGrid.setStatusbarHeight("' + gridId + '")', 500);
            }
        }
    },

    setLocalData: function ($grid, data) {
        $grid.jqxGrid('source')._source.localdata = data;
        $grid.jqxGrid('updateBoundData');
    },

    /** 그리드 statusbar에 합계표현할때 height값이 맞지않아 틀어지는 현상 보완 */
    setStatusbarHeight: function (gridId) {
        $("#statusbar" + gridId).children().css("height", ($("#statusbar" + gridId).height() - 2));
    },


    /** 선택된 rowindex를 리턴 */
    getRowIdx: function ($grid, msg) {
        var rowIdx = $grid.jqxGrid('getselectedrowindex');
        if (rowIdx === undefined || rowIdx === null || rowIdx == -1) {
            if (msg !== undefined) alert(msg);
            return false;
        }
        return rowIdx;
    },

    /** 선택된 rowindexes를 리턴 */
    getRowIdxes: function ($grid, msg) {
        if ($grid.jqxGrid('getboundrows').length == 0) {
            if (msg !== undefined) alert(msg);
            return false;
        }
        var rowIdxes = $grid.jqxGrid('getselectedrowindexes');
        if (rowIdxes === undefined || rowIdxes === null || rowIdxes.length == 0) {
            if (msg !== undefined) alert(msg);
            return false;
        }
        return rowIdxes;
    },


    setColumnValue : function ($grid, rowIndex, columnDataField, newValue) {
        $grid.jqxGrid('setcellvalue', rowIndex, columnDataField, newValue);
    },

    /** 선택된 row의 data를 리턴 */
    getRowData: function ($grid, rowIdx) {
        if (rowIdx === undefined) {
            rowIdx = $grid.jqxGrid('getselectedrowindex');
            if (rowIdx == -1) return null;
        }

        return $grid.jqxGrid('getrowdata', rowIdx);
    },

    /** 선택된 rows의 data를 리턴 */
    getRowDataList: function ($grid, rowIdxes) {
        if (rowIdxes === undefined) {
            rowIdxes = $grid.jqxGrid('getselectedrowindexes');
            if (rowIdxes == null || rowIdxes.length == 0) return null;
        }

        var list = [];
        $.each(rowIdxes, function (idx, rowIdx) {
            list.push($grid.jqxGrid('getrowdata', rowIdx));
        });
        return list;
    },

    /** 선택된 row의 editing을 종료 */
    endRowEdit: function ($grid) {
        var rowIdx = HmGrid.getRowIdx($grid);
        if (rowIdx !== false) {
            $grid.jqxGrid('endrowedit', rowIdx, false);
        }
    },

    /** 선택된 cell의 editing을 종료 (selectionmode = singlecell일때) */
    endCellEdit: function ($grid) {
        var rowIdx = HmGrid.getRowIdx($grid);
        if (rowIdx === false) return;
        // var cell = $grid.jqxGrid('getselectedcell');
        // if (cell === false) return;

        var chlidrens = $grid.children();
        if (chlidrens && chlidrens.length) {
            var elValidation = chlidrens.find('div.jqx-grid-validation');
            if (elValidation.length && $(elValidation[0]).css('display') == 'block') {
                return false;
            }
        }
        $grid.jqxGrid('endrowedit', rowIdx, false);
    },

    toggleFilterrow: function (grid, isfilterrow) {
        try {
            grid.jqxGrid('beginupdate');
            if (grid.jqxGrid('filterable') === false) {
                grid.jqxGrid({filterable: true});
            }
            var _flag = isfilterrow == null ? !grid.jqxGrid('showfilterrow') : isfilterrow;
            //if(!_flag) {
            //	grid.jqxGrid('clearfilters');
            //}
            setTimeout(function () {
                grid.jqxGrid({showfilterrow: _flag});

                if (_flag) {
                    setTimeout(function () {
                        if (grid.jqxGrid('getfilterinformation').length == 0) {
                            grid.jqxGrid('clearfilters');
                        }
                    }, 100);
                }
            }, 300);
            grid.jqxGrid('endupdate');
        } catch (e) {
        }
    },

    /** ImageRenderer **/
    img16renderer: function (row, datafield, value) {
        return '<img width="16" height="16" style="display: block; margin: auto; margin-top: 5px;" src="' + value + '"/>';
    },

    img128renderer: function (row, datafield, value) {
        return '<img height="128" width="128" style="display: block; margin: auto; margin-top: 5px;" src="' + value + '"/>';
    },

    img200renderer: function (row, datafield, value) {
        return '<img height="200" width="200" style="display: block; margin: auto; margin-top: 5px;" src="' + value + '"/>';
    },

    /** commaNum */
    commaNumrenderer: function (row, column, value) {
        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += HmUtil.commaNum(value);
        cell += '</div>';
        return cell;
    },

    /**
     * 장비/서버 공통 상세팝업 호출
     * @param devKind1
     * @param row
     * @param gridId
     * @param type
     */
    commonDetailPopup: function (devKind1, row, gridId, type) {
        if (devKind1 === 'DEV') {
            CtxMenu.itemClick('cm_dev_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'SVR') {
            CtxMenu.itemClick('cm_svr_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'IF') {
            CtxMenu.itemClick('cm_if_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'APC') {
            CtxMenu.itemClick('cm_apc_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'AP') {
            CtxMenu.itemClick('cm_ap_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'AP_CLIENT_MAC') {
            CtxMenu.itemClick('cm_ap_clientDetail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'WAS') {
            CtxMenu.itemClick('cm_was_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'DBMS') {
            CtxMenu.itemClick('cm_dbms_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'VSVR') {
            CtxMenu.itemClick('cm_vsvr_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'VM') {
            CtxMenu.itemClick('cm_vm_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'NUTANIX_VSVR') {
            CtxMenu.itemClick('cm_vsvr_nutanix_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'NUTANIX_VM') {
            CtxMenu.itemClick('cm_vm_nutanix_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'NAMESPACE_NO') {
            CtxMenu.itemClick('kub_namespace_detail', $('#' + gridId), 'grid');
        } else if (devKind1 === 'POD_NO') {
            CtxMenu.itemClick('kub_pod_detail', $('#' + gridId), 'grid');
        }
    },

    getImgByDevKind2: function (devKind1, devKind2) {
        var _value = (devKind2 || '') == '' ? 'etc' : devKind2.toLowerCase();
        if (_value.endsWith("switch")) {
            return 'switch';
        } else if (_value.toUpperCase().indexOf('WIN') > -1) {
            return 'windows'
        } else if (_value.toUpperCase().indexOf('LINUX') > -1) {
            return 'linux'
        } else if (_value.toUpperCase().indexOf('AIX') > -1) {
            return 'aix'
        } else if (_value.toUpperCase().indexOf('SOLAR') > -1) {
            return 'solaris'
        } else if (_value.toUpperCase().indexOf('HP') > -1) {
            return 'hpux'
        }
        else {
            if (devKind1 == 'SVR' && $.inArray(_value, ['iis', 'tomcat']) === -1) {
                return 'server';
            }
            return _value;
        }
    },
    getImgByStatus: function (status) {
        var _value = (status || '') == '' ? 'unset' : status.toLowerCase();
        return _value;
    },

    /** 장비명 */
    devNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;
        var devKind1 = $('#' + _gridId).jqxGrid('getcellvalue', row, 'devKind1');

        if ($.isBlank(devKind1) || (devKind1 != 'DEV' && devKind1 != 'SVR' && devKind1 != 'VSVR')) {
            return tag;
        }

        var cell = $('<div></div>', {
            class: 'jqx-grid-cell-left-align',
            style: 'margin: 6px 2px 0 5px'
        });

        var devKind2 = $('#' + _gridId).jqxGrid('getcellvalue', row, 'devKind2');
        var devKind2Style = '';
        if (!$.isBlank(devKind2)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/{0}.svg'.substitute(HmGrid.getImgByDevKind2(devKind1, devKind2)),
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            devKind2Style = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: devKind2Style + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('" + devKind1 + "', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },

    /** 회선명 */
    ifNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;
        var mngNo = $('#' + _gridId).jqxGrid('getcellvalue', row, 'mngNo');
        var ifIdx = $('#' + _gridId).jqxGrid('getcellvalue', row, 'ifIdx');
        var lineWidth = $('#' + _gridId).jqxGrid('getcellvalue', row, 'lineWidth');

        if ($.isBlank(mngNo) || $.isBlank(ifIdx) || $.isBlank(lineWidth)) {
            return tag;
        }

        var cell = $('<div></div>', {
            style: 'margin: 6px 2px 0 5px',
            class: 'jqx-left-align'
        });

        var status = $('#' + _gridId).jqxGrid('getcellvalue', row, 'status');
        var statusStyle = '';
        if (!$.isBlank(status)) {
            cell.append($('<img></img>', {
                src: '/img/status/{0}.svg'.substitute(HmGrid.getImgByStatus(status)),
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/status/unset.svg'"
            }));
            statusStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: statusStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('IF', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },

    /** AP명 */
    apNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;

        var cell = $('<div></div>', {
            style: 'margin: 6px 2px 0 5px',
            class: 'jqx-left-align'
        });

        var apName = $('#' + _gridId).jqxGrid('getcellvalue', row, 'apName');
        var apNameStyle = '';
        if (!$.isBlank(apName)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/ap.svg',
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            apNameStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: apNameStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('AP', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },
    /** APC명 */
    apcNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;

        var cell = $('<div></div>', {
            style: 'margin: 6px 2px 0 5px',
            class: 'jqx-left-align'
        });

        var devName = $('#' + _gridId).jqxGrid('getcellvalue', row, 'devName');
        var devNameStyle = '';
        if (!$.isBlank(devName)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/ap_con.svg',
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            devNameStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: devNameStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('APC', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },
    /** AP Client */
    apClientRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;
        // var devKind1 = $('#' + _gridId).jqxGrid('getcellvalue', row, 'devKind1');

        // if ($.isBlank(devKind1) || (devKind1 != 'DEV' && devKind1 != 'SVR')) {
        // 	return tag;
        // }

        var cell = $('<div></div>', {
            style: 'margin: 6px 2px 0 5px',
            class: 'jqx-left-align'
        });

        var apClient = $('#' + _gridId).jqxGrid('getcellvalue', row, 'connName');
        var apClientStyle = '';
        if (!$.isBlank(apClient)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/client.svg',
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            apClientStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: apClientStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('AP_CLIENT_MAC', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },
    /** VM */
    vmNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;
        // var devKind1 = $('#' + _gridId).jqxGrid('getcellvalue', row, 'devKind1');

        // if ($.isBlank(devKind1) || (devKind1 != 'DEV' && devKind1 != 'SVR')) {
        // 	return tag;
        // }

        var cell = $('<div></div>', {
            style: 'margin: 6px 2px 0 5px',
            class: 'jqx-left-align'
        });

        var vm = $('#' + _gridId).jqxGrid('getcellvalue', row, 'vmName');
        var vmStyle = '';
        if (!$.isBlank(vm)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/etc.svg',
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            vmStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: vmStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('VM', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },
    /** NUTANIX_VSVR */
    nutanixVsvrNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;

        var cell = $('<div></div>', {
            style: 'margin: 6px 2px 0 5px',
            class: 'jqx-left-align'
        });

        var vm = $('#' + _gridId).jqxGrid('getcellvalue', row, 'svrName');
        var vmStyle = '';
        if (!$.isBlank(vm)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/etc.svg',
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            vmStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: vmStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('NUTANIX_VSVR', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },
    /** NUTANIX_VM */
    nutanixVmNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;

        var cell = $('<div></div>', {
            style: 'margin: 6px 2px 0 5px',
            class: 'jqx-left-align'
        });

        var vm = $('#' + _gridId).jqxGrid('getcellvalue', row, 'vmName');
        var vmStyle = '';
        if (!$.isBlank(vm)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/etc.svg',
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            vmStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: vmStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('NUTANIX_VM', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },
    /**
     * 회선별칭이 "<<if_alias>>" 형태로 저장되는 경우 jqxgrid의  cell을 생성할때 "<"<if_alais>">"</if_alias> 형태의
     * html tag로 인식되어 "<>" 이 형태로 출력되는 문제가 있음.
     * 일단 임시로 "<"를 특수문자 "〈"로 치환하도록 처리함.
     * TODO 해결방안 필요!! by jjung
     */
    ifAliasrenderer: function (row, datafield, value, defaulthtml, columnproperties) {
        // var html = $(defaulthtml);
        // html.text(value.replace(/\</ig, '〈').replace(/\>/ig, '〉'));
        // // console.log(html[0].outerHTML, defaulthtml);
        // return html[0].outerHTML;
        var text = value.replace(/\</ig, '&lt;').replace(/\>/ig, '&gt;');
        return "<div style='margin-top: 6px; margin-left: 2px;'>" + text + "</div>";
    },

    /** WAS명 */
    wasNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;
        var devKind1 = $('#' + _gridId).jqxGrid('getcellvalue', row, 'devKind1');
        var wasKind = $('#' + _gridId).jqxGrid('getcellvalue', row, 'wasKind');

        if ($.isBlank(devKind1) || (devKind1 != 'DEV' && devKind1 != 'SVR')) {
            return tag;
        }

        var cell = $('<div></div>', {
            class: 'jqx-grid-cell-left-align',
            style: 'margin-top: 6.5px'
        });

        var wasKindStyle = '';
        if (!$.isBlank(wasKind)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/{0}.svg'.substitute(HmGrid.getImgByDevKind2(devKind1, wasKind)),
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            wasKindStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: wasKindStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('WAS', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },

    /** DBMS명 */
    dbmsNameRenderer: function (row, column, value, tag) {
        var _gridId = this.owner.element.id;
        var devKind1 = $('#' + _gridId).jqxGrid('getcellvalue', row, 'devKind1');
        var dbmsKind = $('#' + _gridId).jqxGrid('getcellvalue', row, 'dbmsKind');

        if ($.isBlank(devKind1) || (devKind1 != 'DEV' && devKind1 != 'SVR')) {
            return tag;
        }

        var cell = $('<div></div>', {
            class: 'jqx-grid-cell-left-align',
            style: 'margin-top: 6.5px'
        });

        var dbmsKindStyle = '';
        if (!$.isBlank(dbmsKind)) {
            cell.append($('<img></img>', {
                src: '/img/tree/v5.0.1/{0}.svg'.substitute(HmGrid.getImgByDevKind2(devKind1, dbmsKind)),
                style: 'width: 14px; height: 14px;',
                onerror: "this.src='/img/tree/v5.0.1/etc.svg'"
            }));
            dbmsKindStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: dbmsKindStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('DBMS', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));
        return cell[0].outerHTML
    },
    
    /** 쿠버네티스 - 네임스페이스명 */
    namespaceRenderer: function(row, column, value, tag){
        var _gridId = this.owner.element.id;
        var namespaceNo = $('#' + _gridId).jqxGrid('getcellvalue', row, 'namespaceNo');
        var clusterNm = $('#' + _gridId).jqxGrid('getcellvalue', row, 'clusterNm');
        var clusterNo = $('#' + _gridId).jqxGrid('getcellvalue', row, 'clusterNo');
        if($.isBlank(namespaceNo) || $.isBlank(clusterNm) && $.isBlank(clusterNo)){
            return tag;
        }

        var cell = $('<div></div>', {
            class: 'jqx-grid-cell-middle-align',
            style: 'margin: 6px 2px 0 0'
        });

        var namespaceNm = $('#' + _gridId).jqxGrid('getcellvalue', row, 'namespaceNm');

        var namespaceNmStyle = '';
        if(!$.isBlank(namespaceNm)){
            namespaceNmStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: namespaceNmStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('NAMESPACE_NO', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));

        return cell[0].outerHTML
    },

    /** 쿠버네티스 - 파드명 */
    podRenderer: function(row, column, value, tag){
        var _gridId = this.owner.element.id;
        var podNo = $('#' + _gridId).jqxGrid('getcellvalue', row, 'podNo');
        var namespaceNo = $('#' + _gridId).jqxGrid('getcellvalue', row, 'namespaceNo');
        if($.isBlank(podNo) || $.isBlank(namespaceNo)){
            return tag;
        }

        var cell = $('<div></div>', {
            class: 'jqx-grid-cell-middle-align',
            style: 'margin: 6px 2px 0 0'
        });

        var podNm = $('#' + _gridId).jqxGrid('getcellvalue', row, 'podNm');

        var podNmStyle = '';
        if(!$.isBlank(podNm)){

            podNmStyle = 'padding-left: 5px;'
        }

        cell.append($('<span></span>', {
            text: value,
            style: podNmStyle + 'text-decoration: underline;',
            onclick: "try { HmGrid.commonDetailPopup('POD_NO', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
        }));

        return cell[0].outerHTML
    },

    /** unit1000 */
    unit1000renderer: function (row, column, value) {

        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += (value == null || value.length == 0) ? value : HmUtil.convertUnit1000(value);
        cell += '</div>';
        return cell;

    },
    unit1000rendererUseTms: function (row, column, value) {

        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += (value == null || value.length == 0) ? value : HmUtil.convertUnit1000UseTms(value);
        cell += '</div>';
        return cell;

    },

    /** unit MHz -> convert Hz */
    unitHzRenderer: function (row, column, value) {
        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += HmUtil.convertHz(value) + 'Hz';
        cell += '</div>';
        return cell;
    },
    /** unit Hz -> convert Hz */
    unit1000HzRenderer: function (row, column, value) {
        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += HmUtil.convertUnit1000(value) + 'Hz';
        cell += '</div>';
        return cell;
    },

    /** unit1024 */
    unit1024renderer: function (row, column, value) {
        // var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        var cell = '<div class="jqx-grid-cell-right-align" style="margin-top: 6.5px; ms-text-overflow: ellipsis;">';
        cell += HmUtil.convertUnit1024(value);
        cell += '</div>';
        return cell;
    },
    /** unit1024 */
    unit1024rendererUseTms: function (row, column, value) {
        // var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        var cell = '<div class="jqx-grid-cell-right-align" style="margin-top: 6.5px; ms-text-overflow: ellipsis;">';
        cell += HmUtil.convertUnit1000UseTms(value);
        cell += '</div>';
        return cell;
    },

    /** unitHyphen1000 */
    hyphenrenderer: function (row, column, value) {
        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';

        if (typeof value === 'number' && isFinite(value)) {
            cell += value;
        } else {
            cell += '-';
        }
        cell += '</div>';
        return cell;
    },
    unitHyphen1000renderer: function (row, column, value) {
        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';

        if (typeof value === 'number' && isFinite(value)) {
            cell += HmUtil.convertUnit1000(value);
        } else {
            cell += '-';
        }
        cell += '</div>';
        return cell;
    },

    /** unitHyphen1024 */
    unitHyphen1024renderer: function (row, column, value) {
        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        if (value == null || value == '') {
            cell += '-';
        } else {
            cell += HmUtil.convertUnit1024(value);
        }
        cell += '</div>';
        return cell;
    },
    /** 회선상태 */
    ifStatusrenderer: function (row, datafield, value) {
        if (value == null) return;
        var _color = '#d4d4d4';
        switch (value.toUpperCase()) {
            case 'ALIVE':
                _color = '#69B2E4';
                break;
            case 'DEAD':
                _color = '#a3a3a3';
                break;
            case 'UNSET':
                _color = '#d4d4d4';
                break;
        }

        var div = $('<div></div>', {
            class: 'jqx-center-align evtName evt',
            style: 'background: {0}'.substitute(_color),
            text: value
        });
        return div[0].outerHTML;
    },

    // /** 센서상태 */
    // sensorStatusrenderer: function(row, datafield, value) {
    // 	if(value == null) return;
    // 	var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
    // 	switch(value.toString()) {
    // 		case "1": cell += "<img src='" + ctxPath + "/img/Grid/IfStatus/alive.gif' alt='" + value + "' />"; break;
    // 		case "0": cell += "<img src='" + ctxPath + "/img/Grid/IfStatus/dead.gif' alt='" + value + "' />"; break;
    // 		case "2": cell += "<img src='" + ctxPath + "/img/Grid/IfStatus/unset.gif' alt='" + value + "' />"; break;
    // 		default: return;
    // 	}
    // 	cell += "</div>";
    // 	return cell;
    // },

    /** 장애등급 */
    sensorStatusrenderer: function (row, datafield, value, defaultHTML) {
        //시작 테그만 빼고 삭제.
        defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';

        var _splitHTML = defaultHTML.split('"');
        for (var i = 0; i < _splitHTML.length; i++) {

            if (_splitHTML[i].indexOf('class') != -1) {
                _splitHTML[i + 1] += ' evtName';
                if (value.toString() == '0') {
                    _splitHTML[i + 1] += ' evt normal';
                    _splitHTML[_splitHTML.length - 1] += '정상' + '</div>';
                } else {
                    _splitHTML[i + 1] += ' evt critical';
                    _splitHTML[_splitHTML.length - 1] += '장애' + '</div>';
                }

            }
        }
        return _splitHTML.join('"');
    },

    /** 장애등급 */
    evtLevelrenderer: function (row, datafield, value, defaultHTML) {

        //시작 테그만 빼고 삭제.
        defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';
        var _splitHTML = defaultHTML.split('"');
        for (var i = 0; i < _splitHTML.length; i++) {
            /**
             * 브라우저 호환성 문제가 있으니 사용하지 마세요!!!
             * String.prototype.incldues 함수는 Chrome41버전 이상, Firefox40이상, Safari9이상에서만 지원하며
             * ie, Opera는 지원하지 않음.
             */
            //if (_splitHTML[i].includes('class')) {
            if (_splitHTML[i].indexOf('class') != -1) {
                _splitHTML[i + 1] += ' evtName';
                switch (value.toString()) {
                    case "-1":
                    case "조치중":
                    case $('#gEvtTxtProcessing').val():
                        _splitHTML[i + 1] += ' evt processing';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtProcessing').val() + '</div>';
                        break;
                    case "0":
                    case "정상":
                    case $('#gEvtTxtNormal').val():
                        _splitHTML[i + 1] += ' evt normal';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtNormal').val() + '</div>';
                        break;
                    case "1":
                    case "정보":
                    case $('#gEvtTxtInfo').val():
                        _splitHTML[i + 1] += ' evt info';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtInfo').val() + '</div>';
                        break;
                    case "2":
                    case "주의":
                    case $('#gEvtTxtWarning').val():
                        _splitHTML[i + 1] += ' evt warning';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtWarning').val() + '</div>';
                        break;
                    case "3":
                    case "알람":
                    case $('#gEvtTxtMinor').val():
                        _splitHTML[i + 1] += ' evt minor';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtMinor').val() + '</div>';
                        break;
                    case "4":
                    case "경보":
                    case $('#gEvtTxtMajor').val():
                        _splitHTML[i + 1] += ' evt major';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtMajor').val() + '</div>';
                        break;
                    case "5":
                    case "장애":
                    case $('#gEvtTxtCritical').val():
                        _splitHTML[i + 1] += ' evt critical';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtCritical').val() + '</div>';
                        break;
                    default:
                        _splitHTML[_splitHTML.length - 1] += '-' + '</div>';
                        return;
                }
            }
        }
        return _splitHTML.join('"');
    },

    /** 장애등급 new */
    evtLevelRenderer: function (row, datafield, value, defaultHTML) {

        var evtContainer = document.createElement('div');
        var evtDiv = document.createElement('div');
        var evtStyle = document.createAttribute('style');

        var evtColor = $('#gEvtNormal').val() || '#1428A0';
        var evtText = $('#gEvtTxtNormal') || '정상';

        switch (Number(value)) {
            case 1:
                evtColor = $('#gEvtInfo').val();
                evtText = $('#gEvtTxtInfo').val();
                break;
            case 2:
                evtColor = $('#gEvtWarning').val();
                evtText = $('#gEvtTxtWarning').val();
                break;
            case 3:
                evtColor = $('#gEvtMinor').val();
                evtText = $('#gEvtTxtMinor').val();
                break;
            case 4:
                evtColor = $('#gEvtMajor').val();
                evtText = $('#gEvtTxtMajor').val();
                break;
            case 5:
                evtColor = $('#gEvtCritical').val();
                evtText = $('#gEvtTxtCritical').val();
                break;
            default:
                evtColor = $('#gEvtTxtProcessing').val();
                evtText = $("#gEvtTxtProcessing").val();
                break;
        }

        evtStyle.value = 'height:20px;';
        evtStyle.value += 'line-height:20px;';
        evtStyle.value += 'text-align:center;';
        evtStyle.value += 'margin:4px;';
        evtStyle.value += 'font-weight:bold;';
        evtStyle.value += 'border-radius:3px;';
        evtStyle.value += 'color:#fff;';
        evtStyle.value += 'background:' + evtColor + ';';
        evtDiv.setAttributeNode(evtStyle);

        $(evtDiv).text(evtText);

        evtContainer.appendChild(evtDiv);

        return evtContainer.innerHTML;
    },

    /** 토폴로지 장애등급 */
    topoEvtLevelrenderer: function (row, datafield, value, defaultHTML) {
        //시작 테그만 빼고 삭제.
        defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';
        var _splitHTML = defaultHTML.split('"');
        for (var i = 0; i < _splitHTML.length; i++) {
            if (_splitHTML[i].indexOf('class') != -1) {
                _splitHTML[i + 1] += ' evtName';
                switch (value.toString()) {
                    case "-1":
                    case $("#gEvtTxtProcessing").val():
                        _splitHTML[i + 1] += ' evt processing';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtProcessing').val() + '</div>';
                        break;
                    case "0":
                    case "1":
                    case $("#gEvtTxtNormal").val():
                        _splitHTML[i + 1] += ' evt normal';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtNormal').val() + '</div>';
                        break;
                    case "2":
                    case $("#gEvtTxtInfo").val():
                        _splitHTML[i + 1] += ' evt info';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtInfo').val() + '</div>';
                        break;
                    case "3":
                    case $("#gEvtTxtWarning").val():
                        _splitHTML[i + 1] += ' evt warning';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtWarning').val() + '</div>';
                        break;
                    case "4":
                    case $("#gEvtTxtMinor").val():
                        _splitHTML[i + 1] += ' evt minor';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtMinor').val() + '</div>';
                        break;
                    case "5":
                    case $("#gEvtTxtMajor").val():
                        _splitHTML[i + 1] += ' evt major';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtMajor').val() + '</div>';
                        break;
                    case "6":
                    case $("#gEvtTxtCritical").val():
                        _splitHTML[i + 1] += ' evt critical';
                        _splitHTML[_splitHTML.length - 1] += $('#gEvtTxtCritical').val() + '</div>';
                        break;
                    default:
                        return;
                }
            }
        }
        return _splitHTML.join('"');
    },

    /** 헬스체크 */
    healthChkrenderer: function (row, datafield, value, defaultHTML) {
        //시작 테그만 빼고 삭제.
        defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';
        var _splitHTML = defaultHTML.split('"');
        var _txt = '';
        for (var i = 0; i < _splitHTML.length; i++) {
            /**
             * 브라우저 호환성 문제가 있으니 사용하지 마세요!!!
             * String.prototype.incldues 함수는 Chrome41버전 이상, Firefox40이상, Safari9이상에서만 지원하며
             * ie, Opera는 지원하지 않음.
             */
            //if (_splitHTML[i].includes('class')) {
            if (_splitHTML[i].indexOf('class') != -1) {
                _splitHTML[i + 1] += ' evtName';
                switch (value.toString()) {
                    case "1":
                    case "정상":
                    case $('#sEvtLevel0').val():
                    case $('#gEvtTxtNormal').val():
                        _txt = '정상';
                        _splitHTML[i + 1] += ' evt normal';
                        _splitHTML[_splitHTML.length - 1] += _txt.toString() + '</div>';
                        break;
                    case "0":
                    case "장애":
                    case $('#sEvtLevel5').val():
                    case $('#gEvtTxtCritical').val():
                        _txt = '장애';
                        _splitHTML[i + 1] += ' evt critical';
                        _splitHTML[_splitHTML.length - 1] += _txt.toString() + '</div>';
                        break;
                    default:
                        return;
                }
            }
        }
        return _splitHTML.join('"');
    },
    /** 설정/미설정 */
    setUnsetRenderer: function (row, datafield, value, defaultHTML) {
        if (value == null) return;
        var _color = '#d4d4d4';
        var _txt = '';
        switch (value.toString().toUpperCase()) {
            case "1":
            case "Y":
            case "설정":
                _color = '#69B2E4';
                _txt = '사용';
                break;
            case "N":
            case "미설정":
            case "0":
                _color = '#d4d4d4';
                _txt = '미사용';
                break;
            default:
                return;
        }

        var div = $('<div></div>', {
            class: 'jqx-center-align evtName evt',
            style: 'background: {0}'.substitute(_color),
            text: _txt
        });
        return div[0].outerHTML;
    },
    evtLevelFilterRenderer: function (index, label, value) {
        switch (value.toString()) {
            case "-1":
            case "조치중":
            case $('#gEvtTxtProcessing').val():
                return $('#gEvtTxtProcessing').val();
            case "0":
            case "정상":
            case $('#gEvtTxtNormal').val():
                return $('#gEvtTxtNormal').val();
            case "1":
            case "정보":
            case $('#gEvtTxtInfo').val():
                return $('#gEvtTxtInfo').val();
            case "2":
            case "주의":
            case $('#gEvtTxtWarning').val():
                return $('#gEvtTxtWarning').val();
            case "3":
            case "알람":
            case $('#gEvtTxtMinor').val():
                return $('#gEvtTxtMinor').val();
            case "4":
            case "경보":
            case $('#gEvtTxtMajor').val():
                return $('#gEvtTxtMajor').val();
            case "5":
            case "장애":
            case $('#gEvtTxtCritical').val():
                return $('#gEvtTxtCritical').val();
            default:
                return label;
        }
    },

    healthChkFilterRenderer: function (index, label, value) {
        switch (value.toString()) {
            case "1":
            case "정상":
                return "정상";
            case "0":
            case "장애":
                return "장애";
            default:
                return label;
        }
    },

    /** 게시판 상태 */
    boardStatusrenderer: function (row, datafield, value) {
        if (value == null) return;
        var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
        switch (value.toString()) {
            case "요청":
                cell += "<img src='" + ctxPath + "/img/Grid/apply.png' alt='" + value + "'/>";
                break;
            case "처리":
                cell += "<img src='" + ctxPath + "/img/Grid/check.png' alt='" + value + "'/>";
                break;
            default:
                return;
        }
        cell += "</div>";
        return cell;
    },

    /** 작업진행 상태 */
    jobFlagrenderer: function (row, datafield, value) {
        if (value == null) return;
        var cell = "<div style='margin-top: 5px' class='jqx-center-align'>";
        switch (value.toString()) {
            case "0":
            case "신청":
                cell += "<img src='" + ctxPath + "/img/Grid/JobFlag/apply.png' alt='" + value + "'/>";
                break;
            case "1":
            case "승인":
                cell += "<img src='" + ctxPath + "/img/Grid/JobFlag/confirm.png' alt='" + value + "'/>";
                break;
            default:
                return;
        }
        cell += "</div>";
        return cell;
    },

    /** 작업관리 중요도 */
    jobLevelrenderer: function (row, datafield, value) {
        if (value == null) return;
        var joblvl = [null, 'low', 'middle', 'high'];
        var _lvl = 1, _text = '낮음';
        switch (value.toString()) {
            case '1':
            case '낮음':
                _lvl = 1;
                _text = '낮음';
                break;
            case '2':
            case '보통':
                _lvl = 2;
                _text = '보통';
                break;
            case '3':
            case '높음':
                _lvl = 3;
                _text = '높음';
                break;
        }

        var div = $('<div></div>', {
            class: 'jqx-center-align evtName evt joblvl_{0}'.substitute(joblvl[_lvl]),
            text: _text
        });

        return div[0].outerHTML;
    },

    /** 이벤트 지속시간 (second) */
    cTimerenderer: function (row, datafield, value) {
        var result = HmUtil.convertCTime(value);

        return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + result + "</div>";
    },

    /** 시간 (milisecond) */
    milisecrenderer: function (row, datafield, value) {
        var result = HmUtil.convertMilisecond(value);
        return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + result + "</div>";
    },

    /** 컬럼값에 ms 단위 추가 */
    milisecTextrenderer: function (row, datafield, value) {
        return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + value + "ms</div>";
    },

    /** 이미지 장비타입 */
    imgDevkind1renderer: function (row, columnfield, value, defaulthtml, columnproperties) {
        var gridId = $(this.owner.wrapper).attr("id").replace("wrapper", "");
        if (gridId == null) return value;
        var imgUrl = $('#' + gridId).jqxGrid('getrowdata', row).devKind1ImgUrl;
        var cell = "<div style='margin-top: 2px; margin-left: 4px; margin-right: 2px;'>"
            + "<img src='" + ($('#websvcUrl').val() + imgUrl) + "'>&nbsp;" + value
            + "</div>";
        return cell;
    },

    /** 비밀번호 */
    pwdrenderer: function (row, datafield, value) {
        return "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>**********</div>";
    },

    secretrenderer: function (row, datafield, value) {
        var _text = (value || '').length == 0 ? '' : '**********';
        return "<div style='margin-top: 9px; margin-left: 5px' class='jqx-left-align'>" + _text + "</div>";
    },

    /** 컬럼값에  온도(℃) 추가 */
    temperaturerenderer: function (row, datafield, value) {
        return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + value + "℃</div>";
    },

    /** 값 + comumntype을 사용  */
    customColumnTypererenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
        // console.log(columnproperties.columntype);
        return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + value + columnproperties.columntype + "</div>";
    },

    /** ROW NO */
    rownumrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        // console.log(columnproperties.cellsalign);
        var _class = 'jqx-right-align';
        if (columnproperties.cellsalign !== undefined) {
            _class = 'jqx-' + columnproperties.cellsalign + '-align';
        }
        return "<div style='margin-top: 7px; margin-right: 5px; text-align : center;' class='" + _class + "'>" + (row + 1) + "</div>";
    },

    /** ROW NO */
    rownumrenderer2: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        var _class = 'jqx-right-align';
        if (columnproperties.cellsalign !== undefined) {
            _class = 'jqx-' + columnproperties.cellsalign + '-align';
        }
        return "<div style='margin-top: 4px; margin-right: 5px' class='" + _class + "'>" + (value + 1) + "</div>";
    },
    /** 사용자 계정상태 */
    usrStaterenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
        switch (value.toString()) {
            case "0":
                cell += "정지";
                break;
            case "1":
                cell += "승인";
                break;
            case "2":
                cell += "대기";
                break;
            case "3":
                cell += "잠김";
                break;
        }
        cell += "</div>";
        return cell;
    },

    /** 장비종류1 */
    devKind1renderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
        switch (value.toString()) {
            case "DEV":
                cell += "장비";
                break;
            case "SVR":
                cell += "서버";
                break;
            default:
                cell += value.toString();
                break;
        }
        cell += "</div>";
        return cell;
    },

    /** AP 상태 */
    apStatusrenderer: function (row, datafield, value) {
        if (value == null) return;
        var cell = "<div style='margin-top: 6px' class='jqx-center-align'>";
        switch (value.toUpperCase()) {
            case "UP":
                cell += "<img src='" + ctxPath + "/img/Grid/ApStatus/ap_up.png' alt='" + value + "' style='border-radius: 3px' />";
                break;
            case "DOWN":
                cell += "<img src='" + ctxPath + "/img/Grid/ApStatus/ap_down.png' alt='" + value + "' style='border-radius: 3px' />";
                break;
            default:
                break;
        }
        cell += "</div>";
        return cell;
    },

    /** progressbar */
    progressbarrenderer: function (row, column, value, overThresholdValue) {
        var cellWidth = 100;
        var cell = null;
        try {
            cellWidth = parseInt($(this)[0].width) - 12;
        } catch (e) {
        }
        cell = '<div  class="jqx-grid-cell-middle-align" style="margin: 5px 6px; padding-bottom: 0; height: 18px; background: #F1F1F1 ;">';
        if (overThresholdValue) {
            // value가 문자 타입일 경우, 오른쪽 바가 빨간색으로 변환됨
            if (overThresholdValue > value) {
                cell = '<div  class="jqx-grid-cell-middle-align" style="margin: 5px 6px; padding-bottom: 0; height: 18px; background: #FF0000 ;">';
            }
        }


        // cell += '<div style="background: #87C9F3; position: relative; width: ' + (cellWidth / 100 * value) + 'px; height: 100%"></div>';
        cell += '<div style="background: #88caf3; position: relative; width: ' + (cellWidth / 100 * value) + 'px; height: 100%"></div>';
        cell += '<div style="margin-left: 5px; position: relative; top: -16px; color: #282828;">' + value.toString() + ' %' + '</div>';
        cell += '</div>';
        return cell;
    },

    /** 헬스체크  */
    icmpPollrenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
        switch (value.toString()) {
            case "1":
                cell += "ICMP";
                break;
            case "2":
                cell += "SNMP";
                break;
            case "3":
                cell += "Both";
                break;
            default:
                cell += "NONE";
                break;
        }
        cell += "</div>";
        console.log('icmp', cell);
        return cell;
    },

    /** SNMP Version */
    snmpVerrenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 7px; margin-left: 5px' class='jqx-left-align'>";
        switch (value.toString()) {
            case "1":
                cell += "Ver1";
                break;
            case "2":
                cell += "Ver2";
                break;
            case "3":
                cell += "Ver3";
                break;
        }
        cell += "</div>";
        return cell;
    },
    snmpSecurityLevelrenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
        switch (value.toString()) {
            case "0":
                cell += "NoAuthNoPriv";
                break;
            case "1":
                cell += "AuthNoPriv";
                break;
            case "2":
                cell += "AuthPriv";
                break;
        }
        cell += "</div>";
        return cell;
    },
    snmpAuthTyperenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
        switch (value.toString()) {
            case "1":
                cell += "SHA";
                break;
            case "2":
                cell += "MD5";
                break;
        }
        cell += "</div>";
        return cell;
    },

    snmpEncryptTyperenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
        switch (value.toString()) {
            case "1":
                cell += "AES";
                break;
            case "2":
                cell += "DES";
                break;
            case "3":
                cell += "AES192";
                break;
            case "4":
                cell += "AES256";
                break;
        }
        cell += "</div>";
        return cell;
    },


    /** title */
    titlerenderer: function (toolbar, title, elemId) {
        var container = $('<div ></div>');
        var span;
        if (elemId !== null && elemId !== undefined) {
            // span = $('<span style="float: left; font-weight: bold; margin-top: 2px; margin-right: 4px; text-indent:18px; background:url(/img/MainImg/customer_bullet.png) 5px 50% no-repeat;" id="' + elemId + '">' + title + '</span>');
            span = $('<div class="pertTitle" " id="' + elemId + '">' + title + '</div>');
        }
        else {
            // span = $('<span style="float: left; font-weight: bold; margin-top: 2px; margin-right: 4px; text-indent:18px; background:url(/img/MainImg/customer_bullet.png) 5px 50% no-repeat;">' + title + '</span>');
            span = $('<div class="pertTitle">' + title + '</div>');
        }
        toolbar.css('background', '#d0d8de');
        toolbar.empty();
        toolbar.append(container);
        container.append(span);
    },

    /** flow 수집여부 */
    tmsFlowRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 6px' class='jqx-center-align'>";
        switch (value.toString()) {
            case "Y":
                cell += "<img src='" + ctxPath + "/img/Grid/TmsFlow/yes.png' alt='" + value + "'/>";
                break;
            case "N":
                cell += "<img src='" + ctxPath + "/img/Grid/TmsFlow/no.png' alt='" + value + "'/>";
                break;
        }
        cell += "</div>";
        return cell;
    },

    /** Syslog 등급 */
    syslogLevelrenderer: function (row, datafield, value, defaultHTML) {
        //시작 테그만 빼고 삭제.
        defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';
        var _splitHTML = defaultHTML.split('"');
        for (var i = 0; i < _splitHTML.length; i++) {
            /**
             * 브라우저 호환성 문제가 있으니 사용하지 마세요!!!
             * String.prototype.incldues 함수는 Chrome41버전 이상, Firefox40이상, Safari9이상에서만 지원하며
             * ie, Opera는 지원하지 않음.
             */
            //if (_splitHTML[i].includes('class')) {
            if (_splitHTML[i].indexOf('class') != -1) {
                _splitHTML[i + 1] += ' evtName';
                var sys_className = 'sys_' + value.toString().toLocaleLowerCase();

                _splitHTML[i + 1] += ' evt ' + sys_className;
                _splitHTML[_splitHTML.length - 1] += value + '</div>';
            }
        }
        return _splitHTML.join('"');
    },

    /** 감시프로스세스 비교조건 */
    mprocCmpcondRenderer: function (row, datafield, value) {
        if (value == null) return;
        var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
        cell += value.replace('&lt;', '<').replace('&gt;', '>');
        cell += "</div>";
        return cell;
    },
    /** 라이센스 상세 */
    licenseDetailrenderer: function (row, datafield, value) {
        if (value == null) return;
        var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
        switch (value) {
            case 0:
                cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/grn.png' alt='대기중' />";
                break;
            case 1:
                cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/yellow.png' alt='통화중' />";
                break;
            case 2:
                cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/red.png' alt='측정불가' />";
                break;
            default:
                return;
        }
        cell += "</div>";
        return cell;
    },
    /** fax  */
    faxStatusrenderer: function (row, datafield, value) {
        if (value == null) return;
        var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
        switch (value) {
            case 'ALIVE':
                cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/grn.png' alt='정상' /> 정상";
                break;
            case 'DEAD':
                cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/red.png' alt='비정상' /> 비정상";
                break;
            default:
                return;
        }
        cell += "</div>";
        return cell;
    },

    /** SLA */
    /** SLA 조치상태 */
    slaActionrenderer: function (row, datafield, value) {
        if (value == null) return;
        var _text = '';
        switch (value.toString()) {
            case "1":
                _text = "미통보";
                break;
            case "2":
                _text = "통보";
                break;
            case "3":
                _text = "지연통보";
                break;
        }
        var div = $('<div></div>', {
            class: 'slaAction slaAction' + value + ' jqx-center-align', title: _text,
            onclick: "try { Main.showSlaAction(" + row + ") } catch(e) {}"
        });
        div.append($('<span></span>', {text: _text, class: 'slaActionText'}));
        return div[0].outerHTML;
    },

    /** SLA 진행상태 */
    slaStaterenderer: function (row, datafield, value) {
        if (value == null) return;
        var _text = '';
        switch (value.toString()) {
            case "1":
                _text = "신청";
                break;
            case "2":
                _text = "검토중";
                break;
            case "3":
                _text = "반려";
                break;
            case "4":
                _text = "재신청";
                break;
            case "5":
                _text = "거부";
                break;
            case "6":
                _text = "승인";
                break;
            default:
                _text = "NONE";
                value = 0;
                break;
        }
        var div = $('<div></div>', {
            class: 'slaState slaState' + value + ' jqx-center-align', title: _text,
            onclick: "try { Main.showSlaReport(" + row + ") } catch(e) {}"
        });
        div.append($('<span></span>', {text: _text, class: 'slaStateText'}));
        return div[0].outerHTML;
    },


    /*
            서버 Renderer
        */
    svrLogTypeRenderer: function (row, datafield, value) {
        if ((value || '').length == 0) {
            return null;
        }
        else {
            var _text = null;
            switch (value.toString()) {
                case '0':
                    _text = '날짜';
                    break;
                case '1':
                    _text = '사이즈';
                    break;
                case '2':
                    _text = '내용';
                    break;
                case '4':
                    _text = '누적';
                    break;
            }
            return '<div style="margin-top: 6px" class="jqx-center-align">' + _text + '</div>';
        }
    },


    /*
           서버 Renderer
       */
    svrFileTypeRenderer: function (row, datafield, value) {

        var _text = null;

        switch (value) {
            case 0:
                _text = '날짜';
                break;
            case 1:
                _text = '사이즈';
                break;
            case 2:
                _text = '무결성';
                break;
        }

        return '<div style="margin-top: 6px" class="jqx-center-align">' + _text + '</div>';

    },

    /*
        L7Switch Virtual 상태값 (F5기준)
    */
    l4f5VirtualStatusRenderer: function (row, datafield, value, defaulthtml, columnproperties, rowdata) {
        var _value = (value || '').toLowerCase();
        if ($.inArray(_value, ['green', 'yellow', 'red', 'blue', 'gray']) === -1) {
            _value = 'gray';
        }
        return '<div class="jqx-center-align" style="margin-top: 6px; color: {0}">●</div>'.substitute(_value);
    },

    /*
        L7Switch Virtual외 상태값 (F5기준) -
    */
    l4f5StatusRenderer: function (row, datafield, value, defaulthtml, columnproperties, rowdata) {
        var clz = (rowdata.statusClz || 'none').toLowerCase();
        if ($.inArray(clz, ['up', 'down', 'none']) === -1) {
            clz = 'none';
        }
        return '<div class="jqx-center-align {0}" style="margin-top: 6px;">●</div>'.substitute('l4f5_status_' + clz);
    },

    /** 사용자관리 계정상태  */
    userUseFlagRenderer: function (row, datafield, value, defaultHTML) {
        if (value == null) return;
        var _class = '';
        switch (value.toString().toUpperCase()) {
            case "휴면":
            case "0":
                _class = 'suspendedAccount';
                break;
            case "승인":
            case "1":
                _class = 'approvedAccount';
                break;
            case "대기":
            case "2":
                _class = 'waitingAccount';
                break;
            case "문자":
            case "3":
                _class = 'approvedAccount';
                break;
            case "일시잠김":
            case "4":
                _class = 'lockoutAccount';
                break;
            case "잠김":
            case "9":
                _class = 'lockoutAccount';
                break;
            default:
                return;
        }

        var div = $('<div></div>', {
            class: 'jqx-center-align userConfCell userConf {0}'.substitute(_class),
            text: value
        });
        return div[0].outerHTML;
    },
    /** 사용자관리 계정상태  */
    userIsRecvRenderer: function (row, datafield, value, defaultHTML) {
        if (value == null) return;
        var _class = '';
        var _label = '';
        switch (value.toString().toUpperCase()) {
            // case "Y": _class = 'isRecvY'; _label = "수신"; break;
            // case "N": _class = 'isRecvN'; _label = "미수신"; break;
            case "수신":
                _class = 'isRecvY';
                _label = "수신";
                break;
            case "미수신":
                _class = 'isRecvN';
                _label = "미수신";
                break;
            default:
                return;
        }

        var div = $('<div></div>', {
            class: 'jqx-center-align userConfCell userConf {0}'.substitute(_class),
            text: _label
        });
        return div[0].outerHTML;
    },

    /** 사용자관리 계정상태  */
    userAuthRenderer: function (row, datafield, value, defaultHTML) {
        if (value == null) return;
        var _class = '';
        var _label = '';
        switch (value.toString().toUpperCase()) {
            // case "USER":case "0": _class = 'authUser'; _label = '사용자'; break;
            // case "MUSER":case "1": _class = 'authMUser'; _label = '관리자'; break;
            // case "ADMIN":case "2": _class = 'authAdmin'; _label = '최고관리자'; break;
            // case "SYSTEM":case "3": _class = 'authSystem'; _label = '시스템관리자'; break;
            case "USER":
            case "사용자":
            case "0":
                _class = 'authUser';
                //_label = '사용자';
                break;
            case "MUSER":
            case "관리자":
            case "1":
                _class = 'authMUser';
                //_label = '관리자';
                break;
            case "ADMIN":
            case "최고관리자":
            case "2":
                _class = 'authAdmin';
                //_label = '최고관리자';
                break;
            case "SYSTEM":
            case "시스템관리자":
            case "3":
                _class = 'authSystem';
                //_label = '시스템관리자';
                break;
            default:
                return;
        }

        var div = $('<div></div>', {
            class: 'jqx-center-align userConfCell userConf {0}'.substitute(_class),
            text: value
        });
        return div[0].outerHTML;
    },
    /**============================================
     * aggregatesrenderer
     ============================================*/
    agg_unit1024sumrenderer: function (aggregates) {
        var value = aggregates['sum'];
        if (isNaN(value)) value = 0;
        return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.convertUnit1024(value) + '</div>';
    },

    agg_unit1000sumrenderer: function (aggregates) {
        var value = aggregates['sum'];
        if (isNaN(value)) value = 0;
        return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.convertUnit1000(value) + '</div>';
    },

    agg_sumrenderer: function (aggregates) {
        var value = aggregates['sum'];
        if (isNaN(value)) value = 0;
        return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.commaNum(value) + '</div>';
    },

    agg_sumcenterrenderer: function (aggregates) {
        var value = aggregates['sum'];
        if (isNaN(value)) value = 0;
        return '<div style="margin: 4px; overflow: hidden; line-height: 2; text-align: center">' + HmUtil.commaNum(value) + '</div>';
    },

    agg_sumTimerenderer: function(aggregates) {
        var value = aggregates['sum'];
        if(isNaN(value)) value = 0;
        return '<div style="float: right; margin: 4px; overflow: hidden;">' + formatSecondsToHHMMSS(value) + '</div>';
    },

    agg_sumTimerenderer_center: function(aggregates) {
        var value = aggregates['sum'];
        if(isNaN(value)) value = 0;
        return '<div style="text-align: center; font-weight: bold;  margin: 4px; overflow: hidden;">' + formatSecondsToHHMMSS(value) + '</div>';
    },


    agg_sumcntrenderer: function(aggregates) {
        var value = aggregates['sum'];
        if(isNaN(value)) value = 0;
        return '<div style="float: right; margin: 4px; overflow: hidden;">' + value.toFixed(2) + '</div>';
    },

    agg_sumcntrenderer_center: function(aggregates) {
        var value = aggregates['sum'];
        if(isNaN(value)) value = 0;
        return '<div style="text-align: center; font-weight: bold; margin: 4px; overflow: hidden;">' + value.toFixed(2) + '</div>';
    },

    formatSecondsToHHMMSS : function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var remainingSeconds = seconds % 60;

        var formattedHours = String(hours).padStart(2, '0');
        var formattedMinutes = String(minutes).padStart(2, '0');
        var formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return formattedHours+":" + formattedMinutes+":" + formattedSeconds;

    },


/**============================================
     * header renderer
     ============================================*/
    ckheaderRenderer: function (header) {
        return '<div style="margin: 4.5px 4px 4.5px 4px; text-align: center; overflow: hidden; padding-bottom: 2px; -ms-text-overflow: ellipsis;">' +
            '<div class="ckheader" style="float: left; margin: 0 auto;"></div>' +
            '<span style="cursor: default; -ms-text-overflow: ellipsis;">' + header + '</span>' +
            '</div>';
    },

    ckheaderRendered: function (element, grid, datafield) {
        var ckobj = $(element).children('.ckheader');
        ckobj.jqxCheckBox({theme: jqxTheme, width: 16, height: 16, hasThreeStates: false})
            .on('change', function (event) {
                var _newval = event.args.checked ? 1 : 0;
                var _list = grid.jqxGrid('getdisplayrows');
                if (_list == null || _list.length == 0) return;
                grid.jqxGrid('beginupdate');
                // 데이터 변경 후 sort이벤트가 발생하여 강제해제
                grid.jqxGrid('setcolumnproperty', datafield, 'sortable', false);
                $.each(_list, function (idx, value) {
                    grid.jqxGrid('setcellvalue', value.visibleindex, datafield, _newval);
                });
                grid.jqxGrid('endupdate');
                // 데이터 변경 후 sort이벤트가 발생하여 강제해제 해지..
                setTimeout(function () {
                    grid.jqxGrid('setcolumnproperty', datafield, 'sortable', true);
                }, 500);
            });
        return true;
    },

    /**============================================
     * validation
     ============================================*/
    requireIpValidation: function (cell, value) {
        if ($.isBlank(value)) {
            return {result: false, message: 'IP를 입력해주세요.'};
        }
        if (!$.validateIp(value)) {
            return {result: false, message: 'IP형식이 유효하지 않습니다.'};
        }
        return true;
    },

    portValidation: function (cell, value) {
        if (value.toString().length > 5) {
            return {result: false, message: '0~99999사이의 값을 입력해주세요.'};
        }
        return true;
    },
    getNextExecDate: function (row, columnfield, value, defaulthtml, columnproperties, data) {//data 씀(지우지 말것)
        var today,year,month,date,day,hours,minutes;
        today = new Date();
        year = today.getFullYear(); // 년도
        month = String(today.getMonth() + 1).length === 1  ? '0'+ (today.getMonth() + 1) : today.getMonth() + 1 ;  // 월
        date = String(today.getDate()).length === 1 ? '0'+today.getDate() : today.getDate();  // 날짜
        day = today.getDay();  // 요일
        hours = String(today.getHours()).length === 1 ? '0'+today.getHours() : today.getHours() ; // 시
        minutes = String(today.getMinutes()).length === 1 ? '0'+today.getMinutes() : today.getMinutes();  // 분

        var tDate, tTime, tMin, currDate, compDate;
        var schDay ,currDay, nextDate;
        var stValue, loopCnt;
        var retValue = null;

        if(data.useFlag == 0){
            retValue = '-';
        } else if (data.cronType === "r_once") {
            //예약실행
            retValue = data.execTimeStr;
        } else if (data.cronType === "r_hour" ) {
            //매시
            if (minutes > parseInt(data.cronMinute)) today.setHours(today.getHours() + 1);

            tDate = new Date(today + 3240 * 10000).toISOString().split("T")[0];
            tTime = (today.toTimeString().split(" ")[0]).substr(0,2);
            tMin = data.cronMinute.length === 1 ? '0'+data.cronMinute : data.cronMinute;
            //console.log(tDate + ' ' + tTime);
            retValue = tDate + ' ' + tTime + ':' + tMin;
        } else if (data.cronType === "r_day" ) {
            //매일
            if (hours > parseInt(data.cronHour)) today.setDate(today.getDate() + 1);
            else if (minutes > parseInt(data.cronMinute)) today.setDate(today.getDate() + 1);

            tDate = new Date(today + 3240 * 10000).toISOString().split("T")[0];
            tTime = data.cronHour.length === 1 ? '0'+data.cronHour : data.cronHour;
            tMin = data.cronMinute.length === 1 ? '0'+data.cronMinute : data.cronMinute;
            //console.log(tDate + ' ' + tTime);
            retValue = tDate + ' ' + tTime + ':' + tMin;

        } else if (data.cronType === "r_week" ) {
            //매주
            schDay = (data.cronWeek).split(',');
            currDay = null;
            nextDate = null;

            if (day === 0) currDay = 6;  //javascript에서 구한 오늘의 요일이 0(일요일) 이면 DB 값과 동일하게 6으로 변경
            else currDay = day - 1; //일요일을 6으로 치환해야함으로 다른 요일의 값은 1 차감

            //요일 중 첫번째요일의 다음주 일자 배열값
            // console.table(nextWeek);

            //현재 요일이 저장된 요일보다 큰 경우
            if (currDay > schDay[schDay.length-1] ) {
                // 다음주의 날짜중 첫번째 등록된 요일의 날짜 가져오기
                nextDate = nextWeek[schDay[0]];
            }
            else {
                // 최근(당일 요일 포함) 가까운 요일의 일자 구하기
                $.each(schDay, function (idx, value) {

                    //주기 요일 중 현재 요일보다 큰것의 해당 요일의 일자 구하기
                    if (currDay === parseInt(value)) {
                        nextDate = new Date(today + 3240 * 10000).toISOString().split("T")[0];
                        // 현재시간과 설정시간 비교
                        if ( hours < parseInt(data.cronHour) ) {
                            return false;
                        }
                        else if ( hours === parseInt(data.cronHour) ) {
                            if (minutes <= parseInt(data.cronMinute)) {
                                return false;
                            }
                        }
                        else {
                            return;
                        }
                        retValue = tDate + ' ' + tTime + ':' + tMin;
                        return false;

                    } else if (currDay < parseInt(value)) {
                        today.setDate(today.getDate() + (parseInt(value) - currDay));
                        nextDate = new Date(today + 3240 * 10000).toISOString().split("T")[0];
                        return false;
                    }
                })
            }

            tTime = data.cronHour.length === 1 ? '0'+data.cronHour : data.cronHour;
            tMin = data.cronMinute.length === 1 ? '0'+data.cronMinute : data.cronMinute;

            retValue = nextDate + ' ' + tTime + ':' + tMin;

        } else if (data.cronType === "r_month" ) {

            tDate = year + '-' + month + '-' + '01';
            tTime = data.cronHour.length === 1 ? '0'+data.cronHour : data.cronHour;
            tMin = data.cronMinute.length === 1 ? '0'+data.cronMinute : data.cronMinute;
            retValue = tDate + ' ' + tTime + ':' + tMin;

            currDate = new Date(today + 3240 * 10000).toISOString().split("T")[0];
            currDate += (today.toTimeString().split(" ")[0]).substr(0,2);
            currDate += ':' + (today.toTimeString().split(" ")[0]).substr(3,2);

            if (currDate > retValue)   tDate = new Date(today.getFullYear(), today.getMonth() + 1, 2).toISOString().split("T")[0];

            retValue = tDate + ' ' + tTime + ':' + tMin;

        } else if (data.cronType === "r_frequency" ) {
            //반복실행
            stValue = ( parseInt(data.cronHour) * 60 + parseInt(data.cronMinute) ) * 60 * 1000;
            loopCnt = (1440 * 60 * 1000) / stValue;

            for (let i=0; i < loopCnt; i++) {
                compDate = new Date(Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)) + (3240 * 10000) + (i * stValue)).toISOString();
                currDate = new Date(Date.parse(new Date(today)) + (3240 * 10000)).toISOString();

                if (compDate > currDate) break;
            }

            retValue = compDate.split("T")[0] + ' ' + (compDate.split("T")[1]).substr(0,5);

        }

        var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += retValue;
        cell += '</div>';

        return cell;
    },
    getNextWeek: function () {
        var currentDay = new Date();
        var theYear = currentDay.getFullYear();
        var theMonth = currentDay.getMonth();
        var theDate  = currentDay.getDate();
        var theDayOfWeek = currentDay.getDay();

        for(var i=1; i<8; i++) {

            var resultDay = new Date(theYear, theMonth, theDate + (i - theDayOfWeek) + 7 );
            var yyyy = resultDay.getFullYear();
            var mm = Number(resultDay.getMonth()) + 1;
            var dd = resultDay.getDate();

            mm = String(mm).length === 1 ? '0' + mm : mm;
            dd = String(dd).length === 1 ? '0' + dd : dd;

            nextWeek[i-1] = yyyy + '-' + mm + '-' + dd;
        }

        //console.table(nextWeek);

    },

    /**
     * XSS Filter된 문자를 치환하는 함수
     * 치환문자: < (&lt;), > (&gt;), (&quot;)
     * 제외 : &amp; 의 경우 저장시문제 발생으로 제외 처리
     * @returns {String}
     */
    cellHtmlCharacterUnescapes: function (row, column, value) {
        var str = value.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>').replace(/\&quot\;/g, '"').replace(/\&rsquo\;/g, "'")
            .replace(/\<script\>/ig, '&lt;script&gt;').replace(/\<\/script\>/ig, '&lt;/script&gt;');

        var cell = '<div style="text-align: left; overflow: hidden; margin-top: 6.5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += str;
        cell += '</div>';
        return cell;
    },

    cellHtmlCharacterEscapes: function (row, column, value) {

        var str = value.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
        var cell = '<div style="text-align: left; overflow: hidden; margin-top: 6.5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += str;
        cell += '</div>';
        return cell;
    },

    refreshPage: function ($grid) {
        var dataInfo = $grid.jqxGrid('getdatainformation');
        var pageInfo = dataInfo.paginginformation;

        var total = dataInfo.rowscount;
        var startScope = 1 + (pageInfo.pagenum * pageInfo.pagesize);
        var endScope = Math.min(total, (pageInfo.pagenum + 1) * pageInfo.pagesize);

        $grid.find('.jqx-grid-pager-label').text(startScope + '-' + endScope + ' of ' + total);
    }

};


/**
 * jqxGrid export할때 functionName을 찾기위해 prototype.name을 지정해 둔다.
 * export시 컨버전이 필요한 렌더러는 아래 name을 지정한 후 서버단 ConvertUtil에 함수 추가필요.
 * @returns {string}
 */
HmGrid.unit1000renderer.prototype.name = function () {
    return 'unit1000renderer';
};
HmGrid.unit1024renderer.prototype.name = function () {
    return 'unit1024renderer';
};
HmGrid.evtLevelrenderer.prototype.name = function () {
    return 'evtLevelrenderer';
};
HmGrid.topoEvtLevelrenderer.prototype.name = function () {
    return 'topoEvtLevelrenderer';
};
HmGrid.healthChkrenderer.prototype.name = function () {
    return 'healthChkrenderer';
};
HmGrid.evtLevelFilterRenderer.prototype.name = function () {
    return 'evtLevelFilterRenderer';
};
HmGrid.healthChkFilterRenderer.prototype.name = function () {
    return 'healthChkFilterRenderer';
};
HmGrid.jobFlagrenderer.prototype.name = function () {
    return 'jobFlagrenderer';
};
HmGrid.jobLevelrenderer.prototype.name = function () {
    return 'jobLevelrenderer';
};
HmGrid.cTimerenderer.prototype.name = function () {
    return 'cTimerenderer';
};
HmGrid.milisecrenderer.prototype.name = function () {
    return 'milisecrenderer';
};
HmGrid.rownumrenderer.prototype.name = function () {
    return 'rownumrenderer';
};
HmGrid.usrStaterenderer.prototype.name = function () {
    return 'usrStaterenderer';
};
HmGrid.devKind1renderer.prototype.name = function () {
    return 'devKind1renderer';
};
HmGrid.snmpVerrenderer.prototype.name = function () {
    return 'snmpVerrenderer';
};
HmGrid.snmpSecurityLevelrenderer.prototype.name = function () {
    return 'snmpSecurityLevelrenderer';
};
HmGrid.snmpAuthTyperenderer.prototype.name = function () {
    return 'snmpAuthTyperenderer';
};
HmGrid.snmpEncryptTyperenderer.prototype.name = function () {
    return 'snmpEncryptTyperenderer';
};
HmGrid.progressbarrenderer.prototype.name = function () {
    return 'progressbarrenderer';
};
HmGrid.secretrenderer.prototype.name = function () {
    return 'secretrenderer';
};
HmGrid.evtLevelRenderer.prototype.name = function () {
    return 'evtLevelRenderer';
};
HmGrid.refreshPage.prototype.name = function () {
    return 'refreshPage';
};
