<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="include/header.jsp" %>


<div class="container">
    <div class="max-inner3">
        <div class="h3-head">
            <h3 class="h3">NETIS 자료실</h3>
        </div>
        <div class="tabs">
            <a href="#" class="active">메뉴얼 다운로드</a>
            <a href="#">Agent 설치</a>
            <a href="#">기타</a>
        </div>

        <div class="tab-cont">
            <div class="cont">
                <div class="files">
                    <ul>
                        <li>
                            <div class="item">
                                <h4>사용자 메뉴얼</h4>
                                <div class="txt">
                                    Index 1<br>Index 2<br>Index 3<br>Index 4
                                </div>
                                <a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a>
                            </div>
                        </li>
                        <li>
                            <div class="item">
                                <h4>Agent 설치 메뉴얼</h4>
                                <div class="txt">
                                    Index 1<br>Index 2<br>Index 3<br>Index 4
                                </div>
                                <a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a>
                            </div>
                        </li>
                        <li>
                            <div class="item">
                                <h4>Gateway 메뉴얼</h4>
                                <div class="txt">
                                    Index 1<br>Index 2<br>Index 3<br>Index 4
                                </div>
                                <a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="cont" style="display: none;">
                <h3 class="h3">Linux</h3>
                <div class="files">
                    <ul>
                        <li>
                            <div class="item">
                                <h4>Cent OS</h4>
                                <div class="table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>버전</th>
                                            <th>다운로드</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>5.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>6.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>7.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>8.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </li>
                        <li>
                            <div class="item">
                                <h4>RedHat Enterprise Linux</h4>
                                <div class="table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>버전</th>
                                            <th>다운로드</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>5.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>6.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>7.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>8.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </li>
                        <li>
                            <div class="item">
                                <h4>Ubuntu</h4>
                                <div class="table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>버전</th>
                                            <th>다운로드</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>14.04 LTS</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>16.04 LTS</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>18.04 LTS</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>20.04 LTS</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>22.04 LTS</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </li>
                        <li>
                            <div class="item">
                                <h4>Debian</h4>
                                <div class="table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>버전</th>
                                            <th>다운로드</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>5</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>7</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>8</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>9</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>10</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>11</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </li>
                    </ul>
                </div>

                <div class="files">
                    <ul>
                        <li>
                            <h3 class="h3">Unix</h3>
                            <div class="item">
                                <h4>Unix</h4>
                                <div class="table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>버전</th>
                                            <th>다운로드</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>X.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </li>
                        <li>
                            <h3 class="h3">Window</h3>
                            <div class="item">
                                <h4>Windows</h4>
                                <div class="table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>버전</th>
                                            <th>다운로드</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>X.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="cont" style="display: none;">
                <h3 class="h3">기타</h3>
                <div class="files">
                    <ul>
                        <li>
                            <div class="item">
                                <h4>Cent OS</h4>
                                <div class="table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>버전</th>
                                            <th>다운로드</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>5.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>6.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>7.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        <tr>
                                            <td>8.X</td>
                                            <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <script>
            $('.tabs a').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
                $('.tab-cont > div').eq($(this).index()).show().siblings().hide();
            })
        </script>

    </div>


</div>

<%@include file="include/footer.jsp" %>

<script>
    $(function(){
        $('.tabs1 a').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        })
        AOS.init({
            duration: 700,
            once: true
        });
    })
</script>

