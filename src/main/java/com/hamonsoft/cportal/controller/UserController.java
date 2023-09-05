package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberTaxInformation;
import com.hamonsoft.cportal.dto.LoginDTO;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
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

    @GetMapping(value = "info")
    public void info(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String email = member.getEmail();

        logger.info("call user info --------------- email : " + email);

        MemberTaxInformation info = userService.info(member);
        model.addAttribute("info", info);

    }

    @Transactional
    @PostMapping("chginforesult")
    public void chginforesult(MemberTaxInformation info, Model model) {
        logger.info("call chginforesult ......................");
        logger.info(info.toString());

        int result1 = userService.chgmember(info);
        logger.info("userService.chgmember result ...................... " + result1);
        int result2 = userService.chgtaxinformation(info);
        logger.info("userService.chgtaxinformation result ...................... " + result2);

        int result = result1 & result2;
        logger.info("result ...................... " + result2);

        model.addAttribute("result", result);
    }

    @GetMapping(value = "chgpw")
    public void chgpw(HttpServletRequest request, Model model) {
        logger.info("call chgpw ......................");

        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String email = member.getEmail();

        model.addAttribute("email", email);

    }

    @PostMapping("chgpwresult")
    public String chgpwresult(Member member, Model model) {
        logger.info("call chgpwresult ......................");
        logger.info(member.toString());

        ResultDto resultDto = userService.chgpw(member);
        if (resultDto.getTRAN_STATUS() == 1) {
            model.addAttribute("result", "success");
        } else {
            model.addAttribute("result", "fail");
            model.addAttribute("reason", resultDto.getREASON());

            return "/user/chgpw";
        }
        return "/user/chgpwresult";
    }

    @GetMapping(value = "withdrawal")
    public void withdrawal(HttpServletRequest request, Model model) {
        logger.info("call withdrawal ......................");

        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String email = member.getEmail();
        String pw = member.getPassword();

        model.addAttribute("email", email);
        model.addAttribute("pw", pw);
    }

    @PostMapping("withdrawalresult")
    public void withdrawalresult(Member member, Model model) {
        logger.info("call withdrawalresult ......................");
        logger.info(member.toString());
        String email = member.getEmail();
        String strnow = new SimpleDateFormat("yyyyMMdd").format(new Date());
        logger.info(strnow);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("email", email);
        paramMap.put("strnow", strnow);

        int result = userService.withdrawal(paramMap);
        logger.info("result ...................... " + result);
        model.addAttribute("result", result);
    }

}
