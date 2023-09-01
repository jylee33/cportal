<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>


<script>

    $(document).ready(function () {
        if ("${result}" == 1) {
            alert("회원 탈퇴 완료");
            self.location = "${path}/member/logout";
        } else {
            alert("회원 탈퇴 실패");
        }
    });

</script>

<%@include file="../include/footer.jsp" %>