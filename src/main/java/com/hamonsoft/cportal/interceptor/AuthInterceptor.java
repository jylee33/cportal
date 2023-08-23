package com.hamonsoft.cportal.interceptor;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthInterceptor extends HandlerInterceptorAdapter {

    private static final Logger logger = LoggerFactory.getLogger(AuthInterceptor.class);

    @Autowired
    UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();

        if (session.getAttribute("login") == null) {
            logger.info("current user is not logined");

            saveDest(request);

            String cpath = request.getContextPath();

            Cookie loginCookie = WebUtils.getCookie(request, "loginCookie");

            if (loginCookie != null) {
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("value", loginCookie.getValue());

                Member member = userService.checkUserWithSessionKey(paramMap);

                logger.info("MEMBER : " + member);

                if (member != null) {
                    session.setAttribute("login", member);
                    return true;
                }
            }

            response.sendRedirect(cpath + "/user/login");
            return false;
        }
        return true;
    }

    private void saveDest(HttpServletRequest request) {
        String uri = request.getRequestURI();

        String query = request.getQueryString();

        if (query == null || query.equals("null")) {
            query = "";
        } else {
            query = "?" + query;
        }

        if (request.getMethod().equals("GET")) {
            logger.info("dest : " + uri + query);
            request.getSession().setAttribute("dest", uri + query);
        }
    }

}
