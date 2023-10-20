package com.hamonsoft.cportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ResultAuthDto {

    @JsonProperty("access_token")
    public String access_token;

    @JsonProperty("refresh_token")
    public String refresh_token;

    @JsonProperty("token_type")
    public String token_type;

    @JsonProperty("expired_time")
    public String expired_time;

}
