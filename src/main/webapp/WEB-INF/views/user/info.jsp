<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <div class="form-wrap">
        <h2 class="h2">회원정보</h2>
        <div class="tabs1">
            <a href="#" class="active">회원정보</a>
            <a href="${path}/user/chgpw">비밀번호 변경</a>
            <a href="${path}/user/withdrawal">회원탈퇴</a>
        </div>
        <div class="inp-area">
            <div class="label">이메일 *</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="이메일"></div>
        </div>
        <div class="inp-area">
            <div class="label">성명 *</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="성명"></div>
        </div>
        <div class="inp-area">
            <div class="label">휴대전화 *</div>
            <div class="inp-box">
                <input type="text" class="inp2" placeholder="휴대전화">
                <button class="btn">인증번호전송</button>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">인증번호 *</div>
            <div class="inp-box">
                <span class="time">남은시간 : 4분 59초</span>
                <input type="text" class="inp2" value="12345">
                <button class="btn">인증하기</button>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">회사명 *</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="회사명"></div>
        </div>
        <div class="inp-area">
            <div class="label">사업자등록번호 *</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="'-'빼고 숫자만 입력하세요(10자리 체크)"></div>
        </div>
        <div class="inp-area">
            <div class="label">등급선택 *</div>
            <div class="inp-box">
                <select class="select large">
                    <option>Free</option>
                    <option>Basic</option>
                    <option>Pro</option>
                    <option>Enterprise</option>
                </select>
            </div>
        </div>

        <hr class="hr1 mt30">
        <h3 class="h3">세금계산서 발행</h3>

        <div class="inp-area">
            <div class="label">법인(회사)명</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="회사명"></div>
        </div>
        <div class="inp-area">
            <div class="label">대표자명</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="대표자명"></div>
        </div>
        <div class="inp-area">
            <div class="label">사업자 등록 번호</div>
            <div class="inp-box">
                <div class="hp-box">
                    <input type="text" class="inp2" placeholder="" maxlength="3">
                    <span>-</span>
                    <input type="text" class="inp2" placeholder="" maxlength="4">
                    <span>-</span>
                    <input type="text" class="inp2" placeholder="" maxlength="4">
                </div>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">전자세금계산서<br>발행메일</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="전자세금계산서 발행 메일을 입력하세요."></div>
        </div>
        <div class="inp-area">
            <div class="label">주소</div>
            <div class="inp-box">
                <input type="text" class="inp2" placeholder="우편번호를 검색하세요.">
                <button class="btn">우편번호검색</button>
            </div>
        </div>
        <div class="inp-area">
            <div class="label"></div>
            <div class="inp-box">
                <input type="text" class="inp2" placeholder="상세주소 등록">
            </div>
        </div>
        <div class="inp-area">
            <div class="label">업종</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="업종을 입력하세요"></div>
        </div>
        <div class="inp-area">
            <div class="label">업태</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="업태를 입력하세요"></div>
        </div>
        <button class="btn large block">회원정보 변경</button>
    </div>
</div>

<script>


</script>

<%@include file="../include/footer.jsp" %>