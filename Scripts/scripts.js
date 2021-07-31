
function CreateBookAppointmentObject() {
    var BookAppointment = {
        SlotId: 0,
        BranchId: $('#BranchId').val(),
        WorkingDayId: $('#WorkingDayId').val()
    }
    return BookAppointment;
}

function CreateRequesterObject(docType) {
    var requester = {
        FirstName: $('#FirstName').val(),
        FatherName: $('#FatherName').val(),
        GrandFatherName: $('#GrandFatherName').val(),
        FamilyName: $('#FamilyName').val(),
        Email: $('#Email').val(),
        EmailConfirm: $('#EmailConfirm').val(),
        Mobile1: $('#Mobile1').val(),
        Mobile2: $('#Mobile2').val(),
        GenderId: $('#GenderId').val(),
        NID: $('#NID').val(),
        MotherFullName: $('#MotherFullName').val(),
        PhoneHome: $('#PhoneHome').val(),
        BirthDate: $('#BirthDate').val(),
        ReligionId: $('#ReligionId').val(),
        ResidencyAddress: {
            FlatNumber: $('#ResidencyAddress_FlatNumber').val(),
            FloorNumber: $('#ResidencyAddress_FloorNumber').val(),
            BuildingNumber: $('#ResidencyAddress_BuildingNumber').val(),
            StreetName: $('#ResidencyAddress_StreetName').val(),
            DistrictName: $('#ResidencyAddress_DistrictName').val(),
            GovernorateId: $('#ResidencyAddress_GovernorateId').val(),
            PoliceDepartmentId: $('#ResidencyAddress_PoliceDepartmentId').val(),
            PostalCodeId: $('#ResidencyAddress_PostalCodeId').val()
        },
        DeliveryAddress: {
            FlatNumber: $('#ResidencyAddress_FlatNumber').val(),
            FloorNumber: $('#ResidencyAddress_FloorNumber').val(),
            BuildingNumber: $('#ResidencyAddress_BuildingNumber').val(),
            StreetName: $('#ResidencyAddress_StreetName').val(),
            DistrictName: $('#ResidencyAddress_DistrictName').val(),
            GovernorateId: $('#ResidencyAddress_GovernorateId').val(),
            PoliceDepartmentId: $('#ResidencyAddress_PoliceDepartmentId').val(),
            PostalCodeId: $('#ResidencyAddress_PostalCodeId').val()
        }
        

    };
    if (docType == 'EQC') {
        requester.EquivalentCertificates = CreateEQCDocuments();
    }
    
    
    return requester;
}

function CreateRequesterImagesObject() {
    var Imgs = {
        file1:$('#file1').val(),
        file2:$('#file2').val(),
        file3:$('#file3').val(),
        file4:$('#file4').val(),
        file5:$('#file5').val(),
        file6:$('#file6').val(),
        file7:$('#file7').val(),
        file8:$('#file8').val(),
        file9:$('#file9').val(),
        file0:$('#file0').val()
    }
    return Imgs;
}
var IsHome;
function CreateEQCDocuments() {
    var doc = [{
        School: {
            SchoolAddress: $('#SchoolAddress').val(),
            SchoolState: $('#SchoolState').val(),
            SchoolName: $('#SchoolName').val(),
            SchoolAddressDetails: '-',
            //SchoolAddressDetails: $('#SchoolAddressDetails').val(),
            SchoolCity: '-',
            //SchoolCity: $('#SchoolCity').val(),
            SchoolCountryId: $('#SchoolCountryId').val()
        },
        ScoreArrivalNumber: $('#ScoreArrivalNumber').val(),
        ACT: $('#ACT').val(),
        EST: $('#EST').val(),
        ForeignNID: (CertificateMark == 1 || CertificateMark == 2) ? '000000' : $('#ForeignNID').val(),
        OtherCertificateId: ($('#OtherCertificateId').val() == '' || $('#OtherCertificateId').val() == undefined) ? '0' : $('#OtherCertificateId').val(),
        //CountryId: $('#CountryId').val(),
        CertificateTypeCode: $('#CertificateTypeCode').val()
    }];
    console.log(doc);
    return doc;
}

$('#FirstName').keyup(function () {
    var firstName = $(this).val();
    if (firstName != '')
        $('label[for="MotherFullName"]').text(constants.motherNameOfRequesterPart1 + ' ' + firstName + ' ' + constants.motherNameOfRequesterPart2);
    else
        $('label[for="MotherFullName"]').text(constants.motherFulleName);
});

$('input[name=print]').click(function () {
    window.print();
});


$(document).ready(function () {
    $('input[data-arabic-letters-only="true"]').each(function (i) {
        restrictInputOtherThanArabic($(this));
        $(this).on('paste', function (e) {
            var pasteData = e.originalEvent.clipboardData.getData('text');
            return checkAllLetterAreArabic($(this), pasteData);
        });
    });

    var selectors = 'input[type=text]:visible';
    selectors += ',input[type=number]:visible';
    selectors += ',input[type=email]:visible';
    selectors += ',input[type=tel]:visible';
    selectors += ',input[type=date]:visible';
    selectors += ',input[type=hidden]';
    selectors += ',select:visible';
    $('' + selectors + '').bind('change keyup paste', function () {
        validateControl($(this), true);
    });
});

function checkAllLetterAreArabic(ctrl, val) {
    isAllArabic = true;
    // Arabic characters fall in the Unicode range 0600 - 06FF
    var arabicCharUnicodeRange = /[\u0600-\u06FF]/;
    for (var i = 0; i < val.length; i++) {
        if (!arabicCharUnicodeRange.test(val[i])) {
            isAllArabic = false;
            break;
        }
    }
    return isAllArabic == true;
}

function restrictInputOtherThanArabic($field) {
    // Arabic characters fall in the Unicode range 0600 - 06FF
    var arabicCharUnicodeRange = /[\u0600-\u06FF]/;
    $field.bind("keypress", function (event) {
        var key = event.which;
        // 0 = numpad
        // 8 = backspace
        // 32 = space
        if (key == 8 || key == 0 || key === 32) {
            return true;
        }
        var str = String.fromCharCode(key);
        if (arabicCharUnicodeRange.test(str)) {
            return true;
        }
        return false;
    });
}

