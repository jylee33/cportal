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

    })

    function proc_jqxGridSelect() {
        var theme = "";
        var sltcode = $('#sltdeviceid option:selected').val();
        // prepare the data
        var comboFncListSource = {
            url : "${path}/resources/setcode/functioncodelist.json",
            datatype: "json",
            datafields: [
                { name: 'fnc_code', type: 'string' },
                { name: 'fnc_name', type: 'string' },
            ]
        }
        var comboFncAdapter = new $.jqx.dataAdapter(comboFncListSource, {
            contentType: 'application/json; charset=utf-8',
            downloadComplete: function(data, textStatus, jqXHR) {
                return data; //JSON.parse(data.d);
            }
        });
        // searchcode
        var url = "${path}/license/aidcodeview";
        var source =
            {
                url : "${path}/license/aidcodeview",
                datatype: "json",
                // postData: {"searchcode": $('#sltcode option:selected').val()},
                datafields: [
                    { name: 'solutioncode', type:'string', align: 'center'},
                    { name: 'functionno', type:'int', align: 'center'},
                    { name: 'functionname', type:'string', align: 'center'},
                    { name: 'functioncode', type:'string', align: 'center'},
                    { name: 'freeaid', type: 'string', align: 'center' },
                    { name: 'basicaid', type: 'string' , align: 'center'},
                    { name: 'proaid', type: 'string' , align: 'center'},
                    { name: 'entaid', type: 'string' , align: 'center'},
                    { name: 'useyn', type:'string', align: 'center'},
                    { name: 'stdate', type: 'date' , align: 'center'},
                    { name: 'eddate', type: 'date' , align: 'center'},
                    { name: 'sortno', type:'int', align: 'center'}
                ]
            };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            downloadComplete: function (data, status, xhr) { },
            loadComplete: function (data) {
                alert(data); },
            loadError: function (xhr, status, error) { }
        });
        $("#aidInfo").jqxGrid(
            {

                source: dataAdapter,
                columnsresize: true,
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
                    { text: '솔루션명', datafield: 'solutioncode', width: 100, align:"center", editable: false},
                    { text: '지원관리번호', datafield: 'functionno', width: 100, align:"center", editable: false, hidden:true},
                    { text: '지원기능', datafield: 'functionname', width: 100, align:"center", editable: true},
                    {
                        text: '기능구분',
                        datafield: 'functioncode',
                        displayField: 'fnc_name',
                        valueMember: 'functioncode',
                        filtertype: 'list',
                        filteritems : comboFncAdapter,
                        width: '20%',
                        columntype: 'combobox',
                        createeditor: function (row, column, editor) {
                            editor.jqxComboBox({
                                selectedIndex: 0,
                                source: comboFncAdapter,
                                searchMode: 'containsignorecase',
                                autoComplete: true,
                                remoteAutoComplete: false,
                                dropDownHeight: 100,
                                displayMember: 'fnc_name',
                                valueMember: 'fnc_code',
                                promptText: "Please Choose:"
                            });
                        },
                        geteditorvalue: function (row, cellvalue, editor) {
                            var item = editor.jqxComboBox('getSelectedItem');
                            return item;
                        },
                        initeditor: function (row, column, editor) {
                            editor.jqxComboBox('selectIndex', 0);
                        },
                        // cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
                        //     if (newvalue == "") return oldvalue;
                        // }
                    },
                    { text: 'free', datafield: 'freeaid', width: 100, align:"center"},
                    { text: 'basiccd', datafield: 'basicaid', width: 100, align:"center"},
                    { text: 'procd', datafield: 'proaid', width: 100, align:"center"},
                    { text: 'entcd', datafield: 'entaid', width: 100, align:"center"},
                    { text: '사용여부', datafield: 'useyn', width: 100, align:"center" },
                    { text: '시작일자' ,datafield: 'stdate', width: 100, align:"center", cellsformat: "yyyy-MM-dd",columntype: 'datetimeinput', editable: false},
                    { text: '종료일자' ,datafield: 'eddate',  width: 100, align:"center", cellsformat: "yyyy-MM-dd",columntype: 'datetimeinput', editable: false},
                    { text: '정렬순서', datafield: 'sortno', width: 100,align:"center", editable: false }
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

