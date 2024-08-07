package com.hamonsoft.cportal.domain;

import lombok.Data;

import java.util.Date;
@Data
public class AidFunction {
    private int functionno;
    private String functionname;
    private String freeaid;
    private String basicaid;
    private String proaid;
    private String entaid;
    private String functioncode;
    private String useyn;
    private String stdate;
    private String eddate;
    private int sortno;
    private Date createdAt;
    private Date updatedAt;
}
