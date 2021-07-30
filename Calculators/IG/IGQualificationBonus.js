function IGQualificationBonus(StudentASLSubjects){

  var tempArray = new Array();
  var SASLSubjects = StudentASLSubjects.split(','); //ALL Subjects

  for (var j=0;j<SASLSubjects.length;j++){

    var subjectInfo = new Array();
    subjectInfo = SASLSubjects[j].toString().split('|');
    var subject = new Subject(subjectInfo[0], subjectInfo[2], subjectInfo[1], subjectInfo[3], "", 0)
    if(subject.subjectCode > 100){//take only al . asl
      tempArray.push(subject);
    }
    
    //SASLSubjects[j] = SASLSubjects[j].toString().split('|');
  }
  
  SASLSubjects = tempArray;
  
  /*SASLSubjects.splice(0, 1)
  SASLSubjects.splice(SASLSubjects.length - 1, 1);*/
//  var qualificationSubjects = new Array();
//  qualificationSubjects = qualSubjects; 
   
  //Get the option of the maximum grades for the different bonus options calculated
  function GetMaximumOption(OptionsArray, AConditionFailed, qualificationSubjects){ // add aconditionfailed to declaration
    MaxOptionIndex = -1;
    MaxOptionAverageMark = 0;
    //var ss = StudentSubjects;
    for(var i=0;i<OptionsArray.length;i++){
      //if a ConditionFailed
      //Select Minimum Interchangable Subject
      //Check Subject coode - Rescale subject down if subject code < 150 then ubjectMark /2  + 15
      //else SubjectMark / 1.5 + 7.5
      if(AConditionFailed != 0){
        //if(OptionsArray[i][1] == 'Interchangable'){
        //OptionsArray[i][0] ==> list of different options in the option list
        var TempMin = 200;
        var MinMarkSubject = 0;
        //review extra subjects first
        for(var j = 0; j < OptionsArray[i].length; j++){//find minimum extra subject to taken for insertion 
             if(OptionsArray[i][j].subjectStatus == -2){
                TempMin = OptionsArray[i][j].subjectMark;
                MinMarkSubject = j;
             }
        }
        //Review all subjects if no extra were found in the option 
        if(TempMin==200){
            for(var j = 0; j < OptionsArray[i].length; j++){//find minimum interchangable subject to complete the failed condition
              //if the subject is intercahngable
              if(OptionsArray[i][j].subjectCode < 0){
                //OptionsArray[i][0][j][3] ==> j: option number in option list, [3]: option mark
                if(parseFloat(OptionsArray[i][j].subjectMark) < parseFloat(TempMin)){
                  TempMin = OptionsArray[i][j].subjectMark;
                  MinMarkSubject = j;
                }
              }
            }
        }
        if (OptionsArray[i][MinMarkSubject].subjectCode < -150) {
          OptionsArray[i][MinMarkSubject].subjectName += " تم ادخال المادة إلي المواد الأساسية ";
          OptionsArray[i][MinMarkSubject].subjectMark = OptionsArray[i][MinMarkSubject].subjectMark / (1.5);
          OptionsArray[i][MinMarkSubject].subjectMark = OptionsArray[i][MinMarkSubject].subjectMark + 7.5;
          OptionsArray[i][MinMarkSubject].subjectStatus = 2;

        } else {
          OptionsArray[i][MinMarkSubject].subjectName += " تم ادخال المادة إلي المواد الأساسية ";
          OptionsArray[i][MinMarkSubject].subjectMark = OptionsArray[i][MinMarkSubject].subjectMark / 2;
          OptionsArray[i][MinMarkSubject].subjectMark = OptionsArray[i][MinMarkSubject].subjectMark + 15;
          OptionsArray[i][MinMarkSubject].subjectStatus = 2;
        }
      
      }
      //initiate max option by the ol subjects only
        if (OptionsArray[0][0].subjectStatus != 0) //There exists obligatory subject in options
            MaxOptionAverageMark = GetTotalAverageMark(new Array(0,0,0,0), qualificationSubjects);
      //find t  he option average mark
      var tempOptionAverageMark = GetTotalAverageMark(OptionsArray[i], qualificationSubjects);
      if (tempOptionAverageMark >MaxOptionAverageMark){
        MaxOptionIndex=i;
        //MaxOptionAverageMark = OptionsArray[i].GetAverageMark();
        MaxOptionAverageMark = tempOptionAverageMark;
      }
    }
    if(MaxOptionIndex > -1){
      return OptionsArray[MaxOptionIndex];
    }else{
      return new Array(0,0,0,0);
    }
  }
  
  function GetTotalAverageMark(ASLSubjects, OLSubjects){
    var Base=0;
    var Sum=0;
    for(var i=0;i<ASLSubjects.length;i++){
      //Subject Exists and subject is not extra (-2)
      if(parseInt(Math.abs(ASLSubjects[i].subjectCode))>0 && (ASLSubjects[i].subjectStatus!=-2)){
        Sum += parseFloat(ASLSubjects[i].subjectMark);
        Base +=1;
      }
    }
    
    for(var i=0;i<OLSubjects.length;i++){
      if(parseInt(OLSubjects[i].subjectCode)>0){//Subject Exists
        Sum += parseFloat(OLSubjects[i].subjectMark);
        Base +=1;
      }
    }
    ///why is that condition for, it is useless
    if(Base>0){
      return Sum/Base;
    }else{
      return 0;
    }
  }
  
  function ExtractMark(SubjectsArray, SubjectCodeList, OptionSubjectList){
    //SubjectsArray.sort(SortByMark)
    var maxSubject = new Array(0,0,"لا يوجد",0);// = SubjectsArray[0];
    if(SubjectsArray.length>0){
      //if searching in all subjects in the subject array
      if (SubjectCodeList==''){
        //var maxSubject = new Array(0,0,"لا يوجد",0);
        //tempMAX = SubjectsArray[SubjectsArray.length - 1];
        while(SubjectsArray.length != 0){
          maxSubject = SubjectsArray[0].clone();
          SubjectsArray.splice(0,1);
          if(!IsInList(maxSubject.subjectCode, OptionSubjectList)){
            break;
          }
          else {
            maxSubject = new Subject(0, "لا يوجد", 0, 0, "", 0);
            //maxSubject = new Array(0,0,"لا يوجد",0);
          }
        }
      } else {
      //if searching in specific subjects list
        for (var i = 0; i <SubjectsArray.length ; i++){//get Max
          if(SubjectCodeList.indexOf(',' + SubjectsArray[i].subjectCode + ',') >= 0){
            if(!IsInList(SubjectsArray[i].subjectCode, OptionSubjectList)){
              maxSubject = SubjectsArray[i];
              SubjectsArray.splice(i,1);
              return maxSubject
            }
          }
        }
      }
    }
    return maxSubject;
  }
  
  function IsInList(subjectCode, SubjectList){
    var subjectFound = false;
    for(var j = 0; j < SubjectList.length; j++){
      if(parseInt(subjectCode) == Math.abs(parseInt(SubjectList[j].subjectCode)) + 50 || parseInt(subjectCode) == Math.abs(parseInt(SubjectList[j].subjectCode)) - 50){
        subjectFound = true;
        break;
      }
    }
    return subjectFound;
  }
  
  this.CalculateIGBonus = function(Qualification, qualSubjects, AConditionFailed, AlternativeSubjects){
  //Return Bonus
    var Bonus = new Array();
  //Generating advanced and advanced suplementary subjects
    var SALevelS = new Array();
    var SASLevelS = new Array();
    for (var i=0;i<SASLSubjects.length;i++){//AL
      if (ALevelSubjectList.indexOf(','+SASLSubjects[i].subjectCode+',')>=0){
        SALevelS.push(SASLSubjects[i])
      }
    }
    for (var i=0;i<SASLSubjects.length;i++){//ASL
      if (ASLevelSubjectList.indexOf(','+SASLSubjects[i].subjectCode+',')>=0){
        SASLevelS.push(SASLSubjects[i])
      }
    }
    if (Qualification==5){Qualification=6};//التعامل مع كليات الهندسة مساوي للمعاهد العليا الهندسية
    //Generating possible alternatives  

    switch (parseInt(Qualification)){
      case 4://Tebb
        //CPM Chemistry, Physics & Math
        //AL Biology
        var OptionsList = new Array()
        if(AConditionFailed < 100){
          OptionsList = GetOptionsList(SALevelS, SASLevelS, ',107,', ',157,', ',103,105,106,', ',153,155,156,', AConditionFailed)
        }
        //Finding Option IFF there is Biology in the game
        if(OptionsList.length == 0)
        {
            Bonus = -1;
           // analysisList.push(new Array(2, "الطب والصيدلة", "شرط احياء متقدم / تكميلي", "لم يتحقق الشرط", new Array(new Array("لم يتم دراسة المادة", "D")), new Array()));
        }else{
           
          Bonus = GetMaximumOption(OptionsList, AConditionFailed, qualSubjects).clone()
        }  
      break; 
        /********************************************************************************************/ 
      case 6://Handsa
        //CPA , Chemistry, Physics & Accounting
        //AL Math
       
        var OptionsList = new Array()
        if(AConditionFailed < 100){
          OptionsList = GetOptionsList(SALevelS, SASLevelS, ',103,', ',153,', ',115,105,106,', ',165,155,156,', AConditionFailed);
        }
        
        if(OptionsList.length == 0)
        {
            Bonus = -1;
           // analysisList.push(new Array(4, "الطب والصيدلة", "شرط رياضيات متقدم / تكميلي", "لم يتحقق الشرط", new Array(new Array("لم يتم دراسة المادة", "")), new Array()));
        }else{
          Bonus = GetMaximumOption(OptionsList, AConditionFailed, qualSubjects).clone()
        }   
      break;
        /********************************************************************************************/ 
      default://Other Qualifications
        if(AConditionFailed > 100){ //**Check**//
          OptionsList = GetDefaultOptionListBasicMissing(SALevelS, SASLevelS, AConditionFailed, AlternativeSubjects)
        }else{
              
          OptionsList = GetDefaultOptionList(SALevelS, SASLevelS, AConditionFailed)
        }
        
        // ASL
        //alert(test)
        Bonus = GetMaximumOption(OptionsList, AConditionFailed, qualSubjects).clone()  
        //**************************************************************************************//  
      }
    return Bonus ;
  }
  
  function GetDefaultOptionList(SALSubjects, SASLSubjects, AConditionFailed)
  {
    var OptionsList = new Array()
    
    var Option1 = new Array();// 1 AL
    var Option2 = new Array();// 2 AL
    var Option21 = new Array();// 2AL + 1 AL
    var Option22 = new Array();// 2AL + 1 ASL
    var Option3 = new Array();// 1 AL + 1 ASL
    var Option4 = new Array();// 1 AL + 2 ASL
    var Option41 = new Array();// 1AL + 2ASL + 1 AL
    var Option42 = new Array();// 1AL + 2ASL + 1 ASL
    var Option5 = new Array();// 1 ASL
    var Option6 = new Array();// 2 ASL
    var Option7 = new Array();// 3 ASL
    var Option8 = new Array();// 4 ASL
    var Option81 = new Array();// 4 ASL +  1 ASL
    var Option82 = new Array();// 4 ASL + 1 AL
    var Option9 = new Array();// 1ASL  ?
    var Option10 = new Array();// 1 ASL + 1 AL ?
    var Option11 = new Array();
    var Option12 = new Array();
    var Option13 = new Array();// 2ASL + 1 AL ?
    
    //Extra Options
    var t1= SALSubjects.clone(); //copy advanced subjects
    var t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    var temp = new Array();
    var InterchangableOption = 1;// 1 for Normal 8 subjects , -1 for interchangable
    if (AConditionFailed > 0){
      InterchangableOption = -1; // prevent interchanging subjects with advanced as in this case
      //there will be an advanced subject inserted already to complete 8 subjects
    }
    
    //1. 1 AL
    
    //Option1.push(ExtractMark(t1, ''));
    temp = ExtractMark(t1, '', new Array()) //get maxmization option
    temp.subjectCode = InterchangableOption * temp.subjectCode // subject code is negatvie to indeicate interchangable
    Option1.push(temp); // push maximization option
   
    if(Option1[0].subjectMark > 0){
      Option1[0].subjectStatus = InterchangableOption;
      OptionsList.push(Option1);
      ///Maximize Option1
      //2. 1 AL + 1 AL
      Option2.push(Option1[0].clone())
      
      //Option2.push(ExtractMark(t1, ''));
      temp = ExtractMark(t1, '', Option2) //get maxmization option
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option2.push(temp); // push maximization option

      if (Option2[1].subjectMark > 0) {
        Option2[1].subjectStatus = InterchangableOption;
        //OptionsList.push(Option2);
        OptionsList.push(Option2)
        /******Extra*********/
        //Option 21 - 1AL + 1 Al + AL for insertion
        Option21.push(Option2[0].clone())
        Option21.push(Option2[1].clone())
        temp = ExtractMark(t1, '', Option21) //get maxmization option
        temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
        Option21.push(temp);
        if (Option21[2].subjectMark > 0) {
          Option21[2].subjectStatus = -2;
          OptionsList.push(Option21)
        }
        //Option 22- 1AL + 1 AL + ASL for insertion
        Option22.push(Option2[0].clone())
        Option22.push(Option2[1].clone())
        temp = ExtractMark(t2, '', Option22) //get maxmization option
        temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
        Option22.push(temp);
        if (Option22[2].subjectMark > 0) {
          Option22[2].subjectStatus = -2;
          //OptionsList.push(Option3);
          OptionsList.push(Option22)
        }
        /**************/     
      }
      
      //3. 1 AL + 1 ASL
      Option3.push(Option1[0].clone());
      t2= SASLSubjects.clone(); //rest  advanced sublementary subjects
      //Option3.push(new Array(ExtractMark(t2, ''), 'Interchangable'));
      temp = ExtractMark(t2, '', Option3) //get maxmization option
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option3.push(temp); // push maximization option

      if (Option3[1].subjectMark > 0) {
        Option3[1].subjectStatus = InterchangableOption;
        //OptionsList.push(Option3);
        OptionsList.push(Option3)
        ///Maximize Option3
        
        //4. 1 AL + 2 ASL
        Option4.push(Option3[0].clone());
        Option4.push(Option3[1].clone());
        
        //Option4.push(new Array(ExtractMark(t2, ''), 'Interchangable'));
        temp = ExtractMark(t2, '', Option4) //get maxmization option
        temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
        Option4.push(temp); // push maximization option

        if (Option4[2].subjectMark > 0) {
          Option4[2].subjectStatus = InterchangableOption;
          //OptionsList.push(Option4);
          OptionsList.push(Option4)
          /*****Extra*******/
          //Option 41 - 1 AL + 2 ASL + AL for insertion
          Option41.push(Option4[0].clone()) // AL
          Option41.push(Option4[1].clone()) //ASL
          Option41.push(Option4[2].clone()) //ASL
          Option41.push(Option2[1].clone()) // AL
          if (Option41[3].subjectMark > 0) {
            Option41[3].subjectStatus = -2;
            OptionsList.push(Option41)
          }
          //Option 42- 1AL + 2 ASL + 1 ASL for insertion
          Option42.push(Option4[0].clone())// AL
          Option42.push(Option4[1].clone())// ASL
          Option42.push(Option4[2].clone())// ASL
          
          temp = ExtractMark(t2, '', Option42) //get maxmization option
          temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
          Option42.push(temp);
          if (Option42[3].subjectMark > 0) {
            Option42[3].subjectStatus = -2;
            //OptionsList.push(Option3);
            OptionsList.push(Option42)
          }  
          /******End Extra*****/
          
        }
      }
    }
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //5. 1 ASL
    //Option5.push(new Array(ExtractMark(t2, ''), 'Interchangable'));
    temp = ExtractMark(t2, '', new Array()) //get maxmization option
    temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
    Option5.push(temp); // push maximization option

    if (Option5[0].subjectMark > 0) {
      Option5[0].subjectStatus = InterchangableOption;
      //OptionsList.push(Option5);
      OptionsList.push(Option5)
      
      ///Maximize option5
      //6. 2 ASL
      Option6.push(Option5[0].clone());
      
      //Option6.push(new Array(ExtractMark(t2, ''), 'Interchangable'));
      temp = ExtractMark(t2, '', Option6) //get maxmization option
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option6.push(temp); // push maximization option

      if (Option6[1].subjectMark > 0) {
        Option6[1].subjectStatus = InterchangableOption;
        //OptionsList.push(Option6);
        OptionsList.push(Option6)
        
        ///Maximize option6
        //7. 3 ASL
        Option7.push(Option6[0].clone());
        Option7.push(Option6[1].clone());
        
        //Option7.push(new Array(ExtractMark(t2, ''), 'Interchangable'));
        temp = ExtractMark(t2, '', Option7) //get maxmization option
        temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
        Option7.push(temp); // push maximization option

        if (Option7[2].subjectMark > 0) {
          Option7[2].subjectStatus = InterchangableOption;
          //OptionsList.push(Option7);
          OptionsList.push(Option7)
          
          ///Maximize option7
          //8. 4 ASL
          Option8.push(Option7[0].clone());
          Option8.push(Option7[1].clone());
          Option8.push(Option7[2].clone());
          
          //Option8.push(new Array(ExtractMark(t2, ''), 'Interchangable'));
          temp = ExtractMark(t2, '', Option8) //get maxmization option
          temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
          Option8.push(temp); // push maximization option

          if (Option8[3].subjectMark > 0) {
            Option8[3].subjectStatus = InterchangableOption;
            //OptionsList.push(Option8);
            OptionsList.push(Option8)
            /*** Extra *******/ 
            //Option81 ASL + 1 ASL
            Option81.push(Option8[0].clone())
            Option81.push(Option8[1].clone())
            Option81.push(Option8[2].clone())
            Option81.push(Option8[3].clone())
            temp = ExtractMark(t2, '', Option81) //get maxmization option
            temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
            Option81.push(temp); // push extra option
            if (Option81[4].subjectMark > 0) {
                Option81[4].subjectStatus = -2; //set as extra
                OptionsList.push(Option81)
            }

            // Option82 4 ASL + 1 AL
            /*************/
            Option82.push(Option8[0].clone())
            Option82.push(Option8[1].clone())
            Option82.push(Option8[2].clone())
            Option82.push(Option8[3].clone())
            temp = ExtractMark(t2, '', Option82) //get maxmization option
            temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
            Option82.push(temp); // push extra option
            if (Option82[4].subjectMark > 0) {
                Option82[4].subjectStatus = -2; // extra
                OptionsList.push(Option82)
            }
            
            
          }
        }
        
        //10. 1 ASL + 1 ASL + 1 AL
        Option13.push(Option6[0].clone())
        Option13.push(Option6[1].clone())
        
        temp = ExtractMark(t1, '', Option13);
        temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
        Option13.push(temp); // push maximization option

        if (Option13[2].subjectMark > 0) {
          Option13[2].subjectStatus = InterchangableOption;
          OptionsList.push(Option13);
        }
      }
    }
    
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    // 1 ASL
    Option9.push(ExtractMark(t2, '', new Array())) //get maxmization option

    if (Option9[0].subjectMark > 0) {
      ///Maximize option5
      //9. 1 ASL + 1 AL
      Option10.push(Option9[0].clone());
      
      temp = ExtractMark(t1, '', Option10);
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option10.push(temp); // push maximization option

      if (Option10[1].subjectMark > 0) {
        Option10[1].subjectStatus = InterchangableOption;
        OptionsList.push(Option10)
      }
    }
    return OptionsList;
  }
  
  
  /*******Evaluate Conditions IG function**********/
//add a condition failed to declaration
  function GetOptionsList(SALSubjects, SASLSubjects, ALSubjectCode, ASLSubjectCode, SelectionALSubjectList, SelectionASLSubjectList, AConditionFailed)
  {
    var OptionsList = new Array()
        
    var Option1 = new Array(); // 1 AL
    var Option2 = new Array(); // 2 AL   [[ + 1 AL / + 1 ASL]]
    var Option21 = new Array(); ///2 AL + 1 AL
    var Option22 = new Array(); //2 AL + 1 ASL
    
    var Option3 = new Array(); // 1 AL +  1 ASL
    var Option4 = new Array(); // 1 AL + 2 ASL [[ + 1 AL / + 1 ASL]]
    var Option41 = new Array(); // 1 AL + 2ASL + 1 AL
    var Option42 = new Array(); // 1 AL + 2ASL + 1 ASL
    
    var Option5 = new Array(); // 1 ASL +  1 AL
    var Option6 = new Array(); // 1 ASL + 1 ASL(CPM)
    var Option7 = new Array(); // 1 ASL + 1 AL(CPM) + 1 ASL [[ + 1 AL / + 1 ASL]]
    var Option8 = new Array();  // 1 ASL + 1 ASL(CPM) + 1AL [[ + 1 AL / + 1 ASL]]
    var Option9 = new Array();// 1 ASL + 1 ASL(CPM) + 2ASL
    var Option91 = new Array(); // 4 ASL + 1 AL
    var Option92 = new Array(); // 4 ASL + 1 ASL
    
    var Option10 = new Array(); // 1 ASL + CPM ASL + 1 AL
    var Option11 = new Array();// 1 ASL + 1 AL + ASL(CMP) [[ + 1 AL / + 1 ASL]]
    var Option111 = new Array();// 2 ASL + 1 AL + 1 AL
    var Option112 = new Array();// 2 ASL + 1 AL + 1 ASL
    
    var Option12 = new Array();// 1 ASL + 1 ASL + CMP AL [[ + 1 AL / + 1 ASL]]
    var Option121 = new Array(); // 2 ASL + AL + 1 AL
    var Option122 = new Array(); // 2 ASL + AL + 1 ASL
    
    
    
    /*****************************************************************************************/
    var t1= SALSubjects.clone(); //copy advanced subjects
    var t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    var temp = new Array();
    var InterchangableOption = 1;// 1 for Normal 8 subjects , -1 for interchangable
    if (AConditionFailed > 0){
      InterchangableOption = -1;
    }
    //1. 1 AL
    Option1.push(ExtractMark(t1, ALSubjectCode, new Array()));
    if (Option1[0].subjectMark > 0) { // Option must have found a AL Biology to be pushed into options list
      Option1[0].subjectStatus = 0;
      if(AConditionFailed == 0){
        OptionsList.push(Option1);
      }
      
      //************************
      ///maximize option1
      ///2. 1 AL + other 1 AL
      Option2.push(Option1[0].clone());
      temp = ExtractMark(t1, '', Option2) //get maxmization option
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      
      Option2.push(temp); // push maximization option
      // Option must have found a AL Biology to be pushed into options list
      //also have the other AL to be pushed, otherwise, it will be the same as option1
      if (Option2[1].subjectMark > 0) {
        temp.subjectStatus = InterchangableOption;
        OptionsList.push(Option2);
        /*******Extra*******/
        //2AL + 1 AL
        Option21.push(Option2[0].clone())
        Option21.push(Option2[1].clone())
        temp = ExtractMark(t1, '', Option21) //get maxmization option
        temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
        Option21.push(temp); // push maximization option
        if (Option21[2].subjectMark > 0) {
            temp.subjectStatus = -2;
            OptionsList.push(Option21);
        }
        // 2 AL + 1 ASL
        Option22.push(Option2[0].clone())
        Option22.push(Option2[1].clone())
        temp = ExtractMark(t2, '', Option22) //get maxmization option
        temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
        Option22.push(temp); // push maximization option
        if (Option22[2].subjectMark > 0) {
            temp.subjectStatus = -2;
            OptionsList.push(Option22);
        }
      }
      
      ///3. 1 AL + other 1 ASL
      Option3.push(Option1[0].clone());
      
      temp = ExtractMark(t2, '', Option3) //get maxmization option
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option3.push(temp); // push maximization option
      
      // Option must have found a AL Biology to be pushed into options list
      //also have the other ASL to be pushed, otherwise, it will be the same as option1
      if (Option3[1].subjectMark > 0) {
        temp.subjectStatus = InterchangableOption;
        OptionsList.push(Option3);
        ///Maximize option3
        ///4. 1 AL + other 2 ASL
        Option4.push(Option3[0].clone());
        Option4.push(Option3[1].clone());
        
        temp = ExtractMark(t2, '', Option4) //get maxmization option
        temp.subjectCode = InterchangableOption * temp.subjectCode 
        Option4.push(temp); // push maximization option
        
        // Option must have found a AL Biology to be pushed into options list
        //also have the other 2 ASL to be pushed not 1 ASL, otherwise, it will be the same as option3
        if (Option4[2].subjectMark > 0) {
            temp.subjectStatus = InterchangableOption;
            OptionsList.push(Option4)
          //***********EXtra ******888
            Option41.push(Option4[0].clone());
            Option41.push(Option4[1].clone());
            Option41.push(Option4[2].clone());
            temp = ExtractMark(t1, '', Option41) //get maxmization option
            temp.subjectCode = InterchangableOption * temp.subjectCode 
            Option41.push(temp); // push maximization option
            if (Option41[3].subjectMark > 0) {
                temp.subjectStatus = -2;
                OptionsList.push(Option41)
            }
            Option42.push(Option4[0].clone());
            Option42.push(Option4[1].clone());
            Option42.push(Option4[2].clone());
            temp = ExtractMark(t2, '', Option42) //get maxmization option
            temp.subjectCode = InterchangableOption * temp.subjectCode 
            Option42.push(temp); // push maximization option
            if (Option42[3].subjectMark > 0) {
                temp.subjectStatus = -2;
                OptionsList.push(Option42)
            }
          //*************//
          
        }
      }
      
      //************************
      
    }
    
     /**************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //5. Biology ASL + Other from CPM (AL)
    Option5.push(ExtractMark(t2, ASLSubjectCode, new Array()));
    Option5.push(ExtractMark(t1, SelectionALSubjectList, Option5));
    // Option must have found a ASL Biology and one of CPM (AL) to be pushed into options list
    if (Option5[0].subjectMark > 0 && Option5[1].subjectMark > 0) {
      Option5[0].subjectStatus = 0;
      Option5[1].subjectStatus = 0;
      //if ! a conditionFailed
      if(AConditionFailed == 0){OptionsList.push(Option5);}
        
      //Maximize option5
        //ASL + AL CPM + Other AL
        var Option5_1 = new Array();
        Option5_1.push(Option5[0].clone());
        Option5_1.push(Option5[1].clone());
        Option5_1.push(ExtractMark(t1, '', Option5_1));
        if (Option5_1[2].subjectMark > 0 ){Option5_1[2].subjectStatus=-2;OptionsList.push(Option5_1);}
     
      //Maximize option5
      ///6. Biology ASL + 1 Other from CPM (AL) + 1 ASL 
      Option7.push(Option5[0].clone());
      Option7.push(Option5[1].clone());
      temp = ExtractMark(t2, '', Option7)
      temp.subjectStatus = InterchangableOption.toString();
      Option7.push(temp);
      
      // Option must have found a ASL Biology and one of CPM (AL) to be pushed into options list
      //also it must have the other ASL to be pushed, otherwise, it will be the same as option5
      if (Option7[1].subjectMark > 0 && Option7[2].subjectMark) {
        temp.subjectCode = InterchangableOption
        OptionsList.push(Option7);
      }
    }
    /****************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //7. Biology ASL + Other from CPM (ASL)
    Option6.push(ExtractMark(t2, ASLSubjectCode, new Array()));
    Option6.push(ExtractMark(t2, SelectionASLSubjectList, Option6));
    
    // Option must have found a ASL Biology and one of CPM (ASL) to be pushed into options list
    if (Option6[0].subjectMark > 0 && Option6[1].subjectMark > 0) {
      Option6[0].subjectStatus = 0;
      Option6[1].subjectStatus = 0;
      //if ! a condition Failed
      //?
      //if condition is failed then no need for that option as ASL can't be alone in the option
      if(AConditionFailed ==0){
        OptionsList.push(Option6);
      }
      
      ///maximize option6
      //8. Biology ASL + Other from CPM (ASL) + 1 AL
      Option10.push(Option6[0].clone());
      Option10.push(Option6[1].clone());
      temp = ExtractMark(t1, '', Option10)
      temp.subjectCode = InterchangableOption * temp.subjectCode
      Option10.push(temp);

      // Option must have found a ASL Biology and one of CPM (ASL) to be pushed into options list
      //also it must have the other AL to be pushed, otherwise, it will be the same as option6
      if (Option10[1].subjectMark > 0 && Option10[2].subjectMark > 0) {
        temp.subjectStatus = InterchangableOption;
        //OptionsList.push(Option10);
        OptionsList.push(Option10)
      }
      
      //9. Biology ASL + Other from CPM (ASL) + 1 ASL
      Option8.push(Option6[0].clone());
      Option8.push(Option6[1].clone());
      temp = ExtractMark(t2,'', Option8);
      temp.subjectCode = InterchangableOption * temp.subjectCode
      Option8.push(temp);
      
      // Option must have found a ASL Biology and one of CPM to be pushed into options list
      //also it must have the 2nd other ASL to be pushed, otherwise, it will be the same as option6
      if (Option8[1].subjectMark > 0 && Option8[2].subjectMark > 0) {
        temp.subjectStatus = InterchangableOption;
        //OptionsList.push(Option8);
        OptionsList.push(Option8);
        
        ///Maximize option8
        //10. Biology ASL + Other from CPM (ASL) + 2 ASL
        Option9.push(Option8[0].clone());
        Option9.push(Option8[1].clone());
        Option9.push(Option8[2].clone());
        
        temp = ExtractMark(t2, '', Option9)
        temp.subjectCode = InterchangableOption * temp.subjectCode
        Option9.push(temp);
        
        // Option must have found a ASL Biology and one of CPM to be pushed into options list
        //also it must have the 3rd other ASL to be pushed, otherwise, it will be the same as option8
        if (Option9[3].subjectMark > 0) {
          temp.subjectStatus = InterchangableOption;
          OptionsList.push(Option9);
           //***********EXtra ******888
            Option91.push(Option9[0].clone());
            Option91.push(Option9[1].clone());
            Option91.push(Option9[2].clone());
            Option91.push(Option9[3].clone());
            temp = ExtractMark(t1, '', Option91) //get maxmization option
            temp.subjectCode = InterchangableOption * temp.subjectCode 
            Option91.push(temp); // push maximization option
            if (Option91[4].subjectMark > 0) {
                temp.subjectStatus = -2;
                OptionsList.push(Option91)
            }
            Option92.push(Option9[0].clone());
            Option92.push(Option9[1].clone());
            Option92.push(Option9[2].clone());
            Option92.push(Option9[3].clone());
            temp = ExtractMark(t2, '', Option92) //get maxmization option
            temp.subjectCode = InterchangableOption * temp.subjectCode 
            Option92.push(temp); // push maximization option
            if (Option92[4].subjectMark > 0) {
                temp.subjectStatus = -2;
                OptionsList.push(Option92)
            }
          //*************//
          
          
        }
      }
    }
    /***************************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //11. Obligatory ASL + Other 1 AL + other CPM/CPA ASL
    Option11.push(ExtractMark(t2, ASLSubjectCode, new Array()));
    Option11.push(ExtractMark(t1, '', Option11))
    
    temp = ExtractMark(t2, SelectionASLSubjectList, Option11)
//    temp.subjectCode = InterchangableOption * temp.subjectCode
    Option11.push(temp);
    //Option11.push(ExtractMark(t2, SelectionASLSubjectList, Option11))
    if (Option11[0].subjectMark > 0 && Option11[1].subjectMark > 0 && Option11[2].subjectMark > 0) {
      Option11[0].subjectStatus = 0;
      Option11[1].subjectStatus = InterchangableOption;
      Option11[1].subjectCode = InterchangableOption * temp.subjectCode 
      Option11[2].subjectStatus = 0;
      OptionsList.push(Option11);
    }
    
    
    /***************************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //12. Obligatory ASL + Other 1 ASL + other CPM/CPA AL
    Option12.push(ExtractMark(t2, ASLSubjectCode, new Array()));
    Option12.push(ExtractMark(t2, '', Option12))
    
    temp = ExtractMark(t1, SelectionALSubjectList, Option12)
    temp.subjectCode = InterchangableOption * temp.subjectCode
    Option12.push(temp);
    //Option11.push(ExtractMark(t2, SelectionASLSubjectList, Option11))
    if (Option12[0].subjectMark > 0 && Option12[1].subjectMark > 0 && Option12[2].subjectMark > 0) {
      Option12[0].subjectStatus = 0;
      Option12[1].subjectStatus = InterchangableOption;
      temp.subjectStatus = 0;
      OptionsList.push(Option12);
      
       //***********EXtra ******888
            Option121.push(Option12[0].clone());
            Option121.push(Option12[1].clone());
            Option121.push(Option12[2].clone());
            temp = ExtractMark(t1, '', Option121) //get maxmization option
            temp.subjectCode = InterchangableOption * temp.subjectCode 
            Option121.push(temp); // push maximization option
            if (Option121[3].subjectMark > 0) {
                temp.subjectStatus = -2;
                OptionsList.push(Option121)
            }
            Option122.push(Option12[0].clone());
            Option122.push(Option12[1].clone());
            Option122.push(Option12[2].clone());
            temp = ExtractMark(t2, '', Option122) //get maxmization option
            temp.subjectCode = InterchangableOption * temp.subjectCode 
            Option122.push(temp); // push maximization option
            if (Option122[3].subjectMark > 0) {
                temp.subjectStatus = -2;
                OptionsList.push(Option122)
            }
          //*************//
      
      
    }
    
    return OptionsList;
  }
  
  /////////Not Possible///////GetOptionsList in case of the condition is failed because of basic subject missed/////////
  function GetOptionsListBasicMissing(SALSubjects, SASLSubjects, ALSubjectCode, ASLSubjectCode, SelectionALSubjectList, SelectionASLSubjectList, AConditionFailed)
  {
    var OptionsList = new Array()
        
    var Option1 = new Array();
    var Option2 = new Array();
    var Option3 = new Array();
    var Option4 = new Array();
    var Option5 = new Array();
    var Option6 = new Array();
    var Option7 = new Array();
    var Option8 = new Array();
    var Option9 = new Array();
    var Option10 = new Array();
    var Option11 = new Array();
    var Option12 = new Array();
    
    /*****************************************************************************************/
    var t1= SALSubjects.clone(); //copy advanced subjects
    var t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    var temp = new Array();
    var InterchangableOption = 1;// 1 for Normal 8 subjects , -1 for interchangable
    if (AConditionFailed > 0){
      InterchangableOption = -1;
    }
    //1. 1 AL
    Option1.push(ExtractMark(t1, ALSubjectCode, new Array()));
    if (Option1[0].subjectMark > 0) { // Option must have found a AL Biology to be pushed into options list
      if(AConditionFailed == 0){
        OptionsList.push(Option1);
      }
      
      //************************
      ///maximize option1
      ///2. 1 AL + other 1 AL
      Option2.push(Option1[0].clone());
      temp = ExtractMark(t1, '', Option2) //get maxmization option
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option2.push(temp); // push maximization option
      
      // Option must have found a AL Biology to be pushed into options list
      //also have the other AL to be pushed, otherwise, it will be the same as option1
      if (Option2[1].subjectMark > 0) {
        OptionsList.push(Option2);
      }
      ///3. 1 AL + other 1 ASL
      Option3.push(Option1[0].clone());
      temp = ExtractMark(t2, '', Option3) //get maxmization option
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option3.push(temp); // push maximization option
      
      // Option must have found a AL Biology to be pushed into options list
      //also have the other ASL to be pushed, otherwise, it will be the same as option1
      if (Option3[1].subjectMark > 0) {
        OptionsList.push(Option3);
        ///Maximize option3
        ///4. 1 AL + other 2 ASL
        Option4.push(Option3[0].clone());
        Option4.push(Option3[1].clone());
        
        temp = ExtractMark(t2, '', Option4) //get maxmization option
        temp.subjectCode = InterchangableOption * temp.subjectCode 
        Option4.push(temp); // push maximization option
        
        // Option must have found a AL Biology to be pushed into options list
        //also have the other 2 ASL to be pushed not 1 ASL, otherwise, it will be the same as option3
        if (Option4[2].subjectMark > 0) {
            OptionsList.push(Option4)
        }
      }
      
      //************************
      
    }
    
     /**************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //5. Biology ASL + Other from CPM (AL)
    Option5.push(ExtractMark(t2, ASLSubjectCode, new Array()));
    Option5.push(ExtractMark(t1, SelectionALSubjectList, Option5));
    // Option must have found a ASL Biology and one of CPM (AL) to be pushed into options list
    if (Option5[0].subjectMark > 0 && Option5[1].subjectMark > 0) {
    //if ! a conditionFailed
      if(AConditionFailed == 0){
        OptionsList.push(Option5);
      }
      //Maximize option5
         /******Maximize*********/
      ///6. Biology ASL + 1 Other from CPM (AL) + 1 ASL 
      Option7.push(Option5[0].clone());
      Option7.push(Option5[1].clone());
      temp = ExtractMark(t2, '', Option7)
      temp.subjectCode = InterchangableOption * temp.subjectCode
      Option7.push(temp);
      
      // Option must have found a ASL Biology and one of CPM (AL) to be pushed into options list
      //also it must have the other ASL to be pushed, otherwise, it will be the same as option5
      if (Option7[1].subjectMark > 0 && Option7[2].subjectMark) {
        //OptionsList.push(Option7);
        OptionsList.push(Option7);
     }
    }
    /****************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //7. Biology ASL + Other from CPM (ASL)
    Option6.push(ExtractMark(t2, ASLSubjectCode, new Array()));
    Option6.push(ExtractMark(t2, SelectionASLSubjectList, Option6));
    // Option must have found a ASL Biology and one of CPM (ASL) to be pushed into options list
    if (Option6[0].subjectMark > 0 && Option6[1].subjectMark > 0) {
      //if ! a condition Failed

      //if condition is failed then no need for that option as ASL can't be alone in the option
      if(AConditionFailed ==0){
        OptionsList.push(Option6);
      }
      
      ///maximize option6
      //8. Biology ASL + Other from CPM (ASL) + 1 AL
      Option10.push(Option6[0].clone());
      Option10.push(Option6[1].clone());
      temp = ExtractMark(t1, '', Option10)
      temp.subjectCode = InterchangableOption * temp.subjectCode
      Option10.push(temp);

      // Option must have found a ASL Biology and one of CPM (ASL) to be pushed into options list
      //also it must have the other AL to be pushed, otherwise, it will be the same as option6
      if (Option10[1].subjectMark > 0 && Option10[2].subjectMark > 0) {
        OptionsList.push(Option10)
      }
      
      //9. Biology ASL + Other from CPM (ASL) + 1 ASL
      Option8.push(Option6[0].clone());
      Option8.push(Option6[1].clone());
      temp = ExtractMark(t2,'', Option8);
      temp.subjectCode = InterchangableOption * temp.subjectCode
      Option8.push(temp);
      
      // Option must have found a ASL Biology and one of CPM to be pushed into options list
      //also it must have the 2nd other ASL to be pushed, otherwise, it will be the same as option6
      if (Option8[1].subjectMark > 0 && Option8[2].subjectMark > 0) {
        //OptionsList.push(Option8);
        OptionsList.push(Option8);
        
        ///Maximize option8
        //10. Biology ASL + Other from CPM (ASL) + 2 ASL
        Option9.push(Option8[0].clone());
        Option9.push(Option8[1].clone());
        Option9.push(Option8[2].clone());
        temp = ExtractMark(t2, '', Option9)
        temp.subjectCode = InterchangableOption * temp.subjectCode
        Option9.push(temp);
        
        // Option must have found a ASL Biology and one of CPM to be pushed into options list
        //also it must have the 3rd other ASL to be pushed, otherwise, it will be the same as option8
        if (Option9[3].subjectMark > 0) {
          OptionsList.push(Option9);
        }
      }
    }
    /***************************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //11. Obligatory ASL + Other 1 AL + other CPM/CPA ASL
    Option11.push(ExtractMark(t2, ASLSubjectCode, new Array()));
    Option11.push(ExtractMark(t1, '', Option11))
    
    temp = ExtractMark(t2, SelectionASLSubjectList, Option11)
    temp.subjectCode = InterchangableOption * temp.subjectCode
    Option11.push(temp);
    //Option11.push(ExtractMark(t2, SelectionASLSubjectList, Option11))
    if (Option11[0].subjectMark > 0 && Option11[1].subjectMark > 0 && Option11[2].subjectMark > 0) {
      OptionsList.push(Option11);
    }
    
    
    /***************************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //12. Obligatory ASL + Other 1 ASL + other CPM/CPA AL
    Option12.push(ExtractMark(t2, ASLSubjectCode, new Array()));
    Option12.push(ExtractMark(t2, '', Option12))
    
    temp = ExtractMark(t1, SelectionALSubjectList, Option12)
    temp.subjectCode = InterchangableOption * temp.subjectCode
    Option12.push(temp);
    //Option11.push(ExtractMark(t2, SelectionASLSubjectList, Option11))
    if (Option12[0].subjectMark > 0 && Option12[1].subjectMark > 0 && Option12[2].subjectMark > 0) {
      OptionsList.push(Option12);
    }
    
    return OptionsList;
  }
  
  //?????????????????????????????????Not Possible????????????????????????????????????//
  function GetDefaultOptionListBasicMissing(SALSubjects, SASLSubjects, AConditionFailed, ReplacementSubjects)
  {
    var OptionsList = new Array()
        
    var Option1 = new Array();
    var Option2 = new Array();
    var Option3 = new Array();
    var Option4 = new Array();
    var Option5 = new Array();
    var Option6 = new Array();
    var Option7 = new Array();
    var Option8 = new Array();
    var Option9 = new Array();
    var Option10 = new Array();
    var Option11 = new Array();
    var Option12 = new Array();
    var Option13 = new Array();
    var Option14 = new Array();
    var Option15 = new Array();
    var Option16 = new Array();
    var Option17 = new Array();
    var Option18 = new Array();
    var Option19 = new Array();
    var Option20 = new Array();
    var Option21 = new Array();
    
    
    var t1= SALSubjects.clone(); //copy advanced subjects
    var t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    var ReplacementALSubjects = new Array();
    for(var i = 0; i < ReplacementSubjects.length; i++){
      ReplacementALSubjects.push(parseInt(ReplacementSubjects[i]) + 50);
    }
    var RAL = "," + ReplacementALSubjects.join(",") + ",";
    
    var ReplacementASLSubjects = new Array();
    for(var i = 0; i < ReplacementSubjects.length; i++){
      ReplacementASLSubjects.push(parseInt(ReplacementSubjects[i]) + 100);
    }
    var RASL = "," + ReplacementASLSubjects.join(",") + ",";
    
    var temp = new Array();
    var InterchangableOption = 1;// 1 for Normal 8 subjects , -1 for interchangable
    if (AConditionFailed > 0){
      InterchangableOption = -1;
    }
    ////////////////////////////////////////////RAL/////////////////////////////////////////////////
    //1. Replacement 1 AL
    temp = ExtractMark(t1, RAL, new Array()) //get maxmization option
    temp.subjectCode = InterchangableOption * temp.subjectCode // subject code is negatvie to indeicate interchangable
    Option1.push(temp); // push maximization option
    
    if(Option1[0].subjectMark > 0){
      Option1[0].subjectStatus = InterchangableOption;
      OptionsList.push(Option1);
      
      ///Maximize Option1
      //2. Replacement 1 AL + 1 AL
      Option2.push(Option1[0].clone())
      Option2.push(ExtractMark(t1, '', Option2)); // push maximization option
      
      if(Option2[1].subjectMark > 0){
        Option2[1].subjectStatus = InterchangableOption;
        OptionsList.push(Option2)
                /******Maximize*********/
        var Option2_1 = new Array();
        var Option2_2 = new Array();
        Option2_1.push(Option2[0].clone())
        Option2_1.push(Option2[1].clone())
        Option2_2.push(Option2[0].clone())
        Option2_2.push(Option2[1].clone())
        temp = ExtractMark(t1, '', Option2_1) //get maxmization option
        temp1 = ExtractMark(t2, '', Option2_2) //get maxmization option
        Option2_1.push(temp);
        Option2_2.push(temp1);
        if (Option2_1[2].subjectMark > 0) {Option2_1[2].subjectStatus=InterchangableOption;OptionsList.push(Option2_1);}
        if (Option2_2[2].subjectMark > 0) {Option2_2[2].subjectStatus=InterchangableOption;OptionsList.push(Option2_2);}
        /******Maximize*********/
      }
      
      //3. Replacement 1 AL + 1 ASL
      Option3.push(Option1[0].clone());
      Option3.push(ExtractMark(t2, '', Option3)); // push maximization option
      
      if(Option3[1].subjectMark > 0){
        Option3[1].subjectStatus = InterchangableOption;
        OptionsList.push(Option3)
        
        ///Maximize Option3
        
        //4. Replacement 1 AL + 2 ASL
        Option4.push(Option3[0].clone());
        Option4.push(Option3[1].clone());
        Option4.push(ExtractMark(t2, '', Option4)); // push maximization option

        if (Option4[2].subjectMark > 0) {
          Option4[2].subjectStatus = InterchangableOption;
          OptionsList.push(Option4)
            /******Maximize*********/
            var Option4_1 = new Array();
            var Option4_2 = new Array();
            Option4_1.push(Option4[0].clone())
            Option4_1.push(Option4[1].clone())
            Option4_1.push(Option4[2].clone())
            Option4_2.push(Option4[0].clone())
            Option4_2.push(Option4[1].clone())
            Option4_2.push(Option4[2].clone())
            temp = ExtractMark(t1, '', Option4_1) //get maxmization option
            temp1 = ExtractMark(t2, '', Option4_2) //get maxmization option
            temp2 = ExtractMark(t2, '', Option4_2) //get maxmization option
            Option4_1.push(temp);
            Option4_2.push(temp1);
            Option4_2.push(temp2);
            if (Option4_1[3].subjectMark > 0) {Option4_1[3].subjectStatus=InterchangableOption;OptionsList.push(Option4_1);}
            if (Option4_2[3].subjectMark > 0) {Option4_2[3].subjectStatus=InterchangableOption;Option4_2[4].subjectStatus=InterchangableOption;OptionsList.push(Option4_2);}
            /******Maximize*********/
        }
      }
    }
    /**********************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //Option14
    // ASL + Replacement AL
    Option14.push(ExtractMark(t2, '', new Array())); // push maximization option
    if (Option14[0].subjectMark > 0) { 
      Option14[0].subjectStatus = InterchangableOption;    
      ///Maximize Option14
      Option15.push(Option14[0].clone())
      
      temp = ExtractMark(t1, RAL, Option15) //get maxmization option
      temp.subjectCode= InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option15.push(temp); // push maximization option

      if (Option15[1].subjectMark > 0) {
        Option15[1].subjectStatus = InterchangableOption;
        OptionsList.push(Option15)
               /******Maximize*********1 asl + 2 AL*/ 
        var Option15_1 = new Array();
        Option15_1.push(Option15[0].clone())
        Option15_1.push(Option15[1].clone())
        temp = ExtractMark(t1, '', Option15_1) //get maxmization option
        Option15_1.push(temp);
        if (Option15_1[2].subjectMark > 0) {OptionsList.push(Option15_1);}
      }
      
      Option16.push(Option14[0].clone())
      Option16.push(ExtractMark(t2, '', Option16));
      
      temp = ExtractMark(t1, RAL, Option16) //get maxmization option
      temp.subjectCode= InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option16.push(temp); // push maximization option

      if (Option16[1].subjectMark > 0 && Option16[2].subjectMark > 0) {
        Option16[1].subjectStatus = InterchangableOption;
        Option16[2].subjectStatus = InterchangableOption;
        OptionsList.push(Option16)
      }
    }

    ////////////////////////////////////////////RASL/////////////////////////////////////////////////
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //5. Replacement 1 ASL
    temp = ExtractMark(t2, RASL, new Array()) //get maxmization option
    temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
    Option5.push(temp); // push maximization option

    if (Option5[0].subjectMark > 0) {
      Option5[0].subjectStatus = InterchangableOption;
      OptionsList.push(Option5)
      
      ///Maximize option5
      //6. Replacement ASL + 1 ASL
      Option6.push(Option5[0].clone());
      Option6.push(ExtractMark(t2, '', Option6)); // push maximization option

      if (Option6[1].subjectMark > 0) {
        Option6[1].subjectStatus = InterchangableOption;
        //OptionsList.push(Option6);
        OptionsList.push(Option6)
        
        ///Maximize option6
        //7. Replacement ASL + 2 ASL
        Option7.push(Option6[0].clone());
        Option7.push(Option6[1].clone());
        Option7.push(ExtractMark(t2, '', Option7)); // push maximization option

        if (Option7[2].subjectMark > 0) {
          Option7[2].subjectStatus = InterchangableOption;
          OptionsList.push(Option7)
          
          ///Maximize option7
          //8. Replacement ASL + 3 ASL
          Option8.push(Option7[0].clone());
          Option8.push(Option7[1].clone());
          Option8.push(Option7[2].clone());
          Option8.push(ExtractMark(t2, '', Option8)); // push maximization option
          if (Option8[3].subjectMark > 0) {
            Option8[3].subjectStatus = InterchangableOption;  
            OptionsList.push(Option8)
            /******Maximize*********1 asl + 1 AL+ 2 ASL*/ 
            var Option8_1 = new Array();
            Option8_1.push(Option8[0].clone())
            Option8_1.push(Option8[1].clone())
            Option8_1.push(Option8[2].clone())
            temp =ExtractMark(t2, '', Option8_1) //get maxmization option
            Option8_1.push(temp);
            if (Option8_1[3].subjectMark > 0) {OptionsList.push(Option8_1);}
            /******Maximize*********/
          }
        }
        
        //Replacement 1 ASL + 1 ASL + AL
        Option20.push(Option6[0].clone());
        Option20.push(Option6[1].clone());
        Option20.push(ExtractMark(t1, '', Option20))
        if (Option20[2].subjectMark > 0) {
          Option20[2].subjectStatus = InterchangableOption;
          OptionsList.push(Option20);
          
        /******Maximize*********1 asl + 1 AL+ 2 ASL*/ 
        var Option20_1 = new Array();
        Option20_1.push(Option20[0].clone())
        Option20_1.push(Option20[1].clone())
        Option20_1.push(Option20[2].clone())
        temp =ExtractMark(t2, '', Option20_1) //get maxmization option
        Option20_1.push(temp);
        Option20_1[3].subjectStatus  = InterchangableOption
        if (Option20_1[3].subjectMark > 0) {OptionsList.push(Option20_1);}
        /******Maximize*********/
 
        }
      }
    }
    /*********************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    //Replacement 1 ASL
    temp = ExtractMark(t2, RASL, new Array()) //get maxmization option
    temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
    Option9.push(temp); // push maximization option

    if (Option9[0].subjectMark > 0) {
      Option9[0].subjectStatus = InterchangableOption;
      ///Maximize option9
      //9. Replacement 1 ASL + 1 AL
      Option10.push(Option9[0].clone());
      Option10.push(ExtractMark(t1, '', Option10)); // push maximization option

      if (Option10[1].subjectMark > 0) {
        Option10[1].subjectStatus = InterchangableOption;
        OptionsList.push(Option10)
        
       
            /******Maximize*********/
            var Option10_1 = new Array();
            var Option10_2 = new Array();
            Option10_1.push(Option10[0].clone())
            Option10_1.push(Option10[1].clone())
            Option10_2.push(Option10[0].clone())
            Option10_2.push(Option10[1].clone())

            temp = ExtractMark(t1, '', Option10_1) //get maxmization option
            temp1 = ExtractMark(t2, '', Option10_2) //get maxmization option
            temp2 = ExtractMark(t2, '', Option10_2) //get maxmization option
            Option10_1.push(temp);
            Option10_2.push(temp1);
            Option10_2.push(temp2);
            if (Option10_1[2].subjectMark > 0) {Option10_1[2].subjectStatus=InterchangableOption;OptionsList.push(Option10_1);}
            if (Option10_2[2].subjectMark > 0) {Option10_2[2].subjectStatus=InterchangableOption;Option10_2[3].subjectStatus=InterchangableOption;OptionsList.push(Option10_2);}
            /******Maximize*********/
        
      }
    }
    /************************************************************************************/
    t1= SALSubjects.clone(); //copy advanced subjects
    t2= SASLSubjects.clone(); //copy advanced sublementary subjects
    
    Option17.push(ExtractMark(t1, '', new Array())); // push maximization option
    if (Option17[0].subjectMark > 0) {
      Option17[0].subjectStatus = InterchangableOption;
      ///Maximize option9
      //9. 1 AL + Replacement 1 ASL
      Option18.push(Option17[0].clone());
      //Replacement 1 ASL
      temp = ExtractMark(t2, RASL, Option18) //get maxmization option
      temp.subjectCode = InterchangableOption * temp.subjectCode // sbject code is negatvie to indeicate interchangable
      Option18.push(temp); // push maximization option

      if (Option18[1].subjectMark > 0) {
        Option18[1].subjectStatus = InterchangableOption;
        OptionsList.push(Option18)
        
        // 1 AL + Replacement 1 ASL + ASL
        Option19.push(Option18[0].clone());
        Option19.push(Option18[1].clone());
        Option19.push(ExtractMark(t2, '', Option19))
        if (Option19[2].subjectMark > 0) {
          Option19[2].subjectStatus = InterchangableOption;
          OptionsList.push(Option19)
            /******Maximize*********1 asl + 1 AL+ 2 ASL*/ 
            var Option19_1 = new Array();
            Option19_1.push(Option19[0].clone())
            Option19_1.push(Option19[1].clone())
            Option19_1.push(Option19[2].clone())
            temp =ExtractMark(t2, '', Option19_1) //get maxmization option
            Option19_1.push(temp);
            if (Option19_1[3].subjectMark > 0) {Option19_1[3].subjectStatus=InterchangableOption;OptionsList.push(Option19_1);}
            /******Maximize*********/
        }
      }
    }
    /************************************************************************************/
    return OptionsList;
  }
  
}