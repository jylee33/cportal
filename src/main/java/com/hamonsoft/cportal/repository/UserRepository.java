package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberTaxInformation;
import com.hamonsoft.cportal.domain.TaxInformation;
import com.hamonsoft.cportal.dto.LoginDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.*;

@Mapper
@Repository
public interface UserRepository {


    MemberTaxInformation info(Member member);
    int chgmember(Member member);
    int chggrade(Member member);
    int chgtaxinformation(TaxInformation info);
    int chgpw(Member member);
    int withdrawal(Member member);


    ArrayList<HashMap<String, Object>> findAll();
//    Member info(Map<String, Object> paramMap);

}
