package com.hamonsoft.cportal.domain;

import com.hamonsoft.cportal.dto.ResultDto;
import lombok.Data;
import java.time.ZonedDateTime;

@Data
public class RestApiStatusVo {
        private String restuuid;
        private String resturl;
        private String email;
        private String headers;
        private String requestdata;
        private String responsedata;
        private ZonedDateTime createdAt;
}
