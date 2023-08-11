<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

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

<script type="text/javascript">

    // $(".btn-login").on("click",function(e){
    //
    //     e.preventDefault();
    //
    //     $("#loginForm").submit();
    //
    // });

</script>

<%@include file="../include/footer.jsp" %>