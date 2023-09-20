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
                    <th>등록 장비</th>
                    <th>사용율</th>
                    <th>사용금액</th>
                    <th>미납금액</th>
                    <th>미납횟수</th>
                    <th>상태</th>
                    <th>변동일자</th>
                    <th>비고</th>
                </tr>
                </thead>
                <tbody onload='transExam();'>
                <c:choose>
                    <c:when test="${fn:length(list) > 0}">
                        <c:forEach items="${list}" var="list">
                            <tr id="data-area">
                                <td class="text-center">${list.membername}</td>
                                <td class="text-center">${list.email}</td>
                                <td class="text-center">
                                    <c:if test="${list.licensegrade eq '1'}">Free</c:if>
                                    <c:if test="${list.licensegrade eq '2'}">Basic</c:if>
                                    <c:if test="${list.licensegrade eq '3'}">Pro</c:if>
                                    <c:if test="${list.licensegrade eq '4'}">Ent</c:if>
                                </td>
                                <td class="text-center">${list.celltel}</td>
                                <td class="text-center">${list.businessname}</td>
                                <td class="text-center">${list.strbusinessnumber}</td>
                                <td class="text-center">${list.strjoindate}</td>
                                <td class="text-center">${list.zipaddress}</td>
                                <td class="text-center">${list.totalsoluble}</td>
                                <td class="text-center">${list.totalvolume}</td>
                                <td class="text-center">${list.userate}</td>
                                <td class="text-center"><fmt:setLocale value="ko_KR"/><fmt:formatNumber type="currency" value="${list.totalcharge}" /></td>
                                <td class="text-center">0</td>
                                <td class="text-center">0</td>
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
                                                celltel.innerHTML=phoneFormatter("${userInfo.celltel}");
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
                                                businessnumber.innerHTML=bizNoFormatter("${userInfo.businessnumber}",'2');
                                            </script>
                                        </tr>
                                        <tr>
                                            <th>가입일자</th>
                                            <td id=joindate class="text-left">${userInfo.strjoindate}</td>
                                            <script type="text/javascript">
                                                joindate.innerHTML=dateFormatter("${userInfo.strjoindate}");
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
                                        <col style="width:150px">
                                        <col style="width:100px">
                                        <col style="width:100px">
                                        <col style="width:30px">
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
                                            <td colspan="2" class="text-center" id="addvolume">
                                                <input type="number" class="inp" style="text-align:center; width:100%" value=${userInfo.addvolume} name="addvolume" maxlength="8" required>
                                            </td>
                                            <script type="text/javascript">
                                                var value1 = $('#addvolume').text();
                                                var money2 = value1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                $('#addvolume').text(money2);
                                            </script>
                                        </tr>
                                        <tr>
                                            <th>서비스</th>
                                            <td colspan="2" class="text-center" id=servicevolume>
                                                <input type="number" class="inp" style="text-align:center; width:100%" value=${userInfo.servicevolume} name="servicevolume" maxlength="8" required>
                                            </td>
                                            <script type="text/javascript">
                                                var value1 = $('#servicevolume').text();
                                                var money2 = value1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                $('#servicevolume').text(money2);
                                            </script>
                                        </tr>
                                        <tr>
                                            <th rowspan="3">요금</th>
                                            <th>합계</th>
                                            <td colspan="2"><div id=totcharge class="text-center">${userInfo.totcharge}</div></td>
                                            <script type="text/javascript">
                                                totcharge.innerHTML=currencyFormatter("${userInfo.totcharge}");
                                            </script>
                                        </tr>
                                        <tr>
                                            <th>기본</th>
                                            <td colspan="2" id=basecharge class="text-center">${userInfo.basecharge}</td>
                                            <script type="text/javascript">
                                                var value1 = '<td colspan="2" id=basecharge class="text-center">'+currencyFormatter("${userInfo.basecharge}")+'</td>';
                                                basecharge.innerHTML=value1;
                                            </script>
                                        </tr>
                                        <tr>
                                            <th>추가</th>
                                            <td colspan="2" id=addcharge class="text-center">
                                                <input type="number" class="inp small" style="text-align:center;width:100%" value=${userInfo.addcharge} name="addcharge">
                                            </td>
                                            <script type="text/javascript">
                                                var value1 = $('#addcharge').text();
                                                var money2 = value1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                $('#addcharge').text(money2);
                                            </script>

                                        </tr>
                                        <tr>
                                            <th colspan="2">데이터 보관기간</th>
                                            <td>
                                                <div class="flex gap10">
                                                    <input type="number" class="inp text-cente" style="text-align:center; width:100%" value=${userInfo.datakeepterm} id="datakeepterm" required>
                                                    <select class="select small" value=${userInfo.datakeepunit} id="datakeepunit">
                                                        <option>일</option>
                                                        <option>월</option>
                                                        <option>년</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th colspan="3">회원접속도메인</th>
                                            <td colspan="2" id=serverdomainname class="text-left">
                                                <input type="text" class="inp small" style="text-align:center; width:100%" value=${userInfo.serverdomainname}>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="bottom-btns">
                                <button class="btn" id="userInfoSave">저장</button>
