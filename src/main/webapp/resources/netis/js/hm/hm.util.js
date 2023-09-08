var HmUtil = {


    makeBeat: function (fileBeat, beat) {
        var totalBeat = '';
        totalBeat = fileBeat ? '1' : '0';
        totalBeat += beat ? '1' : '0';
        return parseInt(totalBeat, 2);
    },

    /** ping popup 호출 */
    showPingPopup: function (params) {

        // params : { mngNo :1 } or { devIp : '1.1.1.1'}

        if (params !== undefined || params !== '') {
            $.ajax({
                url: ctxPath + '/main/popup/nms/pPing.do',
                type: 'POST',
                data: JSON.stringify(params),
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    HmWindow.open($('#pwindow'), 'Ping', result, 610, 380);
                }
            });
        }

    },

    /** tracert popup 호출 */
    showTracertPopup: function (params) {

        // params : { mngNo :1 } or { devIp : '1.1.1.1'}

        if (params !== undefined || params !== '') {
            $.ajax({
                url: ctxPath + '/main/popup/nms/pTracert.do',
                type: 'POST',
                data: JSON.stringify(params),
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    HmWindow.open($('#pwindow'), 'Tracert', result, 610, 380);
                }
            });
        }
    },
    /** simple SNMP Query 호출 */
    showSimpleSnmpQueryPopup: function (params) {
        // params : { mngNo :1 }
        if (params !== undefined || params !== '') {
            HmUtil.createPopup(ctxPath + '/main/popup/com/pSnmpTester.do', $('#hForm'), 'pSnmpTester', 865, 308, params);
        }
    },

    /** window.open() 팝업 */
    showPopup: function (url, frm, popNm, popW, popH) {

        var host = location.hostname.replace(/\./g, '_');
        popNm = popNm + host;
        var opts = [];
        opts.push('width=' + popW);
        opts.push('height=' + popH);
        opts.push('left=' + parseInt((screen.availWidth / 2) - (popW / 2)));
        opts.push('top=' + parseInt((screen.availHeight / 2) - (popH / 2)));
        opts.push('resizable=yes');
        opts.push('scrollbars=yes');
        opts.push('status=no');

        var win = window.open('', popNm, opts.join(','));
        if (win != null && !win.closed)
            win.focus();
        frm.attr('method', 'POST');
        frm.attr('target', popNm);
        frm.attr('action', (ctxPath || '') + url);
        frm.submit();
        frm.empty();
        return win;
    },

    createPopup: function (url, frm, popNm, popW, popH, params) {
        frm.empty();
        if (params !== undefined) {
            $.each(params, function (key, value) {
                // console.log(key + '/' + value);
                $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
            });
        }

        return this.showPopup(url, frm, popNm, popW, popH);

    },

    createFullPopup: function (url, frm, popNm, params) {

        frm.empty();
        var host = location.hostname.replace(/\./g, '_');
        popNm = popNm + host;
        if (params !== undefined && params !== null) {
            $.each(params, function (key, value) {
                $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
            });
        }

        var opts = [];

        opts.push('fullscreen=yes');
        opts.push('resizable=yes');
        opts.push('scrollbars=yes');
        opts.push('status=no');

        window.open('', popNm, opts.join(',')).focus();
        frm.attr('method', 'POST');
        frm.attr('target', popNm);
        frm.attr('action', url);
        frm.submit();
        frm.empty();

    },

    /**
     * 차트를 서버에 저장(export폴더)한 후 파일명을 리턴함.
     * 엑셀에 차트를 삽입할때 사용!
     * @param chart    차트Object
     * @return 파일명
     */
    saveChart: function (chart) {
        var fname = $.format.date(new Date(), 'yyyyMMddHHmmssSSS') + '.png';
        chart.jqxChart('saveAsPNG', fname, ctxPath + '/file/saveChart.do', true);
        return fname;
    },

    /**
     * 차트를 png파일로 export
     * @param chart
     */
    exportChart: function (chart, fname) {
        chart.jqxChart('saveAsPNG', fname, ctxPath + '/file/exportChart.do');
    },

    /**
     * Highchart export
     */
    exportHighchart: function (chart, fname) {
        // try {
        //    var pwin = $('#p2window');
        //    if (pwin.length == 0) {
        //        pwin = $('<div id="p2window" style="position: absolute;"></div>');
        //        pwin.append($('<div></div>'));
        //        pwin.append($('<div></div>'));
        //        $('body').append(pwin);
        //    }
        //    HmWindow.create(pwin);
        // } catch (e) {
        // }
        //
        // $.post(ctxPath + '/main/popup/comm/pChartExportSetting.do',
        // 	function(result) {
        //        HmWindow.open($('#p2window'), '차트 크기 조정', result, 300, 150, 'p2window_init', {chart: chart, fname: fname});
        // 	}
        // );

        // chart export size를 조정하여 svg 추출
        var svg = chart.getSVG({
            exporting: {
                sourceWidth: chart.chartWidth,
                sourceHeight: chart.chartHeight
            }
        });
        var canvas = document.createElement('canvas');
        canvg(canvas, svg); //svg -> canvas draw
        var imgData = canvas.toDataURL("image/png"); // png이미지로 변환 후 octect-stream으로 변환

        this.sendHiddenForm('/file/exportHighchart.do', {fname: fname, imgData: imgData});
    },

    sendHiddenForm: function (url, params) {

        var frm = $('#hForm');
        frm.empty();
        if (params !== undefined && params !== null) {
            $.each(params, function (key, value) {
                $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
            });
        }
        frm.attr('method', 'POST');
        frm.attr('target', 'hFrame');
        frm.attr('action', url);
        frm.submit();
        frm.empty();

    },

    /**
     * Highchart를 png파일로 서버에 저장(export폴더)
     */
    saveHighchart: function (chart, afterFunc, params) {

        console.log(params);

        var fname = $.format.date(new Date(), 'yyyyMMddHHmmssSSS') + '.png';
        // chart export size를 조정하여 svg 추출
        var svg = chart.getSVG({
            exporting: {
                sourceWidth: chart.chartWidth,
                sourceHeight: chart.chartHeight
            }
        });
        var canvas = document.createElement('canvas');
        canvg(canvas, svg); //svg -> canvas draw
        var imgData = canvas.toDataURL("image/png"); // png이미지로 변환
        var ch_params = {fname: fname, imgData: imgData};
//			console.log("chart param = ",ch_params);
//			$.post('/file/saveHighchart.do', ch_params,
//					function(result) {
//				console.log(result);
//						if(afterFunc!=null)
//							afterFunc(params);
//					}
//			);

        Server.post('/file/saveHighchart.do', {
            data: ch_params,
            success: function (result) {
//					console.log(result);
                if (afterFunc != null) {//이미지 저장 후 바로 엑셀 출력시
                    console.log(fname);
                    params.imgFile = fname;
                    afterFunc(params);
                }
            }
        });

        return fname;
    },


    /**
     * Highchart를 png파일로 서버에 저장(export폴더)
     */
    saveMultiHighchart: function (chart, afterFunc, params) {

        var chartCount = chart.length;
        var svgList = [];
        var imgDataList = [];
        var fnameList = [];

        for (var i = 0; i < chartCount; i++) {

            var fname = $.format.date(new Date(), 'yyyyMMddHHmmssSSS') + '_' + i + '.png';
            fnameList.push(fname);

            var chartElem = chart[i];
            var svg = chartElem.highcharts().getSVG({
                exporting: {
                    sourceWidth: chartElem.highcharts().chartWidth,
                    sourceHeight: chartElem.highcharts().chartHeight
                }
            });

            svgList.push(svg);

            var canvas = document.createElement('canvas');
            canvg(canvas, svg);
            var imgData = canvas.toDataURL("image/png");
            imgDataList.push(imgData);
        }

        var ch_params = {fnames: fnameList, imgDatas: imgDataList};

        Server.post('/file/saveMultiHighchart.do', {
            data: ch_params,
            success: function (result) {

                if (afterFunc != null) {
                    console.log(fnameList);
                    params.imgFiles = fnameList;
                    afterFunc(params);
                }
            }
        });

        return fnameList;
    },

    /**
     * 엑셀 export
     * @param url
     * @param params
     */
    exportExcel: function (url, params) {

        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({isModal: false, width: 300, height: 70, theme: jqxTheme, text: '엑셀을 생성중입니다. 잠시만 기다려주세요.'});
        loader.jqxLoader('open');
        if (params == null) params = {};
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(params),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },

    /**
     * HTML export
     * @param url
     * @param params
     */
    exportHtml: function (url, params) {
        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({isModal: false, width: 300, height: 70, theme: jqxTheme, text: 'HTML을 생성중입니다. 잠시만 기다려주세요.'});
        loader.jqxLoader('open');
        if (params == null) params = {};
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(params),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },

    /** jqxGrid html export */
    exportGridHtml: function ($grid, filename, isAllExport) {
        if (filename === undefined) filename = $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
        if (isAllExport === undefined) isAllExport = true;

        var groups = $grid.jqxGrid('columnGroups');
        var headerGrps = [];
        //			console.log(groups);
        if (groups != null && groups.length > 0) {
            $.each(groups, function (idx, group) {
                var _colspan = 0;
                $.each(group.columns, function (gidx, gcol) {
                    if (!gcol.hidden) _colspan++;
                });
                headerGrps.push({text: group.text, name: group.name, colspan: _colspan});
            });
        }
        var records = $grid.jqxGrid('columns').records;
        var headers = [];
        // console.log(records);
        $.each(records, function (idx, record) {
            if (record.datafield == null || record.hidden) return;
            var _cellsrenderer = null;
            if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = record.cellsrenderer.prototype.name();
            }
            headers.push({
                text: record.text,
                columngroup: record.columngroup,
                datafield: record.displayfield != null ? record.displayfield : record.datafield,
                cellsrenderer: _cellsrenderer,
                width: record.width,
                columntype: record.columntype
            });
        });

        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({
            isModal: false,
            width: 300,
            height: 70,
            theme: jqxTheme,
            text: 'HTML을 생성중입니다. 잠시만 기다려주세요.'
        });
        loader.jqxLoader('open');

        $.ajax({
            type: 'post',
            url: '/file/exportGridHtml.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                filename: filename,
                // exportFormat: 'xls',
                headerGrps: headerGrps,
                header: headers,
                data: isAllExport ? $grid.jqxGrid('getboundrows') : $grid.jqxGrid('getdisplayrows')
            }),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },

    /** jqxGrid excel export */
    exportGrid: function ($grid, filename, isAllExport) {
        if (filename === undefined) filename = $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
        if (isAllExport === undefined) isAllExport = true;
        var groups = $grid.jqxGrid('columnGroups');
        var headerGrps = [];

        if (groups != null && groups.length > 0) {
            $.each(groups, function (idx, group) {
                var _colspan = 0;
                $.each(group.columns, function (gidx, gcol) {
                    if (!gcol.hidden) _colspan++;
                });
                headerGrps.push({text: group.text, name: group.name, colspan: _colspan});
            });
        }

        var records = $grid.jqxGrid('columns').records;
        var headers = [];
        // console.log(records);
        $.each(records, function (idx, record) {
            if (record.datafield == null || record.hidden) return;
            var _cellsrenderer = null;
            if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = record.cellsrenderer.prototype.name();
            }
            headers.push({
                text: record.text,
                columngroup: record.columngroup,
                datafield: record.displayfield != null ? record.displayfield : record.datafield,
                cellsrenderer: _cellsrenderer,
                width: record.width,
                columntype: record.columntype
            });
        });

        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({
            isModal: false,
            width: 300,
            height: 70,
            theme: jqxTheme,
            text: '엑셀을 생성중입니다. 잠시만 기다려주세요.'
        });

        var test = $grid.jqxGrid('getdisplayrows').filter(function (data) {
            return data != null
        });

        loader.jqxLoader('open');

        $.ajax({
            type: 'post',
            url: '/file/exportGrid.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                filename: filename,
                // exportFormat: 'xls',
                headerGrps: headerGrps,
                header: headers,
                data: isAllExport ? $grid.jqxGrid('getboundrows') : $grid.jqxGrid('getdisplayrows').filter(function (data) {
                    return data != null
                })
            }),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },


    /** jqxGrid excel export */
    exportGridSlm: function ($grid, filename, isAllExport, params) {
        if (filename === undefined) filename = $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
        if (isAllExport === undefined) isAllExport = true;
        var groups = $grid.jqxGrid('columnGroups');
        var headerGrps = [];

        if (groups != null && groups.length > 0) {
            $.each(groups, function (idx, group) {
                var _colspan = 0;
                $.each(group.columns, function (gidx, gcol) {
                    if (!gcol.hidden) _colspan++;
                });
                headerGrps.push({text: group.text, name: group.name, colspan: _colspan});
            });
        }

        var records = $grid.jqxGrid('columns').records;
        var headers = [];
        // console.log(records);
        $.each(records, function (idx, record) {
            if (record.datafield == null || record.hidden) return;
            var _cellsrenderer = null;
            if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = record.cellsrenderer.prototype.name();
            }
            headers.push({
                text: record.text,
                columngroup: record.columngroup,
                datafield: record.displayfield != null ? record.displayfield : record.datafield,
                cellsrenderer: _cellsrenderer,
                width: record.width,
                columntype: record.columntype
            });
        });

        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({
            isModal: false,
            width: 300,
            height: 70,
            theme: jqxTheme,
            text: '엑셀을 생성중입니다. 잠시만 기다려주세요.'
        });

        var test = $grid.jqxGrid('getdisplayrows').filter(function (data) {
            return data != null
        });

        loader.jqxLoader('open');

        $.ajax({
            type: 'post',
            url: '/main/nms/slmMgmt/exportGrid.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                filename: filename,
                // exportFormat: 'xls',
                headerGrps: headerGrps,
                header: headers,
                data: isAllExport ? $grid.jqxGrid('getboundrows') : $grid.jqxGrid('getdisplayrows').filter(function (data) {
                    return data != null
                }),
                calData: params
            }),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },


    /** jqxGrid excel export */
    exportMultiGrid: function ($grid, $grid2, filename, isAllExport, params) {

        if (filename === undefined) filename = $.format.date(new Date(), 'yyyyMMddHHmmssSSS');

        if (isAllExport === undefined) isAllExport = true;

        var groups = $grid.jqxGrid('columnGroups');
        var headerGrps = [];
        if (groups != null && groups.length > 0) {
            $.each(groups, function (idx, group) {
                var _colspan = 0;
                $.each(group.columns, function (gidx, gcol) {
                    if (!gcol.hidden) _colspan++;
                });
                headerGrps.push({text: group.text, name: group.name, colspan: _colspan});
            });
        }

        var records = $grid.jqxGrid('columns').records;
        var headers = [];
        // console.log(records);
        $.each(records, function (idx, record) {
            if (record.datafield == null || record.hidden) return;
            var _cellsrenderer = null;
            if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = record.cellsrenderer.prototype.name();
            }
            headers.push({
                text: record.text,
                columngroup: record.columngroup,
                datafield: record.displayfield != null ? record.displayfield : record.datafield,
                cellsrenderer: _cellsrenderer,
                width: record.width,
                columntype: record.columntype
            });
        });


        var groups2 = $grid2.jqxGrid('columnGroups');
        var headerGrps2 = [];
        if (groups2 != null && groups.length > 0) {
            $.each(groups2, function (idx, group) {
                var _colspan = 0;
                $.each(group.columns, function (gidx, gcol) {
                    if (!gcol.hidden) _colspan++;
                });
                headerGrps2.push({text: group.text, name: group.name, colspan: _colspan});
            });
        }

        var records2 = $grid2.jqxGrid('columns').records;
        var headers2 = [];
        // console.log(records);
        $.each(records2, function (idx, record) {

            if (record.datafield == null || record.hidden) return;
            var _cellsrenderer = null;

            if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = record.cellsrenderer.prototype.name();
            }

            headers2.push({
                text: record.text,
                columngroup: record.columngroup,
                datafield: record.displayfield != null ? record.displayfield : record.datafield,
                cellsrenderer: _cellsrenderer,
                width: record.width,
                columntype: record.columntype
            });
        });


        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({
            isModal: false,
            width: 300,
            height: 70,
            theme: jqxTheme,
            text: '엑셀을 생성중입니다. 잠시만 기다려주세요.'
        });

        loader.jqxLoader('open');

        $.ajax({
            type: 'post',
            url: '/main/nms/slmMgmt/exportMultiGrid.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                filename: filename,
                // exportFormat: 'xls',
                headerGrps: headerGrps,
                header: headers,
                headerGrps2: headerGrps2,
                header2: headers2,
                data: isAllExport ? $grid.jqxGrid('getboundrows') : $grid.jqxGrid('getdisplayrows').filter(function (data) {
                    return data != null
                }),
                data2: isAllExport ? $grid2.jqxGrid('getboundrows') : $grid2.jqxGrid('getdisplayrows').filter(function (data) {
                    return data != null
                }),
                calData: params
            }),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },

    /** jqxGrid excel export */
    exportGrid_Sla: function ($grid, filename, isAllExport, params) {

        if (filename === undefined) filename = $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
        if (isAllExport === undefined) isAllExport = true;

        var groups = $grid.jqxGrid('columnGroups');
        var headerGrps = [];
//			console.log(groups);
        if (groups != null && groups.length > 0) {
            $.each(groups, function (idx, group) {
                var _colspan = 0;
                $.each(group.columns, function (gidx, gcol) {
                    if (!gcol.hidden) _colspan++;
                });
                headerGrps.push({text: group.text, name: group.name, colspan: _colspan});
            });
        }
        var records = $grid.jqxGrid('columns').records;
        var headers = [];
        // console.log(records);
        $.each(records, function (idx, record) {
            if (record.datafield == null || record.hidden) return;
            var _cellsrenderer = null;
            if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = record.cellsrenderer.prototype.name();
            }
            headers.push({
                text: record.text,
                columngroup: record.columngroup,
                datafield: record.displayfield != null ? record.displayfield : record.datafield,
                cellsrenderer: _cellsrenderer,
                width: record.width,
                columntype: record.columntype
            });
        });

        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({
            isModal: false,
            width: 300,
            height: 70,
            theme: jqxTheme,
            text: '엑셀을 생성중입니다. 잠시만 기다려주세요.'
        });
        loader.jqxLoader('open');

        $.ajax({
            type: 'post',
            url: '/file/exportGrid_sla.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                filename: filename,

                slaImgFile: params.slaImg,
                wireImg: params.wireImg,
                areaImg: params.areaImg,
                groupImg: params.groupImg,

                // exportFormat: 'xls',
                headerGrps: headerGrps,
                header: headers,
                data: isAllExport ? $grid.jqxGrid('getboundrows') : $grid.jqxGrid('getdisplayrows').filter(function (data) {
                    return data != null
                })
            }),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },


    /** jqxGrid excel export */
    exportGridHour: function ($grid, filename, isAllExport, unit) {
        if (filename === undefined) filename = $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
        if (isAllExport === undefined) isAllExport = true;

        var groups = $grid.jqxGrid('columnGroups');

        var headerGrps = [];

//			console.log(groups);
        if (groups != null && groups.length > 0) {

            $.each(groups, function (idx, group) {
                var _colspan = 0;
                $.each(group.columns, function (gidx, gcol) {
                    if (!gcol.hidden) _colspan++;
                });

                if (group.parent == null) {
                    headerGrps.push({text: group.text, name: group.name, colspan: _colspan});
                } else {
                    headerGrps.push({
                        text: group.text,
                        name: group.name,
                        colspan: _colspan,
                        columngroup: group.parent.name
                    });
                }
            });
        }


        var records = $grid.jqxGrid('columns').records;
        var headers = [];
        // console.log(records);
        $.each(records, function (idx, record) {
            if (record.datafield == null || record.hidden) return;
            var _cellsrenderer = null;
            if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = record.cellsrenderer.prototype.name();
            }
            headers.push({
                text: record.text,
                columngroup: record.columngroup,
                datafield: record.displayfield != null ? record.displayfield : record.datafield,
                cellsrenderer: _cellsrenderer,
                width: record.width,
                columntype: record.columntype
            });
        });

        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({
            isModal: false,
            width: 300,
            height: 70,
            theme: jqxTheme,
            text: '엑셀을 생성중입니다. 잠시만 기다려주세요.'
        });

        loader.jqxLoader('open');

        $.ajax({
            type: 'post',
            url: '/file/exportGrid_hour.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                unit: unit,
                filename: filename,
                // exportFormat: 'xls',
                headerGrps: headerGrps,
                header: headers,
                data: isAllExport ? $grid.jqxGrid('getboundrows') : $grid.jqxGrid('getdisplayrows').filter(function (data) {
                    return data != null
                })
            }),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });

    },

    /** jqxGrid excel export */
    exportGridDaily: function ($grid, filename, isAllExport, unit) {

        if (filename === undefined) filename = $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
        if (isAllExport === undefined) isAllExport = true;

        var groups = $grid.jqxGrid('columnGroups');
        var headerGrps = [];

        if (groups != null && groups.length > 0) {

            $.each(groups, function (idx, group) {
                var _colspan = 0;
                $.each(group.columns, function (gidx, gcol) {
                    if (!gcol.hidden) _colspan++;
                });

                if (group.parent == null) {
                    headerGrps.push({text: group.text, name: group.name, colspan: _colspan});
                } else {
                    headerGrps.push({
                        text: group.text,
                        name: group.name,
                        colspan: _colspan,
                        columngroup: group.parent.name
                    });
                }
            });

        }


        var records = $grid.jqxGrid('columns').records;

        var headers = [];

        $.each(records, function (idx, record) {

            if (record.datafield == null || record.hidden) return;

            var _cellsrenderer = null;

            if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = record.cellsrenderer.prototype.name();
            }

            headers.push({
                text: record.text,
                columngroup: record.columngroup,
                datafield: record.displayfield != null ? record.displayfield : record.datafield,
                cellsrenderer: _cellsrenderer,
                width: record.width,
                columntype: record.columntype
            });

        });

        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }

        loader.jqxLoader({
            isModal: false,
            width: 300,
            height: 70,
            theme: jqxTheme,
            text: '엑셀을 생성중입니다. 잠시만 기다려주세요.'
        });


        // console.dir($grid.jqxGrid('getboundrows'));

        loader.jqxLoader('open');

        $.ajax({
            type: 'post',
            url: '/file/exportGrid_daily.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                unit: unit,
                filename: filename,
                // exportFormat: 'xls',
                headerGrps: headerGrps,
                header: headers,
                data: isAllExport ? $grid.jqxGrid('getboundrows') : $grid.jqxGrid('getdisplayrows').filter(function (data) {
                    return data != null
                })
            }),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });

    },


    /**
     *    1개 이상의 Grid를 Export할때 사용
     * @param gridArr    그리드 jquery객체 배열
     * @param gridTitleArr    각 그리드의 타이틀 배열
     * @param filename        Export 파일명
     * @param isAllExport    true일경우 필터 무시하고 전체 Export
     */
    exportGridList: function (gridArr, gridTitleArr, filename, isAllExport) {
        if (filename === undefined) filename = $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
        if (isAllExport === undefined) isAllExport = true;

        var exportList = [];
        for (var i = 0; i < gridArr.length; i++) {
            var $grid = gridArr[i];
            var subTitle = gridTitleArr[i];
            var groups = $grid.jqxGrid('columnGroups');
            var headerGrps = [];
            if (groups != null && groups.length > 0) {
                $.each(groups, function (idx, group) {
                    var _colspan = 0;
                    $.each(group.columns, function (gidx, gcol) {
                        if (!gcol.hidden) _colspan++;
                    });
                    headerGrps.push({text: group.text, name: group.name, colspan: _colspan});
                });
            }
            var records = $grid.jqxGrid('columns').records;
            var headers = [];
            // console.log(records);
            $.each(records, function (idx, record) {
                if (record.datafield == null || record.hidden) return;
                var _cellsrenderer = null;
                if (record.cellsrenderer != null && record.cellsrenderer.prototype.hasOwnProperty('name')) {
                    _cellsrenderer = record.cellsrenderer.prototype.name();
                }
                headers.push({
                    text: record.text,
                    columngroup: record.columngroup,
                    datafield: record.displayfield != null ? record.displayfield : record.datafield,
                    cellsrenderer: _cellsrenderer,
                    width: record.width,
                    columntype: record.columntype
                });
            });

            exportList.push({
                filename: subTitle,
                headerGrps: headerGrps,
                header: headers,
                data: isAllExport ? $grid.jqxGrid('getboundrows') : $grid.jqxGrid('getdisplayrows')
            });
        }

        try {
            var pwin = $('#p2window');
            if (pwin.length == 0) {
                pwin = $('<div id="p2window" style="position: absolute;"></div>');
                pwin.append($('<div></div>'));
                pwin.append($('<div></div>'));
                $('body').append(pwin);
            }
            HmWindow.create(pwin);
        } catch (e) {
        }

        // $.post(ctxPath + '/main/popup/comm/pExportSetting.do', function(result) {
        // HmWindow.open($('#p2window'), 'Export', result, 400, 200, 'p2window_init', {filename: filename, exportList: exportList});
        // });

        HmUtil.exportToServer('xls', {filename: filename, exportList: exportList});
    },

    exportToServer: function (format, param) {
        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({isModal: false, width: 300, height: 70, theme: jqxTheme, text: '파일을 생성중입니다. 잠시만 기다려주세요.'});
        loader.jqxLoader('open');

        param.exportFormat = format;

        $.ajax({
            type: 'post',
            url: '/file/exportGrid2.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(param),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },


    /** jqxGrid excel export */
    exportData: function (headerGrps, headers, data, filename) {
        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({isModal: false, width: 300, height: 70, theme: jqxTheme, text: '엑셀을 생성중입니다. 잠시만 기다려주세요.'});
        loader.jqxLoader('open');

        $.ajax({
            type: 'post',
            url: '/file/exportGrid.do',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                filename: filename,
                headerGrps: headerGrps,
                header: headers,
                data: data
            }),
            success: function (data, status) {
                loader.jqxLoader('close');
                if (data.hasError) {
                    alert(data.errorInfo.message);
                    return;
                }
                HmUtil.fileDown({filePath: data.resultData.filePath, fileName: data.resultData.fileName});
            }
        });
    },

    fileDown: function (params) {
        $('#hForm').empty();
        if (params !== undefined) {
            $.each(params, function (key, value) {
                $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo($('#hForm'));
            });
        }
        $('#hForm').attr('action', ctxPath + '/file/fileDown.do');
        $('#hForm').attr('method', 'post');
        $('#hForm').attr('target', 'hFrame');
        $('#hForm').submit();
    },

    showLoader: function (msg) {
        var loader = $('#comLoader');
        if (loader.length <= 0) {
            loader = $('<div id="comLoader" style="z-index: 100000"></div>');
            loader.appendTo('body');
        }
        loader.jqxLoader({isModal: false, width: 300, height: 70, theme: jqxTheme, text: msg || '잠시만 기다려주세요.'});
        loader.jqxLoader('open');
    },

    /**
     * 차트 데이터 보기
     * @param params {cols: [], chartData: []}
     * @param width
     * @param height
     */
    showChartData: function (params, width, height) {
        try {
            var pwin = $('#p2window');
            if (pwin.length == 0) {
                pwin = $('<div id="p2window" style="position: absolute;"></div>');
                pwin.append($('<div></div>'));
                pwin.append($('<div></div>'));
                $('body').append(pwin);
            }
            HmWindow.create(pwin);
        } catch (e) {
        }

        if (width == null) width = 600;
        if (height == null) height = 600;

        $.post(ctxPath + '/main/popup/comm/pChartDataList.do',
            function (result) {
                HmWindow.open($('#p2window'), '차트 데이터 리스트', result, width, height, 'p2window_init', params);
            }
        );
    },

    hideLoader: function () {
        var loader = $('#comLoader');
        if (loader.length > 0) {
            loader.jqxLoader('close');
        }
    },
    /**
     * MHz convert
     * @param value
     * @returns {String}
     */
    convertHz: function (value) {
        var retnVal = '';
        var result = '';
        if (value >= Math.pow(1000, 1)) {
            result = value / Math.pow(1000, 1);
            retnVal += result + "G";
        }
        else {
            result = value;
            retnVal += result + "M";
        }
        return retnVal;

    },

    /**
     * MHz convert
     * @param value
     * @returns Array[0]:value, Array[1]: Unit
     */
    convertSplitHz: function (value) {
        var retnVal = [];
        var result = '';
        var result = '';
        if (value >= Math.pow(1000, 1)) {
            result = value / Math.pow(1000, 1);
            retnVal.push(result);
            retnVal.push("G");
        }
        else {
            result = value;
            retnVal.push(result);
            retnVal.push("M");
        }
        return retnVal;
    },


    /**
     * Unit1000 convert
     * @param value
     * @returns {String}
     */
    convertUnit1000: function (value) {

        var retnVal = '';
        var result = '';

        if (value >= 0) {
            if (value >= Math.pow(1000, 4)) {
                result = Math.round((value / Math.pow(1000, 4)) * 100);
                retnVal += (result / 100) + "T";
            }
            else if (value >= Math.pow(1000, 3)) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal += (result / 100) + "G";
            }
            else if (value >= Math.pow(1000, 2)) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal += (result / 100) + "M";
            }
            else if (value >= Math.pow(1000, 1)) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal += (result / 100) + "K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += (result / 100) + "";
            }
        } else {
            value = -value;
            if (value >= Math.pow(1000, 4)) {
                result = Math.round((value / Math.pow(1000, 4)) * 100);
                retnVal += "- " + (result / 100) + "T";
            }
            else if (value >= Math.pow(1000, 3)) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal += "- " + (result / 100) + "G";
            }
            else if (value >= Math.pow(1000, 2)) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal += "- " + (result / 100) + "M";
            }
            else if (value >= Math.pow(1000, 1)) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal += "- " + (result / 100) + "K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += "- " + (result / 100) + "";
            }
        }
        return retnVal;
    },
    convertUnit1000UseTms: function (value) {

        var retnVal = '';
        var result = '';

        if (value >= 0) {
            if (value >= Math.pow(1000, 4)) {
                result = Math.round((value / Math.pow(1000, 4)) * 100);
                retnVal += (result / 100) + " T";
            }
            else if (value >= Math.pow(1000, 3)) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal += (result / 100) + " G";
            }
            else if (value >= Math.pow(1000, 2)) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal += (result / 100) + " M";
            }
            else if (value >= Math.pow(1000, 1)) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal += (result / 100) + " K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += (result / 100) + "";
            }
        } else {
            value = -value;
            if (value >= Math.pow(1000, 4)) {
                result = Math.round((value / Math.pow(1000, 4)) * 100);
                retnVal += "- " + (result / 100) + " T";
            }
            else if (value >= Math.pow(1000, 3)) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal += "- " + (result / 100) + " G";
            }
            else if (value >= Math.pow(1000, 2)) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal += "- " + (result / 100) + " M";
            }
            else if (value >= Math.pow(1000, 1)) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal += "- " + (result / 100) + " K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += "- " + (result / 100) + "";
            }
        }
        return retnVal;
    },
    /**
     * Unit1000 convert
     * @param value
     * @returns Array[0]:value, Array[1]: Unit
     */
    convertSplitUnit1000: function (value) {
        var retnVal = [];
        var result = '';
        if (value >= 0) {
            if (value >= Math.pow(1000, 4)) {
                result = Math.round((value / Math.pow(1000, 4)) * 100);
                retnVal.push((result / 100));
                retnVal.push("T");
            }
            else if (value >= Math.pow(1000, 3)) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal.push((result / 100));
                retnVal.push("G");
            }
            else if (value >= Math.pow(1000, 2)) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal.push((result / 100));
                retnVal.push("M");
            }
            else if (value >= Math.pow(1000, 1)) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal.push((result / 100));
                retnVal.push("K");
            }
            else {
                result = Math.round(value * 100);
                retnVal.push((result / 100));
                retnVal.push("");
            }
        }
        else {
            value = -value;
            if (value >= Math.pow(1000, 4)) {
                result = Math.round((value / Math.pow(1000, 4)) * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push(" ");
            }
            else if (value >= Math.pow(1000, 3)) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("G");
            }
            else if (value >= Math.pow(1000, 2)) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("M");
            }
            else if (value >= Math.pow(1000, 1)) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("K");
            }
            else {
                result = Math.round(value * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("");
            }
        }
        return retnVal;
    },
    /**
     * Unit1024 convert
     * @param value
     * @returns {String}
     */
    convertUnit1024: function (value) {
        var retnVal = '';
        var result = '';
        if (value >= 0) {
            if (value >= Math.pow(1024, 4)) {
                result = Math.round((value / Math.pow(1024, 4)) * 100);
                retnVal += (result / 100) + "T";
            }
            else if (value >= Math.pow(1024, 3)) {
                result = Math.round((value / Math.pow(1024, 3)) * 100);
                retnVal += (result / 100) + "G";
            }
            else if (value >= Math.pow(1024, 2)) {
                result = Math.round((value / Math.pow(1024, 2)) * 100);
                retnVal += (result / 100) + "M";
            }
            else if (value >= Math.pow(1024, 1)) {
                result = Math.round((value / Math.pow(1024, 1)) * 100);
                retnVal += (result / 100) + "K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += (result / 100) + "B";
            }
        }
        else {
            value = -value;
            if (value >= Math.pow(1024, 4)) {
                result = Math.round((value / Math.pow(1024, 4)) * 100);
                retnVal += "- " + (result / 100) + "T";
            }
            else if (value >= Math.pow(1024, 3)) {
                result = Math.round((value / Math.pow(1024, 3)) * 100);
                retnVal += "- " + (result / 100) + "G";
            }
            else if (value >= Math.pow(1024, 2)) {
                result = Math.round((value / Math.pow(1024, 2)) * 100);
                retnVal += "- " + (result / 100) + "M";
            }
            else if (value >= Math.pow(1024, 1)) {
                result = Math.round((value / Math.pow(1024, 1)) * 100);
                retnVal += "- " + (result / 100) + "K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += "- " + (result / 100);
            }
        }
        return retnVal;
    },
    /**
     * Unit1024 convert
     * @param value
     * @returns {String}
     */
    convertUnit1024Blank: function (value) {
        var retnVal = '';
        var result = '';
        if (value >= 0) {
            if (value >= Math.pow(1024, 4)) {
                result = Math.round((value / Math.pow(1024, 4)) * 100);
                retnVal += (result / 100) + " T";
            }
            else if (value >= Math.pow(1024, 3)) {
                result = Math.round((value / Math.pow(1024, 3)) * 100);
                retnVal += (result / 100) + " G";
            }
            else if (value >= Math.pow(1024, 2)) {
                result = Math.round((value / Math.pow(1024, 2)) * 100);
                retnVal += (result / 100) + " M";
            }
            else if (value >= Math.pow(1024, 1)) {
                result = Math.round((value / Math.pow(1024, 1)) * 100);
                retnVal += (result / 100) + " K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += (result / 100) + " ";
            }
        }
        else {
            value = -value;
            if (value >= Math.pow(1024, 4)) {
                result = Math.round((value / Math.pow(1024, 4)) * 100);
                retnVal += "- " + (result / 100) + " T";
            }
            else if (value >= Math.pow(1024, 3)) {
                result = Math.round((value / Math.pow(1024, 3)) * 100);
                retnVal += "- " + (result / 100) + " G";
            }
            else if (value >= Math.pow(1024, 2)) {
                result = Math.round((value / Math.pow(1024, 2)) * 100);
                retnVal += "- " + (result / 100) + " M";
            }
            else if (value >= Math.pow(1024, 1)) {
                result = Math.round((value / Math.pow(1024, 1)) * 100);
                retnVal += "- " + (result / 100) + " K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += "- " + (result / 100);
            }
        }
        return retnVal;
    },
    /**
     * Unit1024 convert
     * @param value
     * @returns Array[0]:value, Array[1]: Unit
     */
    convertSplitUnit1024: function (value) {
        var retnVal = [];
        var result = '';
        if (value >= 0) {
            if (value >= Math.pow(1024, 4)) {
                result = Math.round((value / Math.pow(1024, 4)) * 100);
                retnVal.push((result / 100));
                retnVal.push("T");
            }
            else if (value >= Math.pow(1024, 3)) {
                result = Math.round((value / Math.pow(1024, 3)) * 100);
                retnVal.push((result / 100));
                retnVal.push("G");
            }
            else if (value >= Math.pow(1024, 2)) {
                result = Math.round((value / Math.pow(1024, 2)) * 100);
                retnVal.push((result / 100));
                retnVal.push("M");
            }
            else if (value >= Math.pow(1024, 1)) {
                result = Math.round((value / Math.pow(1024, 1)) * 100);
                retnVal.push((result / 100));
                retnVal.push("K");
            }
            else {
                result = Math.round(value * 100);
                retnVal.push((result / 100));
                retnVal.push("B");
            }
        }
        else {
            value = -value;
            if (value >= Math.pow(1024, 4)) {
                result = Math.round((value / Math.pow(1024, 4)) * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("T");
            }
            else if (value >= Math.pow(1024, 3)) {
                result = Math.round((value / Math.pow(1024, 3)) * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("G");
            }
            else if (value >= Math.pow(1024, 2)) {
                result = Math.round((value / Math.pow(1024, 2)) * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("M");
            }
            else if (value >= Math.pow(1024, 1)) {
                result = Math.round((value / Math.pow(1024, 1)) * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("K");
            }
            else {
                result = Math.round(value * 100);
                retnVal.push("- " + (result / 100));
                retnVal.push("");
            }
        }
        return retnVal;
    },

    /**
     * Object 복제
     * @param obj
     * @returns
     */
    clone: function (obj) {
        if (obj == null || typeof(obj) != 'object') return obj;
        var newObj = obj.constructor();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = HmUtil.clone(obj[key]);
            }
        }
        return newObj;
    },

    /**
     * 초단위를 년/월/일/시/분/초 로 변환
     * @param value
     * @returns {String}
     */
    convertCTime: function (value) {
        // if(value === null) return '0초';
        var result = '';
        var time = value;
        var year, day, hour, min, result = '';
        if ((60 * 60 * 24 * 365) <= time) {
            year = Math.floor(time / (60 * 60 * 24 * 365));
            time = time - ((60 * 60 * 24 * 365) * year);
            result += year + '년 ';
        }
        if ((60 * 60 * 24) <= time) {
            day = Math.floor(time / (60 * 60 * 24));
            time = time - ((60 * 60 * 24) * day);
            result += day + '일 ';
        }
        if ((60 * 60) <= time) {
            hour = Math.floor(time / (60 * 60));
            time = time - ((60 * 60) * hour);
            result += hour + '시 ';
        }
        if (60 <= time) {
            min = Math.floor(time / 60);
            time = time - (60 * min);
            result += min + '분 ';
        }
        if (time != '' && time != 0) {
            // if (isNaN(time)) time = 0;
            if (time === null) time = 0;
            if (time < 0) time = 0;
            result += time + '초 ';
        }
        else {
            result += '0초';
        }
        return result;
    },

    /**
     * 밀리초를 년/월/일/시/분/초로 변환
     */
    convertMilisecond: function (value) {
        return this.convertCTime(Math.ceil(value / 1000));
    },

    /**
     * IP to Long
     * @param value
     * @returns
     */
    convertIpToLong: function (value) {
        var d = value.split('.');
        return ((((((+d[0]) * 256) + (+d[1])) * 256) + (+d[2])) * 256) + (+d[3]);
    },

    /**
     * Long to IP
     * @param value
     * @returns
     */
    convertLongToIp: function (value) {
        var d = value % 256;
        for (var i = 3; i > 0; i--) {
            value = Math.floor(value / 256);
            d = value % 256 + '.' + d;
        }
        return d;
    },

    /**
     * subnet decimal을 ip로 변환한다. (ex: IP가 10.0.0.0/8인 경우 파라미터는 8, IP로 변환하면 255.0.0.0)
     * @param value
     * @returns {number}
     */
    convertSubnetToIp: function (value) {
        return (~0 << (32 - value)) >>> 0;
    },

    calcIpRangeFromAddrAndNetmask: function (str) {
        var part = str.split("/"); // part[0] = base address, part[1] = netmask
        var ipaddress = part[0].split('.');
        var netmaskblocks = ["0", "0", "0", "0"];
        if (!/\d+\.\d+\.\d+\.\d+/.test(part[1])) {
            // part[1] has to be between 0 and 32
            netmaskblocks = ("1".repeat(parseInt(part[1], 10)) + "0".repeat(32 - parseInt(part[1], 10))).match(/.{1,8}/g);
            netmaskblocks = netmaskblocks.map(function (el) {
                return parseInt(el, 2);
            });
        } else {
            // xxx.xxx.xxx.xxx
            netmaskblocks = part[1].split('.').map(function (el) {
                return parseInt(el, 10)
            });
        }
        var invertedNetmaskblocks = netmaskblocks.map(function (el) {
            return el ^ 255;
        });
        var baseAddress = ipaddress.map(function (block, idx) {
            return block & netmaskblocks[idx];
        });
        var broadcastaddress = ipaddress.map(function (block, idx) {
            return block | invertedNetmaskblocks[idx];
        });
        return [baseAddress.join('.'), broadcastaddress.join('.')];
    },

    /**
     * Event Level to Custom Event Name
     * @param value
     * @returns
     */
    convertEvtLevelToEvtName: function (value) {
        if (value === null) return '';
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
                return value.toString();
        }
    },

    /**
     * 천단위 콤마 함수        1000000 => 1,000,000
     */
    commaNum: function (num) {
        var len, point, str;
        num = num + "";
        point = num.length % 3;
        len = num.length;
        str = num.substring(0, point);
        while (point < len) {
            if (str != "") str += ",";
            str += num.substring(point, point + 3);
            point += 3;
        }
        return str;
    },

    /**
     * UUID생성
     * @returns
     */
    generateUUID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },

    /**
     * <option> 태그 동적생성
     * @param objSelect
     * @param data
     */
    createOptionTag: function (objSelect, data, strLabelField, strValueField) {
        if (data == null || data.length == 0) {
            objSelect.empty();
            return;
        }

        if (strLabelField === undefined) strLabelField = "label";
        if (strValueField === undefined) strValueField = "value";

        var options = '';
        for (var i = 0; i < data.length; i++) {
            options += "<option value='" + data[i][strValueField] + "'>" + data[i][strLabelField] + "</option>";
        }

        objSelect.html(options);
    },

    // 파일 첨부 목록 DOM 구성.
    attachFileList: function (returnData, flag, elementName) {
        var eleName = elementName == undefined ? "attachFileList" : elementName;
        var divEle = document.getElementById(eleName);

        if (divEle == null || divEle == undefined)
            return;

        var ulEle = document.createElement("ul");

        var i = 0;
        var cycleN = returnData.length;

        for (; i < cycleN; i++) {
            var liEle = document.createElement("li");
            var newDivEle = document.createElement("div");

            var aEle = document.createElement("a");
            aEle.setAttribute("href", ctxPath + "/file/download.do?fileNo=" + returnData[i].fileNo);
            aEle.innerHTML = returnData[i].originalFileName;

            newDivEle.appendChild(aEle);
            if (flag) {
                var aEle2 = document.createElement("a");
                aEle2.setAttribute("id", "fileNo" + returnData[i].fileNo);
                // aEle2.setAttribute("href", ctxPath + "/file/delete.do?fileNo=" + returnData[i].fileNo);
                aEle2.setAttribute("href", "#");
                aEle2.innerHTML = "&nbsp;<img src='../../img/popup/cancel_icon.png' >";
                newDivEle.appendChild(aEle2);
            }

            liEle.appendChild(newDivEle);
            divEle.appendChild(ulEle.appendChild(liEle));

            // X 버튼에 이벤트 등록..
            var _fileNo = returnData[i].fileNo;

            var clickEventElement = document.getElementById("fileNo" + _fileNo);

            // 파일 다운로드만 할경우는 id가 없어서 넘어간다...
            if (clickEventElement === null || clickEventElement === undefined)
                continue;

            clickEventElement.onclick = function () {
                var removeFileId = this.getAttribute('id').replace(/[^0-9]/g, "");
                $.ajax({
                    type: "post",
                    url: $('#ctxPath').val() + '/file/delete.do',
                    data: {
                        fileNo: this.getAttribute('id').replace(/[^0-9]/g, "")
                    },
                    dataType: "json",
                    success: function (jsonData) {
                        // var searchElement = document.getElementById("fileNo" + removeFileId);
                        // searchElement.parentNode.removeChild(searchElement);
                        document.getElementById("fileNo" + removeFileId).parentNode.parentNode.removeChild(document.getElementById("fileNo" + removeFileId).parentNode)
                    }
                });
            }
        }
    },


    // 파일 첨부 목록 DOM 구성.
    attachFileList_evt: function (returnData, flag, elementName) {

        var eleName = elementName == undefined ? "attachFileList" : elementName;
        var divEle = document.getElementById(eleName);

        if (divEle == null || divEle == undefined)
            return;

        var ulEle = document.createElement("ul");

        var i = 0;
        var cycleN = returnData.length;

        for (; i < cycleN; i++) {
            var liEle = document.createElement("li");
            var newDivEle = document.createElement("div");

            var aEle = document.createElement("a");
            aEle.setAttribute("href", ctxPath + "/file/downloadEvtDb.do?fileNo=" + returnData[i].fileNo);
            aEle.innerHTML = returnData[i].originalFileName;

            newDivEle.appendChild(aEle);
            if (flag) {
                var aEle2 = document.createElement("a");
                aEle2.setAttribute("id", "fileNo" + returnData[i].fileNo);
                // aEle2.setAttribute("href", ctxPath + "/file/delete.do?fileNo=" + returnData[i].fileNo);
                aEle2.setAttribute("href", "#");
                aEle2.innerHTML = "&nbsp;<img src='../../img/popup/cancel_icon.png' >";
                newDivEle.appendChild(aEle2);
            }

            liEle.appendChild(newDivEle);
            divEle.appendChild(ulEle.appendChild(liEle));

            // X 버튼에 이벤트 등록..
            var _fileNo = returnData[i].fileNo;

            var clickEventElement = document.getElementById("fileNo" + _fileNo);

            // 파일 다운로드만 할경우는 id가 없어서 넘어간다...
            if (clickEventElement === null || clickEventElement === undefined)
                continue;

            clickEventElement.onclick = function () {
                var removeFileId = this.getAttribute('id').replace(/[^0-9]/g, "");
                $.ajax({
                    type: "post",
                    url: $('#ctxPath').val() + '/file/deleteEvtDb.do',
                    data: {
                        fileNo: this.getAttribute('id').replace(/[^0-9]/g, "")
                    },
                    dataType: "json",
                    success: function (jsonData) {
                        // var searchElement = document.getElementById("fileNo" + removeFileId);
                        // searchElement.parentNode.removeChild(searchElement);
                        document.getElementById("fileNo" + removeFileId).parentNode.parentNode.removeChild(document.getElementById("fileNo" + removeFileId).parentNode)
                    }
                });
            }
        }
    },


    attachFileListByUrl: function (returnData, flag, elementName, downloadUrl, deleteUrl) {
        var eleName = elementName == undefined ? "attachFileList" : elementName;
        var divEle = document.getElementById(eleName);

        var i = 0;
        var cycleN = returnData.length;

        var div = '<div style="border: 1px solid #eeeeee;margin-top: 3px">';
        for (; i < cycleN; i++) {
            var _href = downloadUrl + "?fileNo=" + returnData[i].fileNo;
            var html = '<li style="border-bottom: 1px solid #eeeeee"><div style="padding:3px">';
            html += '<a href="' + _href + '" style="text-decoration-line: none;font-size: 13px;color: #878787;height: 21px;line-height: 21px;margin-left:3px">' + returnData[i].originalFileName + '</a>';
            if (flag) {
                html += '<a href="#" id="fileNo' + returnData[i].fileNo + '">';
                html += '<button onclick="HmUtil.deleteFile(' + returnData[i].fileNo + ' ,\'' + deleteUrl + '\')" style="background:#A8352F;color: white;border-radius: 5px;height: 21px;width: 36px;font-size: 11px;float: right">삭제</button></a>'
            }
            html += '</div></li>';

            div += html;
        }
        div += '</div>';
        $(divEle).append(div);
    },

    deleteFile: function (fileNo, url) {
        if (!confirm('삭제하시겠습니까? 삭제 후, 복구가 불가능합니다.')) return;

        Server.post(url, {
            data: {fileNo: fileNo},
            success: function () {
                document.getElementById("fileNo" + fileNo).parentNode.parentNode.removeChild(document.getElementById("fileNo" + fileNo).parentNode)
            }
        })
    },
    /**
     * 글자를 원하는 카운트로 잘라서 리턴한다.
     * @param value
     * @param charCnt
     * @returns
     */
    substr: function (value, charCnt) {
        if (value === null || value.isBlank()) return "";
        if (value.length > charCnt) {
            return value.substring(0, charCnt) + '...';
        }
        else {
            return value;
        }
    },

    toggleFullScreen: function () {
        var isFullScreen = 'N';
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen(); // Firefox
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(); // Chrome and Safari
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen(); // IE11 이상 지원
            }
            isFullScreen = 'Y';
            //Toggle fullscreen on, exit fullscreen
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            isFullScreen = 'N'
        }
        return isFullScreen;
    },

    getScreenMode: function () {
        return (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) ? false : true;
    },

    /**
     * 실행파일 확장자 체크
     * @param ext
     * @returns {boolean}
     */
    checkExecFileExt: function (ext) {
        var chkExt = ext.toLowerCase();
        var execExt = ['exe', 'cmd', 'bat', 'com', 'sh'];
        if ($.inArray(chkExt, execExt) !== -1) {
            alert('[{0}]는 지원하지 않는 형식입니다.'.substitute(chkExt));
            return false;
        } else return true;

    },

    /** Clipboard Copy
     */
    copyToClipboard: function (copyText) {
        try {
            var element = document.createElement('input');
            element.value = copyText;
            document.body.appendChild(element);
            element.select();
            document.execCommand('copy');
            document.body.removeChild(element);
        } catch (e) {
            console.error(e);
        }
    },

    /*setDtlValue: function(_id, value, str, afterElement, cn, ct){
		if(value){
			$('#'+_id).removeClass('nonInfo');
			$('#'+_id).attr('class', 'sumData');
			$('#'+_id + ' + span.sumUnit').show();
			$('#'+_id).text(value)
			if(str !== undefined){
				// $('#'+_id).after(str);
			}
		}else{
			$('#'+_id + ' + span.sumUnit').hide();
			if(cn !== undefined && ct !== undefined){
				$('#'+_id).attr('class', cn);
				$('#'+_id).text(ct);
			}else{
				$('#'+_id).attr('class', 'nonInfo');
				$('#'+_id).text('정보없음');
			}
		}
	},*/
    setDtlValue: function (_id, value) {
        $('#' + _id + ' ~ span.nonInfo').hide();
        if (value && value != null && value != '') {
            $('#' + _id + ' ~ span.sumUnit').show();
            $('#' + _id).text(value)
        } else {
            $('#' + _id).text('');
            if ($("#" + _id + " ~ span:last").length > 0) {
                // $('#' + _id + ' ~ span:last').after($('<span class="nonInfo2">정보<br/>없음</span>'));
                $('#' + _id + ' ~ span:last').after($('<span class="nonInfo">정보없음</span>'));
            } else {
                // $('#' + _id).after($('<span class="nonInfo2">정보<br/>없음</span>'));
                $('#' + _id).after($('<span class="nonInfo">정보없음</span>'));
            }
            $('#' + _id + ' ~ span.sumUnit').hide();
        }
    },
    setDtlValueUnit: function (_id, value) {
        if (value) {
            $('#' + _id).text(value[0])
            $('#' + _id + ' ~ span.sumUnit').text(value[1]);
        } else {
            $('#' + _id + ' ~ span.sumUnit').attr('class', 'nonInfo');
        }
    },
    setDtlStatus: function (_id, value) {
        if (value) {
            var _color = '';

            $('#' + _id + ' ~ span.nonInfo').hide();
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
            $('#' + _id).text(value);
            $('#' + _id).css('background', _color);
        } else {
            $('#' + _id + ' ~ span.nonInfo').show();
        }
    },

    setFmsIcon: function (sensorKind) {
        var imgPath = '/img/defaultIcon.svg';
        /* sensorKind로 바꿔라..*/

        switch (sensorKind) {
            case 'UPS':
                imgPath = '/img/batteryIcon.svg';
                break;
            case 'HVAC':
                imgPath = '/img/tmsIcon.svg';
                break;
            case 'TE/HU':
                imgPath = '/img/thermoIcon.svg';
                break;
            case 'POWER':
                imgPath = '/img/powerIcon.svg';
                break;
            case 'Leak':
            case 'LEAK_LINE':
                imgPath = '/img/leakIcon.svg';
                break;
            case 'DOOR':
                imgPath = '/img/doorIcon.svg';
                break;
            case 'FIRE':
                imgPath = '/img/fireIcon.svg';
                break;
            case 'RELAY':
                imgPath = '/img/relayIcon.svg';
                break;
        }
        //
        // if(sensorName.indexOf('소방') == 0){
        // 	sensorName = '소방';
        // }else if(sensorName.indexOf('온습도계') == 0){
        // 	sensorName = '온습도계';
        // }else if(sensorName.indexOf('항온항습기') == 0){
        // 	sensorName = '항온항습기';
        // }else if(sensorName.indexOf('분전반') == 0){
        // 	sensorName = '분전반';
        // }else if(sensorName.indexOf('UPS') == 0){
        // 	sensorName = 'UPS';
        // }
        //
        // switch(sensorName){
        // 	case '누수': case 'Leak':
        // 		imgPath = '/img/leakIcon.svg';
        // 		break;
        // 	case '화재': case 'Fire':
        // 		imgPath = '/img/fire2Icon.svg';
        // 		break;
        // 	case '출입문': case 'Door':
        // 		imgPath = '/img/doorIcon.svg';
        // 		break;
        // 	case '소방':
        // 		imgPath = '/img/fireIcon.svg';
        // 		break;
        // 	case '항온항습기':
        // 		imgPath = '/img/tmsIcon.svg';
        // 		break;
        // 	case '온습도계': case 'Te/Hu':
        // 		imgPath = '/img/thermoIcon.svg';
        // 		break;
        // 	case '배터리':
        // 		imgPath = '/img/batteryIcon.svg';
        // 		break;
        // 	case 'CCTV':
        // 		imgPath = '/img/cctvIcon.svg';
        // 		break;
        // 	case '분전반':
        // 		imgPath = '/img/panelboardIcon.svg';
        // 		break;
        // 	case 'PDU':
        // 		imgPath = '/img/pduIcon.svg';
        // 		break;
        // 	case '전력': case '전기':
        // 		imgPath = '/img/powerIcon.svg';
        // 		break;
        // 	case 'relayIcon':
        // 		imgPath = '/img/relayIcon.svg';
        // 		break;
        // 	case 'RTU':
        // 		imgPath = '/img/rtuIcon.svg';
        // 		break;
        // 	case 'UPS':
        // 		imgPath = '/img/upsIcon.svg';
        // 		break;
        // }


        return imgPath;
    },

    getEvtLevelColor: function (evtLevel) {
        var evtColor = '#6ebf67';
        switch (evtLevel) {
            case 0:
                evtColor = $('#gEvtNormal').val();
                break;
            case 1:
                evtColor = $('#gEvtInfo').val();
                break;
            case 2:
                evtColor = $('#gEvtWarning').val();
                break;
            case 3:
                evtColor = $('#gEvtMinor').val();
                break;
            case 4:
                evtColor = $('#gEvtMajor').val();
                break;
            case 5:
                evtColor = $('#gEvtCritical').val();
                break;
        }
        return evtColor;
    },

    switchType: '',
    /** show & hide 처리. */
    switchDisplay: function ($id) {
        var status = $id.css('display');
        if (status === 'none') $id.show();
        else $id.hide();
    },

    switchDisplayByType: function ($id, type) {
        if ($.isBlank(HmUtil.switchType)) HmUtil.switchType = type;
        if (HmUtil.switchType !== type) {
            HmUtil.switchDisplay($id);
            HmUtil.switchType = type;
        }
    },

    /**
     * @param value  모든 값
     *  값 유무 및 undefined 체크
     */
    getValidateCheck: function (value) {
        if (value && value !== undefined) return true;
        else return false;

    },

    /**
     * @param period  값
     *  period 값에 따른 dateFormat
     */
    getPeriodDateFormat: function (value) {
        if (value === '1' || value === '-1') return '%m-%d %H:%M';
        else if (value === '7') return '%Y-%m-%d %H';
        else if (value === '30') return '%Y-%m-%d';
        else if (value === '365') return '%Y-%m-%d';

    },

}; //HmUtil end

