<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html xmlns:th="http://www.thymeleaf.org">
<body>
<h3>${data}</h3>
<p th:text="'hello ' + ${name}">hello! empty</p>
</body>
</html>