package com.hamonsoft.cportal.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;

import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.*;
import java.util.Date;
import java.util.Properties;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class MailSend {

    private static final Logger logger = LoggerFactory.getLogger(MailSend.class);

    public void MailSendText() {
        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "yubbi33@gmail.com";
        String mail_pw = "gdmdwqrbgtdbaqnd";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

        Session session = Session.getDefaultInstance(prop, auth);

        MimeMessage msg = new MimeMessage(session);

        try {
            msg.setSentDate(new Date());

            msg.setFrom(new InternetAddress("yubbi33@gmail.com", "이종엽"));
            InternetAddress to = new InternetAddress("jylee@hamonsoft.co.kr");
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject("테스트 메일", "UTF-8");
            msg.setText("안녕하세요 테스트 메일입니다.", "UTF-8");

            Transport.send(msg);

        } catch (AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch (MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch (UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        }

    }

    // HTML 형식으로 메일 전송하기
    public void MailSendHtml(String mailto) {
        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "yubbi33@gmail.com";
        String mail_pw = "gdmdwqrbgtdbaqnd";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

        Session session = Session.getDefaultInstance(prop, auth);

        MimeMessage msg = new MimeMessage(session);

        try {
            msg.setSentDate(new Date());

            msg.setFrom(new InternetAddress("yubbi33@gmail.com", "HAMONSOFT"));
//            InternetAddress to = new InternetAddress("jylee@hamonsoft.co.kr");
            InternetAddress to = new InternetAddress(mailto);
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject("NETIS CLOUD 서비스 가입 안내", "UTF-8");

            String body = "<H1>안녕하세요. Hamonsoft NETIS CLOUD 서비스 가입 안내 메일입니다.</H1>" + "<img src=\"http://hamonsoft.co.kr/wp-content/uploads/2019/07/it-specialist0.png\">"
                    + "<br><a href=\"http://hamonsoft.co.kr\">하몬소프트</a>";
            msg.setContent(body, "text/html;charset=utf-8");

            Transport.send(msg);

        } catch (AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch (MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch (UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        }

    }

    // HTML 형식으로 메일 전송하기
    public void MailSendGroup(String mailSubject) throws IOException {

        logger.info("GroupMailSend --------------------------------------");
        logger.info("mailsubject --- " + mailSubject);

        Resource resource = new ClassPathResource("upload/groupmail.xlsx");

        logger.info(resource.getFilename());
        logger.info(resource.getFile().getParent());

        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "yubbi33@gmail.com";
        String mail_pw = "gdmdwqrbgtdbaqnd";
        String mailBody = "";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

//        Session session = Session.getDefaultInstance(prop, auth);
        Session session = Session.getInstance(prop, auth);


        try {
            InputStream inputStream = new ClassPathResource("upload/mailbody.html").getInputStream();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder sb = new StringBuilder();
            String line;

//            bufferedReader.lines()
//                    .forEach(System.out::println);

            while ((line = bufferedReader.readLine()) != null)
            {
                sb.append(line);
//                sb.append('\n');
            }

            mailBody = sb.toString();
//            logger.info(mailBody);
            bufferedReader.close();
            inputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        InputStream file = new ClassPathResource("upload/groupmail.xlsx").getInputStream();
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(file);

            int rowindex = 0;
            int columnindex = 0;

            XSSFSheet sheet = workbook.getSheetAt(0);
            int rows = sheet.getPhysicalNumberOfRows();
            for (rowindex = 0; rowindex < rows; rowindex++) {
                if (rowindex == 0) {
                    continue;
                }
                //행을읽는다
                XSSFRow row = sheet.getRow(rowindex);
                if (row != null) {

                    String mailFromName = "HAMONSOFT";
                    String mailFromAddress = "yubbi33@gmail.com";
                    String mailToAddress = "jylee@hamonsoft.co.kr";

                    //셀의 수
                    int cells = row.getPhysicalNumberOfCells();
                    for (columnindex = 0; columnindex <= cells; columnindex++) {
                        //셀값을 읽는다
                        XSSFCell cell = row.getCell(columnindex);
                        String value = "";

                        //셀이 빈값일경우를 위한 널체크
                        if (cell == null) {
                            continue;
                        } else {
//                            //타입별로 내용 읽기
//                            switch (cell.getCellType()){
//                                case XSSFCell.CELL_TYPE_FORMULA:
//                                    value=cell.getCellFormula();
//                                    break;
//                                case XSSFCell.CELL_TYPE_NUMERIC:
//                                    value=cell.getNumericCellValue()+"";
//                                    break;
//                                case XSSFCell.CELL_TYPE_STRING:
//                                    value=cell.getStringCellValue()+"";
//                                    break;
//                                case XSSFCell.CELL_TYPE_BLANK:
//                                    value=cell.getBooleanCellValue()+"";
//                                    break;
//                                case XSSFCell.CELL_TYPE_ERROR:
//                                    value=cell.getErrorCellValue()+"";
//                                    break;
//                            }
                            value = cell.getStringCellValue();
                        }
                        switch (columnindex) {
                            case 0:
                                mailFromName = value;
                                break;
                            case 1:
                                mailFromAddress = value;
                                break;
                            case 2:
                                mailToAddress = value;
                                break;
                        }
                    }
                    MimeMessage msg = new MimeMessage(session);
                    msg.setSentDate(new Date());

                    msg.setFrom(new InternetAddress(mailFromAddress, mailFromName));
                    InternetAddress to = new InternetAddress(mailToAddress);
                    msg.setRecipient(Message.RecipientType.TO, to);
                    msg.setSubject(mailSubject, "UTF-8");

//                    String mailBody = "<H1>안녕하세요. Hamonsoft NETIS CLOUD 서비스 가입 안내 메일입니다.</H1>" + "<img src=\"http://hamonsoft.co.kr/wp-content/uploads/2019/07/it-specialist0.png\">"
//                            + "<br><a href=\"http://hamonsoft.co.kr\">하몬소프트</a>";
                    String mailBody2 = mailBody + "<p></p>본 메일은 발신전용입니다.<br>회신 받을 주소 : " + mailFromAddress;
                    msg.setContent(mailBody2, "text/html;charset=utf-8");

                    Transport.send(msg);
                    logger.info("SendMail ------- from : " + mailFromName + "[" + mailFromAddress + "] , to : " + mailToAddress);
                }
            }
        } catch(AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch(MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch(UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            file.close();
        }

    }

    public void MailSendResetPW(String prof, String cpath, String mailto, String pw) {
        logger.info("MailSendResetPW to ------------------------- " + mailto);
        logger.info("active profile - " + prof);

        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "cloud@hamonsoft.co.kr";
        String mail_pw = "wtzhnnyphsiohohi";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

        Session session = Session.getDefaultInstance(prop, auth);

        MimeMessage msg = new MimeMessage(session);

        try {
            msg.setSentDate(new Date());

            msg.setFrom(new InternetAddress("yubbi33@gmail.com", "HAMONSOFT"));
//            InternetAddress to = new InternetAddress("jylee@hamonsoft.co.kr");
            InternetAddress to = new InternetAddress(mailto);
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject("Hamonsoft NETIS CLOUD 비밀번호 변경 안내", "UTF-8");

            String body = "<H1>안녕하세요. Hamonsoft NETIS CLOUD 비밀번호 변경 안내 메일입니다.</H1>"
                    + "<br>변경된 비밀번호는 <b>" + pw + "</b>입니다."
                    + "<br>로그인 후 비밀번호를 꼭 변경하시기 바랍니다."
                    + "<P><img src=\"http://hamonsoft.co.kr/wp-content/uploads/2019/07/it-specialist0.png\">";
            if(prof.equals("dev")) {
                body = body +"<br><a href=\"" + cpath + "\">NETIS 클라우드 서비스</a>";
            } else {
                body = body + "<br><a href=\"http://cloud.hamonsoft.com/portal\">NETIS 클라우드 서비스</a>";
            }
            msg.setContent(body, "text/html;charset=utf-8");

            Transport.send(msg);

        } catch (AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch (MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch (UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        }

    }

    public void MailSend_emailcertification(String prof, String cpath, String email, String membername, String licensegrade) {
        logger.info("MailSend_emailcertification to ------------------------- " + email);
        logger.info("active profile - " + prof);

        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "cloud@hamonsoft.co.kr";
        String mail_pw = "wtzhnnyphsiohohi";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

        Session session = Session.getDefaultInstance(prop, auth);

        MimeMessage msg = new MimeMessage(session);

        try {
            msg.setSentDate(new Date());

            msg.setFrom(new InternetAddress("yubbi33@gmail.com", "HAMONSOFT"));
//            InternetAddress to = new InternetAddress("jylee@hamonsoft.co.kr");
            InternetAddress to = new InternetAddress(email);
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject("Hamonsoft NETIS CLOUD 회원 가입 인증 안내", "UTF-8");

            String body = "<H1>안녕하세요. Hamonsoft NETIS CLOUD 회원 가입 인증 안내 메일입니다.</H1>"
                    + "<P><img src=\"http://hamonsoft.co.kr/wp-content/uploads/2019/07/it-specialist0.png\">";
            if(prof.equals("dev")) {
                body = body + "<br><a href=\"" + cpath + "/member/emailcertification?email=" + email + "&membername=" + membername + "&licensegrade=" + licensegrade + "\">이메일 인증하기</a>";
            } else {
                body = body + "<br><a href=\"http://cloud.hamonsoft.com/portal/member/emailcertification?email=" + email + "&membername=" + membername + "&licensegrade=" + licensegrade + "\">이메일 인증하기</a>";
            }

            logger.info(body);
            msg.setContent(body, "text/html;charset=utf-8");

            Transport.send(msg);

        } catch (AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch (MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch (UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        }

    }

    public void MailSend_welcomeJoin(String cpath, String email, String membername, String licensegrade) {
        logger.info("MailSend_welcomeJoin to ------------------------- " + email);

        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "cloud@hamonsoft.co.kr";
        String mail_pw = "wtzhnnyphsiohohi";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

        Session session = Session.getDefaultInstance(prop, auth);

        MimeMessage msg = new MimeMessage(session);

        try {
            msg.setSentDate(new Date());

            msg.setFrom(new InternetAddress("yubbi33@gmail.com", "HAMONSOFT"));
//            InternetAddress to = new InternetAddress("jylee@hamonsoft.co.kr");
            InternetAddress to = new InternetAddress(email);
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject("Hamonsoft NETIS CLOUD 회원 가입 완료 안내", "UTF-8");

            String body = """
                    <table cellspacing="0" cellpadding="0" width="900">
                        <tr>
                            <td style="border:1px solid #ddd; vertical-align: top;">
                                <table cellspacing="0" cellpadding="0" width="100%%">
                                    <tr>
                                        <td style="height: 90px; background-color: #4e96d4;">
                                            <table cellspacing="0" cellpadding="0" width="100%%">
                                                <tr>
                                                    <td style="vertical-align: middle; padding-left: 20px;"><img src="http://cloud.hamonsoft.com/portal/resources/images/common/logo1.png"></td>
                                                    <td style="font-size:25px; color:#fff; font-weight:700; text-align: right; padding-right:20px">회원가입 완료 안내</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:50px 10px; text-align: center; font-size:20px; line-height: 35px; color:#222; letter-spacing: -1.5px;">안녕하세요 주식회사 하몬소프트입니다.<br>
                                            <strong style="font-weight:700; color:#4e96d4">%s</strong> 고객님의 회원가입을 환영하며, 고객님이 가입한<br>
                                            <strong style="font-weight:700; color:#4e96d4">%s</strong> 등급의 라이센스 정책 및 지원기능은 다음과 같습니다.<br><br>
                                            <table cellspacing="0" cellpadding="0" width="100%%" style="border-collapse: collapse;">
                                                <colgroup>
                                                    <col style="width:48%%">
                                                    <col style="width:4%%">
                                                    <col style="width:48%%">
                                                </colgroup>
                                                <tr>
                                                    <td style="letter-spacing: -0.5px; vertical-align: top;">
                                                        <table cellspacing="0" cellpadding="0" width="100%%" style="border-collapse: collapse;">
                                                            <colgroup>
                                                                <col style="width:50%%">
                                                                <col style="width:50%%">
                                                            </colgroup>
                                                            <tr>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px; background-color: #f8f8fa;border-top:2px solid #f58520;">솔루션</td>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px; background-color: #f8f8fa;border-top:2px solid #f58520;">가격정책</td>
                                                            </tr>
                                                            <tr>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">기본요금</td>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">무료</td>
                                                            </tr>
                                                            <tr>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">네트워크</td>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">5대 이하<br>기본 기능 제공</td>
                                                            </tr>
                                                            <tr>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">서버</td>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">5대 이하<br>기본 기능 제공</td>
                                                            </tr>
                                                            <tr>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">AP</td>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">5대 이하(단독형)<br>AP 2대 이사(무선컨트롤러 포함)</td>
                                                            </tr>
                                                            <tr>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">데이터베이스</td>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">5대 이하<br>기본 기능 제공</td>
                                                            </tr>
                                                            <tr>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">환경 센스</td>
                                                                <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">5대 이하(단독감시형)<br>기본 기능 제공</td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="2" style="text-align: left; font-size:12px; line-height:1.6; padding:15px;background-color: #f9f9f9;border:1px solid #ddd; word-break: keep-all;">위 라이선스 정책은 개별 인프라 단독 감시 기준 정책이며 여러 인프라를 통합 모니터링하는 경우 아래의 정책 적용<br>
                                                                    1) 라이선스는 Credit 단위로 적용 Free/Basic/Pro 각 5/25/50/100 Credit 기본 제공 <br>
                                                                    2) 추가 Credit 구매 5 Credit / 100,000원, 10 Credit 180,000 제공<br>
                                                                    2) 네트워크 장비, 서버, 데이터베이스 각 1대당 1 Credit 적용<br>
                                                                    3) 무선 AP/환경 센서 각 2대 당 1 Credit 적용<br>
                                                                    4) 무선 컨트롤러 / RTU 각 1대당 5 Credit 적용<br>
                                                                    5) 트래픽 분석 라이선스 1,000 Flow/min 5 Credit, 5,000 Flow/min 25 Credit, 10,000 Flow/min 50 Credit 적용
                                                                  </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td>&nbsp;</td>
                                        
                                                    <td  style="letter-spacing: -0.5px;vertical-align: top;">
                                                        <table cellspacing="0" cellpadding="0" width="100%%" style="border-collapse: collapse;">
                                                            <colgroup>
                                                                <col style="width:50%%">
                                                                <col style="width:50%%">
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px; background-color: #f8f8fa;border-top:2px solid #f58520;">기능</td>
                                                                    <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px; background-color: #f8f8fa;border-top:2px solid #f58520;">지원여부(기간)</td>
                                                                </tr>
                                                                </thead><tbody>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">데이터 보관 기간</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">1일</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">구성/성능/장애정보</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">O</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">감시 정책 설정</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">O</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">Syslog/Trap 모니터링</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">O</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">보고서</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">O</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">대시보드</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">성능비교</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">사용자 지정 OID 성능</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">Configuration 백업</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">L4 VIP/RIP 성능</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">자산관리</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">문자메시지 알림</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">이메일/메신저 알림</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">TCP Port/URL 감시</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">Rack 실장 관리</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">성능 예측</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">상관 분석</td>
                                                                        <td style=" text-align: center; font-size:12px; border:1px solid #ddd; padding:5px; line-height:20px;">-</td>
                                                                    </tr>
                                                                </tbody>
                                                           \s
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tbody>
                                                   \s
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:20px; background-color: #f9f9f9; font-size:14px; line-height: 22px; color:#088888;">
                                            본 메일은 발신 전용 메일로 회신되지 얺습니다.<br>
                                            문의 사항은 help@hamonsoft.co.kr에 문의해 주시기 바랍니다.<br><br>
                                           \s
                                            (주)하몬소프트      대표자 강원석 이석호   사업자 등록번호 119-86-04153<br>
                                            서울특별시 금천구 가산동 60-5 갑을그레이트 밸리 B동 1201,1202,1203, 2006호
                                        
                                           \s
                                           \s
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    """.formatted(membername, licensegrade);
//            logger.info(body);
            msg.setContent(body, "text/html;charset=utf-8");

            Transport.send(msg);

        } catch (AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch (MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch (UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        }

    }

}
