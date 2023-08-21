package com.hamonsoft.cportal.domain;

import lombok.Data;
/**
 * <b>사용자 세금계산서 발행 내역 정보 Vo</b>
 * <p>사용자 세금계산서 발행 내역을 가져 오기 위한 VO </p>
 *
 * @author hs.park
 * @since 2023/08/18
 */
@Data
public class MemberTaxOutput {
    private String taxid;
    private String email;
    private String Representationname;
    private String taxcompanynumber;
    private String taxemail;
    private String postnumber;
    private String address;
    private String detailaddress;
    private String zipaddress;
    private String businesscondition;
    private String businesskind;
    private String settlementmeans;
    private int baseamount;
    private String taxhistoryid;
    private String issueyearmonth;
    private int issueamount;
    private String issuedate;
    private int logindate;
}
