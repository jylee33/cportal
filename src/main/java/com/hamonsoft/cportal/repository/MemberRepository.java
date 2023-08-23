package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.BoardVO;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.LoginDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface MemberRepository {


    String getTime();

    Member selectMember(String email);

    void insertMember(Member member);

    List<Member> listAll();

}
