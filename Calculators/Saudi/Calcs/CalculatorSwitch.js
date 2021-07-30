    //grade11,grade12
var grade11 = new Array()
var grade12 = new Array()
var totalMark = 0;
var grade11Classes  = 0;
var grade12Classes  = 0;
var CertificateType= "";
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
function StartCalculations(){
    try{
        sSubjectList = "," + document.getElementById("Wizard1$tbStudentSubjects").value;
    } catch (e) {
        try{
            sSubjectList = "," + document.getElementById("Wizard1_tbStudentSubjects").value;
        } catch (e) {
        }
    }
 var tempArray = new Array();
 
 var  Base = 10000;
 var studentList = sSubjectList.split(',');
  for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }
    
    studentList = tempArray;
    studentList.splice(0, 1); //remove first element for being a comma
    studentList.splice(studentList.length - 1, 1); 

    //Create subjects for each grade
    grade11 = new Array();
    grade12= new Array();
    for(var i=0;i<studentList.length;i++){
        if(studentList[i].subjectMark >0){
  if((studentList[i].subjectCode>=1500 && studentList[i].subjectCode<=1521) |(studentList[i].subjectCode>=1550 && studentList[i].subjectCode<=1567)|(studentList[i].subjectCode>=1590 && studentList[i].subjectCode<=1607)|(studentList[i].subjectCode>=1628 && studentList[i].subjectCode<=1655) |(studentList[i].subjectCode>=1682 && studentList[i].subjectCode<=1703)){////subject falls in grade 11                grade11.push(studentList[i])
                grade11.push(studentList[i])
            }else{
                grade12.push(studentList[i])
            }
        }
    }
    //Sort Grade11 and Grade12 Arrays on Subject Code
    grade11.sort(sortByCode)
    grade12.sort(sortByCode)
    
    //FindOutFactors
    var g11Factor =0;
    //debug
    for (i=0;i<grade11.length;i++){
        g11Factor = g11Factor + (parseFloat(grade11[i+1].subjectMark)/parseFloat(grade11[i].subjectMark))
        i=i+1
    }
    if (parseInt(g11Factor) < g11Factor)
        alert("لديك خطأ في ادخال درجات الصف الثاني الثانوي يتوجب عليك مراجعة الدرجات لضمان صحة الاستكمال")
   var g12Factor =0;
    //debug
    for (i=0;i<grade12.length;i++){
        g12Factor = g12Factor + (parseFloat(grade12[i+1].subjectMark)/parseFloat(grade12[i].subjectMark))
        i=i+1
    }
    if (parseInt(g12Factor) < g12Factor)
        alert("لديك خطأ في ادخال درجات الصف الثالث الثانوي يتوجب عليك مراجعة الدرجات لضمان صحة الاستكمال")
    grade11Classes = g11Factor;
    grade12Classes = g12Factor;
    
    //FindOut Certificate Code ** This is not good
    /*var MinG11Code = grade11[0].subjectCode;
    switch(parseInt(MinG11Code)){
        case 1500: //101بنات أدبي
            grade11Classes = 26;
            grade12Classes = 26;
            CertificateType = "جميع الكليات الأدبية"
            break;
        case 1550: //103بنات علمي
            grade11Classes = 28;
            grade12Classes = 27;
            CertificateType = "جميع الكليات العلمية"
            break;
        case 1590: //104بنين علوم طبيعيه
            grade11Classes = 28;
            grade12Classes = 28;
            CertificateType = "جميع الكليات العلمية"
            break;
        case 1628://141بنين علوم إدارية
            grade11Classes = 25;
            grade12Classes = 25;
            CertificateType = "جميع الكليات الأدبية"            
            break;
        case 1682://142بنين علوم شرعية
            grade11Classes = 19;
            grade12Classes = 19;
            CertificateType = "جميع الكليات الأدبية"            
            break;
        } */
   //calculate marks
    CalculateTotalMark()
    totalMark = (410 * totalMark)
    var totalMarkDiv = document.getElementById("AllQualification");
    totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> المجموع الاعتباري:"+ totalMark/100 +"</font></p>";
    //parent.document.getElementById("totalMarkDIV").innerHTML = "<p><font size=\"4\" face=\"Verdana\"> مجموع الدرجات :" + Math.round(totalMark * 100) / 100 + "</font></p>";
}
function CalculateTotalMark(){
    totalMark = 0.0;
    //var Factorg11 = 0.0;
    //var Factorg12 = 0.0;
    var Totalg11 = 0.0;
    var Totalg12 = 0.0;
    for (var i=0;i<grade11.length;i++){
        try{
        //Factorg11 = Factorg11 + (parseFloat(grade11[i].subjectMark)/parseFloat(grade11[i+1].subjectMark));
        i=i+1; // jump to balanced mark for same subject
        Totalg11 = Totalg11 + parseFloat((grade11[i].subjectMark))
       
        }
        catch(err){
        }
    }
    //alert("Grade 11 =" + Totalg11)
    //alert("Grade 11 Factor = " + grade11Classes)
    totalMark = totalMark+ parseFloat(0.35 *(Totalg11/grade11Classes))
    for (var i=0;i<grade12.length;i++){
        try{
        //Factorg12 = Factorg12 + (parseFloat(grade12[i].subjectMark)/parseFloat(grade12[i+1].subjectMark));
        i=i+1; // jump to balanced mark for same subject
        Totalg12 = Totalg12 + parseFloat((grade12[i].subjectMark));
        }
        catch(err){
        }
    }
    //alert("Grade 12 =" + Totalg12)
    //alert("Grade 12 Factor = "+ grade12Classes)
    totalMark = totalMark+ parseFloat(0.35 *(Totalg12/grade12Classes))
    var Capabilities = parent.document.getElementById("CPMarkDIV").innerHTML //grap capabilities
    //alert("Kodrat ="+Capabilities)
    totalMark = parseFloat(totalMark)+ (0.3* parseFloat(Capabilities)||0)
}
function sortByCode(obj1, obj2){
	if(obj1.subjectCode==obj2.subjectCode)
		return 0
	else if(obj1.subjectCode>obj2.subjectCode)
		return 1
	else return -1
}
