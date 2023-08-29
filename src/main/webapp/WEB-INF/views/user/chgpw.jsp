<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <form class="form-wrap" role="form" action="chgpwresult" method="post">
        <h2 class="h2">회원정보</h2>
        <div class="tabs1">
            <a href="${path}/user/info">회원정보</a>
            <a href="#" class="active">비밀번호 변경</a>
            <a href="${path}/user/withdrawal">회원탈퇴</a>
        </div>
        <input type="hidden" name="email" value="${email}">
        <div class="inp-area">
            <div class="label">현재 비밀번호</div>
            <div class="inp-box"><input type="password" class="inp2" placeholder="" id="currpw"></div>
        </div>

        <div class="inp-area">
            <div class="label">변경 비밀번호</div>
            <div class="inp-box"><input type="password" class="inp2" placeholder="" name="password" id="password1"></div>
        </div>
        <div class="alert-msg" id="pwAlert">반드시 영문과 숫자, 특수문자를 혼합하여 9~16자 입력해주시기 바랍니다.<br>(허용 특수문자 : !@#$%^+=-)</div>

        <div class="inp-area">
            <div class="label">변경 비밀번호 확인</div>
            <div class="inp-box"><input type="password" class="inp2" placeholder="" id="password2"></div>
        </div>

        <button class="btn large block" id="chgpassword">비밀번호 변경</button>
    </form>
</div>

<script>

    $(document).ready(function () {
        var formObj = $("form[role='form']");

        $('#password1').change(function () {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^+=-]).{9,16}$/;

            var pw = $(this).val();

            if (false === reg.test(pw)) {
                $("#pwAlert").show();
                $(this).focus();
            } else {
                $("#pwAlert").hide();
            }
        });

        $('#password2').change(function () {
            if ($("#password1").val() != $("#password2").val()) {
                alert("변경 비밀번호가 서로 다릅니다.");
                $("#password2").focus();
                $("#password2").val("");
            }
        });

        $("#chgpassword").on("click", function (e) {
            e.preventDefault();

            if ($("#currpw").val() == "") {
                alert("현재 비밀번호를 입력하세요");
                return;
            }

            if ($("#pwAlert").is(":visible") == true) {
                $("#password1").focus();
                return;
            }

            var pw1 = $("#password1").val();
            var pw2 = $("#password2").val();

            if (pw1 == "" || pw2 == "") {
                alert("변경 비밀번호를 확인해 주세요.");
                return;
            }

            formObj.submit();
        });

    });

</script>

<%@include file="../include/footer.jsp" %>