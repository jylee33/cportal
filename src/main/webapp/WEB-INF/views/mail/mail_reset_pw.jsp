<%@ page contentType="text/html; charset=UTF-8" %>
<%--<%@ include file="/common/ssi.jsp" %>--%>
<%--<%@ include file="/common/resource.jsp" %>--%>

<%@ page import="com.hamonsoft.cportal.mail.*"  %>

<%
    MailSend ms = new MailSend();
//    ms.MailSend();

    String mailto = request.getParameter("mailto");
    String pw = request.getParameter("pw");
    String url = request.getRequestURL().toString();
    String contextPath = request.getContextPath();
    String cpath = url.substring(0, url.indexOf(contextPath)) + contextPath;

    ms.MailSendResetPW(cpath, mailto, pw);

    out.println("COMPLETE");
%>