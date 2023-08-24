package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.domain.Member;
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

    public Member login(LoginDTO dto) {
        return userRepository.login(dto);
    }

    public void keepLogin(Map<String, Object> paramMap) {
        userRepository.keepLogin(paramMap);
    }

    public Member checkUserWithSessionKey(Map<String, Object> paramMap) {
        return userRepository.checkUserWithSessionKey(paramMap);
    }

    public String findId(Map<String, Object> paramMap) {
        return userRepository.fineId(paramMap);
    }

    public void updatePw(Map<String, Object> paramMap) {
        userRepository.updatePw(paramMap);
    }

}
