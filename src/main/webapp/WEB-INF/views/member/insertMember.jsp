<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<section class="content">

    <form role="form" method="post">
        <div class="box-body">
            <div class="form-group">
                <label>email</label>
                <input type="text"
                       name='email' class="form-control" placeholder="email">
            </div>
            <div class="form-group">
                <label>membername</label>
                <input type="text"
                       name="membername" class="form-control" placeholder="membername">
            </div>
            <div class="form-group">
                <label>celltel</label>
                <input type="number"
                       name="celltel" class="form-control" placeholder="celltel">
            </div>
            <div class="form-group">
                <label>password</label>
                <input type="password"
                       name="password" class="form-control" placeholder="password">
            </div>
            <div class="form-group">
                <label>businessname</label>
                <input type="text"
                       name="businessname" class="form-control" placeholder="businessname">
            </div>
            <div class="form-group">
                <label>businessnumber</label>
                <input type="number"
                       name="businessnumber" class="form-control" placeholder="businessnumber">
            </div>
            <div class="form-group">
                <label>licensegrade</label>
                <div class="input-group has-validation">
                    <select id="licensegrade" name="licensegrade">
                        <option value="1">Free</option>
                        <option value="2">Basic</option>
                        <option value="3">Pro</option>
                        <option value="4">Enterprise</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>companyphone</label>
                <input type="number"
                       name="companyphone" class="form-control" placeholder="companyphone">
            </div>
            <div class="form-group">
                <label>emailcertificationyn</label>
                <div class="input-group has-validation">
                    <select id="emailcertificationyn" name="emailcertificationyn">
                        <option value="0">n</option>
                        <option value="1">y</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>withdrawalyn</label>
                <div class="input-group has-validation">
                    <select id="withdrawalyn" name="withdrawalyn">
                        <option value="1">y</option>
                        <option value="0">n</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>withdrawaldate</label>
                <input type="number"
                       name="withdrawaldate" class="form-control" placeholder="withdrawaldate">
            </div>
            <div class="form-group">
                <label>joindate</label>
                <input type="number"
                       name="joindate" class="form-control" placeholder="joindate">
            </div>
            <div class="form-group">
                <label>updatedBy</label>
                <input type="text"
                       name="updatedBy" class="form-control" placeholder="updatedBy">
            </div>

        </div>
        <!-- /.box-body -->

        <div class="box-footer">
            <button type="submit" class="btn btn-primary">Submit</button>
        </div>
    </form>

</section>

<script type="text/javascript">
    function send_mail(){
        var mailto = $('#mailto').val();
        window.open("mail/test_mail?mailto=" + mailto, "", "width=370, height=360, resizable=no, scrollbars=no, status=no");
    }
</script>

<%@include file="../include/footer.jsp" %>