/** elastic search */
var ES = {
    defaultParam: {format: 'json'},
    connect: function (param) {
        var eshost = {
            host: $('#gEsIp').val() + ':' + $('#gEsPort').val(),
            log: 'info'
        };
        param = $.extend(eshost, param);
        return new elasticsearch.Client(param);
    },
    /** connection 객체 확인 */
    checkConn: function (conn) {
        if (conn === undefined || conn === null)
            conn = ES.connect(null);
        return conn;
    },
    ping: function (conn, param, callback) {
        conn = this.checkConn(conn);
        var pingParam = {
            requestTimeout: Infinity
        };
        conn.ping($.extend(pingParam, param), callback);
        return conn;
    },
    search: function (conn, param, callback) {
        conn = this.checkConn(conn);
        conn.search(param, callback);
    },

    /** cat */
    catHealth: function (conn, param, callback) {
        conn = this.checkConn(conn);
        conn.cat.health($.extend(this.defaultParam, param), callback);
    },
    catIndices: function (conn, param, callback) {
        conn = this.checkConn(conn);
        conn.cat.indices($.extend(this.defaultParam, param), callback);
    },

};

/** ajax call */
var Server = (function () {
    return {
        post: function (url, params) {
            Server.ajax(url, 'post', params);
        },
        get: function (url, params) {
            Server.ajax(url, 'get', params);
        },
        ajax: function (url, method, params) {

            var ajaxOpts = {
                type: method.toUpperCase(),
                url: ctxPath + url,
                dataType: 'json',
                beforeSend: function (xmlHttpRequest) {
                    xmlHttpRequest.setRequestHeader('AJAX', 'true');
                },
                success: function (data, status) {
//						if($('body').hasClass('wait')) $('body').removeClass('wait');
                    if (data.hasError) {
                        if (params.error !== undefined) {
                            params.error(data);
                        }
                        else {
                            alert(data.errorInfo.message);
                        }
                        return;
                    }
                    if (params.success !== undefined) {
                        params.success(data.resultData, this.data);
                    }
                },
                error: function (xhr) {
                    // console.log(xhr);
                    if (xhr.status == 400) {
                        location.href = ctxPath + '/login.do';
                    } else {
                        //						if($('body').hasClass('wait')) $('body').removeClass('wait');
                        //alert('처리 중 에러가 발생하였습니다.');
                        if (params.error !== undefined) {
                            params.error(xhr);
                        } else {
                            alert('처리 중 에러가 발생하였습니다.');
                        }
                    }
                }
            };
            if (method === 'post') {
                try {
                    if (params.data) ajaxOpts.data = JSON.stringify(params.data);
                    var o = params.data;
                    if (o && typeof o === 'object' && o !== null) {
                        ajaxOpts.contentType = 'application/json; charset=utf-8';
                    }
                } catch (e) {
                }
            }
            else {
                if (params.data) ajaxOpts.data = params.data;
            }
            return $.ajax($.extend(ajaxOpts, params.options));
        }
    };
})();

