function createRobotronicsForm() {
  const form = FormApp.create("Robotronics Registration");

  form.setDescription(
    "Register your team for Robotronics 2026. One submission per team."
  );

  // =====================================================
  // SECTION 1
  // =====================================================

  const eventItem = form.addListItem()
    .setTitle("Event")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Team Name")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Leader Name")
    .setHelpText("Team captain /primary registrant.")
    .setRequired(true);

  form.addTextItem()
    .setTitle("School")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Email")
    .setValidation(
      FormApp.createTextValidation()
        .requireTextIsEmail()
        .build()
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle("Phone")
    .setValidation(
      FormApp.createTextValidation()
        .requireTextMatchesPattern("^\\d{10}$")
        .build()
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle("Discord ID");

  // =====================================================
  // PAGE BREAKS
  // =====================================================

  const sectionTeamSize3 = form.addPageBreakItem()
    .setTitle("Team Size (3-Member Events)");

  const sectionTeamSize2 = form.addPageBreakItem()
    .setTitle("Team Size (2-Member Events)");

  const sectionMembers = form.addPageBreakItem()
    .setTitle("Additional Team Members");

  // =====================================================
  // TEAM SIZE QUESTIONS
  // =====================================================

  const teamSize3 = form.addMultipleChoiceItem()
    .setTitle("Team Size")
    .setRequired(true);

  const teamSize2 = form.addMultipleChoiceItem()
    .setTitle("Team Size (2 Member Events)")
    .setRequired(true);

  // =====================================================
  // MEMBER QUESTIONS (ONLY ONCE)
  // =====================================================

  form.addTextItem()
    .setTitle("Member 2 Full Name");

  form.addTextItem()
    .setTitle("Member 3 Full Name");

  // =====================================================
  // EVENT BRANCHING
  // =====================================================

  eventItem.setChoices([
    eventItem.createChoice(
      "Robo War Sr. (Grades IX–XII, 1–3 members)",
      sectionTeamSize3
    ),
    eventItem.createChoice(
      "Robo War Jr. (Grades VI–VIII, 1–3 members)",
      sectionTeamSize3
    ),
    eventItem.createChoice(
      "Robo Soccer Sr. (Grades IX–XII, 1–3 members)",
      sectionTeamSize3
    ),
    eventItem.createChoice(
      "Robo Soccer Jr. (Grades VI–VIII, 1–3 members)",
      sectionTeamSize3
    ),
    eventItem.createChoice(
      "Line Follower (Grades IV–VI, 1–2 members)",
      sectionTeamSize2
    ),
    eventItem.createChoice(
      "Robo Race (Grades VI–VIII, 1–2 members)",
      sectionTeamSize2
    )
  ]);

  // =====================================================
  // TEAM SIZE (3 MEMBER EVENTS)
  // =====================================================

  teamSize3.setChoices([
    teamSize3.createChoice(
      "1 member",
      FormApp.PageNavigationType.SUBMIT
    ),
    teamSize3.createChoice(
      "2 members",
      sectionMembers
    ),
    teamSize3.createChoice(
      "3 members",
      sectionMembers
    )
  ]);

  // =====================================================
  // TEAM SIZE (2 MEMBER EVENTS)
  // =====================================================

  teamSize2.setChoices([
    teamSize2.createChoice(
      "1 member",
      FormApp.PageNavigationType.SUBMIT
    ),
    teamSize2.createChoice(
      "2 members",
      sectionMembers
    )
  ]);

  sectionMembers.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  Logger.log("==================================");
  Logger.log(form.getEditUrl());
  Logger.log(form.getPublishedUrl());
  Logger.log("==================================");
}
