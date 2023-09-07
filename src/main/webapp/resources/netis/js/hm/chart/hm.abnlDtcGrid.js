var eventId='';

var AbnlDtcGrid = function(gridId) {
    this.gridId = gridId;
    this.grid = null;
};

AbnlDtcGrid.prototype = function() {

    var initVariable = function(){
        $eventGrid = $('#event_grid');
    };

    var initialize = function() {
        var _this = this;
        HmGrid.create($('#' + _this.gridId), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        return JSON.stringify(data);
                    }
                }
                ),
                columns:
                    [
                        { text: '상태', datafield: 'active', width: 50, cellsalign: 'center' },
                        { text: '이벤트 ID', datafield: 'eventId', width: 120, cellsalign: 'center' },
                        { text: '그룹명', datafield: 'grpName', width: 50, cellsalign: 'center' },
                        { text: '발생 일시', datafield: 'ymdhms', width: 120, cellsalign: 'center' },
                        { text: '지속 시간(초)', datafield: 'ctSec', width: 100, cellsalign: 'center' },
                        { text: '종료 일시', datafield: 'endDt', width: 120, cellsalign: 'center' },
                        { text: '취약층', datafield: 'layer', width: 50, cellsalign: 'center' },
                        { text: '취약 요인(TOP3)', datafield: 'features', width: 450 }
                    ]
            });

            $('#' + _this.gridId).on('rowdoubleclick', function(event) {
                console.log('더블클릭event',event);

                var rowIdx = event.args.rowindex;
                console.log('rowIdx:',rowIdx);

                var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
                console.log('rowdata',rowdata);
                eventId = rowdata.eventId;

                HmUtil.createPopup('/main/popup/errFree/pAbnlDtcDetail.do', $('#hForm'), 'pAbnlDtcDetail', 1300, 700, rowdata);

            });


            $('#section').css('display', 'block');
    };

    /**
     * 데이터 바인딩 후 그리드 갱신
     * @param gridDataArr
     */
    var updateBoundData = function(gridDataArr){
        var _this = this;
        var array = gridDataArr.list;
        // var _ymdhms = [];
        // var _ctSec = [];
        // var _features = [];

        for(var i = 0; i < array.length; i++){
            var year = (array[i].ymdhms).toString().substring(0, 4);
            var month = (array[i].ymdhms).toString().substring(4, 6);
            var day = (array[i].ymdhms).toString().substring(6, 8);
            var hour = (array[i].ymdhms).toString().substring(8, 10);
            var min = (array[i].ymdhms).toString().substring(10, 12);
            var sec = (array[i].ymdhms).toString().substring(12, 14);

            var _ymdhms = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
            // _ymdhms.push(year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec);
            // console.log(_ymdhms);

            var convertSec = function(value){
                var result = '';
                var time = value;
                var hour, min, result = '';
                if ((60 * 60) <= time) {
                    hour = Math.floor(time / (60 * 60));
                    time = time - ((60 * 60) * hour);
                    result += hour + ':';
                }
                if (60 <= time) {
                    min = Math.floor(time / 60);
                    time = time - (60 * min);
                    result += min + ':';
                }
                if (time != '' && time != 0) {
                    if (time === null) time = 0;
                    if (time < 0) time = 0;
                    result += time;
                }
                else {
                    result += '00';
                }
                return result;
            };
            var _ctSec = convertSec(array[i].ctSec);
            // _ctSec.push(convertSec(array[i].ctSec));
            // console.log(_ctSec);

            var _features = (array[i].features).toString().split(',')[0]
                   + ", " + (array[i].features).toString().split(',')[1]
                   + ", " + (array[i].features).toString().split(',')[2];
            // _features.push((array[i].features).toString().split(',')[0]
            //       + ", " + (array[i].features).toString().split(',')[1]
            //       + ", " + (array[i].features).toString().split(',')[2]);
            // console.log(_features);
        }

        if(array.length != 0){
            $.each(array, function(idx, item) {
                $("#" + _this.gridId).jqxGrid('addrow', null, item);
                if($('#' + _this.gridId).jqxGrid('getcellvaluebyid', idx, 'active') === false){
                    $('#' + _this.gridId).jqxGrid('setcellvaluebyid', idx, 'active', '종료');
                }else $('#' + _this.gridId).jqxGrid('setcellvaluebyid', idx, 'active', '실행 중');
                $('#' + _this.gridId).jqxGrid('setcellvaluebyid', idx, 'ymdhms', _ymdhms);
                $('#' + _this.gridId).jqxGrid('setcellvaluebyid', idx, 'ctSec', _ctSec);
                $('#' + _this.gridId).jqxGrid('setcellvaluebyid', idx, 'features', _features);
            });
        }else this.grid.showNoData();
    };

    /**
     * 그리드 데이터 조회
     * @param params { ??? }
     */
    var searchData = function(params, url) {
        try {
            this.grid.hideNoData();
            this.grid.showLoading();
        } catch (err) {
        }

        var _this = this;
        var perfData = new PerfData();

        perfData.searchExternalGet(_this, params, url, searchDataResult);
    };

    /**
     * 그리드 데이터 조회결과 처리
     * @param params {}
     * @param result {}
     */
    var searchDataResult = function(params, result) {
        var dataList = result.data;
        updateBoundData.call(this, dataList);
    };

    /**
     * clear series data
     */
    var clearSeriesData = function() {
        try{
            var slen = this.grid.data.length;
            for(var i = 0; i < slen; i++){
                this.grid.data[i].empty();
            }
            $eventGrid.jqxGrid('clear');
        }catch(e){}
    };

    /** remove the chart */
    var destroy = function() {
        $eventGrid.jqxGrid('destroy');
    };

    return {
        initVariable: initVariable,
        initialize: initialize,
        updateBoundData: updateBoundData,
        searchData: searchData,
        clearSeriesData: clearSeriesData,
        destroy: destroy
    }

}();