
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

/***Qualification Types**/
var Qualifications = new Array(16);
var Conditions = new Array(31);
var analysisList = new Array();

gdReader=loadXML("http://development.tansik.eng.cu.edu.eg/newFtansik/Calculators/IG/IGCSE-IG.xml");
/********Conditions******************/
for (i = 0; i < gdReader.childNodes[0].childNodes[3].childNodes.length; i++) {
    try {
        Conditions[parseInt(gdReader.childNodes[0].childNodes[3].childNodes[i].getAttribute("id"))] = new Array(gdReader.childNodes[0].childNodes[3].childNodes[i].getAttribute("conditions"), gdReader.childNodes[0].childNodes[3].childNodes[i].getAttribute("qualified"), gdReader.childNodes[0].childNodes[3].childNodes[i].getAttribute("subjects"));
    } catch (e) {
    }
}

/***IG Qualification Types**/
for(i=0;i<gdReader.childNodes[0].childNodes[1].childNodes.length;i++){
    try{
        Qualifications[parseInt(gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("id"))] = new Array(gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("qualifications"), gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("condition"), gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("qualified"), gdReader.childNodes[0].childNodes[1].childNodes[i].getAttribute("subjectGroup"));
    } catch (e) {
        //alert(e.message)
    }
}


 /***********IG Subjects For Complementary************/
var OLevelSubjectList = ',50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,';
var ALevelSubjectList = ',101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,';
var ASLevelSubjectList = ',151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,';
var IGSubjects = OLevelSubjectList// Holding All Complementary Subjects
/*******Check Qualification functions**********/

function ShowQualification(obj) {
    var ss = obj.selectedIndex;
    for (var i = 0; i < 15; i++) {
        document.getElementById('dvQualification' + (i + 1)).style.display = 'none'
    }

    document.getElementById('dvQualification' + (obj.selectedIndex + 1)).style.display = 'block'
}

