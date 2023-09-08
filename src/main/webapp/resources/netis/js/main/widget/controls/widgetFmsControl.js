/**
 * 시설관리(FMS) 위젯 컨트롤
 */

$.extend(HmWidgetConst.ctrlData, {
    /* UPS감시 */
    fmsUpsState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },

    /* 항온항습기감시 */
    fmsThermometerState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        },
        StatUI_TeHu: {
            controller: 'FmsSensorTeHuController'
        }
    },

    /* 온습도감시 */
    fmsTeHuState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '25%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'teVal', type: 'number', text: '온도(℃)', width: '15%', cellsalign: 'center'},
            {name: 'huVal', type: 'number', text: '습도(%)', width: '15%', cellsalign: 'center'}
        ],
        StatUI_TeHu: {
            controller: 'FmsSensorTeHuController'
        }
    },

    /* 배터리감시 */
    fmsBatteryState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },

    /* 소방감시 */
    fmsFireState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },

    /* 전력감시 */
    fmsPowerState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },

    /* 누수감시 */
    fmsLeakState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },

    /* 온도감시 */
    fmsTempState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'val1', type: 'number', text: '온도(℃)', width: '20%', cellsalign: 'right'}
        ],
        SolidGaugeChart: {
            series: [
                {name: '온도', xField: 'devName', yField: 'val1', userUnit: '℃',
                    dataLabels: {
                        format:
                            '<div style="text-align:center">' +
                            '<span style="font-size:25px">{y}</span>' +
                            '<span style="font-size:12px;opacity:0.4; padding-left: 5px">℃</span>' +
                            '</div>'
                    },
                }
            ]
        },
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },

    /* 습도감시 */
    fmsHumidityState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'val1', type: 'number', text: '습도(%)', width: '20%', cellsalign: 'right'}
        ],
        SolidGaugeChart: {
            series: [
                {name: '습도', colorByPoint: true, type: 'solidgauge', colorIndex: 2, xField: 'devName', yField: 'val1', userUnit: '%',
                    dataLabels: {
                        format:
                            '<div style="text-align:center">' +
                            '<span style="font-size:25px">{y}</span>' +
                            '<span style="font-size:12px;opacity:0.4; padding-left: 5px">%</span>' +
                            '</div>'
                    },
                }
            ]
        },
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },

    /* 도어감시 */
    fmsDoorState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },

    /* 정전(우측)감시 */
    fmsRightBlackoutState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    },
    /* 정전(좌측)감시 */
    fmsLeftBlackoutState: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'disSensorStatus', type: 'number', text: '센서상태', width: '20%', cellsalign: 'center'}
        ],
        StatUI: {
            controller: 'FmsSensorStateController'
        }
    }
});


var WidgetFmsControl = function(ctrlNo, objId, ctrlDisplay, ctrlUrl, serviceUrl, ctxMenu, condList) {
    this.ctrlNo = ctrlNo;
    this.objId = objId;
    this.ctrlDisplay = ctrlDisplay;
    this.ctrlUrl = ctrlUrl;
    this.serviceUrl = serviceUrl;
    this.ctxMenu = CtxMenu[ctxMenu];
    this.condList = condList;
    this.ctrlObj = null;
    this.dbData = [];
    this.chartSeries = [];
};

WidgetFmsControl.prototype = function() {

    function create() {
        /**
         * FMS 센서상태 통계화면 공통사용(fmsSensorState.jsp)으로 예외처리
         *  센서: UPS, 항온항습기, 배터리, 소방, 전력, 누수
         */
        if(this.ctrlDisplay === HmWidgetConst.ctrlDisplay.StatUI.type) {
            createStatUI.call(this);
        }
        else if(this.ctrlDisplay === HmWidgetConst.ctrlDisplay.StatUI_TeHu.type) {
            createStatUI_TeHu.call(this);
        }
        else {
            WidgetControlHelper.create(this);
        }
    }

    /**
     * 통계UI (svg)
     */
    function createStatUI() {
        var _widget = this;
        var ctrlData = _widget.getCtrlData.call(_widget);
        var _fn = typeof window[ctrlData.controller] === 'function';
        if(!_fn) {
            // controller = 'FmsSensorStateController'로 설정된 경우 센서상태 공통 컨트롤러 호출!!
            var _ctrlUrl = ctrlData.controller == 'FmsSensorStateController'? 'fmsSensorState' : _widget.ctrlUrl;
            $.getScript('/js/main/widget/controls/{0}.js'.substitute(_ctrlUrl), function (data) {
                var fn = window[ctrlData.controller];
                create(fn);
            });
        } else {
            var fn = window[ctrlData.controller];
            create(fn);
        }

        function create(fn) {
            _widget.ctrlObj = new fn(_widget.objId);
            _widget.ctrlObj.createHtml(_widget.ctrlUrl);
        }
    }

    /**
     * 통계UI_TeHu (svg)
     */
    function createStatUI_TeHu() {
        var _widget = this;
        var ctrlData = _widget.getCtrlData.call(_widget);
        var _fn = typeof window[ctrlData.controller] === 'function';
        if(!_fn) {
            // controller = 'FmsSensorStateController'로 설정된 경우 센서상태 공통 컨트롤러 호출!!
            var _ctrlUrl = ctrlData.controller == 'FmsSensorTeHuController'? 'fmsSensorTeHu' : _widget.ctrlUrl;
            $.getScript('/js/main/widget/controls/{0}.js'.substitute(_ctrlUrl), function (data) {
                var fn = window[ctrlData.controller];
                create(fn);
            });
        } else {
            var fn = window[ctrlData.controller];
            create(fn);
        }

        function create(fn) {
            _widget.ctrlObj = new fn(_widget.objId);
            _widget.ctrlObj.createHtml(_widget.ctrlUrl);
        }
    }


    /* ctrlUrl, ctrlDisplay에 따른 사용자 control options 리턴 */
    function getCtrlData(ctrlUrl, ctrlDisplay) {
        try {
            if(ctrlUrl === undefined) {
                ctrlUrl = this.ctrlUrl;
            }
            if(ctrlDisplay === undefined) {
                ctrlDisplay = this.ctrlDisplay;
            }
            var data = HmUtil.clone(HmWidgetConst.ctrlData[ctrlUrl][ctrlDisplay]);
            return data;
        } catch(e) {
            console.log("error", e);
            return null;
        }
    }

    /* 데이터 갱신 */
    function refreshData(params) {
        WidgetControlHelper.refreshData(this, params);
    }

    /* resize event handler (call highchart.reflow) */
    function resizeHandler() {
        WidgetControlHelper.resizeHandler(this);
    }

    /* export to excel */
    function exportExcel() {
        WidgetControlHelper.exportExcel(this);
    }

    /* 표시 형식이 변경될 경우 destory를 호출하여 제거 */
    function destroy() {
        WidgetControlHelper.destroy(this);
    }

    return {
        create: create,
        getCtrlData: getCtrlData,
        refreshData: refreshData,
        resizeHandler: resizeHandler,
        exportExcel: exportExcel,
        destroy: destroy
    }
}();
