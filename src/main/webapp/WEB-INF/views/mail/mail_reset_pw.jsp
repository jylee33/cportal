<%@ page contentType="text/html; charset=UTF-8" %>
<%--<%@ include file="/common/ssi.jsp" %>--%>
<%--<%@ include file="/common/resource.jsp" %>--%>

<%@ page import="com.hamonsoft.cportal.mail.*"  %>

<%
    MailSend ms = new MailSend();
//    ms.MailSend();

    String mailto = request.getParameter("mailto");
    String pw = request.getParameter("pw");
    ms.MailSendResetPW(mailto, pw);

    out.println("COMPLETE");
%>