//***********Switch Condition CONTROLS************************/


function loadXML(xmlFile) {
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", xmlFile, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    return xmlDoc;
}


function verifyxmlDoc()
{ 
	if (xmlDoc.readyState != 4)
	{ 
		return false; 
	}
}


//alert("Qualify AD")

var Qualifications = new Array(16);
var Conditions = new Array(27);
var SubjectGroups = new Array();
var analysisList = new Array();


gdReader = loadXML("https://localhost:44346/Calculators/AD/IGCSE-AD.xml");
/********Conditions******************/
    for (i = 0; i < gdReader.childNodes[0].childNodes[3].childNodes.length; i++) {

        try {
            Conditions[parseInt(gdReader.childNodes[0].childNodes[3].childNodes[i].getAttribute("id"))] = new Array(gdReader.childNodes[0].childNodes[3].childNodes[i].getAttribute("conditions"), gdReader.childNodes[0].childNodes[3].childNodes[i].getAttribute("qualified"));
        } catch (e) {
        }
    }


/***American Deploma Qualification Types**/
//function SetADConditions() {
    for (i = 0; i < gdReader.childNodes[0].childNodes[1].childNodes.length; i++) {
        try {
            Qualifications[parseInt(gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("id"))] = new Array(gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("qualifications"), gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("condition"), gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("attr3"), gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("subjectGroup"));
        } catch (e) {
        }
    }

/***************Subject Groups***********/
//function SetADSubjectGroups() {
    SubjectGroups = new Array();
    //Basic Qualification Conflicts , Disabled whenever complementary is initated
    for (i = 0; i < gdReader.childNodes[0].childNodes[5].childNodes.length; i++) {
        try {
            SubjectGroups[parseInt(gdReader.childNodes[0].childNodes[5].childNodes[i].getAttribute("id"))] = new Array(gdReader.childNodes[0].childNodes[5].childNodes[i].getAttribute("subjectList"), gdReader.childNodes[0].childNodes[5].childNodes[i].getAttribute("used"), gdReader.childNodes[0].childNodes[5].childNodes[i].getAttribute("activeGroup"));
        } catch (e) {
        }
    }

function ShowQualification(obj) {
    var ss = obj.selectedIndex;
    for (var i = 0; i < 15; i++) {
        document.getElementById('dvQualification' + (i + 1)).style.display = 'none'
    }
    document.getElementById('dvQualification' + (obj.selectedIndex + 1)).style.display = 'block'
}


/*******Check Qualification functions**********/

function CalculateQualifications(StudentSubjectList) {
    var QualificationObjectsArray = new Array();
    
    analysisList = new Array();
    //Testing Qualification Conditions
    //StudentChoicesQualifications= document.getElementById("lbStudentQualifications").options;//Grap Qualifications
    for (var sQualification = 0; sQualification < 10 ; sQualification++) {
        var qualificationId = sQualification //+ 3;
        
     
        /***************************************************************************/
        
        var QualifyResult;
        var qSubjects;
    
        var qualifyObject;
        qualifyObject = new QualifyStudent(131, StudentSubjectList, qualificationId, sQualification+1);
        
        QualifyResult = qualifyObject.EvaluateCondition();
        //qSubject[0] == Subject Name
        //qSubject[1] == Subject Mark
        //qSubject[2] == Subject Code
        qSubjects = qualifyObject.currentQualificationSubjects;  
        
      var qResult = "";
        
        if (QualifyResult == true) {
            Qualifications[qualificationId][2] = true;
            //if the student is qualified ,  Calculate Mark
            qResult = Math.round(100000 * CalculateMark(qSubjects)) / 100000;
        }else{//Not Qualified
            qResult = 'غير مؤهل';
        }
        qualifyObject.qMark = qResult;
        QualificationObjectsArray.push(qualifyObject);
        
        
    }
    //sSubject [0] == Subject Code
    //sSubject [1] == Subject Mark
    //sSubject [2] == Subject Name
    //sSubject [3] == Subject Mark
    var studentList = new Array();
    studentList = StudentSubjectList.split(',');
    for (var j = 0; j < studentList.length; j++) {
        studentList[j] = studentList[j].toString().split('|');
    }
    //studentList.splice(0, 1); //remove first element
    //studentList.splice(studentList.length - 1, 1); //remove Last element
        
    var DisplayObject;
    if (document.URL.indexOf("GenerateQualifications") < 0) {
        DisplayObject = new ShowQualificationStudent(QualificationObjectsArray);
    } else {
        DisplayObject = new ShowQualificationAdmin(QualificationObjectsArray, document.getElementById("Wizard1$tbStudentSubjects").name);
    }

}

///calculate the Mark if student is qualified
function CalculateMark(SubjectArray){
    var SubjectMarks=0;
    var SATI=0;
    var SATII=0;
    
    //remove the part of Certificate code check, as we need only AD
    for (var i=0;i<SubjectArray.length;i++){
        if(SubjectArray[i][0].indexOf('SAT')<0){// Accumelate School Subject Marks
            SubjectMarks=SubjectMarks+parseFloat(SubjectArray[i][1])
        }
        if(SubjectArray[i][0].indexOf('SAT-I:')>=0){//Grap SAT I Mark
            SATI=parseFloat(SubjectArray[i][1])
        } 
        if(SubjectArray[i][0].indexOf('SAT-II:')>=0){//Grap SAT II Mark
            SATII=parseFloat(SubjectArray[i][1])
        }        
    }
    //The LAW OF MARKS
    if (SATI<1090){
        return 100*((SubjectMarks*0.4/800)+  (SATI*0.6/1600) + (SATII*0.15/1600));
    }else{
        return 100*((SubjectMarks*0.4/800)+  (SATI*0.69/1600) + (SATII*0.15/1600));
    }

    return 0;
}