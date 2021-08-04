//alert("Qualification JS file")
//ToContinue:: YARAB
//Qualify Object
function QualifyStudent(certificate, sSubjectList, specialization, qualifictaionNumber){
    //read Qualification row
    this.sQualification = "";
    var qName = "";

    this.qConditions = new Array();
    var qualConditions = new Array();

    this.qMark = 0;
    
//    var studentList = new Array();
//    studentList = sSubjectList.split(',');
//    for (var j = 0; j < studentList.length; j++) {
//        studentList[j] = studentList[j].toString().split('|');
//    }

    var tempArray = new Array();

    var studentList = sSubjectList.split(',');
    for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }
    studentList = tempArray;
    
    //studentList.splice(0, 1); //remove first element
    //studentList.splice(studentList.length - 1, 1); //remove Last element

    //read the qualification corresponding condition
    var conditionList = new Array();
    
    this.currentQualificationSubjects = new Array();
    var qualSubjects = new Array();
    
    //determine the reasons of success or failure with each condition
    //condition Name, Status, selected subjects whether qualified or not
    //this.reasons = new Array();
    
    //qualification active subject groups
    var activeSubjectGroups = new Array();
        
    var subjectsOfFailure = new Array();
    var subjectsOfSuccess = new Array();
    
    /***********AD Subjects For Complementary************/
    var SchoolSubjects = ',201,202,203,204,205,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,255,256,257,258,259,270';
    SchoolSubjects = SchoolSubjects+',1201,1202,1203,1204,1205,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1234,1235,1236,1237,1238,1239,1240,1241,1242,1243,1244,1245,1246,1247,1248,1249,1255,1256,1257,1258,1259,1270';
    var SATISubjects = ',251,252,253';
    var SATIISubjects = ',260,261,262,263';
    var ADSubjects = SchoolSubjects //+ ',' + SATISubjects + ',' + SATIISubjects

    //*********************************************************//
    //functions prototype
    this.LoadQualificationInfo = LoadQualificationInfo;
    this.LoadConditionList = LoadConditionList;
    this.GetSubjectGroupsInfo = GetSubjectGroupsInfo;
    //*********************************************************//
    
    LoadQualificationInfo();    
    
    //load the student Qualification info
    //the first function to be loaded
    function LoadQualificationInfo(){
        qName = Qualifications[specialization][0];
        qualConditions = Qualifications[specialization][1].split(',');
        var qActiveGroup = Qualifications[specialization][3].split(',');
        LoadConditionList(qualConditions);
        GetSubjectGroupsInfo(qActiveGroup);
    }
    
    //load the different conditions for the current student
    //TODO:: to be read from XML directly
    function LoadConditionList(qualificationConditions){
        for(var i = 0; i < qualificationConditions.length; i++)
        {
            conditionList[i] = new Array();
            //qualification condition number
            conditionList[i][0] = qualificationConditions[i];
            //qualification condition from the qualification conditions list
            conditionList[i][1] = Conditions[qualificationConditions[i]][0];
            //boolean indicates whether the student is qualified for that condition or not
            conditionList[i][2] = Conditions[qualificationConditions[i]][1];
        }
    }    
    
    //Get the active subject groups for the current qualification
    function GetSubjectGroupsInfo(activeGroups)
    {
        for(var i = 0; i < activeGroups.length; i++)
        {
            activeSubjectGroups[i] = new Array();
            
            activeSubjectGroups[i][0] = SubjectGroups[activeGroups[i]][0];
            //boolean that determine whether there is a subject selected from this subject group in order 
            //not to select another subject from the same group
            activeSubjectGroups[i][1] = SubjectGroups[activeGroups[i]][1];
            //group Id
            activeSubjectGroups[i][2] = activeGroups[i];
        }
    }
    
    this.EvaluateCondition = function()
    {
        var QualifyResult = true;
        //var conditionOfSuccess = new Array();
        //var conditionOfFailure = new Array();
        
        //var successCount = 0;
        //var failureCount = 0;
        var failureQualificationCount = 0;
        
        for (var i = 0; i < conditionList.length; i++) {
            //let the array is empty to fill it with the failure subjects of the new condition
            subjectsOfFailure = new Array();
            subjectsOfSuccess = new Array();
            //evaluate Condition for American Deploma
            ECAD(conditionList[i][0]);
            QualifyResult = QualifyResult && Conditions[conditionList[i][0]][1];
            
            //we need also the subjects of success not only on the condition level
            //check if the evaluated condition is true
            if(Conditions[conditionList[i][0]][1] == true)
            {
                //condition succeed
                analysisList.push(new Array(qualifictaionNumber, qName, conditionList[i][1], "تحقق", subjectsOfSuccess, new Array()));
            }
            else
            {   
                //condition failed
                analysisList.push(new Array(qualifictaionNumber, qName, conditionList[i][1], "لم يتحقق", subjectsOfFailure, subjectsOfSuccess));
            }
        }
        this.currentQualificationSubjects = qualSubjects;
        this.sQualification = qName;
        this.qConditions = qualConditions;
        return QualifyResult;
    }
    
    //***************************** calculation functions************************************//
    //modified
    function IsInActiveBasicGroup(SubjectCode, subjectName) {
        //check only in qualification active subject groups
        for (var i = 0; i < activeSubjectGroups.length; i++) {
            if ((activeSubjectGroups[i][1] == true) && (activeSubjectGroups[i][0].indexOf("," + SubjectCode + ",") >= 0)) {
               //CASE 17 Advanced Subjects
               //Allow Advanced Subjects Together
               //Prevent Any Further Coupling
               
               //Detailed Failure Reasons
               subjectsOfFailure.push(new Array(subjectName, "تم دراسة مادة مكافئة \n"));
                
                return true;
            }
        }
        return false;
    }
    
    //modified
    function IsInActiveAllTimeGroup(SubjectCode, subjectName) {
        //as active all time groups begin from 16, we get the qualification activeSubjectGroup id
        //and if it equals to on of the acive all time group index, then we check if it is used and have the 
        //current subject code or not, in order to consider it in one of the active all time groups 
        for (var i = 0; i < SubjectGroups.length; i++) {
            for(var j = 0; j < activeSubjectGroups.length; j++){
                if(activeSubjectGroups[j][2] == i){
                    if((activeSubjectGroups[j][1] == true) && (activeSubjectGroups[j][0].indexOf("," + SubjectCode + ",") >= 0)){
                       
                       var NewError = true;
                       //Detailed Failure Reasons
                        for (var k=0; k<subjectsOfFailure.length;k++){
                            if (subjectsOfFailure[k][0] == subjectName)
                                NewError= false;
                        }
                       if (NewError)
                            subjectsOfFailure.push(new Array(subjectName, "تم دراسة مادة مكافئة  \n"));
                       
                       return true;
                    }
                }
            }
        }
        return false;
    }

    //modified
    function CheckAgainestSubjectGroups(SubjectCode) {
        //check in only qualification active subject groups
        //no need to check if that group is active, as all of them are active groups
        for (var i = 0; i < activeSubjectGroups.length; i++) {
            if (activeSubjectGroups[i][0].indexOf("," + SubjectCode + ",") >= 0) {
                //alert(SubjectCode + " Was found in Group " + SubjectGroups[i][0] + " Hence will Block later Group Subjects")
                activeSubjectGroups[i][1] = true;
            }
        }
    }


    
    /******Subject Taken For Qualification From Different Year ********/
    //modified
    function SubjectTakenFromDifferentYear(SubjectCode, subjectName){
        //remove the part of IG, remove the check of AD (certificate code = 131)
        var TakenSubjectCode;
        var TakenSubjectCode1;
        //if (CertificateCode ==131){ // American Diploma
        if (SubjectCode > 1000){ //Check G11 againest G12
            TakenSubjectCode = parseInt(SubjectCode)-1000;
        }else{ //Check G12 againest G11
            TakenSubjectCode = parseInt(SubjectCode)+1000;
        }
        if (SubjectTaken(TakenSubjectCode)){
           //Detailed Failure Reasons
           subjectsOfFailure.push(new Array(subjectName, "تم دراسة المادة في الصف الدراسي الآخر \n"));
            
            return true;
        }else{
            return false;
        }
        //}
    }
    /*********Subject Taken*****/
    function SubjectTaken(SubjectCode){
        for(var i=0;i<qualSubjects.length;i++){
            if(qualSubjects[i][2] ==SubjectCode){
                return true;
            }
        }
        return false;
    }
    /**********Grade 11 Subjects Reched 3 **********/
    function G11Reached3(SubjectCode, subjectName){
    var G11SCount = 0 ;
        if(SubjectCode<1000){//G12 Subject
            return false;
        }
        for(var i=0;i<qualSubjects.length;i++){
            if(qualSubjects[i][2] >1000){//Subject Code > 1000 falling in Grade 11 list
                G11SCount = G11SCount +1;
            }
        }
        if (G11SCount>2){
           //Detailed Failure Reasons
            subjectsOfFailure.push(new Array(subjectName, "G11Reached3 \n"));
           return true;
        }else{
        return false;
        }
    }
    
    /*******Check Subject*************/
    function GSM(Subject){ //Get Subject Mark
        var _start, _end, _mark;
        //get Marks fromm sList (from TB in the aspx page)
         _start = sSubjectList.indexOf(","+Subject+"|", 0)
         if (_start >= 0) {
             _start = _start + ("," + Subject + "|").length;
            _end = sSubjectList.indexOf(",", _start);
			if (_end ==-1)
					_end = sSubjectList.length;
            _mark = sSubjectList.substr(_start, _end - _start)//1 char for letter grades
            return _mark;
        } else {
        return 0;
        }
    }

    
    function GSC(ElectiveList,MinGrade,RequiredCount) {
    ///<sumary>this function tryies to obtain the required count of subjects out of a pool f subjects</sumary>
    ///<param name="ElectiveList" type="String">the subject pool comma separated</param>
        var Count = 0; //initialize the succesful count of subjects to zero , i.e none yet has been found
        var Subjects = ElectiveList.toString().split(',') //convert the subject pool into array
        for (var j = 0; j < studentList.length; j++) {//Loop on student subjects to find any of the pool subjects
            for (var i = 0; i < Subjects.length; i++) {//Loop on the pool subjects
                if ((studentList[j].subjectCode == Subjects[i] ) && (parseFloat(studentList[j].subjectGrade)>= 50) ) {//subject grade is higher than or equal to the minimum grade then
                //if the pivot subject in pool I is equal to the pivot in student subjects J and the student
                
                    if (ElectiveList.indexOf("+") >= 0) {//Complementary Check
                        //if the incomming pool subjects is for a complementary operation (مجموعة المواد المكملة لثماني مواد)
                        if (!G11Reached3(studentList[j].subjectCode, studentList[j].subjectName) || studentList[j].subjectCode < 1000) {
                            if (!IsInActiveAllTimeGroup(studentList[j].subjectCode, studentList[j].subjectName) && !SubjectTakenFromDifferentYear(studentList[j].subjectCode, studentList[j].subjectName)) {//Subject Groups
                                //Check if the subject is not in complementary active groups , and not taken from diffferent year , and it will not increase Grade 11 subjects to 3 (or more than 3)
                                CheckAgainestSubjectGroups(studentList[j].subjectCode); //subject is being taken and must be marked for any existance in any active group as used group
                                qualSubjects.push(new Array("C_" + studentList[j].subjectName, studentList[j].subjectMark, studentList[j].subjectCode)); //move taken subject into Qualification subjects
                                subjectsOfSuccess.push(new Array(studentList[j].subjectName, studentList[j].subjectMark));
                                studentList.splice(j, 1) //remove from student subjects
                                Count += 1; //increase found count by 1
                                j = -1; // skip the deleted index of the student subject array
                            }
                        } else {
                            if (Count < RequiredCount && j == studentList.length - 1) {//G11Reached 3 & No more subjects to go ,pull a switch
                                //alert("Failed Due to G11Reached 3")
                                var pulledAswitch = false;
                                for (var m = 0; m < studentList.length - 1; m++) { //find a taken from different year to replace
                                    //var sCode = qualSubjects[m].subjectCode;
                                    if (eval(studentList[m].subjectCode) < 1000 && SubjectTakenFromDifferentYear(studentList[m].subjectCode, studentList[m].subjectName)) {
                                        //alert(studentList[m].subjectName + " Can be Switched")
                                        for (var n = 0; n < qualSubjects.length - 1; n++) {
                                            if (eval(qualSubjects[n][2]) == eval(studentList[m].subjectCode) + 1000) {
                                                //alert(studentList[m].subjectName + " Can be Switched with " + qualSubjects[n][0])
                                                //Change Subjects of Success
                                                subjectsOfSuccess.push(new Array(studentList[m].subjectName + " بدلا من 11", studentList[m].subjectMark));
                                                qualSubjects[n][1] = studentList[m].subjectMark;
                                                qualSubjects[n][2] = studentList[m].subjectCode;
                                                pulledAswitch = true;
                                                j = -1;
                                                break;
                                            }
                                        }
                                    }
                                    if (pulledAswitch)
                                        break;
                                }
                            }
                        }         
                    }
                    else {//Basic Check
                        if (!G11Reached3(studentList[j].subjectCode, studentList[j].subjectName) || studentList[j].subjectCode < 1000) {
                            if (!IsInActiveBasicGroup(studentList[j].subjectCode, studentList[j].subjectName) && !SubjectTakenFromDifferentYear(studentList[j].subjectCode, studentList[j].subjectName)) {//Subject Groups
                                CheckAgainestSubjectGroups(studentList[j].subjectCode);
                                qualSubjects.push(new Array("B_" + studentList[j].subjectName, studentList[j].subjectMark, studentList[j].subjectCode));
                                subjectsOfSuccess.push(new Array(studentList[j].subjectName, studentList[j].subjectMark));
                                studentList.splice(j, 1)
                                Count += 1;
                                j = -1;
                            }
                        } else {
                            if (Count < RequiredCount && j == studentList.length - 1) {//G11Reached 3 & No more subjects to go ,pull a switch
                                //alert("Failed Due to G11Reached 3")
                                var pulledAswitch = false;
                                for (var m = 0; m < studentList.length - 1; m++) { //find a taken from different year to replace
                                    //var sCode = qualSubjects[m].subjectCode;
                                    if (eval(studentList[m].subjectCode)<1000 &&SubjectTakenFromDifferentYear(studentList[m].subjectCode, studentList[m].subjectName)) {
                                        //alert(studentList[m].subjectName + " Can be Switched")
                                        for (var n = 0; n < qualSubjects.length - 1; n++) {
                                            if (eval(qualSubjects[n][2]) == eval(studentList[m].subjectCode) + 1000) {
                                                //alert(studentList[m].subjectName + " Can be Switched with " + qualSubjects[n][0])
                                                //Change Subjects of Success
                                                subjectsOfSuccess.push(new Array(studentList[m].subjectName+" بدلا من 11", studentList[m].subjectMark));
                                                qualSubjects[n][1] = studentList[m].subjectMark;
                                                qualSubjects[n][2] = studentList[m].subjectCode;
                                                pulledAswitch = true;
                                                j = -1;
                                                break;
                                            }
                                        }
                                    }
                                    if (pulledAswitch)
                                        break;
                                }
                            }
                        }
                    }
                    if (Count == RequiredCount) {// if the required count of subjects was found in student subjects then OK
                        return true;
                    } else {
                        break;
                    }
                }
            }
        }
        //Detailed Failure Reasons
       subjectsOfFailure.push(new Array("لم يتم إستيفاء المادة \n",0));
       
       return false;
    }
    
    function FindMax3(Op1,Op2,Op3){
        var MaxOperand = Op1;
        if(MaxOperand<Op2){
            MaxOperand = Op2;
        }
        if(MaxOperand<Op3){
            MaxOperand = Op3;
        }
        return MaxOperand;
    }
    
    function ECAD(Condition) { // Evaluate Condition
        switch (parseInt(Condition)) {
            case 50://انجليزي  ع 11 او ع 12 أو أدب إنجليزي
                Conditions[50][1] = false;
                if(GSC('201,1201,202,1202','E',1)){
                    Conditions[50][1] = true;
                }
                break;
            case 51://مادة رياضيات أو فرع رياضيات او رياضيات متقدم أو فرع متقدم
                Conditions[51][1] = false;
                if (GSC('203,204,205,245,258,1203,1204,1205,1245,1258','E',1)) {
                    Conditions[51][1] = true;
                }   
                break;
            case 52:
                Conditions[52][1] = false;
                var PhTemp = GSC('208,247,1208,1247','E',1);//فيزياء أو فيزياء متقدم
                var ChTemp = GSC('207,248,1207,1248','E',1);//كيمياء أو كيمياء تطبيقية
                var BioTemp = GSC('209,1209','E',1);//أحياء  أو أحياء متقدم
                if (PhTemp && ChTemp && BioTemp) {
                     Conditions[52][1] = true;
                }
                break;
            case 53:
                Conditions[53][1] = false;
                if (GSC("+"+ADSubjects,'E',3)) {
                    Conditions[53][1] = true;
                }
                break;
            case 54://SAT I 1440 for Medical Collagses
                Conditions[54][1] = false;
                var tempSATI = parseFloat(GSM(251)) + parseFloat(GSM(252)) + parseFloat(GSM(253))
                //debug
                var SatITemp = GSC('251,252,253','',1) 
                if ( tempSATI>=1050 && SatITemp) {
                    Conditions[54][1] = true;
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 1 للطب اعلي من 1050 درجة \n",tempSATI));
                }else{
                   //Detailed Failure Reasons
                   subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 1 للطب اعلي من 1050 درجة \n",tempSATI));
                }
                qualSubjects.push(new Array("B_SAT-I:"+tempSATI,tempSATI,0));
                break;
            case 55://SAT II 1100 for Medicine
                Conditions[55][1] = false;
                var tempSATII1 = parseFloat(GSM(263)) + parseFloat(GSM(260))
                var tempSATII2 = parseFloat(GSM(263)) + parseFloat(GSM(261))
                var tempSATII3 = parseFloat(GSM(263)) + parseFloat(GSM(262))
                var tempSATIIMax = FindMax3(tempSATII1,tempSATII2,tempSATII3);
                if ( tempSATIIMax  >= 1100 && parseFloat(GSM(263))>0 ) {//احياء سات 2 والمجموع اعلي من 1100
                    Conditions[55][1] = true;
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 2 اعلي من 1100 درجة \n",tempSATIIMax));
                }else{
                   //Detailed Failure Reasons
                   subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 2 اعلي من 1100 درجة \n",tempSATIIMax));
                }
                qualSubjects.push(new Array("B_SAT-II:"+tempSATIIMax,tempSATIIMax,0));
                break;
            case 56:
                Conditions[56][1] = false;

                var PhTemp = GSC('208,247,1208,1247','E',1);//فيزياء أو فيزياء متقدم
                var ChTemp = GSC('207,248,1207,1248','E',1);//كيمياء أو كيمياء تطبيقية
                var MathTemp = GSC('203,245,1203,1245','E',1)//رياضيات أو رياضيات متقدمة
                if (MathTemp && ChTemp && PhTemp) {
                    Conditions[56][1] = true;
                }
                break;
            case 57:
                Conditions[57][1] = false;
                if (GSC("+"+ADSubjects, 'E', 4)) {
                    Conditions[57][1] = true;
                }
                break;
            case 58://SAT I 1440 For Engineering
                Conditions[58][1] = false;
                var tempSATI =parseFloat(GSM(251)) + parseFloat(GSM(252)) + parseFloat(GSM(253))
                var SatITemp = GSC('251,252,253', '', 1)
                if (tempSATI >= 1050 && SatITemp) {
                    Conditions[58][1] = true;
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 1 اعلي من 1050 درجة \n",tempSATI))
                }else{
                   //Detailed Failure Reasons
                   subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 1 اعلي من 1050 درجة \n",tempSATI));
                }
                qualSubjects.push(new Array("B_SAT-I:"+tempSATI,tempSATI,0));
                break;
            case 59: //SAT II 1100 for Engineering
                Conditions[59][1] = false;
                var tempSATII1 = parseFloat(GSM(260)) + parseFloat(GSM(261))
                var tempSATII2 = parseFloat(GSM(260)) + parseFloat(GSM(262))
                var tempSATII3 = parseFloat(GSM(260)) + parseFloat(GSM(263))
                var tempSATIIMax = FindMax3(tempSATII1,tempSATII2,tempSATII3);
                if (  tempSATIIMax >= 1100  &&  parseFloat(GSM(260))>0) {//سات 2 رياضه والمجموع اعلي من 1100
                    Conditions[59][1] = true;
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 2 للهندسة اعلي من 1100 درجة \n",tempSATIIMax));
                }else{
                   //Detailed Failure Reasons
                   subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 2 للهندسة اعلي من 1100 درجة \n",tempSATIIMax));
                }
                qualSubjects.push(new Array("B_SAT-II:"+tempSATIIMax,tempSATIIMax,0));
                break;
            case 60://لغة فرنسية أو ألمانية
                Conditions[60][1] = false;
                if (GSC('222,223,1222,1223','E',1)) {
                    Conditions[60][1] = true;
                }
                break;
            case 61:
                Conditions[61][1] = false;
                var G12Temp = '203,204,205,207,208,208,209,210,211,214,215,216,217,218,219,221,239,240,241,245,246,247,248,258';
                var G11Temp = ',1203,1204,1205,1207,1208,1208,1209,1210,1211,1214,1215,1216,1217,1218,1219,1221,1239,1240,1241,1245,1246,1247,1248,1258';
                if (GSC(G12Temp+G11Temp,'E',4)){
                    Conditions[61][1] = true;
                }
                break;
            case 62:
                Conditions[62][1] = false;
                if (GSC("+"+ADSubjects, 'E', 2)) {
                    Conditions[62][1] = true;
                }
                break;
            case 63:
                var G12Temp = '203,204,205,207,208,209,210,211,212,213,214,215,216,217,221,222,237,238,239,240,241,242,243,245,246,247,248,249,258';
                var G11Temp = ',1203,1204,1205,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1221,1222,1237,1238,1239,1240,1241,1242,1243,1245,1246,1247,1248,1249,1258';
                Conditions[63][1] = false;
                if (GSC(G12Temp+G11Temp, 'E', 5)) {
                    Conditions[63][1] = true;
                }
                break;
            case 64:
                var G12Temp = '203,204,205,207,208,209,210,211,212,213,214,215,216,217,220,221,222,223,237,241,245,246,247,248,249,250,258,259';
                var G11Temp = ',1203,1204,1205,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1220,1221,1222,1223,1237,1241,1245,1246,1247,1248,1249,1250,1258,1259';
                Conditions[64][1] = false;
                if (GSC(G12Temp+G11Temp,'E',5)) {
                    Conditions[64][1] = true;
                }
                break;
            case 65:
                var G12Temp ='201,202,203,204,205,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,234,236,240,241,245,246,247,248,249,250,258,259';
                var G11Temp =',1201,1202,1203,1204,1205,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1234,1236,1240,1241,1245,1246,1247,1248,1249,1250,1258,1259';
                Conditions[65][1] = false;
                if (GSC(G12Temp+G11Temp,'E',5)) {
                    Conditions[65][1] = true;
                }
                break;
            case 66:
                var G12Temp = '203,204,205,207,208,209,210,211,212,213,215,216,217,218,219,221,222,239,240,241,245,246,247,248,249,258';
                var G11Temp = ',1203,1204,1205,1207,1208,1209,1210,1211,1212,1213,1215,1216,1217,1218,1219,1221,1222,1239,1240,1241,1245,1246,1247,1248,1249,1258';
                Conditions[66][1] = false;
                if (GSC(G12Temp+G11Temp,'E',5)) {
                    Conditions[66][1] = true;
                }
                break;
            case 67:
                var G12Temp ='203,204,205,207,208,209,210,215,216,217,218,219,222,223,236,239,240,241,242,243,244,245,246,247,248,249,258';
                var G11Temp = ',1203,1204,1205,1207,1208,1209,1210,1215,1216,1217,1218,1219,1222,1223,1236,1239,1240,1241,1242,1243,1244,1245,1246,1247,1248,1249,1258';
                Conditions[67][1] = false;
                if (GSC(G12Temp+G11Temp,'E',5)){
                    Conditions[67][1] = true;
                }
                break;
            case 68:
                Conditions[68][1] = false;
                if (false) {
                    Conditions[68][1] = true;
                }
                break;
            case 69:
                var G12Temp = '201,202,203,204,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,234,235,236,237,238,239,240,241,242,243,244,248,259,237';
                var G11Temp = ',1201,1202,1203,1204,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1234,1235,1236,1237,1238,1239,1240,1241,1242,1243,1244,1248,1259,1237'
                Conditions[69][1] = false;
                if (GSC(G12Temp + G11Temp, 'E', 6)) {
                    Conditions[69][1] = true;
                }
                break;
            case 70:
                var G12Temp = '201,202,203,204,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,234,235,236,237,238,239,240,241,242,243,244,256,248,256,257,259,237';
                var G11Temp = ',1201,1202,1203,1204,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1234,1235,1236,1237,1238,1239,1240,1241,1242,1243,,1244,1248,1256,1257,1259,1237'
                Conditions[70][1] = false;
                if (GSC(G12Temp+G11Temp,'E',7)) {
                    Conditions[70][1] = true;
                }
                break;
            case 71:
                Conditions[71][1] = false;
                if (GSC('208,1208','E',1)) { //فيزياء 
                    Conditions[71][1] = true;
                    break;
                }
                if (GSC('203,204,205,245,258,1203,1204,1205,1245,1258','E',1)){//احدي مواد الرياضيات
                    Conditions[71][1] = true;
                }
                break;
            case 72://كيمياء و أحياء
                var ChTemp = GSC('207,248,1207,1248','E',1);//كيمياء أو كيمياء متقدم
                var BioTemp = GSC('209,246,1209,1246','E',1);//أحياء أو أحياء متقدم
                Conditions[72][1] = false;
                if (ChTemp && BioTemp) {
                    Conditions[72][1] = true;
                }
                break;
            case 73:
                Conditions[73][1] = false;
                if (GSC('203,204,205,212,220,245,244,250,258,259,1203,1204,1205,1212,1220,1245,1244,1250,1258,1259','E',2)) {
                    Conditions[73][1] = true;
                }
                break;
            case 74:
                Conditions[74][1] = false;
                var tempSATI =parseFloat(GSM(251)) + parseFloat(GSM(252)) + parseFloat(GSM(253))
                var SatITemp = GSC('251,252,253', '', 1)
                if (tempSATI >= 1050 && SatITemp) {
                    Conditions[74][1] = true;
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 1 اعلي من 1050 درجة \n",tempSATI));
                }else{
                   //Detailed Failure Reasons
                   subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 1 اعلي من 1050 درجة \n",tempSATI));
                }
                qualSubjects.push(new Array("B_SAT-I:"+tempSATI,tempSATI,0));
                
                //*********SAT II Bonus
                if(parseFloat(GSM(263))>0){//must be biology + another subject
                    var tempSATII1 = parseFloat(GSM(263)) + parseFloat(GSM(260));
                    var tempSATII2 = parseFloat(GSM(263)) + parseFloat(GSM(261));
                    var tempSATII3 = parseFloat(GSM(263)) + parseFloat(GSM(262));
                }
                var SATIIBiology = FindMax3(tempSATII1,tempSATII2,tempSATII3);
                if(parseFloat(GSM(260))>0){//or math + another subject
                    var tempSATII3 = parseFloat(GSM(260)) + parseFloat(GSM(261));
                    var tempSATII4 = parseFloat(GSM(260)) + parseFloat(GSM(262));
                    var tempSATII5 = parseFloat(GSM(260)) + parseFloat(GSM(263));
                }
                var SATIIMath = FindMax3(tempSATII3,tempSATII4,tempSATII5);
                //Must exceed 1100 to start counting
                var MaxOfSATII  = FindMax3(0,SATIIBiology,SATIIMath);
                if (MaxOfSATII>=1100){
                    qualSubjects.push(new Array("C_SAT-II:"+MaxOfSATII,MaxOfSATII,0));
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 2 الاضافية اعلي من 1100 درجة \n",MaxOfSATII));
                }else{
                   //Detailed Failure Reasons
                   subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 2 الاضافية اعلي من 1100 درجة \n",MaxOfSATII));
                }
                break;
            case 75:
                Conditions[75][1] = false;
                var tempSATI = parseFloat(GSM(251)) + parseFloat(GSM(252)) + parseFloat(GSM(253))
                var SatITemp = GSC('251,252,253', '', 1)
                if (tempSATI >= 890 && SatITemp) {//الحصول على 890 فى سات 1 فى المعاهد 
                    Conditions[75][1] = true;
                    //qualSubjects.push(new Array("C_SAT-II:"+MaxOfSATII,MaxOfSATII,0));
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 1 الاضافية اعلي من 890 درجة \n", tempSATI));
                } else {
                    //Detailed Failure Reasons
                    subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 1 الاضافية اعلي من 890 درجة \n", tempSATI));
                }
                qualSubjects.push(new Array("B_SAT-I:" + tempSATI, tempSATI, 0));
                //*********SAT II Bonus
                if (parseFloat(GSM(263)) > 0) {//must be biology + another subject
                    var tempSATII1 = parseFloat(GSM(263)) + parseFloat(GSM(260));
                    var tempSATII2 = parseFloat(GSM(263)) + parseFloat(GSM(261));
                    var tempSATII3 = parseFloat(GSM(263)) + parseFloat(GSM(262));
                }
                var SATIIBiology = FindMax3(tempSATII1, tempSATII2, tempSATII3);
                if (parseFloat(GSM(260)) > 0) {//or math + another subject
                    var tempSATII3 = parseFloat(GSM(260)) + parseFloat(GSM(261));
                    var tempSATII4 = parseFloat(GSM(260)) + parseFloat(GSM(262));
                    var tempSATII5 = parseFloat(GSM(260)) + parseFloat(GSM(263));
                }
                var SATIIMath = FindMax3(tempSATII3, tempSATII4, tempSATII5);
                //Must exceed 900 to start counting
                var MaxOfSATII = FindMax3(0, SATIIBiology, SATIIMath);
                if (MaxOfSATII >= 900) {
                    qualSubjects.push(new Array("C_SAT-II:" + MaxOfSATII, MaxOfSATII, 0));
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 2 الاضافية اعلي من 900 درجة \n", MaxOfSATII));
                }
                break;
            case 80:
                Conditions[80][1] = false;
                var tempSATI = parseFloat(GSM(251)) + parseFloat(GSM(252)) + parseFloat(GSM(253))
                var SatITemp = GSC('251,252,253', '', 1)
                if (tempSATI >= 890 && SatITemp) 
                {//الحصول على 890 فى سات 1 فى المعاهد 
                    //qualSubjects.push(new Array("C_SAT-II:"+MaxOfSATII,MaxOfSATII,0));
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 1 الاضافية اعلي من 890 درجة \n", tempSATI));
                    qualSubjects.push(new Array("B_SAT-I:" + tempSATI, tempSATI, 0));
                //*********SAT II 
         
                    var SATIIBiology = FindMax3(tempSATII1, tempSATII2, tempSATII3);
                    if (parseFloat(GSM(260)) > 0) {//or math + another subject
                        var tempSATII3 = parseFloat(GSM(260)) + parseFloat(GSM(261));
                        var tempSATII4 = parseFloat(GSM(260)) + parseFloat(GSM(262));
                        var tempSATII5 = parseFloat(GSM(260)) + parseFloat(GSM(263));
                    }
                    var SATIIMath = FindMax3(tempSATII3, tempSATII4, tempSATII5);
                    //Must exceed 900 

                    if (SATIIMath >= 900) {
                        qualSubjects.push(new Array("C_SAT-II:" + SATIIMath, SATIIMath, 0));
                        subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 2 الاضافية اعلي من 900 درجة \n", SATIIMath));
                        Conditions[80][1] = true;
                    } else {
                        subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 2 الاضافية اعلي من 900 درجة \n", tempSATI));
                    }
                } else 
                {
                    //Detailed Failure Reasons
                    subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 1 الاضافية اعلي من 890 درجة \n", tempSATI));
                }
                break;
            case 76:
                Conditions[76][1] = false;
                if(parseFloat(GSM(260))>0){//or math + another subject
                    var tempSATII3 = parseFloat(GSM(260)) + parseFloat(GSM(261));
                    var tempSATII4 = parseFloat(GSM(260)) + parseFloat(GSM(262));
                    var tempSATII5 = parseFloat(GSM(260)) + parseFloat(GSM(263));
                }
                var SATIIMath = FindMax3(tempSATII3,tempSATII4,tempSATII5);
                
        
                if(SATIIMath>=900){
                    Conditions[76][1] = true;
                    qualSubjects.push(new Array("C_SAT-II:"+SATIIMath,SATIIMath,0));
                    subjectsOfSuccess.push(new Array("تخطى مجموع مواد سات 2 الاضافية اعلي من 900 درجة \n",SATIIMath));
                }else{
                   //Detailed Failure Reasons
                   subjectsOfFailure.push(new Array("لم يتخط مجموع مواد سات 2 الاضافية اعلي من 900 درجة \n",SATIIMath));
                }
                break;
            case 77://فيزياء وكيمياء واحياء ورياضيات
                Conditions[77][1] = false;
                /*var G12Temp = ',207,208,209';
                var G11Temp = ',1207,1208,1209';
                var G1112MathTemp = '';*/
                if (GSC('203,1203,245,1245,246,247,248,1246,1247,1248,207,208,209,1207,1208,1209','E',4)){
                    Conditions[77][1] = true;
                }
                break;
            case 78://مادة أدبية
                Conditions[78][1] = false;
                var G12Temp = ',201,202,210,211,213,215,217,218,220,219,221,222,223,223,234,235,238,239,240,241,250';
                var G11Temp = ',1201,1202,1210,1211,1213,1215,1217,1218,1220,1219,1221,1222,1223,1223,1234,1235,1238,1239,1240,1241,1250';
                if (GSC(G12Temp+G11Temp,'E',1)){
                    Conditions[78][1] = true;
                }
                break;
            case 79://مادتين مكملتين
                Conditions[79][1] = false;
                if (GSC("+"+ADSubjects, 'E', 2)) {
                    Conditions[79][1] = true;
                }
                break;
            default:
            return false;
            break;
        }
    }

//****************************************END********************************************//    
}