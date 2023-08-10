package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.service.MemberService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/member")
public class MemberController {

    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

    MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping(value = "")
    public void member(Model model) {
        logger.info("call member ---------------");
    }

    @GetMapping(value = "gettime")
    public String gettime(Model model) {
        logger.info("call gettime ---------------");
        String now = memberService.getTime();
        logger.info("now - " + now);
        return now;
    }

    @GetMapping(value = "selectMember")
    @ResponseBody
    public Member selectMember(@RequestParam("email") String email, Model model) {
        logger.info("call getMember --------------- email : " + email);
        Member member = memberService.selectMember(email);
        model.addAttribute("member", member);

        return member;
    }

    @GetMapping(value = "listAll")
    public void listAll(Model model) {

        logger.info("show all list......................");
        model.addAttribute("list", memberService.listAll());
    }

}
