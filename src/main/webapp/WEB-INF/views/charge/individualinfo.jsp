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
                                            <td class="text-center"></td>
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
                                            <td class="text-center">${tax.strbusinessnumber}</td>
                                            <td class="text-center">${tax.zipaddress}</td>
                                            <td class="text-center">${tax.businesskind}</td>
                                            <td class="text-center">${tax.businesscondition}</td>
                                            <td class="text-center">${tax.strissuedate}</td>
                                            <td class="text-center"><fmt:formatNumber type="number" maxIntegerDigits="10" value="${tax.issueamount}" /></td>
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