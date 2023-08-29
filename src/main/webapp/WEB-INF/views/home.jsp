<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="include/header.jsp" %>

<div class="main">
    <div>
        <h2 data-aos="fade-up" data-aos-delay="300">인프라 통합 관제 <strong>클라우드 서비스</strong></h2>
        <p><span data-aos="fade-up" data-aos-delay="500">오픈 플랫폼 기반 IoT 확장성에 최적화된 SaaS 서비스</span>
            <span data-aos="fade-up" data-aos-delay="700"><strong>
                            실시간 네트워크와 서버 관리를 통한 새로운 클라우드 서비스 </strong></p>
        <div class="btns" data-aos="fade-up" data-aos-delay="800">
            <a href="#">서비스 안내</a>
        </div>
    </div>
</div>
<!-- // main -->

<script>

    window.onload = function(){
        AOS.init({
            easing: 'ease-out-back',
            duration: 1000
        });
        $('.main').addClass('active');
    }

</script>

<%@include file="include/footer.jsp" %>