<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <form class="form-wrap" id='loginForm' action="loginPost" method="post">
        <h2 class="h2">로그인</h2>
        <div class="tabs1">
            <a href="#" class="active">로그인</a>
            <a href="${path}/member/insertMember">회원가입</a>
        </div>
        <h4 class="h4">아이디</h4>
        <div class="inp-area">
            <div class="inp-box"><input type="text" name="uid" class="inp2" placeholder="아이디(이메일)을 입력해주세요"></div>
        </div>
        <div class="alert-msg2">잘못된 이메일 형식입니다.</div>

        <h4 class="h4">비밀번호</h4>
        <div class="inp-area">
            <div class="inp-box"><input type="password" name="upw" class="inp2" placeholder="비밀번로를 입력해주세요"></div>
        </div>

        <div class="mt20 mb30">
            <label><input type="checkbox" class="checkbox" name="useCookie"><div><em></em><span>아이디 저장</span></div></label>
        </div>


        <button class="btn large block" id="login">로그인</button>
        <div class="member-find-btns">
            <a href="#">아이디 찾기</a>
            <a href="#">비밀번호 찾기</a>
        </div>
    </form>
</div>

<script>

    $(document).ready(function() {
        if ('${login.email}' != "") {
            self.location = "${path}/";
        }

    });

    $("#login").on("click",function(e){

        $("#loginForm").submit();

    });
<%--    <%--%>
<%--    Member login = (Member) session.getAttribute("login");--%>
<%--    %>--%>





</script>

<%@include file="../include/footer.jsp" %>