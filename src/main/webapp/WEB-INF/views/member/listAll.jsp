<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<div class="container">
    <div class="row">
        <!-- left column -->
        <div class="col-md-12">
            <!-- general form elements -->

            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">ALL MEMBER LIST</h3>
                </div>
                <div class="box-body">

                    <table class="table table-bordered">
                        <tr>
                            <th>email</th>
                            <th>membername</th>
                            <th>celltel</th>
                            <th>password</th>
                            <th>businessname</th>
                            <th>businessnumber</th>
                            <th>licensegrade</th>
                            <th>companyphone</th>
                            <th>emailcertificationyn</th>
                            <th>withdrawalyn</th>
                            <th>withdrawaldate</th>
                            <th>joindate</th>
                            <th>createdAt</th>
                            <th>updatedBy</th>
                            <th>updatedAt</th>
                        </tr>

                        <c:forEach items="${list}" var="member">

                            <tr>
                                <td>${member.email}</td>
                                <td>${member.membername}</td>
                                <td>${member.celltel}</td>
                                <td>${member.password}</td>
                                <td>${member.businessname}</td>
                                <td>${member.businessnumber}</td>
                                <td>${member.licensegrade}</td>
                                <td>${member.companyphone}</td>
                                <td>${member.emailcertificationyn}</td>
                                <td>${member.withdrawalyn}</td>
                                <td>${member.withdrawaldate}</td>
                                <td>${member.joindate}</td>
                                <td>${member.createdAt}</td>
                                <td>${member.updatedBy}</td>
                                <td>${member.updatedAt}</td>
                            </tr>

                        </c:forEach>

                    </table>

                </div>

            </div>
        </div>
        <!--/.col (left) -->

    </div>
    <!-- /.row -->
</div>>

<script>

</script>

<%@include file="../include/footer.jsp" %>