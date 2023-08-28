<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <a href="${path}/member/sendmail_emailcertification?email=${email}">인증메일 재발송</a>
    <p></p>
    <p></p>
    <a href="${path}/user/login">로그인 바로 가기</a>
</div>

<script>


</script>

<%@include file="../include/footer.jsp" %>