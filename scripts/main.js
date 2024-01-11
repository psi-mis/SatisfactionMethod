$(document).ready(function () {
  var currentStep = 1;
  var $btnNext = $("#next");
  var $btnBack = $("#back");
  var $btnSend = $("#send");
  var isEfectosSecundariosSelected;

  // Hide the "Siguiente" button at startup
  $btnNext.hide();
  $btnBack.hide();
  $btnSend.hide();

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
    
    const url = 'http://localhost:3008/live-agents/registerClient'
    const payload = {
      action: "survey_record",
      token: 'asd',//getUrlQueryParams().token,
      surveyDatetime: new Date().toISOString(),
      datavalues: [
        {
          datapoint: "rlDf5xEAR9I",
          value: actualContraceptiveMethod ,
        },
        {
          datapoint: "eAFhopWJO3i",
          value: areYouHappyWithYourMethod,
        },
        {
          datapoint: "hV8zKz6qvoO",
          value: mainUnhappynessReason ?? '',
        },
        {
          datapoint: "lzVxmiJR595",
          value: checkboxPeriodChanges,
        },
        {
          datapoint: "WwOwtRA0xpK",
          value: checkboxHeadache,
        },
        {
          datapoint: "vAY2zgAJbsU",
          value: checkboxWeightIncrease,
        },
        {
          datapoint: "mQCvkW5oSsN",
          value: checkboxStomachache,
        },
        {
          datapoint: "FoynoeEDLja",
          value: checkboxHumorChanges,
        },
        {
          datapoint: "IHIzAhD7JhS",
          value: checkboxOther,
        }
      ],
    };

    $.ajax({
      type: "POST",
      url: url,
      data: payload,
      success: endSurvey,
      error: function(jqXHR, textStatus, errorThrown){
        alert('Hubo un problema al enviar la encuesta.');
      }
    })
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
      'input[type="radio"][name="step2cks2"][value="efectsec"]'
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
