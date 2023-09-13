﻿<%@ page language="java" contentType="text/html; charset=UTF-8"
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
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcheckbox.js"></script>
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
                    <option value="10">네트워크</option>
                    <option value="20">서버</option>
                    <option value="30">AP</option>
                    <option value="40">데이터베이스</option>
                    <option value="50">환경센서</option>
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
        // prepare the data
        // searchcode
        var source =
            {
                url : "${path}/license/aidcodeview",
                datatype: "json",
                // postData: {"searchcode": $('#sltcode option:selected').val()},
                datafields: [
                    { name: 'solutioncode', type:'string', cellsalign: 'center'},
                    { name: 'solutionname', type:'string', cellsalign: 'center'},
                    { name: 'functioncode', type:'string', cellsalign: 'center'},
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
                    { name: 'numrow', type:'int', cellsalign: 'right'}
                ]
            };

        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#aidInfo").jqxGrid(
            {
                source: dataAdapter,
                columnsresize: true,
                //  showfilterrow: true,
                filterable: true,
                sortable: true,
                altrows: true,
                showstatusbar: true,
                showtoolbar: false,
                editable: true,
                height: 700,
                width: '90%',
                selectionmode: 'singlecell',
                editmode: 'click',
                columns: [
                    { text: '솔루션명', datafield: 'solutioncode', displayField: 'solutionname', align: "center" , cellsalign: "center" , width: 100, columntype: 'dropdownlist',
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
                    { text: '기능구분', datafield: 'functioncode', displayField: 'fnccodename', align: "center" , width: 100, columntype: 'dropdownlist',
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
                    { text: '지원기능', datafield: 'functionname', width: 200, align:"left", editable: true},
                    { text: '지원관리번호', datafield: 'functionno', width: 100, salign:"left", editable: false, hidden:true},
                    { text: 'Free등급', datafield: 'freeaid', displayField: 'freenm', align: "center" , width: 100, columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {freeId: "O", freeValue1: "지원"},
                                    {freeId: "X", freeValue1: "지원안함"},
                                    {freeId: "1일", freeValue1: "1일"}
                                ],
                                displayMember: 'freeValue1', valueMember: 'freeId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: 'Basic등급', datafield: 'basicaid', displayField: 'basicnm', align: "center" , width: 100, columntype: 'dropdownlist',
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
                    { text: 'Pro 등급', datafield: 'proaid', displayField: 'pronm', align: "center" , width: 100, columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {proId: "O", proValue1: "지원"},
                                    {proId: "X", proValue1: "지원안함"},
                                    {proId: "30일", proalue1: "30일"}
                                ],
                                displayMember: 'proValue1', valueMember: 'proId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: 'Ent 등급', datafield: 'entaid', displayField: 'entnm', align: "center" , width: 100, columntype: 'dropdownlist',
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
                    { text: '사용여부', datafield: 'useyn', width: 100, align:"center" ,columntype: 'checkbox' },
                    { text: '시작일자' ,datafield: 'stdate', width: 100, align:"center", cellsformat: "yyyy-MM-dd",columntype: 'datetimeinput', editable: false},
                    { text: '종료일자' ,datafield: 'eddate',  width: 100, align:"center", cellsformat: "yyyy-MM-dd",columntype: 'datetimeinput', editable: false},
                    { text: '정렬순서', datafield: 'sortno', width: 100, align:"center", editable: false },
                    { text: '연번', datafield: 'numrow', width: 100, align:"center", editable: false , hidden:true}
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


</script>
<%@include file="../include/footer.jsp" %>

