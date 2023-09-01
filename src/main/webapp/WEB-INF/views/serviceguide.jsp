<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="include/header.jsp" %>

<div class="container">
    <h3 class="h3 text-center">NETIS 클라우드 서비스 안내</h3>
    <div class="max-inner">
        <div class="table-type2">
            <table>
                <thead>
                <tr>
                    <th>솔루션/요금</th>
                    <th>Free</th>
                    <th>Basic</th>
                    <th>Pro</th>
                    <th>Enterprise</th>
                </tr>
                <tr>
                    <th>요금</th>
                    <th>무료</th>
                    <th>₩400,000 / 월</th>
                    <th>₩700,000 / 월</th>
                    <th>별도 협의</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>네트워크</th>
                    <td>
                        <div class="sv-txt mb10">장비 5대 이하<br>기본 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal1');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">장비 25대 이하<br>기본 + 부가기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal1');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">장비 50대 이하<br>기본 + 부가 + 고급 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal1');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">장비 100대 이상<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal1');">자세히</button>
                    </td>
                </tr>
                <tr>
                    <th>서버</th>
                    <td>
                        <div class="sv-txt mb10"> 5대 이하<br>기본 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal2');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">25대 이하<br>기본 + 부가기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal2');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">50대 이하<br>기본 + 부가 + 고급 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal2');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">100대 이상<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal2');">자세히</button>
                    </td>
                </tr>
                <tr>
                    <th>무선네트워크</th>
                    <td>
                        <div class="sv-txt mb10">5대 이하(단독형)<br>2대 이하(무선컨트롤러포함)</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal3');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">25대 이하(단독형)<br>기본 + 부가 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal3');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">50개 이하(단독형)<br>기본 + 부가 + 고급 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal3');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">100대 이상<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal3');">자세히</button>
                    </td>
                </tr>
                <tr>
                    <th>데이터 베이스</th>
                    <td>
                        <div class="sv-txt mb10">5개 이하<br>기본 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal4');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">25개 이하<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal4');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">50개 이하<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal4');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">100대 이상<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal4');">자세히</button>
                    </td>
                </tr>
                <tr>
                    <th>환경 센서</th>
                    <td>
                        <div class="sv-txt mb10">5대 이하(단독 감시형)<br>기본 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal5');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">25대 이하(단독 감시형)<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal5');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">50대 이하(단독 감시형)<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal5');">자세히</button>
                    </td>
                    <td>
                        <div class="sv-txt mb10">환경 센서 100개 이상<br>전체 기능 제공</div>
                        <button class="btn btn2 btn-m" onclick="javascript:popupOpen('Modal5');">자세히</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="desc1">
            <strong>※ 위 라이선스 정책은 개별 인프라 단독 감시 기준 정책이며 여러 인프라를 통합 모니터링하는 경우 아래의 정책 적용</strong>
            <div>1. 라이선스는 Credit 단위로 적용 Free/Basic/Pro 각 5/25/50/100 Credit 기본 제공<br>
                2. 추가 Credit 구매  5 Credit / ₩100,000, 10 Credit 180,000제공<br>
                3.네트워크 장비, 서버, 데이터베이스 각 1대당 1 Credit 적용<br>
                4. 무선 Ap/환경 센서 각 2대당 1Credit 적용<br>
                5. 무선 컨트롤러 / RTU 각 1대당 5 Credit 적용<br>
                6.트래픽 분석 라이선스 1,000 Flow/min 5Credit, 5,000 Flow/min 25 Credit, 10,000 Flow/min 50 Credit 적용
            </div>
        </div>

    </div>


</div>

