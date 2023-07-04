package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.BoardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/board")
public class BoardController {

    private static final Logger logger = LoggerFactory.getLogger(BoardController.class);

    BoardService boardService;

    @Autowired
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping(value = "list")
    public String list(Model model) {
        model.addAttribute("name", "test");
        return "board/list";
    }

    @GetMapping(value = "/listAll")
    public void listAll(Model model) {

        logger.info("show all list......................");
        model.addAttribute("list", boardService.listAll());
    }

//    @GetMapping(value = "/listPage")
//    public String listPage(@ModelAttribute("cri") Criteria cri, Model model) throws Exception {
//
//        logger.info(cri.toString());
//
//        model.addAttribute("list", service.listCriteria(cri));
//        PageMaker pageMaker = new PageMaker();
//        pageMaker.setCri(cri);
////    pageMaker.setTotalCount(131);
//
//        pageMaker.setTotalCount(service.listCountCriteria(cri));
//
//        model.addAttribute("pageMaker", pageMaker);
//        return "board/listPage";
//    }
}
