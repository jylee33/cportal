<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta name="description" content=""/>
    <meta name="author" content=""/>
    <title>NETIS CLOUD</title>
    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="${path}/resources/assets/favicon.ico"/>
    <!-- Custom Google font-->
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100;200;300;400;500;600;700;800;900&amp;display=swap"
          rel="stylesheet"/>
    <!-- Bootstrap icons-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet"/>
    <!-- Core theme CSS (includes Bootstrap)-->
    <link href="${path}/resources/dist/css/styles.css" rel="stylesheet"/>
</head>
<!-- jQuery 2.1.4 -->
<script src="${path}/resources/plugins/jQuery/jQuery-2.1.4.min.js"></script>
<body class="d-flex flex-column h-100 bg-light">
<main class="flex-shrink-0">
    <!-- Navigation-->
    <nav class="navbar navbar-expand-lg navbar-light bg-white py-3">
        <div class="container px-5">
            <a class="navbar-brand" href="${path}/"><span class="fw-bolder text-primary">NETIS CLOUD</span></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
                    <li class="nav-item"><a class="nav-link" href="${path}/">Home</a></li>
<%--                    <li class="nav-item"><a class="nav-link" href="${path}/bill/pay">결제</a></li>--%>
<%--                    <li class="nav-item"><a class="nav-link" href="${path}/mail">메일</a></li>--%>
<%--                    <li class="nav-item"><a class="nav-link" href="${path}/mail/groupmail">그룹메일</a></li>--%>
                    <%--            <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>--%>
                </ul>
            </div>
        </div>
    </nav>

