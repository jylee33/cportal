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
    <div class="tabs-box">
        <div class="tabs">
            <a href="${path}/license/licensemanage" >라이선스 정책 관리</a>
            <a href="javascript:void(0)" onClick="javascript:aidcodeinfo()">라이선스 제공 기능</a>
            <a href="#" class="active">Credit 제공</a>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button class="btn btn3">행추가</button>
        <button class="btn">저장</button>
    </div>

    <div class="table-type1 text-center cursor">
        <table>

            <thead>
            <tr>
                <th>Code</th>
                <th>Credit  구분</th>
                <th>Credit  적용</th>
                <th>시작일자</th>
                <th>종료일자</th>
                <th>사용여부</th>
            </tr>
            </thead>
            <tbody>
            <c:choose>
                <c:when test="${fn:length(credit) > 0}">
                    <c:forEach items="${credit}" var="list">
                        <tr>
                            <td class="text-center">${list.commoncode}</td>
                            <td class="text-center">${list.codename}</td>
                            <td class="text-center">${list.applyvolume}</td>
                            <td class="text-center">${list.strstdate}</td>
                            <td class="text-center">${list.streddate}</td>
                            <td class="text-center">${list.useyn}</td>
                        </tr>
                    </c:forEach>
                </c:when>
            </c:choose>
            </tbody>
        </table>
    </div>

</div>

</div>
<!-- // wrap -->



<script>
    // 팝업 함수 호출
    function aidcodeinfo(){
        let f = document.createElement('form');
        f.setAttribute('method', 'post');
        f.setAttribute('action', '${path}/license/aidcodeinfo');
        document.body.appendChild(f);
        f.submit();
    }
</script>
<%@include file="../include/footer.jsp" %>