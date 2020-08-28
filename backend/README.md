# Recover Password
**FR - Functional Requirements**
- Any user should be able to recover his password by email.
- The user should receive a email with password recovery instructions.
- The user should be able to reset his password.

**NFR - Non Functional Requirements**
- Use Mailtrap for email sending in Development Environment;
- Use Amazon SES for email sending in Production Environment;
- Email sending should work as background job.

**BR - Business Rules**
- The URL to recovery password should expires in two hours.
- User should confirm the password when reseting the password.

# Profile update
**FR - Functional Requirements**
- User should be able to change all his user information, except character sheet and storyteller status.

**NFR - Non Functional Requirements**

**BR - Business Rules**
- User should not be able to change his email to an email already in use.
- When making changes, the user should enter the old password.

# User / Player Panel
**FR - Functional Requirements**
- Any user should be able to download his character sheet.
- Any user should be able to download OWbN common documents.

**NFR - Non Functional Requirements**
- The character sheet should be downloaded as .PDF file.

**BR - Business Rules**
- An ordinary user should only be able to download his own character sheet.

# Character Sheet download
**FR - Functional Requirements**
- The user should be able to download his own character sheet.

**NFR - Non Functional Requirements**
- The character sheet should be in .PDF file

**BR - Business Rules**
- The storyteller should be able to downwload any character sheet from any user.

# Storyteller Panel
**FR - Functional Requirements**
- The storyteller should be able to create initial user, without password.
- The storyteller should be able to create another storyteller user.
- The storyteller should be able to remove an user.
- The storyteller should be able to promote or demote a user to/from storyteller.
- The storyteller should be able to list all users.
- The storyteller should be able to update any user character sheet.

**NFR - Non Functional Requirements**
- Users list should be saved in cache.
- The character sheet updates should be notified in real time using socket.io.

**BR - Business Rules**
- The storyteller should be able to setup a initial user, with initial user data.
- The storyteller should not setup password for users.
