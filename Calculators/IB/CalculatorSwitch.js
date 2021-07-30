
var totalMark = 0;
var EnglishCondition = false;
var HandasiaCondition = false;
var ElmyaCondition = false;
var CombinedCondition = false;
var AlsonCondition = false;
var NotElmyaCondition = false;
var result = new Array(4);;

var lookup = [{ 'Points': 45, 'Mark': 99.95 }, { 'Points': 44, 'Mark': 99.9 }, { 'Points': 43, 'Mark': 99.8 }, { 'Points': 42, 'Mark': 99.7 }, { 'Points': 41, 'Mark': 99.45 }
    , { 'Points': 40, 'Mark': 99.15 }, { 'Points': 39, 'Mark': 98.7 },{ 'Points': 38, 'Mark': 98.15 }, { 'Points': 37, 'Mark': 97.4 }, { 'Points': 36, 'Mark': 96.55 }, { 'Points': 35, 'Mark': 95.55 }
    , { 'Points': 34, 'Mark': 94.45 }, { 'Points': 33, 'Mark': 93.15 }, { 'Points': 32, 'Mark': 91.8 }, { 'Points': 31, 'Mark': 90.25 }, { 'Points': 30, 'Mark': 88.55 }, { 'Points': 29, 'Mark': 86.65 }
    , { 'Points': 28, 'Mark': 84.7 }, { 'Points': 27, 'Mark': 82.55 }, { 'Points': 26, 'Mark': 80.4 }, { 'Points': 25, 'Mark': 78.1 }];

function FillQualificationCB(){
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
function StartCalculations(sSubjectList) {
    var sl = new Array();
    var hl = new Array();
    var Combined = new Array();
    result = [0, 0, 0, 0, 0];
    var htmlstr = "";
    var totalMarkDiv = document.getElementById("dvTotalMark");
    htmlstr = "";
    
 var tempArray = new Array();
 
 var studentList = sSubjectList.split(',');
  for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }

    studentList = tempArray;

    if (studentList.length > 7) {
        alert("انت غير مؤهل من فضلك قم بمراجعة شروط القبول")
        return "غير مؤهل|غير مؤهل|غير مؤهل|غير مؤهل|غير مؤهل";
    }

    totalMark = CalculateTotalMark(studentList);

    for(var i=0;i<studentList.length;i++){
        if(studentList[i].subjectMark > 0){
            if(studentList[i].subjectCode>=3000 && studentList[i].subjectCode<=3029){
                sl.push(studentList[i]);
            }
            if (studentList[i].subjectCode >= 3100 && studentList[i].subjectCode <= 3127){
                hl.push(studentList[i]);
            }
            if (studentList[i].subjectCode == 3200) {
                Combined.push(studentList[i]);
            }
        }
    }

    //check qualifications
    EnglishCondition = QualifyEnglish(studentList);
    CombinedCondition = (Combined.length == 1) ? true : false;
    if (EnglishCondition && CombinedCondition) {
        result[2] = 1;
        HandasiaCondition = QualifyHandsia(hl);
        ElmyaCondition = QualifyElmya(hl);
        AlsonCondition = QualifyAlson(studentList);
        NotElmyaCondition = QualifyNotElmya(studentList);
    }
    else {
        alert("انت غير مؤهل من فضلك قم بمراجعة شروط القبول");
        return "غير مؤهل|غير مؤهل|غير مؤهل|غير مؤهل|غير مؤهل";
    }
    

    var totalmarks = getTotalMarks();
    totalmarks = totalmarks.split("|");
    for (var i = 0; i < totalmarks.length; i++) {
        switch (i) {
            case 0:
                htmlstr = htmlstr + "<p><font size=\"4\" face=\"Verdana\">المجموع الاعتبارى للمجموعة الطبية:" + totalmarks[i] + "</font></p><br>";
                break;
            case 1:
                htmlstr = htmlstr + "<p><font size=\"4\" face=\"Verdana\">المجموع الاعتبارى للمجموعة الهندسية:" + totalmarks[i] + "</font></p><br>";
                break;
            case 2:
                htmlstr = htmlstr + "<p><font size=\"4\" face=\"Verdana\">المجموع الاعتبارى للمجموعة الادبية:" + totalmarks[i] + "</font></p><br>";
                break;
            case 3:
                htmlstr = htmlstr + "<p><font size=\"4\" face=\"Verdana\">المجموع الاعتبارى لكليات و معاهد اللغات والالسن:" + totalmarks[i] + "</font></p><br>";
                break;
            case 4:
                htmlstr = htmlstr + "<p><font size=\"4\" face=\"Verdana\">المجموع الاعتبارى للمجموعة العلمية الغير عملية:" + totalmarks[i] + "</font></p><br>";
                break;
        }  
    }
    totalMarkDiv.innerText = "";
    totalMarkDiv.innerHTML = "";
    totalMarkDiv.innerHTML = htmlstr;
    return getTotalMarks();
}
function CalculateTotalMark(slist){
    totalMark = 0.0;
   
    for (var i = 0; i < slist.length;i++){

        totalMark = totalMark + parseFloat(slist[i].subjectMark);
    }
    return totalMark;
}

