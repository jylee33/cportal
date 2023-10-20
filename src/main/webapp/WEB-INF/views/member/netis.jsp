<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <form class="form-wrap" id="myForm" action="" method="post">
        <input type='hidden' name='accessToken' style="width:90%" value="${access_token}" />
    </form>
</div>

<script>

    $(document).ready(function () {

        console.log("hostname - ${hostname}");
        var actUrl = "https://aws.${hostname}.hamon.vip/login/ssoLogin.do";

        $("#myForm").attr("action", actUrl);
        $("#myForm").submit();
    });

</script>

<%@include file="../include/footer.jsp" %>