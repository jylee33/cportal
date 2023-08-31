<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>하몬소프트</title>
    <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="stylesheet" type="text/css" href="${path}/resources/css/sumoselect.css" />
    <link rel="stylesheet" type="text/css" href="${path}/resources/css/front.css" />
    <script type="text/javascript" src="${path}/resources/js/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jquery.sumoselect.js"></script>
    <script type="text/javascript" src="${path}/resources/js/front.js"></script>
</head>
<link rel="icon" href="${path}/resources/favicon.ico">

<body>
<div id="wrap">
    <div class="header">
        <div class="inner">
            <a href="${path}/"><h1>NETIS 클라우드 서비스</h1></a>
            <div class="right">
                <div class="menu">
                    <a href="${path}/serviceguide">서비스 안내</a>
                    <a href="${path}/serviceintroduction">서비스 소개</a>
                    <c:if test="${not empty login}">
                        <a href="${path}/download">자료실</a>
                    </c:if>
                    <c:if test="${empty login}">
                        <a href="${path}/member/login">로그인</a>
                    </c:if>
                    <c:if test="${not empty login}">
                        <a href="${path}/member/logout">로그아웃</a>
                    </c:if>
                    <c:if test="${empty login}">
                        <a href="${path}/member/insertMember">회원 가입</a>
                    </c:if>
<%--                    <a href="${path}/member/listAll">회원 목록 조회</a>--%>
<%--                    <a href="${path}/charge/guide">과금안내</a>--%>
                </div>
                <c:if test="${not empty login}">
                    <a href="http://cloud.hamonsoft.com" target="_blank" class="btn-link">Netis 통합모니터링 서비스</a>
                    <a href="${path}/user/info" class="btn-user">${login.membername}</a>
                </c:if>
            </div>
        </div>
    </div>
    <!-- // header -->


