function FillQualificationCB(){
    var newOpt;
    var QCB = document.getElementById("QCB");
    AddItem(QCB, "جميع كليات علمي", 0)
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
 var  Base = 900;
 var studentList = sSubjectList.split(',');
  for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }
    
    studentList = tempArray;
    //studentList.splice(0, 1); //remove first element for being a comma
    //studentList.splice(studentList.length - 1, 1); 
    for(var i=0;i<studentList.length;i++){
        totalMark += parseFloat(studentList[i].subjectMark);
    }
    totalMark = (410*totalMark)/Base;
    var totalMarkDiv = document.getElementById("AllQualification");
    //totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> مجموع الاعتبارى :" + Math.round(totalMark * 100) / 100 + "</font></p>";
    return Math.round(totalMark * 100) / 100;
}