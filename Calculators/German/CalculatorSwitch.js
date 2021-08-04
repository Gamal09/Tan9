//Subject class
function Subject(sCode, sName, sGrade, sMark, sStatus, cNumber) {
    this.subjectCode = sCode;
    this.subjectName = sName;
    this.subjectGrade = sGrade;
    this.subjectMark = sMark;
    this.subjectStatus = sStatus;
    this.conditionNumber = cNumber;
}
var result = "";
function getMarks(slist) {
    var marksStringList = slist.split(",");
    var marks = new Array();
    for (var j = 0; j < marksStringList.length; j++) {
        var markDetails = marksStringList[j].toString().split('|');

        var subject;
        if (parseInt(markDetails[0]) < 5000 && parseInt(markDetails[0]) >= 4000) {
            subject = new Subject(parseInt(markDetails[0]), markDetails[2], markDetails[1], parseFloat(markDetails[1].split('.')[0]), "", 0)
            subject.subjectCoefficient = parseInt(markDetails[1].split('.')[1]);
        } else {
            subject = new Subject(parseInt(markDetails[0]), markDetails[2], markDetails[1], parseFloat(markDetails[1]), "", 0)
        }
        
        marks.push(subject);
    }

    return marks;
}

function FillQualificationCB() {
    document.getElementById("QCB").style.display = "none";
    
    var marks = getMarks();
    // If this is not the German or the French certificate, display a generic message.
    if (marks.length == 0 || !(marks[0].subjectCode < 2600 && marks[0].subjectCode >= 2500) || !(marks[0].subjectCode < 5000 && marks[0].subjectCode >= 4000)) {
        document.getElementById("dvTotalMark").innerHTML = "<p><font size=\"4\" face=\"Verdana\"> فى جميع الحالات يشترط استيفاء الطالب للمواد المؤهلة للقبول بكل كلية أو معهد والشروط العامة وقواعد القبول الموضحة بدليل الطالب الموجود على الموقع والذى قام الطالب بتسلمه مع الرقم السرى وننصح الطالب بمراجعة الدليل بدقة قبل بدء تسجيل رغباته.فى حالة وجود أى استفسار يمكنكم الرجوع لمكتب التنسيق بالقاهرة أو الأسكندرية أو أسيوط.</font></p>";
    }
}

function StartCalculations(slist) {
    var marks = getMarks(slist);
    if (marks.length == 0) {
        return;
    }
    
    var code = marks[0].subjectCode;
    return StartGermanCalculations(marks);

    } 
