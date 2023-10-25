<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>
<%--<style>--%>
<%--</style>--%>
<div id="wrap">
    <div class="container">
        <div class="h3-head">
            <h3 class="h3">사용자 현황 <span class="hit">사용자 건수 (<strong>${pagination.totalRecordCount}</strong> 건)</span></h3>
            <div class="right">
                <div class="srch-box">
                    <form name="memberNm" autocomplete="on" action="/portal/charge/memberinfo" method="post">
                        <input type="text" class="inp" name="searchname" placeholder="사용자명 검색">
                        <button class="btn-srch" type="submit"><span class="hidden">검색</span></button>
                    </form>
                </div>
            </div>
        </div>

        <div class="table-type1 cursor">
            <table id="memberinfo-table">
                <thead>
                <tr>
                    <th>사용자</th>
                    <th>이메일</th>
                    <th>등급</th>
                    <th>전화번호</th>
                    <th>사업장명</th>
                    <th>사업자 등록번호</th>
                    <th>가입일자</th>
                    <th>주소</th>
                    <th>전체 가용장비</th>
                    <th style="color:#8B0000;font: 17px">등록 장비</th>
                    <th style="color:#8B0000;font: 17px">사용율</th>
                    <th style="color:#8B0000;font: 17px">사용금액</th>
                    <th style="color:#8B0000;font: 17px">미납금액</th>
                    <th style="color:#8B0000;font: 17px">미납횟수</th>
                    <th>상태</th>
                    <th>변동일자</th>
                    <th>비고</th>
                </tr>
                </thead>
                <tbody>
                <c:choose>
                    <c:when test="${fn:length(list) > 0}">
                        <c:forEach items="${list}" var="list">
                            <tr id="data-area">
                                <td class="text-center">${list.membername}</td>
                                <td class="text-left">${list.email}</td>
                                <td class="text-center">
                                    <c:if test="${list.licensegrade eq '1'}">Free</c:if>
                                    <c:if test="${list.licensegrade eq '2'}">Basic</c:if>
                                    <c:if test="${list.licensegrade eq '3'}">Pro</c:if>
                                    <c:if test="${list.licensegrade eq '4'}">Ent</c:if>
                                </td>
                                <td class="text-center">${list.celltel}</script></td>
                                <td class="text-left">${list.businessname}</td>
                                <td class="text-center">${list.strbusinessnumber}</td>
                                <td class="text-center">${list.strjoindate}</td>
                                <td class="text-left">${list.zipaddress}</td>
                                <td class="text-center">${list.totalsoluble}</td>
                                <td class="text-center" style="color:#8B0000;font: 17px">${list.totalvolume}</td>
                                <td class="text-center" style="color:#8B0000;font: 17px">${list.userate}</td>
                                <td class="text-center" style="color:#8B0000;font: 17px"><fmt:setLocale value="ko_KR"/><fmt:formatNumber type="currency" value="${list.totcharge}" /></td>
                                <td class="text-center" style="color:#8B0000;font: 17px">0</td>
                                <td class="text-center" style="color:#8B0000;font: 17px">0</td>
                                <td class="text-center">${list.statusnm}</td>
                                <td class="text-center">${list.strstdate}</td>
                                <td class="text-center"></td>
                            </tr>
                        </c:forEach>
                    </c:when>
                </c:choose>
                </tbody>
            </table>
        </div>

        <!--
        <div class="paginate">
            <div class="paging">
                <a class="direction prev" href="javascript:void(0);"
                   onclick="movePage(1,${pagination.cntPerPage},${pagination.pageSize});">
                    &lt;&lt; </a> <a class="direction prev" href="javascript:void(0);"
                                     onclick="movePage(${pagination.currentPage}<c:if test="${pagination.hasPreviousPage == true}">-1</c:if>,${pagination.cntPerPage},${pagination.pageSize});">
                &lt; </a>

                <c:forEach begin="${pagination.firstPage}"
                           end="${pagination.lastPage}" var="idx">
                    <a
                            style="color:<c:out value="${pagination.currentPage == idx ? '#cc0000; font-weight:700; margin-bottom: 2px;' : ''}"/> "
                            href="javascript:void(0);"
                            onclick="movePage(${idx},${pagination.cntPerPage},${pagination.pageSize});"><c:out
                            value="${idx}" /></a>
                </c:forEach>
                <a class="direction next" href="javascript:void(0);"
                   onclick="movePage(${pagination.currentPage}<c:if test="${pagination.hasNextPage == true}">+1</c:if>,${pagination.cntPerPage},${pagination.pageSize});">
                    &gt; </a> <a class="direction next" href="javascript:void(0);"
                                 onclick="movePage(${pagination.totalRecordCount},${pagination.cntPerPage},${pagination.pageSize});">
                &gt;&gt; </a>
            </div>
        </div>
