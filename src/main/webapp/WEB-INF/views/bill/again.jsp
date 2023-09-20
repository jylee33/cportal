<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<div class="container">
<%--    <button class="btn large block" id="again">재결제</button>--%>
</div>



<script>

    $(document).ready(function() {

        var customer_uid = "hamonsoft_1694665088551";
        var paid_amount = 1;

        $.ajax({
            url: "${path}/iamport/again",
            type: 'POST',
            datatype: 'json',
            data: {
                email: "${email}",
                // customer_uid: customer_uid,
                // paid_amount: paid_amount
            }
        }).done(function(result){
            console.log("rsesult", result);
        }).fail(function(error){
            alert(JSON.stringify(error));
        });

        self.location = "${path}/user/info";

        <%--$("#again").on("click", function (e) {--%>
        <%--    $.ajax({--%>
        <%--        url: "${path}/iamport/again",--%>
        <%--        type: 'POST',--%>
        <%--        datatype: 'json',--%>
        <%--        data: {--%>
        <%--            email: "${email}",--%>
        <%--            // customer_uid: customer_uid,--%>
        <%--            // paid_amount: paid_amount--%>
        <%--        }--%>
        <%--    }).done(function(result){--%>
        <%--        console.log("rsesult", result);--%>
        <%--    }).fail(function(error){--%>
        <%--        alert(JSON.stringify(error));--%>
        <%--    });--%>
        <%--});--%>

    });

</script>

<%@include file="../include/footer.jsp" %>