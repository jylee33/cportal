package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.repository.MemberSetRepository;
import com.hamonsoft.cportal.utils.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Component
@Primary
public class MemberSetServiceImpl implements MemberSetService{

    @Autowired
    MemberSetRepository membersetRepository;
    @Override
    public int memberSetCount() throws Exception {
        return membersetRepository.memberSetCount();
    }

    @Override
    public List<Map<String, Object>> memberSetList(Pagination pagination) throws Exception {
        return membersetRepository.memberSetList(pagination);
    }

    @Override
    public List<Map<String, Object>> memberSetList() throws Exception {
        return membersetRepository.memberSetList();
    }
}
