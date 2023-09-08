var WnmsStateController = function(objId) {
    this.objId = objId;
};

WnmsStateController.prototype = function() {

    function createHtml() {
        var _obj = $('#' + this.objId),
            _id = this.objId,
            _this = this;
        $.post('/main/widget/controls/wnmsState.do', function(html) {
            _obj.html(html.replace(/\#id/ig, _id));

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
        if(data != null) {
            $.each(data, function(i, v) {
                svg.select('text[data-key={0}]'.substitute(v.kind)).text(v.aliveCnt + '/' + v.totalCnt);
            });
        }
    }

    return {
        createHtml: createHtml,
        resize: resize,
        setData: setData
    };
}();