var $grpTree;
var selectedRow=0;

var pMain = {
        /** variable */
        initVariable : function() {
            selectedRow = 0;
            $grpTree = $('#grpTreeGrid');
        },

        /** add event */
        observe : function() {
            $('button').bind('click', function(event) { pMain.eventControl(event); });
        },

        /** event handler */
        eventControl : function(event) {
            var curTarget = event.currentTarget;
            switch (curTarget.id) {
                case 'pbtnMove': this.moveGrpView(); break;
                case 'pbtnClose': this.boardClose(); break;
            }
        },

        /** init design */
        initDesign : function() {
            HmTreeGrid.create($grpTree, HmTree.T_GRP_TOPO, null);
            $grpTree.on('rowDoubleClick',
                function (event)
                {
                    opener.D3Topology.vars.curGrpNo =event.args.row.grpNo;
                    opener.D3Topology.search();

                    pMain.boardClose();
                }).on('rowSelect',function (event) {
                    selectedRow = event.args.row.grpNo;
                });
        },

        /** init data */
        initData : function() {

        },

        moveGrpView: function () {
            if(selectedRow==0){
                selectedRow=0;
                alert("장비를 선택해주세요");
            }else{
                opener.D3Topology.vars.curGrpNo =selectedRow;
                selectedRow=0;
                opener.D3Topology.search();
                this.boardClose();
            }
        },

        boardClose : function () {
            window.close();
        }
        
};


$(function() {
    pMain.initVariable();
    pMain.observe();
    pMain.initDesign();
    pMain.initData();
});
