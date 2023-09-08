var ComUserDefinedSqlController = function(objId, ctrlDisplay) {
    this.objId = objId;
    this.ctrlDisplay = ctrlDisplay;
    this.dbData = null;
};


ComUserDefinedSqlController.prototype = function() {

    function createHtml() {
        var _obj = $('#' + this.objId),
            _id = this.objId,
            _this = this;

        _obj.load('/main/widget/controls/comUserDefinedSql.do', function (data, status, xhr) {
            _obj.html(data.replace(/\#id/ig, _id));
            if (status === 'success') loadComplete.call(_this);
        } );
    }

    function loadComplete() {
        var _this = this;

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
        console.log("사용자 정의 SQL / js 파일의 setData");
        console.dir(data);
        console.log("확인해보기");
        console.dir(this.ctrlDisplay);

        $('#userSqlDiv').empty();
        var _this = this;
        if(_this.ctrlDisplay == 'SqlText'){
            var _html = '';
            var _styleHtml = '';
            var _valueHtml = '';
            $.each(data, function(idx, item) {
                if(item.condKey == 'textStyle'){
                    _styleHtml =  'style="color:'+item.condVal+'"';
                }
                if(item.condKey == 'sqlResult'){
                    _valueHtml =  item.condVal;
                }
            });
            _html = '<div ' +_styleHtml+ '>' ;
            _html += _valueHtml;
            _html += '</div>';

            console.log(_html);
            $('#userSqlDiv').append(_html);

        }else if(_this.ctrlDisplay == 'SqlGauge'){
            console.log(" 사용자 정의 SQL -Gauge 타입입니다.");
            var _html = '게이지 표시하기';
            console.log(_html);
            $('#userSqlDiv').append(_html);
        }

    }

    return {
        createHtml: createHtml,
        setData: setData
    };
}();