package com.hamonsoft.cportal.interceptor;

import com.hamonsoft.cportal.controller.MemberController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Component
public class LoginInterceptor extends HandlerInterceptorAdapter {

    private static final String LOGIN = "login";
    private static final Logger logger = LoggerFactory.getLogger(HandlerInterceptorAdapter.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.info("====================== LoginInterceptor BEGIN ============================================");
        HttpSession session = request.getSession();

        if (session.getAttribute(LOGIN) != null) {
            logger.info("clear login data before");
            session.removeAttribute(LOGIN);
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        logger.info("======================= LoginInterceptor END =============================================");

        HttpSession session = request.getSession();
        ModelMap modelMap = modelAndView.getModelMap();
        Object member = modelMap.get("member");

        if (member != null) {
            logger.info("new login success");
            session.setAttribute(LOGIN, member);
            String cpath = request.getContextPath();

            if (request.getParameter("useCookie") != null) {
                logger.info("remember me.......");
                Cookie loginCookie = new Cookie("loginCookie", session.getId());
                loginCookie.setPath(cpath);
                loginCookie.setMaxAge(60 * 60 * 24 * 7);    // 초단위, 1주일
                response.addCookie(loginCookie);
            }

//            response.sendRedirect(cpath);
            Object dest = session.getAttribute("dest");
//            response.sendRedirect(dest != null ? (String)dest : cpath);
        }
    }


}