function QualifyEnglish(slist) {
    for (var i = 0; i < slist.length; i++) {
        if (slist[i].subjectCode == 3000 || slist[i].subjectCode == 3001 || slist[i].subjectCode == 3100 || slist[i].subjectCode == 3101) {
            return true;
        }
    }
    return false;
}

function QualifyHandsia(slist) {
    var count = 0;
    for (var i = 0; i < slist.length; i++) {
        if (slist[i].subjectCode == 3110 || slist[i].subjectCode == 3112) {
            count = count + 1;
        }
    }
    if (count == 2) {
        result[1] = 1;
        return true;
    }
    return false;
}
function QualifyElmya(slist) {
    var count = 0;
    for (var i = 0; i < slist.length; i++) {
        if (slist[i].subjectCode == 3111 || slist[i].subjectCode == 3113) {
            count = count + 1;
        }
    }
    if (count == 2) {
        result[0] = 1;
        return true;
    }
    return false;
}
function QualifyAlson(slist) {
    for (var i = 0; i < slist.length; i++) {
        if (slist[i].subjectCode == 3002 || slist[i].subjectCode == 3003 || slist[i].subjectCode == 3006 || slist[i].subjectCode == 3007 || slist[i].subjectCode == 3008 || slist[i].subjectCode == 3009 || slist[i].subjectCode == 3102 || slist[i].subjectCode == 3103 || slist[i].subjectCode == 3106 || slist[i].subjectCode == 3107 || slist[i].subjectCode == 3008 || slist[i].subjectCode == 3009) {
            result[3] = 1;
            return true;
        }
    }
    return false;
}
function QualifyNotElmya(slist) {
    var math = 0;
    var chem = 0;
    var bio = 0;
    var phys = 0;
    for (var i = 0; i < slist.length; i++) {
        switch (parseInt(slist[i].subjectCode)) {
            case 3010:
            case 3011:
            case 3110:
                math = 1;
                break;
            case 3013:
            case 3111:
                chem = 1;
                break;
            case 3014:
            case 3112:
                phys = 1;
                break;
            case 3015:
            case 3113:
                bio = 1;
                break;
        }
    }
    var sum = math + chem + bio + phys;
    if (sum >= 2) {
        result[4] = 1;
        return true
    }
    return false;
}
function getTotalMarks() {
    var strresult = ""
    for (var i = 0; i < result.length; i++) {
        if (result[i] == 1) {
            strresult = strresult + getMark(totalMark) + "|";
        }
        else {
            strresult = strresult + "غير مؤهل"  + "|";
        }
    }
    return strresult.slice(0,-1);
}
function getMark(Points) {
    for (var i = 0; i < lookup.length; i++) {
        if (lookup[i].Points == Points) {
            return lookup[i].Mark;
        }
    }
    return 0;
}
