package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.utils.Pagination;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

public interface TestTableService {
    //select * from Test_Table
    public List<Map<String, Object>> SelectAllList() throws Exception;

    //Paging
    public List<Map<String, Object>> SelectAllList(Pagination pagination) throws Exception;

    //count
    public int testTableCount() throws Exception;


    //Paging
    public List<Map<String, Object>> memberSetList02(Pagination pagination) throws Exception;

    //count
    public int memberSetCount02() throws Exception;
}
