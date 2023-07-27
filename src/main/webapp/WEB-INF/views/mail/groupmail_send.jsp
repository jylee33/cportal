<%@ page contentType="text/html; charset=UTF-8" %>
<%--<%@ include file="/common/ssi.jsp" %>--%>
<%--<%@ include file="/common/resource.jsp" %>--%>

<%@ page import="com.hamonsoft.cportal.mail.*"  %>

<%
    MailSend ms = new MailSend();

    String mailsubject = request.getParameter("mailsubject");
    ms.MailSendGroup(mailsubject);

    out.println("COMPLETE");
%>