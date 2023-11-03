<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>

<div class="container">
    <div class="cols">
        <div class="col3">
            <h3 class="h3 h40">사용자 정보 및 과금 안내</h3>
            <div class="table-type2">
                <table>
                    <colgroup>
                        <col style="width:100px">
                        <col style="width:50px">
                        <col style="width:75px">
                        <col style="">
                    </colgroup>
                    <tbody>
                    <tr>
                        <th colspan="3">이메일</th>
                        <td id=email class="text-left">${userInfo.email}</td>
                    </tr>
                    <tr>
                        <th colspan="3">사용자명</th>
                        <td id=membername class="text-left">${userInfo.membername}</td>
                    </tr>
                    <tr>
                        <th colspan="3">라이센스등급</th>
                        <td id=licensegrade class="text-left">
                            <c:if test="${userInfo.licensegrade eq '1'}">Free</c:if>
                            <c:if test="${userInfo.licensegrade eq '2'}">Basic</c:if>
                            <c:if test="${userInfo.licensegrade eq '3'}">Pro</c:if>
                            <c:if test="${userInfo.licensegrade eq '4'}">Ent</c:if>
                        </td>
                    </tr>
                    <tr>
                        <th colspan="3">전화번호</th>
                        <td id=celltel class="text-left">${userInfo.celltel}</td>
                        <script type="text/javascript">
                            $('#celltel').text(phoneFormatter("${userInfo.celltel}"));
                        </script>
                    </tr>
                    <tr>
                        <th colspan="3">사업장명</th>
                        <td id=businessname class="text-left">${userInfo.businessname}</td>
                    </tr>
                    <tr>
                        <th colspan="3">사업자등록번호</th>
                        <td id=businessnumber class="text-left">${userInfo.businessnumber}</td>
                        <script type="text/javascript">
                            $('#businessnumber').text(bizNoFormatter("${userInfo.businessnumber}","2"));
                        </script>
                    </tr>
                    <tr>
                        <th colspan="3">가입일자</th>
                        <td id=joindate class="text-left">${userInfo.joindate}</td>
                        <script type="text/javascript">
                            $('#joindate').text(dateFormatter("${userInfo.strjoindate}"));
                        </script>
                    </tr>
                    <tr>
                        <th rowspan="7">사용라이센스</th>
                        <th rowspan="4">장비</th>
                        <th>전체가용</th>
                        <td id=totalsoluble class="text-center">${userInfo.totalsoluble}</td>
                    </tr>
                    <tr>
                        <th>기본</th>
                        <td id=basevolume class="text-center">${userInfo.basevolume}</td>
                    </tr>
                    <tr>
                        <th>추가</th>
                        <td id=addvolume class="text-center">${userInfo.addvolume}</td>
                    </tr>
                    <tr>
                        <th>서비스</th>
                        <td id=servicevolume class="text-center">${userInfo.servicevolume}</td>
                    </tr>
                    <tr>
                        <th rowspan="3" style="font: 17px">요금</th>
                        <th style="color:#8B0000;font: 17px">합계</th>
                        <td id=totcharge class="text-center" style="color:#8B0000;font: 17px">${userInfo.totcharge}</td>
                        <script type="text/javascript">
                            $('#totcharge').text(currencyFormatter("${userInfo.totcharge}"));
                        </script>
                    </tr>
                    <tr>
                        <th style="font: 17px">기본</th>
                        <td id=basecharge class="text-center" style="font: 17px">${userInfo.basecharge}</td>
                        <script type="text/javascript">
                            $('#basecharge').text(currencyFormatter("${userInfo.basecharge}"));
                        </script>
                    </tr>
                    <tr>
                        <th style="color:#8B0000;font: 17px">추가</th>
                        <td id=addcharge class="text-center" style="color:#8B0000;font: 17px">${userInfo.addcharge}</td>
                        <script type="text/javascript">
                            $('#addcharge').text(currencyFormatter("${userInfo.addcharge}"));
                        </script>
                    </tr>
                    <tr>
                        <th rowspan="7" style="color:#8B0000;font: 17px">등록장비</th>
                        <th colspan="2" style="color:#8B0000;font: 17px">전체</th>
                        <td id=totalvolume class="text-center" style="color:#8B0000;font: 17px">${userInfo.totalvolume}</td>
                    </tr>
                    <tr>
                        <th colspan="2" style="color:#8B0000;font: 17px">네트워크</th>
                        <td id=networkvolume class="text-center" style="color:#8B0000;font: 17px">${userInfo.networkvolume}</td>
                    </tr>
                    <tr>
                        <th colspan="2" style="color:#8B0000;font: 17px">서버</th>
                        <td id=servervolume class="text-center" style="color:#8B0000;font: 17px">${userInfo.servervolume}</td>
                    </tr>
                    <tr>
                        <th colspan="2" style="color:#8B0000;font: 17px">무선네트워크</th>
                        <td id=apvolume class="text-center" style="color:#8B0000;font: 17px">${userInfo.apvolume}</td>
                    </tr>
                    <tr>
                        <th colspan="2" style="color:#8B0000;font: 17px">데이터베이스</th>
                        <td id=dbmsvolume class="text-center" style="color:#8B0000;font: 17px">${userInfo.dbmsvolume}</td>
                    </tr>
                    <tr>
                        <th colspan="2" style="color:#8B0000;font: 17px">환경센스</th>
                        <td id=fmsvolume class="text-center" style="color:#8B0000;font: 17px">${userInfo.fmsvolume}</td>
                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
        <div class="col9">
            <div class="tabs">
                <a href="#" class="active">과금안내내역(<strong>${pagination1.totalRecordCount}</strong> 건)</a>
                <a href="#">세금계산서 발행내역(<strong>${pagination2.totalRecordCount}</strong> 건)</a>
                <a href="#">회원정보변경이력(<strong>${pagination3.totalRecordCount}</strong> 건)</a>
                <a href="#">라이센스변경이력(<strong>${pagination4.totalRecordCount}</strong> 건)</a>
            </div>
            <div class="tab-cont">
                <div class="cont">
                    <div class="table-type1">
                        <table>
                            <thead>
                            <tr>
                                <th rowspan="2">사용 월</th>
                                <th rowspan="2">등급</th>
                                <th rowspan="2">서비스 장비</th>
                                <th colspan="2">기본라이센스</th>
                                <th colspan="2">추가라이센스</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">전체</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">네트워크</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">서버</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">무선네트워크</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">데이터베이스</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">환경센서</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">사용금액</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">사용율</th>
                                <th rowspan="2" style="color:#8B0000;font: 17px">체납내용</th>
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
                                            <td id=c_servicevolume class="text-center">${charge.servicevolume}</td>
                                            <td id=c_basevolume class="text-center">${charge.basevolume}</td>
                                            <td id=c_basecharge class="text-center"><fmt:formatNumber type="number" maxIntegerDigits="10" value="${charge.basecharge}"/></td>
                                            <td id=c_addvolume class="text-center">${charge.addvolume}</td>
                                            <td id=c_addcharge class="text-center"><fmt:formatNumber type="number" maxIntegerDigits="10" value="${charge.addcharge}"/></td>
                                            <td id=c_totalvolume class="text-center" style="color:#8B0000;font: 17px">${charge.totalvolume}</td>
                                            <td id=c_networkvolume class="text-center" style="color:#8B0000;font: 17px">${charge.networkvolume}</td>
                                            <td id=c_servervolume class="text-center" style="color:#8B0000;font: 17px">${charge.servervolume}</td>
                                            <td id=c_apvolume class="text-center" style="color:#8B0000;font: 17px">${charge.apvolume}</td>
                                            <td id=c_dbmsvolume class="text-center" style="color:#8B0000;font: 17px">${charge.dbmsvolume}</td>
                                            <td id=c_fmsvolume class="text-center" style="color:#8B0000;font: 17px"><fmt:formatNumber type="number" maxIntegerDigits="10" value="${charge.fmsvolume}"/></td>
                                            <td id=c_totalcharge class="text-center" style="color:#8B0000;font: 17px"><fmt:formatNumber type="number" maxIntegerDigits="10" value="${charge.totalcharge}"/></td>
                                            <td id=c_userate class="text-center" style="color:#8B0000;font: 17px">${charge.userate}(%)</td>
                                            <td id=c_addvolume class="text-left" style="color:#8B0000;font: 17px">${charge.unpaiddscr}</td>
                                        </tr>
                                    </c:forEach>
                                </c:when>
                            </c:choose>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagenate">
                        <a href="javascript:void(0);" class="prev" onclick="movePage(1,${pagination1.cntPerPage},${pagination1.pageSize});"><i class="xi-angle-left-thin"></i></a>
                        <c:forEach begin="${pagination1.firstPage}"
                                   end="${pagination1.lastPage}" var="idx">
                            <a
                                    style="color:<c:out value="${pagination.currentPage == idx ? 'color: #fff; background: #182743; border-color:#182743; position: relative; z-index:2px;' : ''}"/> "
                                    href="javascript:void(0);"
                                    onclick="movePage(${idx},${pagination1.cntPerPage},${pagination1.pageSize});"><c:out
                                    value="${idx}" /></a>
                        </c:forEach>
                        <a href="javascript:void(0);" class="next"
                           onclick="movePage(${pagination1.currentPage}<c:if test="${pagination1.hasNextPage == true}">+1</c:if>,${pagination1.cntPerPage},${pagination1.pageSize});">
                            <i class="xi-angle-right-thin"></i></a>
                    </div>
                </div>
                <!-- // 세금계산서내역 -->
                    <div class="cont" style="display: none;">
                        <div class="table-type1 center">
                            <table>
                                <thead>
                                <tr>
                                    <th>연번</th>
                                    <th>대표자명</th>
                                    <th>사업자등록번호</th>
                                    <th>주소</th>
                                    <th>업태</th>
                                    <th>업종</th>
                                    <th>발행일자</th>
                                    <th>발행금액</th>
                                    <th>결제방법</th>
                                    <th>결제일자</th>
                                </tr>
                                </thead>
                                <tbody id="taxinfo">
                                <c:choose>
                                    <c:when test="${fn:length(taxInfo) > 0}">
                                        <c:forEach items="${taxInfo}" var="tax">
                                            <tr>
                                                <td class="text-center">${tax.rownum}</td>
                                                <td class="text-center">${tax.representationname}</td>
                                                <td class="text-center">${tax.strbusinessnumber}</td>
                                                <td class="text-center">${tax.zipaddress}</td>
                                                <td class="text-center">${tax.businesskind}</td>
                                                <td class="text-center">${tax.businesscondition}</td>
                                                <td class="text-center">${tax.strissuedate}</td>
                                                <td class="text-center"><fmt:formatNumber type="number" maxIntegerDigits="10" value="${tax.issueamount}" /></td>
                                                <td class="text-center">${tax.settlementmeansnm}</td>
                                                <td class="text-center">${tax.format_settlementdt}</td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                </c:choose>
                                </tbody>
                            </table>
                        </div>
                        <div class="pagenate">
                            <a href="javascript:void(0);" class="prev" onclick="movePage(1,${pagination2.cntPerPage},${pagination2.pageSize});"><i class="xi-angle-left-thin"></i></a>
                            <c:forEach begin="${pagination2.firstPage}"
                                       end="${pagination2.lastPage}" var="idx">
                                <a
                                        style="color:<c:out value="${pagination.currentPage == idx ? 'color: #fff; background: #182743; border-color:#182743; position: relative; z-index:2px;' : ''}"/> "
                                        href="javascript:void(0);"
                                        onclick="movePage(${idx},${pagination2.cntPerPage},${pagination2.pageSize});"><c:out
                                        value="${idx}" /></a>
                            </c:forEach>
                            <a href="javascript:void(0);" class="next"
                               onclick="movePage(${pagination2.currentPage}<c:if test="${pagination2.hasNextPage == true}">+1</c:if>,${pagination2.cntPerPage},${pagination2.pageSize});">
                                <i class="xi-angle-right-thin"></i></a>
                        </div>
                    </div>
                    <!-- // 세금계산서 발행내역 -->

                <!-- // 회원정보변경이력 시작-->
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
                                    <th>회원전화번호</th>
                                    <th>사업장전화번호</th>
                                    <th>결제방법</th>
                                    <th>계산서발행용</br>사업자등록번호</th>
                                    <th>세금계산서</br>발송기관메일</th>
                                    <th>변경내용</th>
                                    <th>변경 일자</th>
                                </tr>
                                </thead>
                                <tbody id="memberhisInfo">
                                <c:choose>
                                    <c:when test="${fn:length(memberhisInfo) > 0}">
                                        <c:forEach items="${memberhisInfo}" var="memberhis">
                                            <tr>
                                                <td id=h0_rownum class="text-center">${memberhis.rownum}</td>
                                                <td id=h0_representationname class="text-center">${memberhis.businessname}</td>
                                                <td id=h0_representationname class="text-center">${memberhis.representationname}</td>
                                                <td id=h0_strbusinessnumber class="text-center">${memberhis.strbusinessnumber}</td>
                                                <td id=h0_zipaddress class="text-left">${memberhis.zipaddress}</td>
                                                <td id=h0_businesskind class="text-center">${memberhis.businesskind}</td>
                                                <td id=h0_businesscondition class="text-center">${memberhis.businesscondition}</td>
                                                <td id=h0_strissuedate class="text-center" style="color:#8B0000;font: 17px">${memberhis.celltel}</td>
                                                <td id=h0_issueamount class="text-center" style="color:#8B0000;font: 17px">${memberhis.companyphone}</td>
                                                <td id=h0_settlementmeans class="text-center" style="color:#8B0000;font: 17px">${memberhis.settlementmeansnm}</td>
                                                <td id=h0_strsettlementdt class="text-center" style="color:#8B0000;font: 17px">${memberhis.taxcompanynumber}</td>
                                                <td id=h0_customer_uid class="text-center" style="color:#8B0000;font: 17px">${memberhis.taxemail}</td>
                                                <td id=h0_imp_uid class="text-center" style="color:#8B0000;font: 17px">${memberhis.modifycontent}</td>
                                                <td id=h0_createdAt class="text-center" style="color:#8B0000;font: 17px">${memberhis.format_createdAt}</td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                </c:choose>
                                </tbody>
                            </table>
                        </div>
                        <div class="pagenate">
                            <a href="javascript:void(0);" class="prev" onclick="movePage(1,${pagination3.cntPerPage},${pagination3.pageSize});"><i class="xi-angle-left-thin"></i></a>
                            <c:forEach begin="${pagination3.firstPage}"
                                       end="${pagination3.lastPage}" var="idx">
                                <a
                                        style="color:<c:out value="${pagination.currentPage == idx ? 'color: #fff; background: #182743; border-color:#182743; position: relative; z-index:2px;' : ''}"/> "
                                        href="javascript:void(0);"
                                        onclick="movePage(${idx},${pagination2.cntPerPage},${pagination2.pageSize});"><c:out
                                        value="${idx}" /></a>
                            </c:forEach>
                            <a href="javascript:void(0);" class="next"
                               onclick="movePage(${pagination3.currentPage}<c:if test="${pagination3.hasNextPage == true}">+1</c:if>,${pagination3.cntPerPage},${pagination3.pageSize});">
                                <i class="xi-angle-right-thin"></i></a>
                        </div>
                    </div>
                    <!-- // 회원정보변경이력 종료 -->

                <!-- // 라이센스변경이력 시작-->
                    <div class="cont" style="display: none;">
                        <div class="table-type1 center">
                            <table>
                                <thead>
                                <tr>
                                    <th>연번</th>
                                    <th>사업장명</th>
                                    <th>대표자명</th>
                                    <th>사업자등록번호</th>
                                    <th>이전전라이센스등급</th>
                                    <th>라이센스등급</th>
                                    <th>데이터보관기간</th>
                                    <th>기본장비수량</th>
                                    <th>기본요금</th>
                                    <th>서비스장비수량</th>
                                    <th>추가장비수량</th>
                                    <th>추가요금</th>
                                    <th>라이센스변경내용</th>
                                    <th>변경일시</th>
                                </tr>
                                </thead>
                                <tbody id="licenseinfo">
                                <c:choose>
                                    <c:when test="${fn:length(licenseinfo) > 0}">
                                        <c:forEach items="${licenseinfo}" var="license">
                                            <tr>
                                                <td id=h1_rownum class="text-center">${license.rownum}</td>
                                                <td id=h1_businessname class="text-center">${license.businessname}</td>
                                                <td id=h1_representationname class="text-center">${license.representationname}</td>
                                                <td id=h1_strbusinessnumber class="text-center">${license.strbusinessnumber}</td>
                                                <td id=h1_prelicensegradenm class="text-center">${license.prelicensegradenm}</td>
                                                <td id=h1_licensegradenm class="text-center">${license.licensegradenm}</td>
                                                <td id=h1_datakeepterm class="text-center">${license.datakeepterm}</td>
                                                <td id=h1_basevolume class="text-center" style="color:#8B0000;font: 17px">${license.basevolume}</td>
                                                <td id=h1_basecharge class="text-center" style="color:#8B0000;font: 17px">${license.format_basecharge}</td>
                                                <td id=h1_servicevolume class="text-center" style="color:#8B0000;font: 17px">${license.servicevolume}</td>
                                                <td id=h1_addvolume class="text-center" style="color:#8B0000;font: 17px">${license.addvolume}</td>
                                                <td id=h1_addcharge class="text-center" style="color:#8B0000;font: 17px">${license.format_addcharge}</td>
                                                <td id=h1_modifycontent class="text-center" style="color:#8B0000;font: 17px">${license.modifycontent}</td>
                                                <td id=h1_createdAt class="text-center" style="color:#8B0000;font: 17px">${license.format_createdAt}</td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                </c:choose>
                                </tbody>
                            </table>
                        </div>
                        <div class="pagenate">
                            <a href="javascript:void(0);" class="prev" onclick="movePage(1,${pagination4.cntPerPage},${pagination4.pageSize});"><i class="xi-angle-left-thin"></i></a>
                            <c:forEach begin="${pagination4.firstPage}"
                                       end="${pagination4.lastPage}" var="idx">
                                <a
                                        style="color:<c:out value="${pagination.currentPage == idx ? 'color: #fff; background: #182743; border-color:#182743; position: relative; z-index:2px;' : ''}"/> "
                                        href="javascript:void(0);"
                                        onclick="movePage(${idx},${pagination4.cntPerPage},${pagination4.pageSize});"><c:out
                                        value="${idx}" /></a>
                            </c:forEach>
                            <a href="javascript:void(0);" class="next"
                               onclick="movePage(${pagination4.currentPage}<c:if test="${pagination4.hasNextPage == true}">+1</c:if>,${pagination4.cntPerPage},${pagination4.pageSize});">
                                <i class="xi-angle-right-thin"></i></a>
                        </div>
                    </div>
                    <!-- // 라이센스변경이력 종료 -->




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


</div>
<!-- // wrap -->

<script language="javascript">
    //10,20,30개씩 selectBox 클릭 이벤트
    function changeSelectBox(currentPage, cntPerPage, pageSize){
        var selectValue = $("#cntSelectBox").children("option:selected").val();
        movePage(currentPage, selectValue, pageSize);

    }

    $(document).ready(function () {
        var formObj = $("form[role='form']");

        // formObj.submit();
    });
    //페이지 이동
    function movePage(currentPage, cntPerPage, pageSize){

        var url = "${pageContext.request.contextPath}/charge/individualinfo";
        url = url + "?currentPage="+currentPage;
        url = url + "&cntPerPage="+cntPerPage;
        url = url + "&pageSize="+pageSize;

        location.href=url;
    }

</script>
<%@include file="../include/footer.jsp" %>