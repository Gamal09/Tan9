var strMarks = "";
function ShowQualificationStudent(QualificationsArray) {
    var QualificationObjectsArray = QualificationsArray;
    var QDiv;
        
//    WriteFloatingLayer();
    GetQualificationInfo();
    function GetQualificationInfo() {
        strMarks = "";
        var qualificationDiv = document.getElementById('AllQualification'); 
        var QTableContents = "";
        qualificationDiv.innerHTML = "";
        QTableContents += "<table border=\"1\" width=\"500\">";
        QTableContents += "<tr bgcolor=#CCCCFF><td align=\"center\">التخصص</td><td align=\"center\">المجموع الاعتبارى</td></tr>";
        for (var i = 1; i < QualificationObjectsArray.length; i++) {

                QTableContents += "	<tr>";
                QTableContents += "<td width=250>" + QualificationObjectsArray[i].sQualification + "</br></td>";
                QTableContents += "<td width=150>" + QualificationObjectsArray[i].qMark + "</br></td>";
                QTableContents += "	</tr>";
                qualificationDiv.innerHTML = QTableContents;
               }     
        for (var i = 1; i < QualificationObjectsArray.length; i++) {
            QDiv = FindControl('dvQualification' + (i + 1));

                var tableContents = "";
                QDiv.innerHTML = "";
                tableContents += "<table border=\"1\" width=\"300\">";
                tableContents += "	<tr><td>المجموع الاعتبارى : " + QualificationObjectsArray[i].qMark + "</br></td></tr>";
                strMarks = strMarks + QualificationObjectsArray[i].qMark +"|";
                tableContents += "</table>";
                QDiv.innerHTML = tableContents;
                GetReasons(i + 1)
        }
        strMarks = strMarks.slice(0, -1);
    }


    function GetReasons(qNumber) {
        //alert(e.srcElement.id);
//        var analysisLayer = document.getElementById("analysisLayer");
//        analysisLayer.style.display = "block";
        //        analysisLayer.style.visibility = 'visible';

        var layer = document.createElement('div');
        layer.id = 'analysisContents' + qNumber;
        layer.className = 'multiplelayers';

        document.getElementById(QDiv.id).appendChild(layer);

        var analysisContent = document.getElementById("analysisContents" + qNumber);
        var tableContents = "";
        analysisContent.innerHTML = "";
        tableContents += "<table dir=\"rtl\" border=\"1\" width=\"530\">";
        tableContents += "	<tr>";
        tableContents += "		<td width=150>الشروط</td>";
        tableContents += "      <td width=70>الحالة</td>";
        tableContents += "		<td width=190>المواد</td>";
        tableContents += "	</tr>";

        //var buttonName = e.srcElement.id;
        var qualNumber = qNumber//buttonName.substr(10, buttonName.length - 10)
        for (var i = 0; i < analysisList.length; i++) {
            if (analysisList[i][0] == qualNumber) {
                //alert(analysisList[i]);
                if (analysisList[i][3].indexOf("لم ") > -1) {
                    tableContents += "  <tr bgcolor=#CCCCFF>";
                } else {
                    tableContents += "	<tr>";
                }
                
                tableContents += "		<td width=150>" + analysisList[i][2] + "</td>";
                tableContents += "      <td width=70>" + analysisList[i][3] + "</td>";
                tableContents += "		<td width=190>"
                
                for (var j = 0; j < analysisList[i][5].length; j++) {
                    tableContents += analysisList[i][5][j][0]+ "--الدرجه:" + analysisList[i][5][j][1] + "</br>";
                }
                for (var j = 0; j < analysisList[i][4].length; j++) {
                    tableContents += analysisList[i][4][j][0]+ "--الدرجه:" + analysisList[i][4][j][1] + "</br>";
                }
                tableContents += "		</td>"
                tableContents += "	</tr>";
            }
        }
        tableContents += "</table>";
        document.getElementById("analysisContents" + qNumber).innerHTML = tableContents;
        //analysisContent.innerHTML = tableContents;
    }
}