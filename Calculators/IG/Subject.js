//Subject class
//0----> تأهيل
//1----> تحسين
//-1---> تحسين
//2--->اضيفيت لفشل شرط المواد المكمله 
this.subjectStatus = 0;
function Subject(sCode, sName, sGrade, sMark, sStatus, cNumber) {
    this.subjectCode = sCode;
    this.subjectName = sName;
    this.subjectGrade = sGrade;
    this.subjectMark = sMark;
    this.subjectStatus = sStatus;
    this.conditionNumber = cNumber;
    this.clone = function(){    
    
    temp = new Subject(this.subjectCode,this.subjectName,this.subjectGrade,this.subjectMark,this.subjectStatus,0);
    return temp;
    

}

    
    
}