package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.controller.MemberController;
import com.hamonsoft.cportal.domain.BoardVO;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.LoginDTO;
import com.hamonsoft.cportal.repository.MemberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
//@Transactional
public class MemberService {

    MemberRepository memberRepository;
    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);

    @Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public String getTime() {
        return memberRepository.getTime();
    }

    public Member selectMember(String email) {
        return memberRepository.selectMember(email);
    }

    public void insertMember(Member member) {
        memberRepository.insertMember(member);
    }

    public List<Member> listAll() {
        return memberRepository.listAll();
    }

    public Member login(LoginDTO dto) {
        return memberRepository.login(dto);
    }

    public void keepLogin(Map<String, Object> paramMap) {
        memberRepository.keepLogin(paramMap);
    }

    public Member checkUserWithSessionKey(Map<String, Object> paramMap) {
        return memberRepository.checkUserWithSessionKey(paramMap);
    }

    public String findId(Map<String, Object> paramMap) {
        return memberRepository.fineId(paramMap);
    }

    public void updatePw(Map<String, Object> paramMap) {
        memberRepository.updatePw(paramMap);
    }

    public void emailcertification(Map<String, Object> paramMap) {
        memberRepository.emailcertification(paramMap);
    }

}
