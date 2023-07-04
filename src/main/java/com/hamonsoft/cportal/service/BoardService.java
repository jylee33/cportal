package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.domain.BoardVO;
import com.hamonsoft.cportal.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardService {

    BoardRepository boardRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public List<BoardVO> listAll() {
        return boardRepository.listAll();
    }

}
