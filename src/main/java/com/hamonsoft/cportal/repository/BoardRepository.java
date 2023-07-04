package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.BoardVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface BoardRepository {

    List<BoardVO> listAll();

}
