package com.hamonsoft.cportal.repository;

import java.util.List;
import java.util.Map;

import com.hamonsoft.cportal.utils.Pagination;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author CafeAlle
 *
 */
@Mapper
public interface TestTableMapper {

    //select * from Test_Table
    public List<Map<String, Object>> SelectAllList() throws Exception;

    //Paging
    public List<Map<String, Object>> SelectAllList(Pagination pagination) throws Exception;

    //count
    public int testTableCount() throws Exception;


}
