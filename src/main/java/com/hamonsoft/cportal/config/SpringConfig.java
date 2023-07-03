package com.hamonsoft.cportal.config;

import com.hamonsoft.cportal.repository.JdbcTemplateMemberRepository;
import com.hamonsoft.cportal.repository.JpaMemberRepository;
import com.hamonsoft.cportal.repository.MemberRepository;
import com.hamonsoft.cportal.repository.MemoryMemberRepository;
import com.hamonsoft.cportal.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.persistence.EntityManager;
import javax.sql.DataSource;
import javax.swing.*;

@Configuration
public class SpringConfig {

    private EntityManager em;

    @Autowired
    public SpringConfig(EntityManager em) {
        this.em = em;
    }

    @Bean
    public MemberService memberService() {
        return new MemberService(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository() {
//        return new MemoryMemberRepository();
//        return new JdbcTemplateMemberRepository(dataSource);
        return new JpaMemberRepository(em);
    }
}
