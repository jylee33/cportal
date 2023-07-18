<%@ page contentType="text/html; charset=UTF-8" %>
<%--<%@ include file="/common/ssi.jsp" %>--%>
<%--<%@ include file="/common/resource.jsp" %>--%>

<%@ page import="com.hamonsoft.cportal.mail.*"  %>

<%
    MailSend ms = new MailSend();
    ms.GroupMailSend();

    out.println("COMPLETE");
%>