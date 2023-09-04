package com.hamonsoft.cportal.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hamonsoft.cportal.domain.Authentication;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.TaxInformation;
import com.hamonsoft.cportal.dto.LoginDTO;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.service.MemberService;
import com.hamonsoft.cportal.service.RestApiService;
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
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Controller
@RequestMapping("/member")
public class MemberController {

    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

    MemberService memberService;
    RestApiService restApiService;

    @Autowired
    public MemberController(MemberService memberService, RestApiService restApiService) {
        this.memberService = memberService;
        this.restApiService = restApiService;
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

    @GetMapping(value = "insertMember")
    public void insertMemberGet(Model model) {
        logger.info("call insertMemberGet ----------------");
    }

    @Transactional
    @PostMapping(value = "insertMember")
    public String insertMemberPost(Member member, TaxInformation taxInformation, Authentication authentication, Model model) throws UnsupportedEncodingException, JsonProcessingException {
        logger.info("call insertMemberPost ----------------");
        logger.info(member.toString());

        memberService.insertMember(member);
        memberService.insertTaxInfomation(taxInformation);
        memberService.insertAuthentication(authentication);

        ResultDto resultDto = restApiService.addUser(member);
        if (resultDto.getTRAN_STATUS() == 1) {
            model.addAttribute("result", "success");
        } else {
            model.addAttribute("result", "fail");
            model.addAttribute("reason", resultDto.getREASON());

            return "/member/insertMember";
        }

        String membername = URLEncoder.encode(member.getMembername(), "UTF-8");

        return "redirect:/member/sendmail_emailcertification?email=" + member.getEmail() + "&membername=" + membername + "&licensegrade=" + member.getLicensegrade();
    }

    @GetMapping(value = "sendmail_emailcertification")
    public void sendmail_emailcertification(@RequestParam("email") String email, @RequestParam("membername") String membername, @RequestParam("licensegrade") String licensegrade, Model model) {
        logger.info("sendmail_emailcertification call --------------------------------");

        model.addAttribute("email", email);
        model.addAttribute("membername", membername);
        model.addAttribute("licensegrade", licensegrade);
    }

    @GetMapping(value = "insertmember_result")
    public void insertmember_result(@RequestParam("email") String email, @RequestParam("membername") String membername, @RequestParam("licensegrade") String licensegrade, Model model) {
        logger.info("call insertmember_result ----------------");
        model.addAttribute("email", email);
        model.addAttribute("membername", membername);
        model.addAttribute("licensegrade", licensegrade);
    }

    @GetMapping(value = "selectMember")
    @ResponseBody
    public Member selectMember(@RequestParam("email") String email, Model model) {
        logger.info("call selectMember --------------- email : " + email);
        Member member = memberService.selectMember(email);
        model.addAttribute("member", member);

        return member;
    }

    @GetMapping(value = "listAll")
    public void listAll(Model model) {

        logger.info("show all member list......................");
        model.addAttribute("list", memberService.listAll());
    }

    @GetMapping("login")
    public void loginGet(@ModelAttribute("dto") LoginDTO dto) {
        logger.info("call login get ......................");
    }

    @PostMapping("loginPost")
    public void loginPost(LoginDTO dto, HttpSession session, Model model) {
        logger.info("call login post ......................");

        Member member = memberService.login(dto);

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

            memberService.keepLogin(paramMap);
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

                memberService.keepLogin(paramMap);
            }

        }

        return "member/logout";
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

        String uid = memberService.findId(paramMap);
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

        memberService.updatePw(paramMap);
        model.addAttribute("email", member.getEmail());
        model.addAttribute("pw", pw);
    }

    //
    @GetMapping("emailcertification")
    public void emailcertification(@RequestParam("email") String email, @RequestParam("membername") String membername, @RequestParam("licensegrade") String licensegrade, Model model) {
        logger.info("call emailcertification Get ......................");

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("email", email);

        memberService.emailcertification(paramMap);
        model.addAttribute("email", email);
        model.addAttribute("membername", membername);
        model.addAttribute("licensegrade", licensegrade);
    }

    @GetMapping("agreeterms")
    public void agreeterms(Model model) {
        logger.info("call agreeterms ......................");
    }

    @GetMapping("agreemarketing")
    public void agreemarketing(Model model) {
        logger.info("call agreemarketing ......................");
    }

    @GetMapping("personalinformation")
    public void personalinformation(Model model) {
        logger.info("call findpw ......................");
    }

}
