<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>





<div class="table-type1 cursor">
    <table id="memberinfo-table">
        <thead>
        <tr>
            <th>사용자</th>
        </tr>
        </thead>
        <tbody onload='transExam();'>
        <c:choose>
            <c:when test="${fn:length(aidInfo) > 0}">
                <c:forEach items="${aidInfo}" var="list">
                    <tr id="data-area">
                        <td>${list}</td>
                    </tr>
                </c:forEach>
            </c:when>
        </c:choose>
        </tbody>
    </table>
</div>








<html>
<head>
    <title>Title</title>
</head>
<body>
   <script>
       alert(${aidInfo});
   </script>
</body>
</html>
