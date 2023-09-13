<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>

<link rel="stylesheet" href="${path}/resources/js/jqwidgets/styles/jqx.base.css" type="text/css" />

<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcore.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxbuttons.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxscrollbar.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxmenu.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.selection.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.columnsresize.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdata.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcombobox.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxradiobutton.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdropdownlist.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxlistbox.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.filter.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.edit.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.sort.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdatetimeinput.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcalendar.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.aggregates.js"></script>
<%--<script type="text/javascript" src="${path}/resources/js/scripts/demos.js"></script>--%>
           
<div class="container">
    <div class="h3-head">
        <h3 class="h3">라이선스 정책 관리</h3>

    </div>
    <div class="tabs-box">
        <div class="tabs">
            <a href="${path}/license/licensemanage" >라이선스 정책 관리</a>
            <a href="#" class="active">라이선스 제공 기능</a>
            <a href="${path}/license/creditinfo">Credit 제공</a>
        </div>
        <div class="right">
            <form autocomplete="on" action="/portal/license/aidcodeinfo" method="get">
                <span class="tit">기능구분 선택</span>
                <select class="select" name="sltcode" id="sltcode">
                    <option value="10">기본기능</option>
                    <option value="20">부가기능</option>
                    <option value="30">고급기능</option>
                </select>
                <button class="btn" type="submit">조회</button>
            </form>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button class="btn btn3">행추가</button>
        <button class="btn">저장</button>
        <button class="btn" id="btn-save1">저장1</button>
    </div>
<%--<tbody id="chargeinfo">--%>
<%--<c:choose>--%>
<%--    <c:when test="${fn:length(aidInfo) > 0}">--%>
<%--        <c:forEach items="${aidInfo}" var="charge">--%>
<%--            <tr>--%>
<%--            <td>${charge}</td>--%>
<%--            </tr>--%>

<%--        </c:forEach>--%>
<%--    </c:when>--%>
<%--</c:choose>--%>
<%--</tbody>--%>
    <div>aidInfo</div>


</div>
<script>

</script>
</body>
</script>
<%@include file="../include/footer.jsp" %>