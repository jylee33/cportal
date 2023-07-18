<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <label for="mailsubject" class="form-label">메일 제목</label>
            <div class="input-group has-validation">
                <input type="text" class="form-control" id="mailsubject" value="NETIS CLOUD 서비스 가입 안내" required/>
            </div>
        </div>
        <P></P>
        <div class="form_section">
            <div class="form_section_title">
                <label>메일수신자 Excel 파일 업로드</label>
            </div>
            <div class="form_section_content">
                <input type="file" name="uploadFile">
            </div>
        </div>
        <div class="form-group" style="width: 38%; margin: 10px auto;">
            <button type="button" class="btn btn-primary btn-lg btn-block" onclick="send_mail()">메일 보내기</button>
        </div>
    </div>
</section>

<script type="text/javascript">
	function send_mail(){
        var mailsubject = $('#mailsubject').val();
		window.open("groupmail_send?mailsubject=" + mailsubject, "", "width=370, height=360, resizable=no, scrollbars=no, status=no");
	}

    document.querySelector("input[type=file]").addEventListener("change", function () {
        let fileInput = document.querySelector("input[name=uploadFile]");
        let fileObj = fileInput.files[0];
        let fileList = fileInput.files;

        let formData = new FormData();

        formData.append("uploadFile", fileObj);

        console.log("fileList : " + fileList);
        console.log("fileList[0].name : " + fileList[0].name);
        console.log("fileList[0].size : " + fileList[0].size);
        console.log("fileList[0].type : " + fileList[0].type);

        $.ajax({
            url: '/mail/uploadexcel',
            processData : false,
            contentType : false,
            data : formData,
            type : 'POST',
            dataType : 'json'
        });
    });
</script>

<%@include file="../include/footer.jsp" %>