<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<section class="content">
    <div class="row">
        <!-- left column -->
        <div class="col-md-12">
            <!-- general form elements -->

            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">사용자현황</h3>
                </div>
                <div class="box-body">

                    <table class="table table-bordered">
                        <tr>
                            <th scope="col" style="width: 57px">사용자명</th>
                            <th scope="col" style="width: 57px">이메일</th>
                            <th scope="col" style="width: 57px">등급</th>
                            <th scope="col" style="width: 57px">전화번호</th>
                            <th scope="col" style="width: 57px">사업장명</th>
                            <th scope="col" style="width: 57px">사업자등록번호</th>
                            <th scope="col" style="width: 57px">가입일자</th>
                            <th scope="col" style="width: 57px">주소</th>
                            <th scope="col" style="width: 57px">전체<br/>가용장비</th>
                            <th scope="col" style="width: 57px">등록장비</th>
                            <th scope="col" style="width: 57px">사용율</th>
                            <th scope="col" style="width: 57px">사용금액</th>
                            <th scope="col" style="width: 57px">미납금액</th>
                            <th scope="col" style="width: 57px">미납횟수</th>
                            <th scope="col" style="width: 57px">상태</th>
                            <th scope="col" style="width: 57px">변동일자</th>
                            <th scope="col" style="width: 57px">비고</th>
                        </tr>

                        <c:forEach items="${list}" var="guide">
                            <tr>
                                <td scope="col">${guide.membername}</td>
                                <td scope="col">${guide.email}</td>
                                <td scope="col">${guide.licensegrade}</td>
                                <td scope="col">${guide.celltel}</td>
                                <td>${guide.businessname}</td>
                                <td>${guide.businessnumber}</td>
                                <td>${guide.joindate}</td>
                                <td>${guide.zipaddress}</td>
                                <td>${guide.totalsoluble}</td>
                                <td>${guide.totalvolume}</td>
                                <td>${guide.userate}</td>
                                <td>${guide.totalcharge}</td>
                                <td>${guide.addvolume}</td>
                                <td>${guide.addcharge}</td>
                                <td>${guide.postnumber}</td>
                                <td>${guide.address}</td>
                            </tr>

                        </c:forEach>

                    </table>

                </div>

            </div>
        </div>
        <!--/.col (left) -->

    </div>
    <!-- /.row -->
</section>

<script type="text/javascript">

</script>

<%@include file="../include/footer.jsp" %>