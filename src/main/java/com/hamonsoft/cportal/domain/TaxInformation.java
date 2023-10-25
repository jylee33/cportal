package com.hamonsoft.cportal.domain;

import lombok.Data;
import lombok.ToString;

import java.util.Date;

@Data
@ToString
public class TaxInformation {

    private String taxid;
    private String email;    //세금계산서발송기관메일
    private String companyname;
    private String representationname;
    private String taxcompanynumber;
    private String taxemail;    //세금계산서발송기관메일
    private String postnumber;  //우편번호
    private String address;     //주소
    private String detailaddress;   //상세주소
    private String businesscondition;   //업태
    private String businesskind;    //업종
    private String settlementmeans; //결제방법
    private int baseamount; //기본금액
    private String customer_uid; //결제방법
    private Date next_pay_date; //다음 결제일자
    private long paid_amount;
    private Date createdAt; //등록일시
    private String updatedBy;   //수정자
    private Date updatedAt; //수정일시

}
