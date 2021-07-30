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
    result = "";
    var marks = getMarks(slist);
    if (marks.length == 0) {
        return;
    }
    
    return StartFrenchCalculations(marks);
}

function StartFrenchCalculations(marks) {

    var totalMarkDiv = document.getElementById("dvTotalMark");
    totalMarkDiv.innerHTML = "";

    // The indices of the two parts of the french subject
    var m = -1;
    var n = -1;

    // Preprocessing
    for (var j = marks.length - 1; j >= 0; j--) {

        // Correct the coefficient to 1 instead of 0, otherwise add 5 bonus points.
        if (marks[j].subjectCoefficient == 0) {
            marks[j].subjectCoefficient = 1;
        } else {
            marks[j].subjectMark += 5;
        }

        // Duplicate the marks that correspond to two subjects (HIST.GEOG., PHYS-CHIME, and علم اجتماع واقتصاد)
        if (marks[j].subjectCode == 4002 || marks[j].subjectCode == 4003 || marks[j].subjectCode == 4019) {
            var markClone = new Subject(marks[j].subjectCode, marks[j].subjectName, marks[j].subjectGrade, marks[j].subjectMark, '', 0);
            markClone.subjectCoefficient = 0;
            marks.push(markClone);

        // Indicate the first part of the french subject.
        } else if (marks[j].subjectCode == 4000) {
            m = j;

        // Indicate the second part of the french subject.
        } else if (marks[j].subjectCode == 4001) {
            n = j;
        }
    }

    // Merge the two parts of the french subject.
    if (m != -1 && n != -1) {
        // Calculate the overall grade of the Francais subject and remove the entry of the second part.
        marks[m].subjectName = 'Francais';
        marks[m].subjectMark = (marks[m].subjectCoefficient * marks[m].subjectMark + marks[n].subjectCoefficient * marks[n].subjectMark) / (marks[m].subjectCoefficient + marks[n].subjectCoefficient);
        marks[m].subjectCoefficient = marks[m].subjectCoefficient + marks[n].subjectCoefficient;
        marks.splice(n, 1);
    } else if (m != -1) {
        // Ignore the first part if the second part is not available.
        marks.splice(m, 1);
    } else if (n != -1) {
        // Ignore the second part if the first part is not available.
        marks.splice(n, 1);
    }

    // Three cases: Elmy, Ryada, Adaby
    var textCases = ['للمجموعة العلمية', 'للمجموعة الهندسية', 'للمجموعة الأدبية', 'لكليات الآداب والألسن والتربية الأقسام الأدبية']
    var mandatorySubjectsCases = [[4003, 4003, 4004, 4005, 4006], [4003, 4003, 4005, 4006], [4006], [4006]];

    for (var i = 0; i < 4; i++) {

        var mandatorySubjects = mandatorySubjectsCases[i];
        var mandatoryMarks = new Array();
        var optionalMarks = new Array();

        for (var j = 0; j < marks.length; j++) {
            if (mandatorySubjects.indexOf(marks[j].subjectCode) >= 0) {
                mandatoryMarks.push(marks[j]);
            } else {
                optionalMarks.push(marks[j]);
            }
        }

        console.log('--------------');
        console.log(textCases[i]);

        var totalMark = -1;
        // If there is no enough marks
        if (mandatoryMarks.length < mandatorySubjects.length || mandatoryMarks.length + optionalMarks.length < 7) {
            console.log('غير مؤهل');
        } else {

            var mandatoryNumerator = 0;
            var mandatoryDenominator = 0;
            for (var j = 0; j < mandatoryMarks.length; j++) {
                mandatoryNumerator += mandatoryMarks[j].subjectMark * mandatoryMarks[j].subjectCoefficient;
                mandatoryDenominator += 20 * mandatoryMarks[j].subjectCoefficient;
            }

            var bestOptionalMarks = null;
            combinations(optionalMarks, 7 - mandatoryMarks.length, function output(arr) {

                var occurencesOfComboSubjects = {};
                var numOfLanguauges = 0;

                var optionalNumerator = 0;
                var optionalDenominator = 0;
                for (var j = 0; j < arr.length; j++) {
                    optionalNumerator += arr[j].subjectMark * arr[j].subjectCoefficient;
                    optionalDenominator += 20 * arr[j].subjectCoefficient;

                    if (arr[j].subjectCode == 4000 || arr[j].subjectCode == 4008) {
                        numOfLanguauges += 1;
                    }

                    if (arr[j].subjectCode == 4002 || arr[j].subjectCode == 4003 || arr[j].subjectCode == 4019) {
                        if (arr[j].subjectCode in occurencesOfComboSubjects) {
                            delete occurencesOfComboSubjects[arr[j].subjectCode]
                        } else {
                            occurencesOfComboSubjects[arr[j].subjectCode] = true;
                        }
                    }
                }

                if (Object.keys(occurencesOfComboSubjects).length === 0 && (i != 3 || (i == 3 && numOfLanguauges > 0))) {
                    var thisMark = (mandatoryNumerator + optionalNumerator) / parseFloat(mandatoryDenominator + optionalDenominator);
                    if (thisMark > totalMark) {
                        totalMark = thisMark;
                        bestOptionalMarks = arr.slice();
                    }
                }
            });

            if (totalMark == -1) {
                console.log('غير مؤهل');
            } else {
                totalMark = totalMark * 100 * 4.1;

                for (var j = 0; j < mandatoryMarks.length; j++) {
                    console.log(mandatoryMarks[j].subjectName + ': ' + (mandatoryMarks[j].subjectMark));
                }
                for (var j = 0; j < bestOptionalMarks.length; j++) {
                    console.log(bestOptionalMarks[j].subjectName + ': ' + (bestOptionalMarks[j].subjectMark));
                }
            }            
        }

        // Display the total mark
        var displayedMark = totalMark == -1 ? "غير مؤهل" : Math.round(totalMark * 1000000) / 1000000;
        totalMarkDiv.innerHTML += "<p><font size=\"4\" face=\"Verdana\"> المجموع الاعتبارى " + textCases[i] + ": " + displayedMark + "</font></p>";
        result = result + displayedMark + "|";
    }
    result = result.slice(0, -1);
    return result;
}

function combinations(numArr, choose, callback) {
    var n = numArr.length;
    var c = [];
    var inner = function (start, choose_) {
        if (choose_ == 0) {
            callback(c);
        } else {
            for (var i = start; i <= n - choose_; ++i) {
                c.push(numArr[i]);
                inner(i + 1, choose_ - 1);
                c.pop();
            }
        }
    }
    inner(0, choose);
}