<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="include/header.jsp" %>

<div class="container">
    <div>
        <p>
            <a href="${path}/member/selectMember?email=a@a.a">회원 조회</a>
            <br>
            <a href="${path}/member/listAll">회원 목록 조회</a>
        </p>
    </div>
</div>

</main>

<%@include file="include/footer.jsp" %>