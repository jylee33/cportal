package com.hamonsoft.cportal.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;


@Controller
@RequestMapping("/v1")
public class HomeV1Controller {

    private static final Logger logger = LoggerFactory.getLogger(HomeV1Controller.class);

    @GetMapping(value = "home")
    public String home(Locale locale, Model model) {
        logger.info("Welcome home! The client locale is {}.", locale);

        Date date = new Date();
        DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);

        String formattedDate = dateFormat.format(date);

        model.addAttribute("serverTime", formattedDate);
        model.addAttribute("name", "Jay");

//        return "thymeleaf/home";  // JSP 와 Thymeleaf 를 동시에 사용하기 위해서는 application.properties 에 설정하고, return "thymeleaf/home" 을 사용해야 한다.
        return "v1/home";
    }

    @GetMapping(value = "bill/pay")
    public String list(Model model) {
        model.addAttribute("name", "test");
        return "v1/bill/pay";
    }

    @GetMapping(value = "mail")
    public String mail(Model model) {
        model.addAttribute("name", "test");
        return "v1/mail/mail";
    }

    @GetMapping(value = "mail/test_mail")
    public String test_mail(@RequestParam("mailto") String mailto, Model model) {
        model.addAttribute("mailto", mailto);
        return "v1/mail/test_mail";
    }

    @GetMapping(value = "mail/groupmail")
    public String groupmail(Model model) {
        model.addAttribute("name", "test");
        return "v1/mail/groupmail";
    }

    @GetMapping(value = "mail/groupmail_send")
    public String groupmail_send(@RequestParam("mailsubject") String mailsubject, Model model) {
        model.addAttribute("mailsubject", mailsubject);
        return "v1/mail/groupmail_send";
    }

}