/** ajax call */
var Server_external = (function () {
    return {
        post: function (url, params) {
            Server_external.ajax(url, 'post', params);
        },
        get: function (url, params) {
            Server_external.ajax(url, 'get', params);
        },
        ajax: function (url, method, params) {

            var ajaxOpts = {
                type: method.toUpperCase(),
                url: url,
                dataType: 'json',
                beforeSend: function (xmlHttpRequest) {
                    xmlHttpRequest.setRequestHeader('AJAX', 'true');
                },
                success: function (data, status) {
//						if($('body').hasClass('wait')) $('body').removeClass('wait');
                    if (data.hasError) {
                        if (params.error !== undefined) {
                            params.error(data);
                        }
                        else {
                            alert(data.errorInfo.message);
                        }
                        return;
                    }
                    if (params.success !== undefined) {
                        params.success(data, this.data);
                    }
                },
                error: function (xhr) {
                    // console.log(xhr);
                    if (xhr.status == 400) {
                        location.href = ctxPath + '/login.do';
                    } else {
                        //						if($('body').hasClass('wait')) $('body').removeClass('wait');
                        //alert('처리 중 에러가 발생하였습니다.');
                        if (params.error !== undefined) {
                            params.error(xhr);
                        } else {
                            alert('처리 중 에러가 발생하였습니다.');
                        }
                    }
                }
            };
            if (method === 'post') {
                try {
                    if (params.data) ajaxOpts.data = JSON.stringify(params.data);
                    var o = params.data;
                    if (o && typeof o === 'object' && o !== null) {
                        ajaxOpts.contentType = 'application/json; charset=utf-8';
                    }
                } catch (e) {
                }
            }
            else {
                if (params.data) ajaxOpts.data = params.data;
            }
            return $.ajax($.extend(ajaxOpts, params.options));
        }
    };
})();


/**
 * CtxMenu.DEV        :    mngNo, devName, disDevName, devIp
 * CtxMenu.IF        :    mngNo, ifIdx, devName, disDevName, devIp, ifName, ifAlias
 * CtxMenu.ALARM    :    seqNo
 * CtxMenu.ALARM_HIST    : seqNo
 * CtxMenu.SVR        :    svrNo
 * CtxMenu.AP        :    apNo
 * CtxMenu.AP_CLIENT    :    apNo, apIdx, connId
 */