var firstInvalidControl = null;
function ValidateControls(index) {
    firstInvalidControl = null;
    var valid = true;

    var selectors = '#step' + index + ' input[type=text]:visible';
    selectors += ',#step' + index + ' input[type=number]:visible';
    selectors += ',#step' + index + ' input[type=email]:visible';
    selectors += ',#step' + index + ' input[type=tel]:visible';
    selectors += ',#step' + index + ' input[type=date]:visible';
    selectors += ',#step' + index + ' input[type=hidden]';
    selectors += ',#step' + index + ' select:visible';


    $('' + selectors + '').each(function (i) {
        //if ($(this).is(':visible') != false) {            
        valid = validateControl($(this), valid);
        $(this).on('keyup', function () {
            valid = true;
            valid = validateControl($(this), valid);
        });
        $(this).on('change', function () {
            valid = true;
            valid = validateControl($(this), valid);
        });
        //}
    });
    if (!valid)
        firstInvalidControl.focus();
    return valid;
}

function validateControl(ctrl, valid) {

    var val = $.trim(ctrl.val());
    var validationControl = $('span[data-valmsg-for="' + ctrl.attr('name') + '"]');
    if (ctrl.attr('id') == 'NID') {
        if (!ValidNID) {
            var requiredMessage = 'يجب إدخال رقم قومى صحيح!';
            if (requiredMessage != undefined && requiredMessage != '') { //Required validation
                indicateValidationError(ctrl, validationControl, requiredMessage);
                valid = false;
            }
        }
    }
    if (ctrl.attr('id') == 'ForeignNID') {
        if (!ValidNID) {
            var requiredMessage = 'عذرا لم يرد بيانك ضمن الباينات الواردة من الدولة مانحة الشهادة إتبع التعليمات أدناه أو توجه إلي مكتب التنسيق بالمدينة الجامعية لجامعة عين شمس';
            if (requiredMessage != undefined && requiredMessage != '') { //Required validation
                indicateValidationError(ctrl, validationControl, requiredMessage);
                valid = false;
            }
        }
    }
    if (ctrl.attr('id') == 'ACT') {
        if (!ValidACT) {
            var requiredMessage = 'عذرا لم يرد بيانك ضمن الباينات الواردة من الدولة مانحة الشهادة إتبع التعليمات أدناه أو توجه إلي مكتب التنسيق بالمدينة الجامعية لجامعة عين شمس';
            if (requiredMessage != undefined && requiredMessage != '') { //Required validation
                indicateValidationError(ctrl, validationControl, requiredMessage);
                valid = false;
            }
        }
    }
    if (!val.length) {//Empty control
        var requiredMessage = ctrl.data('val-required');
        if (requiredMessage != undefined && requiredMessage != '') { //Required validation
            indicateValidationError(ctrl, validationControl, requiredMessage);
            valid = false;
        }
    } else {//Not emoty control
        var type = ctrl.prop("type");
        if (type == 'email') {
            var emailValidMessage = ctrl.data('val-email');
            var equalToMessage = ctrl.data('val-equalto');
            if (emailValidMessage != undefined) {
                if (!isValidEmail(val)) {
                    indicateValidationError(ctrl, validationControl, emailValidMessage);
                    valid = false;
                } else if (equalToMessage != undefined) {
                    var otherControl = $('#' + $(ctrl).data('val-equalto-other').replace('*.', ''));
                    if (val != otherControl.val()) {
                        indicateValidationError(ctrl, validationControl, equalToMessage);
                        valid = false;
                    }
                }
            }
        }
        else if (type == 'date') {
            var valIs = ctrl.data('val-is');
            if (valIs != undefined) {
                var valIsDependentProperty = ctrl.data('val-is-dependentproperty');
                var valIsOperator = ctrl.data('val-is-operator');
                //if (valIsDependentProperty == 'Today' && valIsOperator == 'LessThan') {
                if (valIsOperator == 'LessThan') {
                    var ctrlDate = new Date(val);
                    var compareDate = new Date($('#' + valIsDependentProperty + '').val());
                    //var todayDate = new Date();
                    if (ctrlDate >= compareDate) {
                        indicateValidationError(ctrl, validationControl, valIs);
                        valid = false;
                    }
                }
                else if (valIsDependentProperty == 'Today' && valIsOperator == 'GreaterThan') {

                }
            }
        }
        else if (type == 'number') {
            var rangeMessage = ctrl.data('val-range');
            if (rangeMessage != undefined) {

                //hide the default browser label that appears if the control value is outside the range
                //console.log('label#' + ctrl.attr('id') + '-error');
                $('label#' + ctrl.attr('id') + '-error').hide();
                $('label#' + ctrl.attr('id') + '-error').html('');

                var numVal = parseInt($.trim(val));
                var min = parseInt(ctrl.data('val-range-min'));
                var max = parseInt(ctrl.data('val-range-max'));
                if (numVal < min || numVal > max) {
                    indicateValidationError(ctrl, validationControl, rangeMessage);
                    valid = false;
                }
            }

            var numberMessage = ctrl.data('val-number');
            if (numberMessage != undefined) {

                if (isNaN(val)) {
                    //hide the default browser label that appears if the control value is outside the range
                    //console.log('label#' + ctrl.attr('id') + '-error');
                    //$('label#' + ctrl.attr('id') + '-error').hide();
                    //$('label#' + ctrl.attr('id') + '-error').html('');

                    indicateValidationError(ctrl, validationControl, numberMessage);
                    valid = false;
                }
            }
        }
        else if ((type == 'text' || type == 'tel') && ctrl.data('skip-validation') != true) {
            var regexMessage = ctrl.data('val-regex');
            if (regexMessage != undefined) {
                var regexPattern = ctrl.data('val-regex-pattern');
                //console.log(regexMessage);
                //console.log(regexPattern);
                if (!new RegExp(regexPattern).test(val)) {
                    indicateValidationError(ctrl, validationControl, regexMessage);
                    valid = false;
                }
            }
        }
        else if ($(ctrl).is("select")) { }
        //else if (type == 'tel') {}
        else if (type == 'hidden') { }
    }

    if (valid) {
        removeValidationError(ctrl, validationControl);
    }


    return valid;
}

function indicateValidationError(ctrl, validationControl, validationMessage) {
    if (firstInvalidControl == null)
        firstInvalidControl = ctrl
    ctrl.addClass('control-error');

    validationControl.html(validationMessage);
    validationControl.show();
}

function removeValidationError(ctrl, validationControl) {
    ctrl.removeClass('control-error');
    validationControl.html('');
    validationControl.hide();
}

function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

//$('#collapseDeliveryAddress').hide();
//$('#deliveryAddress').hide();
var sameAddress = true;
$('#chkSameAddress').change(SameAddress);

