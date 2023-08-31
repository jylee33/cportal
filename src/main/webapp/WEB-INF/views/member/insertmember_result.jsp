<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <div class="form-wrap">
        <div class="form-desc">회원 가입 인증 안내 메일을 발송하였습니다.</div>
        <button class="btn large block" id="resendmail">인증메일 재발송</button>
        <br>
        <br>
        <button class="btn large block" id="login">로그인 바로 가기</button>
    </div>
</div>

<script>

    $(document).ready(function() {
        $("#resendmail").on("click",function(e){
            self.location = "${path}/member/sendmail_emailcertification?email=${email}&membername=${membername}&licensegrade=${licensegrade}";
        });

        $("#login").on("click",function(e){
            self.location = "${path}/member/login";
        });
    });

</script>

<%@include file="../include/footer.jsp" %>