var CtxMenu = {
    NONE: 'none',	//없음
    COMM: 'comm', //공통
    DEV: 'dev',
    IF: 'if',
    SVR: 'svr',
    VSVR: 'vsvr',
    VM: 'vm',
    VSVR_NUTANIX: 'vsvr_nutanix',
    VM_NUTANIX: 'vm_nutanix',
    APC: 'apc',
    AP: 'ap',
    DEV10: 'dev10',
    AP_CLIENT: 'apClient',
    SYSLOG: 'syslog',
    SYSLOG_MGMT: 'syslogMgmt',
    L4: 'l4',
    L4_ALTEON: 'l4Alteon',
    L4_F5_VIRTUAL: 'l4F5Virtual',
    L4_F5_REAL: 'l4F5Real',
    L4_F5_TRUNK: 'l4F5Trunk',
    L4_F5_IF: 'l4F5If',
    STARCELL_SVR: 'starcellSvr',
    DOS_EVT: 'dosEvt',
    GRP_DETAIL: 'grpDetail',
    RACK: 'rackDetail',
    TOPO_ERR_ACTION_GRID: 'errAction',
    TICKET: 'evtTicket',
    SECT: 'sectPerf',
    DEV_ROUTE_MONIT: 'devRouteMonit',
    TRAP: 'trap',
    QC_SLA: 'qcSla',

    KTG: 'ktg',
    YS_SVR_PROC: 'ysSvrProc',
    AVAYA_PHONE_MONITOR: 'avayaPhoneMonitor',
    ALONE_UPS: 'aloneUps',

    WAS: 'was',
    DBMS: 'dbms',
    CALL_PERF: 'callPerf',
    AUTO_CMD: 'autoCmd',
    AUTO_CMD_HIST: 'autoCmdHist',
    AUTO_CMD_HIST_DETAIL: 'autoCmdHistDetail',

    //섹타나인
    L4_F5_PIOLINK_VIRTUAL: 'l4F5PiolinkVirtual',
    L4_F5_PIOLINK_REAL: 'l4F5PiolinkReal',

    //사용자 설정(일괄설정)
    USER_CONF_BATCH_SET: 'userConfBatchSet',

    //개별임게치 일괄 설정
    EACH_LIMIT_BATCH_SET: 'eachLimitBatchSet',

    TEST: 'test',

    //FMS 센서
    FMS_SENSOR: 'fmsSensor',

    //TMS 실시간 트래픽 모니터링 이벤트 해제
    RTMS: 'cmTmsRtTrafficEvtStop',

    //응답시간
    RESTIME: 'restime',

    /**기본highchart*/
    createHighchart: function (chart, type, idx) {
        //pwindow체크
        if (type === CtxMenu.NONE) return;
        if (idx === null) idx = '';
        var menu = $('<div id="ctxmenu_' + type + idx + '"></div>');
        var ul = $('<ul></ul>');
        ul = CtxMenu.getMenu(ul, type);
        menu.append(ul).appendTo('body');

        //차트이벤트처리
        var context = {
            plotOptions: {
                series: {
                    events: {
                        click: function (point) {
                            menu.jqxMenu('close');
                        },
                        contextmenu: function (point) {
                            console.log("point", point);
                            if (type === CtxMenu.DEV10) {
                                chart.ctxData = point;
                                $("#ctxmenu_" + type + idx).remove();
                                menu = $('<div id="ctxmenu_' + type + idx + '"></div>');
                                ul = $('<ul></ul>');
                                if (chart.ctxData.srcElement.point.devKind1 === 'SVR')
                                    ul = CtxMenu.getMenu(ul, CtxMenu.SVR);
                                else if (chart.ctxData.srcElement.point.devKind1 === 'DEV')
                                    ul = CtxMenu.getMenu(ul, CtxMenu.DEV);
                                menu.append(ul).appendTo('body');
                                menu.jqxMenu({
                                    width: 200,
                                    autoOpenPopup: false,
                                    mode: 'popup',
                                    theme: jqxTheme,
                                    popupZIndex: 99999
                                })
                                    .on('itemclick', function (event) {
                                        CtxMenu.itemClick($(event.args)[0].id, chart, 'highchart');
                                    });
                            }
                            else {
                                chart.ctxData = point;
                                $("#ctxmenu_" + type + idx).remove();
                                menu = $('<div id="ctxmenu_' + type + idx + '"></div>');
                                ul = $('<ul></ul>');
                                ul = CtxMenu.getMenu(ul, type);
                                menu.append(ul).appendTo('body');
                                menu.jqxMenu({
                                    width: 200,
                                    autoOpenPopup: false,
                                    mode: 'popup',
                                    theme: jqxTheme,
                                    popupZIndex: 99999
                                })
                                    .on('itemclick', function (event) {
                                        CtxMenu.itemClick($(event.args)[0].id, chart, 'highchart');
                                    });
                            }

                            menu.jqxMenu('open', point.clientX, point.clientY);
                        }
                    }
                }
            },
            chart: {
                events: {
                    click: function (event) {
                        menu.jqxMenu('close');
                    }
                }
            }
        };

        chart.update(context);

        //차트 더블클릭 이벤트 처리 (미구현 시) ---- 개선필요
        if (chart.options.plotOptions.series.events.dblclick === undefined) {
            if (type === CtxMenu.SVR) {
                context = {
                    plotOptions: {
                        series: {
                            events: {
                                dblclick: function (point) {
                                    chart.ctxData = point;
                                    CtxMenu.itemClick('cm_svr_detail', chart, 'highchart'); // 서버상세
                                }
                            }
                        }
                    }
                };
                chart.update(context);
            } else if (type === CtxMenu.DEV10) {
                context = {
                    plotOptions: {
                        series: {
                            events: {
                                dblclick: function (point) {
                                    chart.ctxData = point;
                                    if (point.srcElement.point.devKind1 !== undefined && point.srcElement.point.devKind1 === 'DEV') {
                                        CtxMenu.itemClick('cm_dev_detail', chart, 'highchart'); // 장비상세
                                    } else if (point.srcElement.point.devKind1 !== undefined && point.srcElement.point.devKind1 === 'SVR') {
                                        CtxMenu.itemClick('cm_svr_detail', chart, 'highchart'); // 서버상세
                                    }
                                }
                            }
                        }
                    }
                };
                chart.update(context);
            }
        }

        menu.jqxMenu({width: 200, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999})
            .on('itemclick', function (event) {
                CtxMenu.itemClick($(event.args)[0].id, chart, 'highchart');
            });
    },

    /**기본jqx그리드*/
    create: function (grid, type, idx) {

        // pwindow체크
        if (type === CtxMenu.NONE) return;
        if (idx === null) idx = '';
        var menu = $('<div id="ctxmenu_' + type + idx + '"></div>');
        var ul = $('<ul></ul>');
        ul = CtxMenu.getMenu(ul, type);
        ul.append(CtxMenu.getCharttoolMenuTag());
        menu.append(ul).appendTo('body');

        grid.on('contextmenu', function () {
            return false;
        }).on('cellclick', function (event) {

            if (event.args.rightclick) {

                grid.jqxGrid('selectrow', event.args.rowindex); // 우클릭시 row 선택을 위해

                // 임시처리 ... 복합처리 필요
                if (type == CtxMenu.DEV10) {
                    var rowidx = HmGrid.getRowIdx(grid);
                    if (rowidx === false) return;
                    var rowdata = grid.jqxGrid('getrowdata', rowidx);
                    var devKind1 = grid.jqxGrid('getrowdata', rowidx).devKind1;
                    $("#ctxmenu_" + type + idx).remove();
                    menu = $('<div id="ctxmenu_' + type + idx + '"></div>');
                    ul = $('<ul></ul>');
                    if (devKind1 === 'SVR') {
                        ul = CtxMenu.getMenu(ul, CtxMenu.SVR);
                    } else if (devKind1 === 'DEV') {
                        ul = CtxMenu.getMenu(ul, CtxMenu.DEV);
                    } else if (devKind1 === 'VSVR') {
                        ul = CtxMenu.getMenu(ul, CtxMenu.VSVR);
                    } else if (devKind1 === 'VM') {
                        ul = CtxMenu.getMenu(ul, CtxMenu.VM, rowdata); // svrAgentFlag 확인용 rowdata
                    }
                    ul.append(CtxMenu.getCharttoolMenuTag());
                    menu.append(ul).appendTo('body');

                    menu.jqxMenu({
                        width: 200,
                        autoOpenPopup: false,
                        mode: 'popup',
                        theme: jqxTheme,
                        popupZIndex: 99999
                    })
                        .on('itemclick', function (event) {
                            CtxMenu.itemClick($(event.args)[0].id, grid, 'grid');
                        });
                }
                //type CtxMenu.IF 일때
                else if (type == CtxMenu.IF) {
                    grid.jqxGrid('selectrow', event.args.rowindex);
                    var rowIdxes = HmGrid.getRowIdxes(grid, '회선을 선택해주세요.');
                    if (rowIdxes.length > 1) {
                        $('#cm_ifInfoSet').css('display', 'none');
                    }
                    else {
                        $('#cm_ifInfoSet').css('display', 'block');
                    }
                }

                grid.jqxGrid('selectrow', event.args.rowindex);
                var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                if ($(window).height() < (event.args.originalEvent.clientY + menu.height() + 10)) {
                    posY = $(window).height() - (menu.height() + 10);
                }

                // var winW = $(window).width(), winH = $(window).height(), openDirection = '';
                // if(posX + 210 > winW) {
                // 	posX = winW - 210;
                // 	menu.jqxMenu('setItemOpenDirection', [''])
                // }

                grid.attr('data-datafield', event.args.datafield);
                menu.jqxMenu('open', posX, posY);
                return false;
            }
        });
        menu.jqxMenu({width: 200, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999})
            .on('itemclick', function (event) {
                CtxMenu.itemClick($(event.args)[0].id, grid, 'grid', $(event.args)[0].value);
            });

    },
    /**
     *  getMenu ul, type: ctxMenuType, rowdata: 특정필드값으로 메뉴 활성화/비활성화
     * */
    getMenu: function (ul, type, rowdata) {
        var isEsUse = ($('#gEsUse').val() || '').toUpperCase() == 'Y',
            isSecUnitUse = ($('#gAppSecUnitPopupYn').val() || '').toUpperCase() == 'Y',
            list = [];
        switch (type) {
            case CtxMenu.DEV:
                list.push(this.getMenuTag('cm_dev_detail', 'dtl_info', '장비상세'));
                // list.push(this.getMenuTag('cm_dev_rawPerfGraph', 'traffic_status', '장비성능그래프'));
                // list.push(this.getMenuTag('cm_dev_perfGraph', 'traffic_status', '장비성능 통계그래프'));
                // if(isSecUnitUse) {
                // 	list.push(this.getMenuTag('cm_dev_secUnitPerfGraph', 'traffic_status', '실시간 장비성능'));
                // }
                list.push(this.getMenuTag('cm_dev_jobReg', 'dev_perf', '장비작업등록'));
                list.push(this.getSeparatorMenuTag());
                //list.push(this.getMenuTag('cm_snmpTester', 'op_tool', 'SNMP Query'));
                list.push(this.getOptoolMenuTag());
                //URL 호출 탬플릿 추가(K사 패키지공통)
                list.push(this.getUrlTemplateMenuTag());
                break;
            case CtxMenu.IF:
                list.push(this.getMenuTag('cm_if_detail', 'dtl_info', '회선상세'));
                // list.push(this.getMenuTag('cm_if_rawPerfGraph', 'traffic_status', '회선성능그래프'));
                // list.push(this.getMenuTag('cm_if_perfGraph', 'traffic_status', '회선성능 통계그래프'));
                // if(isSecUnitUse) {
                // 	list.push(this.getMenuTag('cm_if_secUnitPerfGraph', 'traffic_status', '실시간 회선성능'));
                // }
                if (isSecUnitUse) {
                    list.push(this.getMultiIfMenuTag());
                }
                list.push(this.getMenuTag('cm_if_jobReg', 'dev_perf', '회선작업등록'));
                list.push(this.getMenuTag('cm_ifInfoSet', 'dtl_info', '회선정보 변경'));
                list.push(this.getMenuTag('cm_ifInfoBatchSet', 'dtl_info', '회선정보 일괄설정'));
                list.push(this.getMenuTag('cm_ifEvtCodeBatchSet', 'dtl_info', '임계치 일괄설정'));
                list.push(this.getSeparatorMenuTag());
                list.push(this.getMenuTag('cm_dev_detail', 'dtl_info', '장비상세'));
                list.push(this.getMenuTag('cm_dev_jobReg', 'dev_perf', '장비작업등록'));
                list.push(this.getSeparatorMenuTag());
                list.push(this.getOptoolMenuTag());
                break;

            case CtxMenu.SVR:
                list.push(this.getMenuTag('cm_svr_detail', 'dtl_info', '서버상세'));
                // list.push(this.getMenuTag('cm_svr_rawPerfGraph', 'dtl_info', '서버성능그래프'));
                // list.push(this.getMenuTag('cm_svr_perfGraph', 'dtl_info', '서버성능 통계그래프'));
                list.push(this.getMenuTag('cm_dev_jobReg', 'dev_perf', '서버작업등록'));
                list.push(this.getSeparatorMenuTag());
                break;
            case CtxMenu.VSVR:
                list.push(this.getMenuTag('cm_vsvr_detail', 'dtl_info', '가상서버 상세정보'));
                break;
            case CtxMenu.VM:
                list.push(this.getMenuTag('cm_vm_detail', 'dtl_info', 'VM상세'));
                if (rowdata !== undefined && rowdata.svrAgentFlag > 0) {
                    list.push(this.getMenuTag('cm_vm_svr_detail', 'dtl_info', '서버 상세정보'));
                }
                break;
            case CtxMenu.VSVR_NUTANIX:
                list.push(this.getMenuTag('cm_vsvr_nutanix_detail', 'dtl_info', '가상서버 상세정보'));
                break;
            case CtxMenu.VM_NUTANIX:
                list.push(this.getMenuTag('cm_vm_nutanix_detail', 'dtl_info', 'VM상세'));
                if (rowdata !== undefined && rowdata.svrAgentFlag > 0) {
                    list.push(this.getMenuTag('cm_vm_svr_detail', 'dtl_info', '서버 상세정보'));
                }
                break;
            case CtxMenu.APC:
                list.push(this.getMenuTag('cm_apc_detail', 'dtl_info', 'APController상세'));
                break;
            case CtxMenu.AP:
                list.push(this.getMenuTag('cm_ap_detail', 'dtl_info', 'AP상세'));
                // list.push(this.getMenuTag('cm_ap_clientHist', 'dtl_info', '클라이언트 이력'));
                break;
            case CtxMenu.AP_CLIENT:
                list.push(this.getMenuTag('cm_ap_clientDetail', 'dtl_info', '클라이언트 상세'));
                break;
            case CtxMenu.SYSLOG:
                list.push(this.getMenuTag('cm_syslog_detail', 'dtl_info', 'Syslog 상세'));
                break;
            case CtxMenu.SYSLOG_MGMT:
                list.push(this.getMenuTag('cm_chgBackup', 'dtl_info', 'SConfig Backup'));
                break;
            case CtxMenu.L4:
                list.push(this.getMenuTag('cm_l4_realSvrConStatus', 'dtl_info', 'Real Server 접속현황'));
                break;
            case CtxMenu.L4_ALTEON:
                list.push(this.getMenuTag('cm_l4_alteonSessStatusByIp', 'dtl_info', 'IP별 세션현황'));
                break;
            case CtxMenu.L4_F5_VIRTUAL:
                list.push(this.getMenuTag('cm_l4_f5_virtualPerf', 'dtl_info', '성능 그래프'));
                break;
            case CtxMenu.L4_F5_REAL:
                list.push(this.getMenuTag('cm_l4_f5_realPerf', 'dtl_info', '성능 그래프'));
                break;
            case CtxMenu.L4_F5_TRUNK:
                list.push(this.getMenuTag('cm_l4_f5_trunkPerf', 'dtl_info', '성능 그래프'));
                break;
            case CtxMenu.L4_F5_IF:
                list.push(this.getMenuTag('cm_l4_f5_ifPerf', 'dtl_info', '성능 그래프'));
                break;
            case CtxMenu.L4_F5_PIOLINK_VIRTUAL:
                list.push(this.getMenuTag('cm_l4_f5_piolink_virtualPerf', 'dtl_info', '성능 그래프'));
                break;
            case CtxMenu.L4_F5_PIOLINK_REAL:
                list.push(this.getMenuTag('cm_l4_f5_piolink_realPerf', 'dtl_info', '성능 그래프'));
                break;
            case CtxMenu.STARCELL_SVR:
                list.push(this.getMenuTag('itmon_svr_detail', 'dtl_info', '서버상세'));
                break;
            case CtxMenu.GRP_DETAIL:
                list.push(this.getMenuTag('grpDetail', 'dtl_info', '그룹상세정보'));
                break;
            case CtxMenu.DOS_EVT:
                list.push(this.getMenuTag('cm_dosevt_detail', 'dtl_info', '이벤트 상세'));
                break;
            case CtxMenu.RACK:
                list.push(this.getMenuTag('cm_rack_detail', 'dtl_info', 'Rack정보'));
                break;
            case CtxMenu.TOPO_ERR_ACTION_GRID:
                list.push(this.getMenuTag('cm_err_action', 'delete', '조치삭제'));
                break;
            case CtxMenu.SECT:
                list.push(this.getMenuTag('cm_sect_perf', 'traffic_status', '이력그래프'));
                break;
            case CtxMenu.DEV_ROUTE_MONIT:
                list.push(this.getMenuTag('cm_route_monit', 'dtl_info', '경로 비교'));
                break;
            case CtxMenu.TRAP:
                list.push(this.getMenuTag('cm_trap_detail', 'dtl_info', 'Trap 상세'));
                break;
            case CtxMenu.YS_SVR_PROC:
                list.push(this.getMenuTag('cm_svr_processAnalysis', 'dtl_info', '프로세스 성능분석'));
                break;
                break;
            case CtxMenu.QC_SLA:
                list.push(this.getMenuTag('cm_qcsla_reward', 'dtl_info', '보상일 상세보기'));
                break;
            case CtxMenu.AVAYA_PHONE_MONITOR:
                list.push(this.getMenuTag('cm_phone_detail', 'dtl_info', '상세보기'));
                break;
            case CtxMenu.ALONE_UPS:
                list.push(this.getMenuTag('cm_alone_ups_detail', 'dtl_info', '단독형UPS상세'));
                break;
            case CtxMenu.WAS:
                list.push(this.getMenuTag('cm_was_detail', 'dtl_info', 'WAS상세'));
                break;
            case CtxMenu.DBMS:
                list.push(this.getMenuTag('cm_dbms_detail', 'dtl_info', 'DBMS상세'));
                break;
            case CtxMenu.CALL_PERF:
                list.push(this.getMenuTag('cm_codec_detail', 'dtl_info', '코덱상세'));
                break;
            case CtxMenu.AUTO_CMD:
                list.push(this.getMenuTag('cm_run_reserve', 'dtl_info', '자동실행예약'));
                break;
            case CtxMenu.AUTO_CMD_HIST:
                list.push(this.getMenuTag('cm_run_hist', 'dtl_info', '명령어리스트'));
                break;
            case CtxMenu.AUTO_CMD_HIST_DETAIL:
                list.push(this.getMenuTag('cm_run_hist_detail', 'dtl_info', '실행내역'));
                break;
            case CtxMenu.USER_CONF_BATCH_SET:
                var _auth = $('#sAuth').val();
                if (_auth != '' && _auth == 'System') {
                    list.push(this.getMenuTag('cm_user_login', 'dtl_info', '이 아이디로 로그인'));
                }
                list.push(this.getMenuTag('cm_user_conf_batch_set', 'dtl_info', '사용자정보 일괄 설정'));
                break;
            case CtxMenu.EACH_LIMIT_BATCH_SET:
                list.push(this.getMenuTag('cm_each_limit_batch_set', 'dtl_info', '개별임계치 일괄설정'));
                break;
            case CtxMenu.TEST:
                list.push(this.getMenuTag('cm_dev_detail2', 'dtl_info', '장비상세'));
                break;
            case  CtxMenu.FMS_SENSOR:
                list.push(this.getMenuTag('cm_fms_sensor_rack', 'dtl_info', 'Rack 설정'));
                break;

            case CtxMenu.RTMS:
                list.push(this.getMenuTag('cm_tms_rtTraffic_evtStop', 'dtl_info', '이벤트 해제'));
                list.push(this.getSeparatorMenuTag());
                list.push(this.getOptoolMenuTag());
                break;
            case  CtxMenu.RESTIME:
                list.push(this.getMenuTag('tb_com_service_detail', 'dtl_info', '응답시간'));
                break;
        }
        ul.append(list);
        return ul;
    },

    getMenuTag: function (tagId, tagImg, tagText) {
        return $('<li></li>', {id: tagId})
            .append($('<img/>', {style: 'margin-right: 5px', src: ctxPath + '/img/ctxmenu/{0}.png'.substitute(tagImg)}))
            .append($('<span></span>', {text: tagText}));
    },

    getMenuUrlTag: function (tagId, tagImg, tagText, className) {
        return $('<li></li>', {id: tagId, value: className})
            .append($('<img/>', {style: 'margin-right: 5px', src: ctxPath + '/img/ctxmenu/{0}.png'.substitute(tagImg)}))
            .append($('<span></span>', {text: tagText}));
    },

    getSeparatorMenuTag: function () {
        return $('<li type="separator"></li>');
    },

    getOptoolMenuTag: function (kindArr) {
        if ($('#gSiteName').val() == 'Kbstar') {
            var tmpUL = $('<ul></ul>')
                .append(this.getMenuTag('cm_ping', 'ping', 'Ping'))
                .append(this.getMenuTag('cm_tracert', 'ping', 'Tracert'));
            return this.getMenuTag(null, 'op_tool', '운영도구').append(tmpUL);
        }
        if (kindArr === undefined) {
            if ($("#gSiteName").val() == "KSA") { //KSA 예외처리. ( HTTP,HTTPS 제거)
                var tmpUL = $('<ul></ul>')
                    .append(this.getMenuTag('cm_ping', 'ping', 'Ping'))
                    .append(this.getMenuTag('cm_tracert', 'ping', 'Tracert'))
                    .append(this.getMenuTag('cm_ssh', 'ping', 'SSH'));
                return this.getMenuTag(null, 'op_tool', '운영도구').append(tmpUL);
            } else {
                var tmpUL = $('<ul></ul>')
                    .append(this.getMenuTag('cm_ping', 'ping', 'Ping'))
                    .append(this.getMenuTag('cm_tracert', 'ping', 'Tracert'))
                    //.append(this.getMenuTag('cm_telnet', 'telnet', 'Telnet'))
                    .append(this.getMenuTag('cm_ssh', 'ping', 'SSH'))
                    .append(this.getMenuTag('cm_http', 'http', 'Http'))
                    .append(this.getMenuTag('cm_https', 'https', 'Https'))
                return this.getMenuTag(null, 'op_tool', '운영도구').append(tmpUL);
            }
        }
        else {
            var tmpUL = $('<ul></ul>');
            for (var i = 0; i < kindArr.length; i++) {
                switch (kindArr[i]) {
                    case 'ping':
                        tmpUL.append(this.getMenuTag('cm_ping', 'ping', 'Ping'));
                        break;
                    case 'tracert':
                        tmpUL.append(this.getMenuTag('cm_tracert', 'ping', 'Tracert'));
                        break;
                    case 'telnet':
                        //tmpUL.append(this.getMenuTag('cm_telnet', 'telnet', 'Telnet'));
                        break;
                    case 'ssh':
                        tmpUL.append(this.getMenuTag('cm_ssh', 'ping', 'SSH'));
                        break;
                    case 'http':
                        tmpUL.append(this.getMenuTag('cm_http', 'http', 'Http'));
                        break;
                    case 'https':
                        tmpUL.append(this.getMenuTag('cm_https', 'https', 'Https'));
                        break;
                }
            }
            return this.getMenuTag(null, 'op_tool', '운영도구').append(tmpUL);
        }
    },


    getUrlTemplateMenuTag: function () {
        var tmpUL = $('<ul></ul>');
        var urlList = [];

        // $.ajax({
        //     type: 'get',
        //     url: '/d3map/popup/setting/itemSetting/getUrlTemplete.do',
        //     dataType: 'json',
        //     async: false,
        //     contentType: 'application/json; charset=utf-8',
        //     success: function (data, status) {
        //         urlList = data.resultData;
        //     }
        // });

        if (urlList.length > 0) {
            for (var i = 0; i < urlList.length; i++) {
                tmpUL.append(this.getMenuUrlTag('cm_url_template', 'http', urlList[i].memo, urlList[i].codeId));
            }
        } else {
            tmpUL.append(this.getMenuUrlTag('', 'http', 'URL탬플릿 설정필요'));
        }

        return this.getMenuTag(null, 'op_tool', 'URL 호출').append(tmpUL);
    },

    getCharttoolMenuTag: function () {
        var tmpUL = $('<ul></ul>')
            .append(this.getMenuTag('cm_filter', 'filter', '필터'))
            .append(this.getMenuTag('cm_filterReset', 'filter_reset', '필터초기화'))
            .append(this.getMenuTag('cm_colsMgr', 'op_tool', '컬럼관리'))
            .append(this.getMenuTag('cm_copyCell', 'op_tool', '셀복사'));
        return this.getMenuTag(null, 'op_tool', '도구').append(tmpUL);
    },

    getCharttoolMenuTagNoCellCopy: function () {
        var tmpUL = $('<ul></ul>')
            .append(this.getMenuTag('cm_filter', 'filter', '필터'))
            .append(this.getMenuTag('cm_filterReset', 'filter_reset', '필터초기화'))
            .append(this.getMenuTag('cm_colsMgr', 'op_tool', '컬럼관리'));
        // .append(this.getMenuTag('cm_copyCell', 'op_tool', '셀복사'));
        return this.getMenuTag(null, 'op_tool', '도구').append(tmpUL);
    },

    getMultiIfMenuTag: function () {
        var tmpUL = $('<ul></ul>')
            .append(this.getMenuTag('cm_if_rtSecPerfAdd', 'dev_perf', '추가'))
            .append(this.getMenuTag('cm_if_rtSecPerfView', 'traffic_status', '보기'));
        return this.getMenuTag(null, 'traffic_status', '실시간 다중회선성능').append(tmpUL);
    },

    itemClick: function (id, item, type, codeId) {
        var params;
        // 그리드 사용
        var rowidx;
        var rowdata;
        var rowidxes;
        var _gridElementName;

        switch (id) {
            /** DEV */
            case 'cm_dev_detail': //장비상세
                var _mngNo = -1;
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    _mngNo = item.jqxGrid('getrowdata', rowidx).mngNo || item.jqxGrid('getrowdata', rowidx).MNG_NO;
                    params = {
                        mngNo: _mngNo
                    };
                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    params = {
                        mngNo: _mngNo
                    };
                } else return;

                // 18.07.06] 예외처리 추가pDevDetail
                var url = '/main/popup/nms/pDevDetail.do';
                if ($('#gSiteName').val() == 'KbstarSms') {
                    url = '/kbstarSms/popup/nms/pDevDetail.do';
                }

                if (params !== undefined || params !== '')
                    HmUtil.createPopup(url, $('#hForm'), 'pDevDetail_' + _mngNo, 1400, 700, params);
                break;

            //테스트 (추후 제거 예정)
            case 'cm_dev_detail2': //장비상세
                var _mngNo = -1;
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    _mngNo = item.jqxGrid('getrowdata', rowidx).mngNo || item.jqxGrid('getrowdata', rowidx).MNG_NO;
                    params = {
                        mngNo: _mngNo
                    };
                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    params = {
                        mngNo: _mngNo
                    };
                } else return;

                // 18.07.06] 예외처리 추가pDevDetail
                var url = '/main/popup/nms/pDevDetail2.do';
                if ($('#gSiteName').val() == 'KbstarSms') {
                    url = '/kbstarSms/popup/nms/pDevDetail.do';
                }

                if (params !== undefined || params !== '')
                    HmUtil.createPopup(url, $('#hForm'), 'pDevDetail_' + _mngNo, 1400, 700, params);
                break;

            case 'cm_dev_perfGraph': //장비성능그래프
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            devIp: rowdata.devIp,
                            mngNo: rowdata.mngNo,
                            disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName
                        };
                        // 그리드 엘리먼트 이름에 따라서 장비성능그래프 팝업의 검색 콤보 초기값 설정.
                        // 그리드 엘리먼트 이름으로 판단이 안될 경우 default 값 cpu
                        _gridElementName = item.selector.toUpperCase();
                        if (_gridElementName.indexOf('CPU') > 0) {
                            params.type = '1';
                        } else if (_gridElementName.indexOf('MEM') > 0) {
                            params.type = '2';
                        } else if (_gridElementName.indexOf('TEMP') > 0) {
                            params.type = '5';
                        } else if (_gridElementName.indexOf('RESTIME') > 0) {
                            params.type = '6';
                        } else if (_gridElementName.indexOf('SESSION') > 0) {
                            params.type = '11';
                        }
                    } catch (e) {
                    }
                } else if (type === 'highchart') {
                    params = {
                        disDevName: item.ctxData.srcElement.point.devName,
                        devIp: item.ctxData.srcElement.point.devIp,
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                var url = '/main/popup/nms/pDevPerfChart.do';
                if ($('#gSiteName').val() == 'Ibk') {
                    url = '/ibk/popup/nms/pDevPerfChart.do';
                }
                if (params !== undefined || params !== '') {
                    $.post(ctxPath + url,
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.disDevName + '] 장비성능그래프', result, 1100, 800);
                        }
                    );
                }
                break;
            case 'cm_dev_rawPerfGraph': //장비성능그래프 (raw)
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            devIp: rowdata.devIp,
                            mngNo: rowdata.mngNo,
                            disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName
                        };
                        // 그리드 엘리먼트 이름에 따라서 장비성능그래프 팝업의 검색 콤보 초기값 설정.
                        // 그리드 엘리먼트 이름으로 판단이 안될 경우 default 값 cpu
                        _gridElementName = item.selector.toUpperCase();
                        if (_gridElementName.indexOf('CPU') > 0) {
                            params.type = '1';
                        } else if (_gridElementName.indexOf('MEM') > 0) {
                            params.type = '2';
                        } else if (_gridElementName.indexOf('TEMP') > 0) {
                            params.type = '5';
                        } else if (_gridElementName.indexOf('RESTIME') > 0) {
                            params.type = '6';
                        } else if (_gridElementName.indexOf('SESSION') > 0) {
                            params.type = '11';
                        }
                    } catch (e) {
                    }
                } else if (type === 'highchart') {
                    params = {
                        disDevName: item.ctxData.srcElement.point.devName,
                        devIp: item.ctxData.srcElement.point.devIp,
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    var _width = 550;
                    var url = ctxPath + '/main/popup/nms/pDevRawPerfChart.do';

                    $.post(url,
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.disDevName + '] 장비성능그래프', result, 1100, _width);
                            // HmWindow.open($('#pwindow'), '['+ params.disDevName+'] 장비성능그래프', result, 1100, _width, 'pwindow_init', params);
                        }
                    );
                }
                break;
            case 'cm_dev_rtPerfGraph': //실시간 장비성능 그래프
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            mngNo: rowdata.mngNo,
                            disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName
                        };
                        // 그리드 엘리먼트 이름에 따라서 장비성능그래프 팝업의 검색 콤보 초기값 설정.
                        // 그리드 엘리먼트 이름으로 판단이 안될 경우 default 값 cpu
                        _gridElementName = item.selector.toUpperCase();
                        if (_gridElementName.indexOf('CPU') > 0) {
                            params.type = '1';
                        } else if (_gridElementName.indexOf('MEM') > 0) {
                            params.type = '2';
                        } else if (_gridElementName.indexOf('TEMP') > 0) {
                            params.type = '5';
                        } else if (_gridElementName.indexOf('RESTIME') > 0) {
                            params.type = '6';
                        } else if (_gridElementName.indexOf('SESSION') > 0) {
                            params.type = '11';
                        }
                    } catch (e) {
                    }
                } else if (type === 'highchart') {
                    params = {
                        disDevName: item.ctxData.srcElement.point.devName,
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pRTimeDevPerfChart.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.disDevName + ']  실시간 장비성능', result, 1100, 440);
                        }
                    );
                }
                break;
            case 'cm_dev_secUnitPerfGraph': //초단위 장비성능
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            devIp: rowdata.devIp,
                            mngNo: rowdata.mngNo,
                            devKind1: 'DEV',
                            devKind2: rowdata.devKind2,
                            disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName
                        };
                    } catch (e) {
                    }
                } else if (type === 'highchart') {
                    params = {
                        disDevName: item.ctxData.srcElement.point.devName,
                        devName: item.ctxData.srcElement.point.devName,
                        devKind1: 'DEV',
                        devKind2: item.ctxData.srcElement.point.devKind2,
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                var secUnitDevPerfUrl = $('#gCupidSecUnitUse').val() == 'Y' ? '/main/popup/nms/pSecUnitDevPerfMultiForCupid.do' : '/main/popup/nms/pSecUnitDevPerfMulti.do';

                HmUtil.createPopup(secUnitDevPerfUrl, $('#hForm'), params.mngNo, 1100, 640, params);


                break;
            case 'cm_dev_jobReg': //장비작업등록
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    rowdata = item.jqxGrid('getrowdata', rowidx);
                    params = {
                        mngNo: rowdata.mngNo || rowdata.MNG_NO || 0,
                        devName: rowdata.devName || rowdata.DEV_NAME || 'null',
                        disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName
                    };
                } else if (type === 'highchart') {
                    params = {
                        disDevName: item.ctxData.srcElement.point.devName,
                        devName: item.ctxData.srcElement.point.devName,
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    // if($('#gSiteName').val() == SiteEnum.HyundaiCar) {
                    params.jobType = 'DEV';
                    $.post(ctxPath + '/main/popup/nms/pJobAdd.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), (params.disDevName || params.devName || '') + ' 장비작업등록', result, 760, 695);
                        }
                    );
                    // }
                    // else {
                    //     $.post(ctxPath + '/main/popup/nms/pDevJobAdd.do',
                    //         params,
                    //         function (result) {
                    //             HmWindow.open($('#pwindow'), (params.disDevName || params.devName || '') + ' 장비작업등록', result, 645, 580);
                    //         }
                    //     );
                    // }
                }
                break;
            case 'cm_ping': //Ping
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    rowdata = item.jqxGrid('getrowdata', rowidx);
                    params = {
                        mngNo: rowdata.mngNo || rowdata.MNG_NO || 0
                    };
                } else if (type === 'highchart') {
                    params = {
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.showPingPopup(params);
                }
                break;
            case 'cm_telnet': //Telnet
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    rowdata = item.jqxGrid('getrowdata', rowidx);
                    params = {
                        devIp: rowdata.devIp
                    };
                } else if (type === 'highchart') {
                    params = {
                        devIp: item.ctxData.srcElement.point.devIp
                    };
                } else return;

                if (params !== undefined || params !== '')
                    ActiveX.telnet(params.devIp);
                break;
            case 'cm_tracert': //Tracert
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    rowdata = item.jqxGrid('getrowdata', rowidx);
                    params = {
                        mngNo: rowdata.mngNo || rowdata.MNG_NO || 0
                    };
                } else if (type === 'highchart') {
                    params = {
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                HmUtil.showTracertPopup(params);
                break;
            case 'cm_ssh': //SSH
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    params = item.jqxGrid('getrowdata', rowidx);
                } else if (type === 'highchart') {
                    params = {
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    if (Extensions.isSupport()) {
                        Extensions.ssh(params.devIp, params.mngNo);
                    } else {
                        ActiveX.ssh(params.devIp);
                    }
                }
                break;


            case 'cm_HmTelnet': //Telnet
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    rowdata = item.jqxGrid('getrowdata', rowidx);
                    console.log(rowdata);
                    params = {
                        devIp: rowdata.devIp,
                        userId: rowdata.userId
                    };
                } else if (type === 'highchart') {
                    params = {
                        devIp: item.ctxData.srcElement.point.devIp
                    };
                } else return;

                if (params !== undefined || params !== '')
                    ActiveX.HmTelnet(params.devIp, params.userId);
                break;

            case 'cm_Hmssh': //SSH
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    params = item.jqxGrid('getrowdata', rowidx);
                } else if (type === 'highchart') {
                    params = {
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                if (params !== undefined || params !== '')
                    ActiveX.HmSsh(params.devIp, params.userId);
                break;


            case 'cm_http': //Http
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    params = item.jqxGrid('getrowdata', rowidx);
                } else return;

                if (params !== undefined || params !== '')
                    ActiveX.http(params.devIp);
                break;
            case 'cm_https': //Https
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    params = item.jqxGrid('getrowdata', rowidx);
                } else return;

                if (params !== undefined || params !== '')
                    ActiveX.https(params.devIp);
                break;

            case 'cm_url_template': //URL 호출 탬플릿
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    params = item.jqxGrid('getrowdata', rowidx);
                } else return;

                if (params !== undefined || params !== '')
                    Server.post('/d3map/popup/setting/itemSetting/getDevUrlTempleteList.do', {
                        data: {mngNo: params.mngNo, codeId: codeId},
                        success: function (result) {
                            if (result.length > 0) {
                                var url = result[0].codeValue1 + "://" + result[0].codeValue2 + result[0].codeValue3 + result[0].codeValue4
                                    + result[0].codeValue5 + result[0].codeValue6 + result[0].codeValue7 + result[0].codeValue8;
                                window.open(url, '_blank');
                            } else {
                                alert("등록된 URL이 없습니다.");
                            }
                        }
                    });
                break;

            case 'cm_snmpTester': //SNMP Tester
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    params = item.jqxGrid('getrowdata', rowidx);
                } else return;
                // { mngNo : 1 }
                HmUtil.showSimpleSnmpQueryPopup(params);
                break;

            /** IF */
            case 'cm_if_detail': //회선상세
                var _mngNo = -1, _ifIdx = -1;
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;

                    _mngNo = item.jqxGrid('getrowdata', rowidx).mngNo || item.jqxGrid('getrowdata', rowidx).MNG_NO;
                    _ifIdx = item.jqxGrid('getrowdata', rowidx).ifIdx || item.jqxGrid('getrowdata', rowidx).IF_IDX;
                    params = {
                        mngNo: _mngNo,
                        ifIdx: _ifIdx,
                        lineWidth: item.jqxGrid('getrowdata', rowidx).lineWidth || item.jqxGrid('getrowdata', rowidx).LINE_WIDTH
                    };
                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    _ifIdx = item.ctxData.srcElement.point.ifIdx;

                    params = {
                        mngNo: _mngNo,
                        ifIdx: _ifIdx,
                        lineWidth: item.ctxData.srcElement.point.lineWidth
                    };
                } else return;

                var url = '/main/popup/nms/pIfDetail.do';

                if (params !== undefined || params !== '')
                    HmUtil.createPopup(url, $('#hForm'), 'pIfDetail_' + _mngNo + "_" + _ifIdx, 1300, 700, params);
                break;
            case 'cm_ifInfoSet': // 회선정보 변경
                try {
                    var rowIdxes = HmGrid.getRowIdxes($ifMgmt, '회선을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var rowdata = $ifMgmt.jqxGrid('getrowdata', rowIdxes[0]);
                    var params = {
                        action: 'U',
                        mngNo: rowdata.mngNo,
                        ifIdx: rowdata.ifIdx,
                        devKind2: rowdata.devKind2
                    };
                    $.post(ctxPath + '/main/popup/env/pIfInfoSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '회선정보 변경', result, 700, 580);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_ifInfoBatchSet': // 회선정보 일괄설정
                var rowIdxes = HmGrid.getRowIdxes(item, '회선을 선택해주세요.');
                if (rowIdxes === false) return;
                var _selectList = [];
                var diffProfileChk = true;
                var tempProfileNo = -1;

                try {
                    var rowIdxes = HmGrid.getRowIdxes($ifMgmt, '회선을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _ifIdxs = [];
                    var _mngNo;
                    $.each(rowIdxes, function (idx, value) {
                        var _data = item.jqxGrid('getrowdata', value);
                        _mngNo = _data.mngNo;
                        _ifIdxs.push(_data.ifIdx);
                    });
                    var params = {
                        mngNo: _mngNo,
                        ifIdxs: _ifIdxs.join(',')
                    };
                    HmWindow.create($('#pwindow'), 500, 500, 999);
                    $.post(ctxPath + '/main/popup/env/pIfInfoBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '회선정보 일괄설정', result, 400, 364);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_if_jobReg': //회선작업등록

                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    rowdata = item.jqxGrid('getrowdata', rowidx);
                    params = {
                        ifIdx: rowdata.ifIdx || rowdata.IF_IDX || 0,
                        ifName: rowdata.ifName || rowdata.IF_NAME || 'null',
                        mngNo: rowdata.mngNo || rowdata.MNG_NO || 0,
                        disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName,
                        ifAlias: rowdata.ifAlias
                    };
                } else return;
                if (params !== undefined || params !== '') {

                    params.jobType = 'IF';
                    $.post(ctxPath + '/main/popup/nms/pJobAdd.do',
                        params,
                        function (result) {
                            var alias = (params.ifAlias && params.ifAlias !== "" && params.ifAlias !== undefined) ? '(' + params.ifAlias + ')' : "";
                            HmWindow.open($('#pwindow'), '[' + params.disDevName + ' - ' + params.ifName + alias + '] 회선작업등록', result, 750, 686);
                        }
                    );
                }
                break;
            case 'cm_if_perfGraph': //회선성능그래프
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            devIp: rowdata.devIp,
                            mngNo: rowdata.mngNo,
                            ifIdx: rowdata.ifIdx,
                            devName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName,
                            ifName: rowdata.ifName,
                            ifAlias: rowdata.ifAlias,
                            lineWidth: rowdata.lineWidth
                        };
                    } catch (e) {
                    }
                } else return;

                var url = '/main/popup/nms/pIfPerfChart.do';
                if ($('#gSiteName').val() == 'Ibk') {
                    url = '/ibk/popup/nms/pIfPerfChart.do';
                }

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + url,
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.devName + ' - ' + params.ifName + '(' + params.ifAlias + ')] 회선성능그래프', result, 1100, 800);
                        }
                    );
                }
                break;
            case 'cm_if_rawPerfGraph': //회선성능그래프(raw)
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            devIp: rowdata.devIp,
                            mngNo: rowdata.mngNo,
                            ifIdx: rowdata.ifIdx,
                            devName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName,
                            ifName: rowdata.ifName,
                            ifAlias: rowdata.ifAlias,
                            lineWidth: rowdata.lineWidth
                        };
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    var _width = 950;
                    var _height = 550;
                    var url = ctxPath + '/main/popup/nms/pIfRawPerfChart.do';
                    $.post(url,
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.devName + ' - ' + params.ifName + '(' + params.ifAlias + ')] 회선성능그래프', result, _width, _height);
                        }
                    );
                }
                break;
            case 'cm_if_rtPerfGraph': //실시간 회선성능 그래프
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            mngNo: rowdata.mngNo,
                            ifIdx: rowdata.ifIdx,
                            disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName,
                            ifName: rowdata.ifName,
                            ifAlias: rowdata.ifAlias,
                            lineWidth: rowdata.lineWidth
                        };

                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pRTimeIfPerfChart.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.disDevName + ' - ' + params.ifName + '(' + params.ifAlias + ')] 실시간 회선성능', result, 1000, 440);
                        }
                    );
                }
                break;
            case 'cm_if_secUnitPerfGraph': //초단위 회선성능
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            mngNo: rowdata.mngNo,
                            ifIdx: rowdata.ifIdx,
                            disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName,
                            ifName: rowdata.ifName,
                            ifAlias: rowdata.ifAlias
                        };
                    } catch (e) {
                    }
                } else return;

                var secUnitIfPerfUrl = $('#gCupidSecUnitUse').val() == 'Y' ? '/main/popup/nms/pSecUnitIfPerfMultiForCupid.do' : '/main/popup/nms/pSecUnitIfPerfMulti.do';
                HmUtil.createPopup(secUnitIfPerfUrl, $('#hForm'), params.mngNo, 1100, 640, params);

                break;
            case 'cm_if_rtSecPerfView': //실시간 다중 회선성능 보기
                HmUtil.createPopup('/main/popup/nms/pRealTimeIfPerf.do', $('#hForm'), 'pRealTimeIfPerf', 1100, 900);
                break;
            case 'cm_if_rtSecPerfAdd': //실시간 다중 회선성능 추가
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            mngNo: rowdata.mngNo,
                            ifIdx: rowdata.ifIdx,
                        };
                    } catch (e) {
                    }
                } else return;
                if (params !== undefined || params !== '') {
                    Server.post('/main/nms/realTimeMultiIf/saveRealTimeIf2.do', {
                        data: params,
                        success: function (data) {
                            if (data == "listFull") {
                                alert('8개까지만 추가가 가능합니다.');
                            } else {
                                alert('추가되었습니다.');
                            }
                        }
                    });
                }
                break;
            case 'cm_if_trafficData': //트래픽데이터
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            mngNo: rowdata.mngNo,
                            ifIdx: rowdata.ifIdx,
                            ifName: rowdata.ifName
                        };
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/tms/pTrafficData.do', $('#hForm'), 'pTrafficData', 1100, 645, params);
                }
                break;
            case 'cm_ifEvtCodeBatchSet': //회선 임계치 일괄설정 2023.04.07
                if (type === 'grid') {
                    try {
                        var rowIdxes = HmGrid.getRowIdxes(item, '회선을 선택해주세요.');
                        if (rowIdxes === false) return;
                        var _selectList = [];
                        var diffProfileChk = true;
                        var tempProfileNo = -1;
                        $.each(rowIdxes, function (idx, value) {
                            let _select = {
                                mngNo: item.jqxGrid('getrowdata', value).mngNo,
                                ifIdx: item.jqxGrid('getrowdata', value).ifIdx,
                            };
                            _selectList.push(_select);
                            if (tempProfileNo == -1) {
                                tempProfileNo = item.jqxGrid('getrowdata', value).profileNo;
                            } else {
                                if (tempProfileNo != item.jqxGrid('getrowdata', value).profileNo) {
                                    diffProfileChk = false;
                                }
                            }
                        });
                        if (!diffProfileChk) {
                            alert("같은 프로파일만 일괄설정 가능합니다.");
                            return false;
                        }
                        var params = {
                            selectList: JSON.stringify(_selectList),
                            profileNo: tempProfileNo
                        };
                        $.post(ctxPath + '/main/popup/env/pIfEvtCodeBatchSet.do',
                            params,
                            function (result) {
                                HmWindow.open($('#pwindow'), '임계치 일괄설정', result, 1240, 500);
                            }
                        );
                    } catch (e) {
                    }
                } else return;
                break;
            /** SVR */
            case 'cm_svr_detail': //서버상세정보
                var _mngNo = -1;
                var _wasNo, _dbmsNo;
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    _mngNo = item.jqxGrid('getrowdata', rowidx).mngNo;
                    params = {};
                    params.mngNo = _mngNo;
                    params.devName = item.jqxGrid('getrowdata', rowidx).name;
                    params.devIp = item.jqxGrid('getrowdata', rowidx).devIp;

                    _wasNo = item.jqxGrid('getrowdata', rowidx).wasNo;
                    _dbmsNo = item.jqxGrid('getrowdata', rowidx).dbmsNo;
                    params.wasNo = _wasNo;
                    params.dbmsNo = _dbmsNo;

                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    params = {
                        mngNo: _mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {

                    var url = '/main/popup/sms/pSvrDetail.do';
                    if ($('#gSiteName').val() == 'KbstarSms') {
                        url = '/kbstarSms/popup/sms/pServerDetailInfo.do';
                    }

                    HmUtil.createPopup(url, $('#hForm'), 'pServerAlarm_' + _mngNo, 1300, 700, params);
                }
                break;
            case 'cm_svr_rawPerfGraph': //서버성능그래프 (raw)
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            devIp: rowdata.devIp,
                            mngNo: rowdata.mngNo,
                            disDevName: rowdata.disDevName != null ? rowdata.disDevName : rowdata.devName
                        };
                        // 그리드 엘리먼트 이름에 따라서 장비성능그래프 팝업의 검색 콤보 초기값 설정.
                        // 그리드 엘리먼트 이름으로 판단이 안될 경우 default 값 cpu
                        _gridElementName = item.selector.toUpperCase();
                        if (_gridElementName.indexOf('CPU') > 0) {
                            params.type = '1';
                        } else if (_gridElementName.indexOf('MEM') > 0) {
                            params.type = '2';
                        }
                    } catch (e) {
                    }
                } else if (type === 'highchart') {
                    params = {
                        disDevName: item.ctxData.srcElement.point.devName,
                        devIp: item.ctxData.srcElement.point.devIp,
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    var _width = 550;
                    var url = ctxPath + '/main/popup/sms/pServerRawPerfChart.do';

                    $.post(url,
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.disDevName + '] 서버성능그래프', result, 1250, _width);
                        }
                    );
                }
                break;
            case 'cm_svr_perfGraph': //서버성능 통계그래프
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            devIp: rowdata.devIp,
                            mngNo: rowdata.mngNo,
                            disDevName: rowdata.disDevName
                        };
                        // 그리드 엘리먼트 이름에 따라서 장비성능그래프 팝업의 검색 콤보 초기값 설정.
                        // 그리드 엘리먼트 이름으로 판단이 안될 경우 default 값 cpu
                        _gridElementName = item.selector.toUpperCase();
                        if (_gridElementName.indexOf('CPU') > 0) {
                            params.type = '1';
                        } else if (_gridElementName.indexOf('MEM') > 0) {
                            params.type = '2';
                        } else if (_gridElementName.indexOf('TEMP') > 0) {
                            params.type = '5';
                        } else if (_gridElementName.indexOf('RESTIME') > 0) {
                            params.type = '6';
                        } else if (_gridElementName.indexOf('SESSION') > 0) {
                            params.type = '11';
                        }
                    } catch (e) {
                    }
                } else if (type === 'highchart') {
                    params = {
                        disDevName: item.ctxData.srcElement.point.devName,
                        devIp: item.ctxData.srcElement.point.devIp,
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                var url = '/main/popup/sms/pServerPerfChart.do';
                if ($('#gSiteName').val() == 'Ibk') {
                    url = '/ibk/popup/sms/pServerPerfChart.do';
                }

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + url,
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.disDevName + '] 서버성능그래프', result, 1100, 800);
                        }
                    );
                }
                break;
            case 'cm_svr_secPerfAnalysis': //초단위성능분석 (BMT용)
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    params = {};
                    params.mngNo = item.jqxGrid('getrowdata', rowidx).mngNo;
                } else if (type === 'highchart') {
                    params = {
                        mngNo: item.ctxData.srcElement.point.mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/sms/pServerSecPerfAnalysis.do', $('#hForm'), 'pServerSecPerfAnalysis', 1000, 700, params);
                }
                break;
            case 'cm_svr_processAnalysis': //프로세스분석
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex'),
                        rowdata = item.jqxGrid('getrowdata', rowidx);

                    params = {
                        mngNo: rowdata.mngNo,
                        pid: rowdata.pid,
                        cmdline: rowdata.cmdLine
                    };
                } else if (type === 'highchart') {
                    params = {
                        mngNo: item.ctxData.srcElement.point.mngNo,
                        pid: item.ctxData.srcElement.point.pid,
                        cmdline: item.ctxData.srcElement.point.cmdline
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/sms/pServerProcessAnalysis.do', $('#hForm'), 'pServerProcessAnalysis', 1200, 760, params);
                }
                break;

            /** VSVR */
            case 'cm_vsvr_detail': // 가상서버상세정보
                var _mngNo = -1;
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    _mngNo = item.jqxGrid('getrowdata', rowidx).mngNo;
                    params = {};
                    params.mngNo = _mngNo;
                    params.devName = item.jqxGrid('getrowdata', rowidx).name;
                    params.devIp = item.jqxGrid('getrowdata', rowidx).devIp;
                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    params = {
                        mngNo: _mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {

                    var url = '/main/popup/vsvr/pVsvrDetail.do';

                    HmUtil.createPopup(url, $('#hForm'), 'pVsvrDetail_' + _mngNo, 1300, 700, params);
                }
                break;
            /** VM */
            case 'cm_vm_detail': // vm상세정보
                var _mngNo = -1;
                var _vmId = -1;
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    _mngNo = item.jqxGrid('getrowdata', rowidx).mngNo;
                    _vmId = item.jqxGrid('getrowdata', rowidx).vmId;
                    params = {};
                    params.mngNo = _mngNo;
                    params.vmId = _vmId;
                    // params.devName = item.jqxGrid('getrowdata', rowidx).name;
                    // params.devIp = item.jqxGrid('getrowdata', rowidx).devIp;
                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    _vmId = item.ctxData.srcElement.point.vmId;
                    params = {
                        mngNo: _mngNo, vmId: _vmId
                    };
                } else return;

                if (params !== undefined || params !== '') {

                    var url = '/main/popup/vsvr/pVmDetail.do';

                    HmUtil.createPopup(url, $('#hForm'), 'pVmDetail_' + _mngNo, 1300, 700, params);
                }
                break;
            /** VSVR 뉴타닉스 임시.. 추후 통합시 제거 예정*/
            case 'cm_vsvr_nutanix_detail': // 가상서버상세정보
                var _mngNo = -1;
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    _mngNo = item.jqxGrid('getrowdata', rowidx).mngNo;
                    params = {};
                    params.mngNo = _mngNo;
                    params.devName = item.jqxGrid('getrowdata', rowidx).name;
                    params.devIp = item.jqxGrid('getrowdata', rowidx).devIp;
                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    params = {
                        mngNo: _mngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {

                    var url = '/main/popup/vsvr/pVsvrNutanixDetail.do';

                    HmUtil.createPopup(url, $('#hForm'), 'pVsvrDetail_' + _mngNo, 1300, 700, params);
                }
                break;
            /** VM */
            case 'cm_vm_nutanix_detail': // vm상세정보
                var _mngNo = -1;
                var _vmId = -1;
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    _mngNo = item.jqxGrid('getrowdata', rowidx).mngNo;
                    _vmId = item.jqxGrid('getrowdata', rowidx).vmUuid;
                    params = {};
                    params.mngNo = _mngNo;
                    params.vmId = _vmId;
                    // params.devName = item.jqxGrid('getrowdata', rowidx).name;
                    // params.devIp = item.jqxGrid('getrowdata', rowidx).devIp;
                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    _vmId = item.ctxData.srcElement.point.vmUuid;
                    params = {
                        mngNo: _mngNo, vmId: _vmId
                    };
                } else return;

                if (params !== undefined || params !== '') {

                    var url = '/main/popup/vsvr/pVmNutanixDetail.do';

                    HmUtil.createPopup(url, $('#hForm'), 'pVmDetail_' + _mngNo, 1300, 700, params);
                }
                break;
            /** VM Agent 수집*/
            case 'cm_vm_svr_detail':
                var _mngNo = -1;
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    _svrMngNo = item.jqxGrid('getrowdata', rowidx).svrMngNo;
                    params = {};
                    params.mngNo = _svrMngNo;
                } else if (type === 'highchart') {
                    _mngNo = item.ctxData.srcElement.point.mngNo;
                    params = {
                        mngNo: _svrMngNo
                    };
                } else return;

                if (params !== undefined || params !== '') {
                    var url = '/main/popup/sms/pSvrDetail.do';
                    HmUtil.createPopup(url, $('#hForm'), 'pVmDetail_' + _mngNo, 1300, 700, params);

                }
                break;
            /** APC */
            case 'cm_apc_detail': //APC상세
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            mngNo: rowdata.mngNo,
                            devName: rowdata.devName
                        };
                    } catch (e) {
                    }
                }
                else if (type == 'highchart') {
                    console.log('ctxData', item.ctxData);
                    params = {
                        mngNo: item.ctxData.srcElement.point.mngNo,
                        devName: item.ctxData.srcElement.point.devName
                    };
                }

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/nms/pApControllerDetail.do', $('#hForm'), 'pApcDetail', 1280, 700, params);
                }
                break;
            /** AP */
            case 'cm_ap_detail': //AP상세
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            apNo: rowdata.apNo,
                            apName: rowdata.apName,
                            poeMngNo: rowdata.poeMngNo,
                            poeIfNo: rowdata.poeIfNo
                        };
                    } catch (e) {
                    }
                }
                else if (type == 'highchart') {
                    console.log('ctxData', item.ctxData);
                    params = {
                        apNo: item.ctxData.srcElement.point.apNo,
                        apName: item.ctxData.srcElement.point.apName
                    };
                }

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/nms/pApDetail.do', $('#hForm'), 'pApDetail', 1280, 660, params);
                }
                break;
            // case 'cm_ap_clientHist': //클라이언트 이력
            //     if (type === 'grid') {
            //         try {
            //             rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
            //             if(rowidx === false) return;
            //             rowdata = item.jqxGrid('getrowdata', rowidx);
            //             params = {
            //                 apNo: rowdata.apNo,
            //                 apName: rowdata.apName
            //             };
            //         } catch(e) {}
            //     } else return;
            //
            //     if (params !== undefined || params !== ''){
            //         $.post(ctxPath + '/main/popup/nms/pApClientHist.do', params,
            //             function(result) {
            //                 HmWindow.open($('#pwindow'), params.apName + ' - 클라이언트 이력', result, 1000, 600);
            //             }
            //         );
            //     }
            //     break;
            case 'cm_ap_clientDetail': //클라이언트 상세
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            apNo: rowdata.apNo,
                            apSubNo: rowdata.apSubNo,
                            apName: rowdata.apName,
                            connIp: rowdata.connIp,
                            connMac: rowdata.connMac,
                            apConnIdx: rowdata.apConnIdx,
                        };
                        console.log('rowdata', rowdata)
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/nms/pApClientDetail.do', $('#hForm'), 'pApClientDetail', 1280, 516, params);
                }
                break;
            case 'cm_syslog_detail': //Syslog 상세
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pSyslogDetail.do',
                        rowdata,
                        function (result) {
                            HmWindow.open($('#pwindow'), 'Syslog 상세', result, 800, 400);
                        }
                    );
                }
                break;
            /** syslog관리 - Config Backup */
            case 'cm_chgBackup': //
                break;
            /** L4세션 */
            case 'cm_l4_realSvrConStatus': //Real Server 접속현황
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        params = item.jqxGrid('getrowdata', rowidx);
                        $.extend(params, {
                            date1: $('#date1').val(),
                            date2: $('#date2').val()
                        });
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pL4RealSvr.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.devName + '] Real Server 접속현황', result, 1000, 650);
                        }
                    );
                }
                break;
            case 'cm_l4_alteonSessStatusByIp': //IP별 세션현황
                if (type === 'grid') {
                    try {
                        params = HmGrid.getRowData(item);
                        if (rowdata === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pL4AlteonSessStatus.do',
                        {mngNo: params.mngNo, date1: $('#date1').val(), date2: $('#date2').val()},
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + params.devName + '] IP별 세션현황', result, 1000, 650);
                        }
                    );
                }
                break;

            /* L4/L7세션 (F5) */
            case 'cm_l4_f5_virtualPerf': //Virtual Server 성능 그래프
                if (type === 'grid') {
                    try {
                        params = HmGrid.getRowData(item);
                        if (rowdata === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pL4F5SvrPerfChart.do',
                        {mngNo: params.mngNo, idx: params.idx, svrType: 'V'},
                        function (result) {
                            var targetInfo = params.devName + '-' + params.svrNm;
                            HmWindow.open($('#pwindow'), '[' + targetInfo + '] 성능 그래프', result, 1000, 650);
                        }
                    );
                }
                break;
            case 'cm_l4_f5_realPerf': //Real Server 성능 그래프
                if (type === 'grid') {
                    try {
                        params = HmGrid.getRowData(item);
                        if (rowdata === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pL4F5SvrPerfChart.do',
                        {mngNo: params.mngNo, idx: params.idx, svrType: 'R'},
                        function (result) {
                            var targetInfo = params.devName + '-' + params.svrNm;
                            HmWindow.open($('#pwindow'), '[' + targetInfo + '] 성능 그래프', result, 1000, 650);
                        }
                    );
                }
                break;
            case 'cm_l4_f5_trunkPerf': //Trunk 성능 그래프
                if (type === 'grid') {
                    try {
                        params = HmGrid.getRowData(item);
                        if (rowdata === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pL4F5TrunkPerfChart.do',
                        {mngNo: params.mngNo, idx: params.idx, svrType: 'T'},
                        function (result) {
                            var targetInfo = params.devName + '-' + params.trunkNm;
                            HmWindow.open($('#pwindow'), '[' + targetInfo + '] 성능 그래프', result, 1000, 650);
                        }
                    );
                }
                break;
            case 'cm_l4_f5_ifPerf': //Interface 성능 그래프
                if (type === 'grid') {
                    try {
                        params = HmGrid.getRowData(item);
                        if (rowdata === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pL4F5TrunkPerfChart.do',
                        {mngNo: params.mngNo, idx: params.idx, svrType: 'I'},
                        function (result) {
                            var targetInfo = params.devName + '-' + params.ifNm;
                            HmWindow.open($('#pwindow'), '[' + targetInfo + '] 성능 그래프', result, 1000, 650);
                        }
                    );
                }
                break;

            /** 섹타나인 L4/L7세션 */
            case 'cm_l4_f5_piolink_virtualPerf': //Virtual Server 성능 그래프
                if (type === 'grid') {
                    try {
                        params = HmGrid.getRowData(item);
                        if (rowdata === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pL4F5PiolinkPerfChart.do',
                        {mngNo: params.mngNo, idx: params.idx, svrType: 'V'},
                        function (result) {
                            var targetInfo = params.devName + '-' + params.svrNm;
                            HmWindow.open($('#pwindow'), '[' + targetInfo + '] 성능 그래프', result, 1000, 650);
                        }
                    );
                }
                break;
            case 'cm_l4_f5_piolink_realPerf': //Real Server 성능 그래프
                if (type === 'grid') {
                    try {
                        params = HmGrid.getRowData(item);
                        if (rowdata === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pL4F5PiolinkPerfChart.do',
                        {mngNo: params.mngNo, idx: params.idx, svrType: 'R'},
                        function (result) {
                            var targetInfo = params.devName + '-' + params.svrNm;
                            HmWindow.open($('#pwindow'), '[' + targetInfo + '] 성능 그래프', result, 1000, 650);
                        }
                    );
                }
                break;

            /** STARCELL SVR */
            case 'itmon_svr_detail':
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            invenId: rowdata.invenId,
                            agentIp: rowdata.agentIp,
                            invenName: rowdata.invenName
                        };
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/starcell/pItmonSvrDetail.do', $('#hForm'), 'pItmonSvrDetail', 1000, 650, params);
                }
                break;

            case 'itmon_svr_agentCtrl':
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            invenId: rowdata.invenId,
                            agentIp: rowdata.agentIp,
                            invenName: rowdata.invenName
                        };
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    Server.post('/code/getItmonSvcUrl.do', {
                        success: function (result) {
                            var host = result;
                            if (host == null || host.length == 0) {
                                alert('서비스 URL을 확인해주세요.');
                                return;
                            }
                            var opts = [];
                            opts.push('width=' + 350);
                            opts.push('height=' + 200);
                            opts.push('left=' + parseInt((screen.availWidth / 2) - (350 / 2)));
                            opts.push('top=' + parseInt((screen.availHeight / 2) - (200 / 2)));
                            opts.push('resizable=yes');
                            opts.push('scrollbars=no');
                            opts.push('status=no');
                            window.open(host + '/sms/widgets/run.jsp?name=itmon-exec-runAgent&ip=' + params.agentIp, 'pItmonSvrAgentCtrl', opts.join(',')).focus();
                        }
                    });
                }
                break;

            /** TMS */
            case 'cm_dosevt_detail':
                if (type === 'grid') {
                    try {
                        params = HmGrid.getRowData(item);
                        if (params === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/tms/pDosEvtData.do',
                        {evtNo: params.evtNo},
                        function (result) {
                            HmWindow.open($('#pwindow'), '이벤트 상세', result, 1000, 400);
                        }
                    );
                }
                break;

            /** traffic group detail */
            case 'grpDetail':
                if (type === 'grid') {
                    try {
                        rowdata = HmGrid.getRowData(item);
                        if (rowdata === null) {
                            alert('선택된 데이터가 없습니다.');
                            return;
                        }
                        params = {grpNo: rowdata.grpNo};
                    } catch (e) {
                        console.log(e);
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/tms/pTrafficGroupDetail.do', $('#hForm'), 'pTrafficGroupDetail' + params.grpNo, 1000, 400, params);
                }
                break;

            /** RACK */
            case 'cm_rack_detail': //랙상세정보
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    params = {};
                    params.mngNo = item.jqxGrid('getrowdata', rowidx).mngNo;
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/rack/pRackInfo.do', $('#hForm'), 'pRackInfo', 1420, screen.availHeight + 10, item.jqxGrid('getrowdata', rowidx));
                }
                break;

            /** ERR_ACTION */
            case 'cm_err_action': //장애조치
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    rowidx = item.jqxGrid('getselectedrowindex');
                    params = {};
                    params.mngNo = item.jqxGrid('getrowdata', rowidx).mngNo;
                } else return;

                if (params !== undefined || params !== '') {
                    var selectedrowindex = item.jqxGrid('getselectedrowindex');
                    var rowscount = item.jqxGrid('getdatainformation').rowscount;
                    if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                        var id = item.jqxGrid('getrowid', selectedrowindex);
                        var commit = item.jqxGrid('deleterow', id);
                    }
                    alert('삭제되었습니다.');
                }
                break;

            /** SECT */
            case 'cm_sect_perf': //이력 분석
                var nodeName = '';
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                        params = {
                            nodeNo: rowdata.nodeNo,
                            mngNo: rowdata.mngNo,
                            nodeName: rowdata.nodeName,
                            devName: rowdata.devName,
                            dstDevName: rowdata.dstDevName,
                            scIp: rowdata.fromIp,
                            tgIp: rowdata.toIp
                        };
                        nodeName = rowdata.nodeName;
                    } catch (e) {
                    }
                } else return;
                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pSectInfo.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '이력그래프 - ' + nodeName, result, 1100, 570);
                        }
                    );
                }
                break;

            /** 경로감시 */
            case 'cm_route_monit':
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
//                            console.log(rowdata);
                        params = {
                            routeNo: rowdata.routeNo,
                            mngNo: rowdata.mngNo,
                        };
                    } catch (e) {
                    }
                } else return;
                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pRouteConf.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '경로 비교', result, 1100, 500);
                        }
                    );
                }

                break;
            /** trap 상세 */
            case 'cm_trap_detail':
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    $.post(ctxPath + '/main/popup/nms/pTrapDetail.do',
                        rowdata,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), 'Trap 상세', result, 800, 400);
                        }
                    );
                }

                break;
            /** SLA - 품질관리 보상일 상세보기 */
            case 'cm_qcsla_reward':
                try {
                    var rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = item.jqxGrid('getrowdata', rowidx);
                    var params = {
                        yyyymm: rowdata.yyyymm.replace(/\D/ig, ''),
                        devName: rowdata.devName,
                        ifName: rowdata.ifName,
                        mngNo: rowdata.mngNo,
                        ifIdx: rowdata.ifIdx,
                        slaIp: rowdata.slaIp
                    };
                    $.post(ctxPath + '/main/popup/sla/pQcSlaRewardHist.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '보상일 상세보기', result, 800, 650, 'pwindow_init', params);
                        }
                    );
                } catch (e) {
                }
                break;
            /** Avaya phone monitor detail */
            case 'cm_phone_detail':
                try {
                    var rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = item.jqxGrid('getrowdata', rowidx);

                    var mngNo = item.jqxGrid('getrowdata', item.jqxGrid('getselectedrowindex')).mngNo || item.jqxGrid('getrowdata', item.jqxGrid('getselectedrowindex')).MNG_NO;
                    var phoneIp = item.jqxGrid('getrowdata', item.jqxGrid('getselectedrowindex')).phoneIp;
                    var extNum = item.jqxGrid('getrowdata', item.jqxGrid('getselectedrowindex')).extPort;
                    var params = {phoneIp: phoneIp, mngNo: mngNo, extNum: extNum};
                    $.post(ctxPath + '/main/popup/ipt/pPhoneDetailInfo.do', params, function (result) {
                        HmWindow.open($('#pwindow'), '상세정보', result, 880, 300, 'p2window_init', params);
                    });

                } catch (e) {
                }
                break;
            case 'cm_alone_ups_detail':
                var rowdata = HmGrid.getRowData(item);
                var _params = {
                    mngNo: rowdata.mngNo
                };
                HmUtil.createPopup('/main/popup/innotube/pAloneUpsDetail.do', $('#hForm'), 'pAloneUpsDetail', 1000, 620, _params);
                break;
            case 'cm_was_detail': //WAS상세
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                    } catch (e) {
                    }
                } else return;

                if (params !== undefined || params !== '') {
                    HmUtil.createPopup('/main/popup/sms/pWasDetail.do', $('#hForm'), 'pWasDetail', 1300, 700, rowdata);
                }
                break;
            case 'cm_dbms_detail': //WAS상세
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                    } catch (e) {
                    }
                } else return;
                var url = '';
                var dbmsKindUpper = rowdata.dbmsKind.toUpperCase();
                switch (dbmsKindUpper) {
                    case 'ORACLE':
                        url = '/main/popup/sms/pDbmsOracleDetail.do';
                        break;
                    case 'MYSQL':
                        url = '/main/popup/sms/pDbmsMysqlDetail.do';
                        break;
                    case 'MSSQL':
                        url = '/main/popup/sms/pDbmsMssqlDetail.do';
                        break;
                    case 'TIBERO':
                        url = '/main/popup/sms/pDbmsTiberoDetail.do';
                        break;
                }
                if (params !== undefined || params !== '') {
                    HmUtil.createPopup(url, $('#hForm'), 'pDbmsDetail' + rowdata.dbmsNo, 1300, 700, rowdata);
                }
                break;
            case 'cm_codec_detail': // 코덱 상세
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                    } catch (e) {
                    }
                } else return;

                // if (params !== undefined || params !== ''){
                //     HmUtil.createPopup('/main/popup/nms/pCodecDetail.do', $('#hForm'), 'pWasDetail', 1300, 700, rowdata);
                // }
                $.post(ctxPath + '/main/popup/nms/pCodecDetail.do',
                    null,
                    function (result) {
                        HmWindow.open($('#pwindow'), '코덱상세', result, 1300, 720, 'pwindow_init', rowdata);
                    }
                );
                break;

            /** 공통 */
            case 'cm_filter': //필터
                item.jqxGrid('beginupdate');
                if (item.jqxGrid('filterable') === false) {
                    item.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    item.jqxGrid({showfilterrow: !item.jqxGrid('showfilterrow')});
                }, 300);
                item.jqxGrid('endupdate');
                break;
            case 'cm_filterReset': //필터초기화
                item.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr': //컬럼관리
                var _sAuth = ($('#sAuth').val() || 'User').toUpperCase();
                /**
                 * 컬럼관리 적용 정책
                 *  grid object data-cfgpage 속성으로 단일그리드 적용
                 *  item.data('cfgpage') === true
                 */
                    // data-cfgpage 값이 undefined인 경우 default = true
                var iscfgpage = item.data('cfgpage') === undefined ? true : item.data('cfgpage');
                if (iscfgpage === true && _sAuth == 'SYSTEM') {
                    $.post(ctxPath + '/main/popup/comm/pGridColsSysMgr.do',
                        function (result) {
                            HmWindow.open($('#pwindow'), '시스템 컬럼 관리', result, 600, 600, 'pwindow_init', item);
                        }
                    );
                } else {
                    $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                        function (result) {
                            HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', item);
                        }
                    );
                }
                break;
            case 'cm_copyCell':
                var _datafield = item.attr('data-datafield');
                if (_datafield === undefined) {
                    alert('셀 정보가 없습니다.');
                    return;
                }
                var rowdata = HmGrid.getRowData(item);
                console.log("this is rowdata", rowdata)
                HmUtil.copyToClipboard(rowdata[_datafield]);
                break;
            case 'cm_run_reserve':

                if (type === 'grid') {
                    try {

                        var rowIdxes = HmGrid.getRowIdxes(item, '선택한 스케줄러가 없습니다.');
                        if (rowIdxes.length != 1) {
                            alert('한건만 설정 할 수 있습니다.');
                            return;
                        }

                        if (!confirm("3분뒤로 예약됩니다.\n 진행하시겠습니까?")) return;

                        var rowData = HmGrid.getRowData(item, rowIdxes[0]);
                        Server.post('/main/com/autoCommon/autoRunCommand.do', {
                            data: {jobNo: rowData.jobNo},
                            success: function (result) {
                                alert('예약되었습니다.');
                                Main.search();
                                var _restParam = {};
                                _restParam.RESERVATION = {
                                    INSERT: [result.reserveNo]
                                };
                                ServerRest.reqCronTab(_restParam);
                                $('#pbtnClose').click();
                            }//success()
                        });//Server.post();

                    } catch (e) {
                    }
                } else return;
                break;
            case 'cm_run_hist':

                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                    } catch (e) {
                    }
                } else return;

                $.post(ctxPath + '/main/popup/env/pAutoCmdList.do',
                    null,
                    function (result) {
                        HmWindow.open($('#pwindow'), '실행 명령어 목록', result, 450, 300, 'pwindow_init', rowdata);
                    }
                );
                break;
            case 'cm_run_hist_detail':

                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        rowdata = item.jqxGrid('getrowdata', rowidx);
                    } catch (e) {
                    }
                } else return;

                $.post(ctxPath + '/main/popup/env/pRunHistDetail.do',
                    null,
                    function (result) {
                        HmWindow.open($('#pwindow'), '명령어실행 상세내용', result, 720, 720, 'pwindow_init', rowdata);
                    }
                );
                break;
            case 'cm_user_conf_batch_set':
                var selectdata = HmGrid.getRowDataList(item);
                rowdata = [];
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        $.each(selectdata, function (idx, item) {
                            rowdata.push(item.userId);
                        });
                        // console.dir(rowdata);
                    } catch (e) {
                    }
                } else return;

                $.post(ctxPath + '/main/popup/env/pUserConfBatchSet.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '사용자정보 일괄 설정', result, 500, 305, 'pwindow_init', rowdata);
                    }
                );
                break;
            case 'cm_user_login':
                if (type === 'grid') {
                    try {
                        var rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        var rowdata = item.jqxGrid('getrowdata', rowidx);

                        var _userId = $('#sUserId').val();
                        if (_userId == rowdata.userId) {
                            alert('이미 해당 ID로 로그인되어있습니다.');
                            return;
                        }

                        if (confirm("[" + rowdata.userId + "] 계정으로 로그인 됩니다."))

                            Server.post('/login/autoLogin.do', {
                                data: {userId: rowdata.userId},
                                success: function (result) {
                                    location.href = result.url;
                                }
                            });//Server.post
                    } catch (e) {
                    }
                } else return;

                // $.post(ctxPath + '/main/popup/env/pUserConfBatchSet.do',
                //     function (result) {
                //         HmWindow.open($('#pwindow'), '사용자정보 일괄 설정', result, 500, 305, 'pwindow_init', rowdata );
                //     }
                // );
                break;
            case 'cm_each_limit_batch_set':
                var selectdata = HmGrid.getRowDataList(item);
                var evtCond, mngNo = null;
                rowdata = [];
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        $.each(selectdata, function (idx, item) {
                            rowdata.push(item);
                            evtCond = item.evtCond;
                            mngNo = item.mngNo;
                        });
                        // console.dir(rowdata);
                    } catch (e) {
                    }
                } else return;
                $.post(ctxPath + '/main/popup/env/pEachLimitBatchSet.do',
                    function (result) {
                        if (evtCond == 0) {
                            //상태
                            if (mngNo == null) {
                                HmWindow.open($('#pwindow'), '임계치 일괄 설정', result, 400, 308, 'pwindow_init', rowdata);
                            } else {
                                HmWindow.open($('#pwindow'), '임계치 일괄 설정', result, 400, 240, 'pwindow_init', rowdata);
                            }
                        } else {
                            //임계
                            if (mngNo == null) {
                                HmWindow.open($('#pwindow'), '임계치 일괄 설정', result, 400, 340, 'pwindow_init', rowdata);
                            } else {
                                HmWindow.open($('#pwindow'), '임계치 일괄 설정', result, 400, 272, 'pwindow_init', rowdata);
                            }
                        }
                    }
                );
                break;
            case 'cm_fms_sensor_rack':
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;

                    var rowData = item.jqxGrid('getrowdata', item.jqxGrid('getselectedrowindex'));

                    params = {};
                    params.fmsSeqNo = rowData.fmsSeqNo;
                    params.rackNo = rowData.rackNo;

                    HmUtil.createPopup('/main/popup/env/pRackFmsSensor.do', $('#hForm'), 'pRackFmsSensor', 1000, 600, params);
                }
                break;
            case 'cm_tms_rtTraffic_evtStop':
                var selectdata = HmGrid.getRowDataList(item);
                rowdata = [];
                if (type === 'grid') {
                    try {
                        rowidx = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                        if (rowidx === false) return;
                        $.each(selectdata, function (idx, data) {
                            console.dir(data);
                            rowdata.push(data.SEQ_NO);
                        });
                        //버튼 클릭하면 이벤트 해제할거냐고 물어보고 끝내는 용도,, 나중에 이벤트 상세 팝업 + 거기에서 이벤트해제로 변경
                        if (!confirm(selectdata.length + ' 건의 이벤트를 해제하시겠습니까?')) return;

                        Server.post('/main/tms2/rtTrafficMonit/saveEvtStop.do', {
                            data: {seqNos: rowdata},
                            success: function (result) {
                                $.each(selectdata, function (idx, value) {
                                    item.jqxGrid('deleterow', value.uid);
                                });
                                alert("선택한 이벤트가 해제 되었습니다.");
                            }//success()
                        });//Server.post();
                    } catch (e) {
                    }
                } else return;
                break;
            case 'tb_com_service_detail':
                if (type === 'grid') {
                    rowidxes = HmGrid.getRowIdxes(item, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;

                    var rowData = item.jqxGrid('getrowdata', item.jqxGrid('getselectedrowindex'));
                    params = {};
                    params.svcType = rowData.svcType;
                    params.svcNo = rowData.svcNo;

                    if (rowData.svcType == 'TCP') {
                        params.titleName = rowData.svcName + ' [' + rowData.ip + ':' + rowData.port + ']';
                    } else {
                        params.titleName = rowData.svcInfo;
                    }

                    HmUtil.createPopup('/main/popup/nms/pRestimePerf.do', $('#hForm'), 'pRestimePerf', 1000, 600, params);
                }
                break;

            /** 쿠버네티스 - 네임스페이스 */
            case 'kub_namespace_detail': //네임스페이스 상세
                var namespaceNo = -1;
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    namespaceNo = item.jqxGrid('getrowdata', rowidx).namespaceNo || item.jqxGrid('getrowdata', rowidx).NAMESPACE_NO;
                    params = {
                        namespaceNo: namespaceNo
                    };
                } else if (type === 'highchart') {
                    namespaceNo = item.ctxData.srcElement.point.namespaceNo;
                    params = {
                        namespaceNo: namespaceNo
                    };
                } else return;

                if (params !== undefined || params !== '')
                    HmUtil.createPopup('/main/popup/sms/pNamesMonitorDtl.do?=' + namespaceNo, $('#hForm'), 'pNamesMonitorDtl', 1300, 700);
                break;

            /** 쿠버네티스 - 파드 */
            case 'kub_pod_detail': //파드 상세
                var podNo = -1;
                if (type === 'grid') {
                    rowidx = HmGrid.getRowIdx(item, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    podNo = item.jqxGrid('getrowdata', rowidx).podNo || item.jqxGrid('getrowdata', rowidx).POD_NO;
                    params = {
                        podNo: podNo
                    };
                } else if (type === 'highchart') {
                    podNo = item.ctxData.srcElement.point.podNo;
                    params = {
                        podNo: podNo
                    };
                } else return;

                if (params !== undefined || params !== '')
                    HmUtil.createPopup('/main/popup/sms/pPodMonitorDtl.do?=' + podNo, $('#hForm'), 'pPodMonitorDtl', 1300, 700);
                break;
        }
    }
};

