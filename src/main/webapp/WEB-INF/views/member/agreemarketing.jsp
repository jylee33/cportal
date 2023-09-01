<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
    <div class="max-inner2">
        <h3 class="h3">마케팅 활용 및 정보 수신 </h3>
        <div class="privacy">
            전사적 전송매체(SMS/MMS/이메일 등)를 통해, (주)하몬소프트가 제공하는 이벤트/혜택 등 다양한 정보를 수신하실 수 있고, 기타 유용한 광고나 정보를 수신하실 수 있습니다.<br><br>

            본 마케팅 활용 및 광고성 정보수신 동의 항목은 선택 사항이므로 동의를 거부하는 경우에도 Netis 통합모니터링 서비스의 이용에는 영향이 없습니다. 다만 거부시 동의를 통해 제공 가능한 각종 혜택, 이벤트 안내를 받아 보실 수 없습니다.<br><br>

            본 수신 동의를 철회하고자 할 경우에는 언제든지 수신동의 철회를 하실 수 있습니다.

        </div>
    </div>


</div>

<script>

    $(document).ready(function() {

    });

</script>

<%@include file="../include/footer.jsp" %>