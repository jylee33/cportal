<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<section class="content">
    <div class="row">
        <div class="form-group" style="width: 38%; margin: 10px auto;">
            <button type="button" class="btn btn-primary btn-lg btn-block" onclick="send_mail()">메일 보내기</button>
        </div>
    </div>
</section>

<script type="text/javascript">
	function send_mail(){
		window.open("groupmail_send", "", "width=370, height=360, resizable=no, scrollbars=no, status=no");
	}
</script>

<%@include file="../include/footer.jsp" %>