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

    <link rel="stylesheet" href="${path}/resources/js/jqwidgets/styles/jqx.base.css" type="text/css" />
    <script type="text/javascript" src="${path}/resources/js/jquery.sumoselect.js"></script>
    <script type="text/javascript" src="${path}/resources/js/front.js"></script>

    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcore.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxbuttons.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxscrollbar.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxmenu.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.selection.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.columnsresize.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdata.js"></script>

    <!--  <script type="text/javascript" src="${path}/resources/jqgrid_4.4.3/js/jquery-3.4.1.min.js"></script  -->

</head>

<body>
// jQuery에서 제공하는 3.5.1 버전의 jQuery CDN 호스트
<div id="wrap">
    <div class="header">
        <div class="inner">
            <a href="${path}/"><h1>NETIS 클라우드 서비스</h1></a>
            <div class="right">
                <div class="menu">
                    <c:if test="${not empty login}">
                        <div class="right">
                            <div class="menu">
                                <c:if test="${login.administratoryn eq 'Y'}">
                                    <a href="${path}/charge/memberinfo">과금안내(관리자)</a>
                                </c:if>
                                <c:if test="${login.administratoryn ne 'Y'}">
                                    <a href="${path}/charge/individualinfo">과금안내</a>
                                </c:if>
                                <a href="${path}/charge/personinfo">서비스소개</a>
                                <a href="${path}/charge/personinfo">자료실</a>
                                <c:if test="${not empty login}">
                                    <a href="${path}/member/logout">로그아웃</a>
                                </c:if>

                                <c:if test="${login.administratoryn ne 'Y'}">
                                    <a href="${path}/user/info" class="btn-user">${login.membername} (회원)</a>
                                </c:if>
                            </div>

                        </div>
                        <a href="http://cloud.hamonsoft.com" target="_blank" class="btn-link">Netis 통합모니터링 서비스</a>
                        <c:if test="${login.administratoryn eq 'Y'}">
                            <a href="${path}/license/licensemanage" class="btn-user">${login.membername} (관리자)</a>
                        </c:if>
                    </c:if>
                    <c:if test="${empty login}">
                        <a href="#">서비스안내</a>
                        <a href="${path}/member/login">로그인</a>
                        <a href="${path}/member/insertMember">회원 가입</a>
                    </c:if>
                    <%--                    <a href="${path}/member/listAll">회원 목록 조회</a>--%>
                    <%--                    <a href="${path}/charge/guide">과금안내</a>--%>
                </div>
            </div>
        </div>
    </div>
    <!-- // header -->


