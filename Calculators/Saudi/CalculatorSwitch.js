    //grade11,grade12
var grade11 = new Array()
var grade12 = new Array()
var totalMark = 0;
var grade11Classes  = 0;
var grade12Classes  = 0;
var CertificateType= "";

function StartCalculations(sSubjectList){
    
 var tempArray = new Array();
 
 var studentList = sSubjectList.split(',');
  for (var j = 0; j < studentList.length; j++) {
        var subjectInfo = new Array();
        subjectInfo = studentList[j].toString().split('|');
        var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
        tempArray.push(subject);
    }
    
    studentList = tempArray;
    
    //Create subjects for each grade
    grade11 = new Array();
    grade12 = new Array();
    grade13 = new Array();
    grade2 = new Array();
    Qodrat = new Array();


    for (var i = 0; i < studentList.length; i++){
        var subjectName = studentList[i].subjectName;
        if (studentList[i].subjectMark > 0) {
            if (studentList[i].subjectCode >= 1500 && studentList[i].subjectCode <= 1671 ) {
                if (subjectName.includes("1") | subjectName.includes("2")) {
                    grade11.push(studentList[i]);
                }
                else if (subjectName.includes("3") | subjectName.includes("4")) {
                    grade12.push(studentList[i]);
                }
                else if (subjectName.includes("5") | subjectName.includes("6") | subjectName.includes("7")) {
                    grade13.push(studentList[i]);
                }
                else {
                    grade11.push(studentList[i]);
                }
            }
            else if (studentList[i].subjectCode >= 1672 && studentList[i].subjectCode <= 1809) {                    
                grade2.push(studentList[i]);
            }
            else if (studentList[i].subjectCode >= 1810 && studentList[i].subjectCode <= 1813) {
                Qodrat.push(studentList[i]);
            }
        }
    }
  
    var totalg11 = CalculateGrade(grade11);
    var totalg12 = CalculateGrade(grade12);
    var totalg13 = CalculateGrade(grade13);

    var totalg1 = 0;

    if (totalg11 != 0 && totalg12 != 0 && totalg13 != 0) {
        totalg1 = parseFloat((totalg11 * 2.05 * 0.25) + (totalg12 * 2.05 * 0.35) + (totalg13 * 2.05 * 0.40));
    }
    else if (totalg11 == 0 && totalg12 != 0 && totalg13 != 0) {
        totalg1 = parseFloat((totalg12 * 2.05 * 0.475) + (totalg13 * 2.05 * 0.525));
    }
    else if (totalg11 == 0 && totalg12 == 0 && totalg13 != 0) {
        totalg1 = parseFloat(totalg13 * 2.05);
    }
    else if (totalg11 != 0 && totalg12 == 0 && totalg13 != 0) {
        totalg1 = parseFloat((totalg11 * 2.05 * 0.425) + (totalg13 * 2.05 * 0.575));
    }

    var totalg2 = parseFloat(CalculateGrade(grade2) * 2.05);

    if (Qodrat.length != 0) {
        var QodratMark = parseFloat(Qodrat[0].subjectMark * 2.05);
    }
    else {
        alert("برجاء اخال درجات القدرات")
        return "غير مؤهل"
    }


    if (totalg1 != 0 && QodratMark != 0 && totalg2 == 0) {
        totalMark = totalg1 + QodratMark;
    }
    else if (totalg1 == 0 && QodratMark != 0 && totalg2 != 0) {
        totalMark = totalg2 + QodratMark;
    }
    else {
        alert("إدخل المواد بشكل صحيح");
        return "غير مؤهل"
    }
    
        return totalMark;
}

function CalculateGrade(sList) {
    var totalmark = 0;
    var totalCredit = 0;
    if (sList.length == 0) return 0;
    for (var i = 0; i < sList.length; i++) {
        totalmark = totalmark + parseFloat(sList[i].subjectMark) * GetCredit(sList[i].subjectCode);
        totalCredit = totalCredit + GetCredit(sList[i].subjectCode)
    }
    return parseFloat(totalmark / parseFloat(totalCredit));
}

