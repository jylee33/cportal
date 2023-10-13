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
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxnumberinput.js"></script>
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
            <a href="#" class="active">라이선스 정책 관리</a>
            <a href="${path}/license/aidcodeinfo" >라이선스 제공 기능</a>
            <a href="${path}/license/creditinfo">Credit 제공</a>
        </div>
        <div class="right">
            <span class="tit">솔루션 선택</span>
            <select class="select" id="sltdeviceid">
                <option value="10">Network</option>
                <option value="20">Server</option>
                <option value="30">AP</option>
                <option value="40">Database</option>
                <option value="50">FMS</option>
            </select>
            <button class="btn" type="button" onclick="selectDevice()">조회</button>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button id="addRow" class="btn btn3">행추가</button>
        <button id="addSave" class="btn">저장</button>
    </div>
    <div id='jqxWidget' class="table-type1 text-center cursor">
        <div id="jaxLicense"></div>
        <div id="log"></div>
    </div>
</div>
<!-- // wrap -->

</div>

<script>


    $(document).ready(function(){
        console.log("jqxGridCreate-->");
        proc_jqxGridSelect();
    });

    function proc_jqxGridSelect() {
        var theme = "";
        //var param =
        var source =
            {
                url : "${path}/license/licensemanageview",
                datatype: "json",
                // postData: {"searchcode": $('#sltcode option:selected').val()},
                datafields: [
                    { name: 'licensepolicyid', type:'string'},
                    { name: 'solutioncode', type:'string'},
                    { name: 'solutionname', type:'string'},
                    { name: 'policycode', type:'string'},
                    { name: 'policyname', type:'string'},
                    { name: 'licenseamount', type:'string', cellsalign: 'center'},
                    { name: 'licenseint', type:'int', cellsalign: 'center'},
                    { name: 'licensecontent', type:'string', cellsalign: 'center'},
                    { name: 'aidcode', type:'string', cellsalign: 'center'},
                    { name: 'aidname', type:'string', cellsalign: 'center'},
                    { name: 'stdate', type:'string', cellsalign: 'center'},
                    { name: 'eddate', type:'string', cellsalign: 'center'},
                    { name: 'sortno', type:'int', cellsalign: 'center'},
                    { name: 'useyn', type:'string', cellsalign: 'center'},
                    { name: 'crudflg', type:'string', cellsalign: 'center'}
                ],
                id: 'license',
                data: {solutioncode: $('#sltdeviceid option:selected').val()},
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
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
            if (value = 'I') {
                return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #0000ff;">' + value + '</span>';
            }
            else {
                return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #008000;">' + value + '</span>';
            }
        }
        var editrow = -1;
        $("#jaxLicense").jqxGrid(
            {
                source: dataAdapter,
                columnsresize: true,
                sortable: true,
                altrows: true,
                editable: true,
                height: 700,
                width: '100%',
                columns: [
                    { text: '정책관리번호', datafield: 'licensepolicyid', displayField: 'licensepolicyid', align: "center" ,cellsalign: "center" , width: '0%',hidden:true},
                    { text: '솔루션명', datafield: 'solutioncode', displayField: 'solutionname', align: "center" , cellsalign: "center" , width: '10%', editable: true, columntype: 'dropdownlist',
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
                    { text: '가격정책', datafield: 'policycode', displayField: 'policyname', align: "center" , cellsalign: "center" , editable: true, width: '10%', columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {policyId: "1", policyValue1: "Free"},
                                    {policyId: "2", policyValue1: "Basic"},
                                    {policyId: "3", policyValue1: "Pro"},
                                    {policyId: "4", policyValue1: "Ent"}
                                ],
                                displayMember: 'policyValue1', valueMember: 'policyId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: '기본요금', datafield: 'licenseamount', displayField: 'licenseamount', align: "center" ,cellsalign: "center" , width: '10%'},
                    { text: '가용장비', datafield: 'licenseint',displayField: 'licenseint', align: "center" ,cellsalign: "center" , width: '10%', columntype: 'numberinput', editable: true},
                    { text: '정책내용', datafield: 'licensecontent', displayField: 'licensecontent', width: '20%', align:"center" ,cellsalign: "left" , editable: true},
                    { text: '제공기능', datafield: 'aidcode',displayField: 'aidname',   width: '15%', align:"center" , cellsalign: "center", columntype: 'dropdownlist',
                        createeditor: function (row, column, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {aidId: "10", aidValue1: "기본기능"},
                                    {aidId: "20", aidValue1: "부가기능"},
                                    {aidId: "30", aidValue1: "고급기능"}
                                ],
                                displayMember: 'aidValue1', valueMember: 'aidId', autoDropDownHeight: true
                            })
                        },
                    },
                    { text: '시작일자' ,datafield: 'stdate', displayField: 'stdate', width: '10%', align:"center", cellsalign: 'center',editable: false},
                    { text: '종료일자' ,datafield: 'eddate', displayField: 'eddate', width: '10%', align:"center", cellsalign: 'center',editable: false},
                    { text: '정렬순서', datafield: 'sortno', displayField: 'sortno', width: '5%', align:"center" ,cellsalign: "center" , editable: true},
                    { text: 'status', datafield: 'crudflg', displayField: 'crudflg', width: '0%', align:"center" ,hidden:true}
                ]
            });

        //$("#btn_add_row").jqxButton({ theme: theme });
        $("#addRow").click(function () {
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
            var sortno  = $("#jaxLicense").jqxGrid("getrows");
            var maxSortNo = 0;
            var res = "";
            for (var j = 0; j < sortno.length; j++) {
                var r1 = sortno[j];
                if(r1.sortno > maxSortNo){
                    maxSortNo = r1.sortno;
                }
            }

            console.log("11111111111111111111111111");
            maxSortNo = maxSortNo + 1;
            var fncName = "";
            const sltcode = $('#sltdeviceid option:selected').val();
            const sltname = $('#sltdeviceid option:selected').text();
            $("#jaxLicense").jqxGrid("addrow", null,
                {licensepolicyid:"", solutioncode:sltcode, solutionname:sltname, policycode:"", policyname:"", licenseamount:"", licenseint:0,
                    licensecontent:"",aidcode: "10",aidname:"기본기능", stdate: system_date, eddate: "2199-12-31", useyn: "Y", crudflg: "I",
                    sortno: maxSortNo
                }, "first");
            $("#jaxLicense").jqxGrid('endupdate');

        });
    }

        // $("#btn_pcancel").jqxButton({ theme: theme });
        // $("#btn_psave").jqxButton({ theme: theme });
        // update the edited row when the user clicks the 'Save' button.
        $("#addSave").click(function () {
            var licenseData = $("#jaxLicense").jqxGrid("getrows");   //1

         //   var licenseData = $("#jaxLicense").jqxGrid("updaterow");   //1


            console.log("rows------>"+licenseData.length);
            console.log("rows------>"+JSON.stringify(licenseData));

            var url = "${pageContext.request.contextPath}/license/licenseSave";
            $.ajax({
                type: 'post',
                url: url,
                async : true, // 비동기화 동작 여부
                data: JSON.stringify(licenseData),
                contentType: "application/json",
                success: function(creditData) {
                    alert("정상적으로 자료가 수정 되었습니다.");
                },
                error: function(err){
                    alert("자료 수정에 실패했습니다.");
                }
            })
        })


    function selectDevice(){
        proc_jqxGridSelect();

    }

    var selectDeviceChange = function (value){
        console.log("value --------------->"+value);
        $("#diviceid").val(value);
        console.log("value --------------->"+value);
    }

    $(document).ready(function() {
        var formObj = $("form[role='form']");

        $("#finddevice").on("click", function (e) {
            e.preventDefault();

            formObj.submit();
        });
    });



    function license_tbody_dblclick(dblclicked_element){
        var row_td = dblclicked_element.getElementsByTagName("td");
        var modal = document.getElementById("Modal1");
        var row1 = row_td[1].innerHTML;
        var row4 = row_td[4].innerHTML;
        //$("select[name=셀렉트박스name]").val();
        if(row_td[1].innerHTML == "FREE"){
            row_td[1].innerHTML = "1";
        }else if(row_td[1].innerHTML == "Basic"){
            row_td[1].innerHTML = "2";
        }else if(row_td[1].innerHTML == "Pro"){
            row_td[1].innerHTML = "3";
        }else{
            row_td[1].innerHTML = "4";
        }
        if(row_td[4].innerHTML == "기본기능"){
            row_td[4].innerHTML = "10";
        }else if(row_td[4].innerHTML == "부가기능"){
            row_td[4].innerHTML = "20";
        }else{
            row_td[4].innerHTML = "30";
        }
        alert("row_td[1]-->"+row_td[1].innerHTML);
        $("#modal_policycode").val(row_td[1].innerHTML);
        $("#modal_licenseamount").val(row_td[2].innerHTML);
        $("#modal_licenseint").val(row_td[3].innerHTML);
        $("#modal_aidcode").val(row_td[4].innerHTML);
        $("#modal_licensecontent").val(row_td[5].innerHTML);
        row_td[1].innerHTML = row1;
        row_td[4].innerHTML = row4;
        modal.style.display = 'block';
       // popupOpen('Modal1');
    }

    function aidcodeinfo(){
        let f = document.createElement('form');
        f.setAttribute('method', 'post');
        f.setAttribute('action', '${path}/license/aidcodeinfo');
        document.body.appendChild(f);
        f.submit();
    }

    // 팝업 함수 호출
// popupOpen('Modal1');
</script>
<%@include file="../include/footer.jsp" %>