function CalculateQualifications(StudentSubjectList) {
    var QualificationObjectsArray = new Array();
    analysisList = new Array();
    //Calculate Qualifications
    //Adjust for double award for 132
    if (StudentSubjectList.indexOf(",90|") >= 0 && StudentSubjectList.indexOf(",91|") >= 0) {//has double award
        //remove double award
        StudentSubjectList = StudentSubjectList.replace((90), "9990");
        StudentSubjectList = StudentSubjectList.replace((91), "9991");
        //Insert Physics,Chemistry,Biology 55,56,57
        if (StudentSubjectList.indexOf(",55|") < 0) { StudentSubjectList+= "55|C," }
        if (StudentSubjectList.indexOf(",56|") < 0) { StudentSubjectList += "56|C," }
        if (StudentSubjectList.indexOf(",57|") < 0) { StudentSubjectList += "57|C," }
        //raising the double award additional subject (+1 Complementary)condition
        for (var z = 0; z < Qualifications.length; z++) {
            Qualifications[z][1] += ",32";
        }
    }
    
    for (var X = 0; X < 15; X++) {
        var qualificationId = X + 3;
        //*************************************Begin IGQualification Object ************************//
        var QualifyResult = true;
        var qSubjects = new Array();
        var QMark = 0;

      
        var IGQualigyObject = new QualifyIGStudent(132, StudentSubjectList, qualificationId, (X + 1));
        
        QualifyResult = IGQualigyObject.EvaluateCondition();
        //return qualifiedSubjects, and check if >= 7
        qSubjects = IGQualigyObject.currentQualificationSubjects

        //var QSubjectsCopy = qSubjects.clone();
        var QSubjectsCopy = new Array();
        for (var m = 0; m < qSubjects.length; m++) {
            QSubjectsCopy.push(qSubjects[m]);
        }

        //****************************************End IGQualification Object **************************//
        // if QualifyResult 
        //  ConiditionFailed   /State of 7 and for now the missing is complementary***to be changed
        //                 call IG Bonus with Flag (QUalificationID, ACondition Failed)

        // لازم البونص يرجع بقيمة علشان ينفع التأهيل


        //in case OL8 OR OL7 (missing complementary) OR OL8 - (1 complementary) to maximize Mark
            if (QualifyResult) {
            IGBonus = 0;
            //if the Qualification is succeed or failed in one of the compelementary condition
            if (IGQualigyObject.AConditionFailed < 100) {
             
                //push bonus subjects
                var IGBonusObject = new IGQualificationBonus(StudentASLSubjectList);
                //calculate the maximum IG Bonus subjects
                ///qualificationId: the qualification Number
                ///qSubjects: the student Qualification subjects
                ///IGQualigyObject.AConditionFailed: the condition Number in case of condition failure
                ///new Array(): the array to search for alternative subjects in
                var IGBonus = IGBonusObject.CalculateIGBonus(qualificationId, qSubjects, IGQualigyObject.AConditionFailed, new Array());
                for (var B = 0; B < IGBonus.length; B++) {
                    if (IGBonus[B].subjectMark > 0) {//if there are valid AL or ASL subjects for the qualification move into results
                        //if AConditionFailed > 0 --> 7 subjects
                        //**basem  if (IGQualigyObject.AConditionFailed > 0) {
                         switch (IGBonus[B].subjectStatus){
                            case 0:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "شروط تأهيل إضافية", "أضيفت لتحقيق أحد شروط التأهيل", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            break;
                            case 1:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "شروط تأهيل إضافية", "أضيفت لتحسين المجموع", new Array(new Array(IGBonus[B].subjectName, IGBonus[B].subjectMark)), new Array()));
                            break;
                            case -1:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "شروط تأهيل إضافية", "أضيفت لتحسين المجموع", new Array(new Array(IGBonus[B].subjectName, IGBonus[B].subjectMark)), new Array()));
                            break;
                            case 2:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], Conditions[IGQualigyObject.AConditionFailed][0], "أضيفت لتحقق شرط فشل بالمواد المكملة", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            break;
                            case -2:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], Conditions[IGQualigyObject.AConditionFailed][0], "ملغاة", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            break;
                            default:
                        }
            
                        qSubjects.push(IGBonus[B]);
                        //qSubjects.push(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark));
                    }
                }
                //calculate the student taken subjects mark
                QMark = CalculateMark(qSubjects);
                
                //in case of no failure, search for the minimum compelementary subject mark to try replacing it with
                //one of the advanced subjects
                if (IGQualigyObject.AConditionFailed == 0) {
                    var MinCompelemntaryGrade = 200;
                    var MinComplementaryIndex;
                    for (var i = 0; i < QSubjectsCopy.length; i++) {
                        if (QSubjectsCopy[i].subjectName.indexOf('C_') >= 0) {
                            if (parseInt(QSubjectsCopy[i].subjectMark) < MinCompelemntaryGrade) {
                                MinCompelemntaryGrade = parseInt(QSubjectsCopy[i].subjectMark);
                                MinComplementaryIndex = i;
                            }
                        }
                    }
                    //***2010***STOP SEEKING Better Bonus ****2010***//
                    MinComplementaryIndex = -1
                    //if there is a complementary subject,
                    if (MinComplementaryIndex >= 0) {
                        var minSubject = QSubjectsCopy[MinComplementaryIndex].subjectName;
                        //var addedSubjects = new Array();
                        var conditionNumber = 0;
                        //get the condition that contains the minimum compelementary subject
                        conditionNumber = QSubjectsCopy[MinComplementaryIndex].conditionNumber;
                        //remove the minimum compelemntary subject from the student qualification subjects
                        QSubjectsCopy.splice(MinComplementaryIndex, 1);

                        IGBonusObject = new IGQualificationBonus(StudentASLSubjectList);
                        //calculate the maximum IG Bonus subjects after removing the compelemntarysubject with the minimum mark
                        var IGBonusMax = IGBonusObject.CalculateIGBonus(qualificationId, QSubjectsCopy, conditionNumber, new Array());
                        //if the IGBonus returned advanced subjects
                        if (IGBonusMax.length > 0) {
                            for (var B = 0; B < IGBonusMax.length; B++) {
                                if (IGBonusMax[B].subjectMark > 0) {//if there are valid AL or ASL subjects for the qualification move into results
                                    QSubjectsCopy.push(IGBonusMax[B]);
                                    //QSubjectsCopy.push(new Array(IGBonusMax[B][2],IGBonusMax[B][3]));
                                }
                            }
                            //calculate the student qualification mark in case of exchanging the subject of
                            //minimum mark with one of the advanced subjects
                            if (QSubjectsCopy.length>=8){var QCopyMark = CalculateMark(QSubjectsCopy);}
                            //if the calculated mark is higher than the mark without exchange, then set the
                            //qualification mark with it and set the qualification subjects with the new one
                            if (QCopyMark > QMark) {
                                for (i = 0; i < IGBonusMax.length; i++) {
                                    if (IGBonusMax[0]!=0){
                                        if (IGBonusMax[i].subjectName.indexOf("ادخال") > -1) {
                                            analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "", "استبدال مادة مكملة بمادة متقدمة لتحسين المجموع", new Array(new Array(IGBonusMax[i].subjectName + "بدلا من : " + minSubject,IGBonusMax[i].subjectMark)), new Array()))
                                        }
                                    }
                                }
                                QMark = QCopyMark;
                                qSubjects = QSubjectsCopy.clone();
                            } // end if(QCopyMark > QMark){
                        }
                    } //end if(MinComplementaryIndex >= 0)

                } //end if(IGQualigyObject.AConditionFailed == 0)
            } else {//if AconditionFailed > 100
                ////check if ACondition failed in basic subject
                ///Get the condition number
                var conditionNumber = IGQualigyObject.AConditionFailed / 100;
                ///Get the condition subjects
                var conditionSubjects = Conditions[conditionNumber][2];
                //the available alternative subjects that are in the condition subjects and the student didn't take them
                var AlternativeSubjects = new Array();
                ///split the subject string to be in array
                var CSubjectArray = new Array();
                CSubjectArray = conditionSubjects.split(',');
                //remove the subjects the the student took them in the qualification from the condition subjects
                RemoveTakenSubjects(CSubjectArray, qSubjects);
                //push the other subjects in the alternative subjects
                for (var i = 0; i < CSubjectArray.length; i++) {
                    AlternativeSubjects.push(CSubjectArray[i])
                }
                //تأهيل العلوم : تضاف مادة الأحياء للبحث عنها في المستويات المتقدمة
                if (qualificationId == 15 && conditionNumber==28 ) {
                    AlternativeSubjects.push(57);
                }

                var IGBonusObject = new IGQualificationBonus(StudentASLSubjectList);
                //Check avialablility of bouns
                var IGBonus = IGBonusObject.CalculateIGBonus(qualificationId, qSubjects, IGQualigyObject.AConditionFailed, AlternativeSubjects);
                //Assume returned is no bonus
                QualifyResult = false;
                //check bouns avialability in returned array
                for (var B = 0; B < IGBonus.length; B++) {
                    if (IGBonus[B].subjectMark > 0) {//if there are valid AL or ASL subjects for the qualification move into results
                        /*if (IGBonus[B].subjectName.indexOf("ادخال") > -1) {
                            analysisList.push(new Array(X + 1, Qualifications[X + 1][0], Conditions[conditionNumber][0], "أضيفت لتحقق شرط فشل بالمواد الأساسية", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()))
                        } else {
                            if (IGBonus[B][0] < 0) {
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "", "أضيفت لتحسين المجموع", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            } else {
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "", "أضيفت لتحقيق أحد شروط التأهيل", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            }
                        }*/
                        switch (IGBonus[B].subjectStatus){
                            case 0:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "", "أضيفت لتحقيق أحد شروط التأهيل", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            break;
                            case 1:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "", "أضيفت لتحسين المجموع", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            break;
                            case -1:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], "", "أضيفت لتحسين المجموع", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            break;
                            case 2:
                                analysisList.push(new Array(X + 1, Qualifications[X + 1][0], Conditions[conditionNumber][0], "أضيفت لتحقق شرط فشل بالمواد المكملة", new Array(new Array(IGBonus[B].subjectName,IGBonus[B].subjectMark)), new Array()));
                            break;
                            default:
                        }
                        qSubjects.push(IGBonus[B]);
                        //qSubjects.push(new Array(IGBonus[B][2],IGBonus[B][3]));
                        QualifyResult = true; //bouns was found
                    }
                }
                QMark = CalculateMark(qSubjects);
            } //end if(IGQualigyObject.AConditionFailed < 100){ 
        } //end if qualify results

         var qResult = "";
         
        //IGBonus will be returned by -1 if there was missing advanced subjects - لطب والهندسه فقط      
        if (QualifyResult && IGBonus != -1 ) { //Check if OL Qualification is received and Advanced is Receieved
            Qualifications[qualificationId][2] = true; // Qualifiication Applies
            /***************Inject/Replace IG OL with AL/ASL *******************/
            //if the student is qualified ,  Calculate Mark
            qResult = Math.round(100000 * QMark) / 100000;
        }else{//Not Qualified
            qResult = 'غير مؤهل';
        }

        IGQualigyObject.currentQualificationSubjects = qSubjects;
        IGQualigyObject.qMark = qResult;

        QualificationObjectsArray.push(IGQualigyObject);
       
        /*************************************/
    }

    //*****************************student Subjects *****************************************///

    var tempArray = new Array();

    var studentList = StudentSubjectList.split(','); //O L  Subjects
    for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }
    studentList = tempArray;

    studentList.splice(0, 1); //remove first element for being a comma
    studentList.splice(studentList.length - 1, 1); //remove Last element for being a comma
    
