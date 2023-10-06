package com.hamonsoft.cportal.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class RequestIPDTO extends RequestDTO {

    private String uuid;

}
