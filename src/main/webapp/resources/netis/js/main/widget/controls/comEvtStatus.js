var ComEvtStatusController = function(objId) {
    this.objId = objId;
    this.dbData = null;
};

ComEvtStatusController.prototype = function() {

    function createHtml() {
        var _obj = $('#' + this.objId),
            _id = this.objId,
            _this = this;
        $.post('/main/widget/controls/comEvtStatus.do', function(html) {
            _obj.html(html.replace(/\#id/ig, _id));

            addEvent.call(_this);
            resize.call(_this);
        });
    }

    function addEvent() {
        var _this = this;
        // $('#'+this.objId+'_comEvtStatus').find('div.errCircle ul li.evtBubble').click(function(event) {
        //     var li = $(event.currentTarget),
        //         lvl = li.attr('data-evtLevel');
        //     showEvtList.call(_this, lvl);
        // });

        // 범례 문구 변경
        var indexes = d3.select("svg#{0}_svg".substitute(this.objId)).selectAll("g.evtIndex > text");
        indexes.each(function(d, i) {
            d3.select(this).text($('#sEvtLevel' + Math.abs(i-5)).val());
        });

        // 이벤트리스트 팝업 click event 등록
        d3.select("svg#{0}_svg".substitute(this.objId)).selectAll("g.evtCircle")
            .on('click', function(event) {
                var kind = d3.select(this).attr('data-evtlevel');
                showEvtList.call(_this, kind);
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
        this.dbData = data;
        var tmp = [0, 0, 0, 0, 0, 0];
        $.each(data, function(i,v) {
            tmp[v.evtLevel] += 1;
        });
        // var li = $('#' + this.objId + '_comEvtStatus').find('div.errCircle ul li');
        // $.each(li, function(i, obj) {
        //     $(obj).find('span').text(tmp[Math.abs(i-5)]);
        // });

        var svg = d3.select("svg#{0}_svg".substitute(this.objId));
        if(data != null) {
            $.each(tmp, function(i, v) {
                if(i == 0) return;
                svg.select('g[data-evtLevel="{0}"]'.substitute(i)).select('text').text(v);
            });
        }
    }

    function showEvtList(evtLevel) {
        var _list = this.dbData.filter(function(d) { return d.evtLevel == evtLevel;});
        // if($('#p2window').length == 0) {
        //     HmWindow.createNewWindow('p2window');
        // }
        $.post(ctxPath + '/main/popup/comm/pDataList.do', function(result) {
            HmWindow.open($('#pwindow'), '이벤트리스트({0})'.substitute($('#sEvtLevel' + evtLevel).val()), result, 1000, 600, 'p2window_init', {
                cols: [
                    { text : '장애등급', datafield : 'disEvtLevel', width : 70, filtertype: 'checkedlist', cellsrenderer : HmGrid.evtLevelrenderer, cellsalign: 'center' },
                    { text : '발생일시', datafield : 'ymdhms', cellsalign: 'center', width : 140 },
                    { text : '그룹', datafield : 'grpName', width : 100 },
                    { text : '장애종류', datafield : 'disSrcType', width: 70, cellsalign: 'center' },
                    { text : '장애대상', datafield : 'srcInfo', minwidth : 250 },
                    { text : '이벤트명', datafield : 'evtName', width : 170 },
                    { text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
                    { text : '장애상태', datafield : 'status', width: 70, cellsalign: 'center' },
                    { text : '진행상태', datafield : 'progressState', width: 70, cellsalign: 'center' },
                    { text : '조치내역', datafield : 'receiptMemo', width: 150 },
                    { text : '이벤트설명', datafield : 'limitDesc', width: 250 }
                ],
                gridData: _list
            });
        });
    }

    return {
        createHtml: createHtml,
        resize: resize,
        setData: setData
    };
}();