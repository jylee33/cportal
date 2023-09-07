var $editGrid;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    /** Initialize */
    initVariable: function () {
        $editGrid = $('#editGrid');
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
            source: [
                { label: '선택', value: '' },			]
        });

        $('#menuType').on('change', function(event) {
            PMain.getCodeType();
        });
    },

    /** Init Data */
    initData: function () {
        PMain.getMenuType();

        //넘어온 파라미터 세팅
        var menuSeq = $('#editMenuSeq').val();
        var menuName = $('#editMenuName').val();
        var codeType = $('#editCodeType').val();
        var codeName = $('#editCodeName').val();
        var selText = $('#editSelText').val();

        $('#codeName').val( $('#editSelText').val() );

    },

    save: function(){

        //메뉴 또는 코드타입이 바꼈다면 sel_value 를 새로 따서 업데이트 해야 함
        //메뉴랑 코드타입이 같다면 텍스트만 업데이트 하면 됨
        var selectMenuType = $('#menuType').jqxDropDownList('getSelectedItem');
        var selectCodeType = $('#codeType').jqxDropDownList('getSelectedItem');
        var inputCodeName = $('#codeName').val();

        //내부 로직에서 비교를 위해 파라미터에 같이 넣어준다
        var editCodeSeq = $('#editCodeSeq').val();
        var editMenuSeq = $('#editMenuSeq').val();
        var editCodeType = $('#editCodeType').val();
        var editSelValue = $('#editSelValue').val();

        if( selectMenuType.value == "" || selectCodeType.value == "" || inputCodeName == ""){
            alert(" 모든 값을 등록해야 추가 가능합니다.");
            return false;
        }else{

            var params = {
                menuSeq: selectMenuType.value,
                codeType : selectCodeType.value,
                codeName : inputCodeName,
                editCodeSeq : editCodeSeq,
                editMenuSeq : editMenuSeq,
                editCodeType : editCodeType,
                editSelValue : editSelValue
            };
            Server.post('/nec/nms/utilCode/editUtilCode.do', {
                data: params,
                success: function(result) {
                    if(result == 1){
                        alert("수정되었습니다.");
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

                //넘어온 파라미터 값 세팅
                $("#menuType").jqxDropDownList('selectItem', $('#editMenuSeq').val());
                PMain.getCodeType();
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

                //넘어온 파라미터 값 세팅
                $("#codeType").jqxDropDownList('selectItem', $('#editCodeType').val());
            }
        });
    },

};
