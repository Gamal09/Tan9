//IGQualification Class
function QualifyIGStudent(certificate, sSubjectList, specialization, qualifictaionNumber){
    //read Qualification row
    this.sQualification = "";
    var qName = "";

    this.qConditions = new Array();
    var qualConditions = new Array();

    this.qMark = 0;

    var tempArray = new Array();
        
    var studentList = sSubjectList.split(','); //all  Subjects
    for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        if (subject.subjectCode < 100){
            tempArray.push(subject); // take only OL subjects
        }
        
        
        //studentList[j] = studentList[j].toString().split('|');
    }
    
    studentList = tempArray;
    
    //studentList.splice(0, 1); //remove first element for being a comma
    //studentList.splice(studentList.length - 1, 1); //remove Last element for being a comma
    //read the qualification corresponding condition
    var conditionList = new Array();
    
    this.currentQualificationSubjects = new Array();
    var qualSubjects = new Array();
    
    //set the flag to true if the basic condition failed or complementary condition failed
    //in more than one subject
    var QualificationFailed = false;
    
    //the condition number that failed, if = 0, then there is no failure,
    // else it is set to the failed condition numnber
    var FailedCondition = 0;
    
    this.AConditionFailed = false;
    
    var subjectsOfFailure = new Array();
    var subjectsOfSuccess = new Array();
    
    LoadQualificationInfo();    
    
    //load the student Qualification info
    //the first function to be loaded
    function LoadQualificationInfo(){
        qName = Qualifications[specialization][0];
        qualConditions = Qualifications[specialization][1].split(',');
        LoadConditionList(qualConditions);
    }
    
    //load the different conditions for the current student
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

    this.EvaluateCondition = function() {
        var QualifyResult = true;
        for (var i = 0; i < conditionList.length; i++) {
            //let the array is empty to fill it with the failure subjects of the new condition
            subjectsOfFailure = new Array();
            subjectsOfSuccess = new Array();
            //evaluate Condition for American Deploma
            ECIG(conditionList[i][0]);
            //QualifyResult = QualifyResult && Conditions[conditionList[i][0]][1];

            QualifyResult = QualifyResult && !QualificationFailed  //(replace above line)

            //we need also the subjects of success not only on the condition level
            //check if the evaluated condition is true
            if (Conditions[conditionList[i][0]][1] == true) {
                //condition succeed
                analysisList.push(new Array(qualifictaionNumber, qName, conditionList[i][1], " تحقق الشرط", subjectsOfSuccess, new Array()));
            }
            else {
                //condition failed
                analysisList.push(new Array(qualifictaionNumber, qName, conditionList[i][1], "لم يتحقق الشرط", subjectsOfSuccess, subjectsOfFailure));
            }
        }
        this.currentQualificationSubjects = qualSubjects;
        this.AConditionFailed = FailedCondition;
        this.sQualification = qName;
        this.qConditions = qualConditions;
        return QualifyResult;
    }
   
    /******Subject Taken For Qualification From Different Year ********/
    function SubjectTakenFromDifferentYear(SubjectCode){
        var TakenSubjectCode;
        var TakenSubjectCode1;
        if (SubjectCode < 100){ //Check A & AS Levels againest O.Level
            TakenSubjectCode = parseInt(SubjectCode)+50;
            TakenSubjectCode1 = parseInt(SubjectCode)+100;
        }
        if (SubjectCode > 100 && SubjectCode < 150 ){ //Check O & AS Levels againest A.Level
            TakenSubjectCode = parseInt(SubjectCode)-50;
            TakenSubjectCode1 = parseInt(SubjectCode)+50;
        }
        if (SubjectCode > 150){ //Check O & A Levels againest AS.Level
            TakenSubjectCode = parseInt(SubjectCode)-50;
            TakenSubjectCode1 = parseInt(SubjectCode)-100;
        }
        if (SubjectTaken(TakenSubjectCode) |SubjectTaken(TakenSubjectCode1) ){ // if any of the comparable subjects is taken return true
            return true;
        }else{
            return false;
        }
        return false;
    }
    /*********Subject Taken*****/
    function SubjectTaken(SubjectCode){
        for(var i=0;i<qualSubjects.length;i++){
            if(qualSubjects[i].subjectCode ==SubjectCode){
                return true;
            }
        }
        return false;
    }

    /*******Select Subject For Qualification**********/

    function GSC(ElectiveList,MinGrade,RequiredCount) {
        var Count = 0;
        var returnedSubjects = new Array();
        var Subjects = ElectiveList.toString().split(',')
        for (var j = 0; j < studentList.length; j++) {
            for (var i = 0; i < Subjects.length; i++) {
                if (studentList[j].subjectCode == Subjects[i] ){//&& (studentList[j].subjectGrade).substr(0, 1) <= MinGrade) {
                    if (ElectiveList.indexOf("+") >= 0) {//Complementary Check
                        //need to be reviewed
                        if (!SubjectTakenFromDifferentYear(studentList[j].subjectCode)){
                            //CheckAgainestSubjectGroups(studentList[j][0]);
                            //QualificationSubjects.push(new Array("C_"+StudentSubjects[j][2],StudentSubjects[j][3],StudentSubjects[j][0]));
                            studentList[j].subjectName = "C_" + studentList[j].subjectName;
                            //returnedSubjects.push(new Array("C_"+studentList[j].subjectName,studentList[j].subjectMark,studentList[j].subjectCode));
                            returnedSubjects.push(studentList[j]);
                            
                            subjectsOfSuccess.push(new Array(studentList[j].subjectName, studentList[j].subjectMark));
                            studentList.splice(j, 1)
                            Count += 1;
                            j = -1;
                        }            
                    }
                    else{//Basic Check
                        if (!SubjectTakenFromDifferentYear(studentList[j].subjectCode)){
                            //CheckAgainestSubjectGroups(studentList[j][0]);
                            //QualificationSubjects.push(new Array("B_"+StudentSubjects[j][2],StudentSubjects[j][3],StudentSubjects[j][0]));
                            studentList[j].subjectName = "B_" + studentList[j].subjectName;
                            //returnedSubjects.push(new Array("B_"+studentList[j].subjectName,studentList[j].subjectMark,studentList[j].subjectCode));
                            returnedSubjects.push(studentList[j]);
                            
                            subjectsOfSuccess.push(new Array(studentList[j].subjectName, studentList[j].subjectMark));
                            studentList.splice(j, 1)
                            Count += 1;
                            j = -1;
                        }
                    }
                    if (Count == RequiredCount) {
                        return returnedSubjects;
                    } else {
                        break;
                    }
                }
            }
        }
        if(returnedSubjects.length < RequiredCount){
            subjectsOfFailure.push(new Array("لم يتم دراسه الماده\n",0));
        }
        return returnedSubjects;
    }
    
    /*********Import Qualification Subject ********/
    function ImportQualificationSubjects(SubjectsArray, conditionNumber){
        var str1,str2,str3
        for (var i=0;i<SubjectsArray.length;i++){
//            str1=SubjectsArray[i][0];
//            str2=SubjectsArray[i][1];
            //            str3=SubjectsArray[i][2];
            SubjectsArray[i].conditionNumber = conditionNumber;
            qualSubjects.push(SubjectsArray[i]);
            //qualSubjects.push(new Array(str1,str2,str3, conditionNumber, ""));
        }
    }
    
    //****CHECK****//
    function  CheckFailureofCondition(ConditionNumber,ConditionFoundSubjects,RequiredLength){
        //if(ConditionNumber < 100){
            if (FailedCondition != 0){
                QualificationFailed = true;
            }
            else{
                if (ConditionFoundSubjects.length - RequiredLength == -1) {//means one subject is missing
                    QualificationFailed = true; //**2010**Fail Qualification for missing subject**2010**//
                    FailedCondition = ConditionNumber;
                }
                else{
                    QualificationFailed = true; //means more than one subject is missing
                    FailedCondition = 0;
                }
            }
//        }else{
//            QualificationFailed = true;
//        }
    }
    
    function ECIG(Condition) { // Evaluate Condition
        switch (parseInt(Condition)) {
            case 0: 
                Conditions[0][1] = false;
                break;
            case 1:
                Conditions[1][1] = false;
                break;
            case 2:
                Conditions[2][1] = false;
                break;
            case 3: //مستوي عادي : إنجليزي أو أدب إنجليزي
                Conditions[3][1] = false;
                var QSubjects = GSC('51,52', 'E', 1); //buffer found subjects 
                ImportQualificationSubjects(QSubjects, 300);//insert subject into qualification subjecst
                //QualificationFailed = true;
                if (QSubjects.length==1) {
                    //QualificationFailed = false;
                    Conditions[3][1] = true;
                    //ImportQualificationSubjects(QSubjects, 3);//insert subject into qualification subjecst
                }else{
                    CheckFailureofCondition(300, QSubjects, 1);
                }
                break;
            case 4://مستوي عادي : رياضيات  
                Conditions[4][1] = false;
                //QualificationFailed = true;
                var QSubjects = GSC('53','E',1);
                ImportQualificationSubjects(QSubjects, 400);
                if (QSubjects.length==1) {
                    //QualificationFailed = false;
                    Conditions[4][1] = true;
                    //ImportQualificationSubjects(QSubjects, 4);
                }else{
                    CheckFailureofCondition(400, QSubjects, 1);
                }
                break;
            case 5://مستوي عادي : فيزياءو كيمياء واحياء
                Conditions[5][1] = false;
                var QSubjects = GSC('55,56,57','E',3);
                ImportQualificationSubjects(QSubjects, 500);
                //QualificationFailed = true;
                if (QSubjects.length==3) {
                    //QualificationFailed = false;
                    Conditions[5][1] = true;
                    //ImportQualificationSubjects(QSubjects, 5);
                }else{
                    CheckFailureofCondition(500, QSubjects, 3)
                }
                break;
            case 6://ثلاثة مواد مكملة للعلوم بتقدير سي علي الاقل
                Conditions[6][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'C', 3);
                ImportQualificationSubjects(QSubjects, 6);
                if (QSubjects.length==3) {
                    Conditions[6][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition (6, QSubjects, 3);
                }
                break;
            case 8://مستوي عادي رياضه وفيزياء وكيمياء
                Conditions[8][1] = false;
                //QualificationFailed= true;
                var QSubjects =GSC('53,55,56','E',3);
                ImportQualificationSubjects(QSubjects, 800);
                if (QSubjects.length==3){
                 Conditions[8][1] = true;
                 //QualificationFailed = false;
                 //ImportQualificationSubjects(QSubjects, 8);
                }else{
                    CheckFailureofCondition(800, QSubjects, 3);
                }
                break;
            case 9://أربعة مواد مكملة للهندسة بتقدير سي علي الاقل
                Conditions[9][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'C', 4);
                ImportQualificationSubjects(QSubjects, 9);
                if (QSubjects.length==4) {
                    Conditions[9][1] = true;
//                    ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(9, QSubjects, 4);
                }
                break;
            case 11://مستوي عادي لغة فرنسية أو ألمانية
                Conditions[11][1] = false;
                //QualificationFailed = true;
                var QSubjects =GSC('69,70', 'E',1);
                ImportQualificationSubjects(QSubjects, 1100);
                if (QSubjects.length==1) {
                    //QualificationFailed = false;
                    Conditions[11][1] = true;
                    //ImportQualificationSubjects(QSubjects, 11);
                }else{
                    CheckFailureofCondition(1100, QSubjects, 1);
                }
                break;
            case 12://ستة مواد من بين المواد المؤهلة للألسن والآداب
                Conditions[12][1] = false;
                var QSubjects = GSC(IGSubjects, 'E', 6);
                //QualificationFailed = true;
                ImportQualificationSubjects(QSubjects, 1200);
                if (QSubjects.length==6) {
                    //QualificationFailed = false;
                    Conditions[12][1] = true;
                    //ImportQualificationSubjects(QSubjects, 12);
                }else{
                    CheckFailureofCondition(1200, QSubjects, 6);
                }
                break;
            case 13://مادتين من المواد المكملة أو المواد مؤهلة التي لم تحتسب
                Conditions[13][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 13);
                if (QSubjects.length==2) {
                    Conditions[13][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(13, QSubjects, 2);
                }
                break;
            case 14://سبعة مواد مؤهلة من بين المواد المؤهلة للسياسة والإقتصاد
                Conditions[14][1] = false;
                var QSubjects = GSC(IGSubjects, 'E', 7);
                //QualificationFailed = true;
                ImportQualificationSubjects(QSubjects, 1400);
                if (QSubjects.length==7) {
                    //QualificationFailed = false;
                    Conditions[14][1] = true;
                    //ImportQualificationSubjects(QSubjects, 14);
                }else{
                    CheckFailureofCondition(1400, QSubjects, 7);
                }
                break;
            case 15://مادتين من المواد المكملة أو المواد مؤهلة التي لم تحتسب
                Conditions[15][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 15);
                if (QSubjects.length==2) {
                    Conditions[15][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(15, QSubjects, 2);
                }
                break;
            case 16://سبعة مواد من بين المواد المؤهلة للتجارة
                Conditions[16][1] = false;
                var QSubjects = GSC(IGSubjects, 'E', 7);
                ImportQualificationSubjects(QSubjects, 1600);
                //QualificationFailed = true;
                if (QSubjects.length==7) {
                    //QualificationFailed = false;
                    Conditions[16][1] = true;
                    //ImportQualificationSubjects(QSubjects, 16);
                }else{
                    CheckFailureofCondition(1600, QSubjects, 7);
                }
                break;
            case 17://مادتين من المواد المكملة أو المواد مؤهلة التي لم تحتسب
                Conditions[17][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 17);
                if (QSubjects.length==2) {
                    Conditions[17][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(17, QSubjects, 2);
                }
                break;
            case 18://سبعة مواد من بين المواد مؤهلة للإعلام
                Conditions[18][1] = false;
                var QSubjects = GSC(IGSubjects, 'E', 7);
                ImportQualificationSubjects(QSubjects, 1800);
                //QualificationFailed = true;
                if (QSubjects.length==7) {
                    //QualificationFailed = false;
                    Conditions[18][1] = true;
                    //ImportQualificationSubjects(QSubjects, 18);
                }else{
                    CheckFailureofCondition(1800, QSubjects, 7);
                }
                break;
            case 19://سبعة مواد من بين المواد المؤهلة للحقوق
                Conditions[19][1] = false;
                var QSubjects = GSC(IGSubjects, 'E', 7);
                ImportQualificationSubjects(QSubjects, 1900);
                //QualificationFailed = true;
                if (QSubjects.length==7) {
                    //QualificationFailed = false;
                    Conditions[19][1] = true;
                    //ImportQualificationSubjects(QSubjects, 19);
                }else{
                    CheckFailureofCondition(1900, QSubjects, 7);
                }
                break;
            case 20://مادتين من المواد المكملة أو المواد مؤهلة التي لم تحتسب
                Conditions[20][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 20);
                if (QSubjects.length==2) {
                    Conditions[20][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(20, QSubjects, 2);
                }
                break;
            case 21://سبعة مواد من بين المواد المؤهلة للآثار
                Conditions[21][1] = false;
                var QSubjects = GSC(IGSubjects, 'E', 7);
                ImportQualificationSubjects(QSubjects, 2100);
                //QualificationFailed = true;
                if (QSubjects.length==7) {
                    //QualificationFailed = false;
                    Conditions[21][1] = true;
                    //ImportQualificationSubjects(QSubjects, 21);
                }else{
                    CheckFailureofCondition(2100, QSubjects, 7);
                }
                break;
            case 22://مادتين من المواد المكملة أو المواد مؤهلة التي لم تحتسب
                Conditions[22][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 22);
                if (QSubjects.length==2) {
                    Conditions[22][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(22, QSubjects, 2);
                }
                break;
            case 23://سبعة مواد من بين المواد المؤهلة للسياحة والفنادق
                Conditions[23][1] = false;
                var QSubjects = GSC(IGSubjects, 'E', 7);
                ImportQualificationSubjects(QSubjects, 2300);
                //QualificationFailed = true;
                if (QSubjects.length==7) {
                    //QualificationFailed = false;
                    Conditions[23][1] = true;
                    //ImportQualificationSubjects(QSubjects, 23);
                }else{
                    CheckFailureofCondition(2300, QSubjects, 7);
                }
                break;
            case 24://مادتين من المواد المكملة أو المواد مؤهلة التي لم تحتسب
                Conditions[24][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 24);
                if (QSubjects.length==2) {
                    Conditions[24][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(24, QSubjects, 2);
                }
                break;
            case 25://سبعة مواد من المواد المؤهلة للفنون والموسيقي
                Conditions[25][1] = false;
                var QSubjects = GSC(IGSubjects, 'E', 7);
                ImportQualificationSubjects(QSubjects, 2500);
                //QualificationFailed = true;
                if (QSubjects.length==7) {
                    //QualificationFailed = false;
                    Conditions[25][1] = true;
                    //ImportQualificationSubjects(QSubjects, 25);
                }else{
                    CheckFailureofCondition(2500, QSubjects, 7);
                }
                break;
            case 26://مادتين من المواد المكملة أو المواد المؤهلة التي لم تحتسب
                Conditions[26][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 26);
                if (QSubjects.length==2) {
                    Conditions[26][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(26, QSubjects, 2);
                }
                break;
            case 27://مستوي عادي فيزياء أو رياضيات
                Conditions[27][1] = false;
                var QSubjects =GSC('55,53', 'E', 1)
                ImportQualificationSubjects(QSubjects, 2700);
                //QualificationFailed = true;
                if (QSubjects.length==1) {
                    //QualificationFailed = false;
                    Conditions[27][1] = true;
                    //ImportQualificationSubjects(QSubjects, 27);
                }else{
                    CheckFailureofCondition(2700, QSubjects, 1);
                }
                break;
            case 28://مادتين من المواد المؤهلة للعلوم والزراعة
                Conditions[28][1] = false;
                var QSubjects =GSC('55,53,58,60,65','E',2);
                ImportQualificationSubjects(QSubjects, 2800);
                //QualificationFailed = true;
                if (QSubjects.length==2) {
                    //QualificationFailed = false;
                    Conditions[28][1] = true;
                    //ImportQualificationSubjects(QSubjects, 28);
                }else{
                    CheckFailureofCondition(2800, QSubjects, 2);
                }
                break;
            case 29://باقي المواد المكملة
                Conditions[29][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 29);
                if (QSubjects.length==2) {
                    Conditions[29][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(29, QSubjects, 2);
                }
                break;
            case 30://مادتين مكملتين للإعلام
                Conditions[30][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 2);
                ImportQualificationSubjects(QSubjects, 30);
                if (QSubjects.length==2) {
                    Conditions[30][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(30, QSubjects, 2);
                }
                break;
            case 31://اللغة الإنجليزية أو الأدب الإنجليزي
                Conditions[31][1] = false;
                var QSubjects =GSC('51,52', 'E', 1);
                ImportQualificationSubjects(QSubjects, 3100);
                //QualificationFailed = true;
                if (QSubjects.length==1) {
                    //QualificationFailed = false;
                    Conditions[31][1] = true;
                    //ImportQualificationSubjects(QSubjects, 31);
                }else{
                    CheckFailureofCondition(3100, QSubjects, 1);
                }
                break;
            case 32://مادة إضافية مكملة نتيجة للدبل أوورد
                Conditions[32][1] = false;
                var QSubjects =GSC("+"+IGSubjects,'E', 1);
                ImportQualificationSubjects(QSubjects, 32);
                if (QSubjects.length==1) {
                    Conditions[32][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(32, QSubjects, 1);
                }
                break;
            case 34://كيمياء وأحياء
                Conditions[34][1] = false;
                var QSubjects =GSC('56,57','E', 2);
                ImportQualificationSubjects(QSubjects, 3400);
                //QualificationFailed = true;
                if (QSubjects.length==2) {
                    //QualificationFailed = false;
                    Conditions[34][1] = true;
                    //ImportQualificationSubjects(QSubjects, 34);
                }else{
                    CheckFailureofCondition(3400, QSubjects, 2);
                }
                break;
            case 35://كيمياء  وفيزياء ورياضيات
                Conditions[35][1] = false;
                var QSubjects =GSC('53,55,56','E', 3);
                ImportQualificationSubjects(QSubjects, 3500);
                //QualificationFailed = true;
                if (QSubjects.length==3) {
                    //QualificationFailed = false;
                    Conditions[35][1] = true;
                    //ImportQualificationSubjects(QSubjects, 34);
                }else{
                    CheckFailureofCondition(3500, QSubjects, 4);
                }
                break;
            case 36://مادة أدبية
                Conditions[36][1] = false;
                var QSubjects =GSC('51,52,54,59,60,61,62,63,64,66,67,68,69,70,71,73','E', 1);
                ImportQualificationSubjects(QSubjects, 3600);
                //QualificationFailed = true;
                if (QSubjects.length==1) {
                    //QualificationFailed = false;
                    Conditions[36][1] = true;
                    //ImportQualificationSubjects(QSubjects, 34);
                }else{
                    CheckFailureofCondition(3600, QSubjects, 1);
                }
                break;
            case 37://أربع مواد من المواد المكملة أو المواد مؤهلة التي لم تحتسب
                Conditions[37][1] = false;
                var QSubjects =GSC("+"+IGSubjects, 'E', 4);
                ImportQualificationSubjects(QSubjects, 37);
                if (QSubjects.length==4) {
                    Conditions[37][1] = true;
                    //ImportQualificationSubjects(QSubjects);
                }else{
                    CheckFailureofCondition(37, QSubjects, 2);
                }
                break;                               
            default:
                Conditions[33][1] = false;
                break;
        }
    }
    
    
}
