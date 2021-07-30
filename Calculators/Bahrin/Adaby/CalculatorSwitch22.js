//grade11,grade12
var CertificateSubjects = new Array()

var totalMark = 0;
var SumHours = 0;
var SumMarks = 0;
var CertificateType = "";
function FillQualificationCB() {
    var newOpt;
    var QCB = document.getElementById("QCB");
    AddItem(QCB, "المجموع لكل الكليات التي تؤهل بالشهادة", 0)
}

function AddItem(objListBox, strText, strId) {
    var newOpt;
    newOpt = document.createElement("OPTION");
    newOpt = new Option(strText, strText);
    newOpt.id = strId;
    objListBox.add(newOpt);
}
function StartCalculations() {
    try {
        sSubjectList = "," + document.getElementById("Wizard1$tbStudentSubjects").value;
    } catch (e) {
        try {
            sSubjectList = "," + document.getElementById("Wizard1_tbStudentSubjects").value;
        } catch (e) {
        }
    }
    var tempArray = new Array();

    var Base = 0;
    var studentList = sSubjectList.split(',');
    for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "",  parseInt(Right(subjectInfo[2],6).substr(0,1)))
        tempArray.push(subject);
    }

    studentList = tempArray;
    studentList.splice(0, 1); //remove first element for being a comma
    studentList.splice(studentList.length - 1, 1);

    //Create subjects for all grades
    CertificateSubjects = new Array();

    for (var i = 0; i < studentList.length; i++) {
        if (studentList[i].subjectMark > 0) {
            CertificateSubjects.push(studentList[i])
            }
        }
    
    //Sort Grade11 and Grade12 Arrays on Subject Code
    CertificateSubjects.sort(sortByCode)

    //FindOutFactors
    SumMarks = 0;
    SumHours = 0;
    //debug
    for (i = 0; i < CertificateSubjects.length; i++) {
        SumMarks = SumMarks + (parseFloat(CertificateSubjects[i].subjectMark) * parseFloat(CertificateSubjects[i].conditionNumber))
        SumHours = SumHours +parseFloat(CertificateSubjects[i].conditionNumber);

    }
    
   // CalculateTotalMark()
    totalMark = (410 * parseFloat(SumMarks / SumHours)).toPrecision(5);
    var totalMarkDiv = document.getElementById("AllQualification");
    totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> المجموع الاعتباري:" + totalMark / 100 + "</font></p>";
    //parent.document.getElementById("totalMarkDIV").innerHTML = "<p><font size=\"4\" face=\"Verdana\"> مجموع الدرجات :" + Math.round(totalMark * 100) / 100 + "</font></p>";
    window.top.scrollTo(0, 0);
}

function sortByCode(obj1, obj2) {
    if (obj1.subjectCode == obj2.subjectCode)
        return 0
    else if (obj1.subjectCode > obj2.subjectCode)
        return 1
    else return -1
}
function Right(str, n){
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else {
        var iLen = String(str).length;
        //alert(iLen)
        return String(str).substring(iLen, iLen - n);
    }
}
  