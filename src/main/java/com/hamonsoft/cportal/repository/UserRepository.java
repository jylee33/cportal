package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.LoginDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface UserRepository {


    Member info(Member member);
    int chginfo(Member member);
    int chgpw(Member member);
    int withdrawal(Map<String, Object> paramMap);



//    Member info(Map<String, Object> paramMap);

}
