<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>

<%@include file="../include/jQWidgets.jsp" %>


<div class="container">
    <table id="dataTable" border="1">
        <thead>
        <tr>
            <th align="left">First Name</th>
            <th align="left">Last Name</th>
            <th align="left">Product</th>
            <th align="right">Price</th>
            <th align="right">Quantity</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Ian</td>
            <td>Devling</td>
            <td>Espresso Truffle</td>
            <td>$1.75</td>
            <td>8</td>
        </tr>
        <tr>
            <td>Nancy</td>
            <td>Wilson</td>
            <td>Cappuccino</td>
            <td>$5.00</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Cheryl</td>
            <td>Nodier</td>
            <td>Caffe Americano</td>
            <td>$2.50</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Martin</td>
            <td>Saavedra</td>
            <td>Caramel Latte</td>
            <td>$3.80</td>
            <td>11</td>
        </tr>
        <tr>
            <td>Guylene</td>
            <td>Bjorn</td>
            <td>Green Tea</td>
            <td>$1.50</td>
            <td>8</td>
        </tr>
        <tr>
            <td>Andrew</td>
            <td>Burke</td>
            <td>Caffe Espresso</td>
            <td>$3.00</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Regina</td>
            <td>Murphy</td>
            <td>White Chocolate Mocha</td>
            <td>$3.60</td>
            <td>6</td>
        </tr>
        <tr>
            <td>Michael</td>
            <td>Murphy</td>
            <td>Caramel Latte</td>
            <td>$3.80</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Petra</td>
            <td>Bein</td>
            <td>Caffe Americano</td>
            <td>$2.50</td>
            <td>7</td>
        </tr>
        <tr>
            <td>Nancy</td>
            <td>Nodier</td>
            <td>Caffe Latte</td>
            <td>$4.50</td>
            <td>10</td>
        </tr>
        <tr>
            <td>Peter</td>
            <td>Devling</td>
            <td>Green Tea</td>
            <td>$1.50</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Beate</td>
            <td>Saylor</td>
            <td>Espresso con Panna</td>
            <td>$3.25</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Shelley</td>
            <td>Nodier</td>
            <td>Peppermint Mocha Twist</td>
            <td>$4.00</td>
            <td>7</td>
        </tr>
        <tr>
            <td>Nancy</td>
            <td>Murphy</td>
            <td>Peppermint Mocha Twist</td>
            <td>$4.00</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Lars</td>
            <td>Wilson</td>
            <td>Caffe Espresso</td>
            <td>$3.00</td>
            <td>11</td>
        </tr>
        </tbody>
    </table>
</div>
</div>

<script type="text/javascript">
    $(document).ready(function () {
        $("#dataTable").jqxDataTable(
            {
                altRows: true,
                sortable: true,
                columns: [
                    { text: 'First Name', dataField: 'First Name', width: 100 },
                    { text: 'Last Name', dataField: 'Last Name', width: 100 },
                    { text: 'Product', dataField: 'Product', width: 180 },
                    { text: 'Unit Price', dataField: 'Price', width: 90, align: 'right', cellsAlign: 'right', cellsFormat: 'c2' },
                    { text: 'Quantity', dataField: 'Quantity', width: 80, align: 'right', cellsAlign: 'right' }
                ]
            });
    });
</script>

<%@include file="../include/footer.jsp" %>