function StartGermanCalculations(marks) {
    result = "";

    var totalMarkDiv = document.getElementById("dvTotalMark");
    totalMarkDiv.innerHTML = "";

    // Two arrays for the Abettor and the 10th grade marks
    var marksAbettor = new Array();
    var marks10thGrade = new Array();

    // Classify the marks into Abettor and 10th grade based on the ID and add bonus if applicable
    for (var j = 0; j < marks.length; j++) {
        if (marks[j].subjectCode >= 2500 && marks[j].subjectCode < 2550) {
            // Bonus is added if the mark >= 85 for any subject or >= 75 for the German subject
            if (marks[j].subjectMark >= 85 || (marks[j].subjectCode == 2500 && marks[j].subjectMark >= 75)) {
                marks[j].subjectMark += 15;
                marks[j].isBonusAdded = true;
            }
            marksAbettor.push(marks[j]);
        } else {
            marks10thGrade.push(marks[j]);
        }

        if (marks[j].subjectMark <= 15) {
            totalMarkDiv.innerHTML = "<p><font size=\"4\" face=\"Verdana\"> برجاء التأكد من ادخال الدرجات من واقع مفتاح الدرجات الذي يرد بالشهادة بحد أقصي 100. برجاء الضغط علي زر الخطوة السابقة لتعديل الدرجات الخاطئة. </font></p>";
            return "غير مؤهل|غير مؤهل|غير مؤهل|غير مؤهل";
        }
    }

    // Three cases: Elmy, Ryada, Adaby
    var textCases = ['للمجموعة الطبية', 'للمجموعة الهندسية', 'للمجموعة الأدبية', 'لكليات الآداب والألسن والتربية الأقسام الأدبية']
    var mandatorySubjectsCases = [[2501, 2506, 2507, 2508, 2509], [2501, 2506, 2507, 2508], [2501], [2501]];

    for (var i = 0; i < 4; i++) {

        var chosenMarks = new Array();
        var mandatorySubjects = mandatorySubjectsCases[i];

        // Sort the marks so that mandatory marks are first and the marks are sorted from highest to lowest
        marksAbettor.sort(function (a, b) { return (mandatorySubjects.indexOf(b.subjectCode) >= 0) - (mandatorySubjects.indexOf(a.subjectCode) >= 0) || b.subjectMark - a.subjectMark; });
        marks10thGrade.sort(function (a, b) { return (mandatorySubjects.indexOf(b.subjectCode - 50) >= 0) - (mandatorySubjects.indexOf(a.subjectCode - 50) >= 0) || b.subjectMark - a.subjectMark; });

        var m = 0;
        var numMandatoryMarks = 0;
        var is10thGradeUsed = false;

        // Exactly 7 marks are needed
        for (var j = 0; j < 7; j++) {
            // If we still need mandatory marks and the first Abettor mark is mandatory
            if (numMandatoryMarks < mandatorySubjects.length && m < marksAbettor.length && mandatorySubjects.indexOf(marksAbettor[m].subjectCode) >= 0) {
                chosenMarks.push(marksAbettor[m]);
                numMandatoryMarks += 1;
                m += 1;

            // If we still need mandatory marks and the first 10th grade mark is mandatory
            } else if (numMandatoryMarks < mandatorySubjects.length && !is10thGradeUsed && marks10thGrade.length > 0 && mandatorySubjects.indexOf(marks10thGrade[0].subjectCode - 50) >= 0) {
                chosenMarks.push(marks10thGrade[0]);
                numMandatoryMarks += 1;
                is10thGradeUsed = true;

            // If we still need mandatory marks, but there is not any.
            } else if (numMandatoryMarks < mandatorySubjects.length) {
                break;

            // If we need any mark and we ran out of Abettor marks and there is a 10th grade mark
            } else if (!is10thGradeUsed && m == marksAbettor.length && marks10thGrade.length > 0) {
                chosenMarks.push(marks10thGrade[0]);
                is10thGradeUsed = true;

            // If we need any mark and there is an Abettor mark
            } else if (m < marksAbettor.length) {
                chosenMarks.push(marksAbettor[m]);
                m += 1;
            }
        }

        //console.log('--------------');
        //console.log(textCases[i]);

        // Make sure to include either German (2500 or 2550) or French (2502 or 2552) included
        // in the list of marks in the case 'لكليات الآداب والألسن والتربية الأقسام الأدبية'
        if (i == 3) {
            var isSecondLanguageExist = false;
            var secondLanguageCodes = [2500, 2550, 2502, 2552];
            for (var j = 0; j < chosenMarks.length; j++) {
                if (secondLanguageCodes.indexOf(chosenMarks[j].subjectCode) >= 0) {
                    isSecondLanguageExist = true;
                    break;
                }
            }

            // If there is no second language, add the one with the best mark instead of the least mark.
            if (!isSecondLanguageExist) {
                // Remove the least mark
                chosenMarks.pop();

                // Replace the removed mark with the best German or French mark in the Abettor list
                for (var j = m; j < marksAbettor.length; j++) {
                    if (secondLanguageCodes.indexOf(marksAbettor[j].subjectCode) >= 0) {
                        chosenMarks.push(marksAbettor[j]);
                        isSecondLanguageExist = true;
                        break;
                    }
                }

                // If nothing found in the Abettor list, try the 10th grade marks.
                if (!isSecondLanguageExist && !is10thGradeUsed) {
                    for (var j = 0; j < marks10thGrade.length; j++) {
                        if (secondLanguageCodes.indexOf(marks10thGrade[j].subjectCode) >= 0) {
                            chosenMarks.push(marks10thGrade[j]);
                            isSecondLanguageExist = true;
                            break;
                        }
                    }
                }
            }
        }

        var totalMark = 0;
        // If there is no enough marks
        if (chosenMarks.length < 7) {
            totalMark = -1;
            //console.log('غير مؤهل');
            //console.log(chosenMarks);
        } else {
            // Sort based on the original grades to detect the top 3 marks.
            // If marks are equal, sort based on the subject code so that the German subject is the last one because it has the smallest ID.
            chosenMarks.sort(function (a, b) { return parseFloat(b.subjectGrade) - parseFloat(a.subjectGrade) || b.subjectCode - a.subjectCode; });

            var top3Counter = 3;
            for (var j = 0; j < chosenMarks.length; j++) {

                var bonus = 0;
                if (chosenMarks[j].subjectCode < 2550) {
                    bonus = (top3Counter > 0 && !chosenMarks[j].isBonusAdded) ? 15 : 0;
                    top3Counter -= 1;
                }

                totalMark += chosenMarks[j].subjectMark + bonus;
                //console.log(chosenMarks[j].subjectName + ': ' + (chosenMarks[j].subjectMark + bonus));
            }

            totalMark = totalMark / 7 * 4.1;
        }

        // Display the total mark
        var displayedMark = totalMark == -1 ? "غير مؤهل" : Math.round(totalMark * 1000000) / 1000000;
        totalMarkDiv.innerHTML += "<p><font size=\"4\" face=\"Verdana\"> المجموع الاعتبارى " + textCases[i] + ": " + displayedMark + "</font></p>";
        result = result + displayedMark + "|";
    }
    result = result.slice(0, -1);
    return result;
}


