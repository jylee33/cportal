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
            <a href="${path}/member/findid" class="active">아이디(이메일) 찾기</a>
            <a href="${path}/member/findpw">비밀번호 찾기</a>
        </div>
        <div class="find-result">
            <div id="noresult" style="display: none;">
                <p>일치하는 회원 정보가 없습니다.</p>
            </div>
            <div id="result">
                <p>회원님의 아이디입니다.</p>
                <div>아이디(이메일) : <strong>${uid}</strong></div>
            </div>
        </div>
        <button class="btn large block" id="login">로그인</button>

    </div>
</div>

<script>

    $(document).ready(function() {
        if ("${uid}" == "") {
            $("#noresult").show();
            $("#result").hide();
        } else {
            $("#noresult").hide();
            $("#result").show();
        }

        $("#login").on("click",function(e){
            e.preventDefault();
            self.location = "${path}/member/login";
        });
    });

</script>

<%@include file="../include/footer.jsp" %>