var Extensions = {
    isSupport: function () {
        var isSupported = false;
        const agt = navigator.userAgent.toLowerCase();
        if (agt.indexOf("chrome") !== -1) {
            isSupported = true;
        }
        return isSupported;
    },

    check: function detectExtension(extensionId, ip, id, port, isProxyUse, proxyPort, proxyHost) {

        var img = new XMLHttpRequest();
        var connUserId = 'root';
        var connPort = 22;
        var proxyHostName = location.hostname;
        var proxyPortNum = 8084;
        var proxyUse = false;
        if (id !== undefined && id !== null && id !== '') {
            connUserId = id;
        }
        if (port !== undefined && port !== null && port !== '') {
            connPort = port;
        }
        if (isProxyUse !== undefined && isProxyUse !== null && (isProxyUse === 'true' || isProxyUse)) {
            proxyUse = isProxyUse;

            if (proxyPort !== undefined && proxyPort !== null && proxyPort !== '') {
                proxyPortNum = proxyPort
            }
            if (proxyHost !== undefined && proxyHost !== null && proxyHost !== '') {
                proxyHostName = proxyHost;
            }
        }

        img.open('GET', "chrome-extension://" + extensionId + "/html/nassh.html", true);
        img.onload = function () {
            var extUrl = '';
            if (proxyUse) {
                extUrl = '@' + proxyHostName + ':' + proxyPortNum;
            }
            window.open('chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html#' + connUserId + '@' + ip + ':' + connPort + extUrl, '_blank');
        };
        img.onerror = function () {
            Extensions.chromeExtensionSetup();
        };
        img.send();
    },
    chromeExtensionSetup: function () {
        $.post(ctxPath + '/main/popup/com/pSecureShellInstall.do', function (result) {
            HmWindow.openFit($('#pwindow'), 'Secure Shell 설치', result, 400, 240, 'pwindow_init', {});
        });
    },
    ssh: function (ip, id, port, isProxyUse, proxyPort, proxyHost) {
        var _isProxyUse = $('#gSSHRelayServerUse').val() == 'Y' ? true : false;
        var _proxyHost = $('#gSSHRelayServerIp').val();
        var _proxyPort = $('#gSSHRelayServerPort').val();
        var mngNo = id;

        try {
            if (this.isSupport() === false) return;
            Server.post('/dev/getTelnet20ForDevIp.do', {
                data: {devIp: ip, mngNo: mngNo},
                success: function (result) {
                    var _id, _port;
                    if (result != null) {
                        _id = result.userId;
                        _port = result.port;
                    }
                    Extensions.check('iodihamcpbpeioajjeobimgagajmlibd', ip, _id, _port, _isProxyUse, _proxyPort, _proxyHost);
                }
            });
        } catch (e) {
            Extensions.chromeExtensionSetup();
            // alert('Chrome 확장 플러그인 Secure Shell 설치가 필요합니다.');
        }
    }
}

