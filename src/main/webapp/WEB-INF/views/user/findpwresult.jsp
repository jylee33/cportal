<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ page import="com.hamonsoft.cportal.mail.*"  %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <div class="form-wrap">
        <h2 class="h2">계정정보 찾기</h2>
        <div class="tabs1">
            <a href="${path}/user/findid" class="active">아이디(이메일) 찾기</a>
            <a href="${path}/user/findpw">비밀번호 찾기</a>
        </div>
        <div class="find-result">
            <div id="result">
                <p>임시 비밀번호를 이메일로 발송하였습니다.</p>
                <div>이메일 : <strong>${email}</strong></div>
            </div>
        </div>
        <button class="btn large block" id="login">로그인</button>

    </div>
</div>

<script>

    function send_mail(){
        var mailto = "${email}";
        var pw = "${pw}";
        var url = "${path}/mail/mail_reset_pw";
        var params = "mailto=" + mailto + "&pw=" + pw;

        $.ajax({
            type: "GET",
            url: url,
            data: params,
            success: function (args) {

            },
            error: function (e) {
                alert(e.responseText);
            },
        });

        // window.open("mail/test_mail?mailto=" + mailto, "", "width=370, height=360, resizable=no, scrollbars=no, status=no");

        // alert("send mail");
<%--        <%--%>
<%--        MailSend ms = new MailSend();--%>
<%--        System.out.println(<%=${email}%>);--%>
<%--        ms.MailSendHtml("${email}");--%>
<%--        %>--%>

    }

    $(document).ready(function() {
        send_mail();

        $("#login").on("click",function(e){
            e.preventDefault();
            self.location = "${path}/user/login";
        });
    });

</script>

<%@include file="../include/footer.jsp" %>