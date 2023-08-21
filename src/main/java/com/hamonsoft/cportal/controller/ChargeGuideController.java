package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberLicense;
import com.hamonsoft.cportal.domain.MemberUseDevice;
import com.hamonsoft.cportal.service.ChargeGuideService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/charge")
public class ChargeGuideController {

    private static final Logger logger = LoggerFactory.getLogger(ChargeGuideController.class);

    @Autowired
    ChargeGuideService chargeGuideService;
    @GetMapping("/guide")
    public void guideInfoList(Model model, HttpServletRequest request){
        String strBusinessName = "";        
        List<MemberUseDevice> memberUseDevice = new ArrayList<>();
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("loginMember");
        logger.info("ChargeGuideController1 model ---->"+member.getEmail());
        logger.info("ChargeGuideController1 model ---->"+member.getEmailcertificationyn());
        logger.info("ChargeGuideController1 model ---->"+member.getBusinessname());
        if (member.getEmailcertificationyn() == 1){
            memberUseDevice = chargeGuideService.doMemberDeviceInfo(strBusinessName);
        }else{
            memberUseDevice = chargeGuideService.doMemberDeviceInfo(strBusinessName);
        }
        logger.info("ChargeGuideController2 model ---->");
        model.addAttribute("list", memberUseDevice);
        logger.info("ChargeGuideController3 model ---->");
        for (MemberUseDevice map:memberUseDevice) {
            logger.info("map ---->"+map) ;
        }

    }
    @RequestMapping(value = "/admin_guide", method = RequestMethod.GET)
    public ModelAndView admin_guideInfoList(HttpServletRequest request,
                                            @RequestParam(name = "selectorId", required = false) String selectorId,
                                            @PageableDefault(size=10, sort="email",direction = Sort.Direction.ASC) Pageable pageable){
        String strBusinessName = "";
        String viewName = getViewName(selectorId, "/charge/admin_guide/list");
        ModelAndView modelAndView = new ModelAndView(viewName);
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("loginMember");
        logger.info("ChargeGuideController1 model ---->"+member.getEmail());
        logger.info("ChargeGuideController1 model ---->"+member.getEmailcertificationyn());
        logger.info("ChargeGuideController1 model ---->"+member.getBusinessname());
        Page<List<MemberUseDevice>> memberUseDevice  = chargeGuideService.doMemberDeviceList(strBusinessName,pageable);
        modelAndView.addObject("list", memberUseDevice);
        logger.info("ChargeGuideController2 model ---->");
        logger.info("ChargeGuideController3 model ---->");
        for (List<MemberUseDevice> map:memberUseDevice) {
            logger.info("map ---->"+map) ;
        }

        long totalCount = 0;
        if (memberUseDevice != null) {
            totalCount = memberUseDevice.getTotalElements();
        }
        modelAndView.addObject("totalCount", totalCount);
        return modelAndView;
    }

    private String getViewName(@RequestParam(name = "selectorId", required = false) String selectorId,
                               String viewPath) {
        String viewName = viewPath;
        if (selectorId != null) {
            if (selectorId.equals("page-content-popup")) {
                viewName = "/charge/admin_guide/ofprocess-popup-list :: #page-content-popup";
            } else if (selectorId.length() > 0) {
                viewName = viewName + " :: #" + selectorId;
            }
        }
        return viewName;
    }
}
