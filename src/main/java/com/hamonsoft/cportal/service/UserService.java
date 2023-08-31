package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberTaxInformation;
import com.hamonsoft.cportal.dto.LoginDTO;
import com.hamonsoft.cportal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
//@Transactional
public class UserService {

    UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public MemberTaxInformation info(Member member) {
        return userRepository.info(member);
    }

    public int  chgmember(MemberTaxInformation info) {
        return userRepository.chgmember(info);
    }

    public int  chgtaxinformation(MemberTaxInformation info) {
        return userRepository.chgtaxinformation(info);
    }

    public int  chgpw(Member member) {
        return userRepository.chgpw(member);
    }


    public int  withdrawal(Map<String, Object> paramMap) {
        return userRepository.withdrawal(paramMap);
    }


}
