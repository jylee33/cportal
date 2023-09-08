var FmsSensorStateController = function(objId) {
    this.objId = objId;
};

FmsSensorStateController.prototype = function() {

    function createHtml(ctrlUrl) {
        var _obj = $('#' + this.objId),
            _id = this.objId,
            _this = this;
        $.post('/main/widget/controls/fmsSensorState.do', function(html) {
            var _icon = 'upsIcon';
            switch(ctrlUrl) {
                case "fmsUpsState": _icon = 'upsIcon'; break;
                case "fmsThermometerState": _icon = 'tmsIcon'; break;
                case "fmsBatteryState": _icon = 'batteryIcon'; break;
                case "fmsFireState": _icon = 'fireIcon'; break;
                case "fmsLeakState": _icon = 'leakIcon'; break;
                case "fmsPowerState": _icon = 'powerIcon'; break;
                default: _icon = 'defaultIcon'; break;
            }
            _obj.html(html.replace(/\#id/ig, _id));
            $('#'+_id + '_imgIcon').attr('href', '/img/{0}.svg'.substitute(_icon));

            //addEvent.call(_this);
            resize.call(_this);
        });
    }

    function addEvent() {
        d3.select("svg#{0}_svg".substitute(this.objId)).selectAll("g.Icon")
            .on('click', function(event) {
                var kind = d3.select(this).attr('data-kind');
                // alert(kind + ' Clicked');
            });
    }

    function resize() {
        var svg = d3.select("svg#{0}_svg".substitute(this.objId));
        var parent = svg.node().parentNode;
        var scaleX = parent.offsetWidth / parseFloat(svg.attr("width")),
            scaleY = parent.offsetHeight / parseFloat(svg.attr("height")),
            svgW = parseFloat(svg.attr("width")) * scaleX,
            svgH = parseFloat(svg.attr("height")) * scaleY;
        svg
            .attr("width", svgW)
            .attr("height", svgH);
    }

    function setData(data) {
        var svg = d3.select("svg#{0}_svg".substitute(this.objId));
        console.log(data);
        if(data != null && data.length > 0) {
            /**
             *  센서상태(status): 0: dead, 1: alive, 2: unset
             *  센서이벤트(sensorStatus): -1이면 unset, 외에는 이벤트레벨
             */
            var sensorStatus = data[0].sensorStatus || 0;
            var _imgStatus = 'green';
            if(sensorStatus == -1) {
                _imgStatus = 'gray';
            }
            else if(sensorStatus > 0) {
                _imgStatus = 'red';
            }
            else {
                _imgStatus = 'green';
            }
            svg.select('#'+this.objId + '_imgState').attr('href', '/img/alarmStatus-{0}.svg'.substitute(_imgStatus));
        }
        else {
            svg.select('#'+this.objId + '_imgState').attr('href', '/img/alarmStatus-gray.svg');
        }
        // if(data != null) {
        //         //     $.each(data, function(i, v) {
        //         //         svg.select('text[data-key={0}]'.substitute(v.kind)).text(v.aliveCnt + '/' + v.totalCnt);
        //         //     });
        // }
    }

    return {
        createHtml: createHtml,
        resize: resize,
        setData: setData
    };
}();