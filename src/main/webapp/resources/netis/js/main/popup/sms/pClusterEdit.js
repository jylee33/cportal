//var $clusterGrp;
var _item;
var pClusterEdit ={

    initVariable: function(){

    },

    observe: function(){
        $('button').on('click', function(event) {pClusterEdit.eventController(event)})
    },


    eventController: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'pbtnSave_clusterEdit': this.pClusterEdit(); break;
            case 'pbtnClose_clusterEdit':this.pClusterEditClose(); break;
        }
    },

    initDesign: function () {

        HmDropDownList.create($('#pClustergrp'), {
            source: HmDropDownList.getSourceByUrl('/kub/getGroupList.do'),
            selectedIndex: 0, autoDropDownHeight: false,
            displayMember: 'grpName', valueMember: 'grpNo'

          });
        // .on('bindingComplete', function() {
        //     $('#pClustergrp').jqxDropDownList('selectIndex', orgGrpName);
        //   });
    },

    initData: function () {

    },


    pClusterEdit: function(){
        console.log('팝업 수정버튼 눌림');

           var listItem = $("#pClustergrp").jqxDropDownList('getSelectedItem');
         //  console.log('listItem:',listItem);
         //  console.log('listItem.value:',listItem.value);

           _item =listItem.value;
         // console.log('_item',_item);

        var params ={
            clusterGrpNo : _item,
            clusterNo : $("#pClusterNo").val(),
            clusterNm : $("#pClusterNm").val(),
            clusterIp : $("#pClusterIp").val(),
            clusterPort : $("#pClusterPort").val(),
            clusterId : $("#pClusterId").val(),
            clusterVer : $("#pClusterVer").val(),

        };
        //console.log('cluster수정:',params);

        Server.post('/kub/editCluster.do',{
            data: params,
            success: function (result) {
                alert('수정 되었습니다.');
                Main.searchKub();
                $('#pwindow').jqxWindow('close');
            },
            error:function(result){
                alert('수정실패:', result);
            }
        });


    },


    pClusterEditClose: function(){
        console.log('팝업창 닫힘');
        $('#pwindow').jqxWindow('close');
    },

};

$(function(){
    pClusterEdit.initVariable();
    pClusterEdit.observe();
    pClusterEdit.initDesign();
    pClusterEdit.initData();
});


function pwindow_init(param){

      console.log('param',param);
     // console.log("param.grpName",param.grpName);

     var item = $('#pClustergrp').jqxDropDownList('getItems');
     //console.log("item",item);

     for ( var i =0; i < item.length;i++) {
        var label = item[i].label;
        if (label == param.grpName) {
            $('#pClustergrp').jqxDropDownList('selectIndex',item[i].index);
        }
     }


}