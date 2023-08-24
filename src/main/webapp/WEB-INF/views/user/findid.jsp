<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <div class="form-wrap">
        <h2 class="h2">계정정보 찾기</h2>
        <div class="tabs1">
            <a href="#" class="active">아이디(이메일) 찾기</a>
            <a href="${path}/user/findpw">비밀번호 찾기</a>
        </div>
        <h4 class="h4">이름</h4>
        <div class="inp-area">
            <div class="inp-box"><input type="text" class="inp2" placeholder="이름을 입력해주세요."></div>
        </div>

        <h4 class="h4">등록된 휴대폰 번호</h4>
        <div class="inp-area">
            <div class="inp-box">
                <input type="text" class="inp2" placeholder="">
                <button class="btn">인증번호전송</button>
            </div>
        </div>
        <div class="inp-area">
            <div class="inp-box">
                <span class="time" style="left: 350px;">남은시간 : 4분 59초</span>
                <input type="text" class="inp2" value="12345">
                <button class="btn">인증하기</button>
            </div>
        </div>
        <div class="alert-msg3">인증번호를 받지 못하셧다면 입력하신 이름과 휴대폰 번호가 회원정보와 일치하는지 확인해주세요.</div>

    </div>
</div>

<script>

    $(document).ready(function() {

    });

</script>

<%@include file="../include/footer.jsp" %>