<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

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
<%--<script type="text/javascript" src="${path}/resources/js/scripts/demos.js"></script>--%>


<div id='jqxWidget' style="font-size: 13px; font-family: Verdana; float: left; width:100%">
    <div id="jqxgrid">
    </div>
</div>

<script>

    $(document).ready(function () {
        var data = '[{ "name": "홍길동", "age": "23", "address": "경기","phone": "010-1234-XXXX", "birthday": "1990-02-05","allowance": 5000, "gender":"남"}, { "name": "이몽룡", "age": "18", "address": "서울","phone": "010-9999-XXXX", "birthday": "1995-06-10","allowance": 20000, "gender":"남"}, { "name": "성춘향", "age": "18", "address": "경기","phone": "010-1593-XXXX", "birthday": "1995-08-23","allowance": 12000, "gender":"여"}, { "name": "김흥부", "age": "32", "address": "서울","phone": "010-2854-XXXX", "birthday": "1984-07-11","allowance": 8000, "gender":"남"}, { "name": "박놀부", "age": "35", "address": "경기","phone": "010-4675-XXXX", "birthday": "1982-05-22","allowance": 35000, "gender":"남"}, { "name": "심청이", "age": "21", "address": "서울","phone": "010-8948-XXXX", "birthday": "1991-11-25","allowance": 15000, "gender":"여"}]';

        var source = {
            datatype: "json",
            datafields: [
                {name: 'name',type: 'string'},
                {name: 'age',type: 'int'},
                {name: 'address',type: 'string'},
                {name: 'phone',type: 'string'},
                {name: 'birthday',type: 'date'},
                {name: 'allowance',type: 'number'},
                {name: 'gender',type: 'string'}
            ],
            localdata: data
        };
        var dataAdapter = new $.jqx.dataAdapter(source);


        $("#jqxgrid").jqxGrid({
            width: '100%',
            height: '300',
            source: dataAdapter,
            sortable: true,
            filterable: true,
            editable: true,
            showstatusbar: true,
            columnsresize: true,
            theme: 'energyblue',
            columns: [
                {text: '이름',datafield: 'name',width: "10%", align:"center"},
                {text: '나이',datafield: 'age',width: "10%", align:"center",validation: function (cell, value) {
                        if (value == "") return true;
                        if (value < 18) {
                            return { result: false, message: "18세 미만은 부모님의 동의가 필요합니다." };
                        }
                        return true;
                    }},
                {text: '주소',datafield: 'address',width: "10%", align:"center"},
                {text: '전화번호',datafield: 'phone',width: "20%", align:"center"},
                {text: '생일',datafield: 'birthday',cellsformat: "yyyy-MM-dd",width: "20%", align:"center",columntype: 'datetimeinput'},
                {text: '용돈',datafield: 'allowance',cellsformat : 'd',cellsalign: 'right',width: "20%", align:"center",columntype: 'numberinput',
                    validation: function (cell, value) {
                        if (value == "") return true;
                        if (value < 1000) {
                            return { result: false, message: "용돈은 1000원 이상 입력해야합니다." };
                        }
                        return true;
                    },
                    createeditor: function (row, cellvalue, editor) {
                        editor.jqxNumberInput({ decimalDigits: 0, digits: 6 });
                    }},
                {text: '성별',datafield: 'gender',width: "10%", align:"center", columntype: 'dropdownlist'}
            ]
        });

    });


</script>
<%@include file="../include/footer.jsp" %>
