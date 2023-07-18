package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.BoardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;


@Controller
@RequestMapping("/mail")
public class MailController {

    private static final Logger logger = LoggerFactory.getLogger(MailController.class);

    BoardService boardService;

    @Autowired
    public MailController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping(value = "")
    public String mail(Model model) {
        model.addAttribute("name", "test");
        return "mail/mail";
    }

    @GetMapping(value = "test_mail")
    public String test_mail(@RequestParam("mailto") String mailto, Model model) {
        model.addAttribute("mailto", mailto);
        return "mail/test_mail";
    }

    @GetMapping(value = "groupmail")
    public String groupmail(Model model) {
//        model.addAttribute("name", "test");
        return "mail/groupmail";
    }

    @GetMapping(value = "groupmail_send")
    public String groupmail_send(@RequestParam("mailsubject") String mailsubject, Model model) {
        model.addAttribute("mailsubject", mailsubject);
        return "mail/groupmail_send";
    }

    @PostMapping(value = "uploadexcel")
    public void uploadExcelPOST(MultipartFile[] uploadFile) throws IOException {
        logger.info("uploadTestPOST............");

        Resource resource = new ClassPathResource("");

        logger.info(resource.getDescription());
        logger.info(resource.getFilename());
        logger.info(resource.getFile().getPath());

        // 내가 업로드 파일을 저장할 경로
        String uploadFolder = resource.getFile().getPath();

        for (MultipartFile multipartFile : uploadFile) {
            String uploadFileName = multipartFile.getOriginalFilename();
            uploadFileName = "groupmail.xlsx";
            // 저장할 파일, 생성자로 경로와 이름을 지정해줌.
            File saveFile = new File(uploadFolder, uploadFileName);

            try {
                saveFile.delete();
                // void transferTo(File dest) throws IOException 업로드한 파일 데이터를 지정한 파일에 저장
                multipartFile.transferTo(saveFile);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