<div class="popup-wrap" id="Modal1">
    <div class="bg-popup"></div>
    <div class="popup-box">
        <div class="popup-cont">
            <div class="popup" style="width:1100px">
                <div class="popup-head">
                    <h3 class="h3-popup">네트워크</h3>
                    <button class="btn-close" onclick="javascript:popupClose('Modal1');"><span class="hidden">닫기</span></button>
                </div>
                <div class="popup-body ">
                    <div class="table-type2">
                        <table>
                            <colgroup>
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>지원 기능</th>
                                <th>Free</th>
                                <th>Basic</th>
                                <th>Pro</th>
                                <th>Enterprise</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>데이터 보관 기간</td>
                                <td>1일</td>
                                <td>30일</td>
                                <td>30일</td>
                                <td>별도 협의</td>
                            </tr>
                            <tr>
                                <td>구성/성능/장애 정보</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>감시 정책 설정</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Syslog/Trap 모니터링</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>보고서</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>대시보드</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 비교</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>사용자 지정 OID 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Configuration 백업</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>L4 VIP/RIP 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>자산관리</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>문자메시지 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>이메일/메신저 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>TCP Port / URL 감시</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Rack 실장 관리</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 예측</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>상관 분석</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="popup-wrap" id="Modal2">
    <div class="bg-popup"></div>
    <div class="popup-box">
        <div class="popup-cont">
            <div class="popup" style="width:1100px">
                <div class="popup-head">
                    <h3 class="h3-popup">서버</h3>
                    <button class="btn-close" onclick="javascript:popupClose('Modal2');"><span class="hidden">닫기</span></button>
                </div>
                <div class="popup-body ">
                    <div class="table-type2">
                        <table>
                            <colgroup>
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>지원 기능</th>
                                <th>Free</th>
                                <th>Basic</th>
                                <th>Pro</th>
                                <th>Enterprise</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>데이터 보관 기간</td>
                                <td>1일</td>
                                <td>30일</td>
                                <td>30일</td>
                                <td>별도 협의</td>
                            </tr>
                            <tr>
                                <td>구성/성능/장애 정보</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>감시 정책 설정</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Syslog/Trap 모니터링</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>보고서</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>대시보드</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 비교</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>사용자 지정 OID 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Configuration 백업</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>L4 VIP/RIP 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>자산관리</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>문자메시지 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>이메일/메신저 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>TCP Port / URL 감시</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Rack 실장 관리</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 예측</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>상관 분석</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="popup-wrap" id="Modal3">
    <div class="bg-popup"></div>
    <div class="popup-box">
        <div class="popup-cont">
            <div class="popup" style="width:1100px">
                <div class="popup-head">
                    <h3 class="h3-popup">무선네트워크</h3>
                    <button class="btn-close" onclick="javascript:popupClose('Modal3');"><span class="hidden">닫기</span></button>
                </div>
                <div class="popup-body ">
                    <div class="table-type2">
                        <table>
                            <colgroup>
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>지원 기능</th>
                                <th>Free</th>
                                <th>Basic</th>
                                <th>Pro</th>
                                <th>Enterprise</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>데이터 보관 기간</td>
                                <td>1일</td>
                                <td>30일</td>
                                <td>30일</td>
                                <td>별도 협의</td>
                            </tr>
                            <tr>
                                <td>구성/성능/장애 정보</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>감시 정책 설정</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Syslog/Trap 모니터링</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>보고서</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>대시보드</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 비교</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>사용자 지정 OID 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Configuration 백업</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>L4 VIP/RIP 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>자산관리</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>문자메시지 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>이메일/메신저 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>TCP Port / URL 감시</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Rack 실장 관리</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 예측</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>상관 분석</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="popup-wrap" id="Modal4">
    <div class="bg-popup"></div>
    <div class="popup-box">
        <div class="popup-cont">
            <div class="popup" style="width:1100px">
                <div class="popup-head">
                    <h3 class="h3-popup">데이터 베이스</h3>
                    <button class="btn-close" onclick="javascript:popupClose('Modal4');"><span class="hidden">닫기</span></button>
                </div>
                <div class="popup-body ">
                    <div class="table-type2">
                        <table>
                            <colgroup>
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>지원 기능</th>
                                <th>Free</th>
                                <th>Basic</th>
                                <th>Pro</th>
                                <th>Enterprise</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>데이터 보관 기간</td>
                                <td>1일</td>
                                <td>30일</td>
                                <td>30일</td>
                                <td>별도 협의</td>
                            </tr>
                            <tr>
                                <td>구성/성능/장애 정보</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>감시 정책 설정</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Syslog/Trap 모니터링</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>보고서</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>대시보드</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 비교</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>사용자 지정 OID 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Configuration 백업</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>L4 VIP/RIP 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>자산관리</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>문자메시지 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>이메일/메신저 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>TCP Port / URL 감시</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Rack 실장 관리</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 예측</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>상관 분석</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="popup-wrap" id="Modal5">
    <div class="bg-popup"></div>
    <div class="popup-box">
        <div class="popup-cont">
            <div class="popup" style="width:1100px">
                <div class="popup-head">
                    <h3 class="h3-popup">환경 센서</h3>
                    <button class="btn-close" onclick="javascript:popupClose('Modal5');"><span class="hidden">닫기</span></button>
                </div>
                <div class="popup-body ">
                    <div class="table-type2">
                        <table>
                            <colgroup>
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                                <col style="width:20%">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>지원 기능</th>
                                <th>Free</th>
                                <th>Basic</th>
                                <th>Pro</th>
                                <th>Enterprise</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>데이터 보관 기간</td>
                                <td>1일</td>
                                <td>30일</td>
                                <td>30일</td>
                                <td>별도 협의</td>
                            </tr>
                            <tr>
                                <td>구성/성능/장애 정보</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>감시 정책 설정</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Syslog/Trap 모니터링</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>보고서</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>대시보드</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 비교</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>사용자 지정 OID 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Configuration 백업</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>L4 VIP/RIP 성능</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>자산관리</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>문자메시지 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>이메일/메신저 알림</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>TCP Port / URL 감시</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>Rack 실장 관리</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>성능 예측</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>상관 분석</td>
                                <td>-</td>
                                <td>-</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<script>

    $(document).ready(function() {

    });

</script>

<%@include file="include/footer.jsp" %>