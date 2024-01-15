$(document).ready(function () {

  const url = '';
  const username = '';
  const password = '';

  var queryParams = getUrlQueryParams();

  const $btnNext = $("#next");
  const $btnBack = $("#back");
  const $btnSend = $("#send");

  $btnNext.hide();
  $btnBack.hide();
  $btnSend.hide();

  var isEfectosSecundariosSelected;

  var firstSection = $('#first-section');
  var lastSection = $('#last-section');
  var warningSection = $('#last-section-warning');
  var isSurveyAv = isSurveyAvailable(queryParams["token"]);
  console.log(isSurveyAv);
  var currentStep = 1;

  firstSection.hide();
  lastSection.hide();
  
  if(isSurveyAv){
    showWelcomeSection();
  }

  if(isSurveyAv === false){
  
    showEndingSection();
  }

  if(isSurveyAv === 'error'){
    
    showWarningSection()
  }

  

  // Hide the "Siguiente" button at startup
  

  // Function to update the status of the "Siguiente" button
  function updateNextButtonState() {
    var isStep2an1Checked = $('input[type="radio"][name="step2cks1"]:checked').length > 0;
    var isStep2an2Val = $('input[type="radio"][name="step2radio"]:checked').attr('id');
    var isStep2an2checked = $('input[type="radio"][name="step2cks2"]:checked').length > 0;
    var isStep2an3Checked = $('[name="step2an3"]').find('input[type="checkbox"]:checked').length > 0;

    if (currentStep === 1) {
      $btnNext.show();
    }
    if (currentStep === 2) {
      $btnNext.hide();
      $btnSend.hide();
      if (isStep2an1Checked == true && isStep2an2Val == "Si") {
        $('[name="Effects"]').hide();
        $('[name="NotEffects"]').hide();
        $('[name="happy"]').show();
        //$btnNext.show();
        $btnSend.show();
      }

      if (isStep2an1Checked && isStep2an2Val == "No") {

        if (isEfectosSecundariosSelected) {

          if (isStep2an3Checked) {
            //$btnNext.show();
            $btnSend.show();
            $('[name="happy"]').hide();
            $('[name="NotEffects"]').hide();
            $('[name="Effects"]').show();
          } else {
            //$btnNext.hide();
            $btnSend.hide();
            $('[name="happy"]').hide();
            $('[name="NotEffects"]').hide();
            $('[name="Effects"]').hide();
          }
        } else {
          if (isStep2an1Checked && isStep2an2checked) {
            //$btnNext.show();
            $btnSend.show();
            $('[name="happy"]').hide();
            $('[name="Effects"]').hide();
            $('[name="NotEffects"]').show();
          }
        }
      }
    }
    if (currentStep === 3) {
      //Not able to close web tab if this tab was not opened by another js code
      //$btnNext.html('Cerrar');
      $btnSend.hide();
    }
  }

  function getUrlQueryParams() {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  function isSurveyAvailable(token) {
    let isAvailable = false;
    const payload = {
      action: "survey_status",
      token: token,
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
      "Content-Type": "application/json",
      "Authorization": "Basic " + btoa(username + ":" + password)
    };

    $.ajax({
      type: "POST",
      url: url,
      async: false,
      dataType: 'json',
      data: JSON.stringify(payload),
      headers: headers,
      success: (response) => {
        if(response.event_status === "DRAFT" ){
          isAvailable = true
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        warningSection.show();
        isAvailable = 'error';
      },
    });
    return isAvailable;
  }

  function sendSurveyData() {
    let actualContraceptiveMethod = $("input[name = 'step2cks1']:checked").val();
    let areYouHappyWithYourMethod = $("input[name = 'step2radio']:checked").val();
    let mainUnhappynessReason = $("input[name = 'step2cks2']:checked").val();

    let checkboxPeriodChanges = $("#checkbox-period-changes").is(":checked");
    let checkboxHeadache = $("#checkbox-headache").is(":checked");
    let checkboxWeightIncrease = $("#checkbox-weight-increase").is(":checked");
    let checkboxStomachache = $("#checkbox-stomachache").is(":checked");
    let checkboxHumorChanges = $("#checkbox-humor-changes").is(":checked");
    let checkboxOther = $("#checkbox-other").is(":checked");
    
    const headers = {
      'Access-Control-Allow-Origin': '*',
      "Content-Type": "application/json",
      "Authorization": "Basic " + btoa(username + ":" + password)
    };

    const payload = {
      
      action: "survey_record",
      token: queryParams.token,//getUrlQueryParams().token,
      surveyDatetime: new Date().toISOString(),
      datavalues: [
        {
          datapoint: "method",
          value: actualContraceptiveMethod ,
        },
        {
          datapoint: "satisfiedWithMethod",
          value: areYouHappyWithYourMethod,
        },
        {
          datapoint: "unsatisfiedReason",
          value: mainUnhappynessReason ?? '',
        },
        {
          datapoint: "unsatSideEffect_chg",
          value: checkboxPeriodChanges,
        },
        {
          datapoint: "unsatSideEffect_pain",
          value: checkboxHeadache,
        },
        {
          datapoint: "unsatSideEffect_weight",
          value: checkboxWeightIncrease,
        },
        {
          datapoint: "unsatSideEffect_colic",
          value: checkboxStomachache,
        },
        {
          datapoint: "unsatSideEffect_humor",
          value: checkboxHumorChanges,
        },
        {
          datapoint: "unsatSideEffect_oth",
          value: checkboxOther,
        }
      ],
    };

    $.ajax({
      type: "POST",
      async: false,
      headers: headers,
      dataType: 'json',
      url: url,
      data: JSON.stringify(payload),
      success: endSurvey,
      error: function(jqXHR, textStatus, errorThrown){
        $('*[id*=question-section]:visible').each(function() {
          $(this).hide();
        });
      
        showWarningSection();
        return;
      }
    });
    updateNextButtonState();
  }

  function showWelcomeSection(){
    firstSection.show();
    lastSection.hide();
    warningSection.hide();
  }

  function showEndingSection(){
    currentStep = 3;
    firstSection.hide();
    warningSection.hide();

    $btnNext.hide();
    $btnSend.hide();
    $btnBack.hide();

    lastSection.show();
  }

  function showWarningSection(){
    currentStep = 3;
    $btnNext.hide();
    $btnSend.hide();
    $btnBack.hide();

    firstSection.hide();
    lastSection.hide();

    
    warningSection.show();
  }

  function endSurvey(){
    if (currentStep < 3) {
      $(".step" + currentStep).removeClass("active");
      $(".section")
        .eq(currentStep - 1)
        .hide();
      currentStep++;
      $(".step" + currentStep).addClass("active");
      $(".section")
        .eq(currentStep - 1)
        .show();
      if (currentStep > 1 && currentStep < 3) {
        //$("#back").show();
      } else {
        $("#back").hide();
      }
    }
  }

  $btnNext.click(function () {
    if (currentStep < 3) {
      $(".step" + currentStep).removeClass("active");
      $(".section")
        .eq(currentStep - 1)
        .hide();
      currentStep++;
      $(".step" + currentStep).addClass("active");
      $(".section")
        .eq(currentStep - 1)
        .show();
      if (currentStep > 1 && currentStep < 3) {
        //$("#back").show();
      } else {
        $("#back").hide();
      }
    }
    updateNextButtonState();
  });

  $btnSend.click(sendSurveyData);

  

  //'Click' event for the "Anterior" button
  $btnBack.click(function () {
    if (currentStep > 1) {
      $(".step" + currentStep).removeClass("active");
      $(".section")
        .eq(currentStep - 1)
        .hide();
      currentStep--;
      $(".step" + currentStep).addClass("active");
      $(".section")
        .eq(currentStep - 1)
        .show();
      if (currentStep === 1) {
        $("#back").hide();
      }
      if (currentStep === 4) {
        $("#back").hide();
      }
    }
    updateNextButtonState();
  });

  $('input[type="radio"][name="step2cks2"]').on("change", function () {
    isEfectosSecundariosSelected = $(
      'input[type="radio"][name="step2cks2"][value="SEF"]'
    ).is(":checked");

    if (isEfectosSecundariosSelected) {
      $('[name="step2an3"]').show();
      $(".wrapper").animate({ scrollTop: $(document).height() }, "slow");
    } else {
      $('[name="step2an3"]')
        .hide()
        .find('input[type="checkbox"]')
        .prop("checked", false);
    }
    updateNextButtonState();
  });

  $('[name="step2an1"] input[type="checkbox"]').on("change", function () {
    isStep2an1Checked =
      $('[name="step2an1"]').find('input[type="checkbox"]:checked').length > 0;
  });

  // Events to update the state of the "Siguiente" button
  $(".section")
    .eq(1)
    .find('input[type="checkbox"], input[type="radio"]')
    .change(updateNextButtonState);
  $("#qnr .opt").click(function () {
    setTimeout(updateNextButtonState, 1);
  });

  // 'change' event for 'step2radio' radio buttons
  $('input[type="radio"][name="step2radio"]').change(function () {
    var value = $(this).attr('id');

    if (value == "Si") {
      $('[name="step2an2"]').hide();
      $('[name="step2an3"]').hide();
      $('[name="step2an2"]').find('input[type="radio"]').prop("checked", false);
      $('[name="step2an3"]')
        .find('input[type="checkbox"]')
        .prop("checked", false);
    } else if (value == "No") {
      $('[name="step2an2"]').show();
      //$("#next").hide();
      $btnSend.hide();
    }
    updateNextButtonState();
  });

  // Initialize "Siguiente" button state on page load
  updateNextButtonState();
});
