<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <form class="form-wrap" role="form" action="withdrawalresult" method="post">
        <h2 class="h2">회원정보</h2>
        <div class="tabs1">
            <a href="${path}/user/info">회원정보</a>
            <a href="${path}/user/chgpw">비밀번호 변경</a>
            <a href="#" class="active">회원탈퇴</a>
        </div>

        <div class="alert-comment">
            <p>탈퇴 후 NETIS통합서비스를 통해 등록한 서비스의 모든 정보가 영구적으로 삭제되며 복구가 불가능 합니다.(재가입시에도 불가)</p>
            <p>유료로 이용 중인 서비스에 미납금이 없을 경우에만 탈퇴 할 수 있습니다.</p>
            <p>탈퇴 후에는 아이디(사용자1)로 재가입 할 수 없습니다.</p>
        </div>
        <div class="inp-area">
            <div class="label">탈퇴 계정</div>
            <div class="inp-box"><input class="inp2" name="email" value="${email}"></div>
        </div>

        <div class="inp-area">
            <div class="label">변경 비밀번호</div>
            <div class="inp-box">
                <label><input type="checkbox" class="checkbox"><div><em></em><span>서비스 사용 불편</span></div></label>
                <label><input type="checkbox" class="checkbox"><div><em></em><span>이용계획 없음</span></div></label>
                <label><input type="checkbox" class="checkbox"><div><em></em><span>가격불만</span></div></label>
                <label><input type="checkbox" class="checkbox"><div><em></em><span>기타</span></div></label>
            </div>
        </div>

        <div class="inp-area">
            <div class="label">개선사항</div>
            <div class="inp-box">
                <textarea class="textarea" style="height: 100px;"></textarea>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">비밀번호 확인</div>
            <div class="inp-box">
                <input type="password" class="inp2" placeholder="" id="pw">
                <button class="btn" id="confirmpw">비밀번호 재확인</button>
            </div>
        </div>

        <button class="btn large block" id="withdrawal" disabled>회원 탈퇴</button>
    </form>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/core.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/sha256.js"></script>

<script>

    $(document).ready(function () {
        var formObj = $("form[role='form']");

        $("#confirmpw").on("click", function (e) {
            e.preventDefault();
            $("#withdrawal").attr("disabled", true);

            var pw2 = CryptoJS.SHA256($("#pw").val());

            if("${pw}" == pw2) {
                console.log("비밀번호 재확인 성공");
                $("#withdrawal").attr("disabled", false);
            } else {
                console.log("비밀번호 재확인 실패");
            }
        });

        $("#withdrawal").on("click", function (e) {
            e.preventDefault();

            formObj.submit();
        });

    });

</script>

<%@include file="../include/footer.jsp" %>