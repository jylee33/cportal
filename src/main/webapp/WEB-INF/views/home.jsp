<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="include/header.jsp" %>

<div class="main">
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide slide1">
                <h2 >IT 인프라 통합관리솔루션 선도기업</h2>
                <p>
                    <span >고객의 성공적인 비즈니스를 위한 최고의 IT 인프라 관리 솔루션 개발, 공급</p>
                <div class="btns" >
                    <a href="${path}/serviceguide">서비스 안내</a>
                </div>
            </div>
            <div class="swiper-slide slide2">
                <h2 >확장성 및 사용 편의성</h2>
                <p>
                                <span >관제 대상 유형, 수량과 상관없이 유연한 확장을 지원하고 자동화 기능으로 관리자 업무 간소화
                </p>
                <div class="btns" >
                    <a href="${path}/serviceguide">서비스 안내</a>
                </div>
            </div>
            <div class="swiper-slide slide3">
                <h2 >장애 사전 예방을 위한 자동화된 탐지와 예측</h2>
                <p>
                    <span >향후 사용량, 가용성 예측 및 이상/위험 징후의 사전 예측</p>
                <div class="btns" >
                    <a href="${path}/serviceguide">서비스 안내</a>
                </div>
            </div>
        </div>
    </div>
    <div class="swiper-pagination"></div>
</div>
<!-- // main -->

<script>

    var mainSwiper = new Swiper('.main .swiper-container', {
        effect: "fade",
        fadeEffect: { crossFade: true },
        loop:true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".main .swiper-pagination",
            clickable: true,
        },
        on: {
            slideChange: function () {
                //console.log(this.realIndex)
                //$('.main .pager nav a').eq(this.realIndex).addClass('active').siblings().removeClass('active');
            }
        }
    });

    window.onload = function(){
        AOS.init({
            easing: 'ease-out-back',
            duration: 1000
        });
        $('.main').addClass('active');
    }

</script>

<%@include file="include/footer.jsp" %>