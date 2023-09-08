var SmsVMConnectStatusController = function(objId, cubeType) {
    this.objId = objId;
    this.cubeType = cubeType;
    this.dbData = null;
    this.svgItem = null;
    this.statusSvg = null;
    this.statusColor = ['#69B2E4', '#8C8C8C', '#F53D3D', '#F5D63D', '#E1E3E3' ];
    this.statusDiv = null;
    this.statusData = [];
    this.cubeDefaultSize = 20;
};

var divW = 0, divH = 0, rowCnt = 0, colCnt = 0, compCol = 0, scaleX = 1, scaleY = 1;
var widgetArea = 0, unitArea =  0, sqrtNum = 0;
var oldStatusData = [];
var isChanged = false;

SmsVMConnectStatusController.prototype = function() {

    function createHtml() {
        var _obj = $('#' + this.objId),
            _id = this.objId,
            _this = this;

        // var jsFile = "<%=pageContext.request.contextPath%>" + "/js/hm/hm.d3.js";

        _obj.load('/main/widget/controls/smsVMConnectStatus.do', function (data, status, xhr) {
            _obj.html(data.replace(/\#id/ig, _id));
            if (status === 'success') loadComplete.call(_this);
        } );
    }

    function loadComplete() {
        var _this = this;
        $.post(ctxPath + '/img/v5.0.1/widget/items/defaultStatus_svgItem.jsp', function(result) {
            _this.svgItem = result;
            console.log('defaultStatus_svgItem',result);
            createStatusObject.call(_this);
            //resize.call(_this);
        });
    }

    function createStatusObject() {

        var _this = this;
        _this.statusSvg = d3.select("svg#{0}_svg".substitute(_this.objId));
        _this.statusSvg.selectAll('g.statusNode').remove();
        _this.statusColor = ['#69B2E4', '#8C8C8C', '#F53D3D', '#F5D63D', '#E1E3E3' ];

        // _this.statusData = [
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:1}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4},
        //     {status:0}, {status:0}, {status:2}, {status:3}, {status:4}
        // ];

        if (_this.svgItem) {
            _this.statusDiv = $("div#{0}".substitute(_this.objId));
            _this.statusSvg.append("g").attr("class", "gNodes");

            divW = _this.statusDiv.width();     // widget 출력 div의 width
            divH = _this.statusDiv.height() - $("div#{0}_legend".substitute(_this.objId)).height();    // widget 출력 div의 height

            //debugger
            setCube.call(_this);

        }
        else {

        }
    }

    /**
     * 고정 Cube 출력
     */
    function setCube() {
        var _this = this;
        rowCnt = colCnt = 0;
        // debugger
        //고정 Cube 출력`
        if (_this.cubeType === "CubeFix") {

            scaleX = scaleY = 1;
            compCol = Math.floor((divW - 0) / (_this.cubeDefaultSize + 1)) - 1;
        }
        else {  //resize Cube 출력
            // _this.statusSvg.attr("height", divH - 5);   //svg 넓이 설정
            // _this.statusDiv.height(divH + 10);      //svg 높이 설정

            $("div#{0}_content".substitute(_this.objId)).height(divH + 10);
            $("div#{0}_padding".substitute(_this.objId)).height(divH);

            // cube 표시 div 넓이 계산
            // (큐브크기변경일 경우 큐브 전체 보이기 위해 넓이의 65% 만 적용)
            widgetArea = (divW * divH) * 0.65;
            unitArea = parseInt( widgetArea / _this.statusData.length );  // cube 당 넓이 계산
            sqrtNum = parseInt( Math.sqrt(unitArea) );        // cube의 제곱근 계산
            scaleX = scaleY = Math.sqrt(unitArea) / (_this.cubeDefaultSize + 1);     // cube scale 계산
            if (scaleX > 1) {
                scaleX = scaleY = Math.floor((Math.sqrt(unitArea) / (_this.cubeDefaultSize + 1)) * 100) / 100;
                compCol = Math.floor(divW / (sqrtNum + scaleX)) ;

                // scaleX = scaleY = 1;
                // compCol = Math.floor(divW / (_this.cubeDefaultSize + 1));
                // sqrtNum = _this.cubeDefaultSize;
            }
            else {
                compCol = Math.floor(divW / (sqrtNum + scaleX));
            }

        }
        displayCube.call(_this);
    }

    function displayCube() {
        var _this = this;
        var addRet = "";

        _this.statusNodes = _this.statusSvg.select('.gNodes').selectAll('g.statusNode').data(_this.statusData);
        _this.statusNodes.exit().remove();

        _this.statusNodes = _this.statusNodes.enter()
            .appendSVG(_this.svgItem)
            .merge(_this.statusNodes)
            .attr('data-status', function (d) {
                return d.connectionState;
            })
            .attr("transform", function (d, idx) {
                if (compCol === colCnt) {
                    rowCnt++, colCnt = 0;
                }

                var x = 0, y = 0;
                if (_this.cubeType === "CubeFix") {
                    x = colCnt * (_this.cubeDefaultSize + 1);
                    y = rowCnt * (_this.cubeDefaultSize + 1);
                    addRet = "";
                }
                else {
                    x = colCnt * (sqrtNum + scaleX);
                    y = rowCnt * (sqrtNum + scaleY);
                    addRet = "scale(" + [scaleX, scaleY].join(",") + ")";
                }
                colCnt++;
                return "translate({0},{1})".substitute(x, y) + addRet;
            })
            .attr("fill", function (d) {
                return _this.statusColor[d.connectionState];
            })
            .style('cursor', 'pointer');
        // .on('click', null)
        // .on("click", function (d) {
        //     var params = {
        //         mngNo: d.mngNo,
        //         ifIdx: d.ifIdx,
        //         lineWidth: d.lineWidth
        //     };
        //     HmUtil.createPopup('/main/popup/nms/pIfDetail.do', $('#hForm'), 'pIfDetail_'+d.mngNo+"_"+d.ifIdx, 1300, 700, params);
        // });

        if (_this.cubeType === "CubeFix") {
            if (rowCnt > 0) _this.statusSvg.attr("height", (rowCnt + 1) * (_this.cubeDefaultSize + 1));
            else _this.statusSvg.attr("height", '100%');
        }
        else {
            _this.statusSvg.attr("height", '100%');
        }

        $("div#{0}_cntDisconnected".substitute(_this.objId)).text(_this.statusData.filter(function (d) {
            return d.connectionState == 0
        }).length);
        $("div#{0}_cntConnected".substitute(_this.objId)).text(_this.statusData.filter(function (d) {
            return d.connectionState == 1
        }).length);
        $("div#{0}_cntInaccessible".substitute(_this.objId)).text(_this.statusData.filter(function (d) {
            return d.connectionState == 2
        }).length);
        $("div#{0}_cntInvalid".substitute(_this.objId)).text(_this.statusData.filter(function (d) {
            return d.connectionState == 3
        }).length);
        $("div#{0}_cntOrphaned".substitute(_this.objId)).text(_this.statusData.filter(function (d) {
            return d.connectionState == 4
        }).length);
    }

    function setData(data) {
        var _this = this;
        _this.statusData = data;
        // setCube.call(_this);

        if ( JSON.stringify(_this.statusData) === JSON.stringify(oldStatusData) ) isChanged = false;
        else isChanged = true;

        oldStatusData = _.cloneDeep(_this.statusData);

        if (_this.statusSvg.select('.gNodes').selectAll('g.statusNode').nodes().length === 0) {
            setCube.call(_this);
        }
        else {
            if (isChanged) {
                setCube.call(_this);
                // _this.statusNodes = [];
                // _this.statusNodes = _this.statusSvg.select('.gNodes').selectAll('g.statusNode').data(_this.statusData);
                // _this.statusNodes.exit().remove();
                //
                // _this.statusNodes = _this.statusNodes.enter()
                //     .appendSVG(_this.svgItem)
                //     .merge(_this.statusNodes)
                //     .attr('data-status', function (d) {
                //         console.log('data-status',d.connectionState);
                //         return d.connectionState;
                //     })
                //     .attr("fill", function (d) {
                //         return _this.statusColor[d.connectionState];
                //     })
            }
        }
    }

    function resize() {
        var _this = this;
        divW = _this.statusDiv.width();     // widget 출력 div의 width
        divH = _this.statusDiv.height() - $("div#{0}_legend".substitute(_this.objId)).height();    // widget 출력 div의 height
        _this.statusSvg.selectAll('g.statusNode').remove();
        setCube.call(_this);
    }

    return {
        createHtml: createHtml,
        loadComplete: loadComplete,
        resize: resize,
        setData: setData
    };
}();