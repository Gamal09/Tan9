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
function StartCalculations(sSubjectList) {
    var tempArray = new Array();
    var totalMark = 0;
    var Base = 0;
    var subjectBase = 0;

    var studentList = sSubjectList.split(',');
    for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }
    var total = 0;
    studentList = tempArray;
    //studentList.splice(0, 1); //remove first element for being a comma
    //studentList.splice(studentList.length - 1, 1); 
    for (var i = 0; i < studentList.length; i++) {
        totalMark += parseFloat(studentList[i].subjectMark);
        switch (studentList[i].subjectCode) {
            case "1100":
            case "1115":
                subjectBase = 80;
                break;
            case "1101":
            case "1118":
                subjectBase = 160;
                break;
            case "1102":
            case "1110":
                subjectBase = 80;
                break;
            case "1103":
            case "1113":
                subjectBase = 80;
                break;
            case "1104":
            case "1114":
                subjectBase = 200;
                break;
            case "1105":
            case "1116":
                subjectBase = 200;
                break;
            case "1106":
            case "1117":
                subjectBase = 160;
                break;
            case "1107":
            case "1112":
                subjectBase = 200;
                break;
            case "1108":
            case "1111":
                subjectBase = 200;
                break;
            default:
                subjectBase = 1000;
                break;
        }
        var markOnBase = studentList[i].subjectMark / subjectBase;
        total = total + markOnBase; 
    }

    totalMark = 410 * (total / studentList.length);
        //var totalMarkDiv = document.getElementById("AllQualification");
        //totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> مجموع الدرجات :" + Math.round(totalMark * 100) / 100 + "</font></p>";
        window.top.scrollTo(0, 0);
        return Math.round(totalMark *100 )/ 100
    }