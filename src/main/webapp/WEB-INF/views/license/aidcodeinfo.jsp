<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>

<link rel="stylesheet" href="${path}/resources/js/jqwidgets/styles/jqx.base.css" type="text/css" />

<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcore.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxbuttons.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxscrollbar.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxmenu.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.selection.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.columnsresize.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdata.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcombobox.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxradiobutton.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdropdownlist.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxlistbox.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.filter.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.edit.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.sort.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdatetimeinput.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcalendar.js"></script>
<%--<script type="text/javascript" src="${path}/resources/js/scripts/demos.js"></script>--%>


<div class="container">
    <div class="h3-head">
        <h3 class="h3">라이선스 정책 관리</h3>
    </div>
    <div class="tabs-box" id='jqxTabs'>
        <div class="tabs">
            <a href="${path}/license/licensemanage" >라이선스 정책 관리</a>
            <a href="#" class="active">라이선스 제공 기능</a>
            <a href="${path}/license/creditinfo">Credit 제공</a>
        </div>
        <div class="right">
            <form autocomplete="on" action="/portal/license/aidcodeview" method="get">
                <span class="tit">기능구분 선택</span>
                <select class="select" name="sltcode" id="sltcode">
                    <option value="10">기본기능</option>
                    <option value="20">부가기능</option>
                    <option value="30">고급기능</option>
                </select>
                <button class="btn" type="submit">조회</button>
            </form>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button class="btn btn3" id="btn_add_row">행추가</button>
        <button class="btn" id="btn-save">저장</button>
    </div>
    <div id='jqxWidget' style="font-size: 13px; font-family: Verdana; float: left; width:100%">
        <div id="aidInfo"></div>
        <div style="margin-top: 30px;"></div>
    </div>
</div>
</div>