-->
        <div class="pagenate">
            <a href="javascript:void(0);" class="prev" onclick="movePage(1,${pagination.cntPerPage},${pagination.pageSize});"><i class="xi-angle-left-thin"></i></a>
            <c:forEach begin="${pagination.firstPage}"
                       end="${pagination.lastPage}" var="idx">
                <a
                        style="color:<c:out value="${pagination.currentPage == idx ? 'color: #fff; background: #182743; border-color:#182743; position: relative; z-index:2px;' : ''}"/> "
                        href="javascript:void(0);"
                        onclick="movePage(${idx},${pagination.cntPerPage},${pagination.pageSize});"><c:out
                        value="${idx}" /></a>
            </c:forEach>
            <a href="javascript:void(0);" class="next"
               onclick="movePage(${pagination.currentPage}<c:if test="${pagination.hasNextPage == true}">+1</c:if>,${pagination.cntPerPage},${pagination.pageSize});">
                <i class="xi-angle-right-thin"></i></a>
        </div>
        <div class="tabs">
            <a href="#" class="active">사용자 정보</a>
            <a href="#">과금내역</a>
            <a href="#">세금계산서 발행내역</a>
        </div>
        <%--        <div class="tabs">--%>
        <%--            <a href="${path}/charge/memberinfo" class="active">사용자 정보</a>--%>
        <%--            <a href="${path}/charge/memberchargelist">과금내역(3건)</a>--%>
        <%--            <a href="${path}/charge/membertaxlist">세금계산서 발행내역(3)</a>--%>
        <%--        </div>--%>

        <%--            <div style="max-width:1600px; margin:0 auto;">--%>
        <div class="tab-cont">
            <div class="cont">
                <div style="max-width:1600px;">
                    <div class="cols">
                        <div class="col4" style="width: 45%">
                            <div class="table-type2">
                                <table id="tbuser1">
                                    <colgroup>
                                        <col style="width:100px">
                                        <col style="width:250px">
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th>이메일</th>
                                        <td id=email class="text-left">${userInfo.email}</td>
                                    </tr>
                                    <tr>
                                        <th>사용자명</th>
                                        <td id=membername class="text-left">${userInfo.membername}</td>
                                    </tr>
                                    <tr>
                                        <th>라이센스등급</th>
                                        <td id=licensegrade class="text-left">
                                            <c:if test="${userInfo.licensegrade eq '1'}">Free</c:if>
                                            <c:if test="${userInfo.licensegrade eq '2'}">Basic</c:if>
                                            <c:if test="${userInfo.licensegrade eq '3'}">Pro</c:if>
                                            <c:if test="${userInfo.licensegrade eq '4'}">Ent</c:if>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>전화번호</th>
                                        <td id=celltel class="text-left">${userInfo.celltel}</td>
                                        <script type="text/javascript">
                                            $('#celltel').text(phoneFormatter("${userInfo.celltel}"));
                                        </script>
                                    </tr>
                                    <tr>
                                        <th>사업장명</th>
                                        <td id=businessname class="text-left">${userInfo.businessname}</td>
                                    </tr>
                                    <tr>
                                        <th>사업자등록번호</th>
                                        <td id=businessnumber class="text-left">${userInfo.businessnumber}</td>
                                        <script type="text/javascript">
                                            $('#businessnumber').text(bizNoFormatter("${userInfo.businessnumber}","2"));
                                        </script>
                                    </tr>
                                    <tr>
                                        <th>가입일자</th>
                                        <td id=joindate class="text-left">${userInfo.strjoindate}</td>
                                        <script type="text/javascript">
                                            $('#joindate').text(dateFormatter("${userInfo.strjoindate}"));
                                        </script>
                                    </tr>
                                    <tr>
                                        <th>대표자명</th>
                                        <td id=representationname class="text-left">${userInfo.representationname}</td>
                                    </tr>
                                    <tr>
                                        <th>주소</th>
                                        <td id=zipaddress class="text-left">${userInfo.zipaddress}</td>
                                    </tr>
                                    <tr>
                                        <th>업종</th>
                                        <td id=businesskind class="text-left">${userInfo.businesskind}</td>
                                    </tr>
                                    <tr>
                                        <th>업태</th>
                                        <td id=businesscondition class="text-left">${userInfo.businesscondition}</td>
                                    </tr>
                                    <tr>
                                        <th>회원상태</th>
                                        <td id=statusnm class="text-left">${userInfo.statusnm}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col4" style="width: 30%">
                            <div class="table-type2">
                                <table id="tbuser2">
                                    <colgroup>
                                        <col style="width:90px">
                                        <col style="width:90px">
                                        <col style="width:90px">
                                        <col style="width:110px">
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th rowspan="8">사용</br>라이센스</th>
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
                                        <td colspan="2" class="text-center" id=addvolume>
                                            <input type="number" class="inp" style="text-align:center; width:100%" name="addvolume"  maxlength="8" value=${userInfo.addvolume} required>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>서비스</th>
                                        <td colspan="2" class="text-center" id=servicevolume>
                                            <input type="number" class="inp" style="text-align:center; width:100%" name="servicevolume"  maxlength="8"  value=${userInfo.servicevolume} required>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style="color:#8B0000;font: 17px" rowspan="3">요금</th>
                                        <th style="color:#8B0000;font: 17px">합계</th>
                                        <td colspan="2"><div id=totcharge class="text-center" style="color:#8B0000;font: 17px">${userInfo.totcharge}</div></td>
                                        <script type="text/javascript">
                                            $('#totcharge').text(currencyFormatter("${userInfo.totcharge}"));
                                        </script>
                                    </tr>
                                    <tr>
                                        <th style="color:#8B0000;font: 17px">기본</th>
                                        <td colspan="2" id=basecharge class="text-center" style="color:#8B0000;font: 17px">${userInfo.basecharge}</td>
                                        <script type="text/javascript">
                                            $('#basecharge').text(currencyFormatter("${userInfo.basecharge}"));
                                        </script>
                                    </tr>
                                    <tr>
                                        <th style="color:#8B0000;font: 17px">추가</th>
                                        <td colspan="2" class="text-center">
                                            <input type="text" class="inp small" style="text-align:center;width:100%;color:#8B0000;font: 17px" id="addcharge" value=${userInfo.addcharge}>
                                        </td>
                                        <script type="text/javascript">
                                            $('input[id=addcharge]').attr('value',currencyFormatter("${userInfo.addcharge}"));
                                        </script>

                                    </tr>
                                    <tr>
                                        <th colspan="2">데이터 보관기간</th>
                                        <td>
                                            <div class="flex gap10" >
                                                <input type="number" class="inp text-cente" style="text-align:center; width:100%"  name="datakeepterm" value="${userInfo.datakeepterm}" required>
                                                <select class="select small" name="datakeepunit" value=${userInfo.datakeepunit}>
                                                    <option>일</option>
                                                    <option>월</option>
                                                    <option>년</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colspan="3">회원접속도메인</th>
                                        <td colspan="2" id=hostname class="text-center">${userInfo.hostname}</td>>
                                    </tr>
                                    <tr>
                                           <input type="hidden" name="preservicevolume" value="${userInfo.preservicevolume}">
                                           <input type="hidden" name="preaddvolume" value="${userInfo.preaddvolume}">
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="bottom-btns">
                                <button class="btn" id="userInfoSave">저장</button>
                            </div>
                        </div>
                        <div class="col4" style="width: 25%; color:#8B0000;">
                            <div class="table-type2">
                                <table id="tbuser3">
                                    <colgroup>
                                        <col style="width:100px">
                                        <col style="width:50px">
                                        <col style="width:100px">
                                        <col style="width:100px">
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th rowspan="7">등록장비</th>
                                        <th rowspan="2" style="color:#8B0000;font: 15px">전체</th>
                                        <td rowspan="2"  style="color:#8B0000;font: 15px" id=totalvolume>${userInfo.totalvolume}</td>
                                        <th style="color:#8B0000;font: 15px">사용율</th>
                                    </tr>
                                    <tr>
                                        <td rowspan="6" id=userate class="text-center" style="color:#8B0000;font: 15px">${userInfo.userate}</td>
                                    </tr>
                                    <tr>
                                        <th>NMS</th>
                                        <td id=networkvolume class="text-center">${userInfo.networkvolume}</td>
                                    </tr>
                                    <tr>
                                        <th>SMS</th>
                                        <td id=servervolume class="text-center">${userInfo.servervolume}</td>
                                    </tr>
                                    <tr>
                                        <th>AP</th>
                                        <td id=apvolume class="text-center">${userInfo.apvolume}</td>
                                    </tr>
                                    <tr>
                                        <th>DBMS</th>
                                        <td id=dbmsvolume class="text-center">${userInfo.dbmsvolume}</td>
                                    </tr>
                                    <tr>
                                        <th>FMS</th>
                                        <td id=fmsvolume class="text-center">${userInfo.fmsvolume}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- // 과금정보 -->
            <div class="cont" style="display: none;">
                <div class="table-type1 center">
                    <table>
                        <thead>
                        <tr>
                            <th rowspan="2">사용 월</th>
                            <th rowspan="2">등급</th>
                            <th rowspan="2">전체가용장비</th>
                            <th colspan="2">기본라이센스</th>
                            <th colspan="2">추가라이센스</th>
                            <th rowspan="2">서비스장비</th>
                            <th rowspan="2">데이터보관기간</th>
                            <th rowspan="2" style="color:#8B0000;font: 17px">전체</th>
                            <th rowspan="2" style="color:#8B0000;font: 17px">네트워크</th>
                            <th rowspan="2" style="color:#8B0000;font: 17px">서버</th>
                            <th rowspan="2" style="color:#8B0000;font: 17px">AP</th>
                            <th rowspan="2" style="color:#8B0000;font: 17px">데이터베이스</th>
                            <th rowspan="2" style="color:#8B0000;font: 17px">환경센서</th>
                            <th rowspan="2" style="color:#8B0000;font: 17px">사용금액</th>
                            <th rowspan="2" style="color:#8B0000;font: 17px">사용율</th>
                            <th rowspan="2">비고</th>
                        </tr>
                        <tr>
                            <th>장비</th>
                            <th>요금</th>
                            <th>장비</th>
                            <th>요금</th>
                        </tr>
                        </thead>
                        <tbody id="chargeinfo">
                        <c:choose>
                            <c:when test="${fn:length(chargeInfo) > 0}">
                                <c:forEach items="${chargeInfo}" var="charge">
                                    <tr>
                                        <td id=c_useyym class="text-center">${charge.struseyym}</td>
                                        <td id=c_licensegrade class="text-center">
                                            <c:if test="${charge.licensegrade eq '1'}">Free</c:if>
                                            <c:if test="${charge.licensegrade eq '2'}">Basic</c:if>
                                            <c:if test="${charge.licensegrade eq '3'}">Pro</c:if>
                                            <c:if test="${charge.licensegrade eq '4'}">Ent</c:if>
                                        </td>
                                        <td id=c_totalsoluble class="text-center">${charge.totalsoluble}</td>
                                        <td id=c_basevolume class="text-center">${charge.basevolume}</td>
                                        <td id=c_basecharge class="text-center">${charge.format_basecharge}</td>
                                        <td id=c_addvolume class="text-center">${charge.addvolume}</td>
                                        <td id=c_addcharge class="text-center">${charge.format_addcharge}</td>
                                        <td id=c_servicevolume class="text-center">${charge.servicevolume}</td>
                                        <td id=c_datakeepnm class="text-center">${charge.datakeepnm}</td>
                                        <td id=c_totalvolume class="text-center" style="color:#8B0000;font: 17px">${charge.totalvolume}</td>
                                        <td id=c_networkvolume class="text-center" style="color:#8B0000;font: 17px">${charge.networkvolume}</td>
                                        <td id=c_servervolume class="text-center" style="color:#8B0000;font: 17px">${charge.servervolume}</td>
                                        <td id=c_apvolume class="text-center" style="color:#8B0000;font: 17px">${charge.apvolume}</td>
                                        <td id=c_dbmsvolume class="text-center" style="color:#8B0000;font: 17px">${charge.dbmsvolume}</td>
                                        <td id=c_fmsvolume class="text-center" style="color:#8B0000;font: 17px">${charge.fmsvolume}</td>
                                        <td id=c_totalcharge class="text-center" style="color:#8B0000;font: 17px">${charge.format_totalcharge}</td>
                                        <td id=c_userate class="text-center" style="color:#8B0000;font: 17px">${charge.userate}</td>
                                        <td class="text-center"></td>
                                    </tr>
                                </c:forEach>
                            </c:when>
                        </c:choose>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- //세금계산서 발행정보 -->
            <div class="cont" style="display: none;">
                <div class="table-type1 center">
                    <table>
                        <thead>
                        <tr>
                            <th>연번</th>
                            <th>사업장명</th>
                            <th>대표자명</th>
                            <th>사업자등록번호</th>
                            <th>주소</th>
                            <th>업태</th>
                            <th>업종</th>
                            <th>발행일자</th>
                            <th>발행금액</th>
                            <th>결제방법</th>
                            <th>결제일자</th>
                            <th>카드고객 uid</th>
                            <th>카드결제 결과</th>
                            <th>체납여부</th>
                            <th>비고</th>
                        </tr>
                        </thead>
                        <tbody id="taxinfo">
                        <c:choose>
                            <c:when test="${fn:length(taxInfo) > 0}">
                                <c:forEach items="${taxInfo}" var="tax">
                                    <tr>
                                        <td id=t_rownum class="text-center">${tax.rownum}</td>
                                        <td id=t_representationname class="text-center">${tax.businessname}</td>
                                        <td id=t_representationname class="text-center">${tax.representationname}</td>
                                        <td id=t_strbusinessnumber class="text-center">${tax.strbusinessnumber}</td>
                                        <td id=t_zipaddress class="text-left">${tax.zipaddress}</td>
                                        <td id=t_businesskind class="text-center">${tax.businesskind}</td>
                                        <td id=t_businesscondition class="text-center">${tax.businesscondition}</td>
                                        <td id=t_strissuedate class="text-center" style="color:#8B0000;font: 17px">${tax.strissuedate}</td>
                                        <td id=t_issueamount class="text-center" style="color:#8B0000;font: 17px">${tax.format_issueamount}</td>
                                        <td id=t_settlementmeans class="text-center" style="color:#8B0000;font: 17px">${tax.settlementmeans}</td>
                                        <td id=t_strsettlementdt class="text-center" style="color:#8B0000;font: 17px"><input type="text" maxlength="8"  value=${tax.strsettlementdt}</td>
                                        <td id=t_customer_uid class="text-center" style="color:#8B0000;font: 17px">${tax.customer_uid}</td>
                                        <td id=t_imp_uid class="text-center" style="color:#8B0000;font: 17px">${tax.imp_uid}</td>
                                        <td id=t_arrearsyn class="text-center" style="color:#8B0000;font: 17px">${tax.arrearsyn}</td>
                                        <td class="text-center"></td>
                                    </tr>
                                </c:forEach>
                            </c:when>
                        </c:choose>
                        </tbody>
                    </table>
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

