# RoboNexus Portal — Test Report

**Date:** July 11, 2026  
**Portal:** [robonexus26.vercel.app](https://robonexus26.vercel.app)  
**Email used:** atharvam682@gmail.com

---

## Registration — Happy Path

| Event | Size | Members | Discord | Reg ID | Notion | Email |
|---|---|---|---|---|---|---|
| Robo War Sr. | 1 | Solo | ✗ | RN-003 | ✅ | ✅ |
| Robo War Sr. | 2 | Duo | ✓ | RN-004 | ✅ | ✅ |
| Robo War Sr. | 3 | Trio | ✓ | RN-005 | ✅ | ✅ |
| Robo War Jr. | 1 | Solo | ✗ | RN-006 | ✅ | ✅ |
| Robo War Jr. | 2 | Duo | ✓ | RN-007 | ✅ | ✅ |
| Robo War Jr. | 3 | Trio | ✓ | RN-008 | ✅ | ✅ |
| Robo Soccer Sr. | 1 | Solo | ✗ | RN-009 | ✅ | ✅ |
| Robo Soccer Sr. | 2 | Duo | ✓ | RN-010 | ✅ | ✅ |
| Robo Soccer Sr. | 3 | Trio | ✓ | RN-011 | ✅ | ✅ |
| Robo Soccer Jr. | 1 | Solo | ✗ | RN-012 | ✅ | ✅ |
| Robo Soccer Jr. | 2 | Duo | ✓ | RN-013 | ✅ | ✅ |
| Robo Soccer Jr. | 3 | Trio | ✓ | RN-014 | ✅ | ✅ |
| Robo Race | 1 | Solo | ✗ | RN-015 | ✅ | ✅ |
| Robo Race | 2 | Duo | ✓ | RN-016 | ✅ | ✅ |
| Line Follower | 1 | Solo | ✗ | RN-017 | ✅ | ✅ |
| Line Follower | 2 | Duo | ✓ | RN-018 | ✅ | ✅ |

---

## Validation

| Input | Expected | Result |
|---|---|---|
| Invalid event name | 400 Invalid event | ✅ |
| Missing team/leader/school | 400 Missing required fields | ✅ |
| Malformed email | 400 Invalid email | ✅ |
| Empty email | 400 Invalid email | ✅ |
| Phone < 10 digits | 400 Phone must be 10 digits | ✅ |
| Phone > 10 digits | 400 Phone must be 10 digits | ✅ |
| Phone with letters | 400 Phone must be 10 digits | ✅ |
| Robo Race size 3 (max 2) | 400 must be between 1 and 2 | ✅ |
| Line Follower size 3 (max 2) | 400 must be between 1 and 2 | ✅ |
| Team size 0 | 400 must be between 1 and 3 | ✅ |
| Empty body | 400 Invalid event | ✅ |

---

## Integrations

| Service | Status |
|---|---|
| Notion (all 6 DBs) | ✅ Synced |
| Confirmation Email | ✅ Sent (16/16) |
| Discord Webhook | ✅ Fired (16/16) |

---

**All 16 registrations passed. All 11 validation cases rejected correctly.**

![alt text](mail.png)

[text](<../../../../Downloads/mailtest/Registration Confirmed — Line Follower.eml>) [text](<../../../../Downloads/mailtest/Registration Confirmed — Robo Race.eml>) [text](<../../../../Downloads/mailtest/Registration Confirmed — Robo Soccer Jr..eml>) [text](<../../../../Downloads/mailtest/Registration Confirmed — Robo Soccer Sr..eml>) [text](<../../../../Downloads/mailtest/Registration Confirmed — Robo War Jr..eml>) [text](<../../../../Downloads/mailtest/Registration Confirmed — Robo War Sr..eml>)