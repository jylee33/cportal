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
    <div class="tabs-box">
        <div class="tabs">
            <a href="${path}/license/licensemanage" >라이선스 정책 관리</a>
            <a href="${path}/license/aidcodeinfo" >라이선스 제공 기능</a>
            <a href="#" class="active">Credit 제공</a>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button class="btn btn3" id="btn_add_row">행추가</button>
        <button class="btn" id="btn-save">저장</button>
    </div>

    <div id='jqxWidget' class="table-type1 text-center cursor">
        <div id="jaxCredit"></div>
        <div style="margin-top: 30px;"></div>
    </div>
    <div id="log"></div>
</div>

</div>
<!-- // wrap -->

<script>

    $(document).ready(function(){
        console.log("jqxGridCreate-->");
       proc_jqxGridSelect();
    });

    function proc_jqxGridSelect() {
        var theme = "";
        var source =
            {
                url : "${path}/license/creditview",
                datatype: "json",
                // postData: {"searchcode": $('#sltcode option:selected').val()},
                datafields: [
                    { name: 'groupcode', type:'string'},
                    { name: 'commoncode', type:'string'},
                    { name: 'codename', type:'string', cellsalign: 'center'},
                    { name: 'applyvolume', type:'string', cellsalign: 'center'},
                    { name: 'useyn', type:'string', cellsalign: 'center'},
                    { name: 'sortno', type:'int', cellsalign: 'center'},
                    { name: 'stdate', type:'string', format: 'yyyy-MM-dd', cellsalign: 'center'},
                    { name: 'eddate', type:'string', format: 'yyyy-MM-dd', cellsalign: 'center'},
                    { name: 'crudflg', type:'string', cellsalign: 'center'}
                ],
                id: 'JOB_DETAIL',
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

        $("#jaxCredit").jqxGrid(
            {
                source: dataAdapter,
                columnsresize: true,
                sortable: true,
                altrows: true,
                editable: true,
                height: 700,
                width: '100%',
                columns: [
                    { text: '공통코드그룹코드', datafield: 'groupcode', displayField: 'groupcode', align: "center" , cellsalign: "center" , editable: false, width: '0%', hidden:true},
                    { text: 'Credit 관리코드', datafield: 'commoncode', displayField: 'commoncode', align: "center" , cellsalign: "center" , editable: true, width: '15%'},
                    { text: 'Credit 구분', datafield: 'codename', displayField: 'codename', align: "center" ,cellsalign: "center" , width: '25%'},
                    { text: 'Credit 적용', datafield: 'applyvolume',displayField: 'applyvolume', align: "center" ,cellsalign: "center" , width: '25%', editable: true},
                    { text: '사용여부', datafield: 'useyn',  width: '6%', align:"center" ,columntype: 'checkbox' },
                    { text: '정렬순서', datafield: 'sortno', width: '5%', align:"center" ,cellsalign: "center" , editable: true},
                    { text: '시작일자' ,datafield: 'stdate', width: '12%', align:"center", cellsalign: 'center',format: 'yyyy-MM-dd', editable: false},
                    { text: '종료일자' ,datafield: 'eddate', width: '12%', align:"center", cellsalign: 'center',format: 'yyyy-MM-dd', editable: false},
                    { text: 'status', datafield: 'crudflg', width: '0%', align:"center" ,hidden:true}
                ]
            });
        //$("#btn_add_row").jqxButton({ theme: theme });
        $("#btn_add_row").click(function () {
            var system_date = "";
            var year = new Date().getFullYear();
            var month = new Date().getMonth() + 1;
            if(month >= 10){
                month = month;
            }else{
                month = '0' + month;
            };
            var date = new Date().getDate();

            if(date >= 10){
                date = date;
            }else{
                date = '0' + date;
            };
            system_date = year + "-" +month + "-" +date;
            alert(system_date + ".year->.." +year + "..month->." + ".date ->." +date+"................."+system_date);

            var fncName = "";
            var sortno  = $("#jaxCredit").jqxGrid("getrows");
            var maxSortNo = 0;
            var res = "";
            for (var j = 0; j < sortno.length; j++) {
                var r1 = sortno[j];
                if(r1.sortno > maxSortNo){
                   maxSortNo = r1.sortno;
                }
            }
            maxSortNo = maxSortNo + 1;
            // alert(maxSortNo);
            // $("#log").html(res);
            $("#jaxCredit").jqxGrid("addrow", null,
                {groupcode:'006', commoncode:'', codename:"", applyvolume:0, useyn:"Y", stdate: system_date, eddate: "2199-12-31",sortno: maxSortNo, crudflg:'I'}, "first");
            $("#jaxCredit").jqxGrid('endupdate');
        });

        $("#jaxCredit").on('cellendedit', function (event) {
            var args = event.args;
            $("#cellendeditevent").text("Event Type: cellendedit, Column: " + args.datafield + ", Row: " + (1 + args.rowindex) + ", Value: " + args.value);
        });
    }


    var state = null;
    $("#btn-save").click(function () {
        // save the current state of jqxGrid.
        //state = $("#aidInfo").jqxGrid('savestate'); parse   stringify
        var creditData = $("#jaxCredit").jqxGrid("getrows");   //1
        console.log("rows------>"+creditData.length);
        console.log("rows------>"+JSON.stringify(creditData));

        var url = "${pageContext.request.contextPath}/license/creditSave";
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
        $("#jaxCredit").on('cellvaluechanged', function (event)
        {
            var rows = $("#jaxCredit").jqxGrid("getrows");   //1
            console.log("rows------>"+rows);
            newrows = calculatejson(rows);    //3
            console.log("newrows----->"+newrows);
            redrawgrid(newrows);    //4
        });
    });


</script>
<%@include file="../include/footer.jsp" %>