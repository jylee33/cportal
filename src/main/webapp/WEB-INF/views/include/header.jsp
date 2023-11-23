<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <meta charset="utf-8" />
    <title>하몬소프트</title>
    <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="stylesheet" type="text/css" href="${path}/resources/css/sumoselect.css" />
    <link rel="stylesheet" type="text/css" href="${path}/resources/css/front.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
    <script type="text/javascript" src="${path}/resources/js/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jquery.sumoselect.js"></script>
    <script type="text/javascript" src="${path}/resources/js/front.js"></script>

</head>
<link rel="icon" href="${path}/resources/favicon.ico">


<script language=javascript>
    function currencyFormatter(amount){
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
    }
    //날자 포맷
    function dateFormatter(stringDate){
        if(!stringDate){
            return "";
        }
        var formatNum = '';
        stringDate=stringDate.replace(/\s/gi, "");
        if(stringDate.length == 8){
            formatNum = stringDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
        }else{
            formatNum = stringDate;
        }
        // document.getElementById(id).innerHTML = formatNum;
        //console.log("dateFormatter formatNum -->"+formatNum+" ..... num ->"+num);
        return formatNum;
    }

    //전화번호 포맷
    function phoneFormatter(num) {
        var formatNum = '';
        try{
            num = num.replace(/[^0-9]/g, "");
            if (num.length == 11) {
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (num.length == 8) {
                formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
            } else {
                if (num.indexOf('02') == 0) {
                    formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                } else {
                    formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                }
            }
        } catch(e) {
            formatNum = num;
        }
        console.log("phoneFormatter formatNum -->"+formatNum+" ..... num ->"+num);
        return formatNum;
    }
    //사업자등록번호 포맷
    function bizNoFormatter(num, type) {
        var formatNum = '';
        try{
            if (num.length == 10) {
                if (type == 0) {
                    formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-*****');
                } else {
                    formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
                }
            }
        } catch(e) {
            formatNum = num;
        }
        console.log("bizNoFormatter formatNum -->"+formatNum+" ..... num ->"+num);
        return formatNum;
    }
</script>
<body>
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
                                <a href="${path}/serviceguide">서비스소개</a>
                                <a href="${path}/download">자료실</a>
                                <c:if test="${not empty login}">
                                    <a href="${path}/member/logout">로그아웃</a>
                                </c:if>
                            </div>
                        </div>
                    </c:if>
                    <c:if test="${empty login}">
                        <a href="${path}/serviceguide">서비스안내</a>
                        <a href="${path}/member/login">로그인</a>
                        <a href="${path}/member/insertMember">회원 가입</a>
                    </c:if>
                    <%--                    <a href="${path}/member/listAll">회원 목록 조회</a>--%>
                    <%--                    <a href="${path}/charge/guide">과금안내</a>--%>
                </div>
                <c:if test="${not empty login}">
                    <a href="${path}/member/netis" target="_blank" class="btn-link">Netis 통합모니터링 서비스</a>
                    <c:if test="${login.administratoryn eq 'Y'}">
                        <a href="${path}/license/licensemanage" class="btn-user">${login.membername} (관리자)</a>
                    </c:if>
                    <c:if test="${login.administratoryn ne 'Y'}">
                        <a href="${path}/user/info" class="btn-user">${login.membername} (회원)</a>
                    </c:if>
                </c:if>
            </div>
        </div>
    </div>
    <!-- // header -->
