<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header_2.jsp" %>

<%@include file="../include/jQWidgets.jsp" %>


<%--<style>--%>
<%--</style>--%>
<div class="container">
    <div class="h3-head">
        <h3 class="h3">사용자 현황 <span class="hit">사용자 건수 (<strong>5</strong> 건)</span></h3>
        <div class="right">
            <div class="srch-box">
                <form name="memberNm" autocomplete="on">  <%-- action="/portal/charge/memberinfo" method="post">--%>
                    <input type="text" class="inp" name="searchname" placeholder="사용자명 검색">
                    <button class="btn-srch" type="submit"><span class="hidden">검색</span></button>
                </form>
            </div>
        </div>
    </div>
    <div>
        <div class="table-type1 cursor">
<%--            <div id='jqxWidget' style="font-size: 13px; font-family: Verdana; float: left; width:100%">--%>
                <div id="jqxMemberList"></div>
                <div style="margin-top: 30px;"></div>
        </div>
    </div>
    <div class="tabs">
        <a href="${path}/charge/memberinfo" class="active">사용자 정보</a>
        <a href="${path}/charge/memberchargelist">과금내역(3건)</a>
        <a href="${path}/charge/membertaxlist">세금계산서 발행내역(3)</a>
    </div>
    <div class="tab-cont">
        <div class="cont">
            <div class="cols">
                <div class="col4">
                    <div class="table-type2">
                        <table id="tbuser1">
                            <colgroup>
                                <col style="width:150px">
                                <col style="">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>이메일</th>
                                <td id=email class="text-center">${userInfo.email}</td>
                            </tr>
                            <tr>
                                <th>사용자명</th>
                                <td id=membername cclass="text-center">${userInfo.membername}</td>
                            </tr>
                            <tr>
                                <th>라이센스등급</th>
                                <td id=licensegrade class="text-center">
                                    <c:if test="${userInfo.licensegrade eq '1'}">Free</c:if>
                                    <c:if test="${userInfo.licensegrade eq '2'}">Basic</c:if>
                                    <c:if test="${userInfo.licensegrade eq '3'}">Pro</c:if>
                                    <c:if test="${userInfo.licensegrade eq '4'}">Ent</c:if>
                                </td>
                            </tr>
                            <tr>
                                <th>전화번호</th>
                                <td id=celltel class="text-center">${userInfo.celltel}</td>
                            </tr>
                            <tr>
                                <th>사업장명</th>
                                <td id=businessname class="text-center">${userInfo.businessname}</td>
                            </tr>
                            <tr>
                                <th>사업자등록번호</th>
                                <td id=businessnumber class="text-center">${userInfo.businessnumber}</td>
                            </tr>
                            <tr>
                                <th>가입일자</th>
                                <td id=joindate class="text-center">${userInfo.strjoindate}</td>
                            </tr>
                            <tr>
                                <th>대표자명</th>
                                <td id=representationname class="text-center">${userInfo.representationname}</td>
                            </tr>
                            <tr>
                                <th>주소</th>
                                <td id=zipaddress class="text-center">${userInfo.zipaddress}</td>
                            </tr>
                            <tr>
                                <th>업종</th>
                                <td id=businesskind class="text-center">${userInfo.businesskind}</td>
                            </tr>
                            <tr>
                                <th>업태</th>
                                <td id=businesscondition class="text-center">${userInfo.businesscondition}</td>
                            </tr>
                            <tr>
                                <th>회원상태</th>
                                <td id=statusnm class="text-center">${userInfo.statusnm}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col4">
                    <div class="table-type2">
                        <table id="member">
                            <colgroup>
                                <col style="width:100px">
                                <col style="width:70px">
                                <col style="width:75px">
                                <col style="">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th rowspan="8">사용라이센스</th>
                                <th rowspan="4">가용장비</th>
                                <th>전체가용</th>
                                <td colspan="2" id=totalsoluble class="text-center">${userInfo.totalsoluble}</td>
                            </tr>
                            <tr>
                                <th>기본</th>
                                <td colspan="2" id=basevolume class="text-center">${userInfo.basevolume}</td>
                            </tr>
                            <tr>
                                <th>추가</th>
                                <td colspan="2" class="text-center" id="addvolume">
                                    <input type="number" class="inp small" style="text-align:center; width:100%" value=${userInfo.addvolume} name="addvolume" required>
                                </td>
                            </tr>
                            <tr>
                                <th>서비스</th>
                                <td colspan="2" class="text-center" id=servicevolume>
                                    <input type="number" class="inp small" style="text-align:center; width:100%" value=${userInfo.servicevolume} name="servicevolume" required>
                                </td>
                            </tr>
                            <tr>
                                <th rowspan="3">요금</th>
                                <th>합계</th>
                                <td colspan="2" id=totcharge class="text-center">${userInfo.totcharge}</td>
                            </tr>
                            <tr>
                                <th>기본</th>
                                <td colspan="2" id=basecharge class="text-center">
                                    <input type="number" class="inp small" style="text-align:center;width:100%;" value=${userInfo.basecharge} name="basecharge" required>
                                </td>
                            </tr>
                            <tr>
                                <th>추가</th>
                                <td colspan="2" id=addcharge class="text-center">
                                    <input type="number" class="inp small" style="text-align:center;width:100%" value=${userInfo.addcharge} name="addcharge" required>
                                </td>
                            </tr>
                            <tr>
                                <th colspan="2">데이터 보관기간</th>
                                <td id=datakeepterm class="text-center">
                                    <div class="inp-box"><input type="number" class="inp small" style="text-align:center; width:100%" value=${userInfo.datakeepterm} name="datakeepterm" required></div>
                                </td>
                                <td id=datakeepunit  class="text-center">
                                    <div class="inp-box">
                                        <select class="select small" value=${userInfo.datakeepunit} name="datakeepunit">
                                            <option value="D">일</option>
                                            <option value="M">월</option>
                                            <option value="Y">년</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th colspan="3">회원접속도메인</th>
                                <td colspan="2" id=serverdomainname class="text-center">
                                    <input type="text" class="inp small" style="text-align:center; width:100%" value=${userInfo.serverdomainname} name="serverdomainname">
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="bottom-btns">
                        <button class="btn">저장</button>
                    </div>
                </div>
                <div class="col4">
                    <div class="table-type2">
                        <table id="tbuser3">
                            <colgroup>
                                <col style="width:100px">
                                <col style="width:50px">
                                <col style="width:75px">
                                <col style="width:20px">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th rowspan="8">등록장비</th>
                                <th colspan="2" rowspan="2">전체</th>
                                <td rowspan="2" id=totalvolume></td>
                                <th>사용율</th>
                            </tr>
                            <tr>
                                <td rowspan="7" id=userate class="text-center"></td>
                            </tr>
                            <tr>
                                <th colspan="2">NMS</th>
                                <td id=networkvolume class="text-center">${userInfo.networkvolume}</td>
                            </tr>
                            <tr>
                                <th colspan="2">SMS</th>
                                <td id=servervolume class="text-center">${userInfo.servervolume}</td>
                            </tr>
                            <tr>
                                <th colspan="2">AP</th>
                                <td id=apvolume class="text-center">${userInfo.apvolume}</td>
                            </tr>
                            <tr>
                                <th colspan="2">DBMS</th>
                                <td id=dbmsvolume class="text-center">${userInfo.dbmsvolume}</td>
                            </tr>
                            <tr>
                                <th colspan="2">FMS</th>
                                <td id=fmsvolume class="text-center">${userInfo.fmsvolume}</td>
                            </tr>
                            <tr>
                                <th colspan="2">기타</th>
                                <td class="text-center"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- // 과금정보 -->
        <div class="cont" style="display: none;">
            <div class="table-type1 center">
                <%--            <div id='jqxWidget' style="font-size: 13px; font-family: Verdana; float: left; width:100%">--%>
                <div id="jqxChargeList"></div>
                <div style="margin-top: 30px;"></div>
            </div>
        </div>
        <!-- //세금계산서 발행정보 -->
        <div class="cont" style="display: none;">
            <div class="table-type1 center">
                <%--            <div id='jqxWidget' style="font-size: 13px; font-family: Verdana; float: left; width:100%">--%>
                <div id="jqxTaxList"></div>
                <div style="margin-top: 30px;"></div>
            </div>
        </div>
        <script>
            $('.tabs a').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
                $('.tab-cont > div').eq($(this).index()).show().siblings().hide();
                return false;
            })
        </script>
    </div>
