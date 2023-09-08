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
            case 'btnSave':
                this.save();
                break;
            case 'btnClose':
                this.close();
                break;
        }
    },
    /** Init Design */
    initDesign: function () {

        $('#codeType').jqxDropDownList({width:'310', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
            source: [ { label: '선택', value: '' },	]
        });

        $('#menuType').on('change', function(event) {
            PMain.getCodeType();
        });

    },

    /** Init Data */
    initData: function () {
        PMain.getMenuType();
    },

    save: function(){
        var selectMenuType = $('#menuType').jqxDropDownList('getSelectedItem');
        var selectCodeType = $('#codeType').jqxDropDownList('getSelectedItem');
        var inputCodeName = $('#codeName').val();

        if( selectMenuType.value == "" || selectCodeType.value == "" || inputCodeName == ""){
            alert(" 모든 값을 등록해야 추가 가능합니다.");
            return false;
        }else{

            var params = {
                menuSeq: selectMenuType.value,
                codeType : selectCodeType.value,
                codeName : inputCodeName,
            };
            Server.post('/nec/nms/utilCode/saveUtilCode.do', {
                data: params,
                success: function(result) {
                    if(result == 1){
                        alert("추가되었습니다.");
                        PMain.close();
                        opener.parent.Main.search();
                    }
                }
            });

        }

    },

    close : function() {
        self.close();
    },

    getMenuType : function(){
        Server.post('/nec/nms/utilCode/getMenuTypeList.do', {
            data: {},
            success: function(result) {
                var source2 = [];
                source2.push({ label: '선택', value: '' });

                $.each(result,function(idx,item){
                    source2.push({ label: item.menuName , value: item.menuSeq });
                });

                $('#menuType').jqxDropDownList({width:'310', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                    source: source2
                });
            }
        });
    },

    getCodeType : function(){
        var selectMenuType = $('#menuType').jqxDropDownList('getSelectedItem');
        Server.get('/nec/nms/utilCode/getCodeTypeList.do', {
            data: {menuSeq : selectMenuType.value},
            success: function(result) {
                var source2 = [];
                source2.push({ label: '선택', value: '' });

                $.each(result,function(idx,item){
                    source2.push({ label: item.codeName , value: item.codeType });
                });

                $('#codeType').jqxDropDownList({width:'310', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                    source: source2
                });
            }
        });
    },

};