<%--                                <button userInfoSave class="btn">저장</button>--%>
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
                                        <td id=c_totalsoluble class="text-center">${charge.totalsoluble}</td>
                                        <td id=c_basevolume class="text-center">${charge.basevolume}</td>
                                        <td id=c_basecharge class="text-center"><fmt:setLocale value="ko_KR"/><fmt:formatNumber type="currency" value="${charge.basecharge}" /></td>
                                        <td id=c_addvolume class="text-center">${charge.addvolume}</td>
                                        <td id=c_addcharge class="text-center"><fmt:setLocale value="ko_KR"/><fmt:formatNumber type="currency" value="${charge.addcharge}" /></td>
                                        <td id=c_servicevolume class="text-center">${charge.servicevolume}</td>
                                        <td id=c_datakeepnm class="text-center">${charge.datakeepnm}</td>
                                        <td id=c_totalvolume class="text-center">${charge.totalvolume}</td>
                                        <td id=c_networkvolume class="text-center">${charge.networkvolume}</td>
                                        <td id=c_servervolume class="text-center">${charge.servervolume}</td>
                                        <td id=c_apvolume class="text-center">${charge.apvolume}</td>
                                        <td id=c_dbmsvolume class="text-center">${charge.dbmsvolume}</td>
                                        <td id=c_fmsvolume class="text-center">${charge.fmsvolume}</td>
                                        <td id=c_totalcharge class="text-center"><fmt:setLocale value="ko_KR"/><fmt:formatNumber type="currency" value="${charge.totalcharge}" /></td>
                                        <td id=c_userate class="text-center">${charge.userate}</td>
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
                            <th>대표자명</th>
                            <th>사업자등록번호</th>
                            <th>주소</th>
                            <th>업태</th>
                            <th>업종</th>
                            <th>발행일자</th>
                            <th>발행금액</th>
                            <th>입금일자</th>
                            <th>체납여부</th>
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
                                        <td class="text-center"><fmt:setLocale value="ko_KR"/><fmt:formatNumber type="currency" value="${tax.issueamount}" /></td>
                                        <td class="text-center">N</td>
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
            "basecharge": $('input[id=basecharge]').val(),
            "addcharge": $('input[name=addcharge]').val(),
            "datakeepterm": $('input[id=datakeepterm]').val(),
            "datakeepunit": $('select[id=datakeepunit]').val(),
            "serverdomainname": $('input[id=serverdomainname]').val()
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

    // $(document).ready(function(){
    //     changeColor();
    // })


    function changeColor(){
        $('memberinfo-table tr').mouseover(function(){
            $(this).addClass('changeColor');
            console.log(".................");
        }).mouseout(function() {
            $(this).removeClass('changeColor');
            console.log("................2");
        });
    }

    $(document).ready(function() {

        changeColor();

        // $('input[type=text]').on('keyup',function(){
        //     updateTextView($(this));
        // });


        $('#memberinfo-table tr').on('dblclick', function () {
            console.log('1');
            var tdArr = new Array();	// 배열 선언

            // 현재 클릭된 Row(<tr>)
            var tr = $(this);
            var td = tr.children();
            console.log("클릭한 Row의 모든 데이터 : "+tr.text()+"........................."+td.text());
            td.each(function(i){
                tdArr.push(td.eq(i).text());
            });
            console.log("배열에 담긴 값 : "+tdArr);
            console.log("배열에 담긴 값 : "+td.eq(1).text());

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
                    document.getElementById('email').innerHTML=list0.email;
                    document.getElementById('membername').innerHTML=list0.membername;
                    document.getElementById('licensegrade').innerHTML=list0.licensegrade;
                    document.getElementById('celltel').innerHTML=list0.celltel;
                    document.getElementById('businessname').innerHTML=list0.businessname;
                    document.getElementById('businessnumber').innerHTML=list0.businessnumber;
                    document.getElementById('joindate').innerHTML=list0.joindate;
                    document.getElementById('representationname').innerHTML=list0.representationname;
                    document.getElementById('zipaddress').innerHTML=list0.zipaddress;
                    document.getElementById('businesskind').innerHTML=list0.businesskind;
                    document.getElementById('businesscondition').innerHTML=list0.businesscondition;
                    document.getElementById('statusnm').innerHTML=list0.statusnm;
                    document.getElementById('totalsoluble').innerHTML=list0.totalsoluble;
                    document.getElementById('basevolume').innerHTML=list0.basevolume;
                    document.getElementById('addvolume').innerHTML=list0.addvolume;
                    document.getElementById('servicevolume').innerHTML=list0.servicevolume;
                    document.getElementById('totcharge').innerHTML=currencyFormatter(list0.totcharge);
                    document.getElementById('basecharge').innerHTML=currencyFormatter(list0.basecharge);
                    document.getElementById('addcharge').innerHTML=currencyFormatter(list0.addcharge);
                    document.getElementById('datakeepterm').innerHTML=list0.datakeepterm;
                    document.getElementById('datakeepunit').innerHTML=list0.datakeepunit;
                    document.getElementById('serverdomainname').innerHTML=list0.serverdomainname;

                    const list1 = jsonmap[1]['chargeInfo'];
                    var data = "";

                    for(var i=0;i<list1.length;i++) {
                        console.log("map.  --> " + i + "..1." + list1[i].useyym + "..2." + "${list1[i].useyym}");
                        data += "<tr>";

                        data += "<td id=c_useyym class='text-center'>"+list1[i].useyym+"</td>";
                        data += "<td class='text-center'>"+list1[i].licensegrade+"</td>";
                        data += "<td id=c_totalsoluble class='text-center'>"+list1[i].totalsoluble+"</td>";
                        data += "<td id=c_basevolume class='text-center'>"+list1[i].basevolume+"</td>";
                        data += "<td id=c_basecharge class='text-center'>"+list1[i].basecharge+"</td>";
                        data += "<td id=c_addvolume class='text-center'>"+list1[i].addvolume+"</td>";
                        data += "<td id=c_addcharge class='text-center'>"+list1[i].addcharge+"</td>";
                        data += "<td id=c_servicevolume class='text-center'>"+list1[i].servicevolume+"</td>";
                        data += "<td id=c_datakeepnm class='text-center'>"+list1[i].datakeepnm+"</td>";
                        data += "<td id=c_totalvolume class='text-center'>"+list1[i].totalvolume+"</td>";
                        data += "<td id=c_networkvolume class='text-center'>"+list1[i].networkvolume+"</td>";
                        data += "<td id=c_servervolume class='text-center'>"+list1[i].servervolume+"</td>";
                        data += "<td id=c_apvolume class='text-center'>"+list1[i].apvolume+"</td>";
                        data += "<td id=c_dbmsvolume class='text-center'>"+list1[i].dbmsvolume+"</td>";
                        data += "<td id=c_fmsvolume class='text-center'>"+list1[i].fmsvolume+"</td>";
                        data += "<td id=c_totalcharge class='text-center'>"+list1[i].totalcharge+"</td>";
                        data += "<td id=c_userate class='text-center'>"+list1[i].userate+"</td>";
                        data += "<td class='text-center'></td>";
                        data += "</tr>";
                    }
console.log("data--->"+data);
                    $("#chargeinfo").html(data);
                    var data2 = "";
                    const list2 = jsonmap[2]['taxInfo'];
                    for(var i=0;i<list2.length;i++) {
                        data2 += "<tr>";
                        data2 += "<td class='text-center'>"+list2[i].rownum+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].representationname+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].businessnumber+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].zipaddress+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].businesskind+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].businesscondition+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].issuedate+"</td>";
                        data2 += "<td class='text-center'>"+list2[i].issueamount+"</td>";
                        data2 += "<td class='text-center'>N</td>";
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


    $('#addcharge').on('focus', function (){
        var totval = $('#addcharge').val();
        if(!isEmpty(val)){
            totval = totval.replace(/,/g,'');
            $('#addcharge').val(totval);
        }
    });
    $('#addcharge').on('blur', function (){
        var totval = $('#addcharge').val();
        if(!isEmpty(val) && isNumeric(totval)){
            totval = currencyFormatter(totval);
            $('#addcharge').val(totval);
        }
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

    function transExam(){
        const tableRows = document.querySelectorAll(".gold");

        for ( var i = 0; i < tableRows.length ; i ++ )
        {
            tableRows[i].textContent =  parseInt(tableRows[i].textContent).toLocaleString() ;
        }

    }
</script>
<%@include file="../include/footer.jsp" %>