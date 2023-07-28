package com.hamonsoft.cportal.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
                    String mailBody2 = mailBody + "<p></p>회신 받을 주소 : " + mailFromAddress;
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

}
