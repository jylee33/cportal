var $addGrid;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    /** Initialize */
    initVariable: function () {
        $addGrid = $('#addGrid');
    },

    /** Event Object */
    observe: function () {
        $("button").bind("click", function (event) {
            PMain.eventControl(event);
        });
    },

    /** Event Control Function */
    eventControl: function (event) {
        switch (event.currentTarget.id) {
            case 'btnClose':
                this.close();
                break;
        }
    },
    /** Init Design */
    initDesign: function () {
        if( $('#hisSeq').val() != 0 ){
            $('#historyTable').show();
        }
    },

    /** Init Data */
    initData: function () {
        if( $('#pConnType').val() != undefined || $('#pConnType').val() != '' ){

            var tempArr = $('#pConnType').val().split("/");
            var htmlStr = '';
            $.each(tempArr,function(idx,item){
                if(item!=''){
                    htmlStr += item + ' / ';
                }
            });
            htmlStr = htmlStr.slice(0, -2);
            $('#connType').html(htmlStr);
        }
    },


    close : function() {
        self.close();
    },

};
