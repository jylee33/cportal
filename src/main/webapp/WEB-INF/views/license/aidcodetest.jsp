<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>
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
            <form autocomplete="on" action="/portal/license/aidcode" method="post">
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
        <button class="btn" id="btn-rowsave">저장</button>
    </div>
    <div class="table-type1 text-center cursor">
        <table id="aidInfo"></table>
        <div id="pager"></div>
    </div>
</div>
</div>

<script type="text/javascript">


    <%--    // 가로(수평) 탭 초기화<script type="text/javascript">--%>
    $(document).ready(function($){$(document).ready(function() {

        var mydata = ${aidInfo};
        alert("mydata -->"+mydata);
        $("#aidInfo").jqGrid({
            data: mydata,
            mtype : "POST",             //Ajax request type. It also could be GET
            datatype: "local",            //supported formats XML, JSON or Arrray
            colNames:['지원관리번호','지원기능','FREE','BASIC','PRO','ENTERPRISE','기능구분','사용여부','시작일자','종료일자','정렬기준'],
            colModel:[
                {name:'functionno',label:'functionno',width:100,aligh:'center',editable:false,edittype:'true'},
                {name:'functionname',label:'functionname',width:200,aligh:'center',editable:true,edittype:'text'},
                {name:'freeaid',label:'free',width:100,formatter:radio,aligh:'center',editable:true,edittype:'custom', editoptions:{custom_element: radioColumn, custom_value:radioValue}},
                {name:'basicaid',label:'basic',width:100,formatter:radio,aligh:'center',editable:true,edittype:'custom', editoptions:{custom_element: radioColumn, custom_value:radioValue}},
                {name:'proaid',label:'pro',width:100,formatter:radio,aligh:'center',editable:true,edittype:'custom', editoptions:{custom_element: radioColumn, custom_value:radioValue}},
                {name:'entaid',label:'ent',width:100,formatter:radio,aligh:'center',editable:true,edittype:'custom', editoptions:{custom_element: radioColumn, custom_value:radioValue}},
                {name:'functioncode',label:'functioncode',aligh:'center',editable:true,edittype:'select',editoptions:{value:{10:'기본기능',20:'부가기능', 30:'고급기능'}}},
                {name:'useyn',label:'useyn',width:100,aligh:'center',editable:true,edittype:'select',editoptions:{value:{'Y':'사용','N':'미사용'}}},
                {name:'stdate',label:'stdate',aligh:'center',sortable: true, width: 100, formatter: dateFormatter },
                {name:'eddate',label:'eddate',aligh:'center',sortable: true, width: 100, formatter: dateFormatter},
                {name:'sortno',label:'sortno',width:100,aligh:'center',editable:false,edittype:'text'}
            ],
            rowNum:10,
            width: 1200,
            height: 250,
            rowList:[10,20,30],
            pager: "#pager",
            sortname: "id",
            viewrecords: true,
            caption:"Product List"
        });

        $("#btn_add_row").click(function(){
            const selected = $('#sltcode option:selected').val();
            var data = {functioncode:selected, useyn:"Y"};
            rowId = $("#aidInfo").getGridParam("reccount"); // 페이징 처리 시 현 페이지의 Max RowId 값
            $("#aidInfo").jqGrid("addRowData", rowId+1, data, 'last'); // 첫행에 Row 추가
            //$("#list").jqGrid("addRowData", rowId+1, data, 'last'); // 마지막 행에 Row 추가

        });


        //날자 포맷
        function dateFormatter(stringDate){
            if(!stringDate){
                return "";
            }
            var formatNum = '';
            stringDate=stringDate.replace(/\s/gi, "");
            if(stringDate.length == 8){
                formatNum = stringDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
            }else{
                formatNum = stringDate;
            }
            // document.getElementById(id).innerHTML = formatNum;
            //console.log("dateFormatter formatNum -->"+formatNum+" ..... num ->"+num);
            return formatNum;
        }
        function radio(value, options, rowObject){
            var radioHtml = '<input type="radio" value=' + value + ' name="radioid" />';
            return radioHtml;
        }

        function radioColumn(value, editOptions) {

            var span   = $("<span />");
            var label  = $("<span />",{ html: "제공" });
            var radio  = $("<input>", { type: "radio", value: "O", name: "freight", id: "zero", checked: (value == "O")});
            var label1 = $("<span />",{ html: "미제공"});
            var radio1 = $("<input>", { type: "radio", value: "X", name: "freight", id: "fifty", checked: value == "X" });
            span.append(label).append(radio).append(label1).append(radio1);
            return span;
        }

        function radioValue(elem, oper, value) {
            if (oper === "set") {
                var radioButton = $(elem).find("input:radio[value='" + value + "']");
                if (radioButton.length > 0) {
                    radioButton.prop("checked", true);
                }
            }

            if (oper === "get") {
                return $(elem).find("input:radio:checked").val();
            }
        }



    });

    jQuery.browser = {};
    (function () {
        jQuery.browser.msie = false;
        jQuery.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            jQuery.browser.msie = true;
            jQuery.browser.version = RegExp.$1;
        }
    })();
</script>
</body>
<%@include file="../include/footer.jsp" %>

