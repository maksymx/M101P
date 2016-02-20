use enron;

db.messages.count();
//120477

db.messages.findOne();
//{
//        "_id" : ObjectId("4f16fc97d1e2d32371003f04"),
//        "body" : "\nAUSTIN AT THE CAPITOL\n701 EAST 11TH STREET\nAUSTIN, TX  78701\ntel: 512-478-1111\nfax: 512-478-3700\n\nHotel Information: http://marriotthotels.com/AUSDT\n\n\nARRIVAL CONFIRMATION:\n Confirmation Number:83929275\nGuests in Room: 3\nNAME: MR ERIC  BASS \nGuest Phone: 7138530977\nNumber of Rooms:1\nArrive: Sep 7 2001\nDepart: Sep 8 2001\nRoom Type: ROOM - QUALITY\nGuarantee Method:\n Credit card guarantee\n\n\nRATE INFORMATION:\nRate(s) Quoted in: US DOLLAR\nArrival Date: Sep 7 2001\nRoom Rate: 129.00  per night. Plus tax when applicable\nRate Program: LEISURE RATE\n\nSPECIAL REQUEST:\n NON-SMOKING ROOM, GUARANTEED\n 2 DOUBLE BEDS, GUARANTEED\n HIGH FLOOR, REQUEST NOTED\n \n\n\nPLEASE DO NOT REPLY TO THIS EMAIL \nAny Inquiries Please call 1-800-228-9290 or your local\ninternational toll free number.\n \nConfirmation Sent: Mon Jul 30 15:45:05 2001\n\nLegal Disclaimer:\nThis confirmation notice has been transmitted to you by electronic\nmail for your convenience. Marriott's record of this confirmation\nnotice is the official record of this reservation. Subsequent\nalterations to this electronic message after its transmission\nwill be disregarded.\n\nMarriott is pleased to announce that High Speed Internet Access is\nbeing rolled out in all Marriott hotel brands around the world.\nTo learn more or to find out whether your hotel has the service\navailable, please visit Marriott.com.\n\nEarn points toward free vacations, or frequent flyer miles\nfor every stay you make!  Just provide your Marriott Rewards\nmembership number at check in.  Not yet a member?  Join for free at\nhttps://member.marriottrewards.com/Enrollments/enroll.asp?source=MCRE\n\n",
//        "filename" : "3.",
//        "headers" : {
//                "Content-Transfer-Encoding" : "7bit",
//                "Content-Type" : "text/plain; charset=us-ascii",
//                "Date" : ISODate("2001-07-30T19:45:06Z"),
//                "From" : "reservations@marriott.com",
//                "Message-ID" : "<9573108.1075840323920.JavaMail.evans@thyme>",
//                "Mime-Version" : "1.0",
//                "Subject" : "83929275 Marriott  Reservation Confirmation Number",
//                "To" : [
//                        "ebass@enron.com"
//                ],
//                "X-FileName" : "eric bass 6-25-02.PST",
//                "X-Folder" : "\\ExMerge - Bass, Eric\\Personal",
//                "X-From" : "Reservations@Marriott.com",
//                "X-Origin" : "BASS-E",
//                "X-To" : "EBASS@ENRON.COM",
//                "X-bcc" : "",
//                "X-cc" : ""
//        },
//        "mailbox" : "bass-e",
//        "subFolder" : "personal"
//}

db.messages.count({'headers.From': 'andrew.fastow@enron.com', 'headers.To': 'john.lavorato@enron.com'});
//1

db.messages.count({'headers.From': 'andrew.fastow@enron.com', 'headers.To': 'jeff.skilling@enron.com'});
//3