function GetCredit(sCode) {
    for (var j = 0; j < lookup.length; j++) {
        if (lookup[j].SubjectCode == sCode) {
            return lookup[j].CreditHours;
        }
    }
    return 1;
}


var lookup = [{ 'SubjectCode': 1500, 'CreditHours': 4 },
{ 'SubjectCode': 1501, 'CreditHours': 4 },
{ 'SubjectCode': 1502, 'CreditHours': 5 },
{ 'SubjectCode': 1503, 'CreditHours': 5 },
{ 'SubjectCode': 1504, 'CreditHours': 2 },
{ 'SubjectCode': 1505, 'CreditHours': 2 },
{ 'SubjectCode': 1506, 'CreditHours': 2 },
{ 'SubjectCode': 1507, 'CreditHours': 2 },
{ 'SubjectCode': 1508, 'CreditHours': 3 },
{ 'SubjectCode': 1509, 'CreditHours': 3 },
{ 'SubjectCode': 1510, 'CreditHours': 6 },
{ 'SubjectCode': 1511, 'CreditHours': 6 },
{ 'SubjectCode': 1512, 'CreditHours': 2 },
{ 'SubjectCode': 1513, 'CreditHours': 2 },
{ 'SubjectCode': 1514, 'CreditHours': 2 },
{ 'SubjectCode': 1515, 'CreditHours': 2 },
{ 'SubjectCode': 1516, 'CreditHours': 3 },
{ 'SubjectCode': 1517, 'CreditHours': 3 },
{ 'SubjectCode': 1518, 'CreditHours': 4 },
{ 'SubjectCode': 1519, 'CreditHours': 4 },
{ 'SubjectCode': 1520, 'CreditHours': 4 },
{ 'SubjectCode': 1521, 'CreditHours': 4 },
{ 'SubjectCode': 1522, 'CreditHours': 3 },
{ 'SubjectCode': 1523, 'CreditHours': 3 },
{ 'SubjectCode': 1524, 'CreditHours': 2 },
{ 'SubjectCode': 1525, 'CreditHours': 2 },
{ 'SubjectCode': 1526, 'CreditHours': 2 },
{ 'SubjectCode': 1527, 'CreditHours': 2 },
{ 'SubjectCode': 1528, 'CreditHours': 3 },
{ 'SubjectCode': 1529, 'CreditHours': 3 },
{ 'SubjectCode': 1530, 'CreditHours': 4 },
{ 'SubjectCode': 1531, 'CreditHours': 4 },
{ 'SubjectCode': 1532, 'CreditHours': 4 },
{ 'SubjectCode': 1533, 'CreditHours': 4 },
{ 'SubjectCode': 1534, 'CreditHours': 3 },
{ 'SubjectCode': 1535, 'CreditHours': 3 },
{ 'SubjectCode': 1536, 'CreditHours': 2 },
{ 'SubjectCode': 1537, 'CreditHours': 2 },
{ 'SubjectCode': 1538, 'CreditHours': 2 },
{ 'SubjectCode': 1539, 'CreditHours': 2 },
{ 'SubjectCode': 1540, 'CreditHours': 4 },
{ 'SubjectCode': 1541, 'CreditHours': 4 },
{ 'SubjectCode': 1542, 'CreditHours': 5 },
{ 'SubjectCode': 1543, 'CreditHours': 5 },
{ 'SubjectCode': 1544, 'CreditHours': 2 },
{ 'SubjectCode': 1545, 'CreditHours': 2 },
{ 'SubjectCode': 1546, 'CreditHours': 2 },
{ 'SubjectCode': 1547, 'CreditHours': 2 },
{ 'SubjectCode': 1548, 'CreditHours': 3 },
{ 'SubjectCode': 1549, 'CreditHours': 3 },
{ 'SubjectCode': 1550, 'CreditHours': 6 },
{ 'SubjectCode': 1551, 'CreditHours': 6 },
{ 'SubjectCode': 1552, 'CreditHours': 2 },
{ 'SubjectCode': 1553, 'CreditHours': 2 },
{ 'SubjectCode': 1554, 'CreditHours': 2 },
{ 'SubjectCode': 1555, 'CreditHours': 2 },
{ 'SubjectCode': 1556, 'CreditHours': 3 },
{ 'SubjectCode': 1557, 'CreditHours': 3 },
{ 'SubjectCode': 1558, 'CreditHours': 4 },
{ 'SubjectCode': 1559, 'CreditHours': 4 },
{ 'SubjectCode': 1560, 'CreditHours': 4 },
{ 'SubjectCode': 1561, 'CreditHours': 4 },
{ 'SubjectCode': 1562, 'CreditHours': 3 },
{ 'SubjectCode': 1563, 'CreditHours': 3 },
{ 'SubjectCode': 1564, 'CreditHours': 2 },
{ 'SubjectCode': 1565, 'CreditHours': 2 },
{ 'SubjectCode': 1566, 'CreditHours': 2 },
{ 'SubjectCode': 1567, 'CreditHours': 2 },
{ 'SubjectCode': 1568, 'CreditHours': 3 },
{ 'SubjectCode': 1569, 'CreditHours': 3 },
{ 'SubjectCode': 1570, 'CreditHours': 4 },
{ 'SubjectCode': 1571, 'CreditHours': 4 },
{ 'SubjectCode': 1572, 'CreditHours': 4 },
{ 'SubjectCode': 1573, 'CreditHours': 4 },
{ 'SubjectCode': 1574, 'CreditHours': 3 },
{ 'SubjectCode': 1575, 'CreditHours': 3 },
{ 'SubjectCode': 1576, 'CreditHours': 2 },
{ 'SubjectCode': 1577, 'CreditHours': 2 },
{ 'SubjectCode': 1578, 'CreditHours': 2 },
{ 'SubjectCode': 1579, 'CreditHours': 2 },
{ 'SubjectCode': 1580, 'CreditHours': 4 },
{ 'SubjectCode': 1581, 'CreditHours': 4 },
{ 'SubjectCode': 1582, 'CreditHours': 5 },
{ 'SubjectCode': 1583, 'CreditHours': 5 },
{ 'SubjectCode': 1584, 'CreditHours': 2 },
{ 'SubjectCode': 1585, 'CreditHours': 2 },
{ 'SubjectCode': 1586, 'CreditHours': 2 },
{ 'SubjectCode': 1587, 'CreditHours': 2 },
{ 'SubjectCode': 1588, 'CreditHours': 3 },
{ 'SubjectCode': 1589, 'CreditHours': 3 },
{ 'SubjectCode': 1590, 'CreditHours': 6 },
{ 'SubjectCode': 1591, 'CreditHours': 6 },
{ 'SubjectCode': 1592, 'CreditHours': 2 },
{ 'SubjectCode': 1593, 'CreditHours': 2 },
{ 'SubjectCode': 1594, 'CreditHours': 2 },
{ 'SubjectCode': 1595, 'CreditHours': 2 },
{ 'SubjectCode': 1596, 'CreditHours': 4 },
{ 'SubjectCode': 1597, 'CreditHours': 4 },
{ 'SubjectCode': 1598, 'CreditHours': 6 },
{ 'SubjectCode': 1599, 'CreditHours': 6 },
{ 'SubjectCode': 1600, 'CreditHours': 4 },
{ 'SubjectCode': 1601, 'CreditHours': 4 },
{ 'SubjectCode': 1602, 'CreditHours': 4 },
{ 'SubjectCode': 1603, 'CreditHours': 4 },
{ 'SubjectCode': 1604, 'CreditHours': 3 },
{ 'SubjectCode': 1605, 'CreditHours': 3 },
{ 'SubjectCode': 1606, 'CreditHours': 2 },
{ 'SubjectCode': 1607, 'CreditHours': 2 },
{ 'SubjectCode': 1608, 'CreditHours': 4 },
{ 'SubjectCode': 1609, 'CreditHours': 4 },
{ 'SubjectCode': 1610, 'CreditHours': 2 },
{ 'SubjectCode': 1611, 'CreditHours': 6 },
{ 'SubjectCode': 1612, 'CreditHours': 6 },
{ 'SubjectCode': 1613, 'CreditHours': 4 },
{ 'SubjectCode': 1614, 'CreditHours': 4 },
{ 'SubjectCode': 1615, 'CreditHours': 4 },
{ 'SubjectCode': 1616, 'CreditHours': 4 },
{ 'SubjectCode': 1617, 'CreditHours': 4 },
{ 'SubjectCode': 1618, 'CreditHours': 4 },
{ 'SubjectCode': 1619, 'CreditHours': 3 },
{ 'SubjectCode': 1620, 'CreditHours': 3 },
{ 'SubjectCode': 1621, 'CreditHours': 2 },
{ 'SubjectCode': 1622, 'CreditHours': 2 },
{ 'SubjectCode': 1623, 'CreditHours': 4 },
{ 'SubjectCode': 1624, 'CreditHours': 4 },
{ 'SubjectCode': 1625, 'CreditHours': 2 },
{ 'SubjectCode': 1626, 'CreditHours': 4 },
{ 'SubjectCode': 1627, 'CreditHours': 4 },
{ 'SubjectCode': 1628, 'CreditHours': 5 },
{ 'SubjectCode': 1629, 'CreditHours': 5 },
{ 'SubjectCode': 1630, 'CreditHours': 2 },
{ 'SubjectCode': 1631, 'CreditHours': 2 },
{ 'SubjectCode': 1632, 'CreditHours': 2 },
{ 'SubjectCode': 1633, 'CreditHours': 2 },
{ 'SubjectCode': 1634, 'CreditHours': 3 },
{ 'SubjectCode': 1635, 'CreditHours': 3 },
{ 'SubjectCode': 1636, 'CreditHours': 6 },
{ 'SubjectCode': 1637, 'CreditHours': 6 },
{ 'SubjectCode': 1638, 'CreditHours': 2 },
{ 'SubjectCode': 1639, 'CreditHours': 2 },
{ 'SubjectCode': 1640, 'CreditHours': 2 },
{ 'SubjectCode': 1641, 'CreditHours': 2 },
{ 'SubjectCode': 1642, 'CreditHours': 4 },
{ 'SubjectCode': 1643, 'CreditHours': 4 },
{ 'SubjectCode': 1644, 'CreditHours': 6 },
{ 'SubjectCode': 1645, 'CreditHours': 6 },
{ 'SubjectCode': 1646, 'CreditHours': 4 },
{ 'SubjectCode': 1647, 'CreditHours': 4 },
{ 'SubjectCode': 1648, 'CreditHours': 4 },
{ 'SubjectCode': 1649, 'CreditHours': 4 },
{ 'SubjectCode': 1650, 'CreditHours': 3 },
{ 'SubjectCode': 1651, 'CreditHours': 3 },
{ 'SubjectCode': 1652, 'CreditHours': 2 },
{ 'SubjectCode': 1653, 'CreditHours': 2 },
{ 'SubjectCode': 1654, 'CreditHours': 4 },
{ 'SubjectCode': 1655, 'CreditHours': 4 },
{ 'SubjectCode': 1656, 'CreditHours': 2 },
{ 'SubjectCode': 1657, 'CreditHours': 6 },
{ 'SubjectCode': 1658, 'CreditHours': 4 },
{ 'SubjectCode': 1659, 'CreditHours': 4 },
{ 'SubjectCode': 1660, 'CreditHours': 4 },
{ 'SubjectCode': 1661, 'CreditHours': 4 },
{ 'SubjectCode': 1662, 'CreditHours': 4 },
{ 'SubjectCode': 1663, 'CreditHours': 4 },
{ 'SubjectCode': 1664, 'CreditHours': 4 },
{ 'SubjectCode': 1665, 'CreditHours': 3 },
{ 'SubjectCode': 1666, 'CreditHours': 3 },
{ 'SubjectCode': 1667, 'CreditHours': 2 },
{ 'SubjectCode': 1668, 'CreditHours': 2 },
{ 'SubjectCode': 1669, 'CreditHours': 2 },
{ 'SubjectCode': 1670, 'CreditHours': 4 },
{ 'SubjectCode': 1671, 'CreditHours': 2 }]