/**
 * 필수!!!!
 * IE -> 인터넷옵션 > 보안 > 인터넷 사용자지정수준 > [스크립팅하기 안전하지 않는 것으로 표시된 ActiveX 컨트롤 초기화 및 스크립팅] 을 확인으로 변경
 */
var ActiveX = {
    isSupport: function () {

        var isSupported = false;
        if (window.ActiveXObject) return true;
        if ("ActiveXObject" in window) return true;
        try {
            var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
            isSupported = true;
        } catch (e) {
            if (e.name === "TypeError" || e.name === "Error") {
                isSupported = true;
            }
        }
        if (isSupported === false) {
            alert('ActiveXObject를 지원하지 않는 브라우저입니다.');
        }
        return isSupported;
    },

    ping: function (ip) {
        try {
            var siteName = $('#gSiteName').val();
            if (siteName == 'KTnG') {
            } else {
                if (this.isSupport() === false) return;
                var objShell = new ActiveXObject("WScript.Shell");
                objShell.run("cmd.exe /c ping " + ip);
            }
        } catch (e) {
            alert('도구 > 인터넷옵션 > 보안 > 인터넷 사용자지정수준 > [스크립팅하기 안전하지 않는 것으로 표시된 ActiveX 컨트롤 초기화 및 스크립팅]을 확인으로 변경해주세요.');
        }
    },

    telnet: function (ip) {
        try {
            if (this.isSupport() === false) return;
            var objShell = new ActiveXObject("WScript.Shell");
            objShell.run("cmd.exe /c telnet " + ip);
        } catch (e) {
            alert('도구 > 인터넷옵션 > 보안 > 인터넷 사용자지정수준 > [스크립팅하기 안전하지 않는 것으로 표시된 ActiveX 컨트롤 초기화 및 스크립팅]을 확인으로 변경해주세요.');
        }
    },

    tracert: function (ip) {
        try {
            if (this.isSupport() === false) return;
            var objShell = new ActiveXObject("WScript.Shell");
            objShell.run("cmd.exe /c tracert " + ip);
        } catch (e) {
            alert('도구 > 인터넷옵션 > 보안 > 인터넷 사용자지정수준 > [스크립팅하기 안전하지 않는 것으로 표시된 ActiveX 컨트롤 초기화 및 스크립팅]을 확인으로 변경해주세요.');
        }
    },

    ssh: function (ip) {
        try {
            if (this.isSupport() === false) return;
            var objShell = new ActiveXObject("WScript.Shell");
            objShell.run("c:/netis/utils/putty.exe " + ip);
        } catch (e) {
            alert('c:/netis/utils/폴더에 putty.exe 파일을 넣어주세요.');
        }
    },

    http: function (ip) {
        window.open('http://' + ip + ':' + $('#gHttpPort').val(), '_blank');
    },

    https: function (ip) {
        window.open('https://' + ip + ':' + $('#gHttpsPort').val(), '_blank');
    }
};


