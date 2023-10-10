<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="include/header.jsp" %>
           
            <div class="container">
                <h3 class="h3 text-center">NETIS 클라우드 서비스 안내</h3>
                <div class="max-inner4">
                  
                  <div class="cloud-wrap">
                    <div class="kinds">
                      <div><p>공통</p></div>
                      <div><p>네트워크</p><img src="${path}/resources/images/common/ico_p1.png"><span>장비 1대당 1 Credit 적용</span></div>
                      <div><p>서버</p><img src="${path}/resources/images/common/ico_p2.png"><span>장비 1대당 1 Credit 적용</span></div>
                      <div><p>무선 네트워크</p><img src="${path}/resources/images/common/ico_p3.png"><span>무선 AP 2대당 1 Credit 적용<br>무선 컨트롤러 1대당 5 Credit 적용</span></div>
                      <div><p>데이터 베이스</p><img src="${path}/resources/images/common/ico_p4.png"><span>장비 1대당 1 Credit 적용</span></div>
                      <div><p>환경 센서</p><img src="${path}/resources/images/common/ico_p5.png"><span>RTU 1대당 5 Credit 적용<br>센서 2대당 1 Credit 적용</span></div>
                    </div>
                    <ul>
                      <li>
                        <div class="tit">FREE</div>
                        <div class="item-wrap">

                          <div class="item">
                            <div class="price">무료</div>
                            <div class="txt"><strong>5 Credit 제공</strong><br>
                              기본기능<br>데이터 1일 보관
                              </div>
                            <button class="btn" onclick="javascript:popupOpen('Modal1',1,1);">자세히보기</button>
                          </div>
                          <div class="item">
                            <div class="txt">구성/성능/장애 정보<br>Syslog/Trap 모니터링 등</div>
                          </div>
                          <div class="item">
                            <div class="txt">구성/성능/장애 정보<br>감시 정책 설정 등</div>
                          </div>
                          <div class="item">
                            <div class="txt">AP Controller 관리<br>감시 정책 설정 등</div>
                          </div>
                          <div class="item">
                            <div class="txt">Database 운영 현황  <br>Database 성능 관리 등</div>
                          </div>
                          <div class="item">
                            <div class="txt">항온항습기,온/습도 관리<br>UPS, 전력 관리 등</div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div class="tit">BASIC</div>
                        <div class="item-wrap">
                          <div class="item">
                            <div class="price"><small>월</small> ₩400,000 </div>
                            <div class="txt"><strong>25 Credit 이하</strong><br>Free 기능 모두 포함<br>데이터 30일 보관
                            </div>
                            <button class="btn" onclick="javascript:popupOpen('Modal1',1,2);">자세히보기</button>
                          </div>
                          <div class="item">
                            <div class="txt">대시보드, 성능비교<br>
                              Configuration 백업<br>
                              L4 VIP/RIP 성능 등
                              </div>
                          </div>
                          <div class="item">
                            <div class="txt">대시보드, 성능비교<br>
                              프로세스 감시, 로그 감시<br>
                              알람통보(문자/메일/메신저) 등
                              </div>
                          </div>
                          <div class="item">
                            <div class="txt">GIS 맵, 대시보드 <br>
                              Syslog/Trap 모니터링<br>
                              알람통보(문자/메일/메신저)
                              </div>
                          </div>
                          <div class="item">
                            <div class="txt">Database 운영 현황<br>
                              Database 성능 관리 등
                              </div>
                          </div>
                          <div class="item">
                            <div class="txt">대시보드 <br>
                              Syslog/Trap 모니터링<br>
                              알람통보(문자/메일/메신저) 등
                              </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div class="tit">PRO</div>
                        <div class="item-wrap">
                          <div class="item">
                            <div class="price"><small>월</small> ₩700,000 </div>
                            <div class="txt"><strong>50 Credit 이하</strong><br>Basic 기능 모두 포함<br>데이터 30일 보관
                            </div>
                            <button class="btn" onclick="javascript:popupOpen('Modal1',1,3);">자세히보기</button>
                          </div>
                          <div class="item">
                            <div class="txt">TCP Port / URL 감시<br>
                              Rack 실장 관리<br>
                              성능 예측/상관 분석 등 추가
                              </div>
                          </div>
                          <div class="item">
                            <div class="txt">TCP Port / URL 감시<br>
                              임계치가이드 추가
                              </div>
                          </div>
                          <div class="item">
                            <div class="txt">Basic기능 과 동일</div>
                          </div>
                          <div class="item">
                            <div class="txt">Basic기능 과 동일</div>
                          </div>
                          <div class="item">
                            <div class="txt">Basic기능 과 동일</div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div class="tit">ENTERPRISE</div>
                        <div class="item-wrap">
                          <div class="item">
                            <div class="price">별도 협의 </div>
                            <div class="txt"><strong>100 Credit 이상</strong><br>Pro 기능 모두 포함<br>&nbsp;
                            </div>
                            <button class="btn" onclick="javascript:popupOpen('Modal1',1,4);">자세히보기</button>
                          </div>
                          <div class="item last">
                            <div class="txt">
                              <strong>ㆍ100대 이상 대규모 인프라 관리 시</strong><br>
                              <strong>ㆍ데이터 보관 기간 별도 협의</strong>
                              </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                    <div class="desc1">
                        <strong>※ 위 라이선스 정책은 개별 인프라 단독 감시 기준 정책이며 여러 인프라를 통합 모니터링하는 경우 아래의 정책 적용</strong>
                        <div>1. 라이선스는 Credit 단위로 적용 Free/Basic/Pro 각 5/25/50/100 Credit 기본 제공<br>
                        2. 추가 Credit 구매  5 Credit / ₩100,000, 10 Credit 180,000제공<br>
                    3. 네트워크 장비, 서버, 데이터베이스 각 1대당 1 Credit 적용<br>
                4. 무선 Ap/환경 센서 각 2대당 1Credit 적용<br>
            5. 무선 컨트롤러 / RTU 각 1대당 5 Credit 적용
                        </div>
                    </div>

                </div>


            </div>


        </div>
        <!-- // wrap -->

        <div class="popup-wrap" id="Modal1">
            <div class="bg-popup"></div>
            <div class="popup-box">
                <div class="popup-cont">
                    <div class="popup" style="width:1100px">
                        <div class="popup-head">
                            <h3 class="h3-popup">
                              <span>네트워크</span>
                              <span style="display: none;">서버</span>
                              <span style="display: none;">무선네트워크</span>
                              <span style="display: none;">데이터베이스</span>
                              <span style="display: none;">환경센서</span>
                            </h3>
                            <button class="btn-close" onclick="javascript:popupClose('Modal1');"><span class="hidden">닫기</span></button>
                        </div>
                        <div class="popup-body ">
                          <div class="tabs type2">
                            <a href="#" class="active"><img src="${path}/resources/images/common/ico_p1.png"><span>네트워크관리</span></a>
                            <a href="#"><img src="${path}/resources/images/common/ico_p2.png"><span>서버관리</span></a>
                            <a href="#"><img src="${path}/resources/images/common/ico_p3.png"><span>무선네트워크관리</span></a>
                            <a href="#"><img src="${path}/resources/images/common/ico_p4.png"><span>데이터베이스관리</span></a>
                            <a href="#"><img src="${path}/resources/images/common/ico_p5.png"><span>환경센서관리</span></a>
                        </div>
                        <div class="cont-box">
                            <div class="table-type2 type2">
                              <table cellpadding="0" cellspacing="0" width="407">
                                <col>
                                <col>
                                <col span="4">
                                <thead>
                                <tr>
                                  <th>구분</th>
                                  <th>지원    기능</th>
                                  <th>Free</th>
                                  <th>Basic</th>
                                  <th>Pro</th>
                                  <th>Enterprise</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td rowspan="5">기본    기능</td>
                                  <td>데이터    보관 기간</td>
                                  <td>1일</td>
                                  <td>30일</td>
                                  <td>30일</td>
                                  <td>별도    협의</td>
                                </tr>
                                <tr>
                                  <td>구성/성능/장애    정보</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>감시    정책 설정</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>Syslog/Trap    모니터링</td>
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
                                  <td rowspan="7">부가    기능</td>
                                  <td>대시보드</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>성능    비교</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>사용자    지정 OID    성능</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>Configuration    백업</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>L4    VIP/RIP 성능</td>
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
                                  <td>알람통보(문자/메일/메신저)</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td rowspan="3">고급    기능</td>
                                  <td>TCP    Port / URL 감시</td>
                                  <td>-</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>Rack    실장    관리</td>
                                  <td>-</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>성능    예측/상관    분석</td>
                                  <td>-</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                              </tbody>
                              </table>
                            </div>

                            <div class="table-type2 type2">
                              <table  cellpadding="0" cellspacing="0" width="489">
                                <col>
                                <col>
                                <col span="4">
                                <thead>
                                <tr>
                                  <th>구분</th>
                                  <th>지원    기능</th>
                                  <th>Free</th>
                                  <th>Basic</th>
                                  <th>Pro</th>
                                  <th>Enterprise</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td rowspan="4">기본    기능</td>
                                  <td>데이터    보관 기간</td>
                                  <td>1일</td>
                                  <td>30일</td>
                                  <td>30일</td>
                                  <td>별도    협의</td>
                                </tr>
                                <tr>
                                  <td>구성/성능/장애    정보</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>감시    정책 설정</td>
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
                                  <td rowspan="6">부가    기능</td>
                                  <td>대시보드</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>성능    비교</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>프로세스    감시</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>로그    감시</td>
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
                                  <td>알람통보(문자/메일/메신저)</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td rowspan="2">고급    기능</td>
                                  <td>TCP    Port / URL 감시</td>
                                  <td>-</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>임계치가이드</td>
                                  <td>-</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                              </tbody>
                              </table>
                            </div>


                            <div class="table-type2 type2">
                              <table border="0" cellpadding="0" cellspacing="0" width="504">
                                <col>
                                <col>
                                <col span="4">
                                <thead>
                                <tr>
                                  <th>구분</th>
                                  <th>지원    기능</th>
                                  <th>Free</th>
                                  <th>Basic</th>
                                  <th>Pro</th>
                                  <th>Enterprise</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td rowspan="6">기본    기능</td>
                                  <td>데이터    보관 기간</td>
                                  <td>1일</td>
                                  <td>30일</td>
                                  <td>30일</td>
                                  <td>별도    협의</td>
                                </tr>
                                <tr>
                                  <td>AP    Controller 관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>AP 관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>AP 접속자    관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>감시    정책 설정</td>
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
                                  <td rowspan="4">부가    기능</td>
                                  <td>GIS    맵</td>
                                  <td>-</td>
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
                                  <td>Syslog/Trap    모니터링</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>알람통보(문자/메일/메신저)</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                              </tbody>
                              </table>
                            </div>

                            <div class="table-type2 type2">
                              <table border="0" cellpadding="0" cellspacing="0" width="451">
                                <col>
                                <col>
                                <col span="4">
                                <thead>
                                <tr>
                                  <th>구분</th>
                                  <th>지원    기능</th>
                                  <th>Free</th>
                                  <th>Basic</th>
                                  <th>Pro</th>
                                  <th>Enterprise</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td rowspan="5">기본    기능</td>
                                  <td>데이터    보관 기간</td>
                                  <td>1일</td>
                                  <td>30일</td>
                                  <td>30일</td>
                                  <td>별도    협의</td>
                                </tr>
                                <tr>
                                  <td>Database    운영    현황 관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>Database    성능    관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>SQL,    Lock, Session 관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>저장    공간 사용량 관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                              </tbody>
                              </table>
                            </div>

                            <div class="table-type2 type2">
                              <table border="0" cellpadding="0" cellspacing="0" width="451">
                                <col>
                                <col>
                                <col span="4">
                                <thead>
                                <tr>
                                  <th>구분</th>
                                  <th>지원    기능</th>
                                  <th>Free</th>
                                  <th>Basic</th>
                                  <th>Pro</th>
                                  <th>Enterprise</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td rowspan="5">기본    기능</td>
                                  <td>데이터    보관 기간</td>
                                  <td>1일</td>
                                  <td>30일</td>
                                  <td>30일</td>
                                  <td>별도    협의</td>
                                </tr>
                                <tr>
                                  <td>항온항습기,온/습도    관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>UPS,    전력    관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>화재, 누수    관리</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>감시    정책 설정</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td rowspan="3">부가    기능</td>
                                  <td>대시보드</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>Syslog/Trap    모니터링</td>
                                  <td>-</td>
                                  <td>O</td>
                                  <td>O</td>
                                  <td>O</td>
                                </tr>
                                <tr>
                                  <td>알람통보(문자/메일/메신저)</td>
                                  <td>-</td>
                                  <td>O</td>
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
        </div>


<%@include file="include/footer.jsp" %>