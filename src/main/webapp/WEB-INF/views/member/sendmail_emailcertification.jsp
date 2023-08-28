<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<%

    MailSend ms = new MailSend();
    //    ms.MailSend();

    String email = request.getParameter("email");
    String url = request.getRequestURL().toString();
    String contextPath = request.getContextPath();
    String cpath = url.substring(0, url.indexOf(contextPath)) + contextPath;
    ms.MailSend_emailcertification(cpath, email);

%>

<script>

    self.location = "${path}/member/insertmember_result?email=" + "${email}";

</script>

<%@include file="../include/footer.jsp" %>