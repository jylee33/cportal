<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="include/header.jsp" %>

<div class="container">
    <div class="max-inner2">
        <div class="h3-head">
            <h3 class="h3">NETIS 자료실</h3>
            <div class="right">
                <button class="btn"><i class="ico ico-download"></i> 메뉴얼 다운로드</button>
            </div>
        </div>

        <div class="table-type2">
            <table>
                <colgroup>
                    <col style="width:25%">
                    <col style="width:25%">
                    <col style="width:25%">
                    <col style="width:25%">
                </colgroup>
                <thead>
                <tr>
                    <th>제품</th>
                    <th>OS</th>
                    <th>버전</th>
                    <th>다운로드</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td rowspan="20">Linux</td>
                    <td rowspan="4">CentOS</td>
                    <td>5.x</td>
                    <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                </tr>
                <tr>
                    <td>6.x</td>
                    <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                </tr>
                <tr>
                    <td>7.x</td>
                    <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                </tr>
                <tr>
                    <td>8.x</td>
                    <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                </tr>
                <tr>
                    <td rowspan="4">RedHat Enterprise Linux</td>
                    <td>5.x</td>
                    <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                </tr>
                <tr>
                    <td>6.x</td>
                    <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                </tr>
                <tr>
                    <td>7.x</td>
                    <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                </tr>
                <tr>
                    <td>8.x</td>
                    <td><a href="#" class="btn btn-s"><i class="ico-download"></i> 다운로드 </a></td>
                </tr>
                <tr>
                    <td rowspan="5">Ubuntu</td>
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
                <tr>
                    <td rowspan="7">Debian</td>
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

