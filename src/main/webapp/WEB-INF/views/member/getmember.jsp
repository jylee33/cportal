<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<div class="container">
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
</div>

<script type="text/javascript">
    function send_mail(){
        var mailto = $('#mailto').val();
        window.open("mail/test_mail?mailto=" + mailto, "", "width=370, height=360, resizable=no, scrollbars=no, status=no");
    }
</script>

<%@include file="../include/footer.jsp" %>