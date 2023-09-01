<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<spring:eval var="prof" expression="@environment.getProperty('spring.profiles.active')" />

<c:set var="profile" value="${prof}"/>

<%@include file="../include/header.jsp" %>

<%

    MailSend ms = new MailSend();

    String email = request.getParameter("email");
    String membername = request.getParameter("membername");
    String licensegrade = request.getParameter("licensegrade");
    String url = request.getRequestURL().toString();
    String contextPath = request.getContextPath();
    String cpath = url.substring(0, url.indexOf(contextPath)) + contextPath;
    String profile = (String)pageContext.getAttribute("profile");

    ms.MailSend_emailcertification(profile, cpath, email, membername, licensegrade);

%>

<script>

    self.location = "${path}/member/insertmember_result?email=" + "${email}" + "&membername=" + "${membername}" + "&licensegrade=" + "${licensegrade}";

</script>

<%@include file="../include/footer.jsp" %>