/** jQuery extends */
$.extend({
    /** null check */
    isBlank: function (val) {
        var tmp = $.trim(val);
        if (tmp !== undefined && tmp != null && tmp.length > 0)
            return false;
        else
            return true;
    },

    isEmpty: function (obj) {
        if (obj !== undefined && obj != null)
            return false;
        else
            return true;
    },
    // param = ($('#ip), '아이피', byte))
    validateLength: function (obj, name, byte) {
        if (!obj instanceof Object) {
            console.log("인자값이 object가 아닙니다.");
            return false;
        }

        var objLength = obj.val().length;
        var objCon = obj.val();
        var i = 0;
        var resultLength = 0;

        for (; i < objLength; i++) {
            var _charASCII = objCon.charCodeAt(i);
            // 공백
            if (_charASCII == 32)
                resultLength += 0;
            // 숫자
            else if (_charASCII >= 48 && _charASCII <= 57)
                resultLength += 1;
            // 영어(대문자)
            else if (_charASCII >= 65 && _charASCII <= 90)
                resultLength += 2;
            // 영어(소문자)
            else if (_charASCII >= 97 && _charASCII <= 122)
                resultLength += 3;
            // 특수기호
            else if ((_charASCII >= 33 && _charASCII <= 47) || (_charASCII >= 58 && _charASCII <= 64) || (_charASCII >= 91 && _charASCII <= 96)
                || (_charASCII >= 123 && _charASCII <= 126))
                resultLength += 4;
            // 한글
            else if ((_charASCII >= 12592) || (_charASCII <= 12687))
                resultLength += 5;
            else
                resultLength += 9;
        }

        if (resultLength > byte) {
            alert(name + "의 길이는 " + byte + "Byte를 넘을 수 없습니다.");
            return false;
        } else {
            return true;
        }
    },
    validateIp: function (strIP) {
        var regExp = /^(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5])))$/;
        return regExp.test(strIP);
    },

    validateEmail: function (email) {
        var regExp = (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/);
        return regExp.test(email);
    },

    // 18.05.29] RouteHop에서 사용하는 IP 등록 형식 정규식
    validateIpRouteHop: function (strIP) {
        var regExp = /^(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5])))$/;
        // 'IP (IP)' 형식
        var ip_regExp = /^(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5])))\s(\((((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5])))\))$/;
        // 둘 중 하나의 형식이 맞으면 true 리턴
        return regExp.test(strIP) || ip_regExp.test(strIP);
    },

    // 2015-01-01 12:00, 2015-01-02 13:00
    validateDate: function (obj1, obj2) {
        if (!obj1 instanceof Object || !obj2 instanceof Object) {
            console.log("인자값이 object가 아닙니다.");
            return false;
        }

        if (obj1.val().length == 0 || obj2.val().length == 0) {
            return false;
        }
        if (obj1.val() >= obj2.val()) {
            alert('검색조건(기간)을 다시 확인해 주세요.');
            return false;
        }

        return true;
    },
    // 2015-01-01 13, 2015-01-01 15
    validateDateHours: function (obj1, obj2) {
        if (!obj1 instanceof Object || !obj2 instanceof Object) {
            console.log("인자값이 object가 아닙니다.");
            return false;
        }

        if (obj1.val().length == 0 || obj2.val().length == 0) {
            return false;
        }
        if (obj1.val() > obj2.val()) {
            alert('검색조건(기간)을 다시 확인해 주세요.');
            return false;
        } else {
            return true;
        }
    },

    // 2015-01-01 , 12:00, 2015-02-02, 13:00
    validateDateTime: function (date1, time1, date2, time2) {
        if (!date1 instanceof Object || !time1 instanceof Object || !date2 instanceof Object || !time2 instanceof Object) {
            console.log("인자값이 object가 아닙니다.");
            return false;
        }
        if (date1.val() > date2.val()) {
            alert('검색조건(날짜)을 다시 확인해 주세요.');
            return false;
        }
        if (date1.val() == date2.val()) {
            if (time1.val() >= time2.val()) {
                alert('검색조건(시간)을 다시 확인해 주세요.');
                return false;
            }
        }
    },

    restrictInput: function (obj, restrictChar) {
        var regexp = new RegExp(restrictChar, "g");
        obj.value = obj.value.replace(regexp, '');
    }

});

