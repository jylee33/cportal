drop table if exist member CASCADE;
create table member
(
    id bigint generated by default as identity,
    name varchar(255),
    primary key(id)
);

create table member
(
    id bigint NOT NULL auto_increment,
    name varchar(255),
    primary key(id)
);


-- netiscloud.tblicensepolicy definition

CREATE TABLE `tblicensepolicy` (
  `licensepolicyid` varchar(36) NOT NULL COMMENT '라이센스정책관리번호(uuid)',
  `solutioncode` varchar(6) NOT NULL COMMENT '솔루션코드(groupcode:002)',
  `policycode` varchar(6) NOT NULL COMMENT '라이센스등급(groupcode:001)',
  `solutionname` varchar(50) NOT NULL COMMENT '라이센스정책솔루션명',
  `policyname` varchar(50) NOT NULL COMMENT '라이센스정책명',
  `licensecontent` text NOT NULL COMMENT '라이센스정책내용',
  `licenseamount` varchar(15) NOT NULL COMMENT '라이센스기본요금',
  `licenseint` int(4) NOT NULL COMMENT '라이센스가용장비수',
  `aidcode` varchar(6) NOT NULL COMMENT '지원기능구분(003)',
  `stdate` varchar(8) NOT NULL DEFAULT date_format(curdate(),'%Y%m%d') COMMENT '시작일자',
  `eddate` varchar(8) NOT NULL DEFAULT '21991231' COMMENT '종료일자',
  `useyn` varchar(1) NOT NULL DEFAULT '1' COMMENT '사용여부',
  `sortno` tinyint(1) NOT NULL COMMENT '정렬기준',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`licensepolicyid`),
  KEY `IDX_tbpricepolicy_001` (`policycode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='라이센스정책관리';

-- tbmember cloudgrade column 변경 -> licensegrade
ALTER TABLE tbmember CHANGE cloudgrade licensegrade VARCHAR(06);
-- tbmember column 추가 -> administratoryn
ALTER TABLE tbmember ADD COLUMN administratoryn VARCHAR(1) AFTER emailcertificationyn;



CREATE TABLE `tbusedevice` (
  `tbusedeviceid` varchar(36) NOT NULL COMMENT '사용자아이디',
  `user_id` varchar(50) NOT NULL COMMENT '사용자아이디',
  `useday` varchar(8) NOT NULL COMMENT '사용일자',
  `tran_status` int(1) NOT NULL COMMENT '처리여부',
  `info` varchar(100) NOT NULL COMMENT '장비정보',
  `nms_count` int(4) NOT NULL COMMENT '네트워크 장비 대수',
  `sms_count` int(4) NOT NULL COMMENT 'sms 장비 대수',
  `dbms_count` int(4) NOT NULL COMMENT 'dbms 장비 대수',
  `ap_count` int(4) NOT NULL COMMENT 'ap 장비 대수',
  `fms_count` int(4) NOT NULL COMMENT 'fms 장비 대수',
  `reason` varchar(8) NOT NULL COMMENT '결과 사용',
  PRIMARY KEY (`tbusedeviceid`),
  KEY `IDX_tbusedevice_001` (`user_id`,`useday`),
  CONSTRAINT `tbusedevice_user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `tbmember` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='사용자등록장비';


<select id="login" resultType="Member">
    select * from tbmember
    where email=#{uid} and password=SHA2(#{upw},256)
</select>

alter table tbmember add column sessionkey varchar(50) not null default 'none' COMMENT '로그인 세션 아이디';
alter table tbmember add column sessionlimit timestamp COMMENT '아이디 저장 만료 기간';

ALTER TABLE tbtaxinformation ADD COLUMN companyname VARCHAR(50) AFTER email COMMENT '법인(회사)명';


/* 2023.08.31 추가 */
alter table tbmember add column administratoryn varchar(1) DEFAULT 'N' COMMENT '관리자여부(groupcode=999) 사업자등록번호가 하몬인경우',


implementation group: 'com.googlecode.json-simple', name: 'json-simple', version: '1.1.1'

/* 2023.09.4 추가 */
alter table tbmember add column serverdomainname varchar(100) null default '' COMMENT '회원접속도메인';



drop table `tbaidfunction`;


CREATE TABLE `tbaidfunction` (
     `solutioncode` varchar(6) NOT  NULL COMMENT '솔루션코드',
     `functionno` int(4) NOT NULL AUTO_INCREMENT COMMENT '지원기능관리번호',
     `functionname` varchar(50) NOT NULL COMMENT '지원기능명',
     `freeaid` tinytext NOT NULL COMMENT 'free 지원기능',
     `basicaid` tinytext NOT NULL COMMENT 'basic 지원기능',
     `proaid` tinytext NOT NULL COMMENT 'pro 지원기능',
     `entaid` tinytext NOT NULL COMMENT 'enterprise 지원기능',
     `functioncode` varchar(6) NOT NULL COMMENT '기능구분(003)',
     `useyn` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용여부',
     `stdate` varchar(8) NOT NULL DEFAULT date_format(curdate(),'%Y%m%d') COMMENT '시작일자',
     `eddate` varchar(8) NOT NULL DEFAULT '21991231' COMMENT '종료일자',
     `sortno` int(1) NOT NULL COMMENT '정렬기준',
     `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
     `updatedAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '수정일시',
     PRIMARY KEY (`functionno`),
     KEY `IDX_tbaidfunction_001` (`solutioncode`,`functionno`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='가격정책별 지원기능';



-- 2023.09.13 카드 결제를 위한 필드 추가
ALTER TABLE tbtaxinformation ADD COLUMN customer_uid VARCHAR(50) null COMMENT '카드결제용 customer_uid';
ALTER TABLE tbtaxinformation ADD COLUMN paidyn VARCHAR(1) not null default 'N' COMMENT '이번달 결제여부';
ALTER TABLE tbtaxinformation ADD COLUMN next_pay_date datetime not null default current_timestamp() COMMENT '다음 결제일자';
ALTER TABLE tbtaxinformation ADD COLUMN paid_amount BIGINT not null default 0 COMMENT '결제금액';


ALTER TABLE tbtaxinformation ADD COLUMN last_pay_date datetime null COMMENT '마지막 결제일자' after paidyn ;
ALTER TABLE tbtaxinformation DROP COLUMN paidyn;
ALTER TABLE tbtaxinformation DROP COLUMN next_pay_date;
ALTER TABLE tbtaxinformation ADD COLUMN next_pay_date datetime null COMMENT '다음 결제일자' after last_pay_date;




alter table tbcommoncode modify applyvolume decimal(7,2);

update tbcommoncode
set applyvolume = case when commoncode = '1' then 5 when commoncode = '2' then 25 when commoncode = '3' then 50 else 100 end
where groupcode = '001';

commit;

alter table tbmemberlicense modify basevolume int(4) unsigned DEFAULT 0 ;
alter table tbmemberlicense modify servicevolume int(4) unsigned DEFAULT 0 ;
alter table tbmemberlicense modify addvolume  int(4) unsigned DEFAULT 0 ;
alter table tbmemberlicense modify updatedBy varchar(50)  DEFAULT NULL ;


-- 2023.09.14  명칭변경
alter table tbaidfunction change functioncode aidcode varchar(06);
