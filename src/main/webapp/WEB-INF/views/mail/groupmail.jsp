<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

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
                <input type="file" id="uploadExcel" name="uploadExcel">
            </div>
        </div>
        <P></P>
        <div class="form_section">
            <div class="form_section_title">
                <label>메일 본문 HTML 파일 업로드</label>
            </div>
            <div class="form_section_content">
                <input type="file" id="uploadHtml" name="uploadHtml">
            </div>
        </div>
        <P></P>
        <div class="form-group" style="width: 38%; margin: 10px auto;">
            <button type="button" class="btn btn-primary btn-lg btn-block" onclick="send_mail()">메일 보내기</button>
        </div>
    </div>
</section>>

<script type="text/javascript">
	function send_mail(){
        var mailsubject = $('#mailsubject').val();
		window.open("groupmail_send?mailsubject=" + mailsubject, "", "width=370, height=360, resizable=no, scrollbars=no, status=no");
	}

    document.querySelector("input[name=uploadExcel]").addEventListener("change", function () {
        let fileInput = document.querySelector("input[name=uploadExcel]");
        let fileObj = fileInput.files[0];
        let fileList = fileInput.files;

        let formData = new FormData();

        formData.append("uploadExcel", fileObj);

        console.log("fileList : " + fileList);
        console.log("fileList[0].name : " + fileList[0].name);
        console.log("fileList[0].size : " + fileList[0].size);
        console.log("fileList[0].type : " + fileList[0].type);

        $.ajax({
            url: '${path}/mail/uploadexcel',
            processData : false,
            contentType : false,
            data : formData,
            type : 'POST',
            dataType : 'json'
        });
    });

    document.querySelector("input[name=uploadHtml]").addEventListener("change", function () {
        let fileInput = document.querySelector("input[name=uploadHtml]");
        let fileObj = fileInput.files[0];
        let fileList = fileInput.files;

        let formData = new FormData();

        formData.append("uploadHtml", fileObj);

        console.log("fileList : " + fileList);
        console.log("fileList[0].name : " + fileList[0].name);
        console.log("fileList[0].size : " + fileList[0].size);
        console.log("fileList[0].type : " + fileList[0].type);

        $.ajax({
            url: '${path}/mail/uploadhtml',
            processData : false,
            contentType : false,
            data : formData,
            type : 'POST',
            dataType : 'json'
        });
    });
</script>

<%@include file="../include/footer.jsp" %>