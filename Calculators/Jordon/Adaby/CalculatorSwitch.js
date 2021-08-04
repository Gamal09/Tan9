function FillQualificationCB(){
    var newOpt;
    var QCB = document.getElementById("QCB");
    AddItem(QCB, "جميع كليات أدبى", 0)
}

function AddItem(objListBox, strText, strId) {
    var newOpt;
    newOpt = document.createElement("OPTION");
    newOpt = new Option(strText, strText);
    newOpt.id = strId;
    objListBox.add(newOpt);
}
function StartCalculations(sSubjectList){
   var tempArray = new Array();
 var totalMark = 0;
 var  Base = 0;
 var studentList = sSubjectList.split(',');
  for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }
    
    studentList = tempArray;
    var code = studentList[0].subjectCode;
    if (code >= "10060" && code < "10069") {
        return ma3momatya(studentList);
    }
    if (code >= "10050" && code < "10059") {
        return adby(studentList);
    }
    
    for(var i=0;i<studentList.length;i++){
        totalMark += parseFloat(studentList[i].subjectMark);
        var Base = 200+ Base;
    }

        totalMark = (410 * totalMark) / Base;
    //var totalMarkDiv = document.getElementById("AllQualification");
    //totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> مجموع الدرجات :" + Math.round(totalMark * 100) / 100 + "</font></p>";
    window.top.scrollTo(0, 0);
    return Math.round(totalMark * 100) / 100
}
function ma3momatya(studentList) {
    var totalMark = 0;
    var totalbase = 0;

    for (var i = 0; i < studentList.length; i++) {
        totalMark += parseFloat(studentList[i].subjectMark);
        var base = 1;
        switch (studentList[i].subjectCode) {
            case "10060":
            case "10061":
                base = 140;
                break;
            case "10063":
            case "10066":
                base = 160;
                break;
            default:
                base = 100;
                break;
        }
        totalbase = totalbase + base;
    }

    totalMark = (410 * totalMark) / totalbase;

    //var totalMarkDiv = document.getElementById("AllQualification");
    //totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> مجموع الدرجات :" + Math.round(totalMark * 100) / 100 + "</font></p>";
    window.top.scrollTo(0, 0);
    return Math.round(totalMark * 100) / 100
}
function adby(studentList) {
    var totalMark = 0;
    var totalbase = 0;

    for (var i = 0; i < studentList.length; i++) {
        totalMark += parseFloat(studentList[i].subjectMark);
        var base = 1;
        switch (studentList[i].subjectCode) {
            case "10050":
            case "10051":
            case "10055":
            case "10056":
            case "10057":
                base = 150;
                break;
            case "10054":
                base = 300;
                break;
            default:
                base = 100;
                break;
        }
        totalbase = totalbase + base;
    }

    totalMark = (410 * totalMark) / totalbase;

    //var totalMarkDiv = document.getElementById("AllQualification");
    //totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> مجموع الدرجات :" + Math.round(totalMark * 100) / 100 + "</font></p>";
    window.top.scrollTo(0, 0);
    return Math.round(totalMark * 100) / 100
}