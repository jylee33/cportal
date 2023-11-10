<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>

<link rel="stylesheet" href="${path}/resources/js/jqwidgets/styles/jqx.base.css" type="text/css" />

<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1 minimum-scale=1" />
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcore.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdata.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxbuttons.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxscrollbar.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxmenu.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.selection.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.columnsresize.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdata.js"></script>
<%--script type="text/javascript" src="${path}/resources/js/jqwidgets/scripts/demos.js"></script>--%>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.edit.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.sort.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdatetimeinput.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcalendar.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxlistbox.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdropdownlist.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcheckbox.js"></script>

<script type="text/javascript" src="${path}/resources/js/jqwidgets/globalization/globalize.js"></script>
<script type="text/javascript" src="https://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/generatedata.js"></script>

<div class="container">
    <div class="h3-head">
        <h3 class="h3">라이선스 정책 관리</h3>
    </div>
    <div class="tabs-box">
        <div class="tabs">
            <a href="${path}/license/licensemanage" >라이선스 정책 관리</a>
            <a href="${path}/license/aidcodeinfo" >라이선스 제공 기능</a>
            <a href="${path}/license/creditinfo">Credit 제공</a>
            <a href="#" class="active">결제일자등록</a>
        </div>
        <div class="right">
            <span class="tit">조회 기간 설정</span>
            <div class="inp-box"><input type="date" class="inp" id="stDate" value=""></div>
            <div class="inp-box"><input type="date" class="inp" id="edDate" value=""></div>
            <button class="btn" type="button" onclick="selectDevice()">조회</button>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button class="btn" id="btn-save">저장</button>
    </div>

    <div id='jqxWidget' class="table-type1 text-center cursor">
        <div id="jaxSettle"></div>
        <div style="margin-top: 30px;"></div>
    </div>
    <div id="log"></div>
</div>

</div>
<!-- // wrap -->

