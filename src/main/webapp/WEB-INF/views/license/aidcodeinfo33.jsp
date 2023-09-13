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

    <link rel="stylesheet" href="${path}/resources/js/jqwidgets/styles/jqx.base.css" type="text/css" />
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcore.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxbuttons.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxscrollbar.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxmenu.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.selection.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.columnsresize.js"></script>
    <script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdata.js"></script>






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


<link rel="stylesheet" href="${path}/resources/js/jqwidgets/styles/jqx.base.css" type="text/css" />

<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcore.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxbuttons.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxscrollbar.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxmenu.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.selection.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.columnsresize.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdata.js"></script>
<%--<script type="text/javascript" src="${path}/resources/js/scripts/demos.js"></script>--%>


<div class="container">
    <div class="h3-head">
        <h3 class="h3">라이선스 정책 관리</h3>
    </div>
    <div class="tabs-box" id='jqxTabs'>
        <div class="tabs">
            <a href="${path}/license/licensemanage" >라이선스 정책 관리</a>
            <a href="#" class="active">라이선스 제공 기능</a>
            <a href="${path}/license/creditinfo">Credit 제공</a>
        </div>
        <div class="right">
            <form autocomplete="on" action="/portal/license/aidcode" method="post">
                <span class="tit">기능구분 선택</span>
                <select class="select" name="sltcode" id="sltcode">
                    <option value="10">기본기능</option>
                    <option value="20">부가기능</option>
                    <option value="30">고급기능</option>
                </select>
                <button class="btn" type="submit">조회</button>
            </form>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button class="btn btn3" id="btn_add_row">행추가</button>
        <button class="btn" id="btn-rowsave">저장</button>
    </div>
    <div class="table-type1 text-center cursor">
        <table id="aidInfo"></table>
        <div id="pager"></div>
    </div>
</div>
</div>

<script>

    // if (typeof jQuery == 'undefined') {
    //     var script = document.createElement('script');
    //     script.type = "text/javascript";
    //     script.src = "https://code.jquery.com/jquery-3.5.1.min.js";
    //     document.getElementsByTagName('head')[0].appendChild(script);
    // } else {
    //     console.log("jQuery Ready");
    // }
    $(document).ready(function(){
        alert(".......................................................................");
        var url = "${path}/license/aidcodeinfo";
        // prepare the data
        var source =
            {
                datatype: "json",
                datafields: [
                    { name: 'functionno',type:'int'},
                    { name:'functionname',type:'string'},
                    { name: 'freeaid', type: 'string' },
                    { name: 'basicaid', type: 'string' },
                    { name: 'proaid', type: 'string' },
                    { name: 'entaid', type: 'string' },
                    { name:'functioncode',type:'string'},
                    { name:'useyn',type:'string'},
                    { name: 'stdate', type: 'string' },
                    { name: 'eddate', type: 'string' },
                    { name:'sortno',type:'int'}
                ],
                id: 'id',
                url: url,
                type: "GET"
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#grid2").jqxGrid(
            {
                width: 1000,
                source: dataAdapter,
                // columnsresize: true,
                columns: [
                    { text: '지원관리번호', datafield: 'functionno', width: 250 },
                    { text: '지원기능', datafield: 'functionname', width: 250},
                    { text: 'freeaid',datafield: 'freeaid', width: 250 },
                    { text: 'basicaid', datafield: 'basicaid', width: 250 },
                    { text: 'proaid', datafield: 'proaid', width: 250 },
                    { text: 'entaid',datafield: 'entaid',  width: 250 },
                    { text: '기능구분', datafield: 'functioncode', width: 250},
                    { text: '사용여부', datafield: 'useyn', width: 250},
                    { text: 'stdate',datafield: 'stdate',  width: 250 },
                    { text: 'eddate',datafield: 'eddate',  width: 250 },
                    { text: '정렬기준', datafield: 'sortno', width: 250}
                ]
        });

    });

</script>
</body>
<%@include file="../include/footer.jsp" %>

