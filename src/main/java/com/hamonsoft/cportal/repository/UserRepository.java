package com.hamonsoft.cportal.repository;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;

@Mapper
@Repository
public interface UserRepository {

    ArrayList<HashMap<String, Object>> findAll();

}
