function createRobotronicsForm() {
  const form = FormApp.create("Robotronics Registration");

  form.setDescription(
    "Register your team for Robotronics 2026. One submission per team."
  );

  // =========================
  // TEAM DETAILS
  // =========================

  form.addListItem()
    .setTitle("Event")
    .setChoiceValues([
      "Robo War Sr. (Grades IX–XII, 1–3 members)",
      "Robo War Jr. (Grades VI–VIII, 1–3 members)",
      "Robo Soccer Sr. (Grades IX–XII, 1–3 members)",
      "Robo Soccer Jr. (Grades VI–VIII, 1–3 members)",
      "Line Follower (Grades IV–VI, 1–2 members)",
      "Robo Race (Grades VI–VIII, 1–2 members)"
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("Team Name")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Leader Name")
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

  // =========================
  // TEAM SIZE
  // =========================

  form.addMultipleChoiceItem()
    .setTitle("Team Size")
    .setChoiceValues([
      "1 member",
      "2 members",
      "3 members"
    ])
    .setRequired(true);

  // =========================
  // MEMBERS
  // =========================

  form.addTextItem()
    .setTitle("Member 2 Full Name");

  form.addTextItem()
    .setTitle("Member 3 Full Name");

  Logger.log("==================================");
  Logger.log("EDIT:");
  Logger.log(form.getEditUrl());
  Logger.log("");
  Logger.log("LIVE:");
  Logger.log(form.getPublishedUrl());
  Logger.log("==================================");
}