</div>
</div>

<script>

    $(document).ready(function(){
        initComponent();
        //alert(rowdata);
      //  var email   = rowdata.email;
      //  alert(email);


        // initMemberInfo('testmai10l@hamonsoft.com');
        // initChargeList('testmai10l@hamonsoft.com');
        // initTaxList('testmai10l@hamonsoft.com');
    });
    // initComponent(memberlistsource) ---------------------------------------------------------------------
    function initComponent() {
        var memberlistsource =
            {
                url : "${path}/charge/memberlistview",
                datatype: "json",
                altRows: true,
                // data: {solutioncode: $('#sltdeviceid option:selected').val()},
                // postData: {"searchcode": $('#sltcode option:selected').val()},
                datafields: [
                    { name: 'membername', type:'string', cellsalign: 'center'},
                    { name: 'email', type:'string', cellsalign: 'center'},
                    { name: 'licensegrade', type:'string', cellsalign: 'center'},
                    { name: 'licensegradename', type:'string', cellsalign: 'center'},
                    { name: 'celltel', type:'string', cellsalign: 'center'},
                    { name: 'businessname', type:'int', cellsalign: 'center'},
                    { name: 'strbusinessnumber', type:'string', cellsalign: 'center'},
                    { name: 'strjoindate', type: 'string', cellsalign: 'center' },
                    { name: 'zipaddress', type: 'string', cellsalign: 'center' },
                    { name: 'totalsoluble', type: 'string', cellsalign: 'center' },
                    { name: 'totalvolume', type: 'string' , cellsalign: 'center'},
                    { name: 'userate', type: 'string', cellsalign: 'center' },
                    { name: 'totalcharge', type: 'string' , cellsalign: 'center'},
                    { name: 'statusnm', type: 'string', cellsalign: 'center' },
                    { name: 'lack1', type: 'string', cellsalign: 'center' },
                    { name: 'lack2', type: 'string', cellsalign: 'center' },
                    { name: 'strstdate', type: 'string' , cellsalign: 'center'},
                    { name: 'numrow', type:'int', cellsalign: 'right'}
                ]
            };
        var dataAdapter = new $.jqx.dataAdapter(memberlistsource,{
            loadComplete: function() {
alert(".1.");
                initMemberInfo('testmai10l@hamonsoft.com');
                alert(".2.");
                initChargeList('testmai10l@hamonsoft.com');
                alert(".3.");
                initTaxList('testmai10l@hamonsoft.com');
                alert(".4.");

                // var records = dataAdapter.records;
                // var length = records.length;
                // var rows = $('#jqxMemberList').jqxGrid('getrows');
                // var rownumber = rows.length - 1;
                // var rowdata = $("#jqxMemberList").jqxGrid('getrowdata', 0);
                // alert("rownumber- -->"+rownumber+"..."+length+"...."+rowdata.data("email"));
                // var email   = rowdata.email;
                // alert(email);

            },
            autoBind: true
        });

        //grid
        var pagerrenderer = function () {
            var element = $("<div style='margin-top: 5px; width: 100%; height: 100%;'></div>");
            var paginginfo = $("#jqxMemberList").jqxGrid('getpaginginformation');
            for (i = 0; i < paginginfo.pagescount; i++) {
                // add anchor tag with the page number for each page.
                var anchor = $("<a style='padding: 5px;' href='#" + i + "'>" + i + "</a>");
                anchor.appendTo(element);
                anchor.click(function (event) {
                    // go to a page.
                    var pagenum = parseInt($(event.target).text());
                    $("#jqxMemberList").jqxGrid('gotopage', pagenum);
                });
            }
            return element;
        }
        $("#jqxMemberList").jqxGrid({
            source: memberlistsource,
            pageable: true,
            autoheight: true,
            columnsresize: true,
            sortable: true,
            altrows: true,
            showstatusbar: true,
            showtoolbar: false,
            editable: true,
            height: 700,
            width: '100%',
            selectionmode: 'singlecell',
            editmode: 'click',
            columns: [
                { text: '사용자', datafield: 'membername', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '이메일', datafield: 'email', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '등급', datafield: 'licensegrade', displayField: 'licensegradename', align: "center" , cellsalign: "center" , editable: false, width: '5%', columntype: 'dropdownlist',
                    createeditor: function (row, column, editor) {
                        editor.jqxDropDownList({
                            source: [
                                {gradeId: "1", gradeValue1: "Free"},
                                {gradeId: "2", gradeValue1: "Basic"},
                                {gradeId: "3", gradeValue1: "Pro"},
                                {gradeId: "4", gradeValue1: "Ent"}
                            ],
                            displayMember: 'gradeValue1', valueMember: 'gradeId', autoDropDownHeight: true
                        })
                    },
                },
                { text: '전화번호', datafield: 'celltel', width: '7%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사업장명', datafield: 'businessname', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사업자 등록번호', datafield: 'strbusinessnumber', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '가입일자', datafield: 'strjoindate', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '주소', datafield: 'zipaddress', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '전체 가용장비', datafield: 'totalsoluble', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '등록 장비', datafield: 'totalvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사용율', datafield: 'userate', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사용금액', datafield: 'totalcharge', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '미납금액', datafield: 'lack1', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '미납횟수', datafield: 'lack2', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '상태', datafield: 'statusnm', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '변동일자', datafield: 'strstdate', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '연번', datafield: 'rownum', width: '3%', align: 'center' ,cellsalign: "center" , editable: false}
            ]
            , width : '100%'
            , height: 500
        });
        $("#jqxMemberList").bind("pagechanged", function (event) {
            var args = event.args;
            var pagenumber = args.pagenum;
            var pagesize = args.pagesize;
        });
        $("#jqxMemberList").bind("pagesizechanged", function (event) {
            var args = event.args;
            var pagenumber = args.pagenum;
            var pagesize = args.pagesize;
        });

        //  alert(email);

      //  $('#jqxTabs').jqxTabs({ width: 550, height: 150 });
    }
    // initMemberInfo(membersource) ---------------------------------------------------------------------




    function initMemberInfo() {
        var membersource =
            {
                url : "${path}/charge/memberview",
                datatype: "json",
                altRows: true,
                // data: {solutioncode: $('#sltdeviceid option:selected').val()},
                // postData: {"searchcode": $('#sltcode option:selected').val()},
                datafields: [
                    { name: 'membername', type:'string', cellsalign: 'center'},
                    { name: 'email', type:'string', cellsalign: 'center'},
                    { name: 'licensegrade', type:'string', cellsalign: 'center'},
                    { name: 'licensegradename', type:'string', cellsalign: 'center'},
                    { name: 'celltel', type:'string', cellsalign: 'center'},
                    { name: 'businessname', type:'int', cellsalign: 'center'},
                    { name: 'strbusinessnumber', type:'string', cellsalign: 'center'},
                    { name: 'strjoindate', type: 'string', cellsalign: 'center' },
                    { name: 'zipaddress', type: 'string', cellsalign: 'center' },
                    { name: 'totalsoluble', type: 'string', cellsalign: 'center' },
                    { name: 'totalvolume', type: 'string' , cellsalign: 'center'},
                    { name: 'userate', type: 'string', cellsalign: 'center' },
                    { name: 'totalcharge', type: 'string' , cellsalign: 'center'},
                    { name: 'statusnm', type: 'string', cellsalign: 'center' },
                    { name: 'lack1', type: 'string', cellsalign: 'center' },
                    { name: 'lack2', type: 'string', cellsalign: 'center' },
                    { name: 'strstdate', type: 'string' , cellsalign: 'center'},
                    { name: 'numrow', type:'int', cellsalign: 'right'}
                ]
            };



        var dataAdapter = new $.jqx.dataAdapter(membersource,{
            loadComplete: function() {
                alert(".2.");
                initChargeList('testmai10l@hamonsoft.com');

                // var records = dataAdapter.records;
                // var length = records.length;
                // var rows = $('#jqxMemberList').jqxGrid('getrows');
                // var rownumber = rows.length - 1;
                // var rowdata = $("#jqxMemberList").jqxGrid('getrowdata', 0);
                // alert("rownumber- -->"+rownumber+"..."+length+"...."+rowdata.data("email"));
                // var email   = rowdata.email;
                // alert(email);

            },
            autoBind: true
        });
        $("#jqxMember").jqxGrid({
            source: membersource,
            pageable: true,
            autoheight: true,
            columnsresize: true,
            sortable: true,
            altrows: true,
            showstatusbar: true,
            showtoolbar: false,
            editable: true,
            height: 700,
            width: '100%',
            selectionmode: 'singlecell',
            editmode: 'click',
            columns: [
                { text: '사용자', datafield: 'membername', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '이메일', datafield: 'email', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '등급', datafield: 'licensegrade', displayField: 'licensegradename', align: "center" , cellsalign: "center" , editable: false, width: '5%', columntype: 'dropdownlist',
                    createeditor: function (row, column, editor) {
                        editor.jqxDropDownList({
                            source: [
                                {gradeId: "1", gradeValue1: "Free"},
                                {gradeId: "2", gradeValue1: "Basic"},
                                {gradeId: "3", gradeValue1: "Pro"},
                                {gradeId: "4", gradeValue1: "Ent"}
                            ],
                            displayMember: 'gradeValue1', valueMember: 'gradeId', autoDropDownHeight: true
                        })
                    },
                },
                { text: '전화번호', datafield: 'celltel', width: '7%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사업장명', datafield: 'businessname', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사업자 등록번호', datafield: 'strbusinessnumber', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '가입일자', datafield: 'strjoindate', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '주소', datafield: 'zipaddress', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '전체 가용장비', datafield: 'totalsoluble', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '등록 장비', datafield: 'totalvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사용율', datafield: 'userate', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사용금액', datafield: 'totalcharge', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '미납금액', datafield: 'lack1', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '미납횟수', datafield: 'lack2', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '상태', datafield: 'statusnm', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '변동일자', datafield: 'strstdate', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '연번', datafield: 'rownum', width: '3%', align: 'center' ,cellsalign: "center" , editable: false}
            ]
            , width : '100%'
            , height: 500
        });
        //  $('#jqxTabs').jqxTabs({ width: 550, height: 150 });
    }

    function initChargeList() {
        var chargesource =
            {
                url : "${path}/charge/chargelistviw",
                datatype: "json",
                altRows: true,
                datafields: [
                    { name: 'useyym', type:'string', cellsalign: 'center'},
                    { name: 'licensegrade', type:'string', cellsalign: 'center'},
                    { name: 'totalsoluble', type:'string', cellsalign: 'center'},
                    { name: 'basevolume', type:'string', cellsalign: 'center'},
                    { name: 'basecharge', type:'string', cellsalign: 'center'},
                    { name: 'addvolume', type:'string', cellsalign: 'center'},
                    { name: 'addcharge', type:'string', cellsalign: 'center'},
                    { name: 'servicevolume', type:'string', cellsalign: 'center'},
                    { name: 'datakeepnm', type:'string', cellsalign: 'center'},
                    { name: 'totalvolume', type:'string', cellsalign: 'center'},
                    { name: 'networkvolume', type:'string', cellsalign: 'center'},
                    { name: 'servervolume', type:'string', cellsalign: 'center'},
                    { name: 'apvolume', type:'string', cellsalign: 'center'},
                    { name: 'dbmsvolume', type:'string', cellsalign: 'center'},
                    { name: 'fmsvolume', type:'string', cellsalign: 'center'},
                    { name: 'totalcharge', type:'string', cellsalign: 'center'},
                    { name: 'userate', type:'string', cellsalign: 'center'}
                ]
            };
        var dataAdapter = new $.jqx.dataAdapter(chargesource,{
            loadComplete: function() {
                alert(".2.");
                initChargeList('testmai10l@hamonsoft.com');

                // var records = dataAdapter.records;
                // var length = records.length;
                // var rows = $('#jqxMemberList').jqxGrid('getrows');
                // var rownumber = rows.length - 1;
                // var rowdata = $("#jqxMemberList").jqxGrid('getrowdata', 0);
                // alert("rownumber- -->"+rownumber+"..."+length+"...."+rowdata.data("email"));
                // var email   = rowdata.email;
                // alert(email);

            },
            autoBind: true
        });
        $("#jqxChargeList").jqxGrid({
            source: chargesource,
            pageable: true,
            autoheight: true,
            columnsresize: true,
            sortable: true,
            altrows: true,
            showstatusbar: true,
            showtoolbar: false,
            editable: true,
            height: 700,
            width: '100%',
            selectionmode: 'singlecell',
            editmode: 'click',
            columns: [
                { text: '사용 월', datafield: 'useyym', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '등급' , datafield: 'licensegrade', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '전체가용장비', datafield: 'totalsoluble', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '장비', columngroup: '기본라이센스',datafield: 'basevolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '요금', columngroup: '기본라이센스',datafield: 'basecharge', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '장비', columngroup: '추가라이센스',datafield: 'addvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '요금', columngroup: '추가라이센스',datafield: 'addcharge', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '서비스장비', datafield: 'servicevolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '데이터보관기간', datafield: 'datakeepnm', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '전체', datafield: 'totalvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '네트워크', datafield: 'networkvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '서버', datafield: 'servervolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: 'AP', datafield: 'apvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '데이터베이스', datafield: 'dbmsvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '환경센서', datafield: 'fmsvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사용금액', datafield: 'totalcharge', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사용율', datafield: 'userate', width: '5%', align: 'center' ,cellsalign: "center" , editable: false}
            ]
            , width : '100%'
            , height: 500
        });
    }

    function initTaxList() {
        var taxsource =
            {
                url : "${path}/charge/taxlistview",
                datatype: "json",
                altRows: true,
                // data: {solutioncode: $('#sltdeviceid option:selected').val()},
                // postData: {"searchcode": $('#sltcode option:selected').val()},
                datafields: [
                    { name: 'rownum', type:'string', cellsalign: 'center'},
                    { name: 'representationname', type:'string', cellsalign: 'center'},
                    { name: 'businessnumber', type:'string', cellsalign: 'center'},
                    { name: 'zipaddress', type:'string', cellsalign: 'center'},
                    { name: 'businesskind', type:'string', cellsalign: 'center'},
                    { name: 'businesscondition', type:'string', cellsalign: 'center'},
                    { name: 'issuedate', type:'string', cellsalign: 'center'},
                    { name: 'issueamount', type:'string', cellsalign: 'center'},
                    { name: 'last_pay_date', type:'string', cellsalign: 'center'}
                ]
            };
        var dataAdapter = new $.jqx.dataAdapter(taxsource,{
            loadComplete: function() {

            },
            autoBind: true
        });
        $("#jqxTaxList").jqxGrid({
            source: membersource,
            pageable: true,
            autoheight: true,
            columnsresize: true,
            sortable: true,
            altrows: true,
            showstatusbar: true,
            showtoolbar: false,
            editable: true,
            height: 700,
            width: '100%',
            selectionmode: 'singlecell',
            editmode: 'click',
            columns: [
                { text: '연번', datafield: 'rownum', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '대표자명', datafield: 'representationname', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '사업자등록번호', datafield: 'businessnumber', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '주소', datafield: 'zipaddress', width: '7%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '업태', datafield: 'businesskind', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '업종', datafield: 'strbusinessnumber', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '발행일자', datafield: 'businesscondition', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '발행금액', datafield: 'issuedate', width: '10%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '입금일자', datafield: 'last_pay_date', width: '5%', align: 'center' ,cellsalign: "center" , editable: false},
                { text: '체납여부', datafield: 'totalvolume', width: '5%', align: 'center' ,cellsalign: "center" , editable: false}
            ]
            , width : '100%'
            , height: 500
        });
    }
</script>
<%@include file="../include/footer.jsp" %>