<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>

<%@include file="../include/jQWidgets.jsp" %>


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
            <form autocomplete="on">   <%--action="/portal/license/aidcodeview" method="get">--%>
                <span class="tit">솔루션 선택</span>
                <select class="select" id="sltdeviceid">
                    <option value="10">Network</option>
                    <option value="20">Server</option>
                    <option value="30">AP</option>
                    <option value="40">Database</option>
                    <option value="50">FMS</option>
                </select>
                <button class="btn" type="button" onclick="selectReload()">조회</button>
            </form>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button class="btn btn3" id="btn_add_row">행추가</button>
        <button class="btn" id="btn-save">저장</button>
    </div>
    <div id='jqxWidget' border="1"> <!-- style="font-size: 13px; font-family: Verdana; float: left; width:100%"> -->
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
    $("#btn-save1").click(function () {
        console.log("......................$(#aidInfo) .."+JSON.stringify($("aidInfo")));
    });

    $(document).ready(function(){
        console.log("jqxGridCreate-->");
        proc_jqxGridSelect();

    });

    function proc_jqxGridSelect() {
        var theme = "";
        var sltcode = $('#sltdeviceid option:selected').val();
        var slttext = $('#sltdeviceid option:selected').text();
        // prepare the data
        // searchcode
        var source =
            {
                url : "${path}/license/aidcodeview?sltcode="+sltcode,
                datatype: "json",
                data: {solutioncode: $('#sltdeviceid option:selected').val()},
                // postData: {"searchcode": $('#sltcode option:selected').val()},
                datafields: [
                    { name: 'solutioncode', type:'string', cellsalign: 'center'},
                    { name: 'solutionname', type:'string', cellsalign: 'center'},
                    { name: 'aidcode', type:'string', cellsalign: 'center'},
                    { name: 'fnccodename', type:'string', cellsalign: 'center'},
                    { name: 'functionno', type:'int', cellsalign: 'center'},
                    { name: 'functionname', type:'string', cellsalign: 'center'},
                    { name: 'freenm', type: 'string', cellsalign: 'center' },
                    { name: 'freeaid', type: 'string', cellsalign: 'center' },
                    { name: 'basicnm', type: 'string', cellsalign: 'center' },
                    { name: 'basicaid', type: 'string' , cellsalign: 'center'},
                    { name: 'pronm', type: 'string', cellsalign: 'center' },
                    { name: 'proaid', type: 'string' , cellsalign: 'center'},
                    { name: 'entnm', type: 'string', cellsalign: 'center' },
                    { name: 'entaid', type: 'string' , cellsalign: 'center'},
                    { name: 'useyn', type:'string', cellsalign: 'center'},
                    { name: 'stdate', type: 'date' , cellsalign: 'center'},
                    { name: 'eddate', type: 'date' , cellsalign: 'center'},
                    { name: 'sortno', type:'int', cellsalign: 'right'},
                    { name: 'crudflg', type:'string', cellsalign: 'center'},
                    { name: 'numrow', type:'int', cellsalign: 'right'}
                ]
            };

        var dataAdapter = new $.jqx.dataAdapter(source);
        var cellbeginedit = function (row, datafield, columntype, value) {
            if (value == "I"){ return true} else{return false};
        }

        $("#aidInfo").jqxGrid(
            {
                source: dataAdapter,
                columnsresize: true,
                sortable: true,
                altrows: true,
                editable: true,
                height: 700,
                width: '100%',
                columns: [
                    { text: '솔루션명', datafield: 'solutioncode', displayField: 'solutionname', align: "center" , cellsalign: "center" , width: '8%', cellbeginedit: cellbeginedit, columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {solId: "10", solValue1: "Network"},
                                    {solId: "20", solValue1: "Server"},
                                    {solId: "30", solValue1: "Ap"},
                                    {solId: "40", solValue1: "Database"},
                                    {solId: "50", solValue1: "FMS"}
                                ],
                                displayMember: 'solValue1', valueMember: 'solId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: '기능구분', datafield: 'aidcode', displayField: 'fnccodename', align: "center" ,cellsalign: "center" , width: '8%', columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {fncId: "10", fncValue1: "기본기능"},
                                    {fncId: "20", fncValue1: "부가기능"},
                                    {fncId: "30", fncValue1: "고급기능"}
                                ],
                                displayMember: 'fncValue1', valueMember: 'fncId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: '지원기능', datafield: 'functionname', width: '20%',  align:"left", editable: true},
                    { text: '지원관리번호', datafield: 'functionno', width: 0, salign:"left", editable: false, hidden:true},
                    { text: 'Free등급', datafield: 'freeaid', displayField: 'freenm', align: "center" , cellsalign: "center" ,width: '8%', columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {freeId: "O", freeValue1: "지원"},
                                    {freeId: "X", freeValue1: "지원안함"},
                                    {freeId: "1일", freeValue1: "1일"},
                                    {basicId: "30일", basicValue1: "30일"}
                                ],
                                displayMember: 'freeValue1', valueMember: 'freeId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: 'Basic등급', datafield: 'basicaid', displayField: 'basicnm', align: "center" ,cellsalign: "center" , width: '8%', columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {basicId: "O", basicValue1: "지원"},
                                    {basicId: "X", basicValue1: "지원안함"},
                                    {basicId: "30일", basicValue1: "30일"}
                                ],
                                displayMember: 'basicValue1', valueMember: 'basicId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: 'Pro 등급', datafield: 'proaid', displayField: 'pronm', align: "center" ,cellsalign: "center" , width: '8%', columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {proId: "O", proValue1: "지원"},
                                    {proId: "X", proValue1: "지원안함"},
                                    {proId: "30일", proValue1: "30일"}
                                ],
                                displayMember: 'proValue1', valueMember: 'proId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: 'Ent 등급', datafield: 'entaid', displayField: 'entnm', align: "center" ,cellsalign: "center" , width: '8%', columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {entId: "O", entValue1: "지원"},
                                    {entId: "X", entValue1: "지원안함"},
                                    {entId: "별도협의", entValue1: "별도협의"}
                                ],
                                displayMember: 'entValue1', valueMember: 'entId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: '사용여부', datafield: 'useyn', width: '8%', align:"center" ,columntype: 'checkbox' },
                    { text: '시작일자' ,datafield: 'stdate', width: '8%', align:"center", cellsalign: "center", cellsformat: "yyyy-MM-dd",columntype: 'datetimeinput', editable: false},
                    { text: '종료일자' ,datafield: 'eddate', width: '8%', align:"center", cellsalign: "center", cellsformat: "yyyy-MM-dd",columntype: 'datetimeinput', editable: false},
                    { text: '정렬순서', datafield: 'sortno', width: '8%', align:"center", cellsalign: "center", editable: false },
                    { text: '연번', datafield: 'numrow', width: 0, align:"center", editable: false , hidden:true},
                    { text: 'status', datafield: 'crudflg', displayField: 'crudflg', width: '0%', align:"center" ,hidden:true}
                ]
            });
        //$("#btn_add_row").jqxButton({ theme: theme });
        $("#btn_add_row").click(function () {
            var date = new Date();
            var fncName = "";
            const sltcode = $('#sltcode option:selected').val();
            const sltname = $('#sltcode option:selected').text();
            $("#aidInfo").jqxGrid("addrow", null,
                {solutioncode:sltcode, solutionname:sltname, functionno:"", functionname:"", freeaid:"O", basicaid:"O",
                    proaid:"O",entaid: "O",stdate: date, eddate: "2019-12-31", useyn: "Y",crudflg: "I",
                    codename:sltname, sortno: 99, aidcode: ""
                }, "first");
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

    function selectReload(){
        proc_jqxGridSelect();
    }
</script>
<%@include file="../include/footer.jsp" %>

/*

$("#deleterowbutton").on("click", function () {
var selectedrowindex = $("#jqxgrid").jqxGrid("getselectedrowindex");
var rowscount = $("#jqxgrid").jqxGrid("getdatainformation").rowscount;
console.log(1001, $("#jqxgrid").jqxGrid("getdatainformation"));
if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
var id = $("#jqxgrid").jqxGrid("getrowid", selectedrowindex);
var commit = $("#jqxgrid").jqxGrid("deleterow", id);
}
});


*/