function SameAddress() {
    if ($('#chkSameAddress').is(':checked')) {
        $('#collapseDeliveryAddress').hide();
        $('#deliveryAddress').hide();
        sameAddress = true;
    }
    else {
        $('#collapseDeliveryAddress').show();
        $('#deliveryAddress').show();
        sameAddress = false;
    }
    return;
}

$("#btnVerifyRequester").on("click", function () {
    verifyRequester();
});



function GetValidWorkingDays(BranchId) {
    var workingDays = lookup_workingDays.filter(function (item) {
        return item.BranchId == BranchId && item.IsActive == true;
    });
    WorkingDaySelectElement(workingDays, $('#WorkingDayId'), constants.select);
    //var token = $('input[name="__RequestVerificationToken"]').val();
    //$.ajax({
    //    url: validWorkingDays,
    //    type: 'POST',
    //    data: {
    //        BranchId: BranchId,
    //        __RequestVerificationToken: token
    //    },
    //    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    //    success: function (data) {
    //        console.log(data);
    //        lookup_workingDays = data;
    //        var workingDays = lookup_workingDays.filter(function (item) {
    //            return item.BranchId == BranchId && item.IsActive == true;
    //        });
    //        WorkingDaySelectElement(workingDays, $('#WorkingDayId'), constants.select);
    //    },
    //    complete: function (data) {
    //        console.log(data);
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //        console.log('getDependencyLookups: error');
    //        console.log(errorThrown);
    //    }
    //});
}


