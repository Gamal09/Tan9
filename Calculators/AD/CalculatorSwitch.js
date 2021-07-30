/*********StudentData*****************/
var StudentSubjects = new Array() // Holding All Student Subjects Array
var StudentASLSubjects = new Array() //Holding Advanced Subjects Only
var QualificationSubjects = new Array() // Holding a qualification selected subjects
//var SubjectGroups = new Array(7); //Holding qualification ORed subject options


/***********WEB CONTROLS************************/
function FindControl(ControlID) {
    var ctrls = document.all;
    for (var j = 0; j < ctrls.length; j++) {
        if (ctrls[j].id.indexOf(ControlID) >= 0) {
            return ctrls[j]
        }
    }
    return null;
}


/***********************Copy Array***********/
Array.prototype.clone = function() {
    var newObj = (this instanceof Array) ? [] : {};
    for (i in this) {
        if (i == 'clone') continue;
        if (this[i] && typeof this[i] == "object") {
            newObj[i] = this[i]//.clone();
        } else newObj[i] = this[i]
    } return newObj;
}
Array.prototype.GetAverageMark = function() {
    ///is base = 8 as there are 8 O.L. Subjects ?????? and why?
    var Base = 0;
    var Sum = 0;
    for (var i = 0; i < this.length; i++) {
        if (parseInt(this[i][0]) > 0) {//Subject Exists
            Sum += parseFloat(this[i][3]);
            Base += 1;
        }
    }
    ///why is that condition for, it is useless
    if (Base > 0) {
        return Sum / Base;
    } else {
        return 0;
    }
}
/********Subject Group Functions*************/
//list,
///It is useless in IG
function InitializeSubjectGroups(ActiveGroups) {
    for (var i = 0; i < SubjectGroups.length; i++) {
        SubjectGroups[i][1] = false;
        SubjectGroups[i][2] = false;
        if (("," + ActiveGroups + ",").indexOf("," + i + ",") >= 0) {
            SubjectGroups[i][2] = true //Active Group
        }
    }
}

///It is useless in IG, not used actually
function IsInActiveBasicGroup(SubjectCode) {
    for (var i = 0; i < SubjectGroups.length; i++) {
        if ((SubjectGroups[i][1] == true) && (SubjectGroups[i][0].indexOf("," + SubjectCode + ",") >= 0)) {
            //CASE 17 Advanced Subjects
            //Allow Advanced Subjects Together
            //Prevent Any Further Coupling
            return true;
        }
    }
    return false;
}

///It is useless in IG
function IsInActiveAllTimeGroup(SubjectCode) {
    for (var i = 16; i < SubjectGroups.length; i++) {
        if ((SubjectGroups[i][1] == true) && (SubjectGroups[i][0].indexOf("," + SubjectCode + ",") >= 0)) {
            // alert("Invalid "+ SubjectCode+" Was found in Group " + SubjectGroups[i][0]+ " Hence Was Blocked")
            return true;
        }
    }
    return false;
}

///It is useless in IG
function CheckAgainestSubjectGroups(SubjectCode) {
    for (var i = 0; i < SubjectGroups.length; i++) {
        if ((SubjectGroups[i][2] == true) && (SubjectGroups[i][0].indexOf("," + SubjectCode + ",") >= 0)) {
            //alert(SubjectCode + " Was found in Group " + SubjectGroups[i][0] + " Hence will Block later Group Subjects")
            SubjectGroups[i][1] = true;
        }
    }
}
/******Subject Taken For Qualification From Different Year ********/
function SubjectTakenFromDifferentYear(SubjectCode) {
    var TakenSubjectCode;
    var TakenSubjectCode1;
    if (SubjectCode < 100) { //Check A & AS Levels againest O.Level
        TakenSubjectCode = parseInt(SubjectCode) + 50;
        TakenSubjectCode1 = parseInt(SubjectCode) + 100;
    }
    if (SubjectCode > 100 && SubjectCode < 150) { //Check O & AS Levels againest A.Level
        TakenSubjectCode = parseInt(SubjectCode) - 50;
        TakenSubjectCode1 = parseInt(SubjectCode) + 50;
    }
    if (SubjectCode > 150) { //Check O & A Levels againest AS.Level
        TakenSubjectCode = parseInt(SubjectCode) - 50;
        TakenSubjectCode1 = parseInt(SubjectCode) - 100;
    }
    if (SubjectTaken(TakenSubjectCode) | SubjectTaken(TakenSubjectCode1)) { // if any of the comparable subjects is taken return true
        return true;
    } else {
        return false;
    }
    return false;
}
/*********Subject Taken*****/
function SubjectTaken(SubjectCode) {
    for (var i = 0; i < QualificationSubjects.length; i++) {
        if (QualificationSubjects[i][2] == SubjectCode) {
            return true;
        }
    }
    return false;
}
///It is useless in IG
/*****Activate Advanced Subject Groups Constraints*********/
function ActivateAdvancedSubjectGroups(SubjectCode) {
    AdvancedArray = new Array()
    AdvancedArray.push(new Array('245,1245', '203,1203'))//رياضه ورياضه متقدم
    AdvancedArray.push(new Array('246,1246', '209,1209'))//أحياء وأحياء متقدم
    AdvancedArray.push(new Array('247,1247', '208,1208'))//فيزياء وفيزياء متقدم
    AdvancedArray.push(new Array('248,1248', '207,1207'))//كيمياء وكيمياء متقدم
    AdvancedArray.push(new Array('249,1249', '222,1222'))//لغة فرنسية ولغة فرنسية متقدم
    AdvancedArray.push(new Array('250,1250', '220,1220'))//كمبيوتر وكمبيوتر متقدم
    AdvancedArray.push(new Array('258,1258', '204,205,1204,1205'))//فرع رياضيات وفرع رياضيات متقدم
    //Is Subject Advanced
    if (',245,246,247,248,249,250,258,1245,1246,1247,1248,1249,1250,1258,'.indexOf(',' + SubjectCode + ',') >= 0) {
    }
    //Is Subject Normal Level
    if (',203,1203,209,1209,208,1208,207,1207,222,1222,220,1220,204,205,1204,1205'.indexOf(',' + SubjectCode + ',') >= 0) {
    }
}
///It is useless in IG, not sued actually
/**********Grade 11 Subjects Reched 3 **********/
function G11Reached3(SubjectCode) {
    var G11SCount = 0;
    if (SubjectCode < 1000) {//G12 Subject
        return false;
    }
    for (var i = 0; i < QualificationSubjects.length; i++) {
        if (QualificationSubjects[i][2] > 1000) {//Subject Code > 1000 falling in Grade 11 list
            G11SCount = G11SCount + 1;
        }
    }
    if (G11SCount > 2) {
        return true;
    } else {
        return false;
    }
}
/*********Import Qualification Subject ********/
function ImportQualificationSubjects(SubjectsArray) {
    var str1, str2, str3
    for (var i = 0; i < SubjectsArray.length; i++) {
        str1 = SubjectsArray[i][0];
        str2 = SubjectsArray[i][1];
        str3 = SubjectsArray[i][2];
        QualificationSubjects.push(new Array(str1, str2, str3));
    }
}

