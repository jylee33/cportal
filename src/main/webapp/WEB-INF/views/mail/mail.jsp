<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ page import="com.hamonsoft.cportal.mail.*"  %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <label for="mailto" class="form-label">받는 사람</label>
            <div class="input-group has-validation">
                <input type="text" class="form-control" id="mailto" value="jylee@hamonsoft.co.kr" required/>
            </div>
        </div>
        <div class="form-group" style="width: 38%; margin: 10px auto;">
            <button type="button" class="btn btn-primary btn-lg btn-block" onclick="send_mail()">메일 보내기</button>
        </div>
    </div>
</section>

<script>
	function send_mail(){
        var mailto = $('#mailto').val();

        // 방법 1
		<%--window.open("${path}/mail/test_mail?mailto=" + mailto, "", "width=370, height=360, resizable=no, scrollbars=no, status=no");--%>

        // 방법 2
<%--        <%--%>
<%--        MailSend ms = new MailSend();--%>
<%--        ms.MailSendHtml("jylee@hamonsoft.co.kr");--%>
<%--        %>--%>

        // 방법 3
        var url = "${path}/mail/test_mail";
        var params = "mailto=" + mailto;

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

	}
</script>

<%@include file="../include/footer.jsp" %>