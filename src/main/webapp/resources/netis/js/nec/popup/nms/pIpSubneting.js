var $subnetingGrid , $ipSubnetListGrid;
var maskList = [
    { idx : 1 , label : '1' , value : '2147483648' },
    { idx : 2 , label : '2' , value : '1073741824' },
    { idx : 3 , label : '3' , value : '536870912' },
    { idx : 4 , label : '4' , value : '268435456' },
    { idx : 5 , label : '5' , value : '134217728' },
    { idx : 6 , label : '6' , value : '67108864' },
    { idx : 7 , label : '7' , value : '33554432' },
    { idx : 8 , label : '8' , value : '16777216' },
    { idx : 9 , label : '9' , value : '8388608' },
    { idx : 10 , label : '10' , value : '4194304' },
    { idx : 11 , label : '11' , value : '2097152' },
    { idx : 12 , label : '12' , value : '1048576' },
    { idx : 13 , label : '13' , value : '524288' },
    { idx : 14 , label : '14' , value : '262144' },
    { idx : 15 , label : '15' , value : '131072' },
    { idx : 16 , label : '16' , value : '65536' },
    { idx : 17 , label : '17' , value : '32768' },
    { idx : 18 , label : '18' , value : '16384' },
    { idx : 19 , label : '19' , value : '8192' },
    { idx : 20 , label : '20' , value : '4096' },
    { idx : 21 , label : '21' , value : '2048' },
    { idx : 22 , label : '22' , value : '1024' },
    { idx : 23 , label : '23' , value : '512' },
    { idx : 24 , label : '24' , value : '256' },
    { idx : 25 , label : '25' , value : '128' },
    { idx : 26 , label : '26' , value : '64' },
    { idx : 27 , label : '27' , value : '32' },
    { idx : 28 , label : '28' , value : '16' },
    { idx : 29 , label : '29' , value : '8' },
    { idx : 30 , label : '30' , value : '4' },
    // { idx : 31 , label : '31' , value : '2' },
    { idx : 32 , label : '32' , value : '1' },
];
$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    /** Initialize */
    initVariable: function () {
        $subnetingGrid = $('#subnetingGrid');
        $ipSubnetListGrid = $('#ipSubnetListGrid');
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
            case 'btnSubneting':
                this.getSubneting();
                break;
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

        //로그 하자마자 가져온 Mask 값이랑 비교해서 목표 Mask bit 값이 최대 9개 까지 select 리스트로 만들어져 있음
        
        $('#pMaskBit').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
            source: [{ label: '0' , value: '00' }]
        });

        HmGrid.create($ipSubnetListGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',                    
                    datafields: [
                        { name: '', type: 'number' },
                        { name: 'subnetingIp', type: 'string' },
                        { name: 'netIp', type: 'string' },
                        { name: 'netMask', type: 'string' },

                    ]
                },
                {
                    formatData: function(data) {
                        return data;
                    }
                }
            ),
            pagesize : 500,
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
            sortable : true,
            columns:
                [
                    {
                        text: '#', sortable: false, filterable: false, editable: false,
                        groupable: false, draggable: false, resizable: false,
                        datafield: '', columntype: 'number', width: 35,
                        cellsrenderer: function (row, column, value) {
                            return "<div style='margin:7px;text-align: center;'>" + (value + 1) + "</div>";
                        }
                    },
                    { text : 'IP', datafield: 'subnetingIp',  cellsalign: 'center' , hidden : true  },
                    { text : 'IP', datafield: 'netIp',  cellsalign: 'center' , width: 330 },
                    { text : 'Mask bit', datafield: 'netMask',  cellsalign: 'center' },
                    { text : '분류', datafield: 'typeId',  cellsalign: 'center' , hidden : true },
                ],
        }, CtxMenu.COMM);

    },

    /** Init Data */
    initData: function () {
        PMain.getSelTypeId();
        PMain.setPMaskBit();
    },

    close : function() {
        self.close();
    },

    getSelTypeId : function(){
        //분류
        Server.get('/nec/nms/ipManage/getIpCodeList.do', {
            data: {
                menuSeq : 5,
                codeType : 1
            },
            success: function(result) {

                var cnt = 0;
                var source2 = [];
                source2.push({ label: '선택', value: '' });

                $.each(result,function(idx,item){
                    source2.push({ label: item.selText , value: item.selValue });
                    cnt++;
                });

                if(cnt>20){
                    $('#selTypeId').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#selTypeId').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }

                $("#selTypeId").jqxDropDownList('selectItem', $('#pTypeId').val() );

                $('#selTypeId').on('change', function(event) {
                    //분류에 따라서 목표 마스크 비트 값이 달라짐
                    PMain.setPMaskBit();
                });
            }
        });
    },

    setPMaskBit: function() {

        var selTypeId = $('#selTypeId').val();
        var pNetMask = $('#pNetMask').val();

        if($('#selTypeId').text()=='Host'){
            //Host 는 Prefix 가 32로 고정되어 있음
            $('#pMaskBit').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                source: [{ label: '32' , value: '1' }]
            });

        }else{

            var cnt = 0;
            var source = [];

            $.each(maskList,function(idx,item){
                if(item.idx > pNetMask && cnt <9){
                    source.push(item);
                    cnt++;
                }
            });

            $('#pMaskBit').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                source: source
            });
        }


    },

    getSubneting: function() {

        $ipSubnetListGrid.jqxGrid('clear');

        var pNetMask = $('#pNetMask').val(); //현재 넷마스크
        var pMaskBit = $('#pMaskBit').val(); //바꿀 넷마스크 값
        var pNetIp = $('#pNetIp').val();

        Server.post('/nec/nms/ipManage/getSubneting.do', {
            data: {
                netIp : pNetIp ,
                netMask : pNetMask,
                pMaskBit : pMaskBit
            },
            success: function(result) {
                $.each(result,function(idx,item){
                    $ipSubnetListGrid.jqxGrid('addrow', null, {} );
                    var rows = $ipSubnetListGrid.jqxGrid('getrows');
                    var tempUID = rows[rows.length - 1].uid;
                    $ipSubnetListGrid.jqxGrid('setcellvalue', tempUID, 'subnetingIp', item.subnetingIp );
                    $ipSubnetListGrid.jqxGrid('setcellvalue', tempUID, 'netIp', item.ip );
                    $ipSubnetListGrid.jqxGrid('setcellvalue', tempUID, 'netMask', item.maskBit );
                    $ipSubnetListGrid.jqxGrid('setcellvalue', tempUID, 'typeId', $('#selTypeId').val() );
                });
            }
        });
    },

    save: function(){

        var _itemList = $ipSubnetListGrid.jqxGrid('getrows');

        if(_itemList.length < 1){
            alert('저장할 데이터가 없습니다.');
            return;
        }

        var delList = [$('#ipSeq').val()];

        Server.post('/nec/nms/ipManage/saveSubnetingList.do', {
            data: {
                ipSeq : $('#ipSeq').val(),
                list : _itemList ,
                delList : delList,
            },
            success: function(result) {
                if(result==1){
                    alert("저장되었습니다.");
                    PMain.close();
                    opener.parent.Main.search();
                }
            }
        });

    },
};
