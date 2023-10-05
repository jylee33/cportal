package com.hamonsoft.cportal.domain;

import java.util.Date;

public class TaxInformation {

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyname() {
        return companyname;
    }

    public void setCompanyname(String companyname) {
        this.companyname = companyname;
    }

    public String getRepresentationname() {
        return representationname;
    }

    public void setRepresentationname(String representationname) {
        this.representationname = representationname;
    }

    public String getTaxcompanynumber() {
        return taxcompanynumber;
    }

    public void setTaxcompanynumber(String taxcompanynumber) {
        this.taxcompanynumber = taxcompanynumber;
    }

    public String getTaxemail() {
        return taxemail;
    }

    public void setTaxemail(String taxemail) {
        this.taxemail = taxemail;
    }

    public String getPostnumber() {
        return postnumber;
    }

    public void setPostnumber(String postnumber) {
        this.postnumber = postnumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDetailaddress() {
        return detailaddress;
    }

    public void setDetailaddress(String detailaddress) {
        this.detailaddress = detailaddress;
    }

    public String getBusinesscondition() {
        return businesscondition;
    }

    public void setBusinesscondition(String businesscondition) {
        this.businesscondition = businesscondition;
    }

    public String getBusinesskind() {
        return businesskind;
    }

    public void setBusinesskind(String businesskind) {
        this.businesskind = businesskind;
    }

    public String getSettlementmeans() {
        return settlementmeans;
    }

    public void setSettlementmeans(String settlementmeans) {
        this.settlementmeans = settlementmeans;
    }

    public int getBaseamount() {
        return baseamount;
    }

    public void setBaseamount(int baseamount) {
        this.baseamount = baseamount;
    }

    public String getCustomer_uid() {
        return customer_uid;
    }

    public void setCustomer_uid(String customer_uid) {
        this.customer_uid = customer_uid;
    }

    public Date getNext_pay_date() {
        return next_pay_date;
    }

    public void setNext_pay_date(Date next_pay_date) {
        this.next_pay_date = next_pay_date;
    }

    public void setPaid_amount(long paid_amount) {
        this.paid_amount = paid_amount;
    }

    public long getPaid_amount() {
        return paid_amount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "TaxInformation{" +
                "email='" + email + '\'' +
                ", companyname='" + companyname + '\'' +
                ", representationname='" + representationname + '\'' +
                ", taxcompanynumber='" + taxcompanynumber + '\'' +
                ", taxemail='" + taxemail + '\'' +
                ", postnumber='" + postnumber + '\'' +
                ", address='" + address + '\'' +
                ", detailaddress='" + detailaddress + '\'' +
                ", businesscondition='" + businesscondition + '\'' +
                ", businesskind='" + businesskind + '\'' +
                ", settlementmeans='" + settlementmeans + '\'' +
                ", baseamount=" + baseamount +
                ", customer_uid='" + customer_uid + '\'' +
                ", next_pay_date=" + next_pay_date +
                ", paid_amount=" + paid_amount +
                ", createdAt=" + createdAt +
                ", updatedBy='" + updatedBy + '\'' +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