/*******Check Subject*************/
function GSM(Subject) { //Get Subject Mark
    var _start, _end, _mark;
    _start = StudentSubjectList.indexOf("," + Subject + "|", 0)
    if (_start >= 0) {
        _start = _start + ("," + Subject + "|").length;
        _end = StudentSubjectList.indexOf(",", _start);
        _mark = StudentSubjectList.substr(_start, _end - _start)//1 char for letter grades
        return _mark;
    } else {
        return 0;
    }
}
/*******Select Subject For Qualification**********/

function GSC(ElectiveList, MinGrade, RequiredCount) {
    var Count = 0;
    var returnedSubjects = new Array();
    var Subjects = ElectiveList.toString().split(',')
    for (var j = 0; j < StudentSubjects.length; j++) {
        for (var i = 0; i < Subjects.length; i++) {
            if (StudentSubjects[j][0] == Subjects[i] && (StudentSubjects[j][1]).substr(0, 1) <= MinGrade) {
                if (ElectiveList.indexOf("+") >= 0) {//Complementary Check
                    if (!IsInActiveAllTimeGroup(StudentSubjects[j][0]) && !SubjectTakenFromDifferentYear(StudentSubjects[j][0])) {// && !G11Reached3(StudentSubjects[j][0])) {//Subject Groups
                        CheckAgainestSubjectGroups(StudentSubjects[j][0]);
                        //QualificationSubjects.push(new Array("C_"+StudentSubjects[j][2],StudentSubjects[j][3],StudentSubjects[j][0]));
                        returnedSubjects.push(new Array("C_" + StudentSubjects[j][2], StudentSubjects[j][3], StudentSubjects[j][0]));
                        StudentSubjects.splice(j, 1)
                        Count += 1;
                        j = -1;
                    }
                }
                else {//Basic Check
                    if (!IsInActiveBasicGroup(StudentSubjects[j][0]) && !SubjectTakenFromDifferentYear(StudentSubjects[j][0])) {//&& !G11Reached3(StudentSubjects[j][0])) {//Subject Groups
                        CheckAgainestSubjectGroups(StudentSubjects[j][0]);
                        //QualificationSubjects.push(new Array("B_"+StudentSubjects[j][2],StudentSubjects[j][3],StudentSubjects[j][0]));
                        returnedSubjects.push(new Array("B_" + StudentSubjects[j][2], StudentSubjects[j][3], StudentSubjects[j][0]));
                        StudentSubjects.splice(j, 1)
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
    return returnedSubjects;
}
/**********Grade Sort******************/
function FindMax3(Op1, Op2, Op3) {
    var MaxOperand = Op1;
    if (MaxOperand < Op2) {
        MaxOperand = Op2;
    }
    if (MaxOperand < Op3) {
        MaxOperand = Op3;
    }
    return MaxOperand;
}

//**************Fill Qualifications Combo Box*******//
var sSubjectList;
var StudentASLSubjectList;
var StudentSubjectList;
function AddQualification(_listBox, itemText, itemValue) {
    if (_listBox != null) {
        AddItem(_listBox, itemText, itemValue);
    }
}

function AddItem(objListBox, strText, strId) {
    var newOpt;
    newOpt = document.createElement("OPTION");
    newOpt = new Option(strText, strText);
    newOpt.id = strId;
    objListBox.add(newOpt);
}

function FillQualificationCB()
{
    var QCB = document.getElementById("QCB");
    if(QCB != null && Qualifications !=null ){
        for (var i = 0; i < 10; i++) { //Qualifications.length
            AddQualification(QCB, Qualifications[i][0], i);
        }
    }
}

function StartCalculations(sSubjectList) {
    //Read LoadedSubject List
    
    FillQualificationCB();
    StudentASLSubjectList = sSubjectList
    StudentSubjectList  = sSubjectList// will be filitered at the bonus object
        //Read Certificate Type
    CalculateQualifications(StudentSubjectList);
    return result;
}

        
        