<script language="javascript">
    //10,20,30개씩 selectBox 클릭 이벤트
    function changeSelectBox(currentPage, cntPerPage, pageSize){
        var selectValue = $("#cntSelectBox").children("option:selected").val();
        movePage(currentPage, selectValue, pageSize);

    }

    //페이지 이동
    function movePage(currentPage, cntPerPage, pageSize){

        var url = "${pageContext.request.contextPath}/charge/memberinfo";
        url = url + "?currentPage="+currentPage;
        url = url + "&cntPerPage="+cntPerPage;
        url = url + "&pageSize="+pageSize;

        location.href=url;
    }

    //수정자료저장
    $("#userInfoSave").on("click", function (e) {
        var url = "${pageContext.request.contextPath}/charge/userInfoSave";
        const params = {
            "email": '${userInfo.email}',
            "addvolume": $('input[name=addvolume]').val(),
            "servicevolume": $('input[name=servicevolume]').val(),
            "addcharge": $('input[name=addcharge]').val(),
            "datakeepterm": $('input[name=datakeepterm]').val(),
            "datakeepunit": $('select[name=datakeepunit]').val(),
            "hostname": '${userInfo.hostname}',
            "datakeepterm": $('input[name=preservicevolume]').val(),
            "datakeepterm": $('input[name=preaddvolume]').val()
        };

        $.ajax({
            type: 'post',
            url: url,
            async : true, // 비동기화 동작 여부
            data: JSON.stringify(params),
            contentType: "application/json",
            success: function(data) {
                alert("정상적으로 자료가 수정 되었습니다.");
            },
            error: function(err){
                alert("자료 수정에 실패했습니다.");
            }
        })
    })

    function changeColor(){
        $('memberinfo-table tr').mouseover(function(){
            $(this).addClass('changeColor');
            console.log(".................");
        }).mouseout(function() {
            $(this).removeClass('changeColor');
            console.log("................2");
        });
    }

  function ready() {
    alert('DOM이 준비되었습니다!');

    // 이미지가 로드되지 않은 상태이기 때문에 사이즈는 0x0입니다.
    alert(`이미지 사이즈: ${img.offsetWidth}x${img.offsetHeight}`);
  }

    $(document).ready(function() {

        changeColor();
        $('#memberinfo-table tr:eq(1)').addClass('active');
//alert("..."+JSON.stringify($('#memberinfo-table tr:eq(1)')));
//alert("..."+$('#memberinfo-table tr:first').child(0));
//        $('#memberinfo-table').on('load', function () {
//        alert("load -->");
//            $('#memberinfo-table tr:first').addClass('active');
//        })

        $('#memberinfo-table tr').on('dblclick', function () {
            // console.log('1');
            var tdArr = new Array();	// 배열 선언
            $('#memberinfo-table tr').removeClass('active'); // 전체 remove 후
            $(this).addClass('active');
            // 현재 클릭된 Row(<tr>)
            var tr = $(this);
            var td = tr.children();
            //console.log("클릭한 Row의 모든 데이터 : "+tr.text()+"........................."+td.text());
            td.each(function(i){
                tdArr.push(td.eq(i).text());
            });
            // console.log("배열에 담긴 값 : "+tdArr);
            // console.log("배열에 담긴 값 : "+td.eq(1).text());

//            var url = '${pageContext.request.contextPath}/charge/@{td.eq(1).text()}';
            var url = '${pageContext.request.contextPath}/charge/'+td.eq(1).text();
            $.ajax({
                type: 'get',
                url: url,
                async : true, // 비동기화 동작 여부
                data:{'email':td.eq(1).text()},
                //datatype:'json',
                success: function(data) {
                    let jsonmap = new Array(data.length);
                    for(var i=0;i<data.length;i++) {
                        var map = data[i];
                        if (i == 0) {
                            jsonmap[i] = JSON.stringify(map);//.replace('{"userInfo":', '').replace('}}', '}');
                        } else if (i == 1) {
                            jsonmap[i] = JSON.stringify(map); //.replace('{"chargeInfo":', '').replace('}]}', '}]');
                        } else {
                            jsonmap[i] = JSON.stringify(map); //.replace('{"taxInfo":', '').replace('}]}', '}]');
                        }
                        // console.log("map1.  --> " + i + "..." + jsonmap[i]);
                        // console.log("map2   --> " + i + "..." + JSON.parse(jsonmap[i]));
                        // console.log("map2   --> " + i + "..." + JSON.parse(jsonmap[i]).length);
                        jsonmap[i] = JSON.parse(jsonmap[i]);
                    }
                    const list0 = jsonmap[0]['userInfo'];
                    var htmltag = "";
                    var text = document.createTextNode(list0.email);
                    console.log("text-------------------------------", text);
                    $('#email').text(list0.email);


                    <c:if test="${list0.licensegrade eq '1'}">$('#licensegrade').text("Free")</c:if>
                    <c:if test="${list0.licensegrade eq '2'}">$('#licensegrade').text("Basic")</c:if>
                    <c:if test="${list0.licensegrade eq '3'}">$('#licensegrade').text("Pro")</c:if>
                    <c:if test="${list0.licensegrade eq '4'}">$('#licensegrade').text("Ent")</c:if>
                    $('#celltel').text(phoneFormatter(list0.celltel));
                    $('#businessname').text(list0.businessname);
                    $('#businessnumber').text(bizNoFormatter(list0.businessnumber,'2'));
                    $('#joindate').text(dateFormatter(list0.joindate));
                    $('#representationname').text(list0.representationname);
                    $('#zipaddress').text(list0.zipaddress);
                    $('#businesskind').text(list0.businesskind);
                    $('#businesscondition').text(list0.businesscondition);
                    $('#statusnm').text(list0.statusnm);
                    $('#totalsoluble').text(list0.totalsoluble);
                    $('#basevolume').text(list0.basevolume);
                    $('input[name=addvolume]').attr('value',list0.addvolume);
                    $('input[name=servicevolume]').attr('value',list0.servicevolume);
                    $('#totcharge').text(currencyFormatter(list0.totcharge));
                    $('#basecharge').text(currencyFormatter(list0.basecharge));
                    $('input[id=addcharge]').attr('value',currencyFormatter(list0.addcharge));
                    $('input[name=datakeepterm]').attr('value',list0.datakeepterm);
                    $('select[name=datakeepunit]').attr('value',list0.datakeepunit);
                    $('input[name=hostname]').attr('value',list0.hostname);

                    const list1 = jsonmap[1]['chargeInfo'];
                    var data = "";
                    for(var i=0;i<list1.length;i++) {
                        //console.log("map.  --> " + i + "..1." + list1[i].useyym + "..2." + "${list1[i].useyym}");
                        data += "<tr>";

                        data += "<td id=c_useyym class='text-center'>"+list1[i].useyym+"</td>";
                        data += "<td class='text-center'>"+list1[i].licensegrade+"</td>";
                        data += "<td id=c_totalsoluble class='text-center'>"+list1[i].totalsoluble+"</td>";
                        data += "<td id=c_basevolume class='text-center'>"+list1[i].basevolume+"</td>";
                        data += "<td id=c_basecharge class='text-center'>"+list1[i].format_basecharge+"</td>";
                        data += "<td id=c_addvolume class='text-center'>"+list1[i].addvolume+"</td>";
                        data += "<td id=c_addcharge class='text-center'>"+list1[i].format_addcharge+"</td>";
                        data += "<td id=c_servicevolume class='text-center'>"+list1[i].servicevolume+"</td>";
                        data += "<td id=c_datakeepnm class='text-center'>"+list1[i].datakeepnm+"</td>";
                        data += "<td id=c_totalvolume class='text-center'>"+list1[i].totalvolume+"</td>";
                        data += "<td id=c_networkvolume class='text-center'>"+list1[i].networkvolume+"</td>";
                        data += "<td id=c_servervolume class='text-center'>"+list1[i].servervolume+"</td>";
                        data += "<td id=c_apvolume class='text-center'>"+list1[i].apvolume+"</td>";
                        data += "<td id=c_dbmsvolume class='text-center'>"+list1[i].dbmsvolume+"</td>";
                        data += "<td id=c_fmsvolume class='text-center'>"+list1[i].fmsvolume+"</td>";
                        data += "<td id=c_totalcharge class='text-center'>"+list1[i].format_totalcharge+"</td>";
                        data += "<td id=c_userate class='text-center'>"+list1[i].userate+"</td>";
                        data += "<td class='text-center'></td>";
                        data += "</tr>";
                    }
//console.log("data--->"+data);
                    $("#chargeinfo").html(data);
                    var data2 = "";
                    const list2 = jsonmap[2]['taxInfo'];
                    for(var i=0;i<list2.length;i++) {
                    console.log("data--->"+JSON.stringify(list2[i]));
                        data2 += "<tr>";
                        data2 += "<td class='text-center'>"+list2[i].rownum+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].businessname+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].representationname+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].strbusinessnumber+"</td>";
                        data2 += "<td class='text-left'>"+list2[i].zipaddress+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].businesskind+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].businesscondition+"</td>";
                        data2 += "<td class='text-center' style='color:#8B0000;font: 17px'>"+list2[i].strissuedate+"</td>";
                        data2 += "<td class='text-center' style='color:#8B0000;font: 17px'>"+list2[i].format_issueamount+"</td>";
                        data2 += "<td class='text-center' style='color:#8B0000;font: 17px'>"+list2[i].settlementmeans+"</td>";
                        data2 += "<td class='text-center' style='color:#8B0000;font: 17px'>"+dateFormatter(list2[i].settlementdt)+"</td>";
                        data2 += "<td class='text-center' style='color:#8B0000;font: 17px'>"+list2[i].customer_uid+"</td>";
                        data2 += "<td class='text-center' style='color:#8B0000;font: 17px'>"+list2[i].imp_uid+"</td>";
                        data2 += "<td class='text-center' style='color:#8B0000;font: 17px'>"+list2[i].arrearsyn+"</td>";
                        data2 += "<td class='text-center'></td>";
                        data2 += "</tr>";
                    }
                    $("#taxinfo").html(data2);
                },
                error: function(err){

                }
            })

        });
    })

    // double click
    $('#table tbody').on('dblclick', 'tr', function (e) {
        var cellindex =  e.target.cellIndex;
        console.log("cellindex -->"+cellindex);
        // exclude delete/ move cell
        if(cellindex != 5){
            var data = new Array();
            var td = $(this).children();
            td.each(function(i){
                data.push(td.eq(i).text());
            });
            displayPop(this.rowIndex,data,'수정');
        }
    });

    const addvolume = document.querySelector('#addvolume');
    addvolume.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            addvolume.value = 0;
        }else {
            const formatValue = value.toLocaleString('ko-KR');
            addvolume.value = formatValue;
        }
        let volume1 = Number($('#basevolume').text().replaceAll(',', ''));
        let volume2 = Number($('#servicevolume').text().replaceAll(',', ''));
        let totval  = 0;
        if(isEmpty(volume1)){
            volume1 = 0;
        }
        if(isEmpty(volume2)){
            volume2 = 0;
        }
        totval  = parseInt(volume1) + parseInt(volume2) + parseInt(value);
        $('#totalsoluble').text(totval.toLocaleString('ko-KR'));
    });


    const servicevolume = document.querySelector('#servicevolume');
    servicevolume.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            addvolume.value = 0;
        }else {
            const formatValue = value.toLocaleString('ko-KR');
            addvolume.value = formatValue;
        }
        let volume1 = Number($('#basevolume').text().replaceAll(',', ''));
        let volume2 = Number($('#addvolume').text().replaceAll(',', ''));
        let totval  = 0;
        if(isEmpty(volume1)){
            volume1 = 0;
        }
        if(isEmpty(volume2)){
            volume2 = 0;
        }
        totval  = parseInt(volume1) + parseInt(volume2) + parseInt(value);
        $('#totalsoluble').text(totval.toLocaleString('ko-KR'));
    });

    function isEmpty(value){
        if(value.length == 0 || value == null){
            return true;
        }else {
            return false;
        }
    }
    function isNumeric(value){
        var regExp = /^[0-9]+$/g;
        return regExp.test(value)
    }

    // function currencyFormatter(amount){
    //    // amount = amount.replace(/,/g,'');
    //     return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
    // }

    function makeJsonList(obj){
        var resultJson = [];
        var str = obj.split('[{').join('').split('}]').join(''); //양끝 문자열 제거
        var rows = str.split('}, {'); //str는 배열
        for(var i = 0; rows.length > i; i++){ // rows 배열만큼 for돌림
            var cols = rows[i].split(', ');
            var rowData = {};
            for(var j = 0; cols.length > j; j++){
                var colData = cols[j];
                colData = colData.trim();
                var key = colData.substring(0, colData.indexOf("="));
                var val = colData.substring(colData.indexOf("=") +1);
                rowData[key] = val;
            }
            console.log("rowData -->"+rowData);
            resultJson.push(rowData);
        }
        console.log(resultJson);
        return resultJson;
    }

    $(function(){
        $('.tabcontent > div').hide();
        $('.tabnav a').click(function () {
            $('.tabcontent > div').hide().filter(this.hash).fadeIn();
            $('.tabnav a').removeClass('active');
            $(this).addClass('active');
            return false;
        }).filter(':eq(0)').click();
    });
    function updateTextView(_obj){
        var num = getNumber(_obj.val());
        if(num==0){
            _obj.val('');
        }else{
            _obj.val(num.toLocaleString());
        }
    }
    function getNumber(_str){
        var arr = _str.split('');
        var out = new Array();
        for(var cnt=0;cnt<arr.length;cnt++){
            if(isNaN(arr[cnt])==false){
                out.push(arr[cnt]);
            }
        }
        return Number(out.join(''));
    }
    // $(document).ready(function(){
    //     $('ul.tabs li').click(function(){
    //         var tab_id = $(this).attr('data-tab');
    //
    //         $('ul.tabs li').removeClass('current');
    //         $('.tab-content').removeClass('current');
    //
    //         $(this).addClass('current');
    //         $("#"+tab_id).addClass('current');
    //     })
    //
    // })

    const input = document.querySelector('#addcharge');
    input.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input.value = 0;
        }else {
            const formatValue = value.toLocaleString('ko-KR');
            input.value = formatValue;
        }
        let charge1 = Number($('#basecharge').text().replaceAll(',', ''));
        let totval  = 0;
        if(isEmpty(charge1)){
            charge1 = 0;
        }
        totval  = parseInt(charge1) + parseInt(value);
        //alert("totval-->"+totval+"..charge1-->"+charge1+"..value-->"+value);
        $('#totcharge').text(totval.toLocaleString('ko-KR'));
    })

    function transExam(){
console.log("transExam  1 -----------------------------------------");
        const tableRows = document.querySelectorAll(".gold");
console.log("transExam  2 -----------------------------------------");
        for ( var i = 0; i < tableRows.length ; i ++ )
        {
            tableRows[i].textContent =  parseInt(tableRows[i].textContent).toLocaleString() ;
        }

    }

    function getReserveInfo(target) {
        var tbody = target.parentNode;
        var trs = tbody.getElementsByTagName('tr');

        var backColor = "#ffffff";
        var textColor = "black";
        var orgBColor = "#FF2E2E";
        var orgTColor = "#ffffff";

        var no = "";
        var no1 = "";
        $("#data-area tr").removeClass('active');
        $(this).addClass('active');
        //for ( var i = 0; i < trs.length; i++ ) {
       // var element = document.getElementById("data-area");
      //  console.log(trs[i]+".."+target+".."+element);
         //   if ( trs[i] != target ) {
         //      trs[i].removeClass("active");
         //       trs[i].style.backgroundColor = backColor;
         //       trs[i].style.color = textColor;
         //   } else {
        //        trs[i].addClass("active");
                // trs[i].active;
        //        style.backgroundColor = orgBColor;
        //        trs[i].style.color = orgTColor;
         //       var td = trs[i].getElementsByTagName('td');
         //       no = td[0].innerText;
        //        no1 = td[1].innerText;
         //   }
        //}
    }


</script>
<%@include file="../include/footer.jsp" %>