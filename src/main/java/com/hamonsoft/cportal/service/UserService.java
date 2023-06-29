package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.repository.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;

@Service
public class UserService {

    UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public ArrayList<HashMap<String, Object>> findAll() {
        return userMapper.findAll();
    }

}
