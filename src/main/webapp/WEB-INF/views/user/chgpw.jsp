<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <div class="form-wrap">
        <h2 class="h2">회원정보</h2>
        <div class="tabs1">
            <a href="${path}/user/info">회원정보</a>
            <a href="#" class="active">비밀번호 변경</a>
            <a href="${path}/user/withdrawal">회원탈퇴</a>
        </div>
        <div class="inp-area">
            <div class="label">현재 비밀번호</div>
            <div class="inp-box"><input type="password" class="inp2" placeholder=""></div>
        </div>

        <div class="inp-area">
            <div class="label">변경 비밀번호</div>
            <div class="inp-box"><input type="password" class="inp2" placeholder=""></div>
        </div>
        <div class="alert-msg">반드시 영문과 숫자, 특수문자를 혼합하여 9~16자 입력해주시기 바랍니다.<br>(허용 특수문자 : !@#$%^+=-)</div>

        <div class="inp-area">
            <div class="label">변경 비밀번호 확인</div>
            <div class="inp-box"><input type="password" class="inp2" placeholder=""></div>
        </div>

        <button class="btn large block">비밀번호 변경</button>
    </div>
</div>

<script>


</script>

<%@include file="../include/footer.jsp" %>