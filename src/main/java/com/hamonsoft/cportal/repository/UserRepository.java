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

    Member login(LoginDTO dto);

    void keepLogin(Map<String, Object> paramMap);

    Member checkUserWithSessionKey(Map<String, Object> paramMap);

    String fineId(Map<String, Object> paramMap);

    void updatePw(Map<String, Object> paramMap);

}