function verifyRequester() {
    var validToProceed = false;
    //$("#btnVerifyRequster").prop('disabled', true);
    $('#captcha-result-text').html('');

    var result = '';
    if (disableSmsSending == true && $("#SmsCode").val() == '')
        result += '<div>' + constants.youhouldInsertReceivedSmsCode + '</div>';
    if ($("#CaptchaTextCheckRequester").val() == '')
        result += '<div>' + constants.youhouldInsertCaptchCode + '</div>';
    if (result != '') {
        $('#captcha-result-text').html(result);
        $('#captcha-result').modal();
        return validToProceed;
    }

    var applicantData = {
        Mobile: $("#Mobile1").val(),
        Nid: $("#NID").val(),
        SmsCode: $("#SmsCode").val(),
        CaptchaText: $("#CaptchaTextCheckRequester").val(),
        CaptchaSuffix: $("#CaptchaTextCheckRequester").data("suffix")
    };
    var applicantJson = JSON.stringify(applicantData);


    $.ajax({
        url: checkRequesterUrl,
        type: 'POST',
        dataType: 'json',
        async: false,
        cache: false,
        timeout: 30000,
        data: applicantJson,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {

            var message = data.Message;
            if (message == "InvalidCaptcha") {
                result = constants.captchaCodeIncorrect;
                $('#captcha-result button').removeClass('btn-success');
                $('#captcha-result button').addClass('btn-danger');
            }
            else if (message == "InvalidSmsCode") {
                result = constants.smsCodeIncorrect;
                $('#captcha-result button').removeClass('btn-success');
                $('#captcha-result button').addClass('btn-danger');
            }
            else if (message == "InvalidNID") {
                result = constants.nidIncorrrect;
                $('#captcha-result button').removeClass('btn-success');
                $('#captcha-result button').addClass('btn-danger');
            }
            else if (message == "ValidCaptchaAndSmsCodeAndNID") {
                //$('.wizard-card').find('.btn-next').show();
                //result = constants.verificatioInfoCorrect;
                //$('#captcha-result button').removeClass('btn-danger');
                //$('#captcha-result button').addClass('btn-success');
                ////$('.wizard-card').bootstrapWizard('enable', captchaValidateRequesterStepIndex);
                ////$('.wizard-card').bootstrapWizard('next', captchaValidateRequesterStepIndex);
                validToProceed = true;
            }
        },
        complete: function () {
            generateCaptcha('captcha-refresh-check-requester');
            if (result != '') {
                $('#captcha-result-text').html(result);
                $('#captcha-result').modal();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#captcha-result button').removeClass('btn-success');
            $('#captcha-result button').addClass('btn-danger');
            $('#captcha-result-text').html(constants.errorOccurred);
            $('#captcha-result').modal();
            validToProceed = false;
        }
    });
    return validToProceed;
}

$('#btnSendSms').click(function () {
    sendSmsVerificationCode($('#Mobile1').val());
});

function sendSmsVerificationCode(mobileNo) {
    var applicantData = {
        Mobile: $("#Mobile1").val()
    };
    if (SmsPhone != applicantData.Mobile) {
        SendSmsCounter = 1;
    }
    var token = $('input[name="__RequestVerificationToken"]').val();
    var applicantJson = JSON.stringify(applicantData);
    if (SendSmsCounter <= 5) {
        SmsPhone = applicantData.Mobile;
        $.ajax({
            url: smsUrl,
            type: 'POST',
            //dataType: 'json',
            data: {
                Mobile1: $("#Mobile1").val(),
                Mobile2: $("#Mobile2").val(),
                __RequestVerificationToken: token
            },
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            success: function(data) {
                //console.log(data);
                var messageId = data.MessageID;
                var status = data.Status;
                var mobileNo = data.Mobile;
                var code = data.Code;
                if (status == "4") {
                    $('#captcha-result button').removeClass('btn-danger');
                    $('#captcha-result button').addClass('btn-success');
                    $('#captcha-result-text').html(constants.smsSentCheckAndInsert);
                    $('#captcha-result').modal();
                    //console.log(SendSmsCounter+": Message Sent Sucessfully To Phone Number("+mobileNo+') '+'With Code '+code);
                } else {
                    $('#captcha-result button').removeClass('btn-success');
                    $('#captcha-result button').addClass('btn-danger');
                    $('#captcha-result-text')
                        .html(constants.smsNotSent);
                    $('#captcha-result').modal();
                }
            },
            complete: function (data) {
            },
            error: function(jqXHR, textStatus, errorThrown) {
            }
        });
    } else {
        $('#captcha-result button').removeClass('btn-success');
        $('#captcha-result button').addClass('btn-danger');
        $('#captcha-result-text')
            .html(constants.maxSentForPhoneNumber);
        $('#captcha-result').modal();
    }
}

function sendVerificationCode(RID) {
    
    var token = $('input[name="__RequestVerificationToken"]').val();
    $.ajax({
        url: smsVerificateionUrl,
        type: 'POST',
        //dataType: 'json',
        data: {
            RequesterID: RID,
            __RequestVerificationToken: token
        },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function (data) {
            if (data.Status == '4') {
                $('#captcha-result button').removeClass('btn-danger');
                $('#captcha-result button').addClass('btn-success');
                $('#captcha-result-text').html(constants.smsSentCheckAndInsert);
                $('#captcha-result').modal();
                //console.log(SendSmsCounter+": Message Sent Sucessfully To Phone Number("+mobileNo+') '+'With Code '+code);
            } else {
                $('#captcha-result button').removeClass('btn-success');
                $('#captcha-result button').addClass('btn-danger');
                $('#captcha-result-text')
                    .html(constants.smsNotSent);
                $('#captcha-result').modal();
            }
        },
        complete: function (data) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}


var lookup_branchs, lookup_branchSlots, lookup_slots, lookup_workingDays, lookup_bookingAppointments, lookup_regions, lookup_countries, lookup_governorates, lookup_policeDepartments, lookup_postalCodes, lookup_Units, lookup_vacationTypes, lookup_currencies, lookup_certificates, lookup_certificateDocuments, lookup_UsedCertificateDocuments,
    lookup_qualificationTypes, lookup_qualifications, lookup_governmentalEstablishmentTypes, lookup_governmentalEstablishments, lookup_passportIssuers, lookup_documents, lookup_otherCertificates, lookup_certificateLevels, lookup_subjects, lookup_scaleData, lookup_calculatorSrcs, lookup_certificateConditions;
function getDependencyLookups() {
    $.ajax({
        url: lookupsUrl,
        type: 'POST',
        dataType: 'json',
        data: {},
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //console.log(data);
            lookup_certificateConditions = data.Lookups.CertificateConditions;
            lookup_calculatorSrcs = data.Lookups.CalculatorSrcs;
            lookup_certificateLevels = data.Lookups.CertificateLevels;
            lookup_subjects = data.Lookups.Subjects;
            lookup_scaleData = data.Lookups.ScaleData;
            lookup_otherCertificates = data.Lookups.OtherCertificates;
            lookup_branchs = data.Lookups.Branches;
            lookup_branchSlots = data.Lookups.BranchSlots;
            lookup_slots = data.Lookups.Slots;
            lookup_bookingAppointments = data.Lookups.BookingAppointments;
            lookup_workingDays = data.Lookups.WorkingDays;
            lookup_regions = data.Lookups.Regions;
            lookup_countries = data.Lookups.Countries;
            lookup_governorates = data.Lookups.Governorates;
            //lookup_policeDepartments = data.Lookups.PoliceDepartments;
            lookup_UsedCertificateDocuments = data.Lookups.UsedCertificateDocument;
            lookup_documents = data.Lookups.Documents;
            lookup_certificates = data.Lookups.Certificates;
            lookup_postalCodes = data.Lookups.PostalCodes;
            lookup_qualificationTypes = data.Lookups.QualificationTypes;
            lookup_qualifications = data.Lookups.Qualifications;
            lookup_governmentalEstablishmentTypes = data.Lookups.GovernmentalEstablishmentTypes;
            lookup_governmentalEstablishments = data.Lookups.GovernmentalEstablishments;
            if (IsHome) {
                GetCertificateLevels(CertificateCode,
                    $('#CertificateLevels'));
                GetCalculatorSrc(CertificateCode)
            }
            TestData();
            //GetCertificateLevels(CertificateCode,$('#CertificateLevels'));  
        },
        complete: function (data) {
        }, 
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('getDependencyLookups: error');
            console.log(errorThrown);
        }
    });
}


$('#BirthPlaceRegionId').change(function () {
    var region = $(this).val();
    filterCountries(region, $('#BirthPlaceId'));
});
$('#PassportIssueCountryIdRegionId').change(function () {
    var region = $(this).val();
    filterCountries(region, $('#PassportIssueCountryId'));
});
$('#ContractorCountryIdRegionId').change(function () {
    var region = $(this).val();
    filterCountries(region, $('#ContractorCountryId'));
});

$('#ContractorAddressCountryIdRegionId').change(function () {
    var region = $(this).val();
    filterCountries(region, $('#AddressCountryId'));
});

function filterCountries(regionId, selectElement) {
    var regionCountries = lookup_countries.filter(function (country) {
        return country.RegionId == regionId;
    });
    PopulateSelectElement(regionCountries, selectElement, constants.select);
    $('#PassportIssueCountryId').change();
    //$("#PassportIssuerId").find('option').remove().end().append('<option value>' + constants.select + '</option>');//clear passport issuers select elements
    //document.getElementById("PassportIssuerId").options.length = 0;
    //var selectedRegionCountries = $.grep($.parseJSON(lookup_countries), function (itm, i) { return itm.RegionId == $(this).val(); });
}

$('#PassportIssueCountryId').change(function () {
    var countryId = $(this).val();
    filterPassportIssuers(countryId, $('#PassportIssuerId'));
});

var passportIssuerId = null;//We use this variable as a workaround for the passportIssuerId not going in the json object sent to the action method
$('#PassportIssuerId').change(function () {
    passportIssuerId = $(this).val();
    //console.log(passportIsskuerId);
});

function filterPassportIssuers(countryId, selectElement) {
    //console.log(countryId);
    var passportIssuers = null;
    if (countryId == '') {
        passportIssuers = lookup_passportIssuers.filter(function (passportIssuer) {
            return false;
        });
    }
    else if (countryId == 1) {//Egypt
        passportIssuers = lookup_passportIssuers.filter(function (passportIssuer) {
            return passportIssuer.Code != 81;
        });
    }
    else {//Other countries
        //Code:81, Name:القنصليات
        passportIssuers = lookup_passportIssuers.filter(function (passportIssuer) {
            return passportIssuer.Code == 81;
        });
    }
    PopulateSelectElement(passportIssuers, selectElement, constants.select);
}

$('#QualificationTypeId').change(function () {
    var qualificationTypeId = $(this).val();
    filterQualifications(qualificationTypeId, $('#QualificationId'));
});
function filterQualifications(qualificationTypeId, selectElement) {
    var qualifications = lookup_qualifications.filter(function (qualification) {
        return qualification.QualificationTypeId == qualificationTypeId;
    });
    PopulateSelectElement(qualifications, selectElement, constants.select);
}

$('#GovernmentalEstablishmentTypeId').change(function () {
    var governmentalEstablishmentId = $(this).val();
    filterGovermentalestablishments(governmentalEstablishmentId, $('#GovernmentalEstablishmentId'));
});

$('#GenderId').change(function () {
    var genderId = $(this).val();
    return genderId;
});



function filterGovermentalestablishments(governmentalEstablishmentId, selectElement) {
    var govermentalestablishments = lookup_governmentalEstablishments.filter(function (establishment) {
        return establishment.GovernmentalEstablishmentTypeId == governmentalEstablishmentId;
    });
    PopulateSelectElement(govermentalestablishments, selectElement, constants.select);
}

function getAllDocumentsForSeletedCertificateCodes(selectedCertificateCode) {

    var certificateDocuments = lookup_documents.filter(function (Document) {
        return Document.CertificateId == selectedCertificateCode;
    });

    var ListOfConditions = '';
    var certificateConditions = lookup_certificateConditions.filter(function (CertificateCondition) {
        if (CertificateCondition.CertificateCode == selectedCertificateCode) {
            ListOfConditions += '<li>' + CertificateCondition.Condition + '</li>'
            return true;
        }
        return false;
    });

    $('#ShowConditions').html(ListOfConditions);
    
    if (certificateDocuments.length < 1) {
        $("#divNoFiles").show();
    }
    else if (certificateDocuments.length >= 1) {
        //$("#divFile1").show();
        //$('#LblFile1').text(certificateDocuments[0].DisplayName);

        $("#divFile1").show();
        $('#LblFile1').text(certificateDocuments[0].DisplayName);
        $('#AFile1').attr('href', ImgUrl + certificateDocuments[0].ImageSampleName);
        $('#AFile1').attr('data-title', certificateDocuments[0].DisplayName);
        $('#ImgFile1').attr('src', ImgUrl + certificateDocuments[0].ImageSampleName);

        if (certificateDocuments.length >= 2) {
            //$("#divFile2").show();
            //$('#LblFile2').text(certificateDocuments[1].DisplayName);

            $("#divFile2").show();
            $('#LblFile2').text(certificateDocuments[1].DisplayName);
            $('#ImgFile2').attr('src', ImgUrl + certificateDocuments[1].ImageSampleName);
            $('#AFile2').attr('href', ImgUrl + certificateDocuments[1].ImageSampleName);
            $('#AFile2').attr('data-title', certificateDocuments[1].DisplayName);
            

            if (certificateDocuments.length >= 3) {
                //$("#divFile3").show();
                //$('#LblFile3').text(certificateDocuments[2].DisplayName);

                $("#divFile3").show();
                $('#LblFile3').text(certificateDocuments[1].DisplayName);
                $('#ImgFile3').attr('src', ImgUrl + certificateDocuments[2].ImageSampleName);
                $('#AFile3').attr('href', ImgUrl + certificateDocuments[2].ImageSampleName);
                $('#AFile3').attr('data-title', certificateDocuments[2].DisplayName);

                if (certificateDocuments.length >= 4) {
                    //$("#divFile4").show();
                    //$('#LblFile4').text(certificateDocuments[3].DisplayName);

                    $("#divFile4").show();
                    $('#LblFile4').text(certificateDocuments[1].DisplayName);
                    $('#ImgFile4').attr('src', ImgUrl + certificateDocuments[3].ImageSampleName);
                    $('#AFile4').attr('href', ImgUrl + certificateDocuments[3].ImageSampleName);
                    $('#AFile4').attr('data-title', certificateDocuments[3].DisplayName);

                    if (certificateDocuments.length >= 5) {
                        //$("#divFile5").show();
                        //$('#LblFile5').text(certificateDocuments[4].DisplayName);

                        $("#divFile5").show();
                        $('#LblFile5').text(certificateDocuments[4].DisplayName);
                        $('#ImgFile5').attr('src', ImgUrl + certificateDocuments[4].ImageSampleName);
                        $('#AFile5').attr('href', ImgUrl + certificateDocuments[4].ImageSampleName);
                        $('#AFile5').attr('data-title', certificateDocuments[4].DisplayName);


                        if (certificateDocuments.length >= 6) {
                            //$("#divFile6").show();
                            //$('#LblFile6').text(certificateDocuments[5].DisplayName);

                            $("#divFile6").show();
                            $('#LblFile6').text(certificateDocuments[1].DisplayName);
                            $('#ImgFile6').attr('src', ImgUrl + certificateDocuments[5].ImageSampleName);
                            $('#AFile6').attr('href', ImgUrl + certificateDocuments[5].ImageSampleName);
                            $('#AFile6').attr('data-title', certificateDocuments[5].DisplayName);

                            if (certificateDocuments.length >= 7) {
                                //$("#divFile7").show();
                                //$('#LblFile7').text(certificateDocuments[6].DisplayName);

                                $("#divFile7").show();
                                $('#LblFile7').text(certificateDocuments[1].DisplayName);
                                $('#ImgFile7').attr('src', ImgUrl + certificateDocuments[6].ImageSampleName);
                                $('#AFile7').attr('href', ImgUrl + certificateDocuments[6].ImageSampleName);
                                $('#AFile7').attr('data-title', certificateDocuments[6].DisplayName);

                                if (certificateDocuments.length >= 8) {
                                    //$("#divFile8").show();
                                    //$('#LblFile8').text(certificateDocuments[7].DisplayName);

                                    $("#divFile8").show();
                                    $('#LblFile8').text(certificateDocuments[1].DisplayName);
                                    $('#ImgFile8').attr('src', ImgUrl + certificateDocuments[7].ImageSampleName);
                                    $('#AFile2').attr('href', ImgUrl + certificateDocuments[7].ImageSampleName);
                                    $('#AFile2').attr('data-title', certificateDocuments[7].DisplayName);

                                    if (certificateDocuments.length >= 9) {
                                        //$("#divFile9").show();
                                        //$('#LblFile9').text(certificateDocuments[8].DisplayName);

                                        $("#divFile9").show();
                                        $('#LblFile9').text(certificateDocuments[1].DisplayName);
                                        $('#ImgFile9').attr('src', ImgUrl + certificateDocuments[8].ImageSampleName);
                                        $('#AFile9').attr('href', ImgUrl + certificateDocuments[8].ImageSampleName);
                                        $('#AFile9').attr('data-title', certificateDocuments[8].DisplayName);

                                        if (certificateDocuments.length == 10) {
                                            //$("#divFile0").show();
                                            //$('#LblFile0').text(certificateDocuments[9].DisplayName);

                                            $("#divFile0").show();
                                            $('#LblFile0').text(certificateDocuments[1].DisplayName);
                                            $('#ImgFile0').attr('src', ImgUrl + certificateDocuments[9].ImageSampleName);
                                            $('#AFile0').attr('href', ImgUrl + certificateDocuments[9].ImageSampleName);
                                            $('#AFile0').attr('data-title', certificateDocuments[9].DisplayName);
                                        }
                                    }

                                    
                                }

                                
                            }
                            
                        }

                        
                    }

                    
                }

                
            }

            
        }
        
    }

    
    
    var otherCertificates = lookup_otherCertificates.filter(function (otherCertificate) {
        return otherCertificate.CertificateTypeCode == selectedCertificateCode;
    });

    OtherSelectElement(otherCertificates, $('#OtherCertificateId'), constants.select);

}

function getWorkingDays(BranchId) {
    var branch = lookup_branchs.filter(function (branch) {
        return branch.Id == BranchId;
    });
    $('#BranshAddress').text('عنوان الحضور :'+branch[0].BranchAddress);
    var branchSlots = lookup_branchSlots.filter(function (branchSolt) {
        return branchSolt.BranchId == BranchId ;
    });
    //var slots = lookup_slots.filter(function (item) {
    //    return branchSlots.find(o => o.SlotId == item.Id );
    //});
    //SlotSelectElement(slots, $('#SlotId'), constants.select);

    //GetValidWorkingDays(BranchId);
    
}


function getPoliceDepartmentsAndPostalCodes(govId, policeDepartmentsSelect, postalCodesSelect) {

    //var policeDepartments = $.grep($.parseJSON(policeDepartments),
    //    function (itm, i) { return itm.GovernorateId == govId; });
    //var postalCodes = $.grep($.parseJSON(postalCodes),
    //    function (itm, i) { return itm.GovernorateId == govId; });
    //PopulateSelectElement(policeDepartments, policeDepartmentsSelect, constants.select);
    //PopulateSelectElement(postalCodes, postalCodesSelect, constants.select);

    //postalCodesSelect.change(function() {      
    //    var val = $(this).val();
    //    var codeNumber = $.grep(postalCodes, function (itm, i) { return itm.Id == val; });
    //    if (codeNumber[0] && codeNumber[0].Code)
    //        $(this).parent().find('span[name=postalCodeNumber]').html('( ' + codeNumber[0].Code + ' )');
    //})
    //var govPoliceDepartments = lookup_policeDepartments.filter(function (policeDepartment) {
    //    return policeDepartment.GovernorateId == govId;
    //});
    //
    //PopulateSelectElement(govPoliceDepartments, policeDepartmentsSelect, constants.select);
    //
    //var govPostalCodes = lookup_postalCodes.filter(function (postalCode) {
    //    return postalCode.GovernorateId == govId;
    //});
    //PopulateSelectElement(govPostalCodes, postalCodesSelect, constants.select);
    //
    //postalCodesSelect.change(function () {
    //    var val = $(this).val();
    //    var codeNumber = govPostalCodes.filter(function (postalCode) { return postalCode.Id == val; });
    //    if (codeNumber[0] && codeNumber[0].Code)
    //        $(this).parent().find('span[name=postalCodeNumber]').html('( ' + codeNumber[0].Code + ' )');
    //})
}

function GetCertificateLevels(CertificateCode, lvlselect) {
    var certlvls = lookup_certificateLevels.filter(function (certificateLevels) {
        return certificateLevels.CertificateCode == CertificateCode;
    });
    PopulateCertLvls(certlvls, lvlselect, constants.select);
}

function GetCalculatorSrc(CertificateCode) {
    var srcs = lookup_calculatorSrcs.filter(function (src) {
        return src.CertificateCode == CertificateCode;
    });
    for (var i = 0; i < srcs.length; i++) {
        var scr = document.createElement("script");
        scr.src = srcs[i]["Source"];
        document.body.appendChild(scr);
    }
}


function GetScaleData(scaleCode, gradeSelect) {
    var ddlscale = lookup_scaleData.filter(function (scaledata) {
        return scaledata.ScaleCode == scaleCode;
    });
    PopulateGrade(ddlscale, gradeSelect, constants.select);
}

function GetSubjects(lvlcode, subselect) {
    var subjects = lookup_subjects.filter(function (subs) {
        return subs.LevelCode == lvlcode;
    });
    PopulateSubjects(subjects, subselect, constants.select);
}



function getIssuingUnits(govId, unitsSelect) {

    //var units = $.grep($.parseJSON(units),
    //    function (itm, i) { return itm.GovernorateId == govId; });
    //PopulateSelectElement(units, unitsSelect, constants.select);

    var units = lookup_Units.filter(function (unit) {
        return unit.GovernorateId == govId;
    });
    PopulateSelectElement(units, unitsSelect, constants.select);
}

function PopulateCertLvls(data, selectElement, optionText) {
    var options = '';
    if (optionText)
        options += '<option value="">' +
            optionText +
            '</option>'; //selectElement.append($('<option></option>').val(null).html(optionText));
    $.each(data,
        function (i, itm) {
            options +=
                '<option value=' + itm.Code + ' code="' + itm.Code + '">' +
                itm.Name +
                '</option>'; //selectElement.append($('<option></option>').val(itm.Id).html(itm.Name));
        });
    selectElement.html(options);
}

function PopulateSubjects(data, selectElement, optionText) {
    var options = '';
    if (optionText)
        options += '<option value="">' +
            optionText +
            '</option>'; //selectElement.append($('<option></option>').val(null).html(optionText));
    $.each(data,
        function (i, itm) {
            options +=
                '<option value=' + itm.Code + ' ScaleCode="' + itm.ScaleCode + '"MaxGrade=' + itm.MaxGrade + '>' +
                itm.Subject +
                '</option>'; //selectElement.append($('<option></option>').val(itm.Id).html(itm.Name));
        });
    selectElement.html(options);
}

function PopulateGrade(data, selectElement, optionText) {
    var options = '';
    if (optionText)
        options += '<option value="">' +
            optionText +
            '</option>'; //selectElement.append($('<option></option>').val(null).html(optionText));
    $.each(data,
        function (i, itm) {
            if (itm.Scale !== "?") {
                options +=
                    '<option value=' + itm.Mark + '>' +
                    itm.Scale +
                    '</option>'; //selectElement.append($('<option></option>').val(itm.Id).html(itm.Name));
            }
        });
    selectElement.html(options);
}

function PopulateSelectElement(data, selectElement, optionText) {
    var options = '';
    if (optionText)
        options += '<option value="">' +
            optionText +
            '</option>'; //selectElement.append($('<option></option>').val(null).html(optionText));
    $.each(data,
        function (i, itm) {
            options +=
                '<option value=' + itm.Id + ' code="' + itm.Code + '">' +
                itm.Name +
                '</option>'; //selectElement.append($('<option></option>').val(itm.Id).html(itm.Name));
        });
    selectElement.html(options);
}

function OtherSelectElement(data, selectElement, optionText) {
    var options = '';
    if (optionText)
        options += '<option value="">' +
            optionText +
            '</option>'; //selectElement.append($('<option></option>').val(null).html(optionText));
    $.each(data,
        function (i, itm) {
            options +=
                '<option value=' + itm.id + ' code="' + itm.CertificateTypeCode + '">' +
                itm.Name +
                '</option>'; //selectElement.append($('<option></option>').val(itm.Id).html(itm.Name));
        });
    selectElement.html(options);
}

function SlotSelectElement(data, selectElement, optionText) {
    var options = '';
    if (optionText)
        options += '<option value="">' +
            optionText +
            '</option>'; //selectElement.append($('<option></option>').val(null).html(optionText));
    $.each(data,
        function (i, itm) {
            options +=
                '<option value=' + itm.Id + '>' + itm.TimeTo + " - " + itm.TimeFrom +
                '</option>'; //selectElement.append($('<option></option>').val(itm.Id).html(itm.Name));
        });
    selectElement.html(options);
}

function WorkingDaySelectElement(data, selectElement, optionText) {
    var options = '';
    if (optionText)
        options += '<option value="">' +
            optionText +
            '</option>'; //selectElement.append($('<option></option>').val(null).html(optionText));
    $.each(data,
        function (i, itm) {
            
            options +=
                '<option value=' + itm.Id + '>' + itm.DateStr  +
                '</option>'; //selectElement.append($('<option></option>').val(itm.Id).html(itm.Name));
        });
    selectElement.html(options);
}

// Replace YearsToRenew Selector to TYearsToRenew
$('#TYearsToRenew').change(function () {
    calcNewWorkPermitExpiryDate();
});
$('#CurrentWorkPermitExpiryDate').change(function () {
    calcNewWorkPermitExpiryDate();
});
$('#PermitIssueDate').change(function () {
    calcNewSoldierPermitExpiryDate();
});




$('#ForeignNID').blur(function(){
    if ($('#CertificateTypeCode').val() == '131' || $('#CertificateTypeCode').val() == '101' || $('#CertificateTypeCode').val() == '102'
        || $('#CertificateTypeCode').val() == '103' || $('#CertificateTypeCode').val() == '107' || $('#CertificateTypeCode').val() == '108'
        || $('#CertificateTypeCode').val() == '109' || $('#CertificateTypeCode').val() == '129' || $('#CertificateTypeCode').val() == '104') {
        var CBStudentId = $('#ForeignNID').val();
        //var ExtractedBirthDate = CBStudentId.substring(1, 7);
        //var ExtractedBirthYear = '20' + ExtractedBirthDate.substring(0, 2);
        //var ExtractedBirthMonth = ExtractedBirthDate.substring(2, 4);
        //var ExtractedBirthDay = ExtractedBirthDate.substring(4, 6);
        //var FinalBirthDate = ExtractedBirthYear + '-' + ExtractedBirthMonth + '-' + ExtractedBirthDay;
        //$('#BirthDate').val(FinalBirthDate);
        $('#BirthDate').attr('disabled', true);
    }
    else {
        $('#BirthDate').attr('disabled', false);

    }
    if ($('#CertificateTypeCode').val() == '131') {

    }
})

function TestData() {
    
    //return;
    $('#ReligionId').val('1');
    $('#ReligionId').change();
    $('#CountryId').val('1');
    $('#CountryId').change();

    $('#SchoolAddress').val('1 Al malek Fahd Street');
    $('#SchoolState').val('jaddah');
    $('#SchoolName').val('Alsalam International School');
    $('#SchoolAddressDetails').val('1');
    $('#SchoolCity').val('jaddah');
    $('#SchoolCountryId').val('1');
    $('#SchoolCountryId').change();

    $('#FirstName').val('خالد');
    $('#ForeignNID').val('AS45454555');
    $('#FatherName').val('إبراهيم');
    $('#GrandFatherName').val('محمد');
    $('#FamilyName').val('عبيد البهنساوي');
    $('#MotherFullName').val('نجلاء عيد محمد الشناوي');
    $('#Email').val('mail1@gmail.com');
    $('#EmailConfirm').val('mail1@gmail.com');
    $('#Mobile1').val('01146213660');

    $('#Mobile2').val('01277377749');
    $('#PhoneHome').val('0242996314');
    $('#WorkHome').val('');
    $('#GenderId').val('1');
    $('#GenderId').change();

    //$('#NID').val('29504011325731');

    $('#ResidencyAddress_FlatNumber').val('1');
    $('#ResidencyAddress_FloorNumber').val('2');
    $('#ResidencyAddress_BuildingNumber').val('3');
    $('#ResidencyAddress_StreetName').val('Taha Hussein');
    $('#ResidencyAddress_DistrictName').val('Qalioub');
    $('#ResidencyAddress_GovernorateId').val('3');
    $('#ResidencyAddress_GovernorateId').change();
    $('#ResidencyAddress_PoliceDepartmentId').val('152');
    $('#ResidencyAddress_PostalCodeId').val('543');
    $('#DeliveryAddress_FlatNumber').val('11');
    $('#DeliveryAddress_FloorNumber').val('22');
    $('#DeliveryAddress_BuildingNumber').val('33');
    $('#DeliveryAddress_StreetName').val('Taha Hussein 2');
    $('#DeliveryAddress_DistrictName').val('Qalioub 2');
    $('#DeliveryAddress_GovernorateId').val('1');
    $('#DeliveryAddress_GovernorateId').change();
    $('#DeliveryAddress_PoliceDepartmentId').val('1');
    $('#DeliveryAddress_PostalCodeId').val('1');
    //Criminal State Record
    $('#IssueDestination').val('شركة السهم');
    //Work Permit Clearance
    $('#LastPermitFinishDate').val('2018-12-01');
    $('#ClearanceReasonId').val('1');
    $('#ClearanceDestination').val('وزارة العدل');
    $('#PassportNumber').val('A15020030');
    $('#PassportIssueCountryId').val('1');
    $('#JobInPassportId').val('1');
    $('#LastLeaveDate').val('2018-12-01');
    $('#LastReturnDate').val('2018-12-01');

    //Soldier Travel Permit
    $('#Name_en').val('Gamal AHmed Shehata');
    $('#PassportIssueDate').val('2018-12-01');
    $('#PassportExpiredDate').val('2025-12-01');
    //$('#BirthDate').val('1995-04-01');

    //Work Permit
    $('#IssuingGovernorateId').val('1');
    $('#IssuingGovernorateId').change();
    $('#IssuingUnitId').val('1');
    $('#JobTypeWorkPermitId').val('1');
    $('#JobTypeWorkPermitId').change();
    $('#JobNameInEgypt').val('مهندس');
    $('#QualificationType').val('1');
    $('#BirthPlaceRegionId').val('1');
    $('#BirthPlaceRegionId').change();
    $('#BirthPlaceId').val('1');
    $('#QualificationTypeId').val('1');
    $('#QualificationTypeId').change();
    $('#QualificationId').val('1');
    $('#QualificationDate').val('2018-12-01');
    $('#GovernmentalEstablishmentTypeId').val('1');
    $('#GovernmentalEstablishmentTypeId').change();
    $('#GovernmentalEstablishmentId').val('1');
    $('#VacationTypeId').val('1');
    $('#PassportIssueCountryIdRegionId').val('1');
    $('#PassportIssueCountryIdRegionId').change();
    $('#PassportIssueCountryId').val('1');
    $('#ContractorCountryIdRegionId').val('1');
    $('#ContractorCountryIdRegionId').change();
    $('#ContractorCountryId').val('1');

    $('#ContractorCountryId').val('1');
    $('#ContractorName').val('وزارة العدل السعودية');
    $('#ContractorTypeId').val('1');
    $('#ContractorActivity').val('برمجة');
    $('#ContractorAddress').val('الرياض');
    $('#ContractorJobName').val('مهندس');
    $('#ContractTypeId').val('1');
    $('#TYearsToRenew').val('1');

    $('#EstablishmentName').val('هيئة الأرصاد الجوية');
    $('#RelatedMinistryId').val('1');
    $('#VacationType').val('أنتخة');
    $('#VacationApprovedYears').val('10');
    $('#VacationStart').val('2018-12-01');
    $('#VacationEnd').val('2018-12-02');

    $('#NidFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#PassportFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#VisaFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#RenewDirectedLetterFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#NavyAgentCertFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#PreviousPermitFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');

    $('#VacationPermitFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#NidFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#PassportFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#PreviousPermitFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#VisaFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#NavyAgentCertFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    $('#NavyPassportFileName').val('050096dd-9866-484e-bef2-4d09c0965866.jpeg');
    
}

var products = [];
//var product = {};
//product.productSKU = '';
//product.description = '';
//product.price = 0;
//product.quantity = 1;
var requestToFawry = {};
requestToFawry.merchant = '';
requestToFawry.locale = '';
requestToFawry.merchantRefNum = '';
requestToFawry.customerName = '';
requestToFawry.mobile = '';
requestToFawry.email = '';
requestToFawry.orderExpiry = 0;
requestToFawry.billingAcctNum = '';
requestToFawry.requestSignature = '';

function showFawryPlugin() {
    //var merchant = 'Qtq4E61ei9E='; // Required
    //var locale = 'ar-eg';  // Required
    //var merchantRefNum = '1234577';  // Optional
    //var customerName = '';  // Optional
    //var mobile = '';  // Optional
    //var email = '';  // Optional
    //var fawryProductsJson = getProductsJson(); // Required in case multiple products (normal case)
    //var orderExpiry = 2;
    //var requestSignature = 'testsiganture';
    //loadFawryPluginPopup(merchant, locale, merchantRefNum, fawryProductsJson, customerName, mobile, email, 'null', 'null', 'null', orderExpiry, requestSignature);

    var productsJson = getProductsJson();
    console.log("requestToFawry: ");
    console.log(requestToFawry);
    console.log("productsJson: ");
    console.log(productsJson);
    Checkout.showLightbox();
    
}



function getProductsJson() {
    //var products = [];
    ////var product = {};
    ////product.productSKU = $('#productSKU').html();//document.getElementById('productSKU').innerText;
    ////product.description = $('#description').val()//document.getElementById('description').innerText;
    ////product.price = 300;//document.getElementById('price').innerText;
    ////product.quantity = 1;//document.getElementById('quantity').innerText;
    //products.push(product);
    return JSON.stringify(products);
}

function fawryCallbackFunction(paid, billingAcctNum, paymentAuthId, merchantRefNum, messageSignature) {
    // Your implementation
    var result = {
        paid: paid,
        billingAcctNum: billingAcctNum,
        paymentAuthId: paymentAuthId,
        merchantRefNum: merchantRefNum,
        messageSignature: messageSignature
    };

    //console.log("Fawry paymeny request: ");
    //console.log(result);

    var url = $('#RedirectTo').val();
    //if (typeof url !== 'undefined') {
    //    location.href = url;
    //}

    if (result.paid) {
        RequestPaid();
    }
    else if (!result.paid) {
        RequestNotPaid(billingAcctNum);
    }
}

function RequestPaid() {
    $('#GoToInquiryPaid').css('display', 'block');
    $('.FawryDiv').css('display', 'none');
    $('.PaymentTitle').text(' تم الدفع بنجاح و يتم إرسال تصريح السفر إلكترونياً خلال (خمسة) أيام إلى منفذ السفر ');
    $('.ThanksMsg').text(' شكراً لاستخدامك الخدمات الإلكترونية  لوزارة الداخلية ');
}

function RequestNotPaid(billingAcctNum) {
    $('#GoToInquiryNotPaid').css('display', 'block');
    $('.FawryDiv').css('display', 'none');
    $('.PaymentTitle').text(' تم إصدار مدفوعة رقم ' + billingAcctNum+' بنجاح فى إنتظار إتمام الدفع فى خلال 7 أيام من تاريخ تسجيل الطلب غير المدفوع ');
    $('.ThanksMsg').text(' شكرا لاستخدامك الخدمات الإلكترونية  لوزارة الداخلية ');
}

function requestCanceldCallBack(merchantRefNum) {// Your implementation to handle the cancelbutton
    console.log("Fawry payment request cancelled, merchantRefNum: " + merchantRefNum);
}
