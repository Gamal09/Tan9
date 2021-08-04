//grade11,grade12
var grade10 = new Array()
var grade11 = new Array()
var grade12 = new Array()
var weightgrade10 = 2700;
var weightgrade1112 = 2700;
grade10Exists = false;
grade11Exists = false;
var totalMark = 0;
var grade10Classes  = 0;
var grade11Classes  = 0;
var grade12Classes  = 0;
//-----
var Totalg10 = 0.0;
var Totalg11 = 0.0;
var Totalg12 = 0.0;
function FillQualificationCB(){
//    var newOpt;
 //   var QCB = document.getElementById("QCB");
 //   AddItem(QCB, "جميع الكليات أدبي", 0)
    var QCB = document.getElementById("QCB");
    QCB.style.display = "none";
    var totalMarkDiv = document.getElementById("dvTotalMark");
    totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> فى جميع الحالات يشترط استيفاء الطالب للمواد المؤهلة للقبول بكل كلية أو معهد والشروط العامة وقواعد القبول الموضحة بدليل الطالب الموجود على الموقع والذى قام الطالب بتسلمه مع الرقم السرى وننصح الطالب بمراجعة الدليل بدقة قبل بدء تسجيل رغباته.فى حالة وجود أى استفسار يمكنكم الرجوع لمكتب التنسيق بالقاهرة أو الأسكندرية أو أسيوط.</font></p>";

}

function AddItem(objListBox, strText, strId) {
    var newOpt;
    newOpt = document.createElement("OPTION");
    newOpt = new Option(strText, strText);
    newOpt.id = strId;
    objListBox.add(newOpt);
}
function StartCalculations(sSubjectList){
//Halt Calculations
     var tempArray = new Array();
 
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

    //Create subjects for each grade
    grade10 = new Array()
    grade11 = new Array()
    grade12 = new Array()
    for(var i=0;i<studentList.length;i++){
        if(studentList[i].subjectMark >0){
            if((studentList[i].subjectCode>=2050 && studentList[i].subjectCode<=2056)){//Grade 10 exists and push into grade 10 array
                grade10.push(studentList[i])
                grade10Exists = true
            }
            if((studentList[i].subjectCode>=2075 && studentList[i].subjectCode<=2082)){//Grade 10 exists and push into grade 11 array
                grade11.push(studentList[i])
                grade11Exists = true
            }
           if((studentList[i].subjectCode>=2100 && studentList[i].subjectCode<=2107)){//Grade 12 exists and push into grade 10 array
                grade12.push(studentList[i])
            }
        }
    }
   //calculate marks
    CalculateTotalMark()
    if (grade10Exists== true){
        totalMark = 41000 * ((0.1 * Totalg10/weightgrade10) + (0.30 *Totalg11/weightgrade1112) + (0.6 * Totalg12/weightgrade1112))
    }else{
        totalMark = 41000 * ((0.4 *Totalg11/weightgrade10) + (0.6 * Totalg12/weightgrade1112))
    }
    //var totalMarkDiv = document.getElementById("AllQualification");
    //totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> المجموع الاعتباري:"+ Math.round(totalMark)/100 +"</font></p>";
    //parent.document.getElementById("totalMarkDIV").innerHTML = "<p><font size=\"4\" face=\"Verdana\"> مجموع الدرجات :" + Math.round(totalMark * 100) / 100 + "</font></p>";
    return Math.round(totalMark) / 100;
}
function CalculateTotalMark(){
    weightgrade10 = 2700;
    weightgrade1112 = 2700;
    totalMark = 0.0;
    Totalg10 = 0.0;
    Totalg11 = 0.0;
    Totalg12 = 0.0;

    for (var i=0;i<grade10.length;i++){
        try{
            Totalg10 = Totalg10 + parseFloat(Map((grade10[i])));
        }
        catch(err){
        }
    }
    for (var i=0;i<grade11.length;i++){
        try{
            Totalg11 = Totalg11 + parseFloat(Map((grade11[i])));
        }
        catch(err){
        }
    }
    for (var i=0;i<grade12.length;i++){
        try{
            Totalg12 = Totalg12 + parseFloat(Map((grade12[i])));
        }
        catch(err){
        }
    }
}
function sortByCode(obj1, obj2){
	if(obj1.subjectCode==obj2.subjectCode)
		return 0
	else if(obj1.subjectCode>obj2.subjectCode)
		return 1
	else return -1
}
function Map(subject){
    if (subject.subjectCode==2050){return subject.subjectMark*6}
    if (subject.subjectCode==2051){return subject.subjectMark*5}
    if (subject.subjectCode==2052){return subject.subjectMark*5}
    if (subject.subjectCode==2053){return subject.subjectMark*4}
    if (subject.subjectCode==2054){return subject.subjectMark*4}
    if (subject.subjectCode==2055){return subject.subjectMark*3}
    if (subject.subjectCode==2056){
        weightgrade10 = 2900;
        weightgrade1112 = 2800;
        return subject.subjectMark*2
        }
    if (subject.subjectCode==2075){return subject.subjectMark*6}
    if (subject.subjectCode==2076){return subject.subjectMark*5}
    if (subject.subjectCode==2077){return subject.subjectMark*2}
    if (subject.subjectCode==2078){
        weightgrade10 = 2900;
        weightgrade1112 = 2800;
        return subject.subjectMark*1
        }
    if (subject.subjectCode==2079){return subject.subjectMark*4}
    if (subject.subjectCode==2080){return subject.subjectMark*4}
    if (subject.subjectCode==2081){return subject.subjectMark*2}
    if (subject.subjectCode==2082){return subject.subjectMark*4}
    if (subject.subjectCode==2100){return subject.subjectMark*6}
    if (subject.subjectCode==2101){return subject.subjectMark*5}
    if (subject.subjectCode==2102){return subject.subjectMark*2}
    if (subject.subjectCode==2103){
        weightgrade10 = 2900;
        weightgrade1112 = 2800;
        return subject.subjectMark*1
        }
    if (subject.subjectCode==2104){return subject.subjectMark*4}
    if (subject.subjectCode==2105){return subject.subjectMark*4}
    if (subject.subjectCode==2106){return subject.subjectMark*2}
    if (subject.subjectCode==2107){return subject.subjectMark*4}
}