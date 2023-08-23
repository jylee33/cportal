package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.repository.TestTableMapper;
import com.hamonsoft.cportal.utils.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Component
@Primary
public class TestTableServiceImpl implements TestTableService{

    @Autowired
    TestTableMapper testtableMapper;

    @Override
    public List<Map<String, Object>> SelectAllList() throws Exception {
        // TODO Auto-generated method stub
        return testtableMapper.SelectAllList();
    }

    @Override
    public List<Map<String, Object>> SelectAllList(Pagination pagination) throws Exception {
        // TODO Auto-generated method stub
        return testtableMapper.SelectAllList(pagination);
    }

    @Override
    public int testTableCount() throws Exception {
        // TODO Auto-generated method stub
        return testtableMapper.testTableCount();
    }


    @Override
    public List<Map<String, Object>> memberSetList02(Pagination pagination) throws Exception {
        // TODO Auto-generated method stub
        return testtableMapper.memberSetList02(pagination);
    }

    @Override
    public int memberSetCount02() throws Exception {
        // TODO Auto-generated method stub
        return testtableMapper.memberSetCount02();
    }
}
