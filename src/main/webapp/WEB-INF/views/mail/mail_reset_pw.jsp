<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%--<%@ include file="/common/ssi.jsp" %>--%>
<%--<%@ include file="/common/resource.jsp" %>--%>

<%@ page import="com.hamonsoft.cportal.mail.*"  %>

<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<spring:eval var="prof" expression="@environment.getProperty('spring.profiles.active')" />

<c:set var="profile" value="${prof}"/>

<%
    MailSend ms = new MailSend();

    String mailto = request.getParameter("mailto");
    String pw = request.getParameter("pw");
    String url = request.getRequestURL().toString();
    String contextPath = request.getContextPath();
    String cpath = url.substring(0, url.indexOf(contextPath)) + contextPath;
//    cpath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/" + request.getContextPath();
    String profile = (String)pageContext.getAttribute("profile");

    ms.MailSendResetPW(profile, cpath, mailto, pw);

    out.println("COMPLETE");
%>