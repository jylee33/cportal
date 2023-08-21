<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="include/header.jsp" %>

<div class="container">
    <div>
        <p>
            <a href="${path}/member/insertMember">회원 가입</a>
            <br>
            <a href="${path}/member/listAll">회원 목록 조회</a>
            <br>
            <a href="${path}/user/login">로그인</a>
        </p>
    </div>
    <div>
        <label>로그인된 사용자</label>
        <input type="text" name='email' class="form-control" value="${login.email}" disabled>
    </div>
</div>

</main>

<%@include file="include/footer.jsp" %>