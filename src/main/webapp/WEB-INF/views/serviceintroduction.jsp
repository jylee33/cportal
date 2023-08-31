<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="include/header.jsp" %>

<div class="container">
    <h3 class="h3 text-center">서비스 소개</h3>
    <div class="max-inner2">
        <div class="tabs1 sticky">
            <a href="#s1" class="active">네트워크관리</a>
            <a href="#s2">서버 관리</a>
            <a href="#s3">무선 관리</a>
            <a href="#s4">시설 관리</a>
        </div>
        <div class="service s1" id="s1">
            <div class="img" data-aos="fade-up" data-aos-delay="100"><img src="${path}/resources/images/common/img_service1.png"></div>
            <div class="info">
                <h3 data-aos="fade-up" data-aos-delay="300">네트워크 관리</h3>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>실시간 모니터링</dt>
                    <dd>- 실시간 구성, 성능, 장애 모니터링 제공<br>
                        - 토폴로지상에서 실시간 성능 및 장애 모니터링</dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>장애관리</dt>
                    <dd>- 장애 내용 선택 후 관련 정보 연계 분석<br>
                        - 장애 조치 관리(접수/처리/등록/완료/이력)
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>성능관리</dt>
                    <dd>- 장비/회선 성능 현황 정보<br>
                        - CPU/Memory/bps/pps 등<br>
                        - 성능 항목 그래프 및 상세 데이터
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>구성관리</dt>
                    <dd>- 회선 장애 감지 및 성능 항목 수집 정보 설정<br>
                        - 네트워크 구성 변경 이력 관리
                    </dd>
                </dl>
            </div>
        </div>
        <div class="service s2" id="s2">
            <div class="img" data-aos="fade-up" data-aos-delay="100"><img src="${path}/resources/images/common/img_service2.png"></div>
            <div class="info">
                <h3 data-aos="fade-up" data-aos-delay="300">서버 관리</h3>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>서버 현황 조회</dt>
                    <dd>- 전체 관리 대상 서버 현황 조회<br>
                        - 서버 운영 현황 종합적 모니터링
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>서버 현황 조회</dt>
                    <dd>- 서버 자원 성능에 대한 현황 및 이력 조회<br>
                        - 자원 성능 요약 및 추이 그래프, 데이터 제공
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>장애 관리</dt>
                    <dd>- 서버 동작 및 에이전트 모니터링<br>
                        - 서버 리소스 과 점유 모니터링<br>
                        - 로그 / 파일 상태 감지 모니터링
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>프로세스 관리</dt>
                    <dd>- 감시 대상 프로세스 선정 및 구동 상태 모니터링<br>
                        - 좀비 프로세스 현황 모니터링
                    </dd>
                </dl>
            </div>
        </div>
        <div class="service s1" id="s3">
            <div class="img" data-aos="fade-up" data-aos-delay="100"><img src="${path}/resources/images/common/img_service3.png"></div>
            <div class="info">
                <h3 data-aos="fade-up" data-aos-delay="300">무선 관리</h3>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>무선랜 종합현황</dt>
                    <dd>- 무선랜 컨트롤러 /AP 운영 관제 <br>
                        - AP 및 그룹별 무선 트래픽, 클라이언트 접속 현황</dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>성능관리</dt>
                    <dd>- 무선 트래픽(SSID/채널 별) 사용량 실시간 모니터링 및
                        <br>&nbsp;&nbsp;&nbsp;이력 조회(In/Out bps, pps)<br>
                        - 무선 AP의 CPU, 메모리 리소스 모니터링
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>단열접속관리</dt>
                    <dd>- 무선 AP별 접속 단말 현황 정보<br>
                        - 단말 IP, 호스트, MAC, 접속 시간, 인증 여부 등
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>AP 제어</dt>
                    <dd>- TR 069 프로토콜 기반 AP 구동 제어
                    </dd>
                </dl>
            </div>
        </div>
        <div class="service s2" id="s4">
            <div class="img" data-aos="fade-up" data-aos-delay="100"><img src="${path}/resources/images/common/img_service4.jpg"></div>
            <div class="info">
                <h3 data-aos="fade-up" data-aos-delay="300">시설 관리</h3>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>센서 토폴로지</dt>
                    <dd>- 센서 상태 표현, 주장치(RTU)관리 <br>
                        - 전산실 도면 배경 토폴로지 관리</dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>센서 관리</dt>
                    <dd>- 주장치 및 연결 센서 상태 관리<br>
                        - 접점, RS-232/485, TCP/IP 등 다양한 연결 유형 <br>&nbsp;&nbsp;&nbsp;센서 모니터링
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>온·습도 전력관리</dt>
                    <dd>- 실시간 온·습도 , 전압, 전류 모니터링<br>
                        - 측정 데이터 이력 및 통계 조회
                    </dd>
                </dl>
                <dl data-aos="fade-up" data-aos-delay="400">
                    <dt>항온항습기 /UPS 관리
                    </dt>
                    <dd>- 항온항습기 운영 및 동작 관리<br>
                        - UPS 동작 및 입/출력 전력 관리
                    </dd>
                </dl>
            </div>
        </div>

    </div>


</div>

<%@include file="include/footer.jsp" %>


<script>

    $(document).ready(function() {

        $('.tabs1 a').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        })
        AOS.init({
            duration: 700,
            once: true
        });

    });

</script>

