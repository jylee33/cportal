<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<form id='loginForm' action="loginPost" method="post">

    <div class="form-group has-feedback">
        <input type="text" name="uid" class="form-control" placeholder="USER ID"/>
        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
    </div>
    <div class="form-group has-feedback">
        <input type="password" name="upw" class="form-control" placeholder="Password"/>
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
    </div>
    <div class="row">
        <div class="col-xs-8">
            <div class="checkbox icheck">
                <label>
                    <input type="checkbox" name="useCookie"> Remember Me
                </label>
            </div>
        </div><!-- /.col -->
        <div class="col-xs-4">
            <button type="submit" class="btn btn-primary btn-block btn-flat btn-login">Sign In</button>
        </div><!-- /.col -->
    </div>
</form>

<script>

    // $(".btn-login").on("click",function(e){
    //
    //     e.preventDefault();
    //
    //     $("#loginForm").submit();
    //
    // });

    $(document).ready(function() {
        if ('${login.email}' != "") {
            self.location = "${path}/";
        }

    });
<%--    <%--%>
<%--    Member login = (Member) session.getAttribute("login");--%>
<%--    %>--%>





</script>

<%@include file="../include/footer.jsp" %>