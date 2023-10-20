<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>


<script>

    $(document).ready(function () {
        if ("${member.email}" == "") {
            alert("Login Failed");
            self.location = "${path}/member/login";
        } else {
            self.location = "${path}/member/ssologin?email=${member.email}";
        }
    });

</script>

<%@include file="../include/footer.jsp" %>