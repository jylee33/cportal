<%@ page contentType="text/html; charset=UTF-8" %>
<%--<%@ include file="/common/ssi.jsp" %>--%>
<%--<%@ include file="/common/resource.jsp" %>--%>

<%@ page import="com.hamonsoft.cportal.mail.*"  %>

<%
    MailSend ms = new MailSend();
//    ms.MailSend();

    String mailto = request.getParameter("mailto");
    ms.MailSend2(mailto);

    out.println("COMPLETE");
%>