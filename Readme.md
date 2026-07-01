#RoboTronics

# Robotronics 2026 Registration Form Specification

This document defines all fields required for the Robotronics 2026 registration system.

---

# Events

| Event | Eligible Grades | Team Size |
|---------|----------------|-----------|
| Robo War Sr. | IX–XII | 1–3 Members |
| Robo War Jr. | VI–VIII | 1–3 Members |
| Robo Soccer Sr. | IX–XII | 1–3 Members |
| Robo Soccer Jr. | VI–VIII | 1–3 Members |
| Line Follower | IV–VI | 1–2 Members |
| Robo Race | VI–VIII | 1–2 Members |

---

# Registration Rules

- One registration per team.
- Team Leader submits the registration.
- Team Leader is included in the selected team size.
- Discord ID is optional.

---

# Team Size Rules

## Events allowing up to 3 Members

- Robo War Sr.
- Robo War Jr.
- Robo Soccer Sr.
- Robo Soccer Jr.

Allowed Team Sizes

- 1 Member
- 2 Members
- 3 Members

---

## Events allowing up to 2 Members

- Line Follower
- Robo Race

Allowed Team Sizes

- 1 Member
- 2 Members

---

# Dynamic Behaviour

## Event Selection

Selecting an event automatically determines the available Team Size options.

### Robo War Sr.

Available Team Sizes

- 1 Member
- 2 Members
- 3 Members

### Robo War Jr.

Available Team Sizes

- 1 Member
- 2 Members
- 3 Members

### Robo Soccer Sr.

Available Team Sizes

- 1 Member
- 2 Members
- 3 Members

### Robo Soccer Jr.

Available Team Sizes

- 1 Member
- 2 Members
- 3 Members

### Line Follower

Available Team Sizes

- 1 Member
- 2 Members

### Robo Race

Available Team Sizes

- 1 Member
- 2 Members

---

# Registration Fields

## Event

**Type:** Dropdown

**Required:** Yes

Options

- Robo War Sr.
- Robo War Jr.
- Robo Soccer Sr.
- Robo Soccer Jr.
- Line Follower
- Robo Race

---

## Team Name

**Type:** Text

**Required:** Yes

Validation

- Minimum 3 characters
- Maximum 50 characters

---

## Team Leader Full Name

**Type:** Text

**Required:** Yes

Validation

- Minimum 2 characters
- Maximum 100 characters

---

## School Name

**Type:** Text

**Required:** Yes

---

## Grade

**Type:** Dropdown

**Required:** Yes

Options

- IV
- V
- VI
- VII
- VIII
- IX
- X
- XI
- XII

---

## Section

**Type:** Text

**Required:** No

---

## School Email

**Type:** Email

**Required:** No

---

## Personal Email

**Type:** Email

**Required:** Yes

---

## Phone Number

**Type:** Telephone

**Required:** Yes

Validation

- Exactly 10 digits

---

## Discord ID

**Type:** Text

**Required:** No

---

## Team Size

**Type:** Dropdown

**Required:** Yes

Dynamic based on selected event.

---

# Member Details

## Member 2 Full Name

**Required:** Only if Team Size = 2 or 3

---

## Member 2 Grade

**Required:** Only if Team Size = 2 or 3

---

## Member 2 Section

**Required:** No

---

## Member 2 School Email

**Required:** No

---

## Member 3 Full Name

**Required:** Only if Team Size = 3

---

## Member 3 Grade

**Required:** Only if Team Size = 3

---

## Member 3 Section

**Required:** No

---

## Member 3 School Email

**Required:** No

---

# Dynamic Validation

## Team Size = 1

Visible

- Team Leader Details

Hidden

- Member 2
- Member 3

---

## Team Size = 2

Visible

- Team Leader
- Member 2

Hidden

- Member 3

---

## Team Size = 3

Visible

- Team Leader
- Member 2
- Member 3

---

# Event Restrictions

| Event | Allowed Team Sizes |
|--------|--------------------|
| Robo War Sr. | 1, 2, 3 |
| Robo War Jr. | 1, 2, 3 |
| Robo Soccer Sr. | 1, 2, 3 |
| Robo Soccer Jr. | 1, 2, 3 |
| Line Follower | 1, 2 |
| Robo Race | 1, 2 |

---

# Submission Flow

1. Select Event
2. Enter Team Details
3. Enter Team Leader Details
4. Select Team Size
5. Enter Additional Member Details (if applicable)
6. Submit

---

# Data Sent to Backend

```json
{
  "event": "",
  "teamName": "",
  "teamSize": "",
  "leader": {
    "name": "",
    "grade": "",
    "section": "",
    "school": "",
    "email": "",
    "phone": "",
    "discord": ""
  },
  "member2": {
    "name": "",
    "grade": "",
    "section": "",
    "schoolEmail": ""
  },
  "member3": {
    "name": "",
    "grade": "",
    "section": "",
    "schoolEmail": ""
  }
}
```

---

# Required Fields Summary

- Event
- Team Name
- Team Leader Full Name
- School Name
- Grade
- Personal Email
- Phone Number
- Team Size
- Member 2 Full Name (if Team Size ≥ 2)
- Member 2 Grade (if Team Size ≥ 2)
- Member 3 Full Name (if Team Size = 3)
- Member 3 Grade (if Team Size = 3)

---

# Optional Fields Summary

- Section
- School Email
- Discord ID
- Member 2 Section
- Member 2 School Email
- Member 3 Section
- Member 3 School Email