//    var studentList = StudentSubjectList.split(','); //O L  Subjects
//    for (var j = 0; j < studentList.length; j++) {
//        studentList[j] = studentList[j].toString().split('|');
//    }
//    studentList.splice(0, 1); //remove first element for being a comma
//    studentList.splice(studentList.length - 1, 1); //remove Last element for being a comma

    tempArray = new Array();
    var SASLSubjects = StudentASLSubjectList.split(','); //AL ASL Subjects
    for (var j = 0; j < SASLSubjects.length; j++) {

        var subjectInfo = new Array();
        subjectInfo = SASLSubjects[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }
    SASLSubjects = tempArray;

    SASLSubjects.splice(0, 1)
    SASLSubjects.splice(SASLSubjects.length - 1, 1);

//    var SASLSubjects = StudentASLSubjectList.split(','); //AL ASL Subjects
//    for (var j = 0; j < SASLSubjects.length; j++) {
//        SASLSubjects[j] = SASLSubjects[j].toString().split('|');
//    }
//    SASLSubjects.splice(0, 1)
//    SASLSubjects.splice(SASLSubjects.length - 1, 1);
    
    //push the advanced subjects in the student subject list
    //sSubject[0] == subject code
    //sSubject[1] == subject grade
    //sSubject[2] == subject name
    //sSubject[3] == subject mark
    for (var k = 0; k < SASLSubjects.length; k++) {
        studentList.push(SASLSubjects[k])
    }

    var DisplayObject;
    if (document.URL.indexOf("GenerateQualifications") < 0) {
        DisplayObject = new ShowQualificationStudent(QualificationObjectsArray);
    } else {
        DisplayObject = new ShowQualificationAdmin(QualificationObjectsArray, document.getElementById("Wizard1$tbStudentSubjects").name);
    }

}

//Remove the subjects that the student took them from the subjects conditions
function RemoveTakenSubjects(ConitionSubjects, QualificationSubjects){
    for(var i = 0; i < QualificationSubjects.length; i++){
        for(var j = 0; j < ConitionSubjects.length; j++){
            if(QualificationSubjects[i].subjectCode == ConitionSubjects[j]){
                ConitionSubjects.splice(j, 1);
                j = -1;
            }
        }
    }
}

///calculate the total mark of the qualification subjects array
function CalculateMark(SubjectArray){
    var SubjectMarks = 0;
    var divFac = 0 
    for (var i=0;i<SubjectArray.length;i++){
        var ScaledMark = parseFloat(SubjectArray[i].subjectMark)
        if (SubjectArray[i].subjectStatus != -2) {
            SubjectMarks = SubjectMarks + ScaledMark
            divFac += 1
        }
    }
    ///why multipying by 4.1 ???
    return 4.1 * SubjectMarks / divFac;
}


