package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.LoginDTO;
import com.hamonsoft.cportal.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Controller
@RequestMapping("/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("login")
    public void loginGet(@ModelAttribute("dto") LoginDTO dto) {
        logger.info("call login get ......................");
    }

    @PostMapping("loginPost")
    public void loginPost(LoginDTO dto, HttpSession session, Model model) {
        logger.info("call login post ......................");

        Member member = userService.login(dto);

        if (member == null) {
            return;
        }

        model.addAttribute("member", member);

        if (dto.isUseCookie()) {
            int amount = 60 * 60 * 24 * 7;
            Date sessionLimit = new Date(System.currentTimeMillis() + (1000 * amount));

            Map<String, Object> paramMap = new HashMap<>();
            paramMap.put("uid", member.getEmail());
            paramMap.put("sessionId", session.getId());
            paramMap.put("next", sessionLimit);

            userService.keepLogin(paramMap);
        }

    }

    @GetMapping("logout")
    public String logout(HttpServletRequest request,
                         HttpServletResponse response, HttpSession session) throws Exception {

        logger.info("logout.................................");

        Object obj = session.getAttribute("login");

        if (obj != null) {
            Member member = (Member) obj;
            session.removeAttribute("login");
            session.invalidate();

            String cpath = request.getContextPath();
            Cookie loginCookie = WebUtils.getCookie(request, "loginCookie");

            if (loginCookie != null) {
                logger.info("logout.................................4");
                loginCookie.setPath(cpath);
                loginCookie.setMaxAge(0);
                response.addCookie(loginCookie);

                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("uid", member.getEmail());
                paramMap.put("sessionId", session.getId());
                paramMap.put("next", new Date());

                userService.keepLogin(paramMap);
            }

        }

        return "user/logout";
    }

    @GetMapping("findid")
    public void findid(Model model) {
        logger.info("call findid ......................");
    }

    @PostMapping("findidresult")
    public void findidresult(Member member, Model model) {
        logger.info("call findidresult ......................");

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("membername", member.getMembername());
        paramMap.put("celltel", member.getCelltel());

        String uid = userService.findId(paramMap);
        model.addAttribute("uid", uid);
    }

    @GetMapping("findpw")
    public void findpw(Model model) {
        logger.info("call findpw ......................");
    }

    @PostMapping("findpwresult")
    public void findpwresult(Member member, Model model) {
        logger.info("call findpwresult ......................");

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("membername", member.getMembername());
        paramMap.put("celltel", member.getCelltel());
        paramMap.put("email", member.getEmail());

        // random 문자열 생성
        StringBuffer buffer = new StringBuffer();
        Random random = new Random();

        String chars[] = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");

        for ( int i=0 ; i<6 ; i++ ) {
            buffer.append(chars[random.nextInt(chars.length)]);
        }
        String pw = buffer.toString();

        System.out.println("PW --------------- " + pw);

        paramMap.put("pw", pw);

        userService.updatePw(paramMap);
        model.addAttribute("email", member.getEmail());
        model.addAttribute("pw", pw);
    }

    //
    @GetMapping("update_emailcertificationyn")
    public void update_emailcertificationyn(@RequestParam("email") String email, Model model) {
        logger.info("call update_emailcertificationyn Get ......................");

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("email", email);

        userService.update_emailcertificationyn(paramMap);
        model.addAttribute("email", email);
    }

}