<%--<body class='default'>--%>
<%--<div id='jqxradiobutton1'>--%>
<%--    Radio Button 1</div>--%>
<%--<div id='jqxradiobutton2'>--%>
<%--    Radio Button 2</div>--%>
<%--</body>--%>
<script>

    // if (typeof jQuery == 'undefined') {
    //     var script = document.createElement('script');
    //     script.type = "text/javascript";
    //     script.src = "https://code.jquery.com/jquery-3.5.1.min.js";
    //     document.getElementsByTagName('head')[0].appendChild(script);
    // } else {
    //     console.log("jQuery Ready");
    // }
    $(document).ready(function(){

        tableSelect("10");
    });

    function tableSelect(sltcode){

        var theme = "";
        var url = "${path}/resources/setcode/functioncodelist.json";
        // prepare the data
        var dropDownListSource =
            {
                datatype: "json",
                datafields: [
                    { name: 'code', type: 'string' },
                    { name: 'name', type: 'string' },
                ],
                id: 'id',
                url: url
            };
        var dropdownListAdapter = new $.jqx.dataAdapter(dropDownListSource, { autoBind: true, async: false });
        var dropdownListSource = [];
        for (var i = 0; i < dropdownListAdapter.records.length; i++) {
            dropdownListSource[i] = dropdownListAdapter.records[i]['name'];
        }


        var url = "${path}/license/aidcodeview";
        var source =
            {
                datatype: "json",
                datafields: [
                    { name: 'functionno', type:'int', align: 'center'},
                    { name: 'functionname', type:'string', align: 'center'},
                    { name: 'freeaid', type: 'string', align: 'center' },
                    { name: 'basicaid', type: 'string' , align: 'center'},
                    { name: 'proaid', type: 'string' , align: 'center'},
                    { name: 'entaid', type: 'string' , align: 'center'},
                    { name: 'codename', type:'string', align: 'center'},
                    { name: 'useyn', type:'string', align: 'center'},
                    { name: 'stdate', type: 'date' , align: 'center'},
                    { name: 'eddate', type: 'date' , align: 'center'},
                    { name:'sortno', type:'int', align: 'center'},
                    { name:'functioncode', type:'string', align: 'center'}
                ],
                id: 'id',
                url: url,
                type: "GET"
            };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            downloadComplete: function (data, status, xhr) { },
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { }
        });

        $("#aidInfo").jqxGrid(
            {
                width: 1500,
                source: dataAdapter,
                sortable: true,
                filterable: true,
                editable: true,
                showstatusbar: true,
                columnsresize: true,
                theme: theme,
                // theme: 'energyblue',
                columnsresize: true,
                columns: [
                    { text: '지원관리번호', datafield: 'functionno', width: 100, align:"center", editable: false},
                    { text: '지원기능', datafield: 'functionname', width: 250, align:"center" },
                    { text: 'free',datafield: 'freeaid', width: 80, align:"center" },
                    { text: 'basic', datafield: 'basicaid', width: 80, align:"center"},
                    { text: 'pro', datafield: 'proaid', width: 80, align:"center"},
                    { text: 'ent.',datafield: 'entaid',  width: 100, align:"center"},
                    {
                        text: '기능구분',
                        datafield: 'codename',
                        width: 100,
                        align: "center",
                        columntype: 'dropdownlist',
                        initeditor: function (row, cellvalue, editor) {
                            editor.jqxDropDownList({source: dropdownListSource});
                        }
                    },
                    { text: '사용여부', datafield: 'useyn', width: 100, align:"center" },
                    { text: '시작일자' ,datafield: 'stdate', width: 100, align:"center", cellsformat: "yyyy-MM-dd",columntype: 'datetimeinput', editable: false},
                    { text: '종료일자' ,datafield: 'eddate',  width: 100, align:"center", cellsformat: "yyyy-MM-dd",columntype: 'datetimeinput', editable: false},
                    { text: '정렬순서', datafield: 'sortno', width: 100,align:"center", editable: false },
                    { text: '제공코드', datafield: 'functioncode', type:'string', align: 'center'}
                ]
            });
        //$("#btn_add_row").jqxButton({ theme: theme });
        $("#btn_add_row").click(function () {
            var date = new Date();
            var fncName = "";
            const sltcode = $('#sltcode option:selected').val();
            const sltname = $('#sltcode option:selected').text();
            $("#aidInfo").jqxGrid("addrow", null,
                {functionno:"", functionname:"", freeaid:"O", basicaid:"O",
                    proaid:"O",entaid: "O",stdate: date, eddate: "2019-12-31", useyn: "Y",
                    codename:sltname, useyn: "Y", sortno: 99, functioncode: sltcode
                }, "last");
            $("#aidInfo").jqxGrid('endupdate');
        });
    }






    var state = null;
    $("#btn-save").click(function () {
        // save the current state of jqxGrid.
        //state = $("#aidInfo").jqxGrid('savestate'); parse   stringify
        var aidInfoData = $("#aidInfo").jqxGrid("getrows");   //1
        console.log("rows------>"+aidInfoData.length);
        console.log("rows------>"+JSON.stringify(aidInfoData));

        var url = "${pageContext.request.contextPath}/license/aidInfoSave";
        $.ajax({
            type: 'post',
            url: url,
            async : true, // 비동기화 동작 여부
            data: JSON.stringify(aidInfoData),
            contentType: "application/json",
            success: function(aidInfoData) {
                alert("정상적으로 자료가 수정 되었습니다.");
            },
            error: function(err){
                alert("자료 수정에 실패했습니다.");
            }
        })


        $("#aidInfo").on('cellvaluechanged', function (event)
        {
            var rows = $("#aidInfo").jqxGrid("getrows");   //1
            console.log("rows------>"+rows);
            newrows = calculatejson(rows);    //3
            console.log("newrows----->"+newrows);
            redrawgrid(newrows);    //4
        });
    });





    // $("#btn_add_row").click(function(){
    //     const selected = $('#sltcode option:selected').val();
    //     var data = {functioncode:selected, useyn:"Y"};
    //   //  rowId = $("#aidInfo").getGridParam("reccount"); // 페이징 처리 시 현 페이지의 Max RowId 값
    //     $("#aidInfo").jqxGrid("addRowData", rowId+1, data, 'last'); // 첫행에 Row 추가
    //     //$("#list").jqGrid("addRowData", rowId+1, data, 'last'); // 마지막 행에 Row 추가
    // });
</script>
<%@include file="../include/footer.jsp" %>

<!--


$('#jqxgrid').jqxGrid('setcolumnindex', 'lastname', 3);

$("#jqxbutton").jqxButton({
theme: 'energyblue',
width: 300,
height: 30
});
$('#jqxbutton').click(function () {
var column = $('#jqxgrid').jqxGrid('getcolumn', 'lastname');
alert("Column Text: " + column.text + ", Data Field: " + column.datafield);
});

{ text: '추가', datafield: 'add_btn',width: '5%',align: 'center',columntype:'button',
buttonclick: function (row) {
// var row_val = $("#jqxgrid2").jqxGrid('getrowdata', row);
var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
var id = $("#jqxgrid").jqxGrid('getrowid', selectedrowindex);
var rows = {
add_btn : "+",
del_btn : "-"
}
$("#jqxgrid").jqxGrid("addrow", null, rows,id+1);
$("#jqxgrid").jqxGrid('endupdate');

}
},
{ text: '삭제', datafield: 'del_btn',width: '5%',align: 'center',columntype:'button',
buttonclick: function (row) {
// var row_val = $("#jqxgrid2").jqxGrid('getrowdata', row);
var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
var id = $("#jqxgrid").jqxGrid('getrowid', selectedrowindex);
$("#jqxgrid").jqxGrid('deleterow', id);
$("#jqxgrid").jqxGrid('endupdate');

}}
-->
