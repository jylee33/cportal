package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.utils.Pagination;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MemberSetRepository {
    public int memberSetCount() throws Exception;

    public List<Map<String, Object>> memberSetList() throws Exception;

    public List<Map<String, Object>> memberSetList(Pagination pagination) throws Exception;


}