<script>

    function selectDevice(){
        proc_jqxGridSelect();
    }

    $(document).ready(function(){

		var today    = new Date();
		var monthAgo = today;
		today = today.toISOString().slice(0, 10);
		monthAgo = new Date(monthAgo.setMonth(monthAgo.getMonth() - 1));
		monthAgo = monthAgo.toISOString().slice(0, 10);
		console.log("today >>>> " + today+"     monthAgo >>>> " + monthAgo);
		//stDate = document.getElementById("stDate");
		//edDate = document.getElementById("edDate");

		$("input[id='stDate']").val(monthAgo);
		$("input[id='edDate']").val(today);
		console.log("ready >>>> ");

        proc_jqxGridSelect();
    });

    function proc_jqxGridSelect() {
        var theme = "";
		stDate = document.getElementById("stDate");
		edDate = document.getElementById("edDate");
	//	alert("stDate--->"+stDate.value);
    //    alert($("#stDate").val()+"........."+stDate.value);
        var source =
            {
                url : "${path}/license/settleview",
                datatype: "json",
                datafields: [
                    { name: 'rownum', type:'int'},
                    { name: 'taxhistoryid', type:'string'},
                    { name: 'email', type:'string'},
                    { name: 'businessname', type:'string'},
                    { name: 'representationname', type:'string', cellsalign: 'center'},
                    { name: 'strbusinessnumber', type:'string', cellsalign: 'center'},
                    { name: 'zipaddress', type:'string', cellsalign: 'center'},
                    { name: 'businesskind',  type:'string', cellsalign: 'center'},
                    { name: 'businesscondition', type:'string', cellsalign: 'center'},
                    { name: 'strissuedate', type:'date', cellsalign: 'center'},
                    { name: 'issueamount', type:'integer', formatter:'integer',formatoptions: { defaultValue:'', thousandsSeparator:','}, cellsalign: 'right'},
                    { name: 'settlementmeans', type:'string', cellsalign: 'center'},
                    { name: 'settlementmeansnm', type:'string', cellsalign: 'center'},
                    { name: 'strsettlementdt', type:'date', cellsalign: 'center'},
                    { name: 'arrearsyn', type:'string', cellsalign: 'center'},
                    { name: 'settlementmeans', type:'string', cellsalign: 'center'}
                ],
                id: 'chargesettle',
                data: {stDate: $('#stDate').val(), edDate: $('#edDate').val()},
                updaterow: function (rowid, rowdata, commit) {
                    // synchronize with the server - send update command
                    commit(true);
                }
            };

        var dataAdapter = new $.jqx.dataAdapter(source,{
            loadComplete: function() {
            },
            autoBind: true
        });

        var createGridEditor = function(row, cellValue, editor, cellText, width, height){
            console.log(row+"....cellValue->"+cellValue+"....editor->"+editor+"....cellText->"+cellText+"....width->"+width+"....height->"+height)
        }
        var cellbeginedit = function (row, datafield, columntype, value) {
console.log("datafield--------->"+datafield);
           // if (row == 0 || row == 2 || row == 5) return false;
        }

        $("#jaxSettle").jqxGrid(
            {
                source: dataAdapter,
                columnsresize: true,
                sortable: true,
                altrows: true,
                editable: true,
                height: 700,
                width: '100%',
                columns: [
                    { text: '연번', datafield: 'rownum', displayField: 'rownum', align: "center" , cellsalign: "center" , editable: false, width: '4%', editable: false},
                    { text: '세금계산서발행내역ID', datafield: 'taxhistoryid', displayField: 'taxhistoryid', align: "center" , cellsalign: "center" ,width: '0%', hidden:true},
                    { text: '회원아이디', datafield: 'email', displayField: 'email', align: "center" , cellsalign: "center" , editable: false, width: '8%'},
                    { text: '사업장명', datafield: 'businessname', displayField: 'businessname', align: "center" , cellsalign: "center" , editable: false, width: '8%'},
                    { text: '대표자명', datafield: 'representationname', align: "center" ,cellsalign: "center" , width: '8%'},
                    { text: '사업자등록번호', datafield: 'strbusinessnumber', align: "center" ,cellsalign: "center" , width: '8%', editable: false},
                    { text: '주소', datafield: 'zipaddress', displayfield:'zipaddress',align: "center" ,cellsalign: "left" , width: '20%'},
                    { text: '업태', datafield: 'businesskind', width: '10%', align:"center" ,cellsalign: "center" , editable: true},
                    { text: '업종' ,datafield: 'businesscondition', width: '10%', align:"center", cellsalign: 'center', editable: false},
                    { text: '발행일자' ,datafield: 'strissuedate', width: '5%', align:"center", cellsalign: 'center', cellsformat: 'yyyy-MM-dd', editable: false},
                    { text: '발행금액', datafield: 'issueamount', width: '5%', align:"center", cellsalign: 'right',cellsformat : 'd', editable: false},
                    { text: '결제방법', datafield: 'settlementmeansnm', width: '4%', align:"center" , cellsalign: 'center',
                             validation: function (cell, value) {
                                   		if (value == "") return true;
                                        if (value == "카드") {
                                            return  {result: false};
                                        }
                                        return true;
                             }},
                    { text: '결제일자', datafield: 'strsettlementdt', columntype: 'datetimeinput', width: '5%',align:"center",  cellsalign: 'center', cellsformat: 'yyyy-MM-dd', cellbeginedit: cellbeginedit},
                    { text: '체납여부', datafield: 'arrearsyn', width: '5%', align:"center", cellsalign: 'center', editable: false},
                    { text: '결제방법', datafield: 'settlementmeans', displayField: 'settlementmeans', align: "center" , cellsalign: "center" ,width: '0%', hidden:true}
                ]
            });
        //$("#btn_add_row").jqxButton({ theme: theme });

        $("#jaxSettle").on('cellendedit', function (event) {
            var args = event.args;
            $("#cellendeditevent").text("Event Type: cellendedit, Column: " + args.datafield + ", Row: " + (1 + args.rowindex) + ", Value: " + args.value);
        });
    }


    var state = null;
    $("#btn-save").click(function () {
        var creditData = $("#jaxSettle").jqxGrid("getrows");   //1
        console.log("rows------>"+creditData.length);
        console.log("rows------>"+JSON.stringify(creditData));

        var url = "${pageContext.request.contextPath}/license/settleSave";
        $.ajax({
            type: 'post',
            url: url,
            async : true, // 비동기화 동작 여부
            data: JSON.stringify(creditData),
            contentType: "application/json",
            success: function(creditData) {
                alert("정상적으로 자료가 수정 되었습니다.");
            },
            error: function(err){
                alert("자료 수정에 실패했습니다.");
            }
        })
        $("#jaxSettle").on('cellvaluechanged', function (event)
        {
            var rows = $("#jaxSettle").jqxGrid("getrows");   //1
            console.log("rows------>"+rows);
            newrows = calculatejson(rows);    //3
            console.log("newrows----->"+newrows);
            redrawgrid(newrows);    //4
        });
    });


</script>
<%@include file="../include/footer.jsp" %>