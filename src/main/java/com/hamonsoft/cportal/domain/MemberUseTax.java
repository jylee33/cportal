package com.hamonsoft.cportal.domain;

import lombok.Data;

@Data
public class MemberUseTax {
    private Member member;
    private MemberLicense memberLicense;
    private MemberUseTax memberUseTax;
}
