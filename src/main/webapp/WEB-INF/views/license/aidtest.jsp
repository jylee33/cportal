<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>


  <%@include file="../include/header.jsp" %>


<div class="container">

<div class="tab_menu">
  <ul class="list">
    <li class="is_on">
      <a href="#tab1" class="btn">라이선스 정책 관리</a>
    </li>
    <li>
      <a href="#tab2" class="btn">라이선스 제공 기능</a>
    </li>
    <li>
      <a href="#tab3" class="btn">Credit 제공</a>
    </li>
  </ul>

  <div class="cont_area">
     <div id="tab1" class="cont" style="display:block;">
      Tab Content1
    </div>
    <div id="tab2" class="cont">
      Tab Content2
    </div>
    <div id="tab3" class="cont">
      Tab Content3
    </div>
  </div>
</div>
</div>
</div>

<%@include file="../include/footer.jsp" %>