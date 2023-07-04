package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;

@Service
public class UserService {

    UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userMapper) {
        this.userRepository = userMapper;
    }

    public ArrayList<HashMap<String, Object>> findAll() {
        return userRepository.findAll();
    }

}
