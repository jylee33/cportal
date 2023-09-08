var FmsSensorTeHuController = function(objId) {
    this.objId = objId;
};

FmsSensorTeHuController.prototype = function() {

    function createHtml(ctrlUrl) {
        var _obj = $('#' + this.objId),
            _id = this.objId,
            _this = this;
        $.post('/main/widget/controls/fmsSensorTeHu.do', function(html) {
            var _icon = 'thermoIcon';
            switch(ctrlUrl) {
                case 'fmsThermometerState': _icon = 'tmsIcon'; break;
                case 'fmsTeHuState': _icon = 'thermoIcon'; break;
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
            svg.select('text#teVal').text(data[0].teVal || '-');
            svg.select('text#huVal').text(data[0].huVal || '-');
        }
        else {
            svg.select('text#teVal').text('-');
            svg.select('text#huVal').text('-');
        }
    }

    return {
        createHtml: createHtml,
        resize: resize,
        setData: setData
    };
}();
