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
                        <td id=email class="text-center">${userInfo.email}</td>
                    </tr>
                    <tr>
                        <th colspan="3">사용자명</th>
                        <td id=membername cclass="text-center">${userInfo.membername}</td>
                    </tr>
                    <tr>
                        <th colspan="3">라이센스등급</th>
                        <td id=licensegrade class="text-center">
                            <c:if test="${userInfo.licensegrade eq '1'}">Free</c:if>
                            <c:if test="${userInfo.licensegrade eq '2'}">Basic</c:if>
                            <c:if test="${userInfo.licensegrade eq '3'}">Pro</c:if>
                            <c:if test="${userInfo.licensegrade eq '4'}">Ent</c:if>
                        </td>
                    </tr>
                    <tr>
                        <th colspan="3">전화번호</th>
                        <td id=celltel class="text-center">${userInfo.celltel}</td>
                    </tr>
                    <tr>
                        <th colspan="3">사업장명</th>
                        <td id=businessname class="text-center">${userInfo.businessname}</td>
                    </tr>
                    <tr>
                        <th colspan="3">사업자등록번호</th>
                        <td id=businessnumber class="text-center">${userInfo.businessnumber}</td>
                    </tr>
                    <tr>
                        <th colspan="3">가입일자</th>
                        <td id=joindate class="text-center">${userInfo.joindate}</td>
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
                        <td id=addvolume class="text-center">${userInfo.servicevolume}</td>
                    </tr>
                    <tr>
                        <th rowspan="3">요금</th>
                        <th>합계</th>
                        <td id=totcharge class="text-center">${userInfo.totcharge}</td>
                    </tr>
                    <tr>
                        <th>기본</th>
                        <td id=totcharge class="text-center">${userInfo.basecharge}</td>
                    </tr>
                    <tr>
                        <th>추가</th>
                        <td id=totcharge class="text-center">${userInfo.addcharge}</td>
                    </tr>
                    <tr>
                        <th rowspan="7">등록장비</th>
                        <th colspan="2">전체</th>
                        <td id=totalvolume class="text-center">${userInfo.totalvolume}</td>
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

                    </tbody>
                </table>
            </div>
        </div>
        <div class="col9">
            <div class="tabs">
                <a href="#" class="active">과금안내내역(3)</a>
                <a href="#">세금계산서 발행내역(3)</a>
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
                                <th rowspan="2">전체</th>
                                <th rowspan="2">네트워크</th>
                                <th rowspan="2">서버</th>
                                <th rowspan="2">AP</th>
                                <th rowspan="2">데이터베이스</th>
                                <th rowspan="2">환경센서</th>
                                <th rowspan="2">사용금액</th>
                                <th rowspan="2">사용율</th>
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
                                            <td id=c_useyym class="text-center">${charge.useyym}</td>
                                            <td id=c_licensegrade class="text-center">
                                                <c:if test="${charge.licensegrade eq '1'}">Free</c:if>
                                                <c:if test="${charge.licensegrade eq '2'}">Basic</c:if>
                                                <c:if test="${charge.licensegrade eq '3'}">Pro</c:if>
                                                <c:if test="${charge.licensegrade eq '4'}">Ent</c:if>
                                            </td>
                                            <td id=c_servicevolume class="text-center">${charge.servicevolume}</td>
                                            <td id=c_basevolume class="text-center">${charge.basevolume}</td>
                                            <td id=c_basecharge class="text-center">${charge.basecharge}</td>
                                            <td id=c_addvolume class="text-center">${charge.addvolume}</td>
                                            <td id=c_addcharge class="text-center">${charge.addcharge}</td>
                                            <td id=c_datakeepnm class="text-center">${charge.datakeepnm}</td>
                                            <td id=c_totalvolume class="text-center">${charge.totalvolume}</td>
                                            <td id=c_networkvolume class="text-center">${charge.networkvolume}</td>
                                            <td id=c_servervolume class="text-center">${charge.servervolume}</td>
                                            <td id=c_apvolume class="text-center">${charge.apvolume}</td>
                                            <td id=c_dbmsvolume class="text-center">${charge.dbmsvolume}</td>
                                            <td id=c_fmsvolume class="text-center">${charge.fmsvolume}</td>
                                            <td id=c_totalcharge class="text-center">${charge.totalcharge}</td>
                                            <td id=c_userate class="text-center">${charge.userate}</td>
                                            <td class="text-center"></td>
                                        </tr>
                                    </c:forEach>
                                </c:when>
                            </c:choose>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagenate">
                        <a href="#" class="prev"><i class="xi-angle-left-thin"></i></a>
                        <a href="#" class="active">1</a>
                        <a href="#">2</a>
                        <a href="#">3</a>
                        <a href="#">4</a>
                        <a href="#">5</a>
                        <a href="#" class="next"><i class="xi-angle-right-thin"></i></a>
                    </div>
                </div>
                <!-- // 금안내내역 -->
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
                                <th>비고</th>
                            </tr>
                            </thead>
                            <tbody id="taxinfo">
                            <c:choose>
                                <c:when test="${fn:length(taxInfo) > 0}">
                                    <c:forEach items="${taxInfo}" var="tax">
                                        <tr>
                                            <td class="text-center">${tax.rownum}</td>
                                            <td class="text-center">${tax.representationname}</td>
                                            <td class="text-center">${tax.businessnumber}</td>
                                            <td class="text-center">${tax.zipaddress}</td>
                                            <td class="text-center">${tax.businesskind}</td>
                                            <td class="text-center">${tax.businesscondition}</td>
                                            <td class="text-center">${tax.issuedate}</td>
                                            <td class="text-center">${tax.issueamount}</td>
                                            <td class="text-center">N</td>
                                            <td class="text-center"></td>
                                        </tr>
                                    </c:forEach>
                                </c:when>
                            </c:choose>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagenate">
                        <a href="#" class="prev"><i class="xi-angle-left-thin"></i></a>
                        <a href="#" class="active">1</a>
                        <a href="#">2</a>
                        <a href="#">3</a>
                        <a href="#">4</a>
                        <a href="#">5</a>
                        <a href="#" class="next"><i class="xi-angle-right-thin"></i></a>
                    </div>
                </div>
                <!-- // 세금계산서 발행내역 -->
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

<script>

</script>
<%@include file="../include/footer.jsp" %>