$.extend({

    requireInput: function (obj, preMsg) {
        if (obj.val().isBlank()) {
            alert(preMsg + ' 입력해주세요.');
            obj.focus();
            return false;
        }
        return true;
    }

});
var tcpFlagUtil = {
    tcpFlagToNo: function (tcpFlag) {
        var _tcpFlag = tcpFlag;
        var b_urg = false;
        var b_ack = false;
        var b_psh = false;
        var b_rst = false;
        var b_syn = false;
        var b_fin = false;
        var b_nul = false;
        var _flagList = [];
        if (_tcpFlag >= 32) {
            b_urg = true;
            _flagList.push(32);
            _tcpFlag = _tcpFlag - 32;
        }
        if (_tcpFlag >= 16) {
            b_ack = true;
            _flagList.push(16);
            _tcpFlag = _tcpFlag - 16;
        }
        if (_tcpFlag >= 8) {
            b_psh = true;
            _flagList.push(8);
            _tcpFlag = _tcpFlag - 8;
        }
        if (_tcpFlag >= 4) {
            b_rst = true;
            _flagList.push(4);
            _tcpFlag = _tcpFlag - 4;
        }
        if (_tcpFlag >= 2) {
            b_syn = true;
            _flagList.push(2);
            _tcpFlag = _tcpFlag - 2;
        }
        if (_tcpFlag >= 1) {
            b_syn = true;
            _flagList.push(1);
            _tcpFlag = _tcpFlag - 1;
        }
        if (_tcpFlag >= 0) {
            b_nul = true;
            _flagList.push(0);
        }

        return _flagList;
    },

    /** no값을 tcpFlag 문자열로 변환 */
    noToTcpFlag: function (tcpFlag) {
        var isUrg = false, isAck = false, isPsh = false, isRst = false, isSyn = false, isFin = false, isNul = false;
        if (tcpFlag >= 32) {
            isUrg = true;
            tcpFlag -= 32;
        }
        if (tcpFlag >= 16) {
            isAck = true;
            tcpFlag -= 16;
        }
        if (tcpFlag >= 8) {
            isPsh = true;
            tcpFlag -= 8;
        }
        if (tcpFlag >= 4) {
            isRst = true;
            tcpFlag -= 4;
        }
        if (tcpFlag >= 2) {
            isSyn = true;
            tcpFlag -= 2;
        }
        if (tcpFlag >= 1) {
            isFin = true;
            tcpFlag -= 1;
        }
        if (tcpFlag >= 0) {
            isNul = true;
        }

        var result = "";
        if (isUrg) result = "URG";
        if (isAck) result += result != "" ? "+ACK" : "ACK";
        if (isPsh) result += result != "" ? "+PSH" : "PSH";
        if (isRst) result += result != "" ? "+RST" : "RST";
        if (isSyn) result += result != "" ? "+SYN" : "SYN";
        if (isFin) result += result != "" ? "+FIN" : "FIN";
        if (isNul) {
            if (result == "") result = "NUL";
        }
        return result;
    }
};
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var getCookie = function (cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if (start != -1) {
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if (end == -1) end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}

var ServerRest = {

    restCall: function (_URL, _PARAM) {

        if (_PARAM.data == undefined) {
            alert('파라미터가 세팅되지 않았습니다.');
            return;
        }

        $.ajax({
            "headers": {
                "Content-Type": "application/json"
            },
            method: 'POST',
            url: _URL,
            dataType: 'json',
            data: JSON.stringify(_PARAM.data),
            processData: false,
            contentType: false,
            success: function (data) {

                console.log('data', data);

                if (_PARAM.success != undefined && typeof _PARAM.success == 'function') {
                    _PARAM.success(data);
                }
            },
            error: function (jqXHR, status, error) {
                console.log('status', status);
                console.log('error', error);
                if (jqXHR.responseText == undefined) {
                    alert("서버가 응답하지 않습니다. IP:PORT를 확인해주세요");
                } else {
                    alert("[" + status + "]" + jqXHR.responseText);
                }

                if (_PARAM.error != undefined && typeof _PARAM.error == 'function') {
                    _PARAM.error();//error 사용시 조심할것 (위에 alert창이 뜬다.)
                }
            }
        });//$.ajax
    },

    cupidRest: function ({_REST_PATH = "/nms/perf/dev", _REST_PARAM, _CALLBACK}) {

        console.log("cupidRest ");
        console.log($('#gCupidRestIp').val());

        var _cupidRestIp = $('#gCupidRestIp').val();


        //var _cupidRestIp = '10.1.3.154';
        var _cupidRestPort = $('#gCupidRestPort').val();
        var _protocol = window.location.protocol;
        console.log('_REST_PARAM', _REST_PARAM);
        this.restCall(_protocol + '//' + _cupidRestIp + ':' + _cupidRestPort + '' + _REST_PATH, {
            data: _REST_PARAM,
            success: function (data) {
                if (_CALLBACK != undefined && typeof _CALLBACK == 'function') {
                    _CALLBACK(data);
                }
            }//success
        });
        // $.ajax({
        //     "headers": {
        //         "Content-Type": "application/json"
        //     },
        //     method: 'POST',
        //     url: _protocol + '//' + _cupidRestIp + ':' + _cupidRestPort + '' + _REST_PATH,
        //     dataType: 'json',
        //     data: JSON.stringify(_REST_PARAM),
        //     processData: false,
        //     contentType: false,
        //     success: function (data) {
        //
        //         console.log('data', data);
        //
        //         if(_CALLBACK != undefined && typeof _CALLBACK == 'function'){
        //             _CALLBACK(data);
        //         }
        //
        //
        //     },
        //     error: function (jqXHR, status, error) {
        //         console.log('status', status);
        //         console.log('error', error);
        //         if (jqXHR.responseText == undefined) {
        //             alert("서버가 응답하지 않습니다. IP:PORT를 확인해주세요");
        //         } else {
        //             alert("[" + status + "]" + jqXHR.responseText);
        //         }
        //     }
        // });//$.ajax
    },



    cupidHealthCheck: function ({_REST_PATH = "/nms/health/dev", _GUID}) {
        var _cupidRestIp = $('#gCupidRestIp').val();
        // var _cupidRestIp = '10.1.3.205';



        var _cupidRestPort = $('#gCupidRestPort').val();
        var _protocol = window.location.protocol;

        this.restCall(_protocol + '//' + _cupidRestIp + ':' + _cupidRestPort + '' + _REST_PATH, {
            data: {
                MSG_SEND: "WEB",
                MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),
                RTN_TARGET: _GUID,
            }
        })

        // $.ajax({
        //     "headers": {
        //         "Content-Type": "application/json"
        //     },
        //     method: 'POST',
        //     url: _protocol + '//' + _cupidRestIp + ':' + _cupidRestPort + '' + _REST_PATH,
        //     dataType: 'json',
        //     data: JSON.stringify({
        //         MSG_SEND: "WEB",
        //         MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),
        //         RTN_TARGET: _GUID,
        //     }),
        //     processData: false,
        //     contentType: false,
        //     success: function (data) {
        //         console.log('healthCheck Result', data);
        //     },
        //     error: function (jqXHR, status, error) {
        //         console.log('status', status);
        //         console.log('error', error);
        //         if (jqXHR.responseText == undefined) {
        //             alert("서버가 응답하지 않습니다. IP:PORT를 확인해주세요");
        //         } else {
        //             alert("[" + status + "]" + jqXHR.responseText);
        //         }
        //     }
        // });//$.ajax
    },

    reqCronTab: function (_PARAM, _CALLBACK) {
        var _cronRestIp = $('#gCronRestIp').val();
        //var _cronRestIp = '10.1.3.154';
        var _cronRestPort = $('#gCronRestPort').val();
        var _protocol = window.location.protocol;
        console.log(_PARAM);

        this.restCall(_protocol + '//' + _cronRestIp + ':' + _cronRestPort + '/nms/ReqCronTab', {
            data: _PARAM,
            success: function () {
                if (_CALLBACK != undefined && typeof _CALLBACK == 'function') {
                    _CALLBACK();
                }
            }
        })

        // $.ajax({
        //     "headers": {
        //         "Content-Type": "application/json"
        //     },
        //     method: 'POST',
        //     url: _protocol + '//' + _cronRestIp + ':' + _cronRestPort + '/nms/ReqCronTab',
        //     dataType: 'json',
        //     data: JSON.stringify(_PARAM),
        //     processData: false,
        //     contentType: false,
        //     success: function (data) {
        //         console.log('healthCheck Result', data);
        //         if (typeof _CALLBACK == 'function') {
        //             _CALLBACK();
        //         }
        //     },//success
        //     error: function (jqXHR, status, error) {
        //         console.log('status', status);
        //         console.log('error', error);
        //         if (jqXHR.responseText == undefined) {
        //             alert("서버가 응답하지 않습니다. IP:PORT를 확인해주세요");
        //         } else {
        //             alert("[" + status + "]" + jqXHR.responseText);
        //         }
        //     }//error
        // });//$.ajax
    },
    callCfgback: function (_PARAM, _CALLBACK, _ERR_CALLBACK) {
        var _cupidRestIp = $('#gCupidRestIp').val();
        //var _cupidRestIp = '10.1.3.154';
        var _cupidRestPort = $('#gCupidRestPort').val();
        var _protocol = window.location.protocol;
        console.log(_PARAM);

        this.restCall(_protocol + '//' + _cupidRestIp + ':' + _cupidRestPort + '/nms/perf/cli', {
            data: _PARAM,
            success: function (data) {
                if (_CALLBACK != undefined && typeof _CALLBACK == 'function') {
                    _CALLBACK(data);
                }
            },//success(data)
            error: function () {
                if (_ERR_CALLBACK != undefined && typeof _ERR_CALLBACK == 'function') {
                    _ERR_CALLBACK();
                }
            }
        });//this.restCall();

        // $.ajax({
        //     "headers": {
        //         "Content-Type": "application/json"
        //     },
        //     method: 'POST',
        //     url: _protocol + '//' + _cupidRestIp + ':' + _cupidRestPort + '/nms/perf/cli',
        //     dataType: 'json',
        //     data: JSON.stringify(_PARAM),
        //     processData: false,
        //     contentType: false,
        //     success: function (data) {
        //         console.log('config backup Result', data);
        //         if (typeof _CALLBACK == 'function') {
        //             _CALLBACK(data);
        //         }
        //     },//success
        //     error: function (jqXHR, status, error) {
        //         console.log('status', status);
        //         console.log('error', error);
        //         if (typeof _CALLBACK == 'function') _ERR_CALLBACK(); //프로그래스바 닫는게 있는 function(이게 없으면 프로그래스바가 안닫힐 가능성이 있음)
        //         if (jqXHR.responseText == undefined) {
        //
        //             alert("서버가 응답하지 않습니다. IP:PORT를 확인해주세요");
        //         } else {
        //             alert("[" + status + "]" + jqXHR.responseText);
        //         }
        //     }//error
        // });//$.ajax
    },


}

//2022.12.05 로딩이미지 띄우기
var LoadingImg = {
    startLoadingImg: function ($id) {
        //$id : 로딩중 이미지가 표시되야 하는 영역을 jquery 변수처리한 것
        //예) $rptChart = $('#rptChart')
        var left = $id.width() / 2 - 52;
        var top = $id.height() / 2 - 16;

        var imgHtml =
            '<div id="loadingImage" style="display: none;width:100px;height:33px;background-color: #f6f6f6;color:#767676;padding:5px;font-size:12px;border:1px solid #898989;z-index:99999;" >' +
            '   <div style="float: left;">' +
            '       <div style="float: left;width:32px;height:32px;" class="jqx-grid-load"></div>' +
            '       <span style="float: left;margin-left: 7px;width: 60px;height: 32px;line-height: 35px;">로딩중...</span>' +
            '   </div>' +
            '</div>';

        $('.scontent').append(imgHtml);

        $("#loadingImage").css({
            "display": "block",
            "position": "absolute",
            "left": left,
            "top": top,
        });
    },

    endLoadingImg: function () {
        // $("#loadingImage").css("display", "none");
        $("#loadingImage").remove();
    },
}

/* 유용한 함수 */
var Hlpr = {

    /**
     * 폼에서 값을 입력하지 않을 시, DB에 공백 값 저장됨
     * 이를 방지하기 위해, 공백인 값을 params 에서 제거
     * 즉, 입력한 값만 filter 해서 보냄
     * values 형태는 json 형태
     */
    noBlankParams: function (values) {
        var keys = Object.keys(values);
        var params = {};
        $.each(keys, function (idx, key) {
            if (!$.isBlank(values[key])) {
                params[key] = values[key]
            }
        });
        return params;
    },

    /**
     * 특정 문자 이전 문자열 반환
     * @param str 문자열
     * @param char 특정문자
     * @example str: '전체(32)' | char: '(' | 반환값: '전체'
     */
    sliceCharBeforeStr: function (str, char) {
        var findIndex = str.indexOf(char);
        if (findIndex === -1) return str;

        return str.substring(0, findIndex);
    },

    /**
     * @param date '2023-04-14 09:22:10' 형태 값
     * yyyymmdd, ymdhms 구하기
     */
    noFormatDate: function (date) {
        if (!date) return {};
        var splitArr = date.split(' ');
        var ymd = splitArr[0].replaceAll('-', '');
        var hms = splitArr[1].replaceAll(':', '');
        var hour = hms.substring(0, 2);
        var min = hms.substring(2, 4);
        var sec = hms.substring(4, 6);

        return {
            yyyymmdd: ymd,
            ymdhms: ymd + hms,
            hms: hms,
            hour: hour,
            min: min,
            sec: sec
        }
    },
}